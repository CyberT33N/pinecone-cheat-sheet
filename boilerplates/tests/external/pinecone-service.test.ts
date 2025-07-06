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
    type PineconeRecord,
    type QueryResponse,
    type IndexStatsDescription,
    type Index,
    CreateIndexOptions,
    QueryOptions
} from '@pinecone-database/pinecone'
import type { ReadonlyDeep } from 'type-fest'
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest'
import env from '@/env.js'
import { PineconeAdminService } from '@/services/pinecone-admin-service.ts'
import { PineconeService } from '@/services/pinecone-service.ts'
import { validateNonEmptyArray } from '@/utils/type-guards.ts'
import { 
    getQueryVectorFromRecords ,
    createStandardPineconeService,
    createTestIndexOptions,
    createTestRecords,
    createAdminService
} from '@test/common/src/services/pinecone-service-helpers.ts'

/**
 * Retry query until results are found or timeout
 * @param service - The PineconeService instance.
 * @param indexName - The name of the Pinecone index.
 * @param queryOptions - The query options.
 * @param maxAttempts - The maximum number of attempts.
 * @param delayMs - The delay between attempts in milliseconds.
 * @returns The query response.
 */
const retryQueryUntilFound = async(
    service: ReadonlyDeep<PineconeService>,
    indexName: string,
    queryOptions: ReadonlyDeep<QueryOptions>,
    namespace: string,
    maxAttempts = 10,
    delayMs = 30000
): Promise<QueryResponse> => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        console.info(`[PN-EXT-TEST] Query attempt ${String(attempt)}/${String(maxAttempts)}...`)
        const result = await service.queryVectors(indexName, queryOptions, namespace)
        
        if (result.matches.length > 0) {
            console.info(`[PN-EXT-TEST] Found ${String(result.matches.length)} matches on attempt ${String(attempt)}`)
            return result
        }
        
        if (attempt < maxAttempts) {
            console.info(`[PN-EXT-TEST] No matches found, waiting ${String(delayMs)}ms before retry...`)
            await setTimeout(delayMs)
        }
    }
    
    // Return the last result even if empty
    return service.queryVectors(indexName, queryOptions, namespace)
}

describe('PineconeService - External Integration Tests', () => {
    let service: PineconeService
    let adminService: PineconeAdminService
    let testNamespace: string
    let testIndexName: string
    let indexOptions: CreateIndexOptions
    let testIndex: Index

    beforeAll(async() => {
        const globalService = createAdminService()
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

        service = createStandardPineconeService()
        adminService = createAdminService()

        console.info(
            `[PN-EXT-SETUP] Test will use isolated index '${testIndexName}' ` +
            `and namespace '${testNamespace}'`
        )

        indexOptions = createTestIndexOptions({ name: testIndexName })

        // Create the test index first
        testIndex = await service.getOrCreateIndex(indexOptions)
    })

    afterEach(async() => {
        const result = await service.checkIfIndexExists(testIndexName)
        
        if (result) {
            await adminService.deleteIndex(testIndexName)
        }
    })

    describe('checkIfIndexExists() - Refactored to use describeIndex()', () => {
        it('sollte IndexModel zurückgeben für existierenden Index', async() => {
            const result = await service.checkIfIndexExists(testIndexName)
            expect(result?.name).toBe(testIndexName)
            expect(result?.host).toBeDefined()
            expect(result?.metric).toBe(indexOptions.metric)
            expect(result?.dimension).toBe(indexOptions.dimension)
        })

        it('sollte null zurückgeben für nicht-existierenden Index', async() => {
            const nonExistentIndexName = 
                    `non-existent-index-${String(Date.now())}-${Math.random().toString(36).substring(2, 6)}`

            const result = await service.checkIfIndexExists(nonExistentIndexName)
            expect(result).toBeNull()
        })
    })

    describe('getOrCreateIndex()', () => {
        it('sollte existierenden Index zurückgeben, wenn Index bereits vorhanden ist', async() => {
            const secondIndex = await service.getOrCreateIndex(indexOptions)
            expect(testIndex['target']).toStrictEqual(secondIndex['target'])
        })
    })

    describe('getIndex()', () => {
        it('sollte Index-Instanz erfolgreich zurückgeben und cachen', async() => {
            // First call should fetch from API
            const result1 = await service['getIndex'](testIndexName)
            expect(result1).toHaveProperty(['target'])
            
            // Verify instance is cached
            expect(service['_indicesCache'].has(testIndexName)).toBe(true)
            
            // Second call should return cached instance
            const result2 = await service['getIndex'](testIndexName)
            expect(result2).toBe(result1) // Same instance
        })

        it('sollte Fehler werfen für nicht-existierenden Index', async() => {
            const nonExistentIndexName = 
                `non-existent-index-${String(Date.now())}-${Math.random().toString(36).substring(2, 6)}`

            await expect(service['getIndex'](nonExistentIndexName))
                .rejects.toThrow()
        })
    })

    describe('upsertVectors() + queryVectors()', () => {
        it('sollte Vektoren erfolgreich speichern können', async() => {
            const recordsToUpsert = validateNonEmptyArray(createTestRecords(3))
                
            await service.upsertVectors(
                testIndexName,
                recordsToUpsert, 
                testNamespace
            )

            // Wait for eventual consistency before querying
            await setTimeout(3000)

            // Verifiziere durch Query im GLEICHEN Namespace with retry
            const queryVector = getQueryVectorFromRecords(recordsToUpsert, 0)
            const queryResponse: QueryResponse = await retryQueryUntilFound(service, testIndexName, {
                vector: queryVector,
                topK: 3,
                includeValues: true,
                includeMetadata: true
            }, testNamespace)

            expect(queryResponse.matches).toBeDefined()
            expect(queryResponse.namespace).toBe(testNamespace)
            expect(queryResponse.matches.length).toBe(recordsToUpsert.length)
                
            const found = queryResponse.matches.some((match: ReadonlyDeep<{ id: string }>) => 
                recordsToUpsert.find((r: ReadonlyDeep<PineconeRecord>) => r.id === match.id)
            )

            expect(found).toBe(true)
        }, 45000)
    })

    describe('deleteVectors()', () => {
        it('sollte spezifische Vektoren erfolgreich löschen können', async() => {
            const recordsToDelete = validateNonEmptyArray(createTestRecords(3))
                
            // Setup: Vektoren einfügen
            await service.upsertVectors(
                testIndexName,
                recordsToDelete, 
                testNamespace
            )

            const idsToDelete = recordsToDelete.map((r: ReadonlyDeep<PineconeRecord>) => r.id)
            await service.deleteVectors(testIndexName, idsToDelete, testNamespace)

            // Verifizieren, dass Vektoren gelöscht wurden
            const queryVector = getQueryVectorFromRecords(recordsToDelete, 0)
            const queryResponse: QueryResponse = await service.queryVectors(testIndexName, {
                vector: queryVector,
                topK: 3
            }, testNamespace)

            expect(queryResponse.matches.length).toBe(0)
        }, 45000)
    })



    describe('describeIndexStats()', () => {
        it('sollte Index-Statistiken erfolgreich abrufen können', async() => {
            const recordsToUpsert = validateNonEmptyArray(createTestRecords(3))
                
            await service.upsertVectors(
                testIndexName,
                recordsToUpsert, 
                testNamespace
            )
    
            // Wait for eventual consistency before querying
            await setTimeout(3000)
    
            // Verifiziere durch Query im GLEICHEN Namespace with retry
            const queryVector = getQueryVectorFromRecords(recordsToUpsert, 0)
            await retryQueryUntilFound(service, testIndexName, {
                vector: queryVector,
                topK: 3,
                includeValues: true,
                includeMetadata: true
            }, testNamespace)
                
            const stats: IndexStatsDescription = await service.describeIndexStats(testIndexName)
            expect(stats.dimension).toBe(indexOptions.dimension)
            expect(stats.namespaces?.[testNamespace]?.recordCount).toBe(recordsToUpsert.length)
        }, 75000)
    })
}) 
