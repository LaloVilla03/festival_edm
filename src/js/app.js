document.addEventListener('DOMContentLoaded', () => {

     navegacionFija();
     crearGaleria();
     resaltarEnlace();
     scrollNav();
});

function navegacionFija() {

     const header = document.querySelector('.header');
     const sobreFestival = document.querySelector('.sobre-festival');

     window.addEventListener('scroll', () => {
          if (sobreFestival.getBoundingClientRect().bottom < 1) { // retorna la distancia de la vista de la pagina hastaun de un elemento (en este caso hasta el final del elemento sobreFestival)
               header.classList.add('fixed');
          } else {
               header.classList.remove('fixed');
          }
     });

}

function crearGaleria() { //crear imagenes

     const cantidad_imagenes = 16;
     const galeria = document.querySelector('.galeria-imagenes');

     for (let i = 1; i <= cantidad_imagenes; i++) {
          const imagen = document.createElement('PICTURE');
          imagen.innerHTML = `
          <source srcset="build/img/gallery/thumb/${i}.avif" type="image/avif">
          <source srcset="build/img/gallery/thumb/${i}.webp" type="image/webp">
          <img loading="lazy" width="200" height="300" src="build/img/gallery/thumb/${i}.jpg" alt="imagen galeria">
     `;

          // Event Handler
          imagen.onclick = function () {
               mostrarImagen(i);
          }
          galeria.appendChild(imagen);
     }

}

function mostrarImagen(i) {

     const imagen = document.createElement('PICTURE');
     imagen.innerHTML = `
    <source srcset="build/img/gallery/full/${i}.avif" type="image/avif">
    <source srcset="build/img/gallery/full/${i}.webp" type="image/webp">
    <img loading="lazy" width="200" height="300" src="build/img/gallery/full/${i}.jpg" alt="imagen galeria">
`;

     //Generar modal
     const modal = document.createElement('DIV');
     modal.classList.add('modal');

     //boton cerrar imagen
     const cerrarModalBtn = document.createElement('BUTTON');
     cerrarModalBtn.textContent = "X";
     cerrarModalBtn.classList.add('btn-cerrar');
     cerrarModalBtn.onclick = cerrarModal;

     // Agregar imagen
     modal.appendChild(imagen);

     //agregar boton de cerrar imagen
     modal.appendChild(cerrarModalBtn);

     // Cerrar modal 
     modal.onclick = cerrarModal;

     //Agregar al HTML
     const body = document.querySelector('body');
     body.appendChild(modal);

     // clase para evitar el scroll al clickear una imagen
     body.classList.add('overflow-hidden');

     console.log(modal);
}

function cerrarModal() {
     const modal = document.querySelector('.modal');
     // condicional si modal es true (existe = cuando da click) o no existe

     modal.classList.add('fadeOut'); // animacion para cerrar

     setTimeout(() => {
          //quitar modal
          modal?.remove();

          //eliminar el modal que evita el scroll al abrir el modal
          const body = document.querySelector('body');
          body.classList.remove('overflow-hidden');
     }, 500);
}

function resaltarEnlace() {
     document.addEventListener('scroll', () => {
          const section = document.querySelectorAll('section');
          const navLinks = document.querySelectorAll('.navegacion-principal a');

          let actual = "";
          section.forEach(section => {
               const sectionTop = section.offsetTop;// offsetTop es la disantancia en px del objeto hasta el inicio del elemento padre (en este cado el body)
               const sectionHeight = section.clientHeight; // cuantos pixeles mide ese section  en el navegador

               // Detectar cual es el section mas visible en pantalla
               if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                    actual = section.id;
               }
          })
          navLinks.forEach(link => {
               if (link.getAttribute('href') === '#' + actual) {
                    link.classList.add('active');
               } else {
                    link.classList.remove('active');
               }
          })
     })
}

function scrollNav() {
     const navLinks = document.querySelectorAll('.navegacion-principal a');

     navLinks.forEach(link => {
          link.addEventListener('click', (e) => {
               e.preventDefault(); //evitar el scrool abrupto
               const sectionScroll = e.target.getAttribute('href'); //obtener el ID del link deseado
               //console.log(sectionScroll)
               const section = document.querySelector(sectionScroll); // ubicar el link deseado
               //console.log(section)
               section.scrollIntoView({ behavior: "smooth" }); // hacer el scroll suaves
          })
     })
}