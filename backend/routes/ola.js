import { json, Router } from "express";
import express from 'express'
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const route = Router()
const app = express
const JWT_SECRET = process.env.JWT_SECRET

const prisma = new PrismaClient()

route.get('/', (req,res)=>{
    res.send("TESTANDOO")
})


route.post('/cadastro', async (req, res) => {
    const { email, name, password } = req.body;
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    try {
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: passwordHash,
            },
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});

route.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Verifique a conexão
      await prisma.$connect();
      console.log('Conectado ao banco de dados');
  
      const user = await prisma.user.findUnique({ where: { email } });
  
      if (!user) {
        return res.status(400).json({ message: 'Email incorreto' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Senha incorreta' });
      }
  
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });
      const userID = user.id;
  
      res.status(200).json({ token, userID });
      console.log('Login realizado com sucesso');
  
    } catch (err) {
      console.error('Erro ao conectar-se ao banco de dados:', err);
      res.status(500).json({ error: 'Erro contate o suporte' });
    } finally {
      await prisma.$disconnect();
    }
  });
  



export default route