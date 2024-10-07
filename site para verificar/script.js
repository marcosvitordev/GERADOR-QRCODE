// $(document).ready(function() {
//     const video = document.getElementById("video");
//     const canvas = document.getElementById("canvas");
//     const outputData = document.getElementById("qrcodeData");
//     const ctx = canvas.getContext("2d");

//     // Função para iniciar o acesso à câmera
//     function startVideo() {
//         navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
//             .then(function(stream) {
//                 video.srcObject = stream;
//                 video.setAttribute("playsinline", true); // Para iOS compatibilidade
//                 requestAnimationFrame(scanQRCode);
//             });
//     }

//     // Função para escanear QR Code
//     function scanQRCode() {
//         if (video.readyState === video.HAVE_ENOUGH_DATA) {
//             canvas.width = video.videoWidth;
//             canvas.height = video.videoHeight;
//             ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//             const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//             const code = jsQR(imageData.data, imageData.width, imageData.height);

//             if (code) {
//                 outputData.innerText = code.data; // Exibe o conteúdo do QR Code
//                 console.log("QR Code data:", code.data);
//             }
//         }
//         requestAnimationFrame(scanQRCode); // Continua escaneando
//     }

//     startVideo(); // Inicia o vídeo e a leitura do QR Code
// });

$(document).ready(function() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const outputData = document.getElementById("qrcodeData");
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
                try {
                    // Parseia o JSON contido no QR Code
                    const qrData = JSON.parse(code.data);

                    // Exibe cada dado de forma organizada
                    outputData.innerHTML = `
                        <p><strong>Código de Identificação:</strong> ${qrData.codigo_identificacao}</p>
                        <p><strong>Escola:</strong> ${qrData.escola}</p>
                        <p><strong>Nome do Aluno:</strong> ${qrData.nome_aluno}</p>
                        <p><strong>Professor:</strong> ${qrData.professor}</p>
                        <p><strong>Coordenador:</strong> ${qrData.coordenador}</p>
                        <p><strong>Data de Início:</strong> ${qrData.data_inicio}</p>
                        <p><strong>Data de Fim:</strong> ${qrData.data_fim}</p>
                    `;
                } catch (error) {
                    console.error("Erro ao ler o QR Code", error);
                    outputData.innerText = "Falha ao ler QR Code ou dados inválidos.";
                }
            }
        }
        requestAnimationFrame(scanQRCode); // Continua escaneando
    }

    startVideo(); // Inicia o vídeo e a leitura do QR Code
});
