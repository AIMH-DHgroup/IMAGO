///////////////////////////////////////////////////////////////////////////
//
// Project:   IMAGO
// Package:   Web application
// File:      genres.js
// Path:      /var/www/html/archive/js/
// Type:      javascript
// Started:   2023.11.09
// Author(s): Nicolò Pratelli
// State:     online
//
// Version history.
// - 2023.11.09  Nicolò
//   First version
//
// ////////////////////////////////////////////////////////////////////////////
//
// This file is part of software developed by the IMAGO Project
// Further information at: http://imagoarchive.it
// Copyright (C) 2020-2023 CNR-ISTI, AIMH, AI&Digital Humanities group
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
    // document.getElementById("download-toponyms-table-2").style.display =  "none";
    document.getElementById("card-table").style.display =  "none";
    document.getElementById("download-toponyms-place").style.display =  "none";
    // $("#entities").selectize({
    //     create: true,
    //     sortField: "text",
    //   });
    // var $select = $(document.getElementById('entities'));
    // var selectize = $select[0].selectize;
    $('select').selectize({
        sortField: 'text',
        onChange: function(value) {
            changeGenre(value);
        }
    });
    

var select = document.getElementById("entities");
var select1 = document.getElementById("select-state");
var $select = $(select1);
    var selectize = $select[0].selectize;
// Get Django CSRF token
//let csrf = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

// Set request headers
let headers = new Headers();
//headers.append('X-CSRFToken', csrf);
headers.append('X-Requested-With', 'XMLHttpRequest');


var get_toponyms = "PREFIX : <https://imagoarchive.it/ontology/>" +
                    "SELECT ?label ?genre " +
                    "FROM <"+named_graph+">" +
                    "WHERE {" +
                    "		?genre a :Genre;" +
                    "  			:has_genre_name ?label." +
                    "} ORDER BY ?label ";



var query = url + encodeURIComponent(get_toponyms);

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

for (var i=0; i<data.results.bindings.length; i++) {
    iri_author = data.results.bindings[i].genre.value;
    label_author = data.results.bindings[i].label.value;
    selectize.addOption({value: iri_author, text: label_author});
 
    }
         



});
async function changeGenre() {

    value = document.getElementById("select-state").value;

    let headers = new Headers();
    //headers.append('X-CSRFToken', csrf);
    headers.append('X-Requested-With', 'XMLHttpRequest');

    var get_occ_toponym = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>" +
	"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
	"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +
	"PREFIX ecrm: <http://erlangen-crm.org/200717/>" +
	"PREFIX ilrm: <http://imagoarchive.it/ilrmoo/>" +
	"PREFIX : <https://imagoarchive.it/ontology/>" +
	"SELECT ?exp_cre ?title ?authorName " +
	"FROM <"+named_graph+">" +
	"WHERE {" +
	"  BIND(<"+value+"> AS ?genre)" +
	"  " +
	"  ?exp_cre a ilrm:F28_Expression_Creation ;" +
	"  		 ilrm:R17_created ?work ;" +
	"  		 ecrm:P14_carried_out_by ?author .	" +
	"  ?author a :Author ;" +
	"     ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?authorName ." +
	"  ?work a ilrm:F2_Expression ;" +
	"  ecrm:P102_has_title/ecrm:P190_has_symbolic_content ?title ;" +
	"  :has_genre ?genre ." +
	" " +
	"  " +
	"} ORDER BY ?authorName";
      
    
    var query = url + encodeURIComponent(get_occ_toponym);

    // Fetch current annotation
    let response = await fetch(query, {
        method: 'GET',
        headers: headers,
        mode: 'cors' 
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    let data2 = await response.json();
   
    var list = document.getElementById("results-list-genres");
    console.log(list);
    list.innerHTML = "";

    for (var i=0; i<data2.results.bindings.length; i++) {
        // console.log(data2.results.bindings[i].labelWork.value);
        author = data2.results.bindings[i].authorName.value;
        title = data2.results.bindings[i].title.value;
        iri_lemma = data2.results.bindings[i].exp_cre.value;

        var li = document.createElement('li');   
        li.className = 'list-group-item d-flex justify-content-between align-items-start';
        var div1 = document.createElement('div');
        div1.className = 'listDiv ms-2 me-auto';
        var div2 = document.createElement('div');
        var a = document.createElement('a'); 
        a.href = "lemma.html?iri=" + iri_lemma;
    
        var text1 = document.createTextNode(author);
        var text2 = document.createTextNode(title);
    
        a.appendChild(text2);
        div2.appendChild(text1);
        div1.appendChild(div2);
        div1.appendChild(a);
        li.appendChild(div1);
        list.appendChild(li);
    }

    document.getElementById("download-toponyms-place").style.display =  "inline-block";
    document.getElementById("card-table").style.display =  "block";

}
