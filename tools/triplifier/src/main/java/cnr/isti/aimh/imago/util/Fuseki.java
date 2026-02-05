package cnr.isti.aimh.imago.util;

import org.apache.jena.ontology.OntModel;
import org.apache.jena.rdfconnection.RDFConnection;
import org.apache.jena.rdfconnection.RDFConnectionFactory;


public class Fuseki {

    private String dataset_url;
    private String sparql_endpoint = dataset_url + "/sparql";
    private String sparql_update = dataset_url + "/update";
    private String graph_store = dataset_url + "/data";

    private String username;
    private String password;

    public Fuseki(String dataset_url, String username, String password){
        this.dataset_url = dataset_url;
        this.username = username;
        this.password = password;
    }

    public Boolean InsertModelIntoGraph(OntModel model, String graph_name){
        RDFConnection conneg = RDFConnectionFactory.connectPW(this.dataset_url,this.username, this.password);
        // RDFConnection conneg = RDFConnectionFactory.connect(this.dataset_url);
        String graph_url = this.dataset_url + "/" + graph_name;
        System.out.println(graph_url);
        // conneg.delete(graph_url);
        conneg.put(graph_url, model);
        // conneg.update("DROP GRAPH <https://imagoarchive.it/fuseki/imago/archive> ;");
        // conneg.update("MOVE DEFAULT TO <https://imagoarchive.it/fuseki/imago/archive> ;");
        return true;
    }

    public Boolean InsertModelIntoGraph(String filename, String graph_name){
        RDFConnection conneg = RDFConnectionFactory.connectPW(this.dataset_url,this.username, this.password);
        // RDFConnection conneg = RDFConnectionFactory.connect(this.dataset_url);
        String graph_url = this.dataset_url + "/" + graph_name;
        System.out.println(graph_url);
        
        conneg.put(graph_url, filename);
        // conneg.delete(graph_url);
        return true;
    }

    // public Boolean InsertModelIntoGraph(String m, String graph_name){
    //     // RDFConnection conneg = RDFConnectionFactory.connectPW(this.dataset_url,this.username, this.password);
    //     RDFConnection conneg = RDFConnectionFactory.connect(this.dataset_url);
    //     String graph_url = this.dataset_url + "/" + graph_name;
    //     System.out.print(graph_url);
    //     conneg.put(graph_url, m);
    //     return true;
    // }

    public String getDataset_url() {
        return dataset_url;
    }

    public void setDataset_url(String dataset_url) {
        this.dataset_url = dataset_url;
    }

    public String getSparql_endpoint() {
        return sparql_endpoint;
    }

    public void setSparql_endpoint(String sparql_endpoint) {
        this.sparql_endpoint = sparql_endpoint;
    }

    public String getSparql_update() {
        return sparql_update;
    }

    public void setSparql_update(String sparql_update) {
        this.sparql_update = sparql_update;
    }

    public String getGraph_store() {
        return graph_store;
    }

    public void setGraph_store(String graph_store) {
        this.graph_store = graph_store;
    }

    public static void main(String[] args) {

        // Read file config.properties
        ConfigProperties prop = new ConfigProperties("config.properties");

        Fuseki fusekiKB = new Fuseki(prop.getDataset_url(), prop.getFuseki_user(), prop.getFuseki_pw());

        fusekiKB.InsertModelIntoGraph("imago-model.ttl", "archive");

    }

    
}
