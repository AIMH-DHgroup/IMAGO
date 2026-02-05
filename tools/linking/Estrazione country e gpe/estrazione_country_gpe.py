#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
    wd_search.py

    Wikidata API
    `Search` module: Search for a library

    MIT License
"""

import requests
import os
import sys
import csv
import json
import gzip
import time
import argparse
import urllib.parse
import urllib.request

# Inizializza la sessione
S = requests.Session()

# Wikidata query URL sparql
WD_URL = 'https://query.wikidata.org/sparql?query='
# URL per la query alle api della ricerca su Wikidata
URL = "https://www.wikidata.org/w/api.php"
# path del file input, in questo caso la lista
# delle biblioteche
TSV_FILE = 'biblioteche.tsv'
LIBRARY_FILE = 'provaPrimoGLAM_5.json'

# Function to load a URL and return the content of the page
def loadURL(url, encoding='utf-8', asLines=False):
    request = urllib.request.Request(url)

    # Set headers
    request.add_header('User-Agent', 'Mozilla/5.0 (Windows)')
    request.add_header('Accept-Encoding', 'gzip')

    # Try to open the URL
    try:
        myopener = urllib.request.build_opener()
        f = myopener.open(request, timeout=120)
        url = f.geturl()
    except (urllib.error.URLError, urllib.error.HTTPError, ConnectionResetError):
        raise
    else:
        # Handle gzipped pages
        if f.info().get('Content-Encoding') == 'gzip':
            f = gzip.GzipFile(fileobj=f)
        # Return the content of the page
        return f.readlines() if asLines else f.read().decode(encoding)
    return None

# Function to perform a Wikidata query
def wdQuery(qid):

    # Define SPARQL query
    wdQuery = f'\nSELECT ?label ?coord ?country ?gpe\
                WHERE {{\
                wd:{qid} wdt:P31/wdt:P279* wd:Q1030034.\
                wd:{qid} rdfs:label ?label.\
                OPTIONAL \
                {{ wd:{qid} wdt:P625 ?coord.}}\
                OPTIONAL \
                {{ wd:{qid} wdt:P17 ?country.}}\
                OPTIONAL \
                {{ wd:{qid} wdt:P131 ?gpe.}} \
                SERVICE wikibase:label {{ bd:serviceParam wikibase:language "[AUTO_LANGUAGE],it,la,en,fr,es,de". }}\
                }}'

    # Load query URL
    results = loadURL(f'{WD_URL}{urllib.parse.quote(wdQuery)}&format=json')

    # Return results
    if results:
        return json.loads(results)['results']['bindings']
    else:
        print(f'   Not found')
    return None

def wdQueryPlace(qid):

    # Define SPARQL query
    wdQuery = f'\nSELECT ?coord ?country \
                WHERE {{\
                OPTIONAL \
                {{ wd:{qid} wdt:P625 ?coord.}}\
                OPTIONAL \
                {{ wd:{qid} wdt:P17 ?country.}}\
                SERVICE wikibase:label {{ bd:serviceParam wikibase:language "[AUTO_LANGUAGE],it,la,en,fr,es,de". }}\
                }}'

    # Load query URL
    results = loadURL(f'{WD_URL}{urllib.parse.quote(wdQuery)}&format=json')

    # Return results
    if results:
        return json.loads(results)['results']['bindings']
    else:
        print(f'   Not found')
    return None

# Interactive Wikidata search
def wikiInteractive(name, wdEntities, qid, extra=''):
    extraString = f' • {extra}' if extra else '' # Questo non ci serve
    print(f'   {name}{extraString.title()}\n')
    printed = False

    # For each entity that was found...
    # Per vedere come è fatta ogni entità che compone la risposta alla query
    # si può stampare wdEntities
    #print(wdEntities)
    label = ""
    label_it = ""
    label_en = ""
    coord = ""
    country = ""
    gpe = ""
    print(wdEntities)
    for entity in wdEntities:
        printed = True
        
        # Se trovo una entità che si chiama coord
        # prendo il suo valore
        # è possibile che ci siano più entità coord,
        # in tal caso prende l'ultimo valore
        # se si volesse prendere tutti i valori basta fare un
        # array o un dict
        if "coord" in entity:
            coord = entity["coord"]["value"]

        # prendo ul valore se trovo un'entità di nomme label
        if "label" in entity:
            label = entity["label"]["value"] 
            lang = entity["label"]["xml:lang"]
            if lang == 'it':
                label_it = entity["label"]["value"]
            if lang == 'en':
                label_en = entity["label"]["value"]
            
            
        
        if "country" in entity:
            country = entity["country"]["value"] 

        if "gpe" in entity:
            gpe = entity["gpe"]["value"] 

        # se label non è vuoto
        # cerco una label in italiano o in inglese
        # la prima che trovo (a regola quella inglese)
        # restituisco l'iri, la label e le coord
        # lo posso fare perchè nella risposta (in wdEntities)
        # trovo sempre prima coord
        # if label != '':
        # # Get the entity label
        #     lang = entity["label"]["xml:lang"]
        #     if lang == 'it':
        #         if "label" in entity:
        #             label = entity["label"]["value"]
        #         if "country" in entity:
        #             country = entity["country"]["value"]
        #         if "gpe" in entity:
        #             gpe = entity["gpe"]["value"]
        #         print(f'   {qid} • {label} • {coord} • {country} • {gpe}\n')
        #         return f'http://www.wikidata.org/entity/{qid}', label, coord, country, gpe

        #     if lang == 'en':
        #         if "label" in entity:
        #             label = entity["label"]["value"]
        #         if "country" in entity:
        #             country = entity["country"]["value"]
        #         if "gpe" in entity:
        #             gpe = entity["gpe"]["value"]
        #         print(f'   {qid} • {label} • {coord} • {country} • {gpe}\n')
        #         return f'http://www.wikidata.org/entity/{qid}', label, coord, country, gpe

        

        # Print entity data
        # print(f'   {qid} • {label}\n')

        # Ask user to confirm
        # try:
        #     newQid = askUser(qid)
        # except KeyboardInterrupt:
        #     print('\n')
        #     sys.exit()

        # Return Wikidata IRI
        # if newQid:
        #     if newQid == qid:
        #         return wdIRI
        #     else:
        #         return f'http://www.wikidata.org/entity/{newQid}'
        #     break
    
    if label_it != "":
        print(f'   {qid} • {label_it} • {coord} • {country} • {gpe}\n')
        return f'http://www.wikidata.org/entity/{qid}', label_it, coord, country, gpe
    elif label_en != "":
        print(f'   {qid} • {label_en} • {coord} • {country} • {gpe}\n')
        return f'http://www.wikidata.org/entity/{qid}', label_en, coord, country, gpe
    else:
        print(f'   {qid} • {label} • {coord} • {country} • {gpe}\n')
        return f'http://www.wikidata.org/entity/{qid}', label, coord, country, gpe

# Interactive Wikidata search
def wikiInteractivePlace(wdEntities):

    coord = ""
    country = ""
    print(wdEntities)
    for entity in wdEntities:
        printed = True
        
        if "coord" in entity:
            coord = entity["coord"]["value"]
        
        if "country" in entity:
            country = entity["country"]["value"] 


    return coord, country
    
    
# inizio il programma -------------------------------

# apro in scrittutra un file chiamato libraryListIri_6.txt dove andrò
# a scrivere poi le varie righe con i risultati
# t = open("provaPrimoGLAM_5.txt", 'w', encoding='utf-8')

places = {}

with open("places.json") as places_file:
    all_places = json.load(places_file)

for all_place in sorted(all_places.values(), key=lambda x: x['name']):
    
    place = {}
    # Get author fields
    iri = all_place['iri'].strip()
    name = all_place['name'].strip()

    qid = iri.split('/')[-1]

    wdEntities = wdQueryPlace(qid)
    if wdEntities:
        coord, country= wikiInteractivePlace(wdEntities)
    
    place['iri'] = iri
    place['name'] = name
    place['coord'] = coord
    place['country'] = country

    places[place['name']] = place

with open("place_complete.json", 'w', encoding='utf-8') as f:
    json.dump(places, f, ensure_ascii=False)

# libraries = {}

# # inizio la ricerca
# print('   === Library search ===\n')
# # apro il file con le librerie
# with open(TSV_FILE, encoding='utf-8') as f:
#     tsv = csv.reader(f, delimiter='\t')

#     # For each row of the TSV...
#     for i, row in enumerate(tsv):
#         # inizializzo un dict library (che sarà in nostro json)
#         library = {}

#         # chiamo SEARCHPAGE il valore di ogni riga (row[0]) 
#         SEARCHPAGE = row[0]
#         # e imposto il valore name in library con il nome originale
#         # letto dal file. Library per adesso è un oggetto
#         # library = { 'name' : row[0] } dove row[0] è il nome
#         # della libreria
#         library['name'] = row[0]

#         # imposto i parametri per la chiamata alle api di ricerca
#         # su wikidata
#         PARAMS = {
#             "action": "query", 
#             "format": "json",
#             "list": "search",
#             "srsearch": SEARCHPAGE # il valore importante è questo, cioè la stringa di ricerca
#         }

#         # chiamo la query e prendo la riposta in data
#         R = S.get(url=URL, params=PARAMS)
#         DATA = R.json()

#         # se si vuol vedere come è fatto DATA basta stamparlo
#         # print(DATA)

#         # Cerco se c'è un risultato alla query di ricerca e prendo il primo, perché
#         # solitamente è quello più affidabile.
#         if DATA['query']['search']:
#             # faccio la query a wikidata chiamando la funzione wdQuery e passandogli il 
#             # valore dentro a title che è un qid
#             for j in DATA['query']['search']:
#                 wdEntities = wdQuery(j['title'])
#                 if wdEntities:
#                     wdIRI, label, coord, country, gpe = wikiInteractive(row[0], wdEntities, j['title'])
#                     break
#             # for i in len(DATA['query']['search']):
#             #     # fare un controllo per passare solamente i qid che sono istanza di glam
#             #     qidGlam = wdQuery(DATA['query']['search'][i]['title'])

#             #     # fare un controllo per passare solamente i qid che sono istanza di glam
#             #     wdEntities = wdQuery()
#                 # vado a estrarre i dati dalla risposta chiamando wikiInteractive
            


#             # Aggiorno l'oggetto library con i dati trovati
#             # adesso sarà un oggetto fatto così
#             # library = { 'name' : row[0],
#             #             'iri' : wdIri,
#             #             'label' : label,
#             #             'coord' : coord }
#             library['iri'] = wdIRI
#             library['label'] = label
#             library['coord'] = coord
#             library['country'] = country
#             library['gpe'] = gpe
#         else:
#             # altrimenti metto delle stringe vuote
#             library['iri'] = ""
#             library['label'] = ""
#             library['coord'] = ""
#             library['country'] = ""
#             library['gpe'] = ""

#         # scrivo nel file t 
#         t.write(library['name'])
#         t.write(" ----- ")
#         t.write(library['label'])
#         t.write(" ----- ")
#         t.write(library['iri'])
#         t.write(" ----- ")
#         t.write(library['coord'])
#         t.write(" ----- ")
#         t.write(library['country'])
#         t.write(" ----- ")
#         t.write(library['gpe'])
#         t.write("\n")

#         # Se voglio scrivere gli oggetti json basta attivare
#         # Dove LIBRARY_FILE è il nome del file da impostare nelle
#         # variabili globali iniziali e libraries il json con tutte
#         # le biblioteche
#         libraries[library['name']] = library
#         with open(LIBRARY_FILE, 'w', encoding='utf-8') as f:
#             json.dump(libraries, f, ensure_ascii=False)

# t.close()