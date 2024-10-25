Sass (Syntactically Awesome Style Sheets) es un lenguaje de preprocesador de CSS que extiende las capacidades de CSS para hacerlo más poderoso y fácil de mantener. Introduce características adicionales, como variables, anidación, mixins, herencia y funciones, que permiten escribir hojas de estilo más organizadas y reutilizables.
Su extencion en .scss similar a css3

para agregarlo a un html no es igual que un archivo css, este primero hay que compilarlo, sino, el html no va a saber como interpretarlo. 

ir a package.json
en la parte de scripts, escribir el nombre del script, en este caso puede ser "sass" su valor es el nombre del compilador dentro de la carpeta .bin, en este caso "sass" tambien, espacio, la ruta del archivo a ejecutar en este caso "src/scss", seguido de esto escribimos ":", despues la ruta donde queremos que se almacene el archivo compilado, en este caso "dist/css" estas carpetas se crearán al momento de ejecutarse el script no hace falta crearlas antes. Al final queda:

"[nombScript]": "[nombCompiladorEnCarpBin][espacio] [rutaArchivoOrigen]:[rutaDestino]"

"sass": "sass src/scss:dist/css"

para ejecutar un scrip es: npm run [nombScript] 

en este caso: npm run sass

finalmente agregar el archivo css compilado al archivo html para que lo pueda ejecutar

para no tener que ejecutar el script cada que haya cambios, hay que agregar "--watch" en la linea del script en el json, quedando en este caso:
"sass": "sass --watch src/scss:dist/css"

NO SOBREESCRIBIR EL CSS

podemos tener muchos archivos scss para diferentes fines (variables, estilos, mediaquerys, etc) estos archivos que se deben incluir todos en el mismo css destino, su nombre debe de iniciar con guion bajo, en este caso fue _variables.scss

------------------------------------------------------------

Gulp es una herramienta de automatización de tareas para el desarrollo web, diseñada para facilitar y agilizar flujos de trabajo. Está basada en Node.js y permite automatizar tareas comunes como la compilación de Sass, minificación de archivos CSS y JavaScript, recarga automática del navegador, y mucho más.

para ejecutar funciones de gulp se debe:
+ nombar el archivo de gulp como "gulpfile.js" porque es el que busca por defecto el compilador
+ Al crear nuestra funcion, agregar "export" al inicio para que el json pueda acceder a ella
+ en el json escribir el nombre del compilador y el nombre de la función a ejecutar ("hola": "gulp hola")
+ en el json despues de "descriprion" escribir la linea ["type": "module"], sino da error al ejecutar

para finalizar la ejecución de la función en la terminal y evitar la advertencia, en la funcion gulp pasar el parametro "done" y al final ejecutarlo "done()"

--ejemplo--
export function hola( done ){
    console.log('hola desde gulp');
    done();
}

-----------------------------------------------------------

Para importar archivos en scss se puede usar @use o @forward,
@use puede usar un namespace, es decir una abreviatura del archivo para acceder a su contenido .v en caso de las variables

@forward no se puede usar un namespace

no es incorrecto usar @use sin un namespace

en este proyecto se crea una carpeta "base" para ir agregando mas subarchivos en los que hara referencia el archivo principal app.scss quien apunta a esta carpeta englobando todo su contenido. De esta forma, se dividen los contenidos de todo sass haciendo mas entendible el proyecto y menos lineas de importacion en el app principal

------------------------------------------------------------

Los mixins son similares a los mediaquerys:

@mixin contenedor{
    width: 95%;
    max-width: 120rem;
    margin: 0 auto;
}

para usarlos:

nav-contenedor{
    @include contenedor();
}


--------------------------------------------------------
MEJORAR EL PERFORMANCE DE LA PAGINA

estó solo aminora el procesamiento de los archivos compilado en la carpeta build, si se necesita editar algo, siempre se tienen los archivos principales en las carpetas js o scss

+ minificando el css y js

** minificando el css
en el gulp se minificó
.pipe(sass().on('error', sass.logError))
a
.pipe(sass({
            outputStyle:'compressed'
        }).on('error', sass.logError))

Esto comprimió el archivo app.css en todas las lineas de estilos compactadas

** minificando el js
se instaló otra dependencia, en la terminal
npm i --save-dev gulp-terser

se editó la funcion js en el gulp de 
export function js(done) {
    src('src/js/app.js')
        .pipe(dest('build/js'))

    done()
}
a
export function js(done) {
    src('src/js/app.js')
        .pipe(terser())
        .pipe(dest('build/js'))

    done()
}


CARGAR IMAGENES HASTA QUE SEA NECESARIO

Para aplicar el loading="lazy" a las imagenes correctamente se debe de añadir tambien el tamaño inicial (width="300" height="200") con esto ya deberia funcionar correctamente este atributo

El orden en que se declaran estos atributos importa, primero se debe declarar el loading seguido de los tamaños y finalmente el src y demas.


EDITAR LA CALIDAD DE LAS IMAGENES

se usa la dependencia "sharp" para hacer estos cambios y disminuir la calidad de las imagenes

la funcion "crop" en el archivo de gulp es la encargada de editar estas imagenes, haciendolas mas pequeñas y mas ligeras para procesar

finalmente se editó en app.js la ruta de donde se obtienen las imagenes, siendo remplazado "full" por "thumb" en la ruta

USAR IMAGENES .webp EN LUGAR DE .jpg 

usar imagenes en formato WebP ayuda a mejorar el performance de una pagina debido a que estas imagenes se procesan mas rapido, pesan menos, las soportan varios navegadores modernos, etc.


AVIF

formato para imagen mas comprimido y mas ligeros en comparacion a otro formatos como jpeg, png, webp.-

con la etiquet <picture> se puede especificar diferentes formatos, si uno no es soportado, se ira al siguiente <source>

el orden recomendado es 1. avif 2.webp 3.jpeg

en esta parte se editó la parte de generacion de la galeria en el archivo js y el html, en el html se editó la imagen del dj es "sobre_festival" aplicando 2 source y escoger el mejor autometicamente, en el js se editaron dos funciones de crear galeria y mostrar imagen, agregando las mismas lineas que en el html.
