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


# Correction place
correction = {
    'https://imagoarchive.it/resource/aberystwyth-national-library-of-wales'   : 'http://www.wikidata.org/entity/Q666063', #located in Ceredigion (Q217829) 'Aberystwyth, National Library of Wales'
    'https://imagoarchive.it/resource/admont-bibliothek-des-benediktinerstifts' : 'http://www.wikidata.org/entity/Q304668',#Admont Abbey Library (Q304668) 'Admont, Bibliothek des Benediktinerstifts'
    'https://imagoarchive.it/resource/aix-en-provence-cite-du-livre-bibliotheque-mejanes'  : 'http://www.wikidata.org/entity/Q2901297', #Bibliothèque Méjanes (Q2901297) 'Aix-en-Provence, Cité du Livre - Bibliothèque Méjanes'
    'https://imagoarchive.it/resource/albi-mediatheque-pierre-amalric' : 'http://www.wikidata.org/entity/Q2901551' , #Libraries of Albi (Q2901551) 'Albi, Médiathèque Pierre Amalric'
    'https://imagoarchive.it/resource/alencon-mediatheque-de-la-communaute-urbaine-olim-bibliotheque-municipale' : 'http://www.wikidata.org/entity/Q18170054' , #Bibliothèque municipale d'Alençon (Q18170054) 'Alençon, Médiathèque de la Communauté Urbaine (olim Bibliothèque Municipale)'
    'https://imagoarchive.it/resource/amiens-bibliotheque-municipale'  : 'http://www.wikidata.org/entity/Q22966499' , #Amiens (France). Bibliothèque municipale (Q22966499) 'Amiens, Bibliothèque municipale'
    'https://imagoarchive.it/resource/amsterdam-biblioteca-universitaria'   : 'http://www.wikidata.org/entity/Q2017571' , #Amsterdam University Library (Q2017571) 'Amsterdam, Biblioteca Universitaria'
    'https://imagoarchive.it/resource/archivio-del-castello-di-praga' : 'http://www.wikidata.org/entity/Q46996155' , #Archiv Pražského hradu (Q46996155) 'Archivio del castello di Praga' 
    'https://imagoarchive.it/resource/archivio-segreto-vaticano' : 'http://www.wikidata.org/entity/Q536580' , #Vatican Apostolic Archives (Q536580) 'Archivio Segreto Vaticano'
    'https://imagoarchive.it/resource/arras-archives-du-pas-de-calais' : 'http://www.wikidata.org/entity/Q2860515' , #Departmental archives of Pas-de-Calais (Q2860515) 'Arras, Archives du Pas-de-Calais'
    'https://imagoarchive.it/resource/arras-bibliotheque-municipale' : 'http://www.wikidata.org/entity/Q18599881' , #Bibliotheque Municipale d'Arras (Q18599881) 'Arras, Bibliothèque Municipale'
    'https://imagoarchive.it/resource/arxiu-capitular-de-gerona' : '' , #Arxiu Capitular de la Catedral de Girona 'Arxiu capitular de Gerona'
    'https://imagoarchive.it/resource/assisi-biblioteca-comunale' : 'http://www.wikidata.org/entity/Q112875464' , #Biblioteca Comunale di Assisi (Q112875464) 'Assisi, Biblioteca comunale'
    'https://imagoarchive.it/resource/assisi-biblioteca-del-sacro-convento' : 'http://www.wikidata.org/entity/Q3639655' , #Biblioteca del Centro di documentazione francescana della Basilica e Sacro convento di San Francesco in Assisi (Q3639655) 'Assisi, Biblioteca del Sacro Convento'
    'https://imagoarchive.it/resource/auxerre-bibliotheque-jacques-lacarrier' : '' , #Bibliothèque Jacques-Lacarrière 'Auxerre, Bibliothèque Jacques Lacarrièr'
    'https://imagoarchive.it/resource/avignon-bibliotheque-municipale-ceccano-olim-musee-calvet'  : 'http://www.wikidata.org/entity/Q1142988' , #Calvet Museum (Q1142988) or https://fr.wikipedia.org/wiki/M%C3%A9diath%C3%A8que_Ceccano 'Avignon, Bibliothèque Municipale Ceccano (olim Musée Calvet)'
    'https://imagoarchive.it/resource/barcelona-biblioteca-de-catalunya' : 'http://www.wikidata.org/entity/Q1200925' , #National Library of Catalonia (Q1200925) 'Barcelona, Biblioteca de Catalunya'
    'https://imagoarchive.it/resource/beaune-bibliotheque-municipale' : '' , #Bibliothèque municipale Gaspard Monge - Beaune 'Beaune, Bibliothèque Municipale'
    'https://imagoarchive.it/resource/belluno-biblioteca-lolliana-gregoriana'  : '' , #'Belluno, Biblioteca Lolliana Gregoriana'
    'https://imagoarchive.it/resource/berna-burgerbibliothek' : 'http://www.wikidata.org/entity/Q669509' , #Burgerbibliothek of Berne (Q669509) 'Berna, Burgerbibliothek'
    'https://imagoarchive.it/resource/besancon-bibliotheque-municipale' : 'http://www.wikidata.org/entity/Q2901451' , #Bibliothèque municipale de Besançon (Q2901451) 'Besançon, Bibliothèque Municipale'
    'https://imagoarchive.it/resource/biblioteca-balear-de-la-real' : 'http://www.wikidata.org/entity/Q17405595' , #No label defined (Q17405595) 'Biblioteca Balear de La Real'
    'https://imagoarchive.it/resource/biblioteca-dellabbazia-benedettina-di-s-georgenberg-fiecht' : '' , #Stiftsbibliothek des Benediktinerstifts St. Georgenberg Fiecht "Biblioteca dell'Abbazia benedettina di S. Georgenberg-Fiecht" 
    'https://imagoarchive.it/resource/biblioteca-dellospedale-di-san-nicola'  : 'http://www.wikidata.org/entity/Q856546' , #Library of the Cusanusstift (Q856546)? "Biblioteca dell'Ospedale di San Nicola"
    'https://imagoarchive.it/resource/biblioteca-di-palazzo-piccolomini' : 'http://www.wikidata.org/entity/Q3237948' , #Piccolomini Library (Q3237948) 'Biblioteca di Palazzo Piccolomini'
    'https://imagoarchive.it/resource/biblioteca-municipale-di-tours' : 'http://www.wikidata.org/entity/Q2901455' , #Library of Tours (Q2901455) 'Biblioteca municipale di Tours'
    'https://imagoarchive.it/resource/biblioteca-nazionale-e-universitaria-di-zagabria' : 'http://www.wikidata.org/entity/Q631375' , #National and University Library in Zagreb (Q631375) 'Biblioteca nazionale e universitaria di Zagabria'
    'https://imagoarchive.it/resource/biblioteca-privata-arditi-di-castelvetere' : '' , #'Biblioteca privata "Arditi di Castelvetere"'
    'https://imagoarchive.it/resource/biblioteca-statale-berlinese-patrimonio-culturale-prussiano': '' , # Prussian Cultural Heritage Foundation (Q685171) or Staatsbibliothek zu Berlin (Kulturforum) (Q1675021) : Biblioteca di Stato di Berlino / 'Biblioteca statale berlinese - Patrimonio culturale prussiano' 
    'https://imagoarchive.it/resource/biblioteca-statale-e-universitaria-di-amburgo' : 'http://www.wikidata.org/entity/Q2324644' , #Hamburg State and University Library Carl von Ossietzky (Q2324644) 'Biblioteca statale e universitaria di Amburgo'
    'https://imagoarchive.it/resource/biblioteca-universitaria-di-eichstatt-ingolstadt' : 'http://www.wikidata.org/entity/Q22694379' , #University library Eichstätt-Ingolstadt (Q22694379) 'Biblioteca universitaria di Eichstätt-Ingolstadt'
    'https://imagoarchive.it/resource/biblioteka-akademii-nauk' : '' , #No label defined (Q9170826) 'Biblioteka Akademii Nauk'
    'https://imagoarchive.it/resource/biblioteka-gdanska-polskiej-akademii-nauk' : 'http://www.wikidata.org/entity/Q9170771' , #Library of the Polish Academy of Sciences (Q9170771) 'Biblioteka Gdanska Polskiej Akademii Nauk'
    'https://imagoarchive.it/resource/biblioteka-muzeum-narodowego-w-krakowie' : '' , #'Biblioteka Muzeum Narodowego w Krakowie'
    'https://imagoarchive.it/resource/biblioteka-samostana-male-brace' : '' , #Franciscan Monastery Library, Dubrovnik / 'Biblioteka Samostana Male Brace'
    'https://imagoarchive.it/resource/bibliothek-des-augustiner-chorherrenstiftes' : '' , #'Bibliothek des Augustiner Chorherrenstiftes'
    'https://imagoarchive.it/resource/bibliotheque-du-seminaire-notre-dame-de-namur' : '' , # 'Bibliothèque du Séminaire Notre-Dame de Namur'
    'https://imagoarchive.it/resource/bibliotheque-municipale-de-lille' : 'http://www.wikidata.org/entity/Q50642141' , #Bibliotheque municipale Jean Lévy (Q50642141) 'Bibliothèque Municipale de Lille'
    'https://imagoarchive.it/resource/bildungscampus-stadtbibliothek-nurnberg' : 'http://www.wikidata.org/entity/Q2326885' , #Nuremberg City Library (Q2326885) 'Bildungscampus Stadtbibliothek Nürnberg'
    'https://imagoarchive.it/resource/bloomington-indiana-university-lilly-university' : 'http://www.wikidata.org/entity/Q6548368' , #Lilly Library (Q6548368) 'Bloomington, Indiana University, Lilly University'
    'https://imagoarchive.it/resource/bourges-bibliotheque-de-la-ville' : 'http://www.wikidata.org/entity/Q111207547' , #No label defined (Q111207547) 'Bourges, Bibliothèque de la Ville'
    'https://imagoarchive.it/resource/bratislava-archiv-hlavneho-mesta' : '' , #Archív hlavného mesta Bratislavy 'Bratislava,  Archív Hlavného Mesta'
    'https://imagoarchive.it/resource/bridlington-augustinian-priory' : 'http://www.wikidata.org/entity/Q4525670' , #Bridlington Priory (Q4525670) 'Bridlington, Augustinian Priory'
    'https://imagoarchive.it/resource/brno-moravska-zemska-knihovna-olim-statni-vedecka-knihovna-universitni-knihovna' : 'http://www.wikidata.org/entity/Q1957240' , #Moravian Library (Q1957240) 'Brno, Moravská Zemská Knihovna (olim Státní Vedecká Knihovna - Universitní Knihovna)'
    'https://imagoarchive.it/resource/bruxelles-kbr-olim-bibliotheque-royale-albert-ier' : 'http://www.wikidata.org/entity/Q383931' , #Royal Library of Belgium (Q383931) 'Bruxelles, KBR (olim Bibliothèque Royale «Albert Ier»)'
    'https://imagoarchive.it/resource/budapest-eotvos-lorand-tudomanyegyetem-egyetemi-konyvtar' : 'http://www.wikidata.org/entity/Q772557' , #Budapest University Library (Q772557) 'Budapest, Eötvös Loránd Tudományegyetem, Egyetemi Könyvtár'
    'https://imagoarchive.it/resource/burgo-de-osma-s-iglesia-catedral' : 'http://www.wikidata.org/entity/Q509931' , #Burgo de Osma Cathedral (Q509931) 'Burgo de Osma, S. Iglesia Catedral'
    'https://imagoarchive.it/resource/cambrai-le-labo' : 'http://www.wikidata.org/entity/Q55598713' , #Mediathèque municipale, Cambrai (Q55598713) 'Cambrai, Le Labo'
    'https://imagoarchive.it/resource/cambrai-mediatheque-municipale-olim-bibliotheque-municipale' : 'http://www.wikidata.org/entity/Q55598713' , #Mediathèque municipale, Cambrai (Q55598713) 'Cambrai, Médiathèque Municipale (olim Bibliothèque Municipale)'
    'https://imagoarchive.it/resource/casa-cavalli' : '' , #No label defined (Q28668065) 'Casa Cavalli'
    'https://imagoarchive.it/resource/chantilly-bibliotheque-et-archives-du-chateau' : '' , #'Chantilly, Bibliothèque et Archives du Château'  
    'https://imagoarchive.it/resource/chartres-mediatheque-lapostrophe-olim-bibliotheque-municipale' : 'http://www.wikidata.org/entity/Q3146242' , #Hôtel des Postes de Chartres (Q3146242) "Chartres, Médiathèque «L'Apostrophe» (olim Bibliothèque Municipale" 
    'https://imagoarchive.it/resource/chicago-il-the-newberry-library-case' : 'http://www.wikidata.org/entity/Q616527' , #Newberry Library (Q616527) 'Chicago, IL, The Newberry Library Case'
    'https://imagoarchive.it/resource/clermont-ferrand-bibliotheque-municipale-et-interuniversitaire' : 'http://www.wikidata.org/entity/Q93879995' , #No label defined (Q93879995) 'Clermont-Ferrand, Bibliothèque Municipale et Interuniversitaire'
    'https://imagoarchive.it/resource/colmar-bibliotheque-des-dominicains-olim-bibliotheque-municipale' : 'http://www.wikidata.org/entity/Q23907657' , #Bibliothèque patrimoniale des Dominicains (Q23907657) 'Colmar, Bibliothèque des Dominicains (olim Bibliothèque Municipale)'
    'https://imagoarchive.it/resource/copenaghen-kongelige-bibliotek' : 'http://www.wikidata.org/entity/Q867885' ,  #Royal Danish Library (Q867885) 'Copenaghen, Kongelige Bibliotek'
    'https://imagoarchive.it/resource/cortona-pubblica-biblioteca-comunale-e-dellaccademia-etrusca' : 'http://www.wikidata.org/entity/Q86537302' , #Biblioteca del Comune e dell'Accademia etrusca di Cortona (Q86537302) "Cortona, Pubblica Biblioteca Comunale e dell'Accademia etrusca"
    'https://imagoarchive.it/resource/den-haag-sammlung-schinkel' : '' , #? Collezione Schinkel in quale biblioteca? 'Den Haag, Sammlung Schinkel'
    'https://imagoarchive.it/resource/descrizione-desunta-sankt-gallen-stiftsbibliothek' : 'http://www.wikidata.org/entity/Q689896' , #Abbey library of St. Gallen (Q689896) 'Descrizione desunta Sankt Gallen, Stiftsbibliothek'
    'https://imagoarchive.it/resource/diozesanarchiv-ordinariatsbibliothek-di-eichstatt' : '' , #University Archive Catholic University Eichstätt-Ingolstadt (Q107145511)? 'Diözesanarchiv  - Ordinariatsbibliothek di Eichstätt'
    'https://imagoarchive.it/resource/diozesanbibliothek-st-polten' : 'http://www.wikidata.org/entity/Q81164495' , #Archive of the Diocese of St. Pölten (Q81164495) 'Diözesanbibliothek St. Pölten'
    'https://imagoarchive.it/resource/dominikanski-samostan' : '' , #WHERE? 'Dominikanski Samostan'
    'https://imagoarchive.it/resource/douai-bibliotheque-marceline-desbordes-valmore-olim-bibliotheque-municipale' : 'http://www.wikidata.org/entity/Q4903512' , #Bibliothèque municipale de Douai (Q4903512) 'Douai, Bibliothèque Marceline Desbordes-Valmore (olim Bibliothèque Municipale)'
    
    
    'https://imagoarchive.it/resource/dover-st-martins-priory': 'http://www.wikidata.org/entity/Q5302511' , #Dover Priory (Q5302511) "Dover, St. Martin's Priory" 
    'https://imagoarchive.it/resource/dusseldorf-universitats-und-landesbibliothek' : 'http://www.wikidata.org/entity/Q2496254' , #University and State Library Düsseldorf (Q2496254) 'Düsseldorf, Universitäts- und Landesbibliothek'
    'https://imagoarchive.it/resource/el-escorial-real-biblioteca-de-san-lorenzo' : 'http://www.wikidata.org/entity/Q3848863' , #Library of the Monastery of El Escorial (Q3848863) 'El Escorial, Real Biblioteca de San Lorenzo'
    'https://imagoarchive.it/resource/engelberg-stiftsbibliothek' : 'http://www.wikidata.org/entity/Q27480201' , #Monastic library (Q27480201) 'Engelberg, Stiftsbibliothek'
    'https://imagoarchive.it/resource/epinal-bibliotheque-multimedia-intercommunale-epinal-goldbey-olim-bibliotheque-municipale' : 'http://www.wikidata.org/entity/Q20971801' , #Bibliothèque municipale d'Épinal (Q20971801) 'Epinal, Bibliothèque Multimédia Intercommunale Epinal-Goldbey (olim Bibliothèque Municipale)'
    'https://imagoarchive.it/resource/fabriano-biblioteca-multimediale-gia-comunale-r-sassi' : 'http://www.wikidata.org/entity/Q28003706' , #Romualdo Sassi public library (Q28003706) 'Fabriano, Biblioteca Multimediale (già comunale) "R. Sassi"'
    'https://imagoarchive.it/resource/falconara-marittima-ancona-biblioteca-storico-francescana-e-picena-dei-minori-delle-marche' : 'http://www.wikidata.org/entity/Q112076088' , #Biblioteca storico-francescana e picena (Q112076088) 'Falconara Marittima (Ancona), Biblioteca Storico-Francescana e Picena dei Minori delle Marche'
    'https://imagoarchive.it/resource/firenze-archivio-provinciale-dei-frati-minori' : '' , #'Firenze, Archivio Provinciale dei Frati Minori'
    'https://imagoarchive.it/resource/forli-biblioteca-comunale' : 'http://www.wikidata.org/entity/Q16268189' , #Aurelio Saffi Town Library (Q16268189) 'Forlì, Biblioteca Comunale'
    'https://imagoarchive.it/resource/fritzlar-dombibliothek' : '' , #'Fritzlar, Dombibliothek'
    'https://imagoarchive.it/resource/fulda-hessische-landesbibliothek' : '' , #Fulda University and State Library (Q1622057)? 'Fulda, Hessische Landesbibliothek'
    'https://imagoarchive.it/resource/gdansk-marienbibliothek' : '' , #? 'Gdansk, Marienbibliothek'
    'https://imagoarchive.it/resource/gerleve-klosterbibliothek' : 'http://www.wikidata.org/entity/Q28738574' , #Abtei Gerleve, Library (Q28738574) 'Gerleve, Klosterbibliothek'
    'https://imagoarchive.it/resource/gotha-herzogliche-bibliothek': 'http://www.wikidata.org/entity/Q28738121' , #Gotha Research Library (Q28738121) 'Gotha, Herzogliche Bibliothek' 
    'https://imagoarchive.it/resource/gottinga-bibliothek-des-benediktinerstifts' : 'http://www.wikidata.org/entity/Q77350508' , #Library of Göttweig Abbey (Q77350508) 'Gottinga, Bibliothek des Benediktinerstifts'
    'https://imagoarchive.it/resource/gottweig-stiftsbibliothek' : 'http://www.wikidata.org/entity/Q77350508' , #Library of Göttweig Abbey (Q77350508)'Göttweig, Stiftsbibliothek'
    'https://imagoarchive.it/resource/haarlem-city-library' : 'http://www.wikidata.org/entity/Q2140069' , #Haarlem central public library (Q2140069)'Haarlem, City Library'
    'https://imagoarchive.it/resource/halberstadt-dom-gymnasium' : 'http://www.wikidata.org/entity/Q123476025' , #No label defined (Q123476025) 'Halberstadt, Dom-Gymnasium' 
    'https://imagoarchive.it/resource/halle-ad-saale-universitats-und-landesbibliothek' : 'http://www.wikidata.org/entity/Q1600777' , #University and State Library of Saxony-Anhalt (Q1600777) 'Halle a.d. Saale, UniUniversitäts- und Landesbibliothek'
    'https://imagoarchive.it/resource/halle-ad-saale-universitats-und-landesbibliothek-sachsen-anhalt-der-martin-luther-universitat-halle-wittenberg' : 'http://www.wikidata.org/entity/Q1600777' , #University and State Library of Saxony-Anhalt (Q1600777) 'Halle a.d. Saale, versitäts- und Landesbibliothek Sachsen-Anhalt der Martin-Luther-Universität Halle-Wittenberg'
    'https://imagoarchive.it/resource/heiligenkreuz-bibliothek-des-zisterzienserstifts' : '' , #'Heiligenkreuz, Bibliothek des Zisterzienserstifts'
    'https://imagoarchive.it/resource/heiligenkreuz-stiftsbibliothek' : '' , #La stessa di sopra? 'Heiligenkreuz, Stiftsbibliothek'
    'https://imagoarchive.it/resource/hildesheim-bibliothek-des-bischoflichen-gymnasium-josephinum' : '' , #'Hildesheim, Bibliothek des bischöflichen Gymnasium Josephinum'
    'https://imagoarchive.it/resource/hildesheim-bibliothek-des-priesterseminars' : '' , #'Hildesheim, Bibliothek des Priesterseminars'
    'https://imagoarchive.it/resource/hildesheim-dombibliothek' : 'http://www.wikidata.org/entity/Q1236928' , #Hildesheim cathedral library (Q1236928) 'Hildesheim, Dombibliothek'
    'https://imagoarchive.it/resource/hulne-carmelites-library': '' , #Hulne Priory (Q17646138) ? "Hulne, Carmelites' Library" 
    'https://imagoarchive.it/resource/innsbruck-universitatsbibliothek' : 'http://www.wikidata.org/entity/Q1347881' , #University and State Library Tyrol (Q1347881)'Innsbruck, Universitätsbibliothek'
    'https://imagoarchive.it/resource/irkutsk-universitetskaja-biblioteka' : '' , #'Irkutsk, Universitetskaja Biblioteka'
    'https://imagoarchive.it/resource/isny-st-nikolaus' : 'http://www.wikidata.org/entity/Q42000795' , #Nikolaikirche (Q42000795) 'Isny, St. Nikolaus'
    'https://imagoarchive.it/resource/ithaca-new-york-cornell-university-library' : 'http://www.wikidata.org/entity/Q5171572' , #Cornell University Library (Q5171572) 'Ithaca (New York), Cornell University Library'
    'https://imagoarchive.it/resource/jena-biblioteca-delluniversita' : '' , #Thuringian State and University Library (Q1255096)? "Jena, Biblioteca dell'Università"
    'https://imagoarchive.it/resource/kaliningradskaja-oblastnaja-biblioteka' : '' , #Scritto nella forma giusta? 'Kaliningradskaja Oblastnaja Biblioteka'
    'https://imagoarchive.it/resource/klagenfurt-universitatsbibliothek' : 'http://www.wikidata.org/entity/Q2496301' , #Klagenfurt University Library (Q2496301) 'Klagenfurt, Universitätsbibliothek'
    'https://imagoarchive.it/resource/klosterneuburg-bibliothek-des-augustiner-chorherrenstiftes' : '' , #'Klosterneuburg, Bibliothek des Augustiner Chorherrenstiftes'
    'https://imagoarchive.it/resource/koln-erzbischofliche-diozesan-und-dombibliothek' : 'http://www.wikidata.org/entity/Q1363860' , #Archbishop's Diocesan and Cathedral Library (Q1363860) 'Köln, Erzbischöfliche Diözesan- und Dombibliothek'
    'https://imagoarchive.it/resource/konigsberg-bibliotheca-regia-et-universitatis' : 'http://www.wikidata.org/entity/Q2324646' , #Königsberg State and University Library (Q2324646) 'Königsberg, Bibliotheca Regia et Universitatis'
    'https://imagoarchive.it/resource/kosice-archiv-kosickej-arcidiecezy' : '' , #'Košice, Archiv Košickej Arcidiecézy'
    'https://imagoarchive.it/resource/laon-bibliotheque-municipale-suzanne-martinet' : 'http://www.wikidata.org/entity/Q22966414' , #Bibliothèque Municipale de Laon (Q22966414) 'Laon, Bibliothèque Municipale «Suzanne Martinet»'
    'https://imagoarchive.it/resource/lawrence-university-of-kansas-kenneth-spencer-research-library' : 'http://www.wikidata.org/entity/Q48977616' , #Kenneth Spencer Research Library (Q48977616) 'Lawrence, University of Kansas, Kenneth Spencer Research Library'
    'https://imagoarchive.it/resource/leon-archivo-biblioteca-de-la-santa-iglesia-catedral' : 'http://www.wikidata.org/entity/Q85688853' , #No label defined (Q85688853) 'León, Archivo-Biblioteca de la Santa Iglesia Catedral'
    'https://imagoarchive.it/resource/le-puy-en-velay-chapitre-de-la-cathedrale' : '' , #Le Puy Cathedral (Q1537302) Chapitre è giusto? 'Le Puy-en-Velay, Chapître de la Cathédrale'
    'https://imagoarchive.it/resource/liege-grand-seminaire' : 'http://www.wikidata.org/entity/Q120721497' , #Grootseminarie Luik (Q120721497) 'Liège, Grand Séminaire'
    'https://imagoarchive.it/resource/lilienfeld-stiftsbibliothek' : '' , #'Lilienfeld, Stiftsbibliothek'
    'https://imagoarchive.it/resource/lincoln-cathedral-library': 'http://www.wikidata.org/entity/Q6550514' , #Lincoln Cathedral Library (Q6550514)'Lincoln, Cathedral Library' 
    'https://imagoarchive.it/resource/lindau-stadtarchiv-und-stadtbibliothek': 'http://www.wikidata.org/entity/Q1303266' , #Former Library of the Imperial City of Lindau (Q1303266)'Lindau, Stadtarchiv und Stadtbibliothek' 
    'https://imagoarchive.it/resource/linz-oberosterreichische-landesbibliothek' : 'http://www.wikidata.org/entity/Q1439945' , #Upper Austrian State Library (Q1439945)'Linz, Oberösterreichische Landesbibliothek'
    'https://imagoarchive.it/resource/lisbona-biblioteca-nazionale-del-portogallo' : 'http://www.wikidata.org/entity/Q245966' , #National Library of Portugal (Q245966)'Lisbona, Biblioteca Nazionale del Portogallo'
    'https://imagoarchive.it/resource/longleat-house-warminster-wiltshire-library-of-the-marquess-of-bath' : '' , #'Longleat House (Warminster, Wiltshire), Library of the Marquess of Bath'
    'https://imagoarchive.it/resource/lubiana-biblioteca-nazionale' : 'http://www.wikidata.org/entity/Q1520466' , #National and University Library of Slovenia (Q1520466) 'Lubiana, Biblioteca Nazionale'
    'https://imagoarchive.it/resource/luneburg-ratsbucherei' : 'http://www.wikidata.org/entity/Q28733506' , #Ratsbücherei Lüneburg (Q28733506) 'Lüneburg, Ratsbücherei'
    'https://imagoarchive.it/resource/magdalene-college' : '' , #Magdalene College (Q776807)? 'Magdalene College'
    'https://imagoarchive.it/resource/magdeburgo-bibliothek-des-domgymnasium': '' , #Correggere Magdeburgo 'Magdeburgo,  Bibliothek des Domgymnasium '
    'https://imagoarchive.it/resource/mainz-wissenschaftliche-stadtbibliothek' : 'http://www.wikidata.org/entity/Q872144' , #Municipal Scientific Library Mainz (Q872144) 'Mainz, Wissenschaftliche Stadtbibliothek'
    'https://imagoarchive.it/resource/maria-saal-stiftsbibliothek' : '' , #'Maria Saal, Stiftsbibliothek'
    'https://imagoarchive.it/resource/maynooth-st-patrick-college-of-kildare-russell-library' : 'http://www.wikidata.org/entity/Q65080797' , #Russell Library (Q65080797) 'Maynooth, St. Patrick College of Kildare. Russell Library'
    'https://imagoarchive.it/resource/mediatheque-du-grand-troyes-olim-bibliotheque-municipale' : 'http://www.wikidata.org/entity/Q17347133' , #Médiathèque de l'agglomération troyenne (Q17347133) 'Médiathèque du Grand Troyes (olim Bibliothèque Municipale)'
    'https://imagoarchive.it/resource/melk-benediktinerstift' : 'http://www.wikidata.org/entity/Q660082' , #Melk Abbey (Q660082)'Melk, Benediktinerstift'
    'https://imagoarchive.it/resource/melk-stiftsbibliothek' : 'http://www.wikidata.org/entity/Q1589808' , #Library of Melk Abbey (Q1589808)'Melk, Stiftsbibliothek'
    'https://imagoarchive.it/resource/metz-bibliotheque-municipale' : 'http://www.wikidata.org/entity/Q2901549' , #Metz libraries (Q2901549)'Metz, Bibliothèque municipale'
    'https://imagoarchive.it/resource/michaelbeuern-stiftsbibliothek' : '' , #'Michaelbeuern, Stiftsbibliothek'
    'https://imagoarchive.it/resource/milano-archivio-storico-civico-e-biblioteca-trivulziana' : 'http://www.wikidata.org/entity/Q81172328' , #Comune di Milano. Archivio storico civico-Biblioteca Trivulziana, Milano (MI) (Q81172328) 'Milano, Archivio Storico Civico e Biblioteca Trivulziana'
    'https://imagoarchive.it/resource/minneapolis-university-of-minnesota-wilson-library-james-ford-bell-library' : 'http://www.wikidata.org/entity/Q6134064' , #James Ford Bell Library (Q6134064)'Minneapolis, University of Minnesota, Wilson Library, James Ford Bell Library'
    'https://imagoarchive.it/resource/modena-biblioteca-e-archivio-capitolare' : 'http://www.wikidata.org/entity/Q113092745' , #Biblioteca capitolare e Archivio (Q113092745)'Modena, Biblioteca e Archivio Capitolare'
    'https://imagoarchive.it/resource/montserrat-biblioteca-del-monestir' : '' , #Biblioteca de Montserrat (Q11680213)? 'Montserrat, Biblioteca del Monestir'
    'https://imagoarchive.it/resource/munchen-antiquariat-jacques-rosenthal' : 'http://www.wikidata.org/entity/Q114667678' , #Jacques Rosenthal (Q114667678) 'München,  Antiquariat Jacques Rosenthal'
    'https://imagoarchive.it/resource/munster-universitats-und-landesbibliothek' : 'http://www.wikidata.org/entity/Q2496255' , #University and State Library Münster (Q2496255) 'Münster, Universitäts-und Landesbibliothek'
    'https://imagoarchive.it/resource/namur-musee-des-arts-anciens-du-namurois' : 'http://www.wikidata.org/entity/Q2401304' , #Musée provincial des Arts anciens (Q2401304) 'Namur, Musée des Arts Anciens du Namurois'
    'https://imagoarchive.it/resource/napoli-archivio-ansaldo' : '' , #'Napoli, Archivio Ansaldo'
    'https://imagoarchive.it/resource/narodni-knihovna-ceske-republiky' : 'http://www.wikidata.org/entity/Q1967876' , #National Library of the Czech Republic (Q1967876) 'Národní Knihovna Ceské Republiky'
    'https://imagoarchive.it/resource/naumburg-domstiftsbibliothek' : '' , #'Naumburg, Domstiftsbibliothek'
    'https://imagoarchive.it/resource/neuburg-ad-donau-staatliche-bibliothek' : 'http://www.wikidata.org/entity/Q2324315' , #Staatliche Bibliothek Neuburg an der Donau (Q2324315) 'Neuburg a.d. Donau, Staatliche Bibliothek'
    'https://imagoarchive.it/resource/new-york-collezioni-private' : '' , #? 'New York, Collezioni private'
    'https://imagoarchive.it/resource/new-york-columbia-university-butler-library' : 'http://www.wikidata.org/entity/Q5002628' , #Butler Library (Q5002628) 'New York, Columbia University, Butler Library'
    'https://imagoarchive.it/resource/notre-dame-indiana-university-library' : 'http://www.wikidata.org/entity/Q4499851' , #Theodore Hesburgh Library (Q4499851) 'Notre Dame, Indiana, University Library'
    'https://imagoarchive.it/resource/nottingham-priory-of-st-peter' : '' , #Priory Church of St. Peter, Thurgarton (Q7245491)? 'Nottingham, Priory of St. Peter'
    'https://imagoarchive.it/resource/olomouc-statni-archiv-kapitulni-knihovna' : '' , #'Olomouc, Státní Archív, Kapitulní Knihovna'
    'https://imagoarchive.it/resource/opladen-archiv-furstenberg-stammheim' : '' , #'Opladen, Archiv Fürstenberg-Stammheim'
    'https://imagoarchive.it/resource/orleans-biblioteca-municipale' : 'http://www.wikidata.org/entity/Q1266155' , #Orléans city library (Q1266155) 'Orleans, Biblioteca Municipale'
    'https://imagoarchive.it/resource/oslo-national-archives' : 'http://www.wikidata.org/entity/Q4793570' , #National Archives of Norway (Q4793570) 'Oslo, National Archives'
    'https://imagoarchive.it/resource/osnabruck-archivio-episcopale' : 'http://www.wikidata.org/entity/Q28735007' , #No label defined (Q28735007) 'Osnabrück, Archivio Episcopale' 
    'https://imagoarchive.it/resource/oxford-all-souls-college' : 'http://www.wikidata.org/entity/Q5140364' , #All Souls College Library (Q5140364) or All Souls College (Q81092)? 'Oxford, All Souls College'
    'https://imagoarchive.it/resource/oxford-oriel-college' : 'http://www.wikidata.org/entity/Q81170' , #Oriel College (Q81170) 'Oxford, Oriel College'
    'https://imagoarchive.it/resource/oxford-university-college' : 'http://www.wikidata.org/entity/Q81087' , #University College, Oxford (Q81087) 'Oxford, University College'
    'https://imagoarchive.it/resource/paderborn-archiv-des-paderborner-studienfonds' : '' , #'Paderborn, Archiv des Paderborner Studienfonds'
    'https://imagoarchive.it/resource/paris-bibliotheque-de-linstitut-de-france' : 'http://www.wikidata.org/entity/Q18571193' , #Bibliothèque de l'Institut de France (Q18571193) "Paris, Bibliothéque de l'Institut de France"
    'https://imagoarchive.it/resource/pelplin-biblioteka-seminarium-duchownego' : '' , #'Pelplin, Biblioteka Seminarium Duchownego'
    'https://imagoarchive.it/resource/perigueux-archives-departementales-de-la-dordogne' : 'http://www.wikidata.org/entity/Q19606444' , #Departmental archives of Dordogne (Q19606444) 'Périgueux, Archives Départementales de la Dordogne'
    'https://imagoarchive.it/resource/peterborough-abbey-library' : '' , #'Peterborough Abbey Library'
    'https://imagoarchive.it/resource/philadelphia-free-library' : 'http://www.wikidata.org/entity/Q3087288' , #Free Library of Philadelphia (Q3087288) 'Philadelphia, Free Library'
    'https://imagoarchive.it/resource/poitiers-biblioteca-municipale' : 'http://www.wikidata.org/entity/Q18763377' , #Médiathèque François-Mitterrand (Q18763377) 'Poitiers, Biblioteca Municipale' 
    'https://imagoarchive.it/resource/pommersfelden-graflich-schonbornsche-bibliothek' : '' , #'Pommersfelden, Gräflich Schönbornsche Bibliothek'
    'https://imagoarchive.it/resource/porto-biblioteca-publica-municipal' : 'http://www.wikidata.org/entity/Q630086' , #Municipal Public Library of Porto (Q630086)'Porto, Biblioteca Pública Municipal'
    'https://imagoarchive.it/resource/praga-biblioteca-nazionale' : 'http://www.wikidata.org/entity/Q1967876' , #National Library of the Czech Republic (Q1967876)'Praga, Biblioteca Nazionale' 
    'https://imagoarchive.it/resource/praga-knihovna-metropolitni-kapituly'  : 'http://www.wikidata.org/entity/Q20755622' , #Library of the Metropolitan Chapter of Prague (Q20755622) 'Praga, Knihovna Metropolitní Kapituly'
    'https://imagoarchive.it/resource/providence-rhode-island-john-carter-brouwn-library' : 'http://www.wikidata.org/entity/Q6225372' , #John Carter Brown Library (Q6225372) 'Providence, (Rhode Island), John Carter Brouwn Library'
    'https://imagoarchive.it/resource/rein-stiftsbibliothek' : '' , #'Rein, Stiftsbibliothek'
    'https://imagoarchive.it/resource/romont-bibliothek-des-kapuzinerklosters' : '' , #'Romont, Bibliothek des Kapuzinerklosters'
    'https://imagoarchive.it/resource/rouen-bibliotheque-municipale' : 'http://www.wikidata.org/entity/Q2901555' , #Bibliothèque Jacques Villon (Q18573998) or Rn'Bi (Q2901555)? 'Rouen, Bibliothèque Municipale'
    'https://imagoarchive.it/resource/saint-bonaventure-university' : 'http://www.wikidata.org/entity/Q93662' , #St. Bonaventure University (Q93662) 'Saint Bonaventure University'
    'https://imagoarchive.it/resource/saint-omer-bibliotheque-de-lagglomeration-du-pays-de-saint-omer' : 'http://www.wikidata.org/entity/Q61931287' , #Bibliothèque d'Agglomération du Pays de Saint-Omer (Q61931287) "Saint-Omer, Bibliothèque de l'Agglomération du Pays de Saint-Omer"
    'https://imagoarchive.it/resource/saint-remi' : 'http://www.wikidata.org/entity/Q122763379' , #Saint Remi library (Q122763379)? 'Saint-Remi'
    'https://imagoarchive.it/resource/salisbury-cathedral-library' : '' , 'Salisbury, Cathedral Library'
    'https://imagoarchive.it/resource/saluzzo-biblioteca-civica' : '' , #Biblioteca Civica "Andrej Sacharov" (Q117192532) o Biblioteca Civica Lidia Beccaria Rolfi (Q112924851) o Biblioteca Civica Matteo Blengino (Q112924856)?  'Saluzzo, Biblioteca Civica'
    'https://imagoarchive.it/resource/salzburg-benediktiner-erzabtei-sankt-peter' : 'http://www.wikidata.org/entity/Q675735' ,  #St Peter's Archabbey Salzburg (Q675735) 'Salzburg, Benediktiner-Erzabtei Sankt Peter'
    'https://imagoarchive.it/resource/san-gallo-stiftsbibliothek' : 'http://www.wikidata.org/entity/Q689896' , #Abbey library of St. Gallen (Q689896) 'San Gallo, Stiftsbibliothek'
    'https://imagoarchive.it/resource/sankt-florian-stiftsbibliothek' : '' , #'Sankt Florian, Stiftsbibliothek'
    'https://imagoarchive.it/resource/sankt-paul-im-lavanttal-bibliothek-des-benediktinerstifts' : 'http://www.wikidata.org/entity/Q123423410' , #Library of the Benedictine Abbey of St. Paul's in Lavanttal (Q123423410) 'Sankt Paul im Lavanttal, Bibliothek des Benediktinerstifts'
    'https://imagoarchive.it/resource/san-marino-ca-he-hungtington-library' : 'http://www.wikidata.org/entity/Q1400558' , #The Huntington Library, Art Museum, and Botanical Gardens (Q1400558) 'San Marino, CA, H.E. Hungtington Library'
    'https://imagoarchive.it/resource/schlagl-stiftsbibliothek' : '' ,  #'Schlägl, Stiftsbibliothek'
    'https://imagoarchive.it/resource/schlierbach-stiftsbibliothek' : '' , #'Schlierbach, Stiftsbibliothek'
    'https://imagoarchive.it/resource/selestat-bibliotheque-municipale' : '' , #Humanist Library of Sélestat (Q1636682)? 'Sélestat, Bibliothèque Municipale' 
    'https://imagoarchive.it/resource/soissons-bibliotheque-municipale' : '' , #'Soissons, Bibliothèque municipale'
    'https://imagoarchive.it/resource/stoccolma-archivio-nazionale' : 'http://www.wikidata.org/entity/Q1724971' , #National Archives of Sweden (Q1724971) 'Stoccolma, Archivio Nazionale'
    'https://imagoarchive.it/resource/st-pauls-cathedral-library' : '' , #"St. Paul's Cathedral Library"
    'https://imagoarchive.it/resource/strasburgo-bibliotheque-municipale' : 'http://www.wikidata.org/entity/Q3332595' , #Médiathèque André-Malraux de Strasbourg (Q3332595)? 'Strasburgo, Bibliothèque municipale'
    'https://imagoarchive.it/resource/straburg-bibliotheque-de-la-ville' : 'http://www.wikidata.org/entity/Q3332595' , #Coincide con quella sopra? 'Straßburg, Bibliothèque de la Ville'
    'https://imagoarchive.it/resource/stuttgart-wurttembergische-landesbibliothek' : 'http://www.wikidata.org/entity/Q317950' , #Württembergische Landesbibliothek (Q317950) 'Stuttgart, Württembergische Landesbibliothek'
    'https://imagoarchive.it/resource/tarragona-biblioteca-publica-del-estado' : 'http://www.wikidata.org/entity/Q11909310' , #Tarragona Public Library (Q11909310) 'Tarragona, Biblioteca publica del Estado'
    'https://imagoarchive.it/resource/todi-perugia-biblioteca-comunale-lorenzo-leonii' : 'http://www.wikidata.org/entity/Q112875483' , #Biblioteca Comunale "Lorenzo Leoni" (Q112875483) 'Todi (Perugia), Biblioteca Comunale «Lorenzo Leonii»' 
    'https://imagoarchive.it/resource/toledo-archivo-y-biblioteca-capitulares' : 'http://www.wikidata.org/entity/Q85692455' , #Catedral de Toledo. Biblioteca (Q85692455) 'Toledo, Archivo y Biblioteca Capitulares'
    'https://imagoarchive.it/resource/toledo-ohio-art-museum' : 'http://www.wikidata.org/entity/Q1743116' , #Toledo Museum of Art (Q1743116) 'Toledo (Ohio), Art Museum'
    'https://imagoarchive.it/resource/torino-biblioteca-dellaccademia-delle-scienze' : 'http://www.wikidata.org/entity/Q113515722' , #Biblioteca dell'Accademia delle scienze (Q113515722) "Torino, Biblioteca dell'Accademia delle Scienze"
    'https://imagoarchive.it/resource/torun-biblioteka-glowna-uniwersytetu-mikolaja-kopernika': 'http://www.wikidata.org/entity/Q7029922' , #Nicolaus Copernicus University Library (Q7029922) 'Torun, Biblioteka Glówna Uniwersytetu Mikolaja Kopernika' 
    'https://imagoarchive.it/resource/tournai-bibliotheque-communale' : 'http://www.wikidata.org/entity/Q120869227' , #Bibliotheque de la Ville de Tournai (Q120869227) 'Tournai, Bibliothèque Communale'
    'https://imagoarchive.it/resource/trebon-statni-oblastni-archiv' : 'http://www.wikidata.org/entity/Q12056841' , #Regional State Archives in Třeboň (Q12056841) 'Třeboň, Státní Oblástní Archiv'
    'https://imagoarchive.it/resource/trier-bistumsarchiv-bischofliches-archiv-olim-dombibliothek' : 'http://www.wikidata.org/entity/Q28735003' , #Catholic Diocese of Trier Archives (Q28735003) 'Trier, Bistumsarchiv (Bischöfliches Archiv, olim Dombibliothek)'
    'https://imagoarchive.it/resource/universitatsbibliothek-basilea' : 'http://www.wikidata.org/entity/Q81164649' , #Basel University Library (Q81164649) 'Universitätsbibliothek Basilea' 
    'https://imagoarchive.it/resource/universitatsbibliothek-graz' : 'http://www.wikidata.org/entity/Q604066' , #University of Graz Library (Q604066) 'Universitätsbibliothek Graz'
    'https://imagoarchive.it/resource/universitatsbibliothek-lipsia' : 'http://www.wikidata.org/entity/Q872896' , #Leipzig University Library (Q872896) 'Universitätsbibliothek Lipsia'
    'https://imagoarchive.it/resource/university-library-of-cincinnati' : 'http://www.wikidata.org/entity/Q73495388' , #University of Cincinnati Libraries (Q73495388) 'University Library of Cincinnati' 
    'https://imagoarchive.it/resource/university-of-groningen-library' : 'http://www.wikidata.org/entity/Q200899' , #University of Groningen Library (Q200899) 'University of Groningen Library'
    'https://imagoarchive.it/resource/varsavia-biblioteca-nazionale' : 'http://www.wikidata.org/entity/Q856423' , #National Library of Poland (Q856423) 'Varsavia, Biblioteca Nazionale'
    'https://imagoarchive.it/resource/vesoul-biblioteca-municipale' : 'http://www.wikidata.org/entity/Q2901287' , #Louis-Garret library (Q2901287) 'Vesoul, Biblioteca Municipale'
    'https://imagoarchive.it/resource/vorau-biblioteca-dellabbazia' : '' , #in quale lingua? "Vorau, Biblioteca dell'abbazia"
    'https://imagoarchive.it/resource/vyssi-brod-biblioteca-del-monastero' : '' , #Vyšebrodská klášterní knihovna  'Vyssi Brod, Biblioteca del monastero'
    'https://imagoarchive.it/resource/weimar-herzogin-anna-amalia-bibliothek' : 'http://www.wikidata.org/entity/Q50711' , #Duchess Anna Amalia Library (Q50711) 'Weimar, Herzogin Anna Amalia Bibliothek'
    'https://imagoarchive.it/resource/wellesley-university-library' : 'http://www.wikidata.org/entity/Q49205' , #Wellesley College (Q49205)  'Wellesley, University Library'
    'https://imagoarchive.it/resource/wien-dominikanerkonvent' : 'http://www.wikidata.org/entity/Q1238007' , #Dominican monastery, Vienna (Q1238007) 'Wien, Dominikanerkonvent'
    'https://imagoarchive.it/resource/wien-schottenkloster-stiftsbibliothek' : '' , #Schottenstift Stiftsbibliothek 'Wien, Schottenkloster, Stiftsbibliothek'
    'https://imagoarchive.it/resource/wiesbaden-hochschul-und-landesbibliothek' : 'http://www.wikidata.org/entity/Q119810789' , #Hessian State Library Wiesbaden (Q119810789) 'Wiesbaden, Hochschul- und Landesbibliothek'
    'https://imagoarchive.it/resource/windsheim-stadtbibliothek' : 'http://www.wikidata.org/entity/Q77475046' , #Ratsbibliothek Bad Windsheim (Q77475046) 'Windsheim, Stadtbibliothek'
    'https://imagoarchive.it/resource/wissenschaftliche-allgemein-bibliothek-der-stadt-erfurt' : '' , #'Wissenschaftliche Allgemein-Bibliothek der Stadt Erfurt'
    'https://imagoarchive.it/resource/worcester-cathedral-and-chapter-library' : '' , #Worcester Cathedral Library 'Worcester, Cathedral and Chapter Library'
    'https://imagoarchive.it/resource/wroclaw-biblioteka-kapitulna' : '' , #No label defined (Q110416522) 'Wroclaw, Biblioteka Kapitulna'
    'https://imagoarchive.it/resource/wroclaw-biblioteka-uniwersytecka' : '' , #Wrocław University Library (Q1720553) o Wrocław University Library (Q30059757) 'Wroclaw, Biblioteka Uniwersytecka'
    'https://imagoarchive.it/resource/wroclaw-biblioteka-zakladu-narodowego-im-ossolinskich-ossolineum' : '' , #No label defined (Q110979037) 'Wroclaw, Biblioteka Zakladu Narodowego im. Ossolinskich (Ossolineum)'
    'https://imagoarchive.it/resource/wurttemberg-kupferstich-sammlung-des-furstlichen-schlosses-wolfegg' : 'http://www.wikidata.org/entity/Q1649788' , #Schloss Wolfegg (Q1649788) 'Württemberg, Kupferstich Sammlung des fürstlichen Schlosses Wolfegg'
    'https://imagoarchive.it/resource/york-austin-friars-library' : 'http://www.wikidata.org/entity/Q4821239' , #Augustinian Friary, York (Q4821239) "York, Austin Friars' Library"
    'https://imagoarchive.it/resource/york-minster-library' : 'http://www.wikidata.org/entity/Q120869294' , #York Minster Library (Q120869294)'York, Minster Library'
    'https://imagoarchive.it/resource/zeitz-stiftsbibliotheck' : '' , #Stiftsbibliothek Zeitz 'Zeitz, Stiftsbibliotheck'
    'https://imagoarchive.it/resource/zug-pfarrbibliothek-sankt-michael' : 'http://www.wikidata.org/entity/Q27490188' , #Pfarrbibliothek St. Michael (Q27490188) 'Zug, Pfarrbibliothek Sankt Michael'
    'https://imagoarchive.it/resource/zutphen-st-walburgskerk' : 'http://www.wikidata.org/entity/Q2922482' , #Librije (Q2922482) 'Zutphen, St. Walburgskerk'
    'https://imagoarchive.it/resource/zwettl-bibliothek-des-zisterzienserstifts' : '' , #'Zwettl, Bibliothek des Zisterzienserstifts'
    'https://imagoarchive.it/resource/zwickau-ratsschulbibliothek-stadtarchiv' : 'http://www.wikidata.org/entity/Q2132885' , #Ratsschulbibliothek Zwickau (Q2132885) 'Zwickau, Ratsschulbibliothek (Stadtarchiv)'
}

iri_correction = {
    "http://www.wikidata.org/entity/Q5310993" : "http://www.wikidata.org/entity/Q81165027"
}

# Base directory of Annotation app
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# JSON file paths
NOTE_PATH = os.path.join(BASE_DIR, 'json/exported_libraries.json')

WD_SPARQL_URL = 'http://query.wikidata.org/sparql?query='

l = Library.objects

retrived_libraries = {}

def wikidata_request(query):
    # Request URL
    request_url = f'{WD_SPARQL_URL}{urllib.parse.quote(query)}&format=json'

    # Make request
    with urllib.request.urlopen(request_url) as response:
        results = json.loads(response.read())['results']['bindings']
        return results
    return None


def make_query(iri, libraryName=''):
    
    qid = iri.split('/entity/')[1] # Wikidata ID starting with Q

    # Wikidata query
    wd_query = f'\nSELECT ?item ?label ?name ?label_lang_item ?city ?coordinates (lang(?label) AS ?label_lang) \n\
                WHERE {{ hint:Query hint:optimizer "None". \n\
                BIND (wd:{qid} AS ?item) \n\
                ?item wdt:P17 ?country . \n\
                ?country wdt:P37 ?countrylanguage . \n\
                ?countrylanguage wdt:P1705 ?countrylanguagelabel . \n\
                BIND(lang(?countrylanguagelabel) as ?label_lang_country) \n\
                OPTIONAL {{ \n\
                    ?item wdt:P131 ?city .  \n\
                    }} \n\
                OPTIONAL {{ \n\
                    ?item wdt:P625 ?coordinates . \n\
                    }} \n\
                OPTIONAL {{ \n\
                    ?item wdt:P1448 ?name . \n\
                    }} \n\
                OPTIONAL {{\n\
                    ?item wdt:P37 ?language . \n\
                ?language wdt:P1705 ?languagelabel . \n\
                BIND(lang(?languagelabel) as ?label_lang_item) \n\
                    }} \n\
                    ?item rdfs:label ?label . \n\
                        filter(lang(?label) = ?label_lang_item || lang(?label) = ?label_lang_country) \n\
                }}'

    wd_query_2 = f'\nSELECT ?item ?label (lang(?label) AS ?label_lang) \n\
                WHERE {{ hint:Query hint:optimizer "None". \n\
                BIND (wd:{qid} AS ?item) \n\
                    ?item rdfs:label ?label . \n\
                    filter(lang(?label) = "it" || lang(?label) = "en" || lang(?label) = "la" ) \n\
                }}'

    # Run Wikidata query
    query_results = wikidata_request(wd_query)
    query_results_2 = wikidata_request(wd_query_2)
    originalName = ''
    originalLang = ''
    city = ''
    coordinates = ''
    name = ''
    lang = ''
    if query_results:
        try:
            city = query_results[0]['city']['value']
        except:
            city = ''
        try:
            coordinates = query_results[0]['coordinates']['value']
        except:
            coordinates = ''
        try:
            originalName = query_results[0]['name']['value']
        except:
            originalName = ''
        try:
            originalLang = query_results[0]['label_lang_item']['value']
        except:
            originalLang = ''
        for query_result in query_results:
            if query_result['label']['xml:lang'] == query_result['label_lang']['value']:
                name = query_result['label']['value']
                lang = query_result['label_lang']['value']
                break
    englishName = ''
    italianName = ''
    latinName = ''
    if query_results_2:
        for query_result_2 in query_results_2:
            try:
                if query_result_2['label']['xml:lang'] == 'en':
                    englishName = query_result_2['label']['value']
            except:
                englishName = ''
            try:
                if query_result_2['label']['xml:lang'] == 'it':
                    italianName = query_result_2['label']['value']
            except:
                italianName = ''
            try:
                if query_result_2['label']['xml:lang'] == 'la':
                    latinName = query_result_2['label']['value']
            except:
                latinName = ''
        
    
    data = {'iri': iri, 'userLibraryName' : libraryName , 'originalName': originalName, 'originalLang': originalLang, 'name': libraryName, 'oldName': name, 'lang': lang, 'englishName' : englishName, 'city' : city, 'coordinates' : coordinates, 'italianName' : italianName, 'latinName' : latinName}

    return data

def makeLibraryJSON(library_iri, library_name):
    
    if re.search("^https://imagoarchive.it/resource/", library_iri):
        # print(library_name)
        if library_iri in correction:
            # print(correction[library_name])
            if(correction[library_iri]!=""):
                # return make_query(correction[library_iri], library_name)
                if correction[library_iri] in retrived_libraries:
                    return retrived_libraries[correction[library_iri]]
                else:
                    retrived_libraries[correction[library_iri]] = make_query(correction[library_iri], library_name)
                    return retrived_libraries[correction[library_iri]]
            else:
                return {'iri': library_iri , "name" : library_name}
        else:
            return {'iri': library_iri , "name" : library_name}
    else:
        # print(library_iri)
        if library_iri in iri_correction:
            library_iri = iri_correction[library_iri]
        if library_iri in retrived_libraries:
            return retrived_libraries[library_iri]
        else:
            retrived_libraries[library_iri] = make_query(library_iri, library_name)
            return retrived_libraries[library_iri]
            

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
            print('   Exporting libraries...   ', end='')
            exported_note_count = 0
            
            try:
                # Notes to be exported
                # places = serializers.serialize('json', p.all()) # get all the lemmas in db
                libraries = l.all()
                # for every place
                for library in libraries:
                    l_json = {} # new empty dict for lemma
                    pk = library.pk # id of the lemma
                    library_iri = library.data['iri'] # get the json of the lemma from db
                    library_name = library.data['name']
                    # print(library_iri)
                    # if re.search("^https://imagoarchive.it/resource/", library_iri):
                        # print(library_name)
                    x = library_name.split(",")
                    if len(x)==2:
                        # print(library_name)
                        # print(x[1])
                        library.data['oldName'] = library_name
                        library.data['name'] = x[1]
                        Library.objects.filter(data__iri=library_iri).update(data=library.data)
                           
                        
                        if library_iri in correction:
                            # print(correction[library_name])
                            if(correction[library_iri]!=""):
                                corrected = make_query(correction[library_iri], library_name)
                                # print(library_iri, corrected['iri'])
                                try:
                                    
                                    obj = Library.objects.get(data__iri=corrected['iri'])
                                except Library.DoesNotExist:
                                    obj = Library(data=corrected)
                                    obj.save()  
                    # else:
                    #     # print(library_iri)
                    #     print(make_query(library_iri))
                    # except:
                    #     print(place_iri)
                 
                    #  Write notes to JSON file
                # with open(opt_path, 'w') as note_file:
                #     # note_file.write(l_json)
                #     json.dump(places, note_file)
               
            except:
                raise

            print(f'Exported {l.all().count()} libraries')
            print()

            if errors:
                print('\n'.join(errors))
                print()

        # Exit gracefully in case of keyboard interrupt
        except KeyboardInterrupt:
            print('\n')
            sys.exit()
