/*===============
    Imports
===============*/
import express from "express"; // Importamos el framework Express
import environments from "./src copy/api/config/environments.js"; // Traigo la info de la variables de entorno
import connection from "./src copy/api/database/db.js"; // Importo la conexion a la BBDD
import cors from "cors"; // Importamos el middleware CORS

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
    Endpoints
===============*/

// GET all products
app.get("/api/products", async (req, res) => {

    try {
        const sql = "SELECT * FROM products";
        const [rows, tables] = await connection.query(sql);

        res.status(200).json({
            payload: rows
        });

     } catch (error) {
        console.log("Error obteniendo productos: ", error);

        // Optimizacion 4: Error 500 si fallo la conexion a la BBDD
        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
});