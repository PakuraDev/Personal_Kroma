/**
 * KROMA - DB Tools
 * Maneja la exportación serializada y de-serialización de la BD entera.
 */
import dbManager from '../core/db.js';

class DBTools {
    async exportDatabase() {
        const data = {};
        const stores = ['user', 'groups', 'categories', 'links', 'notepads'];

        // Extraer todo a un JS Object abstracto
        for (const store of stores) {
            data[store] = await dbManager.getAll(store);
        }

        // Serializar a JSON
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `kroma_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async importDatabase(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            const stores = ['user', 'groups', 'categories', 'links', 'notepads'];
            
            // Validacion base estructural
            for (const store of stores) {
                if (!data[store] || !Array.isArray(data[store])) {
                    console.error(`[DBTools] Error fatal: JSON incompleto, falta ${store}`);
                    alert('El archivo JSON no pertenece a una copia valida de Kroma.');
                    return false;
                }
            }

            // Operaciones destructivas seguras y sustitución
            for (const store of stores) {
                await dbManager.clearStore(store);
                for (const item of data[store]) {
                    await dbManager.put(store, item);
                }
            }

            console.log('[DBTools] Ingesta manual completada.');
            window.location.reload(); 
            return true;
            
        } catch (e) {
            console.error('[DBTools] Excepcion:', e);
            alert('Error crítico inyectando JSON. El archivo puede estar corrupto.');
            return false;
        }
    }

    async clearDatabase() {
        if (confirm("⚠️ ¿Estás seguro de que quieres BORRAR ABSOLUTAMENTE TODO? Esta acción es irreversible.")) {
            if (confirm("Kroma volverá al inicio de los tiempos de forma destructiva y permanente. ¿Confirmas?")) {
                const stores = ['user', 'groups', 'categories', 'links', 'notepads'];
                
                for (const store of stores) {
                    await dbManager.clearStore(store);
                }
                
                // Recarga hard y se disparará de forma natural en Init el Seed predeterminado de db.js
                window.location.reload();
            }
        }
    }
}

export const dbTools = new DBTools();
