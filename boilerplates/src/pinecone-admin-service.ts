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
import type { PineconeConfiguration } from '@pinecone-database/pinecone'
import { BaseError } from 'error-manager-helper'
import lodash from 'lodash'
import type { ReadonlyDeep } from 'type-fest'

import { logger } from '@/utils/logger.ts'
import { PineconeService } from './pinecone-service.ts'

/**
 * @class PineconeAdminService
 * @description Administrative service for Pinecone operations, extending PineconeService.
 * Contains methods for deleting indices, namespaces, and vectors.
 */
export class PineconeAdminService extends PineconeService {
    /**
     * @constructor - Creates a new PineconeAdminService instance.
     * @param pineconeConfig - The Pinecone configuration options (including API key).
     */
    public constructor(
        pineconeConfig: ReadonlyDeep<PineconeConfiguration>
    ) {
        super(pineconeConfig)
    }

    /**
     * @method deleteAllVectorsInNamespace
     * @description Deletes all vectors in a specified namespace if the namespace exists.
     * @param indexName - The name of the index.
     * @param namespace - The namespace to delete vectors from.
     * @returns A promise that resolves when vectors are deleted or if the namespace doesn't exist.
     * @throws {BaseError} If there's an unexpected error during the operation.
     */
    public async deleteAllVectorsInNamespace(
        indexName: Readonly<string>,
        namespace: Readonly<string>
    ): Promise<boolean> {
        const CTX = `[PineconeAdminService::deleteAllVectorsInNamespace(index=${indexName}, ns=${namespace})]`

        // 1. Check if index exists
        logger.info(`${CTX} Checking if index '${indexName}' exists...`)
        const existingIndex = await this.checkIfIndexExists(indexName)
            
        if (!existingIndex) {
            logger.warn(`${CTX} Index '${indexName}' does not exist. Skipping deletion.`)
            return false
        }

        const { host } = existingIndex
        logger.info(`${CTX} Index host for '${indexName}' is '${host}'.`)

        try {
            // 2. Index-Instanz für Data-Plane-Operationen erstellen, explizit mit Host UND Namen
            // Laut SDK-Doku (v6.1.0) ist dies der Weg, um einen Index für Operationen zu targeten,
            // wenn man den Host bereits kennt, um den internen describeIndex-Aufruf des SDKs zu vermeiden.
            const indexInstance = this.pinecone.index(indexName, host)
            // Alternativ, falls obiges nicht klappt oder zu Fehlern führt, könnte es sein, dass
            // pc.index(host) allein reicht, aber die Doku zeigt pc.index(name, host) für diesen Zweck.
            // const indexInstance: Index = this.pinecone.index(indexHost); 
            // // Teste dies, falls die obere Zeile Probleme macht
            logger.info(`
                ${CTX} Index instance for '${indexName}' (targeting host ${host}) obtained.
                 Checking namespace existence...
            `)

            // 3. Check if namespace exists by examining index stats
            const stats = await indexInstance.describeIndexStats()
            
            if (stats.namespaces?.[namespace]) {
                const namespaceStats = stats.namespaces[namespace]
                const recordCount = String(namespaceStats.recordCount)
                logger.info(
                    `${CTX} Namespace '${namespace}' found with ${recordCount} records. Proceeding with deletion.`
                )

                // 4. Delete all vectors in the existing namespace
                const ns = indexInstance.namespace(namespace)
                await ns.deleteAll()

                logger.info(`${CTX} All vectors in namespace '${namespace}' successfully deleted.`)
                return true
            } 
            
            logger.info(
                `${CTX} Namespace '${namespace}' does not exist or is empty in index '${indexName}. 
                    No deletion performed.`
            )

            return false
        } catch (error) {
            const CONTEXT_MESSAGE = `${CTX} Error during operation.`
            throw new BaseError(CONTEXT_MESSAGE, error as Error)
        }
    }

    /**
     * @method deleteIndex
     * @description Deletes a specific index by name.
     * @param indexName - The name of the index to delete.
     * @returns A promise that resolves when the index is deleted.
     * @throws {BaseError} If there's an error during the deletion.
     */
    public async deleteIndex(indexName: Readonly<string>): Promise<void> {
        const CTX = `[PineconeAdminService::deleteIndex(indexName=${indexName})]`
        
        try {
            logger.info(`${CTX} Deleting index '${indexName}'...`)
            await this.pinecone.deleteIndex(indexName)
            logger.info(`${CTX} Index '${indexName}' successfully deleted.`)
        } catch (error) {
            const CONTEXT_MESSAGE = `${CTX} Error deleting index.`
            throw new BaseError(CONTEXT_MESSAGE, error as Error)
        }
    }

    /**
     * @method deleteAllIndices
     * @description Deletes all indices in the project by listing them first and then deleting each one.
     * @returns A promise that resolves when all indices are deleted.
     * @throws {BaseError} If there's an error during the deletion process.
     */
    public async deleteAllIndices(): Promise<void> {
        const CTX = '[PineconeAdminService::deleteAllIndices()]'
        
        try {
            logger.info(`${CTX} Getting list of all indices...`)
            const indexList = await this.pinecone.listIndexes()
            
            if (!indexList.indexes || lodash.isEmpty(indexList.indexes)) {
                logger.info(`${CTX} No indices found to delete.`)
                return
            }

            const indexCount = String(indexList.indexes.length)
            logger.info(`${CTX} Found ${indexCount} indices to delete.`)
            
            for (const index of indexList.indexes) {
                await this.deleteIndex(index.name)
            }
            
            logger.info(`${CTX} All ${indexCount} indices successfully deleted.`)
        } catch (error) {
            const CONTEXT_MESSAGE = `${CTX} Error deleting all indices.`
            throw new BaseError(CONTEXT_MESSAGE, error as Error)
        }
    }

    /**
     * @method deleteNamespace
     * @description Deletes a specific namespace from an index.
     * @param indexName - The name of the index containing the namespace.
     * @param namespace - The namespace to delete.
     * @returns A promise that resolves when the namespace is deleted.
     * @throws {BaseError} If there's an error during the deletion.
     */
    public async deleteNamespace(
        indexName: Readonly<string>,
        namespace: Readonly<string>
    ): Promise<void> {
        const CTX = `[PineconeAdminService::deleteNamespace(index=${indexName}, ns=${namespace})]`
        
        logger.info(`${CTX} Getting index instance...`)
        const index = await this.getIndex(indexName)
            
        try {
            // Check if namespace exists by examining index stats
            logger.info(`${CTX} Checking if namespace exists...`)
            const stats = await index.describeIndexStats()
            
            if (stats.namespaces?.[namespace]) {
                logger.info(`${CTX} Deleting namespace '${namespace}'...`)
                await index.deleteNamespace(namespace)
                logger.info(`${CTX} Namespace '${namespace}' successfully deleted.`)
            } else {
                logger.info(`${CTX} Namespace '${namespace}' does not exist. No deletion performed.`)
            }
        } catch (error) {
            const CONTEXT_MESSAGE = `${CTX} Error deleting namespace.`
            throw new BaseError(CONTEXT_MESSAGE, error as Error)
        }
    }

    /**
     * @method deleteAllNamespaces
     * @description Deletes all namespaces from an index by listing them first and then deleting each one.
     * @param indexName - The name of the index to delete all namespaces from.
     * @returns A promise that resolves when all namespaces are deleted.
     * @throws {BaseError} If there's an error during the deletion process.
     */
    public async deleteAllNamespaces(indexName: Readonly<string>): Promise<void> {
        const CTX = `[PineconeAdminService::deleteAllNamespaces(index=${indexName})]`
        
        logger.info(`${CTX} Getting index instance...`)
        const index = await this.getIndex(indexName)
            
        try {
            logger.info(`${CTX} Getting list of all namespaces...`)
            const namespaces = await index.listNamespaces()
            
            if (!namespaces.namespaces || lodash.isEmpty(namespaces.namespaces)) {
                logger.info(`${CTX} No namespaces found to delete.`)
                return
            }

            const namespaceCount = String(namespaces.namespaces.length)
            logger.info(`${CTX} Found ${namespaceCount} namespaces to delete.`)
            
            for (const ns of namespaces.namespaces) {
                const namespaceName = ns.name?.trim()
                if (namespaceName !== undefined && namespaceName.length > 0) {
                    await this.deleteNamespace(indexName, namespaceName)
                }
            }
            
            logger.info(`${CTX} All ${namespaceCount} namespaces successfully deleted.`)
        } catch (error) {
            const CONTEXT_MESSAGE = `${CTX} Error deleting all namespaces.`
            throw new BaseError(CONTEXT_MESSAGE, error as Error)
        }
    }
} 