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
// - 2020.07.14 Nicolo' Pratelli
// Deleted HDN function
//
// ////////////////////////////////////////////////////////////////////////
//
// This file is part of software developed by the Digital Libraries group
// of NeMIS Laboratory, Institute of Information Science and Technologies
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

// Wait for the page to load
document.addEventListener('DOMContentLoaded', function () {

	// Reset the form 
	// document.getElementById("lemmaForm").reset();

	/********************************************************
	 * Inizializzazione variabili
	 ********************************************************/

	// Load JSON data into global variable
	data = JSON.parse(document.getElementById('json_data').textContent);
	id_data = JSON.parse(document.getElementById('id_data').textContent);

	// Select the form
	let forms = document.querySelectorAll('form');
        console.log(forms);
	let lemma_form = forms[0];
	let manuscript_form = forms[2];
	let print_edition_form = forms[3];
	
	/* 
		Show/hide JSON
	*/
	// // Get the button that show or hide json
	// var btnJson = document.getElementById("btn-json"); 

	// // Get the json field
	// var jsonField = document.getElementById("json-field"); 
		
	// // Add the onclick event to button that show or hide json code
	// btnJson.addEventListener("click", function () {

	// 	if (jsonField.style.display === "none" || jsonField.style.display === '') {
	// 		jsonField.style.display = "block";
	// 		btnJson.textContent = "Nascondi JSON";
	// 		btnJson.scrollIntoView();
	// 	} else {
	// 		jsonField.style.display = "none";
	// 		btnJson.textContent = "Mostra JSON";
	// 	}

	// });

        /********************************************************
	 * Accordion of print edition management
	 ********************************************************/

	// Get the array of citations accordion buttons
	var pe_acc = document.getElementsByClassName("pe-accordion"); 
	
	// Add the onclick event to citations accordion that show or hide the citations
	for (var i = 0; i < pe_acc.length; i++) {
		pe_acc[i].addEventListener("click", function () {
			/* Toggle between adding and removing the "active" class,
			to highlight the button that controls the panel */
			this.classList.toggle("active");

			/* Toggle between hiding and showing the active panel */
			var panel = this.nextElementSibling;
			if (panel.style.maxHeight) {
				panel.style.maxHeight = null;
			} else {
				panel.style.maxHeight = panel.scrollHeight + "px";
			}
		});
	}

        /********************************************************
	 * Accordion of manuscript management
	 ********************************************************/
	// Get the array of citations accordion buttons
	var m_acc = document.getElementsByClassName("m-accordion"); 
	
	// Add the onclick event to citations accordion that show or hide the citations
	for (var i = 0; i < m_acc.length; i++) {
		m_acc[i].addEventListener("click", function () {
			/* Toggle between adding and removing the "active" class,
			to highlight the button that controls the panel */
			this.classList.toggle("active");

			/* Toggle between hiding and showing the active panel */
			var panel = this.nextElementSibling;
			if (panel.style.maxHeight) {
				panel.style.maxHeight = null;
			} else {
				panel.style.maxHeight = panel.scrollHeight + "px";
			}
		});
	}

        /********************************************************
	 * Transform IRIs into names in loaded citations
	 ********************************************************/
	var iris = document.getElementsByClassName("is-iri");

	Array.from(iris).forEach(function(iri) {
		if (iri.textContent) {
			dataFromIRI(iri.textContent).then((context) => {
				if (context) iri.textContent = context.text;
			})
		}
	});

        /********************************************************
	 * Modal to cancel a manuscript or print edition
	 ********************************************************/

        // Manuscript

	// Get the buttons that opens the modal
	var btn_modal_manuscript = document.getElementsByClassName("btn-modal-m");

	// Get the modal
	var manuscript_delete_modal = document.getElementById("del-manuscript-modal");


	// Add click events to open modal 
	for (var i = 0; i < btn_modal_manuscript.length; i++) {
		btn_modal_manuscript[i].addEventListener("click", function () {
			id = this.id.split("-")[3];
			var btn_del_manuscript = document.getElementsByClassName("btn-del-manuscipt")[0];
			btn_del_manuscript.id = "del-manuscript-" + id;
                        manuscript_delete_modal.style.display = "block";

		});
	}

        // Print edition

        // Get the buttons that opens the modal
	var btn_modal_print_edition = document.getElementsByClassName("btn-modal-pe");

	// Get the modal
	var print_edition_delete_modal = document.getElementById("del-print-edition-modal");

	// Add click events to open modal 
	for (var i = 0; i < btn_modal_print_edition.length; i++) {
		btn_modal_print_edition[i].addEventListener("click", function () {
			id = this.id.split("-")[3];
			var btn_del_print_edition = document.getElementsByClassName("btn-del-print-edition")[0];
			btn_del_print_edition.id = "del-prin-edition-" + id;
                        print_edition_delete_modal.style.display = "block";

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

        /********************************************************
	 * Show the for for insert a manuscript
         * or a print edition
	 ********************************************************/
	
	// Get the forms
	var work_type = document.getElementById("id_work_type");
	var manuscriptForm = document.getElementById("manuscriptForm");
	var printEditionForm = document.getElementById("printEditionForm");
	

	work_type.addEventListener("change", function () {

		// var work_type = document.getElementById("id_work_type");
		var selectedOption = work_type.options[work_type.selectedIndex].value;
		

		if (selectedOption === "MANOSCRITTO") {
			manuscriptForm.hidden = false;
			printEditionForm.hidden = true;
			
		} else if (selectedOption === "EDIZIONE A STAMPA") {
			printEditionForm.hidden = false;
			manuscriptForm.hidden = true;
		} else {
			printEditionForm.hidden = true;
			manuscriptForm.hidden = true;
		}

	});


        /********************************************************
	 * Show form to insert a sheet
	 ********************************************************/
	
	var workTypeForm = document.getElementById("workTypeForm");
	var insert_sheet = document.getElementById("insert-sheet");
	insert_sheet.addEventListener("click", function () {
		
		workTypeForm.hidden = false;
		insert_sheet.hidden = true;
			
	
	});

	/********************************************************
	 * Bottone nuovo lemma. Apre la pagina per l'inserimento
	 * di un nuovo lemma
	 ********************************************************/
	var new_lemma = document.getElementById("new-lemma");
	new_lemma.addEventListener("click", function () {
		
		window.open("../../lemma","_self")
			
	
	});

	/********************************************************
	 * Bottone modifica lemma.
	 * Permette di modificare il lemma
	 ********************************************************/
	var update_lemma = document.getElementById("update-lemma");
	update_lemma.addEventListener("click", function () {
		
		document.getElementById('id_author').disabled = false;
		document.getElementById('id_work').disabled = false;
		document.getElementById("new-lemma").hidden = true;
		update_lemma.hidden = true;
		document.getElementById("insert-lemma").hidden = false;
		document.getElementById("insert-lemma").textContent = "Salva lemma";
		document.getElementById("insert-sheet").hidden = true;
		
		
	
	});


    /********************************************************
	 * Bottone modifica manoscritto.
	 * Carica il manoscritto nel form
	 ********************************************************/
	let m_buttons = document.getElementsByClassName("btn-m");
	for (var i = 0; i < m_buttons.length; i++) {
		loadManuscriptForEdit(m_buttons[i], data);

	}

	/********************************************************
	 * Bottone modifica edizione stampa.
	 * Carica il manoscritto nel form
	 ********************************************************/
	 let pe_buttons = document.getElementsByClassName("btn-pe");
	 for (var i = 0; i < pe_buttons.length; i++) {
		 loadPrintEditionForEdit(pe_buttons[i], data);
	 }

// 	/* 
//        Onclick event, new manuscript
//     */
// 	let newManuscriptButton = document.getElementById("new-manuscript");

// 	newManuscriptButton.addEventListener("click", function () {
// 		// // Prevent page reload
// 		// event.preventDefault();
// 		document.getElementById("noteForm").reset();

// 		// Make sure that IRI forms are empty
// 		document.getElementById("id_fonte_citata_iri").value = '';
// 		document.getElementById("id_autore_citato_iri").value = '';
// 		document.getElementById("id_area_tematica_iri").value = '';

// 		document.getElementById("id_frammento_nota").scrollIntoView();
// 		document.getElementById("add-cit").disabled = false;
// 		document.getElementsByClassName("btn-save-cit")[0].style.display = "none";
// 		document.getElementById("new-cit").style.display = "none";

// 		// Reset popovers
// 		resetPopovers();
// 	});
	
// 	/* 
//        Onclick event, new print edition
//     */
//    let newPrintEditionButton = document.getElementById("new-print-edition");

//    newPrintEditionButton.addEventListener("click", function () {
// 	   // // Prevent page reload
// 	   // event.preventDefault();
// 	   document.getElementById("noteForm").reset();

// 	   // Make sure that IRI forms are empty
// 	   document.getElementById("id_fonte_citata_iri").value = '';
// 	   document.getElementById("id_autore_citato_iri").value = '';
// 	   document.getElementById("id_area_tematica_iri").value = '';

// 	   document.getElementById("id_frammento_nota").scrollIntoView();
// 	   document.getElementById("add-cit").disabled = false;
// 	   document.getElementsByClassName("btn-save-cit")[0].style.display = "none";
// 	   document.getElementById("new-cit").style.display = "none";

// 	   // Reset popovers
// 	   resetPopovers();
//    });

	
	/********************************************************
	* Bottone salva manoscritto.
	* Inserisce un nuovo manoscritto nel database
	* prendendo i dati dal form
	 ********************************************************/
   	let insert_manuscript_btn = document.getElementById("insert-manuscript");

		insert_manuscript_btn.addEventListener("click", function () {
		// // Prevent page reload
		// event.preventDefault();

		id = document.getElementById("id_lemma_id").value
		//cit = data.Nota.Citazioni[id];

		// Get Django CSRF token
		let csrf = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

		// Set request headers
		let headers = new Headers();
		headers.append('X-CSRFToken', csrf);
		headers.append('X-Requested-With', 'XMLHttpRequest');


		// Create new FormData object and populate it
		let formData = new FormData(manuscript_form);

		// Get current URL (should include object ID)
		let url = window.location.href;
		if(document.getElementById("manuscriptForm").parentElement.classList[0]=="manuscript-form-space"){
			id_manuscript = document.getElementById("manuscriptForm").parentElement.parentElement.id.split("-")[2];
			url = url + "insert_manuscript/" + id + "/" + id_manuscript + "/";
		}else{
			url = url + "insert_manuscript/" + id + "/";
		}
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
				lemma_json = context.lemma_json;
				
				if(document.getElementById("manuscriptForm").parentElement.classList[0]=="manuscript-form-space"){
					information = document.getElementById("manuscriptForm").parentElement.parentElement.firstElementChild;
					
					id_manuscript = document.getElementById("manuscriptForm").parentElement.parentElement.id.split("-")[2];
					manoscritto = lemma_json["Lemma"]["Manoscritti"][id_manuscript];
					form = document.getElementById("manuscriptForm").parentElement.removeChild(document.getElementById("manuscriptForm"));
					form.reset();
				
					form_container = document.getElementById("container-manuscript-form");

					form_container.appendChild(form);
					
					var dl = document.createElement("dl");
					dl.className = "row";

					dl = buildManuscript(dl, manoscritto);

					information.replaceChild(dl, information.firstElementChild);
					// manucript_information.appendChild(dl);

					information.hidden = false;

					document.getElementById("manuscriptForm").hidden = true;
					// document.getElementById("citationForm").hidden = true; // hide
					// document.getElementById("referenceContentForm").hidden = true; // hide
					// document.getElementById("referenceForm").hidden = true; // hide

					// Make sure that IRI forms are empty
					// document.getElementById("id_cited_source_iri").value = '';
					// document.getElementById("id_cited_author_iri").value = '';
					// document.getElementById("id_theme_area_iri").value = '';

					information.parentElement.scrollIntoView();
					// document.getElementById("add-cit").hidden = false;
					// document.getElementById("add-cit").disabled = true;
					// document.getElementsByClassName("btn-save-cit")[0].style.display = "none";
					// document.getElementById("new-cit").style.display = "none";
				}else{
				
					//Update json field
					// jsonField.textContent = context.json;

					// Inserire la nuova citazione nel DOM
					var manuscript_accordion = document.getElementById("manuscript-accordion");
					// console.log(accordion);
					var btn = document.createElement("button");
					if(!manuscript_accordion.firstElementChild){
						new_id = 0;
						// console.log(newId);
					} else {
						
						var last_id = manuscript_accordion.lastElementChild.id.split("-")[2];
						// console.log(lastId);
						new_id = parseInt(last_id) + 1;
						// console.log(newId);
					}
					btn_id = "btn-exp-m-" + new_id;
					// console.log(btnId);
					manoscritto = lemma_json["Lemma"]["Manoscritti"][lemma_json["Lemma"]["Manoscritti"].length - 1];

					btn.id = btn_id;
					btn.className = "m-accordion";
					num_manuscript = new_id + 1;
					var text_btn = document.createTextNode("Manoscritto " + num_manuscript);
					btn.appendChild(text_btn);
					btn.addEventListener("click", function () {
						/* Toggle between adding and removing the "active" class,
						to highlight the button that controls the panel */
						this.classList.toggle("active");

						/* Toggle between hiding and showing the active panel */
						var panel = this.nextElementSibling;
						if(panel.getElementsByClassName("manuscript-information")[0].hidden){
							manuscript_form.reset();
							// hide formsets
							// hideFormsets(formsets_id);
			
							// noteForm = document.getElementById("noteForm").parentElement.removeChild(document.getElementById("noteForm"));
			
							// noteFormContainer = document.getElementById("containerForm");
			
							// noteFormContainer.appendChild(noteForm);
			
							// referenceInformation.hidden = false;
			
							// document.getElementById("citationForm").hidden = true; // hide
							// document.getElementById("referenceContentForm").hidden = true; // hide
							// document.getElementById("referenceForm").hidden = true; // hide
			
							// // Make sure that IRI forms are empty
							// document.getElementById("id_cited_source_iri").value = '';
							// document.getElementById("id_cited_author_iri").value = '';
							// document.getElementById("id_theme_area_iri").value = '';
			
							// referenceInformation.parentElement.scrollIntoView();
							// document.getElementById("add-cit").hidden = false;
							// // document.getElementById("add-cit").disabled = true;
							// document.getElementsByClassName("btn-save-cit")[0].style.display = "none";
							// document.getElementById("new-cit").style.display = "none";
			
			
			
							// Reset popovers
							resetPopovers();
			
						};
						if (panel.style.maxHeight) {
							panel.style.maxHeight = null;
						} else {
							panel.style.maxHeight = panel.scrollHeight + "px";
						}
					});

					manuscript_accordion.appendChild(btn);

					var div = document.createElement("div");
					div.id = "panel-m-" + new_id;
					div.className = "m-panel";
					var dl = document.createElement("dl");
					dl.className = "row";

									// create a div space for manuscript information in accordion
					var manucript_information = document.createElement("div");
					manucript_information.className = "manuscript-information";

									// create space for manuscript form update
					var manuscript_form_space = document.createElement("div");
					manuscript_form_space.className = "manuscript-form-space";

					dl = buildManuscript(dl, manoscritto);

					div.appendChild(manucript_information);
					manucript_information.appendChild(dl);
					div.appendChild(manuscript_form_space);

					// Btn Edit
					var btn_edit = document.createElement("button");
					btn_edit_id = "m-" + new_id;
					btn_edit.id = btn_edit_id
					btn_edit.className = "btn btn-primary btn-sm btn-cit float-right";
					btn_edit.type = "button";
					var i_edit = document.createElement("i");
					i_edit.className = "far fa-edit";
					btn_edit.appendChild(i_edit);
					var text_btn_edit = document.createTextNode(" Modifica");
					btn_edit.appendChild(text_btn_edit);
					manucript_information.appendChild(btn_edit);

					// loadReferenceForEdit(btnEdit, data, formsets_id);


					// Btn Del
					var btn_del = document.createElement("button");
					btn_del_id = "btn-modal-m-" + new_id;
					btn_del.id = btn_del_id
					btn_del.className = "btn btn-danger btn-sm btn-modal float-left";
					var i_del = document.createElement("i");
					i_del.className = "fas fa-trash";
					btn_del.appendChild(i_del);
					var text_btn_del = document.createTextNode(" Cancella");
					btn_del.appendChild(text_btn_del);
					manucript_information.appendChild(btn_del);
					btn_del.addEventListener("click", function () {
						id = this.id.split("-")[3];
						var btn_del_m = document.getElementsByClassName("btn-del-manuscript")[0];
						btn_del_m.id = "del-manuscript-" + id;
						manuscript_delete_modal.style.display = "block";

					});

		
					manuscript_accordion.appendChild(div);

					// Reset the form 
					manuscriptForm.reset();
					// tinyMCE.activeEditor.setContent('');
					// tinymce.get("id_text_fragment").setContent('');
					// tinymce.get("id_source_text").setContent('');

					// hide formsets
					// hideFormsets(formsets_id);

					// hide all forms
					manuscriptForm.hidden = true; // hide

					document.getElementById(btn_id).scrollIntoView();

			}

				
				// Make sure that IRI fields are empty
				// document.getElementById("id_cited_source_iri").value = '';
				// document.getElementById("id_cited_author_iri").value = '';
				// document.getElementById("id_theme_area_iri").value = '';

				// console.log(accordion);
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

        /********************************************************
	 * Bottone salva edizione a stampa.
         * Inserisce una nuova edizione a stampa nel database
         * prendendo i dati dal form
	 ********************************************************/
   	let insert_print_edition_btn = document.getElementById("insert-print-edition");

		insert_print_edition_btn.addEventListener("click", function () {
		// // Prevent page reload
		// event.preventDefault();

		id = document.getElementById("id_lemma_id").value
		//cit = data.Nota.Citazioni[id];

		// Get Django CSRF token
		let csrf = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

		// Set request headers
		let headers = new Headers();
		headers.append('X-CSRFToken', csrf);
		headers.append('X-Requested-With', 'XMLHttpRequest');


		// Create new FormData object and populate it
		let formData = new FormData(print_edition_form);

		// Get current URL (should include object ID)
		let url = window.location.href;
		if(document.getElementById("printEditionForm").parentElement.classList[0]=="print-edition-form-space"){
			id_print_edition = document.getElementById("printEditionForm").parentElement.parentElement.id.split("-")[2];
			url = url + "insert_print_edition/" + id + "/" + id_print_edition + "/";
		}else{
			url = url + "insert_print_edition/" + id + "/";
		}

		// window.open(url); 
		// Fetch current annotation
                console 
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
				lemma_json = context.lemma_json;
				
				//Update json field
				// jsonField.textContent = context.json;

				if(document.getElementById("printEditionForm").parentElement.classList[0]=="print-edition-form-space"){
					information = document.getElementById("printEditionForm").parentElement.parentElement.firstElementChild;
					
					id_print_edition = document.getElementById("printEditionForm").parentElement.parentElement.id.split("-")[2];
					print_edition = lemma_json["Lemma"]["EdizioniStampa"][id_print_edition];
					form = document.getElementById("printEditionForm").parentElement.removeChild(document.getElementById("printEditionForm"));
					form.reset();
				
					form_container = document.getElementById("container-print-edition-form");

					form_container.appendChild(form);
					
					var dl = document.createElement("dl");
					dl.className = "row";

					dl = buildPrintEdition(dl, print_edition);

					information.replaceChild(dl, information.firstElementChild);
					// manucript_information.appendChild(dl);

					information.hidden = false;

					document.getElementById("printEditionForm").hidden = true;
					// document.getElementById("citationForm").hidden = true; // hide
					// document.getElementById("referenceContentForm").hidden = true; // hide
					// document.getElementById("referenceForm").hidden = true; // hide

					// Make sure that IRI forms are empty
					// document.getElementById("id_cited_source_iri").value = '';
					// document.getElementById("id_cited_author_iri").value = '';
					// document.getElementById("id_theme_area_iri").value = '';

					information.parentElement.scrollIntoView();
					// document.getElementById("add-cit").hidden = false;
					// document.getElementById("add-cit").disabled = true;
					// document.getElementsByClassName("btn-save-cit")[0].style.display = "none";
					// document.getElementById("new-cit").style.display = "none";
				}else{

				// Inserire la nuova citazione nel DOM
				var print_edition_accordion = document.getElementById("print-edition-accordion");
				// console.log(accordion);
				var btn = document.createElement("button");
				if(!print_edition_accordion.firstElementChild){
					new_id = 0;
					// console.log(newId);
				} else {
					
					var last_id = print_edition_accordion.lastElementChild.id.split("-")[2];
					// console.log(lastId);
					new_id = parseInt(last_id) + 1;
					// console.log(newId);
				}
				btn_id = "btn-exp-pe-" + new_id;
				// console.log(btnId);
				edizione_stampa = lemma_json["Lemma"]["EdizioniStampa"][lemma_json["Lemma"]["EdizioniStampa"].length - 1];

				btn.id = btn_id;
				btn.className = "pe-accordion";
				num_print_edition = new_id + 1;
				var text_btn = document.createTextNode("Edizione a stampa " + num_print_edition);
				btn.appendChild(text_btn);
				btn.addEventListener("click", function () {
					/* Toggle between adding and removing the "active" class,
					to highlight the button that controls the panel */
					this.classList.toggle("active");

					/* Toggle between hiding and showing the active panel */
					var panel = this.nextElementSibling;
					if(panel.getElementsByClassName("print-edition-information")[0].hidden){
						manuscript_form.reset();
						// hide formsets
						// hideFormsets(formsets_id);
		
						// noteForm = document.getElementById("noteForm").parentElement.removeChild(document.getElementById("noteForm"));
		
						// noteFormContainer = document.getElementById("containerForm");
		
						// noteFormContainer.appendChild(noteForm);
		
						// referenceInformation.hidden = false;
		
						// document.getElementById("citationForm").hidden = true; // hide
						// document.getElementById("referenceContentForm").hidden = true; // hide
						// document.getElementById("referenceForm").hidden = true; // hide
		
						// // Make sure that IRI forms are empty
						// document.getElementById("id_cited_source_iri").value = '';
						// document.getElementById("id_cited_author_iri").value = '';
						// document.getElementById("id_theme_area_iri").value = '';
		
						// referenceInformation.parentElement.scrollIntoView();
						// document.getElementById("add-cit").hidden = false;
						// // document.getElementById("add-cit").disabled = true;
						// document.getElementsByClassName("btn-save-cit")[0].style.display = "none";
						// document.getElementById("new-cit").style.display = "none";
		
		
		
						// Reset popovers
						resetPopovers();
		
					};
					// if (panel.style.maxHeight) {
					// 	panel.style.maxHeight = null;
					// } else {
					// 	panel.style.maxHeight = panel.scrollHeight + "px";
					// }
				});

				print_edition_accordion.appendChild(btn);

				var div = document.createElement("div");
				div.id = "panel-pe-" + new_id;
				div.className = "pe-panel";
				var dl = document.createElement("dl");
				dl.className = "row";

                                // create a div space for manuscript information in accordion
				var print_edition_information = document.createElement("div");
				print_edition_information.className = "print-edition-information";

                                // create space for manuscript form update
				var print_edition_form_space = document.createElement("div");
				print_edition_form_space.className = "print-edition-form-space";

				dl = buildPrintEdition(dl, edizione_stampa);

				div.appendChild(print_edition_information);
				print_edition_information.appendChild(dl);
				div.appendChild(print_edition_form_space);

				// Btn Edit
				var btn_edit = document.createElement("button");
				btn_edit_id = "pe-" + new_id;
				btn_edit.id = btn_edit_id
				btn_edit.className = "btn btn-primary btn-sm btn-cit float-right";
				btn_edit.type = "button";
				var i_edit = document.createElement("i");
				i_edit.className = "far fa-edit";
				btn_edit.appendChild(i_edit);
				var text_btn_edit = document.createTextNode(" Modifica");
				btn_edit.appendChild(text_btn_edit);
				manucript_information.appendChild(btn_edit);

				// loadReferenceForEdit(btnEdit, data, formsets_id);


				// Btn Del
				var btn_del = document.createElement("button");
				btn_del_id = "btn-modal-pe-" + new_id;
				btn_del.id = btn_del_id
				btn_del.className = "btn btn-danger btn-sm btn-modal float-left";
				var i_del = document.createElement("i");
				i_del.className = "fas fa-trash";
				btn_del.appendChild(i_del);
				var text_btn_del = document.createTextNode(" Cancella");
				btn_del.appendChild(text_btn_del);
				manucript_information.appendChild(btn_del);
				btn_del.addEventListener("click", function () {
					id = this.id.split("-")[3];
					var btn_del_pe = document.getElementsByClassName("btn-del-print-edition")[0];
					btn_del_pe.id = "del-print-edition-" + id;
					print_edition_delete_modal.style.display = "block";

				});

	
				print_edition_accordion.appendChild(div);
				
			

				// Reset the form 
				printEditionForm.reset();
				// tinyMCE.activeEditor.setContent('');
				// tinymce.get("id_text_fragment").setContent('');
				// tinymce.get("id_source_text").setContent('');

				// hide formsets
				// hideFormsets(formsets_id);

				// hide all forms
				printEditionForm.hidden = true; // hide

				document.getElementById(btn_id).scrollIntoView();

					

				
				// Make sure that IRI fields are empty
				// document.getElementById("id_cited_source_iri").value = '';
				// document.getElementById("id_cited_author_iri").value = '';
				// document.getElementById("id_theme_area_iri").value = '';

				// console.log(accordion);
			}
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

        /********************************************************
	 *  Event to delete a manuscript
	 ********************************************************/
	
	// var citDelButton = document.getElementsByClassName("btn-del-manuscipt")[0];
	var manuscript_del_button = document.getElementsByClassName("btn-del-manuscipt")[0];

	manuscript_del_button.addEventListener("click", function () {
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

                // Create new FormData object and populate it
		let formData = new FormData(lemma_form);

		// Check content of FormData object
		for (let field of formData) {
			console.log(field);
		}

		// Get current URL (should include object ID)
		let url = window.location.href;

		url = url + "delete_manuscript/" + id + "/";
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

				//Update json field
				// jsonField.textContent = context.json;

				
			})
			.catch((error) => {
				console.error('Error:', error);
			});
                        // Get lenght of manuscripts accorditions
			manuscript_acc_lenght = m_acc.length;

                        // Close the modal
			manuscript_delete_modal.style.display = "none";

                        // Built ids of the elements to remove
			id_m_panel = "panel-m-" + id; // id of the panel div
			id_btn_exp_m = "btn-exp-m-" + id; // id of the button to expand accordion
			
                        // get the elements to remove
                        let button_exp_m = document.getElementById(id_btn_exp_m);
			let m_panel = document.getElementById(id_m_panel);

                        // remove the elements
			button_exp_m.parentNode.removeChild(button_exp_m);
			m_panel.parentNode.removeChild(m_panel);
		
                        // renumber the accordition manuscript elements
			if(id!=(manuscript_acc_lenght-1)){
				
				for (var k = parseInt(id) + 1; k < manuscript_acc_lenght; k++) {
					new_id = k - 1;
					temp_id = "btn-exp-m-" + k;
                                        // rename btn expand text of accordion
					document.getElementById(temp_id).textContent = "Manoscritto " + k;
                                        // change id of btn expand
					document.getElementById(temp_id).id = "btn-exp-m-" + new_id;
                                        // change id of panel
					temp_id = "panel-m-" + k;
					document.getElementById(temp_id).id = "panel-m-" + new_id;
                                        // change id of update btn
					temp_id = "m-" + k;
					document.getElementById(temp_id).id = "m-" + new_id;
                                        // change id of delete btn
					temp_id = "btn-modal-m-" + k;
					document.getElementById(temp_id).id = "btn-modal-m-" + new_id;
				}

			}
		
			
	});

        /********************************************************
	 *  Event to delete a print edition
	 ********************************************************/
	
	// var citDelButton = document.getElementsByClassName("btn-del-manuscipt")[0];
	var print_edition_del_button = document.getElementsByClassName("btn-del-print-edition")[0];

	print_edition_del_button.addEventListener("click", function () {
		// // Prevent page reload
		// event.preventDefault();

		id = this.id.split("-")[3];
		//cit = data.Nota.Citazioni[id];

		modalid = "deleteCitModal" + id;


		// Get Django CSRF token
		let csrf = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

		// Set request headers
		let headers = new Headers();
		headers.append('X-CSRFToken', csrf);
		headers.append('X-Requested-With', 'XMLHttpRequest');

                // Create new FormData object and populate it
		let formData = new FormData(lemma_form);

		// Check content of FormData object
		for (let field of formData) {
			console.log(field);
		}

		// Get current URL (should include object ID)
		let url = window.location.href;

		url = url + "delete_print_edition/" + id + "/";
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

				//Update json field
				// jsonField.textContent = context.json;

				
			})
			.catch((error) => {
				console.error('Error:', error);
			});
                        // Get lenght of print edition accorditions
			print_edition_acc_lenght = pe_acc.length;

                        // Close the modal
			print_edition_delete_modal.style.display = "none";

                        // Built ids of the elements to remove
			id_pe_panel = "panel-pe-" + id; // id of the panel div
			id_btn_exp_pe = "btn-exp-pe-" + id; // id of the button to expand accordion
			
                        // get the elements to remove
                        let button_exp_pe = document.getElementById(id_btn_exp_pe);
			let pe_panel = document.getElementById(id_pe_panel);

                        // remove the elements
			button_exp_pe.parentNode.removeChild(button_exp_pe);
			pe_panel.parentNode.removeChild(pe_panel);
		
                        // renumber the accordition manuscript elements
			if(id!=(print_edition_acc_lenght-1)){
				
				for (var k = parseInt(id) + 1; k < print_edition_acc_lenght; k++) {
					new_id = k - 1;
					temp_id = "btn-exp-pe-" + k;
                                        // rename btn expand text of accordion
					document.getElementById(temp_id).textContent = "Edizione a stampa " + k;
                                        // change id of btn expand
					document.getElementById(temp_id).id = "btn-exp-pe-" + new_id;
                                        // change id of panel
					temp_id = "panel-pe-" + k;
					document.getElementById(temp_id).id = "panel-pe-" + new_id;
                                        // change id of update btn
					temp_id = "pe-" + k;
					document.getElementById(temp_id).id = "pe-" + new_id;
                                        // change id of delete btn
					temp_id = "btn-modal-pe-" + k;
					document.getElementById(temp_id).id = "btn-modal-pe-" + new_id;
				}

			}
		
			
	});

	/********************************************************
	*	Qui sotto viene catturato l'evento submit sul lemma form, 
	*	bloccando il reload automatico della pagina
	*********************************************************/


	// Add event listener on lemma form
	lemma_form.addEventListener('submit', function (event) {

		// Prevent page reload
		event.preventDefault();

		// Get Django CSRF token
		let csrf = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

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
				return response.json();
			})
			.then((context) => {
				/*
					Qui riceviamo il context in JSON, quindi possiamo
					prendere la variabile "data" e aggiornarla. Volendo si
					può fare la stessa cosa anche per la variabile "json"
					che contiene il JSON formattato
				*/
				data = context.lemma_json;
                                lemma_id = context.lemma_id
				console.log(data);
				console.log(lemma_id);

				lemma = data["Lemma"];

				
				//Update json field
				// jsonField.textContent = context.json;
				document.getElementById('id_author').disabled = true;
				document.getElementById('id_work').disabled = true;
				document.getElementById("insert-sheet").hidden = false;

				// Show update lemma and new lemma buttons
				document.getElementById("insert-lemma").style.display = "none";
				document.getElementById("update-lemma").style.display = "inline";
				document.getElementById("new-lemma").style.display = "inline";

                                document.getElementById("id_lemma_id").value = lemma_id
                                

				// let lemmaText = document.getElementById("lemmaText");
				// let lemmaChildren = lemmaText.children;
				// console.log(lemmaChildren);

				// Fetch names from IRIs and put them in input fields
				if (lemma["Autore"]) {
					dataFromIRI(lemma["Autore"]).then(result => document.getElementById("id_author").value = result.text);
					document.getElementById("id_author_iri").value = lemma["Autore"];
				}
				if (lemma["Opera"]) {
					dataFromIRI(lemma["Opera"]).then(result =>document.getElementById("id_work").value = result.text);
					document.getElementById("id_work_iri").value = lemma["Opera"];
				}
				
				// lemmaText.hidden = false;
				// document.getElementById("lemmaForm").hidden = true;

				// Reset the form 
				// document.getElementById("lemmaForm").reset();
				
				// Make sure that IRI fields are empty
				

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
            let authorIRI = $('#id_author_iri').val();
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
    $('#id_author, #id_theme_area').autoComplete({
            resolverSettings: {
                    url: $(this).attr('data-url'),
                    fail: autocompleteFail
            },
            minLength: 0,
            preventEnter: true,
            events: {searchPost: filterByLength}
    });
    $('#id_work').autoComplete({
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

	/*
		Function to reset popovers to original state
	*/
	function resetPopovers(selector) {
		if (selector === undefined) {
			selector = '[data-toggle=popover]';
		}
		$(selector).each(function() {
			$(this).attr('data-original-title', $(this).attr('data-default-title'));
			$(this).attr('data-content', '');
		});
	}



// Fetch data from IRIs
function dataFromIRI(iri) {
	let url = '/annotation/entity?iri=' + iri;
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








});


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


 /********************************************************
 * Build a manuscript in accordion after insert or update
 ********************************************************/
function buildManuscript(dl, manoscritto){
	
	// citazione = data["Nota"]["Citazioni"][data["Nota"]["Citazioni"].length - 1];

	// Autore
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Autore");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	var text_dd = document.createTextNode(manoscritto["Autore"]);
	dd.append(text_dd);
	// dd.innerHTML = manoscritto["Autore"];
	dl.appendChild(dt);
	dl.appendChild(dd);

        // Opera
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Opera");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	var text_dd = document.createTextNode(manoscritto["Titolo"]);
	dd.append(text_dd);
	// dd.innerHTML = manoscritto["Titolo"];
	dl.appendChild(dt);
	dl.appendChild(dd);

    // Località
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Località");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	dl.appendChild(dt);
	dl.appendChild(dd);
        if (manoscritto["LuogoBiblioteca"]) {
                dataFromIRI(manoscritto["LuogoBiblioteca"]).then(result => dd.textContent = result.text);
        }

    // Biblioteca
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Biblioteca");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	dl.appendChild(dt);
	dl.appendChild(dd);
        if (manoscritto["Biblioteca"]) {
                dataFromIRI(manoscritto["Biblioteca"]).then(result => dd.textContent = result.text);
        }

    // Segnatura
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Segnatura");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	var text_dd = document.createTextNode(manoscritto["Segnatura"]);
	dd.append(text_dd);
	dl.appendChild(dt);
	dl.appendChild(dd);

    // Carte
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Carte");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	var text_dd = document.createTextNode(manoscritto["Fogli"]);
	dd.append(text_dd);
	dl.appendChild(dt);
	dl.appendChild(dd);

        // Incipit dedica / proemio
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Incipit dedica / proemio");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	var text_dd = document.createTextNode(manoscritto["IncipitDedica"]);
	dd.append(text_dd);
	dl.appendChild(dt);
	dl.appendChild(dd);

    // Explicit dedica / proemio
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Explicit dedica / proemio");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	var text_dd = document.createTextNode(manoscritto["ExplicitDedica"]);
	dd.append(text_dd);
	dl.appendChild(dt);
	dl.appendChild(dd);

        // Incipit testo
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Incipit testo");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	var text_dd = document.createTextNode(manoscritto["IncipitTesto"]);
	dd.append(text_dd);
	dl.appendChild(dt);
	dl.appendChild(dd);

        // Explicit testo
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Explicit testo");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	var text_dd = document.createTextNode(manoscritto["ExplicitTesto"]);
	dd.append(text_dd);
	dl.appendChild(dt);
	dl.appendChild(dd);

        // Datazione
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Datazione");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	var text_dd = document.createTextNode(manoscritto["Datazione"]);
	dd.append(text_dd);
	dl.appendChild(dt);
	dl.appendChild(dd);

        // Fonti delle notizie
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Fonti delle notizie");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	var text_dd = document.createTextNode(manoscritto["Fonti"]);
	dd.append(text_dd);
	dl.appendChild(dt);
	dl.appendChild(dd);

	return dl;
	
}

/********************************************************
 * Build a print edition in accordion after insert or update
 ********************************************************/
function buildPrintEdition(dl, edizioneStampa){
	
	// citazione = data["Nota"]["Citazioni"][data["Nota"]["Citazioni"].length - 1];

	// Autore
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Autore");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	var text_dd = document.createTextNode(edizioneStampa["Autore"]);
	dd.append(text_dd);
	// dd.innerHTML = edizioneStampa["Autore"];
	dl.appendChild(dt);
	dl.appendChild(dd);

	// Opera
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Opera");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	var text_dd = document.createTextNode(edizioneStampa["Titolo"]);
	dd.append(text_dd);
	// dd.innerHTML = edizioneStampa["Titolo"];
	dl.appendChild(dt);
	dl.appendChild(dd);

	// Curatore
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Curatore");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	var text_dd = document.createTextNode(edizioneStampa["Curatore"]);
	dd.append(text_dd);
	// dd.innerHTML = edizioneStampa["Titolo"];
	dl.appendChild(dt);
	dl.appendChild(dd);

	// Luogo
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Luogo");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	dl.appendChild(dt);
	dl.appendChild(dd);
        if (edizioneStampa["Luogo"]) {
                dataFromIRI(edizioneStampa["Luogo"]).then(result => dd.textContent = result.text);
        }

	// Data
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Data");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	var text_dd = document.createTextNode(edizioneStampa["Data"]);
	dd.append(text_dd);
	dl.appendChild(dt);
	dl.appendChild(dd);

	// Tipografo / Casa editrice
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Tipografo / Casa editrice");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	var text_dd = document.createTextNode(edizioneStampa["Editore"]);
	dd.append(text_dd);
	dl.appendChild(dt);
	dl.appendChild(dd);

	// Formato
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Formato");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	var text_dd = document.createTextNode(edizioneStampa["Formato"]);
	dd.append(text_dd);
	dl.appendChild(dt);
	dl.appendChild(dd);

	// Pagine
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Pagine");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	var text_dd = document.createTextNode(edizioneStampa["Pagine"]);
	dd.append(text_dd);
	dl.appendChild(dt);
	dl.appendChild(dd);

	// Illustrazioni
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Illustrazioni");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	var text_dd = document.createTextNode(edizioneStampa["Figure"]);
	dd.append(text_dd);
	dl.appendChild(dt);
	dl.appendChild(dd);

	// Altre eventuali notizie
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Altre eventuali notizie");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	var text_dd = document.createTextNode(edizioneStampa["Note"]);
	dd.append(text_dd);
	dl.appendChild(dt);
	dl.appendChild(dd);

	// Prefatore ed eventuali dediche, prefazioni o premesse all’edizione
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Prefatore ed eventuali dediche, prefazioni o premesse all’edizione");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	var text_dd = document.createTextNode(edizioneStampa["Prefatore"]);
	dd.append(text_dd);
	dl.appendChild(dt);
	dl.appendChild(dd);

	 // Altri contenuti
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Altri contenuti");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	var text_dd = document.createTextNode(edizioneStampa["AltriContenuti"]);
	dd.append(text_dd);
	dl.appendChild(dt);
	dl.appendChild(dd);

	// Prima edizione/ristampa
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Prima edizione/ristampa");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	var text_dd = document.createTextNode(edizioneStampa["Edizione"]);
	dd.append(text_dd);
	dl.appendChild(dt);
	dl.appendChild(dd);

	// Data dell'edizione
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Data dell'edizione");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	var text_dd = document.createTextNode(edizioneStampa["DataEdizione"]);
	dd.append(text_dd);
	dl.appendChild(dt);
	dl.appendChild(dd);

	// Fonti dell'edizione
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Fonti dell'edizione");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	var text_dd = document.createTextNode(edizioneStampa["FontiPrimarie"]);
	dd.append(text_dd);
	dl.appendChild(dt);
	dl.appendChild(dd);

	// Tipologia ecdotica dell’edizione
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Tipologia ecdotica dell’edizione");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	var text_dd = document.createTextNode(edizioneStampa["Ecdotica"]);
	dd.append(text_dd);
	dl.appendChild(dt);
	dl.appendChild(dd);

	 // Fonti delle notizie
	var dt = document.createElement("dt");
	dt.className = "col-sm-3";
	var text_dt = document.createTextNode("Fonti delle notizie");
	dt.appendChild(text_dt);
	var dd = document.createElement("dd");
	dd.className = "col-sm-9 text-fragment";
	var text_dd = document.createTextNode(edizioneStampa["FontiSecondarie"]);
	dd.append(text_dd);
	dl.appendChild(dt);
	dl.appendChild(dd);

	return dl;
	
}

function loadManuscriptForEdit(button, data){
	console.log(button);
	button.addEventListener("click", function () {  
		// // Prevent page reload
		// event.preventDefault();

		manuscript_id = this.id.split("-")[1];
		console.log(data);
		manuscript = data.Lemma.Manoscritti[manuscript_id];

		// Fetch names from IRIs and put them in input fields
		if (manuscript.LuogoBiblioteca) {
				dataFromIRI(cit.InfoCitazione.LuogoBiblioteca).then((context) => {
						document.getElementById("id_library_location").value = context.text;
						context.preventFocus = true;
						$('#id_library_location').trigger('autocomplete.select', context);
				});
		}
		if (manuscript.Biblioteca) {
				dataFromIRI(manuscript.Biblioteca).then((context) => {
						document.getElementById("id_library").value = context.text;
						context.preventFocus = true;
						$('#id_library').trigger('autocomplete.select', context);
				});
		}
		
		form = document.getElementById("manuscriptForm").parentElement.removeChild(document.getElementById("manuscriptForm"));
		console.log(form);
		accordion_id = "panel-m-" + manuscript_id;
		accordion = document.getElementById(accordion_id);

		information = accordion.getElementsByClassName("manuscript-information")[0];
		information.hidden = true;

		form_space = accordion.getElementsByClassName("manuscript-form-space")[0];

		form_space.appendChild(form);
		accordion.style.maxHeight = "5000px";

		form.reset();
		// hideFormsets(formsets_id);

		// console.log(document.getElementById("id_text_fragment"));
		
		// document.getElementById("id_text_fragment").value = cit.FrammentoNota;
		document.getElementById("id_manuscript_author").value = manuscript.Autore;
		document.getElementById("id_manuscript_title").value = manuscript.Titolo;
		document.getElementById("id_library_iri").value = manuscript.Biblioteca;
		document.getElementById("id_library_location_iri").value = manuscript.LuogoBiblioteca;
		document.getElementById("id_signature").value = manuscript.Segnatura;
		document.getElementById("id_folios").value = manuscript.Fogli;
		document.getElementById("id_incipit_dedication_proem").value = manuscript.IncipitDedica;
		document.getElementById("id_explicit_dedication_proem").value = manuscript.ExplicitDedica;
		document.getElementById("id_incipit_text").value = manuscript.IncipitTesto;
		document.getElementById("id_explicit_text").value = manuscript.ExplicitTesto;
		document.getElementById("id_date").value = manuscript.Datazione;
		document.getElementById("id_secondary_sources").value = manuscript.Fonti;


		document.getElementById("id_manuscript_author").scrollIntoView();
		// document.getElementById("del-cit").id = "del-cit-" + id;
		document.getElementById("manuscriptForm").hidden = false;
		// document.getElementsByClassName("btn-save-cit")[0].id = "save-cit-" + manuscript_id; 
		// document.getElementById("add-cit").hidden = true;
		// document.getElementsByClassName("btn-save-cit")[0].style.display = "inline";
		
		
		/* 
		Event onclick button annulla on reference
		*/
		let cancel = document.getElementById("cancel-manuscript");

		cancel.hidden = false;

		cancel.addEventListener("click", function () {
				// // Prevent page reload
				// event.preventDefault();
				form.reset();
				
				form = document.getElementById("manuscriptForm").parentElement.removeChild(document.getElementById("manuscriptForm"));
		
				form_container = document.getElementById("container-manuscript-form");

				form_container.appendChild(form);

				information.hidden = false;

				document.getElementById("manuscriptForm").hidden = true;
				// document.getElementById("citationForm").hidden = true; // hide
				// document.getElementById("referenceContentForm").hidden = true; // hide
				// document.getElementById("referenceForm").hidden = true; // hide

				// Make sure that IRI forms are empty
				// document.getElementById("id_cited_source_iri").value = '';
				// document.getElementById("id_cited_author_iri").value = '';
				// document.getElementById("id_theme_area_iri").value = '';

				information.parentElement.scrollIntoView();
				// document.getElementById("add-cit").hidden = false;
				// document.getElementById("add-cit").disabled = true;
				// document.getElementsByClassName("btn-save-cit")[0].style.display = "none";
				// document.getElementById("new-cit").style.display = "none";



				// Reset popovers
				resetPopovers();
		});



	});
}

function loadPrintEditionForEdit(button, data){
	button.addEventListener("click", function () {  
		// // Prevent page reload
		// event.preventDefault();

		print_edition_id = this.id.split("-")[1];
		console.log(data);
		print_edition = data.Lemma.EdizioniStampa[print_edition_id];

		// Fetch names from IRIs and put them in input fields
		if (print_edition.Luogo) {
				dataFromIRI(cit.InfoCitazione.Luogo).then((context) => {
						document.getElementById("id_place").value = context.text;
						context.preventFocus = true;
						$('#id_place').trigger('autocomplete.select', context);
				});
		}
	
		
		form = document.getElementById("printEditionForm").parentElement.removeChild(document.getElementById("printEditionForm"));

		accordion_id = "panel-pe-" + print_edition_id;
		accordion = document.getElementById(accordion_id);

		information = accordion.getElementsByClassName("print-edition-information")[0];
		information.hidden = true;

		form_space = accordion.getElementsByClassName("print-edition-form-space")[0];

		form_space.appendChild(form);
		accordion.style.maxHeight = "5000px";

		form.reset();
		// hideFormsets(formsets_id);

		// console.log(document.getElementById("id_text_fragment"));
		
		// document.getElementById("id_text_fragment").value = cit.FrammentoNota;
		document.getElementById("id_print_edition_author").value = print_edition.Autore;
		document.getElementById("id_print_edition_title").value = print_edition.Titolo;
		document.getElementById("id_curator").value = print_edition.Curatore;
		document.getElementById("id_place_iri").value = print_edition.Luogo;
		document.getElementById("id_date").value = print_edition.Data;
		document.getElementById("id_editor").value = print_edition.Editore;
		document.getElementById("id_format_print_edition").value = print_edition.Formato;
		document.getElementById("id_pages").value = print_edition.Pagine;
		document.getElementById("id_figures").value = print_edition.Figure;
		document.getElementById("id_notes").value = print_edition.Note;
		document.getElementById("id_prefatore").value = print_edition.Prefatore;
		document.getElementById("id_other_content").value = print_edition.AltriContenuti;
		document.getElementById("id_edition").value = print_edition.Edizione;
		document.getElementById("id_date_edition").value = print_edition.DataEdizione;
		document.getElementById("id_primary_sources").value = print_edition.FontiPrimarie;
		document.getElementById("id_ecdotic_typology").value = print_edition.Ecdotica;
		document.getElementById("id_secondary_sources").value = print_edition.FontiSecondarie;

		document.getElementById("id_print_edition_author").scrollIntoView();
		// document.getElementById("del-cit").id = "del-cit-" + id;
		document.getElementById("printEditionForm").hidden = false;
		// document.getElementsByClassName("btn-save-cit")[0].id = "save-cit-" + manuscript_id; 
		// document.getElementById("add-cit").hidden = true;
		// document.getElementsByClassName("btn-save-cit")[0].style.display = "inline";
		
		
		/* 
		Event onclick button annulla on reference
		*/
		let cancel = document.getElementById("cancel-print-edition");

		cancel.hidden = false;

		cancel.addEventListener("click", function () {
				// // Prevent page reload
				// event.preventDefault();
				form.reset();
				
				form = document.getElementById("printEditionForm").parentElement.removeChild(document.getElementById("printEditionForm"));
		
				form_container = document.getElementById("container-print-edition-form");

				form_container.appendChild(form);

				information.hidden = false;

				document.getElementById("printEditionForm").hidden = true;
				// document.getElementById("citationForm").hidden = true; // hide
				// document.getElementById("referenceContentForm").hidden = true; // hide
				// document.getElementById("referenceForm").hidden = true; // hide

				// Make sure that IRI forms are empty
				// document.getElementById("id_cited_source_iri").value = '';
				// document.getElementById("id_cited_author_iri").value = '';
				// document.getElementById("id_theme_area_iri").value = '';

				information.parentElement.scrollIntoView();
				// document.getElementById("add-cit").hidden = false;
				// document.getElementById("add-cit").disabled = true;
				// document.getElementsByClassName("btn-save-cit")[0].style.display = "none";
				// document.getElementById("new-cit").style.display = "none";



				// Reset popovers
				resetPopovers();
		});



	});
}