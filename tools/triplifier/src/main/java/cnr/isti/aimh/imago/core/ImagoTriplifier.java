package cnr.isti.aimh.imago.core;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Scanner;
import org.apache.jena.ontology.OntModel;
import org.apache.jena.riot.Lang;
import org.apache.jena.riot.RDFDataMgr;
import cnr.isti.aimh.imago.models.ModelImago;
import cnr.isti.aimh.imago.models.ModelToponyms;
import cnr.isti.aimh.imago.util.ConfigProperties;
import cnr.isti.aimh.imago.util.Fuseki;
import cnr.isti.aimh.imago.util.JacksonImport;

public class ImagoTriplifier {
    
    private static Scanner input;

    /**
	 * Print menu
	 *
	 * @param autenticato	booleano che controlla se l'utente che visualizza il menu &egrave; autenticato
	 */
	public static void printMenu() {
		System.out.println();
		System.out.println("**************************************");
		System.out.println("****            Menu            ******");
		System.out.println("**************************************");
		
		System.out.println("*    [D]ante's toponyms triplify     *");
		System.out.println("*    [I]mago triplify                *");
		System.out.println("*    [E]xit                          *");
		System.out.println("**************************************");
	}
    
    public static void main(String[] args) throws IOException{

        input = new Scanner(System.in);

        // Read file config.properties
        ConfigProperties prop = new ConfigProperties("config.properties");

        Fuseki fusekiKB = new Fuseki(prop.getDataset_url(), prop.getFuseki_user(), prop.getFuseki_pw());

        // menu var
		char c;

        JacksonImport jin;

        // MENU
		do {
			// funzione che stampa le voci del menu
			printMenu();
			System.out.println();
			// inserisci la scelta
			System.out.print("Insert your choice: ");
			c = input.next().charAt(0);
			input.nextLine();
            
			
			switch (c) {
			case 'D' : // Dante's toponyms triplification
                jin = new JacksonImport(prop.getJson_toponyms(), c);
                OntModel model_toponyms = ModelToponyms.populateModel(ModelToponyms.importModel(prop.getImago_ontology()), jin.getList_toponyms());
                if(fusekiKB.InsertModelIntoGraph(model_toponyms, "toponyms")){
                    System.out.println("The model is triplified and put in IMAGO KB");
                }
				OutputStream out_toponyms = new FileOutputStream("toponyms-model.ttl");
				RDFDataMgr.write(out_toponyms, model_toponyms, Lang.TURTLE);
				break;
			case 'I' : // Imago lemmas triplification
				jin = new JacksonImport(prop.getJson_imago(), c);
				OntModel model_imago = ModelImago.populateModel(ModelImago.importModel(prop.getImago_ontology()), jin.getList_lemmas());
				// OntModel model_only_imago = ModelImago.importModel(prop.getImago_ontology());
				OutputStream out_imago = new FileOutputStream("imago-model.ttl");
				RDFDataMgr.write(out_imago, model_imago, Lang.TURTLE);
				if(fusekiKB.InsertModelIntoGraph(model_imago, "archive")){
                    System.out.println("The model is triplified and put in IMAGO KB");
                }				
				// OutputStream out_imago = new FileOutputStream("imago-model.ttl");
				// RDFDataMgr.write(out_imago, model_imago, Lang.TURTLE);
				// for(int i=0; i<100; i++){
				// 	fusekiKB.InsertModelIntoGraph("imago-model.ttl", "archive");
				// }
				break;
			case 'M' : // Imago MMM link
			if(fusekiKB.InsertModelIntoGraph("associazioni.ttl", "mmm")){
				System.out.println("The model is triplified and put in IMAGO KB");
			}
            }
		} while (c!='E');

        
             

        


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
