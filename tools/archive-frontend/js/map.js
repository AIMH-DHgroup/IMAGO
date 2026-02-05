const url= "https://imagoarchive.it/fuseki/imago/query?output=json&query=";
// import data from './../geojson/provinces.geojson' assert { type: 'json' };


document.addEventListener('DOMContentLoaded', function () {
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
"SELECT ?title ?authorName ?placeName ?coord ?libraryName ?signature " +
"FROM <https://imagoarchive.it/fuseki/imago/archive>" +
"WHERE {" +
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
                  
                 
var query = url + encodeURIComponent(get_works);
console.log(query);

// Fetch current annotation
fetch(query,
      {
         method: 'GET',
         headers: headers,
         mode: 'cors' // questo forse va tolto se non si usa HTTPS?
      })
      .then((response) => {
         return response.json();
      })
      .then((context) => {
         /*
            Qui riceviamo il context in JSON, quindi possiamo
            prendere la variabile "data" e aggiornarla. Volendo si
            può fare la stessa cosa anche per la variabile "json"
            che contiene il JSON formattato
         */
         data = context.results.bindings;
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
     for(let key in data){
         
         // var occurrences = data[key].n_occ.value;
         // if(data[key].occDeVulgari != 0 && data[key].work.name == "De Vulgari Eloquentia") {
         //     occurrences += "<b>Occorrenze:</b> " + data[key].occDeVulgari	+ "</br>"
         // }
         // if(data[key].occEgloge != 0 && data[key].work.name == "Egloge") {
         //     occurrences += "<b>Occorrenze:</b> " + data[key].occEgloge + "</br>"	
         // }
         // if(data[key].occEpistole != 0 && data[key].work.name == "Epistole") {
         //     occurrences += "<b>Occorrenze:</b> " + data[key].occEpistole + "</br>"	
         // }
         // if(data[key].occMonarchia != 0 && data[key].work.name == "Monarchia") {
         //     occurrences += "<b>Occorrenze:</b> " + data[key].occMonarchia + "</br>"	
         // }
         // if(data[key].occQuestio != 0 && data[key].work.name == "Questio de Aqua et Terra") {
         //     occurrences += "<b>Occorrenze:</b> " + data[key].occQuestio + "</br>"	
         // }

         // console.log(data[key])
         if(data[key].coord.value!="POINT( )"){
            if(data[key].coord.value!="POINT(null null)"){
              console.log(data[key].coord.value);
                 
               //   if(data[key].pleiades != null ){
               //       var pleiades= "<br/> <a target='a_blank' href='"+data[key].pleiades.value+"'>Pleiades</a>"
               //   } else {
               //       var pleiades=""
               //   }
                 
                 
               //   context = data[key].text.value;
               //   var tempDiv = document.createElement('div');
               //   tempDiv.innerHTML = context;
               //   el = tempDiv.getElementsByTagName("i");
               //   var form = "";
               //   if(el.length>1){

               //    form = el[0].textContent + " " + el[1].textContent;
               //   }else{
               //   form = el[0].textContent;
               //   }

                 
                 //color marker (from repository ghit. Colored if a region, else is blue
                 
               //   if(data[key].label.value== "Europa" || data[key].label.value== "Ystria" || data[key].label.value== "Tuscia" || data[key].label.value== "Asya" || data[key].label.value== "Ausonia" || data[key].label.value== "Hesperia" || data[key].label.value== "Ytalia" || data[key].label.value== "Ytali" || data[key].label.value== "Latini" || data[key].label.value== "Emilis" || data[key].label.value== "Sardinia" || data[key].label.value== "Latium" || data[key].label.value== "Apulia" || data[key].label.value== "Sicilia" || data[key].label.value== "Trinacria" || data[key].label.value== "Trinacris" || data[key].label.value== "Marchia Ianuensis" || data[key].label.value== "Egiptus" || data[key].label.value== "Lybia" || data[key].label.value== "Libies" || data[key].label.value== "Affrica" || data[key].label.value== "Anglia" || data[key].label.value== "Lombardia" || data[key].label.value== "Marchia Trivisiana" || data[key].label.value== "Marchia (Trivisiana)"){
                 
                     var greenIcon = new L.Icon({
                       iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
                       shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                       iconSize: [25, 41],
                       iconAnchor: [12, 41],
                       popupAnchor: [1, -34],
                       shadowSize: [41, 41]
                     
                     });
               //   } else {
                 
               //         var greenIcon = new L.Icon({
               //         iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
               //         shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
               //         iconSize: [25, 41],
               //         iconAnchor: [12, 41],
               //         popupAnchor: [1, -34],
               //         shadowSize: [41, 41]
               //        }); 
 
                 
                 
               //   }
         
               // console.log(data[key].coord.value) 
               var coord = parseWKT(data[key].coord.value);
               
               
                var mark= L.marker([coord[2],coord[1]], {icon: greenIcon}).bindPopup("<b>Autore: </b>" +data[key].authorName.value+"<br/><b>Titolo: </b>" + data[key].title.value + "</br><b>Luogo:</b> "+ data[key].placeName.value +"<br/>"+ "<b>Biblioteca:</b> " + data[key].libraryName.value	+ "</br><b>Segnatura:</b> " + data[key].signature.value).addTo(mcg) // Add into the MCG instead of directly to the map.
                
                
                
              
 
         
         }
         
     }
   }
     mcg.addTo(map);
        
         

      })
      .catch((error) => {
         console.error('Error:', error);
      });
    });

    function parseWKT(string){
      // let text = '27 months';
      let regex = /POINT\((?<longitude>-?\d+\.\d+) (?<latitude>-?\d+\.\d+)\)/;
      return [longitude, latitudeunit] = regex.exec(string) || [];
    
  }

  function onEachFeature(feature, layer) {
   // does this feature have a property named popupContent?
   // console.log(feature.properties)
   if (feature.properties) {
       layer.bindPopup(feature.properties.LAU_NAME);
   }
}
  