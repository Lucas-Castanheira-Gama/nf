import express from 'express';
import cors from 'cors';
import olaRoute from './routes/ola.js';
import privateRoute from './routes/private.js';
import auth from './middleware/auth.js';

const app = express();


app.use(cors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
}));


app.options('*', cors()); // Para lidar com requisições preflight

app.use(express.json());

app.use('/', olaRoute);
app.use('/', auth, privateRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
