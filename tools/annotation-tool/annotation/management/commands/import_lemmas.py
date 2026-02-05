#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""Import notes

This file allows to import json notes into db.

Project: HDN
Package: Backend
Title: Import notes
File: import_notes.py
Path: annotation/management/commands
Type: python
Started: 2020-04-26
Author(s): Daniele Metilli & Nicolo' Pratelli
State: in use

Version history.

    * 2020-04-26 Daniele Metilli
      First version
    * 2020-09-22 Nicolo' Pratelli
      Installed and imported glob library
      Read all json files and print content to terminal

This file is part of software developed by the Digital Libraries group
of NeMIS Laboratory, Institute of Information Science and Technologies
(ISTI-CNR), Pisa, Italy, for the IMAGO and HDN projects.
Further information at: https://hdn.dantenetwork.it
Copyright (C) 2020 ISTI-CNR, Nicolo' Pratelli & Daniele Metilli

This is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published
by the Free Software Foundation; either version 3.0 of the License,
or (at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty
of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program; if not, see <http://www.gnu.org/licenses/>.

"""

import os
import sys
import json
import glob
import time
import random
import re
from django.core import serializers
from django.utils.text import slugify
from django.core.management.base import BaseCommand
from annotation.models import Lemma, Author, Work
from django.contrib.auth.models import User
from annotation.services import *

# Base directory of Annotation app
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# JSON file paths
WORK_PATH = os.path.join(BASE_DIR, 'json/aggiunte_opere_20240220.json') #'json/outputWorksNew.json'
AUTHOR_PATH = os.path.join(BASE_DIR, 'json/aggiunte_autori_20240220.json') #'json/outputAuthorsFinalDate.json'
IMAGO_BASE_IRI = 'https://imagoarchive.it/resource/'

michela_test = []# ['http://www.mirabileweb.it/title/rerum-suo-tempore-gestarum-commentaria-leonardus-b-title/4179','http://www.mirabileweb.it/title/de-situ-iapygiae-title/13073','http://www.mirabileweb.it/title/descriptio-marchiae-anconitanae-title/172871']


l = Lemma.objects
a = Author.objects
w = Work.objects

class Command(BaseCommand):
    """[summary]

    [extended_summary]

    :param BaseCommand: [description]
    :type BaseCommand: [type]
    """
    help = 'Imports notes into DB'

    # Define command-line options
    def add_arguments(self, parser):
        parser.add_argument('-p', '--path', dest='path', help='import notes from this path',
                            default=WORK_PATH)
        parser.add_argument('-d', '--dryrun', dest='dry_run', help='run without writing to DB',
                            action='store_true', default=False)
        parser.add_argument('-o', '--overwrite', dest='overwrite', help='overwrite duplicate notes',
                            action='store_true', default=False)
        parser.add_argument('-x', '--delete', dest='delete', help='delete all notes from DB',
                            action='store_true', default=False)

    def handle(self, *args, **options):
        # Get command-line options
        opt_path = options.get('path')
        opt_dryrun = options.get('dry_run')
        opt_over = options.get('overwrite')
        opt_delete = options.get('delete')

        errors = []
        
         # Delete existing notes
        if opt_delete:
            l.all().delete()
            print('   Deleted all notes from DB')
        

        # a.all().delete()
        # print('   Deleted all authors from DB\n')

        print('   Importing authors... ', end='')
        new_author_count = 0
        old_author_count = 0

        try:
            # Load authors from JSON file
            with open(AUTHOR_PATH) as author_file:
                authors = json.load(author_file)
                # for author in authors:
                #     print(author)
                #     print(authors[author])

                # For each author in file (sorted alphabetically)
                # for author in authors:
                for author in sorted(authors.values(), key=lambda x: x['name']):

                    # Get author fields
                    name = author['name'].strip()
                    # name = author.title()
                    alias = author['alias']
                    datazione = author['datazione']
                    string_datazione = toStringDatazione(datazione)
                    try:
                        iri = author['irim'].strip()
                    except:
                        try:
                            iri = author['iri'].strip()
                        except:
                            iri = f'{IMAGO_BASE_IRI}{slugify(name)}'
                    # name = author['name'].strip()

                    # Check if author exists in DB
                    try:
                        a.get(data__iri=iri)
                    except Author.DoesNotExist:
                        author_json = {'iri': iri, 'name': name, 'alias': alias, 'datazione': datazione, 'stringDatazione': string_datazione}
                        new_author = Author(data=author_json)
                        if not opt_dryrun:
                            new_author.save()
                        new_author_count += 1
                    else:
                        old_author_count += 1
        except:
            raise

        duplicate_authors = f', {old_author_count} duplicates' if old_author_count else ''
        print(f'Added {new_author_count} authors{duplicate_authors}')

        # w.all().delete()
        # print('   Deleted all works from DB\n')

        print('   Importing works... ', end='')
        new_work_count = 0
        old_work_count = 0
        
        try:
            # Load sources from JSON file
            with open(WORK_PATH) as work_file:
                works = json.load(work_file)

                # For each source in file (sorted alphabetically)
                for work in sorted(works.values(), key=lambda x: x['title']):

                    # Get source fields
                    title = work['title'].strip()
                    author_name = work['author'].strip()
                    work_alias = work['alias']
                    # author_name = author_name.title()
                    iri_to_slugify = author_name + title
                    try:
                        iri = work['irim'].strip()
                    except:
                        try:
                            iri = work['iri'].strip()
                        except:
                            iri = f'{IMAGO_BASE_IRI}{slugify(iri_to_slugify)}'
                    

                    # Check if work exists in DB
                    try:
                        old_work = w.get(data__iri=iri)
                    except Work.DoesNotExist:

                        # Check if author exists in DB
                        try:
                            author = a.get(data__name=author_name)
                            author_iri = author.data['iri']
                            # if author_name == "<OPUS SINE AUCTORE>".title():
                            #     author_name = "OPUS SINE AUCTORE".title()
                            #     author = a.get(data__name=author_name)
                            #     author_iri = author.data['iri']
                            #     # print(author_iri)

                            # else:
                            #     if author_name.find('<*Auctor Incertus>') != -1:
                            #         result = author_name.find('<*Auctor Incertus>')
                            #         author = a.get(data__name=author_name[0:result-1])
                            #         author_iri = author.data['iri']
                            #     else:
                            #         if author_name == "IOHANNES DE PERUSIO".title():
                            #             author_name = "IOHANNES FEDANZOLA PERUSINUS".title()
                                    
                            #         author = a.get(data__name=author_name)
                                
                            author_iri = author.data['iri']
                                
                                # try:
                                #     author_iri = author.data['irim']
                                # except:
                                #     try:
                                #         author_iri = author.data['iri']
                                #     except:
                                #         author_iri = f'{IMAGO_BASE_IRI}{slugify(author_name)}'
                        except Author.DoesNotExist:
                            author_iri = None
                            print("Missing author:")
                            print(author_name)
                            errors.append(f'   Missing author: {author_name}')

                        work_json = {'iri': iri, 'title': title, 'alias': work_alias, 'author': author_iri}
                        new_work = Work(data=work_json)
                        if not opt_dryrun:
                            new_work.save()
                        new_work_count += 1
                    else:
                        # print(old_work.data)
                        old_work_count += 1
        except:
            raise

        duplicate_works = f', {old_work_count} duplicates' if old_work_count else ''
        print(f'Added {new_work_count} works{duplicate_works}')

        # l.all().delete()
        # print('   Deleted all lemmas from DB')

        print('   Importing lemmas... ', end='')
        new_lemma_count = 0
        old_lemma_count = 0
        # users = ["prate"]
        
        try:
            # Load sources from JSON file
            with open(WORK_PATH) as work_file:
                lemmas = json.load(work_file)

                # For each source in file (sorted alphabetically)
                for lemma in sorted(lemmas.values(), key=lambda x: x['title']):

                    # Get source fields
                    # iri = lemma['iri'].strip()
                    title = lemma['title'].strip()
                    author_name = lemma['author'].strip()
                    try:
                        owner = lemma['owner']
                    except:
                        owner = "prate"
                    
                    iri_to_slugify = author_name + title
                    # author_name = author_name.title()
                    try:
                        iri = lemma['irim'].strip()
                    except:
                        try:
                            iri = lemma['iri'].strip()
                        except:
                            iri = f'{IMAGO_BASE_IRI}{slugify(iri_to_slugify)}'
                    
                    # print(iri)

                    try:
                        author = a.get(data__name=author_name)
                        author_iri = author.data['iri']
                            
                    except Author.DoesNotExist:
                        author_iri = None
                        print(author_name)
                        errors.append(f'   Missing author: {author_name}')
                    
                    # print(author_iri)

                    # Check if source exists in DB
                    try:
                        old_lemma = l.get(data__lemma__opera=iri, data__lemma__autore=author_iri)
                        # print(old_lemma)
                    except Lemma.DoesNotExist:

                        # Check if work exists in DB
                        try:
                            work_iri = w.get(data__iri=iri)
                        except Work.DoesNotExist:
                            work_iri = None
                            # This is not needed since we don't use the area
                            # that is associated to each source
                            # errors.append(f'   Missing area: {area_name}')

                        # Check if area exists in DB
                        
                        try:
                            author = a.get(data__name=author_name)
                            author_iri = author.data['iri']
                            # if author_name == "<OPUS SINE AUCTORE>".title():
                            #     author_name = "OPUS SINE AUCTORE".title()
                            #     author = a.get(data__name=author_name)
                            #     author_iri = author.data['iri']
                            #     # print(author_iri)

                            # else:
                            #     if author_name.find('<*Auctor Incertus>') != -1:
                            #         result = author_name.find('<*Auctor Incertus>')
                            #         author = a.get(data__name=author_name[0:result-1])
                            #         author_iri = author.data['iri']
                            #     else:
                            #         if author_name == "IOHANNES DE PERUSIO".title():
                            #             author_name = "IOHANNES FEDANZOLA PERUSINUS".title()
                                    
                            #         author = a.get(data__name=author_name)
                                
                            # author_iri = author.data['iri']

                            
                                
                                # try:
                                #     author_iri = author.data['irim']
                                # except:
                                #     try:
                                #         author_iri = author.data['iri']
                                #     except:
                                #         author_iri = f'{IMAGO_BASE_IRI}{slugify(author_name)}'
                        except Author.DoesNotExist:
                            author_iri = None
                            print(author_name)
                            errors.append(f'   Missing author: {author_name}')

                        # print(author_iri + "-------------------------------")
                        # source_json = {'iri': iri, 'title': title, 'area': area_iri, 'author': author_iri}
                        # owner = random.choice(users)
                    
                        # if iri in michela_test:
                            # owner = 'michela'
                        
                        lemma_json ={"lemma" : {"autore": author_iri, "opera": iri, "owner": owner, "manoscritti": [], "edizioniStampa": [], "generi": [], "toponimi": []}}
                        # print(lemma_json)
                        new_lemma = Lemma(data=lemma_json)
                        if not opt_dryrun:
                            new_lemma.save()
                        new_lemma_count += 1
                    else:
                        # print(old_lemma.data)
                        old_lemma_count += 1
        except:
            raise

        duplicate_lemmas = f', {old_lemma_count} duplicates' if old_lemma_count else ''
        print(f'Added {new_lemma_count} lemmas{duplicate_lemmas}')

        # total_notes = 0
        # for f in sorted(files):

        #     f_path = f.split("/")
        #     f_name = f_path[-1]

        #     try:
        #         print()

        #         # Import notes
        #         print('   Importing ' + f_name + ' notes...   ', end='')
        #         new_note_count = 0
        #         old_note_count = 0
                
                
                
        #         try:
        #             # Load notes from JSON file
                    
        #             with open(f) as note_file:

        #                 print()
                        
        #                 json_file = note_file.read()
        #                 # json_data = json.dumps(json_file)
        #                 data = json.loads(json_file)
        #                 number_of_note = 1
        #                 old_canto = 0
        #                 prev_line = ""
        #                 for note in data:
        #                     canto = note["Nota"]["OperaDante"]["Canto"]
        #                     if old_canto==0:
        #                         old_canto = canto
        #                     if old_canto != canto:
        #                         number_of_note = 1
        #                         old_canto = canto
        #                         prev_line = ""
        #                     # print(note)
        #                     cantica = SwitcherCantica()
        #                     cantica_number = cantica.cantica_to_number(note["Nota"]["OperaDante"]["Cantica"])
        #                     # print(cantica_number)
        #                     canto = note["Nota"]["OperaDante"]["Canto"]
        #                     if canto.isnumeric():
        #                         format_canto = canto #"{0:0=2d}".format(canto)
        #                         # print(format_canto)
        #                         format_number_of_note = "{0:0=4d}".format(number_of_note*10)
        #                         # print(format_number_of_note)


                                
        #                         if(re.search("\d+\s?-\s?\d+|\d+", note["Nota"]["OperaDante"]["Verso"])):
        #                             prev_line = note["Nota"]["OperaDante"]["Verso"]
        #                         else:
        #                             if(prev_line == ""):
        #                                 note["Nota"]["OperaDante"]["Verso"] = note["Nota"]["OperaDante"]["Verso"]
        #                             else:
        #                                 note["Nota"]["OperaDante"]["Verso"] = prev_line
                                
        #                         note["Nota"]["Citazioni"] = []


        #                         dante_fragment = note["Nota"]["FrammentoDante"]

                                

        #                         note["Nota"]["FrammentoDanteDDP"] = dante_fragment
        #                         note["Nota"]["FrammentoDante"] = ""

        #                         commentary = note["Nota"]["Commento"]
                                
        #                         try:
        #                             comm = c.get(data__name=commentary)
        #                         except Commentary.DoesNotExist:
        #                             print(commentary)
                                

        #                         note_id = int(str(comm.data['id']) + str(cantica_number) + str(format_canto) + str(format_number_of_note))
        #                         # print(note_id)

        #                         note["Stato"] = "to-do"
        #                         note["LastMod"] = last_mod
                            
        #                         note["owner"] = owner
        #                         note["reviewer"] = owner
        #                         user = u.get(username=owner)                               


        #                         body_nota = note["Nota"]["BodyNota"]

        #                         if comm.data['name'] == "Torquato Tasso 1555-68":
        #                             if(re.search("\s?Celani\)", dante_fragment )):
        #                                 body_nota = "<b>(ed." + dante_fragment + "</b> " + body_nota
        #                                 note["Nota"]["BodyNota"] = body_nota
        #                                 dante_fragment = ""
        #                                 note["Nota"]["FrammentoDanteDDP"] = dante_fragment
                               
        #                         body_nota = re.sub('^[,.:]?\s+-?-?\s?', '', body_nota)
        #                         body_nota = re.sub('^ec\.[,;:]?', '', body_nota)

        #                         #&laquo;
        #                         # body_nota = re.sub('<(?![i\\b\/])', '&laquo;', body_nota)
        #                         body_nota = re.sub('<(?=\s?\w\w)', '&laquo;', body_nota)

        #                         # #&raquo;
        #                         # body_nota = re.sub('>(?<![ib])', '&raquo;', body_nota) problema con le citazioni che si concludono con punteggiatura
        #                         # body_nota = re.sub('>(?<=\w\w)', '&raquo;', body_nota)
        #                         body_nota = re.sub('(?<=\w[\.,;!\)\?\w])>', '&raquo;', body_nota)

        #                         # &mdash;
        #                         body_nota = re.sub('--', '&mdash;', body_nota)

        #                         # sup
        #                         sup_regex = re.compile('\+[^~]+~') 
        #                         while(sup_regex.search(body_nota) is not None):
        #                             sup = sup_regex.search(body_nota) 
        #                             sup_text = sup.group(0)
        #                             sup_tag = "<sup>"+sup_text[1:-1]+"</sup>"
        #                             body_nota = body_nota[:sup.start()] +sup_tag+ body_nota[sup.end():]
                                    
                                    
                               
        #                         # print(body_nota)
                                

        #                         note["Nota"]["BodyNota"] = body_nota


        #                         # note["Nota"]["BodyNotaDDP"] = body_nota
        #                         # note["Nota"]["BodyNota"] = ""

        #                         # print(comm.data)

        #                         commentaryDict = {}
        #                         commentaryDict["Id"] = int(comm.data['id'])
        #                         commentaryDict["IRI"] = comm.data['iri']#str(id_commentary)
        #                         commentaryDict["Nome"] = comm.data['name'] #commentary
                                        
                                

        #                         note["Nota"]["Commento"] = commentaryDict

        #                         try:
        #                             o.get(commentary=comm.data['name'], owner=user)
        #                         except Owner.DoesNotExist:
        #                             new_owner = Owner(commentary=comm.data['name'], owner=user)
        #                             if not opt_dryrun:
        #                                 new_owner.save()


        #                         # For each note in file
        #                         # for note in serializers.deserialize("json", json_load):
        #                         #     print(note)
        #                         # Check if commentary exists in DB
        #                         # try:
        #                         #     c.get(data__name=comm.data['name'])
        #                         # except Commentary.DoesNotExist:
        #                         #     commentary_json = {'id': comm_id, 'iri': iri, 'name': name}
        #                         #     new_commentary = Commentary(data=commentary_json)
        #                         #     if not opt_dryrun:
        #                         #         new_commentary.save()
        #                         #     new_commentary_count += 1
        #                         # else:
        #                         #     old_commentary_count += 1
                            
        #                         # Check if note exists in DB
        #                         try:
        #                             a.get(pk=note_id)
        #                         except Annotation.DoesNotExist:
        #                             if not opt_dryrun:
        #                                 # note.object.save()
        #                                 a.create(id=note_id, data=note)
        #                             new_note_count += 1
        #                         else:
        #                             if opt_over and not opt_dryrun:
        #                                 # note.object.save()
        #                                 a.create(id=note_id, data=note)
        #                                 new_note_count += 1
        #                             old_note_count += 1
        #                         number_of_note = number_of_note + 1
        #                     else:
        #                         print("Excluded note")
                            
        #         except:
        #             raise
                
        #         total_notes = total_notes + new_note_count 
        #         duplicate_notes = f', {old_note_count} duplicates' if old_note_count else ''
        #         print(f'Added {new_note_count} notes{duplicate_notes}')
        #         print()

        #         print(f'Added {new_commentary_count} commentaries')
        #         print()

        #         if errors:
        #             print('\n'.join(errors))
        #             print()

        #     # Exit gracefully in case of keyboard interrupt
        #     except KeyboardInterrupt:
        #         print('\n')
        #         sys.exit()
                
        # print(f'Added {total_notes} notes')