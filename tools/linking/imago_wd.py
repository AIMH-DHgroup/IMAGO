#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import csv
import json
import gzip
import time
import argparse
import urllib.parse
import urllib.request

# TODO: use argparse to activate options from command line
# parser = argparse.ArgumentParser(description='Match authors and sources')
# parser.add_argument('-i', '--import', action='store_true')
# parser.add_argument('-a', '--authors', action='store_true')
# parser.add_argument('-s', '--sources', action='store_true')
# args = parser.parse_args()

# Activate import from TSV
# if set to True: load TSV and create new JSON files
# if set to False: load existing JSON files
IMPORT_FROM_TSV = False

# Activate author or source search
SEARCH_WD_AUTHORS = True
SEARCH_WD_SOURCES = True

# Base path
BASE_PATH = os.path.dirname(os.path.realpath(__file__))

# Paths to input and output files
TSV_FILE = 'imago.tsv'
AUTHOR_FILE = f'{BASE_PATH}/authors.json'
SOURCE_FILE = f'{BASE_PATH}/sources.json'

# Wikidata query URL
WD_URL = 'https://query.wikidata.org/sparql?query='

# Function to make text red
def red(string):
    return '\x1b[91m{}\x1b[0m'.format(string) if os.isatty(sys.stdout.fileno()) else string

# Function to make text yellow
def yellow(string):
    return '\x1b[93m{}\x1b[0m'.format(string) if os.isatty(sys.stdout.fileno()) else string

# Function to make text green
def green(string):
    return '\x1b[92m{}\x1b[0m'.format(string) if os.isatty(sys.stdout.fileno()) else string

# Function to make text pink
def pink(string):
    return '\x1b[95m{}\x1b[0m'.format(string) if os.isatty(sys.stdout.fileno()) else string

# Function to make text blue
def blue(string):
    return '\x1b[96m{}\x1b[0m'.format(string) if os.isatty(sys.stdout.fileno()) else string

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
def wdQuery(name, type):

    # Define graph pattern for labels
    wdLabels = [f'{{ ?item rdfs:label "{name}"@{lang}. }}' for lang in ('it', 'la', 'en', 'fr', 'es', 'de')]

    # Define graph pattern for aliases
    wdAliases = [f'{{ ?item skos:altLabel "{name}"@{lang}. }}' for lang in ('it', 'la', 'en', 'fr', 'es', 'de')]

    # This triple filters by entity type (class)
    # ?item wdt:P31 wd:" + type + " .\

    # Define SPARQL query
    wdQuery = f'\nSELECT distinct ?item ?itemLabel ?itemDescription\
                WHERE {{\
                {" UNION ".join(wdLabels + wdAliases)}\
                SERVICE wikibase:label {{ bd:serviceParam wikibase:language "[AUTO_LANGUAGE],it,la,en,fr,es,de". }}\
                }}'

    # Load query URL
    results = loadURL(f'{WD_URL}{urllib.parse.quote(wdQuery)}&format=json')

    # Return results
    if results:
        return json.loads(results)['results']['bindings']
    else:
        print(red(f'   Not found: {iri}'))
    return None

# Function to ask user to confirm
def askUser(qid, message=green('Confirm?')):
    reply = input(f'\a   >>> {message} ')
    print()

    # Y to confirm
    if qid and reply in ('y', 'Y'):
        return qid

    # S to skip to next author/source
    elif reply in ('s', 'S'):
        return 'BREAK'

    # Manual insertion of Wikidata ID
    elif reply.startswith('Q'):
        return reply
    return None

# Interactive Wikidata search
def wikiInteractive(name, wdEntities, extra=''):
    extraString = f' • {extra}' if extra else ''
    print(yellow(f'   {name}{extraString.title()}\n'))
    printed = False

    # For each entity that was found...
    for entity in wdEntities:
        printed = True

        # Get the entity IRI
        wdIRI = entity["item"]["value"]

        # Get the Wikidata ID
        qid = wdIRI.split('/')[-1]

        # Get the entity label
        label = entity["itemLabel"]["value"]

        # Get the entity description
        desc = entity["itemDescription"]["value"] if "itemDescription" in entity else 'NONE'

        # Print entity data
        print(f'   {qid} • {label} • {desc}\n')

        # Ask user to confirm
        try:
            newQid = askUser(qid)
        except KeyboardInterrupt:
            print('\n')
            sys.exit()

        # Return Wikidata IRI
        if newQid:
            if newQid == qid:
                return wdIRI
            else:
                return f'http://www.wikidata.org/entity/{newQid}'
            break

    # Allow user to manually insert ID
    if not printed:
        print(f'   • No matches found\n')

        try:
            newQid = askUser(None, message=green('Insert ID:'))
        except KeyboardInterrupt:
            print('\n')
            sys.exit()

        # TODO: handle malformed IDs
        if newQid:
            return f'http://www.wikidata.org/entity/{newQid}'

    return None

print()

print(pink('   === Instructions ==='))
print('   • Press ' + yellow('return') + ' to go on')
print('   • Press ' + yellow('y') + ' to confirm')
print('   • Press ' + yellow('s') + ' to skip to next author/source')
print('   • Insert a ' + yellow('Wikidata ID') + ' (e.g. Q1067) to add it manually')
print()

# Read TSV file and extract author/source names
if IMPORT_FROM_TSV:
    authors = {}
    sources = {}

    print(pink('   === Import from TSV ==='))

    # Read TSV file
    with open(TSV_FILE) as f:
        tsv = csv.reader(f, delimiter='\t')

        # For each row of the TSV...
        for i, row in enumerate(tsv):
            author = {}

            # Split the author name
            name_parts = row[0].split(',')
            part_aliases = []
            name_parts_new = []

            # For each part of the name...
            for part in name_parts:

                # Get the aliases - TODO: Fix the bugs!
                part_split = part.split('[')
                name_parts_new.append(part_split[0].strip())
                if len(part_split) > 1:
                    part_aliases.append(part_split[0].strip(" []"))
            if part_aliases:
                part_aliases.append(name_parts[-1].strip())

            # Set the main name
            name = ', '.join(name_parts_new)
            author['name'] = name

            # Look for more aliases
            try:
                more_aliases = [x.strip(' <>') for x in row[1].split(';')]
            except:
                print(row)

            # Save the aliases
            author['alias'] = ([', '.join(part_aliases)] if part_aliases else []) + (more_aliases or [])

            # Add the author to the dictionary
            authors[name] = author

            # Get the source title
            source = {}
            try:
                title = row[2].split('(')[0]
            except:
                print(row)

            # Save the source title, aliases, and authors
            source['title'] = title
            source['alias'] = [x.strip(' ()') for x in row[2].split('(')[1:]]
            source['author'] = name

            # Fix the title to avoid duplicates
            fixed_title = f'{title} ({name})'

            # Add the source to the dictionary
            sources[fixed_title] = source

            # Save authors to JSON (will overwrite!)
            # TODO: merge JSON instead of overwriting
            with open(AUTHOR_FILE, 'w') as f:
                json.dump(authors, f)

            # Save sources to JSON (will overwrite!)
            # TODO: merge JSON instead of overwriting
            with open(SOURCE_FILE, 'w') as f:
                json.dump(sources, f)

            # Print and wait one second (for debug)
            #print(f'Author: {author["name"]}')
            #print(f'Aliases: {author["alias"]}')
            #print(f'Source: {source["title"]}')
            #print(f'Aliases: {source["alias"]}')
            #print()
            #time.sleep(1)

    print(f'   Imported authors:   {len(authors.keys())}')
    print(f'   Imported sources:   {len(sources.keys())}')
    print()
else:
    # Load JSON file of authors
    try:
        with open(AUTHOR_FILE) as f:
            authors = json.load(f)
    except FileNotFoundError:
        authors = {}

    # Load JSON file of sources
    try:
        with open(SOURCE_FILE) as g:
            sources = json.load(g)
    except FileNotFoundError:
        sources = {}

# Function to make a Wikidata query for authors
def make_author_query(name):
    name = name.split('(')[0].strip()
    wdEntities = wdQuery(name, 'Q5')
    wdIRI = wikiInteractive(name, wdEntities)
    return wdIRI

# Search Wikidata for authors
if SEARCH_WD_AUTHORS and len(authors.keys()) > 0:

    print(pink('   === Author search ===\n'))

    # For each author...
    for author in authors.values():

        # If author has no IRI...
        if 'iri' not in author:

            # Get author name in titlecase
            names = [author['name'].title()]

            # Get all aliases too
            all_names = [x.title() for x in (names + author['alias']) if len(x) > 2]
            final_names = all_names.copy()

            # For each name...
            for name in all_names:

                # Split long names
                split_name = name.split()
                if len(split_name) > 2:
                    split_list = []
                    for split in split_name:
                        if len(split) < 4:
                            split_list.append(split.lower())
                        else:
                            split_list.append(split)
                    final_names.append(' '.join(split_list).strip())

            # For each name...
            for name in set(final_names):

                # Reverse names with comma
                if ',' in name:
                    try:
                        name = ' '.join(reversed(name.split(', ')))
                    except:
                        print(red(name.split(', ').reverse()))

                # Make author query
                wdIRI = make_author_query(name)
                if wdIRI:
                    author['iri'] = wdIRI
                    with open(AUTHOR_FILE, 'w') as f:
                        json.dump(authors, f)
                    break

strings = []

# Search Wikidata for sources
if SEARCH_WD_SOURCES and len(sources.keys()) > 0:

    print(pink('   === Source search ===\n'))

    # For each source...
    for source in sources.values():

        # If source has no IRI...
        if 'iri' not in source:

            # Clean source title
            title = source['title'].split('(')[0].strip()

            # Make source query
            wdEntities = wdQuery(title, 'Q386724')
            wdIRI = wikiInteractive(title, wdEntities, source['author'])
            if wdIRI:
                source['iri'] = wdIRI
                with open(SOURCE_FILE, 'w') as f:
                    json.dump(sources, f)

print(pink('   === Statistics ==='))

# Print author statistics
wikiAuthors = [x for x in authors.values() if 'iri' in x]
authorPercent = len(wikiAuthors)/(len(authors.values()) or 1)
print(f'   {len(wikiAuthors)} of {len(authors.values())} authors ({100*authorPercent:.2f}%) have Wikidata IRIs')

# Print source statistics
wikiSources = [x for x in sources.values() if 'iri' in x]
sourcePercent = len(wikiSources)/(len(sources.values()) or 1)
print(f'   {len(wikiSources)} of {len(sources.values())} sources ({100*sourcePercent:.2f}%) have Wikidata IRIs\n')
