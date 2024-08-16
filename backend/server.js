import express from 'express';
import cors from 'cors';
import olaRoute from './routes/ola.js';
import privateRoute from './routes/private.js';
import auth from './middleware/auth.js';

const app = express();

// Middleware de CORS
app.use(cors({
    origin: 'https://lucasnfagr.netlify.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware para JSON
app.use(express.json());

// Suas rotas
app.use('/', olaRoute);
app.use('/', auth, privateRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
