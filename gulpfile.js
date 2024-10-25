
//para procesar las imagenes con path y fs, propias de node.js
import path from 'path'
import fs from 'fs'


// para compilar con gulp
import * as dartSass from 'sass' // para manejar
import gulpSass from 'gulp-sass'; // sass con gulp
const sass = gulpSass(dartSass); // instancia

import { src, dest, watch, series } from 'gulp'
// {src & dest} para nombar origen del archivo y destino 
// {watch} para actualizar el proyecto cada que cambie un archivo
// {series} para ejecutar multiples tareas y no tener varias terminales abiertas ejecutandose
export function css(done) {
    // esta funcion es similar a la linea 7 en el json
    src('src/scss/app.scss', { sourcemaps: true }) //ubicar el archivo
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError)) // aplica sass 
        .pipe(dest('build/css', { sourcemaps: true })) // destino

    //{sourcemaps:true} habilita que en el navegador al inspeccionar un elemento, saber en que archivo original .scss esta el diseño del elemento y no la linea del archivo css debido a que este no se debe de editar para nada
    done();
}

import terser from 'gulp-terser';

export function js(done) {
    src('src/js/app.js')
        .pipe(terser())
        .pipe(dest('build/js'))

    done()
}

// para editar las imagenes
import sharp from 'sharp';

// codigo para editar las imegenes con "sharp" 
export async function crop(done) {
    const inputFolder = 'src/img/gallery/full' //carpeta origen de las imagenes
    const outputFolder = 'src/img/gallery/thumb'; //donde se guardaran las nuevas imagenes editadas
    const width = 250; // nuevos tamaños
    const height = 180;// de las imagenes editadas
    if (!fs.existsSync(outputFolder)) { // comprobar si existe la carpeta destino, sino crearla
        fs.mkdirSync(outputFolder, { recursive: true })
    }
    const images = fs.readdirSync(inputFolder).filter(file => { // revisar que sean imagenes para empezat a procesarlas 
        return /\.(jpg)$/i.test(path.extname(file));
    });
    try {
        // procesa la imagenes
        images.forEach(file => {
            // archivo de entrada
            const inputFile = path.join(inputFolder, file)
            // archivo de salida
            const outputFile = path.join(outputFolder, file)
            sharp(inputFile) // edita el tamaño de la imagen
                .resize(width, height, {
                    position: 'centre'
                })
                .toFile(outputFile) // guardar en carpeta
        });

        done()
    } catch (error) {
        console.log(error)
    }
}

import { glob } from 'glob';

//funcion para cambiar las imagens a .webp
export async function imagenes(done) {
    const srcDir = './src/img';
    const buildDir = './build/img';
    const images = await glob('./src/img/**/*{jpg,png}')

    images.forEach(file => {
        const relativePath = path.relative(srcDir, path.dirname(file));
        const outputSubDir = path.join(buildDir, relativePath);
        procesarImagenes(file, outputSubDir);
    });
    done();
}

function procesarImagenes(file, outputSubDir) {
    if (!fs.existsSync(outputSubDir)) {
        fs.mkdirSync(outputSubDir, { recursive: true })
    }
    const baseName = path.basename(file, path.extname(file))
    const extName = path.extname(file)
    const outputFile = path.join(outputSubDir, `${baseName}${extName}`)
    const outputFileWebp = path.join(outputSubDir, `${baseName}.webp`)
    const outputFileAvif = path.join(outputSubDir, `${baseName}.avif`)

    const options = { quality: 80 }
    sharp(file).jpeg(options).toFile(outputFile)
    sharp(file).webp(options).toFile(outputFileWebp)
    sharp(file).avif().toFile(outputFileAvif)
}

// para que actualice automaticamente == --watch
export function dev() {
    //estar atento de todos los archivos dentro de cualquier carpeta en la ruta src/scss y que tengan la terminacion .scss
    watch('src/scss/**/*.scss', css)
    watch('src/js/**/*.js', js)
    // watch('ruta' , funcion)
    watch('src/img/**/*.{png, jpg}', imagenes)
}

// el orden importa, dev va a final porque vigila el archivo esperando cambios; en el package.json solo queda el nombre de la funcion y adonde apunta globalmente (gulp):
// dev: "gulp"
// por defecto se exportan estas tres funciones en ese orden:
export default series(crop, js, css, imagenes, dev);