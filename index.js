



// Evento de pesquisa
document.getElementById("searchBar").addEventListener("input", function (e) {
    const query = e.target.value.toLowerCase();
    const posts = document.querySelectorAll(".post");

    posts.forEach(post => {
        const title = post.querySelector(".post-title").textContent.toLowerCase();
        if (title.includes(query)) {
            post.style.display = "block"; // Mostra o post
        } else {
            post.style.display = "none"; // Esconde o post
        }
    });
    console.log("O arquivo script.js foi carregado com sucesso!");
});


// usso da api para atualizar post populares da página
document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "f309d331c4994735bce1f5c3fe2f9882"; // Substitua com sua chave da News API ou outra API
    const apiUrl = `https://newsapi.org/v2/top-headlines?category=technology&apiKey=${apiKey}`;

    // Função para obter os posts
    function fetchPosts() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const postsList = document.getElementById('popular-posts');
                postsList.innerHTML = ""; // Limpa a lista existente

                // Adiciona cada post na lista
                data.articles.forEach(article => {
                    const li = document.createElement('li');
                    li.classList.add('w3-padding-16');

                    li.innerHTML = `
                        <img src="${article.urlToImage}" alt="Image" class="w3-left w3-margin-right" style="width:50px">
                        <span class="w3-large">${article.title}</span><br>
                        <a href="${article.url}"><span>${article.url}</span></a>
                    `;

                    postsList.appendChild(li);
                });
            })
            .catch(error => {
                console.error('Erro ao carregar os posts:', error);
            });
    }

    
    // Chama a função para carregar os posts
    fetchPosts();
});

//Função para buscar as notícias do Dev.to

document.addEventListener('DOMContentLoaded', function () {
    const tagSelect = document.getElementById('tag');
    const articlesContainer = document.getElementById('articles-container');

    // Função para buscar as notícias do Dev.to com base na tag selecionada
    async function fetchArticles(tag) {
        try {
            const response = await fetch(`https://dev.to/api/articles?tag=${tag}&per_page=5`);
            const articles = await response.json();

            // Limpar o conteúdo anterior
            articlesContainer.innerHTML = '';

            // Adicionar os novos artigos à página
            articles.forEach(article => {
                const articleCard = document.createElement('div');
                articleCard.classList.add('article-card');

                articleCard.innerHTML = `
                    <img src="${article.cover_image || 'https://via.placeholder.com/150'}" alt="${article.title}">
                    <h3>${article.title}</h3>
                    <p>${article.description}</p>
                    <a href="${article.url}" target="_blank">Ler mais</a>
                `;

                articlesContainer.appendChild(articleCard);
            });
        } catch (error) {
            console.error('Erro ao buscar artigos:', error);
            articlesContainer.innerHTML = '<p>Erro ao carregar artigos. Tente novamente mais tarde.</p>';
        }
    }

    // Carregar artigos de JavaScript por padrão
    fetchArticles('javascript');

    // Atualizar os artigos quando a tag for alterada
    tagSelect.addEventListener('change', function () {
        const selectedTag = tagSelect.value;
        fetchArticles(selectedTag);
    });
});





/* Data e hora */
function updateDateTime() {
    const now = new Date();

    // Obter data no formato "Dia da semana, DD/MM/AAAA"
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const currentDate = now.toLocaleDateString('pt-BR', options);

    // Obter hora no formato "HH:MM:SS"
    const currentTime = now.toLocaleTimeString('pt-BR', { hour12: false });

    // Atualizar o conteúdo da página
    document.getElementById('currentDate').textContent = currentDate;
    document.getElementById('currentTime').textContent = currentTime;
}

// Atualizar data e hora a cada segundo
setInterval(updateDateTime, 1000);

// Atualizar data e hora ao carregar a página
updateDateTime();


/* Clima tempo */

// Substitua pela sua chave da API
let chave = "95b21e4252bb169915cd54982dc75099";

        function colocarNaTela(dados) {
            console.log(dados); // Verifique se os dados estão sendo retornados corretamente

            const descricaoTempo = dados.weather[0].description; // Exemplo: "nuvens dispersas"
            const iconeClima = dados.weather[0].icon; // Exemplo: "04d"
            
            console.log("Descrição do tempo:", descricaoTempo);
            console.log("Ícone do clima:", iconeClima);

            // Exibe as informações da cidade
            document.querySelector(".cidade").innerHTML = "Tempo em " + dados.name;
            document.querySelector(".temp").innerHTML = Math.floor(dados.main.temp) + "°C";
            
            // Exibe a descrição detalhada do clima
            document.querySelector(".text-previsao").innerHTML = descricaoTempo.charAt(0).toUpperCase() + descricaoTempo.slice(1);
            
            // Exibe o ícone do tempo
            document.querySelector(".icone").src = `https://openweathermap.org/img/wn/${dados.weather[0].icon}.png`;
            
            // Exibe a umidade
            document.querySelector(".umidade").innerHTML = dados.main.humidity + "% de umidade";

            // Condicional para exibir a descrição detalhada do clima (nublado, chovendo, céu limpo)
            let condicaoDetalhada = "";
            if (descricaoTempo.includes("cloud")) {
                condicaoDetalhada = "Nublado";
            } else if (descricaoTempo.includes("rain")) {
                condicaoDetalhada = "Chuvoso";
            } else if (descricaoTempo.includes("clear")) {
                condicaoDetalhada = "Céu Limpo";
            } else {
                condicaoDetalhada = descricaoTempo.charAt(0).toUpperCase() + descricaoTempo.slice(1);
            }
            document.querySelector(".condicao").innerHTML = condicaoDetalhada;
        }

        async function buscarCidade(cidade) {
            try {
                let dados = await fetch("https://api.openweathermap.org/data/2.5/weather?q=" +
                    cidade +
                    "&appid=" +
                    chave +
                    "&lang=pt_br" +
                    "&units=metric")
                    .then(resposta => resposta.json());

                // Verifica se a cidade foi encontrada
                if (dados.cod === "404") {
                    alert("Cidade não encontrada. Tente novamente.");
                } else {
                    colocarNaTela(dados);
                }
            } catch (error) {
                alert("Erro ao buscar dados. Tente novamente.");
            }
        }

        function cliqueiNoBotao() {
            let cidade = document.querySelector(".input-cidade").value;
            if (cidade) {
                buscarCidade(cidade);
            } else {
                alert("Por favor, insira o nome da cidade.");
            }
        }

// Função para buscar dados da API


const languagesGrid = document.getElementById("languages-grid");
let allLanguages = [5]; // Array para armazenar todos os dados retornados

// Função para buscar dados da API
async function fetchLanguageDetails() {
    const url = "https://api.github.com/gists/public";

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Filtra apenas os gists com linguagens e armazena os resultados
        allLanguages = data
            .filter(gist => gist.files && Object.values(gist.files)[0].language)
            .map(gist => ({
                language: Object.values(gist.files)[0].language,
                description: gist.description || "Sem descrição disponível",
                link: gist.html_url
            }));

        // Exibe os resultados no grid
        displayLanguages(allLanguages);
    } catch (error) {
        console.error("Erro ao buscar linguagens:", error);
        languagesGrid.innerHTML = `<p>Erro ao carregar dados. Tente novamente mais tarde.</p>`;
    }
}

// Função para exibir as linguagens no grid
function displayLanguages(languages) {
    languagesGrid.innerHTML = ""; // Limpa o grid antes de adicionar novos itens
    languages.forEach(language => {
        const htmlContent = `
            <div class="item">
                <h2>${language.language}</h2>
                <p>${language.description}</p>
                <a href="${language.link}" target="_blank">Veja o exemplo</a>
            </div>
        `;
        languagesGrid.innerHTML += htmlContent;
    });
}

// Função para buscar linguagens com base no termo de pesquisa
function searchLanguage() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const filteredLanguages = allLanguages.filter(language =>
        language.language.toLowerCase().includes(searchInput)
    );

    // Exibe apenas os itens filtrados
    displayLanguages(filteredLanguages);
}

// Chama a função ao carregar a página
fetchLanguageDetails();


/* consumindo API noticias tecnologia  */

// Função para traduzir texto usando a API gratuita do Google Translate
async function traduzirTexto(texto, targetLanguage = "pt") {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(texto)}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Erro ao traduzir o texto.");
        }

        const data = await response.json();
        return data[0][0][0]; // Texto traduzido
    } catch (error) {
        console.error("Erro na tradução:", error.message);
        return texto; // Retorna o texto original em caso de erro
    }
}

// Função para formatar a data de publicação
function formatarData(dataISO) {
    const data = new Date(dataISO);
    const opcoes = { day: "2-digit", month: "long", year: "numeric" };
    return `Publicado em ${data.toLocaleDateString("pt-BR", opcoes)}`;
}

// Função para buscar notícias da API
async function fetchTechNews() {
    const apiKey = 'f309d331c4994735bce1f5c3fe2f9882'; // Substitua pela sua chave
    const url = `https://newsapi.org/v2/top-headlines?category=technology&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);

        // Verifique se a resposta é válida
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }

        const data = await response.json();

        // Verifique o status da resposta
        if (data.status !== 'ok') {
            throw new Error('Erro ao obter as notícias');
        }

        // Pegue o primeiro artigo da resposta
        const firstArticle = data.articles[0];

        // Traduzir título e descrição
        const tituloTraduzido = await traduzirTexto(firstArticle.title);
        const descricaoTraduzida = await traduzirTexto(firstArticle.description);

        // Formate a data de publicação
        const dataPublicacao = formatarData(firstArticle.publishedAt);

        // Atualize o conteúdo do container
        const newsContainer = document.getElementById('tech-news');
        newsContainer.innerHTML = `
            <div class="w3-container w3-margin-bottom">
                <img src="${firstArticle.urlToImage}" alt="${tituloTraduzido}" style="width: 100%; max-height: 300px; object-fit: cover;">
                <h4><b>${tituloTraduzido}</b></h4>
                <p>${dataPublicacao}</p> <!-- Data de publicação -->
                <p>${descricaoTraduzida}</p>
                <a href="${firstArticle.url}" target="_blank">
                    <button class="w3-button w3-padding-large w3-white w3-border">
                        LEIA MAIS »
                    </button>
                </a>
            </div>
        `;
    } catch (error) {
        console.error('Erro ao buscar notícias:', error.message);

        // Mostre uma mensagem de erro no frontend
        document.getElementById('tech-news').innerHTML = `
            <p style="color: red;">Erro ao carregar notícias. Tente novamente mais tarde.</p>
        `;
    }
}


// Chame a função ao carregar a página
fetchTechNews();



/* backend Comentários   */
async function fetchComments() {
    const response = await fetch('http://localhost:3000/comments');
    const comments = await response.json();
    console.log('Comentários recebidos:', comments); // Verifique os dados recebidos
    return comments;
}

async function addComment(author, text) {
    const response = await fetch('http://localhost:3000/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ author, text })
    });
    const comment = await response.json();
    return comment;
}

function displayComments(comments) {
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = ''; // Limpa os comentários anteriores

    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.innerHTML = `<p class="comment-author">${comment.author}</p><p>${comment.text}</p>`;
        commentsList.appendChild(commentElement);
    });
}

window.onload = async function () {
    const comments = await fetchComments();
    displayComments(comments);
};


document.getElementById('commentForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const author = document.getElementById('commentAuthor').value;
    const text = document.getElementById('commentText').value;

    await addComment(author, text);

    const comments = await fetchComments();
    displayComments(comments);

    document.getElementById('commentForm').reset();
});

window.onload = async function () {
    const comments = await fetchComments();
    displayComments(comments);
};


/* backend Conexão com o banco dados Post página principal */

document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:3000/comments")
        .then(response => response.json())
        .then(data => {
            const postContainer = document.getElementById("post");
            //postContainer.innerHTML = ""; // Limpa os posts anteriores

            data.forEach(comment => {
                // Cria os elementos para exibir o comentário
                const postArticle = document.createElement("article");
                postArticle.classList.add("post");

                const titleElement = document.createElement("h2");
                titleElement.classList.add("post-title");
                titleElement.textContent = comment.author;

                const textElement = document.createElement("p");
                textElement.classList.add("post-text");
                textElement.textContent = comment.text;

                postArticle.appendChild(titleElement);
                postArticle.appendChild(textElement);
                postContainer.appendChild(postArticle);
            });
        })
        .catch(err => console.error("Erro ao carregar comentários:", err));
});

/* Cadastro de email */
const form = document.querySelector('#input_group');
const emailInput = document.querySelector('#email');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();

    if (!email) {
        alert('Por favor, insira um email válido.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            emailInput.value = '';
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('Erro ao se conectar ao servidor.');
        console.error(error);
    }
});

let dollarChart;  // Variável global para armazenar o gráfico

// Função para criar o gráfico
function createDollarChart(data) {
    const ctx = document.getElementById('dollarChart').getContext('2d');
    
    // Se o gráfico já existir, destrua o gráfico antigo antes de criar um novo
    if (dollarChart) {
        dollarChart.destroy();
    }

    console.log("Dados para o gráfico:", data); // Log dos dados que serão passados para o gráfico

    dollarChart = new Chart(ctx, {
        type: 'line',  // Tipo do gráfico (linha)
        data: {
            labels: data.labels,  // Datas/tempos
            datasets: [{
                label: 'Cotação do Dólar',
                data: data.values,  // Valores da cotação
                borderColor: '#2ecc71',  // Cor da linha
                fill: false,  // Não preenche o gráfico
                tension: 0.1  // Suaviza a linha
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Data'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Cotação (R$)'
                    },
                    beginAtZero: false
                }
            },
            responsive: true
        }
    });
}

// Função para buscar a cotação do dólar e atualizar
async function fetchDollarQuote() {
    try {
        const response = await fetch('https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/USD');
        const data = await response.json();

        console.log("Resposta da API:", data); // Log para verificar a resposta da API

        const quote = data.result;

        // Arredonda o valor para 2 casas decimais
        const roundedQuote = quote.toFixed(2);
        
        // Atualiza o texto da cotação
        document.getElementById('quote').textContent = `R$ ${roundedQuote}`;
        
        // Dados para o gráfico (incluir valores históricos e a cotação atual)
        const chartData = {
            labels: ['2025-01-01', '2025-01-02', '2025-01-03', '2025-01-04', 'Agora'],
            values: [5.2, 5.1, 5.3, 5.4, parseFloat(roundedQuote)]  // Inclui a cotação atual
        };

        // Cria o gráfico com os dados atualizados
        createDollarChart(chartData);
    } catch (error) {
        console.error("Erro ao obter a cotação:", error);
        document.getElementById('quote').textContent = 'Erro ao carregar a cotação.';
    }
}


// Carrega a cotação assim que a página é carregada
window.onload = fetchDollarQuote;


/* busca public api */

function filterAPIs() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const apiElements = document.querySelectorAll('.api');
    
    apiElements.forEach(api => {
        const title = api.querySelector('h3').textContent.toLowerCase();
        if (title.includes(query)) {
            api.style.display = 'block';
        } else {
            api.style.display = 'none';
        }
    });
}

// URL do backend
const API_URL = 'http://localhost:3000';

// Função para validar e prevenir XSS
function sanitizeInput(input) {
    console.log('Sanitizando entrada:', input);
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Função de login para o modal
document.getElementById('login-form-modal').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('modal-email').value;
    const password = document.getElementById('modal-password').value;

    console.log('Tentativa de login com email:', email);

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Login bem-sucedido. Token recebido:', data.token);
            localStorage.setItem('token', data.token); // Armazena token JWT
            document.getElementById('modal-login-message').textContent = 'Login realizado com sucesso!';
        } else {
            console.warn('Erro no login:', data);
            document.getElementById('modal-login-message').textContent = 'Erro ao fazer login. Tente novamente.';
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        document.getElementById('modal-login-message').textContent = 'Erro de conexão. Tente novamente.';
    }
});

// Função para carregar e exibir os comentários no modal
async function carregarComentariosModal() {
    console.log('Carregando comentários...');
    try {
        const response = await fetch(`${API_URL}/comentarios`);
        const comentarios = await response.json();

        console.log('Comentários recebidos:', comentarios);

        const comentariosList = document.getElementById('modal-comments-list');
        comentariosList.innerHTML = ''; // Limpa lista antes de adicionar novos

        comentarios.forEach((comentario) => {
            const div = document.createElement('div');
            div.className = 'comment';
            div.textContent = comentario.conteudo; // Sanitização feita no backend
            comentariosList.appendChild(div);
        });
    } catch (error) {
        console.error('Erro ao carregar comentários:', error);
    }
}

// Função para enviar comentário no modal
document.getElementById('modal-comment-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const comentario = document.getElementById('modal-comment').value;
    const token = localStorage.getItem('token');

    console.log('Tentativa de enviar comentário:', comentario);

    if (!token) {
        alert('Você precisa estar logado para comentar!');
        console.warn('Comentário não enviado: usuário não está logado.');
        return;
    }

    const comentarioSanitizado = sanitizeInput(comentario);
    console.log('Comentário sanitizado:', comentarioSanitizado);

    try {
        const response = await fetch(`${API_URL}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ conteudo: comentarioSanitizado })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Comentário publicado com sucesso.');
            alert('Comentário publicado com sucesso!');
            carregarComentariosModal(); // Recarregar comentários
        } else {
            console.warn('Erro ao publicar comentário:', data.error);
            alert(data.error || 'Erro ao publicar comentário.');
        }
    } catch (error) {
        console.error('Erro ao enviar comentário:', error);
    }
});

// Carregar comentários quando o modal é aberto
document.getElementById('myModal').addEventListener('shown.bs.modal', () => {
    console.log('Modal aberto. Carregando comentários...');
    carregarComentariosModal();
});


document.getElementById('login-form-modal').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('modal-email').value;
    const password = document.getElementById('modal-password').value;

    console.log('Tentativa de login com email:', email);

    try {
        console.log('Enviando requisição para:', `${API_URL}/login`);
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        console.log('Response status:', response.status);

        const data = await response.json();
        console.log('Dados retornados pela API:', data);

        if (response.ok) {
            console.log('Login bem-sucedido. Token recebido:', data.token);
            localStorage.setItem('token', data.token); // Armazena token JWT
            document.getElementById('modal-login-message').textContent = 'Login realizado com sucesso!';
        } else {
            console.warn('Erro no login:', data);
            document.getElementById('modal-login-message').textContent = 'Erro ao fazer login. Tente novamente.';
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        document.getElementById('modal-login-message').textContent = 'Erro de conexão. Tente novamente.';
    }
});


