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
    Index,
    type PineconeRecord,
    type QueryResponse,
    type IndexStatsDescription,
    type PineconeConfiguration,
    type DeleteManyOptions,
    QueryOptions,
    CreateIndexOptions
} from '@pinecone-database/pinecone'
import { BaseError, IBaseError, IResourceNotFoundError, ResourceNotFoundError } from 'error-manager-helper'
import lodash from 'lodash'
import type { WritableDeep, ReadonlyDeep } from 'type-fest'
import { 
    describe, it, expect, vi, beforeEach, 
    MockInstance 
} from 'vitest'
import env from '@/env.js'
import { PineconeService } from '@/services/pinecone-service.ts'
import { validateNonEmptyArray } from '@/utils/type-guards.ts'
import { pineconeMockFactory } from '@test/__mocks__/@pinecone-database/pinecone.js'
import {
    TEST_DATA,
    createStandardPineconeService,
    createTestIndexOptions,
    createTestRecords,
    mockIndexModel
} from '@test/common/src/services/pinecone-service-helpers.ts'
import { normalizeError } from '@/utils/error-helpers.ts'

// ==== Mocks ====
vi.mock('@pinecone-database/pinecone', async() => {
    const { mockPineconeModule } = await import('@test/__mocks__/@pinecone-database/pinecone.ts')
    return mockPineconeModule()
})

// ==== Tests ====
describe('PineconeService() - Unit Tests', () => {
    let service: PineconeService
    let mockIndexInstance: Index
    let chunkSpy: MockInstance
    
    const {
        mockNamespaceFn,
        mockDescribeIndexStatsFn,
        mockUpsertFn,
        mockQueryFn,
        mockDeleteManyFn,
        mockDescribeIndexFn,
        mockCreateIndexFn,
        mockIndexFn
    } = pineconeMockFactory

    const namespace = env.PINECONE_RULES_NAMESPACE
    const apiKey = env.PINECONE_API_KEY

    beforeEach(() => {
        // Get references to mock instances and functions
        mockIndexInstance = pineconeMockFactory.mockIndexInstance
        
        // Create spy for chunk function - only spy, no mocking or overriding
        chunkSpy = vi.spyOn(lodash, 'chunk')
        
        // Create service AFTER mocks are properly set up
        service = createStandardPineconeService()
    })

    describe('Constructor', () => {
        it('sollte korrekt mit PineconeConfiguration initialisieren', () => {
            const testConfig: PineconeConfiguration = { apiKey }
            const testService = new PineconeService(testConfig)
            
            expect(pineconeMockFactory.mockPinecone).toBeDefined()
            expect(pineconeMockFactory.mockPinecone?.Pinecone).toHaveBeenCalledWith(testConfig)
            expect(testService['pinecone']).toBeDefined()
        })
    })

    describe('checkIfIndexExists()', () => {
        describe('✅ Positive Tests', () => {
            it('sollte Index-Model zurückgeben, wenn Index existiert', async() => {
                mockDescribeIndexFn.mockResolvedValueOnce(mockIndexModel)
                
                const result = await service.checkIfIndexExists(TEST_DATA.indexName)

                expect(mockDescribeIndexFn).toHaveBeenCalledExactlyOnceWith(TEST_DATA.indexName)
                expect(result).toEqual(mockIndexModel)
            })

            it('sollte null zurückgeben, wenn PineconeNotFoundError geworfen wird', async() => {
                const notFoundError = new Error('Index not found')
                notFoundError.name = 'PineconeNotFoundError'
                mockDescribeIndexFn.mockRejectedValueOnce(notFoundError)
                
                const result = await service.checkIfIndexExists(TEST_DATA.indexName)

                expect(mockDescribeIndexFn).toHaveBeenCalledExactlyOnceWith(TEST_DATA.indexName)
                expect(result).toBeNull()
            })
        })

        describe('❌ Negative Tests', () => {
            it('sollte BaseError mit korrektem Kontext-Message werfen für Nicht-NotFound-Fehler', async() => {
                const networkError = new Error('Network timeout')
                networkError.name = 'NetworkError'
                mockDescribeIndexFn.mockRejectedValueOnce(networkError)

                try {
                    await service.checkIfIndexExists(TEST_DATA.indexName)
                    expect.fail('Should have thrown an error')
                } catch (error) {
                    const normalizedError = normalizeError<IBaseError>(error)
                    expect(normalizedError).toBeInstanceOf(BaseError)
                    expect(normalizedError.message).toContain(TEST_DATA.indexName)
                    expect(normalizedError.message).toContain('Error checking if index exists')
                    expect(mockDescribeIndexFn).toHaveBeenCalledTimes(1)
                }
            })
        })
    })

    describe('getOrCreateIndex()', () => {
        describe('✅ Positive Tests', () => {
            let createIndexAndWaitSpy: MockInstance
            let checkIfIndexExistsSpy: MockInstance

            beforeEach(() => {
                createIndexAndWaitSpy = vi.spyOn(service, '_createIndexAndWait' as keyof PineconeService)
                    .mockResolvedValue(mockIndexInstance)
                checkIfIndexExistsSpy = vi.spyOn(service, 'checkIfIndexExists')
            })

            it('sollte existierenden Index zurückgeben, wenn checkIfIndexExists Index findet', async() => {
                checkIfIndexExistsSpy.mockResolvedValueOnce(mockIndexModel)
                
                const indexOptions = createTestIndexOptions()
                const result = await service.getOrCreateIndex(indexOptions)

                expect(checkIfIndexExistsSpy).toHaveBeenCalledExactlyOnceWith(TEST_DATA.indexName)
                expect(createIndexAndWaitSpy).not.toHaveBeenCalled()
                expect(mockIndexFn).toHaveBeenCalledExactlyOnceWith(TEST_DATA.indexName, mockIndexModel.host)
                expect(result).toStrictEqual(mockIndexInstance)
            })

            it('sollte _createIndexAndWait aufrufen, wenn checkIfIndexExists null zurückgibt', async() => {
                checkIfIndexExistsSpy.mockResolvedValueOnce(null)

                const indexOptions = createTestIndexOptions()
                const result = await service.getOrCreateIndex(indexOptions)

                expect(mockIndexFn).not.toHaveBeenCalled()
                expect(checkIfIndexExistsSpy).toHaveBeenCalledExactlyOnceWith(TEST_DATA.indexName)
                expect(createIndexAndWaitSpy).toHaveBeenCalledExactlyOnceWith(indexOptions)
                expect(result).toStrictEqual(mockIndexInstance)
            })
        })
    })

    describe('_createIndexAndWait()', () => {
        describe('✅ Positive Tests', () => {
            it('sollte Index erfolgreich erstellen und konfigurierte Optionen verwenden', async() => {
                mockCreateIndexFn.mockResolvedValueOnce(undefined)
                mockDescribeIndexFn.mockResolvedValueOnce(mockIndexModel)
                mockIndexFn.mockReturnValueOnce(mockIndexInstance)

                const indexOptions = createTestIndexOptions()
   
                const result = await service['_createIndexAndWait'](indexOptions)

                // Prüfe, dass createIndex mit den erwarteten Konfigurationen aufgerufen wurde
                expect(mockCreateIndexFn).toHaveBeenCalledExactlyOnceWith({
                    waitUntilReady: true,
                    suppressConflicts: true,
                    ...indexOptions
                })

                // Prüfe, dass describeIndex aufgerufen wurde, um Host zu erhalten
                expect(mockDescribeIndexFn).toHaveBeenCalledExactlyOnceWith(TEST_DATA.indexName)

                // Prüfe, dass index() mit dem Host aufgerufen wurde
                expect(mockIndexFn).toHaveBeenCalledExactlyOnceWith(TEST_DATA.indexName, mockIndexModel.host)

                expect(result).toBe(mockIndexInstance)
            })

            it('sollte übergebene waitUntilReady und suppressConflicts Werte respektieren', async() => {
                mockCreateIndexFn.mockResolvedValueOnce(undefined)
                mockDescribeIndexFn.mockResolvedValueOnce(mockIndexModel)

                const overrideOptions: ReadonlyDeep<Partial<CreateIndexOptions>> = {
                    waitUntilReady: false,
                    suppressConflicts: false
                }

                const indexOptions = createTestIndexOptions(overrideOptions)

                await service['_createIndexAndWait'](indexOptions)

                const expectedConfig = {
                    ...overrideOptions,
                    ...indexOptions
                }

                expect(mockCreateIndexFn).toHaveBeenCalledExactlyOnceWith(expectedConfig)
            })
        })

        describe('❌ Negative Tests', () => {
            it('sollte BaseError werfen, wenn createIndex fehlschlägt', async() => {
                const createError = new Error('Failed to create index')
                mockCreateIndexFn.mockRejectedValueOnce(createError)

                const indexOptions = createTestIndexOptions()

                try {
                    await service['_createIndexAndWait'](indexOptions)
                    expect.fail('Should have thrown an error')
                } catch (error) {
                    const normalizedError = normalizeError<IBaseError>(error)
                    expect(normalizedError).toBeInstanceOf(BaseError)
                    expect(normalizedError.message).toContain('_createIndexAndWait')
                    expect(normalizedError.message).toContain(TEST_DATA.indexName)
                    expect(normalizedError.message).toContain('Error creating index')
                    expect(mockCreateIndexFn).toHaveBeenCalledTimes(1)
                    expect(mockDescribeIndexFn).not.toHaveBeenCalled()
                    expect(mockIndexFn).not.toHaveBeenCalled()
                }
            })

            it('sollte BaseError werfen, wenn describeIndex nach createIndex fehlschlägt', async() => {
                const describeError = new Error('Failed to describe index')
                mockCreateIndexFn.mockResolvedValueOnce(undefined)
                // Der describeIndex Aufruf in _createIndexAndWait (nach createIndex) soll fehlschlagen
                mockDescribeIndexFn.mockRejectedValueOnce(describeError)

                const indexOptions = createTestIndexOptions()

                await expect(service['_createIndexAndWait'](indexOptions))
                    .rejects.toThrow(BaseError)

                expect(mockCreateIndexFn).toHaveBeenCalledTimes(1)
                expect(mockDescribeIndexFn).toHaveBeenCalledTimes(1)
                expect(mockIndexFn).not.toHaveBeenCalled()
            })
        })
    })

    describe('upsertVectors()', () => {
        const testVectors = validateNonEmptyArray(createTestRecords(5))

        describe('✅ Positive Tests', () => {
            let getIndexSpy: MockInstance

            beforeEach(() => {
                getIndexSpy = vi.spyOn(service, 'getIndex' as keyof PineconeService)
                    .mockResolvedValue(mockIndexInstance)
            })

            it('sollte Vektoren korrekt in Batches aufteilen und ns.upsert für jeden Batch aufrufen', async() => {
                const BATCH_SIZE = 100
                const recordsToUpsert = validateNonEmptyArray(createTestRecords(150))
            
                mockUpsertFn.mockResolvedValue(undefined)

                await service.upsertVectors(
                    TEST_DATA.indexName, 
                    recordsToUpsert, 
                    TEST_DATA.namespace
                )

                // Prüfe, ob getIndex aufgerufen wurde
                expect(getIndexSpy).toHaveBeenCalledExactlyOnceWith(TEST_DATA.indexName)

                // Prüfe, ob chunk mit den korrekten Parametern aufgerufen wurde
                expect(chunkSpy).toHaveBeenCalledExactlyOnceWith(recordsToUpsert, BATCH_SIZE)

                expect(mockNamespaceFn).toHaveBeenCalledWith(TEST_DATA.namespace)
                expect(mockUpsertFn).toHaveBeenCalledTimes(2)
                expect(mockNamespaceFn).toHaveBeenCalledTimes(2)

                const firstBatch = recordsToUpsert.slice(0, BATCH_SIZE) as WritableDeep<PineconeRecord[]>
                expect(mockUpsertFn).toHaveBeenCalledWith(firstBatch)

                const lastBatch = recordsToUpsert.slice(BATCH_SIZE) as WritableDeep<PineconeRecord[]>
                expect(mockUpsertFn).toHaveBeenLastCalledWith(lastBatch)
            })
        })

        describe('❌ Negative Tests', () => {
            let getIndexSpy: MockInstance

            beforeEach(() => {
                getIndexSpy = vi.spyOn(service, 'getIndex' as keyof PineconeService)
            })

            it('sollte Fehler von ns.upsert korrekt als BaseError werfen', async() => {
                getIndexSpy.mockResolvedValue(mockIndexInstance)
                mockUpsertFn.mockRejectedValue(new Error('Upsert failed'))

                await expect(service.upsertVectors(
                    TEST_DATA.indexName, 
                    testVectors, 
                    TEST_DATA.namespace
                )).rejects.toThrow(BaseError)

                expect(getIndexSpy).toHaveBeenCalledWith(TEST_DATA.indexName)
            })
        })
    })

    describe('queryVectors()', () => {
        const mockQueryOpts: ReadonlyDeep<QueryOptions> = {
            vector: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
            topK: 5
        }

        const mockQueryResp: QueryResponse = { matches: [], namespace }

        describe('✅ Positive Tests', () => {
            let getIndexSpy: MockInstance

            beforeEach(() => {
                getIndexSpy = vi.spyOn(service, 'getIndex' as keyof PineconeService)
                    .mockResolvedValue(mockIndexInstance)
            })

            it('sollte ns.query mit den korrekten Optionen aufrufen', async() => {
                mockQueryFn.mockResolvedValueOnce(mockQueryResp)

                const result = await service.queryVectors(
                    TEST_DATA.indexName, 
                    mockQueryOpts,
                    namespace
                )

                expect(getIndexSpy).toHaveBeenCalledExactlyOnceWith(TEST_DATA.indexName)
                expect(mockNamespaceFn).toHaveBeenCalledExactlyOnceWith(namespace)
                expect(mockQueryFn).toHaveBeenCalledExactlyOnceWith(mockQueryOpts)
                expect(result).toEqual(mockQueryResp)
            })
        })

        describe('❌ Negative Tests', () => {
            let getIndexSpy: MockInstance

            beforeEach(() => {
                getIndexSpy = vi.spyOn(service, 'getIndex' as keyof PineconeService)
            })

            it('sollte Fehler von ns.query korrekt als BaseError werfen', async() => {
                getIndexSpy.mockResolvedValue(mockIndexInstance)
                mockQueryFn.mockRejectedValue(new Error('Query failed'))

                await expect(service.queryVectors(
                    TEST_DATA.indexName, 
                    mockQueryOpts,
                    namespace
                )).rejects.toThrow(BaseError)

                expect(getIndexSpy).toHaveBeenCalledWith(TEST_DATA.indexName)
            })
        })
    })

    describe('deleteVectors()', () => {
        const mockDeleteOpts: DeleteManyOptions = { ids: ['vec1', 'vec2'] }

        describe('✅ Positive Tests', () => {
            let getIndexSpy: MockInstance

            beforeEach(() => {
                getIndexSpy = vi.spyOn(service, 'getIndex' as keyof PineconeService)
                    .mockResolvedValue(mockIndexInstance)
            })

            it('sollte ns.deleteMany mit den korrekten Optionen aufrufen', async() => {
                mockDeleteManyFn.mockResolvedValueOnce(undefined)

                await service.deleteVectors(
                    TEST_DATA.indexName, 
                    mockDeleteOpts, 
                    namespace
                )

                expect(getIndexSpy).toHaveBeenCalledExactlyOnceWith(TEST_DATA.indexName)
                expect(mockNamespaceFn).toHaveBeenCalledExactlyOnceWith(namespace)
                expect(mockDeleteManyFn).toHaveBeenCalledExactlyOnceWith(mockDeleteOpts)
            })
        })

        describe('❌ Negative Tests', () => {
            let getIndexSpy: MockInstance

            beforeEach(() => {
                getIndexSpy = vi.spyOn(service, 'getIndex' as keyof PineconeService)
            })

            it('sollte Fehler von ns.deleteMany korrekt als BaseError werfen', async() => {
                getIndexSpy.mockResolvedValue(mockIndexInstance)
                mockDeleteManyFn.mockRejectedValue(new Error('Delete failed'))

                await expect(service.deleteVectors(
                    TEST_DATA.indexName, 
                    mockDeleteOpts, 
                    namespace
                )).rejects.toThrow(BaseError)

                expect(getIndexSpy).toHaveBeenCalledWith(TEST_DATA.indexName)
            })
        })
    })

    describe('describeIndexStats()', () => {
        const mockStatsResponse: IndexStatsDescription = {
            dimension: TEST_DATA.dimension,
            indexFullness: 0.5,
            namespaces: { 'testNs': { recordCount: 100 } },
            totalRecordCount: 100
        }

        describe('✅ Positive Tests', () => {
            let getIndexSpy: MockInstance

            beforeEach(() => {
                getIndexSpy = vi.spyOn(service, 'getIndex' as keyof PineconeService)
                    .mockResolvedValue(mockIndexInstance)
            })

            it('sollte index.describeIndexStats aufrufen und Ergebnis zurückgeben', async() => {
                mockDescribeIndexStatsFn.mockResolvedValueOnce(mockStatsResponse)

                const result = await service.describeIndexStats(TEST_DATA.indexName)
                
                expect(getIndexSpy).toHaveBeenCalledExactlyOnceWith(TEST_DATA.indexName)
                expect(mockDescribeIndexStatsFn).toHaveBeenCalledTimes(1)
                expect(result).toEqual(mockStatsResponse)
            })
        })

        describe('❌ Negative Tests', () => {
            let getIndexSpy: MockInstance

            beforeEach(() => {
                getIndexSpy = vi.spyOn(service, 'getIndex' as keyof PineconeService)
            })

            it('sollte Fehler korrekt als BaseError werfen', async() => {
                getIndexSpy.mockResolvedValue(mockIndexInstance)
                
                mockDescribeIndexStatsFn.mockRejectedValue(new Error('Describe stats failed'))

                await expect(service.describeIndexStats(TEST_DATA.indexName))
                    .rejects.toThrow(BaseError)

                expect(getIndexSpy).toHaveBeenCalledWith(TEST_DATA.indexName)
            })
        })
    })

    describe('getIndex()', () => {
        describe('✅ Positive Tests', () => {
            let checkIfIndexExistsSpy: MockInstance

            beforeEach(() => {
                // Reset cache before each test
                service['_indicesCache'].clear()
                checkIfIndexExistsSpy = vi.spyOn(service, 'checkIfIndexExists').mockResolvedValueOnce(mockIndexModel)
                mockIndexFn.mockReturnValueOnce(mockIndexInstance)
            })

            it('sollte Index-Instanz beim ersten Aufruf erstellen und cachen', async() => {
                const result = await service['getIndex'](TEST_DATA.indexName)

                expect(checkIfIndexExistsSpy).toHaveBeenCalledExactlyOnceWith(TEST_DATA.indexName)
                expect(mockIndexFn).toHaveBeenCalledExactlyOnceWith(TEST_DATA.indexName, mockIndexModel.host)
                expect(result).toBe(mockIndexInstance)
                
                // Verify cache was updated
                expect(service['_indicesCache'].has(TEST_DATA.indexName)).toBe(true)
                expect(service['_indicesCache'].get(TEST_DATA.indexName)).toBe(mockIndexInstance)
            })

            it('sollte gecachte Index-Instanz beim zweiten Aufruf zurückgeben', async() => {
                // Setup: First call to populate cache
                await service['getIndex'](TEST_DATA.indexName)
                
                // Reset mocks to ensure they're not called again
                checkIfIndexExistsSpy.mockReset()
                mockIndexFn.mockReset()
                
                // Second call should use cache
                const result = await service['getIndex'](TEST_DATA.indexName)

                expect(checkIfIndexExistsSpy).not.toHaveBeenCalled()
                expect(mockIndexFn).not.toHaveBeenCalled()
                expect(result).toBe(mockIndexInstance)
            })

            it('sollte verschiedene Index-Instanzen für verschiedene Index-Namen cachen', async() => {
                const secondIndexName = 'different-index'
                const secondIndexModel = { ...mockIndexModel, name: secondIndexName, host: 'different-host' }
                const secondMockIndexInstance = Object.assign(
                    {}, 
                    mockIndexInstance, 
                    { target: { index: secondIndexName } }
                )

                // First index
                const firstResult = await service['getIndex'](TEST_DATA.indexName)
                
                // Second index
                checkIfIndexExistsSpy.mockResolvedValueOnce(secondIndexModel)
                mockIndexFn.mockReturnValueOnce(secondMockIndexInstance)
                const secondResult = await service['getIndex'](secondIndexName)

                expect(checkIfIndexExistsSpy).toHaveBeenCalledTimes(2)
                expect(mockIndexFn).toHaveBeenCalledTimes(2)
                expect(firstResult).toBe(mockIndexInstance)
                expect(secondResult).toBe(secondMockIndexInstance)
                
                // Verify both are cached
                expect(service['_indicesCache'].has(TEST_DATA.indexName)).toBe(true)
                expect(service['_indicesCache'].has(secondIndexName)).toBe(true)
                expect(service['_indicesCache'].size).toBe(2)
            })
        })

        describe('❌ Negative Tests', () => {
            beforeEach(() => {
                // Reset cache before each test
                service['_indicesCache'].clear()
            })

            it('sollte ResourceNotFoundError werfen, wenn Index nicht existiert', async() => {
                const checkIfIndexExistsSpy = vi.spyOn(service, 'checkIfIndexExists')
                    .mockResolvedValueOnce(null)

                try {
                    await service['getIndex']('non-existent-index')
                    expect.fail('Should have thrown an error')
                } catch (error) {
                    const normalizedError = normalizeError<IResourceNotFoundError>(error)
                    expect(normalizedError).toBeInstanceOf(ResourceNotFoundError)
                    expect(normalizedError.message).toContain('non-existent-index')
                    expect(normalizedError.message).toContain('does not exist')
                    expect(checkIfIndexExistsSpy).toHaveBeenCalledWith('non-existent-index')
                    expect(mockDescribeIndexFn).not.toHaveBeenCalled()
                    expect(mockIndexFn).not.toHaveBeenCalled()
                    expect(service['_indicesCache'].has('non-existent-index')).toBe(false)
                }
            })

            it('sollte BaseError werfen, wenn this.pinecone.index() fehlschlägt', async() => {
                const checkIfIndexExistsSpy = vi.spyOn(service, 'checkIfIndexExists')
                    .mockResolvedValueOnce(mockIndexModel)
                const indexError = new Error('Failed to create index instance')
                mockIndexFn.mockImplementationOnce(() => {
                    throw indexError
                })

                try {
                    await service['getIndex'](TEST_DATA.indexName)
                    expect.fail('Should have thrown an error')
                } catch (error) {
                    const normalizedError = normalizeError<IBaseError>(error)
                    expect(normalizedError).toBeInstanceOf(BaseError)
                    expect(normalizedError.message).toContain(TEST_DATA.indexName)
                    expect(normalizedError.message).toContain('Error creating index instance')
                    expect(checkIfIndexExistsSpy).toHaveBeenCalledWith(TEST_DATA.indexName)
                    expect(mockIndexFn).toHaveBeenCalledWith(TEST_DATA.indexName, mockIndexModel.host)
                    expect(service['_indicesCache'].has(TEST_DATA.indexName)).toBe(false)
                }
            })
        })
    })
})
