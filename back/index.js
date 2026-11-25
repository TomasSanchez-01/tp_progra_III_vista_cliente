/*===============
    Imports
===============*/
import express from "express"; // Importamos el framework Express
import environments from "./src copy/api/config/environments.js"; // Traigo la info de la variables de entorno
import cors from "cors"; // Importamos el middleware CORS
import { productRoutes, saleRoutes } from "./src copy/api/routes/index.js";

/*===============
    Config
===============*/
const app = express(); // Crea una instancia de aplicacion de Express con todos sus metodos
const PORT = environments.port;

/*===============
    Middlewares
===============*/
app.use(cors()); // Middleware CORS basico para permitir todas las solicitudes

app.use(express.json()); // Middleware para parsear el JSON recibido en el cuerpo de las solicitudes POST y PUT

// Middleware logger para analizar las solicitudes por la consola
app.use((req, res, next) => {
    const fecha = new Date();
    console.log(`[${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}] ${req.method} ${req.url}`);
    next(); // Pasa al siguiente middleware (si lo hay) o a la respuesta
})

/*===============
     Rutas
===============*/

// GET all products
app.use("/api/products", productRoutes);

app.use("/api/sales", saleRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
});