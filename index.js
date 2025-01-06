



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


async function fetchPackageDetails(platform, packageName, elementId) {
    const apiKey = '8917eb60bace34608742a80fa6e2a97d'; // Substitua pela sua API Key
    const url = `https://libraries.io/api/${platform}/${packageName}?api_key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        document.getElementById(elementId).innerHTML = `
            <h2>Pacote: ${data.name}</h2>
            <p>${data.description}</p>
            <ul>
                <li><strong>Última versão estável:</strong> ${data.latest_stable_release_number}</li>
                <li><strong>Publicado em:</strong> ${new Date(data.latest_stable_release_published_at).toLocaleDateString()}</li>
                <li><strong>Licença:</strong> ${data.licenses}</li>
                <li><strong>Homepage:</strong> <a href="${data.homepage}" target="_blank">${data.homepage}</a></li>
                <li><strong>Repositório:</strong> <a href="${data.repository_url}" target="_blank">${data.repository_url}</a></li>
                <li><strong>Dependências diretas:</strong> ${data.dependent_repos_count}</li>
                <li><strong>Dependentes:</strong> ${data.dependents_count}</li>
                <li><strong>Estrelas no GitHub:</strong> ${data.stars}</li>
            </ul>
        `;
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

// Chama a função para cada item com diferentes pacotes
fetchPackageDetails('npm', 'javascript', 'package-details-1');
fetchPackageDetails('npm', 'node', 'package-details-2');
fetchPackageDetails('npm', 'angular', 'package-details-3');
fetchPackageDetails('npm', 'jquery', 'package-details-4');
fetchPackageDetails('npm', 'lodash', 'package-details-5');
fetchPackageDetails('npm', 'express', 'package-details-6');


// Exemplo: Buscar detalhes sobre o React no npm
fetchPackageDetails('npm', 'react');



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

/* Api cotação em tempo  real dolar */
async function fetchDollarQuote() {
    const url = 'https://api.exchangerate.host/convert?from=USD&to=BRL&amount=1&access_key=000664efd7127e5239fc06e92def081a';

    try {
        const response = await fetch(url);
        console.log("Status HTTP:", response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Resposta da API:", data);

        if (data && data.result) {
            const usdToBRL = data.result;
            document.getElementById("quote").innerText = `R$ ${usdToBRL.toFixed(2)}`;
        } else {
            throw new Error('Resposta inesperada da API.');
        }
    } catch (error) {
        document.getElementById("quote").innerText = "Erro ao carregar a cotação.";
        console.error("Erro ao buscar cotação:", error);
    }
}

/* frontend comentarios 2 */
document.getElementById('commentForm2').addEventListener('submit', async function (event) {
    event.preventDefault(); // Impede o envio do formulário tradicional

    const autor = document.getElementById('commentAuthor2').value;
    const comentario = document.getElementById('commentText2').value;

    try {
        // Envia os dados para o backend
        const response = await fetch('/add-comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ autor, comentario })
        });

        const data = await response.json();
        if (data.message === "Comentário adicionado com sucesso!") {
            alert(data.message);
            loadComments(); // Carregar os comentários atualizados
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert("Erro ao enviar o comentário.");
    }
});

// Função para carregar os comentários
async function loadComments() {
    try {
        const response = await fetch('/get-comments');
        const comments = await response.json();

        const commentsList = document.getElementById('commentsList2');
        commentsList.innerHTML = ''; // Limpa a lista antes de adicionar novos comentários

        comments.forEach(comment => {
            const div = document.createElement('div');
            div.innerHTML = `<strong>${comment.autor}</strong>: <p>${comment.comentario}</p><small>${new Date(comment.data).toLocaleString()}</small>`;
            commentsList.appendChild(div);
        });
    } catch (error) {
        console.error("Erro ao carregar comentários:", error);
    }
}

// Carrega os comentários ao carregar a página
loadComments();