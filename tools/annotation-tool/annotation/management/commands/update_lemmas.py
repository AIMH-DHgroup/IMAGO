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
                    

                    print_editions_list = json_lemma['lemma']['edizioniStampa']
                    print_editions_output_list = []
                    for print_edition in print_editions_list:
                       
                        ecdotica = print_edition['ecdotica']
                        if ecdotica == "EDIZIONE CRITICA":
                            new_ecdotica = "EDIZIONE CRITICA"
                        elif ecdotica == "EDIZIONE CRITICA DIPLOMATICA":
                            new_ecdotica = "EDIZIONE DIPLOMATICA"
                        elif ecdotica == "EDIZIONE CRITICA COMMENTATA":
                            new_ecdotica = "EDIZIONE CRITICA COMMENTATA"
                        elif ecdotica == "EDIZIONE CRITICA COMMENTATA CON TRADUZIONE":
                            new_ecdotica = "EDIZIONE CRITICA COMMENTATA CON TRADUZIONE"
                        elif ecdotica == "EDIZIONE CRITICA SEMI-DIPLOMATICA O INTERPRETATIVA":
                            new_ecdotica = "EDIZIONE SEMI-DIPLOMATICA O INTERPRETATIVA"
                        elif ecdotica == "EDIZIONE CRITICA CON TRADUZIONE":
                            new_ecdotica = "EDIZIONE CRITICA CON TRADUZIONE"
                        # print(ecdotica, new_ecdotica)
                        print_edition['ecdotica'] = new_ecdotica
                        
                        edizione = print_edition['edizione']
                        if edizione == "PRIMA EDIZIONE":
                            print_edition['edizione'] = "PRIMA EDIZIONE / EDITIO PRINCEPS"
                        
                        print_editions_output_list.append(print_edition)
                    
                    json_lemma['edizioniStampa'] = print_editions_output_list
                    # print(json_lemma)
                    Lemma.objects.filter(pk=lemma_pk).update(data=json_lemma)
                    # print(print_editions_output_list)
                  

                    # lemma_output = {}

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
