const url= "https://imagoarchive.it/fuseki/imago/query?output=json&query=";
const named_graph = "https://imagoarchive.it/fuseki/imago/archive";
// const url= "http://localhost:3030/imago/query?output=json&query=";
// const named_graph = "http://localhost:3030/imago/archive";

// Wait for the page to load
document.addEventListener('DOMContentLoaded', function () {

    document.getElementById("fauthor").addEventListener("keyup", searchLemmas);

    document.getElementById("ftitle").addEventListener("keyup", searchLemmas);

});

async function searchLemmas() {
   
    var x = document.getElementById("fauthor");
    // x.value = x.value.toUpperCase();
    console.log(x.value);

    var y = document.getElementById("ftitle");
    console.log(y.value);
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
	"SELECT ?exp_cre ?title ?authorName ?alias " +
	"FROM <"+named_graph+">" +
	"WHERE {" +
	"  ?exp_cre a ilrm:F28_Expression_Creation ;" +
	"  		 ilrm:R17_created ?work ;" +
	"  		 ecrm:P14_carried_out_by ?author .	" +
	"  ?author a :Author ;" +
	"     ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?authorName ;" +
	"     ecrm:P1_is_identified_by/:has_alias ?alias ." +
	"  ?work a ilrm:F2_Expression ;" +
	"     ecrm:P102_has_title/ecrm:P190_has_symbolic_content ?title ." +
	"  FILTER regex(?title, \""+y.value+"\",\"i\") " +
	"  FILTER (regex(?authorName, \""+x.value+"\", \"i\") || regex(?alias, \""+x.value+"\", \"i\")) " +
	"} ORDER BY ?authorName ?title ";

    

    var query = url + encodeURIComponent(search_query);

    /// Fetch current annotation
    let response = await fetch(query, {
        method: 'GET',
        headers: headers,
        mode: 'cors' 
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    let data = await response.json();

        var r = ""
        var list = document.getElementById("results-list");
        list.innerHTML="";
        console.log(data.results.bindings);
        old_iri_lemma = "";
        for (var i=0; i<data.results.bindings.length; i++) {
            title = data.results.bindings[i].title.value;
            author = data.results.bindings[i].authorName.value;
            alias = data.results.bindings[i].alias.value;
            iri_lemma = data.results.bindings[i].exp_cre.value;
            // if(old_iri_lemma == iri_lemma){
            //     listaalias

            // }
            if(old_iri_lemma != iri_lemma){
            alias_list = ""
            // r += author + " - " + title +"<br>";
            var li = document.createElement('li');   
            li.className = 'list-group-item d-flex justify-content-between align-items-start';
            var div1 = document.createElement('div');
            div1.className = 'ms-2 me-auto';
            var div2 = document.createElement('div');
            div2.className = "markcontext"
            var a = document.createElement('a'); 
            a.href = "lemma.html?iri=" + iri_lemma;
            a.className = "markcontextwork"
            var spanAlias = document.createElement('small');   
            spanAlias.className = 'text-muted';
        
            var text1 = document.createTextNode(author);
            var text2 =  document.createTextNode(" aliases: " + alias);
            var text3 = document.createTextNode(title);
            
            
            
            spanAlias.appendChild(text2);
            a.appendChild(text3);
            div2.appendChild(text1);
            div2.appendChild(document.createElement('br'));
            div2.appendChild(spanAlias);
            div1.appendChild(div2);
            div1.appendChild(a);
            li.appendChild(div1);
        
            list.appendChild(li);

            old_iri_lemma = iri_lemma;
            }
          
           
            
           
            
         }
         var markInstance = new Mark(document.querySelectorAll(".markcontext"));
         var markInstancework = new Mark(document.querySelectorAll(".markcontextwork"));
         markInstance.mark(x.value);
         markInstancework.mark(y.value);

  }


  
  