const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

//conexion con la base de datos
const {connection}=require('../config/config.db');

const getDetallespedido = (request,response) => {
    connection.query("SELECT dp.DetalleID, dp.PedidoID AS Pedido, pr.Nombre AS Producto, dp.Cantidad, dp.Subtotal FROM detallespedido AS dp"+
                     " INNER JOIN pedidos p ON dp.PedidoID = p.PedidoID"+
                     " INNER JOIN productos pr ON dp.ProductoID = pr.ProductoID",
    (error,results)=>{
        if(error)
            throw error;
        response.status(200).json(results);
    });
};
//ruta
app.route("/detallespedido").get(getDetallespedido);

/*Metodo para crear o actualizar un cliente*/
const postDetallespedido = (request, response) => {
    const {action,id,pedido,producto,cantidad,subtotal,DetalleID} = request.body;
    //console.log(action);return false;
    if (action == "insert") {
        connection.beginTransaction((err) => {
            if (err) {
                throw err;
            }
            // Insertar el detalle de pedido
            connection.query("INSERT INTO detallespedido (PedidoID, ProductoID, Cantidad, Subtotal) VALUES (?,?,?,?)",
                [pedido, producto, cantidad, subtotal],
                (error, results) => {
                    if (error) {
                        return connection.rollback(() => {
                            throw error;
                        });
                    }
                    // Actualizar el stock del producto
                    connection.query("UPDATE productos SET Stock = Stock - ? WHERE ProductoID = ?",
                        [cantidad, producto],
                        (err, results) => {
                            if (err) {
                                return connection.rollback(() => {
                                    throw err;
                                });
                            }
                            connection.commit((err) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        throw err;
                                    });
                                }
                                response.status(201).json({ "Detalle añadido correctamente": results.affectedRows });
                            });
                        });
                });
        });
    } 
//*En caso de añadir un ID existente al agregar se actualiza el pedido seleccionado*/
    else{
        //console.log(action);return false;
        connection.query("UPDATE detallespedido SET PedidoID=?, ProductoID =?, Cantidad = ?, Subtotal = ? WHERE DetalleID = "+DetalleID+"", 
        [pedido,producto,cantidad,subtotal,id],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Detalle editado con exito": results.affectedRows});
        });
    }
};
app.route("/detallespedido").post(postDetallespedido);

const getDetalleId = (request,response) => {
    const id = request.params.id;
    connection.query("SELECT dp.*, p.PedidoID AS pedido, pr.Nombre, pr.ProductoID AS producto, dp.Cantidad AS cantidad, dp.Subtotal AS subtotal FROM detallespedido dp"+
    " LEFT JOIN pedidos p ON dp.PedidoID = p.PedidoID"+
    " LEFT JOIN productos pr ON dp.ProductoID = pr.ProductoID WHERE dp.DetalleID = ?",
    [id],
    (error,results)=>{
        if(error)
            throw error;
        response.status(200).json(results);
    });
};
app.route("/detallespedido/:id").get(getDetalleId);

//Servicio para eliminar un cliente
const delDetallespedido = (request,response)=>{
    const id = request.params.id;
    //console.log(id); return false;
    connection.query("DELETE FROM detallespedido WHERE DetalleID = ?",
    [id],
    (error, results) => {
        if(error)
        throw error;
    response.status(201).json({"detalle pedido eliminado":results.affectedRows});
    });
};
app.route("/detallespedido/:id").delete(delDetallespedido);

module.exports = app;