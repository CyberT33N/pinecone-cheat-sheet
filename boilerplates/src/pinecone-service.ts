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
import {
    Pinecone,
    Index,
    type PineconeRecord,
    type QueryResponse,
    type PineconeConfiguration,
    type IndexModel,
    type IndexStatsDescription,
    type CreateIndexOptions,
    QueryOptions,
    type DeleteManyOptions
} from '@pinecone-database/pinecone'

import { BaseError, ResourceNotFoundError } from 'error-manager-helper'
import { chunk } from 'lodash'
import type { ReadonlyDeep, WritableDeep } from 'type-fest'
import { logger } from '@/utils/logger.ts'
import type { NonEmptyArrayReadOnly } from '@/utils/types.ts'

/**
 * @class PineconeService
 * @description Service for interacting with Pinecone, a vector database.
 */
export class PineconeService {
    protected readonly pinecone: Pinecone
    private readonly _indicesCache = new Map<string, Index>()

    /**
     * @constructor - Creates a new PineconeService instance.
     * @param pineconeConfig - The Pinecone configuration options (including API key).
     */
    public constructor(
        pineconeConfig: ReadonlyDeep<PineconeConfiguration>
    ) {
        this.pinecone = new Pinecone(pineconeConfig)
    }

    /**
     * @method checkIfIndexExists
     * @description Checks if an index (database) exists in Pinecone using describeIndex.
     * This is more efficient than listIndexes() as it targets a specific index.
     * @param indexName - The name of the index to check.
     * @returns The index model if it exists, null otherwise.
     */
    public async checkIfIndexExists(indexName: Readonly<string>): Promise<IndexModel | null> {
        const CTX = `[PineconeService::checkIfIndexExists(indexName=${indexName})]`
        
        try {
            logger.info(`${CTX} Checking if index exists...`)
            const description = await this.pinecone.describeIndex(indexName)
            logger.info(`${CTX} Index '${description.name}' found. Host: '${description.host}'.`)
            return description
        } catch(error) {
            if (error instanceof Error && error.name === 'PineconeNotFoundError') {
                logger.info(`${CTX} Index '${indexName}' not found.`)
                return null
            }
            
            throw new BaseError(`${CTX} Error checking if index exists.`, error as Error)
        }
    }

    /**
     * @method getOrCreateIndex
     * @description Gets or creates an index (database) in Pinecone.
     * @param options - The parameters for the index creation.
     * @returns The index object.
     */
    public async getOrCreateIndex(options: ReadonlyDeep<CreateIndexOptions>): Promise<Index> {
        const CTX = `[PineconeService::getOrCreateIndex(indexName=${options.name})]`
        
        const existingIndex = await this.checkIfIndexExists(options.name)
        
        if (existingIndex) {
            logger.info(`${CTX} Index '${existingIndex.name}' already exists. 
                Using host: '${existingIndex.host}'.`)
            return this.pinecone.index(options.name, existingIndex.host)
        } else {
            logger.info(`${CTX} Index '${options.name}' does not exist. Creating new index.`)
            return this._createIndexAndWait(options)
        }
    }

    /**
     * @description Upserts vectors into the index.
     * @param indexName - The name of the index to upsert vectors into.
     * @param vectors - The vectors to upsert.
     * @param namespace - The namespace to upsert vectors into.
     */
    public async upsertVectors(
        indexName: Readonly<string>,
        vectors: ReadonlyDeep<NonEmptyArrayReadOnly<PineconeRecord>>,
        namespace: Readonly<string>
    ): Promise<void> {
        const BATCH_SIZE = 100 // Pinecone recommends batches of 100 or fewer, or up to 2MB
        const LOG_PREFIX = `[PineconeService::upsertVectors(index=${indexName}, ns=${namespace})]` 

        logger.info(`${LOG_PREFIX} Getting index instance...`)
        const index = await this.getIndex(indexName)

        try {
            let batchCounter = 0
            const totalBatches = Math.ceil(vectors.length / BATCH_SIZE)

            for (const batch of chunk(vectors, BATCH_SIZE)) {
                batchCounter++

                logger.info(
                    `${LOG_PREFIX} Upserting batch 
                    ${String(batchCounter)}/${String(totalBatches)} size: ${String(batch.length)}.`
                )

                const ns = index.namespace(namespace)
                // Convert readonly batch to writable for external API compatibility
                const writableBatch = batch as WritableDeep<typeof batch>
                await ns.upsert(writableBatch) 

                logger.info(
                    `${LOG_PREFIX} Batch ${String(batchCounter)}/${String(totalBatches)} upserted.`
                )
            }

            logger.info(`${LOG_PREFIX} All ${String(batchCounter)} batches successfully upserted.`)
        } catch (error) {
            const CONTEXT_MESSAGE = `${LOG_PREFIX} Error upserting vectors.`
            throw new BaseError(CONTEXT_MESSAGE, error as Error)
        }
    }

    /**
     * @description Queries vectors from the index.
     * @param indexName - The name of the index to query vectors from.
     * @param options - The query options including vector, topK, namespace, and filter.
     * @param namespace - The namespace to query vectors from.
     * @returns The query response.
     */
    public async queryVectors(
        indexName: Readonly<string>,
        options: ReadonlyDeep<QueryOptions>,
        namespace: Readonly<string>
    ): Promise<QueryResponse> {
        const k = String(options.topK)
        const Q_VEC_CONTEXT = `[PineconeService::queryVectors(index=${indexName}, ns=${namespace}, k=${k})]`

        logger.info(`${Q_VEC_CONTEXT} Getting index instance...`)
        const index = await this.getIndex(indexName)

        try {
            logger.info(`${Q_VEC_CONTEXT} Querying vectors.`)

            const ns = index.namespace(namespace)
            const queryResponse = await ns.query(options as WritableDeep<typeof options>)

            logger.info(`${Q_VEC_CONTEXT} Query successful.`)
            return queryResponse
        } catch (error) {
            const CONTEXT_MESSAGE = `${Q_VEC_CONTEXT} Error querying vectors.`
            throw new BaseError(CONTEXT_MESSAGE, error as Error)
        }
    }

    /**
     * @method deleteVectors
     * @description Deletes vectors from the index.
     * @param indexName - The name of the index to delete vectors from.
     * @param options - The options for deleting vectors (either Array<string> for IDs or object for filter).
     * @param namespace - The namespace to delete vectors from.
     */
    public async deleteVectors(
        indexName: Readonly<string>,
        options: ReadonlyDeep<DeleteManyOptions>,
        namespace: Readonly<string>
    ): Promise<void> {
        const DEL_VEC_CONTEXT = `[PineconeService::deleteVectors(index=${indexName}, ns=${namespace})]`

        logger.info(`${DEL_VEC_CONTEXT} Getting index instance...`)
        const index = await this.getIndex(indexName)

        try {
            logger.info(`${DEL_VEC_CONTEXT} Deleting vectors.`)
            const ns = index.namespace(namespace)
            
            // Convert readonly options to writable for external API compatibility
            const writableOptions = options as WritableDeep<typeof options>
            await ns.deleteMany(writableOptions)
            logger.info(`${DEL_VEC_CONTEXT} Vectors deleted.`)
        } catch (error) {
            const CONTEXT_MESSAGE = `${DEL_VEC_CONTEXT} Error deleting vectors.`
            throw new BaseError(CONTEXT_MESSAGE, error as Error)
        }
    }

    /**
     * @method describeIndexStats
     * @description Describes the index stats.
     * @param indexName - The name of the index to describe.
     * @returns The index stats.
     */
    public async describeIndexStats(
        indexName: Readonly<string>
    ): Promise<IndexStatsDescription> {
        const DESC_STATS_CONTEXT = `[PineconeService::describeIndexStats(index=${indexName})]`

        logger.info(`${DESC_STATS_CONTEXT} Getting index instance...`)
        const index = await this.getIndex(indexName)

        try {
            logger.info(`${DESC_STATS_CONTEXT} Describing index stats.`)
            const stats = await index.describeIndexStats()
            logger.info(`${DESC_STATS_CONTEXT} Index stats: ${JSON.stringify(stats)}`)
            return stats
        } catch (error) {
            const CONTEXT_MESSAGE = `${DESC_STATS_CONTEXT} Error describing index stats.`
            throw new BaseError(CONTEXT_MESSAGE, error as Error)
        }
    }

    /**
     * @method getIndex
     * @description Gets a cached Index instance or creates a new one if not in cache.
     * This method eliminates repeated describeIndex API calls for the same index.
     * @param indexName - The name of the index.
     * @returns The cached or newly created Index instance.
     * @throws {ResourceNotFoundError} If index doesn't exist.
     * @throws {BaseError} For other errors.
     */
    protected async getIndex(indexName: Readonly<string>): Promise<Index> {
        const CTX = `[PineconeService::getIndex(indexName=${indexName})]`
        
        // Cache Hit: Return existing instance immediately
        if (this._indicesCache.has(indexName)) {
            logger.info(`${CTX} Cache hit - returning cached index instance.`)
            const cachedIndex = this._indicesCache.get(indexName)
            if (cachedIndex) {
                return cachedIndex
            }
        }
        
        // Cache Miss: Create new instance and cache it
        logger.info(`${CTX} Cache miss - creating new index instance.`)
        
        // First check if index exists to avoid unnecessary API calls
        logger.info(`${CTX} Checking if index exists...`)
        const existingIndex = await this.checkIfIndexExists(indexName)
        
        if (!existingIndex) {
            const errorMessage = `${CTX} Index '${indexName}' does not exist.`
            throw new ResourceNotFoundError(errorMessage, { indexName })
        }
        
        try {
            logger.info(
                `${CTX} Index '${existingIndex.name}' found. Creating instance with host: '${existingIndex.host}'.`
            )
            const index = this.pinecone.index(indexName, existingIndex.host)
            
            // Store in cache for future use
            this._indicesCache.set(indexName, index)
            logger.info(`${CTX} Index instance cached for future use.`)
            
            return index
        } catch (error) {
            const CONTEXT_MESSAGE = `${CTX} Error creating index instance.`
            throw new BaseError(CONTEXT_MESSAGE, error as Error)
        }
    }

    /**
     * @description Creates a new Pinecone index and waits for it to become ready.
     * @param options - Parameters for index creation.
     * @returns A promise resolving to the Pinecone Index object.
     * @throws {BaseError} For unexpected errors during creation.
     */
    private async _createIndexAndWait(
        options: ReadonlyDeep<CreateIndexOptions>
    ): Promise<Index> {
        const CTX = `[PineconeService::_createIndexAndWait(name=${options.name})]`
        logger.info(`${CTX} Creating index '${options.name}'...`)

        try {
            const cfg: CreateIndexOptions = {
                /** This option tells the client not to resolve the returned promise 
                 * until the index is ready to receive data. */
                waitUntilReady: true,
                /** This option tells the client not to throw if you attempt to create an 
                 * index that already exists. */
                suppressConflicts: true,
                ...options as WritableDeep<typeof options>
            }

            await this.pinecone.createIndex(cfg)
            logger.info(`${CTX} Index '${options.name}' created/ready.`)
            
            // Retrieve the index details to get the host
            const { host } = await this.pinecone.describeIndex(options.name)
            logger.info(`${CTX} Retrieved host for index '${options.name}': ${host}`)
            
            const index = this.pinecone.index(options.name, host)
            return index
        } catch (error) {
            const CONTEXT_MESSAGE = `${CTX} Error creating index.`
            throw new BaseError(CONTEXT_MESSAGE, error as Error)
        }
    }
}