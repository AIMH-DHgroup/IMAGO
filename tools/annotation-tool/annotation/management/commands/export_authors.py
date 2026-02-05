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


# Base directory of Annotation app
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# JSON file paths
NOTE_PATH = os.path.join(BASE_DIR, 'json/exported_places.json')

WD_SPARQL_URL = 'http://query.wikidata.org/sparql?query='

p = Author.objects


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
            print('   Exporting authors...   ', end='')
            exported_note_count = 0
            
            try:
                # Notes to be exported
                # places = serializers.serialize('json', p.all()) # get all the lemmas in db
                authors = p.all()
                # for every place
                for author in authors:
                    # print(author.data)
                    l_json = {} # new empty dict for lemma
                    pk = author.pk # id of the lemma
                    author_iri = author.data['iri'] # get the json of the lemma from db
                    author_name = author.data['name']
                    author_alias = author.data['alias']
                    print(author_iri, author_name, author_alias, sep=";")
                    
                   
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
