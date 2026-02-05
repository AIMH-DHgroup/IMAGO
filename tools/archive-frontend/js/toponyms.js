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
 
//(group_concat(?ex; separator = \" ; \") as ?works)
// "       BIND (CONCAT(?authorName, \" - \",?title) AS ?ex)" +
var get_works ="PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>" +
"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +
"PREFIX ecrm: <http://erlangen-crm.org/200717/>" +
"PREFIX ilrm: <http://imagoarchive.it/ilrmoo/>" +
"PREFIX : <https://imagoarchive.it/ontology/>" +
"SELECT DISTINCT ?coord ?toponym (group_concat(distinct ?toponymName;separator=\", \") as ?placeName) " +
"FROM <"+named_graph+">" +
"WHERE {" +
"    " +
"  ?exp_cre a ilrm:F28_Expression_Creation ;" +
"  		 ilrm:R17_created ?work ;" +
"  		 ecrm:P14_carried_out_by ?author .	" +
"  ?author a :Author ;" +
"     ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?authorName ." +
"  ?work a ilrm:F2_Expression ;" +
"     ecrm:P102_has_title/ecrm:P190_has_symbolic_content ?title ;" +
"  		ecrm:P106_is_composed_of ?toponym ." +
"  ?place :is_identified_by_toponym ?toponym ;" +
" 		 ecrm:P168_place_is_defined_by/ecrm:P190_has_symbolic_content ?coord ." +
"    ?toponym ecrm:P190_has_symbolic_content ?toponymName ." +
"}  GROUP BY ?toponym ?coord ";
                  
                 
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
   console.log(dataMap);
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
            // if(dataMap[key].coord.value!="POINT(null null)"){
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
      
         L.marker([coord[2],coord[1]], {icon: greenIcon}).bindPopup("<div style='font-size:14px;'><br />Luogo: <b>"+ dataMap[key].placeName.value +"</b><br/><br/>"+ "<button type='button' class='btn btn-sm btn-primary show-manuscript' data-iri='"+dataMap[key].toponym.value+"' onclick='showManuscripts(this)'>Mostra opere</button> </div>").addTo(mcg) // Add into the MCG instead of directly to the map.
  
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
   // let text = '27 months';
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
   "SELECT DISTINCT ?exp_cre ?authorName ?title " +
   "FROM <"+named_graph+">" +
   "WHERE {" +
   "  BIND(<"+ data_iri +"> AS ?toponym)" +
   "  ?exp_cre a ilrm:F28_Expression_Creation ;" +
   "  		 ilrm:R17_created ?work ;" +
   "  		 ecrm:P14_carried_out_by ?author .	" +
   "  ?author a :Author ;" +
   "     ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?authorName ." +
   "  ?work a ilrm:F2_Expression ;" +
   "     ecrm:P102_has_title/ecrm:P190_has_symbolic_content ?title ;" +
   "  		ecrm:P106_is_composed_of ?toponym ." +
   "  ?place :is_identified_by_toponym ?toponym ;" +
   " 		 ecrm:P168_place_is_defined_by/ecrm:P190_has_symbolic_content ?coord ." +
   "    ?toponym ecrm:P190_has_symbolic_content ?placeName ." +
   "} ";

   

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

   var lemmaList = document.getElementById("lemma-list");
   lemmaList.innerHTML="";

   for (var i=0; i<data.results.bindings.length; i++) {
      iri_lemma = data.results.bindings[i].exp_cre.value;
      title = data.results.bindings[i].title.value;
      author = data.results.bindings[i].authorName.value;
      // places = data.results.bindings[i].places.value;


      li = document.createElement('li');
      li.className = "list-group-item";
      var a = document.createElement('a'); 
      a.href = "lemma.html?iri=" + iri_lemma;
      text = document.createTextNode(author + ", " + title);
      a.appendChild(text);
      li.appendChild(a);

      lemmaList.appendChild(li);

      
   }
   lemmaList.scrollIntoView();
   
   //  document.getElementById("result").innerHTML=r ;
 


 }