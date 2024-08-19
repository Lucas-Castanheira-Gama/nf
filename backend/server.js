import express from 'express';
import cors from 'cors';
import olaRoute from './routes/ola.js';
import privateRoute from './routes/private.js';
import auth from './middleware/auth.js';

const app = express();

const allowedOrigins = [
    'http://localhost:5173',  // Domínio de desenvolvimento
    'https://lucasnfagr.netlify.app' // Domínio de produção
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors()); // Para lidar com requisições preflight

app.use(express.json());

app.use('/', olaRoute);
app.use('/', auth, privateRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
