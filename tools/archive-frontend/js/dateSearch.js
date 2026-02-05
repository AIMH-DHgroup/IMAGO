///////////////////////////////////////////////////////////////////////////
//
// Project:   IMAGO
// Package:   Web application
// File:      dateSearch.js
// Path:      /var/www/html/archive/js/
// Type:      javascript
// Started:   2024.01.25
// Author(s): Nicolò Pratelli
// State:     online
//
// Version history.
// - 2024.01.25  Nicolò
//   First version
//
// ////////////////////////////////////////////////////////////////////////////
//
// This file is part of software developed by the IMAGO Project
// Further information at: http://imagoarchive.it
// Copyright (C) 2020-2023 CNR-ISTI, AIMH, AI&Digital Humanities group
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

var searchedYears = []

// Wait for the page to load
document.addEventListener('DOMContentLoaded', function () {

   
   
    // document.getElementById("download-toponyms-table-2").style.display =  "none";
    document.getElementById("card-table").style.display =  "none";
    document.getElementById("download-toponyms-place").style.display =  "none";
    // $("#entities").selectize({
    //     create: true,
    //     sortField: "text",
    //   });
    // var $select = $(document.getElementById('entities'));
    // var selectize = $select[0].selectize;
   

    var eventHandler = function(name) {
        return function() {
          console.log(name, arguments);
          $('#log').append('<div><span class="name">' + name + '</span></div>');
        };
      };
    //   var $select = $('#select-state').selectize({
    //     create          : true,
    //     onChange        : eventHandler('onChange'),
    //     onItemAdd       : eventHandler('onItemAdd'),
    //     onItemRemove    : eventHandler('onItemRemove'),
    //     onOptionAdd     : eventHandler('onOptionAdd'),
    //     onOptionRemove  : eventHandler('onOptionRemove'),
    //     onDropdownOpen  : eventHandler('onDropdownOpen'),
    //     onDropdownClose : eventHandler('onDropdownClose'),
    //     onFocus         : eventHandler('onFocus'),
    //     onBlur          : eventHandler('onBlur'),
    //     onInitialize    : eventHandler('onInitialize'),
    //   });

      var $select = $('#select-state').selectize({
        sortField: 'text',
        onItemAdd       : function(name) {
            searchManuscriptAdd(name, arguments);
        },
        onItemRemove    : function(name) {
            searchManuscriptRemove(name, arguments);
        }
        // onChange: function(name) {
        //     searchManuscript(name, arguments);
        // }
    }); 
    

// var select = document.getElementById("entities");
// var select1 = document.getElementById("select-state");
// var $select = $(select1);
    var selectize = $select[0].selectize;



    $.fn.pageMe = function (opts) {
        var $this = this,
            defaults = {
                perPage: 7,
                showPrevNext: false,
                hidePageNumbers: false,
                maxPageNumbers: 10
            },
            settings = $.extend(defaults, opts);
    
        var listElement = $this;
        var perPage = settings.perPage;
        var children = listElement.children();
        var pager = $('.pager');
    
        if (typeof settings.childSelector != "undefined") {
            children = listElement.find(settings.childSelector);
        }
    
        if (typeof settings.pagerSelector != "undefined") {
            pager = $(settings.pagerSelector);
        }
    
        var numItems = children.size();
        var numPages = Math.ceil(numItems / perPage);
    
        pager.data("curr", 0);
    
        if (settings.showPrevNext) {
            $('<li class="page-item"><a href="#" class="page-link prev_link">«</a></li>').appendTo(pager);
        }
    
        function showPageNumbers() {
            pager.find('.page_link, .disabled, .next_link').remove();
            var start = 0;
            if (numPages > settings.maxPageNumbers) {
                start = Math.max(0, pager.data("curr") - Math.floor(settings.maxPageNumbers / 2));
            }
            for (var i = start; i < Math.min(numPages, start + settings.maxPageNumbers); i++) {
                if (i === start && i > 0) {
                    $('<li class="page-item disabled"><span class="page-link">...</span></li>').appendTo(pager);
                }
                var pageLink = $('<li class="page-item"><a href="#" class="page-link page_link">' + (i + 1) + '</a></li>').appendTo(pager);
                if (i === pager.data("curr")) {
                    pageLink.addClass('active');
                }
            }
            if (numPages > start + settings.maxPageNumbers) {
                $('<li class="page-item disabled"><span class="page-link">...</span></li>').appendTo(pager);
            }
            if (settings.showPrevNext) {
                $('<li class="page-item"><a href="#" class="page-link next_link">»</a></li>').appendTo(pager);
            }
        }
    
        showPageNumbers();
    
        pager.find('.page_link:first').addClass('active');
        pager.find('.prev_link').hide();
        if (numPages <= 1) {
            pager.find('.next_link').hide();
        }
        pager.children().eq(1).addClass("active");
    
        children.hide();
        children.slice(0, perPage).show();
    
        pager.on('click', 'li .page_link', function () {
            var clickedPage = $(this).html().valueOf() - 1;
            goTo(clickedPage, perPage);
            return false;
        });
    
        pager.on('click', 'li .prev_link', function () {
            previous();
            return false;
        });
    
        pager.on('click', 'li .next_link', function () {
            next();
            return false;
        });
    
        function previous() {
            var goToPage = Math.max(0, parseInt(pager.data("curr")) - 1);
            goTo(goToPage);
        }
    
        function next() {
            var goToPage = Math.min(numPages - 1, parseInt(pager.data("curr")) + 1);
            goTo(goToPage);
        }
    
        function goTo(page) {
            var startAt = page * perPage,
                endOn = startAt + perPage;
    
            children.css('display', 'none').slice(startAt, endOn).show();
    
            if (page >= 1) {
                pager.find('.prev_link').show();
            } else {
                pager.find('.prev_link').hide();
            }
    
            if (page < (numPages - 1)) {
                pager.find('.next_link').show();
            } else {
                pager.find('.next_link').hide();
            }
    
            pager.data("curr", page);
            pager.children().removeClass("active");
            pager.children().eq(page + 1).addClass("active");
    
            showPageNumbers();
        }
    };
    
    
    
    
    
    
    
    
    
    
    


});

function extractExtremes(year){
    switch (year) {
        case '500':
          return ["501-01-01T00:00:00Z", "600-01-01T00:00:00Z"]
        case '600':
          return ["601-01-01T00:00:00Z", "700-01-01T00:00:00Z"]
        case '700':
          return ["701-01-01T00:00:00Z", "800-01-01T00:00:00Z"]
        case '800':
          return ["801-01-01T00:00:00Z", "900-01-01T00:00:00Z"]
        case '900':
          return ["901-01-01T00:00:00Z", "1000-01-01T00:00:00Z"]
        case '1000':
          return ["1001-01-01T00:00:00Z", "1100-01-01T00:00:00Z"]
        case '1100':
          return ["1101-01-01T00:00:00Z", "1200-01-01T00:00:00Z"]
        case '1200':
          return ["1201-01-01T00:00:00Z", "1300-01-01T00:00:00Z"]
        case '1300':
          return ["1301-01-01T00:00:00Z", "1400-01-01T00:00:00Z"]
        case '1400':
          return ["1401-01-01T00:00:00Z", "1500-01-01T00:00:00Z"]
        case '1500':
          return ["1501-01-01T00:00:00Z", "1600-01-01T00:00:00Z"]
        case '1600':
          return ["1601-01-01T00:00:00Z", "1700-01-01T00:00:00Z"]
        case '1700':
            return ["1701-01-01T00:00:00Z", "1800-01-01T00:00:00Z"]
        default:
          console.log(`Sorry, we are out of     .`);
      }
}

function searchManuscriptAdd(name, arguments) {
    
    // value = document.getElementById("select-state").value;
    value = String(arguments[0]);
    console.log(value);
    searchedYears.push(value);
    console.log(searchedYears.length);
    var filter_1 = "FILTER(";
    var filter_2 = "FILTER(";
    let i = 1;
    for (y of searchedYears) {
        if(i!=1){
            filter_1 += " || "
            filter_2 += " || "
        }
        date_extremes = extractExtremes(y);
        start_ext = date_extremes[0];
        end_ext = date_extremes[1];
        filter_1 += "(\""+start_ext+"\"^^xsd:dateTime <= ?start_date_manuscript && ?start_date_manuscript <= \""+end_ext+"\"^^xsd:dateTime)" 
        filter_2 += "(\""+start_ext+"\"^^xsd:dateTime <= ?end_date_manuscript && ?end_date_manuscript <= \""+end_ext+"\"^^xsd:dateTime)";
        i++;
        
        }
        filter_1 += ")";
        filter_2 += ")";
        build_table(filter_1,filter_2);

    
}

function searchManuscriptRemove(name, arguments) {
    console.log(name, arguments);
    // value = document.getElementById("select-state").value;
    value = String(arguments[0]);
    console.log(value);
    var index = searchedYears.indexOf(value);
    console.log(searchedYears.length);
    // console.log(index);
    if (searchedYears.length == 1) {
        console.log("STOP");
        document.getElementById("card-table").style.display =  "none";

    }else{

        if (index > -1) {
            searchedYears.splice(index, 1);
        }
        var filter_1 = "FILTER(";
        var filter_2 = "FILTER(";
        let i = 1;
        for (y of searchedYears) {
            if(i!=1){
                filter_1 += " || "
                filter_2 += " || "
            }
            date_extremes = extractExtremes(y);
            start_ext = date_extremes[0];
            end_ext = date_extremes[1];
            filter_1 += "(\""+start_ext+"\"^^xsd:dateTime <= ?start_date_manuscript && ?start_date_manuscript <= \""+end_ext+"\"^^xsd:dateTime)" 
            filter_2 += "(\""+start_ext+"\"^^xsd:dateTime <= ?end_date_manuscript && ?end_date_manuscript <= \""+end_ext+"\"^^xsd:dateTime)";
            i++;
            
            }
            filter_1 += ")";
            filter_2 += ")";
            
        build_table(filter_1, filter_2);
    }
}

async function build_table(filter_1, filter_2){
    let headers = new Headers();
    //headers.append('X-CSRFToken', csrf);
    headers.append('X-Requested-With', 'XMLHttpRequest');

    var get_manuscripts = "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>" +
	"	PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>" +
	"	PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +
	"	PREFIX ecrm: <http://erlangen-crm.org/200717/>" +
	"	PREFIX ilrm: <http://imagoarchive.it/ilrmoo/>" +
	"	PREFIX : <https://imagoarchive.it/ontology/>" +
	"	SELECT DISTINCT ?manuscript ?placeName ?libraryName ?signature ?folios ?date_manuscript ?start_date_manuscript ?end_date_manuscript" +
	"   FROM <"+named_graph+">" +
	"	WHERE {" +
	"	  ?exp_cre ilrm:R18_created ?manuscript ." +
	"	  ?manuscript ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?signature ;" +
	"	              ecrm:P50_has_current_keeper ?library ;" +
	"	              ecrm:P46_is_composed_of/ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?folios ." +
	"	  ?manifestation ilrm:R7i_is_materialized_in ?manuscript ." +
	"  	  ?manifestation_creation ilrm:R24_created  ?manifestation ;" +
	" 							  ecrm:P4_has_time-span/ecrm:P170i_time_is_defined_by ?date_manuscript ;" +
	"    							:has_start_date ?start_date_manuscript ;" +
	" 								:has_end_date ?end_date_manuscript ." +
	"	  ?library ecrm:P74_has_current_or_former_residence ?libraryPlace ;" +
	"	  	ecrm:P1_is_identified_by/ecrm:P190_has_symbolic_content ?libraryName ." +
	"	   ?libraryPlace :is_identified_by_toponym ?toponym ." +
	"	   ?toponym ecrm:P190_has_symbolic_content ?placeName . " + filter_1 + filter_2 +
	"	} ORDER BY ?start_date_manuscript ?end_date_manuscript ?placeName ?libraryName ?signature ";
   
      
    
    var query = url + encodeURIComponent(get_manuscripts);

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
    // document.getElementById("caricamento").classList.remove("d-none");
    // console.log(document.getElementById("caricamento"));
    // document.getElementById("caricamento").classList.add("d-none");


    var table = document.getElementById("myTableBody");

    var pagin = document.getElementById("myPager");
        
    pagin.innerHTML = "";
    table.innerHTML = "";
    
    // console.log(table);
       
    for (var i=0; i<data.results.bindings.length; i++) {
        // console.log(data.results.bindings[i].labelWork.value);
        iri_manuscript = data.results.bindings[i].manuscript.value;
        place = data.results.bindings[i].placeName.value;
        library = data.results.bindings[i].libraryName.value;
        signatureName = data.results.bindings[i].signature.value;
        foliosName = data.results.bindings[i].folios.value;
        datazione = data.results.bindings[i].date_manuscript.value;


        li = document.createElement('li');
        li.className = "list-group-item";
        var a = document.createElement('a'); 
        a.href = "manuscript.html?iri=" + iri_manuscript;
        if(library=="Sconosciuta"){
            text = document.createTextNode(place + ", " + signatureName + ", " + foliosName);
        } else {
            text = document.createTextNode(place + ", " + library + ", " + signatureName + ", " + foliosName);
        }
        d = document.createTextNode(" (" + datazione + ")");
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
    $('#myTableBody').pageMe({pagerSelector:'#myPager',showPrevNext:true,hidePageNumbers:false,perPage:40,maxPageNumbers:10});
    
    document.getElementById("download-toponyms-place").style.display =  "inline-block";
    document.getElementById("card-table").style.display =  "block";
       
    
}
