// document.addEventListener('DOMContentLoaded', function () {

// 	let searchField = document.getElementById("search");

// 	// searchField.addEventListener("focus", function () {
// 	// 	table_notes = document.getElementById("tableNotes");
// 	// 	table_notes_page = document.getElementById("tableNotesPage");
// 	// 	table_notes.hidden = false;
// 	// 	table_notes_page.hidden = true;

// 	// });

// 	searchField.addEventListener("keyup", function () {

// 		// Declare variables
// 		var input, filter, table, tr, td, i, txtValue;
// 		input = document.getElementById("search");
// 		filter = input.value.toUpperCase();
// 		table = document.getElementById("tableNotes");
// 		tr = table.getElementsByTagName("tr");
	
// 		// Loop through all table rows, and hide those who don't match the search query
// 		for (i = 0; i < tr.length; i++) {
// 		td = tr[i].getElementsByTagName("td")[4];
// 		if (td) {
// 			txtValue = td.textContent || td.innerText;
// 			if (txtValue.toUpperCase().indexOf(filter) > -1) {	
// 				tr[i].style.display = "";
// 			} else {
// 				tr[i].style.display = "none";
// 			}
// 		}
// 		}
//   });
  
// });

document.addEventListener('DOMContentLoaded', function () {

	let searchField = document.getElementById("search");
	
	searchField.addEventListener("focus", function () {
		table_notes = document.getElementById("tableNotes");
		table_notes_page = document.getElementById("tableNotesPage");
		table_notes.hidden = false;
		table_notes_page.hidden = true;

	});

	searchField.addEventListener("keyup", function () {

		// Declare variables
		var input, filter, table, tr, td, i, txtValue;
		input = document.getElementById("search");
		filter = input.value.toUpperCase();
		table = document.getElementById("tableNotes");
		tr = table.getElementsByTagName("tr");
	
		// Loop through all table rows, and hide those who don't match the search query
		for (i = 0; i < tr.length; i++) {
		td = tr[i].getElementsByTagName("td")[0];
		if (td) {
			txtValue = td.textContent || td.innerText;
			if (txtValue.toUpperCase().indexOf(filter) > -1) {	
				tr[i].style.display = "";
			} else {
				tr[i].style.display = "none";
			}
		}
		}
  });
  
});
