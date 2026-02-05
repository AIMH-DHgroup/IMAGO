#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import sys
import json
import re
from urllib.error import HTTPError
import urllib.request
from django.core import serializers
from django.core.management.base import BaseCommand
from annotation.models import *
from django.contrib.auth.models import User


# Correction place
correction = {
    'https://imagoarchive.it/resource/albi': 'http://www.wikidata.org/entity/Q132801', #Albi
    # 'https://imagoarchive.it/resource/bloomington-indiana-university-lilly-libr': '' , #Bloomington, Indiana University, Lilly Libr.
    'https://imagoarchive.it/resource/bridlington' : 'http://www.wikidata.org/entity/Q527391', #Bridlington
    'https://imagoarchive.it/resource/cambridge-ma' : 'http://www.wikidata.org/entity/Q49111', #'Cambridge (MA)'
    'https://imagoarchive.it/resource/castro' : 'http://www.wikidata.org/entity/Q52129', # 'Castro'
    # 'https://imagoarchive.it/resource/fiecht' : '?', #'Fiecht'
    'https://imagoarchive.it/resource/gerleve' : 'http://www.wikidata.org/entity/Q47190461', # 'Gerleve' 
    #'https://imagoarchive.it/resource/gottweig' : 'http://www.wikidata.org/entity/Q581628', #Furth bei Göttweig 'Göttweig'
    #'https://imagoarchive.it/resource/helsinki-universitetsbibliotek' : '?', #'Helsinki, Universitetsbibliotek'
    # 'https://imagoarchive.it/resource/hulne' : 'http://www.wikidata.org/entity/Q2630513', #Denwick (Q2630513) 'Hulne'
    'https://imagoarchive.it/resource/itacha' : 'http://www.wikidata.org/entity/Q217346', #Ithaca (Q217346) 'Itacha'
    # 'https://imagoarchive.it/resource/longleat-house-warminster-wiltshire'  : 'http://www.wikidata.org/entity/Q1726158' , #Longleat (Q1726158) 'Longleat House (Warminster, Wiltshire)'
    'https://imagoarchive.it/resource/michaelbeuern' : 'http://www.wikidata.org/entity/Q97499728', #'Michaelbeuern'
    'https://imagoarchive.it/resource/notre-dame-indiana' : 'http://www.wikidata.org/entity/Q746071' , #'Notre Dame, Indiana'
    'https://imagoarchive.it/resource/opladen' : 'http://www.wikidata.org/entity/Q315138' , #'Opladen'
    # 'https://imagoarchive.it/resource/oslo-national-archives'  : '' , #'Oslo, National Archives'
    # 'https://imagoarchive.it/resource/porto-di-laiazzo' : 'http://www.wikidata.org/entity/Q939243' , #oggi Yumurtalık (Q939243) #'Porto di Laiazzo'
    'https://imagoarchive.it/resource/roca-vecchia' : 'http://www.wikidata.org/entity/Q2727876' , #'Roca Vecchia'
    'https://imagoarchive.it/resource/romont' : 'http://www.wikidata.org/entity/Q67103' , # 'Romont'
    # 'https://imagoarchive.it/resource/sankt-paul-im-lavanttal-bibliothek-des-benediktinerstifts' : '?' , #'Sankt Paul im Lavanttal, Bibliothek des Benediktinerstifts'
    'https://imagoarchive.it/resource/san-marino-california' : 'http://www.wikidata.org/entity/Q850869' , #'San Marino (California)'
    'https://imagoarchive.it/resource/sicilia' : 'http://www.wikidata.org/entity/Q1460' , # Sicilia
    'https://imagoarchive.it/resource/toledo-ohio' : 'http://www.wikidata.org/entity/Q49239', #'Toledo (Ohio)' 
    'https://imagoarchive.it/resource/wellesley'  : 'http://www.wikidata.org/entity/Q533317' #'Wellesley'
     #'https://imagoarchive.it/resource/wurttemberg' : '?' , #forse Wolfegg (Q533735) 'Württemberg'
}

iri_correction = {
    "http://www.wikidata.org/entity/Q20986484" : "http://www.wikidata.org/entity/Q34217",
    "http://www.wikidata.org/entity/Q33706565" : "http://www.wikidata.org/entity/Q91341"
    }

# Base directory of Annotation app
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# JSON file paths
NOTE_PATH = os.path.join(BASE_DIR, 'json/exported_places.json')

WD_SPARQL_URL = 'http://query.wikidata.org/sparql?query='

p = Place.objects

retrived_places = {}

def wikidata_request(query):
    # Request URL
    request_url = f'{WD_SPARQL_URL}{urllib.parse.quote(query)}&format=json'

    # Make request
    with urllib.request.urlopen(request_url) as response:
        results = json.loads(response.read())['results']['bindings']
        return results
    return None


def make_query(iri, place_name):
    
    qid = iri.split('/entity/')[1] # Wikidata ID starting with Q

    # Wikidata query
    wd_query = f'\nSELECT ?item ?label ?name ?label_lang_item ?coordinates ?country (lang(?label) AS ?label_lang) \n\
                WHERE {{ hint:Query hint:optimizer "None". \n\
                BIND (wd:{qid} AS ?item) \n\
                ?item wdt:P17 ?country . \n\
                OPTIONAL {{ ?item wdt:P625 ?coordinates . }} \n\
                ?country wdt:P37 ?countrylanguage . \n\
                ?countrylanguage wdt:P1705 ?countrylanguagelabel . \n\
                BIND(lang(?countrylanguagelabel) as ?label_lang_country) \n\
                OPTIONAL {{ \n\
                    ?item wdt:P625 ?coordinates . \n\
                }} \n\
                OPTIONAL {{ \n\
                    ?item wdt:P1448 ?name . \n\
                    }} \n\
                OPTIONAL {{\n\
                    ?item wdt:P37 ?language . \n\
                ?language wdt:P1705 ?languagelabel . \n\
                BIND(lang(?languagelabel) as ?label_lang_item) \n\
                    }} \n\
                    ?item rdfs:label ?label . \n\
                        filter(lang(?label) = ?label_lang_item || lang(?label) = ?label_lang_country) \n\
                }}'

    wd_query_2 = f'\nSELECT ?item ?label (lang(?label) AS ?label_lang) \n\
                WHERE {{ hint:Query hint:optimizer "None". \n\
                BIND (wd:{qid} AS ?item) \n\
                    ?item rdfs:label ?label . \n\
                    filter(lang(?label) = "it" || lang(?label) = "en" || lang(?label) = "la" ) \n\
                }}'

    # Run Wikidata query
    query_results = wikidata_request(wd_query)
    query_results_2 = wikidata_request(wd_query_2)
    country = ''
    coordinates = ''
    originalName = ''
    originalLang = ''
    name = ''
    lang = ''
    if query_results:
        try:
            coordinates = query_results[0]['coordinates']['value']
        except:
            coordinates = ''
        try:
            country = query_results[0]['country']['value']
        except:
            country = ''
        try:
            originalName = query_results[0]['name']['value']
        except:
            originalName = ''
        try:
            originalLang = query_results[0]['label_lang_item']['value']
        except:
            originalLang = ''
        for query_result in query_results:
            if query_result['label']['xml:lang'] == query_result['label_lang']['value']:
                name = query_result['label']['value']
                lang = query_result['label_lang']['value']
                break
    englishName = ''
    italianName = ''
    latinName = ''
    if query_results_2:
        for query_result_2 in query_results_2:
            try:
                if query_result_2['label']['xml:lang'] == 'en':
                    englishName = query_result_2['label']['value']
            except:
                englishName = ''
            try:
                if query_result_2['label']['xml:lang'] == 'it':
                    italianName = query_result_2['label']['value']
            except:
                italianName = ''
            try:
                if query_result_2['label']['xml:lang'] == 'la':
                    latinName = query_result_2['label']['value']
            except:
                latinName = ''
        
    
    data = {'iri': iri, 'originalName': originalName, 'originalLang': originalLang, 'name': place_name, 'oldName': name, 'lang': lang, 'englishName' : englishName, 'italianName' : italianName, 'latinName' : latinName, 'coordinates' : coordinates, 'country' : country}

    return data

def makePlaceJSON(place_iri, place_name):
    # print(retrived_places)
    if re.search("^https://imagoarchive.it/resource/", place_iri):
        
        if place_iri in correction:
            if correction[place_iri] in retrived_places:
                return retrived_places[correction[place_iri]]
            else:
                retrived_places[correction[place_iri]] = make_query(correction[place_iri], place_name)
                return retrived_places[correction[place_iri]]
        else:
            return {'iri': place_iri , "name" : place_name}
    else:
        if place_iri in iri_correction:
            place_iri = iri_correction[place_iri]
        if place_iri in retrived_places:
            return retrived_places[place_iri]
        else:
            retrived_places[place_iri] = make_query(place_iri, place_name)
            return retrived_places[place_iri]

class Command(BaseCommand):
    help = 'Exports notes from DB'
    
           

    # Define command-line options
    def add_arguments(self, parser):
        parser.add_argument('-p', '--path', dest='path', help='export notes to this path',
                            default=NOTE_PATH)

    def handle(self, *args, **options):
        # Get command-line options
        opt_path = options.get('path')

        errors = []

        try:
            print()

            # Export notes
            print('   Exporting places...   ', end='')
            exported_note_count = 0
            
            try:
                # Notes to be exported
                # places = serializers.serialize('json', p.all()) # get all the lemmas in db
                places = p.all()
                # for every place
                for place in places:
                    l_json = {} # new empty dict for lemma
                    pk = place.pk # id of the lemma
                    place_iri = place.data['iri'] # get the json of the lemma from db
                    place_name = place.data['name']
                    
                    if re.search("^https://imagoarchive.it/resource/", place_iri):
                        # print(place_iri + " -- " + place_name)
                        if place_iri in correction:
                            # print(correction[place_iri])
                            corrected = make_query(correction[place_iri], place_name)
                            try:
                                obj = Place.objects.get(data__iri=corrected["iri"])
                            except Place.DoesNotExist:
                                obj = Place(data=corrected)
                                obj.save()  
                    # else:
                    #     print(make_query(place_iri))
                    # except:
                    #     print(place_iri)
                 
                    #  Write notes to JSON file
                # with open(opt_path, 'w') as note_file:
                #     # note_file.write(l_json)
                #     json.dump(places, note_file)
               
            except:
                raise

            print(f'Exported {p.all().count()} places')
            print()

            if errors:
                print('\n'.join(errors))
                print()

        # Exit gracefully in case of keyboard interrupt
        except KeyboardInterrupt:
            print('\n')
            sys.exit()
