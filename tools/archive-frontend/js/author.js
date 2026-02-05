///////////////////////////////////////////////////////////////////////////
//
// Project:   IMAGO
// Package:   Web application
// File:      author.js
// Path:      /var/www/html/archive/js/
// Type:      javascript
// Started:   2024.01.25
// Author(s): Nicolò Pratelli
// State:     online
//
// Version history.
// - 2024.01.25  Nicolò
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
    "SELECT ?authorName ?date_author (group_concat(distinct ?alias;separator=\", \") as ?aliases) " +
    "FROM <"+named_graph+">" +
    "WHERE {" +
    "  BIND(<"+iriParam+"> AS ?author)" +
    "" +
    "  ?author a :Author ;" +
    "  ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?authorName ;" +
    "  ecrm:P1_is_identified_by/:has_alias ?alias ." +
    " OPTIONAL {" +
    "  ?author ecrm:P4_has_time-span/ecrm:P170i_time_is_defined_by ?date_author ." +
    "}" +
    "} GROUP BY ?authorName ?date_author";

        

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
    var authorNameSpan = document.getElementById("author");
    var datazioneSpan = document.getElementById("datazione");
    var aliasesSpan = document.getElementById("aliases");

    for (var i=0; i<data.results.bindings.length; i++) {
        author = data.results.bindings[i].authorName.value;
        try{
        datazione = data.results.bindings[i].date_author.value;} catch { datazione = "-" }
        try{name_aliases = data.results.bindings[i].aliases.value;} catch{ name_aliases = "-"}

        idLemmaBread.textContent = author;
        authorNameSpan.textContent = author;
        datazioneSpan.textContent = (datazione == "" || datazione == " ") ? "-" : datazione ;
        aliasesSpan.textContent = (name_aliases == "" || name_aliases == " ") ? "-" : name_aliases ;
        }
            
    


        

    var search_man = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>" +
    "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +
    "PREFIX ecrm: <http://erlangen-crm.org/200717/>" +
    "PREFIX ilrm: <http://imagoarchive.it/ilrmoo/>" +
    "PREFIX : <https://imagoarchive.it/ontology/>" +
    "SELECT ?exp_cre ?title " +
    "FROM <"+named_graph+">" +
    "WHERE {" +
    "  BIND(<"+iriParam+"> AS ?author)" +
    "  ?exp_cre a ilrm:F28_Expression_Creation ;" +
    "  :has_abstract ?abstract ;" +
    "  ilrm:R17_created ?work ;" +
    "  ecrm:P14_carried_out_by ?author .	" +
    "  ?author a :Author ;" +
    "  ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?authorName ." +
    "  ?work a ilrm:F2_Expression ;" +
    "  ecrm:P102_has_title/ecrm:P190_has_symbolic_content ?title ." +
    "" +
    "} ";

        

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
        iri_work = data2.results.bindings[i].exp_cre.value;
        title = data2.results.bindings[i].title.value;
        // places = context.results.bindings[i].places.value;


        li = document.createElement('li');
        li.className = "list-group-item";
        var a = document.createElement('a'); 
        a.href = "lemma.html?iri=" + iri_work;
        text = document.createTextNode(title);
        a.appendChild(text);
        li.appendChild(a);

        manList.appendChild(li);
        
        
        }

});


  
  