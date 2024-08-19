import express from 'express';
import cors from 'cors';
import olaRoute from './routes/ola.js';
import privateRoute from './routes/private.js';
import auth from './middleware/auth.js';

const app = express();

// Middleware de CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://lucasnfagr.netlify.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Para lidar com requisições preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).json({});
    }

    next();
});

// Middleware para JSON
app.use(express.json());

// Suas rotas
app.use('/', olaRoute);
app.use('/', auth, privateRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
