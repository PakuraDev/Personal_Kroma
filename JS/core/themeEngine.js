/**
 * KROMA - Theme Engine
 * Despacha de manera reactiva el re-renderizado global del CSS
 */
import dbManager from './db.js';

class ThemeEngine {
    async loadTheme() {
        const userConfig = await dbManager.get('user', 'config');
        let theme = 'theme-minimalista';
        
        if (userConfig && userConfig.activeTheme) {
            theme = userConfig.activeTheme;
        }
        
        // Purgar y adjuntar al top-level DOM
        document.body.className = '';
        document.body.classList.add(theme);

        // Actualizar UI del panel de preview
        const previews = document.querySelectorAll('.style-preview');
        previews.forEach(p => {
            if (p.dataset.theme === theme) {
                p.classList.add('active');
            } else {
                p.classList.remove('active');
            }
        });
    }

    async setTheme(themeName) {
        document.body.className = '';
        document.body.classList.add(themeName);

        let userConfig = await dbManager.get('user', 'config');
        if (!userConfig) {
            userConfig = { id: 'config', activeTheme: themeName, decoratorLeft: null, decoratorRight: null };
        } else {
            userConfig.activeTheme = themeName;
        }

        // Persistir decision 
        await dbManager.put('user', userConfig);
    }
}

export const themeEngine = new ThemeEngine();
