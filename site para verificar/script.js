$(document).ready(function() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const outputData = document.getElementById("qrcodeData");
    const ctx = canvas.getContext("2d");

    // Simulação do arquivo alunos.json
    const alunos = [
        {
            "codigo_identificacao": "c2a5c6ce-802f-45eb-941b-1aaa62b36216",
            "escola": "Centro de Estudo Sena - CES",
            "nome_aluno": "Vitor",
            "professor": "MARCOS VITOR LIMA DA COSTA",
            "coordenador": "JOAQUIM DE ARAÚJO MORAIS",
            "data_inicio": "10/02/2024",
            "data_fim": "11/12/2024"
        },
        {
            "codigo_identificacao": "654321",
            "escola": "Escola Modelo",
            "nome_aluno": "João",
            "professor": "Paulo Roberto",
            "coordenador": "Maria José",
            "data_inicio": "15/03/2024",
            "data_fim": "20/11/2024"
        }
    ];

    // Função para iniciar o acesso à câmera
    function startVideo() {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then(function(stream) {
                video.srcObject = stream;
                video.setAttribute("playsinline", true); // Para iOS compatibilidade
                requestAnimationFrame(scanQRCode);
            });
    }

    // Função para buscar informações no JSON
    function buscarInformacoes(codigoIdentificacao) {
        const aluno = alunos.find(a => a.codigo_identificacao === codigoIdentificacao);
        if (aluno) {
            return `
                ESCOLA: ${aluno.escola}<br>
                ALUNO: ${aluno.nome_aluno}<br>
                PROFESSOR: ${aluno.professor}<br>
                COORDENADOR: ${aluno.coordenador}<br>
                INÍCIO: ${aluno.data_inicio}<br>
                FIM: ${aluno.data_fim}
            `;
        } else {
            return "Código de Identificação não encontrado.";
        }
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
                        const info = buscarInformacoes(codigoIdentificacao);
                        outputData.innerHTML = info;
                    } else {
                        outputData.innerText = "Código de Identificação não encontrado no QR Code.";
                    }
                } catch (e) {
                    outputData.innerText = "Erro ao ler o QR Code.";
                    console.error("Erro ao tentar interpretar o JSON:", e);
                }
            }
        }
        requestAnimationFrame(scanQRCode); // Continua escaneando
    }

    startVideo(); // Inicia o vídeo e a leitura do QR Code
});
