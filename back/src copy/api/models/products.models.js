import connection from "../database/db.js";

const selectAllProducts = () => {
    const sql = "SELECT * FROM products WHERE active = 1";
    return connection.query(sql);
};

export default {
    selectAllProducts
};