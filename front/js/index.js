const formBienvenida = document.getElementById("form-bienvenida");
const inputNombre = document.getElementById("nombre");
const mensajeError = document.getElementById("mensaje-error");


formBienvenida.addEventListener("submit", (e) => {
    e.preventDefault(); 
    let nombre = inputNombre.value.trim();
    if (nombre === "") {
        mensajeError.textContent = "Ingresá tu nombre para continuar";
        return;
    }
    localStorage.setItem("nombreCliente", nombre);

    window.location.href = "productos.html";
});
