package cnr.isti.aimh.imago.util;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class ConfigProperties {

        // get the property value and print it out
        private String dataset_url;
        
        private String imago_ontology;
        private String json_toponyms;
        private String json_imago;
        private String fuseki_user;
        private String fuseki_pw;

        


        public ConfigProperties(String file){
            try (InputStream input = new FileInputStream(file)) {

                Properties prop = new Properties();
    
                // load a properties file
                prop.load(input);
    
                // get the property value and print it out
                this.dataset_url = prop.getProperty("dataset.url");
                this.imago_ontology = prop.getProperty("imago.ontology");
                this.json_toponyms = prop.getProperty("json.toponyms");
                this.json_imago = prop.getProperty("json.imago");
                this.fuseki_user = prop.getProperty("fuseki.user");
                this.fuseki_pw = prop.getProperty("fuseki.pw");
                
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }

        public String getDataset_url() {
            return dataset_url;
        }

        public void setDataset_url(String dataset_url) {
            this.dataset_url = dataset_url;
        }

        public String getImago_ontology() {
            return imago_ontology;
        }

        public void setImago_ontology(String imago_ontology) {
            this.imago_ontology = imago_ontology;
        }

        public String getJson_toponyms() {
            return json_toponyms;
        }

        public void setJson_toponyms(String json_toponyms) {
            this.json_toponyms = json_toponyms;
        }

        public String getJson_imago() {
            return json_imago;
        }

        public void setJson_imago(String json_imago) {
            this.json_imago = json_imago;
        }

        public String getFuseki_user() {
            return fuseki_user;
        }

        public void setFuseki_user(String fuseki_user) {
            this.fuseki_user = fuseki_user;
        }
        
        public String getFuseki_pw() {
            return fuseki_pw;
        }

        public void setFuseki_pw(String fuseki_pw) {
            this.fuseki_pw = fuseki_pw;
        }
        

    
}
