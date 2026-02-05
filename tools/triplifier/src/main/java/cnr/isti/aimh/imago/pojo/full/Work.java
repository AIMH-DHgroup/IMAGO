
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
    "title",
    "altTitles",
    "author"
})
@Generated("jsonschema2pojo")
public class Work {

    @JsonProperty("iri")
    private String iri;
    @JsonProperty("title")
    private String title;
    @JsonProperty("altTitles")
    private List<String> altTitles = null;
    @JsonProperty("author")
    private String author;
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

    @JsonProperty("title")
    public String getTitle() {
        return title;
    }

    @JsonProperty("title")
    public void setTitle(String title) {
        this.title = title;
    }

    @JsonProperty("altTitles")
    public List<String> getAltTitles() {
        return altTitles;
    }

    @JsonProperty("altTitles")
    public void setAltTitles(List<String> altTitles) {
        this.altTitles = altTitles;
    }

    @JsonProperty("author")
    public String getAuthor() {
        return author;
    }

    @JsonProperty("author")
    public void setAuthor(String author) {
        this.author = author;
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
    sb.append("\ttitle");
    sb.append("\n");
    sb.append("\t\t");
    sb.append(((this.title == null)?"<null>":this.title));
    sb.append("\n");
    sb.append("\taltTitles");
    sb.append("\n");
    sb.append("\t\t");
    sb.append(((this.altTitles == null)?"<null>":this.altTitles));
    sb.append("\n");
    sb.append("\tauthor");
    sb.append("\n");
    sb.append("\t\t");
    sb.append(((this.author == null)?"<null>":this.author));
    
    return sb.toString();
    }
}
