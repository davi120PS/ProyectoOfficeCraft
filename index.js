const express = require ("express");
const app = express();
const jwt = require('jsonwebtoken');
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

//cargamos el archivo de rutas
app.use(require('./routes/login'))
app.use(require('./routes/clientes'));
app.use(require('./routes/pedidos'));
app.use(require('./routes/detallespedido'));
app.use(require('./routes/productos'));

const PORT = process.env.PORT;

app.listen(PORT,()=>{
    console.log('El servidor escucha en el puerto '+ PORT);
});

module.exports = app;