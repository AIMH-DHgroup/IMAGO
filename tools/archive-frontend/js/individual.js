///////////////////////////////////////////////////////////////////////////
//
// Project:   IMAGO
// Package:   Web application
// File:      individual.js
// Path:      /var/www/html/archive/js/
// Type:      javascript
// Started:   2026.02.13
// Author(s): Nicolò Pratelli
// State:     online
//
// Version history.
// - 2026.02.13 Nicolò
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



function iriToLinkCell(iri) {
  const a = document.createElement("a");
  a.href = iri;
  a.textContent = iri;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  return a;
}

function shortenIri(iri) {
  // Nice label in table (still keep full IRI in title attribute)
  // e.g. .../something#X or .../something/X
  const hash = iri.lastIndexOf("#");
  const slash = iri.lastIndexOf("/");
  const idx = Math.max(hash, slash);
  return idx >= 0 && idx < iri.length - 1 ? iri.substring(idx + 1) : iri;
}

function iriToShortLinkCell(iri) {
  const a = document.createElement("a");
  a.href = iri;
  a.textContent = shortenIri(iri);
  a.title = iri;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  return a;
}

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


    var search_query =
  " SELECT ?direction ?p ?other " +
  " FROM <" + named_graph + "> " +
  " WHERE { " +
  "  BIND(<" + iriParam + "> AS ?iri) " +   
  "  { " +                                   
  "    BIND(\"outgoing\" AS ?direction) " +
  "    ?iri ?p ?other . " +
  "  } " +                                  
  "  UNION " +
  "  { " +                                  
  "    BIND(\"incoming\" AS ?direction) " +
  "    ?other ?p ?iri . " +
  "  } " +
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

    // ---- Render incoming/outgoing relations into a table ----
    const relationsTbody = document.getElementById("relations-tbody");
    const relationsEmpty = document.getElementById("relations-empty");
    relationsTbody.innerHTML = "";

    if (!data || !data.results || !data.results.bindings || data.results.bindings.length === 0) {
    relationsEmpty.style.display = "block";
    } else {
    relationsEmpty.style.display = "none";

    for (let i = 0; i < data.results.bindings.length; i++) {
        const b = data.results.bindings[i];

        const direction = b.direction?.value || "";
        const p = b.p?.value || "";
        const other = b.other?.value || "";

        const tr = document.createElement("tr");

        // Direzione (badge)
        const tdDir = document.createElement("td");
        const badge = document.createElement("span");
        badge.className = "badge " + (direction === "incoming" ? "bg-secondary" : "bg-primary");
        badge.textContent = direction;
        tdDir.appendChild(badge);

        // Predicato
        const tdP = document.createElement("td");
        if (p) tdP.appendChild(iriToShortLinkCell(p));

        // Other (IRI or literal)
        const tdOther = document.createElement("td");
        if (other.startsWith("http://") || other.startsWith("https://")) {
        tdOther.appendChild(iriToShortLinkCell(other));
        } else {
        tdOther.textContent = other; // literal
        }

        tr.appendChild(tdDir);
        tr.appendChild(tdP);
        tr.appendChild(tdOther);

        relationsTbody.appendChild(tr);
    }
    }


});
