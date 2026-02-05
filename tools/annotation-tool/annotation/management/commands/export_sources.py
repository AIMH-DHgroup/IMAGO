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

s = Source.objects


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
                sources = s.all()
                # for every place
                # output_string = '<table class="table"><thead><tr><th scope="col">#</th><th scope="col">Abbreviazione</th><th scope="col">Nome completo</th></tr></thead><tbody>'
                output_string = '<ol class="list-group">'
                count=1
                for source in sources:
                    # print(source.data)
                    l_json = {} # new empty dict for lemma
                    pk = source.pk # id of the lemma
                    source_iri = source.data['iri'] # get the json of the lemma from db
                    source_name = source.data['name']
                    source_description = source.data['description']
                    sid = source_iri.split('#')[1]

                    output_string = output_string + '<li id="'+sid+'" name="'+sid+'" class="list-group-item"><strong>'+source_name+'</strong> <br /> <span>'+source_description+'</span></li>'
                    count=count+1
                    
                output_string = output_string + '</ol>'
                    
                print(output_string)
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

            print(f'Exported {s.all().count()} sources')
            print()

            if errors:
                print('\n'.join(errors))
                print()

        # Exit gracefully in case of keyboard interrupt
        except KeyboardInterrupt:
            print('\n')
            sys.exit()
