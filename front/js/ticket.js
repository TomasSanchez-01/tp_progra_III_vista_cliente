// ---------- Elementos del HTML ----------
const ticketElemento = document.getElementById("ticket");
const ticketVacio = document.getElementById("ticket-vacio");
const ticketCliente = document.getElementById("ticket-cliente");
const ticketFecha = document.getElementById("ticket-fecha");
const ticketProductos = document.getElementById("ticket-productos");
const ticketTotal = document.getElementById("ticket-total");

const btnPdf = document.getElementById("btn-pdf");
const btnSalir = document.getElementById("btn-salir");

// El ticket lo dejó guardado la pantalla del carrito al confirmar la compra:
// { cliente, fecha, items: [{ name, price, cantidad, ... }], total }
let ticket = JSON.parse(localStorage.getItem("ticket"));

function init() {
    if (ticket) {
        mostrarTicket();
    } else {
        // Si entran a esta página sin haber comprado, no hay nada que mostrar
        ticketElemento.hidden = true;
        ticketVacio.hidden = false;
        btnPdf.hidden = true;
    }
}
init();


function mostrarTicket() {
    ticketCliente.textContent = ticket.cliente || "-";
    ticketFecha.textContent = new Date(ticket.fecha).toLocaleString("es-AR");

    let filas = "";

    ticket.productos.forEach(p => {
        filas += `
            <tr>
                <td>${p.name}</td>
                <td>${p.cantidad}</td>
                <td>${p.price}</td>
                <td>${p.price * p.cantidad}</td>
            </tr>`;
    });

    ticketProductos.innerHTML = filas;
    ticketTotal.textContent = `$${ticket.total}`;
}

// Descarga el ticket como PDF (usa la librería html2pdf que cargamos en el HTML)
btnPdf.addEventListener("click", () => {
    html2pdf().from(ticketElemento).save("ticket-manto-sagrado.pdf");
});


//el autoservicio vuelve a empezar
btnSalir.addEventListener("click", () => {
    localStorage.removeItem("ticket");
    localStorage.removeItem("carrito");
    localStorage.removeItem("nombreCliente");

    window.location.href = "index.html";
});
