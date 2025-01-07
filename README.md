

Um blog interativo dedicado a desenvolvedores júnior no início de suas carreiras. Os usuários podem explorar postagens que são atualizadas automaticamente com base em APIs externas e fazer comentários em tempo real.

Funcionalidades
Postagens dinâmicas atualizadas automaticamente a cada hora.
Integração com APIs externas para:
Previsão do tempo.
Cotação do dólar.
Notícias do mundo da tecnologia.
Sistema de comentários em tempo real.
Interface construída com HTML, CSS e JavaScript.
Backend com Node.js, usando Express e SQLite3.
Requisitos
Node.js (versão 16 ou superior)
npm (versão 8 ou superior)
Instalação
Clone este repositório:

Endpoints da API
1. Obter Postagens
Rota: /api/posts
Método: GET
Descrição: Retorna as postagens mais recentes.
2. Adicionar Comentário
Rota: /api/comments
Método: POST
Body:
json
Copiar código
{
  "postId": 1,
  "user": "Nome do Usuário",
  "comment": "Conteúdo do comentário"
}
3. Obter Comentários
Rota: /api/comments/:postId
Método: GET
Descrição: Retorna os comentários de um post específico.
Integrações de API Externas

API de Previsão do Tempo
URL Base: https://api.openweathermap.org/data/2.5/weather
Parâmetros:
q: Cidade
appid: Chave da API
Exemplo de uso:
bash
Copiar código
https://api.openweathermap.org/data/2.5/weather?q=São Paulo&appid=sua-chave

API de Cotação do Dólar
URL Base: https://api.exchangerate-api.com/v4/latest/USD
Descrição: Obtém a cotação atual do dólar.
API de Notícias

URL Base: https://newsapi.org/v2/top-headlines
Parâmetros:
category=technology: Notícias de tecnologia.
apikey: Chave da API.
Exemplo de uso:
bash
Copiar código
https://newsapi.org/v2/top-headlines?category=technology&apikey=sua-chave
Tecnologias Usadas

Frontend:
HTML, CSS, JavaScript
Backend:
Node.js, Express
Banco de Dados:
SQLite3
APIs Externas:
OpenWeather (Clima)
NewsAPI (Notícias)
Exchangerate API (Cotação do dólar)

Contribuição
Sinta-se à vontade para contribuir com melhorias. Faça um fork deste repositório, implemente suas alterações e envie um pull request.



![Captura de tela 2025-01-07 074304](https://github.com/user-attachments/assets/551023c1-28ce-4165-a29d-c33d7d8e809d)

