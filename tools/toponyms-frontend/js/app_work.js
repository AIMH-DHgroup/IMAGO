const url= "https://imagoarchive.it/fuseki/imago/query?output=json&query=";

// Wait for the page to load
document.addEventListener('DOMContentLoaded', function () {
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
			"SELECT DISTINCT ?work ?label "+
            "FROM <https://imagoarchive.it/fuseki/imago/toponyms>" +
			"WHERE { " +
  				"?work a ilrmoo:F2_Expression ;" +
   		            "rdfs:label ?label ." +
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
            iri_work = context.results.bindings[i].work.value;
            label_work = context.results.bindings[i].label.value;
            selectize.addOption({value: iri_work, text: label_work});
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

   
    // var btn_mostra_luoghi = document.getElementById("btn-mostra-luoghi");
    var btn_mostra_occ = document.getElementById("btn-mostra-occ");
    var btn_mostra_context = document.getElementById("btn-mostra-context");

    // btn_mostra_luoghi.addEventListener("click", showPlaces); 
    btn_mostra_occ.addEventListener("click", showOcc); 
    btn_mostra_context.addEventListener("click", showContexts); 

    var btn_hide_occ = document.getElementById("btn-hide-occ");
    var btn_hide_context = document.getElementById("btn-hide-context");

    btn_hide_occ.addEventListener("click", hideOcc); 
    btn_hide_context.addEventListener("click", hideContexts); 




});
function changeToponym() {


    // document.getElementById("title-places").hidden = false;
    document.getElementById("title-occ").hidden = false;
    document.getElementById("title-context").hidden = false;

    document.getElementById("btn-hide-occ").style.display = "none";
    document.getElementById("btn-hide-context").style.display = "none";

    document.getElementById("btn-mostra-occ").style.display = "inline-block";
    document.getElementById("btn-mostra-context").style.display = "inline-block";

    document.getElementById("download-toponyms-table-2").style.display =  "none";
    document.getElementById("download-toponyms-table").style.display =  "none";

    // document.getElementById("toponyms-place").hidden = true;
    document.getElementById("toponyms-table").hidden = true;
    document.getElementById("toponyms-table-2").hidden = true;
    
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


function showPlaces() {

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

        })
        .catch((error) => {
            console.error('Error:', error);
        });

        var get_place_toponym = "PREFIX : <https://imagoarchive.it/ontology/> " +
        "PREFIX efrbroo: <http://erlangen-crm.org/efrbroo/> " +
        "PREFIX ilrmoo: <http://imagoarchive.it/ilrmoo/> "+
        "PREFIX ecrm: <http://erlangen-crm.org/211015/> "+
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "+
        "PREFIX owl: <http://www.w3.org/2002/07/owl#>" +
        "SELECT DISTINCT ?place ?pleiades ?coord "+
        "FROM <https://imagoarchive.it/fuseki/imago/toponyms>" +
        "WHERE {" +
            "<" + value + "> a :Toponym ." +
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

                    if(context.results.bindings[i].pleiades.value){
                        pleiades = context.results.bindings[i].pleiades.value;
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
                
                    table.appendChild(tr);


                    
                }
                //  console.log(context);
    
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
    "SELECT ?label ?place ?vdl ?textualPlace ?text "+
    "FROM <https://imagoarchive.it/fuseki/imago/toponyms>" +
    "WHERE { " +
    "BIND(<" + value + "> AS ?work)" +
    "?context a ecrm:E90_Symbolic_Object ." +
    "?context :has_textual_place ?textualPlace ." +
    "?context ecrm:P190_has_symbolic_content ?text ." +
    "?work ilrmoo:R15_has_fragment ?context ." +
    "?context ecrm:P106_is_composed_of ?toponym ." +
    "?toponym rdfs:label ?label ;" +
    ":has_vdl_explanation ?vdl ." +
    "?place a ecrm:E53_Place ;" +
    ":is_identified_by_toponym ?toponym ." +
                   "FILTER(LANG(?label) = 'la') ." + 
    "} ORDER BY ?textualPlace";
    
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
                var th5 = document.createElement('th');
            
                var text1 = document.createTextNode('Toponimo');
                var text2 = document.createTextNode('Luogo Wikidata');
                var text3 = document.createTextNode('Voce nel Vocabolario Dantesco Latino');
                var text4 = document.createTextNode('Luogo del testo');
                var text5 = document.createTextNode('Contesto');

                
            
                th1.appendChild(text1);
                th1.appendChild(addIconArrows());
                th2.appendChild(text2);
                th3.appendChild(text3);
                th4.appendChild(text4);
                th4.appendChild(addIconArrows());
                th5.appendChild(text5);
                tr.appendChild(th1);
                tr.appendChild(th2);
                tr.appendChild(th3);
                tr.appendChild(th4);
                tr.appendChild(th5);
            
                table.appendChild(tr);
            
            for (var i=0; i<context.results.bindings.length; i++) {
                // console.log(context.results.bindings[i].labelWork.value);
                toponym = context.results.bindings[i].label.value;
                place = context.results.bindings[i].place.value;
                vdl = context.results.bindings[i].vdl.value;
                textual = context.results.bindings[i].textualPlace.value;
                textual_context = context.results.bindings[i].text.value;
                if(vdl==""){
                    vdl="Voce in lavorazione"
                }

                var tr = document.createElement('tr');   

                var td1 = document.createElement('td');
                var td2 = document.createElement('td');
                var td3 = document.createElement('td');
                var td4 = document.createElement('td');
                var td5 = document.createElement('td');
            
                var text1 = document.createTextNode(toponym);
                var text2 = document.createTextNode(place);
                var a1 = document.createElement("a");
                    a1.href = place;
                    a1.target="_blank";
                
                var text3 = document.createTextNode(vdl);
                var a2 = document.createElement("a");
                    a2.href = vdl;
                    a2.target="_blank";
    

                var text4 = document.createTextNode(textual);
                // var text4 = document.createTextNode(textual_context);
                // var text3.innerHTML = textual_context 
            
                td1.appendChild(text1);
                 a1.appendChild(text2);
                 a2.appendChild(text3);
                td2.appendChild(a1);
                if(vdl=="Voce in lavorazione"){
                    td3.appendChild(text3);
                
                }else{
                    td3.appendChild(a2);
                }
                td4.appendChild(text4);
                td5.innerHTML=textual_context;
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
                tr.appendChild(td5);
            
                table.appendChild(tr);
            }
            //  console.log(context);
            th1.addEventListener("click", function(){ sortTable(0, "toponyms-table"); }); 
            th4.addEventListener("click", function(){ valeSort(3, "toponyms-table"); }); 
            
        }).then(() => {
            
                if(value!="https://www.wikidata.org/entity/Q3926645"){
                    // console.log("ORDINATO")
                    valeSort(3, "toponyms-table");
                }
            
            
        })
        .catch((error) => {
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
    "SELECT ?label (COUNT(?label) as ?n_occ) "+
    "FROM <https://imagoarchive.it/fuseki/imago/toponyms>" +
    "WHERE { " +
        "BIND(<" + value + "> AS ?work)" +
        "?context a ecrm:E90_Symbolic_Object ." + 
        "?work ilrmoo:R15_has_fragment ?context ." + 
        "?context ecrm:P106_is_composed_of ?toponym ." +
        "?toponym rdfs:label ?label ." +
        "FILTER(LANG(?label) = 'la') ." + 
    "} GROUP BY ?label ORDER BY DESC(?n_occ)";
    
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
            
                var text1 = document.createTextNode('Toponimo');
                var text2 = document.createTextNode('Occorrenze');
            
                th1.appendChild(text1);
                th1.appendChild(addIconArrows());
                th2.appendChild(text2);
                th2.appendChild(addIconArrows());
                tr.appendChild(th1);
                tr.appendChild(th2);

            
                table.appendChild(tr);
            
            for (var i=0; i<context.results.bindings.length; i++) {
                // console.log(context.results.bindings[i].labelWork.value);
                toponym = context.results.bindings[i].label.value;
                occ = context.results.bindings[i].n_occ.value;

                var tr = document.createElement('tr');   

                var td1 = document.createElement('td');
                var td2 = document.createElement('td');
            
                var text1 = document.createTextNode(toponym);
                var text2 = document.createTextNode(occ);
            
                td1.appendChild(text1);
                td2.appendChild(text2);
                tr.appendChild(td1);
                tr.appendChild(td2);
            
                table.appendChild(tr);
            }
            //  console.log(context);
            th1.addEventListener("click", function(){ sortTable(0, "toponyms-table-2"); }); 
            th2.addEventListener("click", function(){ sortTable(1, "toponyms-table-2"); }); 
            

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

  