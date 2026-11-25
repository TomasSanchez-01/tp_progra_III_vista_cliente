// ---------- Elementos del HTML ----------
const listaCarrito = document.getElementById("lista-carrito");
const carritoVacio = document.getElementById("carrito-vacio");
const precioTotal = document.getElementById("precio-total");
const resumenUnidades = document.getElementById("resumen-unidades");
const nombreCliente = document.getElementById("nombre-cliente");

const btnFinalizar = document.getElementById("btn-finalizar");
const btnVaciar = document.getElementById("btn-vaciar");

const modal = document.getElementById("modal-confirmar");
const modalTotal = document.getElementById("modal-total");
const modalUnidades = document.getElementById("modal-unidades");
const btnCancelar = document.getElementById("btn-cancelar");
const btnConfirmar = document.getElementById("btn-confirmar");


// ---------- Carrito (se guarda en localStorage) ----------
// Cada producto del carrito tiene esta forma: { id, name, price, image, cantidad }
let carrito = [];
if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
}


function init() {
    nombreCliente.textContent = localStorage.getItem("nombreCliente") || "-";
    mostrarCarrito();
}
init();


function formatearPrecio(numero) {
    return "$ " + numero.toLocaleString("es-AR");
}


// Dibuja todos los productos del carrito y actualiza el resumen
function mostrarCarrito() {
    guardarCarritoLocalStorage();
    calcularTotal();
    cantidadEnCarrito();

    let carritoProductos = "";

    carrito.forEach(p => {
        // Misma card que en el index: la clase p.team (racing, san_lorenzo...) cambia los colores
        carritoProductos += `
            <div class="card-producto ${p.team}">
                <img class="card-img" src="../${p.image}" alt="${p.name}">

                <div class="item-info">
                    <h4>${p.name}</h4>
                    <p class="producto-id">${formatearPrecio(p.price)} c/u</p>
                </div>

                <div class="cantidad">
                    <button class="btn-carrito btn-cant" onclick="restarCantidad(${p.id})" ${p.cantidad === 1 ? "disabled" : ""}>-</button>
                    <span class="cantidad-valor">${p.cantidad}</span>
                    <button class="btn-carrito btn-cant" onclick="sumarCantidad(${p.id})">+</button>
                </div>

                <p class="precio">${formatearPrecio(p.price * p.cantidad)}</p>

                <button class="btn-carrito btn-eliminar" onclick="borrarProducto(${p.id})">Eliminar</button>
            </div>`;
    });

    listaCarrito.innerHTML = carritoProductos;

    // Si no hay productos: mostramos el mensaje de carrito vacío
    let hayProductos = carrito.length !== 0;
    carritoVacio.hidden = hayProductos;
    btnFinalizar.disabled = !hayProductos;
    btnVaciar.hidden = !hayProductos;
}


function sumarCantidad(id) {
    let producto = carrito.find(p => p.id === id);
    producto.cantidad++;
    mostrarCarrito();
}

function restarCantidad(id) {
    let producto = carrito.find(p => p.id === id);
    if (producto.cantidad > 1) {
        producto.cantidad--;
    }
    mostrarCarrito();
}

function borrarProducto(id) {
    let indice = carrito.findIndex(p => p.id === id);
    carrito.splice(indice, 1);
    mostrarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    mostrarCarrito();
}


function calcularTotal() {
    let total = 0;
    carrito.forEach(p => {
        // Number() porque el precio de la base de datos puede venir como texto ("85000.00")
        total += Number(p.price) * p.cantidad;
    });
    precioTotal.textContent = formatearPrecio(total);
    return total;
}

function cantidadEnCarrito() {
    let cantidad = 0;
    carrito.forEach(p => {
        cantidad += p.cantidad;
    });
    resumenUnidades.textContent = cantidad;
    return cantidad;
}

function guardarCarritoLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}


// ---------- Botones fijos de la pantalla ----------
btnVaciar.addEventListener("click", vaciarCarrito);


// ---------- Confirmar la compra (modal) ----------
btnFinalizar.addEventListener("click", () => {
    modalTotal.textContent = formatearPrecio(calcularTotal());
    modalUnidades.textContent = cantidadEnCarrito();
    modal.showModal();
});

btnCancelar.addEventListener("click", () => {
    modal.close();
});

btnConfirmar.addEventListener("click", () => {
    let ticket = {
        cliente: localStorage.getItem("nombreCliente") || "",
        fecha: new Date().toISOString(),
        items: carrito,
        total: calcularTotal()
    };

    // TODO: guardar la venta en la base de datos (POST a la API)
    // con el nombre del cliente, la fecha y el total

    // Dejamos el ticket guardado para mostrarlo en la pantalla del ticket
    localStorage.setItem("ticket", JSON.stringify(ticket));

    // La compra terminó: se vacía el carrito y vamos al ticket
    carrito = [];
    guardarCarritoLocalStorage();
    window.location.href = "ticket.html";
});
