import express from "express";
import { PrismaClient } from "@prisma/client";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();
const prisma = new PrismaClient();
const port = 3000;

app.use(express.json());

// Configurações do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Biblioteca DLzzz',
      version: '1.0.0',
      description: 'Documentação da API de gerenciamento de livros e autores',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/server.ts'], // Onde o Swagger vai procurar os comentários de documentação
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ============ Área do AUTOR ===============

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

// Deletar Autores
app.delete("/authors/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.author.deleteMany({
      where: { id },
    });
    return res.status(201).json({
      message: "Autor deletado com sucesso",
    });
  } catch (error: any) {
    if (error.code === "P2003") {
      return res.status(400).json({
        error:
          "Não é possível deletar um autor que possui livros cadastrados. Delete os livros primeiro.",
      });
    }
    return res.status(404).json({
      message: "Autor nao encontrado",
    });
  }
});

// Área de Livros

// Cadastrar Livros
app.post("/books", async (req, res) => {
  const { title, price, authorId } = req.body;

  try {
    const newBook = await prisma.book.create({
      data: { title, price, authorId },
    });
    return res.status(201).json({
      newBook,
      message: "Livro cadastrado com sucesso",
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao cadastrar livro" });
  }
});

// Exibir Livros
app.get("/books", async (req, res) => {
  const { title } = req.query;

  try {
    const books = await prisma.book.findMany({
      where: {
        title: {
          contains: title ? String(title) : undefined,
          mode: "insensitive",
        },
      },
      include: {
        author: true,
      },
    });
    return res.json(books)
  } catch (error) {
    return res.status(500).json({error: "Erro ao buscar livros"})
  }
});

// Atualizar Livros
app.patch("/books/:id", async (req, res) => {
  const { id } = req.params;
  const { title, price } = req.body;

  try {
    const updateBook = await prisma.book.update({
      where: { id },
      data: {
        title,
        price,
      },
    });
    return res.json(updateBook);
  } catch (error) {
    return res
      .status(404)
      .json({ error: "Livro não encontrado para ser atualizado" });
  }
});

// Deletar Livros
app.delete("/books/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.book.deleteMany({
      where: { id },
    });
    return res.status(204).send();
  } catch (error) {
    return res.status(404).json({
      message: "Livro nao encontrado",
    });
  }
});

app.listen(port, () => {
  console.log("Acesse: http://localhost:3000");
  console.log(` Server on na porta ${port}`);
});
