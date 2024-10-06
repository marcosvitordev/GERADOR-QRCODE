const codeReader = new ZXing.BrowserQRCodeReader();

// Função para verificar código de identificação
function verificarCodigo() {
    const codigo = document.getElementById("codigoInput").value;

    fetch('alunos.json')
        .then(response => response.json())
        .then(data => {
            const aluno = data.find(a => a.codigo_identificacao === codigo);
            mostrarResultado(aluno);
        })
        .catch(error => {
            console.error("Erro ao carregar dados:", error);
            mostrarResultado(null);
        });
}

// Função para iniciar a câmera e ler QR Code
async function startCamera() {
    const video = document.getElementById('video');

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        video.srcObject = stream;
        video.setAttribute("playsinline", true); // para iOS
        video.play();

        // Iniciar leitura contínua
        setInterval(async () => {
            try {
                const result = await codeReader.decodeFromVideoDevice(undefined, video);
                const dados = JSON.parse(result.text);
                mostrarResultado(dados);
            } catch (err) {
                // Ignorar erros de leitura
            }
        }, 1000); // Tenta ler a cada segundo
    } catch (err) {
        console.error("Erro ao acessar a câmera:", err);
    }
}

// Iniciar a câmera automaticamente ao carregar a página
window.onload = () => {
    startCamera();
};

// Função para mostrar resultado na tela
function mostrarResultado(aluno) {
    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.innerHTML = '';

    if (aluno) {
        resultadoDiv.innerHTML = `
            <h3>Dados do Aluno:</h3>
            <p><strong>Escola:</strong> ${aluno.escola}</p>
            <p><strong>Nome do Aluno:</strong> ${aluno.nome_aluno}</p>
            <p><strong>Professor:</strong> ${aluno.professor}</p>
            <p><strong>Coordenador:</strong> ${aluno.coordenador}</p>
            <p><strong>Data Início:</strong> ${aluno.data_inicio}</p>
            <p><strong>Data Fim:</strong> ${aluno.data_fim}</p>
        `;
    } else {
        resultadoDiv.innerHTML = '<p>Nenhum aluno encontrado com esse código ou QR Code.</p>';
    }
}
