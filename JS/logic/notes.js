/**
 * KROMA - Notes Controller (Lógica de Negocio)
 * Maneja el flujo de base de datos para crear, salvar y destruir Notepads
 */
import dbManager from '../core/db.js';
import bus from '../core/bus.js';

class NotesController {
    constructor() {
        this.currentActiveNoteId = null;

        // Mantener trackeo para operaciones CRUD respecto a la nota activa
        bus.on('ui:open-note', (note) => { this.currentActiveNoteId = note.symbol; });
        bus.on('ui:close-note', () => { this.currentActiveNoteId = null; });
    }

    /**
     * Crea un Notepad nuevo calculando un índice autoencrementado numéricamente
     */
    async createNote() {
        const notes = await dbManager.getAll('notepads');
        let nextNumber = 1;
        
        notes.forEach(n => {
            const num = parseInt(n.symbol);
            if (!isNaN(num) && num >= nextNumber) {
                nextNumber = num + 1;
            }
        });
        
        const symbol = String(nextNumber); 

        const newNote = {
            symbol: symbol,
            title: `Nueva Nota ${symbol}`,
            content: ''
        };

        // Persistir y refrescar
        await dbManager.put('notepads', newNote);
        bus.emit('ui:open-note', newNote); // Actualiza estado visual
        bus.emit('db:notes-updated');      // Gatilla re-render al DOM
    }

    /**
     * Hace UPSERT de la nota basada en el ID visual activo del DOM
     */
    async saveCurrentNote(title, content) {
        if (!this.currentActiveNoteId) return;
        
        const note = {
            symbol: this.currentActiveNoteId,
            title: title, // Validar inputs vacíos a nivel de UI, aquí asume limpio
            content: content
        };

        await dbManager.put('notepads', note);
        bus.emit('db:notes-updated');
    }

    /**
     * Elimina la nota actual y colapsa el panel lateral
     */
    async deleteCurrentNote() {
        if (!this.currentActiveNoteId) return;
        
        await dbManager.delete('notepads', this.currentActiveNoteId);
        this.currentActiveNoteId = null;
        
        bus.emit('ui:close-note');
        bus.emit('db:notes-updated');
    }
}

export const notesController = new NotesController();
