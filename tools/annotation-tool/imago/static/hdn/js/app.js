// ////////////////////////////////////////////////////////////////////////
//
// Project: IMAGO / HDN
// Package: Frontend
// Title: manage form
// File: app.js
// Path: static/js/
// Type: javascript
// Started: 2020-04-26
// Author(s): Nicolo' Pratelli & Daniele Metilli
// State: in use
//
//  Version history.
// - 2020-04-26 Nicolo' Pratelli & Daniele Metilli
// First version
// - 2020-04-28 Nicolo' Pratelli
// Added management of the insertion of citations
// - 2020-04-30 Nicolo' Pratelli
// Added management of the deletion of citations
// - 2020-05-04 Nicolo' Pratelli
// Added management of the updating of citations
// - 2020-05-07 Daniele Metilli
// Added autocomplete, popovers and hidden IRIs
// - 2020-05-17 Daniele Metilli
// Updated handling of popovers and modals
// - 2020-06-04 Daniele Metilli
// Added import from Wikidata and user-defined entities
// - 2020-06-16 Nicolo' Pratelli
// Added multiple subject management
// - 2020-10-19 Nicolo' Pratelli
// Added support for new form fields
// - 2020-11-11 Nicolo' Pratelli
// Fixed problem with edit reference button
// - 2020-11-12 Nicolo' Pratelli
// Note form loaded into accordion
// - 2020-12-03 Daniele Metilli
// Fixed autocompletes and modals
//
// ////////////////////////////////////////////////////////////////////////
//
// This file is part of software developed by the Digital Libraries group
// of AIMH Laboratory, Institute of Information Science and Technologies
// (ISTI-CNR), Pisa, Italy, for the IMAGO and HDN projects.
// Further information at: https://hdn.dantenetwork.it
// Copyright (C) 2020 ISTI-CNR, Nicolo' Pratelli & Daniele Metilli
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
// ////////////////////////////////////////////////////////////////////////

// Global variable that will contain form data
var data = {};

/*
	Function to reset popovers to original state
*/
function resetPopovers(selector) {
	//console.log(selector);
	//console.log($(selector).attr('title'))
	//console.log($(selector).attr('data-default-title'))
	//console.log($(selector).attr('data-original-title'))
	//console.log(' ')
	if (selector === undefined) {
		selector = '[data-toggle=popover]';
	}
	$(selector).each(function() {
		$(this).attr('data-original-title', $(this).attr('data-default-title'));
		$(this).attr('data-content', '');
	});
}

/*
	Editor textarea TinyMCE
*/
	tinymce.init({
		selector: '#id_text_fragment',
		menubar: false,
		fix_list_elements : true, 
		forced_root_block : false,
		valid_elements : 'i,b,strong,em,sup,pre',
		plugins: 'code',
		toolbar: 'bold italic code',
		content_style: '@import url(https://fonts.googleapis.com/css?family=Raleway:400,700); body { font-family: Code Bold, Raleway, Arial, Helvetica, sans-serif; font-size:1rem; } pre{font-family: "Code Bold", Raleway, Arial, Helvetica, sans-serif; font-size: 100%;}',
		setup: function (editor) {
			editor.on('change', function () {
				editor.save();
			});
		}
	  });
	
	tinymce.init({
		selector: '#id_source_text',
		menubar: false,
		fix_list_elements : true, 
		forced_root_block : false,
		valid_elements : 'br',
		plugins: 'code',
		toolbar: 'code',
		content_style: '@import url(https://fonts.googleapis.com/css?family=Raleway:400,700); body { font-family: Code Bold, Raleway, Arial, Helvetica, sans-serif; font-size:1rem; } pre{font-family: "Code Bold", Raleway, Arial, Helvetica, sans-serif; font-size: 100%;}',
		setup: function (editor) {
			editor.on('change', function () {
				editor.save();
			});
		}
	  });
	  	
// Wait for the page to load
document.addEventListener('DOMContentLoaded', function () {

	if(!document.getElementById('cookie')){
		deleteCookies();
	}

	// Style delete button for Content reference forms
	$( ".delete-row" ).addClass( "btn btn-danger btn-sm" );
	
	// Homepage btn 
	var homepageBtn = document.getElementById( "homepage-btn");

	homepageBtn.addEventListener("click", function () {
		// redirect to the list of commentaries
		window.location.replace("../../");
	});

	// Reset the form 
	document.getElementById("noteForm").reset();
	// tinyMCE.activeEditor.setContent('');
	// tinymce.get("id_text_fragment").setContent('');
	// tinymce.get("id_source_text").setContent('');

	/* 
		Initialize variables 
	*/ 
	// Load JSON data into global variable
	data = JSON.parse(document.getElementById('json_data').textContent);
	//console.log(data);

	var pathArray = window.location.pathname.split('/');


	// console.log(pathArray[3]);
	

	noteTreeId = "note-" + pathArray[4];


	/*
		Show edit text dante
	*/
	var btrEditDanteText = document.getElementById("btn-edit-dante-text");
	let danteTextInput = document.getElementById("dante-text-input");
	let danteText = document.getElementById("dante-text");

	btrEditDanteText.addEventListener("click", function () { 
		if (danteTextInput.style.display === "none" || danteTextInput.style.display === '') {
			danteTextInput.style.display = "inline";
			danteText.style.display = "none";
			danteTextInput.firstElementChild.value = danteText.textContent;
			
			check = document.createElement("i");
			check.className = "fas fa-check";
			btrEditDanteText.textContent = "";
			btrEditDanteText.appendChild(check);
		} else {
			danteTextInput.style.display = "none";
			danteText.style.display = "inline";
			check = document.createElement("i");
			check.className = "fas fa-pencil-alt";
			btrEditDanteText.textContent = "";
			btrEditDanteText.appendChild(check);

			// Chiamata alla funzione che salva il testo dantesco
			saveDanteText(danteTextInput.firstElementChild.value);

		}


	});


	/*
		Show edit body nota
	*/
	// var btrEditBodyNote = document.getElementById("btn-edit-body-nota-text");
	// let bodyNoteInput = document.getElementById("body-nota-input");
	// let bodyNote = document.getElementById("body-nota-text");

	// btrEditBodyNote.addEventListener("click", function () { 
	// 	if (bodyNoteInput.style.display === "none" || bodyNoteInput.style.display === '') {
	// 		bodyNoteInput.style.display = "inline";
	// 		bodyNote.style.display = "none";
	// 		bodyNoteInput.firstElementChild.value = bodyNote.innerHTML;
			
	// 		check = document.createElement("i");
	// 		check.className = "fas fa-check";
	// 		btrEditBodyNote.textContent = "";
	// 		btrEditBodyNote.appendChild(check);
	// 	} else {
	// 		bodyNoteInput.style.display = "none";
	// 		bodyNote.style.display = "inline";
	// 		check = document.createElement("i");
	// 		check.className = "fas fa-pencil-alt";
	// 		btrEditBodyNote.textContent = "";
	// 		btrEditBodyNote.appendChild(check);

	// 		// Chiamata alla funzione che salva il testo dantesco
			
	// 		saveBodyNote(bodyNoteInput.firstElementChild.value);

	// 	}


	// });


	/* 
		Show the right fors if the annotator compile a citation (citazione), loci parallali or external support (supporto esterno)
	*/

	// Get the forms and reference kind
	var reference_kind = document.getElementById("id_reference_kind");
	var citationForm = document.getElementById("citationForm");
	var refereceContentForm = document.getElementById("referenceContentForm");
	var referenceForm = document.getElementById("referenceForm");
	var addRefefernceBtn = document.getElementById("add-cit");
	

	// Add on click event to 
	reference_kind.addEventListener("change", function () {

		// Get reference kind value
		var selectedOption = reference_kind.options[reference_kind.selectedIndex].value;

		if (selectedOption === "SUPPORTO ESTERNO") {
			citationForm.hidden = true; // hide
			refereceContentForm.hidden = true; // hide
			referenceForm.hidden = false; // show
			addRefefernceBtn.disabled = false;	
		} else if (selectedOption === "CITAZIONE") {
			citationForm.hidden = false; // show
			refereceContentForm.hidden = false; // show
			referenceForm.hidden = false; // show
			addRefefernceBtn.disabled = false;
		} else if (selectedOption === "LOCI PARALLELI") {
			citationForm.hidden = true; // hide
			refereceContentForm.hidden = false; // show
			referenceForm.hidden = false; // show
			addRefefernceBtn.disabled = false;
		} else{
			citationForm.hidden = true; // hide
			refereceContentForm.hidden = true; // hide
			referenceForm.hidden = true; // hide
			addRefefernceBtn.disabled = true;
		}

	});


	/* 
		Show or hide formset of content of citation an reference commentator
	*/

	// define the id of the formsets elements
	var formsets_id = ["id_character", "id_episode","id_theme","id_image","id_stylistic_feature","id_topography","id_theory","id_reference_commentator"];

	// Add onclick events to every formsets
	formsets_id.forEach(function(id) {
		var element = document.getElementById(id);
		idGroup = id +"-group";
		var elementGroup = document.getElementById(idGroup);
		element.addEventListener("click", function () {
			if(element.checked == true){
				elementGroup.style.display = "inline";
			}else{
				elementGroup.style.display = "none";
	
			}
		});

	});

	hideFormsets(formsets_id);



	// document.getElementById(noteTreeId).classList.toggle("activeNote");

	// Select the form
	let form = document.querySelector('form');
	
	/* 
		Show/hide JSON
	*/
	// Get the button that show or hide json
	var btnJson = document.getElementById("btn-json"); 

	// Get the json field
	var jsonField = document.getElementById("json-field"); 
		
	// Add the onclick event to button that show or hide json code
	btnJson.addEventListener("click", function () {

		if (jsonField.style.display === "none" || jsonField.style.display === '') {
			jsonField.style.display = "block";
			btnJson.textContent = "Nascondi JSON";
			btnJson.scrollIntoView();
		} else {
			jsonField.style.display = "none";
			btnJson.textContent = "Mostra JSON";
		}

	});

	/* 
		Accordion of citations management
	*/

	// Get the array of citations accordion buttons
	var acc = document.getElementsByClassName("cit-accordion"); 
	
	// Add the onclick event to citations accordion that show or hide the citations
	for (var i = 0; i < acc.length; i++) {
		acc[i].addEventListener("click", function () {
			
			/* Toggle between adding and removing the "active" class,
			to highlight the button that controls the panel */
			this.classList.toggle("active");
			

			/* Toggle between hiding and showing the active panel */
			var panel = this.nextElementSibling;
			if(panel.getElementsByClassName("referenceInformation")[0].hidden){
				document.getElementById("noteForm").reset();
				// tinyMCE.activeEditor.setContent('');
				tinymce.get("id_text_fragment").setContent('');
				tinymce.get("id_source_text").setContent('');
				// hide formsets
				hideFormsets(formsets_id);

				noteForm = document.getElementById("noteForm").parentElement.removeChild(document.getElementById("noteForm"));

				noteFormContainer = document.getElementById("containerForm");

				noteFormContainer.appendChild(noteForm);

				referenceInformation.hidden = false;

				document.getElementById("citationForm").hidden = true; // hide
				document.getElementById("referenceContentForm").hidden = true; // hide
				document.getElementById("referenceForm").hidden = true; // hide

				// Make sure that IRI forms are empty
				document.getElementById("id_cited_source_iri").value = '';
				document.getElementById("id_cited_author_iri").value = '';
				document.getElementById("id_theme_area_iri").value = '';

				referenceInformation.parentElement.scrollIntoView();
				document.getElementById("add-cit").hidden = false;
				document.getElementById("add-cit").disabled = true;
				document.getElementsByClassName("btn-save-cit")[0].style.display = "none";
				document.getElementById("new-cit").style.display = "none";



				// Reset popovers
				resetPopovers();

			};
			if (panel.style.maxHeight) {
				panel.style.maxHeight = null;
			} else {
				panel.style.maxHeight = panel.scrollHeight + "px";
			}
		});
	}

	/*
		Transform IRIs into names in loaded citations
	*/
	var iris = document.getElementsByClassName("is-iri");

	Array.from(iris).forEach(function(iri) {
		if (iri.textContent) {
			dataFromIRI(iri.textContent).then((context) => {
				if (context) iri.textContent = context.text;
			});
		}
	});

	/* 
		Modal to cancel a citation
	*/

	// Get the buttons that opens the modal
	var btnModal = document.getElementsByClassName("btn-modal");

	// Get the modal
	var modal = document.getElementById("del-cit-modal");

	// Add click events to open modal 
	for (var i = 0; i < btnModal.length; i++) {
		btnModal[i].addEventListener("click", function () {
			id = this.id.split("-")[2];
			var btnDelCit = document.getElementsByClassName("btn-del-cit")[0];
			btnDelCit.id = "del-cit-" + id;
			modal.style.display = "block";

		});
	}

	// Get all the close buttons that close the modals
	var closeButtons = document.getElementsByClassName("close-modal");

	// For each button, add click event to close modal
	for (var i = 0; i < closeButtons.length; i++) {
		closeButtons[i].addEventListener("click", function () {
			this.parentElement.parentElement.style.display = "none";
		});
	}

	// When the user clicks anywhere outside of a modal, close it
	window.addEventListener("click", function (event) {
		let classList = event.target.classList;
		if (classList.contains('del-modal') || classList.contains('add-modal')) {
			event.target.style.display = "none";
		}
	});


    /* 
       Evento onclick load a reference in the form to allow editing
    */
	let citButtons = document.getElementsByClassName("btn-cit");
	for (var i = 0; i < citButtons.length; i++) {
		loadReferenceForEdit(citButtons[i], data, formsets_id);
	}

	

	
	/* 
       Evento onclick save reference
    */
	let noteForm = document.getElementById('noteForm');
	let saveCitButton = document.getElementsByClassName("btn-save-cit")[0];

	saveCitButton.addEventListener("click", function () {
		// // Prevent page reload
		// event.preventDefault();
		tinyMCE.triggerSave(); 

		id = this.id.split("-")[2];
		//cit = data.Nota.Citazioni[id];

		// Get Django CSRF token
		let csrf = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

		// Set request headers
		let headers = new Headers();
		headers.append('X-CSRFToken', csrf);
		headers.append('X-Requested-With', 'XMLHttpRequest');


		// Create new FormData object and populate it
		let formData = new FormData(noteForm);

		// Get current URL (should include object ID)
		let url = window.location.href;

		if (url.substring(url.length-2) == "/0" || url.substring(url.length-2) == "/1"){
        	url = url.substring(0, url.length-1);
    	}

		url = url + "save/" + id +"/";
		// window.open(url); 
		// Fetch current annotation
		fetch(url,
			{
				method: 'POST',
				body: formData,
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
				data = context.data;
				citazione = data["Nota"]["Citazioni"][id];
				panelId = "panel-cit-" + id;
				let panel = document.getElementById(panelId);
				

				noteForm = document.getElementById("noteForm").parentElement.removeChild(document.getElementById("noteForm"));

				noteFormContainer = document.getElementById("containerForm");

				noteFormContainer.appendChild(noteForm);

				referenceInformation.hidden = false;
				// hide formsets
				hideFormsets(formsets_id);
				


				let dl = panel.firstElementChild.firstElementChild; 
				dl.textContent = ""
				dl = buildReference(dl, citazione);

				loadReferenceForEdit(referenceInformation.getElementsByClassName("btn-cit")[0], data, formsets_id);

				if( typeof window.tinymce != 'undefined' && $(window.tinymce.editors).length > 0 ){
					$(window.tinymce.editors).each(function(idx) {
					  try {
					  tinymce.remove(idx);
					  } catch (e) {}
					});
				  }
	
				// tinymce.remove("id_text_fragment");
				tinymce.init({
					selector: '#id_text_fragment',
					menubar: false,
					fix_list_elements : true, 
					forced_root_block : false,
					valid_elements : 'i,b,strong,em,sup, pre',
					plugins: 'code',
					toolbar: 'bold italic code',
					content_style: '@import url(https://fonts.googleapis.com/css?family=Raleway:400,700); body { font-family: Code Bold, Raleway, Arial, Helvetica, sans-serif; font-size:1rem;} pre{font-family: "Code Bold", Raleway, Arial, Helvetica, sans-serif; font-size: 100%;}',
					setup: function (editor) {
						editor.on('change', function () {
							editor.save();
						});
					}
				  });

				tinymce.init({
					selector: '#id_source_text',
					menubar: false,
					fix_list_elements : true, 
					forced_root_block : false,
					valid_elements : 'br',
					plugins: 'code',
					toolbar: 'code',
					content_style: '@import url(https://fonts.googleapis.com/css?family=Raleway:400,700); body { font-family: Code Bold, Raleway, Arial, Helvetica, sans-serif; font-size:1rem;} pre{font-family: "Code Bold", Raleway, Arial, Helvetica, sans-serif; font-size: 100%;}',
					setup: function (editor) {
						editor.on('change', function () {
							editor.save();
						});
					}
				  });


				// Reset the form 
				document.getElementById("noteForm").reset();
				// tinyMCE.activeEditor.setContent('');
				tinymce.get("id_text_fragment").setContent('');
				tinymce.get("id_source_text").setContent('');

				

				// hide all forms
				citationForm.hidden = true; // hide
				refereceContentForm.hidden = true; // hide
				referenceForm.hidden = true; // hide


				document.getElementById(panelId).scrollIntoView();

				document.getElementById("add-cit").disabled = true;
				document.getElementById("add-cit").hidden = false;
				document.getElementsByClassName("btn-save-cit")[0].style.display = "none";
				document.getElementById("new-cit").style.display = "none";

				// Make sure that IRI fields are empty
				document.getElementById("id_cited_source_iri").value = '';
				document.getElementById("id_cited_author_iri").value = '';
				document.getElementById("id_theme_area_iri").value = '';

				//Update json field
				jsonField.textContent = context.json;



				var citPanel = document.getElementsByClassName("cit-panel");
				for (var i = 0; i < citPanel.length; i++) {
					let childPanel = citPanel[i].firstElementChild.children;
					var textMatch = childPanel[1].textContent;
					// testo = highlightText(textMatch, testo);
					// testiChildren[5].innerHTML = testo;	
				}

				// Reset popovers
				resetPopovers();

			})
			.catch((error) => {
				console.error('Error:', error);
			});

		// modal.style.display = "none";
		// idPanel = "panel-cit-" + id;
		// idBtnExpCit = "btn-exp-cit-" + id;
		// let buttonExp = document.getElementById(idBtnExpCit);
		// let panel = document.getElementById(idPanel);

		// buttonExp.parentNode.removeChild(buttonExp);
		// panel.parentNode.removeChild(panel);


	});


	/* 
		 Evento per l'eliminazione di una citazione
	*/
	var citDelButton = document.getElementsByClassName("btn-del-cit")[0];

	citDelButton.addEventListener("click", function () {
		// // Prevent page reload
		// event.preventDefault();

		id = this.id.split("-")[2];
		//cit = data.Nota.Citazioni[id];

		modalid = "deleteCitModal" + id;


		// Get Django CSRF token
		let csrf = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

		// Set request headers
		let headers = new Headers();
		headers.append('X-CSRFToken', csrf);
		headers.append('X-Requested-With', 'XMLHttpRequest');

		// Get current URL (should include object ID)
		let url = window.location.href;

		if (url.substring(url.length-2) == "/0" || url.substring(url.length-2) == "/1"){
        	url = url.substring(0, url.length-1);
    	}


		url = url + "delete/" + id;
		// window.open(url); 
		// Fetch current annotation
		fetch(url,
			{
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

				data = context.data;

				//Update json field
				jsonField.textContent = context.json;

				// testiNota = document.getElementById("testi-nota");
				// testiChildren = testiNota.children;
				// var testo = testiChildren[7].textContent;
				// testiChildren[7].textContent = data["Nota"]["BodyNota"];

				// var citPanel = document.getElementsByClassName("cit-panel");
				// for (var i = 0; i < citPanel.length; i++) {
				// 	let childPanel = citPanel[i].firstElementChild.children;
				// 	var textMatch = childPanel[1].textContent;
				// 	// testo = highlightText(textMatch, testo);
				// 	testiChildren[5].innerHTML = testo;	
				// }
				
			})
			.catch((error) => {
				console.error('Error:', error);
			});
			accLenght = acc.length;
			modal.style.display = "none";
			idPanel = "panel-cit-" + id;
			idBtnExpCit = "btn-exp-cit-" + id;
			let buttonExp = document.getElementById(idBtnExpCit);
			let panel = document.getElementById(idPanel);

			buttonExp.parentNode.removeChild(buttonExp);
			panel.parentNode.removeChild(panel);
		
			if(id!=(accLenght-1)){
				// console.log("entrato");
				for (var k = parseInt(id) + 1; k < accLenght; k++) {
					// console.log("k");
					// console.log(k);
					newId = k - 1;
					tempId = "btn-exp-cit-" + k;
					old_text = document.getElementById(tempId).textContent;
					var old_text_array = old_text.split(" ");
					if(old_text_array[2]=="(CITAZIONE)"){
						document.getElementById(tempId).textContent = "Riferimento " + k + " " + old_text_array[2];
					} else {
						document.getElementById(tempId).textContent = "Riferimento " + k + " " + old_text_array[2] + " " + old_text_array[3];
					}
					document.getElementById(tempId).id = "btn-exp-cit-" + newId;
					tempId = "panel-cit-" + k;
					document.getElementById(tempId).id = "panel-cit-" + newId;
					tempId = "cit-" + k;
					document.getElementById(tempId).id = "cit-" + newId;
					tempId = "btn-modal-" + k;
					document.getElementById(tempId).id = "btn-modal-" + newId;
				}

			}
		
			
	});

	/*
		Qui sotto viene catturato l'evento submit sul form,
		bloccando il reload automatico della pagina
	*/

	// Add event listener on form
	form.addEventListener('submit', function (event) {

		// Prevent page reload
		event.preventDefault();
		tinyMCE.triggerSave();
		

		// Get Django CSRF token
		let csrf = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
		console.log(csrf);

		// Set request headers
		let headers = new Headers();
		headers.append('X-CSRFToken', csrf);
		headers.append('X-Requested-With', 'XMLHttpRequest');

		// Create new FormData object and populate it
		let formData = new FormData(this);

		// Check content of FormData object
		for (let field of formData) {
			console.log(field);
		}

		// Reset popovers
		resetPopovers();

		// Get current URL (should include object ID)
		let url = window.location.href;	

		// Fetch current annotation
		fetch(url,
			{
				method: 'POST',
				body: formData,
				headers: headers,
				mode: 'cors'
			})
			.then((response) => {
				console.log(response)
				return response.json();
			})
			.then((context) => {
				/*
					Qui riceviamo il context in JSON, quindi possiamo
					prendere la variabile "data" e aggiornarla. Volendo si
					può fare la stessa cosa anche per la variabile "json"
					che contiene il JSON formattato
				*/
				data = context.data;
				
				//Update json field
				jsonField.textContent = context.json;

				// Inserire la nuova citazione nel DOM
				var accordion = document.getElementById("accordion");
				// console.log(accordion);
				var btn = document.createElement("button");
				if(!accordion.firstElementChild){
					newId = 0;
					// console.log(newId);
				} else {
					
					var lastId = accordion.lastElementChild.id.split("-")[2];
					console.log(lastId);
					newId = parseInt(lastId) + 1;
					// console.log(newId);
				}
				btnId = "btn-exp-cit-" + newId;
				// console.log(btnId);
				citazione = data["Nota"]["Citazioni"][data["Nota"]["Citazioni"].length - 1];

				btn.id = btnId;
				btn.className = "cit-accordion";
				numCitazione = newId + 1;
				var textBtn = document.createTextNode("Riferimento " + numCitazione + " (" + citazione["NaturaRiferimento"] + ")");
				btn.appendChild(textBtn);
				btn.addEventListener("click", function () {
					/* Toggle between adding and removing the "active" class,
					to highlight the button that controls the panel */
					this.classList.toggle("active");

					/* Toggle between hiding and showing the active panel */
					var panel = this.nextElementSibling;
					if(panel.getElementsByClassName("referenceInformation")[0].hidden){
						document.getElementById("noteForm").reset();
						// hide formsets
						hideFormsets(formsets_id);
		
						noteForm = document.getElementById("noteForm").parentElement.removeChild(document.getElementById("noteForm"));
		
						noteFormContainer = document.getElementById("containerForm");
		
						noteFormContainer.appendChild(noteForm);
		
						referenceInformation.hidden = false;
		
						document.getElementById("citationForm").hidden = true; // hide
						document.getElementById("referenceContentForm").hidden = true; // hide
						document.getElementById("referenceForm").hidden = true; // hide
		
						// Make sure that IRI forms are empty
						document.getElementById("id_cited_source_iri").value = '';
						document.getElementById("id_cited_author_iri").value = '';
						document.getElementById("id_theme_area_iri").value = '';
		
						referenceInformation.parentElement.scrollIntoView();
						document.getElementById("add-cit").hidden = false;
						document.getElementById("add-cit").disabled = true;
						document.getElementsByClassName("btn-save-cit")[0].style.display = "none";
						document.getElementById("new-cit").style.display = "none";
		
		
		
						// Reset popovers
						resetPopovers();
		
					};
					if (panel.style.maxHeight) {
						panel.style.maxHeight = null;
					} else {
						panel.style.maxHeight = panel.scrollHeight + "px";
					}
				});

				accordion.appendChild(btn);

				var div = document.createElement("div");
				div.id = "panel-cit-" + newId;
				div.className = "cit-panel";
				var dl = document.createElement("dl");
				dl.className = "row";

				var referenceInformation = document.createElement("div");
				referenceInformation.className = "referenceInformation";

				var noteFormSpace = document.createElement("div");
				noteFormSpace.className = "noteFormSpace";

				dl = buildReference(dl, citazione);

				div.appendChild(referenceInformation);
				referenceInformation.appendChild(dl);
				div.appendChild(noteFormSpace);

				// Btn Edit
				var btnEdit = document.createElement("button");
				btnEditId = "cit-" + newId;
				btnEdit.id = btnEditId
				btnEdit.className = "btn btn-primary btn-sm btn-cit float-right";
				btnEdit.type = "button";
				var iEdit = document.createElement("i");
				iEdit.className = "far fa-edit";
				btnEdit.appendChild(iEdit);
				var textBtnEdit = document.createTextNode(" Modifica");
				btnEdit.appendChild(textBtnEdit);
				referenceInformation.appendChild(btnEdit);

				loadReferenceForEdit(btnEdit, data, formsets_id);


				// Btn Del
				var btnDel = document.createElement("button");
				btnDelId = "btn-modal-" + newId;
				btnDel.id = btnDelId
				btnDel.className = "btn btn-danger btn-sm btn-modal float-left";
				var iDel = document.createElement("i");
				iDel.className = "fas fa-trash";
				btnDel.appendChild(iDel);
				var textBtnDel = document.createTextNode(" Cancella");
				btnDel.appendChild(textBtnDel);
				referenceInformation.appendChild(btnDel);
				btnDel.addEventListener("click", function () {
					id = this.id.split("-")[2];
					var btnDelCit = document.getElementsByClassName("btn-del-cit")[0];
					btnDelCit.id = "del-cit-" + id;
					modal.style.display = "block";

				});

	
				accordion.appendChild(div);
				
				document.getElementById("done").classList.remove("active");
				document.getElementById("doing").classList.add("active");
				document.getElementById("to-do").classList.remove("active");
				changeState("doing");
				// testiChildren[5].textContent = data["Nota"]["BodyNota"];


				// Reset the form 
				document.getElementById("noteForm").reset();
				// tinyMCE.activeEditor.setContent('');
				tinymce.get("id_text_fragment").setContent('');
				tinymce.get("id_source_text").setContent('');

				// hide formsets
				hideFormsets(formsets_id);

				// hide all forms
				citationForm.hidden = true; // hide
				refereceContentForm.hidden = true; // hide
				referenceForm.hidden = true; // hide

				document.getElementById(btnId).scrollIntoView();

				

				
				// Make sure that IRI fields are empty
				document.getElementById("id_cited_source_iri").value = '';
				document.getElementById("id_cited_author_iri").value = '';
				document.getElementById("id_theme_area_iri").value = '';

				// console.log(accordion);
			})
			.catch((error) => {
				console.error('Error:', error);
			});


		// Return false to avoid page reload
		return false;
	});

	/*
		Autocomplete for input fields (jQuery Q_Q)
	*/

    const MAX_LIST_LENGTH = 10;

    // Function to filter sources by author and length
    function filterByAuthor(newValue, origJQElement) {
            let authorIRI = $('#id_cited_author_iri').val();
            if (authorIRI && (authorIRI !== '')) {
                    return (authorIRI + '$$' + newValue);
            }
            return newValue;
    }

    // Function to filter sources by length only
    function filterByLength(resultsFromServer, origJQElement) {
            return resultsFromServer.slice(0, MAX_LIST_LENGTH);
    }

    // Initialize autocomplete fields
    $('#id_cited_author, #id_theme_area').autoComplete({
            resolverSettings: {
                    url: $(this).attr('data-url'),
                    fail: autocompleteFail
            },
            minLength: 0,
            preventEnter: true,
            events: {searchPost: filterByLength}
    });
    $('#id_cited_source').autoComplete({
            resolverSettings: {
                    url: $(this).attr('data-url'),
                    fail: autocompleteFail
            },
            minLength: 0,
            preventEnter: true,
            events: {searchPre: filterByAuthor}
    });

    // Wikidata query URL
    const WD_URL = 'https://query.wikidata.org/sparql';

    // SPARQL subquery for sources
    function makeSubquery(query, offset) {
            return (offset ? ' UNION ' : '') +
                    '{SERVICE wikibase:mwapi { ' +
                            'bd:serviceParam wikibase:limit 50 . ' +
                            (offset ? 'bd:serviceParam mwapi:continue ' + offset + ' . ' : '') +
                            'bd:serviceParam wikibase:api "EntitySearch" . ' +
                            'bd:serviceParam wikibase:endpoint "www.wikidata.org" . ' +
                            'bd:serviceParam mwapi:search "' + query + '" . ' +
                            'bd:serviceParam mwapi:language "it" . ' +
                            '?item wikibase:apiOutputItem mwapi:item . ' +
            '}}';
    }

    // SPARQL query for sources
    function makeSourceQuery(query) {
            return 'SELECT DISTINCT (?item as ?value) ?itemLabel ?itemAltLabel ?author ?authorLabel WHERE { ' +
                    'hint:Query hint:optimizer "None". ' + // disable optimizer (makes query faster)
                    '{SELECT ?item ?author WHERE { ' +
                    makeSubquery(query, 0) + // results 1-50
                    makeSubquery(query, 50) + // results 51-100
                    'FILTER NOT EXISTS { ' +
                    '{?item wdt:P571|wdt:P577|wdt:P1191 ?date. ' +
                    'hint:Prior hint:rangeSafe true . }' +
                    'UNION { ?item wdt:P50 ?author. ' +
                    '?author wdt:P569 ?date. hint:Prior hint:rangeSafe true.} ' +
                    'FILTER (?date > "1400-01-01"^^xsd:dateTime) ' +
                    '} ' +
                    '{?item wdt:P31 wd:Q47461344 . } ' +
                    'UNION ' +
                    '{?item wdt:P31/wdt:P279* wd:Q47461344 . ' +
                    'hint:Prior hint:gearing "forward". }' +
                    'OPTIONAL {?item wdt:P50 ?author} } LIMIT 50}' +
                    'SERVICE wikibase:label {' +
                            'bd:serviceParam wikibase:language "[AUTO_LANGUAGE],it,la,en" . ' +
                    '}' +
            '}'
    }

    // SPARQL query for authors
    function makeAuthorQuery(query) {
            return 'SELECT DISTINCT (?item as ?value) ?itemLabel ?itemAltLabel WHERE { ' +
            'hint:Query hint:optimizer "None". ' + // disable optimizer (makes query faster)
            '{SELECT ?item WHERE { ' +
            makeSubquery(query, 0) + // results 1-50
            makeSubquery(query, 50) + // results 51-100
            'FILTER NOT EXISTS { ' +
            '?item wdt:P569 ?birth. hint:Prior hint:rangeSafe true. ' +
            'FILTER (?birth > "1400-01-01"^^xsd:dateTime) ' +
            '} ' +
            '?item wdt:P31 wd:Q5. ' +
            //'?item wdt:P106/wdt:P279* wd:Q2500638. ' +
            //'hint:Prior hint:gearing "forward". ' +
            '} LIMIT 50}' +
            'SERVICE wikibase:label {' +
                    'bd:serviceParam wikibase:language "it,en" . ' +
            '}' +
            '}'
    }

    // SPARQL query for characters
    function makeCharacterQuery(query) {
            return 'SELECT DISTINCT (?item as ?value) ?itemLabel ?itemAltLabel WHERE { ' +
            'hint:Query hint:optimizer "None". ' + // disable optimizer (makes query faster)
            '{SELECT ?item WHERE { ' +
            makeSubquery(query, 0) + // results 1-50
            makeSubquery(query, 50) + // results 51-100
            '?item wdt:P31/wdt:P279* wd:Q95074. ' +
            'hint:Prior hint:gearing "forward". ' +
            '} LIMIT 50}' +
            'SERVICE wikibase:label {' +
                    'bd:serviceParam wikibase:language "it,en" . ' +
            '}' +
            '}'
    }

    // SPARQL query for places
    function makePlaceQuery(query) {
            return 'SELECT DISTINCT (?item as ?value) ?itemLabel ?itemAltLabel WHERE { ' +
            'hint:Query hint:optimizer "None". ' + // disable optimizer (makes query faster)
            '{SELECT ?item WHERE { ' +
            makeSubquery(query, 0) + // results 1-50
            makeSubquery(query, 50) + // results 51-100
            '?item wdt:P31/wdt:P279* wd:Q27096213. ' +
            'hint:Prior hint:gearing "forward". ' +
            '} LIMIT 50}' +
            'SERVICE wikibase:label {' +
                    'bd:serviceParam wikibase:language "it,en" . ' +
            '}' +
            '}'
    }

    // Process results retrieved from Wikidata
    function processWikidataResults(data, type) {
            let tempArray = [];
            let finalArray = [];
            for (var i = data.results.bindings.length, a = 0; a < i; a++) {
                    for (var n = {}, j = 0; j < data.head.vars.length; j++) {
                            if (data.head.vars[j] in data.results.bindings[a]) {
                                    n[data.head.vars[j]] = data.results.bindings[a][data.head.vars[j]];
                            } else {
                                    n[data.head.vars[j]] = void 0;
                            }
                    }
                    tempArray.push(n);
            }

            // Function for sorting
            function compare(a, b) {
                if (!a.id || !b.id) return 0;
                let aid = parseInt(a.id.split('Q')[1]);
                let bid = parseInt(b.id.split('Q')[1]);
                if (aid < bid) {
                    return -1;
                }
                if (aid > bid) {
                    return 1;
                }
                return 0;
            }

            // Check that item label is not a Wikidata ID
            var regex = /^Q[0-9]+$/;
            for (n of tempArray) {
                let newObject = {};
                if (n['itemLabel'] && !regex.test(n['itemLabel'].value)) {
                        for (var key in n) {
                                // Change string that is shown in autocomplete
                                if (key === 'itemLabel') {
                                        newObject.itemLabel = (n[key] || {}).value;
                                        newKey = 'text';
                                        newObject[newKey] = (n[key] || {}).value;
                                        // For sources, add name of the author
                                        if (type === 'source') {
                                                if (n['authorLabel']) {
                                                        newObject[newKey] = newObject[newKey] + ', ' + n['authorLabel'].value;
                                                } else {
                                                        newObject[newKey] = newObject[newKey] + ', ' + 'autore non disponibile';
                                                }
                                        }
                                        // If there are aliases, show them
                                        if (n['itemAltLabel']) {
                                                newObject[newKey] += ' <i>(' + n['itemAltLabel'].value + ')</i>';
                                        }
                                } else if (key === 'value') {
                                        // Add missing fields needed by autocomplete
                                        newObject.id = (n[key] || {}).value;
                                        newObject.iri = (n[key] || {}).value;
                                } else {
                                        // Keep all remaining fields of result
                                        newKey = key;
                                        newObject[newKey] = (n[key] || {}).value;
                                }
                        }
                }
                finalArray.push(newObject);
            }
            finalArray.sort(compare);
            return finalArray;
    }

    // Add Wikidata autocomplete for sources and authors
    function runWikidataQuery(queryType, userInput, callback) {
            let query = '';

            if (queryType === 'source') {
                    query = makeSourceQuery(userInput);
            }
            else if (queryType === 'author') {
                    query = makeAuthorQuery(userInput);
            }
            else if (queryType === 'character') {
                    query = makeCharacterQuery(userInput);
            }
            else if (queryType === 'place') {
                    query = makePlaceQuery(userInput);
            }

            // let t0 = performance.now(); // for query time measurement

            $.ajax(
                    WD_URL,
                    {
                            headers: { Accept: 'application/sparql-results+json' },
                            data: { query: query }
                    }
            )
            .done(function(res) {
                    //console.log(performance.now() - t0); // milliseconds
                    let results = processWikidataResults(res, queryType);
                    callback(results);
            });
    }

    // Add Wikidata autocomplete for sources
    $('#add-source-wd').autoComplete({
            minLength: 3,
            preventEnter: true,
            resolver: 'custom',
            events: {
                    search: function (userInput, callback) {
                            // If there is a new query, cancel the previous one
                            if (this.timeoutID) {
                                    window.clearTimeout(this.timeoutID);
                            }
                            // Run Wikidata query
                            this.timeoutID = setTimeout(
                                    function() {runWikidataQuery('source', userInput, callback)}, 200
                            );
                    }
            }
    });

    // Add Wikidata autocomplete for authors
    $('#add-author-wd').autoComplete({
            minLength: 3,
            preventEnter: true,
            resolver: 'custom',
            events: {
                    search: function (userInput, callback) {
                            // If there is a new query, cancel the previous one
                            if (this.timeoutID) {
                                    window.clearTimeout(this.timeoutID);
                            }
                            // Run Wikidata query
                            this.timeoutID = setTimeout(
                                    function() {runWikidataQuery('author', userInput, callback)}, 200
                            );
                    }
            }
    });

    // Add Wikidata autocomplete for characters
    $('#add-character-wd').autoComplete({
            minLength: 3,
            preventEnter: true,
            resolver: 'custom',
            events: {
                    search: function (userInput, callback) {
                            // If there is a new query, cancel the previous one
                            if (this.timeoutID) {
                                    window.clearTimeout(this.timeoutID);
                            }
                            // Run Wikidata query
                            this.timeoutID = setTimeout(
                                    function() {runWikidataQuery('character', userInput, callback)}, 200
                            );
                    }
            }
    });

    // Add Wikidata autocomplete for places
    $('#add-place-wd').autoComplete({
            minLength: 3,
            preventEnter: true,
            resolver: 'custom',
            events: {
                    search: function (userInput, callback) {
                            // If there is a new query, cancel the previous one
                            if (this.timeoutID) {
                                    window.clearTimeout(this.timeoutID);
                            }
                            // Run Wikidata query
                            this.timeoutID = setTimeout(
                                    function() {runWikidataQuery('place', userInput, callback)}, 200
                            );
                    }
            }
    });

    // Initialize popovers
    $('[data-toggle="popover"]').popover({html: true, trigger: 'focus'});

    // Prevent autocomplete from adding garbage to URL
    $('.container').on('click', '.dropdown-item', function (e) {
            e.preventDefault();
            e.stopPropagation();
            return true;
    });

    // Remember initial popover title
    $('.autocomplete').each(function(i) {
            $(this).attr('data-default-title', $(this).attr('data-original-title'));
    });

    // On autocomplete keydown, reset IRI field and popover
    $('body').on('keydown', '.autocomplete', function(e) {
            let target = $(e.target);
            let iriField = $('#' + target.attr('id') + '_iri');

            // If IRI field is not empty, reset everything
            if (iriField.val() !== '') {
                    iriField.val('');
                    target.popover('hide');
                    resetPopovers('#' + target.attr('id'));
                    target.focus();
            }
    });

    // On autocomplete focus, show the list if IRI field is empty
    $('body').on('focus', '.autocomplete', function(e) {
            let target = $(e.target);
            if ($('#' + target.attr('id') + '_iri').val() === '') {
                    target.autoComplete('show');
            }
            // Add reference to element inside its popover
            if ($(e.target).data("bs.popover")) {
                $($(e.target).data("bs.popover").tip).attr('from', e.target.id);
            }
    });

    // Allow click on popover content
    $('body').on('mousedown', '.popover', function(e) {
            e.preventDefault();
    });

    // Show modal when clicking on button to add new source
    $('body').on('click', '.add-source-btn', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('.autocomplete').autoComplete('hide');
            $('#add-source-modal').show();
    });

    // Show modal when clicking on button to add new author
    $('body').on('click', '.add-author-btn', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('.autocomplete').autoComplete('hide');
            $('#add-author-modal').show();
    });

    // Show modal when clicking on button to add new author
    $('body').on('click', '.add-character-btn', function(e, b) {
            e.preventDefault();
            e.stopPropagation();
            $('.autocomplete').autoComplete('hide');
            $('#add-character-modal').attr('target',
                $(e.target.parentElement.parentElement).attr('from'));
            $('#add-character-modal').show();
    });

    // Show modal when clicking on button to add new author
    $('body').on('click', '.add-place-btn', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('.autocomplete').autoComplete('hide');
            $('#add-place-modal').attr('target',
                $(e.target.parentElement.parentElement).attr('from'));
            $('#add-place-modal').show();
    });

    // Function to empty modal fields
    function emptyModalFields() {
        $('.add-modal').attr('target', '');
        $('.add-modal input').val('').blur();
    }

    // Function to fill author field
    function fillAuthorField(context) {
            $('#id_cited_author').val(context.name);
            $('#id_cited_author_iri').val(context.iri);
            context.preventFocus = true;
            $('#id_cited_author').trigger('autocomplete.select', context);
            emptyModalFields();
    }

    // Function to fill source field
    function fillSourceField(context) {
            $('#id_cited_source').val(context.name);
            $('#id_cited_source_iri').val(context.iri);
            context.preventFocus = true;
            $('#id_cited_source').trigger('autocomplete.select', context);
            emptyModalFields();
    }

    // Function to fill author field
    function fillCharacterField(context, target) {
            //console.log(target);
            $('#'+target).val(context.name);
            $('#'+target + '_iri').val(context.iri);
            context.preventFocus = true;
            $('#'+target).trigger('autocomplete.select', context);
            emptyModalFields();
    }

    // Function to fill author field
    function fillPlaceField(context, target) {
            //console.log(target);
            $('#'+target).val(context.name);
            $('#'+target + '_iri').val(context.iri);
            context.preventFocus = true;
            $('#'+target).trigger('autocomplete.select', context);
            emptyModalFields();            
    }

    // On autocomplete blur, empty the field if nothing has been selected
    $('body').on('blur', '.autocomplete', function(e) {
            let target = $(e.target);
            if ($('#' + target.attr('id') + '_iri').val() === '') {
                    target.val('');
            }
    });

    // On autocomplete select, set popover content
    $('body').on('autocomplete.select', '.autocomplete', function(e, item) {
            // Target element
            let target = $(e.target);

            // Set popover content
            target.attr('data-original-title', item.text);
            target.attr('data-content', '<a target=_blank href='+item.id+'>'+item.id+'</a>');

            // Set value of hidden field
            $('#' + target.attr('id') + '_iri').val(item.id);

            // Set author when source is selected
            if (target.attr('id') === 'id_cited_source') {
                    let url = '../../entity?iri=' + item.author;
                    fetch(url)
                    .then((response) => {
                            return response.json();
                    })
                    .then((context) => {
                            fillAuthorField(context);
                    })
                    .catch((error) => {
                            console.error('Error loading sources:', error);
                    });
            }

            // Make sure that author and source match
            else if (target.attr('id') === 'id_cited_author') {
                    let url = '../../entity?iri=' + $('#id_cited_source_iri').val();
                    fetch(url)
                    .then((response) => {
                            return response.json();
                    })
                    .then((context) => {
                            if (context.author !== $('#id_cited_author_iri').val()) {
                                    $('#id_cited_source').val('');
                                    $('#id_cited_source_iri').val('');
                                    resetPopovers('#id_cited_source');
                            }
                    })
                    .catch((error) => {
                            console.error('Error loading authors:', error);
                    });
            }

            // Modal fields for Wikidata search
            else if ($(this).attr('id').startsWith('add')) {
                    $(this).val(item.itemLabel);
            }

            // If preventFocus is false, focus the element
            if (!item.preventFocus) {
                    target.focus();
            }
    });

    // On author button click, run Wikidata query
    $('#author-btn').on('click', function(e) {
            $('.add-modal').hide();
            let iri = $('#add-author-wd_iri').val();
            if (iri) {
                    let url = '../../import-author?iri=' + iri;
                    fetch(url)
                    .then((response) => {
                            return response.json();
                    })
                    .then((context) => {
                            fillAuthorField(context);
                    })
                    .catch((error) => {
                            console.error('Error loading author from Wikidata:', error);
                    });
            } else {
                    let author_name = $('#add-author-name').val();
                    if (author_name) {
                            let author_desc = $('#add-author-desc').val();
                            let url = '../../add-author?name=' + author_name + '&desc=' + author_desc;
                            fetch(url)
                            .then((response) => {
                                    return response.json();
                            })
                            .then((context) => {
                                    fillAuthorField(context);
                            })
                            .catch((error) => {
                                    console.error('Error adding user-defined author', error);
                            });
                    }
            }
    });

    // On source button click, run Wikidata query
    $('#source-btn').on('click', function(e) {
            $('.add-modal').hide();
            let iri = $('#add-source-wd_iri').val();
            if (iri) {
                    let url = '../../import-source?iri=' + iri;
                    fetch(url)
                    .then((response) => {
                            return response.json();
                    })
                    .then((context) => {
                            fillSourceField(context);
                    })
                    .catch((error) => {
                            console.error('Error loading source from Wikidata:', error);
                    });
            } else {
                    let source_title = $('#add-source-title').val();
                    if (source_title) {
                            let source_desc = $('#add-source-desc').val();
                            let url = '../../add-source?title=' + source_title + '&desc=' + source_desc;
                            fetch(url)
                            .then((response) => {
                                    return response.json();
                            })
                            .then((context) => {
                                    fillSourceField(context);
                            })
                            .catch((error) => {
                                    console.error('Error adding user-defined source', error);
                            });
                    }
            }
    });

    // On character button click, run Wikidata query
    $('#character-btn').on('click', function(e) {
            $('.add-modal').hide();
            let iri = $('#add-character-wd_iri').val();
            if (iri) {
                    let url = '../../import-character?iri=' + iri;
                    fetch(url)
                    .then((response) => {
                            return response.json();
                    })
                    .then((context) => {
                            fillCharacterField(context, $(this).parents('.add-modal').attr('target'));
                    })
                    .catch((error) => {
                            console.error('Error loading character from Wikidata:', error);
                    });
            } else {
                    let char_name = $('#add-character-name').val();
                    if (char_name) {
                            let char_desc = $('#add-character-desc').val();
                            let url = '../../add-character?name=' + char_name + '&desc=' + char_desc;
                            fetch(url)
                            .then((response) => {
                                    return response.json();
                            })
                            .then((context) => {
                                    fillCharacterField(context, $(this).parents('.add-modal').attr('target'));
                            })
                            .catch((error) => {
                                    console.error('Error adding user-defined character', error);
                            });
                    }
            }
    });

    // On place button click, run Wikidata query
    $('#place-btn').on('click', function(e) {
		$('.add-modal').hide();
		let iri = $('#add-place-wd_iri').val();
		if (iri) {
				let url = '../../import-place?iri=' + iri;
				fetch(url)
				.then((response) => {
						return response.json();
				})
				.then((context) => {
						fillPlaceField(context, $(this).parents('.add-modal').attr('target'));
				})
				.catch((error) => {
						console.error('Error loading place from Wikidata:', error);
				});
		} else {
				let place_name = $('#add-place-name').val();
				if (place_name) {
						let place_desc = $('#add-place-desc').val();
						let url = '../../add-place?name=' + place_name + '&desc=' + place_desc;
						fetch(url)
						.then((response) => {
								return response.json();
						})
						.then((context) => {
								fillPlaceField(context, $(this).parents('.add-modal').attr('target'));
						})
						.catch((error) => {
								console.error('Error adding user-defined place', error);
						});
				}
		}
    });

  // Fetch save text dante
  function saveDanteText(text) {

	var pathArray = window.location.pathname.split('/');
	// console.log(pathArray[2]);
	id =  pathArray[4];
	// let url = '../../saveDanteText/' + id + '?text=' + text;
	let url = '../../saveDanteText/' + id;
	let result = '';

	// Get Django CSRF token
	let csrf = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
	console.log(csrf);

	// Set request headers
	let headers = new Headers();
	headers.append('X-CSRFToken', csrf);
	headers.append('X-Requested-With', 'XMLHttpRequest');
	
	// return fetch(url)
	return fetch(url,
		{
			method: 'POST',
			body: JSON.stringify(text),
			headers: headers,
			mode: 'cors'
		})
	.then((response) => {
		return response.json();
	})
	.then((context) => {
		
		data = context.data;
		//Update json field
		jsonField.textContent = context.json;
		danteText = document.getElementById("dante-text");
		
		danteText.textContent = data["Nota"]["FrammentoDante"];
		console.log(danteText.innerHTML);
	})
	.catch((error) => {
		console.error(error);
		return {};
	});
}

// Fetch save bodyNote
function saveBodyNote(text) {

	var pathArray = window.location.pathname.split('/');
	// console.log(pathArray[2]);
	id =  pathArray[4];
	let url = '../../saveBodyNote/' + id + '?text=' + text;
	let result = '';
	return fetch(url)
	.then((response) => {
		return response.json();
	})
	.then((context) => {
		
		data = context.data;
		//Update json field
		jsonField.textContent = context.json;
		bodyNote = document.getElementById("body-nota-text");
		bodyNote.innerHTML = data["Nota"]["BodyNota"];
	})
	.catch((error) => {
		console.error(error);
		return {};
	});
}

// document.addEventListener('paste', function(e) {
// 	e.preventDefault();
	
// 	var pastedText = ''

// 	if (window.clipboardData && window.clipboardData.getData) { // IE

// 		pastedText = window.clipboardData.getData('Text');
// 		console.log(window.clipboardData);

// 	} else if (e.clipboardData && e.clipboardData.getData) {

// 		pastedText = e.clipboardData.getData('text/html');
// 		console.log(e.clipboardData);

// 	}
// 	$("#id_text_fragment").text(pastedText);
// 	// document.getElementById('id_text_fragment').textContent = pastedText
// });


/*
	Tree view
*/


// Fetch tree from Structure 
function treeFromStructure(caret_id, parent, loadPage = false) {
	let url = '../../tree/'+pathArray[4]+'/'+caret_id;
	console.log("url: " + url);
	let result = '';
	return fetch(url)
	.then((response) => {
		return response.json();
	})
	.then((context) => {
		try {
			parent.querySelector(".nested").textContent = '';
			context.forEach(obj => {
				commentary = pathArray[3];
				id = obj["id"];
				data_tree = obj["data"];
				stato = data_tree["Stato"];
				nota = data_tree["Nota"];
				frammento_dante = nota["FrammentoDante"];
				frammento_dante_ddp = nota["FrammentoDanteDDP"];
				opera_dante = nota["OperaDante"];
				cantica = opera_dante["Cantica"];
				canto = opera_dante["Canto"];
				verso = opera_dante["Verso"];
				if(frammento_dante==""){
					frammento = frammento_dante_ddp;
				} else {
					frammento = frammento_dante;
				}
				liNota = createNodeNote(id, commentary, stato, frammento, verso, pathArray[4]);
				parent.querySelector(".nested").appendChild(liNota);

			});
			if (context.length === 0){
				var liNota = document.createElement("li");
				liNota.textContent = "Nessuna nota";
				parent.querySelector(".nested").appendChild(liNota);
			}

			if(loadPage){
				document.getElementById("current-note").scrollIntoView();
			}
		} catch (error) {
			// console.error(error);
			
			
		}
		// return context;
	})
	.catch((error) => {
		console.error(error);
		return {};
	});
}



var toggler = document.getElementsByClassName("caret");
var i;

for (i = 0; i < toggler.length; i++) {
  toggler[i].addEventListener("click", function() {
    this.parentElement.querySelector(".nested").classList.toggle("active");
	this.classList.toggle("caret-down");
	if(getCookie(this.id) == "opened"){
		setCookie(this.id, "closed", 1);
		console.log("CHIUSO");
	}else{
		setCookie(this.id, "opened", 1);
		console.log("APERTO");
	};
	if(this.id!=""){
		console.log(this.id);
		console.log(this.classList.length);
		caret_id = this.id;
		console.log(this);
		if(caret_id != "Inferno" && caret_id != "Purgatorio" && caret_id != "Paradiso"){
			treeFromStructure(caret_id, this.parentElement);

		}
		// this.parentElement.querySelector(".nested").classList.toggle("active");
	}
	// if(this.id!="" && this.classList.length==1){
	// 	this.parentElement.querySelector(".nested").classList.toggle("active");
	// }
	// Save the state of the sidebar as "open"
	
	
  });
}

if (typeof(Storage) !== "undefined") {
	var cantiche = ["Inferno", "Purgatorio", "Paradiso"];
	cantiche.forEach( function(idCantica){
		cantica = document.getElementById(idCantica);
		if(getCookie(idCantica) == "opened"){
			if(cantica){
				cantica.parentElement.querySelector(".nested").classList.toggle("active");
				cantica.classList.toggle("caret-down");
			}
		}
		if(cantica){
			if(idCantica=="Inferno"){
				for(var i = 1; i<=34; i++){
					i_2 = i > 9 ? "" + i: "0" + i;
					idCanto = idCantica + "-" + i_2;
					if(getCookie(idCanto) == "opened"){
						elementcanto = document.getElementById(idCanto);
						if(idCanto != "Inferno" && idCanto != "Purgatorio" && idCanto != "Paradiso"){
							treeFromStructure(idCanto, elementcanto.parentElement, loadPage=true);

						}
						canto = document.getElementById(idCanto);
						canto.parentElement.querySelector(".nested").classList.toggle("active");
						canto.classList.toggle("caret-down");
					}
				}
			}else{
				for(var i = 1; i<=33; i++){
					i_2 = i > 9 ? "" + i: "0" + i;
					idCanto = idCantica + "-" + i_2;
					if(getCookie(idCanto) == "opened"){
						elementcanto = document.getElementById(idCanto);
						if(idCanto != "Inferno" && idCanto != "Purgatorio" && idCanto != "Paradiso"){
							treeFromStructure(idCanto, elementcanto.parentElement, loadPage=true);
						
						}
						canto = document.getElementById(idCanto);
						canto.parentElement.querySelector(".nested").classList.toggle("active");
						canto.classList.toggle("caret-down");

					}
				}
			}
		}
	});
};

var done = document.getElementById("done");
var doing = document.getElementById("doing");
var toDo = document.getElementById("to-do");

done.addEventListener("click", function() {
	this.classList.add("active");
	doing.classList.remove("active");
	toDo.classList.remove("active");
	changeState("done");
  });

  doing.addEventListener("click", function() {
    this.classList.add("active");
	done.classList.remove("active");
	toDo.classList.remove("active");
	changeState("doing");
  });

  toDo.addEventListener("click", function() {
    this.classList.add("active");
	doing.classList.remove("active");
	done.classList.remove("active");
	changeState("to-do");
  });

  // Fetch change state
function changeState(state) {

	var pathArray = window.location.pathname.split('/');
	// console.log(pathArray[2]);
	id =  pathArray[4];
	let url = '../../state/' + id + '?state=' + state;
	let result = '';
	return fetch(url)
	.then((response) => {
		return response.json();
	})
	.then((context) => {
		
		data = context.data;
		//Update json field
		jsonField.textContent = context.json;
		idNota = "note-" + id;
		console.log(idNota);
		nota = document.getElementById(idNota);
		if(nota){
			nota.firstElementChild.className = data['Stato'];
		}

	})
	.catch((error) => {
		console.error(error);
		return {};
	});
}
sidebar = document.getElementById("mySidebar");
main = document.getElementById("main");



sidebarBtn = document.getElementById("sidebar-btn");

	sidebarBtn.addEventListener("click", function() {
		
		if (sidebar.style.width === "0px" || sidebar.style.width === '') {
			sidebar.style.width = "20%";
			main.style.marginLeft = "20%";
			sidebar.style.paddingLeft = "2%";
			if (typeof(Storage) !== "undefined") {
				// Save the state of the sidebar as "open"
				setCookie("sidebar", "opened", 1);
			}
		} else {
			sidebar.style.width = "0";
			main.style.marginLeft = "0";
			// sidebar.style.overflowY = "hidden";
			sidebar.style.paddingLeft = "0";
			if (typeof(Storage) !== "undefined") {
				// Save the state of the sidebar as "open"
				setCookie("sidebar", "closed", 1);
			}
		}
	});


	if (typeof(Storage) !== "undefined") {
		// If we need to open the bar
		if(getCookie("sidebar") == "opened"){
			// Open the bar
			sidebar.style.width = "20%";
			main.style.marginLeft = "20%";
			sidebar.style.paddingLeft = "2%";
		}
	}

	// evidenzia frammento nel testo della nota
	// testiNota = document.getElementById("testi-nota");
	// testiChildren = testiNota.children;
	// var testo = testiChildren[5].textContent;

	var citPanel = document.getElementsByClassName("cit-panel");
	for (var i = 0; i < citPanel.length; i++) {
		let childPanel = citPanel[i].firstElementChild.children;
		var textMatch = childPanel[1].textContent;
		// testo = highlightText(textMatch, testo);
		// testiChildren[5].innerHTML = testo;	
	}


});

// function highlightText(textMatch, testo) {
// 	textMatch = textMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// 	var reg = new RegExp(textMatch, 'gi');
// 	// var finalText = testo.replace(reg, function(str) {return '<strong>'+str+'</strong>'});
// 	var finalText = testo.replace(reg, function(str) {return "<span style='background-color: yellow;'>"+str+"</span>"});
// 	return finalText;

// }

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";;SameSite=None; Secure;" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function deleteCookies() { 
	var res = document.cookie;
	var multiple = res.split(";");
	for(var i = 0; i < multiple.length; i++) {
		var key = multiple[i].split("=");
		// console.log(key[0]);
		if(key[0]!="csrftoken"){
			if(key[0]!="gcube-token"){
				if(key[0]!="sessionid"){
					setCookie(key[0], "closed", 1)
				}
			}
		}
	}

} 


/*
	Questa funzione va chiamata tutte le volte che si vuole salvare.
	In questo modo è possibile salvare in qualunque momento, non
	soltanto quando lo decide l'utente
*/
function saveToDB() {

	// Select the form
	let form = document.getElementById('form');

	// Dispatch submit event on the form
	form.dispatchEvent(new Event('submit', { 'bubbles': true }));
}

function autocompleteFail(event) {
	console.log(event);
}

function enableAutocomplete(context) {
	$('input[name^=form-],input[name^=character_set-],input[name^=topography_set-],input[name^=reference_commentator_set-]', context || null)
	.autoComplete({
		resolverSettings: {
			url: $(this).attr('data-url'),
			fail: autocompleteFail
		},
		minLength: 0,
		preventEnter: true}
	)
	.popover({html: true, trigger: 'focus'})
	.each(function() {
		$(this).attr('data-default-title', $(this).attr('data-original-title'));
	});
}


$('#link-formset-id_character').formset({
	addText: '<i class="fas fa-plus"></i>',
	deleteText: '<i class="fas fa-minus"></i>',
	addCssClass: 'add-row btn btn-success',
	// deleteCssClass: 'delete-row',
	prefix: 'character_set',
	added: function(row) {
		enableAutocomplete(row);
		$( ".delete-row" ).addClass( "btn btn-danger btn-sm" );

	},
});


$('#link-formset-id_episode').formset({
	addText: '<i class="fas fa-plus"></i>',
	deleteText: '<i class="fas fa-minus"></i>',
	addCssClass: 'add-row btn btn-success',
	// deleteCssClass: 'delete-row btn btn-sm btn-danger',
	prefix: 'episode_set',
	added: function(row) {
		$( ".delete-row" ).addClass( "btn btn-danger btn-sm" );
	}
});

$('#link-formset-id_theme').formset({
	addText: '<i class="fas fa-plus"></i>',
	deleteText: '<i class="fas fa-minus"></i>',
	addCssClass: 'add-row btn btn-success',
	// deleteCssClass: 'delete-row btn btn-sm btn-danger',
	prefix: 'theme_set',
	added: function(row) {
		$( ".delete-row" ).addClass( "btn btn-danger btn-sm" );
	}
});

$('#link-formset-id_image').formset({
	addText: '<i class="fas fa-plus"></i>',
	deleteText: '<i class="fas fa-minus"></i>',
	addCssClass: 'add-row btn btn-success',
	// deleteCssClass: 'delete-row btn btn-sm btn-danger',
	prefix: 'image_set',
	added: function(row) {
		$( ".delete-row" ).addClass( "btn btn-danger btn-sm" );
	}
});

$('#link-formset-id_stylistic_feature').formset({
	addText: '<i class="fas fa-plus"></i>',
	deleteText: '<i class="fas fa-minus"></i>',
	addCssClass: 'add-row btn btn-success',
	// deleteCssClass: 'delete-row btn btn-sm btn-danger',
	prefix: 'stylistic_feature_set',
	added: function(row) {
		$( ".delete-row" ).addClass( "btn btn-danger btn-sm" );
	}
});

$('#link-formset-id_topography').formset({
	addText: '<i class="fas fa-plus"></i>',
	deleteText: '<i class="fas fa-minus"></i>',
	addCssClass: 'add-row btn btn-success',
	// deleteCssClass: 'delete-row btn btn-sm btn-danger',
	prefix: 'topography_set',
	added: function(row) {
		enableAutocomplete(row);
		$( ".delete-row" ).addClass( "btn btn-danger btn-sm" );
	}
});

$('#link-formset-id_theory').formset({
	addText: '<i class="fas fa-plus"></i>',
	deleteText: '<i class="fas fa-minus"></i>',
	addCssClass: 'add-row btn btn-success',
	// deleteCssClass: 'delete-row btn btn-sm btn-danger',
	prefix: 'theory_set',
	added: function(row) {
		$( ".delete-row" ).addClass( "btn btn-danger btn-sm" );
	}
});



$('#link-formset-id_reference_commentator').formset({
	addText: '<i class="fas fa-plus"></i>',
	deleteText: '<i class="fas fa-minus"></i>',
	addCssClass: 'add-row btn btn-success',
	// deleteCssClass: 'delete-row btn btn-sm btn-danger',
	prefix: 'reference_commentator_set',
	added: function(row) {
		enableAutocomplete(row);
		$( ".delete-row" ).addClass( "btn btn-danger btn-sm" );
	}
});



enableAutocomplete();


function createNodeNote(id, commentary, stato, frammento, verso, current_id){
	console.log("--- CREAZIONE NOTA");
	// console.log("Saved_canto - " + saved_canto );
	// console.log("Canto - " + canto );
	var liNota = document.createElement("li");
	// console.log(id);
	liNota.id = "note-" + id;
	var aNota = document.createElement("a");
	aNota.href = "../../" + commentary + "/" + id + "/";
	var statoNota = stato;
	aNota.className = statoNota;
	if(frammento==""){
		frammento="frammento assente"
	}
	var textNota = document.createTextNode(verso + " - " + frammento);
	if(current_id==id){
		boldNota = document.createElement("strong");
		boldNota.id = "current-note";
		boldNota.appendChild(textNota);
		aNota.appendChild(boldNota);
		
	} else {
		aNota.appendChild(textNota);
	}
	liNota.appendChild(aNota);
	return liNota;
	// ulNota.appendChild(liNota);
}

// Fetch data from IRIs
function noteFromIRI(iri, node) {
	let url = '../../entity?iri=' + iri;
	let result = '';
	return fetch(url)
	.then((response) => {
		return response.json();
	})
	.then((context) => {
		node.value = context.text;
		context.preventFocus = true;
		$('#'+ node.id).trigger('autocomplete.select', context);
		// return context;
	})
	.catch((error) => {
		console.error('Error loading IRI:', error);
		// return {};
	});
}


// Fetch data from IRIs
function dataFromIRI(iri) {
	let url = '../../entity?iri=' + iri;
	let result = '';
	return fetch(url)
	.then((response) => { 
		return response.json();
	})
	.then((context) => {
		return context;
	})
	.catch((error) => {
		console.error('Error loading IRI:', error);
		return {};
	});
}


updateElementIndex = function(elem, prefix, ndx) {
	// var idRegex = new RegExp('(' + prefix + '-\\d+-)|(^)'),
	//     replacement = prefix + '-' + ndx + '-';
	var idRegex = new RegExp('(' + prefix + '-\\d+-)'),
		replacement = prefix + '-' + ndx + '-';
	// console.log(idRegex);
	// console.log(elem, prefix, ndx);
	if (elem.attr("for")) elem.attr("for", elem.attr("for").replace(idRegex, replacement));
	if (elem.attr('id')) elem.attr('id', elem.attr('id').replace(idRegex, replacement));
	if (elem.attr('name')) elem.attr('name', elem.attr('name').replace(idRegex, replacement));
}

async function loadElementGroupFields(field, name, haveIri = false, isCommentary = false){
	console.log("Entrato nella funzione", field);
	id = "id_" + name;
	console.log("id", id);
	var checkbox = document.getElementById(id);
	checkbox.checked = true;
	idGroup = id + "-group";
	var elementGroup = document.getElementById(idGroup);
	elementGroup.style.display = "inline";
	if(isCommentary){
		field.forEach(function(elem, i){
			new_id_relationship = id + "_set-" + i + "-relationship_reference_commentator";
			// if(i==0){
			// 	document.getElementById(new_id_relationship).value = elem["Rapporto"];
			// 	new_id = id + "_set-" + i + "-commentator";
			// 	elemText = document.getElementById(new_id);
			// 	noteFromIRI(elem["Commento"], elemText);
			// 	new_id_iri = id + "_set-" + i + "-commentator_iri";
			// 	document.getElementById(new_id_iri).value = elem["Commento"];
			// } else{
				var addButton = elementGroup.getElementsByClassName("add-row");
				addButton[0].click();
				document.getElementById(new_id_relationship).value = elem["Rapporto"];
				new_id = id + "_set-" + i + "-commentator";
				elemText = document.getElementById(new_id);
				noteFromIRI(elem["Commento"], elemText);
				new_id_iri = id + "_set-" + i + "-commentator_iri";
				document.getElementById(new_id_iri).value = elem;
			// }
		});

	} else {
		if(haveIri){
			console.log("haveIri");
			field.forEach(function(elem, i){
				new_id_iri = id + "_set-" + i + "-quote_" + name + "_iri";
				// if(i==0){		
				// 	new_id = id + "_set-" + i + "-quote_" + name;
				// 	console.log(new_id);
				// 	elemText = document.getElementById(new_id);
				// 	noteFromIRI(elem, elemText);
				// 	document.getElementById(new_id_iri).value = elem;
				// } else{
					var addButton = elementGroup.getElementsByClassName("add-row");
					addButton[0].click();
					new_id = id + "_set-" + i + "-quote_" + name;
					console.log(new_id);
					elemText = document.getElementById(new_id);
					noteFromIRI(elem, elemText);
					document.getElementById(new_id_iri).value = elem;
				// }
			});

		} else {
			console.log("not Iri");
			field.forEach(function(elem, i){
				// if(i==0){
				// 	new_id = id + "_set-" + i + "-free_text";
				// 	document.getElementById(new_id).value = elem;
				// } else{
					var addButton = elementGroup.getElementsByClassName("add-row");
					addButton[0].click();
					new_id = id + "_set-" + i + "-free_text";
					document.getElementById(new_id).value = elem;
				// }
			});
		}
	}
}


function loadReferenceForEdit(button, data, formsets_id){
		button.addEventListener("click", function () {
			

			

			// // Prevent page reload
			// event.preventDefault();

			reference_id = this.id.split("-")[1];

			cit = data.Nota.Citazioni[reference_id];
			console.log(cit);

			// Fetch names from IRIs and put them in input fields
			if (cit.InfoCitazione.Fonte) {
				dataFromIRI(cit.InfoCitazione.Fonte).then((context) => {
					document.getElementById("id_cited_source").value = context.text;
					context.preventFocus = true;
					$('#id_cited_source').trigger('autocomplete.select', context);
				});
			}
			if (cit.InfoCitazione.Autore) {
				dataFromIRI(cit.InfoCitazione.Autore).then((context) => {
					document.getElementById("id_cited_author").value = context.text;
					context.preventFocus = true;
					$('#id_cited_author').trigger('autocomplete.select', context);
				});
			}
			if (cit.InfoCitazione.Area) {
				dataFromIRI(cit.InfoCitazione.Area).then((context) => {
					document.getElementById("id_theme_area").value = context.text;
					context.preventFocus = true;
					$('#id_theme_area').trigger('autocomplete.select', context);
				});
			}
			noteForm = document.getElementById("noteForm").parentElement.removeChild(document.getElementById("noteForm"));

			accordion_id = "panel-cit-" + reference_id;
			accordion = document.getElementById(accordion_id);

			referenceInformation = accordion.getElementsByClassName("referenceInformation")[0];
			referenceInformation.hidden = true;

			noteFormSpace = accordion.getElementsByClassName("noteFormSpace")[0];

			noteFormSpace.appendChild(noteForm);
			accordion.style.maxHeight = "2000px";

			noteForm.reset();
			hideFormsets(formsets_id);

			// console.log(document.getElementById("id_text_fragment"));
			if( typeof window.tinymce != 'undefined' && $(window.tinymce.editors).length > 0 ){
				$(window.tinymce.editors).each(function(idx) {
				  try {
				  tinymce.remove(idx);
				  } catch (e) {}
				});
			  }

			// tinymce.remove("id_text_fragment");
			tinymce.init({
				selector: '#id_text_fragment',
				menubar: false,
				fix_list_elements : true, 
				forced_root_block : false,
				valid_elements : 'i,b,strong,em,sup,pre',
				plugins: 'code',
				toolbar: 'bold italic code',
				content_style: '@import url(https://fonts.googleapis.com/css?family=Raleway:400,700); body { font-family: Code Bold, Raleway, Arial, Helvetica, sans-serif; font-size:1rem; } pre{font-family: "Code Bold", Raleway, Arial, Helvetica, sans-serif; font-size: 100%;}',
				setup: function (editor) {
					editor.on('change', function () {
						editor.save();
					});
				}
			  });
			tinymce.get("id_text_fragment").setContent(cit.FrammentoNota);
			// document.getElementById("id_text_fragment").value = cit.FrammentoNota;
			document.getElementById("id_reference_kind").value = cit.NaturaRiferimento;
			if(cit.NaturaRiferimento=="CITAZIONE"){	
				document.getElementById("citationForm").hidden = false; // show
				document.getElementById("referenceContentForm").hidden = false; // show
				document.getElementById("referenceForm").hidden = false; // show
				document.getElementById("id_citation_type").value = cit.TipoCitazione;
				// Characters
				if(cit.ContenutoCitazione.Personaggi){
					loadElementGroupFields(cit.ContenutoCitazione.Personaggi, "character", haveIri = true);
				}
				// Episode
				if(cit.ContenutoCitazione.Episodi){
					loadElementGroupFields(cit.ContenutoCitazione.Episodi, 'episode');
				}
				// Theme
				if(cit.ContenutoCitazione.Motivi){
					loadElementGroupFields(cit.ContenutoCitazione.Motivi, 'theme');
				}
				// Image
				if(cit.ContenutoCitazione.Immagini){
					loadElementGroupFields(cit.ContenutoCitazione.Immagini, 'image');
				}
				// Stylistic feature
				if(cit.ContenutoCitazione.Stilemi){
					loadElementGroupFields(cit.ContenutoCitazione.Stilemi, 'stylistic_feature');
				}
				// Topography
				if(cit.ContenutoCitazione.Topografie){
					loadElementGroupFields(cit.ContenutoCitazione.Topografie, 'topography',  haveIri = true);
				}
				// Theory
				if(cit.ContenutoCitazione.Teorie){
					loadElementGroupFields(cit.ContenutoCitazione.Teorie, 'theory');
				}

			}
			if(cit.NaturaRiferimento=="LOCI PARALLELI"){
				document.getElementById("citationForm").hidden = true; // hide
				document.getElementById("referenceContentForm").hidden = false; // show
				document.getElementById("referenceForm").hidden = false; // show
				// Characters
				if(cit.ContenutoCitazione.Personaggi){
					loadElementGroupFields(cit.ContenutoCitazione.Personaggi, "character", haveIri = true);
				}
				// Episode
				if(cit.ContenutoCitazione.Episodi){
					loadElementGroupFields(cit.ContenutoCitazione.Episodi, 'episode');
				}
				// Theme
				if(cit.ContenutoCitazione.Motivi){
					loadElementGroupFields(cit.ContenutoCitazione.Motivi, 'theme');
				}
				// Image
				if(cit.ContenutoCitazione.Immagini){
					loadElementGroupFields(cit.ContenutoCitazione.Immagini, 'image');
				}
				// Stylistic feature
				if(cit.ContenutoCitazione.Stilemi){
					loadElementGroupFields(cit.ContenutoCitazione.Stilemi, 'stylistic_feature');
				}
				// Topography
				if(cit.ContenutoCitazione.Topografie){
					loadElementGroupFields(cit.ContenutoCitazione.Topografie, 'topography',  haveIri = true);
				}
				// Theory
				if(cit.ContenutoCitazione.Teorie){
					loadElementGroupFields(cit.ContenutoCitazione.Teorie, 'theory');
				}
			}

			if(cit.NaturaRiferimento=="SUPPORTO ESTERNO"){
				document.getElementById("citationForm").hidden = true; // hide
				document.getElementById("referenceContentForm").hidden = true; // hide
				document.getElementById("referenceForm").hidden = false; // show
			}

			if(cit.RapportoSoggettoOggetto){
				document.getElementById("id_relationship_text_source").value = cit.RapportoSoggettoOggetto;
			}

			if(cit.RapportoCommentoCommentatore){
				console.log("ENTRATO");
				loadElementGroupFields(cit.RapportoCommentoCommentatore, 'reference_commentator', haveIri=false, isCommentary = true);
			}



			// console.log(document.getElementById("id_soggetto_citazione"));
			// console.log(document.getElementById("id_soggetto_citazione").value);
			// document.getElementById("id_soggetto_citazione").value = cit.SoggettoCitazione;
			// console.log(cit.SoggettoCitazione);
			// if (typeof cit.SoggettoCitazione === 'string' || cit.SoggettoCitazione instanceof String){}else{
			// cit.SoggettoCitazione.forEach(function(soggetto){
			// 	var checkbox = document.getElementById("id_soggetto_citazione").querySelector("input[value='"+soggetto+"']");
			// 	console.log(checkbox);
			// 	var id = checkbox.id;
			// 	console.log(id);
			// 	document.getElementById(id).checked = true;
			// 	console.log(document.getElementById(id));
			// 	// checkbox.checked = true;
			// });} 
			
			// console.log(document.getElementById("id_soggetto_citazione").value);
			tinymce.init({
				selector: '#id_source_text',
				menubar: false,
				fix_list_elements : true, 
				forced_root_block : false,
				valid_elements : 'br',
				plugins: 'code',
				toolbar: 'code',
				content_style: '@import url(https://fonts.googleapis.com/css?family=Raleway:400,700); body { font-family: Code Bold, Raleway, Arial, Helvetica, sans-serif; font-size:1rem; } pre{font-family: "Code Bold", Raleway, Arial, Helvetica, sans-serif; font-size: 100%;}',
				setup: function (editor) {
					editor.on('change', function () {
						editor.save();
					});
				}
			  });

			tinymce.get("id_source_text").setContent(cit.InfoCitazione.TestoFonte);
			
			
			document.getElementById("id_cited_source_iri").value = cit.InfoCitazione.Fonte;
			document.getElementById("id_cited_author_iri").value = cit.InfoCitazione.Autore;
			document.getElementById("id_theme_area_iri").value = cit.InfoCitazione.Area;
			// document.getElementById("id_source_text").value = cit.InfoCitazione.TestoFonte;
			document.getElementById("id_source_place").value = cit.InfoCitazione.LuogoFonte;
			document.getElementById("id_source_url").value = cit.InfoCitazione.UrlFonte;
			document.getElementById("id_free_note").value = cit.InfoCitazione.NotaFonte;


			document.getElementById("id_text_fragment").scrollIntoView();
			// document.getElementById("del-cit").id = "del-cit-" + id;
			document.getElementsByClassName("btn-save-cit")[0].id = "save-cit-" + reference_id; 
			document.getElementById("add-cit").hidden = true;
			document.getElementsByClassName("btn-save-cit")[0].style.display = "inline";
			
			
			/* 
			Event onclick button annulla on reference
			*/
			let newCitButton = document.getElementById("new-cit");

			newCitButton.style.display = "inline";


			newCitButton.addEventListener("click", function () {
				// // Prevent page reload
				// event.preventDefault();
				document.getElementById("noteForm").reset();
				// tinyMCE.activeEditor.setContent('');
				tinymce.get("id_text_fragment").setContent('');
				tinymce.get("id_source_text").setContent('');

				// hide formsets
				hideFormsets(formsets_id);

				noteForm = document.getElementById("noteForm").parentElement.removeChild(document.getElementById("noteForm"));

				noteFormContainer = document.getElementById("containerForm");

				noteFormContainer.appendChild(noteForm);

				referenceInformation.hidden = false;

				document.getElementById("citationForm").hidden = true; // hide
				document.getElementById("referenceContentForm").hidden = true; // hide
				document.getElementById("referenceForm").hidden = true; // hide

				// Make sure that IRI forms are empty
				document.getElementById("id_cited_source_iri").value = '';
				document.getElementById("id_cited_author_iri").value = '';
				document.getElementById("id_theme_area_iri").value = '';

				referenceInformation.parentElement.scrollIntoView();
				document.getElementById("add-cit").hidden = false;
				document.getElementById("add-cit").disabled = true;
				document.getElementsByClassName("btn-save-cit")[0].style.display = "none";
				document.getElementById("new-cit").style.display = "none";



				// Reset popovers
				resetPopovers();
			});



		});
}

function hideFormsets(formsets_id){
	formsets_id.forEach(function(id) {
		idGroup = id +"-group";
		var elementGroup = document.getElementById(idGroup);
		var deleteFormsetButtons = document.getElementsByClassName("delete-row");
		for (var i = 0; i < deleteFormsetButtons.length; i++) {
			deleteFormsetButtons[i].click();
		 }
		elementGroup.style.display = "none";

	});
}


function buildReference(dl, citazione){
	
	// citazione = data["Nota"]["Citazioni"][data["Nota"]["Citazioni"].length - 1];

	// Frammento Nota
	var dtFrammento = document.createElement("dt");
	dtFrammento.className = "col-sm-3";
	var textdtFrammento = document.createTextNode("Frammento nota");
	dtFrammento.appendChild(textdtFrammento);
	var ddFrammento = document.createElement("dd");
	ddFrammento.className = "col-sm-9 text-fragment";
	// var textddFrammento = document.createTextNode(citazione["FrammentoNota"]);
	// ddFrammento.append(textddFrammento);
	ddFrammento.innerHTML = citazione["FrammentoNota"];
	dl.appendChild(dtFrammento);
	dl.appendChild(ddFrammento);

	// Natura del riferimento
	var dtNatura = document.createElement("dt");
	dtNatura.className = "col-sm-3";
	var textdtNatura = document.createTextNode("Natura del riferimento");
	dtNatura.appendChild(textdtNatura);
	var ddNatura = document.createElement("dd");
	ddNatura.className = "col-sm-9 reference-kind";
	var textddNatura = document.createTextNode(citazione["NaturaRiferimento"]);
	ddNatura.appendChild(textddNatura);
	dl.appendChild(dtNatura);
	dl.appendChild(ddNatura);

	if(citazione["NaturaRiferimento"]=="CITAZIONE" || citazione["NaturaRiferimento"]=="LOCI PARALLELI"){
		
		var dtContenuto = document.createElement("dt");
		dtContenuto.className = "col-sm-3";
		var textdtContenuto = document.createTextNode("Contenuto della citazione");
		dtContenuto.appendChild(textdtContenuto);
		var ddContenuto = document.createElement("dd");
		ddContenuto.className = "col-sm-9";
		var dlContenuto = document.createElement("dl");
		dlContenuto.className = "row";
		
		// Personaggi
		var dtPersonaggi = document.createElement("dt");
		dtPersonaggi.className = "col-sm-3";
		var textdtPersonaggi = document.createTextNode("Personaggi");
		dtPersonaggi.appendChild(textdtPersonaggi);
		var ddPersonaggi = document.createElement("dd");
		ddPersonaggi.className = "col-sm-9 characters";
		personaggi = citazione["ContenutoCitazione"]["Personaggi"];
		if (personaggi != null) {	
			personaggi.forEach(function(personaggio) {
				var divPersonaggio = document.createElement("div");
				dataFromIRI(personaggio).then(result => divPersonaggio.textContent = result.text);
				ddPersonaggi.appendChild(divPersonaggio);
			});
			dlContenuto.appendChild(dtPersonaggi);
			dlContenuto.appendChild(ddPersonaggi);	
		}	
		
		// Episodi
		var dtEpisodi = document.createElement("dt");
		dtEpisodi.className = "col-sm-3 episodes";
		var textdtEpisodi = document.createTextNode("Episodi");
		dtEpisodi.appendChild(textdtEpisodi);
		var ddEpisodi = document.createElement("dd");
		ddEpisodi.className = "col-sm-9";
		episodi = citazione["ContenutoCitazione"]["Episodi"];
		if (episodi != null) {	
			episodi.forEach(function(episodio) {
				var divEpisodio = document.createElement("div");
				divEpisodio.textContent = episodio;
				ddEpisodi.appendChild(divEpisodio);
			});
			dlContenuto.appendChild(dtEpisodi);
			dlContenuto.appendChild(ddEpisodi);
		}

		// Motivi
		var dtMotivi = document.createElement("dt");
		dtMotivi.className = "col-sm-3";
		var textdtMotivi = document.createTextNode("Motivi");
		dtMotivi.appendChild(textdtMotivi);
		var ddMotivi = document.createElement("dd");
		ddMotivi.className = "col-sm-9 themes";
		motivi = citazione["ContenutoCitazione"]["Motivi"];
		if (motivi != null) {	
			motivi.forEach(function(motivo) {
				var divMotivo = document.createElement("div");
				divMotivo.textContent = motivo;
				ddMotivi.appendChild(divMotivo);
			});
			dlContenuto.appendChild(dtMotivi);
			dlContenuto.appendChild(ddMotivi);
		}

		// Immagini
		var dtImmagini = document.createElement("dt");
		dtImmagini.className = "col-sm-3";
		var textdtImmagini = document.createTextNode("Immagini");
		dtImmagini.appendChild(textdtImmagini);
		var ddImmagini = document.createElement("dd");
		ddImmagini.className = "col-sm-9 images";
		immagini = citazione["ContenutoCitazione"]["Immagini"];
		if (immagini != null) {	
			immagini.forEach(function(immagine) {
				var divImmagine = document.createElement("div");
				divImmagine.textContent = immagine;
				ddImmagini.appendChild(divImmagine);
			});
			dlContenuto.appendChild(dtImmagini);
			dlContenuto.appendChild(ddImmagini);
		}

		// Stilemi
		var dtStilemi = document.createElement("dt");
		dtStilemi.className = "col-sm-3";
		var textdtStilemi = document.createTextNode("Stilemi");
		dtStilemi.appendChild(textdtStilemi);
		var ddStilemi = document.createElement("dd");
		ddStilemi.className = "col-sm-9 stylistic-features";
		stilemi = citazione["ContenutoCitazione"]["Stilemi"];
		if (stilemi != null) {	
			stilemi.forEach(function(stilema) {
				var divStilema = document.createElement("div");
				divStilema.textContent = stilema;
				ddStilemi.appendChild(divStilema);
			});
			dlContenuto.appendChild(dtStilemi);
			dlContenuto.appendChild(ddStilemi);
		}

		// Topografie
		var dtTopografie = document.createElement("dt");
		dtTopografie.className = "col-sm-3";
		var textdtTopografie = document.createTextNode("Topografie");
		dtTopografie.appendChild(textdtTopografie);
		var ddTopografie = document.createElement("dd");
		ddTopografie.className = "col-sm-9 topographies";
		topografie = citazione["ContenutoCitazione"]["Topografie"];
		if (topografie != null) {	
			topografie.forEach(function(topografia) {
				var divTopografia = document.createElement("div");
				dataFromIRI(topografia).then(result => divTopografia.textContent = result.text);
				ddTopografie.appendChild(divTopografia);
			});
			dlContenuto.appendChild(dtTopografie);
			dlContenuto.appendChild(ddTopografie);
		}

		// Teorie
		var dtTeorie = document.createElement("dt");
		dtTeorie.className = "col-sm-3";
		var textdtTeorie = document.createTextNode("Teorie");
		dtTeorie.appendChild(textdtTeorie);
		var ddTeorie = document.createElement("dd");
		ddTeorie.className = "col-sm-9 theories";
		teorie = citazione["ContenutoCitazione"]["Teorie"];
		if (teorie != null) {	
			teorie.forEach(function(teoria) {
				var divTeoria = document.createElement("div");
				divTeoria.textContent = teoria;
				ddTeorie.appendChild(divTeoria);
			});
			dlContenuto.appendChild(dtTeorie);
			dlContenuto.appendChild(ddTeorie);
		}

		ddContenuto.appendChild(dlContenuto);
		dl.appendChild(dtContenuto);
		dl.appendChild(ddContenuto);	
		
	}

	if(citazione["NaturaRiferimento"]=="CITAZIONE"){
		// Tipo citazione (SOLO PER Citazione)
		var dtTipo = document.createElement("dt");
		dtTipo.className = "col-sm-3";
		var textdtTipo = document.createTextNode("Tipo citazione");
		dtTipo.appendChild(textdtTipo);
		var ddTipo = document.createElement("dd");
		ddTipo.className = "col-sm-9 citation-type";
		var textddTipo = document.createTextNode(citazione["TipoCitazione"]);
		ddTipo.appendChild(textddTipo);
		dl.appendChild(dtTipo);
		dl.appendChild(ddTipo);
	}

	// Rapporto testo fonte
	if(citazione["RapportoSoggettoOggetto"]){
		var dtTestoFonte = document.createElement("dt");
		dtTestoFonte.className = "col-sm-3";
		var textdtTestoFonte = document.createTextNode("Rapporto testo fonte");
		dtTestoFonte.appendChild(textdtTestoFonte);
		var ddTestoFonte = document.createElement("dd");
		ddTestoFonte.className = "col-sm-9 relationship-text-source";
		var textddTestoFonte = document.createTextNode(citazione["RapportoSoggettoOggetto"]);
		ddTestoFonte.appendChild(textddTestoFonte);
		dl.appendChild(dtTestoFonte);
		dl.appendChild(ddTestoFonte);
	}

	// Riferimenti ad altri commentatori
	if(citazione["RapportoCommentoCommentatore"]){
		var dtRapportoCommentatore = document.createElement("dt");
		dtRapportoCommentatore.className = "col-sm-3";
		var textdtRapportoCommentatore = document.createTextNode("Riferimenti ad altri commentatori");
		dtRapportoCommentatore.appendChild(textdtRapportoCommentatore);
		var ddRapportoCommentatore = document.createElement("dd");
		ddRapportoCommentatore.className = "col-sm-9 reference-commentator";
		rapportiCommentoCommentatore = citazione["RapportoCommentoCommentatore"];
		rapportiCommentoCommentatore.forEach(function(rapportoCommentoCommentatore) {
			var divRapportoCommentoCommentatore = document.createElement("div");
			divRapportoCommentoCommentatore.textContent = rapportoCommentoCommentatore["Rapporto"] + " ";
			var spanCommento = document.createElement("span");
			dataFromIRI(rapportoCommentoCommentatore["Commento"]).then(result => spanCommento.textContent = result.text);
			divRapportoCommentoCommentatore.appendChild(spanCommento);
			ddRapportoCommentatore.appendChild(divRapportoCommentoCommentatore);
		});
		dl.appendChild(dtRapportoCommentatore);
		dl.appendChild(ddRapportoCommentatore);
	}

	// Fonte citata
	if(citazione.InfoCitazione.Fonte){
		var dtFonte = document.createElement("dt");
		dtFonte.className = "col-sm-3";
		var textdtFonte = document.createTextNode("Fonte citata");
		dtFonte.appendChild(textdtFonte);
		var ddFonte = document.createElement("dd");
		ddFonte.className = "col-sm-9 cited-source";
		dl.appendChild(dtFonte);
		dl.appendChild(ddFonte);
		if (citazione.InfoCitazione.Fonte) {
			dataFromIRI(citazione.InfoCitazione.Fonte).then(result => ddFonte.textContent = result.text);
		}
	}
	

	// Autore citato
	if(citazione.InfoCitazione.Autore){
		var dtAutore = document.createElement("dt");
		dtAutore.className = "col-sm-3";
		var textdtAutore = document.createTextNode("Autore citato");
		dtAutore.appendChild(textdtAutore);
		var ddAutore = document.createElement("dd");
		ddAutore.className = "col-sm-9 cited-author";
		dl.appendChild(dtAutore);
		dl.appendChild(ddAutore);
		if (citazione.InfoCitazione.Autore) {
			dataFromIRI(citazione.InfoCitazione.Autore).then(result => ddAutore.textContent = result.text);
		}
	}

	// Area tematica
	if(citazione.InfoCitazione.Area){
		var dtArea = document.createElement("dt");
		dtArea.className = "col-sm-3";
		var textdtArea = document.createTextNode("Area tematica");
		dtArea.appendChild(textdtArea);
		var ddArea = document.createElement("dd");
		ddArea.className = "col-sm-9 theme-area";
		dl.appendChild(dtArea);
		dl.appendChild(ddArea);
		if (citazione.InfoCitazione.Area) {
			dataFromIRI(citazione.InfoCitazione.Area).then(result => ddArea.textContent = result.text);
		}
	}


	// Testo fonte
	if(citazione["InfoCitazione"]["TestoFonte"]){
		var dtTestoFonte = document.createElement("dt");
		dtTestoFonte.className = "col-sm-3";
		var textdtTestoFonte = document.createTextNode("Testo fonte");
		dtTestoFonte.appendChild(textdtTestoFonte);
		var ddTestoFonte = document.createElement("dd");
		ddTestoFonte.className = "col-sm-9 source-text";
		// var textddTestoFonte = document.createTextNode(citazione["InfoCitazione"]["TestoFonte"]);
		// ddTestoFonte.appendChild(textddTestoFonte);
		ddTestoFonte.innerHTML = citazione["InfoCitazione"]["TestoFonte"];
		dl.appendChild(dtTestoFonte);
		dl.appendChild(ddTestoFonte);
	}

	// Luogo fonte
	if(citazione["InfoCitazione"]["LuogoFonte"]){
		var dtLuogoFonte = document.createElement("dt");
		dtLuogoFonte.className = "col-sm-3";
		var textdtLuogoFonte = document.createTextNode("Luogo fonte");
		dtLuogoFonte.appendChild(textdtLuogoFonte);
		var ddLuogoFonte = document.createElement("dd");
		ddLuogoFonte.className = "col-sm-9 source-text";
		var textddLuogoFonte = document.createTextNode(citazione["InfoCitazione"]["LuogoFonte"]);
		ddLuogoFonte.appendChild(textddLuogoFonte);
		dl.appendChild(dtLuogoFonte);
		dl.appendChild(ddLuogoFonte);
	}

	// Url fonte
	if(citazione["InfoCitazione"]["UrlFonte"]){
		var dtUrlFonte = document.createElement("dt");
		dtUrlFonte.className = "col-sm-3";
		var textdtUrlFonte = document.createTextNode("Link fonte");
		dtUrlFonte.appendChild(textdtUrlFonte);
		var ddUrlFonte = document.createElement("dd");
		ddUrlFonte.className = "col-sm-9 source-url";
		var textddUrlFonte = document.createTextNode(citazione["InfoCitazione"]["UrlFonte"]);
		ddUrlFonte.appendChild(textddUrlFonte);
		dl.appendChild(dtUrlFonte);
		dl.appendChild(ddUrlFonte);
	}

	// Nota fonte
	if(citazione["InfoCitazione"]["NotaFonte"]){
		var dtNotaFonte = document.createElement("dt");
		dtNotaFonte.className = "col-sm-3";
		var textdtNotaFonte = document.createTextNode("Nota fonte");
		dtNotaFonte.appendChild(textdtNotaFonte);
		var ddNotaFonte = document.createElement("dd");
		ddNotaFonte.className = "col-sm-9 free-note";
		var textddNotaFonte = document.createTextNode(citazione["InfoCitazione"]["NotaFonte"]);
		ddNotaFonte.appendChild(textddNotaFonte);
		dl.appendChild(dtNotaFonte);
		dl.appendChild(ddNotaFonte);
	}

	return dl;
	
}
