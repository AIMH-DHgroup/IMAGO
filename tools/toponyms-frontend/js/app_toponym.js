const url= "https://imagoarchive.it/fuseki/imago/query?output=json&query=";
let map = null;
// Wait for the page to load
document.addEventListener('DOMContentLoaded', function () {

    
    map = new L.Map('map'); 
     map.addControl(new L.Control.Fullscreen()); 

    document.getElementById("map-container").style.display =  "none";
    
    
    document.getElementById("download-toponyms-table-2").style.display =  "none";
    document.getElementById("download-toponyms-table").style.display =  "none";
    // $("#entities").selectize({
    //     create: true,
    //     sortField: "text",
    //   });
    // var $select = $(document.getElementById('entities'));
    // var selectize = $select[0].selectize;
    $('select').selectize({
        sortField: 'text',
        dropdownParent: 'body',
        onChange: function(value) {
            changeToponym(value);
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


var get_toponyms = "PREFIX : <https://imagoarchive.it/ontology/> " +
			"PREFIX efrbroo: <http://erlangen-crm.org/efrbroo/> " +
			"PREFIX ilrmoo: <http://imagoarchive.it/ilrmoo/> "+
			"PREFIX ecrm: <http://erlangen-crm.org/211015/> "+
			"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "+
			"SELECT DISTINCT ?toponym ?label "+
            "FROM <https://imagoarchive.it/fuseki/imago/toponyms>" +
			"WHERE { " +
  				"?toponym a :Toponym ;" +
   		            "rdfs:label ?label ." +
                "FILTER(LANG(?label) = 'la') ." + 
			"} ORDER BY ?label";



var query = url + encodeURIComponent(get_toponyms);

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
        for (var i=0; i<context.results.bindings.length; i++) {
            iri_toponym = context.results.bindings[i].toponym.value;
            label_toponym = context.results.bindings[i].label.value;
            selectize.addOption({value: iri_toponym, text: label_toponym});
            // selectize.addItem(label_toponym);
            // var option = document.createElement('option');
            // var option1 = document.createElement('option');
            // // option.classList = "Option";
            // option.value = label_toponym;
            // option1.value = iri_toponym;
            // option.setAttribute('data-value', iri_toponym);
            // var text = document.createTextNode(label_toponym);
            // option1.appendChild(text);
            // select.appendChild(option);
            // select1.appendChild(option1);
         }
         

    })
    .catch((error) => {
        console.error('Error:', error);
    });


    // var btn_cerca = document.getElementById("btn-cerca");
    // btn_cerca.addEventListener('click', event => {
    //     btn_cerca.textContent = `Click count: ${event.detail}`;
    //   });

    // btn_cerca.addEventListener("click", selectToponym); 
    // select1.addEventListener("change", changeToponym); 

   
    var btn_mostra_luoghi = document.getElementById("btn-mostra-luoghi");
    var btn_mostra_occ = document.getElementById("btn-mostra-occ");
    var btn_mostra_context = document.getElementById("btn-mostra-context");

    btn_mostra_luoghi.addEventListener("click", showPlaces); 
    btn_mostra_occ.addEventListener("click", showOcc); 
    btn_mostra_context.addEventListener("click", showContexts); 

    var btn_hide_luoghi = document.getElementById("btn-hide-luoghi");
    var btn_hide_occ = document.getElementById("btn-hide-occ");
    var btn_hide_context = document.getElementById("btn-hide-context");

    btn_hide_luoghi.addEventListener("click", hidePlaces); 
    btn_hide_occ.addEventListener("click", hideOcc); 
    btn_hide_context.addEventListener("click", hideContexts); 




});



function changeToponym() {


    document.getElementById("title-places").hidden = false;
    document.getElementById("title-occ").hidden = false;
    document.getElementById("title-context").hidden = false;
    document.getElementById("btn-mostra-luoghi").style.display = "inline-block";
    document.getElementById("btn-mostra-occ").style.display = "inline-block";
    document.getElementById("btn-mostra-context").style.display = "inline-block";
    document.getElementById("btn-hide-luoghi").style.display = "none";
    document.getElementById("btn-hide-occ").style.display = "none";
    document.getElementById("btn-hide-context").style.display = "none";

    document.getElementById("toponyms-place").hidden = true;
    document.getElementById("toponyms-table").hidden = true;
    document.getElementById("toponyms-table-2").hidden = true;

    document.getElementById("download-toponyms-table-2").style.display =  "none";
    document.getElementById("download-toponyms-table").style.display =  "none";

    document.getElementById("map-container").style.display =  "block";
    
    addMap();
}

function hidePlaces() {
    document.getElementById("btn-mostra-luoghi").style.display = "inline-block";
    document.getElementById("btn-hide-luoghi").style.display =  "none";
    document.getElementById("toponyms-place").innerHTML = "";
   document.getElementById("toponyms-place").hidden = true;
}
function hideOcc() {
    document.getElementById("btn-mostra-occ").style.display = "inline-block";
    document.getElementById("btn-hide-occ").style.display =  "none";
    document.getElementById("toponyms-table-2").innerHTML = "";
   document.getElementById("toponyms-table-2").hidden = true;
   document.getElementById("download-toponyms-table-2").style.display =  "none";
}
function hideContexts() {
    document.getElementById("btn-mostra-context").style.display = "inline-block";
    document.getElementById("btn-hide-context").style.display =  "none";
    document.getElementById("toponyms-table").innerHTML = "";
   document.getElementById("toponyms-table").hidden = true;
    document.getElementById("download-toponyms-table").style.display =  "none";
}

function addMap(){
    value = document.getElementById("select-state").value;


    // Set request headers
    let headers = new Headers();
    //headers.append('X-CSRFToken', csrf);
    headers.append('X-Requested-With', 'XMLHttpRequest');

    var get_toponyms = "PREFIX owl: <http://www.w3.org/2002/07/owl#> " +
	"PREFIX : <https://imagoarchive.it/ontology/> " +
	"PREFIX efrbroo: <http://erlangen-crm.org/efrbroo/> " +
	"PREFIX ilrmoo: <http://imagoarchive.it/ilrmoo/> " +
	"PREFIX ecrm: <http://erlangen-crm.org/211015/> " +
	"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
	"SELECT DISTINCT ?label ?labelWork ?textualPlace ?text (?place AS ?wikidata) ?pleiades ?vdl ?coord ?n_occ " +
	"FROM <https://imagoarchive.it/fuseki/imago/toponyms> " +
	"WHERE { " +
	"?toponym a :Toponym ; " +
	"   			rdfs:label ?label ; " +
    "               :has_vdl_explanation ?vdl ." +
	"    ?place a ecrm:E53_Place ; " +
	"            :is_identified_by_toponym ?toponym ; " +
	"             ecrm:P168_place_is_defined_by ?coord . " +
	"      OPTIONAL{ " +
	"             ?place owl:sameAs ?pleiades . " +
	"            } " +
	"  ?context a ecrm:E90_Symbolic_Object ; " +
	"            :has_textual_place ?textualPlace ; " +
	"               ecrm:P190_has_symbolic_content ?text ; " +
	"               ecrm:P106_is_composed_of ?toponym . " +
	"            ?work ilrmoo:R15_has_fragment ?context ; " +
	"                   rdfs:label  ?labelWork . " +
	"    FILTER(LANG(?label) = 'la') . " +
	"    { " +
	"        SELECT ?label ?labelWork (COUNT(?label) as ?n_occ) " +
	"        WHERE { " +
	"            ?context a ecrm:E90_Symbolic_Object . " +
	"            ?work ilrmoo:R15_has_fragment ?context ; " +
	"                rdfs:label  ?labelWork . " +
	"            ?context ecrm:P106_is_composed_of ?toponym . " +
	"            ?toponym rdfs:label ?label . " +
	"            FILTER(LANG(?label) = 'la') . " +
	"        } GROUP BY ?label ?labelWork " +
	"    } " +
	"} ";
                  
var query = url + encodeURIComponent(get_toponyms);

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
         if(data[key].coord.value!=""){
                 
                 if(data[key].pleiades != null ){
                     var pleiades= "<br/> <a target='a_blank' href='"+data[key].pleiades.value+"'>Pleiades</a>"
                 } else {
                     var pleiades=""
                 }

                 if(data[key].vdl.value != ""){
                    var vdl = "<br/> <a target='a_blank' href='"+data[key].vdl.value+"'>Vocabolario Dantesco Latino</a>"
                   } else {
                    var vdl = "";
                   }
  
                 
                 
                 context = data[key].text.value;
                 var tempDiv = document.createElement('div');
                 tempDiv.innerHTML = context;
                 el = tempDiv.getElementsByTagName("i");
                 var form = "";
                 if(el.length>1){

                  form = el[0].textContent + " " + el[1].textContent;
                 }else{
                 form = el[0].textContent;
                 }

                 
                 //color marker (from repository ghit. Colored if a region, else is blue
                 
                 if(data[key].label.value== "Europa" || data[key].label.value== "Ystria" || data[key].label.value== "Tuscia" || data[key].label.value== "Asya" || data[key].label.value== "Ausonia" || data[key].label.value== "Hesperia" || data[key].label.value== "Ytalia" || data[key].label.value== "Ytali" || data[key].label.value== "Latini" || data[key].label.value== "Emilis" || data[key].label.value== "Sardinia" || data[key].label.value== "Latium" || data[key].label.value== "Apulia" || data[key].label.value== "Sicilia" || data[key].label.value== "Trinacria" || data[key].label.value== "Trinacris" || data[key].label.value== "Marchia Ianuensis" || data[key].label.value== "Egiptus" || data[key].label.value== "Lybia" || data[key].label.value== "Libies" || data[key].label.value== "Affrica" || data[key].label.value== "Anglia" || data[key].label.value== "Lombardia" || data[key].label.value== "Marchia Trivisiana" || data[key].label.value== "Marchia (Trivisiana)"){
                 
                     var greenIcon = new L.Icon({
                       iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
                       shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                       iconSize: [25, 41],
                       iconAnchor: [12, 41],
                       popupAnchor: [1, -34],
                       shadowSize: [41, 41]
                     
                     });
                 } else {
                 
                       var greenIcon = new L.Icon({
                       iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                       shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                       iconSize: [25, 41],
                       iconAnchor: [12, 41],
                       popupAnchor: [1, -34],
                       shadowSize: [41, 41]
                      }); 
 
                 
                 
                 }
         
               // console.log(data[key].coord.value) 
               var coord = parseWKT(data[key].coord.value);
               
               
                var mark= L.marker([coord[2],coord[1]], {icon: greenIcon}).bindPopup("<b>Lemma: </b>" +data[key].label.value+"<br/><b>Forma: </b>" + form + "</br><b>Opera:</b> "+ data[key].labelWork.value +"<br/>"+ "<b>Occorrenze:</b> " + data[key].n_occ.value	+ "</br><b>Luogo del testo:</b> " + data[key].textualPlace.value  +"<br/> <b>Contesto:</b> "+ data[key].text.value +" <br/> <a target='a_blank' href='"+data[key].wikidata.value+"'>Wikidata</a>" + pleiades + vdl).addTo(mcg) // Add into the MCG instead of directly to the map.
                
                
                
              
 
         
         }
         
     }
     mcg.addTo(map);
     // Set request headers
    let headers = new Headers();
    //headers.append('X-CSRFToken', csrf);
    headers.append('X-Requested-With', 'XMLHttpRequest');

    var get_coord_toponym = "PREFIX : <https://imagoarchive.it/ontology/> " +
        "PREFIX efrbroo: <http://erlangen-crm.org/efrbroo/> " +
        "PREFIX ilrmoo: <http://imagoarchive.it/ilrmoo/> "+
        "PREFIX ecrm: <http://erlangen-crm.org/211015/> "+
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "+
        "PREFIX owl: <http://www.w3.org/2002/07/owl#>" +
        "SELECT ?coord "+
        "FROM <https://imagoarchive.it/fuseki/imago/toponyms>" +
        "WHERE {" +
            "<" + value + "> a :Toponym ." +
            "?place a ecrm:E53_Place ;" +
                    ":is_identified_by_toponym <" + value + "> ;" +
                    "ecrm:P168_place_is_defined_by ?coord ." +
          "} ";
        
        var query = url + encodeURIComponent(get_coord_toponym);
    
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
                //     console.log(context);
                console.log();
                let center = parseWKT(context.results.bindings[0].coord.value);
                console.log(center)
                map.flyTo([center[2], center[1]], 10, {
                    animate: true,
                    duration: 3.0
                });
    
            })
            .catch((error) => {
                console.error('Error:', error);
            });
     
        
         

      })
      .catch((error) => {
         console.error('Error:', error);
      });
}

function showPlaces() {

    document.getElementById("btn-mostra-luoghi").style.display = "none";
    document.getElementById("btn-hide-luoghi").style.display = "inline-block";
    

   value = document.getElementById("select-state").value;
   document.getElementById("toponyms-place").innerHTML = "";
   document.getElementById("toponyms-place").hidden = false;

    

    let headers = new Headers();
    //headers.append('X-CSRFToken', csrf);
    headers.append('X-Requested-With', 'XMLHttpRequest');

    var get_label_toponym = "PREFIX : <https://imagoarchive.it/ontology/> " +
    "PREFIX efrbroo: <http://erlangen-crm.org/efrbroo/> " +
    "PREFIX ilrmoo: <http://imagoarchive.it/ilrmoo/> "+
    "PREFIX ecrm: <http://erlangen-crm.org/211015/> "+
    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "+
    "SELECT ?label "+
    "FROM <https://imagoarchive.it/fuseki/imago/toponyms>" +
    "WHERE { " +
        "<" + value + "> rdfs:label  ?label ." + 
    "}";
    
    var query = url + encodeURIComponent(get_label_toponym);

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
                // console.log(context);
            var table = document.getElementById("toponyms-place");
            // var tr = document.createElement('tr');   

            //     var th1 = document.createElement('th');
            //     var th2 = document.createElement('th');
            
            //     var text1 = document.createTextNode('Lingua');
            //     var text2 = document.createTextNode('Toponimo');
            
            //     th1.appendChild(text1);
            //     th2.appendChild(text2);
            //     tr.appendChild(th1);
            //     tr.appendChild(th2);
            
            //     table.appendChild(tr);
            
            for (var i=0; i<context.results.bindings.length; i++) {
                // console.log(context.results.bindings[i].labelWork.value);
                label = context.results.bindings[i].label.value;
                lang = context.results.bindings[i].label["xml:lang"];
                console.log(lang)
                language = "";
                switch (lang) {
                    case 'en':
                      language = "Inglese"
                      break;
                    case 'la':
                        language = "Latino"
                        break;
                    case 'it':
                      language = "Italiano"
                      break;
                    default:
                      language = ""
                  }

                var tr = document.createElement('tr');   

                var td1 = document.createElement('td');
                var td2 = document.createElement('td');
            
                var text1 = document.createTextNode(language);
                var text2 = document.createTextNode(label);
            
                td1.appendChild(text1);
                td2.appendChild(text2);
                tr.appendChild(td1);
                tr.appendChild(td2);
            
                table.appendChild(tr);
            }
            //  console.log(context);
            let headers = new Headers();
            //headers.append('X-CSRFToken', csrf);
            headers.append('X-Requested-With', 'XMLHttpRequest');
            var get_place_toponym = "PREFIX : <https://imagoarchive.it/ontology/> " +
            "PREFIX efrbroo: <http://erlangen-crm.org/efrbroo/> " +
            "PREFIX ilrmoo: <http://imagoarchive.it/ilrmoo/> "+
            "PREFIX ecrm: <http://erlangen-crm.org/211015/> "+
            "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "+
            "PREFIX owl: <http://www.w3.org/2002/07/owl#>" +
            "SELECT ?place ?pleiades ?coord ?vdl "+
            "FROM <https://imagoarchive.it/fuseki/imago/toponyms>" +
            "WHERE {" +
                "<" + value + "> a :Toponym ;" +
                ":has_vdl_explanation ?vdl ." +
                "?place a ecrm:E53_Place ;" +
                        ":is_identified_by_toponym <" + value + "> ;" +
                        "ecrm:P168_place_is_defined_by ?coord ." +
                "OPTIONAL{" +
                 "?place owl:sameAs ?pleiades ." +
                "}" +
              "} ";
            
            var query = url + encodeURIComponent(get_place_toponym);
        
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
                    //     console.log(context);
                    var table = document.getElementById("toponyms-place");
                    // table.hidden = false;
                    // table.innerHTML = "";
                    // var tr = document.createElement('tr');   
        
                    //     var th1 = document.createElement('th');
                    //     var th2 = document.createElement('th');
                    
                    //     var text1 = document.createTextNode('Lingua');
                    //     var text2 = document.createTextNode('Toponimo');
                    
                    //     th1.appendChild(text1);
                    //     th2.appendChild(text2);
                    //     tr.appendChild(th1);
                    //     tr.appendChild(th2);
                    
                    //     table.appendChild(tr);
                    
                    for (var i=0; i<context.results.bindings.length; i++) {
                        // console.log(context.results.bindings[i].labelWork.value);
                        place = context.results.bindings[i].place.value;
                        coord = context.results.bindings[i].coord.value;
    
                        if(context.results.bindings[i].pleiades){
                            pleiades = context.results.bindings[i].pleiades.value;
                        }else{
                            pleiades="";
                        }

                        if(context.results.bindings[i].vdl.value!=""){
                            vdl = context.results.bindings[i].vdl.value;
                        }else{
                            vdl="";
                        }
                        
                        // console.log(lang)
        
                        var tr = document.createElement('tr');   
        
                        var td1 = document.createElement('td');
                        var td2 = document.createElement('td');
                    
                        var text1 = document.createTextNode("Coordinate");
                        var text2 = document.createTextNode(coord);
                    
                        td1.appendChild(text1);
                        td2.appendChild(text2);
                        tr.appendChild(td1);
                        tr.appendChild(td2);
                    
                        table.appendChild(tr);
    
                        var tr = document.createElement('tr');   
        
                        var td1 = document.createElement('td');
                        var td2 = document.createElement('td');
                    
                        var text1 = document.createTextNode("Luogo su Wikidata");
                        var a1 = document.createElement("a");
                        a1.href = place;
                        a1.target="_blank";
                        var text2 = document.createTextNode(place);
                        
                    
                        td1.appendChild(text1);
                        a1.appendChild(text2);
                        td2.appendChild(a1);
                        tr.appendChild(td1);
                        tr.appendChild(td2);
                    
                        table.appendChild(tr);
    
                        var tr = document.createElement('tr');   
        
                        var td1 = document.createElement('td');
                        var td2 = document.createElement('td');
    
                    if(pleiades!=""){
                        var text1 = document.createTextNode("Luogo su Pleiades");
                        var a1 = document.createElement("a");
                        a1.href = pleiades;
                        a1.target="_blank";
                        var text2 = document.createTextNode(pleiades);
                    
                        
                    
                        td1.appendChild(text1);
                        a1.appendChild(text2);
                        td2.appendChild(a1);
                        tr.appendChild(td1);
                        tr.appendChild(td2);
                    }
                    table.appendChild(tr);
    

                    var tr = document.createElement('tr');   
        
                    var td1 = document.createElement('td');
                    var td2 = document.createElement('td');
                    

                    if(vdl!=""){
                        var text1 = document.createTextNode("Voce nel Vocabolario Dantesco Latino");
                        var a1 = document.createElement("a");
                        a1.href = vdl;
                        a1.target="_blank";
                        var text2 = document.createTextNode(vdl);
                    
                        
                    
                        td1.appendChild(text1);
                        a1.appendChild(text2);
                        td2.appendChild(a1);
                        tr.appendChild(td1);
                        tr.appendChild(td2);
                    }
                    
                        table.appendChild(tr);
    
    
                        
                    }
                    //  console.log(context);
        
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

        })
        .catch((error) => {
            console.error('Error:', error);
        });

       
}

function showContexts() {

    document.getElementById("btn-mostra-context").style.display = "none";
    document.getElementById("btn-hide-context").style.display =  "inline-block";
    value = document.getElementById("select-state").value;
   document.getElementById("toponyms-table").innerHTML = "";
   document.getElementById("toponyms-table").hidden = false;
    document.getElementById("download-toponyms-table").style.display =  "block";

    let headers = new Headers();
    //headers.append('X-CSRFToken', csrf);
    headers.append('X-Requested-With', 'XMLHttpRequest');

    var get_context_place_by_toponym = "PREFIX : <https://imagoarchive.it/ontology/> " +
    "PREFIX efrbroo: <http://erlangen-crm.org/efrbroo/> " +
    "PREFIX ilrmoo: <http://imagoarchive.it/ilrmoo/> "+
    "PREFIX ecrm: <http://erlangen-crm.org/211015/> "+
    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "+
    "SELECT ?labelWork ?textualPlace ?text ?vdl "+
    "FROM <https://imagoarchive.it/fuseki/imago/toponyms>" +
    "WHERE { " +
    "BIND(<" + value + "> AS ?toponym)" +
          "?context a ecrm:E90_Symbolic_Object ;" +
               ":has_textual_place ?textualPlace ;" +
               "ecrm:P190_has_symbolic_content ?text ;" +
               "ecrm:P106_is_composed_of ?toponym." +
            "?work ilrmoo:R15_has_fragment ?context ;" +
                   "rdfs:label  ?labelWork ." + 
            "?toponym :has_vdl_explanation ?vdl ." +
    "} ORDER BY ?labelWork";
    
    var query = url + encodeURIComponent(get_context_place_by_toponym);

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

            var table = document.getElementById("toponyms-table");
            table.innerHTML = "";
            var tr = document.createElement('tr');   

                var th1 = document.createElement('th');
                var th2 = document.createElement('th');
                var th3 = document.createElement('th');
                var th4 = document.createElement('th');
            
                var text1 = document.createTextNode('Opera');
                var text2 = document.createTextNode('Luogo del testo');
                var text3 = document.createTextNode('Contesto');
                var text4 = document.createTextNode('Voce nel Vocabolario Dantesco Latino');
            
                th1.appendChild(text1);
                th2.appendChild(text2);
                th3.appendChild(text3);
                th4.appendChild(text4);
                th2.appendChild(addIconArrows());
                tr.appendChild(th1);
                tr.appendChild(th2);
                tr.appendChild(th3);
                tr.appendChild(th4);
            
                table.appendChild(tr);
            
            for (var i=0; i<context.results.bindings.length; i++) {
                // console.log(context.results.bindings[i].labelWork.value);
                work = context.results.bindings[i].labelWork.value;
                textual = context.results.bindings[i].textualPlace.value;
                textual_context = context.results.bindings[i].text.value;
                vdl = context.results.bindings[i].vdl.value;
                if(vdl==""){
                    vdl="Voce in lavorazione"
                }

                var tr = document.createElement('tr');   

                var td1 = document.createElement('td');
                var td2 = document.createElement('td');
                var td3 = document.createElement('td');
                var td4 = document.createElement('td');
            
                var text1 = document.createTextNode(work);
                var text2 = document.createTextNode(textual);
                var text3 = document.createTextNode(textual_context);
                var a_vdl = document.createElement("a");
                a_vdl.href = vdl;
                a_vdl.target="_blank";
                var text4 = document.createTextNode(vdl);
                a_vdl.appendChild(text4);
                // var text3.innerHTML = textual_context 
            
                td1.appendChild(text1);
                td2.appendChild(text2);
                td3.innerHTML=textual_context;
                if(vdl=="Voce in lavorazione"){
                    td4.appendChild(text4);
                
                }else{
                    td4.appendChild(a_vdl);
                }
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
            
                table.appendChild(tr);
            }
            //  console.log(context);
            th2.addEventListener("click", function(){ valeSort(1, "toponyms-table"); }); 

        }).then(() => {
            
            if(checkSort(1, "toponyms-table")){
                // console.log("ORDINATO")
                valeSort(1, "toponyms-table");
            }
        
        
    }).catch((error) => {
            console.error('Error:', error);
        });
}
function showOcc() {

    document.getElementById("btn-mostra-occ").style.display = "none";
    document.getElementById("btn-hide-occ").style.display =  "inline-block";

    value = document.getElementById("select-state").value;
   document.getElementById("toponyms-table-2").innerHTML = "";
   document.getElementById("toponyms-table-2").hidden = false;
   document.getElementById("download-toponyms-table-2").style.display =  "block";

    let headers = new Headers();
    //headers.append('X-CSRFToken', csrf);
    headers.append('X-Requested-With', 'XMLHttpRequest');

    var get_context_place_by_toponym = "PREFIX : <https://imagoarchive.it/ontology/> " +
    "PREFIX efrbroo: <http://erlangen-crm.org/efrbroo/> " +
    "PREFIX ilrmoo: <http://imagoarchive.it/ilrmoo/> "+
    "PREFIX ecrm: <http://erlangen-crm.org/211015/> "+
    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "+
    "SELECT ?labelAuthor ?labelWork (COUNT(?label) as ?n_occ) "+
    "FROM <https://imagoarchive.it/fuseki/imago/toponyms>" +
    "WHERE { " +
          "?context a ecrm:E90_Symbolic_Object ;" +
               ":has_textual_place ?textualPlace ;" +
               "ecrm:P190_has_symbolic_content ?text ;" +
               "ecrm:P106_is_composed_of <" + value + "> ." +
            "?work ilrmoo:R15_has_fragment ?context ;" +
                   "rdfs:label  ?labelWork ." + 
                   "<" + value + "> rdfs:label ?label ." + 
                   "?exprCreation ilrmoo:R17_created ?work ;" +
                   "ecrm:P14_carried_out_by ?author ." +
           "?author rdfs:label ?labelAuthor ." +
                   "FILTER(LANG(?label) = 'la') ." + 
    "} GROUP BY ?labelWork ?labelAuthor ORDER BY ?labelAuthor ?labelWork";
    
    var query = url + encodeURIComponent(get_context_place_by_toponym);

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

            var table = document.getElementById("toponyms-table-2");
            table.innerHTML = "";
            var tr = document.createElement('tr');   

                var th1 = document.createElement('th');
                var th2 = document.createElement('th');
                var th3 = document.createElement('th');
            
                var text1 = document.createTextNode('Autore');
                var text2 = document.createTextNode('Opera');
                var text3 = document.createTextNode('Occorrenze');
            
                th1.appendChild(text1);
                th2.appendChild(text2);
                th3.appendChild(text3);
                tr.appendChild(th1);
                tr.appendChild(th2);
                tr.appendChild(th3);
            
                table.appendChild(tr);
            
            for (var i=0; i<context.results.bindings.length; i++) {
                // console.log(context.results.bindings[i].labelWork.value);
                work = context.results.bindings[i].labelWork.value;
                occ = context.results.bindings[i].n_occ.value;
                author = context.results.bindings[i].labelAuthor.value;

                var tr = document.createElement('tr');   

                var td1 = document.createElement('td');
                var td2 = document.createElement('td');
                var td3 = document.createElement('td');
            
                var text1 = document.createTextNode(author);
                var text2 = document.createTextNode(work);
                var text3 = document.createTextNode(occ);
            
                td1.appendChild(text1);
                td2.appendChild(text2);
                td3.appendChild(text3);
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
            
                table.appendChild(tr);
            }
             console.log(context);

        })
        .catch((error) => {
            console.error('Error:', error);
        });

}
function selectToponym() {
   
   

    // console.log(xyz1)
    // var val = $('#entity').val()
    // var xyz = $('#entities option').filter(function() {
    //     return this.value == val;
    // }).data('value');
    /* if value doesn't match an option, xyz will be undefined*/
    if(xyz){

        document.getElementById("toponym-title").textContent = val;
        // Set request headers
    

   

       





    } else{ 
        alert("Non è stato selezionato nessun toponimo");
    }
    // var msg = xyz ? 'value=' + xyz : 'No Match';
    // 

    

  
    // console.log(option)
    // alert("PREV");
  }