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
import lodash from 'lodash'
import { describe, it, expect, vi, beforeEach, MockInstance } from 'vitest'

import type { IParsedRule } from '@/interfaces/schemas/rule.schema.ts'
import { EGeminiTaskType } from '@/services/embedding/google/types.ts'
import { IndexingPipelineService } from '@/services/indexing-pipeline-service.ts'
import * as moduleSanitizeMetadata from '@/utils/databases/pinecone/sanitize-metadata.ts'
import { validateNonEmptyArray } from '@/utils/type-guards.ts'
import { googleEmbeddingServiceMockFactory } from '@test/__mocks__/services/embedding/google/embedding-service.ts'
import { pineconeServiceMockFactory } from '@test/__mocks__/services/pinecone-service.ts'
import testRule001 from '@test/utils/fixtures/parsed-rules/CORE_RULE_001.ts'
import testRule002 from '@test/utils/fixtures/parsed-rules/TS_RULE_001.ts'
import testRuleNestedObject001 from '@test/utils/fixtures/parsed-rules/TS_RULE_NESTED_OBJECT_001.ts'

// ==== Mocks ====
vi.mock('@/services/embedding/google/embedding-service.ts', async() => {
    const { mockGoogleEmbeddingServiceModule } = await import(
        '@test/__mocks__/services/embedding/google/embedding-service.ts'
    )
    return mockGoogleEmbeddingServiceModule()
})

vi.mock('@/services/pinecone-service.ts', async() => {
    const { mockPineconeServiceModule } = await import('@test/__mocks__/services/pinecone-service.ts')
    return mockPineconeServiceModule()
})

// ==== Tests ====
describe('IndexingPipelineService() - Unit Tests', () => {
    let service: IndexingPipelineService

    const {
        mockGenerateEmbeddingsFn
    } = googleEmbeddingServiceMockFactory

    const {
        mockUpsertVectorsFn
    } = pineconeServiceMockFactory

    const mockEmbeddings = [
        [0.1, 0.2, 0.3, 0.4, 0.5],
        [0.6, 0.7, 0.8, 0.9, 1.0]
    ]

    const testRules: IParsedRule[] = [
        testRule001,
        testRule002,
        testRuleNestedObject001
    ]

    const testMetadata1 = testRule001.metadata

    const testIndexName = 'test-index'
    const testNamespace = 'test-namespace'
    const testBatchSize = 2

    beforeEach(() => {
        // Create service instance with mock dependencies
        service = new IndexingPipelineService(
            googleEmbeddingServiceMockFactory.mockGoogleEmbeddingServiceInstance,
            pineconeServiceMockFactory.mockPineconeServiceInstance
        )
    })

    describe('Constructor', () => {
        it('sollte korrekt mit GoogleEmbeddingService und PineconeService Dependencies initialisieren', () => {
            expect(service['_embeddingService']).toBe(
                googleEmbeddingServiceMockFactory.mockGoogleEmbeddingServiceInstance
            )
            expect(service['_pineconeService']).toBe(pineconeServiceMockFactory.mockPineconeServiceInstance)
        })
    })


    describe('_createPineconeRecordForRule()', () => {
        describe('✅ Positive Tests', () => {
            let spyOnSanitizeMetadata: MockInstance

            beforeEach(() => {
                mockGenerateEmbeddingsFn.mockResolvedValueOnce(mockEmbeddings)
                spyOnSanitizeMetadata = vi.spyOn(moduleSanitizeMetadata, 'sanitizeMetadata')
            })

            it('sollte PineconeRecord mit korrekten Embeddings und Metadata erstellen', async() => {
                const result = await service['_createPineconeRecordForRule'](testRule001)

                expect(mockGenerateEmbeddingsFn).toHaveBeenCalledExactlyOnceWith(
                    [`${testRule001.metadata.title}\n${testRule001.content}`],
                    {
                        taskType: EGeminiTaskType.retrievalDocument,
                        title: testRule001.metadata.title
                    }
                )

                expect(spyOnSanitizeMetadata).toHaveBeenCalledWith(testMetadata1)

                expect(result).toEqual({
                    id: testRule001.id,
                    values: mockEmbeddings[0],
                    metadata: testMetadata1
                })
            })
        })
    })

    describe('runRuleIndexing()', () => {
        let chunkSpy: MockInstance
        let spyOnCreatePineconeRecordForRule: MockInstance

        beforeEach(() => {
            // Create spy for chunk function
            chunkSpy = vi.spyOn(lodash, 'chunk')

            // Mock embedding responses
            mockGenerateEmbeddingsFn
                .mockResolvedValueOnce([mockEmbeddings[0]])
                .mockResolvedValueOnce([mockEmbeddings[1]])

            mockUpsertVectorsFn.mockResolvedValue(undefined)

            spyOnCreatePineconeRecordForRule = vi.spyOn(
                service, '_createPineconeRecordForRule' as keyof IndexingPipelineService
            )
        })

        describe('✅ Positive Tests', () => {
            it('sollte Rules erfolgreich in Batches verarbeiten und indexieren', async() => {
                const validatedTestRules = validateNonEmptyArray(testRules)

                await service.runRuleIndexing(
                    validatedTestRules,
                    testIndexName,
                    testNamespace,
                    testBatchSize
                )

                // Verify chunking was used
                expect(chunkSpy).toHaveBeenCalledWith(testRules, testBatchSize)

                // Verify embeddings were generated for each rule
                expect(spyOnCreatePineconeRecordForRule).toHaveBeenCalledTimes(testRules.length)
                expect(spyOnCreatePineconeRecordForRule).toHaveBeenCalledWith(testRules[0])

                // Verify upsert was called
                expect(mockUpsertVectorsFn).toHaveBeenCalledWith(
                    testIndexName,
                    expect.arrayContaining([
                        expect.objectContaining({
                            id: testRules[0].id,
                            values: mockEmbeddings[0]
                        }),
                        expect.objectContaining({
                            id: testRules[1].id,
                            values: mockEmbeddings[1]
                        })
                    ]),
                    testNamespace
                )
            })

            it('sollte mit default batchSize von 100 arbeiten wenn nicht angegeben', async() => {
                const validatedTestRules = validateNonEmptyArray(testRules)

                await service.runRuleIndexing(
                    validatedTestRules,
                    testIndexName,
                    testNamespace
                )

                // Default batch size should be 100
                expect(chunkSpy).toHaveBeenCalledWith(testRules, 100)
            })

            it('sollte mehrere Batches korrekt verarbeiten bei großen Datensätzen', async() => {
                const batchSize = 1
                const validatedTestRules = validateNonEmptyArray(testRules)

                await service.runRuleIndexing(
                    validatedTestRules,
                    testIndexName,
                    testNamespace,
                    batchSize
                )

                expect(chunkSpy).toHaveBeenCalledWith(testRules, batchSize)
                expect(spyOnCreatePineconeRecordForRule).toHaveBeenCalledTimes(testRules.length)
                expect(mockUpsertVectorsFn).toHaveBeenCalledTimes(3)
            })
        })
    })
}) 