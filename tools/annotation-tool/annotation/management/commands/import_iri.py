#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import sys
import json
import re
from django.core.management.base import BaseCommand
from annotation.models import Genre, Place, Library

# Base directory of Annotation app
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# JSON file paths
AREA_PATH = os.path.join(BASE_DIR, 'json/genres.json')
# AUTHOR_PATH = os.path.join(BASE_DIR, 'json/authors.json')
# SOURCE_PATH = os.path.join(BASE_DIR, 'json/sources.json')
# CHARACTER_PATH = os.path.join(BASE_DIR, 'json/characters.json')
PLACE_PATH = os.path.join(BASE_DIR, 'json/places.json')
LIBRARY_PATH = os.path.join(BASE_DIR, 'json/libraries.json')

# COMMENTARY_PATH = os.path.join(BASE_DIR, 'json/commentaries.json')


r = Genre.objects
p = Place.objects
l = Library.objects
# a = Author.objects
# s = Source.objects
# c = Character.objects
# p = Place.objects
# o = Commentary.objects

class Command(BaseCommand):
    help = 'Imports authors and sources into DB'

    # Define command-line options
    def add_arguments(self, parser):
        parser.add_argument('-r', '--areas', dest='area_path', help='import areas',
                            action='store_true', default=False)
        parser.add_argument('-p', '--places', dest='place_path', help='import places',
                            action='store_true', default=False)
        parser.add_argument('-l', '--libraries', dest='library_path', help='import libraries',
                            action='store_true', default=False)
        # parser.add_argument('-c', '--characters', dest='character_path', help='import character',
        #                     action='store_true', default=False)
        # parser.add_argument('-p', '--places', dest='place_path', help='import places',
        #                     action='store_true', default=False)
        # parser.add_argument('-o', '--commentaries', dest='commentary_path', help='import commentaries',
        #                     action='store_true', default=False)
        parser.add_argument('-d', '--dryrun', dest='dry_run', help='run without writing to DB',
                            action='store_true', default=False)

    def handle(self, *args, **options):
        # Get command-line options
        opt_areas = options.get('area_path')
        opt_places = options.get('place_path')
        opt_libraries = options.get('library_path')
        # opt_characters = options.get('character_path')
        # opt_places = options.get('place_path')
        # opt_commentaries = options.get('commentary_path')
        opt_dryrun = options.get('dry_run')

        # If no options are specified, import everything
        if not (opt_areas or opt_places or opt_libraries):
            opt_areas = True
            opt_places = True
            opt_libraries = True
            # opt_characters = True
            # opt_places = True
            # opt_commentaries = True

        errors = []

        try:
            print()

            # # Import commentaries
            # if opt_commentaries:
            #     o.all().delete()
            #     print('   Deleted all commentaries from DB\n')

            #     print('   Importing commentaries...   ', end='')
            #     new_commentary_count = 0
            #     old_commentary_count = 0

            #     try:
            #         # Load commentary from JSON file
            #         with open(COMMENTARY_PATH) as commentary_file:
            #             commentaries = json.load(commentary_file)

            #             # For each area in file (sorted alphabetically)
            #             for commentary in commentaries:

            #                 # Get area fields
            #                 comm_id = int(commentary['id'].strip())
            #                 iri = commentary['iri'].strip()
            #                 name = commentary['name'].strip()

            #                 # Check if area exists in DB
            #                 try:
            #                     o.get(data__iri=iri)
            #                 except Commentary.DoesNotExist:
            #                     commentary_json = {'id': comm_id, 'iri': iri, 'name': name}
            #                     new_commentary = Commentary(data=commentary_json)
            #                     if not opt_dryrun:
            #                         new_commentary.save()
            #                     new_commentary_count += 1
            #                 else:
            #                     old_commentary_count += 1
            #     except:
            #         raise

            #     duplicate_commentaries = f', {old_commentary_count} duplicates' if old_commentary_count else ''
            #     print(f'Added {new_commentary_count} commentaries{duplicate_commentaries}')

            # Import areas
            if opt_areas:
                r.all().delete()
                print('   Deleted all genres from DB\n')

                print('   Importing genres...   ', end='')
                new_area_count = 0
                old_area_count = 0

                try:
                    # Load areas from JSON file
                    with open(AREA_PATH) as area_file:
                        areas = json.load(area_file)

                        # For each area in file (sorted alphabetically)
                        for area in sorted(areas.values(), key=lambda x: x['name']):

                            # Get area fields
                            iri = area['iri'].strip()
                            name = area['name'].strip()

                            # print(name + " - " + iri)

                            # Check if area exists in DB
                            try:
                                r.get(data__iri=iri)
                            except Genre.DoesNotExist:
                                area_json = {'iri': iri, 'name': name}
                                new_area = Genre(data=area_json)
                                if not opt_dryrun:
                                    new_area.save()
                                new_area_count += 1
                            else:
                                old_area_count += 1
                except:
                    raise

                duplicate_areas = f', {old_area_count} duplicates' if old_area_count else ''
                print(f'Added {new_area_count} areas{duplicate_areas}')

            # Import authors
            # if opt_authors:
            #     a.all().delete()
            #     print('   Deleted all authors from DB\n')

            #     print('   Importing authors... ', end='')
            #     new_author_count = 0
            #     old_author_count = 0

            #     try:
            #         # Load authors from JSON file
            #         with open(AUTHOR_PATH) as author_file:
            #             authors = json.load(author_file)

            #             # For each author in file (sorted alphabetically)
            #             for author in sorted(authors.values(), key=lambda x: x['name']):

            #                 # Get author fields
            #                 iri = author['iri'].strip()
            #                 name = author['name'].strip()

            #                 # Check if author exists in DB
            #                 try:
            #                     a.get(data__iri=iri)
            #                 except Author.DoesNotExist:
            #                     author_json = {'iri': iri, 'name': name}
            #                     new_author = Author(data=author_json)
            #                     if not opt_dryrun:
            #                         new_author.save()
            #                     new_author_count += 1
            #                 else:
            #                     old_author_count += 1
            #     except:
            #         raise

            #     duplicate_authors = f', {old_author_count} duplicates' if old_author_count else ''
            #     print(f'Added {new_author_count} authors{duplicate_authors}')

            # # Import sources
            # if opt_sources:
            #     s.all().delete()
            #     print('   Deleted all sources from DB\n')

            #     print('   Importing sources... ', end='')
            #     new_source_count = 0
            #     old_source_count = 0

            #     try:
            #         # Load sources from JSON file
            #         with open(SOURCE_PATH) as source_file:
            #             sources = json.load(source_file)

            #             # For each source in file (sorted alphabetically)
            #             for source in sorted(sources.values(), key=lambda x: x['title']):

            #                 # Get source fields
            #                 iri = source['iri'].strip()
            #                 title = source['title'].strip()
            #                 author_name = source['author'].strip()
            #                 area_name = source['area'].strip()

            #                 # Check if source exists in DB
            #                 try:
            #                     old_source = s.get(data__iri=iri)
            #                 except Source.DoesNotExist:

            #                     # Check if author exists in DB
            #                     try:
            #                         area = r.get(data__name=area_name)
            #                         area_iri = area.data['iri']
            #                     except Area.DoesNotExist:
            #                         area_iri = None
            #                         # This is not needed since we don't use the area
            #                         # that is associated to each source
            #                         # errors.append(f'   Missing area: {area_name}')

            #                     # Check if area exists in DB
            #                     try:
            #                         author = a.get(data__name=author_name)
            #                         author_iri = author.data['iri']
            #                     except Author.DoesNotExist:
            #                         author_iri = None
            #                         errors.append(f'   Missing author: {author_name}')

            #                     source_json = {'iri': iri, 'title': title, 'area': area_iri, 'author': author_iri}
            #                     new_source = Source(data=source_json)
            #                     if not opt_dryrun:
            #                         new_source.save()
            #                     new_source_count += 1
            #                 else:
            #                     old_source_count += 1
            #     except:
            #         raise

            #     duplicate_sources = f', {old_source_count} duplicates' if old_source_count else ''
            #     print(f'Added {new_source_count} sources{duplicate_sources}')

        # Import places
            if opt_places:
                p.all().delete()
                print('   Deleted all places from DB\n')

                print('   Importing places... ', end='')
                new_place_count = 0
                old_place_count = 0

                try:
                    # Load places from JSON file
                    with open(PLACE_PATH) as place_file:
                        places = json.load(place_file)

                        # For each author in file (sorted alphabetically)
                        for place in sorted(places.values(), key=lambda x: x['name']):

                            # Get author fields
                            iri = place['iri'].strip()
                            name = place['name'].strip()
                            alias = place['alias']
                            country = place['country'].strip()
                            coord = place['coord'].strip()
                            if coord:
                                res = re.findall(r'\(.*?\)', coord)
                                coord = res[0].split()
                                lat = coord[1][:-1]
                                lon = coord[0][1:]
                            else:
                                lat = ""
                                lon = ""
                            # Check if author exists in DB
                            try:
                                p.get(data__iri=iri)
                            except Place.DoesNotExist:
                                place_json = {'iri': iri, 'name': name, 'alias': alias, 'country': country, 'lat': lat, 'lon': lon}
                                new_place = Place(data=place_json)
                                if not opt_dryrun:
                                    new_place.save()
                                new_place_count += 1
                            else:
                                old_place_count += 1
                except:
                    raise

                duplicate_places = f', {old_place_count} duplicates' if old_place_count else ''
                print(f'Added {new_place_count} places{duplicate_places}')

        # Import libraries
            if opt_libraries:
                l.all().delete()
                print('   Deleted all libraries from DB\n')

                print('   Importing libraries... ', end='')
                new_library_count = 0
                old_library_count = 0

                try:
                    # Load libraries from JSON file
                    with open(LIBRARY_PATH) as library_file:
                        libraries = json.load(library_file)

                        # For each source in file (sorted alphabetically)
                        for library in sorted(libraries.values(), key=lambda x: x['label']):


                            # {"Aachen Bischöfliches Diözesanarchiv":
                            # {"name": "Aachen Bischöfliches Diözesanarchiv",
                            # "iri": "http://www.wikidata.org/entity/Q28734976",
                            # "label": "Bischöfliches Diözesanarchiv Aachen",
                            # "coord": "Point(6.079444 50.774824)",
                            # "country": "http://www.wikidata.org/entity/Q183",
                            # "gpe": "http://www.wikidata.org/entity/Q1017"},
                            # Get library fields
                            iri = library['iri'].strip()
                            name = library['label'].strip()
                            place = library['gpe'].strip()
                            country = library['country'].strip()
                            coord = library['coord'].strip()
                            if coord:
                                res = re.findall(r'\(.*?\)', coord)
                                coord = res[0].split()
                                lat = coord[1][:-1]
                                lon = coord[0][1:]
                            # print(place)
                            # print(coord[0][1:]) #longitude
                            # print(coord[1][:-1]) #latitude

                            # Check if source exists in DB
                            try:
                                old_library = l.get(data__iri=iri)
                            except Library.DoesNotExist:

                                # # Check if author exists in DB
                                # try:
                                #     area = r.get(data__name=area_name)
                                #     area_iri = area.data['iri']
                                # except Area.DoesNotExist:
                                #     area_iri = None
                                #     # This is not needed since we don't use the area
                                #     # that is associated to each source
                                #     # errors.append(f'   Missing area: {area_name}')

                                # # Check if area exists in DB
                                # try:
                                #     place = p.get(data__iri=place)
                                #     author_iri = author.data['iri']
                                # except Author.DoesNotExist:
                                #     author_iri = None
                                #     errors.append(f'   Missing author: {author_name}')

                                library_json = {'iri': iri, 'name': name, 'place': place}
                                new_library = Library(data=library_json)
                                if not opt_dryrun:
                                    new_library.save()
                                new_library_count += 1
                            else:
                                old_library_count += 1
                except:
                    raise

                duplicate_libraries = f', {old_library_count} duplicates' if old_library_count else ''
                print(f'Added {new_library_count} libraries{duplicate_libraries}')

            # Import characters
            # if opt_characters:
            #     c.all().delete()
            #     print('   Deleted all characters from DB\n')

            #     print('   Importing characters... ', end='')
            #     new_character_count = 0
            #     old_character_count = 0

            #     try:
            #         # Load characters from JSON file
            #         with open(CHARACTER_PATH) as character_file:
            #             characters = json.load(character_file)

            #             # For each character in file (sorted alphabetically)
            #             for character in characters:

            #                 # Get character fields
            #                 iri = character['iri'].strip()
            #                 name = character['name'].strip()

            #                 # Check if character exists in DB
            #                 try:
            #                     old_character = c.get(data__iri=iri)
            #                 except Character.DoesNotExist:
            #                     character_json = {'iri': iri, 'name': name}
            #                     new_character = Character(data=character_json)
            #                     if not opt_dryrun:
            #                         new_character.save()
            #                     new_character_count += 1
            #                 else:
            #                     old_character_count += 1
            #     except:
            #         raise

            #     duplicate_characters = f', {old_character_count} duplicates' if old_character_count else ''
            #     print(f'Added {new_character_count} characters{duplicate_characters}')

            # # Import places
            # if opt_places:
            #     p.all().delete()
            #     print('   Deleted all places from DB\n')

            #     print('   Importing places... ', end='')
            #     new_place_count = 0
            #     old_place_count = 0

            #     try:
            #         # Load places from JSON file
            #         with open(PLACE_PATH) as place_file:
            #             places = json.load(place_file)

            #             # For each place in file (sorted alphabetically)
            #             for place in places:

            #                 # Get place fields
            #                 iri = place['iri'].strip()
            #                 name = place['name'].strip()

            #                 # Check if place exists in DB
            #                 try:
            #                     old_place = p.get(data__iri=iri)
            #                 except Place.DoesNotExist:
            #                     place_json = {'iri': iri, 'name': name}
            #                     new_place = Place(data=place_json)
            #                     if not opt_dryrun:
            #                         new_place.save()
            #                     new_place_count += 1
            #                 else:
            #                     old_place_count += 1
            #     except:
            #         raise

            #     duplicate_places = f', {old_place_count} duplicates' if old_place_count else ''
            #     print(f'Added {new_place_count} places{duplicate_places}')
            # print()

            if errors:
                print('\n'.join(errors))
                print()

        # Exit gracefully in case of keyboard interrupt
        except KeyboardInterrupt:
            print('\n')
            sys.exit()
