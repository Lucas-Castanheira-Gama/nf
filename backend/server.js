import express from 'express'
import { Router } from 'express';
import olaRoute from './routes/ola.js'
import privateRoute from './routes/private.js'
import cors from 'cors'
import auth from './middleware/auth.js'

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://lucasnfagr.netlify.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.use(express.json())
app.use('/', olaRoute)
app.use('/', auth, privateRoute)

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});