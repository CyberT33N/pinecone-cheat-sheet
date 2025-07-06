/* eslint-disable @typescript-eslint/naming-convention */
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
    Index
} from '@pinecone-database/pinecone'
import { vi, type MockedFunction } from 'vitest'
import { PineconeService } from '@/services/pinecone-service.ts'

// ==== Types ====
type PineconeServiceModule = typeof import('@/services/pinecone-service.ts')

// ==== Mock Factory ====
export class PineconeServiceMockFactory {
    // Individual mock functions for all public methods
    public mockCheckIfIndexExistsFn: MockedFunction<PineconeService['checkIfIndexExists']>
    public mockGetOrCreateIndexFn: MockedFunction<PineconeService['getOrCreateIndex']>
    public mockUpsertVectorsFn: MockedFunction<PineconeService['upsertVectors']>
    public mockQueryVectorsFn: MockedFunction<PineconeService['queryVectors']>
    public mockDeleteVectorsFn: MockedFunction<PineconeService['deleteVectors']>
    public mockDescribeIndexStatsFn: MockedFunction<PineconeService['describeIndexStats']>
    
    // Mock instance
    public mockPineconeServiceInstance: PineconeService
    
    // Mock module reference
    public mockPineconeServiceModule: PineconeServiceModule | undefined
    
    public constructor() {
        // Initialize all mock functions FIRST
        this.mockCheckIfIndexExistsFn = vi.fn()
        this.mockGetOrCreateIndexFn = vi.fn()
        this.mockUpsertVectorsFn = vi.fn()
        this.mockQueryVectorsFn = vi.fn()
        this.mockDeleteVectorsFn = vi.fn()
        this.mockDescribeIndexStatsFn = vi.fn()
        
        // Create mock instance AFTER mock functions are initialized
        this.mockPineconeServiceInstance = this._createMockPineconeService()
        
        // Configure default successful responses
        this._configureDefaultResponses()
    }
    
    public resetAllMocks(): void {
        // Reset all mock functions
        this.mockCheckIfIndexExistsFn.mockReset()
        this.mockGetOrCreateIndexFn.mockReset()
        this.mockUpsertVectorsFn.mockReset()
        this.mockQueryVectorsFn.mockReset()
        this.mockDeleteVectorsFn.mockReset()
        this.mockDescribeIndexStatsFn.mockReset()
        
        // Reconfigure default responses
        this._configureDefaultResponses()
    }
    
    private _configureDefaultResponses(): void {
        // Mock checkIfIndexExists - returns a realistic IndexModel
        this.mockCheckIfIndexExistsFn.mockResolvedValue({
            name: 'test-index',
            dimension: 1536,
            metric: 'cosine',
            host: 'test-index-abc123.svc.pinecone.io',
            spec: {
                serverless: {
                    cloud: 'aws',
                    region: 'us-east-1'
                }
            },
            status: {
                ready: true,
                state: 'Ready'
            },
            vectorType: 'float32'
        })
        
        // Mock getOrCreateIndex - returns a mock Index instance
        this.mockGetOrCreateIndexFn.mockResolvedValue({
            namespace: vi.fn().mockReturnThis(),
            upsert: vi.fn(),
            query: vi.fn(),
            deleteMany: vi.fn(),
            describeIndexStats: vi.fn()
        } as unknown as Index)
        
        // Mock upsertVectors - returns void (successful)
        this.mockUpsertVectorsFn.mockResolvedValue(undefined)
        
        // Mock queryVectors - returns realistic QueryResponse
        this.mockQueryVectorsFn.mockResolvedValue({
            matches: [
                {
                    id: 'mock-vector-1',
                    score: 0.95,
                    values: [0.1, 0.2, 0.3],
                    metadata: { text: 'mock result 1', source: 'test' }
                },
                {
                    id: 'mock-vector-2', 
                    score: 0.88,
                    values: [0.4, 0.5, 0.6],
                    metadata: { text: 'mock result 2', source: 'test' }
                }
            ],
            namespace: 'test-namespace',
            usage: {
                readUnits: 5
            }
        })
        
        // Mock deleteVectors - returns void (successful)
        this.mockDeleteVectorsFn.mockResolvedValue(undefined)
        
        // Mock describeIndexStats - returns realistic stats
        this.mockDescribeIndexStatsFn.mockResolvedValue({
            dimension: 1536,
            indexFullness: 0.1,
            totalRecordCount: 1000,
            namespaces: {
                'test-namespace': {
                    recordCount: 1000
                }
            }
        })
    }
    
    private _createMockPineconeService(): PineconeService {
        return {
            // Public methods - use the pre-created mock functions
            checkIfIndexExists: this.mockCheckIfIndexExistsFn,
            getOrCreateIndex: this.mockGetOrCreateIndexFn,
            upsertVectors: this.mockUpsertVectorsFn,
            queryVectors: this.mockQueryVectorsFn,
            deleteVectors: this.mockDeleteVectorsFn,
            describeIndexStats: this.mockDescribeIndexStatsFn
        } as unknown as PineconeService
    }
}

// ==== Global Mock Factory Instance ====
export const pineconeServiceMockFactory = new PineconeServiceMockFactory()

// ==== Mock Module Export ====
export const mockPineconeServiceModule = (): PineconeServiceModule => {
    const mockedModule = {
        // Mock the PineconeService constructor to return our mock instance
        PineconeService: vi.fn().mockImplementation(() => pineconeServiceMockFactory.mockPineconeServiceInstance)
    }
    
    // Store reference to the mocked module in the factory for test access
    pineconeServiceMockFactory.mockPineconeServiceModule = mockedModule
    
    return mockedModule
}

// ==== Default Export ====
export default mockPineconeServiceModule
