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

    var search_query = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>" +
	"PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
	"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +
	"PREFIX ecrm: <http://erlangen-crm.org/200717/>" +
	"PREFIX ilrm: <http://imagoarchive.it/ilrmoo/>" +
	"PREFIX : <https://imagoarchive.it/ontology/>" +
	"SELECT ?place ?placeName " +
	"FROM <"+named_graph+">" +
	"WHERE {" +
	"   ?place :is_identified_by_toponym ?toponym ." +
	"   ?toponym ecrm:P190_has_symbolic_content ?placeName ." +
	"} ORDER BY ?placeName ";
 
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
        // console.log(data.results.bindings[i].labelWork.value);
        

        place_name = data.results.bindings[i].placeName.value;
        place_iri = data.results.bindings[i].place.value;
        if(place_name!="Sconosciuto"){
            li = document.createElement('li');
            li.className = "list-group-item";
            var a = document.createElement('a'); 
            a.href = "place.html?iri=" + place_iri;
            text = document.createTextNode(place_name);
            c = document.createTextNode(String(i+1));
            a.appendChild(text);
            
            tr = document.createElement('tr');
            td_count = document.createElement('td');
            td_name = document.createElement('td');
            td_count.appendChild(c);
            td_name.appendChild(a);
            tr.appendChild(td_count);
            tr.appendChild(td_name);
            table.appendChild(tr);
        }
    }


});

  
  