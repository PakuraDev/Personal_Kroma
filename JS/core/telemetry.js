/**
 * KROMA - Motor de Telemetría
 * Utiliza APIs nativas del navegador para inyectar datos reales del SO, batería, conexión y hardware.
 */

class TelemetryEngine {
    constructor() {
        this.os = this.detectOS();
        this.hwConcurrency = navigator.hardwareConcurrency || '--';
        // Solicitado por usuario: Hardcode 32GB RAM
        this.deviceMemory = 32;
    }

    detectOS() {
        const platform = navigator.platform.toLowerCase();
        const userAgent = navigator.userAgent.toLowerCase();
        if (platform.includes('win')) return 'Windows';
        if (platform.includes('mac')) return 'macOS';
        if (platform.includes('linux')) return 'Linux';
        if (userAgent.includes('android')) return 'Android';
        if (userAgent.includes('iphone') || userAgent.includes('ipad')) return 'iOS';
        return 'Unknown OS';
    }

    async getBattery() {
        if ('getBattery' in navigator) {
            try {
                const battery = await navigator.getBattery();
                return Math.floor(battery.level * 100);
            } catch (e) {
                // Si la política impide el acceso (ej. Firefox por defecto en algunas builds)
                return 101; 
            }
        }
        // Fallback a 101% indicado en especificaciones para perfiles puramente Desktop sin batería
        return 101; 
    }

    getNetworkStatus() {
        const isOnline = navigator.onLine ? 'Online' : 'Offline';
        let mbps = '-- Mbps';
        let ping = 'Ping: -- ms';
        
        if (navigator.connection) {
            if (navigator.connection.downlink) {
                mbps = navigator.connection.downlink + ' Mbps';
            }
            if (navigator.connection.rtt) {
                ping = 'Ping: ' + navigator.connection.rtt + 'ms';
            }
        }
        return { isOnline, mbps, ping };
    }
}

export const telemetry = new TelemetryEngine();
