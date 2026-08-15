const SUPABASE_URL = "https://uijwislecgpeoyhucfxq.supabase.co";
const SUPABASE_KEY = "sb_publishable_-JZE536NomschXIeZO6HNQ_VI08wmXP";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

async function salvarResultado(nome, pontuacao) {
    const { error } = await supabaseClient.rpc(
        "registrar_resultado",
        {
            p_nome: nome,
            p_pontuacao: pontuacao
        }
    );

    if (error) {
        console.error("Erro ao salvar resultado:", error);
        return false;
    }

    console.log("Resultado salvo com sucesso!");
    return true;
}

// ---


const jogo = [
    ["Gaslighting", "Manipulação psicológica que faz uma pessoa duvidar da própria percepção, memória ou julgamento."],
    ["Mansplaining", "Quando um homem explica algo de forma condescendente a uma mulher, presumindo que ela não possui conhecimento sobre o assunto."],
    ["Manterrupting", "Interrupção frequente ou desnecessária da fala de uma mulher, impedindo que ela conclua seu raciocínio."],
    ["Microviolências", "Comportamentos sutis e repetitivos que desvalorizam, constrangem ou diminuem a autonomia e a confiança de uma pessoa."],
    ["Deslegitimação", "Quando a opinião, experiência ou conhecimento de uma pessoa é desconsiderado ou tratado como menos importante."],
    ["Silenciamento", "Quando uma pessoa é impedida, direta ou indiretamente, de expressar suas opiniões, ideias ou experiências."],
    ["Apropriação de ideias", "Quando uma ideia apresentada por uma pessoa é ignorada ou posteriormente atribuída a outra pessoa."],
    ["Violência simbólica", "Forma de violência exercida por meio de valores, comportamentos e padrões sociais que naturalizam relações de dominação."],
    ["Objetificação", "Redução de uma pessoa à condição de objeto, desconsiderando sua individualidade e autonomia."],
    ["Estereótipo de gênero", "Crença generalizada sobre características, comportamentos ou papéis considerados próprios de homens ou mulheres."]
];

const temaEscuro = document.getElementById("TemaEscuro");

temaEscuro.addEventListener("change", () => {
    document.body.classList.toggle("TemaEscuro", temaEscuro.checked);
});

let nomeJogador = "";
let inicioJogo = null;
let palavraSelecionada = null;
let explicacaoSelecionada = null;
let respostas = [];

const telaInicial = document.getElementById("TelaInicial");
const campoNome = document.getElementById("NomeJogador");
const botaoComecar = document.getElementById("Comecar");
const paiPalavra = document.getElementById("Palavra");
const paiExplicacao = document.getElementById("Explicacao");
const botaoEnviar = document.getElementById("Enviar");

function embaralhar(array) {
    const copia = [...array];

    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }

    return copia;
}

const palavrasEmbaralhadas = embaralhar(
    jogo.map((item, indice) => ({
        texto: item[0],
        indice: indice
    }))
);

const explicacoesEmbaralhadas = embaralhar(
    jogo.map((item, indice) => ({
        texto: item[1],
        indice: indice
    }))
);

palavrasEmbaralhadas.forEach((item) => {
    const botao = document.createElement("button");

    botao.classList.add("Palavra");
    botao.innerText = item.texto;
    botao.dataset.indice = item.indice;

    botao.addEventListener("click", () => {
        selecionarPalavra(botao, item.indice);
    });

    paiPalavra.appendChild(botao);
});

explicacoesEmbaralhadas.forEach((item) => {
    const botao = document.createElement("button");

    botao.classList.add("Explicacao");
    botao.innerText = item.texto;
    botao.dataset.indice = item.indice;

    botao.addEventListener("click", () => {
        selecionarExplicacao(botao, item.indice);
    });

    paiExplicacao.appendChild(botao);
});

botaoComecar.addEventListener("click", iniciarJogo);

campoNome.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
        iniciarJogo();
    }
});

function iniciarJogo() {
    nomeJogador = campoNome.value.trim();

    if (nomeJogador === "") {
        campoNome.focus();
        return;
    }

    inicioJogo = Date.now();
    telaInicial.style.display = "none";
}

function selecionarPalavra(elemento, indice) {
    if (palavraSelecionada) {
        palavraSelecionada.elemento.classList.remove("Selecionado");
    }

    palavraSelecionada = {
        elemento: elemento,
        indice: indice
    };

    elemento.classList.add("Selecionado");

    verificarSelecao();
}

function selecionarExplicacao(elemento, indice) {
    if (explicacaoSelecionada) {
        explicacaoSelecionada.elemento.classList.remove("Selecionado");
    }

    explicacaoSelecionada = {
        elemento: elemento,
        indice: indice
    };

    elemento.classList.add("Selecionado");

    verificarSelecao();
}

function verificarSelecao() {
    if (!palavraSelecionada || !explicacaoSelecionada) {
        return;
    }

    const palavra = palavraSelecionada.indice;
    const explicacao = explicacaoSelecionada.indice;

    const respostaPalavra = respostas.find(
        (resposta) => resposta.palavra === palavra
    );

    const respostaExplicacao = respostas.find(
        (resposta) => resposta.explicacao === explicacao
    );

    if (respostaPalavra && respostaExplicacao) {
        if (respostaPalavra !== respostaExplicacao) {
            const explicacaoAntiga = respostaPalavra.explicacao;
            respostaPalavra.explicacao = explicacao;
            respostaExplicacao.explicacao = explicacaoAntiga;
        }
    } else if (respostaPalavra) {
        respostaPalavra.explicacao = explicacao;
    } else if (respostaExplicacao) {
        respostaExplicacao.palavra = palavra;
    } else {
        respostas.push({
            palavra: palavra,
            explicacao: explicacao
        });
    }

    atualizarInterface();

    palavraSelecionada = null;
    explicacaoSelecionada = null;
}

function atualizarInterface() {
    const botoesPalavras = document.querySelectorAll(".Palavra");
    const botoesExplicacoes = document.querySelectorAll(".Explicacao");

    botoesPalavras.forEach((botao) => {
        removerCores(botao);

        const indice = Number(botao.dataset.indice);

        const resposta = respostas.find(
            (resposta) => resposta.palavra === indice
        );

        if (resposta) {
            const numeroCor = respostas.indexOf(resposta) % 10 + 1;
            botao.classList.add("s" + numeroCor);
        }
    });

    botoesExplicacoes.forEach((botao) => {
        removerCores(botao);

        const indice = Number(botao.dataset.indice);

        const resposta = respostas.find(
            (resposta) => resposta.explicacao === indice
        );

        if (resposta) {
            const numeroCor = respostas.indexOf(resposta) % 10 + 1;
            botao.classList.add("s" + numeroCor);
        }
    });
}

function removerCores(elemento) {
    for (let i = 1; i <= 10; i++) {
        elemento.classList.remove("s" + i);
    }

    elemento.classList.remove("Selecionado");
}

botaoEnviar.addEventListener("click", finalizarJogo);
async function finalizarJogo() {
    if (respostas.length < jogo.length) {
        const faltam = jogo.length - respostas.length;

        alert(
            "Você ainda precisa responder " +
            faltam +
            " questão(ões)."
        );

        return;
    }

    const fimJogo = Date.now();
    const tempoMilissegundos = fimJogo - inicioJogo;
    const tempoSegundos = tempoMilissegundos / 1000;

    let acertos = 0;

    respostas.forEach((resposta) => {
        if (resposta.palavra === resposta.explicacao) {
            acertos++;
        }
    });

    const percentualAcertos = acertos / jogo.length;
    const pontosAcertos = percentualAcertos * 900;
    const tempoReferencia = 60;

    let bonusTempo = 100 * (1 - tempoSegundos / tempoReferencia);

    bonusTempo = Math.max(0, bonusTempo);
    bonusTempo = Math.min(100, bonusTempo);

    let pontuacao = 0;

    if (acertos > 0) {
        pontuacao = Math.round(
            pontosAcertos + bonusTempo
        );
    }

    const resultadoFinal = {
        nome: nomeJogador,
        acertos: acertos,
        total: jogo.length,
        tempo: Number(tempoSegundos.toFixed(2)),
        pontuacao: pontuacao,
        respostas: respostas
    };

    console.log(
        "RESULTADO FINAL:",
        resultadoFinal
    );

    const salvo = await salvarResultado(
        nomeJogador,
        pontuacao
    );

    if (!salvo) {
        alert(
            "Não foi possível salvar sua pontuação. Tente novamente."
        );

        return;
    }

    document.getElementById("NomeFinal").innerText =
        nomeJogador;

    document.getElementById("TempoFinal").innerText =
        tempoSegundos.toFixed(2);

    document.getElementById("AcertosFinal").innerText =
        acertos + " / " + jogo.length;

    document.getElementById("PontuacaoFinal").innerText =
        pontuacao + " pontos";

    document.getElementById("Jogo").style.display =
        "none";

    botaoEnviar.style.display =
        "none";

    document.getElementById("Resultado").style.display =
        "block";
}
