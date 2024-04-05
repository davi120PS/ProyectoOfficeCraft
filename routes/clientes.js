const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

//conexion con la base de datos
const {connection}=require('../config/config.db');

/************Consultar clientes*/
const getCliente = (request,response) => {
    connection.query("SELECT clientes.nombre,clientes.correo,clientes.direccion FROM clientes",
    (error,results)=>{
        if(error){
            console.error("Error al consultar la base de datos:", error);
            response.status(500).json({ error: "Ocurrió un error al obtener los clientes." });
        }
        response.status(201).json({"Lista de clientes generada": results.affectedRows});
    });
};
//ruta
app.route("/clientes").get(getCliente);
module.exports = app;

/************Insertar o Actualizar clientes*/
const postCliente = (request, response) => {
    const {action,id, nombre, correo, direccion, ClienteID} = request.body;
    //console.log(action);return false;
    if(action == "insert"){
        connection.query("INSERT INTO clientes (Nombre, Correo, Direccion) VALUES (?,?,?)", 
        [nombre, correo, direccion],
        (error, results) => {
            if(error){
                console.error("Error al insertar en la base de datos:", error);
                response.status(500).json({ error: "Ocurrió un error al agregar al cliente." });
            }else
                response.status(201).json({"Cliente añadido correctamente": results.affectedRows});
        });
    }else{
        connection.query("UPDATE clientes SET Nombre = ?, Correo = ? , Direccion = ? WHERE ClienteID = "+ClienteID+"", 
        [nombre, correo, direccion, id],
        (error, results) => {
            if(error){
                console.error("Error al actualizar en la base de datos:", error);
                response.status(500).json({ error: "Ocurrió un error al obtener los productos." });
            }else{
                response.status(201).json({"Cliente editado con exito": results.affectedRows});
            }
        });
    }
};
app.route("/clientes").post(postCliente);

/************Encontrar ID para Editar clientes*/
const getClienteId = (request,response) => {
    const id = request.params.id;
    connection.query("SELECT cl.*, cl.Nombre AS nombre, cl.Correo AS correo, cl.Direccion AS direccion FROM clientes AS cl WHERE cl.ClienteID = ?",
    [id],
    (error,results)=>{
        if(error)
            console.error("Error al consultar en la base de datos:", error);
            response.status(500).json({ error: "Ocurrió un error al obtener el ID del cliente." });
        response.status(200).json(results);
    });
};
app.route("/clientes/:id").get(getClienteId);

/************Eliminar clientes*/
const delCliente = (request,response) => {
    const id = request.params.id;
    //console.log(id); return false;
    connection.query("DELETE FROM clientes WHERE ClienteID = ?",
    [id],
    (error,results)=>{
        if(error){
            console.error("Error al eliminar en la base de datos:", error);
            response.status(500).json({ error: "Ocurrió un error al obtener el ID del cliente." });
        }
        response.status(201).json({"Cliente eliminado con exito": results.affectedRows});
    });
};
app.route("/clientes/:id").delete(delCliente);