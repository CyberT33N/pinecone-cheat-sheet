/*
███████████████████████████████████████████████████████████████████████████████
██******************** PRESENTED BY t33n Software ***************************██
██                                                                           ██
██                  ████████╗██████╗ ██████╗ ███╗   ██╗                      ██
██                  ╚══██╔══╝╚════██╗╚════██╗████╗  ██║                      ██
██                     ██║    █████╔╝ █████╔╝██╔██╗ ██║                      ██
██                     ██║    ╚═══██╗ ╚═══██╗██║╚██╗██║                      ██
██                     ██║   ██████╔╝██████╔╝██║ ╚████║                      ██
██                     ╚═╝   ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝                      ██
██                                                                           ██
███████████████████████████████████████████████████████████████████████████████
███████████████████████████████████████████████████████████████████████████████
*/

// ==== Imports ====
import { type PineconeRecord } from '@pinecone-database/pinecone'
import { chunk } from 'lodash'
import { type IParsedRule } from '@/interfaces/schemas/rule.schema.ts'
import { sanitizeMetadata } from '@/utils/databases/pinecone/sanitize-metadata.ts'
import { logger } from '@/utils/logger.ts'
import { validateNonEmptyArray } from '@/utils/type-guards.ts'
import type { NonEmptyArrayReadOnly } from '@/utils/types.ts'
import { type GoogleEmbeddingService } from './embedding/google/embedding-service.ts'
import { EGeminiTaskType } from './embedding/google/types.ts'
import { type PineconeService } from './pinecone-service.ts'

/**
 * @class IndexingPipelineService
 * @description Service for running the indexing pipeline.
 */
export class IndexingPipelineService {
    private readonly _embeddingService: Readonly<GoogleEmbeddingService>
    private readonly _pineconeService: Readonly<PineconeService>

    /**
     * @constructor
     * @param embeddingService - The embedding service to use.
     * @param pineconeService - The Pinecone service to use.
     */
    public constructor(
        embeddingService: Readonly<GoogleEmbeddingService>,
        pineconeService: Readonly<PineconeService>
    ) {
        this._embeddingService = embeddingService
        this._pineconeService = pineconeService
    }

    /**
     * Runs the rule indexing pipeline.
     * @param parsedRuleData - The parsed rule data to index.
     * @param indexName - The name of the Pinecone index to use.
     * @param namespace - The namespace of the Pinecone index to use.
     * @param batchSize - The size of the batch to process.
     */
    public async runRuleIndexing(
        parsedRuleData: NonEmptyArrayReadOnly<IParsedRule>,
        indexName: string,
        namespace: string,
        batchSize = 100
    ): Promise<void> {
        const LOG_PREFIX = `[IndexingPipelineService::runRuleIndexing(index=${indexName}, ns=${namespace})]`

        logger.info(
            `${LOG_PREFIX} Starting rule indexing for ${String(parsedRuleData.length)} rules.`
        )

        let processedBatches = 0
        const totalBatches = Math.ceil(parsedRuleData.length / batchSize)
        logger.info(`${LOG_PREFIX} Total batches: ${String(totalBatches)}.`)

        // Process rules in chunks to avoid overwhelming memory and API limits
        for (const rulesBatch of chunk(parsedRuleData, batchSize)) {
            const recordsToUpsert: PineconeRecord[] = []
            processedBatches++

            logger.info(
                `${LOG_PREFIX} Processing embedding batch ` +
                `${String(processedBatches)}/${String(totalBatches)} (${String(rulesBatch.length)} rules).`
            )

            /**
             * **Architecture Decision**: Uses Promise.all with fail-fast behavior because
             * any failure in embedding generation or metadata sanitization indicates an
             * architectural problem that must be fixed immediately, not logged and ignored.
             */
            const batchRecords = await Promise.all(
                rulesBatch.map(async rule => this._createPineconeRecordForRule(rule))
            )

            recordsToUpsert.push(...batchRecords)

            logger.info(
                `${LOG_PREFIX} Embedding batch ` +
                    `${String(processedBatches)}/${String(totalBatches)} completed successfully.`
            )

            const validatedRecordsToUpsert = validateNonEmptyArray(recordsToUpsert)
            
            await this._pineconeService.upsertVectors(
                indexName,
                validatedRecordsToUpsert,
                namespace
            )
        }
    }

    /**
     * Creates a Pinecone record for a rule.
     *
     * **Architectural Decision on `embeddings[0]`**:
     * This function uses `embeddings[0]` because the `_embeddingService.generateEmbeddings`
     * method is designed to process a batch of texts and returns an array of embeddings,
     * with each embedding corresponding to a text in the input array.
     *
     * In this specific case, we are creating a record for a single rule, so we pass an
     * array containing just one text element (`[textToEmbed]`). Consequently, the returned
     * `embeddings` array will also contain exactly one element. By accessing `embeddings[0]`,
     * we are correctly extracting that single embedding.
     *
     * The `values` property of a `PineconeRecord` expects a single vector (an array of numbers),
     * not an array of vectors. Therefore, assigning `embeddings[0]` is the architecturally
     * correct approach to associate one rule with its corresponding single vector representation.
     *
     * @param rule - The rule to create a Pinecone record for.
     * @returns The Pinecone record.
     */
    private async _createPineconeRecordForRule(
        rule: IParsedRule
    ): Promise<PineconeRecord> {
        const textToEmbed = `${rule.metadata.title}\n${rule.content}`

        const embeddings = await this._embeddingService.generateEmbeddings(
            [textToEmbed],
            {
                taskType: EGeminiTaskType.retrievalDocument,
                title: rule.metadata.title
            }
        )
        
        logger.info(`[IndexingPipelineService] Prepared embedding for rule: ${rule.id}`)

        const record: PineconeRecord = {
            id: rule.id,
            values: embeddings[0],
            metadata: sanitizeMetadata(rule.metadata)
        }
        
        return record
    }
} 
