const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Acessando a variável de ambiente
const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;
const secretKey = process.env.JWT_SECRET || 'mysecretkey'; // Definir a chave secreta para JWT

console.log('API Key:', apiKey);  // Isso agora deve funcionar

// Middleware
app.use(cors({
  origin: ["https://lean123456lean.github.io", "http://127.0.0.1:5503"],
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
}));
app.use(bodyParser.json());
app.use(cookieParser());

// Configuração do banco de dados SQLite
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conexão com o banco de dados estabelecida.');
  }
});

// Criar tabelas se não existirem
db.serialize(() => {
  // Tabela "users"
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )`,
    (err) => {
      if (err) {
        console.error('Erro ao criar tabela de usuários:', err.message);
      } else {
        console.log('Tabela "users" pronta para uso.');
      }
    }
  );

  // Tabela "comments"
  db.run(
    `CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author TEXT,
      text TEXT,
      modal_id TEXT
    )`,
    (err) => {
      if (err) {
        console.error('Erro ao criar a tabela "comments":', err.message);
      } else {
        console.log('Tabela "comments" pronta para uso.');
      }
    }
  );

  // Tabela "subscriptions"
  db.run(
    `CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    (err) => {
      if (err) {
        console.error('Erro ao criar a tabela "subscriptions":', err.message);
      } else {
        console.log('Tabela "subscriptions" pronta para uso.');
      }
    }
  );
});

// Simulação de banco de dados
const users = [];

// Rota de registro
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
  }

  const query = `SELECT * FROM users WHERE email = ?`;
  db.get(query, [email], async (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao verificar o usuário' });
    }

    if (row) {
      return res.status(400).json({ message: 'Usuário já cadastrado!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
    db.run(insertQuery, [name, email, hashedPassword], function (err) {
      if (err) {
        return res.status(500).json({ message: 'Erro ao registrar o usuário' });
      }

      res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    });
  });
});

// Rota de login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios!' });
  }

  const query = `SELECT * FROM users WHERE email = ?`;
  db.get(query, [email], async (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao verificar o usuário' });
    }

    if (!row) {
      return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, row.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Senha incorreta!' });
    }


    const token = jwt.sign({ email: row.email }, secretKey, { expiresIn: '1h' });
    console.log("Token gerado:", token);  // Adicione esta linha
    res.status(200).json({ message: 'Login bem-sucedido!', token });
  });
});

// Rota para obter artigos do Dev.to
app.get('/api/devto-articles', async (req, res) => {
  try {
    const response = await axios.get('https://dev.to/api/articles', {
      params: {
        tag: 'javascript', // Filtro por tag (ex: "javascript", "react", etc.)
        per_page: 10 // Número de artigos por página
      }
    });

    const articles = response.data.map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      image: article.cover_image || 'https://via.placeholder.com/150', // Imagem ou placeholder
      publishedAt: article.published_at,
      author: article.user.name
    }));

    res.status(200).json(articles);
  } catch (error) {
    console.error('Erro ao buscar artigos do Dev.to:', error);
    res.status(500).json({ error: 'Erro ao buscar artigos do Dev.to' });
  }
});

// Rota para inserir e-mail
app.post('/subscribe', (req, res) => {
  const { email } = req.body;

  if (!email) {
    console.error('Email não fornecido pelo cliente.');
    return res.status(400).json({ message: 'Email é obrigatório!' });
  }

  const query = `INSERT INTO subscriptions (email) VALUES (?)`;

  db.run(query, [email], function (err) {
    if (err) {
      console.error('Erro ao inserir no banco de dados:', err.message);
      if (err.message.includes('UNIQUE')) {
        return res.status(409).json({ message: 'Email já cadastrado!' });
      }
      return res.status(500).json({ message: 'Erro ao salvar o email.' });
    }
    console.log('Email cadastrado com sucesso:', email);
    res.status(201).json({ message: 'Email cadastrado com sucesso!' });
  });
});


// Rota para obter comentários
let comments = [];
app.get("/comments", (req, res) => {
  res.json(comments);
});

// Rota para adicionar um comentário
app.post("/comments", (req, res) => {
  const { author, text } = req.body;

  if (!author || !text) {
    return res.status(400).json({ error: "Author and text are required." });
  }

  comments.push({ author, text });
  res.status(201).json({ message: "Comment added successfully!" });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
