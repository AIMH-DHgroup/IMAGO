from django.contrib import admin
from django.utils.html import format_html
from .models import *
from django.contrib.auth.models import User
import json as j


# Function to make text red
def red(text):
    return format_html(f'<span style="color: red;">{text}</span>')

# Function to truncate text
def truncate(text, length=50, suffix='...'):
    if len(text) <= 50:
        suffix = ''
    return f'{text[:length].strip()}{suffix}'


# Lemma admin
class LemmaAdmin(admin.ModelAdmin):
    fields = ['id', 'author', 'work', 'topography', 'genre', 'manuscript', 'printEdition', 'data']
    readonly_fields = ['id', 'author', 'work', 'topography', 'genre', 'manuscript', 'printEdition']
    list_display = ['id', 'author', 'work', 'topography', 'genre', 'manuscript', 'printEdition']
    actions = ['fix_json']

    # Action to fix bad JSON
    def fix_json(self, request, queryset):
        for obj in queryset:
            obj.data = j.loads(obj.data)
            obj.save()

    # Author field (IRI of commentary)
    def author(self, obj):
        if (isinstance(obj.data, str)):
            return red('Bad JSON')
        if obj.data and 'autore' in obj.data['lemma']:
            return obj.data['lemma']['autore']
        return red('Missing field: Autore')

    # Author field (IRI of commentary)
    def work(self, obj):
        if (isinstance(obj.data, str)):
            return red('Bad JSON')
        if obj.data and 'opera' in obj.data['lemma']:
            return obj.data['lemma']['opera']
        return red('Missing field: Opera')

    # Citations field (string containing a list of citations)
    def topography(self, obj):
        if (isinstance(obj.data, str)):
            return red('Bad JSON')

        # Function to build a list from citation data
        def make_topography_string(index, topography):
            if topography:
                topographyData = [f'Place {index+1}']
                topographyData.append(f'• {truncate(topography)}')
            else:
                topographyData.append(red('• No info'))
            return '<br>'.join(topographyData)

        # If citations exist, build the list
        if obj.data and 'toponimi' in obj.data['lemma']:
            topographies = obj.data['lemma']['toponimi']
            if len(topographies) > 0:
                topographiesStrings = [make_topography_string(index, top) for index, top in enumerate(topographies)]
                return format_html('<br><br>'.join(topographiesStrings))

        return red('Missing field: Luogo')

    # Citations field (string containing a list of citations)
    def genre(self, obj):
        if (isinstance(obj.data, str)):
            return red('Bad JSON')

        # Function to build a list from citation data
        def make_genre_string(index, genre):
            if genre:
                genreData = [f'Genere {index+1}']
                genreData.append(f'• {truncate(genre)}')
            else:
                genreData.append(red('• No info'))
            return '<br>'.join(genreData)

        # If citations exist, build the list
        if obj.data and 'generi' in obj.data['lemma']:
            genres = obj.data['lemma']['generi']
            if len(genres) > 0:
                genresStrings = [make_genre_string(index, top) for index, top in enumerate(genres)]
                return format_html('<br><br>'.join(genresStrings))

        return red('Missing field: genere')


    def printEdition(self, obj):
        if (isinstance(obj.data, str)):
            return red('Bad JSON')
        # if obj.data and 'OperaDante' in obj.data['Nota']:
        #     cantica = obj.data['Nota']['OperaDante']['Cantica']
        #     canto = obj.data['Nota']['OperaDante']['Canto']
        #     verso = obj.data['Nota']['OperaDante']['Verso']
        #     return ', '.join([cantica, str(canto), str(verso)])
        return red('Missing field: OperaDante')

    # Citations field (string containing a list of citations)
    def manuscript(self, obj):
        if (isinstance(obj.data, str)):
            return red('Bad JSON')

        # Function to build a list from citation data
        def make_manuscript_string(index, manuscript):
            manuscriptData = [f'Citation {index+1}']
            if 'autore' in manuscript:
                manuscriptData.append(f'• {truncate(manuscript["autore"])}')
            else:
                manuscriptData.append('• No author')
            if 'titolo' in manuscript:
                manuscriptData.append(f'• {manuscript["titolo"]}')
            else:
                manuscriptData.append('• No title')
            if 'InfoCitazione' in manuscript:
                if 'Autore' in manuscript['InfoCitazione']:
                    manuscriptData.append(f'• {manuscript["InfoCitazione"]["Autore"]}')
                else:
                    manuscriptData.append('• No author')
                if 'Fonte' in manuscript['InfoCitazione']:
                    manuscriptData.append(f'• {manuscript["InfoCitazione"]["Fonte"]}')
                else:
                    manuscriptData.append('• No source')
                if 'TipoFonte' in manuscript['InfoCitazione']:
                    manuscriptData.append(f'• {manuscript["InfoCitazione"]["TipoFonte"]}')
                else:
                    manuscriptData.append('• No source type')
                if 'Area' in manuscript['InfoCitazione']:
                    manuscriptData.append(f'• {manuscript["InfoCitazione"]["Area"]}')
                else:
                    manuscriptData.append('• No area')
            else:
                manuscriptData.append(red('• No info'))
            return '<br>'.join(manuscriptData)

        # If citations exist, build the list
        if obj.data and 'manoscritti' in obj.data['lemma']:
            manuscripts = obj.data['lemma']['manoscritti']
            if len(manuscripts) > 0:
                manuscriptStrings = [make_manuscript_string(index, cit) for index, cit in enumerate(manuscripts)]
                return format_html('<br><br>'.join(manuscriptStrings))

        return red('Missing field: Citazioni')

    # Allow HTML tags in fields
    # body.allow_tags = True
    # dante_fragment.allow_tags = True
    # dante_reference.allow_tags = True
    topography.allow_tags = True

    # Give more readable name to action
    fix_json.short_description = 'Fix bad JSON'

# Author admin
class AuthorAdmin(admin.ModelAdmin):
    fields = ['id', 'name', 'iri', 'data']
    readonly_fields = ['id', 'name', 'iri']
    list_display = ['id', 'name', 'iri']
    ordering = ['data__name']

    # Name field (string)
    def name(self, obj):
        try:
            if 'user' in obj.data and obj.data['user']:
                user_warning = red("[user-defined]")
                return format_html(f'{obj.data["name"]} {user_warning}')
            else:
                return obj.data['name']
        except KeyError:
            return red('Missing field: Name')

    # IRI field (IRI)
    def iri(self, obj):
        try:
            return format_html(f'<a href={obj.data["iri"]}>{obj.data["iri"]}</a>')
        except KeyError:
            return red('Missing field: IRI')


# Work admin
class WorkAdmin(admin.ModelAdmin):
    fields = ['id', 'title', 'iri', 'author', 'data']
    readonly_fields = ['id', 'title', 'iri', 'author']
    list_display = ['id', 'title', 'iri', 'author']
    ordering = ['data__title']

    # Title field (string)
    def title(self, obj):
        try:
            if 'user' in obj.data and obj.data['user']:
                user_warning = red("[user-defined]")
                return format_html(f'{obj.data["title"]} {user_warning}')
            else:
                return obj.data['title']
        except KeyError:
            return red('Missing field: Title')

    # IRI field (IRI)
    def iri(self, obj):
        try:
            return format_html(f'<a href={obj.data["iri"]}>{obj.data["iri"]}</a>')
        except KeyError:
            return red('Missing field: IRI')

    # Author field (author name retrieved from IRI)
    def author(self, obj):
        try:
            author_iri = obj.data['author']
            try:
                author = Author.objects.get(data__iri=author_iri)
            except Author.DoesNotExist:
                print(f'Missing author: {author_iri}')
                return red('Missing author: {author_iri}')
            else:
                return format_html(f'<a href="../author/{author.id}">{author.data["name"]}</a>')
        except KeyError:
            return red('Missing field: Author')

    # Allow HTML tags in some fields
    iri.allow_tags = True
    title.allow_tags = True


# Work admin
class LibraryAdmin(admin.ModelAdmin):
    fields = ['id', 'name', 'iri', 'place', 'latitude', 'longitude', 'country', 'data']
    readonly_fields = ['id', 'name', 'iri', 'place', 'latitude', 'longitude', 'country']
    list_display = ['id', 'name', 'iri', 'place', 'latitude', 'longitude', 'country']
    ordering = ['data__name']

    # Title field (string)
    def name(self, obj):
        try:
            if 'user' in obj.data and obj.data['user']:
                user_warning = red("[user-defined]")
                return format_html(f'{obj.data["name"]} {user_warning}')
            else:
                return obj.data['name']
        except KeyError:
            return red('Missing field: Title')

    # IRI field (IRI)
    def iri(self, obj):
        try:
            return format_html(f'<a href={obj.data["iri"]}>{obj.data["iri"]}</a>')
        except KeyError:
            return red('Missing field: IRI')

    # Latitude field (IRI)
    def latitude(self, obj):
        try:
            return obj.data["lat"]
        except KeyError:
            return red('Missing field: Latitude')
    
    # Latitude field (IRI)
    def longitude(self, obj):
        try:
            return obj.data["lon"]
        except KeyError:
            return red('Missing field: Longitude')

    # Author field (author name retrieved from IRI)
    def place(self, obj):
        try:
            place_iri = obj.data['place']
            try:
                place = Place.objects.get(data__iri=place_iri)
            except Place.DoesNotExist:
                print(f'Missing place: {place_iri}')
                return red('Missing author: {place_iri}')
            else:
                return format_html(f'<a href="../author/{place.id}">{place.data["name"]}</a>')
        except KeyError:
            return red('Missing field: Place')

    # Author field (author name retrieved from IRI)
    def country(self, obj):
        try:
            place_iri = obj.data['country']
            try:
                place = Place.objects.get(data__iri=place_iri)
            except Place.DoesNotExist:
                print(f'Missing place: {place_iri}')
                return red('Missing author: {place_iri}')
            else:
                return format_html(f'<a href="../author/{place.id}">{place.data["name"]}</a>')
        except KeyError:
            return red('Missing field: Place')

    # Area field (area name retrieved from IRI)
    def area(self, obj):
        try:
            area_iri = obj.data['area']
            try:
                area = Area.objects.get(data__iri=area_iri)
            except Area.DoesNotExist:
                return red('Missing area: {area_iri}')
            else:
                return format_html(f'<a href="../area/{area.id}">{area.data["name"]}</a>')
        except KeyError:
            return red('Missing field: Area')

    # Allow HTML tags in some fields
    iri.allow_tags = True
    # title.allow_tags = True


# Placeadmin
class PlaceAdmin(admin.ModelAdmin):
    fields = ['id', 'name', 'iri', 'data']
    readonly_fields = ['id', 'name', 'iri']
    list_display = ['id', 'name', 'iri']
    ordering = ['data__name']

    # Name field (string)
    def name(self, obj):
        try:
            if 'user' in obj.data and obj.data['user']:
                user_warning = red("[user-defined]")
                return format_html(f'{obj.data["name"]} {user_warning}')
            else:
                return obj.data['name']
        except KeyError:
            return red('Missing field: Name')

    # IRI field (IRI)
    def iri(self, obj):
        try:
            return format_html(f'<a href={obj.data["iri"]}>{obj.data["iri"]}</a>')
        except KeyError:
            return red('Missing field: IRI')

class SourceAdmin(admin.ModelAdmin):
    fields = ['id', 'name', 'iri', 'data']
    readonly_fields = ['id', 'name', 'iri']
    list_display = ['id', 'name', 'iri']
    ordering = ['data__name']

    # Name field (string)
    def name(self, obj):
        try:
            if 'user' in obj.data and obj.data['user']:
                user_warning = red("[user-defined]")
                return format_html(f'{obj.data["name"]} {user_warning}')
            else:
                return obj.data['name']
        except KeyError:
            return red('Missing field: Name')

    # IRI field (IRI)
    def iri(self, obj):
        try:
            return format_html(f'<a href={obj.data["iri"]}>{obj.data["iri"]}</a>')
        except KeyError:
            return red('Missing field: IRI')

class GenreAdmin(admin.ModelAdmin):
    fields = ['id', 'name', 'iri', 'data']
    readonly_fields = ['id', 'name', 'iri']
    list_display = ['id', 'name', 'iri']
    ordering = ['data__name']

    # Name field (string)
    def name(self, obj):
        try:
            if 'user' in obj.data and obj.data['user']:
                user_warning = red("[user-defined]")
                return format_html(f'{obj.data["name"]} {user_warning}')
            else:
                return obj.data['name']
        except KeyError:
            return red('Missing field: Name')

    # IRI field (IRI)
    def iri(self, obj):
        try:
            return format_html(f'<a href={obj.data["iri"]}>{obj.data["iri"]}</a>')
        except KeyError:
            return red('Missing field: IRI')

# Register all admins
admin.site.register(Lemma, LemmaAdmin)
admin.site.register(Author, AuthorAdmin)
admin.site.register(Work, WorkAdmin)
admin.site.register(Place, PlaceAdmin)
admin.site.register(Source, SourceAdmin)
admin.site.register(Library, LibraryAdmin)
admin.site.register(Genre, GenreAdmin)


