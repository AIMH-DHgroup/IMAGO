#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import sys
import json
import csv
import re
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

BIBLIOTECHE_CSV = os.path.join(BASE_DIR, 'csv/biblioteche_corrette.tsv')

WD_SPARQL_URL = 'http://query.wikidata.org/sparql?query='

l = Lemma.objects
b = Library.objects
p = Place.objects

doubt_libraries = {
    'http://www.wikidata.org/entity/Q631375' : '',
    'https://imagoarchive.it/resource/den-haag-sammlung-schinkel' : ''
}

correction_libraries = {
    'https://imagoarchive.it/resource/biblioteca-statale-berlinese-patrimonio-culturale-prussiano' : 'http://www.wikidata.org/entity/Q170109',
    'http://www.wikidata.org/entity/Q683842' : 'http://www.wikidata.org/entity/Q81164649',
    'http://www.wikidata.org/entity/Q81165027' : 'http://www.wikidata.org/entity/Q856559',
    'http://www.wikidata.org/entity/Q46996155' : 'http://www.wikidata.org/entity/Q20755622',
    'https://imagoarchive.it/resource/biblioteca-classense' : 'http://www.wikidata.org/entity/Q3639574',
    'https://imagoarchive.it/resource/bibliothek-des-augustiner-chorherrenstiftes' : 'https://imagoarchive.it/resource/klosterneuburg-bibliothek-des-augustiner-chorherrenstiftes',
    'http://www.wikidata.org/entity/Q2583293' : 'http://www.wikidata.org/entity/Q814779',
    'http://www.wikidata.org/entity/Q49112' : 'http://www.wikidata.org/entity/Q814779',
    'https://imagoarchive.it/resource/heiligenkreuz-stiftsbibliothek' : 'https://imagoarchive.it/resource/heiligenkreuz-bibliothek-des-zisterzienserstifts',
    'https://imagoarchive.it/resource/wroclaw-biblioteka-uniwersytecka' : 
    'http://www.wikidata.org/entity/Q1720553',
    'http://www.wikidata.org/entity/Q114667290' : 'http://www.wikidata.org/entity/Q257342',
    'http://www.wikidata.org/entity/Q1334582' : 'http://www.wikidata.org/entity/Q26196729',
    'https://imagoarchive.it/resource/jena-biblioteca-delluniversita' : 'http://www.wikidata.org/entity/Q1255096' ,
    'http://www.wikidata.org/entity/Q106807441' : 'http://www.wikidata.org/entity/Q19946540',
    'http://www.wikidata.org/entity/Q317032' : 'http://www.wikidata.org/entity/Q2496254',
    'http://www.wikidata.org/entity/Q101248021' : 'http://www.wikidata.org/entity/Q564783',
    'http://www.wikidata.org/entity/Q660082' : 'http://www.wikidata.org/entity/Q1589808',
    'http://www.wikidata.org/entity/Q1293952' : 'http://www.wikidata.org/entity/Q6550514',
    'http://www.wikidata.org/entity/Q536282' : 'http://www.wikidata.org/entity/Q1135137',
    'http://www.wikidata.org/entity/Q81165650' : 'http://www.wikidata.org/entity/Q805285',
    'https://imagoarchive.it/resource/hildesheim-bibliothek-des-priesterseminars' : 'http://www.wikidata.org/entity/Q1236928',
    'http://www.wikidata.org/entity/Q2324646' : 'https://imagoarchive.it/resource/kaliningradskaja-oblastnaja-biblioteka',
    'http://www.wikidata.org/entity/Q2901555' : 'http://www.wikidata.org/entity/Q18573998',
    'http://www.wikidata.org/entity/Q867885' : 'http://www.wikidata.org/entity/Q1526131' ,
    'http://www.wikidata.org/entity/Q104185308' : 'http://www.wikidata.org/entity/Q3298462',
    'http://www.wikidata.org/entity/Q2860515' : 'http://www.wikidata.org/entity/Q18599881',
    'http://www.wikidata.org/entity/Q101406232' : 'http://www.wikidata.org/entity/Q323270',
    'http://www.wikidata.org/entity/Q28668065' : 'https://imagoarchive.it/resource/casa-cavalli',
    'http://www.wikidata.org/entity/Q301269' : 'http://www.wikidata.org/entity/Q301235'
}

correction_city = {
    'http://www.wikidata.org/entity/Q36433' : ['http://www.wikidata.org/entity/Q23949493','http://www.wikidata.org/entity/Q8356', 'Valladolid'],
    'http://www.wikidata.org/entity/Q2140249' : ['https://imagoarchive.it/resource/rein-stiftsbibliothek','http://www.wikidata.org/entity/Q18624710', 'Gratwein-Straßengel'],
    'http://www.wikidata.org/entity/Q985269' : ['http://www.wikidata.org/entity/Q3848863','http://www.wikidata.org/entity/Q371748', 'San Lorenzo de El Escorial'],
    'http://www.wikidata.org/entity/Q189128' : ['http://www.wikidata.org/entity/Q85688853','http://www.wikidata.org/entity/Q15699', 'León'],
    'http://www.wikidata.org/entity/Q21729' : ['http://www.wikidata.org/entity/Q2496255','http://www.wikidata.org/entity/Q2742', 'Münster'],
    'http://www.wikidata.org/entity/Q49111' : ['http://www.wikidata.org/entity/Q256754','http://www.wikidata.org/entity/Q21713103', 'Cambridge'],
    'http://www.wikidata.org/entity/Q1001999' : ['http://www.wikidata.org/entity/Q85692455','http://www.wikidata.org/entity/Q5836', 'Toledo'],
    'http://www.wikidata.org/entity/Q79490' : ['http://www.wikidata.org/entity/Q1059517','http://www.wikidata.org/entity/Q1094226', 'Winchester'],
    'http://www.wikidata.org/entity/Q1291' : ['http://www.wikidata.org/entity/Q1957240','http://www.wikidata.org/entity/Q14960', 'Brno'],
     'http://www.wikidata.org/entity/Q314745' : ['http://www.wikidata.org/entity/Q11909310','http://www.wikidata.org/entity/Q15088', 'Tarragona'],
    'http://www.wikidata.org/entity/Q20032414' : ['http://www.wikidata.org/entity/Q9170771','http://www.wikidata.org/entity/Q1792', 'Gdansk']
}



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
            pls = []
            lbs = []
            with open(BIBLIOTECHE_CSV, newline='', encoding='utf-8') as csvfile:
                spamreader = csv.reader(csvfile, delimiter="\t")
                for row in spamreader:
                    # print(row[0])

                    lbs.append({'iri': row[2], 'name':row[3], 'place':row[0]})
                    pls.append({'iri': row[0], 'name':row[1]})
                     

            # print(lbs)
            # Export notes
            print('   Updating notes...   ', end='')
            exported_note_count = 0
            
            try:
                # Notes to be exported
                lemmas = l.all() # get all the lemmas in db
                all_lemmas = [] # empty array for the finals lemmas
                
                # for every lemma
                # for lemma in lemmas:
                for lemma in lemmas:
                    l_json = {} # new empty dict for lemma
                    lemma_pk = lemma.pk # id of the lemma
                    json_lemma = lemma.data # get the json of the lemma from db
                    
                    new_toponym_list = []
                    toponym_list = json_lemma['lemma']['toponimi']
                    for toponym in toponym_list:
                        if toponym == 'http://www.wikidata.org/entity/Q1241701':
                            toponym = 'http://www.wikidata.org/entity/Q29'
                            # print(toponym)
                        new_toponym_list.append(toponym)
                        
                    json_lemma['lemma']['toponimi'] = new_toponym_list
                            

                    manuscript_list = json_lemma['lemma']['manoscritti']
                    manuscript_output_list = []
                    for manuscript in manuscript_list:
                        
                        library = manuscript['biblioteca']
                        library_place = manuscript['luogoBiblioteca']
                        if re.search("^https://imagoarchive.it/resource/", library):
                            
                            if library in export_libraries.correction:
                                
                                if(export_libraries.correction[library]!=""):
                                    print(library, export_libraries.correction[library])
                                    manuscript['biblioteca'] = export_libraries.correction[library]
                                    
                                    try:
                                        obj = Library.objects.get(data__iri=export_libraries.correction[library])
                                    except Library.DoesNotExist:
                                        obj = Library(data={'iri':export_libraries.correction[library], 'name':''})
                                        obj.save()  
                                
                        if re.search("^https://imagoarchive.it/resource/", library_place):
                            # print(place_iri + " -- " + place_name)
                            if library_place in export_places.correction:
                                manuscript['luogoBiblioteca'] = export_places.correction[library_place]
                        
                        if library_place in correction_city:
                            if library == correction_city[library_place][0]:
                                manuscript['luogoBiblioteca'] = correction_city[library_place][1]
                                j_pl= {"iri": correction_city[library_place][1] , "name": correction_city[library_place][2]}
                                try:
                                    obj = Place.objects.get(data__iri=correction_city[library_place][1])
                                except Place.DoesNotExist:
                                    obj = Place(data=j_pl)
                                    obj.save()  
                                Place.objects.filter(data__iri=correction_city[library_place][1]).update(data=j_pl)
                        if library in correction_libraries:
                            manuscript['biblioteca'] = correction_libraries[library]
                            try:
                                obj = Library.objects.get(data__iri=correction_libraries[library])
                            except Library.DoesNotExist:
                                obj = Library(data={'iri':correction_libraries[library], 'name':''})
                                obj.save()  
                            
                        # if library in doubt_libraries:
                        #     print(library + " --> " + doubt_libraries[library])
                        manuscript_output_list.append(manuscript)
                
                    
                    json_lemma['lemma']['manoscritti'] = manuscript_output_list
                    # print(json_lemma)
                    Lemma.objects.filter(pk=lemma_pk).update(data=json_lemma)
                    # print(print_editions_output_list)
                # ---------------------------------------------------------------------------------
                libraries = b.all()
                for lib in libraries:
                    
                    lib_pk = lib.pk # id of the lemma
                    json_lib = lib.data # get the json of the lemma from db

                    for ls in lbs:
                        if json_lib['iri'] == ls['iri']:
                            json_lib['oldName'] = json_lib['name']
                            json_lib['name'] = ls['name']
                    
                    Library.objects.filter(pk=lib_pk).update(data=json_lib)
                    
                
                places = p.all()
                for place in places:
                    
                    place_pk = place.pk # id of the lemma
                    json_place = place.data # get the json of the lemma from db
                    # print(json_place)
                    for pl in pls:
                        if json_place['iri'] == pl['iri']:
                            json_place['oldName'] = json_place['name']
                            json_place['name'] = pl['name']
                            # print(json_place)
                    # lemma_output = {}
                    Place.objects.filter(pk=place_pk).update(data=json_place)
                    # ---------------------------------------------------------------------------------
                    # lemma_output['author'] = author_output_dict
                    # lemma_output['work'] = work_output_dict
                    # lemma_output['abstract'] = abstract
                    # lemma_output['review'] = review
                    # lemma_output['genres'] = genres_output_list
                    # lemma_output['places'] = toponyms_output_list
                    # lemma_output['manuscripts'] = manuscripts_output_list
                    # lemma_output['printEditions'] = print_editions_output_list

                    # l_json['id'] = pk
                    # l_json['lemma'] = lemma_output 
                    
                    # #Append the lemma only if exist at least a manuscript or a print edition
                    # if (manuscripts_output_list or print_editions_output_list) :
                    #     all_lemmas.append(l_json)
                    
                    # # print(json_lemma)
                    # #  Write notes to JSON file
                    # with open(opt_path, 'w') as note_file:
                    #     # note_file.write(l_json)
                    #     json.dump(all_lemmas, note_file)

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
