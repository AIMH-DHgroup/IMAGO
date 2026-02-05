#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import sys
import json
from urllib.error import HTTPError
import urllib.request
from django.core import serializers
from django.core.management.base import BaseCommand
from annotation.models import *
from django.contrib.auth.models import User
from . import export_libraries, export_places
from tqdm import tqdm


# Base directory of Annotation app
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# JSON file paths
NOTE_PATH = os.path.join(BASE_DIR, 'json/exported_lemmas.json')

WD_SPARQL_URL = 'http://query.wikidata.org/sparql?query='

l = Lemma.objects

def wikidata_request(query):
    # Request URL
    request_url = f'{WD_SPARQL_URL}{urllib.parse.quote(query)}&format=json'

    # Make request
    with urllib.request.urlopen(request_url) as response:
        results = json.loads(response.read())['results']['bindings']
        return results
    return None


def make_country_query(iri):
    qid = iri.split('/entity/')[1] # Wikidata ID starting with Q

    # Wikidata query
    wd_query = f'\nSELECT ?item ?label ?coordinates \n\
                WHERE {{ hint:Query hint:optimizer "None". \n\
                    BIND (wd:{qid} AS ?item) \n\
                    ?item rdfs:label ?label . \n\
                    OPTIONAL {{ \n\
                        ?item wdt:P625 ?coordinates . \n\
                    }} \n\
                    filter(lang(?label) = "it" || lang(?label) = "en" || lang(?label) = "la" ) \n\
                }}'

    # TODO import aliases for author
    # TODO import all works created by the author

    # Run Wikidata query
    query_results = wikidata_request(wd_query)

    englishName = ''
    italianName = ''
    latinName = ''
    coordinates = ''
    if query_results:
        for query_result in query_results:
            try:
                coordinates = query_result['coordinates']['value']
            except:
                coordinates = ''
            try:
                if query_result['label']['xml:lang'] == 'en':
                    englishName = query_result['label']['value']
            except:
                englishName = ''
            try:
                if query_result['label']['xml:lang'] == 'it':
                    italianName = query_result['label']['value']
            except:
                italianName = ''
            try:
                if query_result['label']['xml:lang'] == 'la':
                    latinName = query_result['label']['value']
            except:
                latinName = ''
        
    
        data = {'iri': iri, 'englishName' : englishName, 'italianName' : italianName, 'latinName' : latinName, 'coordinates' : coordinates}
        # data = {'iri': iri, 'name': query_results[0]['itemLabel']['value']}

        return data

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
            print('   Exporting notes...   ', end='')
            exported_note_count = 0
            
            try:
                # Notes to be exported
                lemmas = l.all() # get all the lemmas in db
                all_lemmas = [] # empty array for the finals lemmas
                lemma_isidoro = {}
                pk_isidoro = ""
                count_isidoro = 1
                
                # for every lemma
                # for lemma in lemmas:
                for lemma in tqdm(lemmas):
                    l_json = {} # new empty dict for lemma
                    pk = lemma.pk # id of the lemma
                    json_lemma = lemma.data['lemma'] # get the json of the lemma from db
                    
                        
                    # ABSTRACT
                    # If there is an abstract get the abstract, 
                    # otherwise the abstract is empty
                    try: 
                        abstract = json_lemma['abstract'] 
                    except:
                        abstract = ""
                    
                    # REVIEW
                    # If there is a review get the review, 
                    # otherwise the review is empty
                    try: 
                        review = json_lemma['review'] 
                    except:
                        review = False
                    
                    
                        
                    # AUTHOR
                    author_output_dict = {}
                    try:
                        author_object = Author.objects.get(data__iri=json_lemma['autore']) # get author object from db
                        author_output_dict = author_object.data # get the json from the object author
                        author_output_date = {}
                        
                        if 'vita' in author_output_dict['datazione']: 
                            # print("VITA")
                            spanlife = author_output_dict['datazione']['vita']
                            
                            spanlife_birthdate = {}
                            spanlife_birthdate['startDate'] = spanlife['dataNascita']['dataInizio']['data']
                            spanlife_birthdate['endDate'] = spanlife['dataNascita']['dataFine']['data']
                            spanlife_birthdate['uncertainty'] = spanlife['dataNascita']['incertezza']
                            spanlife_birthdate['ante'] = spanlife['dataNascita']['ante']
                            spanlife_birthdate['post'] = spanlife['dataNascita']['post']
                            spanlife_birthdate['romanNumerals'] = spanlife['dataNascita']['secolo']
                            
                            spanlife_deathdate = {}
                            spanlife_deathdate['startDate'] = spanlife['dataMorte']['dataInizio']['data']
                            spanlife_deathdate['endDate'] = spanlife['dataMorte']['dataFine']['data']
                            spanlife_deathdate['uncertainty'] = spanlife['dataMorte']['incertezza']
                            spanlife_deathdate['ante'] = spanlife['dataMorte']['ante']
                            spanlife_deathdate['post'] = spanlife['dataMorte']['post']
                            spanlife_deathdate['romanNumerals'] = spanlife['dataMorte']['secolo']
                            
                            author_output_date['birthDate'] = spanlife_birthdate
                            author_output_date['deathDate'] = spanlife_deathdate
                      
                            
                        if 'floruit' in author_output_dict['datazione']: 
                            floruit = author_output_dict['datazione']['floruit']
                            
                            floruit_output_date = {}
                            floruit_output_date['startDate'] = floruit['dataInizio']['data']
                            floruit_output_date['endDate'] = floruit['dataFine']['data']
                            floruit_output_date['uncertainty'] = floruit['incertezza']
                            floruit_output_date['ante'] = floruit['ante']
                            floruit_output_date['post'] = floruit['post']
                            floruit_output_date['romanNumerals'] = floruit['secolo']
                            
                            author_output_date['floruitDate'] = floruit_output_date
                            
                        if 'vescovo' in author_output_dict['datazione']: 
                            episcopus = author_output_dict['datazione']['vescovo']
                            
                            episcopus_output_date = {}
                            episcopus_output_date['startDate'] = episcopus['dataInizio']['data']
                            episcopus_output_date['endDate'] = episcopus['dataFine']['data']
                            episcopus_output_date['uncertainty'] = episcopus['incertezza']
                            episcopus_output_date['ante'] = episcopus['ante']
                            episcopus_output_date['post'] = episcopus['post']
                            episcopus_output_date['romanNumerals'] = episcopus['secolo']
                            
                            author_output_date['episcopusDate'] = episcopus_output_date
                           
                
                        
                        # print(author_output_date)
                        author_output_dict['authorDate'] = author_output_date
                        if 'datazione' in author_output_dict: 
                            del author_output_dict['datazione']
                        
                    except Author.DoesNotExist:
                        author_output_dict['iri'] = json_lemma['autore'] 
                        # if the object author doesn't exist, put only the author iri in the output field iri
                    
                    # WORK
                    work_output_dict = {}
                    try:
                        work_object = Work.objects.get(data__iri=json_lemma['opera']) # get work object from db
                        work_output_dict = work_object.data # get the json from the object work
                    except Work.DoesNotExist:
                        work_output_dict['author'] = json_lemma['autore']
                        work_output_dict['iri'] = json_lemma['opera']
                        # if the object work doesn't exist, put only the lemma (author iri and work iri) in the output field iri

                    # GENRES
                    
                    genres_list = json_lemma['generi'] # get the list of genres
                    genres_output_list = [] # create the list of output for genres
                    for genre_iri in genres_list: # for verey genre
                        genre_output_dict = {} # create the dict for every genre
                        try:
                            genre_object = Genre.objects.get(data__iri=genre_iri) # get genre object from db
                            genre_output_dict = genre_object.data 
                        except Genre.DoesNotExist:
                            genre_output_dict['iri'] = genre_iri
                        genres_output_list.append(genre_output_dict)
                        

                    toponyms_list = json_lemma['toponimi']
                    toponyms_output_list = []
                    for toponym_iri in toponyms_list:
                        toponym_output_dict = {}
                        try:
                            toponym_object = Place.objects.get(data__iri=toponym_iri)
                            toponym_output_dict = export_places.makePlaceJSON(toponym_object.data['iri'], toponym_object.data['name'])
                            if('country' in toponym_output_dict):
                                if(toponym_output_dict['country']!=""):
                                    if type(toponym_output_dict['country']) != dict: 
                                        country = make_country_query(toponym_output_dict['country'])
                            
                        except Place.DoesNotExist:
                            toponym_output_dict['iri'] = toponym_iri
                        
                        toponym_output_dict['country'] = country
                        toponyms_output_list.append(toponym_output_dict)

                    

                    manuscripts_list = json_lemma['manoscritti']
                    manuscripts_output_list = []
                    for manuscript in manuscripts_list:
                        manuscript_output_dict = {}
                        library_iri = manuscript['biblioteca']
                        library_output_dict = {}
                        try:
                            library_object = Library.objects.get(data__iri=library_iri)
                            # print(library_object.data)
                            # print(export_libraries.makeLibraryJSON(library_object.data['iri'], library_object.data['name']))
                            library_output_dict = export_libraries.makeLibraryJSON(library_object.data['iri'], library_object.data['name'])
                            # if(library_iri=='http://www.wikidata.org/entity/Q536580'):
                            #     print(library_output_dict)
                        except Library.DoesNotExist:
                            library_output_dict['iri'] = library_iri
                        
                        # Città del vaticano = Q237
                        # Biblioteca apostolica vaticana = Q213678
                        # Roma Q220
                        library_place_iri = manuscript['luogoBiblioteca']
                        
                        
                        if library_iri == "http://www.wikidata.org/entity/Q213678":
                            if library_place_iri ==  "http://www.wikidata.org/entity/Q220":
                                library_place_iri = "http://www.wikidata.org/entity/Q237"
                        
                        if library_iri == "http://www.wikidata.org/entity/Q85692455":
                            if library_place_iri ==  "http://www.wikidata.org/entity/Q1001999":
                                library_place_iri = "http://www.wikidata.org/entity/Q5836"
                        
                        if library_iri == "http://www.wikidata.org/entity/Q11909310":
                            if library_place_iri ==  "http://www.wikidata.org/entity/Q314745":
                                library_place_iri = "http://www.wikidata.org/entity/Q15088"       
                                
                        library_place_ouput_dict = {}
                        try:
                            library_place_object = Place.objects.get(data__iri=library_place_iri)
                            library_place_ouput_dict = export_places.makePlaceJSON(library_place_object.data['iri'], library_place_object.data['name'])
                            # print(library_place_ouput_dict)
                            if('country' in library_place_ouput_dict):
                                # print(library_place_ouput_dict['country'])
                                if type(library_place_ouput_dict['country']) != dict: 
                                    country = make_country_query(library_place_ouput_dict['country'])
                            # print(biblioteca['place'])
                        except Place.DoesNotExist:
                            library_place_ouput_dict['iri'] = library_place_iri
                        try:
                            library_output_dict['place'] = library_place_ouput_dict
                            library_output_dict['place']['country'] = country
                            
                        except:
                            pass
                        
                        annotator_output_dict = {}
                        try:
                            user_object = User.objects.get(username=manuscript['schedatore'])
                        except model.DoesNotExist:
                            pass
                        if user_object:
                            annotator_output_dict['username'] = manuscript['schedatore']
                            annotator_output_dict['firstName'] = user_object.first_name
                            annotator_output_dict['lastName'] = user_object.last_name
                        
                        source_manuscript_list = manuscript['fonti'] 
                        source_manuscript_output_list = [] 
                        for source_manuscript in source_manuscript_list:
                            source_manuscript_output_dict = {}
                            try:
                                source_manuscript_object = Source.objects.get(data__iri=source_manuscript['iri']) 
                                source_manuscript_output_dict = source_manuscript_object.data 
                                source_manuscript_output_dict['specific'] = source_manuscript['specific']
                            except Genre.DoesNotExist:
                                pass
                            source_manuscript_output_list.append(source_manuscript_output_dict)
                        
                        manuscript_output_date = {}
                        manuscript_output_date['startDate'] = manuscript['datazione']['dataInizio']['data']
                        manuscript_output_date['endDate'] = manuscript['datazione']['dataFine']['data']
                        manuscript_output_date['uncertainty'] = manuscript['datazione']['incertezza']
                        manuscript_output_date['ante'] = manuscript['datazione']['ante']
                        manuscript_output_date['post'] = manuscript['datazione']['post']
                        manuscript_output_date['romanNumerals'] = manuscript['datazione']['secolo']
        
                        
                        manuscript_output_dict['url'] = manuscript['url']
                        manuscript_output_dict['notes'] = manuscript['note']
                        manuscript_output_dict['folios'] = manuscript['fogli']
                        manuscript_output_dict['sources'] = source_manuscript_output_list
                        manuscript_output_dict['author'] = manuscript['autore']
                        manuscript_output_dict['title'] = manuscript['titolo']
                        manuscript_output_dict['lastMod'] = manuscript['lastMod']
                        manuscript_output_dict['date'] = manuscript_output_date
                        manuscript_output_dict['signature'] = manuscript['segnatura']
                        manuscript_output_dict['library'] = library_output_dict
                        manuscript_output_dict['annotator'] = annotator_output_dict
                        manuscript_output_dict['decoration'] = manuscript['decorazione']
                        manuscript_output_dict['incipitText'] = manuscript['incipitTesto']
                        manuscript_output_dict['explicitText'] = manuscript['explicitTesto']
                        manuscript_output_dict['incipitDedication'] = manuscript['incipitDedica']
                        manuscript_output_dict['explicitDedication'] = manuscript['explicitDedica']
                        manuscript_output_dict['urlDescription'] = manuscript['urlDescrizione']
                        manuscript_output_dict['dateString'] = manuscript['datazioneString']
                        
                        manuscripts_output_list.append(manuscript_output_dict)

                    print_editions_list = json_lemma['edizioniStampa']
                    print_editions_output_list = []
                    for print_edition in print_editions_list:
                        print_edition_dict = {}
                        
                        place_iri = print_edition['luogo']
                        place_output_dict = {}
                        try:
                            place_object = Place.objects.get(data__iri=place_iri)
                            place_output_dict = export_places.makePlaceJSON(place_object.data['iri'], place_object.data['name'])
                            if('country' in place_output_dict):
                                if type(place_output_dict['country']) != dict: 
                                    country = make_country_query(place_output_dict['country'])
                                    place_output_dict['country'] = country
                        
                        except Place.DoesNotExist:
                            place_output_dict = {}
                        
                                               
                        print_edition_dict['place'] = place_output_dict
                        
                        annotator_output_dict = {}
                        try:
                            user_object = User.objects.get(username=print_edition['schedatore'])
                        except model.DoesNotExist:
                            pass
                        if user_object:
                            annotator_output_dict['username'] = print_edition['schedatore']
                            annotator_output_dict['firstName'] = user_object.first_name
                            annotator_output_dict['lastName'] = user_object.last_name
                        
                        source_print_edition_list = print_edition['fontiSecondarie'] 
                        source_print_edition_output_list = [] 
                        for source_print_edition in source_print_edition_list:
                            source_print_edition_output_dict = {}
                            try:
                                source_print_edition_object = Source.objects.get(data__iri=source_print_edition['iri']) 
                                source_print_edition_output_dict = source_print_edition_object.data 
                                source_print_edition_output_dict['specific'] = source_print_edition['specific']
                            except Genre.DoesNotExist:
                                pass
                            source_print_edition_output_list.append(source_print_edition_output_dict)
                       
                        print_edition_output_date = {}
                        print_edition_output_date['startDate'] = print_edition['data']['dataInizio']['data']
                        print_edition_output_date['endDate'] = print_edition['data']['dataFine']['data']
                        print_edition_output_date['uncertainty'] = print_edition['data']['incertezza']
                        print_edition_output_date['ante'] = print_edition['data']['ante']
                        print_edition_output_date['post'] = print_edition['data']['post']
                        print_edition_output_date['romanNumerals'] = print_edition['data']['secolo']
                        
                        
                        print_edition_dict['placeAsAppear'] = print_edition['luogoEdizione']
                        print_edition_dict['notes'] = print_edition['note']
                        print_edition_dict['figures'] = print_edition['figure']
                        print_edition_dict['sources'] = source_print_edition_output_list
                        print_edition_dict['author'] = print_edition['autore']
                        print_edition_dict['title'] = print_edition['titolo']
                        print_edition_dict['lastMod'] = print_edition['lastMod']
                        print_edition_dict['date'] = print_edition_output_date
                        print_edition_dict['pages'] = print_edition['pagine']
                        print_edition_dict['format'] = print_edition['formato']
                        print_edition_dict['editor'] = print_edition['editore']
                        print_edition_dict['curator'] = print_edition['curatore']
                        print_edition_dict['annotator'] = annotator_output_dict
                        print_edition_dict['ecdotic'] = print_edition['ecdotica']
                        print_edition_dict['languageTraduction'] = print_edition['linguaTraduzione']
                        print_edition_dict['edition'] = print_edition['edizione']
                        print_edition_dict['prefator'] = print_edition['prefatore']
                        print_edition_dict['dateEdition'] = print_edition['dataEdizione']
                        print_edition_dict['primarySources'] = print_edition['fontiPrimarie']
                        print_edition_dict['otherContents'] = print_edition['altriContenuti']
                        print_edition_dict['dateString'] = print_edition['dataString']
                        
		
           

                        print_editions_output_list.append(print_edition_dict)

                    if(json_lemma['autore']=='http://www.mirabileweb.it/author/isidorus-hispalensis-episcopus-n-560-ca-m-4-4-636-author/19204'):
                        if(json_lemma['opera']=='http://www.mirabileweb.it/title/etymologiarum-libri-xx-isidorus-hispalensis-episco-title/3783'):
                            lemma_isidoro['author'] = author_output_dict
                            lemma_isidoro['work'] = work_output_dict
                            lemma_isidoro['abstract'] = abstract
                            lemma_isidoro['review'] = review
                            lemma_isidoro['genres'] = genres_output_list
                            lemma_isidoro['places'] = toponyms_output_list
                            lemma_isidoro['manuscripts'] = manuscripts_output_list
                            lemma_isidoro['printEditions'] = print_editions_output_list
                            pk_isidoro = pk
                        else:
                            lista = lemma_isidoro['manuscripts']
                            lemma_isidoro['manuscripts'] = lista + manuscripts_output_list
                        
                        count_isidoro=count_isidoro+1
                        if(count_isidoro==4):
                            l_json['id'] = pk_isidoro
                            l_json['lemma'] = lemma_isidoro 
                            # print(l_json)
                            all_lemmas.append(l_json)

                    else:
                        lemma_output = {}

                        lemma_output['author'] = author_output_dict
                        lemma_output['work'] = work_output_dict
                        lemma_output['abstract'] = abstract
                        lemma_output['review'] = review
                        lemma_output['genres'] = genres_output_list
                        lemma_output['places'] = toponyms_output_list
                        lemma_output['manuscripts'] = manuscripts_output_list
                        lemma_output['printEditions'] = print_editions_output_list

                        l_json['id'] = pk
                        l_json['lemma'] = lemma_output 
                    
                        #Append the lemma only if exist at least a manuscript or a print edition
                        # if (manuscripts_output_list or print_editions_output_list) :
                        all_lemmas.append(l_json)
                        
                    # print(json_lemma)
                    #  Write notes to JSON file
                    with open(opt_path, 'w') as note_file:
                        # note_file.write(l_json)
                        json.dump(all_lemmas, note_file)

                # notes = serializers.serialize('json', l.all())
                # print(notes)

                # Write notes to JSON file
                # with open(opt_path, 'w') as note_file:
                #     note_file.write(notes)
            except:
                raise

            print(f'Exported {l.all().count()} notes')
            print()

            if errors:
                print('\n'.join(errors))
                print()

        # Exit gracefully in case of keyboard interrupt
        except KeyboardInterrupt:
            print('\n')
            sys.exit()
