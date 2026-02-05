const MAX_LIST_LENGTH = 10;

// Function to filter works by author and length
function filterByAuthor(newValue, origJQElement) {
		let authorIRI = $('#id_author_iri').val();
		if (authorIRI && (authorIRI !== '')) {
				return (authorIRI + '$$' + newValue);
		}
		return newValue;
}

// Function to filter works by place and length
function filterByPlace(newValue, origJQElement) {
	let placeIRI = $('#id_library_location_iri').val();
	if (placeIRI && (placeIRI !== '')) {
			return (placeIRI + '$$' + newValue);
	}
	return newValue;
}

// Function to filter works by length only
function filterByLength(resultsFromServer, origJQElement) {
		return resultsFromServer.slice(0, MAX_LIST_LENGTH);
}

// Function to highlight works with missing author
function highlightMissing(resultsFromServer, origJQElement) {
		resultsFromServer.forEach(function(el) {
		if (el.author === MISSING_IRI) {
			el.text += ' <i>(autore mancante)</i>'
		}
	});
	return resultsFromServer;
}

// Wikidata query URL
const WD_URL = 'https://query.wikidata.org/sparql';

// IRI for missing authors
MISSING_IRI = 'https://imagoarchive.it/resource/author/missing';

// SPARQL subquery for works
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

// SPARQL subquery for libraries
function makeSubqueryLibraries(query, offset) {
	query = "inlabel:"+query
	return (offset ? ' UNION ' : '') +
			'{SERVICE wikibase:mwapi { ' +
					'bd:serviceParam wikibase:limit 50 . ' +
					(offset ? 'bd:serviceParam mwapi:continue ' + offset + ' . ' : '') +                    
					'bd:serviceParam wikibase:api "Generator" . ' +
					'bd:serviceParam mwapi:generator "search" . ' +
					'bd:serviceParam wikibase:endpoint "www.wikidata.org" . ' +
					'bd:serviceParam mwapi:gsrsearch "' + query + '" . ' +
					'bd:serviceParam mwapi:gsrlimit "max" . ' +
					'?item wikibase:apiOutputItem mwapi:title . ' +
					
	'}}';
}

// SPARQL query for works
function makeworkQuery(query) {
		return 'SELECT DISTINCT (?item as ?value) ?itemLabel ?itemAltLabel ?author ?authorLabel WHERE { ' +
				'hint:Query hint:optimizer "None". ' + // disable optimizer (makes query faster)
				'{SELECT ?item ?author WHERE { ' +
				makeSubquery(query, 0) + // results 1-50
				makeSubquery(query, 50) + // results 51-100
				//'FILTER NOT EXISTS { ' +
				//'{?item wdt:P571|wdt:P577|wdt:P1191 ?date. ' +
				//'hint:Prior hint:rangeSafe true . }' +
				//'UNION { ?item wdt:P50 ?author. ' +
				//'?author wdt:P569 ?date. hint:Prior hint:rangeSafe true.} ' +
				//'FILTER (?date > "1400-01-01"^^xsd:dateTime) ' +
				//'} ' +
				'{?item wdt:P31 wd:Q47461344 . } ' +
				'UNION ' +
				'{?item wdt:P31/wdt:P279* wd:Q47461344 . ' +
				'hint:Prior hint:gearing "forward". }' +
				'OPTIONAL {?item wdt:P50 ?author} } LIMIT 50}' +
				'SERVICE wikibase:label {' +
						'bd:serviceParam wikibase:language "[AUTO_LANGUAGE],it,la,en,fr" . ' +
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
		//'FILTER NOT EXISTS { ' +
		//'?item wdt:P569 ?birth. hint:Prior hint:rangeSafe true. ' +
		//'FILTER (?birth > "1600-01-01"^^xsd:dateTime) ' +
		//'} ' +
		'?item wdt:P31 wd:Q5. ' +
		//'?item wdt:P106/wdt:P279* wd:Q2500638. ' +
		//'hint:Prior hint:gearing "forward". ' +
		'} LIMIT 50}' +
		'SERVICE wikibase:label {' +
				'bd:serviceParam wikibase:language "[AUTO_LANGUAGE],it,la,en,fr" . ' +
		'}' +
		'}'
}

// SPARQL query for librarys
function makeLibraryQuery(query) {
		return 'SELECT DISTINCT (?item as ?value) ?itemLabel ?itemAltLabel ?coord ?country ?place WHERE { ' +
		'hint:Query hint:optimizer "None". ' + // disable optimizer (makes query faster)
		'{SELECT ?item ?coord ?country ?place WHERE { ' +
		makeSubqueryLibraries(query, 0) + // results 1-50
		makeSubqueryLibraries(query, 50) + // results 51-100
		// '?item wdt:P31/wdt:P279* wd:Q1030034. ' +
		'?item wdt:P31/wdt:P279* wd:Q43229. ' +
		'hint:Prior hint:gearing "forward". ' +
		'OPTIONAL {?item wdt:P625 ?coord}' +
		'OPTIONAL {?item wdt:P17 ?country}' +
		'OPTIONAL {?item wdt:P131 ?place}' +
		'} LIMIT 50}' +
		'SERVICE wikibase:label {' +
				'bd:serviceParam wikibase:language "[AUTO_LANGUAGE],it,la,en,fr" . ' +
		'}' +
		'}'
}

// SPARQL query for places
function makeLocationQuery(query) {
		return 'SELECT DISTINCT (?item as ?value) ?itemLabel ?itemAltLabel WHERE { ' +
		'hint:Query hint:optimizer "None". ' + // disable optimizer (makes query faster)
		'{SELECT ?item WHERE { ' +
		makeSubquery(query, 0) + // results 1-50
		makeSubquery(query, 50) + // results 51-100
		'{ ?item wdt:P31/wdt:P279* wd:Q15284. } ' +
		' UNION ' +
		' {	?item wdt:P31/wdt:P279* wd:Q515 . }' +
		// 'hint:Prior hint:gearing "forward". ' +
		'} LIMIT 50}' +
		'SERVICE wikibase:label {' +
				'bd:serviceParam wikibase:language "[AUTO_LANGUAGE],it,la,en,fr" . ' +
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
			'bd:serviceParam wikibase:language "[AUTO_LANGUAGE],it,la,en,fr" . ' +
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
									// For works, add name of the author
									if (type === 'work') {
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

// Add Wikidata autocomplete for works and authors
function runWikidataQuery(queryType, userInput, callback) {
		let query = '';

		if (queryType === 'work') {
				query = makeworkQuery(userInput);
		}
		else if (queryType === 'author') {
				query = makeAuthorQuery(userInput);
		}
		else if (queryType === 'library') {
				query = makeLibraryQuery(userInput);
	}
		else if (queryType === 'place') {
				query = makePlaceQuery(userInput);
		}
		else if (queryType === 'location') {
			query = makeLocationQuery(userInput);
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

// Function to empty modal fields
function emptyModalFields() {
	$('.add-modal').attr('target', '');
	$('.add-modal input').val('').blur();
}

// Function to fill author field
function fillAuthorField(context) { 
	$('#id_author').val(context.name);
		$('#id_author_iri').val(context.iri);
		context.preventFocus = true;
		$('#id_author').trigger('autocomplete.select', context);
		emptyModalFields();
}


// Function to fill work field
function fillworkField(context) {
		$('#id_work').val(context.name);
		$('#id_work_iri').val(context.iri);
		context.preventFocus = true;
		$('#id_work').trigger('autocomplete.select', context);
		emptyModalFields();
}

// Function to fill author field
function fillLibraryField(context, target) {
		//console.log(target);
		$('#'+target).val(context.name);
		$('#'+target + '_iri').val(context.iri);
		context.preventFocus = true;
		$('#'+target).trigger('autocomplete.select', context);
		emptyModalFields();
}

// Function to fill author field
function fillLocationField(context, target) {
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

// Function to fill author field
function fillSourceField(context, target) {
	//console.log(target);
	$('#'+target).val(context.name);
	$('#'+target + '_iri').val(context.iri);
	context.preventFocus = true;
	$('#'+target).trigger('autocomplete.select', context);
	emptyModalFields();
}