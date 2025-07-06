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
import { setTimeout } from 'timers/promises'
import {
    type QueryResponse,
    CreateIndexOptions
} from '@pinecone-database/pinecone'
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest'
import env from '@/env.js'
import { PineconeAdminService } from '@/services/pinecone-admin-service.ts'
import { validateNonEmptyArray } from '@/utils/type-guards.ts'
import { 
    getQueryVectorFromRecords,
    createTestIndexOptions,
    createTestRecords
} from '@test/common/src/services/pinecone-service-helpers.ts'

describe('PineconeAdminService - External Integration Tests', () => {
    let service: PineconeAdminService
    let testNamespace: string
    let testIndexName: string
    let indexOptions: CreateIndexOptions

    beforeAll(async() => {
        const globalService = new PineconeAdminService({ apiKey: env.PINECONE_API_KEY })
        await globalService.deleteAllIndices()
    })

    beforeEach(async() => {
        // Generate unique but shorter index name and namespace for each test
        const timestamp = Date.now()
        const randomId = Math.random().toString(36).substring(2, 6)
        const testId = `${String(timestamp).slice(-8)}-${randomId}`
        
        testIndexName = `ai-test-${testId}`
        testNamespace = `test-ns-${testId}`
        
        vi.stubEnv('PINECONE_API_KEY', env.PINECONE_API_KEY)
        vi.stubEnv('PINECONE_RULES_NAMESPACE', testNamespace)
        vi.stubEnv('PINECONE_INDEX_NAME', testIndexName)
        vi.stubEnv('PINECONE_CLOUD', env.PINECONE_CLOUD)
        vi.stubEnv('PINECONE_REGION', env.PINECONE_REGION)

        service = new PineconeAdminService({ apiKey: env.PINECONE_API_KEY })

        console.info(
            `[PN-EXT-SETUP] Test will use isolated index '${testIndexName}' ` +
            `and namespace '${testNamespace}'`
        )

        indexOptions = createTestIndexOptions({ name: testIndexName })

        // Create the test index first
        await service.getOrCreateIndex(indexOptions)
    })

    afterEach(async() => {
        const result = await service.checkIfIndexExists(testIndexName)
        
        if (result) {
            await service.deleteIndex(testIndexName)
        }
    })

    describe('deleteAllVectorsInNamespace()', () => {
        it('sollte alle Vektoren in einem Namespace erfolgreich löschen können', async() => {
            const recordsToUpsert = validateNonEmptyArray(createTestRecords(5))
                
            // Setup: Vektoren einfügen
            await service.upsertVectors(
                testIndexName,
                recordsToUpsert, 
                testNamespace
            )

            await setTimeout(15000)

            // Alle Vektoren im Namespace löschen
            const deleteResult = await service.deleteAllVectorsInNamespace(testIndexName, testNamespace)
            expect(deleteResult).toBe(true)

            // Verifizieren, dass Namespace leer ist
            const queryVector = getQueryVectorFromRecords(recordsToUpsert, 0)
            const queryResponse: QueryResponse = await service.queryVectors(testIndexName, {
                vector: queryVector,
                topK: 1
            }, testNamespace)
                
            expect(queryResponse.matches.length).toBe(0)
        }, 75000)

        it('sollte false zurückgeben auch wenn Namespace leer oder nicht existiert', async() => {
            const emptyNamespace = 
                    `empty-namespace-${String(Date.now())}-${Math.random().toString(36).substring(2, 6)}`
                
            const deleteResult = await service.deleteAllVectorsInNamespace(
                testIndexName, 
                emptyNamespace
            )
                
            expect(deleteResult).toBe(false)
        })
    })

    describe('deleteIndex()', () => {
        it('sollte einen Index erfolgreich löschen können', async() => {
            // Create a test index specifically for deletion - use shorter name
            const shortId = Math.random().toString(36).substring(2, 6)
            const deleteTestIndexName = `ai-del-${shortId}`
            const indexOptions = createTestIndexOptions({ name: deleteTestIndexName })
            await service.getOrCreateIndex(indexOptions)
                
            // Verify index exists
            const existsBefore = await service.checkIfIndexExists(deleteTestIndexName)
            expect(existsBefore?.name).toBe(deleteTestIndexName)
                
            // Delete the index
            await service.deleteIndex(deleteTestIndexName)
                
            // Wait for deletion to propagate
            await setTimeout(30000)
                
            // Verify index is deleted
            const existsAfter = await service.checkIfIndexExists(deleteTestIndexName)
            expect(existsAfter).toBeNull()
        }, 180000)
    })

    describe('deleteAllIndices()', () => {
        it('sollte alle Indices erfolgreich löschen können', async() => {
            // Create multiple test indices - use shorter names
            const shortId1 = Math.random().toString(36).substring(2, 6)
            const shortId2 = Math.random().toString(36).substring(2, 6)
            const index1Name = `ai-all1-${shortId1}`
            const index2Name = `ai-all2-${shortId2}`
                
            const indexOptions1 = createTestIndexOptions({ name: index1Name })
            const indexOptions2 = createTestIndexOptions({ name: index2Name })
                
            await service.getOrCreateIndex(indexOptions1)
            await service.getOrCreateIndex(indexOptions2)
                
            // Verify indices exist
            const exists1Before = await service.checkIfIndexExists(index1Name)
            const exists2Before = await service.checkIfIndexExists(index2Name)
            expect(exists1Before?.name).toBe(index1Name)
            expect(exists2Before?.name).toBe(index2Name)
                
            // Delete all indices
            await service.deleteAllIndices()
                
            // Wait longer for deletion to propagate  
            await setTimeout(30000) // 3 minutes
                
            // Verify all indices are deleted
            const exists1After = await service.checkIfIndexExists(index1Name)
            const exists2After = await service.checkIfIndexExists(index2Name)
            expect(exists1After).toBeNull()
            expect(exists2After).toBeNull()
        }, 240000)
    })

    describe('deleteNamespace()', () => {
        it('sollte einen spezifischen Namespace erfolgreich löschen können', async() => {
            const testRecords = validateNonEmptyArray(createTestRecords(3))

            // Setup: Vectors in namespace einfügen
            await service.upsertVectors(testIndexName, testRecords, testNamespace)

            // Wait for eventual consistency 
            await setTimeout(15000)

            const statsBeforeDelete = await service.describeIndexStats(testIndexName)
            expect(statsBeforeDelete.namespaces).toHaveProperty(testNamespace)

            await service.deleteNamespace(testIndexName, testNamespace)

            const statsAfterDelete = await service.describeIndexStats(testIndexName)
            expect(statsAfterDelete.namespaces).toEqual({})
        }, 180000)
    })

    describe('deleteAllNamespaces()', () => {
        it('sollte alle Namespaces in einem Index erfolgreich löschen können', async() => {
            const testRecords = validateNonEmptyArray(createTestRecords(2))
            const namespace1 = `${testNamespace}-1`
            const namespace2 = `${testNamespace}-2`
                
            // Setup: Vectors in multiple namespaces einfügen
            await service.upsertVectors(testIndexName, testRecords, namespace1)
            await service.upsertVectors(testIndexName, testRecords, namespace2)
                
            // Wait for eventual consistency 
            await setTimeout(15000)
                
            const statsBeforeDelete = await service.describeIndexStats(testIndexName)
            expect(statsBeforeDelete.namespaces).toHaveProperty(namespace1)
            expect(statsBeforeDelete.namespaces).toHaveProperty(namespace2)

            await service.deleteAllNamespaces(testIndexName)

            const statsAfterDelete = await service.describeIndexStats(testIndexName)
            expect(statsAfterDelete.namespaces).toEqual({})
        }, 60000)
    })
}) 