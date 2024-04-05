const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

//conexion con la base de datos
const {connection}=require('../config/config.db');

const getDetallespedido = (request,response) => {
    connection.query("SELECT * FROM detallespedido",
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
    const {action,id,pedido,producto,cantidad,preciounitario,subtotal} = request.body;
    //console.log(action);return false;
    if(action == "insert"){
        connection.query("INSERT INTO detallespedido (PedidoID, ProductoID, Cantidad, PrecioUnitario,Subtotal) VALUES (?,?,?,?,?)", 
        [pedido,producto,cantidad,preciounitario,subtotal],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Detalle añadido correctamente": results.affectedRows});
        });
    }
//*En caso de añadir un ID existente al agregar se actualiza el pedido seleccionado*/
    else{
        //console.log(action);return false;
        connection.query("UPDATE productos SET PedidoID=?, ProductoID =?, Cantidad = ?, PrecioUnitario = ?,Subtotal = ? WHERE DetalleID = ?", 
        [pedido,producto,cantidad,preciounitario,subtotal,id],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Detalle editado con exito": results.affectedRows});
        });
    }
};
app.route("/detallespedido").post(postDetallespedido);

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