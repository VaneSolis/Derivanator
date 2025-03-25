const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Configuración de CORS más permisiva
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Ruta para el archivo de usuarios
const usersFile = path.join(__dirname, 'users.json');

// Asegurarse de que el archivo users.json existe y tiene el formato correcto
try {
    if (!fs.existsSync(usersFile)) {
        console.log('Creando archivo users.json...');
        fs.writeFileSync(usersFile, '{}', 'utf8');
    } else {
        console.log('Verificando formato de users.json...');
        const content = fs.readFileSync(usersFile, 'utf8');
        JSON.parse(content);
    }
} catch (error) {
    console.error('Error al inicializar users.json:', error);
    fs.writeFileSync(usersFile, '{}', 'utf8');
}

// Ruta de prueba
app.get('/test', (req, res) => {
    res.json({ message: 'Servidor funcionando correctamente' });
});

// Ruta para registro
app.post('/register', (req, res) => {
    try {
        console.log('Recibida solicitud de registro:', req.body);
        const { email, password } = req.body;
        
        if (!email || !password) {
            console.log('Error: Faltan campos requeridos');
            return res.status(400).json({ message: 'El email y la contraseña son requeridos' });
        }
        
        // Leer usuarios existentes
        console.log('Leyendo archivo users.json...');
        const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
        
        // Verificar si el usuario ya existe
        if (users[email]) {
            console.log('Error: Usuario ya existe');
            return res.status(400).json({ message: 'El usuario ya existe' });
        }
        
        // Guardar nuevo usuario
        console.log('Guardando nuevo usuario...');
        users[email] = password;
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf8');
        
        console.log('Usuario registrado exitosamente');
        res.json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ message: 'Error al registrar el usuario: ' + error.message });
    }
});

// Ruta para login
app.post('/login', (req, res) => {
    try {
        console.log('Recibida solicitud de login:', req.body);
        const { email, password } = req.body;
        
        if (!email || !password) {
            console.log('Error: Faltan campos requeridos');
            return res.status(400).json({ message: 'El email y la contraseña son requeridos' });
        }
        
        // Leer usuarios
        console.log('Leyendo archivo users.json...');
        const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
        
        // Verificar credenciales
        if (users[email] && users[email] === password) {
            console.log('Login exitoso');
            res.json({ message: 'Inicio de sesión exitoso' });
        } else {
            console.log('Error: Credenciales incorrectas');
            res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        }
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error al iniciar sesión: ' + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log('Directorio actual:', __dirname);
    console.log('Ruta del archivo users.json:', usersFile);
}); 