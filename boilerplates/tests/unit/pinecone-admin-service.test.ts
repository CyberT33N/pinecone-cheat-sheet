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
    type PineconeConfiguration
} from '@pinecone-database/pinecone'
import { BaseError, IBaseError } from 'error-manager-helper'
import { 
    describe, it, expect, vi, beforeEach, 
    MockInstance 
} from 'vitest'
import env from '@/env.js'
import { PineconeAdminService } from '@/services/pinecone-admin-service.ts'
import { PineconeService } from '@/services/pinecone-service.ts'
import { pineconeMockFactory } from '@test/__mocks__/@pinecone-database/pinecone.js'
import {
    TEST_DATA,
    mockIndexModel
} from '@test/common/src/services/pinecone-service-helpers.ts'
import { normalizeError } from '@/utils/error-helpers.ts'

// ==== Mocks ====
vi.mock('@pinecone-database/pinecone', async() => {
    const { mockPineconeModule } = await import('@test/__mocks__/@pinecone-database/pinecone.js')
    return mockPineconeModule()
})

// ==== Tests ====
describe('PineconeAdminService() - Unit Tests', () => {
    let service: PineconeAdminService

    const {
        mockIndexInstance,
        mockNamespaceFn,
        mockDeleteAllFn,
        mockDescribeIndexStatsFn,
        mockDeleteNamespaceFn,
        mockListNamespacesFn,
        mockIndexFn
    } = pineconeMockFactory

    const apiKey = env.PINECONE_API_KEY
    const namespace = env.PINECONE_RULES_NAMESPACE

    beforeEach(() => {
        // Create service AFTER mocks are properly set up
        const testConfig: PineconeConfiguration = { apiKey }
        service = new PineconeAdminService(testConfig)
    })

    describe('Constructor', () => {
        it('sollte korrekt von PineconeService erben und mit PineconeConfiguration initialisieren', () => {
            const testConfig: PineconeConfiguration = { apiKey }
            const testService = new PineconeAdminService(testConfig)
            
            expect(pineconeMockFactory.mockPinecone).toBeDefined()
            expect(pineconeMockFactory.mockPinecone?.Pinecone).toHaveBeenCalledWith(testConfig)
            expect(testService['pinecone']).toBeDefined()
        })
    })

    describe('deleteAllVectorsInNamespace()', () => {
        describe('✅ Positive Tests', () => {
            let checkIfIndexExistsSpy: MockInstance

            beforeEach(() => {
                checkIfIndexExistsSpy = vi.spyOn(service, 'checkIfIndexExists')
            })

            // eslint-disable-next-line max-len
            it('sollte true zurückgeben und alle Vektoren im Namespace löschen, wenn Index und Namespace existieren', async() => {
                const mockStatsWithNamespace = {
                    namespaces: { [namespace]: { recordCount: 100 } },
                    dimension: TEST_DATA.dimension,
                    totalRecordCount: 100
                }

                checkIfIndexExistsSpy.mockResolvedValueOnce(mockIndexModel)
                mockIndexFn.mockReturnValueOnce(mockIndexInstance)
                mockDescribeIndexStatsFn.mockResolvedValueOnce(mockStatsWithNamespace)
                mockDeleteAllFn.mockResolvedValueOnce(undefined)

                const result = await service.deleteAllVectorsInNamespace(TEST_DATA.indexName, namespace)

                expect(result).toBe(true)
                expect(checkIfIndexExistsSpy).toHaveBeenCalledExactlyOnceWith(TEST_DATA.indexName)
                expect(mockIndexFn).toHaveBeenCalledExactlyOnceWith(TEST_DATA.indexName, mockIndexModel.host)
                expect(mockDescribeIndexStatsFn).toHaveBeenCalledTimes(1)
                expect(mockNamespaceFn).toHaveBeenCalledExactlyOnceWith(namespace)
                expect(mockDeleteAllFn).toHaveBeenCalledTimes(1)
            })

            it('sollte false zurückgeben, wenn Index nicht existiert', async() => {
                checkIfIndexExistsSpy.mockResolvedValueOnce(null)

                const result = await service.deleteAllVectorsInNamespace(TEST_DATA.indexName, 'test-namespace')

                expect(result).toBe(false)
                expect(checkIfIndexExistsSpy).toHaveBeenCalledExactlyOnceWith(TEST_DATA.indexName)
                expect(mockIndexFn).not.toHaveBeenCalled()
                expect(mockDescribeIndexStatsFn).not.toHaveBeenCalled()
                expect(mockDeleteAllFn).not.toHaveBeenCalled()
            })

            it('sollte false zurückgeben, wenn Namespace nicht existiert oder leer ist', async() => {
                const mockStatsWithoutNamespace = {
                    namespaces: {},
                    dimension: TEST_DATA.dimension,
                    totalRecordCount: 0
                }

                checkIfIndexExistsSpy.mockResolvedValueOnce(mockIndexModel)
                mockIndexFn.mockReturnValueOnce(mockIndexInstance)
                mockDescribeIndexStatsFn.mockResolvedValueOnce(mockStatsWithoutNamespace)

                const result = await service.deleteAllVectorsInNamespace(TEST_DATA.indexName, 'nonexistent-namespace')

                expect(result).toBe(false)
                expect(checkIfIndexExistsSpy).toHaveBeenCalledExactlyOnceWith(TEST_DATA.indexName)
                expect(mockIndexFn).toHaveBeenCalledExactlyOnceWith(TEST_DATA.indexName, mockIndexModel.host)
                expect(mockDescribeIndexStatsFn).toHaveBeenCalledTimes(1)
                expect(mockNamespaceFn).not.toHaveBeenCalled()
                expect(mockDeleteAllFn).not.toHaveBeenCalled()
            })
        })
        
        describe('❌ Negative Tests', () => {
            let checkIfIndexExistsSpy: MockInstance

            beforeEach(() => {
                checkIfIndexExistsSpy = vi.spyOn(service, 'checkIfIndexExists')
            })

            it('sollte BaseError werfen, wenn describeIndexStats fehlschlägt', async() => {
                checkIfIndexExistsSpy.mockResolvedValueOnce(mockIndexModel)
                mockIndexFn.mockReturnValueOnce(mockIndexInstance)
                mockDescribeIndexStatsFn.mockRejectedValueOnce(new Error('Stats failed'))

                try {
                    await service.deleteAllVectorsInNamespace(TEST_DATA.indexName, 'test-namespace')
                    expect.fail('Should have thrown an error')
                } catch (error) {
                    const normalizedError = normalizeError<IBaseError>(error)
                    expect(normalizedError).toBeInstanceOf(BaseError)
                    expect(normalizedError.message).toContain(TEST_DATA.indexName)
                    expect(normalizedError.message).toContain('test-namespace')
                    expect(normalizedError.message).toContain('Error during operation')
                    expect(checkIfIndexExistsSpy).toHaveBeenCalledWith(TEST_DATA.indexName)
                    expect(mockIndexFn).toHaveBeenCalledWith(TEST_DATA.indexName, mockIndexModel.host)
                    expect(mockDescribeIndexStatsFn).toHaveBeenCalledTimes(1)
                    expect(mockDeleteAllFn).not.toHaveBeenCalled()
                }
            })

            it('sollte BaseError werfen, wenn deleteAll fehlschlägt', async() => {
                const mockStatsWithNamespace = {
                    namespaces: { [namespace]: { recordCount: 100 } },
                    dimension: TEST_DATA.dimension,
                    totalRecordCount: 100
                }

                checkIfIndexExistsSpy.mockResolvedValueOnce(mockIndexModel)
                mockIndexFn.mockReturnValueOnce(mockIndexInstance)
                mockDescribeIndexStatsFn.mockResolvedValueOnce(mockStatsWithNamespace)
                mockDeleteAllFn.mockRejectedValueOnce(new Error('Delete all failed'))

                await expect(service.deleteAllVectorsInNamespace(TEST_DATA.indexName, namespace))
                    .rejects.toThrow(BaseError)

                expect(mockDeleteAllFn).toHaveBeenCalledTimes(1)
            })

            it('sollte BaseError werfen, wenn this.pinecone.index() fehlschlägt', async() => {
                const indexError = new Error('Failed to get index instance')
                checkIfIndexExistsSpy.mockResolvedValueOnce(mockIndexModel)
                mockIndexFn.mockImplementationOnce(() => {
                    throw indexError
                })

                await expect(service.deleteAllVectorsInNamespace(TEST_DATA.indexName, 'test-namespace'))
                    .rejects.toThrow(BaseError)

                expect(checkIfIndexExistsSpy).toHaveBeenCalledWith(TEST_DATA.indexName)
                expect(mockIndexFn).toHaveBeenCalledWith(TEST_DATA.indexName, mockIndexModel.host)
                expect(mockDescribeIndexStatsFn).not.toHaveBeenCalled()
                expect(mockDeleteAllFn).not.toHaveBeenCalled()
            })

            it('sollte BaseError werfen, wenn indexInstance.namespace() fehlschlägt', async() => {
                const mockStatsWithNamespace = {
                    namespaces: { [namespace]: { recordCount: 100 } },
                    dimension: TEST_DATA.dimension,
                    totalRecordCount: 100
                }
                const namespaceError = new Error('Failed to get namespace instance')

                checkIfIndexExistsSpy.mockResolvedValueOnce(mockIndexModel)
                mockIndexFn.mockReturnValueOnce(mockIndexInstance)
                mockDescribeIndexStatsFn.mockResolvedValueOnce(mockStatsWithNamespace)
                mockNamespaceFn.mockImplementationOnce(() => {
                    throw namespaceError
                })

                await expect(service.deleteAllVectorsInNamespace(TEST_DATA.indexName, namespace))
                    .rejects.toThrow(BaseError)

                expect(checkIfIndexExistsSpy).toHaveBeenCalledWith(TEST_DATA.indexName)
                expect(mockIndexFn).toHaveBeenCalledWith(TEST_DATA.indexName, mockIndexModel.host)
                expect(mockDescribeIndexStatsFn).toHaveBeenCalledTimes(1)
                expect(mockNamespaceFn).toHaveBeenCalledWith(namespace)
                expect(mockDeleteAllFn).not.toHaveBeenCalled()
            })
        })
    })

    describe('deleteIndex()', () => {
        let deleteIndexSpy: MockInstance

        beforeEach(() => {
            deleteIndexSpy = vi.spyOn(service['pinecone'], 'deleteIndex')
        })

        describe('✅ Positive Tests', () => {
            it('sollte Index erfolgreich löschen', async() => {
                await service.deleteIndex(TEST_DATA.indexName)
                expect(deleteIndexSpy).toHaveBeenCalledExactlyOnceWith(TEST_DATA.indexName)
            })
        })

        describe('❌ Negative Tests', () => {
            it('sollte BaseError werfen, wenn deleteIndex fehlschlägt', async() => {
                const deleteError = new Error('Delete index failed')
                deleteIndexSpy.mockRejectedValueOnce(deleteError)

                await expect(service.deleteIndex(TEST_DATA.indexName))
                    .rejects.toThrow(BaseError)

                expect(deleteIndexSpy).toHaveBeenCalledExactlyOnceWith(TEST_DATA.indexName)
            })
        })
    })

    describe('deleteAllIndices()', () => {
        let listIndexesSpy: MockInstance
        let deleteIndexSpy: MockInstance

        beforeEach(() => {
            listIndexesSpy = vi.spyOn(service['pinecone'], 'listIndexes')
            deleteIndexSpy = vi.spyOn(service, 'deleteIndex').mockResolvedValue()
        })

        describe('✅ Positive Tests', () => {
            it('sollte alle Indizes erfolgreich löschen', async() => {
                const mockIndexList = {
                    indexes: [
                        { name: 'index1' },
                        { name: 'index2' }
                    ]
                }

                listIndexesSpy.mockResolvedValueOnce(mockIndexList)
          
                await service.deleteAllIndices()

                expect(listIndexesSpy).toHaveBeenCalledExactlyOnceWith()
                expect(deleteIndexSpy).toHaveBeenCalledWith('index1')
                expect(deleteIndexSpy).toHaveBeenCalledWith('index2')
                expect(deleteIndexSpy).toHaveBeenCalledTimes(2)
            })

            it('sollte nichts tun, wenn keine Indizes existieren', async() => {
                const mockIndexList = { indexes: [] }
                listIndexesSpy.mockResolvedValueOnce(mockIndexList)

                await service.deleteAllIndices()

                expect(listIndexesSpy).toHaveBeenCalled()
                expect(deleteIndexSpy).not.toHaveBeenCalled()
            })
        })

        describe('❌ Negative Tests', () => {
            it('sollte BaseError werfen, wenn listIndexes fehlschlägt', async() => {
                const listError = new Error('List indices failed')
                listIndexesSpy.mockRejectedValueOnce(listError)

                await expect(service.deleteAllIndices())
                    .rejects.toThrow(BaseError)

                expect(listIndexesSpy).toHaveBeenCalledExactlyOnceWith()
            })

            it('sollte BaseError werfen, wenn deleteIndex fehlschlägt', async() => {
                const deleteError = new Error('Delete index failed')
                deleteIndexSpy.mockRejectedValueOnce(deleteError)

                await expect(service.deleteAllIndices())
                    .rejects.toThrow(BaseError)
            })
        })
    })

    describe('deleteNamespace()', () => {
        describe('✅ Positive Tests', () => {
            let getIndexSpy: MockInstance

            beforeEach(() => {
                getIndexSpy = vi.spyOn(service, 'getIndex' as keyof PineconeService)
                    .mockResolvedValue(mockIndexInstance)
            })

            it('sollte Namespace erfolgreich löschen, wenn er existiert', async() => {
                const mockStats = {
                    namespaces: { [namespace]: { recordCount: 50 } }
                }
                mockDescribeIndexStatsFn.mockResolvedValueOnce(mockStats)
                mockDeleteNamespaceFn.mockResolvedValueOnce(undefined)

                await service.deleteNamespace(TEST_DATA.indexName, namespace)

                expect(getIndexSpy).toHaveBeenCalledWith(TEST_DATA.indexName)
                expect(mockDescribeIndexStatsFn).toHaveBeenCalledTimes(1)
                expect(mockDeleteNamespaceFn).toHaveBeenCalledWith(namespace)
            })

            it('sollte nichts tun, wenn Namespace nicht existiert', async() => {
                const mockStats = { namespaces: {} }
                mockDescribeIndexStatsFn.mockResolvedValueOnce(mockStats)

                await service.deleteNamespace(TEST_DATA.indexName, namespace)

                expect(getIndexSpy).toHaveBeenCalledWith(TEST_DATA.indexName)
                expect(mockDescribeIndexStatsFn).toHaveBeenCalledTimes(1)
                expect(mockDeleteNamespaceFn).not.toHaveBeenCalled()
            })
        })

        describe('❌ Negative Tests', () => {
            let getIndexSpy: MockInstance

            beforeEach(() => {
                getIndexSpy = vi.spyOn(service, 'getIndex' as keyof PineconeService)
            })

            it('sollte BaseError werfen, wenn describeIndexStats fehlschlägt', async() => {
                getIndexSpy.mockResolvedValueOnce(mockIndexInstance)
                mockDescribeIndexStatsFn.mockRejectedValueOnce(new Error('Stats failed'))

                await expect(service.deleteNamespace(TEST_DATA.indexName, 'test-namespace'))
                    .rejects.toThrow(BaseError)

                expect(getIndexSpy).toHaveBeenCalledWith(TEST_DATA.indexName)
                expect(mockDescribeIndexStatsFn).toHaveBeenCalledTimes(1)
            })

            it('sollte BaseError werfen, wenn deleteNamespace fehlschlägt', async() => {
                const mockStats = {
                    namespaces: { [namespace]: { recordCount: 50 } }
                }
                getIndexSpy.mockResolvedValueOnce(mockIndexInstance)
                mockDescribeIndexStatsFn.mockResolvedValueOnce(mockStats)
                mockDeleteNamespaceFn.mockRejectedValueOnce(new Error('Delete namespace failed'))

                await expect(service.deleteNamespace(TEST_DATA.indexName, namespace))
                    .rejects.toThrow(BaseError)

                expect(mockDeleteNamespaceFn).toHaveBeenCalledWith(namespace)
            })
        })
    })

    describe('deleteAllNamespaces()', () => {
        describe('✅ Positive Tests', () => {
            let getIndexSpy: MockInstance
            let deleteNamespaceSpy: MockInstance

            beforeEach(() => {
                getIndexSpy = vi.spyOn(service, 'getIndex' as keyof PineconeService)
                    .mockResolvedValue(mockIndexInstance)
                deleteNamespaceSpy = vi.spyOn(service, 'deleteNamespace').mockResolvedValue()
            })

            it('sollte alle Namespaces erfolgreich löschen', async() => {
                const mockNamespaces = {
                    namespaces: [
                        { name: 'namespace1' },
                        { name: 'namespace2' }
                    ]
                }
                mockListNamespacesFn.mockResolvedValueOnce(mockNamespaces)

                await service.deleteAllNamespaces(TEST_DATA.indexName)

                expect(getIndexSpy).toHaveBeenCalledExactlyOnceWith(TEST_DATA.indexName)
                expect(mockListNamespacesFn).toHaveBeenCalledTimes(1)
                expect(deleteNamespaceSpy).toHaveBeenCalledWith(TEST_DATA.indexName, 'namespace1')
                expect(deleteNamespaceSpy).toHaveBeenCalledWith(TEST_DATA.indexName, 'namespace2')
                expect(deleteNamespaceSpy).toHaveBeenCalledTimes(2)
            })

            it('sollte nichts tun, wenn keine Namespaces existieren', async() => {
                const mockNamespaces = { namespaces: [] }
                mockListNamespacesFn.mockResolvedValueOnce(mockNamespaces)

                await service.deleteAllNamespaces(TEST_DATA.indexName)

                expect(getIndexSpy).toHaveBeenCalledExactlyOnceWith(TEST_DATA.indexName)
                expect(mockListNamespacesFn).toHaveBeenCalledTimes(1)
                expect(deleteNamespaceSpy).not.toHaveBeenCalled()
            })
        })

        describe('❌ Negative Tests', () => {
            let getIndexSpy: MockInstance
            let deleteNamespaceSpy: MockInstance

            beforeEach(() => {
                getIndexSpy = vi.spyOn(service, 'getIndex' as keyof PineconeService)
                deleteNamespaceSpy = vi.spyOn(service, 'deleteNamespace').mockResolvedValue()
            })

            it('sollte BaseError werfen, wenn listNamespaces fehlschlägt', async() => {
                getIndexSpy.mockResolvedValueOnce(mockIndexInstance)
                mockListNamespacesFn.mockRejectedValueOnce(new Error('List namespaces failed'))

                await expect(service.deleteAllNamespaces(TEST_DATA.indexName))
                    .rejects.toThrow(BaseError)

                expect(getIndexSpy).toHaveBeenCalledWith(TEST_DATA.indexName)
                expect(mockListNamespacesFn).toHaveBeenCalledTimes(1)
            })

            it('sollte BaseError werfen, wenn deleteNamespace fehlschlägt', async() => {
                const deleteError = new Error('Delete namespace failed')
                deleteNamespaceSpy.mockRejectedValueOnce(deleteError)

                await expect(service.deleteAllNamespaces(TEST_DATA.indexName))
                    .rejects.toThrow(BaseError)
            })
        })
    })
}) 