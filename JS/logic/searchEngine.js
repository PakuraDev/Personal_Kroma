/**
 * KROMA - Smart Search Engine (El Cerebro)
 * Parseador imperativo y estricto de Strings para inyectar CLI commands (/yt, calculadoras, etc)
 */
class SearchEngine {
    constructor() {
        this.defaultEngineUrl = 'https://www.google.com/search?q=';
    }

    /**
     * Procesa la cadena cruda del input y decide su vector de ejecución
     * @param {string} rawQuery - El texto bruto extraído del DOM al hacer Enter
     * @returns {Object} - Instruction set { action: 'redirect' | 'inline' | 'none', payload: string }
     */
    parse(rawQuery) {
        const query = rawQuery.trim();
        if (!query) return { action: 'none' };

        // 1. Math Parser Seguro
        // Regex estricto: solo números, operadores puros, paréntesis y espacios (mínimo 1 número)
        const isMath = /^[0-9+\-*/().\s]+$/.test(query) && /[0-9]/.test(query);
        // Exigimos que haya al menos un operador real para no procesar números planos (ej: "1234")
        const isOperator = /[+\-*/]/.test(query); 
        
        if (isMath && isOperator) {
            try {
                // Función anónima segura gracias a la severa pre-validación Regex
                const result = new Function(`return ${query}`)();
                if (result !== undefined && !isNaN(result) && result !== Infinity) {
                    // Limitar flotantes a 4 decimales máximo si los tiene
                    const finalResult = Number.isInteger(result) ? result : parseFloat(result.toFixed(4));
                    return { action: 'inline', payload: String(finalResult) };
                }
            } catch (e) {
                // Fallback silencioso en caso de SyntaxError (ej. "(4+4")
            }
        }

        // 2. Comandos Puros de Router CLI
        const lowerQuery = query.toLowerCase();

        // Youtube
        if (lowerQuery.startsWith('/yt ')) {
            const searchTerm = query.substring(4).trim();
            if (searchTerm) {
                return { action: 'redirect', payload: `https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm)}` };
            }
        }

        // https://encycolorpedia.es/1a1a1a (corregido)
        if (lowerQuery.startsWith('/hex ')) {
            let hex = query.substring(5).trim();
            if (hex.startsWith('#')) hex = hex.substring(1); 
            if (hex) {
                return { action: 'redirect', payload: `https://encycolorpedia.es/${encodeURIComponent(hex)}` }; 
            }
        }

        // Lucide SVG
        if (lowerQuery.startsWith('/svg ')) {
            const searchTerm = query.substring(5).trim();
            if (searchTerm) {
                return { action: 'redirect', payload: `https://lucide.dev/icons/?search=${encodeURIComponent(searchTerm)}` };
            }
        }

        // 3. RNG Tools (Retornos Inline Destructivos del Input)
        
        // Dado (/roll 100)
        if (lowerQuery.startsWith('/roll')) {
            const args = query.split(' ');
            let max = 100; // maximo por defecto
            if (args.length > 1) {
                const parsed = parseInt(args[1], 10);
                if (!isNaN(parsed) && parsed > 0) max = parsed;
            }
            const roll = Math.floor(Math.random() * max) + 1;
            return { action: 'inline', payload: `Kroma Roll: ${roll} / ${max}` };
        }

        // Elección Aleatoria (/choose Pizza, Sushi)
        if (lowerQuery.startsWith('/choose ')) {
            const listStr = query.substring(8).trim();
            if (listStr) {
                const options = listStr.split(',').map(item => item.trim()).filter(i => i.length > 0);
                if (options.length > 0) {
                    const chosen = options[Math.floor(Math.random() * options.length)];
                    return { action: 'inline', payload: `Kroma elige: ${chosen}` };
                }
            }
        }

        // Export / Import
        if (lowerQuery === '/export') {
            return { action: 'system', payload: 'export' };
        }
        if (lowerQuery === '/import') {
            return { action: 'system', payload: 'import' };
        }

        // 4. Fallback a Motor de Búsqueda Externo
        return { action: 'redirect', payload: this.defaultEngineUrl + encodeURIComponent(query) };
    }
}

export const searchEngine = new SearchEngine();
