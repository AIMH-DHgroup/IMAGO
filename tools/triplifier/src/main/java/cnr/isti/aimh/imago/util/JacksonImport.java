package cnr.isti.aimh.imago.util;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import cnr.isti.aimh.imago.pojo.full.Root;
import cnr.isti.aimh.imago.pojo.toponyms.Toponym;


public class JacksonImport {

	private List<Toponym> list_toponyms;
	private List<Root> list_lemmas;


	public JacksonImport(String file, Character type) throws IOException{
		// read json file data to String
		byte[] jsonData = Files.readAllBytes(Paths.get(file));
		
		//create ObjectMapper instance
		ObjectMapper objectMapper = new ObjectMapper();
		
		//convert json string to object
		switch(type){
		case 'D':
			this.list_toponyms = objectMapper.readValue(jsonData, new TypeReference<List<Toponym>>(){});
			break;
		case 'I':
			this.list_lemmas = objectMapper.readValue(jsonData, new TypeReference<List<Root>>(){});
			break;
		default:
			break;
		}
	}

	public List<Toponym> getList_toponyms() {
		return list_toponyms;
	}


	public void setList_toponyms(List<Toponym> list_toponyms) {
		this.list_toponyms = list_toponyms;
	}

	public List<Root> getList_lemmas() {
		return list_lemmas;
	}

	public void setList_lemmas(List<Root> list_lemmas) {
		this.list_lemmas = list_lemmas;
	}


    
    public static void main(String[] args) throws IOException {

		// ConfigProperties prop = new ConfigProperties("config.properties");
		// Fuseki fusekiKB = new Fuseki(prop.getDataset_url(), prop.getFuseki_user(), prop.getFuseki_pw());


		//read json file data to String
// 		byte[] jsonData = Files.readAllBytes(Paths.get("toponyms.json"));
		
// 		//create ObjectMapper instance
// 		ObjectMapper objectMapper = new ObjectMapper();
		
// 		//convert json string to object
// //		LemmaPrincipale emp = objectMapper.readValue(jsonData, LemmaPrincipale.class);
// 		List<Toponym> emp = objectMapper.readValue(jsonData, new TypeReference<List<Toponym>>(){});
		

//         OntModel model = ModelToponyms.populateModel(ModelToponyms.importModel("https://imagoarchive.it/onto/IMAGO-270222.ttl"), emp);

// 		// model.write(System.out, "TTL") ;

// 		// for (Toponym e : emp) {
// 		// 	  // code block to be executed
// 		// 		System.out.println("Lemma Object\n"+e );
// 		// 	}

//         // Controllo se il modello � valido
// 		// InfModel infmodel = ModelFactory.createRDFSModel(model);
// 		// ValidityReport validity = infmodel.validate();
// 		// if (validity.isValid()) {
// 		// 	// System.out.println("VALIDAZIONE - Il modello è valido\n");
// 		// }
// 		// else {
// 		// 	// STAMPA ERRORI DI VALIDAZIONE
// 		// 	Iterator<Report> reports = validity.getReports();
// 		// 	while(reports.hasNext()) {
// 		// 		// System.out.println("\nERRORE - Il modello non � valido: " + reports.next() + "\n");
// 		// 	}
// 		// }

//         String datasetURL = "https://imagoarchive.it/fuseki/imago";
// 		// String sparqlEndpoint = datasetURL + "/sparql";
// 		// String sparqlUpdate = datasetURL + "/update";
// 		// String graphStore = datasetURL + "/data";
		
// 		RDFConnection conneg = RDFConnectionFactory.connectPW(datasetURL,"fusekitomcat", "C4mbiam1Adess0" );
// 		conneg.update("CLEAR DEFAULT" );
// 		conneg.put(datasetURL+"/toponyms", model);
//         // conneg.load(model); // add the content of model to the triplestore

        }
}
