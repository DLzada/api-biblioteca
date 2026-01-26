import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('DLzzz - API de Livros Online ');
});

app.get('/books', async (req, res) => {
  const books = await prisma.book.findMany();
  res.json(books);
});

app.listen(port, () => {
  console.log(` Server on na porta ${port}`);
});