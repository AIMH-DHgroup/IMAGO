
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
    "place",
    "placeAsAppear",
    "notes",
    "figures",
    "sources",
    "author",
    "title",
    "lastMod",
    "date",
    "pages",
    "format",
    "editor",
    "curator",
    "annotator",
    "ecdotic",
    "languageTraduction",
    "edition",
    "prefator",
    "dateEdition",
    "primarySources",
    "otherContents",
    "dateString"
})
@Generated("jsonschema2pojo")
public class PrintEdition {

    @JsonProperty("date")
    private DateImago date;
    @JsonProperty("dateString")
    private String dateString;
    @JsonProperty("notes")
    private String notes;
    @JsonProperty("place")
    private Place place;
    @JsonProperty("placeAsAppear")
    private String placeAsAppear;
    @JsonProperty("author")
    private String author;
    @JsonProperty("figures")
    private String figures;
    @JsonProperty("pages")
    private String pages;
    @JsonProperty("title")
    private String title;
    @JsonProperty("editor")
    private String editor;
    @JsonProperty("format")
    private String format;
    @JsonProperty("curator")
    private String curator;
    @JsonProperty("ecdotic")
    private String ecdotic;
    @JsonProperty("languageTraduction")
    private String languageTraduction;
    @JsonProperty("edition")
    private String edition;
    @JsonProperty("lastMod")
    private Float lastMod;
    @JsonProperty("prefator")
    private String prefator;
    @JsonProperty("annotator")
    private Annotator annotator;
    @JsonProperty("dateEdition")
    private String dateEdition;
    @JsonProperty("primarySources")
    private String primarySources;
    @JsonProperty("otherContents")
    private String otherContents;
    @JsonProperty("sources")
    private List<Source> sources = null;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

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

    @JsonProperty("notes")
    public String getNotes() {
        return notes;
    }

    @JsonProperty("notes")
    public void setNotes(String notes) {
        this.notes = notes;
    }

    @JsonProperty("place")
    public Place getPlace() {
        return place;
    }

    @JsonProperty("place")
    public void setPlace(Place place) {
        this.place = place;
    }

    @JsonProperty("placeAsAppear")
    public String getPlaceAsAppear() {
        return placeAsAppear;
    }

    @JsonProperty("placeAsAppear")
    public void setPlaceAsAppear(String placeAsAppear) {
        this.placeAsAppear = placeAsAppear;
    }

    @JsonProperty("author")
    public String getAuthor() {
        return author;
    }

    @JsonProperty("author")
    public void setAuthor(String author) {
        this.author = author;
    }

    @JsonProperty("figures")
    public String getFigures() {
        return figures;
    }

    @JsonProperty("figures")
    public void setFigures(String figures) {
        this.figures = figures;
    }

    @JsonProperty("pages")
    public String getPages() {
        return pages;
    }

    @JsonProperty("pages")
    public void setPages(String pages) {
        this.pages = pages;
    }

    @JsonProperty("title")
    public String getTitle() {
        return title;
    }

    @JsonProperty("title")
    public void setTitle(String title) {
        this.title = title;
    }

    @JsonProperty("editor")
    public String getEditor() {
        return editor;
    }

    @JsonProperty("editor")
    public void setEditor(String editor) {
        this.editor = editor;
    }

    @JsonProperty("format")
    public String getFormat() {
        return format;
    }

    @JsonProperty("format")
    public void setFormat(String format) {
        this.format = format;
    }

    @JsonProperty("curator")
    public String getCurator() {
        return curator;
    }

    @JsonProperty("curator")
    public void setCurator(String curator) {
        this.curator = curator;
    }

    @JsonProperty("ecdotic")
    public String getEcdotic() {
        return ecdotic;
    }

    @JsonProperty("ecdotic")
    public void setEcdotic(String ecdotic) {
        this.ecdotic = ecdotic;
    }

    @JsonProperty("languageTraduction")
    public String getLanguageTraduction() {
        return languageTraduction;
    }

    @JsonProperty("languageTraduction")
    public void setLanguageTraduction(String languageTraduction) {
        this.languageTraduction = languageTraduction;
    }

    @JsonProperty("edition")
    public String getEdition() {
        return edition;
    }

    @JsonProperty("edition")
    public void setEdition(String edition) {
        this.edition = edition;
    }

    @JsonProperty("lastMod")
    public Float getLastMod() {
        return lastMod;
    }

    @JsonProperty("lastMod")
    public void setLastMod(Float lastMod) {
        this.lastMod = lastMod;
    }

    @JsonProperty("prefator")
    public String getPrefator() {
        return prefator;
    }

    @JsonProperty("prefator")
    public void setPrefator(String prefator) {
        this.prefator = prefator;
    }

    @JsonProperty("annotator")
    public Annotator getAnnotator() {
        return annotator;
    }

    @JsonProperty("annotator")
    public void setAnnotator(Annotator annotator) {
        this.annotator = annotator;
    }

    @JsonProperty("dateEdition")
    public String getDateEdition() {
        return dateEdition;
    }

    @JsonProperty("dateEdition")
    public void setDateEdition(String dateEdition) {
        this.dateEdition = dateEdition;
    }

    @JsonProperty("primarySources")
    public String getPrimarySources() {
        return primarySources;
    }

    @JsonProperty("primarySources")
    public void setPrimarySources(String primarySources) {
        this.primarySources = primarySources;
    }

    @JsonProperty("otherContents")
    public String getOtherContents() {
        return otherContents;
    }

    @JsonProperty("otherContents")
    public void setOtherContents(String otherContents) {
        this.otherContents = otherContents;
    }

    @JsonProperty("sources")
    public List<Source> getSources() {
        return sources;
    }

    @JsonProperty("sources")
    public void setSources(List<Source> sources) {
        this.sources = sources;
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
