/**
 * KROMA - Entry Point
 * Orquestador principal e inicializador de la aplicacion.
 */
import bus from './core/bus.js';
import dbManager from './core/db.js';
import { telemetry } from './core/telemetry.js';
import { uiRenderer } from './ui/render.js';
import { notesController } from './logic/notes.js';
import { themeEngine } from './core/themeEngine.js';
import { dbTools } from './logic/dbTools.js';
import { searchEngine } from './logic/searchEngine.js';
import { decoratorsManager } from './logic/decorators.js';
import { configEditor } from './ui/configEditor.js';

// --- ELEMENTOS DEL DOM ---
const domRefs = {
    clock: document.getElementById('clock-display'),
    date: document.getElementById('date-display'),
    statusOs: document.getElementById('status-os'),
    statusBattery: document.getElementById('status-battery'),
    statusHardware: document.getElementById('status-hardware'),
    statusNetwork: document.getElementById('status-network'),
    statusBar: document.getElementById('status-bar'),
    btnDecorations: document.getElementById('btn-decorations'),
    iconDecorations: document.getElementById('icon-decorations'),
    decoratorLeft: document.getElementById('decorator-left'),
    decoratorRight: document.getElementById('decorator-right'),
    btnSettings: document.querySelector('.sidebar-btn-settings'),
    viewMain: document.getElementById('view-main'),
    viewSettings: document.getElementById('view-settings'),
    btnSettingsCancel: document.getElementById('btn-settings-cancel'),
    btnSettingsSave: document.getElementById('btn-settings-save'),
    searchInput: document.getElementById('search-input'),
    btnCreateNote: document.querySelector('.sidebar-btn-create'),
    btnSaveNote: document.getElementById('btn-save-note'),
    btnDeleteNote: document.getElementById('btn-delete-note'),
    notepadPanel: document.getElementById('notepad-panel'),
    notepadSymbol: document.getElementById('notepad-symbol'),
    notepadTitle: document.getElementById('notepad-title'),
    notepadContent: document.getElementById('notepad-content')
};

// --- ESTADOS GLOBALES ---
let decoratorsActive = false;
let clockIntervalId = null;

// --- INICIALIZACION ---
async function init() {
    console.log('[Kroma] Secuencia de arranque (Init)');
    await dbManager.ready;

    await uiRenderer.bootstrap();
    await themeEngine.loadTheme();
    await decoratorsManager.loadDecorators();
    await configEditor.init();

    setupClock();
    setupTelemetry();
    setupBindEvents();
}

// --- RELOJ Y FECHA DINAMICOS ---
function setupClock() {
    const updateTime = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        if (domRefs.clock) domRefs.clock.textContent = `${hours}:${minutes}`;

        const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        if (domRefs.date) {
            domRefs.date.textContent = `${days[now.getDay()]} ${now.getDate()} / ${months[now.getMonth()]} ${now.getFullYear()}`;
        }
    };

    updateTime();
    // Almacenar referencia para posible cleanup futuro
    clockIntervalId = setInterval(updateTime, 1000);
}

// --- TELEMETRIA DE LA BARRA INFERIOR ---
async function setupTelemetry() {
    if (domRefs.statusOs) domRefs.statusOs.textContent = telemetry.os;
    if (domRefs.statusHardware) domRefs.statusHardware.textContent = `${telemetry.hwConcurrency} Hilos | ${telemetry.deviceMemory}GB RAM`;

    if (domRefs.statusBattery) {
        const batLevel = await telemetry.getBattery();
        domRefs.statusBattery.textContent = `${batLevel}%`;
    }

    const updateNetwork = () => {
        const net = telemetry.getNetworkStatus();
        if (domRefs.statusNetwork) {
            domRefs.statusNetwork.textContent = `${net.isOnline} | ${net.mbps} | ${net.ping}`;
        }
    };

    updateNetwork();

    if (navigator.connection) {
        navigator.connection.addEventListener('change', updateNetwork);
    }
    window.addEventListener('online', updateNetwork);
    window.addEventListener('offline', updateNetwork);
}

// --- EVENTOS INTERACTIVOS ---
function setupBindEvents() {

    // Toggle de decoraciones
    if (domRefs.btnDecorations) {
        domRefs.btnDecorations.addEventListener('click', () => {
            decoratorsActive = !decoratorsActive;
            bus.emit('ui:toggle-decorations', decoratorsActive);
        });
    }

    bus.on('ui:toggle-decorations', (isActive) => {
        if (!domRefs.decoratorLeft || !domRefs.iconDecorations) return;

        if (isActive) {
            domRefs.decoratorLeft.classList.add('active');
            domRefs.decoratorRight.classList.add('active');
            domRefs.iconDecorations.className = 'svg-decorations icon-select';
        } else {
            domRefs.decoratorLeft.classList.remove('active');
            domRefs.decoratorRight.classList.remove('active');
            domRefs.iconDecorations.className = 'svg-decorations icon-not-select';
        }
    });

    // Routing de Ajustes
    if (domRefs.btnSettings) {
        domRefs.btnSettings.addEventListener('click', () => {
            if (domRefs.viewMain) domRefs.viewMain.classList.remove('active-view');
            if (domRefs.viewSettings) domRefs.viewSettings.classList.add('active-view');
            if (domRefs.statusBar) domRefs.statusBar.style.display = 'none';
            configEditor.renderFullTree();
        });
    }

    const closeSettings = () => {
        if (domRefs.viewSettings) domRefs.viewSettings.classList.remove('active-view');
        if (domRefs.viewMain) domRefs.viewMain.classList.add('active-view');
        if (domRefs.statusBar) domRefs.statusBar.style.display = 'flex';
    };

    if (domRefs.btnSettingsCancel) {
        domRefs.btnSettingsCancel.addEventListener('click', closeSettings);
    }

    if (domRefs.btnSettingsSave) {
        domRefs.btnSettingsSave.addEventListener('click', async () => {
            await configEditor.saveToDB();
            await uiRenderer.renderMainGrid();
            closeSettings();
        });
    }

    // Notepad Panel
    bus.on('ui:open-note', (note) => {
        if (domRefs.notepadPanel) {
            domRefs.notepadPanel.classList.add('open');
            domRefs.notepadSymbol.textContent = note.symbol || '?';
            domRefs.notepadTitle.value = note.title || '';
            domRefs.notepadContent.value = note.content || '';
        }
    });

    bus.on('ui:close-note', () => {
        if (domRefs.notepadPanel) domRefs.notepadPanel.classList.remove('open');
    });

    // Logica click-outside para modo Modal Modal del Notepad
    document.addEventListener('click', (e) => {
        if (!domRefs.notepadPanel || !domRefs.notepadPanel.classList.contains('open')) return;
        if (domRefs.notepadPanel.contains(e.target)) return;
        if (e.target.closest('.sidebar-note-tab')) return;
        if (e.target.closest('.sidebar-btn-create')) return;
        bus.emit('ui:close-note');
    });

    // CRUD Notas
    if (domRefs.btnCreateNote) {
        domRefs.btnCreateNote.addEventListener('click', () => notesController.createNote());
    }

    if (domRefs.btnSaveNote) {
        domRefs.btnSaveNote.addEventListener('click', () => {
            notesController.saveCurrentNote(domRefs.notepadTitle.value, domRefs.notepadContent.value);
        });
    }

    if (domRefs.btnDeleteNote) {
        domRefs.btnDeleteNote.addEventListener('click', () => notesController.deleteCurrentNote());
    }

    // Motor de Temas
    const themePreviews = document.querySelectorAll('.style-preview');
    themePreviews.forEach(preview => {
        preview.addEventListener('click', () => {
            const themeClass = preview.dataset.theme;
            if (themeClass) {
                themeEngine.setTheme(themeClass);
                themePreviews.forEach(p => p.classList.remove('active'));
                preview.classList.add('active');
            }
        });
    });

    // DB Export/Import
    const btnExport = document.getElementById('btn-export-db');
    const btnImport = document.getElementById('btn-import-db');
    const importInput = document.getElementById('import-file-input');
    const btnClear = document.getElementById('btn-clear-db');
    // Removed Old Settings Buttons

    // Barra Inteligente Central
    if (domRefs.searchInput) {
        domRefs.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const result = searchEngine.parse(domRefs.searchInput.value);

                if (result.action === 'redirect') {
                    window.location.href = result.payload;
                } else if (result.action === 'inline') {
                    domRefs.searchInput.value = result.payload;
                    domRefs.searchInput.select();
                } else if (result.action === 'system') {
                    domRefs.searchInput.value = ''; // Clean bar
                    if (result.payload === 'export') {
                        dbTools.exportDatabase();
                    } else if (result.payload === 'import') {
                        // Create phantom input for import
                        const fileInput = document.createElement('input');
                        fileInput.type = 'file';
                        fileInput.accept = '.json';
                        fileInput.style.display = 'none';
                        fileInput.onchange = (e) => {
                            const file = e.target.files[0];
                            if (file) dbTools.importDatabase(file);
                        };
                        document.body.appendChild(fileInput);
                        fileInput.click();
                        setTimeout(() => fileInput.remove(), 1000);
                    }
                }
            }
        });
    }

    // Subida de Decoradores en Pantalla Principal
    if (domRefs.decoratorLeft) {
        const inputMainLeft = document.createElement('input');
        inputMainLeft.type = 'file';
        inputMainLeft.accept = 'image/*,.svg';
        inputMainLeft.style.display = 'none';
        document.body.appendChild(inputMainLeft);
        
        domRefs.decoratorLeft.addEventListener('click', () => {
            if (domRefs.decoratorLeft.classList.contains('active')) inputMainLeft.click();
        });
        inputMainLeft.addEventListener('change', (e) => decoratorsManager.processUpload(e.target.files[0], 'left'));
    }

    if (domRefs.decoratorRight) {
        const inputMainRight = document.createElement('input');
        inputMainRight.type = 'file';
        inputMainRight.accept = 'image/*,.svg';
        inputMainRight.style.display = 'none';
        document.body.appendChild(inputMainRight);
        
        domRefs.decoratorRight.addEventListener('click', () => {
            if (domRefs.decoratorRight.classList.contains('active')) inputMainRight.click();
        });
        inputMainRight.addEventListener('change', (e) => decoratorsManager.processUpload(e.target.files[0], 'right'));
    }
}

// Iniciar app
window.document.addEventListener('DOMContentLoaded', init);
