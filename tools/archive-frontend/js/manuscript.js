///////////////////////////////////////////////////////////////////////////
//
// Project:   IMAGO
// Package:   Web application
// File:      manuscript.js
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


    // Text of the query SPARQL
    var search_man =  "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>" +
	"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
	"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +
	"PREFIX ecrm: <http://erlangen-crm.org/200717/>" +
	"PREFIX ilrm: <http://imagoarchive.it/ilrmoo/>" +
	"PREFIX : <https://imagoarchive.it/ontology/>" +
	"SELECT ?manuscript ?exp_cre ?author ?authorName ?titleWork ?libraryPlace ?placeName ?library ?libraryName ?signature ?folios ?s_coordinates ?l_manuscript_author ?l_title ?l_incipit_dedication ?l_explicit_dedication ?l_incipit_text ?l_explicit_text ?l_date_manuscript ?l_sources ?l_url_manuscript ?l_url_manuscript_description ?l_notes ?l_decoration ?annotator ?timestamp " +
	"FROM <"+named_graph+">" +
	"WHERE {" +
	"    BIND(<"+iriParam+"> AS ?manuscript)" +
	"    ?exp_cre ilrm:R18_created ?manuscript ." +
    "    ?exp_cre ilrm:R17_created ?work ;" +
	"  		 ecrm:P14_carried_out_by ?author ." +
	"  ?author a :Author ;" +
	"     ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?authorName ." +
	"  ?work a ilrm:F2_Expression ;" +
	"  ecrm:P102_has_title/ecrm:P190_has_symbolic_content ?titleWork ." +
	"    ?manuscript ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?signature ;" +
	"                ecrm:P50_has_current_keeper ?library ;" +
	"                ecrm:P46_is_composed_of/ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?folios ;" +
	"                :compiled_form ?annotator ;" +
	"                :last_mod_form ?timestamp ." +
	"    ?manifestation ilrm:R7i_is_materialized_in ?manuscript ." +
	"  	?manifestation_creation ilrm:R24_created ?manifestation ." +
	"    ?library ecrm:P74_has_current_or_former_residence ?libraryPlace ;" +
	"             ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?libraryName ." +
	"    ?libraryPlace :is_identified_by_toponym ?toponym ." +
	"    ?toponym ecrm:P190_has_symbolic_content ?placeName ." +
	"    OPTIONAL{" +
	"      ?m_author ecrm:P106i_forms_part_of ?manifestation ;" +
	"                ecrm:P190_has_symbolic_content ?l_manuscript_author ." +
	"    }" +
	"    OPTIONAL{" +
	"      ?manuscript ecrm:P102_has_title ?m_title ." +
	"      ?m_title ecrm:P190_has_symbolic_content ?l_title ." +
	"    }" +
"" +
"    OPTIONAL{" +
"		?incipitDedication :is_incipit_dedication_of ?manifestation ;" +
"    			ecrm:P190_has_symbolic_content ?l_incipit_dedication ." +
"    }" +
"  	OPTIONAL{" +
"		?explicitDedication :is_explicit_dedication_of ?manifestation ;" +
"    			ecrm:P190_has_symbolic_content ?l_explicit_dedication ." +
"    }" +
" 	OPTIONAL{" +
"		?incipitText :is_text_incipit_of ?manifestation ;" +
"    			ecrm:P190_has_symbolic_content ?l_incipit_text ." +
"    }" +
"    OPTIONAL{" +
"          ?explicitText :is_text_explicit_of ?manifestation ;" +
"                  ecrm:P190_has_symbolic_content ?l_explicit_text ." +
"      }" +
"  	OPTIONAL{" +
"      ?manifestation_creation ecrm:P4_has_time-span ?date_manuscript .					" +
"      ?date_manuscript ecrm:P170i_time_is_defined_by ?l_date_manuscript ." +
"  	}" +
"  	OPTIONAL {" +
"	?manuscript :has_secondary_source  ?l_sources ." +
"    }" +
"" +
"    OPTIONAL {" +
"      ?manuscript  :has_url_manuscript ?l_url_manuscript ." +
"    }" +
"   OPTIONAL {" +
"      ?manuscript  :has_decoration ?l_decoration ." +
"    }" +
"" +
"    OPTIONAL {" +
"      ?manuscript :has_url_manuscript_description ?l_url_manuscript_description ." +
"    }" +
"" +
"    OPTIONAL {" +
"      ?manuscript ecrm:P3_has_note ?l_notes ." +
"  }" +
"}"; 

// Encode the text of the query
var query = url + encodeURIComponent(search_man);

// Fetch current annotation
let response = await fetch(query, {
    method: 'GET',
    headers: headers,
    mode: 'cors' 
})
.catch((error) => {
    console.error('Error:', error);
});

// Get the response in JSON
let data = await response.json();

// Print the results in the console
console.log(data.results);

// Get all HTML elements
var idManuscript = document.getElementById("id-man");
var idManuscriptBread = document.getElementById("id-man-bread");
var idLemmaBread = document.getElementById("id-lemma-bread");
var idLemmaAuthorBread = document.getElementById("id-lemma-author-bread");
var authorSpan = document.getElementById("author");
var workSpan = document.getElementById("work");
var placeLibrarySpan = document.getElementById("place-libriary");
var placeLibraryA = document.getElementById("place-library-url");
var librarySpan = document.getElementById("library");
var libraryA = document.getElementById("libraryUrl");
var signatureSpan = document.getElementById("signature");
var foliosSpan = document.getElementById("folios");
var datazioneSpan = document.getElementById("datazione");
var incipitDedSpan = document.getElementById("incipit-ded");
var explicitDedSpan = document.getElementById("explicit-ded");
var incipitTextSpan = document.getElementById("incipit-text");
var explicitTextSpan = document.getElementById("explicit-text");
var decorationSpan = document.getElementById("decoration");
var linkManSpan = document.getElementById("link-man");
var linkDescSpan = document.getElementById("link-desc");
var sourcesSpan = document.getElementById("sources");
var notesSpan = document.getElementById("notes");
var userSpan = document.getElementById("user");
var lastModSpan = document.getElementById("last-mod");
       

for (var i=0; i<data.results.bindings   .length; i++) {
    try{titleOfWork = data.results.bindings[i].titleWork.value;} catch{ titleOfWork = "-"};
    try{authorOfWork = data.results.bindings[i].authorName.value;} catch{authorOfWork = "-"};
    try{iri_author = data.results.bindings[i].author.value;} catch{iri_author = "-"};
    try{expressionCreation = data.results.bindings[i].exp_cre.value;} catch{expressionCreation = "-"};
    try{title = data.results.bindings[i].l_title.value;} catch{ title = "-"};
    try{author = data.results.bindings[i].l_manuscript_author.value;} catch{author = "-"};
    try{placeLibriary = data.results.bindings[i].placeName.value;} catch{placeLibriary = "-"};
    try{placeLibrary_iri = data.results.bindings[i].libraryPlace.value;} catch{placeLibrary_iri = "-"};
    try{library_iri = data.results.bindings[i].library.value;} catch{library_iri = "-"};
    try{library_name = data.results.bindings[i].libraryName.value;} catch{library = "-"};
    try{signature = data.results.bindings[i].signature.value;} catch{signature = "-"};
    try{folios = data.results.bindings[i].folios.value;} catch{folios = "-"};
    try{date_manuscript = data.results.bindings[i].l_date_manuscript.value;} catch{date_manuscript = "-"};
    try{incipit_dedication = data.results.bindings[i].l_incipit_dedication.value;} catch{incipit_dedication = "-"};
    try{explicit_dedication = data.results.bindings[i].l_explicit_dedication.value;} catch{explicit_dedication = "-"};
    try{incipit_text = data.results.bindings[i].l_incipit_text.value;} catch{incipit_text = "-"};
    try{explicit_text = data.results.bindings[i].l_explicit_text.value;} catch{explicit_text = "-"};
    try{decoration = data.results.bindings[i].l_decoration.value;} catch{decoration = "-"};
    try{
        sources = data.results.bindings[i].l_sources.value;
        var ulSources = document.createElement('ul');
        ulSources = linkifySources(sources);
        sources = ulSources;
        
    } catch{sources = "-"};
    try{
        
        url_manuscript = data.results.bindings[i].l_url_manuscript.value;
        if(url_manuscript!=""){
            var a = document.createElement('a'); 
            a.href = url_manuscript;
            text = document.createTextNode(url_manuscript);
            a.appendChild(text);
            url_manuscript = a;
        }else{
            url_manuscript="-";
        }
    } catch{url_manuscript = "-"};
    try{
        url_manuscript_description = data.results.bindings[i].l_url_manuscript_description.value;
        var a_description = document.createElement('a'); 
        a_description.href = url_manuscript_description;
        text_description = document.createTextNode(url_manuscript_description);
        a_description.appendChild(text_description);
        url_manuscript_description = a_description;
    } catch{url_manuscript_description = "-"};
    try{notes = data.results.bindings[i].l_notes.value;} catch{notes = "-"};
    try{user = data.results.bindings[i].annotator.value;} catch{notes = "-"};
    try{lastMod = data.results.bindings[i].timestamp.value;} catch{notes = "-"};
    if(library_name == "Sconosciuta"){
        library_name = "-";
        idManuscript.textContent = placeLibriary + ", " + signature;
        idManuscriptBread.textContent = placeLibriary + ", " + signature;
    }else{
        idManuscript.textContent = placeLibriary + ", " + library_name + ", " + signature;
        idManuscriptBread.textContent = placeLibriary + ", " + library_name + ", " + signature;
    }
    idLemmaBread.textContent = titleOfWork;
    idLemmaBread.href = "lemma.html?iri="+expressionCreation;
    idLemmaAuthorBread.textContent = authorOfWork;
    idLemmaAuthorBread.href = "author.html?iri=" + iri_author;
    authorSpan.textContent = author;
    if(author == ""){
        authorSpan.textContent = "-";
    } else{
        authorSpan.textContent = author;
    }
    if(title == ""){
        workSpan.textContent = "-";
    } else{
        workSpan.textContent = title;
    }
    if(placeLibriary == ""){
        placeLibrarySpan.textContent = "-";
    }else{
        placeLibrarySpan.textContent = placeLibriary;
    }
    if(library_name == "" || library_name == "Sconosciuta"){
        librarySpan.textContent = "-";
    }else{
        librarySpan.textContent = library_name;
    }
    if(signature == ""){
        signatureSpan.textContent = "-";
    }else{
        signatureSpan.textContent = signature;
    }
    if(folios == ""){
        foliosSpan.textContent = "-";
    }else{
        foliosSpan.textContent = folios;
    }
    if(date_manuscript == ""){
        datazioneSpan.textContent = "-";
    }else{
        datazioneSpan.textContent = date_manuscript;
    }
    if(incipit_dedication == ""){
        incipitDedSpan.textContent = "-";
    }else{
        incipitDedSpan.textContent = incipit_dedication;
    }
    if(explicit_dedication == ""){
        explicitDedSpan.textContent = "-";
    }else{
        explicitDedSpan.textContent = explicit_dedication;
    }
    if(incipit_text == ""){
        incipitTextSpan.textContent = "-";
    }else{
        incipitTextSpan.textContent = incipit_text;
    }
    if(explicit_text == ""){
        explicitTextSpan.textContent = "-";
    }else{
        explicitTextSpan.textContent = explicit_text;
    }
    if(decoration == ""){
        decorationSpan.textContent = "-";
    }else{
        decorationSpan.textContent = decoration;
    }
    if(url_manuscript == "-"){
        linkManSpan.textContent = url_manuscript;
    }else{
        linkManSpan.appendChild(url_manuscript);
    }
    if(url_manuscript_description == "-"){
        linkDescSpan.textContent = url_manuscript_description;
    }else{
        linkDescSpan.appendChild(url_manuscript_description);
    }
    if(sources == "-"){
        sourcesSpan.textContent = sources;
    }else{
        sourcesSpan.append(sources);
    }
    if(notes == ""){
        notesSpan.textContent = "-";
    }else{
        notesSpan.textContent = notes;
    }
    console.log(library_name);
    if(library_name != "-"){
        libraryA.href="library.html?iri="+library_iri;
    }
    placeLibraryA.href="place.html?iri="+placeLibrary_iri;
    userSpan.textContent = user;
    const date = new Date(lastMod).toLocaleDateString('en-GB');
    lastModSpan.textContent = date;
    
    
    }
        

});


    

 



  
  