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
    

    // document.getElementById("A").addEventListener("click", myFunction);
    let paginator = document.getElementsByClassName("page-link");
    for (var i = 0; i < paginator.length; i++) {
        let letter = paginator[i].textContent;
        // console.log(paginator[i])
		paginator[i].addEventListener("click", function () {
            // Declare variables
                var filter, table, tr, td, i, txtValue;
                filter = letter.toUpperCase();
                table = document.getElementById("myTable");
                tr = table.getElementsByTagName("tr");
            
                // Loop through all table rows, and hide those who don't match the search query
                for (i = 0; i < tr.length; i++) {
                td = tr[i].getElementsByTagName("td")[1];
                if (td) {
                    // txtValue = td.textContent || td.innerText;
                    txtValue = td.textContent.trim().charAt(0).toUpperCase();
                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    } else {
                    tr[i].style.display = "none";
                    }
                }
                }

        });
    }
    
    let headers = new Headers();
    //headers.append('X-CSRFToken', csrf);
    headers.append('X-Requested-With', 'XMLHttpRequest');

    var search_query =  "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>" +
	"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
	"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +
	"PREFIX ecrm: <http://erlangen-crm.org/200717/>" +
	"PREFIX ilrm: <http://imagoarchive.it/ilrmoo/>" +
	"PREFIX : <https://imagoarchive.it/ontology/>" +
	"SELECT ?libraryName ?library ?placeName " +
	"FROM <"+named_graph+">" +
	"WHERE {" +
	"" +
	"   ?library a :Library ;" +
	"            ecrm:P74_has_current_or_former_residence ?libraryPlace ;" +
	"  	ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?libraryName ." +
	"   ?libraryPlace :is_identified_by_toponym ?toponym ;" +
	"                  ecrm:P168_place_is_defined_by ?coordinates ." +
	"  	?coordinates ecrm:P190_has_symbolic_content ?s_coordinates ." +
	"   ?toponym ecrm:P190_has_symbolic_content ?placeName ." +
	"} ORDER BY ?libraryName ?placeName ";
   
      
    
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

    var table = document.getElementById("myTableBody");

    table.innerHTML = "";
    
    console.log(table);
           
            
    for (var i=0; i<data.results.bindings.length; i++) {
        

        place_name = data.results.bindings[i].placeName.value;
        library_iri = data.results.bindings[i].library.value;
        library_name = data.results.bindings[i].libraryName.value;

        if(library_name!="Sconosciuta"){
        li = document.createElement('li');
        li.className = "list-group-item";
        var a = document.createElement('a'); 
        a.href = "library.html?iri=" + library_iri;
        text = document.createTextNode(library_name);
        d = document.createTextNode(place_name);
        c = document.createTextNode(String(i+1));
        a.appendChild(text);
        

        
        tr = document.createElement('tr');
        td_count = document.createElement('td');
        td_name = document.createElement('td');
        td_date = document.createElement('td');
        td_count.appendChild(c);
        td_name.appendChild(a);
        td_date.appendChild(d);
        tr.appendChild(td_count);
        tr.appendChild(td_name);
        tr.appendChild(td_date);
        table.appendChild(tr);

        }

    }
        
        
       

});
