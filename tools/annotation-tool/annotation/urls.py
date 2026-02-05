from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    # index view
    path('', views.index, name='index'),

    path('sources/', views.get_sources, name='get_sources'),

    # get authors list
    path('authors/', views.get_authors, name='get_authors'),
    

    # get works of an author
    path('authors/<int:author_id>', views.get_works, name='get_works'),

    # insert lemma
    path('lemma/', views.lemma, name='lemma'),
    path('lemma/<int:author_id>/', views.lemma, name='lemma'),
    path('lemma/<int:author_id>/<int:work_id>/', views.lemma, name='lemma'),

    # assigned lemmas
    path('assigned_lemmas/', views.assigned_lemmas, name='assigned_lemmas'),

    # insert manuscript
    path('lemma/<int:author_id>/<int:work_id>/insert_manuscript/', views.insert_manuscript, name='insert_manuscript'),

    # update manuscript
    path('lemma/<int:author_id>/<int:work_id>/insert_manuscript/<int:manuscript_id>/', views.insert_manuscript, name='insert_manuscript'),

    # insert print edition
    path('lemma/<int:author_id>/<int:work_id>/insert_print_edition/', views.insert_print_edition, name='insert_print_edition'),

    # update print edition
    path('lemma/<int:author_id>/<int:work_id>/insert_print_edition/<int:print_edition_id>/', views.insert_print_edition, name='insert_print_edition'),

    # delete manuscript
    path('lemma/<int:author_id>/<int:work_id>/delete_manuscript/<int:manuscript_id>/', views.delete_manuscript, name='delete_manuscript'),

    # delete print edition
    path('lemma/<int:author_id>/<int:work_id>/delete_print_edition/<int:print_edition_id>/', views.delete_print_edition, name='delete_print_edition'),

    # autocomplete views
    path('author', views.author_autocomplete, name='author_autocomplete'),
    path('work', views.work_autocomplete, name='work_autocomplete'),
    path('area', views.area_autocomplete, name='area_autocomplete'),
    path('library', views.library_autocomplete, name='library_autocomplete'),
    path('place', views.place_autocomplete, name='place_autocomplete'),
    path('source', views.source_autocomplete, name='source_autocomplete'),

    # entity from IRI
    path('entity', views.entity_from_iri, name='entity_from_iri'),

    # name form Users
    path('get_names', views.get_names, name='get_names'),

    # import from Wikidata
    path('import-author', views.import_wikidata_author, name='import_wikidata_author'),
    path('import-work', views.import_wikidata_work, name='import_wikidata_work'),
    path('import-library', views.import_wikidata_library, name='import_wikidata_library'),
    path('import-place', views.import_wikidata_place, name='import_wikidata_place'),

    # add user-defined resources
    path('add-author', views.add_new_author, name='add_new_author'),
    path('add-work', views.add_new_work, name='add_new_work'),
    path('add-library', views.add_new_library, name='add_new_library'),
    path('add-place', views.add_new_place, name='add_new_place'),
    path('add-source', views.add_new_source, name='add_new_source'),

    # save topography
    path('lemma/<int:author_id>/<int:work_id>/save_topographies/', views.save_topographies, name='save_topographies'),

    # save genres
    path('lemma/<int:author_id>/<int:work_id>/save_genres/', views.save_genres, name='save_genres'),

    # save abstract
    path('lemma/<int:author_id>/<int:work_id>/save_abstract/', views.save_abstract, name='save_abstract'),
    
    # save review
    path('lemma/<int:author_id>/<int:work_id>/save_review/', views.save_review, name='save_review'),

    # save author
    path('lemma/<int:author_id>/<int:work_id>/save_author/', views.save_author, name='save_author'),

    # save work
    path('lemma/<int:author_id>/<int:work_id>/save_work/', views.save_work, name='save_work'),

    path('save_source', views.save_source, name='save_source'),
    
    path('delete_source', views.delete_source, name='delete_source'),
    
    path('check_source', views.check_source, name='check_source'),

    path('export_pdf', views.export_pdf, name='export_pdf'),

    
]
