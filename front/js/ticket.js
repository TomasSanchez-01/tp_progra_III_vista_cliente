// ---------- Elementos del HTML ----------
const urlBase = "http://localhost:4000";
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
console.log(ticket);
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
    console.log("1. entró a mostrarTicket", ticket);
    console.log("2. productos:", ticket.productos);

    ticketCliente.textContent = ticket.cliente || "-";
    ticketFecha.textContent = new Date(ticket.fecha).toLocaleString("es-AR");
    console.log("3. cliente y fecha puestos");

    let filas = "";

    ticket.productos.forEach(p => {
        filas += `
            <tr>
                <td>${p.name}</td>
                <td>${p.cantidad}</td>
                <td>${p.price}</td>
                <td>${Number(p.price) * p.cantidad}</td>
            </tr>`;
    });
    console.log("4. filas armadas:", filas);

    ticketProductos.innerHTML = filas;
    ticketTotal.textContent = `$${ticket.total}`;
    console.log("5. terminó");
}

// Descarga el ticket como PDF (usa la librería html2pdf que cargamos en el HTML)
// Descarga el ticket como PDF (usa la librería jsPDF que cargamos en el HTML)
btnPdf.addEventListener("click", imprimirTicket);

async function imprimirTicket() {
     btnPdf.disabled = true; // evita registrar la venta dos veces

    // Primero guardamos la venta
    const guardada = await registrarVenta();

    // Si falló, no hay ticket
    if (!guardada) {
        btnPdf.disabled = false;
        return;
    }
    // Venta guardada: armamos el PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 20; // distancia desde arriba

    doc.setFontSize(22);
    doc.text("Manto sagrado - Ticket de compra", 20, y);

    y += 15;
    doc.setFontSize(14);
    doc.text(`Cliente: ${ticket.cliente}`, 20, y);

    y += 10;
    doc.text(`Fecha: ${new Date(ticket.fecha).toLocaleString("es-AR")}`, 20, y);

    y += 15;
    ticket.productos.forEach(p => {
        doc.text(`${p.name} x${p.cantidad} - $${parseInt(p.price * p.cantidad)}`, 20, y);
        y += 10; // si no sumamos a y, todos los productos se pisan
    });

    y += 10;
    doc.setFontSize(18);
    doc.text(`Total: $${ticket.total}`, 20, y);
    doc.save(`ticket_${ticket.cliente}.pdf`);

    // El autoservicio vuelve a empezar
    localStorage.removeItem("ticket");
    localStorage.removeItem("carrito");
    localStorage.removeItem("nombreCliente");
    window.location.href = "index.html";
}

async function registrarVenta() {
    try {
        const response = await fetch(`${urlBase}/api/sales`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_name: ticket.cliente,
                total_price: ticket.total,
                products: ticket.productos
            })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }
        return true;

    } catch (error) {
        console.error(error);
        alert("No se pudo registrar la compra");
        return false;
    }
}

//el autoservicio vuelve a empezar
btnSalir.addEventListener("click", () => {
    let seguro = confirm("Si salis sin imprimir el ticket, la compra se cancela. Queres salir?");
    if (!seguro) {
        return;
    }
    localStorage.removeItem("ticket");
    localStorage.removeItem("carrito");
    localStorage.removeItem("nombreCliente");
    window.location.href = "index.html";
});
