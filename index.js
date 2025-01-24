







/* Título da pagina  */
const textElement = document.getElementById('text');
const texts = [
    "Bem-vindo ao futuro da tecnologia.",
    "Explore novas possibilidades.",
    "Transforme ideias em realidade.",
    "Inove, crie e inspire."
]; // Array com várias frases
let textIndex = 0;
let charIndex = 0;

function typeEffect() {
    if (charIndex < texts[textIndex].length) {
        textElement.textContent += texts[textIndex].charAt(charIndex);
        charIndex++;
        setTimeout(typeEffect, 100); // Velocidade de digitação
    } else {
        setTimeout(() => {
            textElement.textContent = "";
            charIndex = 0;
            textIndex = (textIndex + 1) % texts.length; // Avança para a próxima frase
            typeEffect();
        }, 2000); // Pausa antes de exibir a próxima frase
    }
}

typeEffect();


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

/* mODAL PARA lOGIN DE USUARIOS */
let modalVisible = false;

function openModal() {
    if (!modalVisible) {
        document.getElementById("modal-overlay").style.display = "flex";
        modalVisible = true;
    }
}

function closeModal() {
    if (modalVisible) {
        document.getElementById("modal-overlay").style.display = "none";
        modalVisible = false;
    }
}

//Login modal usuário

async function loginUser(event) {
    event.preventDefault();

    const email = document.querySelector('#email').value;  // Alterado para pegar pelo ID
    const password = document.querySelector('#password').value;  // Alterado para pegar pelo ID

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Login realizado com sucesso!');
            localStorage.setItem('token', data.token); // Salva o token no localStorage
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Erro ao realizar login:', error);
    }
}






//Proteção para rotas no fronend

async function accessProtectedRoute() {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Você precisa fazer login primeiro!');
        return;
    }

    const response = await fetch('http://localhost:3000/api/protected', {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (response.ok) {
        console.log('Dados protegidos:', data);
    } else {
        alert(data.message);
    }
}


/* Data e hora */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function updateDateTime() {
    const now = new Date();

    // Obter data no formato "Dia da semana, DD de mês de AAAA"
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    let currentDate = now.toLocaleDateString('pt-BR', options);

    // Capitalizar a primeira letra de cada palavra
    currentDate = currentDate.split(' ').map(word => capitalizeFirstLetter(word)).join(' ');

    // Obter hora no formato "HH:MM:SS"
    const currentTime = now.toLocaleTimeString('pt-BR', { hour12: false });

    // Atualizar o conteúdo da página
    document.getElementById('currentDate').textContent = currentDate;
    document.getElementById('currentTime').textContent = currentTime;
}

// Atualizar a data e hora imediatamente
updateDateTime();

// Atualizar a data e hora a cada 1 segundo
setInterval(updateDateTime, 1000);



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
let allLanguages = [0]; // Array para armazenar todos os dados retornados

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


//consumindo API noticias tecnologia
async function traduzirTexto(texto, targetLanguage = "pt") {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(texto)}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Erro ao traduzir o texto.");
        }

        const data = await response.json();
        return data[0][0][0];
    } catch (error) {
        console.error("Erro na tradução:", error.message);
        return texto;
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
    const apiKey = 'f309d331c4994735bce1f5c3fe2f9882';
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

/* backend Conexão com o banco dados Post página principal */
document.addEventListener("DOMContentLoaded", () => {
    // Carrega comentários ao iniciar a página
    loadComments();

    // Configura evento para o formulário de envio de comentários
    const commentForm = document.getElementById("commentForm");
    commentForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        await submitComment();
    });

    // Carrega comentários ao abrir o modal
    const modal = document.getElementById("myModal");
    modal.addEventListener("show.bs.modal", loadComments);
});



// Função para carregar comentários do backend
async function loadComments() {
    try {
        const response = await fetch("http://localhost:3000/comments");
        if (response.ok) {
            const comments = await response.json();
            displayComments(comments);
        } else {
            console.error("Erro ao carregar comentários do backend.");
        }
    } catch (error) {
        console.error("Erro na conexão com o backend:", error);
    }
}


// Função para exibir os comentários no frontend
function displayComments(comments) {
    const commentsList = document.getElementById("commentsList");
    const commentCounter = document.getElementById("comment-counter");

    // Limpa os comentários anteriores
    commentsList.innerHTML = "";

    // Adiciona cada comentário à lista
    comments.forEach((comment) => {
        const commentItem = document.createElement("div");
        commentItem.className = "comment-item";
        commentItem.innerHTML = `
            <p><strong>${comment.author}</strong>: ${comment.text}</p>
        `;
        commentsList.appendChild(commentItem);
    });

    // Atualiza o contador de comentários
    commentCounter.textContent = `Comentários: ${comments.length}`;
}

// Função para enviar um comentário ao backend
async function submitComment() {
    const author = document.getElementById("commentAuthor").value;
    const text = document.getElementById("commentText").value;

    if (!author || !text) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ author, text }),
        });

        if (response.ok) {
            // Limpa os campos do formulário
            document.getElementById("commentAuthor").value = "";
            document.getElementById("commentText").value = "";

            // Recarrega os comentários
            await loadComments();
        } else {
            console.error("Erro ao enviar comentário para o backend.");
        }
    } catch (error) {
        console.error("Erro na conexão com o backend:", error);
    }
}





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


// controle de cookies
document.addEventListener('DOMContentLoaded', function () {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('accept-cookies');
    const declineButton = document.getElementById('decline-cookies');

    console.log("Script carregado");

    // Verifica o consentimento salvo em localStorage
    const cookieConsent = localStorage.getItem('cookieConsent');

    // Exibe o banner após um delay se o consentimento ainda não foi dado
    if (!cookieConsent) {
        setTimeout(function () {
            cookieBanner.style.display = "flex"; // Mostra o banner
            console.log("Banner exibido após delay.");
        }, 8000);
    }

    // Aceitar cookies
    acceptButton?.addEventListener('click', function () {
        localStorage.setItem("cookieConsent", "accepted");
        cookieBanner.style.display = "none"; // Oculta o banner
        console.log("Cookies aceitos");
    });

    // Recusar cookies
    declineButton?.addEventListener('click', function () {
        localStorage.setItem("cookieConsent", "declined");
        cookieBanner.style.display = "none"; // Oculta o banner
        console.log("Cookies recusados");
    });
});


