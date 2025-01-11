const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');



const app = express();
const PORT = 3000;
app.use(cors({
  origin: 'https://lean123456lean.github.io/JUNINHO-BLOG/', // Substitua com o domínio do seu blog
}));

// Middleware
app.use(bodyParser.json());


// Configurar banco de dados SQLite
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conexão com o banco de dados estabelecida.');
  }
});


// Endpoint para buscar artigos do Dev.to
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









// Criar tabelas se não existirem
db.serialize(() => {
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

// Rota para adicionar um comentário
app.post('/add-comment', (req, res) => {
  const { autor, comentario } = req.body;

  if (!autor || !comentario) {
      return res.status(400).json({ message: "Nome e comentário são obrigatórios!" });
  }

  const stmt = db.prepare('INSERT INTO comentarios (autor, comentario) VALUES (?, ?)');
  stmt.run(autor, comentario, function(err) {
      if (err) {
          return res.status(500).json({ message: "Erro ao adicionar o comentário." });
      }
      res.status(200).json({ message: "Comentário adicionado com sucesso!", id: this.lastID });
  });
});

// Rota para buscar os comentários
app.get('/comentarios', (req, res) => {
  db.all('SELECT * FROM comentarios ORDER BY data DESC', [], (err, rows) => {
      if (err) {
          return res.status(500).json({ message: "Erro ao buscar os comentários." });
      }
      res.json(rows);
  });
});


// Rota para inserir e-mail
app.post('/subscribe', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email é obrigatório!' });
  }

  const query = `INSERT INTO subscriptions (email) VALUES (?)`;

  db.run(query, [email], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(409).json({ message: 'Email já cadastrado!' });
      }
      return res.status(500).json({ message: 'Erro ao salvar o email.' });
    }
    res.status(201).json({ message: 'Email cadastrado com sucesso!' });
  });
});

// Rota para obter todos os comentários
app.get('/comments', (req, res) => {
  db.all('SELECT * FROM comments', (err, rows) => {
    if (err) {
      console.error('Erro ao buscar comentários:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Rota para adicionar um novo comentário
app.post('/comments', (req, res) => {
  const { author, text, modal_id } = req.body;

  if (!author || !text || !modal_id) {
    res
      .status(400)
      .json({ error: 'Os campos "author", "text" e "modal_id" são obrigatórios.' });
    return;
  }

  const stmt = db.prepare(
    'INSERT INTO comments (author, text, modal_id) VALUES (?, ?, ?)'
  );
  stmt.run(author, text, modal_id, function (err) {
    if (err) {
      console.error('Erro ao inserir comentário:', err.message);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, author, text, modal_id });
  });
  stmt.finalize();
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

