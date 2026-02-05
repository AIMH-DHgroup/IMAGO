
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
    "originalName",
    "originalLang",
    "name",
    "lang",
    "englishName",
    "italianName",
    "latinName",
    "country",
    "coordinates"
})

@Generated("jsonschema2pojo")
public class Place {

    @JsonProperty("iri")
    private String iri;
    @JsonProperty("originalName")
    private String originalName;
    @JsonProperty("originalLang")
    private String originalLang;
    @JsonProperty("name")
    private String name;
    @JsonProperty("lang")
    private String lang;
    @JsonProperty("englishName")
    private String englishName;
    @JsonProperty("italianName")
    private String italianName;
    @JsonProperty("latinName")
    private String latinName;
    @JsonProperty("country")
    private Country country;
    @JsonProperty("coordinates")
    private String coordinates;
    @JsonProperty("wkt")
    private String wkt;
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

    @JsonProperty("originalName")
    public String getOriginalName() {
        return originalName;
    }

    @JsonProperty("originalName")
    public void setOriginalName(String originalName) {
        this.originalName = originalName;
    }

    @JsonProperty("originalLang")
    public String getOriginalLang() {
        return originalLang;
    }

    @JsonProperty("originalLang")
    public void setOriginalLang(String originalLang) {
        this.originalLang = originalLang;
    }

    @JsonProperty("name")
    public String getName() {
        return name;
    }

    @JsonProperty("name")
    public void setName(String name) {
        this.name = name;
    }

    @JsonProperty("lang")
    public String getLang() {
        return lang;
    }

    @JsonProperty("lang")
    public void setLang(String lang) {
        this.lang = lang;
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

    @JsonProperty("country")
    public Country getCountry() {
        return country;
    }

    @JsonProperty("country")
    public void setCountry(Country country) {
        this.country = country;
    }

    @JsonProperty("coordinates")
    public String getCoordinates() {
        return coordinates;
    }

    @JsonProperty("coordinates")
    public void setCoordinates(String coordinates) {
        this.coordinates = coordinates;
    }

    @JsonProperty("wkt")
    public String getWkt() {
        return wkt;
    }

    @JsonProperty("wkt")
    public void setWkt(String wkt) {
        this.wkt = wkt;
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
