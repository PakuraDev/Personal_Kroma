/**
 * KROMA - Config Editor (Settings -> CRUD Grupos/Categorias/Links)
 * Tab-System Driven Editor
 */
import dbManager from '../core/db.js';

class ConfigEditor {
    constructor() {
        this.container = null;
        this.data = { groups: [], categories: [], links: [] };
        this.activeGroupId = null;
        this.activeCategoryId = null;
    }

    async init() {
        this.container = document.getElementById('config-groups-list');
    }

    async renderFullTree() {
        if (!this.container) return;

        // Cargar estado en memoria
        this.data.groups = await dbManager.getAll('groups');
        this.data.categories = await dbManager.getAll('categories');
        this.data.links = await dbManager.getAll('links');

        this.data.groups.sort((a,b) => a.order - b.order);
        this.data.categories.sort((a,b) => a.order - b.order);
        this.data.links.sort((a,b) => a.order - b.order);

        if (this.data.groups.length > 0) {
            this.activeGroupId = this.data.groups[0].id;
            const cats = this.data.categories.filter(c => c.groupId === this.activeGroupId);
            if (cats.length > 0) {
                this.activeCategoryId = cats[0].id;
            } else {
                this.activeCategoryId = null;
            }
        }

        this.render();
    }

    render() {
        if (!this.container) return;
        this.container.innerHTML = '';

        // 1. Fila de Grupos
        const groupsRow = document.createElement('div');
        groupsRow.className = 'settings-tabs-row';

        this.data.groups.forEach(group => {
            const btn = document.createElement('div');
            btn.className = `settings-tab-btn ${group.id === this.activeGroupId ? 'active text-destacado' : 'text-normal'}`;
            
            const groupName = document.createElement('span');
            groupName.textContent = group.name;

            // Edición en doble click
            btn.addEventListener('dblclick', () => {
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'text-destacado edit-tab-input';
                input.value = group.name;
                btn.innerHTML = '';
                btn.appendChild(input);
                input.focus();

                const saveEdit = () => {
                    group.name = input.value.trim() || 'Grupo';
                    this.render();
                };
                input.addEventListener('blur', saveEdit);
                input.addEventListener('keydown', (e) => { if (e.key === 'Enter') saveEdit(); });
            });

            btn.addEventListener('click', (e) => {
                if(e.target.tagName !== 'INPUT') {
                    if (this.activeGroupId !== group.id) {
                        this.activeGroupId = group.id;
                        const cats = this.data.categories.filter(c => c.groupId === this.activeGroupId);
                        this.activeCategoryId = cats.length > 0 ? cats[0].id : null;
                        this.render();
                    }
                }
            });

            if(group.id !== this.activeGroupId) {
                groupName.style.opacity = '0.75';
            }

            btn.appendChild(groupName);
            groupsRow.appendChild(btn);
        });

        // Add Group Button
        const addBtn = document.createElement('div');
        addBtn.className = 'settings-tab-btn text-normal';
        addBtn.style.opacity = '0.75';
        addBtn.textContent = '[ Añadir nuevo ]';
        addBtn.addEventListener('click', () => this.addNewGroup());
        groupsRow.appendChild(addBtn);

        this.container.appendChild(groupsRow);

        // 2. Fila de Categorías (solo si hay grupo activo)
        if (this.activeGroupId) {
            const catsRow = document.createElement('div');
            catsRow.className = 'settings-tabs-row';

            const activeGroupCats = this.data.categories.filter(c => c.groupId === this.activeGroupId);
            
            activeGroupCats.forEach(cat => {
                const btn = document.createElement('div');
                btn.className = `settings-tab-btn ${cat.id === this.activeCategoryId ? 'active text-destacado' : 'text-normal'}`;
                
                const catName = document.createElement('span');
                catName.textContent = cat.name;

                btn.addEventListener('dblclick', () => {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.className = 'text-destacado edit-tab-input';
                    input.value = cat.name;
                    btn.innerHTML = '';
                    btn.appendChild(input);
                    input.focus();

                    const saveEdit = () => {
                        cat.name = input.value.trim() || 'Categoría';
                        this.render();
                    };
                    input.addEventListener('blur', saveEdit);
                    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') saveEdit(); });
                });

                btn.addEventListener('click', (e) => {
                    if(e.target.tagName !== 'INPUT') {
                        if (this.activeCategoryId !== cat.id) {
                            this.activeCategoryId = cat.id;
                            this.render();
                        }
                    }
                });

                if(cat.id !== this.activeCategoryId) {
                    catName.style.opacity = '0.75';
                }

                btn.appendChild(catName);
                catsRow.appendChild(btn);
            });
            this.container.appendChild(catsRow);

            // 3. Lista de Links (solo si hay categoría activa)
            if (this.activeCategoryId) {
                const linksContainer = document.createElement('div');
                linksContainer.className = 'settings-links-container';

                const activeLinks = this.data.links.filter(l => l.categoryId === this.activeCategoryId);
                
                // Mostrar siempre 4 slots de links
                for (let i = 0; i < 4; i++) {
                    let link = activeLinks[i];
                    if (!link) {
                        link = {
                            id: 'temp_' + Date.now() + Math.random(),
                            categoryId: this.activeCategoryId,
                            name: '',
                            url: '',
                            order: i
                        };
                        this.data.links.push(link);
                    }

                    const linkEditor = document.createElement('div');
                    linkEditor.className = 'settings-link-editor';

                    const title = document.createElement('div');
                    title.className = 'text-destacado';
                    title.textContent = `> Link ${i + 1}`;
                    
                    const nameWrapper = document.createElement('div');
                    nameWrapper.className = 'settings-link-input-wrapper';
                    const nameInput = document.createElement('input');
                    nameInput.className = 'text-normal';
                    nameInput.placeholder = 'Nombre...';
                    nameInput.value = link.name;
                    nameInput.addEventListener('input', (e) => link.name = e.target.value);
                    nameWrapper.appendChild(nameInput);

                    const urlWrapper = document.createElement('div');
                    urlWrapper.className = 'settings-link-input-wrapper';
                    const urlInput = document.createElement('input');
                    urlInput.className = 'text-normal';
                    urlInput.placeholder = 'Link...';
                    urlInput.value = link.url;
                    urlInput.addEventListener('input', (e) => link.url = e.target.value);
                    urlWrapper.appendChild(urlInput);

                    linkEditor.appendChild(title);
                    linkEditor.appendChild(nameWrapper);
                    linkEditor.appendChild(urlWrapper);
                    linksContainer.appendChild(linkEditor);
                }

                this.container.appendChild(linksContainer);


            }
        }
    }

    addNewGroup() {
        const newGroupId = Date.now();
        this.data.groups.push({
            id: newGroupId,
            name: 'Nuevo Grupo',
            order: this.data.groups.length
        });
        
        for(let i=1; i<=4; i++) {
            this.data.categories.push({
                id: Date.now() + i,
                groupId: newGroupId,
                name: `Categoría ${i}`,
                order: i - 1
            });
        }
        
        this.activeGroupId = newGroupId;
        const newCats = this.data.categories.filter(c => c.groupId === newGroupId);
        this.activeCategoryId = newCats[0].id;
        this.render();
    }

    async saveToDB() {
        await dbManager.clearStore('groups');
        await dbManager.clearStore('categories');
        await dbManager.clearStore('links');

        let groupId = 1;
        let catId = 1;
        let linkId = 1;

        for (let gIndex=0; gIndex < this.data.groups.length; gIndex++) {
            const g = this.data.groups[gIndex];
            const oldGroupId = g.id;
            const newGroup = { id: groupId, name: g.name, order: gIndex };
            await dbManager.put('groups', newGroup);

            const gCats = this.data.categories.filter(c => c.groupId === oldGroupId).sort((a,b)=>a.order-b.order);
            for (let cIndex=0; cIndex < gCats.length; cIndex++) {
                const c = gCats[cIndex];
                const oldCatId = c.id;
                const newCat = { id: catId, groupId: groupId, name: c.name, order: cIndex };
                await dbManager.put('categories', newCat);

                const cLinks = this.data.links.filter(l => l.categoryId === oldCatId).sort((a,b)=>a.order-b.order);
                for (let lIndex=0; lIndex < cLinks.length; lIndex++) {
                    const l = cLinks[lIndex];
                    if (l.name.trim() !== '' || l.url.trim() !== '') {
                        let lUrl = l.url.trim();
                        if (lUrl !== '' && !lUrl.startsWith('http')) lUrl = 'https://' + lUrl;
                        
                        const newLink = { id: linkId, categoryId: catId, name: l.name.trim(), url: lUrl, order: lIndex };
                        await dbManager.put('links', newLink);
                        linkId++;
                    }
                }
                catId++;
            }
            groupId++;
        }
    }
}

export const configEditor = new ConfigEditor();
