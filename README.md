<div align="center">
  <h1>Kroma Startpage</h1>
  <img src="Kroma Startpage.png" width="100%" />
</div>

---

## Links
Figma: https://www.figma.com/design/HG9aubqUE12WJqi82wSSol/Nueva_pesta%C3%B1a?node-id=28-2&t=jgtf4yJgteRg4Rcb-1

Página: https://personal-kroma.pages.dev/

---

## Kroma (resumen)
Kroma básicamente es una startpage (página de inicio) personalizada (y hecha a medida para mi) para reemplezar la clásica nueva pestaña de firefox, contra la que no tengo nada, pero seamos sinceros, es un infierno controlar los marcadores y accesos directos. Como explicaré próximamente, esto lo hago más para ganar tiempo, orden, y para que me mentir, para poner tremendo flex en el portfolio. 

A nivel de diseño es minimalismo brutalista (que por si no os habéis dado cuenta ya, me gusta el brutalismo) con una UX diseñada para mi mismo, pero que otros power-users podrán disfrutar (aunque quizas quieran editar un poco el código). A nivel de código uso JS vanilla usando el modelo que sino me equivoco se llama "JAMstack". A nivel de host, volvemos al clásico, cloudflare pages, aunque hacerlo de está forma tiene una desventaja, y es los datos del wifi no se podrán mostrar (bueno, ni mostrar ni calcular), aunque mira, mejor que iniciar el servidor todos los días o hacer un servicio con systemmd que suficientes tengo.

## Funciones
Empezamoh. Si solo hubiera hecho una página vacía para poner enlaces (más o menos como mis ideas anteriores xd) no lo hubiera hecho.

### Barra de búsqueda inteligente (CLI)
Uso linux, literalmente necesito un CLI donde vaya. Tonterías aparte, la barra de busqueda no sirve solo para google, soporta comandos y lo más importante, operaciones matemáticas simples (con simple digo multiplicaciones, divisiones, sumas, restas y operaciones con parentesis). Vamos a ver los comandos (porque yo soy el primero al que se le olvidan lmao):

- `/yt [busqueda]`: Básicamente lo que pongas detrás será una busqueda de youtube. Quería meterlo también de reddit o github, pero después me he dado cuenta de lo triste que son ambas cuentas, así que he preferido dejarlo fuera.

- `/hex [color en hex]`: Básicamente pones un color (sin #) y te lleva a ColorHunt. Ahora, antes de que venga alguien ha decir "Pero no hubiera sido mejor simplemente hacer aparecer un cuadrado o cambiar el color de algo a ese color en vez de ir a otra página?"... NO, DESDE LUEGO QUE NO. Esperad un momento porque me acabo de dar cuenta que me he confundido de página, me debería llevar a encycolorpedia y me he confundido de web. Madre de dios, y yo me vendo como diseñador técnico, que verguenza de profesional. Bueno, a lo que iba, si pusiera el color tal cual no tendría las variaciones de color, ni las conversiones a otros sistemas/espacios de color. En cualquier caso, voy a solucionarlo antes de que se me olvide.

- `/svg [busqueda]`: Básicamente lo que pongas detrás será una busqueda de SVGREPO.

- `/roll [nº máximo]`: Si tenéis un C2 en inglés podréis adivinar lo que hace está función solo por su nombre. Efectivamente, son dados. Si pones "/roll 100"  te dará un número del 1 al 100.

- `/choose [opciones]`: Sé que no lo vais a adivinar, así que os lo explico. Pones las opciones que quieras separadas por comas, y elige una por tí. Por ejemplo, si pongo "/choose Er beti, Barça, Vardrid", el código eligirá al betis. En ese ejemplo es determinista porque el código tiene arte (Por si no lo habéis pilado, es una broma, elige uno de los 3 aleatoriamente).

### Notepad lateral:


Kroma no es solo un grid de enlaces; es un mini-entorno de productividad que respeta tu privacidad:

*   🎨 **Motor de 5 Temas Dinámicos:** Cambia en caliente entre 5 identidades visuales completamente funcionales (*Minimalista, Hongdae, Kynesis, Genesis, Lucy*). Toda la interfaz mutará al instante usando variables semánticas CSS puras, sin parpadeos.

*   📝 **Notepad Lateral:** Un gestor de notas integrado. Escribe, guarda o borra texto rápdio que no quieres perder. Se abre como una pestaña lateral y su estado se conserva tras cerrar el navegador.
*   📊 **Telemetría en Vivo:** Una barra de estado inferior te informa constantemente sobre tu Sistema Operativo, uso de Memoria RAM, hilos de CPU disponibles, conectividad y Ping real.
*   🖼️ **Decoradores Personalizables:** Dos marcos laterales dedicados al apartado visual. Sube ilustraciones desde tu disco duro (imágenes o SVGs en texto plano) y Kroma los insertará en tu pantalla base.
*   📁 **Gestor de Datos Intuitivo:** Un panel de ajustes organizado bajo un estricto sistema de pestañas (Tab-System) de tres niveles jerárquicos: `Grupos -> Categorías -> Enlaces`. 
*   💾 **Respaldos Offline (Import/Export):** Guarda absolutamente todos tus enlaces, notas, temas y decoradores en un único archivo JSON usando los comandos CLI `/export` o `/import`. Tu startpage es portátil.

## Diseño



## Stack y Arquitectura

Kroma es deliberadamente "Vanilla" para maximizar la velocidad y reducir dependencias, abrazando el modelo puro del **JAMstack**.

*   **Estructura:** HTML5 Semántico.
*   **Estilos:** CSS3 nativo construido sobre un potente sistema de variables dinámicas (`CSS/variables.css`). Se evitan mutaciones costosas en el DOM; un simple cambio de clase en el `<body>` cascada automáticamente a todos los componentes.
*   **Lógica Funcional:** JavaScript Moderno (ES6 Modules). La arquitectura está firmemente segmentada en 3 capas lógicas (sin espagueti):
    *   `core/`: Subsistemas base (Base de datos IDB, Event Bus Pub/Sub, Gestor de Telemetría).
    *   `logic/`: Controladores de estado (SearchEngine estricto, parseo y encoding de Decoradores, File System).
    *   `ui/`: Interfaces de usuario y generadores de nodos en el DOM.
*   **Persistencia (Almacenamiento):** IndexedDB, la API de almacenamiento del cliente de más bajo nivel y mayor capacidad del navegador. Se abstrae a través de un Singleton de promesas para garantizar asincronía segura e interrupciones nulas.

## Hosting
