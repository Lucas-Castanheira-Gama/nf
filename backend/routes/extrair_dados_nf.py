import re
import PyPDF2
import base64
import sys
import json
from io import BytesIO

def extrair_dados_nf():
    pdf_base64 = sys.stdin.read()
    pdf_data = base64.b64decode(pdf_base64)

    # Crie um objeto BytesIO a partir dos bytes do PDF
    pdf_stream = BytesIO(pdf_data)

    # Use o objeto BytesIO como entrada para o PdfReader
    reader = PyPDF2.PdfReader(pdf_stream)
    texto = ""
    for page in reader.pages:
        texto += page.extract_text()

    # Expressões regulares para encontrar os dados
    fornecedor = re.search(r'IDENTIFICAÇÃO DO EMITENTE\s*\n\s*(.*)\n\s*(.*)\n\s*(.*)', texto)

    # Capturando o bloco de texto relacionado à FATURA
    data_vencimentoAll = re.search(r'FATURA\s*\n(.*\n.*\n.*\n.*\n.*)', texto, re.DOTALL).string
    padrao = r'FATURA\n(.*?)CÁLCULO DO IMPOSTO'
    resultado = re.search(padrao, data_vencimentoAll, re.DOTALL)
    parcelas1 = resultado.group(1).strip()

    padrao1 = r'(\d{3})\s*(\d{2}/\d{2}/\d{4})\s*([\d,.]+)|([\d,.]+)\s*(\d{2}/\d{2}/\d{4})\s*(\d{3})'
    parcelas = re.findall(padrao1, parcelas1)

    parcelas_corrigidas = []
    for parcela in parcelas:
        if parcela[0]:  # Corresponde ao padrão correto
            parcelas_corrigidas.append({
                "Número da Parcela": parcela[0],
                "Data de Vencimento": parcela[1],
                "Valor": parcela[2]
            })
        else:  # Corresponde ao padrão invertido
            parcelas_corrigidas.append({
                "Número da Parcela": parcela[5],
                "Data de Vencimento": parcela[4],
                "Valor": parcela[3]
            })

    valor_total = re.search(r'VALOR TOTAL DA NOTA\s*\n\s*([\d,.]+)', texto)
    numero_nf2 = re.search(r'Nº\s*([\d\s.-]+)', texto).group(1)
    numero_nf1 = numero_nf2.replace('.', '')
    numero_nf = numero_nf1.lstrip('0')

    # Verifica se as informações foram encontradas e retorna um dicionário
    dados = {
        "Fornecedor": fornecedor.group(3).strip().replace('DANFE', '') if fornecedor else "Não encontrado",
        "Data de Vencimento": parcelas_corrigidas,
        "Valor Total da Nota": valor_total.group(1) if valor_total else "Não encontrado",
        "Numero da NF": numero_nf if numero_nf else "Não encontrado"
    }

    return dados

# Exemplo de uso:
if __name__ == "__main__":
    dados_nf = extrair_dados_nf()
    print(json.dumps(dados_nf))
