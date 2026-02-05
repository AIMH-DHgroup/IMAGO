///////////////////////////////////////////////////////////////////////////
//
// Project:   IMAGO
// Package:   Web application
// File:      libraries.js
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


document.addEventListener('DOMContentLoaded', async function () {
   // var json = []
   // console.log(data);


   let headers = new Headers();
   //headers.append('X-CSRFToken', csrf);
   headers.append('X-Requested-With', 'XMLHttpRequest');
   

   var get_works = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>" +
   "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
   "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +
   "PREFIX ecrm: <http://erlangen-crm.org/200717/>" +
   "PREFIX ilrm: <http://imagoarchive.it/ilrmoo/>" +
   "PREFIX : <https://imagoarchive.it/ontology/>" +
   "SELECT ?placeName ?coord ?libraryName ?library " +
   "FROM <"+named_graph+">" +
   "WHERE {" +
   "  " +
   "  ?library ecrm:P74_has_current_or_former_residence ?libraryPlace ;" +
   "  	ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?libraryName ." +
   "   ?libraryPlace :is_identified_by_toponym ?toponym ." +
   "   ?toponym ecrm:P190_has_symbolic_content ?placeName ." +
   "  ?libraryPlace ecrm:P168_place_is_defined_by/ecrm:P190_has_symbolic_content ?coord ." +
   "  " +
   "} ORDER BY ?placeName ?libraryName";
                     
                  
   var query = url + encodeURIComponent(get_works);
   console.log(query);

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

   dataMap = data.results.bindings;
   console.log(data);
      //init leaflet  map
   var map = new L.Map('map');  
   
   map.addControl(new L.Control.Fullscreen());                     
            
   L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 18
   }).addTo(map);
   var italy = new L.LatLng(42.504154,15.646361); 
   map.setView(italy, 4);
     
     
     
     
   var mcg = L.markerClusterGroup();
   
   // Position markers
   for(let key in dataMap){
      
      if(dataMap[key].coord.value!=""){
            
         console.log(dataMap[key].coord.value);

         var greenIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
         
         });
            
         var coord = parseWKT(dataMap[key].coord.value);
         
         
         if(dataMap[key].libraryName.value!="Sconosciuta"){
            L.marker([coord[2],coord[1]], {icon: greenIcon}).bindPopup("<div style='font-size:14px;'><br />Luogo: <b>"+ dataMap[key].placeName.value +"</b><br/>Biblioteca: <b>" + dataMap[key].libraryName.value +"</b><br/><br/>"+ "<button type='button' class='btn btn-sm btn-primary show-manuscript' data-iri='"+dataMap[key].library.value+"' onclick='showManuscripts(this)'>Mostra manoscritti</button></div> ").addTo(mcg) // Add into the MCG instead of directly to the map.
         }
      }
         
     
   }
   mcg.addTo(map);
      
   // Get the array of citations accordion buttons
   var btn_show_manuscripts = document.getElementsByClassName("show-manuscript"); 
   console.log(btn_show_manuscripts);
      
   // Add the onclick event to citations accordion that show or hide the citations
   for (var i = 0; i < btn_show_manuscripts.length; i++) {
      console.log(data_iri)
      
      btn_show_manuscripts[i].addEventListener("click", showManuscripts(data_iri));
      console.log(data_iri);
      console.log(btn_show_manuscripts[i]);
   }

});

function parseWKT(string){
   let regex = /Point\((?<longitude>-?\d+\.\d+) (?<latitude>-?\d+\.\d+)\)/;
   return [longitude, latitudeunit] = regex.exec(string) || [];
}



async function showManuscripts(btn_manuscripts) {

   var data_iri=btn_manuscripts.getAttribute('data-iri');
   console.log(data_iri);
   
   // y.value = x.value.toUpperCase();
   
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
	"SELECT ?manuscript ?placeName ?libraryName ?signature ?folios " +
	"FROM <"+named_graph+">" +
	"WHERE {" +
	"  BIND(<"+ data_iri +"> AS ?library)" +
	"  ?exp_cre a ilrm:F28_Expression_Creation ;" +
	"  		 ilrm:R17_created ?work ;" +
	"  		 ecrm:P14_carried_out_by ?author .	" +
	"   ?author a :Author ;" +
	"     ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?authorName ." +
	"  ?work a ilrm:F2_Expression ;" +
	"     ecrm:P102_has_title/ecrm:P190_has_symbolic_content ?title ." +
	"  ?exp_cre ilrm:R18_created ?manuscript ." +
	"  ?manuscript ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?signature ;" +
	"              ecrm:P50_has_current_keeper ?library ;" +
	"              ecrm:P46_is_composed_of/ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?folios ." +
	"  ?manifestation ilrm:R7i_is_materialized_in ?manuscript ." +
	"  ?library ecrm:P74_has_current_or_former_residence ?libraryPlace ;" +
	"  	ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?libraryName ." +
	"   ?libraryPlace :is_identified_by_toponym ?toponym ." +
	"   ?toponym ecrm:P190_has_symbolic_content ?placeName ." +
	"  ?libraryPlace ecrm:P168_place_is_defined_by/ecrm:P190_has_symbolic_content ?coord ." +
	"  " +
	"} ORDER BY ?placeName ?libraryName ?signature";

   

   var query = url + encodeURIComponent(search_query);

   // Fetch current annotation
   let response2 = await fetch(query, {
      method: 'GET',
      headers: headers,
      mode: 'cors' 
   })
   .catch((error) => {
      console.error('Error:', error);
   });
   let data2 = await response2.json();
      

   var manList = document.getElementById("manuscript-list");
   manList.innerHTML="";
       
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
         if(library=="Sconosciuta"){
            text = document.createTextNode(place + ", " + signatureName + ", " + foliosName);
         }else{
            text = document.createTextNode(place + ", " + library + ", " + signatureName + ", " + foliosName);
         }
      } else {
         if(library=="Sconosciuta"){
            text = document.createTextNode(place + ", " + signatureName);
         }else{
            text = document.createTextNode(place + ", " + library + ", " + signatureName);
         }
      
      }
      a.appendChild(text);
      li.appendChild(a);

      manList.appendChild(li);

     
           
      }
        
      manList.scrollIntoView();
        


 }