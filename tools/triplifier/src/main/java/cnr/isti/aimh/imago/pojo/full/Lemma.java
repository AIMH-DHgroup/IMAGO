
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
    "work",
    "author",
    "abstract",
    "review",
    "genres",
    "places",
    "manuscripts",
    "printEditions"
})
@Generated("jsonschema2pojo")
public class Lemma {

    @JsonProperty("work")
    private Work work;
    @JsonProperty("author")
    private Author author;
    @JsonProperty("abstract")
    private String abs;
    @JsonProperty("review")
    private Boolean review;
    @JsonProperty("genres")
    private List<Genre> genres = null;
    @JsonProperty("places")
    private List<Place> places = null;
    @JsonProperty("manuscripts")
    private List<Manuscript> manuscripts = null;
    @JsonProperty("printEditions")
    private List<PrintEdition> printEditions = null;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    @JsonProperty("work")
    public Work getWork() {
        return work;
    }

    @JsonProperty("work")
    public void setWork(Work work) {
        this.work = work;
    }

    @JsonProperty("abstract")
    public String getAbstract() {
        return abs;
    }

    @JsonProperty("abstract")
    public void setAbstract(String abs) {
        this.abs = abs;
    }

    @JsonProperty("review")
    public Boolean getReview() {
        return review;
    }

    @JsonProperty("review")
    public void setReview(Boolean review) {
        this.review = review;
    }

    @JsonProperty("author")
    public Author getAuthor() {
        return author;
    }

    @JsonProperty("author")
    public void setAuthor(Author author) {
        this.author = author;
    }

    @JsonProperty("genres")
    public List<Genre> getGenres() {
        return genres;
    }

    @JsonProperty("genres")
    public void setGenres(List<Genre> genres) {
        this.genres = genres;
    }

    @JsonProperty("places")
    public List<Place> getPlaces() {
        return places;
    }

    @JsonProperty("places")
    public void setPlaces(List<Place> places) {
        this.places = places;
    }

    @JsonProperty("manuscripts")
    public List<Manuscript> getManuscripts() {
        return manuscripts;
    }

    @JsonProperty("manuscripts")
    public void setManuscripts(List<Manuscript> manuscripts) {
        this.manuscripts = manuscripts;
    }

    @JsonProperty("printEditions")
    public List<PrintEdition> getPrintEditions() {
        return printEditions;
    }

    @JsonProperty("printEditions")
    public void setPrintEditions(List<PrintEdition> printEditions) {
        this.printEditions = printEditions;
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
    sb.append("-----LEMMA----");
    sb.append("\n");
    sb.append("owner");
    sb.append(" -> ");
    sb.append(((this.abs == null)?"<null>":this.abs));
    sb.append("\n");
    sb.append("work");
    sb.append("\n");
    sb.append(((this.work == null)?"<null>":this.work));
    sb.append("\n");
    sb.append("author");
    sb.append("\n");
    sb.append(((this.author == null)?"<null>":this.author));
    sb.append("\n");
    sb.append("genres");
    sb.append("\n");
    sb.append("\t");
    sb.append(((this.genres == null)?"<null>":this.genres));
    sb.append("\n");
    sb.append("places");
    sb.append("\n");
    sb.append("\t");
    sb.append(((this.places == null)?"<null>":this.places));
    sb.append("\n");
    sb.append("manuscripts");
    sb.append("\n");
    sb.append("\t");
    sb.append(((this.manuscripts == null)?"<null>":this.manuscripts));
    sb.append("\n");
    sb.append("printEditions");
    sb.append("\n");
    sb.append("\t");
    sb.append(((this.printEditions == null)?"<null>":this.printEditions));
    
    return sb.toString();
    }
    

}
