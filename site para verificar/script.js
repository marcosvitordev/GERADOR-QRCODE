$(document).ready(function() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const outputData = document.getElementById("qrcodeData");
    const ctx = canvas.getContext("2d");

    let alunosData = [];

    // Função para carregar o arquivo alunos.json
    function loadAlunosData() {
        $.getJSON("alunos.json", function(data) {
            alunosData = data.alunos;
        }).fail(function() {
            outputData.innerText = "Erro ao carregar os dados dos alunos.";
        });
    }

    // Função para iniciar o acesso à câmera
    function startVideo() {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then(function(stream) {
                video.srcObject = stream;
                video.setAttribute("playsinline", true); // Para iOS compatibilidade
                requestAnimationFrame(scanQRCode);
            });
    }

    // Função para escanear QR Code
    function scanQRCode() {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
                try {
                    const jsonData = JSON.parse(code.data); // Converte o conteúdo do QR Code para JSON
                    const codigoIdentificacao = jsonData.codigo_identificacao; // Extrai o valor do campo "codigo_identificacao"

                    if (codigoIdentificacao) {
                        // Chama a função para verificar o código no arquivo alunos.json
                        verificarCodigo(codigoIdentificacao);
                    } else {
                        outputData.innerText = "Código de Identificação não encontrado.";
                    }
                } catch (e) {
                    outputData.innerText = "Erro ao ler o QR Code.";
                    console.error("Erro ao tentar interpretar o JSON:", e);
                }
            }
        }
        requestAnimationFrame(scanQRCode); // Continua escaneando
    }

    // Função para verificar o código de identificação no arquivo alunos.json
    function verificarCodigo(codigo) {
        const alunoEncontrado = alunosData.find(aluno => aluno.codigo_identificacao === codigo);

        if (alunoEncontrado) {
            // Exibe as informações do aluno
            outputData.innerHTML = `
                <strong>ESCOLA:</strong> ${alunoEncontrado.escola} <br>
                <strong>Nome do Aluno:</strong> ${alunoEncontrado.nome_aluno} <br>
                <strong>PROFESSOR:</strong> ${alunoEncontrado.professor} <br>
                <strong>COORDENADOR:</strong> ${alunoEncontrado.coordenador} <br>
                <strong>Data de Início:</strong> ${alunoEncontrado.data_inicio} <br>
                <strong>Data de Fim:</strong> ${alunoEncontrado.data_fim}
            `;
        } else {
            outputData.innerText = "Código de Identificação não encontrado no arquivo alunos.json.";
        }
    }

    loadAlunosData(); // Carrega os dados dos alunos
    startVideo(); // Inicia o vídeo e a leitura do QR Code
});
