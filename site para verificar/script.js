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
function startCamera() {
    const html5QrCode = new Html5Qrcode("reader");
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
        // Aqui você pode parar a câmera após a leitura bem-sucedida
        html5QrCode.stop().then((ignore) => {
            // Parou com sucesso
            console.log("Câmera parada");
        }).catch((err) => {
            console.error("Erro ao parar a câmera:", err);
        });

        // Processar o texto decodificado
        const dados = JSON.parse(decodedText);
        mostrarResultado(dados);
    };

    const qrCodeErrorCallback = (errorMessage) => {
        // Você pode ignorar ou lidar com erros de leitura
        console.log("Erro ao ler QR Code: ", errorMessage);
    };

    // Começar a captura da câmera
    html5QrCode.start(
        { facingMode: "environment" }, // Usar a câmera traseira
        {
            fps: 10,
            qrbox: { width: 250, height: 250 } // Tamanho da caixa de leitura
        },
        qrCodeSuccessCallback,
        qrCodeErrorCallback
    ).catch(err => {
        console.error("Erro ao iniciar a câmera:", err);
    });
}

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
