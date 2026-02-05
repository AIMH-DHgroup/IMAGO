
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
    "startDate",
    "endDate",
    "uncertainty",
    "ante",
    "post",
    "romanNumerals"
})
@Generated("jsonschema2pojo")
public class DateImago {

    @JsonProperty("startDate")
    private String startDate;
    @JsonProperty("endDate")
    private String endDate;
    @JsonProperty("uncertainty")
    private Boolean uncertainty;
    @JsonProperty("ante")
    private Boolean ante;
    @JsonProperty("post")
    private Boolean post;
    @JsonProperty("romanNumerals")
    private Boolean romanNumerals;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    @JsonProperty("startDate")
    public String getStartDate() {
        return startDate;
    }

    @JsonProperty("startDate")
    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    @JsonProperty("endDate")
    public String getEndDate() {
        return endDate;
    }

    @JsonProperty("endDate")
    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    @JsonProperty("uncertainty")
    public Boolean getUncertainty() {
        return uncertainty;
    }

    @JsonProperty("uncertainty")
    public void setUncertainty(Boolean uncertainty) {
        this.uncertainty = uncertainty;
    }

    @JsonProperty("ante")
    public Boolean getAnte() {
        return ante;
    }

    @JsonProperty("ante")
    public void setAnte(Boolean ante) {
        this.ante = ante;
    }

    @JsonProperty("post")
    public Boolean getPost() {
        return post;
    }

    @JsonProperty("post")
    public void setPost(Boolean post) {
        this.post = post;
    }

    @JsonProperty("romanNumerals")
    public Boolean getRomanNumerals() {
        return romanNumerals;
    }

    @JsonProperty("romanNumerals")
    public void setRomanNumerals(Boolean romanNumerals) {
        this.romanNumerals = romanNumerals;
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
    sb.append("startDate");
    sb.append("\n");
    sb.append("\t\t\t\t");
    sb.append(((this.startDate == null)?"<null>":this.startDate));
    sb.append("\n");
    sb.append("\t\tendDate");
    sb.append("\n");
    sb.append("\t\t\t\t");
    sb.append(((this.endDate == null)?"<null>":this.endDate));
    sb.append("\n");
    sb.append("\t\tuncertainty");
    sb.append(" -> ");
    sb.append(((this.uncertainty == null)?"<null>":this.uncertainty));
    sb.append("\n");
    sb.append("\t\tante");
    sb.append(" -> ");
    sb.append(((this.ante == null)?"<null>":this.ante));
    sb.append("\n");
    sb.append("\t\tpost");
    sb.append(" -> ");
    sb.append(((this.post == null)?"<null>":this.post));
    sb.append("\n");
    sb.append("\t\tromanNumerals");
    sb.append(" -> ");
    sb.append(((this.romanNumerals == null)?"<null>":this.romanNumerals));    
    return sb.toString();
    }

}
