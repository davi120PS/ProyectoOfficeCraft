const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

//conexion con la base de datos
const {connection} = require("../config/config.db");

// Middleware para parsear el cuerpo de la solicitud en formato JSON
app.use(express.json());

//Metodo para traer todos los pedidos de la tabla pedidos en bd
const getPedido = (request,response) => {
    connection.query("SELECT p.PedidoID, p.FechaPedido, p.Estado,cl.Nombre AS Cliente FROM pedidos p INNER JOIN clientes cl ON p.ClienteID = cl.ClienteID",
    (error,results)=>{
        if(error)
        throw error;
    response.status(200).json(results);
    });
};
app.route("/pedidos").get(getPedido);

/*Metodo para crear o actualizar un cliente*/
const postPedido = (request, response) => {
    const {action,id,cliente,fechapedido,estado,PedidoID} = request.body;
    //console.log(action);return false;
    if(action === "insert"){
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
        connection.query("UPDATE pedidos SET ClienteID=?, fechapedido =?, Estado = ? WHERE PedidoID = "+PedidoID+"", 
        [cliente,fechapedido,estado,id],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Pedido editado con exito": results.affectedRows});
        });
    }
};
app.route("/pedidos").post(postPedido);

const getPedidoId = (request,response) => {
    const id = request.params.id;
    connection.query("SELECT p.*, cl.Nombre, cl.ClienteID AS cliente, p.FechaPedido AS fechapedido, p.Estado AS estado FROM pedidos p LEFT JOIN clientes cl ON p.ClienteID = cl.ClienteID WHERE p.PedidoID = ?",
    [id],
    (error,results)=>{
        if(error)
            throw error;
        response.status(200).json(results);
    });
};
app.route("/pedidos/:id").get(getPedidoId);

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
