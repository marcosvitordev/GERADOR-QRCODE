$(document).ready(function() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const outputData = document.getElementById("nomeAluno");
    const professorData = document.getElementById("professorAluno");
    const dataInicioData = document.getElementById("dataInicioAluno");
    const dataFimData = document.getElementById("dataFimAluno");
    const errorMessage = document.getElementById("errorMessage");
    const ctx = canvas.getContext("2d");

    // Função para iniciar o acesso à câmera
    function startVideo() {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then(function(stream) {
                video.srcObject = stream;
                video.setAttribute("playsinline", true); // Para compatibilidade com iOS
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
                // Se QR Code for detectado, tenta buscar o aluno correspondente
                buscarAluno(code.data); // Função para verificar aluno
            }
        }
        requestAnimationFrame(scanQRCode); // Continua escaneando
    }

    // Função para buscar aluno no arquivo JSON
    function buscarAluno(codigo_identificacao) {
        $.getJSON("alunos.json", function(data) {
            const aluno = data.alunos.find(aluno => aluno.codigo_identificacao === codigo_identificacao);
            if (aluno) {
                outputData.innerText = aluno.nome_aluno;
                professorData.innerText = aluno.professor;
                dataInicioData.innerText = aluno.data_inicio;
                dataFimData.innerText = aluno.data_fim;
                errorMessage.innerText = ""; // Limpa mensagem de erro
            } else {
                errorMessage.innerText = "Aluno não encontrado!";
                outputData.innerText = "";
                professorData.innerText = "";
                dataInicioData.innerText = "";
                dataFimData.innerText = "";
            }
        });
    }

    startVideo(); // Inicia o vídeo e a leitura do QR Code
});
