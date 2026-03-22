/**
 * KROMA - Renderizador UI
 * Inyecta nodos del DOM dinamicamente leyendo desde IndexedDB (KromaDB).
 */
import dbManager from '../core/db.js';
import bus from '../core/bus.js';

class UIRenderer {
    constructor() {
        this.nodes = {
            notesList: document.getElementById('notes-list'),
            mainGroupsList: document.getElementById('main-groups-list'),
            mainCategoriesContainer: document.getElementById('main-categories-container')
        };
        this.activeGroupId = null;
        this.activeNoteSymbol = null;
        this._boundListeners = false;

        // Trackeo reactivo de nota activa
        bus.on('ui:open-note', (n) => { this.activeNoteSymbol = n.symbol; });
        bus.on('ui:close-note', () => { this.activeNoteSymbol = null; });
    }

    async bootstrap() {
        await this.renderSidebarNotes();
        await this.renderMainGrid();

        // Prevenir duplicacion de listeners si bootstrap() se llama multiples veces
        if (!this._boundListeners) {
            bus.on('db:notes-updated', () => this.renderSidebarNotes());
            bus.on('db:grid-updated', () => this.renderMainGrid());
            this._boundListeners = true;
        }
    }

    async renderSidebarNotes() {
        if (!this.nodes.notesList) return;

        const notes = await dbManager.getAll('notepads');
        this.nodes.notesList.innerHTML = '';

        notes.forEach(note => {
            const div = document.createElement('div');
            div.className = 'sidebar-note-tab text-normal';
            if (this.activeNoteSymbol === note.symbol) {
                div.classList.add('active');
            }
            div.textContent = note.symbol;
            div.dataset.symbol = note.symbol;

            div.addEventListener('click', () => {
                const isActive = div.classList.contains('active');
                Array.from(this.nodes.notesList.children).forEach(c => c.classList.remove('active'));

                if (isActive) {
                    bus.emit('ui:close-note');
                } else {
                    div.classList.add('active');
                    bus.emit('ui:open-note', note);
                }
            });
            this.nodes.notesList.appendChild(div);
        });
    }

    async renderMainGrid() {
        if (!this.nodes.mainGroupsList || !this.nodes.mainCategoriesContainer) return;

        const groups = await dbManager.getAll('groups');
        const categories = await dbManager.getAll('categories');
        const links = await dbManager.getAll('links');

        groups.sort((a, b) => a.order - b.order);

        this.nodes.mainGroupsList.innerHTML = '';
        this.nodes.mainCategoriesContainer.innerHTML = '';

        if (groups.length === 0) return;

        if (!this.activeGroupId || !groups.find(g => g.id === this.activeGroupId)) {
            this.activeGroupId = groups[0].id;
        }

        // Pestanas de Grupo
        groups.forEach(group => {
            const div = document.createElement('div');
            const isActive = group.id === this.activeGroupId;
            div.className = `group-item ${isActive ? 'active text-destacado' : 'text-normal'}`;
            div.textContent = group.name;
            div.addEventListener('click', () => {
                this.activeGroupId = group.id;
                this.renderMainGrid();
            });
            this.nodes.mainGroupsList.appendChild(div);
        });

        // Boton global de anadir
        const addBtn = document.createElement('div');
        addBtn.className = 'group-item group-item-add text-normal';
        addBtn.textContent = '[ Anadir nuevo ]';
        addBtn.addEventListener('click', async () => {
            const allGroups = await dbManager.getAll('groups');
            let nextId = 1;
            allGroups.forEach(g => {
                if (g.id >= nextId) nextId = g.id + 1;
            });
            const newGroup = { id: nextId, name: `Grupo ${nextId}`, order: allGroups.length };
            await dbManager.put('groups', newGroup);
            this.activeGroupId = newGroup.id;
            this.renderMainGrid();
        });
        this.nodes.mainGroupsList.appendChild(addBtn);

        // Renderizado de grid de links anidados
        const activeCats = categories
            .filter(c => c.groupId === this.activeGroupId)
            .sort((a, b) => a.order - b.order);

        activeCats.forEach(cat => {
            const catBlock = document.createElement('div');
            catBlock.className = 'category-block';

            const catTitle = document.createElement('span');
            catTitle.className = 'category-title text-destacado';
            catTitle.textContent = cat.name;
            catBlock.appendChild(catTitle);

            const linksList = document.createElement('div');
            linksList.className = 'category-links';

            const catLinks = links
                .filter(l => l.categoryId === cat.id)
                .sort((a, b) => a.order - b.order);

            catLinks.forEach(link => {
                const linkItem = document.createElement('a');
                linkItem.className = 'link-item text-normal';
                linkItem.textContent = link.name;
                linkItem.href = link.url;
                linkItem.target = '_self';
                if (link.url && !link.url.startsWith('http')) {
                    linkItem.href = 'https://' + link.url;
                }
                linksList.appendChild(linkItem);
            });

            catBlock.appendChild(linksList);
            this.nodes.mainCategoriesContainer.appendChild(catBlock);
        });
    }
}

export const uiRenderer = new UIRenderer();
