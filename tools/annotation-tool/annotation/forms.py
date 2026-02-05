"""
| **Project**: HDN
| **Package**: Backend
| **Title**: Forms in Django
| **File**: forms.py
| **Path**: annotation/
| **Type**: python
| **Started**: 2020-04-26
| **Author(s)**: Nicolo' Pratelli & Daniele Metilli
| **State**: in use

Version history.

2020-09-16 Nicolo' Pratelli
    * First version

2020-09-18 Nicolo' Pratelli
    * Added LemmaForm

2020-09-21 Nicolo' Pratelli
    * Added ManuscriptForm and PrintEdition form

2020-09-25 Nicolo' Pratelli
    * Addess autocomplete

2022-09-14 Nicolo' Pratelli
    * Added Abstract Form


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
from django import forms

# Type of dates
DATE_TYPE = (
    ("birth_death","Nascita/Morte"),
    ("floruit","Floruit"),
    ("vescovo", "Vescovo"),
)

# Work type choices
WORK_TYPE = (
    ("", "---------"),
    ("MANOSCRITTO", "Manoscritto"),
    ("EDIZIONE A STAMPA", "Edizione a stampa"),
)

# Ecdotic tipology choices
ECDOTIC_TYPOLOGY = (
    ("", "---------"),
    ("EDIZIONE CRITICA", "Edizione critica"),
    ("EDIZIONE CRITICA COMMENTATA", "Edizione critica commentata"),
    ("EDIZIONE CRITICA COMMENTATA CON TRADUZIONE", "Edizione critica commentata con traduzione"),
    ("EDIZIONE SEMIDIPLOMATICA O INTERPRETATIVA", "Edizione semidiplomatica o interpretativa"),
    ("EDIZIONE CRITICA CON TRADUZIONE", "Edizione critica con traduzione"),
    ("EDIZIONE DIPLOMATICA", "Edizione diplomatica"),
    ("EDIZIONE COMMENTATA", "Edizione commentata"),
    ("EDIZIONE CON TRADUZIONE", "Edizione con traduzione"),
    ("EDIZIONE COMMENTATA CON TRADUZIONE", "Edizione commentata con traduzione"),
)

# Edition choices
EDITION = (
    ("", "---------"),
    ("PRIMA EDIZIONE / EDITIO PRINCEPS", "Prima edizione / editio princeps"),
    ("RISTAMPA", "Ristampa"),
    ("FACSIMILE", "Facsimile"),
    ("ANASTATICA", "Anastatica"),
)


class LemmaForm(forms.Form):
    '''
    This class represent the form of the lemma

    Attributes:
        lemma_id    id of the lemma
        author      name of the author
        author_iri  iri of the name of the author
        work        title of the work
        work_iri    iri of the title of the work
        work_type   work type (manuscript, print edition)
    '''

    # id of the lemma
    # lemma_id = forms.CharField(required=False,
    #                            widget=forms.HiddenInput())

    # name of the author
    author = forms.CharField(label="Autore",
                             required=True,
                             max_length=100,
                             widget=forms.TextInput(
                                 attrs={
                                     "class": "autocomplete",
                                     "autocomplete" : "off",
                                     "data-url": "../author",
                                     "data-toggle": "popover",
                                     "data-trigger": "focus",
                                     "data-noresults-text": "Nessun risultato",
                                     "title": "Autore",
                                     "data-content": "Seleziona l'autore. Inserisci i primi \
                                                      caratteri del nome dell'autore per \
                                                      filtrare i risultati. Se non trovi \
                                                      l'autore nella lista, \
                                                      <a href='#' class='add-author-btn'>clicca qui</a> \
                                                      per aggiungerne uno nuovo."
                                 }))

    # iri of the name of the author
    author_iri = forms.CharField(required=False,
                                 widget=forms.HiddenInput())

    # title of the work
    work = forms.CharField(label="Opera",
                           required=True,
                           max_length=100,
                           widget=forms.TextInput(
                               attrs={
                                   "class": "autocomplete",
                                   "autocomplete" : "off",
                                   "data-url": "../work",
                                   "data-toggle": "popover",
                                   "data-trigger": "focus",
                                   "data-noresults-text": "Nessun risultato",
                                   "title": "Opera",
                                   "data-content": "Seleziona l'opera. Inserisci i primi \
                                                    caratteri del titolo della fonte per \
                                                    filtrare i risultati. Se non trovi \
                                                    la fonte nella lista, \
                                                    <a href='#' class='add-work-btn'>clicca qui</a> \
                                                    per aggiungerne una nuova."
                               }))

    # iri of the title of the work
    work_iri = forms.CharField(required=False,
                               widget=forms.HiddenInput())
class AuthorForm(forms.Form):
    """Form to manage author data
       - Name
       - Date of birth
       - Date of death 
    """

    name = forms.CharField(required=False,
                           max_length=100,
                           widget=forms.TextInput())
    
    name_iri = forms.CharField(required=False, widget=forms.HiddenInput())

    alias = forms.CharField(required=False,
                           max_length=200,
                           widget=forms.TextInput())

    # date_type = forms.ChoiceField(choices=DATE_TYPE, widget=forms.RadioSelect)

    birth_death = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={"class": "form-check-input"}))
    floruit = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={"class": "form-check-input"}))
    bishop = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={"class": "form-check-input"}))

    uncertainty_floruit = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={"class": "form-check-input"}))
    ante_floruit = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={"class": "form-check-input"}))
    post_floruit = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={"class": "form-check-input"}))
    saec_floruit = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={"class": "form-check-input"}))

    date_floruit_start = forms.CharField(required=False,
                                 max_length=10,
                                 widget=forms.TextInput(attrs={'placeholder': 'data inizio'}))
    
    date_floruit_end = forms.CharField(required=False,
                               max_length=10,
                               widget=forms.TextInput(attrs={'placeholder': 'data fine'}))

    uncertainty_bishop = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={"class": "form-check-input"}))
    ante_bishop = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={"class": "form-check-input"}))
    post_bishop = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={"class": "form-check-input"}))
    saec_bishop = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={"class": "form-check-input"}))

    date_bishop_start = forms.CharField(required=False,
                                 max_length=10,
                                 widget=forms.TextInput(attrs={'placeholder': 'data inizio'}))
    
    date_bishop_end = forms.CharField(required=False,
                               max_length=10,
                               widget=forms.TextInput(attrs={'placeholder': 'data fine'}))

    uncertainty_birth = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={"class": "form-check-input"}))
    ante_birth = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={"class": "form-check-input"}))
    post_birth = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={"class": "form-check-input"}))
    saec_birth = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={"class": "form-check-input"}))

    date_birth_start = forms.CharField(required=False,
                                       widget=forms.TextInput(attrs={'placeholder': 'data inizio'}))
    
    date_birth_end = forms.CharField(required=False,
                           max_length=10,
                           widget=forms.TextInput(attrs={'placeholder': 'data fine'}))

    uncertainty_death = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={"class": "form-check-input"}))   
    ante_death = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={"class": "form-check-input"}))
    post_death = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={"class": "form-check-input"}))
    saec_death = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={"class": "form-check-input"}))

    date_death_start = forms.CharField(required=False,
                max_length=10,
                widget=forms.TextInput(attrs={'placeholder': 'data inizio'}))

    date_death_end = forms.CharField(required=False,
                           max_length=10,
                           widget=forms.TextInput(attrs={'placeholder': 'data fine'}))

class WorkForm(forms.Form):
    """Form to manage work data
        - Title
        - Iri
        - Alias
    """

    title = forms.CharField(required=False,
                            max_length=100,
                            widget=forms.TextInput())

    title_iri = forms.CharField(required=False, widget=forms.HiddenInput())

    alias = forms.CharField(required=False,
                        max_length=200,
                        widget=forms.TextInput())  


class GenreForm(forms.Form):
    """Form for genre
    """
    
    genre = forms.CharField(required=False, 
                            max_length=100,
                            widget=forms.TextInput(
                                attrs={
                                    "class": "autocomplete",
                                    "autocomplete" : "off",
                                    "data-url": "../../../area",
                                    "data-toggle": "popover",
                                    "data-trigger": "focus",
                                    "data-noresults-text": "Nessun risultato",
                                    "title": "Area tematica",
                                    "data-content": "Seleziona l'area tematica. Inserisci i primi caratteri del \
                                                    nome dell'area per filtrare i risultati."
                                }))

    genre_iri = forms.CharField(required=False, widget=forms.HiddenInput(
        attrs={
                "class": "hidden-formset"
         }
    ))

class AbstractForm(forms.Form):
    """Form for abstract
    """
    abstract = forms.CharField(label="Abstract",
                               required=False,
                               widget=forms.Textarea(
                                   attrs={
                                        'rows': 3,
                                    }))

class ReviewForm(forms.Form):
    """Form for abstract
    """
    review = forms.BooleanField(label="Review",
                               required=False
                                )


class TopographyForm(forms.Form):
    """Form for individual topography

    The topography formset defines a form that can iterate multiple topographies in a single citation consisting of
    a text field with auto-completion for the topography name and a text field for the topography's iris, automatically
    completed by drawing the iris associated with that topography from the db.
    """
    # behind Dante's mention of a place a literary memory acts
    topography = forms.CharField(required=False, max_length=100,
        widget=forms.TextInput(
            attrs={
                "class": "autocomplete",
                "autocomplete" : "off",
                "data-url": "../../../place",
                "data-toggle": "popover",
                "data-trigger": "focus",
                "data-noresults-text": "Nessun risultato",
                "title": "Luogo",
                # "data-content": "If the place is not in Wikidata, \
                #                  switch to manual entry: \
                #                 <a href='#' class='add-place-btn'>click here</a> \
                #                 to add a new one."
                # "data-content": "Se hai inserito un nome parziale e la ricerca non \
                #                  restituisce risultati, prova a inserire più caratteri." \
                                #  Se il luogo non è presente in Wikidata, \
                                #  passa all'inserimento manuale: \
                                # <a href='#' class='add-place-btn'>clicca qui</a> \
                                # per aggiungerne uno nuovo."
                "data-content": "Seleziona il luogo citato. Inserisci i primi caratteri \
                                del luogo per filtrare i risultati. Se non trovi \
                                il luogo nella lista, <a href='#' class='add-place-btn'>clicca qui</a> \
                                per aggiungerne uno nuovo."
            }))
    # IRI of that place
    topography_iri = forms.CharField(required=False, widget=forms.HiddenInput(
         attrs={
                "class": "hidden-formset"
         }
    ))

class WorkTypeForm(forms.Form):
    '''
    This class represent the work type

    Fields:
        work_type                   name of the author as it is reported in the manuscript
    '''

    # work type (manuscript, print edition)
    work_type = forms.ChoiceField(label="Tipo scheda",
                                  choices=WORK_TYPE)

class ManuscriptForm(forms.Form):
    '''
    This class represent the form of manuscript

    Fields:
        munuscript_author           name of the author as it is reported in the manuscript
        manuscript_title            title of the work as it is reported in the manuscript
        library                     library in which the manuscript is stored
        library_iri                 iri of the library in which the manuscript is stored
        library_location            the location of the library
        library_location_iri        iri of the location of the library
        signature                   signature of the manuscript
        folios                      folios of the manuscript
        incipit_dedication_proem    the incipit dedication/proem
        explicit_dedication_proem   the explicit dedication/proem
        incipit_text                the incipit of the text
        explicit_text               the explicit of the text
        date                        date of manuscript
        secondary_sources           secondary sources
    '''

    # name of the author as it is reported in the manuscript
    manuscript_author = forms.CharField(label='Autore manoscritto',
                                        required=False,
                                        max_length=100,
                                        widget=forms.TextInput())

    # title of the work as it is reported in the manuscript
    manuscript_title = forms.CharField(label='Titolo manoscritto',
                                       required=False,
                                       max_length=100,
                                       widget=forms.TextInput())

    # the location of the library
    library_location = forms.CharField(label='Località biblioteca',
                                       required=False,
                                       max_length=100,
                                       widget=forms.TextInput(
                                       attrs={
                                            "class": "autocomplete",
                                            "autocomplete" : "off",
                                            "data-url": "../../../place",
                                            "data-toggle": "popover",
                                            "data-trigger": "focus",
                                            "data-noresults-text": "Nessun risultato",
                                            "title": "Localià biblioteca",
                                            "data-content": "Seleziona la località della biblioteca. \
                                                            Inserisci i primi \
                                                            caratteri del nome della località per \
                                                            filtrare i risultati. Se non trovi \
                                                            la località nella lista, \
                                                            <a href='#' class='add-location-btn'>clicca qui</a> \
                                                            per aggiungerne una nuova."
                                        }))

    # iri of the location of the library
    library_location_iri = forms.CharField(required=False,
                                           widget=forms.HiddenInput())

    # library in which the manuscript is stored
    library = forms.CharField(label='Biblioteca',
                              required=False,
                              max_length=100,
                              widget=forms.TextInput(
                                    attrs={
                                     "class": "autocomplete",
                                     "autocomplete" : "off",
                                     "data-url": "../../../library",
                                     "data-toggle": "popover",
                                     "data-trigger": "focus",
                                     "data-noresults-text": "Nessun risultato",
                                     "title": "Biblioteca",
                                     "data-content": "Seleziona la biblioteca. Inserisci i primi \
                                                      caratteri del nome della biblioteca per \
                                                      filtrare i risultati. Se non trovi \
                                                      la biblioteca nella lista, \
                                                      <a href='#' class='add-library-btn'>clicca qui</a> \
                                                      per aggiungerne una nuova."
                                 }))
                             
    # iri of the library in which the manuscript is stored
    library_iri = forms.CharField(required=False,
                                  widget=forms.HiddenInput())

    # signature of the manuscript
    signature = forms.CharField(label="Segnatura",
                                required=False,
                                max_length=100,
                                widget=forms.TextInput())

    # folios of the manuscript
    folios = forms.CharField(label="Fogli",
                             required=False,
                             max_length=100,
                             widget=forms.TextInput())

    # the incipit dedication/proem
    incipit_dedication_proem = forms.CharField(label="Incipit dedica/proemio",
                                               required=False,
                                               widget=forms.Textarea(
                                                   attrs={
                                                       'rows': 3,
                                                   }))

    # the explicit dedication/proem
    explicit_dedication_proem = forms.CharField(label="Explicit dedica/proemio",
                                                required=False,
                                                widget=forms.Textarea(
                                                    attrs={
                                                        'rows': 3,
                                                    }))

    # the incipit of the text
    incipit_text = forms.CharField(label="Incipit testo",
                                   required=False,
                                   widget=forms.Textarea(
                                       attrs={
                                           'rows': 3,
                                       }))

    # the explicit of the text
    explicit_text = forms.CharField(label="Explicit testo",
                                    required=False,
                                    widget=forms.Textarea(
                                        attrs={
                                            'rows': 3,
                                        }))

    # date of manuscript
    date = forms.CharField(label="Datazione",
                           required=False,
                           max_length=100,
                           widget=forms.TextInput())

    # the description of the decoration
    decoration = forms.CharField(label="Decorazione / apparato iconografico",
                                    required=False,
                                    widget=forms.Textarea(
                                        attrs={
                                            'rows': 3,
                                        }))

    # url of manurscipt
    url = forms.URLField(label="Link al manoscritto", help_text = "Per favore inserisci un url valido.", required=False)

    # url description of manurscipt
    url_description = forms.URLField(label="Link alla descrizione del manoscritto", help_text = "Per favore inserisci un url valido.", required=False)

    # secondary sources
    secondary_sources = forms.CharField(label="Fonti delle notizie",
                                        required=False,
                                        widget=forms.Textarea(
                                            attrs={
                                                'rows': 3,
                                            }))

    # notes
    notes = forms.CharField(label="Altre eventuali notizie",
                            required=False,
                            widget=forms.Textarea(
                                attrs={
                                    'rows': 3,
                                }))

class DateManuscriptForm(forms.Form):
    uncertainty_manuscript = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={"class": "form-check-input"}))
    ante_manuscript = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={"class": "form-check-input"}))
    post_manuscript = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={"class": "form-check-input"}))
    saec_manuscript = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={"class": "form-check-input"}))

    date_manuscript_start = forms.CharField(required=False,
                                 max_length=10,
                                 widget=forms.TextInput(attrs={'placeholder': 'data inizio'}))
    
    date_manuscript_end = forms.CharField(required=False,
                               max_length=10,
                               widget=forms.TextInput(attrs={'placeholder': 'data fine'}))

class DatePrintEditionForm(forms.Form):
    uncertainty_print_edition = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={"class": "form-check-input"}))
    ante_print_edition = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={"class": "form-check-input"}))
    post_print_edition = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={"class": "form-check-input"}))
    saec_print_edition = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={"class": "form-check-input"}))

    date_print_edition_start = forms.CharField(required=False,
                                 max_length=10,
                                 widget=forms.TextInput(attrs={'placeholder': 'data inizio'}))
    
    date_print_edition_end = forms.CharField(required=False,
                               max_length=10,
                               widget=forms.TextInput(attrs={'placeholder': 'data fine'}))


class PrintEditionForm(forms.Form):
    '''
    This class represent the form of print edition

    Fields:
        print_edition_author            name of the author as it is reported in the print edition
        print_edition_title             title of the work as it is reported in the print edition
        curator                         curator of the print edition
        place                           place in wich is printed the edition
        place_iri                       iri of the place in wich is printed the edition
        date                            date of the print edition
        editor                          Editor/Publisher of the print edition
        format_print_edition            format of the print edition
        pages                           number of pages of the print edition
        figures                         Information about figures
        notes                           notes
        prefatore                       author of the introduction (prefatore),
                                        dedications, introductions
        other_content                   other contents
        edition                         first edition, reprint
                                        (associated with the year of publication)
                                        facsimile and anastatica
        primary_sources                 primary sources
        ecdotic_typology                Critica, Diplomatica, Critica commentata,
                                        Critica commentata con traduzione,
                                        Semi-diplomatica o interpretativa,
                                        Commentata
        secondary_sources               secondary sources
    '''

    # name of the author as it is reported in the print edition
    print_edition_author = forms.CharField(label='Autore',
                                           required=False,
                                           max_length=100,
                                           widget=forms.TextInput())

    # title of the work as it is reported in the print edition
    print_edition_title = forms.CharField(label='Titolo',
                                          required=False,
                                          max_length=100,
                                          widget=forms.TextInput())

    # curator of the print edition
    curator = forms.CharField(label='Curatore',
                              required=False,
                              max_length=100,
                              widget=forms.TextInput())

    # place in wich is printed the edition
    place = forms.CharField(label='Luogo',
                            required=False,
                            max_length=100,
                            widget=forms.TextInput(
                            attrs={
                                "class": "autocomplete",
                                "autocomplete" : "off",
                                "data-url": "../../../place",
                                "data-toggle": "popover",
                                "data-trigger": "focus",
                                "data-noresults-text": "Nessun risultato",
                                "title": "Luogo",
                                # "data-content": "If the place is not in Wikidata, \
                                #                  switch to manual entry: \
                                #                 <a href='#' class='add-place-btn'>click here</a> \
                                #                 to add a new one."
                                # "data-content": "Se hai inserito un nome parziale e la ricerca non \
                                #                 restituisce risultati, prova a inserire più caratteri." \
                                                # Se il luogo non è presente in Wikidata, \
                                                # passa all'inserimento manuale: \
                                                # <a href='#' class='add-place-btn'>clicca qui</a> \
                                                # per aggiungerne uno nuovo."
                                "data-content": "Seleziona il luogo citato. Inserisci i primi caratteri \
                                                del luogo per filtrare i risultati. Se non trovi \
                                                il luogo nella lista, <a href='#' class='add-place-btn'>clicca qui</a> \
                                                per aggiungerne uno nuovo."
                            }))
    # iri of the place in wich is printed the edition
    place_iri = forms.CharField(required=False,
                                widget=forms.HiddenInput())

    # place as it is reported in the print edition
    print_edition_place = forms.CharField(label="Luogo come indicato nell'edizione",
                                           required=False,
                                           max_length=100,
                                           widget=forms.TextInput())
    
    # date of the print edition
    date = forms.CharField(label='Data',
                           required=False,
                           max_length=100,
                           widget=forms.TextInput())

    # Editor/Publisher of the print edition
    editor = forms.CharField(label='Tipografo / Casa editrice',
                             required=False,
                             max_length=100,
                             widget=forms.TextInput())

    # format of the print edition
    format_print_edition = forms.CharField(label="Formato",
                                           required=False,
                                           max_length=100,
                                           widget=forms.TextInput())

    # number of pages of the print edition
    pages = forms.CharField(label="Pagine",
                            required=False,
                            max_length=100,
                            widget=forms.TextInput())

    # Information about figures
    figures = forms.CharField(label="Illustrazioni",
                              required=False,
                              widget=forms.Textarea(
                                  attrs={
                                      'rows': 3,
                                  }))

    # notes
    notes = forms.CharField(label="Altre eventuali notizie",
                            required=False,
                            widget=forms.Textarea(
                                attrs={
                                    'rows': 3,
                                }))

    # author of the introduction (prefatore), dedications, introductions
    prefatore = forms.CharField(label="Prefatore ed eventuali dediche, \
                                       prefazioni o premesse all’edizione",
                                required=False,
                                widget=forms.Textarea(
                                    attrs={
                                        'rows': 3,
                                    }))

    # other contents
    other_content = forms.CharField(label="Altri contenuti",
                                    required=False,
                                    widget=forms.Textarea(
                                        attrs={
                                            'rows': 3,
                                        }))

    # first edition, reprint (associated with the year of publication) facsimile and anastatica
    edition = forms.ChoiceField(label="Prima edizione/ristampa",
                                required=False,
                                choices=EDITION)

    # date of the edition
    date_edition = forms.CharField(label='Data edizione',
                                   required=False,
                                   max_length=100,
                                   widget=forms.TextInput())

    # primary sources
    primary_sources = forms.CharField(label="Fonti dell’edizione",
                                      required=False,
                                      widget=forms.Textarea(
                                          attrs={
                                              'rows': 3,
                                          }))

    # ecdotic typology
    ecdotic_typology = forms.ChoiceField(label="Tipologia ecdotica dell’edizione",
                                         required=False,
                                         choices=ECDOTIC_TYPOLOGY)
    
    # language traduction
    language = forms.CharField(label='Lingua traduzione',
                                           required=False,
                                           max_length=100,
                                           widget=forms.TextInput())

    # secondary sources
    secondary_sources_pe = forms.CharField(label="Fonti delle notizie",
                                        required=False,
                                        widget=forms.Textarea(
                                            attrs={
                                                'rows': 3,
                                            }))


class SourceManuscriptForm(forms.Form):
    # the name of commentator
    source_manuscript = forms.CharField(required=False, max_length=100,
        widget=forms.TextInput(
            attrs={
                "class": "autocomplete",
                "autocomplete" : "off",
                "data-url": "/tool/annotation/source", # Cambiare il l'url con la view che estrae il riferimento
                "data-toggle": "popover",
                "data-trigger": "focus",
                "data-noresults-text": "Nessun risultato",
                "title": "Fonte",
                "data-content": "Seleziona l'abbreviazione della fonte. Inserisci i primi caratteri \
                                per filtrare i risultati. Se non trovi \
                                il riferimento nella lista, <a href='#' class='add-source-btn'>clicca qui</a> \
                                per aggiungerne uno nuovo."
            }))
    # IRI of commentator
    source_manuscript_iri = forms.CharField(required=False, widget=forms.HiddenInput(
        attrs={
                "class": "hidden-formset"
         }
    ))
    # Specifics
    specific_manuscript = forms.CharField(required=False, max_length=100, widget=forms.TextInput())


class SourcePrintEditionForm(forms.Form):
    # the name of commentator
    source_print_edition = forms.CharField(required=False, max_length=100,
        widget=forms.TextInput(
            attrs={
                "class": "autocomplete",
                "autocomplete" : "off",
                "data-url": "/tool/annotation/source", # Cambiare il l'url con la view che estrae il riferimento
                "data-toggle": "popover",
                "data-trigger": "focus",
                "data-noresults-text": "Nessun risultato",
                "title": "Fonte",
                "data-content": "Seleziona l'abbreviazione della fonte. Inserisci i primi caratteri \
                                per filtrare i risultati. Se non trovi \
                                il riferimento nella lista, <a href='#' class='add-source-btn'>clicca qui</a> \
                                per aggiungerne uno nuovo."
            }))
    # IRI of commentator
    source_print_edition_iri = forms.CharField(required=False, widget=forms.HiddenInput(
        attrs={
                "class": "hidden-formset"
         }
    ))
    # Specifics
    specific_print_edition = forms.CharField(required=False, max_length=100, widget=forms.TextInput())
