#  API Biblioteca - Dois L 

>Esta é uma API RESTful completa para gerenciamento de livros e autores, desenvolvida para demonstrar competências avançadas em desenvolvimento backend, persistência de dados e documentação de software.
O projeto utiliza uma arquitetura moderna com **TypeScript**, garantindo segurança de tipos, e o **Prisma ORM** para uma comunicação eficiente com o banco de dados relacional **PostgreSQL**.

---

## Demonstração 

A API está hospedada no **Render** e pode ser testada em tempo real:
 **[CLIQUE AQUI PARA ACESSAR A DOCUMENTAÇÃO INTERATIVA (SWAGGER)](https://api-biblioteca-bi7w.onrender.com/docs)**

---

## 🛠️ Tecnologias e Ferramentas

- **Linguagem:** TypeScript
- **Framework:** Express.js
- **ORM:** Prisma
- **Banco de Dados:** PostgreSQL
- **Documentação:** Swagger UI & OpenAPI 3.0
- **Segurança:** CORS
- **Hospedagem:** Render

## 🧠 Complexidade Técnica e Diferenciais

Este projeto não é apenas um CRUD simples. Ele implementa regras de negócio e infraestrutura de nível profissional:

#### 1. Modelagem Relacional e Integridade
- **Relacionamento 1:N:** Um autor pode possuir múltiplos livros.
- **Cascade Delete:** Configurado para manter a integridade referencial. Ao excluir um autor, todos os seus livros vinculados são removidos automaticamente pelo banco de dados.

#### 2. Filtros de Busca Avançados
- Implementação de busca por título de livro utilizando o operador `contains` do Prisma com a flag `mode: "insensitive"`, permitindo buscas flexíveis independente de letras maiúsculas ou minúsculas.

#### 3. Documentação Profissional (Swagger)
- Em vez de depender de manuais estáticos, a API possui uma interface visual onde é possível visualizar schemas, parâmetros e testar os endpoints diretamente pelo navegador.

#### 4. Infraestrutura em Nuvem
- Configuração de porta dinâmica (`process.env.PORT`) e host `0.0.0.0` para compatibilidade com ambientes de container/nuvem.
- Script de build automatizado que executa migrations de banco de dados (`prisma migrate deploy`) antes de iniciar o servidor.

---


## 📌 Endpoints da API

### **Autores (`/authors`)**
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `POST` | `/authors` | Cria um novo autor |
| `GET` | `/authors` | Lista todos os autores cadastrados |
| `DELETE` | `/authors/:id` | Remove um autor e limpa seus livros (Cascade) |

### **Livros (`/books`)**
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `POST` | `/books` | Cadastra um livro vinculado a um autor |
| `GET` | `/books` | Lista livros (Suporta query param `?title=`) |
| `PATCH` | `/books/:id` | Atualiza título ou preço de um livro existente |
| `DELETE` | `/books/:id` | Remove um livro específico |

---

## ⚙️ Como rodar localmente

1. **Clone o projeto:**
   ```bash
   git clone [https://github.com/danielluiz07/api-biblioteca.git](https://github.com/danielluiz07/api-biblioteca.git)
   
2. **Instale as depedências:**
   ```bash
   npm install
   
3. **Configure o ambiente:** Crie um arquivo `.env` na raiz com a string de conexão com o banco de dados de sua escolha. Exemplo com postgres
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/nomedobanco"
   
3. **Prepare o banco e rode o servidor:**
   ```bash
   npx prisma migrate dev
   npm run dev
