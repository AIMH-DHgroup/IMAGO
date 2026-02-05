"""

| **Project**: IMAGO
| **Package**: Backend
| **Title**: Views in Django
| **File**: views.py
| **Path**: /var/www/imago/annotation/
| **Type**: python
| **Started**: 2020-04-26
| **Author(s)**: Nicolo' Pratelli & Daniele Metilli
| **State**: in use

Version history.

2020-04-26 Nicolo' Pratelli & Daniele Metilli
    * First version

2020-05-07 Daniele Metilli
    * Added autocomplete

2020-06-16 Nicolo' Pratelli
    * Added multiple subject management

2022-09-14 Nicolo' Pratelli
    * Added abstract form command

This file is part of software developed by the Digital Humanities group
of AIMH Laboratory, Institute of Information Science and Technologies
(ISTI-CNR), Pisa, Italy, for the IMAGO and HDN projects.
Further information at: https://imagoarchive.it
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

# Import liraries
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, Http404, JsonResponse
from django.shortcuts import get_object_or_404, render
from django.template import loader
from django.urls import reverse
from django.views import generic
from django.db.models import Count, Q
from django.core.serializers import serialize
from django.core.serializers.json import DjangoJSONEncoder
from django.contrib.auth.decorators import login_required, permission_required
from django.views.decorators.clickjacking import xframe_options_exempt
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.utils.datastructures import MultiValueDictKeyError
from django.utils.text import slugify
from django.forms.formsets import formset_factory
from django.contrib.auth import authenticate, login
from django.core.paginator import InvalidPage, EmptyPage
from .forms import *
from .models import *
from .services import *
from .paginator import *
from urllib.error import HTTPError
import urllib.request
import json as j
import datetime
import time
import re
import string
from django.template.loader import render_to_string
from weasyprint import HTML
import tempfile


# Default IRIs and URLs
WD_ENTITY_URL = 'http://www.wikidata.org/entity/'
WD_SPARQL_URL = 'http://query.wikidata.org/sparql?query='
IMAGO_BASE_IRI = 'https://imagoarchive.it/resource/'
IMAGO_BIBLIO_IRI = 'https://imagoarchive.it/bibliografia.html#'
ANONYMOUS_IRI = 'http://www.wikidata.org/entity/Q4233718'

# Reviewer
reviewers = {'paolo.pontari', 'luca.ruggio'}


class LazyEncoder(DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, YourCustomType):
            return str(obj)
        return super().default(obj)

def check_validity_date(date_start, date_end, uncertainty, ante, post, saec):
    if saec:
        if date_start=="" or date_end=="":
            return False, "Inserire un intervallo valido"
        else:
            if convertToSecolo("", date_start, date_end) == "Inserito un intervallo non valido":
                return False, "Inserire un intervallo valido"
            else:
                return True, "Inserimento data corretta"
    pattern = '\d{2}\-\d{2}\-\d{3,4}|^\d{3,4}$'
    match_start = re.search(pattern, date_start)
    if match_start or date_start == "":
        match_end = re.search(pattern, date_end)
        if match_end and match_start:
            return True, "Inserimento data corretta"
        elif match_start and date_end == "":
            return True, "Inserimento data corretta"
        elif date_start == "" and date_end == "":
            return True, "Inserimento data corretta"
        else:
            return False, "Inserire una data valida"
    else:
        return False, "Inserire una data valida"
            

    


def build_datazione(date_start, date_end, uncertainty, ante, post, saec):
    data = {}
    dataInizio = {}
    dataFine = {}
    data['incertezza'] = uncertainty
    data['post'] = post
    data['ante'] = ante
    data['secolo'] = saec
    dataInizio['data'] = date_start
    dataFine['data'] = date_end
    data['dataInizio'] = dataInizio
    data['dataFine'] = dataFine
    return data
    

# Functions
def build_lemma(request, author_iri, work_iri):
    infoLemma = {}
    infoLemma['autore'] = author_iri
    infoLemma['opera'] = work_iri
    infoLemma['manoscritti'] = []
    infoLemma['edizioniStampa'] = []
    infoLemma['generi'] = []
    infoLemma['toponimi'] = []
    infoLemma['owner'] = request.user.username
    lemma = {}
    lemma['lemma'] = infoLemma
    return lemma

def build_manuscript(lemma, manuscript_id, manuscript_author, manuscript_title, library_iri,
                     library_location_iri, signature, folios, incipit_dedication_proem,
                     explicit_dedication_proem, incipit_text, explicit_text, date, decoration,
                     url, url_description, secondary_sources, notes, schedatore, last_mod):
    manoscritto = {}
    manoscritto['autore'] = manuscript_author
    manoscritto['titolo'] = manuscript_title
    manoscritto['biblioteca'] = library_iri
    manoscritto['luogoBiblioteca'] = library_location_iri
    manoscritto['segnatura'] = signature
    manoscritto['fogli'] = folios
    manoscritto['incipitDedica'] = incipit_dedication_proem
    manoscritto['explicitDedica'] = explicit_dedication_proem
    manoscritto['incipitTesto'] = incipit_text
    manoscritto['explicitTesto'] = explicit_text
    manoscritto['datazioneString'] = toStringDatazioneOpera(date)
    manoscritto['datazione'] = date
    manoscritto['decorazione'] = decoration
    manoscritto['url'] = url
    manoscritto['urlDescrizione'] = url_description
    manoscritto['fonti'] = secondary_sources
    manoscritto['note'] = notes
    manoscritto['schedatore'] = schedatore
    manoscritto['lastMod'] = last_mod
    if manuscript_id != -1:
        lemma['lemma']['manoscritti'][manuscript_id] = manoscritto
    else:
        lemma['lemma']['manoscritti'].append(manoscritto)

    return lemma

def build_print_edition(lemma, print_edition_id,print_edition_author,
                        print_edition_title, curator, place_iri, print_edition_place,
                        date, editor, format_print_edition, pages,
                        figures, notes, prefatore, other_content,
                        edition, date_edition, primary_sources, language,
                        ecdotic_typology, secondary_sources, schedatore, last_mod):

    edizione_stampa = {}
    edizione_stampa['autore'] = print_edition_author
    edizione_stampa['titolo'] = print_edition_title
    edizione_stampa['curatore'] = curator
    edizione_stampa['luogo'] = place_iri
    if place_iri:
        try:
            Place.objects.get(data__iri=place_iri)
        except Place.DoesNotExist:
            make_topography_query(place_iri)
    edizione_stampa['luogoEdizione'] = print_edition_place
    edizione_stampa['data'] = date
    edizione_stampa['dataString'] = toStringDatazioneOpera(date)
    edizione_stampa['editore'] = editor
    edizione_stampa['formato'] = format_print_edition
    edizione_stampa['pagine'] = pages
    edizione_stampa['figure'] = figures
    edizione_stampa['note'] = notes
    edizione_stampa['prefatore'] = prefatore
    edizione_stampa['altriContenuti'] = other_content
    edizione_stampa['edizione'] = edition
    edizione_stampa['dataEdizione'] = date_edition
    edizione_stampa['fontiPrimarie'] = primary_sources
    edizione_stampa['ecdotica'] = ecdotic_typology
    edizione_stampa['linguaTraduzione'] = language
    edizione_stampa['fontiSecondarie'] = secondary_sources
    edizione_stampa['schedatore'] = schedatore
    edizione_stampa['lastMod'] = last_mod
    if print_edition_id != -1:
        lemma['lemma']['edizioniStampa'][print_edition_id] = edizione_stampa
    else:
        lemma['lemma']['edizioniStampa'].append(edizione_stampa)

    return lemma

@login_required(login_url='../accounts/login/')
def index(request):
    return render(request, 'annotation/index.html')

@login_required(login_url='/tool/accounts/login/')
def get_sources(request):
    """Get list of sources and render the list in sources.html

    Build index page, showing the sources.

    :param request: The request object used to generate this response
    :type request: Request
    :return: render the author list in index.html
    :rtype: HttpResponse
    """

    sources = Source.objects.all() # Extract all sources
    # notes = Annotation.objects.filter(data__owner=request.user.id) # prende solo le note di un owner
    # notes = Annotation.objects.filter(data__owner=vreuser) # prende solo le note di un owner
    # done = Count('data__Nota__Commento', filter=Q(data__Stato='done')) 
    # authors = lemmas.values('data__lemma__autore').order_by('data__lemma__autore').distinct()
    # print(authors)

    source_list = []
    # letter = request.GET.get('page')
    for obj in sources:
        # print(obj['data__Lemma__Autore'])
        # print(obj.data)

        # author = Author.objects.get(data__iri=obj['data__lemma__autore'])s
        # author_name = author.data['name']
        # autor_datazione = author.data['stringDatazione']
        
        # author_name.startswith(letter)
        source_list.append({'id' : obj.id, 'name': obj.data['name'], 'description': obj.data['description'], 'iri': obj.data['iri']})
        
    # letter = request.GET.get('page')
    paginator = NamePaginator(source_list, on="name", per_page=1)
    try:
        page = int(request.GET.get('page', '1'))
    except ValueError:
        page = 1

    try:
        page = paginator.page(page)
    except (InvalidPage):
        page = paginator.page(paginator.num_pages)

    print(page.object_list)
    # lemmas_list = [{'autore': obj['data__Lemma__Autore']} for obj in authors]
    context = {'source_list' : source_list, 'page' : page}

    return render(request, 'annotation/sources.html', context)

    
@login_required(login_url='/tool/accounts/login/')
def get_authors(request):
    """Get list of authors and render the list in index.html

    Build index page, showing the authors.

    :param request: The request object used to generate this response
    :type request: Request
    :return: render the author list in index.html
    :rtype: HttpResponse
    """

    lemmas = Lemma.objects.all() # Extract all lemmas from
    # notes = Annotation.objects.filter(data__owner=request.user.id) # prende solo le note di un owner
    # notes = Annotation.objects.filter(data__owner=vreuser) # prende solo le note di un owner
    # done = Count('data__Nota__Commento', filter=Q(data__Stato='done')) 
    authors = lemmas.values('data__lemma__autore').order_by('data__lemma__autore').distinct()
    # print(authors)

    lemmas_list = []
    # letter = request.GET.get('page')
    for obj in authors:
        # print(obj['data__Lemma__Autore'])
        author = Author.objects.get(data__iri=obj['data__lemma__autore'])
        author_id = author.id
        author_name = author.data['name']
        autor_datazione = author.data['stringDatazione']
        
        # author_name.startswith(letter)
        lemmas_list.append({'id' : author_id, 'autore': author_name, 'datazione': autor_datazione})
        
    # letter = request.GET.get('page')
    paginator = NamePaginator(lemmas_list, on="autore", per_page=1)
    try:
        page = int(request.GET.get('page', '1'))
    except ValueError:
        page = 1

    try:
        page = paginator.page(page)

    except (InvalidPage):
        page = paginator.page(paginator.num_pages)

    # lemmas_list = [{'autore': obj['data__Lemma__Autore']} for obj in authors]
    context = {'lemmas_list' : lemmas_list, 'page' : page}
    


    return render(request, 'annotation/authors.html', context)

@login_required(login_url='/tool/accounts/login/')
def get_works(request, author_id):
    """Get list of works of an author and render the list in author page

    Build author page, showing the works.

    :param request: The request object used to generate this response
    :type request: Request
    :return: render the author list in index.html
    :rtype: HttpResponse
    """
    author = Author.objects.get(id=author_id)
    author_name = author.data['name']
    author_iri = author.data['iri']
    lemmas = Lemma.objects.filter(data__lemma__autore=author_iri) # Extract all lemmas from
    # notes = Annotation.objects.filter(data__owner=request.user.id) # prende solo le note di un owner
    # notes = Annotation.objects.filter(data__owner=vreuser) # prende solo le note di un owner
    # done = Count('data__Nota__Commento', filter=Q(data__Stato='done')) 
    works = lemmas.values('data__lemma__opera','data__lemma__review').order_by('data__lemma__opera')
    works_list = []
    for obj in works:
        work = Work.objects.get(data__iri=obj['data__lemma__opera'])
        work_id = work.id
        work_title = work.data['title']
        review = obj['data__lemma__review']
        works_list.append({'id' : work_id, 'titolo': work_title, 'review': review})
    # works_list = [{'opera': obj['data__Lemma__Opera']} for obj in authors]
    context = {'author_id' : author_id,
               'author_name' : author_name,
               'works_list' : works_list}


    return render(request, 'annotation/works.html', context)

@login_required(login_url='/tool/accounts/login/')
def assigned_lemmas(request):
    """Get list of works of an author and render the list in author page

    Build author page, showing the works.

    :param request: The request object used to generate this response
    :type request: Request
    :return: render the author list in index.html
    :rtype: HttpResponse
    """
    # author = Author.objects.get(id=author_id)
    # author_name = author.data['name']
    # author_iri = author.data['iri']
    lemmas = Lemma.objects.filter(data__lemma__owner=request.user.username) # Extract all lemmas from
    # print(lemmas)
    works = lemmas.values('data__lemma__opera', 'data__lemma__autore').order_by('data__lemma__autore')
    lemmas_list = []
    prev_author = ""
    for obj in works:
        work = Work.objects.get(data__iri=obj['data__lemma__opera'])
        work_id = work.id
        work_title = work.data['title']
        author = Author.objects.get(data__iri=obj['data__lemma__autore'])
        author_id = author.id
        if(author.data['name']==prev_author):
            author_name = ""
        else:
            author_name = author.data['name']
        prev_author = author.data['name']

        lemmas_list.append({'work_id' : work_id, 'work_title': work_title, 'author_id': author_id, 'author_name': author_name})
    # works_list = [{'opera': obj['data__Lemma__Opera']} for obj in authors]
    context = {'lemmas_list' : lemmas_list}


    return render(request, 'annotation/assigned_lemmas.html', context)

@login_required(login_url='/tool/accounts/login/')
def lemma(request, author_id=0, work_id=0):
    # set empty string author name and iri
    author_name = ""
    author_iri = ""
    # lemma_id = 0
    # set empty string work title and iri
    work_title = ""
    work_iri = ""
    # initialize json variables
    json_data = {}
    id_data = {}

    if author_id != 0:
        # get author name and iri
        author = Author.objects.get(id=author_id)
        author_name = author.data['name']
        author_iri = author.data['iri']
        string_datazione = author.data['stringDatazione']
        datazione = author.data['datazione']
        author_alias = author.data['alias']

    if work_id != 0:
        # get work title and iri
        work = Work.objects.get(id=work_id)
        work_title = work.data['title']
        work_iri = work.data['iri']
        work_alias = work.data['alias']
        lemma = Lemma.objects.get(data__lemma__autore=author_iri, data__lemma__opera=work_iri)
        json_data = lemma.data
    
    # Initialize the formsets, specifying the form and formset we want to use.
    GenreFormSet = formset_factory(GenreForm)
    TopographyFormSet = formset_factory(TopographyForm)
    SourceManuscriptFormSet = formset_factory(SourceManuscriptForm)
    SourcePrintEditionFormSet = formset_factory(SourcePrintEditionForm)


    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        lemma_form = LemmaForm(request.POST)

        genre_formset = GenreFormSet(prefix='genre_set')
        topography_formset = TopographyFormSet(prefix='topography_set')
        source_manuscript_formset = SourceFormSet(prefix='source_manuscript_set')
        source_print_edition_formset = SourceFormSet(prefix='source_print_edition_set')

        # Create the other forms in the page
        work_type_form = WorkTypeForm()
        author_form = AuthorForm()
        work_form = WorkForm()
        manuscript_form = ManuscriptForm()
        date_manuscript_form = DateManuscriptForm()
        print_edition_form = PrintEditionForm()
        date_print_edition_form = DatePrintEditionForm()
        abstract_form = AbstractForm()
        review_form = ReviewForm()

        author_iri = lemma_form['author_iri'].value()
        author = lemma_form['author'].value()
        work_iri = lemma_form['work_iri'].value()
        work = lemma_form['work'].value()

        try:
            exists_lemma = Lemma.objects.get(data__lemma__autore=author_iri, data__lemma__opera=work_iri)
            if exists_lemma:
                # retrieve author
                author = Author.objects.get(data__iri=author_iri)
                # retrieve work id
                work = Work.objects.get(data__iri=work_iri)

                duplicate = 1

                lemma_json = exists_lemma.data

                context = {'lemma_json': lemma_json,
                        'duplicate' : duplicate,
                        'author_id' : author.id,
                        'work_id' : work.id,
                        'author_name': author_name,
                        'author_iri': author_iri,
                        'work_title': work_title,
                        'work_iri': work_iri}
                return JsonResponse(context)

        except Lemma.DoesNotExist:
            lemma = build_lemma(request, author_iri, work_iri)
            try:
                Author.objects.get(data__iri=author_iri)
            except Author.DoesNotExist:
                author_json = {'iri': author_iri, 'name': author}
                new_author = Author(data=author_json)
                new_author.save()
            try:
                Work.objects.get(data__iri=work_iri)
            except Work.DoesNotExist:
                work_json = {'iri': work_iri, 'title': work, 'author': author_iri}
                new_work = Work(data=work_json)
                new_work.save()
            
            Lemma.objects.create(data=lemma)
            lastLemma = Lemma.objects.last()
            # retrieve author
            author = Author.objects.get(data__iri=author_iri)
            # retrieve work id
            work = Work.objects.get(data__iri=work_iri)
            lemma_json = lastLemma.data
            duplicate = 0
           
        # check whether it's valid:
        if lemma_form.is_valid():
            context = {'lemma_json': lemma_json,
                       'lemma_form': lemma_form,
                       'genre_formset' : genre_formset,
                       'topography_formset' : topography_formset,
                       'source_manuscript_formset' : source_manuscript_formset,
                       'source_print_edition_formset' : source_print_edition_formset,
                       'author_form' : author_form,
                       'work_form' : work_form,
                       'work_type_form' : work_type_form,
                       'manuscript_form' : manuscript_form,
                       'date_manuscript_form' : date_manuscript_form,
                       'print_edition_form': print_edition_form,
                       'date_print_edition_form': date_print_edition_form,
                       'abstract_form': abstract_form,
                       'review_form': review_form,
                       }
            if request.is_ajax():
                return JsonResponse({'lemma_json': lemma_json, 
                                     'duplicate' : duplicate,
                                     'author_id' : author.id,
                                     'work_id' : work.id})
            else:
                return render(request, 'annotation/lemma.html', context)


    # if a GET (or any other method) we'll create a blank form
    else:
        author_name_data = author_name + ", " + string_datazione
        lemma_form = LemmaForm({'author': author_name_data,
                                'author_iri': author_iri,
                                'work': work_title,
                                'work_iri': work_iri})
        if author_id != 0:
            lemma_form.fields['author'].widget.attrs['disabled'] = True
        if work_id != 0:
            lemma_form.fields['work'].widget.attrs['disabled'] = True

        print(datazione)
        datazione_form = {'name': author_name,
                          'name_iri': author_iri,
                          'alias': ';'.join(author_alias)}

        if "floruit" in datazione:
            datazione_form['floruit'] = True
            datazione_form['uncertainty_floruit'] = datazione["floruit"]["incertezza"]
            datazione_form['ante_floruit'] = datazione["floruit"]["ante"]
            datazione_form['post_floruit'] = datazione["floruit"]["post"]
            datazione_form['saec_floruit'] = datazione["floruit"]["secolo"]
            datazione_form['date_floruit_start'] = datazione["floruit"]["dataInizio"]["data"]
            datazione_form['date_floruit_end'] = datazione["floruit"]["dataFine"]["data"]
        if "vescovo" in datazione:
            datazione_form['bishop'] = True
            datazione_form['uncertainty_bishop'] = datazione["vescovo"]["incertezza"]
            datazione_form['ante_bishop'] = datazione["vescovo"]["ante"]
            datazione_form['post_bishop'] = datazione["vescovo"]["post"]
            datazione_form['saec_bishop'] = datazione["vescovo"]["secolo"]
            datazione_form['date_bishop_start'] = datazione["vescovo"]["dataInizio"]["data"]
            datazione_form['date_bishop_end'] = datazione["vescovo"]["dataFine"]["data"]
        if "vita" in datazione:
            datazione_form['birth_death'] = True
            datazione_form['uncertainty_birth'] = datazione["vita"]["dataNascita"]["incertezza"]
            datazione_form['ante_birth'] = datazione["vita"]["dataNascita"]["ante"]
            datazione_form['post_birth'] = datazione["vita"]["dataNascita"]["post"]
            datazione_form['saec_birth'] = datazione["vita"]["dataNascita"]["secolo"]
            datazione_form['date_birth_start'] = datazione["vita"]["dataNascita"]["dataInizio"]["data"]
            datazione_form['date_birth_end'] = datazione["vita"]["dataNascita"]["dataFine"]["data"]
            datazione_form['uncertainty_death'] = datazione["vita"]["dataMorte"]["incertezza"]
            datazione_form['ante_death'] = datazione["vita"]["dataMorte"]["ante"]
            datazione_form['post_death'] = datazione["vita"]["dataMorte"]["post"]
            datazione_form['saec_death'] = datazione["vita"]["dataMorte"]["secolo"]
            datazione_form['date_death_start'] = datazione["vita"]["dataMorte"]["dataInizio"]["data"]
            datazione_form['date_death_end'] = datazione["vita"]["dataMorte"]["dataFine"]["data"]
            
        author_form = AuthorForm(datazione_form)

        work_form = WorkForm({'title': work_title,
                          'title_iri': work_iri,
                          'alias': ';'.join(work_alias)})
        # print(work_form)
        work_type_form = WorkTypeForm()
        manuscript_form = ManuscriptForm()
        date_manuscript_form = DateManuscriptForm()
        print_edition_form = PrintEditionForm()
        date_print_edition_form = DatePrintEditionForm()
        abstract_form = AbstractForm()
        review_form = ReviewForm()
        genre_formset = GenreFormSet(prefix='genre_set')
        topography_formset = TopographyFormSet(prefix='topography_set')
        source_manuscript_formset = SourceManuscriptFormSet(prefix='source_manuscript_set')
        source_print_edition_formset = SourcePrintEditionFormSet(prefix='source_print_edition_set')

        context = {'data' : json_data,
                   'author_name': author_name,
                   'author_iri': author_iri,
                   'work_title': work_title,
                   'work_iri': work_iri,
                   'lemma_form': lemma_form,
                   'genre_formset' : genre_formset,
                   'topography_formset' : topography_formset,
                   'source_manuscript_formset' : source_manuscript_formset,
                   'source_print_edition_formset' : source_print_edition_formset,
                   'author_form' : author_form,
                   'work_form' : work_form,
                   'work_type_form' : work_type_form,
                   'abstract_form' : abstract_form,
                   'review_form' : review_form,
                   'manuscript_form' : manuscript_form,
                   'date_manuscript_form' : date_manuscript_form,
                   'print_edition_form': print_edition_form,
                   'date_print_edition_form': date_print_edition_form}
        return render(request, 'annotation/lemma.html', context)

@login_required(login_url='/tool/accounts/login/')
def insert_manuscript(request, manuscript_id=-1, author_id=0, work_id=0):
    # if this is a POST request we need to process the form data
    author = Author.objects.get(id=author_id)
    author_iri = author.data['iri']
    work = Work.objects.get(id=work_id)
    work_iri = work.data['iri']

    SourceManuscriptFormSet = formset_factory(SourceManuscriptForm)

    if request.method == 'POST':
        manuscript_form = ManuscriptForm(request.POST)  
        date_manuscript_form = DateManuscriptForm(request.POST)
        source_manuscript_formset = SourceManuscriptFormSet(request.POST, prefix='source_manuscript_set')
        manuscript_author = manuscript_form['manuscript_author'].value()
        manuscript_title = manuscript_form['manuscript_title'].value()
        library_iri = manuscript_form['library_iri'].value()
        library_location_iri = manuscript_form['library_location_iri'].value()
        signature = manuscript_form['signature'].value()
        folios = manuscript_form['folios'].value()
        incipit_dedication_proem = manuscript_form['incipit_dedication_proem'].value()
        explicit_dedication_proem = manuscript_form['explicit_dedication_proem'].value()
        incipit_text = manuscript_form['incipit_text'].value()
        explicit_text = manuscript_form['explicit_text'].value()
        
        decoration = manuscript_form['decoration'].value()
        url = manuscript_form['url'].value()
        url_description = manuscript_form['url_description'].value()
        notes = manuscript_form['notes'].value()

        # secondary sources
        # secondary_sources = manuscript_form['secondary_sources'].value()
 
        if(source_manuscript_formset.is_valid()):
            sourceList = []
            if source_manuscript_formset.total_form_count() == 0:
                secondary_sources = sourceList
            else:
                for source_form in source_manuscript_formset:
                    try:
                        source_iri = source_form.cleaned_data['source_manuscript_iri']
                        specific = source_form.cleaned_data['specific_manuscript']
                        print(source_iri)
                        print(specific)
                        try:
                            Source.objects.get(data__iri=source_iri)
                            source_json = {}
                            source_json['iri'] = source_iri
                            source_json['specific'] = specific
                        except Source.DoesNotExist:
                            print("error")
                        sourceList.append(source_json)
                    except:
                        pass
        else:
            sourceList = []
        
        secondary_sources = sourceList

        #datazione
        date_start = date_manuscript_form['date_manuscript_start'].value()
        date_end = date_manuscript_form['date_manuscript_end'].value()
        uncertainty = date_manuscript_form['uncertainty_manuscript'].value()
        ante = date_manuscript_form['ante_manuscript'].value()
        post = date_manuscript_form['post_manuscript'].value()
        saec = date_manuscript_form['saec_manuscript'].value()
        # date = build_datazione(date_start, date_end, uncertainty, ante, post, saec)

        # check validity
        
        if date_manuscript_form.is_valid():
            check_date, message = check_validity_date(date_start, date_end, uncertainty, ante, post, saec)
            if check_date:
                date = build_datazione(date_start, date_end, uncertainty, ante, post, saec)
            else:
                if manuscript_form.is_valid():
                    return JsonResponse({'success': False, 'errors' : [{'date_manuscript': [message]}]})
                else:
                    errors = [{k: [b]for b in v} for k, v in manuscript_form.errors.items()]

                    errors.append({'date_manuscript': [message]})
                    print(errors)
                    return JsonResponse({'success': False, 'errors' : errors})


        # date = manuscript_form['date'].value()
        date = build_datazione(date_start, date_end, uncertainty, ante, post, saec)


        lemma = Lemma.objects.get(data__lemma__autore=author_iri, data__lemma__opera=work_iri)
        last_mod = time.time() 
        
        if request.user.username in reviewers:
            # print(lemma.data['lemma']['manoscritti'][manuscript_id]['lastMod'])
            last_mod = lemma.data['lemma']['manoscritti'][manuscript_id]['lastMod']
            # print(lemma.data['lemma']['manoscritti'][manuscript_id]['schedatore'])
            schedatore = lemma.data['lemma']['manoscritti'][manuscript_id]['schedatore']
        else:
            schedatore = request.user.username
            
        
        lemma_json = build_manuscript(lemma.data, manuscript_id, manuscript_author, 
                                      manuscript_title, library_iri, 
                                      library_location_iri, signature,
                                      folios, incipit_dedication_proem,
                                      explicit_dedication_proem, incipit_text,
                                      explicit_text, date, decoration, 
                                      url, url_description,
                                      secondary_sources, notes,
                                      schedatore, last_mod)

        # print(lemma_json)

        # check whether it's valid:
        if manuscript_form.is_valid():
            Lemma.objects.filter(data__lemma__autore=author_iri, data__lemma__opera=work_iri).update(data=lemma_json)

            if request.is_ajax():
                return JsonResponse({'success': True, 'lemma_json': lemma_json})
        else:
            # print(manuscript_form.errors.as_json())
            return JsonResponse({'success': False, 'errors' : [{k: [b]for b in v} for k, v in manuscript_form.errors.items()]})
            # return JsonResponse({'errors' : manuscript_form.errors.as_json()})

@login_required(login_url='/tool/accounts/login/')
def insert_print_edition(request, print_edition_id=-1, author_id=0, work_id=0):
    # if this is a POST request we need to process the form data
    author = Author.objects.get(id=author_id)
    author_iri = author.data['iri']
    work = Work.objects.get(id=work_id)
    work_iri = work.data['iri']
    SourcePrintEditionFormSet = formset_factory(SourcePrintEditionForm)

    if request.method == 'POST':
        print_edition_form = PrintEditionForm(request.POST)
        date_print_edition_form = DatePrintEditionForm(request.POST)
        source_print_edition_formset = SourcePrintEditionFormSet(request.POST, prefix='source_print_edition_set')
        

        print_edition_author = print_edition_form['print_edition_author'].value()
        print_edition_title = print_edition_form['print_edition_title'].value()
        curator = print_edition_form['curator'].value()
        place = print_edition_form['place'].value()
        place_iri = print_edition_form['place_iri'].value()
        print_edition_place = print_edition_form['print_edition_place'].value()
        editor = print_edition_form['editor'].value()
        format_print_edition = print_edition_form['format_print_edition'].value()
        pages = print_edition_form['pages'].value()
        figures = print_edition_form['figures'].value()
        notes = print_edition_form['notes'].value()
        prefatore = print_edition_form['prefatore'].value()
        other_content = print_edition_form['other_content'].value()
        edition = print_edition_form['edition'].value()
        date_edition = print_edition_form['date_edition'].value()
        primary_sources = print_edition_form['primary_sources'].value()
        ecdotic_typology = print_edition_form['ecdotic_typology'].value()
        language = print_edition_form['language'].value()
        # secondary_sources = print_edition_form['secondary_sources'].value()

        # secondary sources
 
        if(source_print_edition_formset.is_valid()):
            sourceList = []

            if source_print_edition_formset.total_form_count() == 0:
                secondary_sources = sourceList
            else:
                for source_form in source_print_edition_formset:
                    try:
                        source_iri = source_form.cleaned_data['source_print_edition_iri']
                        specific = source_form.cleaned_data['specific_print_edition']
                        print(specific)
                        try:
                            Source.objects.get(data__iri=source_iri)
                            source_json = {}
                            source_json['iri'] = source_iri
                            source_json['specific'] = specific
                        except Source.DoesNotExist:
                            print("error")
                        sourceList.append(source_json)
                    except:
                        pass
        else:
            sourceList = []
        
        secondary_sources = sourceList

        #datazione
        date_start = date_print_edition_form['date_print_edition_start'].value()
        date_end = date_print_edition_form['date_print_edition_end'].value()
        uncertainty = date_print_edition_form['uncertainty_print_edition'].value()
        ante = date_print_edition_form['ante_print_edition'].value()
        post = date_print_edition_form['post_print_edition'].value()
        saec = date_print_edition_form['saec_print_edition'].value()
        # date = build_datazione(date_start, date_end, uncertainty, ante, post, saec)
        if date_print_edition_form.is_valid():
            check_date, message = check_validity_date(date_start, date_end, uncertainty, ante, post, saec)
            if check_date:
                date = build_datazione(date_start, date_end, uncertainty, ante, post, saec)
            else:
                if print_edition_form.is_valid():
                    return JsonResponse({'success': False, 'errors' : [{'date_print_edition': [message]}]})
                else:
                    errors = [{k: [b]for b in v} for k, v in print_edition_form.errors.items()]
                    errors.append({'date_print_edition': [message]})
                    return JsonResponse({'success': False, 'errors' : errors})

        lemma = Lemma.objects.get(data__lemma__autore=author_iri, data__lemma__opera=work_iri)
        last_mod = time.time()
        
        if request.user.username in reviewers:
            # print(lemma.data['lemma']['edizioniStampa'][print_edition_id]['lastMod'])
            last_mod = lemma.data['lemma']['edizioniStampa'][print_edition_id]['lastMod']
            # print(lemma.data['lemma']['edizioniStampa'][print_edition_id]['schedatore'])
            schedatore = lemma.data['lemma']['edizioniStampa'][print_edition_id]['schedatore']
        else:
            schedatore = request.user.username


        lemma_json = build_print_edition(lemma.data, print_edition_id,
                                         print_edition_author,
                                         print_edition_title, curator,
                                         place_iri, print_edition_place, date, editor, 
                                         format_print_edition, pages,
                                         figures, notes, prefatore, 
                                         other_content, edition, 
                                         date_edition, primary_sources, language,
                                         ecdotic_typology, secondary_sources, 
                                         schedatore, last_mod)

        
        Lemma.objects.filter(data__lemma__autore=author_iri, data__lemma__opera=work_iri).update(data=lemma_json)

        # check whether it's valid:
        if print_edition_form.is_valid():
            Lemma.objects.filter(data__lemma__autore=author_iri, data__lemma__opera=work_iri).update(data=lemma_json)
            
            if request.is_ajax():
                return JsonResponse({'success': True, 'lemma_json': lemma_json})
        else:
            return JsonResponse({'success': False, 'errors' : [{k: [b]for b in v} for k, v in print_edition_form.errors.items()]})

@login_required(login_url='/tool/accounts/login/')
def delete_manuscript(request, manuscript_id, author_id=0, work_id=0):

    json = "{}"
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        lemma_form = LemmaForm(request.POST)

        author_iri = lemma_form['author_iri'].value()
        work_iri = lemma_form['work_iri'].value()

        lemma = Lemma.objects.get(data__lemma__autore=author_iri, data__lemma__opera=work_iri)

        lemma_json = lemma.data
        del lemma_json['lemma']['manoscritti'][manuscript_id]
        Lemma.objects.filter(data__lemma__autore=author_iri, data__lemma__opera=work_iri).update(data=lemma_json)
        context = {'lemma_json': lemma_json}
        if request.is_ajax():
            return JsonResponse({'lemma_json': lemma_json})
        else:
            return render(request, 'annotation/note.html', context)

@login_required(login_url='/tool/accounts/login/')
def delete_print_edition(request, print_edition_id, author_id=0, work_id=0):

    json = "{}"
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        lemma_form = LemmaForm(request.POST)

        author_iri = lemma_form['author_iri'].value()
        work_iri = lemma_form['work_iri'].value()

        lemma = Lemma.objects.get(data__lemma__autore=author_iri, data__lemma__opera=work_iri)

        lemma_json = lemma.data
        del lemma_json['lemma']['edizioniStampa'][print_edition_id]
        Lemma.objects.filter(data__lemma__autore=author_iri, data__lemma__opera=work_iri).update(data=lemma_json)
        context = {'lemma_json': lemma_json}
        if request.is_ajax():
            return JsonResponse({'lemma_json': lemma_json})
        else:
            return render(request, 'annotation/note.html', context)


@login_required(login_url='/tool/accounts/login/')
def save_topographies(request, author_id=0, work_id=0):

    TopographyFormSet = formset_factory(TopographyForm)
    
    if request.method == 'POST':
        topography_formset = TopographyFormSet(request.POST, prefix='topography_set')
        author = Author.objects.get(id=author_id)
        author_name = author.data['name']
        author_iri = author.data['iri']
        work = Work.objects.get(id=work_id)
        work_title = work.data['title']
        work_iri = work.data['iri']
        lemma = Lemma.objects.get(data__lemma__autore=author_iri, data__lemma__opera=work_iri)
        json_data = lemma.data
 
        if(topography_formset.is_valid()):
            topographyList = []
            
            if topography_formset.total_form_count() == 0:
                json_data["lemma"]["toponimi"] = topographyList
            else:
                for topography_form in topography_formset:
                    try:
                        topography_iri = topography_form.cleaned_data['topography_iri']
                        topography = topography_form.cleaned_data['topography']
                        try:
                            Place.objects.get(data__iri=topography_iri)
                        except Place.DoesNotExist:
                            make_topography_query(topography_iri)
                        topographyList.append(topography_iri)
                    except:
                        topographyList = []
                json_data["lemma"]["toponimi"] = topographyList
        else:
            json_data["lemma"]["toponimi"] = []
        
        Lemma.objects.filter(data__lemma__autore=author_iri, data__lemma__opera=work_iri).update(data=json_data)
        return JsonResponse({'json_data' : json_data})
    return JsonResponse({'error': 'Parameters missing'})

@login_required(login_url='/tool/accounts/login/')
def save_genres(request, author_id=0, work_id=0):
   
    GenreFormSet = formset_factory(GenreForm)
    
    if request.method == 'POST':
        genre_formset = GenreFormSet(request.POST, prefix='genre_set')
        author = Author.objects.get(id=author_id)
        author_name = author.data['name']
        author_iri = author.data['iri']
        work = Work.objects.get(id=work_id)
        work_title = work.data['title']
        work_iri = work.data['iri']
        lemma = Lemma.objects.get(data__lemma__autore=author_iri, data__lemma__opera=work_iri)
        json_data = lemma.data

        
        if genre_formset.is_valid():
            
            genreList = []
            if genre_formset.total_form_count() == 0:
                json_data["lemma"]["generi"] = genreList
            else:
                for genre_form in genre_formset:
                    try:
                        genre_iri = genre_form.cleaned_data['genre_iri']
                        genre = genre_form.cleaned_data['genre']
                        genreList.append(genre_iri)
                    except:
                        genreList = []
                    json_data["lemma"]["generi"] = genreList
        else:
            json_data["lemma"]["generi"] = []
      
        Lemma.objects.filter(data__lemma__autore=author_iri, data__lemma__opera=work_iri).update(data=json_data)
        return JsonResponse({'json_data' : json_data})
    return JsonResponse({'error': 'Parameters missing'})

@login_required(login_url='/tool/accounts/login/')
def save_abstract(request, author_id=0, work_id=0):

    
    if request.method == 'POST':
        abstract_form = AbstractForm(request.POST) 

        abstract = abstract_form['abstract'].value()
        author = Author.objects.get(id=author_id)
        author_name = author.data['name']
        author_iri = author.data['iri']
        work = Work.objects.get(id=work_id)
        work_title = work.data['title']
        work_iri = work.data['iri']

        lemma = Lemma.objects.get(data__lemma__autore=author_iri, data__lemma__opera=work_iri)
        json_data = lemma.data

        if abstract_form.is_valid():
            json_data["lemma"]["abstract"] = abstract
        else:
            json_data["lemma"]["abstract"] = ""


        Lemma.objects.filter(data__lemma__autore=author_iri, data__lemma__opera=work_iri).update(data=json_data)
        return JsonResponse({'json_data' : json_data})

    return JsonResponse({'error': 'Parameters missing'})

@login_required(login_url='/tool/accounts/login/')
def save_review(request, author_id=0, work_id=0):

    
    if request.method == 'POST':
        review_form = ReviewForm(request.POST) 

        review = review_form['review'].value()
        author = Author.objects.get(id=author_id)
        author_name = author.data['name']
        author_iri = author.data['iri']
        work = Work.objects.get(id=work_id)
        work_title = work.data['title']
        work_iri = work.data['iri']

        lemma = Lemma.objects.get(data__lemma__autore=author_iri, data__lemma__opera=work_iri)
        json_data = lemma.data
        print(review)

        if review_form.is_valid():
            json_data["lemma"]["review"] = review
        else:
            json_data["lemma"]["review"] = ""


        Lemma.objects.filter(data__lemma__autore=author_iri, data__lemma__opera=work_iri).update(data=json_data)
        return JsonResponse({'json_data' : json_data})

    return JsonResponse({'error': 'Parameters missing'})

@login_required(login_url='/tool/accounts/login/')
def save_author(request, author_id=0, work_id=0):

    
    if request.method == 'POST':
        author_form = AuthorForm(request.POST) 

        author_iri = author_form['name_iri'].value()
        author = Author.objects.get(data__iri=author_iri)
        author.data['name'] = author_form['name'].value()
        alias_string = author_form['alias'].value()
        author.data['alias'] = alias_string.split(";")
        birth_death = author_form['birth_death'].value()
        floruit = author_form['floruit'].value()
        bishop = author_form['bishop'].value()

        datazione = {}
        errors = []
        check_date_birth = True
        check_date_death = True
        check_date_floruit = True
        check_date_bishop = True
        date_life = True
        

        if birth_death:
            
            uncertainty_birth = author_form['uncertainty_birth'].value()
            post_birth = author_form['post_birth'].value()
            ante_birth = author_form['ante_birth'].value()
            saec_birth = author_form['saec_birth'].value()
            date_birth_start = author_form['date_birth_start'].value()
            date_birth_end = author_form['date_birth_end'].value()

            uncertainty_death = author_form['uncertainty_death'].value()
            post_death = author_form['post_death'].value()
            ante_death = author_form['ante_death'].value()
            saec_death = author_form['saec_death'].value()
            date_death_start = author_form['date_death_start'].value()
            date_death_end = author_form['date_death_end'].value()

            vita = {}
            dataNascita = {}
            dataInizioNascita = {}
            dataFineNascita = {}
            dataNascita['incertezza'] = uncertainty_birth
            dataNascita['post'] = post_birth
            dataNascita['ante'] = ante_birth
            dataNascita['secolo'] = saec_birth
            dataInizioNascita['data'] = date_birth_start
            dataFineNascita['data'] = date_birth_end
            dataNascita['dataInizio'] = dataInizioNascita
            dataNascita['dataFine'] = dataFineNascita
            vita['dataNascita'] = dataNascita

            dataMorte = {}
            dataInizioMorte = {}
            dataFineMorte = {}
            dataMorte['incertezza'] = uncertainty_death
            dataMorte['post'] = post_death
            dataMorte['ante'] = ante_death
            dataMorte['secolo'] = saec_death
            dataInizioMorte['data'] = date_death_start
            dataFineMorte['data'] = date_death_end
            dataMorte['dataInizio'] = dataInizioMorte
            dataMorte['dataFine'] = dataFineMorte
            vita['dataMorte'] = dataMorte
            

            
            check_date_birth, message_birth = check_validity_date(date_birth_start, date_birth_end, uncertainty_birth, ante_birth, post_birth, saec_birth)
            check_date_death, message_death = check_validity_date(date_death_start, date_death_end, uncertainty_death, ante_death, post_death, saec_death)

            date_life = True
            if not(check_date_birth) and not(check_date_death):
                errors.append({'date_birth': [message_birth]})
                errors.append({'date_death': [message_death]})
                date_life = False
            elif not(check_date_birth) and check_date_death:
                if date_birth_start != "":
                    errors.append({'date_birth': [message_birth]})
                    date_life = False
            elif check_date_birth and not(check_date_death):
                if date_death_start != "":
                    errors.append({'date_death': [message_death]})
                    date_life = False
                
            
            datazione['vita'] = vita

        if floruit:

            uncertainty_floruit = author_form['uncertainty_floruit'].value()
            post_floruit = author_form['post_floruit'].value()
            ante_floruit = author_form['ante_floruit'].value()
            saec_floruit = author_form['saec_floruit'].value()
            date_floruit_start = author_form['date_floruit_start'].value()
            date_floruit_end = author_form['date_floruit_end'].value()

            dataFloruit = {}
            dataInizioFloruit = {}
            dataFineFloruit = {}
            dataFloruit['incertezza'] = uncertainty_floruit
            dataFloruit['post'] = post_floruit
            dataFloruit['ante'] = ante_floruit
            dataFloruit['secolo'] = saec_floruit
            dataInizioFloruit['data'] = date_floruit_start
            dataFineFloruit['data'] = date_floruit_end
            dataFloruit['dataInizio'] = dataInizioFloruit
            dataFloruit['dataFine'] = dataFineFloruit
            # datazione['floruit'] = dataFloruit

            check_date_floruit, message_floruit = check_validity_date(date_floruit_start, date_floruit_end, uncertainty_floruit, ante_floruit, post_floruit, saec_floruit)
            if check_date_floruit:
                datazione['floruit'] = dataFloruit
            else:
                errors.append({'date_floruit': [message_floruit]})


        if bishop:

            uncertainty_bishop = author_form['uncertainty_bishop'].value()
            post_bishop = author_form['post_bishop'].value()
            ante_bishop = author_form['ante_bishop'].value()
            saec_bishop = author_form['saec_bishop'].value()
            date_bishop_start = author_form['date_bishop_start'].value()
            date_bishop_end = author_form['date_bishop_end'].value()


            dataVescovo = {}
            dataInizioVescovo = {}
            dataFineVescovo = {}
            dataVescovo['incertezza'] = uncertainty_bishop
            dataVescovo['post'] = post_bishop
            dataVescovo['ante'] = ante_bishop
            dataVescovo['secolo'] = saec_bishop
            dataInizioVescovo['data'] = date_bishop_start
            dataFineVescovo['data'] = date_bishop_end
            dataVescovo['dataInizio'] = dataInizioVescovo
            dataVescovo['dataFine'] = dataFineVescovo
            # datazione['vescovo'] = dataVescovo

            check_date_bishop, message_bishop = check_validity_date(date_bishop_start, date_bishop_end, uncertainty_bishop, ante_bishop, post_bishop, saec_bishop)
            if check_date_bishop:
                datazione['vescovo'] = dataVescovo
            else:
                errors.append({'date_bishop': [message_bishop]})
                


        

        if date_life and check_date_bishop and check_date_floruit:
            author.data['datazione'] = datazione
            string_datazione = toStringDatazione(datazione)
            author.data['stringDatazione'] = string_datazione
            json_data = author.data
            Author.objects.filter(data__iri=author_iri).update(data=json_data)
            return JsonResponse({'success': True, 'json_data' : json_data})
        else:
            return JsonResponse({'success': False, 'errors' : errors})
        

    return JsonResponse({'error': 'Parameters missing'})

@login_required(login_url='/tool/accounts/login/')
def save_work(request, author_id=0, work_id=0):

    
    if request.method == 'POST':
        work_form = WorkForm(request.POST) 

        work_iri = work_form['title_iri'].value()
        work = Work.objects.get(data__iri=work_iri)
        work.data['title'] = work_form['title'].value()
        alias_string = work_form['alias'].value()
        work.data['alias'] = alias_string.split(";")

        
        json_data = work.data

        Work.objects.filter(data__iri=work_iri).update(data=json_data)
        return JsonResponse({'json_data' : json_data})

    return JsonResponse({'error': 'Parameters missing'})


@login_required(login_url='/tool/accounts/login/')
def save_source(request):

    
    if request.method == 'POST':
        source_json = j.loads(request.body)
        print(source_json['id'])
        # work_form = WorkForm(request.POST) 
        
        source = Source.objects.get(pk=source_json['id'])
        print(source.data)
        source.data['name'] = source_json['name']
        source.data['description'] = source_json['description']

        
        json_data = source.data

        Source.objects.filter(pk=source_json['id']).update(data=json_data)
        return JsonResponse({'json_data' : json_data})

    return JsonResponse({'error': 'Parameters missing'})

@login_required(login_url='/tool/accounts/login/')
def delete_source(request):

    
    if request.method == 'POST':
        source_json = j.loads(request.body)
        print(source_json['id'])
        s_id = source_json['id']
        # work_form = WorkForm(request.POST) 
        Source.objects.filter(pk=s_id).delete()
        # source = Source.objects.get(pk=source_json['id'])
        # print(source.data)
        # source.data['name'] = source_json['name']
        # source.data['description'] = source_json['description']

        
        # json_data = source.data

        # Source.objects.filter(pk=source_json['id']).update(data=json_data)
        return JsonResponse({'id' : s_id})

    return JsonResponse({'error': 'Parameters missing'})

@login_required(login_url='/tool/accounts/login/')
def check_source(request):

    
    if request.method == 'POST':
        source_json = j.loads(request.body)
        # print(source_json['id'])
        s_id = source_json['id']
        # work_form = WorkForm(request.POST) 
        source = Source.objects.get(pk=source_json['id'])
        # print(source.data['iri'])
        iri = source.data['iri']
        # Lemma.objects.filter(data__Lemma__Manoscritti__contains=[[{"fonti": contains }]])
        check_manuscript = False
        check_print_edition = False
        mans = Lemma.objects.filter(data__lemma__manoscritti__contains=[{'fonti': [{'iri': iri}]}])
        mans_output_list = []
        # print(mans)
        if(mans):
            mans_list = mans.values('data__lemma__opera', 'data__lemma__autore').order_by('data__lemma__autore')
            for obj in mans_list:
                work = Work.objects.get(data__iri=obj['data__lemma__opera'])
                work_title = work.data['title']
                author = Author.objects.get(data__iri=obj['data__lemma__autore'])
                author_name = author.data['name']
                mans_output_list.append({'work_title': work_title, 'author_name': author_name})
            
            check_manuscript = True
        else:
            check_manuscript = False
        
        prins_output_list = []
        prins = Lemma.objects.filter(data__lemma__edizioniStampa__contains=[{'fontiSecondarie': [{'iri': iri}]}])
        if(prins):
            prins_list = prins.values('data__lemma__opera', 'data__lemma__autore').order_by('data__lemma__autore')
            for obj in prins_list:
                work = Work.objects.get(data__iri=obj['data__lemma__opera'])
                work_title = work.data['title']
                author = Author.objects.get(data__iri=obj['data__lemma__autore'])
                author_name = author.data['name']
                prins_output_list.append({'work_title': work_title, 'author_name': author_name})
            check_print_edition = True
        else:
            check_print_edition = False
            
        if(check_manuscript or check_print_edition):
            return JsonResponse({'check' : True, 'manuscrips': mans_output_list, 'print_editions': prins_output_list})
        else:
            return JsonResponse({'check' : False, 'manuscrips': mans_output_list, 'print_editions': prins_output_list})
        # source.data['name'] = source_json['name']
        # source.data['description'] = source_json['description']

        
        # json_data = source.data

        # Source.objects.filter(pk=source_json['id']).update(data=json_data)
        return JsonResponse({'id' : s_id})

    return JsonResponse({'error': 'Parameters missing'})

# Author autocomplete
# @login_required
def author_autocomplete(request):
    
    if request.GET.get('q'):
        query = request.GET['q']
        matches = Author.objects.filter(data__name__icontains=query)[:10]
    else:
        matches = Author.objects.all()[:10]
    dataDict = [{'id': obj.data['iri'],
                'text': obj.data['name']} for obj in matches]
    return JsonResponse(dataDict, safe=False)


# Work autocomplete
#@login_required
def work_autocomplete(request):
    
    if request.GET.get('q'):
        query = request.GET['q']
        if '$$' in query:
                queryElements = query.split('$$')
                if len(queryElements) > 1:
                          matches = Work.objects.filter(data__author=queryElements[0],
                                    data__title__icontains=queryElements[1])[:10]
                else:
                          matches = Work.objects.filter(data__author=queryElements[0])[:10]
        else:
                matches = Work.objects.filter(data__title__icontains=query)[:10]
    else:
        matches = Work.objects.all()[:10]
    dataDict = [{'id': obj.data['iri'],
                'text': obj.data['title'],
                'author': obj.data['author']} for obj in matches]
    return JsonResponse(dataDict, safe=False)


# Area autocomplete
#@login_required
def area_autocomplete(request):
    
    if request.GET.get('q'):
        query = request.GET['q']
        matches = Genre.objects.filter(data__name__istartswith=query)[:10]
    else:
        matches = Genre.objects.all()[:10]
    dataDict = [{'id': obj.data['iri'],
                'text': obj.data['name']} for obj in matches]
    return JsonResponse(dataDict, safe=False)

# library autocomplete
#@login_required
def library_autocomplete(request):
    
     #cesare 
    # ustoken=request.session.get('gcube-token')
    # myuser =  authenticate(ustoken)
    # if myuser==None:
    #     raise Http404("Token not valid, access denied")
    #\cesare
    if request.GET.get('q'):
        query = request.GET['q']
        if '$$' in query:
                queryElements = query.split('$$')
                if len(queryElements) > 1:
                          matches = Library.objects.filter(data__place=queryElements[0],
                                    data__name__icontains=queryElements[1])[:10]
                else:
                          matches = Library.objects.filter(data__place=queryElements[0])[:10]
        else:
                matches = Library.objects.filter(data__name__icontains=query)[:10]
    else:
        matches = Library.objects.all()[:10]
    dataDict = [{'id': obj.data['iri'],
                'text': obj.data['name']} for obj in matches]
    return JsonResponse(dataDict, safe=False)
    

# Place autocomplete
# @login_required
def place_autocomplete(request):


    if request.GET.get('q'):
        query = request.GET['q']
        matches = Place.objects.filter(data__name__istartswith=query)[:10]
    else:
        matches = Place.objects.all()[:10]
    dataDict = [{'id': obj.data['iri'],
                'text': obj.data['name']} for obj in matches]
    return JsonResponse(dataDict, safe=False)

# Source autocomplete
# @login_required
def source_autocomplete(request):
    
    if request.GET.get('q'):
        query = request.GET['q']
        matches = Source.objects.filter(data__name__icontains=query)[:10]
    else:
        matches = Source.objects.all()[:10]
    dataDict = [{'id': obj.data['iri'],
                'text': obj.data['name']} for obj in matches]
    return JsonResponse(dataDict, safe=False)


# Make autocomplete response
def make_autocomplete_response(obj):
    # Response contains data field of object
    response = obj.data

    # Autocomplete expects these two fields
    response['id'] = obj.data['iri']
    response['text'] = obj.data['name'] if 'name' in obj.data else obj.data['title']

    # Type is needed to distinguish entities
    response['type'] = obj.__class__.__name__.lower()

    return response


# View for IRI resolution
#@login_required
def entity_from_iri(request):

    if request.GET.get('iri'):
        iri = request.GET['iri']
        obj = None
        for model in [Lemma, Author, Work, Place, Genre, Place, Library, Source]:
            try:
                obj = model.objects.get(data__iri=iri)
            except model.DoesNotExist:
                pass
        if obj:
            response = make_autocomplete_response(obj)

            return JsonResponse(response)
        else:
            return JsonResponse({'error': 'IRI not found in database'})
    return JsonResponse({'error': 'Parameters missing'})


def get_names(request):

    if request.GET.get('user'):
        user = request.GET['user']
        obj = None
        try:
            obj = User.objects.get(username=user)
        except model.DoesNotExist:
            pass
        if obj:
            response = {"first_name": obj.first_name, "last_name": obj.last_name}

            return JsonResponse(response)
        else:
            return JsonResponse({'error': 'IRI not found in database'})
    return JsonResponse({'error': 'Parameters missing'})


# Insert author into DB
def insert_wd_author(iri, results):
    data = {'iri': iri, 'name': results[0]['itemLabel']['value']}
    obj = Author(data=data)
    obj.save()
    return obj

# Insert work into DB
def insert_wd_work(iri, results):
    author_iri = ANONYMOUS_IRI # default: anonymous
    if 'author' in results[0]:
        author_iri = results[0]['author']['value']
        try:
            author = Author.objects.get(data__iri=author_iri)
        except Author.DoesNotExist:
            make_author_query(author_iri)
    data = {'iri': iri, 'title': results[0]['itemLabel']['value'], 'author': author_iri}
    obj = Work(data=data)
    obj.save()
    return obj

# Insert library into DB
def insert_wd_library(iri, results):
    try:
        res = re.findall(r'\(.*?\)', results[0]['coord']['value'])
        coord = res[0].split()
        lat = coord[1][:-1]
        lon = coord[0][1:]
    except:
        lat = ""
        lon = ""
    if 'place' in results[0]:
        place_iri = results[0]['place']['value']
        try:
            place = Place.objects.get(data__iri=place_iri)
        except Place.DoesNotExist:
            make_place_query(place_iri)
    else: 
        place_iri=""
        
    try:
        country = results[0]['country']['value']
    except:
        country = ""
        
    
    data = {'iri': iri, 'name': results[0]['itemLabel']['value'], 'place': place_iri, 'country': country, 'lat': lat, 'lon': lon}
    print(data)
    obj = Library(data=data)
    obj.save()
    return obj

# Insert place into DB
def insert_wd_place(iri, results):
    try:
        res = re.findall(r'\(.*?\)', results[0]['coord']['value'])
        coord = res[0].split()
        lat = coord[1][:-1]
        lon = coord[0][1:]
    except:
        lat = ""
        lon = ""
    try:
        country = results[0]['country']['value']
    except:
        country = "" 
    data = {'iri': iri, 'name': results[0]['itemLabel']['value'], 'country': country, 'lat': lat, 'lon': lon}
    print(data)
    obj = Place(data=data)
    obj.save()
    return obj

# Insert topography into DB
def insert_wd_topography(iri, results):
    try:
        res = re.findall(r'\(.*?\)', results[0]['coord']['value'])
        coord = res[0].split()
        lat = coord[1][:-1]
        lon = coord[0][1:]
    except:
        lat = ""
        lon = ""
    try:
        country = results[0]['country']['value']
    except:
        country = "" 
    data = {'iri': iri, 'name': results[0]['itemLabel']['value'], 'country': country, 'lat': lat, 'lon': lon}
    print(data)
    obj = Place(data=data)
    obj.save()
    return obj

# Make Wikidata request
def wikidata_request(query):
    # Request URL
    request_url = f'{WD_SPARQL_URL}{urllib.parse.quote(query)}&format=json'

    # Make request
    with urllib.request.urlopen(request_url) as response:
        results = j.loads(response.read())['results']['bindings']
        return results
    return None

# Make Wikidata query for author
def make_author_query(iri):
    qid = iri.split('/entity/')[1] # Wikidata ID starting with Q

    # Wikidata query
    wd_query = f'\nSELECT ?item ?itemLabel \n\
                WHERE {{ hint:Query hint:optimizer "None". \n\
                    BIND (wd:{qid} AS ?item) \n\
                    SERVICE wikibase:label {{ \n\
                        bd:serviceParam wikibase:language "[AUTO_LANGUAGE],it,la,en" . \n\
                    }} \n\
                }}'

    # TODO import aliases for author
    # TODO import all works created by the author

    # Run Wikidata query
    query_results = wikidata_request(wd_query)

    if query_results:
        new_obj = insert_wd_author(iri, query_results)

        if new_obj:
            response = make_autocomplete_response(new_obj)

            return JsonResponse(response)
        else:
            return JsonResponse({'error': 'Error while adding to DB'})
    return JsonResponse({'error': 'Error in Wikidata query'})

# Make Wikidata query for work
def make_work_query(iri):
    qid = iri.split('/entity/')[1] # Wikidata ID starting with Q

    # Wikidata query
    wd_query = f'\nSELECT ?item ?itemLabel ?author ?authorLabel \n\
                WHERE {{ hint:Query hint:optimizer "None". \n\
                    BIND (wd:{qid} AS ?item) \n\
                    OPTIONAL {{?item wdt:P50 ?author}} \n\
                    SERVICE wikibase:label {{ \n\
                        bd:serviceParam wikibase:language "[AUTO_LANGUAGE],la,it,en" . \n\
                    }} \n\
                }}'

    # TODO import aliases for work

    # Run Wikidata query
    query_results = wikidata_request(wd_query)

    if query_results:
        new_obj = insert_wd_work(iri, query_results)

        if new_obj:
            response = make_autocomplete_response(new_obj)

            return JsonResponse(response)
        else:
            return JsonResponse({'error': 'Error while adding to DB'})
    return JsonResponse({'error': 'Error in Wikidata query'})

# Make Wikidata query for library
def make_library_query(iri):
    qid = iri.split('/entity/')[1] # Wikidata ID starting with Q

    # Wikidata query
    wd_query = f'\nSELECT ?item ?itemLabel ?coord ?country ?place \n\
                WHERE {{ hint:Query hint:optimizer "None". \n\
                    BIND (wd:{qid} AS ?item) \n\
                    OPTIONAL {{?item wdt:P625 ?coord}} \n\
		            OPTIONAL {{?item wdt:P17 ?country}} \n\
		            OPTIONAL {{?item wdt:P131 ?place}} \n\
                    SERVICE wikibase:label {{ \n\
                        bd:serviceParam wikibase:language "[AUTO_LANGUAGE],it,la,en" . \n\
                    }} \n\
                }}'

    # TODO import aliases for library

    # Run Wikidata query
    query_results = wikidata_request(wd_query)

    if query_results:
        new_obj = insert_wd_library(iri, query_results)

        if new_obj:
            response = make_autocomplete_response(new_obj)

            return JsonResponse(response)
        else:
            return JsonResponse({'error': 'Error while adding to DB'})
    return JsonResponse({'error': 'Error in Wikidata query'})

# Make Wikidata query for place
def make_place_query(iri):
    qid = iri.split('/entity/')[1] # Wikidata ID starting with Q

    # Wikidata query
    wd_query = f'\nSELECT ?item ?itemLabel ?coord ?country \n\
                WHERE {{ hint:Query hint:optimizer "None". \n\
                    BIND (wd:{qid} AS ?item) \n\
                    OPTIONAL{{ \n\
                        ?item wdt:P17 ?country. \n\
                    }} \n\
                    OPTIONAL{{ \n\
                        ?item wdt:P625 ?coord. \n\
                    }} \n\
                    SERVICE wikibase:label {{ \n\
                        bd:serviceParam wikibase:language "[AUTO_LANGUAGE],it,la,en" . \n\
                    }} \n\
                }}'

    # TODO import aliases for place

    # Run Wikidata query
    query_results = wikidata_request(wd_query)

    if query_results:
        new_obj = insert_wd_place(iri, query_results)

        if new_obj:
            response = make_autocomplete_response(new_obj)

            return JsonResponse(response)
        else:
            return JsonResponse({'error': 'Error while adding to DB'})
    return JsonResponse({'error': 'Error in Wikidata query'})

# Make Wikidata query for topography
def make_topography_query(iri):
    qid = iri.split('/entity/')[1] # Wikidata ID starting with Q

    # Wikidata query
    wd_query = f'\nSELECT ?item ?itemLabel ?coord ?country \n\
                WHERE {{ hint:Query hint:optimizer "None". \n\
                    BIND (wd:{qid} AS ?item) \n\
                    OPTIONAL{{ \n\
                        ?item wdt:P17 ?country. \n\
                    }} \n\
                    OPTIONAL{{ \n\
                        ?item wdt:P625 ?coord. \n\
                    }} \n\
                    SERVICE wikibase:label {{ \n\
                        bd:serviceParam wikibase:language "[AUTO_LANGUAGE],it,la,en" . \n\
                    }} \n\
                }}'

    # TODO import aliases for place

    # Run Wikidata query
    query_results = wikidata_request(wd_query)

    if query_results:
        new_obj = insert_wd_topography(iri, query_results)

    return JsonResponse({'error': 'Error in Wikidata query'})

# Import Wikidata author
def import_wikidata_author(request):

    iri = request.GET.get('iri')
    if iri:
        try:
            obj = Author.objects.get(data__iri=iri)
        except Author.DoesNotExist:
            # If this is a Wikidata IRI...
            if iri.startswith(WD_ENTITY_URL):
                return make_author_query(iri)
            else:
                return JsonResponse({'error': 'IRI is not from Wikidata'})
        else:
            response = make_autocomplete_response(obj)

            return JsonResponse(response)
    return JsonResponse({'error': 'Parameters missing'})

# Import Wikidata work
def import_wikidata_work(request):

    iri = request.GET.get('iri')
    if iri:
        try:
            obj = Work.objects.get(data__iri=iri)
        except Work.DoesNotExist:
            # If this is a Wikidata IRI...
            if iri.startswith(WD_ENTITY_URL):
                return make_work_query(iri)
            else:
                return JsonResponse({'error': 'IRI is not from Wikidata'})
        else:
            response = make_autocomplete_response(obj)

            return JsonResponse(response)
    return JsonResponse({'error': 'Parameters missing'})

# Import Wikidata library
def import_wikidata_library(request):

    iri = request.GET.get('iri')
    if iri:
        try:
            obj = Library.objects.get(data__iri=iri)
        except Library.DoesNotExist:
            # If this is a Wikidata IRI...
            if iri.startswith(WD_ENTITY_URL):
                return make_library_query(iri)
            else:
                return JsonResponse({'error': 'IRI is not from Wikidata'})
        else:
            response = make_autocomplete_response(obj)

            return JsonResponse(response)
    return JsonResponse({'error': 'Parameters missing'})

# Import Wikidata place
def import_wikidata_place(request):

    iri = request.GET.get('iri')
    if iri:
        try:
            obj = Place.objects.get(data__iri=iri)
        except Place.DoesNotExist:
            # If this is a Wikidata IRI...
            if iri.startswith(WD_ENTITY_URL):
                return make_place_query(iri)
            else:
                return JsonResponse({'error': 'IRI is not from Wikidata'})
        else:
            response = make_autocomplete_response(obj)

            return JsonResponse(response)
    return JsonResponse({'error': 'Parameters missing'})

# Add user-defined author
def add_new_author(request):

    name = request.GET.get('name')
    desc = request.GET.get('desc')
    if name:
        iri = f'{IMAGO_BASE_IRI}{slugify(name)}'
        try:
            obj = Author.objects.get(data__iri=iri)
        except Author.DoesNotExist:
            data = {'iri': iri, 'name': name, 'description': desc}
            data['user'] = True # to distinguish user-defined authors
            obj = Author(data=data)
            obj.save()
        finally:
            response = make_autocomplete_response(obj)
            return JsonResponse(response)
    return JsonResponse({'error': 'Parameters missing'})

# Add user-defined work
def add_new_work(request):
   
    title = request.GET.get('title')
    desc = request.GET.get('desc')
    if title:
        iri = f'{IMAGO_BASE_IRI}{slugify(title)}'
        try:
            obj = Work.objects.get(data__iri=iri)
        except Work.DoesNotExist:
            data = {'iri': iri, 'title': title, 'description': desc}
            data['author'] = ANONYMOUS_IRI # TODO let user add author (and area?)
            data['user'] = True # to distinguish user-defined works
            obj = Work(data=data)
            obj.save()
        finally:
            response = make_autocomplete_response(obj)
            return JsonResponse(response)
    return JsonResponse({'error': 'Parameters missing'})

# Add user-defined library
def add_new_library(request):

    name = request.GET.get('name')
    desc = request.GET.get('desc')
    if name:
        iri = f'{IMAGO_BASE_IRI}{slugify(name)}'
        try:
            obj = Library.objects.get(data__iri=iri)
        except Library.DoesNotExist:
            data = {'iri': iri, 'name': name, 'description': desc}
            data['user'] = True # to distinguish user-defined works
            obj = Library(data=data)
            obj.save()
        finally:
            response = make_autocomplete_response(obj)
            return JsonResponse(response)
    return JsonResponse({'error': 'Parameters missing'})

# Add user-defined place
def add_new_place(request):
    
    name = request.GET.get('name')
    desc = request.GET.get('desc')
    if name:
        iri = f'{IMAGO_BASE_IRI}{slugify(name)}'
        try:
            obj = Place.objects.get(data__iri=iri)
        except Place.DoesNotExist:
            data = {'iri': iri, 'name': name, 'description': desc}
            data['user'] = True # to distinguish user-defined works
            obj = Place(data=data)
            obj.save()
        finally:
            response = make_autocomplete_response(obj)
            return JsonResponse(response)
    return JsonResponse({'error': 'Parameters missing'})

# Add user-defined source
def add_new_source(request):
    
    name_raw = request.GET.get('name')
    name = name_raw.strip()
    desc = request.GET.get('desc')
    if name:
        iri = f'{IMAGO_BIBLIO_IRI}{slugify(name)}'
        try:
            obj = Source.objects.get(data__iri=iri)
            exist = True
        except Source.DoesNotExist:
            exist = False
            data = {'iri': iri, 'name': name, 'description': desc}
            data['user'] = True # to distinguish user-defined works
            obj = Source(data=data)
            obj.save()
        finally:
            response = make_autocomplete_response(obj)
            if exist:
                response['exist'] = True
            else:
                response['exist'] = False
            print(response)
            return JsonResponse(response)
    return JsonResponse({'error': 'Parameters missing'})


def export_pdf(request):

    sources = Source.objects.all() # Extract all sources

    source_list = []
    # letter = request.GET.get('page')
    for obj in sources:
        source_list.append({'name': obj.data['name'], 'description': obj.data['description'], 'iri': obj.data['iri']})
    
    # Rendered
    html_string = render_to_string('annotation/bibliografia.html', {'sources': source_list})
    html = HTML(string=html_string)
    result = html.write_pdf()

    # Creating http response
    response = HttpResponse(content_type='application/pdf;')
    response['Content-Disposition'] = 'inline; filename=list_people.pdf'
    response['Content-Transfer-Encoding'] = 'binary'
    with tempfile.NamedTemporaryFile(delete=True) as output:
        output.write(result)
        output.flush()
        output = open(output.name, 'rb')
        response.write(output.read())

    return response


    