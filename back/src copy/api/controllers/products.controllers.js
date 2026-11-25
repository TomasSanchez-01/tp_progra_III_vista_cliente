import ProductModel from "../models/products.models.js";

export const getAllProducts = async (req, res) => {
    try {
        const [rows, tables] = await ProductModel.selectAllProducts();

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
};