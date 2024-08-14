import express from 'express';
import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import multer from 'multer';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
const prisma = new PrismaClient();
const route = Router();

route.use(express.json()); // Adicione isso para processar JSON no corpo da solicitação

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

route.post('/listar', upload.single('pdf'), async (req, res) => {
    const { optionStatus, optionAut, numeroPed } = req.body;
    const userID = req.headers['user'];
    const pdfBuffer = req.file; // Pegue o buffer do arquivo PDF

    if (!userID || typeof userID !== 'string') {
        return res.status(400).json({
            error: `User ID is ${userID} required and must be a string`,
        });
    }

    // Converta o buffer para uma string base64 para enviar ao Python
    const pdfBase64 = pdfBuffer.buffer.toString('base64');

    const pythonProcess = spawn('python', [path.join(__dirname, 'extrair_dados_nf.py')]);
    
    let pythonData = '';
    
    // Enviar o PDF em base64 para o script Python através de stdin
    pythonProcess.stdin.write(pdfBase64);
    pythonProcess.stdin.end();
    
    pythonProcess.stdout.on('data', (data) => {
        pythonData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Erro no Python: ${data}`);
    });

    pythonProcess.on('close', async (code) => {
        if (code === 0) {
            const extractedData = JSON.parse(pythonData);
            const numeroNf = extractedData["Numero da NF"];
            const fornecedor = extractedData["Fornecedor"];
            // const date = extractedData["Data de Vencimento"];
            const valor = extractedData["Valor Total da Nota"];

            const dateArray = extractedData["Data de Vencimento"];
            const dateString = JSON.stringify(dateArray);

            try {
                const newDocument = await prisma.document.create({
                    data: {
                        numeroNf,
                        pdf: pdfBuffer.buffer,  // Armazenar o PDF como binário no banco de dados
                        fornecedor,
                        optionStatus,
                        date: dateString,
                        optionAut,
                        numeroPed,
                        valor,
                        user: {
                            connect: { id: userID },
                        },
                    },
                });
                res.status(200).send(newDocument);
            } catch (error) {
                console.error('Erro ao atualizar o usuário:', error);
                res.status(500).json({ message: 'Erro ao atualizar o usuário.' });
            }
        } else {
            res.status(500).send('Erro ao processar o PDF.');
        }
    });
});


route.get('/validar', async (req,res) =>{
    res.status(202).json({ message: 'tudo certo' })

})

route.get('/name', async (req,res) =>{
    const userID = req.headers['user'];
    try{
        const vizu = await prisma.user.findUnique(
            { 
                where: { id: userID },
            },
            
        )
        const name = vizu.name
        res.status(202).json(name)
    }catch(err){
        res.status(401).json({ message: 'nome invalido' })
    }
    
})

route.get('/visualizar',async (req,res) =>{

    const userID = req.headers['user'];
    
    if (!userID || typeof userID !== 'string') {
        return res.status(400).json({ error: `User ID is ${userID} required and must be a string`, });
    }
    // res.status(201).json('tudo certo')

    try{
        const vizu = await prisma.user.findUnique(
            { 
                where: { id: userID },
                include:{ documents:true },
            },
            
        )

        const documents = vizu.documents

        res.status(202).json(documents)


    }catch(err){
        res.status(401).json({ message: 'problema em mostrar os dados' })
    }

})




route.post('/entreguar', async (req, res) => {
    const userID = req.headers['user'];
    const documentid = req.headers['documentid'];
    const { optionStatus } = req.body; // O Multer processa o `FormData` e coloca os campos em `req.body`.

    if (!documentid) {
        return res.status(400).json({ message: 'campo entregue invalido' });
    }

    if (!userID || typeof userID !== 'string') {
        return res.status(400).json({ error: `User ID is ${userID} required and must be a string` });
    }

    try {
        const vizu = await prisma.document.update({
            where: { id: documentid },
            data: {
                optionStatus,
            },
        });

        console.log(vizu);

        const status = vizu.optionStatus;

        res.status(202).json(status);
    } catch (err) {
        res.status(401).json({ message: 'nao marcado como entregue' });
    }
});

route.delete('/deletar', async (req,res) =>{
    const userID = req.headers['user'];
    const documentid = req.headers['documentid'];

    if (!documentid) {
        return res.status(400).json({ message: 'campo entregue invalido' });
    }

    if (!userID || typeof userID !== 'string') {
        return res.status(400).json({ error: `User ID is ${userID} required and must be a string` });
    }

    try{
        const deletado = await prisma.document.delete({
            where:{ id:documentid }
        })
        
        res.status(200).json(deletado)

    }catch(er){
        res.status(400).json({ message: 'document id incorret' })

    }



})

export default route;
