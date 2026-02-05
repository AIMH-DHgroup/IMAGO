///////////////////////////////////////////////////////////////////////////
//
// Project:   IMAGO
// Package:   Web application
// File:      lemma.js
// Path:      /var/www/html/archive/js/
// Type:      javascript
// Started:   2023.11.08
// Author(s): Nicolò Pratelli
// State:     online
//
// Version history.
// - 2024.11.08  Nicolò
//   First version
//
// ////////////////////////////////////////////////////////////////////////////
//
// This file is part of software developed by the IMAGO Project
// Further information at: http://imagoarchive.it
// Copyright (C) 2020-2024 CNR-ISTI, AIMH, AI&Digital Humanities group
//
// This is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published
// by the Free Software Foundation; either version 3.0 of the License,
// or (at your option) any later version.
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
// See the GNU General Public License for more details.
// You should have received a copy of the GNU General Public License
// along with this program; if not, see <http://www.gnu.org/licenses/>.
//
// ///////////////////////////////////////////////////////////////////////

const url= "https://imagoarchive.it/fuseki/imago/query?output=json&query=";
const named_graph = "https://imagoarchive.it/fuseki/imago/archive";
// const url= "http://localhost:3030/imago/query?output=json&query=";
// const named_graph = "http://localhost:3030/imago/archive";

// Wait for the page to load
document.addEventListener('DOMContentLoaded', async function () {

// Create urlParams query string
var urlParams = new URLSearchParams(window.location.search);

// Get value of single parameter
var iriParam = urlParams.get('iri');

// Output value to console
console.log(iriParam);

 
    // Set request headers
    let headers = new Headers();
    //headers.append('X-CSRFToken', csrf);
    headers.append('X-Requested-With', 'XMLHttpRequest');


    var search_query = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>" +
	"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
	"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +
	"PREFIX ecrm: <http://erlangen-crm.org/200717/>" +
	"PREFIX ilrm: <http://imagoarchive.it/ilrmoo/>" +
	"PREFIX : <https://imagoarchive.it/ontology/>" +
	"SELECT ?exp_cre ?title ?author ?authorName ?abstract (group_concat(distinct ?genreName;separator=\", \") as ?genres) (group_concat(distinct ?placeName;separator=\", \") as ?places) " +
	"FROM <"+named_graph+">" +
	"WHERE {" +
	"  BIND(<"+iriParam+"> AS ?exp_cre)" +
	"?exp_cre a ilrm:F28_Expression_Creation ;" +
	"            :has_abstract ?abstract ;" +
	"	  		 ilrm:R17_created ?work ;" +
	"	  		 ecrm:P14_carried_out_by ?author .	" +
	"	  ?author a :Author ;" +
	"	     ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?authorName ." +
	"	  ?work a ilrm:F2_Expression ;" +
	"	  ecrm:P102_has_title/ecrm:P190_has_symbolic_content ?title ." +
	"   OPTIONAL {" +
	"    	?work :has_genre ?genre ." +
	"   		?genre :has_genre_name ?genreName .}" +
	"  OPTIONAL {" +
	"    ?work ecrm:P106_is_composed_of ?toponym ." +
	"    ?place :is_identified_by_toponym ?toponym ;" +
	"           ecrm:P168_place_is_defined_by/ecrm:P190_has_symbolic_content ?coord ." +
	"    ?toponym ecrm:P190_has_symbolic_content ?placeName ." +
	"  }" +
	"	} GROUP BY ?exp_cre ?title ?author ?authorName ?abstract";

    

    var query = url + encodeURIComponent(search_query);

    // Fetch current annotation
    let response = await fetch(query, {
        method: 'GET',
        headers: headers,
        mode: 'cors' 
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    let data = await response.json();

    var idLemmaBread = document.getElementById("id-lemma-bread");
    var idLemmaAuthorBread = document.getElementById("id-lemma-author-bread");
    var authorName = document.getElementById("author");
    var work = document.getElementById("work");
    var abstractSpan = document.getElementById("abstract");
    var genresP = document.getElementById("genres");
    var placesP = document.getElementById("places");
       

    for (var i=0; i<data.results.bindings.length; i++) {
        title = data.results.bindings[i].title.value;
        name_author = data.results.bindings[i].authorName.value;
        iri_author = data.results.bindings[i].author.value;
        abstract = data.results.bindings[i].abstract.value;
        try{genres = data.results.bindings[i].genres.value;} catch{ genres = "-"}
        try{places = data.results.bindings[i].places.value;} catch{ places = "-"}

        idLemmaBread.textContent = title;
        idLemmaAuthorBread.textContent = name_author;
        idLemmaAuthorBread.href = "author.html?iri=" + iri_author;
        authorName.textContent = name_author;
        work.textContent = title;
        abstractSpan.textContent = abstract;
        genresP.textContent = genres;
        placesP.textContent = places;
        
    }
         
    var search_man = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>" +
	"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
	"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +
	"PREFIX ecrm: <http://erlangen-crm.org/200717/>" +
	"PREFIX ilrm: <http://imagoarchive.it/ilrmoo/>" +
	"PREFIX : <https://imagoarchive.it/ontology/>" +
	"SELECT DISTINCT ?manuscript ?placeName ?libraryName ?signature ?folios ?l_manuscript_author ?l_m_title " +
	"FROM <"+named_graph+">" +
	"WHERE {" +
	"  BIND(<"+iriParam+"> AS ?exp_cre)" +
	"  ?exp_cre ilrm:R18_created ?manuscript ." +
	"  ?manuscript ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?signature ;" +
	"              ecrm:P50_has_current_keeper ?library ;" +
	"              ecrm:P46_is_composed_of/ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?folios ." +
	"  ?manifestation ilrm:R7i_is_materialized_in ?manuscript ." +
	"  ?library ecrm:P74_has_current_or_former_residence ?libraryPlace ;" +
	"  	ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?libraryName ." +
	"   ?libraryPlace :is_identified_by_toponym ?toponym ." +
	"   ?toponym ecrm:P190_has_symbolic_content ?placeName ." +
	"  OPTIONAL{" +
	"  ?m_author ecrm:P106i_forms_part_of ?manifestation ;" +
	"				ecrm:P190_has_symbolic_content ?l_manuscript_author ." +
	"  }" +
	"  OPTIONAL{" +
	"  ?manuscript ecrm:P102_has_title ?m_title ." +
	"  ?m_title ecrm:P190_has_symbolic_content ?l_m_title ." +
	"  }" +
	"  " +
	"} ORDER BY ?placeName ?libraryName ?signature" ;

    

    var query_man = url + encodeURIComponent(search_man);

    // Fetch current annotation
    let response2 = await fetch(query_man, {
        method: 'GET',
        headers: headers,
        mode: 'cors' 
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    let data2 = await response2.json();
    
    var manList = document.getElementById("manuscript-list");

    if(data2.results.bindings.length==0){
        text = document.createTextNode("nessun manoscritto censito");
        manList.appendChild(text);
        }
    for (var i=0; i<data2.results.bindings.length; i++) {
        iri_manuscript = data2.results.bindings[i].manuscript.value;
        place = data2.results.bindings[i].placeName.value;
        library = data2.results.bindings[i].libraryName.value;
        signatureName = data2.results.bindings[i].signature.value;

        li = document.createElement('li');
        li.className = "list-group-item";
        var a = document.createElement('a'); 
        a.href = "manuscript.html?iri=" + iri_manuscript;
        if(library == "Sconosciuta"){
            text = document.createTextNode(place + ", " + signatureName);
        }else{
            text = document.createTextNode(place + ", " + library + ", " + signatureName);
        }
       
        a.appendChild(text);
        li.appendChild(a);

        manList.appendChild(li);        
    }

    var search_prin = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>" +
    "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +
    "PREFIX ecrm: <http://erlangen-crm.org/200717/>" +
    "PREFIX ilrm: <http://imagoarchive.it/ilrmoo/>" +
    "PREFIX : <https://imagoarchive.it/ontology/>" +
    "SELECT ?print_edition ?placeName ?publisher ?l_datazione " +
    "FROM <"+named_graph+">" +
    "WHERE {" +
    "  BIND(<"+iriParam+"> AS ?exp_cre)" +
    "  ?exp_cre a ilrm:F28_Expression_Creation ;" +
    "  		 ilrm:R17_created ?work ." +
    "  ?printEditionCreation ilrm:R24_created ?print_edition  ." +
    "  ?print_edition ilrm:R4_embodies ?work ." +
    "  ?print_creation ilrm:R24_created ?print_edition ." +
    "  OPTIONAL{ ?printEditionCreation ecrm:P4_has_time-span/ecrm:P170i_time_is_defined_by ?l_datazione . }" +
    "  OPTIONAL{ ?print_creation  ecrm:P7_took_place_at/:is_identified_by_toponym/ecrm:P190_has_symbolic_content ?placeName .}" +
    "  OPTIONAL{ ?print_creation :has_publisher/ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?publisher . }" +
    "} ORDER BY ?placeName ?publisher" +
    "";


    var query_prin = url + encodeURIComponent(search_prin);

    // Fetch current annotation
    let response3 = await fetch(query_prin, {
        method: 'GET',
        headers: headers,
        mode: 'cors' 
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    let data3 = await response3.json();
    
    var prinList = document.getElementById("print-list");
    
    if(data3.results.bindings.length==0){
        text = document.createTextNode("nessuna edizione a stampa censita");
        prinList.appendChild(text);
     }
    for (var i=0; i<data3.results.bindings.length; i++) {
        iri_print_edition = data3.results.bindings[i].print_edition.value;
        try{place = data3.results.bindings[i].placeName.value;} catch{ place = ""}
        try{publisherName = data3.results.bindings[i].publisher.value;} catch{ publisherName = ""}
        try{datazione = data3.results.bindings[i].l_datazione.value;} catch{ datazione = ""}
        // places = data3.results.bindings[i].places.value;
        if(place=="Sconosciuto"||place==""){
            place = "[s.l.]"; 
         }

         if(publisherName==""){
            publisherName = "[s.t.]"; 
         }
        
        if(datazione==""){
           datazione = "[s.d.]"; 
        }

        li = document.createElement('li');
        li.className = "list-group-item";
        var a = document.createElement('a'); 
        a.href = "printEdition.html?iri=" + iri_print_edition;
        text = document.createTextNode(place + ", " + publisherName + ", " + datazione);
        a.appendChild(text);
        li.appendChild(a);

        prinList.appendChild(li);
    
    }


});
