// ---------- Elementos del HTML ----------
const urlBase = "http://localhost:4000";
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


let carrito = [];
if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
}

function init() {
    nombreCliente.textContent = localStorage.getItem("nombreCliente") || "-";
    mostrarCarrito();
}
init();

function mostrarCarrito() {
    guardarCarritoLocalStorage();
    calcularTotal();
    cantidadEnCarrito();

    let carritoProductos = "";

    carrito.forEach(p => {
        carritoProductos += `
            <div class="card-producto ${p.team}">
                <img class="card-img" src="../${p.image}" alt="${p.name}">

                <div class="item-info">
                    <h4>${p.name}</h4>
                    <p class="producto-id">$${p.price} c/u</p>
                </div>

                <div class="cantidad">
                    <button class="btn-carrito btn-cant" onclick="restarCantidad(${p.id})" ${p.cantidad === 1 ? "disabled" : ""}>-</button>
                    <span class="cantidad-valor"> ${p.cantidad}</span>
                    <button class="btn-carrito btn-cant" onclick="sumarCantidad(${p.id})">+</button>
                </div>

                <p class="precio">$${p.price * p.cantidad}</p>

                <button class="btn-carrito btn-eliminar" onclick="borrarProducto(${p.id})">Eliminar</button>
            </div>`;
    });

    listaCarrito.innerHTML = carritoProductos;

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
    precioTotal.textContent = `$${total}`;
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

btnVaciar.addEventListener("click", vaciarCarrito);

btnFinalizar.addEventListener("click", () => {
    modalTotal.textContent = `$${calcularTotal()}`;
    modalUnidades.textContent = cantidadEnCarrito();
    modal.showModal();
});

btnCancelar.addEventListener("click", () => {
    modal.close();
});

btnConfirmar.addEventListener("click", async () => {
    const ticket = {
        cliente: localStorage.getItem("nombreCliente") || "",
        fecha: new Date().toISOString(),
        productos: carrito,
        total: calcularTotal()
    };

    btnConfirmar.disabled = true; // evita guardar dos veces

    try {
        const response = await fetch(`${urlBase}/api/sales`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_name: ticket.cliente,
                total_price: ticket.total,
                products: carrito
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        ticket.id = data.id; // número de venta para el ticket
        localStorage.setItem("ticket", JSON.stringify(ticket));

        carrito = [];
        guardarCarritoLocalStorage();
        window.location.href = "ticket.html";

    } catch (error) {
        console.error(error);
        alert("No se pudo registrar la compra");
        btnConfirmar.disabled = false;
    }
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