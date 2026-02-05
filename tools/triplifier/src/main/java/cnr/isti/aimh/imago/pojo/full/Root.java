
package cnr.isti.aimh.imago.pojo.full;

import java.util.HashMap;
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
    "id",
    "lemma"
})
@Generated("jsonschema2pojo")
public class Root {

    @JsonProperty("id")
    private Integer id;
    @JsonProperty("lemma")
    private Lemma lemma;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    @JsonProperty("id")
    public Integer getId() {
        return id;
    }

    @JsonProperty("id")
    public void setId(Integer id) {
        this.id = id;
    }

    @JsonProperty("lemma")
    public Lemma getLemma() {
        return lemma;
    }

    @JsonProperty("lemma")
    public void setLemma(Lemma lemma) {
        this.lemma = lemma;
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
    // sb.append("-----ROOT----");
    // sb.append("\n");
    sb.append("id");
    sb.append(" -> ");
    sb.append(((this.id == null)?"<null>":this.id));
    sb.append("\n");
    sb.append(((this.lemma == null)?"<null>":this.lemma));
    return sb.toString();
    }
}
