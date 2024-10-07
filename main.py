import tkinter as tk
from tkinter import messagebox
import qrcode
import json
import uuid  # Para gerar códigos de identificação únicos
import os
from tkcalendar import DateEntry

# Nome do arquivo JSON para armazenar todos os alunos
ARQUIVO_JSON = 'alunos.json'

# Função para carregar dados existentes do JSON
def carregar_dados():
    if os.path.exists(ARQUIVO_JSON):
        with open(ARQUIVO_JSON, 'r') as json_file:
            return json.load(json_file)
    return []

# Função para salvar dados no JSON
def salvar_dados(dados):
    with open(ARQUIVO_JSON, 'w') as json_file:
        json.dump(dados, json_file, indent=4)

# Função para gerar o QR Code e salvar o JSON
def gerar_qr_code():
    nome_aluno = entry_nome.get()
    data_inicio = entry_data_inicio.get()
    data_fim = entry_data_fim.get()

    if not nome_aluno or not data_inicio or not data_fim:
        messagebox.showwarning("Aviso", "Por favor, preencha todos os campos.")
        return

    # Gerar um código de identificação único
    codigo_identificacao = str(uuid.uuid4())

    # Dados predefinidos
    escola = "Centro de Estudo Sena - CES"
    professor = "MARCOS VITOR LIMA DA COSTA"
    coordenador = "JOAQUIM DE ARAÚJO MORAIS"

    # Texto do QR Code
    dados_aluno = {
        "codigo_identificacao": codigo_identificacao,
        "escola": escola,
        "nome_aluno": nome_aluno,
        "professor": professor,
        "coordenador": coordenador,
        "data_inicio": data_inicio,
        "data_fim": data_fim
    }

    # Carregar dados existentes
    alunos = carregar_dados()
    alunos.append(dados_aluno)  # Adiciona o novo aluno

    # Salvar todos os dados de alunos
    salvar_dados(alunos)

    # Gerar o QR Code
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(json.dumps(dados_aluno))  # Adiciona os dados como JSON
    qr.make(fit=True)

    # Criar a imagem
    img = qr.make_image(fill='black', back_color='white')
    img.save(f'qrcodes/qrcode_{codigo_identificacao}.png')  # Salva com o código de identificação no nome

    messagebox.showinfo("Sucesso", "QR Code gerado com sucesso! Salvo como 'qrcode_<codigo>.png' e dados em 'alunos.json'.")

# Configuração da janela principal
root = tk.Tk()
root.title("Gerador de QR Code")
root.geometry('400x400')
# Criando os rótulos e entradas
tk.Label(root, text="Nome do Aluno:").grid(row=0, column=0, padx=10, pady=10)
entry_nome = tk.Entry(root)
entry_nome.grid(row=0, column=1, padx=10, pady=10)

# Campo para a data de início do curso
tk.Label(root, text="Data Início do Curso:").grid(row=1, column=0, padx=10, pady=10)
entry_data_inicio = DateEntry(root, width=12, background='darkblue', foreground='white', borderwidth=2)
entry_data_inicio.grid(row=1, column=1, padx=10, pady=10)

# Campo para a data de fim do curso
tk.Label(root, text="Data Fim do Curso:").grid(row=2, column=0, padx=10, pady=10)
entry_data_fim = DateEntry(root, width=12, background='darkblue', foreground='white', borderwidth=2)
entry_data_fim.grid(row=2, column=1, padx=10, pady=10)


# Botão para gerar o QR Code
botao_gerar = tk.Button(root, text="Gerar QR Code", command=gerar_qr_code, bg='blue', fg='white')
botao_gerar.grid(row=3, columnspan=2, pady=20)

# Iniciar o loop principal
root.mainloop()
