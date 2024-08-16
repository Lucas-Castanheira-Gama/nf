import express from 'express'
import { Router } from 'express';
import olaRoute from './routes/ola.js'
import privateRoute from './routes/private.js'
import cors from 'cors'
import auth from './middleware/auth.js'

const app = express();
app.use(cors({
    origin: '*', // Permite todas as origens (não recomendado em produção)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));



app.use(express.json())
app.use('/', olaRoute)
app.use('/', auth, privateRoute)

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});