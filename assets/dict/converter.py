#!/usr/bin/env python3
import unicodedata

# Adapted from https://github.com/pythonprobr/palavras/blob/master/converter.py

ENTRADA = 'entrada.txt'
SAIDA = 'dictionary.txt'

palavras = set()
with open(ENTRADA, encoding='utf-8') as entrada:
    for i, linha in enumerate(entrada):
        palavra = linha.strip()
        if '-' in palavra or '.' in palavra or '\'' in palavra:
            continue
        if len(palavra) != 5:
            continue
        palavras.add(palavra)  # para evitar palavra vazia

    qt_original = i

msg = '{} palavras na lista original, {} na lista gerada: {} adicionadas'
extra = len(palavras) - qt_original
print(msg.format(qt_original, len(palavras), extra))

palavras = sorted(palavras)

with open(SAIDA, 'wt', encoding='utf-8') as saida:
    saida.write('\n'.join(palavras))
    saida.write('\n')
