const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

//conexion con la base de datos
const {connection} = require("../config/config.db");

//Metodo para traer todos los pedidos de la tabla pedidos en bd
const getPedido = (request,response) => {
    connection.query("SELECT * FROM pedidos",
    (error,results)=>{
        if(error)
        throw error;
    response.status(200).json(results);
    });
};
app.route("/pedidos").get(getPedido);

/*Metodo para crear o actualizar un cliente*/
const postPedido = (request, response) => {
    const {action,id,cliente,fecha,estado} = request.body;
    //console.log(action);return false;
    if(action == "insert"){
        connection.query("INSERT INTO pedidos (ClienteID, FechaPedido, Estado) VALUES (?,?,?)", 
        [cliente, fecha,estado],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Pedido añadido correctamente": results.affectedRows});
        });
    }
//*En caso de añadir un ID existente al agregar se actualiza el pedido seleccionado*/
    else{
        //console.log(action);return false;
        connection.query("UPDATE pedidos SET ClienteID=?, FechaPedido =?, Estado = ? WHERE PedidoID = ?", 
        [cliente, fecha,estado,id],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Pedido editado con exito": results.affectedRows});
        });
    }
};
app.route("/pedidos").post(postPedido);

//Servicio para eliminar un cliente
const delPedido = (request,response)=>{
    const id = request.params.id;
    //console.log(id); return false;
    connection.query("DELETE FROM pedidos WHERE PedidoID = ?",
    [id],
    (error, results) => {
        if(error)
        throw error;
    response.status(201).json({"Pedido eliminado":results.affectedRows});
    });
};
app.route("/pedidos/:id").delete(delPedido);

module.exports = app;
