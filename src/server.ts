import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app = express();
const prisma = new PrismaClient();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

// ========= CONFIGURAÇÃO DO SWAGGER  ===========
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Biblioteca do Dois L",
      version: "1.0.0",
      description: "Documentação completa da API de livros e autores",
    },
    servers: [{ url: '/' }],
    paths: {
      "/authors": {
        get: {
          summary: "Lista todos os autores",
          tags: ["Autores"],
          responses: { 200: { description: "Sucesso" } },
        },
        post: {
          summary: "Cadastra um novo autor",
          tags: ["Autores"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { name: { type: "string" } },
                },
              },
            },
          },
          responses: { 201: { description: "Criado" } },
        },
      },
      "/authors/{id}": {
        delete: {
          summary: "Remove um autor e seus livros",
          tags: ["Autores"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: { description: "Autor deletado com sucesso" },
            404: { description: "Autor não encontrado" },
          },
        },
      },
      "/books": {
        get: {
          summary: "Lista livros com filtro opcional",
          tags: ["Livros"],
          parameters: [
            {
              name: "title",
              in: "query",
              schema: { type: "string" },
              description: "Parte do título",
            },
          ],
          responses: { 200: { description: "Sucesso" } },
        },
        post: {
          summary: "Cadastra um novo livro",
          tags: ["Livros"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    price: { type: "number" },
                    authorId: { type: "string" },
                  },
                },
              },
            },
          },
          responses: { 201: { description: "Livro criado" } },
        },
      },
      "/books/{id}": {
        patch: {
          summary: "Atualiza dados de um livro",
          tags: ["Livros"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    price: { type: "number" },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: "Livro atualizado" },
            404: { description: "Livro não encontrado" },
          },
        },
        delete: {
          summary: "Remove um livro específico",
          tags: ["Livros"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
            },
          ],
          responses: {
            204: { description: "Livro removido" },
            404: { description: "Não encontrado" },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ============ ROTAS (LIMPAS E SEM COMENTÁRIOS CHATOS) ===============

app.post("/authors", async (req, res) => {
  const { name } = req.body;
  try {
    const newAuthor = await prisma.author.create({ data: { name } });
    res.status(201).json(newAuthor);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar autor." });
  }
});

app.get("/authors", async (req, res) => {
  const authors = await prisma.author.findMany();
  res.json(authors);
});

app.delete("/authors/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.author.delete({ where: { id } });
    res.status(200).json({ message: "Autor deletado" });
  } catch (error) {
    res.status(404).json({ error: "Autor não encontrado" });
  }
});

app.post("/books", async (req, res) => {
  const { title, price, authorId } = req.body;
  try {
    const newBook = await prisma.book.create({
      data: { title, price, authorId },
    });
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: "Erro ao cadastrar livro" });
  }
});

app.get("/books", async (req, res) => {
  const { title } = req.query;

  try {
    const books = await prisma.book.findMany({
      where: title
        ? {
            title: {
              contains: String(title),
              mode: "insensitive",
            },
          }
        : {},
      include: {
        author: true,
      },
    });
    return res.json(books);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar livros" });
  }
});

app.patch("/books/:id", async (req, res) => {
  const { id } = req.params;
  const { title, price } = req.body;
  try {
    const updateBook = await prisma.book.update({
      where: { id },
      data: { title, price },
    });
    res.json(updateBook);
  } catch (error) {
    res.status(404).json({ error: "Livro não encontrado" });
  }
});

app.delete("/books/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.book.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: "Livro não encontrado" });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(` API: http://localhost:${port}`);
  console.log(` Docs: http://localhost:${port}/docs`);
});
