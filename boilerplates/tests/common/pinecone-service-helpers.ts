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
import type { PineconeRecord, CreateIndexOptions, RecordValues, IndexModel } from '@pinecone-database/pinecone'
import type { ReadonlyDeep, WritableDeep } from 'type-fest'
import env from '@/env.ts'
import { PineconeAdminService } from '@/services/pinecone-admin-service.ts'
import { PineconeService } from '@/services/pinecone-service.ts'
import type { NonEmptyArrayReadOnly } from '@/utils/types.ts'

// ==== Test Data ====
export const TEST_DATA = {
    indexName: 'test-index',
    namespace: 'test-namespace',
    dimension: 8, // Beispiel-Dimension, anpassen falls nötig
    metric: 'cosine',
    cloudProvider: env.PINECONE_CLOUD, // Aus .env oder Default
    region: env.PINECONE_REGION, // Aus .env oder Default
    sampleRecord1: {
        id: 'vec1',
        values: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
    } as PineconeRecord,
    sampleRecord2: {
        id: 'vec2',
        values: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2]
    } as PineconeRecord,
    sampleRecord3: {
        id: 'vec3',
        values: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3]
    } as PineconeRecord
} as const

export const mockIndexModel: IndexModel = {
    name: TEST_DATA.indexName,
    dimension: TEST_DATA.dimension,
    metric: 'cosine',
    host: 'test-host-created',
    spec: { serverless: { cloud: TEST_DATA.cloudProvider, region: TEST_DATA.region } },
    status: { ready: true, state: 'Ready' },
    vectorType: 'float'
}

// ==== Helper Functions ====

/**
 * Creates a standard PineconeService instance for testing.
 * @returns The PineconeService instance.
 */
export function createStandardPineconeService(): PineconeService {
    return new PineconeService(
        { apiKey: env.PINECONE_API_KEY }
    )
}

/**
 * Creates a standard PineconeService instance for testing.
 * @returns The PineconeService instance.
 */
export function createAdminService(): PineconeAdminService {
    return new PineconeAdminService(
        { apiKey: env.PINECONE_API_KEY }
    )
}

/**
 * Creates CreateIndexOptions for testing.
 * @param overrides - Optional overrides for CreateIndexOptions.
 * @returns The CreateIndexOptions object.
 */
export function createTestIndexOptions(
    overrides?: ReadonlyDeep<Partial<CreateIndexOptions>>
): CreateIndexOptions {
    const options: CreateIndexOptions = {
        name: TEST_DATA.indexName,
        dimension: TEST_DATA.dimension,
        metric: TEST_DATA.metric,
        spec: {
            serverless: {
                cloud: TEST_DATA.cloudProvider, 
                region: TEST_DATA.region
            }
        },
        ...(overrides ? (overrides as WritableDeep<typeof overrides>) : {})
    }
    
    return options
}

/**
 * Creates an array of PineconeRecords for testing.
 * @param count - The number of records to create.
 * @returns An array of PineconeRecords.
 */
export function createTestRecords(count = 1): PineconeRecord[] {
    const records: PineconeRecord[] = []

    for (let i = 0; i < count; i++) {
        records.push({
            id: `test-vec-${String(i)}`,
            values: Array(TEST_DATA.dimension).fill(0.1 * (i + 1))
        })
    }
    
    return records
}

/**
 * Safely extracts the query vector from a PineconeRecord array.
 * @param records - The array of PineconeRecords.
 * @param index - The index of the record to extract the query vector from.
 * @returns The query vector.
 */
export function getQueryVectorFromRecords(
    records: ReadonlyDeep<NonEmptyArrayReadOnly<PineconeRecord>>,
    index = 0
): RecordValues {
    const record = records.at(index)

    if (!record) {
        throw new Error(
            `Test data validation failed: Record at index ${String(index)} does not exist. ` +
            `Array length: ${String(records.length)}`
        )
    }
    
    const queryVector = record.values
    
    if (!queryVector || queryVector.length === 0) {
        const vectorState = queryVector === undefined ? 'undefined' : 'empty'
        throw new Error(
            `Test data validation failed: Query vector is ${vectorState} ` +
            `for record ID: ${record.id} at index ${String(index)}`
        )
    }
    
    return [...queryVector] as RecordValues
}
