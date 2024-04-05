const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

//conexion con la base de datos
const {connection}=require('../config/config.db');

/************Consultar clientes*/
const getProductos = (request,response) => {
    connection.query("SELECT * FROM productos",
    (error,results)=>{
        if(error){
            throw error;
        }
        response.status(201).json(results);
    });
};
//ruta
app.route("/productos").get(getProductos);
module.exports = app;

/************Insertar o Actualizar productos*/
const postProducto = (request, response) => {
    const {action,id,nombre,descripcion,precio,stock,ProductoID} = request.body;
    //console.log(action);return false;
    if(action == "insert"){
        connection.query("INSERT INTO productos (Nombre, Descripcion, Precio, Stock) VALUES (?,?,?,?)", 
        [nombre,descripcion,precio,stock],
        (error, results) => {
            if(error){
                throw error;
            }else
                response.status(201).json({"Producto añadido correctamente": results.affectedRows});
        });
    }else{
        connection.query("UPDATE productos SET Nombre=?, Descripcion =?, Precio = ?, Stock = ? WHERE ProductoID = "+ProductoID+"", 
        [nombre, descripcion,precio,stock,id],
        (error, results) => {
            if(error){
                throw error;
            }else{
                response.status(201).json({"Producto editado con exito": results.affectedRows});
            }
        });
    }
};
app.route("/productos").post(postProducto);

/************Encontrar ID para Editar productos*/
const getProductoId = (request,response) => {
    const id = request.params.id;
    connection.query("SELECT pr.*, pr.Nombre AS nombre, pr.Descripcion AS descripcion, pr.Precio AS precio, pr.Stock AS stock FROM productos pr WHERE pr.ProductoID = ?",
    [id],
    (error,results)=>{
        if(error)
            throw error;
        response.status(200).json(results);
    });
};
app.route("/productos/:id").get(getProductoId);

//Servicio para eliminar un producto
const delProducto = (request,response)=>{
    const id = request.params.id;
    //console.log(id); return false;
    connection.query("DELETE FROM productos WHERE ProductoID = ?",
    [id],
    (error,results) => {
        if(error){
            throw error;
        }
        response.status(201).json({"Producto eliminado":results.affectedRows});
    });
};
app.route("/productos/:id").delete(delProducto);