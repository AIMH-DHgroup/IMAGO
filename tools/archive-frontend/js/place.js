///////////////////////////////////////////////////////////////////////////
//
// Project:   IMAGO
// Package:   Web application
// File:      place.js
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
	"SELECT ?placeName ?s_coordinates " +
	"FROM <"+named_graph+">" +
	"WHERE {" +
	"  BIND(<"+iriParam+"> AS ?place)" +
	"   ?place :is_identified_by_toponym ?toponym ;" +
	"                  ecrm:P168_place_is_defined_by ?coordinates ." +
	"  	?coordinates ecrm:P190_has_symbolic_content ?s_coordinates ." +
	"   ?toponym ecrm:P190_has_symbolic_content ?placeName ." +
	"}";

    

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
    var placeNameSpan = document.getElementById("place");
    var coordinatesSpan = document.getElementById("coordinates");
      
    for (var i=0; i<data.results.bindings.length; i++) {
        place_name = data.results.bindings[i].placeName.value;
        try{
        coordinates = data.results.bindings[i].s_coordinates.value;
        }catch{ coordinates = "-"}

        idLemmaBread.textContent = place_name;
        placeNameSpan.textContent = place_name;
        coordinatesSpan.textContent = coordinates;
        
    }
  
    

    var search_man = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>" +
	"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
	"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +
	"PREFIX ecrm: <http://erlangen-crm.org/200717/>" +
	"PREFIX ilrm: <http://imagoarchive.it/ilrmoo/>" +
	"PREFIX : <https://imagoarchive.it/ontology/>" +
	"SELECT ?libraryName ?library " +
	"FROM <"+named_graph+">" +
	"WHERE {" +
	"  BIND(<"+iriParam+"> AS ?libraryPlace)" +
	"   ?library a :Library ;" +
	"            ecrm:P74_has_current_or_former_residence ?libraryPlace ;" +
	"  	ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?libraryName ." +
	"   ?libraryPlace :is_identified_by_toponym ?toponym ;" +
	"                  ecrm:P168_place_is_defined_by ?coordinates ." +
	"  	?coordinates ecrm:P190_has_symbolic_content ?s_coordinates ." +
	"   ?toponym ecrm:P190_has_symbolic_content ?placeName ." +
	"} ORDER BY ?libraryName ";

    

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

    var manList = document.getElementById("libraries-list");
     
    if(data2.results.bindings.length==0){
        text = document.createTextNode("nessuna biblioteca");
        manList.appendChild(text);
        }
    for (var i=0; i<data2.results.bindings.length; i++) {
        library_iri = data2.results.bindings[i].library.value;
        library_name = data2.results.bindings[i].libraryName.value;


        li = document.createElement('li');
        li.className = "list-group-item";
        var a = document.createElement('a'); 
        a.href = "library.html?iri=" + library_iri;
        text = document.createTextNode(library_name);
        a.appendChild(text);
        li.appendChild(a);

        manList.appendChild(li);
      
    }

       

    var search_work = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>" +
    "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +
    "PREFIX ecrm: <http://erlangen-crm.org/200717/>" +
    "PREFIX ilrm: <http://imagoarchive.it/ilrmoo/>" +
    "PREFIX : <https://imagoarchive.it/ontology/>" +
    "SELECT ?exp_cre ?title ?authorName " +
    "FROM <"+named_graph+">" +
    "WHERE {" +
    "  BIND(<"+iriParam+"> AS ?place)" +
    "?exp_cre a ilrm:F28_Expression_Creation ;" +
    "            :has_abstract ?abstract ;" +
    "	  		 ilrm:R17_created ?work ;" +
    "	  		 ecrm:P14_carried_out_by ?author .	" +
    "	  ?author a :Author ;" +
    "	     ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?authorName ." +
    "	  ?work a ilrm:F2_Expression ;" +
    "	  ecrm:P102_has_title/ecrm:P190_has_symbolic_content ?title ." +
    "    ?work ecrm:P106_is_composed_of ?toponym ." +
    "    ?place :is_identified_by_toponym ?toponym ;" +
    "           ecrm:P168_place_is_defined_by/ecrm:P190_has_symbolic_content ?coord ." +
    "    ?toponym ecrm:P190_has_symbolic_content ?placeName ." +
    "	} GROUP BY ?exp_cre ?title ?author ?authorName ?abstract";



    var query_work = url + encodeURIComponent(search_work);

    // Fetch current annotation
    let response3 = await fetch(query_work, {
        method: 'GET',
        headers: headers,
        mode: 'cors' 
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    let data3 = await response3.json();

    var workList = document.getElementById("toponyms-list");

    if(data3.results.bindings.length==0){
        text = document.createTextNode("questo luogo non è citato in nessuna opera");
        workList.appendChild(text);
     }
    for (var i=0; i<data3.results.bindings.length; i++) {
        title = data3.results.bindings[i].title.value;
        name_author = data3.results.bindings[i].authorName.value;
        iri_work = data3.results.bindings[i].exp_cre.value;


        li = document.createElement('li');
        li.className = "list-group-item";
        var a = document.createElement('a'); 
        a.href = "lemma.html?iri=" + iri_work;
        text = document.createTextNode(name_author + ", " + title);
        a.appendChild(text);
        li.appendChild(a);

        workList.appendChild(li);
   
    }


    var search_print = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>" +
	"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
	"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +
	"PREFIX ecrm: <http://erlangen-crm.org/200717/>" +
	"PREFIX ilrm: <http://imagoarchive.it/ilrmoo/>" +
	"PREFIX : <https://imagoarchive.it/ontology/>" +
	"SELECT ?print_author ?print_edition ?print_title ?l_datazione ?placeName ?publisher " +
	"FROM <"+named_graph+">" +
	"WHERE {" +
	"  BIND(<"+iriParam+"> AS ?toponym)" +
	"  ?exp_cre a ilrm:F28_Expression_Creation ;" +
	"  		 ilrm:R17_created ?work ;" +
	"  		 ecrm:P14_carried_out_by ?author .	" +
	"  ?author a :Author ;" +
	"     ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?authorName ." +
   "  ?printEditionCreation ilrm:R24_created ?print_edition  ." +
	"  ?work a ilrm:F2_Expression ;" +
	"  ecrm:P102_has_title/ecrm:P190_has_symbolic_content ?title ." +
	"  ?print_edition ilrm:R4_embodies ?work ;" +
	" 				 ecrm:P106_is_composed_of/ecrm:P190_has_symbolic_content ?print_author ;" +
	"   				 ecrm:P102_has_title/ecrm:P190_has_symbolic_content ?print_title ." +
	"  ?print_creation ilrm:R24_created ?print_edition ." +
    "  OPTIONAL{ ?printEditionCreation ecrm:P4_has_time-span/ecrm:P170i_time_is_defined_by ?l_datazione . }" +
	"  OPTIONAL{" +
	"  ?print_creation  :has_curator/ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?curator ." +
	"  }" +
	"  ?print_creation  ecrm:P7_took_place_at ?toponym ." +
	"  ?toponym :is_identified_by_toponym/ecrm:P190_has_symbolic_content ?placeName ." +
	"   OPTIONAL{" +
	"   ?print_creation :has_publisher/ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?publisher ." +
	"  }" +
	"}";



    var query_prin = url + encodeURIComponent(search_print);

    // Fetch current annotation
    let response4 = await fetch(query_prin, {
        method: 'GET',
        headers: headers,
        mode: 'cors' 
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    let data4 = await response4.json();

    var printList = document.getElementById("print-list");
    
    if(data4.results.bindings.length==0){
        text = document.createTextNode("questo luogo non è il luogo di edizione di nessuna edizione a stampa");
        printList.appendChild(text);
     }
    for (var i=0; i<data4.results.bindings.length; i++) {
        iri_print_edition = data4.results.bindings[i].print_edition.value;
        try{place = data4.results.bindings[i].placeName.value;} catch{ place = ""}
        try{publisherName = data4.results.bindings[i].publisher.value;} catch{ publisherName = ""}
        try{datazione = data4.results.bindings[i].l_datazione.value;} catch{ datazione = ""}
        // places = data4.results.bindings[i].places.value;
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

        printList.appendChild(li);
        
    }

});




  
  