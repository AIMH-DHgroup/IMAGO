
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
    "url",
    "notes",
    "folios",
    "sources",
    "author",
    "title",
    "lastMod",
    "date",
    "signature",
    "library",
    "annotator",
    "decoration",
    "incipitText",
    "explicitText",
    "incipitDedication",
    "explicitDedication",
    "urlDescription",
    "dateString"
})
@Generated("jsonschema2pojo")
public class Manuscript {

    @JsonProperty("url")
    private String url;
    @JsonProperty("urlDescription")
    private String urlDescription;
    @JsonProperty("folios")
    private String folios;
    @JsonProperty("sources")
    private List<Source> sources = null;
    @JsonProperty("author")
    private String author;
    @JsonProperty("title")
    private String title;
    @JsonProperty("lastMod")
    private Double lastMod;
    @JsonProperty("date")
    private DateImago date;
    @JsonProperty("dateString")
    private String dateString;
    @JsonProperty("signature")
    private String signature;
    @JsonProperty("library")
    private Library library;
    @JsonProperty("annotator")
    private Annotator annotator;
    @JsonProperty("incipitText")
    private String incipitText;
    @JsonProperty("explicitText")
    private String explicitText;
    @JsonProperty("incipitDedication")
    private String incipitDedication;
    @JsonProperty("explicitDedication")
    private String explicitDedication;
    @JsonProperty("decoration")
    private String decoration;
    @JsonProperty("notes")
    private String notes;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    @JsonProperty("url")
    public String getUrl() {
        return url;
    }

    @JsonProperty("url")
    public void setUrl(String url) {
        this.url = url;
    }

    @JsonProperty("urlDescription")
    public String getUrlDescription() {
        return urlDescription;
    }

    @JsonProperty("urlDescription")
    public void setUrlDescription(String urlDescription) {
        this.urlDescription = urlDescription;
    }

    @JsonProperty("folios")
    public String getFolios() {
        return folios;
    }

    @JsonProperty("folios")
    public void setFolios(String folios) {
        this.folios = folios;
    }

    @JsonProperty("sources")
    public List<Source> getSources() {
        return sources;
    }

    @JsonProperty("sources")
    public void setSources(List<Source> sources) {
        this.sources = sources;
    }

    @JsonProperty("author")
    public String getAuthor() {
        return author;
    }

    @JsonProperty("author")
    public void setAuthor(String author) {
        this.author = author;
    }

    @JsonProperty("title")
    public String getTitle() {
        return title;
    }

    @JsonProperty("title")
    public void setTitle(String title) {
        this.title = title;
    }

    @JsonProperty("lastMod")
    public Double getLastMod() {
        return lastMod;
    }

    @JsonProperty("lastMod")
    public void setLastMod(Double lastMod) {
        this.lastMod = lastMod;
    }

    @JsonProperty("date")
    public DateImago getDate() {
        return date;
    }

    @JsonProperty("date")
    public void setDate(DateImago date) {
        this.date = date;
    }

    @JsonProperty("dateString")
    public String getDateString() {
        return dateString;
    }

    @JsonProperty("dateString")
    public void setDateString(String dateString) {
        this.dateString = dateString;
    }

    @JsonProperty("signature")
    public String getSignature() {
        return signature;
    }

    @JsonProperty("signature")
    public void setSignature(String signature) {
        this.signature = signature;
    }

    @JsonProperty("library")
    public Library getLibrary() {
        return library;
    }

    @JsonProperty("library")
    public void setLibrary(Library library) {
        this.library = library;
    }

    @JsonProperty("annotator")
    public Annotator getAnnotator() {
        return annotator;
    }

    @JsonProperty("annotator")
    public void setAnnotator(Annotator annotator) {
        this.annotator = annotator;
    }

    @JsonProperty("incipitText")
    public String getIncipitText() {
        return incipitText;
    }

    @JsonProperty("incipitText")
    public void setIncipitText(String incipitText) {
        this.incipitText = incipitText;
    }

    @JsonProperty("explicitText")
    public String getExplicitText() {
        return explicitText;
    }

    @JsonProperty("explicitText")
    public void setExplicitText(String explicitText) {
        this.explicitText = explicitText;
    }

    @JsonProperty("incipitDedication")
    public String getIncipitDedication() {
        return incipitDedication;
    }

    @JsonProperty("incipitDedication")
    public void setIncipitDedication(String incipitDedication) {
        this.incipitDedication = incipitDedication;
    }

    @JsonProperty("explicitDedication")
    public String getExplicitDedication() {
        return explicitDedication;
    }

    @JsonProperty("explicitDedication")
    public void setExplicitDedication(String explicitDedication) {
        this.explicitDedication = explicitDedication;
    }

    @JsonProperty("decoration")
    public String getDecoration() {
        return decoration;
    }

    @JsonProperty("decoration")
    public void setDecoration(String decoration) {
        this.decoration = decoration;
    }

    @JsonProperty("notes")
    public String getNotes() {
        return notes;
    }

    @JsonProperty("notes")
    public void setNotes(String notes) {
        this.notes = notes;
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
