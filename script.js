
let productos = [];

fetch('productos.json')
    .then(response => response.json())
    .then(data => {
        productos = data;
        renderizarProductos(productos);
    })
    .catch(error => console.error('Error cargando productos:', error));


const contenedor = document.getElementById('productos-container');
const botonesCategoria = document.querySelectorAll('.categoria-btn');
const video = document.getElementById('hero-video');
const soundButton = document.getElementById('sound-button');
const soundNote = document.querySelector('.sound-note');
const buscador = document.getElementById('buscador');



// Obtener elementos del modal
const modal = document.getElementById('modalRegistro');
/// const btnAbrir = document.getElementById('btnAbrirModal');
const btnCerrar = document.getElementById('cerrarModal');


/*
// Abrir modal al hacer clic en el botón
btnAbrir.onclick = function() {
    modal.style.display = 'block';
} */

// Cerrar modal al hacer clic en la X
btnCerrar.onclick = function() {
    modal.style.display = 'none';
    limpiarModal(); // Limpiar campos y mensajes al cerrar
}

// Cerrar modal si el usuario hace clic fuera de la ventana blanca
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
        limpiarModal();
    }
}

// Función para limpiar el modal
function limpiarModal() {
    document.getElementById('nombres').value = '';
    document.getElementById('apellidos').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('mensajeRegistro').innerHTML = '';
}


async function registrarUsuario() {
    const nombres = document.getElementById('nombres').value;
    const apellidos = document.getElementById('apellidos').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const mensaje = document.getElementById('mensajeRegistro');

    if (!nombres || !apellidos || !email || !password) {
        mensaje.innerHTML = '❌ Todos los campos son obligatorios';
        mensaje.style.color = 'red';
        return;
    }

    mensaje.innerHTML = '📡 Registrando...';
    mensaje.style.color = 'blue';

    try {
        await fetch('https://script.google.com/macros/s/AKfycbx_RifyL-uUw7M3a9Sp8CyEF4jsTiFDQbkIPvtI7gMlX0LJ8HX6Am6xO73ltNko57VU/exec', {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombres, apellidos, email, password, fecha: new Date() })
        });
        mensaje.innerHTML = '✅ ¡Registro exitoso! Bienvenido.';
        mensaje.style.color = 'green';
        
        // Cerrar modal después de 1.5 segundos
        setTimeout(() => {
            modal.style.display = 'none';
            limpiarModal();
        }, 1500);
        
    } catch (error) {
        mensaje.innerHTML = '❌ Error al registrar. Intenta de nuevo.';
        mensaje.style.color = 'red';
    }
}


//Esta es la funcion para buscar productos, no olvides
function buscarProductos(texto) {
    return productos.filter(producto =>
        producto.nombre.toLowerCase().includes(texto.toLowerCase())
    );
}
//

function crearTarjeta(producto) {
    return `
        <article class="producto-card">
            <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
            <div class="producto-info">
                <div>
                    <h2 class="producto-precio">$${producto.precio ? producto.precio.toFixed(2) : 'Precio a consultar'}</h2>
                    <h3 class="producto-titulo">${producto.nombre}</h3>
                    <p class="producto-descripcion">${producto.descripcion}</p>
                </div>
                <button class="producto-contacto" type="button" data-nombre="${producto.nombre}">
                    Contactar
                </button>
            </div>
        </article>
    `;
}

function renderizarProductos(lista) {
    if (!contenedor) return;
    if (lista.length === 0) {
        contenedor.innerHTML = '<p class="sin-productos">No hay productos en esta categoría. Prueba otra opción.</p>';
        return;
    }

    contenedor.innerHTML = lista.map(producto => crearTarjeta(producto)).join('');
    contenedor.querySelectorAll('.producto-contacto').forEach(boton => {
    boton.addEventListener('click', () => {

        const nombre = boton.getAttribute('data-nombre');

        // Buscar el producto completo en el arreglo
        const producto = productos.find(p => p.nombre === nombre);

        const telefono = "593992097494";


        const precio = producto.precio != null
            ? `$${producto.precio.toFixed(2)}`
            : "Precio a consultar";

        const mensaje =
`Hola, vi este producto en la página "Bazar & Papelería D' Mi Barrio".

Producto: ${producto.nombre}.
Precio: ${precio}.

¿Está disponible?`;

        window.open(
            `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`,
            "_blank"
        );
    });
});
}

function filtrarProductos(categoria) {
    if (categoria === 'todos') {
        return productos;
    }
    return productos.filter(producto => producto.categoria === categoria);
}

function actualizarBotonActivo(activeCategoria) {
    botonesCategoria.forEach(boton => {
        boton.classList.toggle('active', boton.dataset.categoria === activeCategoria);
    });
}

function intentarReproducirVideo() {
    if (!video) return;
    video.volume = 0.7;
    video.muted = false;
    video.play().then(() => {
        soundButton.textContent = video.muted ? 'Activar sonido' : 'Silenciar sonido';
        soundNote.textContent = 'Si no escuchas sonido, presiona el botón de arriba.';
    }).catch(() => {
        soundNote.textContent = 'El navegador bloquea autoplay con sonido. Presiona el botón para activarlo.';
    });
}

function alternarSonido() {
    if (!video) return;

    if (video.muted) {
        video.muted = false;
        soundNote.textContent = 'Audio activado. Si no se reproduce, intenta otra vez.';
    } else {
        video.muted = true;
        soundNote.textContent = 'Video silenciado. Presiona de nuevo para activar sonido.';
    }

    video.play().catch(() => {
        soundNote.textContent = 'Por favor, permite la reproducción en tu navegador y vuelve a presionar el botón.';
    });

    soundButton.textContent = video.muted ? 'Activar sonido' : 'Silenciar sonido';
}

if (video) {
    video.addEventListener('loadeddata', intentarReproducirVideo);
    soundButton.addEventListener('click', alternarSonido);
}

if (botonesCategoria.length > 0) {
    botonesCategoria.forEach(boton => {
        boton.addEventListener('click', () => {
            const categoria = boton.dataset.categoria;
            actualizarBotonActivo(categoria);
            renderizarProductos(filtrarProductos(categoria));
        });
    });
}


//Este es el bloque para el buscador de productos, se filtra por nombre y se actualiza la vista con los resultados
if (buscador) {
    buscador.addEventListener('input', (e) => {
        const texto = e.target.value;
        const resultados = buscarProductos(texto);
        renderizarProductos(resultados);
    });
}



//  ESCÁNER DE CÓDIGO DE BARRAS 
const btnEscanear = document.getElementById('btn-escanear');
const lectorDiv = document.getElementById('lector-codigo');
let html5QrCode = null;

if (btnEscanear) {
    btnEscanear.addEventListener('click', () => {
        if (html5QrCode === null) {
            lectorDiv.style.display = 'block';
            html5QrCode = new Html5Qrcode("lector-codigo");
            const config = { fps: 10, qrbox: { width: 250, height: 150 } };
            
            html5QrCode.start(
                { facingMode: "environment" },
                config,
                (decodedText) => {
                    const producto = productos.find(p => p.codigo === decodedText);
                    if (producto) {
                        alert(`✅ Producto: ${producto.nombre}\n💰 $${producto.precio}`);
                    } else {
                        alert(`❌ Código ${decodedText} no encontrado.`);
                    }
                    html5QrCode.stop();
                    lectorDiv.style.display = 'none';
                    html5QrCode = null;
                },
                (errorMessage) => {}
            ).catch(err => {
                console.error("Error cámara:", err);
                alert("No se pudo acceder a la cámara.");
                lectorDiv.style.display = 'none';
                html5QrCode = null;
            });
        } else {
            html5QrCode.stop();
            lectorDiv.style.display = 'none';
            html5QrCode = null;
        }
    });
}