// server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;
const secretKey = 'your_secret_key'; // Cambia esto por una clave secreta segura

app.use(cors());
app.use(bodyParser.json());

// Ruta de login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Simulación de autenticación (puedes cambiar esta lógica)
    if (username === 'usuario' && password === 'contraseña') {
        const token = jwt.sign({ username }, secretKey);
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Credenciales incorrectas' });
    }
});

app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});

module.exports = app;