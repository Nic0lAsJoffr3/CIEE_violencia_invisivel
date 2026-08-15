const SUPABASE_URL = "https://uijwislecgpeoyhucfxq.supabase.co";
const SUPABASE_KEY = "sb_publishable_-JZE536NomschXIeZO6HNQ_VI08wmXP";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const listaRanking = document.getElementById("ListaRanking");

function criarQRCode() {
    const urlJogo = "https://nic0lasjoffr3.github.io/CIEE_violencia_invisivel/";

    new QRCode(
        document.getElementById("QRCode"),
        {
            text: urlJogo,
            width: 180,
            height: 180,
            colorDark: "#16120f",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        }
    );
}

async function carregarRanking() {
    const { data, error } = await supabaseClient
        .from("resultados")
        .select('"Nome", "Pontos"')
        .order("Pontos", {
            ascending: false
        });

    if (error) {
        console.error(
            "Erro ao carregar ranking:",
            error
        );

        listaRanking.innerHTML = `
            <div class="Erro">
                Não foi possível carregar o ranking.
            </div>
        `;

        return;
    }

    listaRanking.innerHTML = "";

    if (!data || data.length === 0) {
        listaRanking.innerHTML = `
            <div class="Vazio">
                Nenhum resultado ainda.
            </div>
        `;

        return;
    }

    data.forEach((resultado, indice) => {

        const item = document.createElement("div");

        item.classList.add("ItemRanking");

        if (indice === 0) {
            item.classList.add("Primeiro");
        }

        item.innerHTML = `
            <div class="Posicao">
                ${indice + 1}
            </div>

            <div class="Nome">
                ${resultado.Nome}
            </div>

            <div class="Pontos">
                ${resultado.Pontos}
            </div>
        `;

        listaRanking.appendChild(item);
    });
}

criarQRCode();
carregarRanking();

setInterval(
    carregarRanking,
    5000
);