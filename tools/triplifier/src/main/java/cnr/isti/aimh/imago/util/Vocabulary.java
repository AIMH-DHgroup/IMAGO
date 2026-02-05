package cnr.isti.aimh.imago.util;

import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.Property;
import org.apache.jena.rdf.model.Resource;

public class Vocabulary {

    
	// Prefixes
	public static final String foaf = "http://xmlns.com/foaf/0.1/";
	public static final String efrbroo = "http://erlangen-crm.org/efrbroo/";
  public static final String ilrmoo = "http://imagoarchive.it/ilrmoo/";
	public static final String cnt = "http://www.w3.org/2011/content#";
	public static final String ecrm = "http://erlangen-crm.org/200717/";
	public static final String crminf = "https://dlnarratives.eu/crminf/";
	public static final String dc = "http://purl.org/dc/elements/1.1/";
	public static final String dctypes = "http://purl.org/dc/dcmitype/";
	public static final String rdfs = "http://www.w3.org/2000/01/rdf-schema#";
	public static final String dcterms = "http://purl.org/dc/terms/";
	public static final String narra = "https://dlnarratives.eu/ontology#";
	public static final String wikidata = "http://wikidata.org/entity/";
	public static final String time = "http://www.w3.org/2006/time#";
	public static final String imago = "https://imagoarchive.it/ontology/";
	public static final String geosparql = "http://www.opengis.net/ont/geosparql#";


  // Resources eCRM
  public Resource e19_physical_object;
  public Resource e35_title;
  public Resource e39_actor;
  public Resource e41_appellation;
  public Resource e42_identifier;
  public Resource e52_time_span;
  public Resource e53_place;
  public Resource e90_symbolic_object;
  public Resource e94_space_primitive;

  // Resources eFRBRoo
  public Resource f2_expression;
  public Resource f3_manifestation;
  public Resource f5_item;
  public Resource f11_corporate_body;
  public Resource f28_expression_creation;
  public Resource f30_manifestation_creation;

  // Resources imago
  public Resource folios;
  public Resource genre;
  public Resource toponym;
  public Resource curator;
  public Resource manuscript;
  public Resource print_edition;
  public Resource author;
  public Resource library;
  public Resource publisher;
  public Resource format;
  public Resource edition;
  public Resource ecdotic_typology;

  // Properties eCRM
  public Property p1_is_identified_by;
  public Property p2_has_type;
  public Property p3_has_note;
  public Property p4_has_time_span;
  public Property p7_took_place_at;
  public Property p14_carried_out_by;
  public Property p46_is_composed_of;
  public Property p50_has_current_keeper;
  public Property p67_refers_to;
  public Property p74_has_current_or_former_residence;
  public Property p102_has_title;
  public Property p106_is_composed_of;
  public Property p106i_forms_part_of;
  public Property p168_place_is_defined_by;
  public Property p170i_time_is_defined_by;
  public Property p190_has_symbolic_content;

  // Properties eFRBRoo
  public Property r4_embodies;
  public Property r7i_is_materialized_in;
  public Property r15_has_fragment;
  public Property r17_created;
  public Property r18_created;
  public Property r24_created;
  public Property r69_specifies_phisical_form;

  // Properties imago
  public Property has_curator;
  public Property has_genre;
  public Property has_genre_name;
  public Property has_textual_place;
  public Property has_vdl_explanation;
  public Property has_primary_source;
  public Property has_secondary_sources;
  public Property has_publisher;
  public Property has_figure_note;
  public Property has_introduction_note;
  public Property has_reprint_date;
  public Property has_ecdotic_type;
  public Property is_identified_by_toponym;
  public Property is_incipit_dedication_of;
  public Property is_explicit_dedication_of;
  public Property is_text_incipit_of;
  public Property is_text_explicit_of;
  public Property is_composed_of_place_name;
  public Property is_identified_in_the_printed_edition_by;
  public Property has_url_manuscript;
  public Property has_url_manuscript_description;
  public Property has_other_contents;
  public Property has_abstract;
  public Property has_decoration;
  public Property compiled_form;
  public Property last_mod_form;
  public Property has_start_date;
  public Property has_end_date;
  public Property has_alias;

  // Properties GeoSPAQRL
  public Property asWKT;


  public Vocabulary(Model model){

    // Resources eCRM
    this.e19_physical_object = model.getResource(Vocabulary.ecrm + "E19_Physical_Object");
    this.e35_title = model.getResource(Vocabulary.ecrm + "E35_Title");
    this.e39_actor = model.getResource(Vocabulary.ecrm + "E39_Actor");
    this.e41_appellation = model.getResource(Vocabulary.ecrm + "E41_Appellation");
    this.e42_identifier = model.getResource(Vocabulary.ecrm + "E42_Identifier");
    this.e52_time_span = model.getResource(Vocabulary.ecrm + "E52_Time-Span");
    this.e53_place = model.getResource(Vocabulary.ecrm + "E53_Place");
    this.e90_symbolic_object = model.getResource(Vocabulary.ecrm + "E90_Symbolic_Object");
    this.e94_space_primitive = model.getResource(Vocabulary.ecrm + "E94_Space_Primitive");

    // Resources eFRBRoo
    this.f2_expression = model.getResource(Vocabulary.ilrmoo + "F2_Expression");
    this.f3_manifestation = model.getResource(Vocabulary.ilrmoo + "F3_Manifestation");
    this.f5_item = model.getResource(Vocabulary.ilrmoo + "F5_Item");
    this.f11_corporate_body = model.getResource(Vocabulary.ilrmoo + "F11_Corporate_Body");
    this.f28_expression_creation = model.getResource(Vocabulary.ilrmoo + "F28_Expression_Creation");
    this.f30_manifestation_creation = model.getResource(Vocabulary.ilrmoo + "F30_Manifestation_Creation");

    // Resources imago
    this.folios = model.getResource(Vocabulary.imago + "Folios");
    this.genre = model.getResource(Vocabulary.imago + "Genre");
    this.toponym = model.getResource(Vocabulary.imago + "Toponym");
    this.curator = model.getResource(Vocabulary.imago + "Curator");
    this.manuscript = model.getResource(Vocabulary.imago + "Manuscript");
    this.print_edition = model.getResource(Vocabulary.imago + "Printed_Edition");
    this.author = model.getResource(Vocabulary.imago + "Author");
    this.library = model.getResource(Vocabulary.imago + "Library");
    this.publisher = model.getResource(Vocabulary.imago + "Publisher");
    this.format = model.getResource(Vocabulary.imago + "Format");
    this.edition = model.getResource(Vocabulary.imago + "Edition");
    this.ecdotic_typology = model.getResource(Vocabulary.imago + "Typology");

    // Properties eCRM
    this.p1_is_identified_by = model.getProperty(Vocabulary.ecrm + "P1_is_identified_by");
    this.p2_has_type = model.getProperty(Vocabulary.ecrm + "P2_has_type");
    this.p3_has_note = model.getProperty(Vocabulary.ecrm + "P3_has_note");
    this.p4_has_time_span = model.getProperty(Vocabulary.ecrm + "P4_has_time-span");
    this.p7_took_place_at = model.getProperty(Vocabulary.ecrm + "P7_took_place_at");
    this.p14_carried_out_by = model.getProperty(Vocabulary.ecrm + "P14_carried_out_by");
    this.p46_is_composed_of = model.getProperty(Vocabulary.ecrm + "P46_is_composed_of");
    this.p50_has_current_keeper = model.getProperty(Vocabulary.ecrm + "P50_has_current_keeper");
    this.p67_refers_to = model.getProperty(Vocabulary.ecrm + "P67_refers_to");
    this.p74_has_current_or_former_residence = model.getProperty(Vocabulary.ecrm + "P74_has_current_or_former_residence");
    this.p102_has_title = model.getProperty(Vocabulary.ecrm + "P102_has_title");
    this.p106_is_composed_of = model.getProperty(Vocabulary.ecrm + "P106_is_composed_of");
    this.p106i_forms_part_of = model.getProperty(Vocabulary.ecrm + "P106i_forms_part_of");
    this.p168_place_is_defined_by = model.getProperty(Vocabulary.ecrm + "P168_place_is_defined_by");
    this.p170i_time_is_defined_by = model.getProperty(Vocabulary.ecrm + "P170i_time_is_defined_by");
    this.p190_has_symbolic_content = model.getProperty(Vocabulary.ecrm + "P190_has_symbolic_content");

    // Properties eFRBRoo

    this.r4_embodies = model.getProperty(Vocabulary.ilrmoo + "R4_embodies");
    this.r7i_is_materialized_in = model.getProperty(Vocabulary.ilrmoo + "R7i_is_materialized_in");
    this.r15_has_fragment = model.getProperty(Vocabulary.ilrmoo + "R15_has_fragment");
    this.r17_created = model.getProperty(Vocabulary.ilrmoo + "R17_created");
    this.r18_created = model.getProperty(Vocabulary.ilrmoo + "R18_created");
    this.r24_created = model.getProperty(Vocabulary.ilrmoo + "R24_created");
    this.r69_specifies_phisical_form = model.getProperty(Vocabulary.ilrmoo + "R69_has_physical_form");

    // Properties imago
    this.has_curator = model.getProperty(Vocabulary.imago + "has_curator");
    this.has_genre = model.getProperty(Vocabulary.imago + "has_genre");
    this.has_genre_name = model.getProperty(Vocabulary.imago + "has_genre_name");
    this.has_textual_place = model.getProperty(Vocabulary.imago + "has_textual_place");
    this.has_vdl_explanation = model.getProperty(Vocabulary.imago + "has_vdl_explanation");
    this.has_primary_source = model.getProperty(Vocabulary.imago + "has_primary_source");
    this.has_secondary_sources = model.getProperty(Vocabulary.imago + "has_secondary_source");
    this.has_publisher = model.getProperty(Vocabulary.imago + "has_publisher");
    this.has_figure_note = model.getProperty(Vocabulary.imago + "has_figure_note");
    this.has_introduction_note = model.getProperty(Vocabulary.imago + "has_introduction_note");
    this.has_reprint_date = model.getProperty(Vocabulary.imago + "has_reprint_date");
    this.has_ecdotic_type = model.getProperty(Vocabulary.imago + "has_ecdotic_type");
    this.is_identified_by_toponym = model.getProperty(Vocabulary.imago + "is_identified_by_toponym");
    this.is_incipit_dedication_of = model.getProperty(Vocabulary.imago + "is_incipit_dedication_of");
    this.is_explicit_dedication_of = model.getProperty(Vocabulary.imago + "is_explicit_dedication");
    this.is_text_incipit_of = model.getProperty(Vocabulary.imago + "is_text_incipit_of");
    this.is_text_explicit_of = model.getProperty(Vocabulary.imago + "is_text_explicit_of");
    this.is_composed_of_place_name = model.getProperty(Vocabulary.imago + "is_composed_of_place_name");
    this.is_identified_in_the_printed_edition_by = model.getProperty(Vocabulary.imago + "is_identified_in_the_printed_edition_by");
    this.has_url_manuscript = model.getProperty(Vocabulary.imago + "has_url_manuscript");
    this.has_url_manuscript_description = model.getProperty(Vocabulary.imago + "has_url_manuscript_description");
    this.has_other_contents = model.getProperty(Vocabulary.imago + "has_other_contents");
    this.has_abstract = model.getProperty(Vocabulary.imago + "has_abstract");
    this.has_decoration = model.getProperty(Vocabulary.imago + "has_decoration");
    this.compiled_form = model.getProperty(Vocabulary.imago + "compiled_form");
    this.last_mod_form = model.getProperty(Vocabulary.imago + "last_mod_form");
    this.has_start_date = model.getProperty(Vocabulary.imago + "has_start_date");
    this.has_end_date = model.getProperty(Vocabulary.imago + "has_end_date");
    this.has_alias = model.getProperty(Vocabulary.imago + "has_alias");

    // Properties GeoSPARQL
    this.asWKT = model.getProperty(Vocabulary.geosparql + "asWKT");

  }

    
}
