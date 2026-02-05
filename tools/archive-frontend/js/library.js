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
	"SELECT ?libraryName ?libraryPlace ?placeName " +
	"FROM <"+named_graph+">" +
	"WHERE {" +
	"  BIND(<"+iriParam+"> AS ?library)" +
	"" +
	"   ?library a :Library ;" +
	"            ecrm:P74_has_current_or_former_residence ?libraryPlace ;" +
	"  	ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?libraryName ." +
	"   ?libraryPlace :is_identified_by_toponym ?toponym ;" +
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
    var librarySpan = document.getElementById("library");
    var placeA = document.getElementById("placeUrl");
    
    for (var i=0; i<data.results.bindings.length; i++) {
        place_name = data.results.bindings[i].placeName.value;
        libraryPlace_iri = data.results.bindings[i].libraryPlace.value;
        library_name = data.results.bindings[i].libraryName.value;

        idLemmaBread.textContent = library_name;
        placeNameSpan.textContent = place_name;
        librarySpan.textContent = library_name;
        placeA.href = "place.html?iri=" + libraryPlace_iri;

    }

    

    var search_man = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>" +
	"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
	"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +
	"PREFIX ecrm: <http://erlangen-crm.org/200717/>" +
	"PREFIX ilrm: <http://imagoarchive.it/ilrmoo/>" +
	"PREFIX : <https://imagoarchive.it/ontology/>" +
	"SELECT ?manuscript ?placeName ?libraryName ?signature ?folios ?s_coordinates ?l_manuscript_author ?l_m_title " +
	"FROM <"+named_graph+">" +
	"WHERE {" +
	"  BIND(<"+iriParam+"> AS ?library)" +
	"  ?exp_cre ilrm:R18_created ?manuscript ." +
	"  ?manuscript ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?signature ;" +
	"              ecrm:P50_has_current_keeper ?library ;" +
	"              ecrm:P46_is_composed_of/ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?folios ." +
	"  ?manifestation ilrm:R7i_is_materialized_in ?manuscript ." +
	"  ?library ecrm:P74_has_current_or_former_residence ?libraryPlace ;" +
	"  	ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?libraryName ." +
	"   ?libraryPlace :is_identified_by_toponym ?toponym ;" +
	"                  ecrm:P168_place_is_defined_by ?coordinates ." +
	"  	?coordinates ecrm:P190_has_symbolic_content ?s_coordinates ." +
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
        text = document.createTextNode("nessuna opera");
        manList.appendChild(text);
        }
    for (var i=0; i<data2.results.bindings.length; i++) {
        iri_manuscript = data2.results.bindings[i].manuscript.value;
        place = data2.results.bindings[i].placeName.value;
        library = data2.results.bindings[i].libraryName.value;
        signatureName = data2.results.bindings[i].signature.value;
        foliosName = data2.results.bindings[i].folios.value;

        li = document.createElement('li');
        li.className = "list-group-item";
        var a = document.createElement('a'); 
        a.href = "manuscript.html?iri=" + iri_manuscript;
        if(foliosName!=""){
            text = document.createTextNode(place + ", " + library + ", " + signatureName + ", " + foliosName);
        } else {
            text = document.createTextNode(place + ", " + library + ", " + signatureName);
        }
        a.appendChild(text);
        li.appendChild(a);
        
        manList.appendChild(li);
        
    }

});



  
  