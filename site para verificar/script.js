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
                outputData.innerText = code.data; // Exibe o conteúdo do QR Code
                console.log("QR Code data:", code.data);
            }
        }
        requestAnimationFrame(scanQRCode); // Continua escaneando
    }

    startVideo(); // Inicia o vídeo e a leitura do QR Code
});
