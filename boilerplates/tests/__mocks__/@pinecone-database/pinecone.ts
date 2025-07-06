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
    type PineconeConfiguration,
    Pinecone,
    Inference
} from '@pinecone-database/pinecone'
import { vi, type MockedFunction } from 'vitest'

// ==== Types ====
type PineconeModule = typeof import('@pinecone-database/pinecone')

// ==== Mock Factory ====
export class PineconeMockFactory {
    // Individual mock functions to avoid unbound method issues
    public mockNamespaceFn: MockedFunction<Index['namespace']>
    public mockDescribeIndexStatsFn: MockedFunction<Index['describeIndexStats']>
    public mockUpsertFn: MockedFunction<Index['upsert']>
    public mockQueryFn: MockedFunction<Index['query']>
    public mockDeleteManyFn: MockedFunction<Index['deleteMany']>
    public mockDeleteAllFn: MockedFunction<Index['deleteAll']>
    public mockDeleteNamespaceFn: MockedFunction<Index['deleteNamespace']>
    public mockListNamespacesFn: MockedFunction<Index['listNamespaces']>
    
    // Pinecone instance mock functions
    public mockDescribeIndexFn: MockedFunction<Pinecone['describeIndex']>
    public mockCreateIndexFn: MockedFunction<Pinecone['createIndex']>
    public mockListIndexesFn: MockedFunction<Pinecone['listIndexes']>
    public mockIndexFn: MockedFunction<Pinecone['index']>
    
    // Mock instances
    public mockPineconeInstance: Pinecone
    public mockIndexInstance: Index
    public mockNamespaceInstance: Index
    
    // Mock module reference
    public mockPinecone: PineconeModule | undefined
    
    public constructor() {
        // Initialize all mock functions FIRST
        this.mockUpsertFn = vi.fn()
        this.mockQueryFn = vi.fn()
        this.mockDeleteManyFn = vi.fn()
        this.mockDeleteAllFn = vi.fn()
        this.mockDeleteNamespaceFn = vi.fn()
        this.mockListNamespacesFn = vi.fn()
        this.mockNamespaceFn = vi.fn()
        this.mockDescribeIndexStatsFn = vi.fn()
        this.mockDescribeIndexFn = vi.fn()
        this.mockCreateIndexFn = vi.fn()
        this.mockListIndexesFn = vi.fn()
        this.mockIndexFn = vi.fn()
        
        // Create mock instances AFTER mock functions are initialized
        this.mockIndexInstance = this._createMockIndexObject()
        this.mockNamespaceInstance = this.mockIndexInstance // Same object for namespace
        this.mockPineconeInstance = this._createMockPineconeClient()
        
        // Configure mock functions to return appropriate instances
        this.mockNamespaceFn.mockReturnValue(this.mockNamespaceInstance)
        this.mockIndexFn.mockReturnValue(this.mockIndexInstance)
    }
    
    public resetAllMocks(): void {
        // Reset all mock functions
        this.mockUpsertFn.mockReset()
        this.mockQueryFn.mockReset()
        this.mockDeleteManyFn.mockReset()
        this.mockDeleteAllFn.mockReset()
        this.mockDeleteNamespaceFn.mockReset()
        this.mockListNamespacesFn.mockReset()
        this.mockNamespaceFn.mockReset()
        this.mockDescribeIndexStatsFn.mockReset()
        this.mockDescribeIndexFn.mockReset()
        this.mockCreateIndexFn.mockReset()
        this.mockListIndexesFn.mockReset()
        this.mockIndexFn.mockReset()
        
        // Reconfigure return values
        this.mockNamespaceFn.mockReturnValue(this.mockNamespaceInstance)
        this.mockIndexFn.mockReturnValue(this.mockIndexInstance)
    }
    
    private _createMockIndexObject(): Index {
        return {
            // Core vector operations - use the pre-created mock functions
            namespace: this.mockNamespaceFn,
            upsert: this.mockUpsertFn,
            fetch: vi.fn(),
            query: this.mockQueryFn,
            update: vi.fn(),
            
            // Delete operations - use the pre-created mock functions
            deleteAll: this.mockDeleteAllFn,
            deleteMany: this.mockDeleteManyFn,
            deleteOne: vi.fn(),
            
            // Stats and info - use the pre-created mock function
            describeIndexStats: this.mockDescribeIndexStatsFn,
            listPaginated: vi.fn(),
            
            // Integrated records (new features)
            upsertRecords: vi.fn(),
            searchRecords: vi.fn(),
            
            // Import operations
            startImport: vi.fn(),
            listImports: vi.fn(),
            describeImport: vi.fn(),
            cancelImport: vi.fn(),
            
            // Namespace operations - use the pre-created mock functions
            listNamespaces: this.mockListNamespacesFn,
            describeNamespace: vi.fn(),
            deleteNamespace: this.mockDeleteNamespaceFn,
            
            // Hidden/Private methods from Index class
            _deleteMany: vi.fn(),
            _deleteOne: vi.fn(),
            _describeIndexStats: vi.fn(),
            _listPaginated: vi.fn(),
            _deleteAll: vi.fn(),
            _fetchCommand: vi.fn(),
            _queryCommand: vi.fn(),
            _updateCommand: vi.fn(),
            _upsertCommand: vi.fn(),
            _upsertRecordsCommand: vi.fn(),
            _searchRecordsCommand: vi.fn(),
            _startImportCommand: vi.fn(),
            _listImportsCommand: vi.fn(),
            _describeImportCommand: vi.fn(),
            _cancelImportCommand: vi.fn(),
            _listNamespacesCommand: vi.fn(),
            _describeNamespaceCommand: vi.fn(),
            _deleteNamespaceCommand: vi.fn(),
            
            // Internal properties
            config: {},
            target: 'mock-target'
        } as unknown as Index
    }
    
    private _createMockPineconeClient(): Pinecone {
        return {
            // Private methods (hidden)
            _configureIndex: vi.fn(),
            _createCollection: vi.fn(),
            _createIndex: vi.fn(),
            _createIndexForModel: vi.fn(),
            _describeCollection: vi.fn(),
            _describeIndex: vi.fn(),
            _deleteCollection: vi.fn(),
            _deleteIndex: vi.fn(),
            _listCollections: vi.fn(),
            _listIndexes: vi.fn(),
            _createAssistant: vi.fn(),
            _deleteAssistant: vi.fn(),
            _updateAssistant: vi.fn(),
            _describeAssistant: vi.fn(),
            _listAssistants: vi.fn(),
            _createBackup: vi.fn(),
            _createIndexFromBackup: vi.fn(),
            _describeBackup: vi.fn(),
            _describeRestoreJob: vi.fn(),
            _deleteBackup: vi.fn(),
            _listBackups: vi.fn(),
            _listRestoreJobs: vi.fn(),
            
            // Public inference property
            inference: {} as Inference,
            
            // Internal methods
            _readEnvironmentConfig: vi.fn(),
            config: {} as PineconeConfiguration,
            _checkForBrowser: vi.fn(),
            getConfig: vi.fn(),
            
            // Public index management methods - use pre-created mock functions
            describeIndex: this.mockDescribeIndexFn,
            listIndexes: this.mockListIndexesFn,
            createIndex: this.mockCreateIndexFn,
            createIndexForModel: vi.fn(),
            deleteIndex: vi.fn(),
            configureIndex: vi.fn(),
            
            // Public collection management methods
            createCollection: vi.fn(),
            listCollections: vi.fn(),
            deleteCollection: vi.fn(),
            describeCollection: vi.fn(),
            
            // Public assistant management methods
            createAssistant: vi.fn(),
            deleteAssistant: vi.fn(),
            describeAssistant: vi.fn(),
            listAssistants: vi.fn(),
            updateAssistant: vi.fn(),
            
            // Public backup management methods
            createBackup: vi.fn(),
            createIndexFromBackup: vi.fn(),
            describeBackup: vi.fn(),
            describeRestoreJob: vi.fn(),
            deleteBackup: vi.fn(),
            listBackups: vi.fn(),
            listRestoreJobs: vi.fn(),
            
            // Public index targeting methods - use pre-created mock function
            index: this.mockIndexFn,
            Index: vi.fn(),
            
            // Public assistant targeting methods
            assistant: vi.fn(),
            Assistant: vi.fn()
        } as unknown as Pinecone
    }
}

// ==== Global Mock Factory Instance ====
export const pineconeMockFactory = new PineconeMockFactory()

// ==== Mock Module Export ====
export const mockPineconeModule = async(): Promise<PineconeModule> => {
    const original = await vi.importActual<PineconeModule>('@pinecone-database/pinecone')
    
    const mockedModule = {
        ...original,
        // Mock the Pinecone constructor to return our mock instance
        Pinecone: vi.fn().mockImplementation(() => pineconeMockFactory.mockPineconeInstance),
        // Export other classes as-is but could be mocked if needed
        Index: original.Index,
        Inference: original.Inference
    }
    
    // Store reference to the mocked module in the factory for test access
    pineconeMockFactory.mockPinecone = mockedModule
    
    return mockedModule
}

// ==== Default Export ====
export default mockPineconeModule 