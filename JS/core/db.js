/**
 * KROMA - IndexedDB Wrapper
 * Maneja la capa de persistencia asíncrona de datos de la aplicación.
 * Abstrae la verbosidad de las APIs nativas de IndexedDB en Promesas limpias.
 */

const DB_NAME = 'kroma_db';
const DB_VERSION = 1;

class KromaDB {
    constructor() {
        this.db = null;
        // La promesa "ready" permite que cualquier operación CRUD espere a que la DB esté inicializada
        this.ready = this.init();
    }

    /**
     * Inicializa la base de datos y crea el esquema si no existe.
     * @returns {Promise<void>}
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = (event) => {
                console.error('[KromaDB] IndexedDB error:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = async (event) => {
                this.db = event.target.result;
                await this.seedIfNeeded();
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Crear Stores (Bóvedas) especificadas en la arquitectura
                // 1. user: Configuraciones globales (theme actual, decoraciones en base64 o svg inline)
                if (!db.objectStoreNames.contains('user')) {
                    db.createObjectStore('user', { keyPath: 'id' });
                }

                // 2. groups: Grupos de atajos
                if (!db.objectStoreNames.contains('groups')) {
                    db.createObjectStore('groups', { keyPath: 'id' });
                }

                // 3. categories: Categorías dentro de grupos
                if (!db.objectStoreNames.contains('categories')) {
                    db.createObjectStore('categories', { keyPath: 'id' });
                }

                // 4. links: Accesos directos finales
                if (!db.objectStoreNames.contains('links')) {
                    db.createObjectStore('links', { keyPath: 'id' });
                }

                // 5. notepads: Notas laterales
                if (!db.objectStoreNames.contains('notepads')) {
                    db.createObjectStore('notepads', { keyPath: 'symbol' });
                }

                // Cuando se crea la BD por primera vez, ejecutamos la inicialización de datos base
                // event.target.transaction.oncomplete asegura que los stores ya existen en el disco
                event.target.transaction.oncomplete = () => {
                    this.seedDatabase(db);
                };
            };
        });
    }

    /**
     * Inserta los datos iniciales obligatorios si la base de datos es totalmente nueva.
     * @param {IDBDatabase} db - Instancia de la base de datos temporal en el evento de upgrade
     */
    async seedDatabase(db) {
        try {
            const transaction = db.transaction(['notepads', 'user'], 'readwrite');
            const notepadsStore = transaction.objectStore('notepads');
            const userStore = transaction.objectStore('user');
            
            // Insertar nota de "Primer uso" literal como se nos especificó en el archivo base
            const defaultNote = {
                symbol: '?',
                title: 'Primer uso',
                content: 'Buenas! Si estas aqui, significa que estas usando mi app. Te voy a explicar como funciona:\n\nPrimero, en la barra lateral tienes las notas, aqui puedes crear, borrar y editar notas en cualquier momento.\n\nAbajo tienes el boton de ajustes, donde podras editar el estilo, links, y otras cosas.\n\nen la barra inferior encontraras tu sistema operativo, bateria, informacion de tu pc, wifi, y el boton de decoraciones, donde podras configurar las decoraciones laterales.\n\nPoco mas hay que explicar, salvo los comandos de busqueda. Pero esos los he dejado en github, lo siento!'
            };
            notepadsStore.add(defaultNote);

            // Configuracion de usuario por defecto
            const defaultUserConfig = {
                id: 'config',
                activeTheme: 'theme-minimalista',
                decoratorLeft: null,
                decoratorRight: null
            };
            userStore.add(defaultUserConfig);

            console.log('[KromaDB] Database seeded with default required payload.');
        } catch (error) {
            console.error('[KromaDB] Error seeding base database:', error);
        }
    }

    /**
     * Valida si existen grupos, y en caso nulo inyecta datos base mock.
     * IMPORTANTE: Usa this.db directamente en vez de los metodos publicos (get/put/getAll)
     * porque estos hacen `await this.ready`, y this.ready es la Promise de init() que
     * aun no ha resuelto en este punto. Usar los metodos publicos causa un deadlock.
     */
    async seedIfNeeded() {
        try {
            const groups = await new Promise((resolve, reject) => {
                const tx = this.db.transaction(['groups'], 'readonly');
                const req = tx.objectStore('groups').getAll();
                req.onsuccess = () => resolve(req.result);
                req.onerror = (e) => reject(e.target.error);
            });

            if (groups.length === 0) {
                // No inyectar datos falsos bajo petición del usuario
                console.log('[KromaDB] DB groups is empty. Unseeded fallback as required.');
            }
        } catch (e) {
            console.error('[KromaDB] Soft error in seedIfNeeded:', e);
        }
    }

    /**
     * Obtiene un registro de un store específico por su clave primaria.
     * @param {string} storeName - Nombre de la bóveda
     * @param {string|number} key - Clave primaria (e.g. id o symbol)
     * @returns {Promise<any>}
     */
    async get(storeName, key) {
        await this.ready;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject(e.target.error);
        });
    }

    /**
     * Obtiene todos los registros de un store específico.
     * @param {string} storeName - Nombre de la bóveda
     * @returns {Promise<Array>}
     */
    async getAll(storeName) {
        await this.ready;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject(e.target.error);
        });
    }

    /**
     * Inserta o actualiza un registro completo (UPSERT) en un store.
     * @param {string} storeName - Nombre de la bóveda
     * @param {Object} item - Objeto literal estructurado a almacenar
     * @returns {Promise<void>}
     */
    async put(storeName, item) {
        await this.ready;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(item);

            request.onsuccess = () => resolve();
            request.onerror = (e) => reject(e.target.error);
        });
    }

    /**
     * Elimina un registro de un store por clave primaria.
     * @param {string} storeName - Nombre de la bóveda
     * @param {string|number} key - Clave primaria
     * @returns {Promise<void>}
     */
    async delete(storeName, key) {
        await this.ready;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(key);

            request.onsuccess = () => resolve();
            request.onerror = (e) => reject(e.target.error);
        });
    }

    /**
     * Borra todos los registros de una bóveda entera (Cuidado).
     * @param {string} storeName - Nombre de la bóveda referida
     * @returns {Promise<void>}
     */
    async clearStore(storeName) {
        await this.ready;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = (e) => reject(e.target.error);
        });
    }
}

// Singleton global de persistencia
const dbManager = new KromaDB();
export default dbManager;
