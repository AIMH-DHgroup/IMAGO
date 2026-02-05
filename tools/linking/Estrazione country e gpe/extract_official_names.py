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
# TSV_FILE = 'libraries.json'
LIBRARY_FILE = 'libraries.json'
PLACES_FILE = 'places.json'

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
    wdQuery = f'\nSELECT ?name ?label\
                WHERE {{\
                OPTIONAL \
                {{ wd:{qid} wdt:P1448 ?name.}}\
                wd:{qid} rdfs:label ?label.\
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
def wikiInteractive(wdEntities, qid, extra=''):
    label = ""
    label_it = ""
    label_en = ""
    name = ""
    
    # print(wdEntities)
    for entity in wdEntities:
        printed = True
        # print(entity)
        if "name" in entity:
            name = entity["name"]["value"]
            
        
        if "label" in entity:
            label = entity["label"]["value"] 
            lang = entity["label"]["xml:lang"]
            if lang == 'it':
                label_it = entity["label"]["value"]
            if lang == 'en':
                label_en = entity["label"]["value"]

        # name = entity["label"]["value"]
        # print(f'   {qid} • {name}\n')
        # return f'http://www.wikidata.org/entity/{qid}', name
    if name != "":
        print(f'   {qid} • {name} \n')
        return f'http://www.wikidata.org/entity/{qid}', name
    elif label_it != "":
        print(f'   {qid} • {label_it} \n')
        return f'http://www.wikidata.org/entity/{qid}', label_it
    elif label_en != "":
        print(f'   {qid} • {label_en} \n')
        return f'http://www.wikidata.org/entity/{qid}', label_en
    else:
        print(f'   {qid} • {label} \n')
        return f'http://www.wikidata.org/entity/{qid}', label
        
    
    
   
    


places = {}

# inizio la ricerca
print('   === Places search ===\n')
data = json.load(open(LIBRARY_FILE))
#print(len(data))
places = {}
for key in data.keys():
    value = data.get(key, None)
    gpe = value['gpe']

    if gpe:
    
        place = {}

        # Get the Wikidata ID
        qid = gpe.split('/')[-1]

        wdEntities = wdQuery(qid)
        if wdEntities:
            wdIRI, name = wikiInteractive(wdEntities, qid)
            place['iri'] = wdIRI
            place['name'] = name
            # print(name)
        
      
        if name not in places:
            places[place['name']] = place
        # print(places)
        with open(PLACES_FILE, 'w', encoding='utf-8') as f:
            json.dump(places, f, ensure_ascii=False)
