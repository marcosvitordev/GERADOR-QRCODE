$(document).ready(function() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const codigoIdentificacao = document.getElementById("codigoIdentificacao");
    const escola = document.getElementById("escola");
    const nomeAluno = document.getElementById("nomeAluno");
    const professor = document.getElementById("professor");
    const coordenador = document.getElementById("coordenador");
    const dataInicio = document.getElementById("dataInicio");
    const dataFim = document.getElementById("dataFim");

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
                    // Parse o conteúdo do QR Code como JSON
                    const qrData = JSON.parse(code.data);
                    
                    // Exibe as informações decodificadas
                    codigoIdentificacao.innerText = qrData.codigo_identificacao;
                    escola.innerText = qrData.escola;
                    nomeAluno.innerText = qrData.nome_aluno;
                    professor.innerText = qrData.professor;
                    coordenador.innerText = qrData.coordenador;
                    dataInicio.innerText = qrData.data_inicio;
                    dataFim.innerText = qrData.data_fim;
                } catch (error) {
                    console.error("Erro ao interpretar os dados do QR Code:", error);
                }
            }
        }
        requestAnimationFrame(scanQRCode); // Continua escaneando
    }

    startVideo(); // Inicia o vídeo e a leitura do QR Code
});
