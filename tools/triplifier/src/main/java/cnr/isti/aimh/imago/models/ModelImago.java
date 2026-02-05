package cnr.isti.aimh.imago.models;

import java.net.URISyntaxException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.TimeZone;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.Date;

import org.apache.jena.ontology.OntDocumentManager;
import org.apache.jena.ontology.OntModel;
import org.apache.jena.ontology.OntModelSpec;
import org.apache.jena.rdf.model.Literal;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.vocabulary.RDF;
import cnr.isti.aimh.imago.pojo.full.*;
import cnr.isti.aimh.imago.util.Vocabulary;

/**
 * This is the class to create and populate with individuals the ontology of IMAGO project.
 * The model is an extension of CIDOC CRM and LRMoo (the reformulation of FRBRoo)
 */
public class ModelImago {
    


	// Base URI of the IMAGO ontology
	private static String baseURI = "https://imagoarchive.it/ontology/";
	private static HashMap<String, Resource> blank_author = new HashMap<String, Resource>();
	private static HashMap<String, Resource> blank_library = new HashMap<String, Resource>();
	private static HashMap<String, Resource> blank_coordinates = new HashMap<String, Resource>();
	
	


	/**
	 * Initialize the model and import the ontology by url
	 * 
	 * @param url 	the url with the ontology
	 * @return 		the ontologic model
	 */
	public static OntModel importModel(String url) {
		OntDocumentManager mgr = new OntDocumentManager();
		// set mgr's properties now
		mgr.addIgnoreImport("http://imagoarchive.it/ilrmoo/");
		mgr.addIgnoreImport("http://erlangen-crm.org/200717/");
		mgr.addIgnoreImport("https://imagoarchive.it/thes/tid/");
		// now use it
		OntModelSpec s = new OntModelSpec( OntModelSpec.OWL_DL_MEM );
		s.setDocumentManager( mgr );
		OntModel onto = ModelFactory.createOntologyModel(s);
		// System.out.println(url);
		onto.read(url); // Jena function to read the remote ontology 
		return onto;

	}

	/**
	 * Convert coordinates into WKT format
	 * WKT format of a point is POINT (30 10)
     * 
     * @param lat   latitude
     * @param lon   longitude
     * @return      a string in WKT of a point
	 */
	public static String toWKT(String lat, String lon){
		return "POINT(" + lon + " " + lat + ")";
	}

	/**
	 * A function to memorize a blank node in a hashmap
	 * or to get an already present blank node
	 * 
	 * @param map		the hasmap with the blanknodes
	 * @param iri		the iri to check
	 * @param model		the model
	 * @return			the new or getted blank node
	 */
	public static Resource checkBlankNode(HashMap<String, Resource> map, String iri, OntModel model){
		Resource _b = null;
		if(!map.containsKey(iri)){
			_b = model.createResource();
			map.put(iri, _b);

		}else{
			_b = map.get(iri);
		}
		return _b;
	}

	/**
	 * Check if a string has at least one latin character
	 * 
	 * @param string the string to check
	 * @return boolean
	 */
	public static boolean checkLatinWords(String string){
		String regex =  ".*\\p{IsLatin}.*";

		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(string);

		if (matcher.matches()) {
			return true;
		} else{
			return false;
		}

	}
	/**
	 * 
	 * @param input
	 * @return
	 */
	private static String removePartBeforeComma(String input) {
        // Define the regex pattern with optional leading whitespaces
        // Pattern pattern = Pattern.compile("\\s*.*,\\s*(.*)");
		// Pattern pattern = Pattern.compile(".*,\\s*(.*)");
		Pattern pattern = Pattern.compile("^[^,]*,\\s*(.*)");


        // Match the pattern against the input string
        Matcher matcher = pattern.matcher(input);

        // Check if the pattern is found
        if (matcher.matches()) {
            // Group 1 contains the part after the comma
            return matcher.group(1);
        } else {
            // Return the original string if no match is found
            return input;
        }
    }

	/**
     * This function populate the ontology from a list of imported lemmas
     * 
     * @param model     the model imported from the function importModel
     * @param lemmas    the list of lemmas imported from a json
     * @return          the model with the individuals
	 * @throws URISyntaxException
     *  
     */
	public static OntModel populateModel(OntModel model, List<Root> lemmas) {

        // It initializes Vocabulary class contains all the resources and all
        // the properties of the Ontology
        Vocabulary vocabulary = new Vocabulary(model);

        /* NAMING
        * - The Resources have the r_ prefixed in the name of the variable
        * - The literals have the l_ prefixed in the name of the variable
        * - The properties have the p_ prefixed in the name of the variable
		* - The Blank Nodes have the _b_ prefixed in the name of the variable
        */

		int m_count = 1;
		int p_count = 1;
		for (Root e : lemmas) { // For any lemma

			// try{

			
			

			int id = e.getId();                         // get the lemma id
			Lemma lemma = e.getLemma();                 // get the lemma content
			String lemmaURI = baseURI + "resources/lemma/l" + id; // Make  the IRI of lemma (ie expression creation)

			Boolean review = lemma.getReview();
			
			////////////////////
			// MAKE RESOURCES //
			////////////////////
			
			//  Make author resource getting the iri from the object author inside the object lemma
			// ex. http://www.mirabileweb.it/author/christophorus-bondelmontius-n-1385-ca-m-post-1430-author/22278
			Resource r_author = model.createResource(lemma.getAuthor().getIri());
			// Make work resource getting the iri of the work inside the lemma object
			// ex. http://www.mirabileweb.it/title/descriptio-insulae-cretae-title/4834
			Resource r_work = model.createResource(lemma.getWork().getIri());
			// Make the resource Expression Creation. As IRI we pass the lemma IRI created above
			// ex. https://https://www.imagoarchive.it/ontology/resources/lemma/0000
			Resource r_expression_creation = model.createResource(lemmaURI);

			
			// Literal l_italian_author_name = model.createTypedLiteral(lemma.getAuthor().getAlias().get(0));
			Literal l_italian_author_name = model.createTypedLiteral(lemma.getAuthor().getName());
			Literal l_work_title = model.createTypedLiteral(lemma.getWork().getTitle());
			Literal l_abstract = model.createTypedLiteral(lemma.getAbstract());


			///////////
			// LEMMA //
			///////////

			// Creating resources 

			// Create literals 

			// Create blank nodes

			model.add(r_author, RDF.type, vocabulary.author);
			model.add(r_work, RDF.type, vocabulary.f2_expression);
			model.add(r_expression_creation, RDF.type, vocabulary.f28_expression_creation);


			model.add(r_expression_creation, vocabulary.p14_carried_out_by, r_author);
			model.add(r_expression_creation, vocabulary.r17_created, r_work);

			if(lemma.getAbstract()!=null){
				model.add(r_expression_creation, vocabulary.has_abstract, l_abstract);
			}

			
			String date_author = lemma.getAuthor().getStringDatazione();
			Resource r_date_author =  null;
			Literal l_date_author =  null;
			Resource _b_author = checkBlankNode(blank_author, lemma.getAuthor().getIri(), model);
			

			model.add(r_author, vocabulary.p1_is_identified_by, _b_author);
			model.add(_b_author, vocabulary.p190_has_symbolic_content, l_italian_author_name);

			if(date_author!=null){ 
				r_date_author =  model.createResource(lemma.getAuthor().getIri()+"/datazione");
				l_date_author =  model.createTypedLiteral(date_author);  
				model.add(r_date_author, RDF.type, vocabulary.e52_time_span); 
				model.add(r_author, vocabulary.p4_has_time_span, r_date_author);
				model.add(r_date_author, vocabulary.p170i_time_is_defined_by, l_date_author);
			}

			// Forse si può fare più semplicemente
			// model.add(r_author, vocabulary.p1_is_identified_by, l_italian_author_name);
			for (String element : lemma.getAuthor().getAlias()) {
				Literal alias = model.createTypedLiteral(element);
				model.add(_b_author, vocabulary.has_alias, alias);
			}

			Resource _b_work = model.createResource();
			model.add(r_work, vocabulary.p102_has_title, _b_work);
			model.add(_b_work, vocabulary.p190_has_symbolic_content, l_work_title);


			
			for(Genre genre : lemma.getGenres()) { // for any genre in lemma
				Resource r_genre = model.createResource(genre.getIri());
				Literal l_genre = model.createTypedLiteral(genre.getName());
				model.add(r_genre, RDF.type, vocabulary.genre);
				model.add(r_work, vocabulary.has_genre, r_genre);
				model.add(r_genre, vocabulary.has_genre_name, l_genre);
			}

            for(Place place : lemma.getPlaces()) {
            	String place_iri = place.getIri();
            	Resource r_place = model.createResource(place_iri);
				Literal l_toponym;
				String t_name;
				
				if(place.getName()!=null){
					// System.out.println(checkLatinWords(place.getName()));
					// Replace matched characters with an empty string
					if (checkLatinWords(place.getName())) {
						
						t_name = place.getName().replaceAll(" ", "_").replaceAll("[^a-zA-Z0-9\\s]", "").toLowerCase();
						l_toponym = model.createTypedLiteral(place.getName());
						
					} else {
						 if(place.getEnglishName()!=null){
							t_name = place.getEnglishName().replaceAll(" ", "_").replaceAll("[^a-zA-Z0-9\\s]", "").toLowerCase();
							l_toponym = model.createTypedLiteral(place.getEnglishName());
						 }else{
							t_name = place.getItalianName().replaceAll(" ", "_").replaceAll("[^a-zA-Z0-9\\s]", "").toLowerCase();
							l_toponym = model.createTypedLiteral(place.getItalianName());
						 }
					}
				
				
				// if(place.getName()!=null){
				// 	t_name = place.getName().replaceAll(" ", "_").toLowerCase();
				// }else if(place.getEnglishName()!=null){
				// 	t_name = place.getEnglishName().replaceAll(" ", "_").toLowerCase();
				// }else {
				// 	t_name = place.getItalianName().replaceAll(" ", "_").toLowerCase();
				// }

				
            	Resource r_toponym = model.createResource(baseURI + "resources/toponym/" + t_name); // che iri dare? 
				// nei toponimi String toponymURI = e.getName().replaceAll(" ", "_").toLowerCase(); 
				Resource _b_coordinates = checkBlankNode(blank_coordinates, place_iri, model);
				
            	model.add(r_place, RDF.type, vocabulary.e53_place);
            	model.add(r_toponym, RDF.type, vocabulary.toponym);
            	model.add(r_work, vocabulary.p67_refers_to, r_place);
            	model.add(r_place, vocabulary.is_identified_by_toponym, r_toponym);
				model.add(r_toponym, vocabulary.p190_has_symbolic_content, l_toponym);

            	
				// if(toponym_name_ita!=null){
				// 	Literal l_toponym_ita = model.createLiteral(toponym_name_ita, "it");
				// 	model.add(r_toponym, vocabulary.p190_has_symbolic_content, l_toponym_ita);}
				// if(toponym_name_eng!=null){
				// 	Literal l_toponym_eng = model.createLiteral(toponym_name_eng, "en");
				// 	model.add(r_toponym, vocabulary.p190_has_symbolic_content, l_toponym_eng);}
				String wkt = place.getWkt();
				Literal l_wkt = model.createTypedLiteral(wkt, "http://www.opengis.net/ont/geosparql#wktLiteral");
            	// String lat = place.getLat();
            	// String lon = place.getLon();
				// System.out.println(place.getName());
				
				String coordinates = place.getCoordinates();
				// Literal l_coordinates_2 = model.createTypedLiteral(coordinates, "http://www.opengis.net/ont/geosparql#wktLiteral");
				// if(wkt==null || wkt.equals("")){
				// 	System.out.print(l_toponym + "----" + coordinates);
				// }

				// if(coordinates==null || coordinates.equals("")){
				// 	System.out.print(l_toponym + "----" + wkt);
				// }

				// WKT format POINT (30 10)
				// WKT format POINT (30 10)
				if(wkt!=null){
					if(!wkt.equals("")){
						model.add(r_place, vocabulary.asWKT, l_wkt);
					// }else{
					// 	if(coordinates!=null){
					// 		System.out.println(coordinates);
							
					// 		model.add(r_place, vocabulary.asWKT, l_coordinates_2);
							
					// 	}

					}
				}
				if(coordinates!=null){
            	Literal l_coordinates = model.createTypedLiteral(coordinates);
            	// model.add(e94_space_primitive, p190_has_symbolic_content, coordinates);
				
            	model.add(r_place, vocabulary.p168_place_is_defined_by, _b_coordinates);
				model.add(_b_coordinates, vocabulary.p190_has_symbolic_content, l_coordinates);
				}
				
            	model.add(r_work, vocabulary.p106_is_composed_of, r_toponym);
				// Non usiamo la country per il momento
			}

            }

			if(review==true){
            for(Manuscript manuscript : lemma.getManuscripts()) {

				// Get the strings from json
				// if(manuscript.getLibrary().getName()==""){
				// 	System.out.println(manuscript.getLibrary().getIri());
				// }
				String library_iri = manuscript.getLibrary().getIri();
				String library_place_iri = manuscript.getLibrary().getPlace().getIri();

				String library;
				String library_place;
					if(manuscript.getLibrary().getName()!=null){
						 
						if(checkLatinWords(manuscript.getLibrary().getName())){
							// Define the regex pattern
						 String pattern_iri = "https://imagoarchive\\.it/resource/.*";

						 // Use the matches method to check if the input matches the pattern
						 if(library_iri.matches(pattern_iri)){
							
							// System.out.println(manuscript.getLibrary().getName() + " -->" + removePartBeforeComma(manuscript.getLibrary().getName()));
							library = removePartBeforeComma(manuscript.getLibrary().getName());
						 }else{
							library = manuscript.getLibrary().getName();
						 }
						}else{
							if(manuscript.getLibrary().getEnglishName()!=null){
								library = manuscript.getLibrary().getEnglishName();
							} else {
								library = manuscript.getLibrary().getItalianName();
							}
						}
					}else{
						// System.out.println(lemma.getAuthor().getName());
						// System.out.println(lemma.getWork().getTitle());
						// System.out.println(library_iri);
						// System.ou	t.println(manuscript.getLibrary().getName());
						library_iri = baseURI + "resources/library/notKnown/" + m_count;
						library = "Sconosciuta";
					}
				
					if( manuscript.getLibrary().getPlace().getName()!=null){
						// System.out.println(manuscript.getLibrary().getName());
						// System.out.println(manuscript.getLibrary().getPlace().getName());
					if(checkLatinWords(manuscript.getLibrary().getPlace().getName())){
						library_place = manuscript.getLibrary().getPlace().getName();
					}else{
						if(manuscript.getLibrary().getPlace().getEnglishName()!=null){
							library_place = manuscript.getLibrary().getPlace().getEnglishName();
						} else {
							library_place = manuscript.getLibrary().getPlace().getItalianName();
						}
					}
				}else{
					// System.out.println(lemma.getAuthor().getName());
					// System.out.println(lemma.getWork().getTitle());
					// System.out.println(library_iri);
					// System.out.println(manuscript.getLibrary().getName());
						library_place_iri = baseURI + "resources/place/notKnown/" + m_count;
						library_place = "Sconosciuto";
					}
				
				String signature = manuscript.getSignature();
				String folios = manuscript.getFolios();
				String manuscript_author_name = manuscript.getAuthor();
				String manuscript_title = manuscript.getTitle();
				String incipit_dedication = manuscript.getIncipitDedication();
				String explicit_dedication = manuscript.getExplicitDedication();
				String incipit_text = manuscript.getIncipitText();
				String explicit_text = manuscript.getExplicitText();
				String date_manuscript = manuscript.getDateString();
				String start_date = manuscript.getDate().getStartDate();
				String end_date = manuscript.getDate().getEndDate();
				Calendar start_cal = Calendar.getInstance();
				Calendar end_cal = Calendar.getInstance();
				SimpleDateFormat sdf =  new SimpleDateFormat("yyyy");
				sdf.setTimeZone(TimeZone.getTimeZone("GMT"));
				if(!start_date.equals("")){
					// System.out.println(start_date);
					try {
						start_cal.setTime(sdf.parse(start_date));
					} catch (ParseException e1) {
						e1.printStackTrace();
					}// all done
				}
				// System.out.println(end_date.equals(""));
				if(!end_date.equals("")){
					try {
						end_cal.setTime(sdf.parse(end_date));
					} catch (ParseException e1) {
						e1.printStackTrace();
					}// all done
				}
				Literal l_start_date_manuscript = model.createTypedLiteral(start_cal);
				Literal l_end_date_manuscript = model.createTypedLiteral(end_cal);
					
				String sources = "";
				for(Source source : manuscript.getSources()) {
					sources += "<li><a href='" + source.getIri() + "'>" + source.getName() + "</a>, " + source.getSpecific() + " </li>";
				}

				
				
				// Parse the strings to make IRIs
				// System.out.println(lemmaURI +" " + library);
				String s_library = library.replaceAll(" ", "_").replaceAll("[^a-zA-Z0-9\\s]", "").toLowerCase();
				String s_library_place = library_place.replaceAll(" ", "_").replaceAll("[^a-zA-Z0-9\\s]", "").toLowerCase();
				String s_signature = signature.replaceAll(" ", "_").toLowerCase();
				String s_folios="";
				if(folios=="" || folios==" "){
					s_folios = "" + m_count;
					
				}else{
					s_folios = folios.replaceAll(" ", "_").replaceAll("[^a-zA-Z0-9\\s]", "").toLowerCase();
				}
				// Define all the iris
				String manuscript_iri = baseURI + "resources/manuscript/" + s_library_place + "/" + s_library + "/" + s_signature + "/" + s_folios;
				String manifestation_iri = baseURI + "resources/manifestation/manuscript/mm-" + m_count;
				String manifestation_creation_iri = baseURI + "resources/manifestation_creation/mmc-" + m_count;
				String signature_iri = baseURI + "resources/signature/ms-" + m_count;
				String folios_iri = baseURI + "resources/folios/mf-" + m_count;
				String incipit_dedication_iri = baseURI + "resources/incipit_dedication/mid-" + m_count;
				String explicit_dedication_iri = baseURI + "resources/explicit_dedication/med-" + m_count;
				String incipit_text_iri =  baseURI + "resources/incipit_text/mit-" + m_count;
				String explicit_text_iri =  baseURI + "resources/explicit_text/met-" + m_count;
				String date_manuscript_iri = baseURI + "resurces/manuscript/date/mdm-" + m_count;

				// Create all the resources
				Resource r_manuscript = null;
            	Resource r_manifestation = null;
				Resource r_library = null;
				Resource r_place_library = null;
				Resource r_signature = null;
				Resource r_folios = null;
				Resource r_incipit_dedication = null;
            	Resource r_explicit_dedication = null;
				Resource r_incipit_text = null;
				Resource r_explicit_text = null;
				Resource r_date_manuscript =  null;
				Resource r_manifestation_creation = null;
				Resource r_toponym_manuscript = null;

				r_manuscript = model.createResource(manuscript_iri);
            	r_manifestation = model.createResource(manifestation_iri);
				r_library = model.createResource(library_iri);
				r_place_library = model.createResource(library_place_iri);
				r_signature = model.createResource(signature_iri);
				if(folios!=null){ r_folios = model.createResource(folios_iri); }
				if(incipit_dedication!=null){	 r_incipit_dedication = model.createResource(incipit_dedication_iri); }
            	if(explicit_dedication!=null){	 r_explicit_dedication = model.createResource(explicit_dedication_iri); }
				if(incipit_text!=null){	 r_incipit_text = model.createResource(incipit_text_iri); }
				if(explicit_text!=null){	 r_explicit_text = model.createResource(explicit_text_iri); }
				if(date_manuscript!=null){ r_date_manuscript =  model.createResource(date_manuscript_iri); }
				r_manifestation_creation = model.createResource(manifestation_creation_iri); 
				r_toponym_manuscript = model.createResource(baseURI + "resources/toponym/" + library_place.replaceAll(" ", "_").replaceAll("[^a-zA-Z0-9\\s]", "").toLowerCase());

            	
				// Create all literals
				Literal l_manuscript_author = null;
				Literal l_manuscript_title = null;
				Literal l_coordinates = null;
				Literal l_library = null;
				Literal l_place = null;
				Literal l_signature = null;
				Literal l_folios = null;
				Literal l_incipit_dedication = null;
				Literal l_explicit_dedication = null;
				Literal l_incipit_text = null;
				Literal l_explicit_text = null;
				Literal l_date_manuscript =  null;
				Literal l_sources = null;
				Literal l_url_manuscript = null;
				Literal l_url_manuscript_description = null;
				Literal l_notes = null;
				Literal l_decoration = null;
				Literal l_annotator = null;
				Literal l_timestamp_form = null;

				

				if(manuscript_author_name!=null){ l_manuscript_author = model.createTypedLiteral(manuscript_author_name); }
				if(manuscript_title!=null){ l_manuscript_title = model.createTypedLiteral(manuscript_title); }
				// System.out.println(manuscript.getLibrary().getPlace().getCoordinates());
				if(manuscript.getLibrary().getPlace().getCoordinates()!=null){l_coordinates = model.createTypedLiteral(manuscript.getLibrary().getPlace().getCoordinates());}
				l_library = model.createTypedLiteral(library);
				l_place = model.createTypedLiteral(library_place);
				l_signature = model.createTypedLiteral(signature);
				if(folios!=null){  l_folios = model.createTypedLiteral(folios); }
				if(incipit_dedication!=null){ l_incipit_dedication = model.createTypedLiteral(incipit_dedication); }
				if(explicit_dedication!=null){ l_explicit_dedication = model.createTypedLiteral(explicit_dedication); }
				if(incipit_text!=null){ l_incipit_text = model.createTypedLiteral(incipit_text); }
				if(explicit_text!=null){ l_explicit_text = model.createTypedLiteral(explicit_text); }
				if(date_manuscript!=null){ l_date_manuscript =  model.createTypedLiteral(date_manuscript); }
				l_sources = model.createTypedLiteral(sources);
				if(manuscript.getNotes()!=null) l_notes = model.createTypedLiteral(manuscript.getNotes());
				if(manuscript.getDecoration()!=null) l_decoration = model.createTypedLiteral(manuscript.getDecoration());
				if(manuscript.getUrl()!=null){
					l_url_manuscript = model.createTypedLiteral(manuscript.getUrl()); 
				}
				if(manuscript.getUrlDescription()!=null){
					l_url_manuscript_description =  model.createTypedLiteral(manuscript.getUrlDescription()); 
				}
				l_annotator =  model.createTypedLiteral(manuscript.getAnnotator().getName() + " " + manuscript.getAnnotator().getSurname());
				long timestampMillis = (long) (manuscript.getLastMod() * 1000);
				Date d = new Date(timestampMillis);
				Calendar c = Calendar.getInstance();
				c.setTime(d);				
				l_timestamp_form = model.createTypedLiteral(c);
				


				// Create all blank nodes
				Resource _b_manuscript_author = null;
				Resource _b_manuscript_title = null;
				Resource _b_folios = null;
				Resource _b_library = null;
				Resource _b_coordinates = null;

				if(manuscript_author_name!=null){ _b_manuscript_author = model.createResource(); }
				if(manuscript_title!=null){ _b_manuscript_title = model.createResource();  }
				if(folios!=null){ _b_folios = model.createResource(); }
				_b_library = checkBlankNode(blank_library, library_iri, model);
				_b_coordinates = checkBlankNode(blank_coordinates, library_place_iri, model);

				// Declare all the statements rdf:type
				model.add(r_manuscript, RDF.type, vocabulary.manuscript);
				model.add(r_library, RDF.type, vocabulary.library);
				model.add(r_place_library, RDF.type, vocabulary.e53_place);
				model.add(r_signature, RDF.type, vocabulary.e42_identifier);
				if(folios!=null){ model.add(r_folios, RDF.type, vocabulary.folios); }
				if(incipit_dedication!=null){  model.add(r_incipit_dedication, RDF.type, vocabulary.e90_symbolic_object); }
				if(explicit_dedication!=null){ model.add(r_explicit_dedication, RDF.type, vocabulary.e90_symbolic_object); }
				if(incipit_text!=null){ model.add(r_incipit_text, RDF.type, vocabulary.e90_symbolic_object); }
				if(explicit_text!=null){ model.add(r_explicit_text, RDF.type, vocabulary.e90_symbolic_object); }
				model.add(r_manifestation, RDF.type, vocabulary.f3_manifestation);
				model.add(r_manifestation_creation, RDF.type, vocabulary.f30_manifestation_creation);
				if(date_manuscript!=null){ model.add(r_date_manuscript, RDF.type, vocabulary.e52_time_span); }

				// Declare all the triples
				model.add(r_manifestation, vocabulary.r7i_is_materialized_in, r_manuscript);
            	model.add(r_expression_creation, vocabulary.r18_created, r_manuscript);
            	model.add(r_manuscript, vocabulary.compiled_form, l_annotator);
            	model.add(r_manuscript, vocabulary.last_mod_form, l_timestamp_form);

				if(manuscript_author_name!=null){
					model.add(_b_manuscript_author, vocabulary.p106i_forms_part_of, r_manifestation);
					model.add(_b_manuscript_author, vocabulary.p190_has_symbolic_content, l_manuscript_author);
				}
				if(manuscript_title!=null){
					model.add(r_manuscript, vocabulary.p102_has_title, _b_manuscript_title);
					model.add(_b_manuscript_title, vocabulary.p190_has_symbolic_content, l_manuscript_title);
				}

				model.add(r_manuscript, vocabulary.p50_has_current_keeper, r_library);
            	model.add(r_library, vocabulary.p74_has_current_or_former_residence, r_place_library);
            	// model.add(r_library, vocabulary.p190_has_symbolic_content, l_library);
            	model.add(r_library, vocabulary.p1_is_identified_by, _b_library);
				model.add(_b_library, vocabulary.p190_has_symbolic_content, l_library);

				
				model.add(r_place_library, vocabulary.is_identified_by_toponym, r_toponym_manuscript);
				model.add(r_toponym_manuscript, vocabulary.p190_has_symbolic_content, l_place);
				if(manuscript.getLibrary().getPlace().getCoordinates()!=null){
				model.add(r_place_library, vocabulary.p168_place_is_defined_by, _b_coordinates);
				model.add(_b_coordinates, vocabulary.p190_has_symbolic_content, l_coordinates);
				}

				model.add(r_signature, vocabulary.p190_has_symbolic_content, l_signature);
            	model.add(r_manuscript, vocabulary.p1_is_identified_by, r_signature);
				if(folios!=null){
					model.add(r_manuscript, vocabulary.p46_is_composed_of, r_folios);
					model.add(r_folios, vocabulary.p1_is_identified_by, _b_folios);
					model.add(_b_folios, vocabulary.p190_has_symbolic_content, l_folios);
				}

				// incipit dedication
				if(incipit_dedication!=null){	
					model.add(r_incipit_dedication, vocabulary.p190_has_symbolic_content, l_incipit_dedication);
					model.add(r_incipit_dedication, vocabulary.is_incipit_dedication_of,r_manifestation);
				}

                //explicit proemio
				if(explicit_dedication!=null){	
					model.add(r_explicit_dedication, vocabulary.p190_has_symbolic_content, l_explicit_dedication);
					model.add(r_explicit_dedication, vocabulary.is_explicit_dedication_of,r_manifestation);
				}

				//incipit text
            	if(incipit_text!=null){	
					model.add(r_incipit_text, vocabulary.p190_has_symbolic_content, l_incipit_text);
					model.add(r_incipit_text, vocabulary.is_text_incipit_of, r_manifestation);
				}

                //explicit text
            	if(explicit_text!=null){	
					model.add(r_explicit_text, vocabulary.p190_has_symbolic_content, l_explicit_text);
					model.add(r_explicit_text, vocabulary.is_text_explicit_of,r_manifestation);
				}

				
				model.add(r_manifestation_creation, vocabulary.r24_created, r_manifestation);

				if(date_manuscript!=null){	
					model.add(r_manifestation_creation, vocabulary.p4_has_time_span, r_date_manuscript);
					model.add(r_date_manuscript, vocabulary.p170i_time_is_defined_by, l_date_manuscript);
				}

				if(!start_date.equals("")){
					model.add(r_manifestation_creation, vocabulary.has_start_date, l_start_date_manuscript);
				}

				if(!end_date.equals("")){
					model.add(r_manifestation_creation, vocabulary.has_end_date, l_end_date_manuscript);
				}

				if(sources!=null){
					model.add(r_manuscript, vocabulary.has_secondary_sources, l_sources);
				}

				if(manuscript.getUrl()!=null){
					model.add(r_manuscript, vocabulary.has_url_manuscript, l_url_manuscript);
				}

				if(manuscript.getUrlDescription()!=null){
					model.add(r_manuscript, vocabulary.has_url_manuscript_description, l_url_manuscript_description);
				}

				if(manuscript.getNotes()!=null){
					model.add(r_manuscript, vocabulary.p3_has_note, l_notes);
				}

				if(manuscript.getDecoration()!=null){
					model.add(r_manuscript, vocabulary.has_decoration, l_decoration);
				}

            	
				// TO-DO 

				// -[x] Link al manoscritto
				// -[x] Link alla descrizione del manoscritto
				// -[x] Decorazione / apparato iconografico
				// -[ ] Altre eventuali notizie (notes)


				m_count++;

            }
			for(PrintEdition print_edition: lemma.getPrintEditions()) {

				// Get the strings from json
				String edition = print_edition.getEdition();
				String ecdotic = print_edition.getEcdotic();
				String sources = "";
				for(Source source : print_edition.getSources()) {
					sources += "<li><a href='" + source.getIri() + "'>" + source.getName() + "</a>, " + source.getSpecific() + " </li>";
				}

				// Parse the strings to make IRIs
				
				String s_edition = edition.replaceAll(" ", "_").toLowerCase();
				String s_ecdotic = ecdotic.replaceAll(" ", "_").toLowerCase();

				// Define all the iris
				String print_edition_iri = baseURI + "resources/print_edition/pe-" + p_count; 
				String print_edition_creation_iri = baseURI + "resources/manifestation_creation/pmc-" + p_count; 
				String curator_iri = baseURI + "resources/print_edition/curator/pc-" + p_count;
				String date_print_edition_iri = baseURI + "resurces/print_edition/date/pd-" + p_count;
				String publisher_iri = baseURI + "resources/print_edition/publisher/ppu-" + p_count;
				String format_iri = baseURI + "resources/print_edition/format/pf-" + p_count;
				String pages_iri = baseURI + "resources/print_edition/pages/ppg-" + p_count;
				String edition_iri = baseURI + "resources/print_edition/edition/" + s_edition;
				String ecdotic_iri = baseURI + "resources/print_edition/edition/" + s_ecdotic;
				String place_as_appear = baseURI + "resources/print_edition/place/ppaa-" + p_count;

				// Create all the resources
				Resource r_print_edition = null;
				Resource r_print_edition_creation = null;
				Resource r_curator = null;
				Resource r_place_print_edition = null;
				Resource r_date_print_edition =  null;
				Resource r_publisher = null;
				Resource r_format = null;
				Resource r_pages = null;
				Resource r_edition = null;
				Resource r_ecdotic = null;
				Resource r_place_as_appear = null;
				Resource r_toponym_print_edition = null;

				r_print_edition = model.createResource(print_edition_iri);
				r_print_edition_creation = model.createResource(print_edition_creation_iri);

				String place_print_edition_iri = print_edition.getPlace().getIri();

				String place_print_edition = "";
				if(place_print_edition_iri!=null){
					if(checkLatinWords(print_edition.getPlace().getName())){
							place_print_edition = print_edition.getPlace().getName();
						}else{
							if(print_edition.getPlace().getEnglishName()!=null){
								place_print_edition = print_edition.getPlace().getEnglishName();
							} else {
								place_print_edition = print_edition.getPlace().getItalianName();
							}
						}
				}else{
						place_print_edition_iri = baseURI + "resources/printEdition/place/notKnown/" + p_count;
						place_print_edition = "Sconosciuto";
					}
				r_place_print_edition = model.createResource(place_print_edition_iri);
				// if(print_edition.getPlace().getName()!=null){
				r_toponym_print_edition = model.createResource(baseURI + "resources/toponym/" + place_print_edition.replaceAll(" ", "_").replaceAll("[^a-zA-Z0-9\\s]", "").toLowerCase());
				// }

				if(print_edition.getCurator()!=null) { r_curator = model.createResource(curator_iri); }
				// if(print_edition.getPlace().getName()!=null){ }
				if(print_edition.getDateString()!=null){r_date_print_edition =  model.createResource(date_print_edition_iri); }
				if(print_edition.getEditor()!=null){ r_publisher = model.createResource(publisher_iri); }
				if(print_edition.getFormat()!=null){ r_format = model.createResource(format_iri); }
				if(print_edition.getPages()!=null){ r_pages = model.createResource(pages_iri); }
				if(edition!=null){ r_edition = model.createResource(edition_iri); }
				if(ecdotic!=null){ r_ecdotic = model.createResource(ecdotic_iri); }
				if(print_edition.getPlaceAsAppear()!=null){ r_place_as_appear = model.createResource(place_as_appear);}
				
				
				

				// Create all literals
				Literal l_author_print_edition = null;
				Literal l_title_print_edition = null;
				Literal l_curator = null;
				Literal l_place_name_as_appear = null;
				Literal l_place_print_edition = null;
				Literal l_coordinates = null;
				Literal l_date_print_edition = null;
				Literal l_publisher = null;
				Literal l_format = null;
				Literal l_pages = null;
				Literal l_figure = null;
				Literal l_notes = null;
				Literal l_prefatore = null;
				Literal l_edition = null;
				Literal l_date_edition = null;
				Literal l_primary_sources = null;
				Literal l_ecdotic = null;
				Literal l_sources = null;
				Literal l_other_contents = null;
				Literal l_annotator = null;
				Literal l_timestamp_form = null;

				if(place_print_edition_iri!=null){
					l_place_print_edition = model.createTypedLiteral(place_print_edition);
					if(print_edition.getPlace().getCoordinates()!=null){
						l_coordinates = model.createTypedLiteral(print_edition.getPlace().getCoordinates());
					}
				}
				

				if(print_edition.getAuthor()!=null) l_author_print_edition = model.createTypedLiteral(print_edition.getAuthor());
				if(print_edition.getTitle()!=null)  l_title_print_edition = model.createTypedLiteral(print_edition.getTitle());
				if(print_edition.getCurator()!=null) l_curator = model.createTypedLiteral(print_edition.getCurator());
				if(print_edition.getPlaceAsAppear()!=null) l_place_name_as_appear = model.createTypedLiteral(print_edition.getPlaceAsAppear());
				
				// Literal l_place_print_edition = model.createTypedLiteral(print_edition.getPlace().getName());
				if(print_edition.getDateString()!=null) {
					
					l_date_print_edition = model.createTypedLiteral(print_edition.getDateString());
				}
				if(print_edition.getEditor()!=null) l_publisher = model.createTypedLiteral(print_edition.getEditor());
				if(print_edition.getFormat()!=null) l_format = model.createTypedLiteral(print_edition.getFormat());
				if(print_edition.getPages()!=null) l_pages = model.createTypedLiteral(print_edition.getPages());
				if(print_edition.getFigures()!=null) l_figure = model.createTypedLiteral(print_edition.getFigures());
				if(print_edition.getNotes()!=null) l_notes = model.createTypedLiteral(print_edition.getNotes());
				if(print_edition.getPrefator()!=null) l_prefatore = model.createTypedLiteral(print_edition.getPrefator());
				if(edition!=null) l_edition = model.createTypedLiteral(print_edition.getEdition());
				if(print_edition.getDateEdition()!=null) l_date_edition = model.createTypedLiteral(print_edition.getDateEdition());
				if(print_edition.getPrimarySources()!=null) l_primary_sources = model.createTypedLiteral(print_edition.getPrimarySources());
				if(ecdotic!=null) l_ecdotic = model.createTypedLiteral(ecdotic);
				if(sources!=null) l_sources = model.createTypedLiteral(sources);
				if(print_edition.getOtherContents()!=null) l_other_contents = model.createTypedLiteral(print_edition.getOtherContents());
				l_annotator =  model.createTypedLiteral(print_edition.getAnnotator().getName() + " " + print_edition.getAnnotator().getSurname());
				long timestampMillis = (long) (print_edition.getLastMod() * 1000);
				Date d = new Date(timestampMillis);
				Calendar c = Calendar.getInstance();
				c.setTime(d);				
				l_timestamp_form = model.createTypedLiteral(c);
				

				// Create all blank nodes
				Resource _b_print_edition_author = null;
				Resource _b_print_edition_title = null;
				Resource _b_curator = null;
				Resource _b_publisher = null;
				Resource _b_format = null;
				Resource _b_pages = null;
				Resource _b_coordinates = null;

				if(print_edition.getAuthor()!=null) _b_print_edition_author = model.createResource();
				if(print_edition.getTitle()!=null) _b_print_edition_title = model.createResource();
				if(print_edition.getCurator()!=null) _b_curator = model.createResource();
				if(print_edition.getEditor()!=null) _b_publisher = model.createResource();
				if(print_edition.getFormat()!=null) _b_format = model.createResource();
				if(print_edition.getPages()!=null) _b_pages = model.createResource();
				_b_coordinates = checkBlankNode(blank_coordinates, place_print_edition_iri, model);

				
				// Declare all the statements rdf:type
				model.add(r_print_edition_creation, RDF.type, vocabulary.f30_manifestation_creation);
				model.add(r_print_edition, RDF.type, vocabulary.print_edition);
				if(print_edition.getCurator()!=null) model.add(r_curator, RDF.type, vocabulary.curator);
				if(place_print_edition_iri!=null) model.add(r_place_print_edition, RDF.type, vocabulary.e53_place);
				if(print_edition.getPlaceAsAppear()!=null) {model.add(r_place_as_appear, RDF.type, vocabulary.e41_appellation);}
				if(print_edition.getDateString()!=null) model.add(r_date_print_edition, RDF.type, vocabulary.e52_time_span);
				if(print_edition.getEditor()!=null) model.add(r_publisher, RDF.type, vocabulary.publisher);
				if(print_edition.getFormat()!=null) model.add(r_format, RDF.type, vocabulary.format);
				if(print_edition.getPages()!=null) model.add(r_pages, RDF.type, vocabulary.e90_symbolic_object);
				if(edition!=null) model.add(r_edition, RDF.type, vocabulary.edition);
				if(ecdotic!=null) model.add(r_ecdotic, RDF.type, vocabulary.ecdotic_typology);

				// Declare all the triples
				model.add(r_print_edition, vocabulary.r4_embodies, r_work);
				model.add(r_print_edition_creation, vocabulary.r24_created, r_print_edition);
				model.add(r_print_edition, vocabulary.compiled_form, l_annotator);
            	model.add(r_print_edition, vocabulary.last_mod_form, l_timestamp_form);
				if(print_edition.getAuthor()!=null){
					model.add(r_print_edition, vocabulary.p106_is_composed_of, _b_print_edition_author);
					model.add(_b_print_edition_author, vocabulary.p190_has_symbolic_content, l_author_print_edition);
				}
				if(print_edition.getTitle()!=null){
					model.add(r_print_edition, vocabulary.p102_has_title, _b_print_edition_title);
					model.add(_b_print_edition_title, vocabulary.p190_has_symbolic_content, l_title_print_edition);
				}
				if(print_edition.getCurator()!=null){
					model.add(r_print_edition_creation, vocabulary.has_curator, r_curator);
					model.add(r_curator, vocabulary.p1_is_identified_by, _b_curator);
					model.add(_b_curator, vocabulary.p190_has_symbolic_content, l_curator);
				}
				if(place_print_edition_iri!=null){
					model.add(r_print_edition_creation, vocabulary.p7_took_place_at, r_place_print_edition);
					model.add(r_place_print_edition, vocabulary.is_identified_by_toponym, r_toponym_print_edition);
					model.add(r_toponym_print_edition, vocabulary.p190_has_symbolic_content, l_place_print_edition);
					
					if(print_edition.getPlace().getCoordinates()!=null){
						model.add(r_place_print_edition, vocabulary.p168_place_is_defined_by, _b_coordinates);
						model.add(_b_coordinates, vocabulary.p190_has_symbolic_content, l_coordinates);
					}
					
				}

				if(print_edition.getPlaceAsAppear()!=null) {
					model.add(r_print_edition, vocabulary.is_identified_in_the_printed_edition_by, r_place_as_appear);
					model.add(r_place_as_appear, vocabulary.p190_has_symbolic_content, l_place_name_as_appear);
					}

				if(print_edition.getDateString()!=null) {
					model.add(r_print_edition_creation, vocabulary.p4_has_time_span, r_date_print_edition);
					model.add(r_date_print_edition, vocabulary.p170i_time_is_defined_by, l_date_print_edition);
				}
				if(print_edition.getEditor()!=null){
				model.add(r_print_edition_creation, vocabulary.has_publisher, r_publisher);
				model.add(r_publisher, vocabulary.p1_is_identified_by, _b_publisher);
				model.add(_b_publisher, vocabulary.p190_has_symbolic_content, l_publisher);
				}		
				if(print_edition.getFormat()!=null){
					model.add(r_print_edition, vocabulary.r69_specifies_phisical_form, r_format);
					model.add(r_format, vocabulary.p1_is_identified_by, _b_format);
					model.add(_b_format, vocabulary.p190_has_symbolic_content, l_format);
				}
				if(print_edition.getPages()!=null){
					model.add(r_print_edition, vocabulary.p106_is_composed_of, r_pages);
					model.add(r_pages, vocabulary.p1_is_identified_by, _b_pages);
					model.add(_b_pages, vocabulary.p190_has_symbolic_content, l_pages);
				}
				if(print_edition.getFigures()!=null){
					model.add(r_print_edition, vocabulary.has_figure_note, l_figure);
				}
				if(print_edition.getNotes()!=null){
					model.add(r_print_edition, vocabulary.p3_has_note, l_notes);
				}
				if(print_edition.getPrefator()!=null){
					model.add(r_print_edition, vocabulary.has_introduction_note, l_prefatore);
				}
				if(edition!=null){
					model.add(r_print_edition, vocabulary.p2_has_type, r_edition);
					model.add(r_edition, vocabulary.p190_has_symbolic_content, l_edition);
				}
				if(print_edition.getDateEdition()!=null){
					model.add(r_print_edition, vocabulary.has_reprint_date, l_date_edition);
				}
				if(print_edition.getPrimarySources()!=null){
					model.add(r_print_edition, vocabulary.has_primary_source, l_primary_sources);
				}
				if(ecdotic!=null){
					model.add(r_print_edition, vocabulary.has_ecdotic_type, r_ecdotic);
					model.add(r_ecdotic, vocabulary.p190_has_symbolic_content, l_ecdotic);
				}
				if(sources!=null){
					model.add(r_print_edition, vocabulary.has_secondary_sources, l_sources);
				}
				if(print_edition.getOtherContents()!=null){
					model.add(r_print_edition, vocabulary.has_other_contents, l_other_contents);
				}

				
				

				p_count++;

			}

			// }catch(Exception ex) {
			// 	System.out.println("ERROR");
			// }
			}
		}
		return model;
	}


}
