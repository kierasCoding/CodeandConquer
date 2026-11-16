"""
Dieses Skript kann zum Decodieren des verschlüsselten Chat-Verlaufs genutzt werden.
Eine KI sollte zum entschlüsseln der Botschaft verwendet werden, leider sind die Tokens für heute
aufgebraucht und sie ist nur dazu gekommen die zwei Listen geheimbuchstaben und buchstaben
zu erstellen. Die Decodierung muss somit old-school durchgeführt werden

Die Liste geheimzeichen enthält die verschlüsselten Zeichen.
Die Liste zeichen enthält die entschlüsselten Zeichen. Der Index der beiden Listen ist gleich.
Das verschlüsselte Zeichen ist also in der Liste geheimzeichen an der gleichen Stelle wie
das entschlüsselte Zeichen in der Liste zeichen.
Beispiel:
Das verschlüsselte Wort Exiil entspricht Hallo. E hat den Index 33 in der Liste geheimzeichen
und H den Index 33 in der Liste zeichen. Das Wort Katze wäre verschlüsselt Hxqwb

Tipp: Ihr könnt den Geheimtext in drei Anführungszeichen \"""geheimtext\""" gesetzt als String entschlüsseln.
Der "\" ist nur für die Darstellung als Kommentar.
"""
geheimzeichen = ['x', 'y', 'z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
                   'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u',
                   'v', 'w', 'X', 'Y', 'Z', 'A', 'B', 'C', 'D', 'E', 'F', 'G',
                   'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
                   'T', 'U', 'V', 'W', '1', '2', '3', '(', ')', ' ', '\n', '?',
                   '!', '.', ':', ',', '8', '6', '0', '4', '[', ']', '+', ';', '-', 'ß']

zeichen = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
             'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B',
             'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
             'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '.', ':', ',', '0',
             '4', '8', '6', '+', ';', '2', '1', '(', '[', ']', '3', ')', ' ', '\n',
             '?', '!', 'ß', '-']

def entschluesselter_text(geheimtext):
    # Hier euer Code
    pass

print(entschluesselter_text("""Hier Geheimtext einfügen"""))




