import express from 'express';
import cors from 'cors';
import olaRoute from './routes/ola.js';
import privateRoute from './routes/private.js';
import auth from './middleware/auth.js';

const app = express();

// Configurar o CORS usando a biblioteca cors
app.use(cors({
    origin: 'http://localhost:5173/', // Frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// app.use(cors('http://localhost:5173/'))

// Lidar com requisições preflight separadamente
app.options('*', cors());

app.use(express.json());

// Suas rotas
app.use('/', olaRoute);
app.use('/', auth, privateRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
