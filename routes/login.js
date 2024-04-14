const express = require("express");
const app = express();
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');
dotenv.config();

app.use(express.urlencoded({extended: true}))
app.use(express.json());
const {connection} = require("../config/config.db");


app.get('/api', validateToken, (req,res) =>{
    res.json({
        tuits:[
            {
                id:0,
                text: 'este es mi primer tuit',
                username: 'jony'
            },
            {
                id:0,
                text: 'De los Santos es:',
                username: 'Jorge'
            }
        ]
    });
});

app.get('/login',(req, res) =>{
    res.send(`<html>
    <head>
    <title>Login</title>
    </head>
    <body>
    <form method="POST" action="/auth">
    Nombre de usuario: <input type="text" name= "text"><br/>
    Contraseña: <input type ="password" name = "password"><br/>
    <input type="submit" value= "Iniciar Sesion" />
    </form>
    </body>
    </html>`
    );

});
app.post('/auth', (req, res) =>{
    const{username, password} = req.body;

    //Consultar base de datos y validar
    const user = {username : username};

    const accesToken = generateAccessToken(user);
    res.header('authorization', accesToken).json({
        message: 'Usuario autenticado',
        token: accesToken
    });
});

function generateAccessToken(user){
    return jwt.sign(user, process.env.SECRET, {expiresIn: '5m'});
}

function validateToken(req, res, next){
    const accesToken= req.header['authorization'];
    if(!accesToken) res.send('Access denied');

    jwt.verify(accesToken, process.env.SECRET, (err,user) =>{
        if (err){
            res.send('Access denied, token expired or incorrect');
        }else{
            next();
        }
    });
}
module.exports = app;