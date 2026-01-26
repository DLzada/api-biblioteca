import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const port = 3000;

app.use(express.json());

// Cadastrar autores
app.post("/authors", async (req, res) => {
  const { name } = req.body;

  try {
    const newAuthor = await prisma.author.create({
      data: { name },
    });
    return res.status(201).json(newAuthor);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar autor." });
  }
});

// Exibir Autores
app.get("/authors", async (req, res) => {
  const authors = await prisma.author.findMany();
  return res.json(authors);
});

// Cadastrar Livro
app.post("/authors", async (req, res) => {
  const { title, price, authorId } = req.body;

  try {
    const newBook = await prisma.author.create({
      data: { title, price, authorId },
    });
    return res.status(201).json({
        message: "Livro cadastrado com sucesso"
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao cadastrar livro" });
  }
});

app.listen(port, () => {
  console.log(` Server on na porta ${port}`);
});
