import express from "express";
import { PrismaClient } from "@prisma/client";
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();
const prisma = new PrismaClient();

const port = process.env.PORT || 3000;

app.use(express.json());

// Configurações do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Biblioteca do Dois L',
      version: '1.0.0',
      description: 'Documentação da API de gerenciamento de livros e autores',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ['./src/server.ts'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ============ Área do AUTOR ===============

/**
 * @openapi
 * /authors:
 * post:
 * summary: Cadastra um novo autor
 * tags: [Autores]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * name:
 * type: string
 * responses:
 * 201:
 * description: Autor criado com sucesso
 */
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

/**
 * @openapi
 * /authors:
 * get:
 * summary: Lista todos os autores
 * tags: [Autores]
 * responses:
 * 200:
 * description: Lista de autores cadastrados
 */
app.get("/authors", async (req, res) => {
  const authors = await prisma.author.findMany();
  return res.json(authors);
});

/**
 * @openapi
 * /authors/{id}:
 * delete:
 * summary: Remove um autor
 * tags: [Autores]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 204:
 * description: Autor deletado com sucesso
 */
app.delete("/authors/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.author.delete({
      where: { id },
    });
    return res.status(200).json({ message: "Autor deletado com sucesso" });
  } catch (error: any) {
    return res.status(404).json({ message: "Autor não encontrado ou possui livros dependentes" });
  }
});

// =========== Área de Livros =========

/**
 * @openapi
 * /books:
 * post:
 * summary: Cadastra um novo livro
 * tags: [Livros]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * title:
 * type: string
 * price:
 * type: number
 * authorId:
 * type: string
 * responses:
 * 201:
 * description: Livro cadastrado com sucesso
 */
app.post("/books", async (req, res) => {
  const { title, price, authorId } = req.body;
  try {
    const newBook = await prisma.book.create({
      data: { title, price, authorId },
    });
    return res.status(201).json({ newBook, message: "Livro cadastrado com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao cadastrar livro" });
  }
});

/**
 * @openapi
 * /books:
 * get:
 * summary: Lista livros com filtro opcional
 * tags: [Livros]
 * parameters:
 * - in: query
 * name: title
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Retorna livros encontrados
 */
app.get("/books", async (req, res) => {
  const { title } = req.query;
  try {
    const books = await prisma.book.findMany({
      where: {
        title: { contains: title ? String(title) : undefined, mode: "insensitive" },
      },
      include: { author: true },
    });
    return res.json(books);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar livros" });
  }
});

/**
 * @openapi
 * /books/{id}:
 * patch:
 * summary: Atualiza dados de um livro
 * tags: [Livros]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * requestBody:
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * title:
 * type: string
 * price:
 * type: number
 * responses:
 * 200:
 * description: Livro atualizado
 */
app.patch("/books/:id", async (req, res) => {
  const { id } = req.params;
  const { title, price } = req.body;
  try {
    const updateBook = await prisma.book.update({
      where: { id },
      data: { title, price },
    });
    return res.json(updateBook);
  } catch (error) {
    return res.status(404).json({ error: "Livro não encontrado" });
  }
});

/**
 * @openapi
 * /books/{id}:
 * delete:
 * summary: Remove um livro específico
 * tags: [Livros]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 204:
 * description: Livro removido
 */
app.delete("/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.book.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    return res.status(404).json({ message: "Livro não encontrado" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server on: http://localhost:${port}`);
  console.log(`📄 Docs on: http://localhost:${port}/docs`);
});