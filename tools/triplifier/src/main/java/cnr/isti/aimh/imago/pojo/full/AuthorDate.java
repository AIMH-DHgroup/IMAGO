
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
    "birthDate",
    "deathDate",
    "floruitDate",
    "episcopusDate"
})
@Generated("jsonschema2pojo")
public class AuthorDate {

    @JsonProperty("birthDate")
    private DateImago birthDate;
    @JsonProperty("deathDate")
    private DateImago deathDate;
    @JsonProperty("floruitDate")
    private DateImago floruitDate;
    @JsonProperty("episcopusDate")
    private DateImago episcopusDate;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    @JsonProperty("birthDate")
    public DateImago getBirthDate() {
        return birthDate;
    }

    @JsonProperty("birthDate")
    public void setBirthDate(DateImago birthDate) {
        this.birthDate = birthDate;
    }

    @JsonProperty("deathDate")
    public DateImago getDeathDate() {
        return deathDate;
    }

    @JsonProperty("deathDate")
    public void setDeathDate(DateImago deathDate) {
        this.deathDate = deathDate;
    }

    @JsonProperty("floruitDate")
    public DateImago getFloruitDate() {
        return floruitDate;
    }

    @JsonProperty("floruitDate")
    public void setFloruitDate(DateImago floruitDate) {
        this.floruitDate = floruitDate;
    }

    @JsonProperty("episcopusDate")
    public DateImago getEpiscopusDate() {
        return episcopusDate;
    }

    @JsonProperty("episcopusDate")
    public void setEpiscopusDate(DateImago episcopusDate) {
        this.episcopusDate = episcopusDate;
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
    sb.append("birthDate");
    sb.append("\n");
    sb.append("\t\t\t\t");
    sb.append(((this.birthDate == null)?"<null>":this.birthDate));
    sb.append("\n");
    sb.append("\t\tdeathDate");
    sb.append("\n");
    sb.append("\t\t\t\t");
    sb.append(((this.deathDate == null)?"<null>":this.deathDate));
    sb.append("\n");
    sb.append("\t\tfloruitDate");
    sb.append("\n");
    sb.append("\t\t\t\t");
    sb.append(((this.floruitDate == null)?"<null>":this.floruitDate));
    sb.append("\n");
    sb.append("\t\tepiscopusDate");
    sb.append("\n");
    sb.append("\t\t\t\t");
    sb.append(((this.episcopusDate == null)?"<null>":this.episcopusDate));
    
    return sb.toString();
    }
}
