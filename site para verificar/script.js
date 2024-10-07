$(document).ready(function() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const outputData = document.getElementById("resultData");
    const ctx = canvas.getContext("2d");

    // Função para iniciar o acesso à câmera
    function startVideo() {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then(function(stream) {
                video.srcObject = stream;
                video.setAttribute("playsinline", true); // Compatibilidade para iOS
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
                verificarAluno(code.data); // Chama função para verificar dados do aluno
            }
        }
        requestAnimationFrame(scanQRCode); // Continua escaneando
    }

    // Função para verificar dados do aluno no arquivo alunos.json
    function verificarAluno(codigo) {
        $.getJSON("alunos.json", function(data) {
            const aluno = data.find(aluno => aluno.codigo_identificacao === codigo);

            if (aluno) {
                outputData.innerHTML = `
                    <strong>Nome:</strong> ${aluno.nome_aluno}<br>
                    <strong>Professor:</strong> ${aluno.professor}<br>
                    <strong>Data Início:</strong> ${aluno.data_inicio}<br>
                    <strong>Data Fim:</strong> ${aluno.data_fim}
                `;
            } else {
                outputData.innerHTML = "Aluno não encontrado.";
            }
        });
    }

    startVideo(); // Inicia o vídeo e a leitura do QR Code
});
