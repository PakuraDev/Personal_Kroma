<div align="center">
  <img src="FIGMA - DISEÑOS/Pantalla base Minimalista.png" width="100%" />
  <h1>Kroma Startpage</h1>
  <p><b>Una página de inicio (startpage) de navegador bellamente diseñada, ultrarrápida y 100% local.</b></p>
</div>

---

## 🌟 ¿Qué es Kroma?

Kroma es una experiencia de inicio de navegador (**Browser Startpage**) premium diseñada para reemplazar la clásica "Nueva Pestaña" vacía. Fue concebida bajo los principios de **minimalismo estético, alto rendimiento y control total del usuario**. 

A diferencia de otras soluciones que requieren cuentas online, bases de datos o servicios de terceros, Kroma funciona íntegramente en tu navegador. Todos tus datos, notas y configuraciones **se guardan localmente usando IndexedDB**.

## ✨ Características Principales

Kroma no es solo un grid de enlaces; es un mini-entorno de productividad que respeta tu privacidad:

*   🎨 **Motor de 5 Temas Dinámicos:** Cambia en caliente entre 5 identidades visuales completamente funcionales (*Minimalista, Hongdae, Kynesis, Genesis, Lucy*). Toda la interfaz mutará al instante usando variables semánticas CSS puras, sin parpadeos.
*   🔍 **Barra de Búsqueda Inteligente (Smart CLI):** No sirve solo para Google. Soporta procesado matemático en tiempo real (`(4 + 8) * 2`) y comandos de terminal integrados:
    *   `/yt [búsqueda]` - Busca rápido en YouTube.
    *   `/hex [codigo]` - Busca la paleta en ColorHunt.
    *   `/svg [nombre]` - Busca iconos en Lucide.
    *   `/roll [máximo]` - Tira un dado aleatorio.
    *   `/choose [A, B, C]` - Deja que Kroma elija por ti.
*   📝 **Notepad Lateral:** Un gestor de notas integrado. Escribe, guarda o borra texto rápdio que no quieres perder. Se abre como una pestaña lateral y su estado se conserva tras cerrar el navegador.
*   📊 **Telemetría en Vivo:** Una barra de estado inferior te informa constantemente sobre tu Sistema Operativo, uso de Memoria RAM, hilos de CPU disponibles, conectividad y Ping real.
*   🖼️ **Decoradores Personalizables:** Dos marcos laterales dedicados al apartado visual. Sube ilustraciones desde tu disco duro (imágenes o SVGs en texto plano) y Kroma los insertará en tu pantalla base.
*   📁 **Gestor de Datos Intuitivo:** Un panel de ajustes organizado bajo un estricto sistema de pestañas (Tab-System) de tres niveles jerárquicos: `Grupos -> Categorías -> Enlaces`. 
*   💾 **Respaldos Offline (Import/Export):** Guarda absolutamente todos tus enlaces, notas, temas y decoradores en un único archivo JSON usando los comandos CLI `/export` o `/import`. Tu startpage es portátil.

## 🛠️ Stack Tecnológico y Arquitectura

Kroma es deliberadamente "Vanilla" para maximizar la velocidad y reducir dependencias, abrazando el modelo puro del **JAMstack**.

*   **Estructura:** HTML5 Semántico.
*   **Estilos:** CSS3 nativo construido sobre un potente sistema de variables dinámicas (`CSS/variables.css`). Se evitan mutaciones costosas en el DOM; un simple cambio de clase en el `<body>` cascada automáticamente a todos los componentes.
*   **Lógica Funcional:** JavaScript Moderno (ES6 Modules). La arquitectura está firmemente segmentada en 3 capas lógicas (sin espagueti):
    *   `core/`: Subsistemas base (Base de datos IDB, Event Bus Pub/Sub, Gestor de Telemetría).
    *   `logic/`: Controladores de estado (SearchEngine estricto, parseo y encoding de Decoradores, File System).
    *   `ui/`: Interfaces de usuario y generadores de nodos en el DOM.
*   **Persistencia (Almacenamiento):** IndexedDB, la API de almacenamiento del cliente de más bajo nivel y mayor capacidad del navegador. Se abstrae a través de un Singleton de promesas para garantizar asincronía segura e interrupciones nulas.

## 🚀 Instalación y Despliegue

### Uso Local

Puesto que Kroma hace uso de ES Modules (`<script src="..." type="module">`), no puedes simplemente abrir `index.html` dándole doble clic (por restricciones de seguridad CORS de los navegadores locales).
Debes servirlo mediante un servidor local simple:

```bash
# Entra en la carpeta del código
cd Code

# Usa Python (ya viene en Linux/Mac) para levantar un server rápido
python3 -m http.server 8080

# ¡Y visita http://localhost:8080 en tu navegador!
```

### Hosting Gratuito (Cloudflare Pages, Vercel, Netlify)

Al ser una aplicación 100% estática basada en el cliente (Browser-centric), Kroma es el candidato perfecto para alojar en un CDN sin coste alguno.
Por ejemplo, si conectas este repositorio a **Cloudflare Pages**:

1. Ve a Cloudflare Pages y dale a "Create a Project".
2. Conecta tu repositorio de GitHub.
3. Configura el **Build output directory** explícitamente a: `Code` (o la ruta donde esté tu `index.html`).
4. Deja en blanco los comandos de Build.
5. ¡Listo! Cloudflare alojará la shell estática en sus bordes globales, y el almacenamiento seguirá sucediendo en el PC de quien visite la página.

## 🔧 Personalización

Nada más abrir la app, Kroma detectará que tu base de datos está vacía e "inyectará" la estructura base por defecto (junto con una nota de "Primer Uso" dándote la bienvenida).

Para personalizar tus redes, foros y web favoritas:
1. Haz clic en el engranaje inferior derecho (o navega al panel de ajustes).
2. Añade un "Grupo" (ej: *Trabajo*, *Ocio*, *Desarrollo*). Cada Grupo aparece como un gran titular principal.
3. Añade "Categorías" a ese grupo (ej: *Back-End*, *Documentación*).
4. Dentro de cada categoría, tienes 4 slots para pegar tus nombres y URLs definitivas. ¡Dale a 'Guardar' y el motor reconstruirá toda tu página de inicio mágicamente!
