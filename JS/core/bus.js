/**
 * KROMA - EventBus (Pub/Sub System)
 * Centraliza y abstrae la comunicación de componentes sin generar acoplamientos duros.
 */
class EventBus {
    constructor(debug = false) {
        // Almacena los callbacks agrupados por nombres de evento
        this.listeners = {};
        // Activa/desactiva los logs por consola sobre las suscripciones y envíos
        this.debug = debug;
    }

    /**
     * Suscribe una función anónima o nombrada a un evento específico.
     * @param {string} eventName - Etiqueta de evento (ej. 'theme:changed', 'db:loaded')
     * @param {Function} callback - Lógica a disparar de forma reactiva
     */
    on(eventName, callback) {
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = [];
        }
        this.listeners[eventName].push(callback);

        if (this.debug) {
            console.log(`[EventBus] Subscribed: '${eventName}' (Total: ${this.listeners[eventName].length})`);
        }
    }

    /**
     * Elimina el registro de un listener (previniendo memory leaks en desmontajes).
     * @param {string} eventName - Nombre del evento
     * @param {Function} [callback] - Func a eliminar (si se omite borra TODO el evento)
     */
    off(eventName, callback) {
        if (!this.listeners[eventName]) return;

        if (callback) {
            this.listeners[eventName] = this.listeners[eventName].filter(cb => cb !== callback);
            if (this.debug) {
                console.log(`[EventBus] Unsubscribed handler from: '${eventName}'`);
            }
        } else {
            delete this.listeners[eventName];
            if (this.debug) {
                console.warn(`[EventBus] Cleared all handlers for: '${eventName}'`);
            }
        }
    }

    /**
     * Emite un evento, ejecutando sincronamente pero de forma completamente segura los listeners.
     * @param {string} eventName - Etiqueta del evento a emitir
     * @param {any} [data] - Datos (carga útil) que viajan a los callbacks
     */
    emit(eventName, data) {
        if (this.debug) {
            console.info(`[EventBus] Emitted: '${eventName}'`, data !== undefined ? data : '');
        }

        if (!this.listeners[eventName]) return;

        // Se itera sobre una copia para evitar problemas mutacionales si un listener hace bus.off() dentro
        const handlers = [...this.listeners[eventName]];
        handlers.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                // Previene que el fallo de un oyente colapse toda la cadena del Bus
                console.error(`[EventBus] Error in listener for '${eventName}':`, error);
            }
        });
    }

    /**
     * Hard-reset del bus. Principalmente para tests o limpiezas drásticas de estado general.
     */
    clear() {
        this.listeners = {};
        if (this.debug) {
            console.warn('[EventBus] HARD RESET - All listeners wiped');
        }
    }
}

// Singleton pattern: Kroma usa un unico Bus de eventos en la app.
// Debug desactivado para produccion (activar con true durante desarrollo).
const bus = new EventBus(false);
export default bus;
