const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

//conexion con la base de datos
const {connection}=require('../config/config.db');

/************Consultar clientes*/
const getCliente = (request,response) => {
    connection.query("SELECT * FROM clientes",
    (error,results)=>{
        if(error)
            throw error;
        response.status(200).json(results);
    });
};
//ruta
app.route("/clientes").get(getCliente);
module.exports = app;

/************Insertar o Actualizar clientes*/
const postAlumno = (request, response) => {
    const {action,id, nombre, correoElectronico, direccion} = request.body;
    //console.log(action);return false;
    if(action == "insert"){
        connection.query("INSERT INTO clientes (Nombre, CorreoElectronico, Direccion) VALUES (?,?,?)", 
        [nombre, CorreoElectronico, direccion],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Item añadido correctamente": results.affectedRows});
        });
    }else{
        //console.log(action);return false;
        connection.query("UPDATE clientes SET ClienteID = ?, Nombre = ?, CorreoElectronico = ? , Direccion = ?, WHERE ClienteID = ?", 
        [nombre, correoElectronico, direccion,id],
        (error, results) => {
            if(error)
                throw error;
            response.status(201).json({"Cliente editado con exito": results.affectedRows});
        });
    }
};
app.route("/clientes").post(postAlumno);

/************Eliminar clientes*/
const delCliente = (request,response) => {
    const id = request.params.id;
    //console.log(id); return false;
    connection.query("DELETE FROM clientes WHERE ClienteID = ?",
    [id],
    (error,results)=>{
        if(error)
            throw error;
        response.status(201).json({"Cliente eliminado":results.affectedRows});
    });
};
app.route("/clientes/:id").delete(delCliente);