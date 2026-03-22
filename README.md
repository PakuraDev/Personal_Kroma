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

- `/export`: Sirve para exportar los datos (estilo seleccionado, grupos, categorías, enlances, etc...) guardados y potencialmente importarlos en otro lado.

- `/import`: Sirve para importar el backup.

### Notepad lateral:
Como la cabeza no me da para todo, pensé en meter un bloc de notas lateral donde puedo guardar mis pensamientos antes de que se me olviden. Y ya está, no sé que más explicar de aquí, todos sabemos lo que es un bloc de notas, ¿No?

### Personalización básica:
Como buen usuario de linux que hace ricing (Si no sabéis lo que es, básicamente personalizar como un enfermo el apartado visual del sistema operativo), no podía permitirme tener una página de inicio tan triste, en blanco y negro, así que añadí 4 estilos más (Hongdae, Kynesis, Genesis, Lucy - Nombres y colores inspirados en ropas de Yuxus y en un personaje de anime. Lo sé, muy profesional) y la posibilidad de añadir imágenes o svgs (sé perfectamente que se considera al svg como imagen, pero recordemos que el gif también. El que categorizó ese día no estaba muy presente mentalmente) personalizadas a los laterales.

### Gestor de accesos directos:
Para que sino hacer una página de inicio. Cada categoría tiene 4 links, cada grupo 4 categorías, y se pueden crear todos los grupos que queráis. Se editan desde ajustes, y los nombres son personalizables con doble click.


## Diseño
Buenos, como ni el minimalismo ni el brutalismo dan mucho que hablar (tampoco mucho los estilos que he hecho), pasamos al UX. Como buen diseño está centrado en el usuario, y en este caso el usuario soy yo. Todo el diseño tiene un porqué, así que vamos a explorarlo:

### Fecha y hora: 
Aunque creo que la página de acceso de firefox tiene hora (o no, no me acuerdo. La de chrome por lo menos no tiene), la hora es algo que muy rara vez veo. Poner ambos me ahorra el tener que desplegar la barra superior del sistema. 

### Barra inteligente: 
Posiblemente lo mejor a nivel de UX, dado que me ahorra el tener que ir a una página para hacer una busqueda, decidir algo aleatorio, o calcular cuentas sencillas mientras que mantiene su utilidad original, buscar cosas. Si bien es cierto que la curva de aprendizaje para un usuario normal sería lo suficiente alta para que un usuario se frustre o tarde en acostumbrarse, para un power user o usuario de linux esto es una maravilla inimaginable.

### Notepad lateral:
Actualmente uso `https://onlinenotepad.org`, que si bien me gusta, el tener el notepad directamente en mi página de inicio me permite ahorrarme abrir y tener abierta una pestaña más, usarlo sin conexión, mayor velocidad y mayor privacidad (aunque para ser sinceros, con lo que guardo dentro, que básicamente son comandos o cosas que tengo que hacer más tarde, no creo que nadie les quiera comprar esos datos).

### Barra inferior:
Aquí tenemos la primera parte medio inutil. Decoraciones lo tenía que meter abajo, pero claro, que toda la barra inferior sea un unico botón es lo más antiestetico que podría ver en mi vida. Así que básicamente añadí cierta decoración:

- Sistema operativo (esto básicamente es un flex moral).

- batería: Aunque lo vaya a usar la mayoría del tiempo en un pc de sobremesa, para mi portatil (que obviamente tiene linux) esto viene genial.

- CPU & RAM: Aquí me vaís a perdonar, pero como para la RAM había un pequeño conflicto de intereses entre mi sistema y un flatpack, decídi hardcodear la cantidad que tengo.

- Wifi: Aunque desde la web solo funciona la API para saber si hay conexión (y no quería meter una API o Worker para calcular mi ping o descarga), para quien corra la página desde su sistema/servidor/minipc/cosa que pueda usar python) esto le funcionará bien.

- Decoraciones: Y aquí viene el botón que activa o desactiva el modo decorar, el cual permite poner imágenes o svgs en los laterales del navegador para decorar. Decidí ponerlo aquí porque ajustes estaba saturado.

### Ajustes:
Un infierno tranquilo. Básicamente tenemos el selector de tema, y el gestor de grupos, categorías y links. Desde allí se puede configurar todo de forma intuitiva (basado en que mi madre sabe usarlo).


## Stack y Arquitectura
Como no es raro ver en mi, mi odio por el bloatware y ciertos frameworks (y digo ciertos porque si, respeto a Astro), me ha hecho hacer el proyecto en HTML, CSS y JS vanilla. He reutilizado un poco el wrapper de IndexedDB (porque, con todo el respeto, quien hizo la API de IndexedDB odiaba su trabajo) y bus de Aerko, combinado con el render de openflow para agilizar, aunque son totalmente nuevos. Como dije, creo que esto se llama JAMstack, que es Javascript, API, Marcado (html y css no son lenguajes de programación, sino de marcado), aunque no estoy seguro. La verdad es que las etiquetas nunca me han gustado mucho. 

En cualquier caso, como me gustan las estructuras modulares se dividió el css en 5 archivos, cada uno con una utilidad, y el la lógica (js) en 3 carpetas:

- `core/`: Base de datos, bus de eventos, gestor de telemtría (tranquilos, la telemetría solo es una forma preocupante de referirme a las decoraciones útiles)

- `logic/`: los controladores de estado, como el sistema de busqueda, parseo, etc...

- `ui/`: La interfaz del usuario que se rendiriza via JS.

Y para el almacenamiento, como el 99% de las personas que saben lo que es IndexedDB habrán adivinado, se usa IndexedDB para que los datos persistan en el tiempo. 


## Hosting y licencia.
Está hosteado en cloudflare pages sin ningún dominio. El que quiera puede hacer un fork y hostearlo por su cuenta, modificarlo o cualquier cosa, es de código abierto. Gracias por leer esto y un saludo <3
