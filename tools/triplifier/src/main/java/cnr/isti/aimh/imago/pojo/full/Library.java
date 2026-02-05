
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
    "name",
    "place",
    "originalName",
    "originalLang",
    "lang",
    "englishName",
    "city",
    "coordinates",
    "italianName",
    "latinName",
})
@Generated("jsonschema2pojo")
public class Library {

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
    @JsonProperty("city")
    private String city;
    @JsonProperty("coordinates")
    private String coordinates;
    @JsonProperty("italianName")
    private String italianName;
    @JsonProperty("latinName")
    private String latinName;
    @JsonProperty("place")
    private Place place;
    

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

    @JsonProperty("city")
    public String getCity() {
        return city;
    }

    @JsonProperty("city")
    public void setCity(String city) {
        this.city = city;
    }

    @JsonProperty("coordinates")
    public String getCoordinates() {
        return coordinates;
    }

    @JsonProperty("coordinates")
    public void setCoordinates(String coordinates) {
        this.coordinates = coordinates;
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

    @JsonProperty("place")
    public Place getPlace() {
        return place;
    }

    @JsonProperty("place")
    public void setPlace(Place place) {
        this.place = place;
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
