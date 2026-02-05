
package cnr.isti.aimh.imago.pojo.full;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.Generated;
import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "iri",
    "name",
    "alias",
    "authorDate"
})
@Generated("jsonschema2pojo")
public class Author {

    @JsonProperty("iri")
    private String iri;
    @JsonProperty("name")
    private String name;
    @JsonProperty("stringDatazione")
    private String stringDatazione;
    @JsonProperty("alias")
    private List<String> alias = null;
    @JsonProperty("authorDate")
    private AuthorDate authorDate;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    @JsonProperty("iri")
    public String getIri() {
        return iri;
    }

    @JsonProperty("iri")
    public void setIri(String iri) {
        this.iri = iri;
    }

    @JsonProperty("name")
    public String getName() {
        return name;
    }

    @JsonProperty("name")
    public void setName(String name) {
        this.name = name;
    }
    @JsonProperty("stringDatazione")
    public String getStringDatazione() {
        return stringDatazione;
    }
    @JsonProperty("stringDatazione")
    public void setStringDatazione(String stringDatazione) {
        this.stringDatazione = stringDatazione;
    }

    @JsonProperty("alias")
    public List<String> getAlias() {
        return alias;
    }

    @JsonProperty("alias")
    public void setAlias(List<String> alias) {
        this.alias = alias;
    }

    @JsonProperty("authorDate")
    public AuthorDate getAuthorDate() {
        return authorDate;
    }

    @JsonProperty("authorDate")
    public void setAuthorDate(AuthorDate authorDate) {
        this.authorDate = authorDate;
    }

    @JsonAnyGetter
    public Map<String, Object> getAdditionalProperties() {
        return this.additionalProperties;
    }

    @JsonAnySetter
    public void setAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
    }

    @Override
    public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("\tiri");
    sb.append("\n");
    sb.append("\t\t");
    sb.append(((this.iri == null)?"<null>":this.iri));
    sb.append("\n");
    sb.append("\tname");
    sb.append("\n");
    sb.append("\t\t");
    sb.append(((this.name == null)?"<null>":this.name));
    sb.append("\n");
    sb.append("\talias");
    sb.append("\n");
    sb.append("\t\t");
    sb.append(((this.alias == null)?"<null>":this.alias));
    sb.append("\n");
    sb.append("\tauthorDate");
    sb.append("\n");
    sb.append("\t\t");
    sb.append(((this.authorDate == null)?"<null>":this.authorDate));
    
    return sb.toString();
    }

}
