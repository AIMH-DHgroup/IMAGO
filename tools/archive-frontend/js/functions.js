///////////////////////////////////////////////////////////////////////////
//
// Project:   IMAGO
// Package:   Web application
// File:      functions.js
// Path:      /var/www/html/archive/js/
// Type:      javascript
// Started:   2023.11.08
// Author(s): Nicolò Pratelli
// State:     online
//
// Version history.
// - 2023.11.08  Nicolò
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

function parseWKT(string){
  // let text = '27 months';
  let regex = /POINT\((?<longitude>-?\d+\.\d+) (?<latitude>-?\d+\.\d+)\)/;
  return [longitude, latitudeunit] = regex.exec(string) || [];

}


function addIconArrows(){
  var img = document.createElement('img');
  img.src = "images/sort.png";
  img.classList = "icon-arrow";
  return img;
}

function isNumber(s) {
  try {
    parseInt(s);
    return true;
  } catch (e) {
    return false;
  }
}

function isRoman(s) {
  return (/[IVXLCDM]+/.test(s));
}

function addZeros(n){
  return n > 9 ? (n > 99 ? "" + n : "0" +n ) : "00" + n;
}

function r_value(r)   
	  {   
	    if (r == 'I')   
	      return 1;   
	    if (r == 'V')   
	      return 5;   
	    if (r == 'X')   
	      return 10;   
	    if (r == 'L')   
	      return 50;   
	    if (r == 'C')   
	      return 100;   
	    if (r == 'D')   
	      return 500;   
	    if (r == 'M')   
	      return 1000;   
	    return -1;   
	  }   
function convertRomanToInt(string)   
  {   
    var total = 0;   
    s = string.split('');
    for (var i=0; i<s.length; i++)   
    {   
      var s1 = r_value(s[i]);   
      if (i+1 < s.length)   
      {   
        var s2 = r_value(s[i+1]);   
        if (parseInt(s1) >= parseInt(s2))   
        {   
          total = total + s1;   
        }   
        else  
        {   
          total = total - s1;   
        }   
      }   
      else  
      {   
        total = total + s1;   
      }   
    }   
    return total;   
  } 

  function to_num(r)   
  {   
    if (r == 'De')   
      return 1;   
    if (r == 'Eg.')   
      return 2000;   
    if (r == 'Ep.')   
      return 3000;   
    if (r == 'Mon.')   
      return 20;   
    if (r == 'Questio')   
      return 5000000;   
    return -1;   
  }   
function checkSort(n, id){
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById(id);
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc"; 
  // console.log(dir);
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[n];
      
      y = rows[i + 1].getElementsByTagName("TD")[n];

      x_c = rows[i].getElementsByTagName("TD")[n+1].getElementsByTagName("I")[0].className;
      y_c = rows[i + 1].getElementsByTagName("TD")[n+1].getElementsByTagName("I")[0].className;

      
      
      /* Convert the value of two elements in int */
      x_split = x.innerHTML.split(' ');
      y_split = y.innerHTML.split(' ');

      // console.log(x_split);
      // console.log(y_split);
      if(x_split[0]=="De"){
        start=2;
      }else{
        start=1;
      }
      x_sum = String(to_num(x_split[0]));
      for(j=start; j<x_split.length; j++){
        if(isRoman(x_split[j].toUpperCase())){ 
          x_sum = x_sum.concat(addZeros(parseInt(convertRomanToInt(x_split[j].toUpperCase()))));
          // x_sum = x_sum.concat(convertRomanToInt(x_split[j].toUpperCase()).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}));
          
        }else{
          x_sum = x_sum.concat(addZeros(parseInt(x_split[j])))
          // x_sum = x_sum.concat(x_split[j].toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}));

        }
        
      }

      x_sum = x_sum.concat(addZeros(x_c));
      
 
      if(y_split[0]=="De"){
        start=2;
      }else{
        start=1;
      }

      y_sum = String(to_num(y_split[0]));
      for(k=start; k<y_split.length; k++){
        if(isRoman(y_split[k].toUpperCase())){
          y_sum = y_sum.concat(addZeros(parseInt(convertRomanToInt(y_split[k].toUpperCase()))));
          // y_sum = y_sum.concat(convertRomanToInt(y_split[k].toUpperCase()).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}));
        }else{
          y_sum = y_sum.concat(addZeros(parseInt(y_split[k])));
          // y_sum = y_sum.concat(y_split[k].toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}));

        }
        
      }

      y_sum = y_sum.concat(addZeros(y_c));

      

      // console.log(parseInt(x_sum))
      // console.log(parseInt(y_sum))
      
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (parseInt(x_sum) > parseInt(y_sum)) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          return shouldSwitch;
          // break;
        }
      } 
    }
    
  }
}

function valeSort(n, id){
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById(id);
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc"; 
  // console.log(dir);
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[n];
      
      y = rows[i + 1].getElementsByTagName("TD")[n];

      x_c = rows[i].getElementsByTagName("TD")[n+1].getElementsByTagName("I")[0].className;
      y_c = rows[i + 1].getElementsByTagName("TD")[n+1].getElementsByTagName("I")[0].className;

      
      
      /* Convert the value of two elements in int */
      x_split = x.innerHTML.split(' ');
      y_split = y.innerHTML.split(' ');

      // console.log(x_split)
      // console.log(y_split)

      // console.log(x_split);
      // console.log(y_split);
      if(x_split[0]=="De"){
        start=2;
      }else{
        start=1;
      }

      x_sum = String(to_num(x_split[0]));
      for(j=start; j<x_split.length; j++){
        if(isRoman(x_split[j].toUpperCase())){ 
          x_sum = x_sum.concat(addZeros(parseInt(convertRomanToInt(x_split[j].toUpperCase()))));
          // x_sum = x_sum.concat(convertRomanToInt(x_split[j].toUpperCase()).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}));
          
        }else{
          x_sum = x_sum.concat(addZeros(parseInt(x_split[j])))
          // x_sum = x_sum.concat(x_split[j].toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}));

        }
        
      }

      x_sum = x_sum.concat(addZeros(x_c));
      
      if(y_split[0]=="De"){
        start=2;
      }else{
        start=1;
      }

      y_sum = String(to_num(y_split[0]));
      for(k=start; k<y_split.length; k++){
        if(isRoman(y_split[k].toUpperCase())){
          y_sum = y_sum.concat(addZeros(parseInt(convertRomanToInt(y_split[k].toUpperCase()))));
          // y_sum = y_sum.concat(convertRomanToInt(y_split[k].toUpperCase()).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}));
        }else{
          y_sum = y_sum.concat(addZeros(parseInt(y_split[k])));
          // y_sum = y_sum.concat(y_split[k].toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}));

        }
        
      }

      y_sum = y_sum.concat(addZeros(y_c));

      

      // console.log(parseInt(x_sum))
      // console.log(parseInt(y_sum))
      
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (parseInt(x_sum) > parseInt(y_sum)) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (parseInt(x_sum) < parseInt(y_sum)) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount ++;     
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }

}

function sortTable(n, id) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById(id);
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc"; 
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount ++;      
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

// Quick and simple export target #table_id into a csv
function download_table_as_csv(table_id, separator = ',') {
// Select rows from table_id
var rows = document.querySelectorAll('table#' + table_id + ' tr');
// Construct csv
var csv = [];
for (var i = 0; i < rows.length; i++) {
    var row = [], cols = rows[i].querySelectorAll('td, th');
    for (var j = 0; j < cols.length; j++) {
        // Clean innertext to remove multiple spaces and jumpline (break csv)
        var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ')
        // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
        data = data.replace(/"/g, '""');
        // Push escaped string
        row.push('"' + data + '"');
    }
    csv.push(row.join(separator));
}
var csv_string = csv.join('\n');
// Download it
var filename = 'export_' + table_id + '_' + new Date().toLocaleDateString() + '.csv';
var link = document.createElement('a');
link.style.display = 'none';
link.setAttribute('target', '_blank');
link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
link.setAttribute('download', filename);
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
}

// Quick and simple export target #table_id into a csv
function download_list_as_csv(table_id, separator = ',') {
  // Select rows from table_id

  var rows = document.getElementById(table_id).querySelectorAll('li');

  // Construct csv
  var csv = [];
  for (var i = 0; i < rows.length; i++) {
      var row = [], cols = rows[i].querySelectorAll('.listDiv');
      for (var j = 0; j < cols.length; j++) {
          var iri = cols[j].getElementsByTagName('a')[0].textContent;
          var data = cols[j].getElementsByTagName('div')[0].textContent;
          console.log(data)
          console.log(iri)
          // Clean innertext to remove multiple spaces and jumpline (break csv)
          // var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ')
          // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
          data = data.replace(/"/g, '""');

          // Push escaped string
          row.push('"' + data + '"');
          row.push('"' + iri + '"');
      }
      csv.push(row.join(separator));
  }
  var csv_string = csv.join('\n');
  // Download it
  var filename = 'export_' + table_id + '_' + new Date().toLocaleDateString() + '.csv';
  var link = document.createElement('a');
  link.style.display = 'none';
  link.setAttribute('target', '_blank');
  link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  }

  function linkifySources(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;
    var ul = document.createElement('ul');
    var new_ul = document.createElement('ul');
    ul.innerHTML= inputText;

    var li = ul.getElementsByTagName('li');
    // console.log(li);
    
    var new_text = "";

    for (var i = 0; i < li.length; i++) {
      var new_li = document.createElement('li');
      var a = li[i].getElementsByTagName('a')[0];
      
      searchText = li[i].querySelector('a').nextSibling.data.trim();

      // console.log(searchText);
      // console.log(a);

      replacePatternComma = /,\s*$/;
      replacedText = searchText.replace(replacePatternComma, '');
  
      //URLs starting with http://, https://, or ftp://
      replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
      replacedText = replacedText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
      

      //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
      replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
      replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

      //Change email addresses to mailto:: links.
      replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
      replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

      // console.log(replacedText);
      
      new_li.appendChild(a);
      var wrapper = document.createElement('span');
        wrapper.innerHTML = replacedText;

      // new_li.insertAdjacentHTML('afterend', replacedText);
      new_li.appendChild(wrapper);
      // console.log(new_li);
      new_ul.appendChild(new_li);
    
    }

    
    // console.log(new_text);
    return new_ul;
}