
const contenedorProductos = document.getElementById("contenedor-productos");
const urlBase = "http://localhost:4000";

const buscador = document.getElementById("buscador");
const contadorCarrito = document.getElementById("contador-carrito");
const aviso = document.getElementById("aviso");

let temporizadorAviso;
let productos = [];
let carrito = [];


if (!localStorage.getItem("nombreCliente")) {
    window.location.href = "index.html";
}

if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
}

function init(){
    obtenerProductos();
    actualizarContador();
}
init();

// Optimizacion 1: Mostramos el mensaje de error visualmente
function mostrarError(message) {
    contenedorProductos.innerHTML = `        
        <p class="mensaje error">${message}</p>
    `;
}

async function obtenerProductos() {
    try {
        const response = await fetch(`${urlBase}/api/products`);
        console.log(response); // Response {type: 'cors', url: 'http://localhost:4000/api/products', redirected: false, status: 200, ok: true, …}

        const data = await response.json();

        // Optimizacion 2: Filtramos errores 400 o 500
        if (!response.ok) {
            return mostrarError(data.message);
            // el return hace que esta funcion termine
        }
        
        // En data tenemos payload: arrayDeObjetos
        productos = data.payload;
        console.table(productos);
        
        renderizarProductos(productos);
        
    } catch (error) {
        // El catch solo captura errores reales de red (no hay conexion o el server esta caido)
        console.error("Error al hacer la solicitud: ", error);
        mostrarError("Fallo la conexion con el servidor");
    }
}


function renderizarProductos(array) {
    let htmlProducto = "";
    
    array.forEach(prod => {
        htmlProducto += `
        <div class="card-producto ${prod.team}">
            <img class="card-img" src="${urlBase}/${prod.image}" alt="${prod.image}">
            <div class="contenedor-info-cards">
                <h4>${prod.name}</h4>
                <div class="contenedor-cantidad">
                    <span class="precio">$ ${prod.price}</span>
                    <div class="cantidad">
                        <button onclick="quitarDelCarrito(${prod.id})" class="btn-carrito btn-cant">-</button>
                        <span class="cantidad-valor" id="cantidad-${prod.id}">${cantidadDe(prod.id)}</span>
                        <button onclick="agregarAlCarrito(${prod.id})" class="btn-carrito btn-cant">+</button>
                    </div>
                </div>
                <button onclick="agregarAlCarrito(${prod.id})" class="btn-carrito">Agregar al carrito</button>
            </div>
        </div>
        
        `;
    });
        
    contenedorProductos.innerHTML = htmlProducto;
}

function agregarAlCarrito(id){
    let producto = productos.find(p => p.id === id);
    let productoEnCarrito = carrito.find(p => p.id === id);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            name: producto.name,
            price: parseInt(producto.price),
            image: producto.image,
            team: producto.team,
            cantidad: 1
        });
    }

    guardarCarritoLocalStorage();
    actualizarContador();
    actualizarCantidadCard(id);
    mostrarAviso(producto.name);
}

function actualizarContador(){
    let cantidad = 0;
    carrito.forEach(p => {
        cantidad += p.cantidad;
    });
    contadorCarrito.textContent = cantidad;
}

function cantidadDe(id) {
    let productoEnCarrito = carrito.find(p => p.id === id);

    if (productoEnCarrito) {
        return productoEnCarrito.cantidad;
    }
    return 0;
}

function quitarDelCarrito(id) {
    let indice = carrito.findIndex(p => p.id === id);

    // Si no está en el carrito, no hay nada para quitar
    if (indice === -1) {
        return;
    }

    carrito[indice].cantidad--;

    // Si quedó en 0, lo sacamos del carrito
    if (carrito[indice].cantidad === 0) {
        carrito.splice(indice, 1);
    }

    guardarCarritoLocalStorage();
    actualizarContador();
    actualizarCantidadCard(id);
}

function actualizarCantidadCard(id) {
    document.getElementById(`cantidad-${id}`).textContent = cantidadDe(id);
}

function mostrarAviso(nombre){
    aviso.textContent = `${nombre} agregado al carrito`;
    aviso.hidden = false;
    // Si agrega otro enseguida, reiniciamos el tiempo
    clearTimeout(temporizadorAviso);

    temporizadorAviso = setTimeout(() => {
        aviso.hidden = true;
    }, 2000);
}

function guardarCarritoLocalStorage(){
    localStorage.setItem("carrito", JSON.stringify(carrito));
};

    
buscador.addEventListener("keyup", () => {
    let palabraBuscada = buscador.value.trim().toLowerCase();
    let productosFiltrados = productos.filter(p => p.name.toLowerCase().includes(palabraBuscada));
    renderizarProductos(productosFiltrados);
});   

const btnTema = document.getElementById("btn-tema");

// Recordamos la elección entre visitas
if (localStorage.getItem("tema") === "oscuro") {
    document.documentElement.classList.add("oscuro");
}

btnTema.addEventListener("click", () => {
    const oscuro = document.documentElement.classList.toggle("oscuro");
    localStorage.setItem("tema", oscuro ? "oscuro" : "claro");
});