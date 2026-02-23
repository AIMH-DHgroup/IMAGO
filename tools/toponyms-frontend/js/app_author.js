const url= "https://imagoarchive.it/fuseki/imago/query?output=json&query=";

// Wait for the page to load
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("download-toponyms-table-2").style.display =  "none";
    document.getElementById("download-toponyms-table").style.display =  "none";
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
			"SELECT DISTINCT ?author ?label "+
            "FROM <https://imagoarchive.it/fuseki/imago/toponyms>" +
			"WHERE { " +
  				"?author a :Author ;" +
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
            iri_author = context.results.bindings[i].author.value;
            label_author = context.results.bindings[i].label.value;
            selectize.addOption({value: iri_author, text: label_author});
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

    document.getElementById("btn-hide-luoghi").style.display = "none";
    document.getElementById("btn-hide-occ").style.display = "none";
    document.getElementById("btn-hide-context").style.display = "none";

    document.getElementById("btn-mostra-luoghi").style.display = "inline-block";
    document.getElementById("btn-mostra-occ").style.display = "inline-block";
    document.getElementById("btn-mostra-context").style.display = "inline-block";

    document.getElementById("toponyms-place").hidden = true;
    document.getElementById("toponyms-table").hidden = true;
    document.getElementById("toponyms-table-2").hidden = true;

    document.getElementById("download-toponyms-table-2").style.display =  "none";
    document.getElementById("download-toponyms-table").style.display =  "none";
    document.getElementById("download-toponyms-place").style.display =  "none";
    
}

function hidePlaces() {
    document.getElementById("btn-mostra-luoghi").style.display = "inline-block";
    document.getElementById("btn-hide-luoghi").style.display =  "none";
    document.getElementById("toponyms-place").innerHTML = "";
   document.getElementById("toponyms-place").hidden = true;
    document.getElementById("download-toponyms-place").style.display =  "none";
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

    document.getElementById("btn-mostra-luoghi").style.display = "none";
    document.getElementById("btn-hide-luoghi").style.display = "inline-block";

   value = document.getElementById("select-state").value;
   document.getElementById("toponyms-place").innerHTML = "";
   document.getElementById("toponyms-place").hidden = false;

   document.getElementById("download-toponyms-place").style.display =  "block";

    let headers = new Headers();
    //headers.append('X-CSRFToken', csrf);
    headers.append('X-Requested-With', 'XMLHttpRequest');

    var get_occ_toponym = "PREFIX : <https://imagoarchive.it/ontology/> " +
    "PREFIX efrbroo: <http://erlangen-crm.org/efrbroo/> " +
    "PREFIX ilrmoo: <http://imagoarchive.it/ilrmoo/> "+
    "PREFIX ecrm: <http://erlangen-crm.org/211015/> "+
    "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> "+
    "SELECT ?label (COUNT(?toponym) AS ?n_occ) "+
    "FROM <https://imagoarchive.it/fuseki/imago/toponyms>" +
    "WHERE {" +
    "    ?toponym a :Toponym ." +
    "    ?toponym rdfs:label ?label ." +
    "    ?work a ilrmoo:F2_Expression ;" +
    "             ecrm:P106_is_composed_of ?toponym ;" +
    "             rdfs:label  ?labelWork." +
    "    ?exprCreation ilrmoo:R17_created ?work ;" +
    "            ecrm:P14_carried_out_by <" + value + "> ." +
    "            <" + value + "> rdfs:label ?authorLabel ." +
    "  FILTER(LANG(?label) = 'la') ." +
    "  } GROUP BY ?label ORDER BY ?label";
      
    
    var query = url + encodeURIComponent(get_occ_toponym);

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

            var table = document.getElementById("toponyms-place");
            table.innerHTML = "";
            var tr = document.createElement('tr');   

                var th1 = document.createElement('th');
                var th2 = document.createElement('th');
                var th3 = document.createElement('th');
            
                var text1 = document.createTextNode('Toponimi');
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
            th1.addEventListener("click", function(){ sortTable(0, "toponyms-place"); }); 
            th2.addEventListener("click", function(){ sortTable(1, "toponyms-place"); }); 

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
    "SELECT ?label ?labelWork "+
    "FROM <https://imagoarchive.it/fuseki/imago/toponyms>" +
    "WHERE {" +
    "    ?toponym a :Toponym ." +
    "    ?toponym rdfs:label ?label ." +
    "    ?work a ilrmoo:F2_Expression ;" +
    "             ecrm:P106_is_composed_of ?toponym ;" +
    "             rdfs:label  ?labelWork." +
    "    ?exprCreation ilrmoo:R17_created ?work ;" +
    "            ecrm:P14_carried_out_by <" + value + "> ." +
    "    <" + value + "> rdfs:label ?authorLabel ." +
    "  FILTER(LANG(?label) = 'la') ." +
    "  } ";
    
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
            
                var text1 = document.createTextNode('Toponimo');
                var text2 = document.createTextNode('Opera');
            
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
                work = context.results.bindings[i].labelWork.value;

                var tr = document.createElement('tr');   

                var td1 = document.createElement('td');
                var td2 = document.createElement('td');
            
                var text1 = document.createTextNode(toponym);
                var text2 = document.createTextNode(work);
            
                td1.appendChild(text1);
                td2.appendChild(text2);
                tr.appendChild(td1);
                tr.appendChild(td2);
            
                table.appendChild(tr);
            }
            //  console.log(context);
            th1.addEventListener("click", function(){ sortTable(0, "toponyms-table"); }); 
            th2.addEventListener("click", function(){ sortTable(1, "toponyms-table"); }); 

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
    "SELECT ?labelWork (COUNT(?toponym) as ?n_toponym)  "+
    "FROM <https://imagoarchive.it/fuseki/imago/toponyms>" +
    "WHERE {" +
    "    ?toponym a :Toponym ." +
    "    ?work a ilrmoo:F2_Expression ;" +
    "            ecrm:P106_is_composed_of ?toponym ;" +
    "          rdfs:label ?labelWork ." +
    "  ?exprCreation ilrmoo:R17_created ?work ;" +
    "            ecrm:P14_carried_out_by <" + value + "> ." +
    "            <" + value + ">  rdfs:label ?authorLabel ." +
    "  } GROUP BY ?labelWork ORDER BY DESC(?n_toponym)";
    
    
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
            
                var text1 = document.createTextNode('Opera');
                var text2 = document.createTextNode('Occorrenze');
            
                th1.appendChild(text1);
                th2.appendChild(text2);
                tr.appendChild(th1);
                tr.appendChild(th2);
            
                table.appendChild(tr);
            
            for (var i=0; i<context.results.bindings.length; i++) {
                // console.log(context.results.bindings[i].labelWork.value);
                work = context.results.bindings[i].labelWork.value;
                occ = context.results.bindings[i].n_toponym.value;

                var tr = document.createElement('tr');   

                var td1 = document.createElement('td');
                var td2 = document.createElement('td');
            
                var text1 = document.createTextNode(work);
                var text2 = document.createTextNode(occ);
            
                td1.appendChild(text1);
                td2.appendChild(text2);
                tr.appendChild(td1);
                tr.appendChild(td2);

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