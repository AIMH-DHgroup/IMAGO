
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
    "iri",
    "englishName",
    "italianName",
    "latinName",
    "coordinates"
})
@Generated("jsonschema2pojo")
public class Country {

    @JsonProperty("iri")
    private String iri;
    @JsonProperty("englishName")
    private String englishName;
    @JsonProperty("italianName")
    private String italianName;
    @JsonProperty("latinName")
    private String latinName;
    @JsonProperty("coordinates")
    private String coordinates;
    

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

    @JsonProperty("englishName")
    public String getEnglishName() {
        return englishName;
    }

    @JsonProperty("englishName")
    public void setEnglishName(String englishName) {
        this.englishName = englishName;
    }

    @JsonProperty("italianName")
    public String getItalianName() {
        return italianName;
    }

    @JsonProperty("italianName")
    public void setItalianName(String italianName) {
        this.italianName = italianName;
    }

    @JsonProperty("latinName")
    public String getLatinName() {
        return latinName;
    }

    @JsonProperty("latinName")
    public void setLatinName(String latinName) {
        this.latinName = latinName;
    }

    @JsonProperty("coordinates")
    public String getCoordinates() {
        return coordinates;
    }

    @JsonProperty("coordinates")
    public void setCoordinates(String coordinates) {
        this.coordinates = coordinates;
    }

    @JsonAnyGetter
    public Map<String, Object> getAdditionalProperties() {
        return this.additionalProperties;
    }

    @JsonAnySetter
    public void setAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
    }

}
