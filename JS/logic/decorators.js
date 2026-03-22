/**
 * KROMA - Decorators Manager
 * Modulo encargado de la ingesta asíncrona de Assets (Base64 y texto plano SVG)
 * para los frames decorativos de las esquinas.
 */
import dbManager from '../core/db.js';

class DecoratorsManager {
    constructor() {
        this.dom = {
            left: document.getElementById('decorator-left'),
            right: document.getElementById('decorator-right')
        };
        
        this.defaultSVG = `<svg class="decorator-placeholder-svg" xmlns="http://www.w3.org/2000/svg" width="103" height="116" fill="none"><path stroke="currentColor" stroke-dasharray="4 4" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M98.48 61.45a3.015 3.015 0 0 1 3.02 3.009v40.118c0 5.355-4.357 9.695-9.732 9.695H11.232c-5.375 0-9.732-4.34-9.732-9.695V64.459a3.015 3.015 0 0 1 3.02-3.01 3.015 3.015 0 0 1 3.02 3.01v40.118a3.684 3.684 0 0 0 3.692 3.677h80.536a3.684 3.684 0 0 0 3.692-3.677V64.459a3.015 3.015 0 0 1 3.02-3.01M49.364 2.153a3.03 3.03 0 0 1 4.271 0L80.481 28.9a3 3 0 0 1 0 4.255 3.03 3.03 0 0 1-4.27 0L54.52 11.544v72.974a3.015 3.015 0 0 1-3.02 3.009 3.015 3.015 0 0 1-3.02-3.01V11.546l-21.69 21.61a3.03 3.03 0 0 1-4.271 0 3 3 0 0 1 0-4.256z"/></svg>`;
    }

    async loadDecorators() {
        const config = await dbManager.get('user', 'config');
        if (!config) return;

        this.applyDecorator(this.dom.left, config.decoratorLeft);
        this.applyDecorator(this.dom.right, config.decoratorRight);
    }

    applyDecorator(element, payload) {
        if (!element) return;
        
        // Limpiado de estado agresivo
        element.innerHTML = '';
        element.style.backgroundImage = 'none';

        if (!payload) {
            element.innerHTML = this.defaultSVG;
            return;
        }

        // Si es SVG en texto plano (La ventaja es que hereda el currentColor de Kroma CSS!)
        if (payload.type === 'svg') {
            element.innerHTML = payload.data;
            const childSvg = element.querySelector('svg');
            if(childSvg) childSvg.classList.add('decorator-user-svg'); // Añadir clase de usuario para que no se oculte
        } 
        // Si es rasterizado genérico Base64
        else if (payload.type === 'image') {
            element.style.backgroundImage = `url('${payload.data}')`;
            element.style.backgroundSize = 'contain';
            element.style.backgroundPosition = 'center';
            element.style.backgroundRepeat = 'no-repeat';
        }
    }

    async processUpload(file, side) {
        if (!file) return;

        let config = await dbManager.get('user', 'config');
        if (!config) config = { id: 'config', activeTheme: 'theme-minimalista', decoratorLeft: null, decoratorRight: null };

        const isSVG = file.type === 'image/svg+xml' || file.name.endsWith('.svg');
        const reader = new FileReader();

        reader.onload = async (e) => {
            let payload = { type: 'image', data: e.target.result };
            
            if (isSVG) {
                payload = { type: 'svg', data: e.target.result };
            }

            if (side === 'left') config.decoratorLeft = payload;
            if (side === 'right') config.decoratorRight = payload;

            await dbManager.put('user', config); // Persistencia atómica
            this.loadDecorators(); // Dispara re-render visual inmediato
        };

        if (isSVG) {
            reader.readAsText(file); // Extrae Vector RAW
        } else {
            reader.readAsDataURL(file); // Encode a Base64 Object
        }
    }

    async clearDecorators() {
        let config = await dbManager.get('user', 'config');
        if (!config) return;

        config.decoratorLeft = null;
        config.decoratorRight = null;
        await dbManager.put('user', config);
        this.loadDecorators();
    }
}

export const decoratorsManager = new DecoratorsManager();
