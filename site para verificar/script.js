const video = document.getElementById('video');
const resultadoDiv = document.getElementById('resultado');
const codeReader = new ZXing.BrowserQRCodeReader();

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "environment",
                width: { ideal: 1024 },
                height: { ideal: 768 }
            }
        });
        video.srcObject = stream;
        video.setAttribute("playsinline", true);
        video.play();
        
        // Iniciar leitura contínua
        setInterval(async () => {
            try {
                const result = await codeReader.decodeFromVideoDevice(undefined, video);
                mostrarResultado(result);
            } catch (err) {
                // Ignorar erros de leitura
            }
        }, 1000); // Tenta ler a cada segundo

    } catch (err) {
        console.error("Erro ao acessar a câmera:", err);
    }
}

function mostrarResultado(result) {
    try {
        const dados = JSON.parse(result.text); // Tente fazer um JSON parse
        resultadoDiv.innerHTML = `
            <h3>Dados do QR Code:</h3>
            <pre>${JSON.stringify(dados, null, 2)}</pre>
        `;
    } catch (e) {
        resultadoDiv.innerHTML = '<p>QR Code não contém dados válidos.</p>';
    }
}

// Iniciar a câmera automaticamente ao carregar a página
window.onload = startCamera;
