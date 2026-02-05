package cnr.isti.aimh.imago.pojo.toponyms;

import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;


@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "name",
    "lemma",
    "form",
    "labelIta",
    "labelEng",
    "work",
    "occDeVulgari",
    "occEgloge",
    "occEpistole",
    "occMonarchia",
    "occQuestio",
    "totOccurrences",
    "context",
    "urlDS",
    "placeText",
    "position",
    "iriWD",
    "latitude",
    "longitude",
    "VDLlemma",
    "iri_pleiades"
})

public class Toponym {
    
    @JsonProperty("name")
    private String name;
    @JsonProperty("lemma")
    private String lemma;
    @JsonProperty("form")
    private String form;
    @JsonProperty("labelIta")
    private String labelIta;
    @JsonProperty("labelEng")
    private String labelEng;
    @JsonProperty("work")
    private Work work;
    @JsonProperty("occDeVulgari")
    private String occDeVulgari;
    @JsonProperty("occEgloge")
    private String occEgloge;
    @JsonProperty("occEpistole")
    private String occEpistole;
    @JsonProperty("occMonarchia")
    private String occMonarchia;
    @JsonProperty("occQuestio")
    private String occQuestio;
    @JsonProperty("totOccurrences")
    private String totOccurrences;
    @JsonProperty("context")
    private String context;
    @JsonProperty("urlDS")
    private String urlDS;
    @JsonProperty("placeText")
    private String placeText;
    @JsonProperty("position")
    private String position;
    @JsonProperty("iriWD")
    private String iriWD;
    @JsonProperty("latitude")
    private String latitude;
    @JsonProperty("longitude")
    private String longitude;
    @JsonProperty("VDLlemma")
    private String vDLlemma;
    @JsonProperty("iri_pleiades")
    private String pleiades;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    @JsonProperty("name")
    public String getName() {
        return name;
    }

    @JsonProperty("name")
    public void setName(String name) {
        this.name = name;
    }

    @JsonProperty("lemma")
    public String getLemma() {
        return lemma;
    }

    @JsonProperty("lemma")
    public void setLemma(String lemma) {
        this.lemma = lemma;
    }

    @JsonProperty("form")
    public String getForm() {
        return form;
    }

    @JsonProperty("form")
    public void setForm(String form) {
        this.form = form;
    }

    @JsonProperty("labelIta")
    public String getLabelIta() {
        return labelIta;
    }

    @JsonProperty("labelIta")
    public void setLabelIta(String labelIta) {
        this.labelIta = labelIta;
    }

    @JsonProperty("labelEng")
    public String getLabelEng() {
        return labelEng;
    }

    @JsonProperty("labelEng")
    public void setLabelEng(String labelEng) {
        this.labelEng = labelEng;
    }

    @JsonProperty("work")
    public Work getWork() {
        return work;
    }

    @JsonProperty("work")
    public void setWork(Work work) {
        this.work = work;
    }

    @JsonProperty("occDeVulgari")
    public String getOccDeVulgari() {
        return occDeVulgari;
    }

    @JsonProperty("occDeVulgari")
    public void setOccDeVulgari(String occDeVulgari) {
        this.occDeVulgari = occDeVulgari;
    }

    @JsonProperty("occEgloge")
    public String getOccEgloge() {
        return occEgloge;
    }

    @JsonProperty("occEgloge")
    public void setOccEgloge(String occEgloge) {
        this.occEgloge = occEgloge;
    }

    @JsonProperty("occEpistole")
    public String getOccEpistole() {
        return occEpistole;
    }

    @JsonProperty("occEpistole")
    public void setOccEpistole(String occEpistole) {
        this.occEpistole = occEpistole;
    }

    @JsonProperty("occMonarchia")
    public String getOccMonarchia() {
        return occMonarchia;
    }

    @JsonProperty("occMonarchia")
    public void setOccMonarchia(String occMonarchia) {
        this.occMonarchia = occMonarchia;
    }

    @JsonProperty("occQuestio")
    public String getOccQuestio() {
        return occQuestio;
    }

    @JsonProperty("occQuestio")
    public void setOccQuestio(String occQuestio) {
        this.occQuestio = occQuestio;
    }

    @JsonProperty("totOccurrences")
    public String getTotOccurrences() {
        return totOccurrences;
    }

    @JsonProperty("totOccurrences")
    public void setTotOccurrences(String totOccurrences) {
        this.totOccurrences = totOccurrences;
    }

    @JsonProperty("context")
    public String getContext() {
        return context;
    }

    @JsonProperty("context")
    public void setContext(String context) {
        this.context = context;
    }

    @JsonProperty("urlDS")
    public String getUrlDS() {
        return urlDS;
    }

    @JsonProperty("urlDS")
    public void setUrlDS(String urlDS) {
        this.urlDS = urlDS;
    }

    @JsonProperty("placeText")
    public String getPlaceText() {
        return placeText;
    }

    @JsonProperty("placeText")
    public void setPlaceText(String placeText) {
        this.placeText = placeText;
    }

    @JsonProperty("position")
    public String getPosition() {
        return position;
    }

    @JsonProperty("position")
    public void setPosition(String position) {
        this.position = position;
    }

    @JsonProperty("iriWD")
    public String getIriWD() {
        return iriWD;
    }

    @JsonProperty("iriWD")
    public void setIriWD(String iriWD) {
        this.iriWD = iriWD;
    }

    @JsonProperty("latitude")
    public String getLatitude() {
        return latitude;
    }

    @JsonProperty("latitude")
    public void setLatitude(String latitude) {
        this.latitude = latitude;
    }

    @JsonProperty("longitude")
    public String getLongitude() {
        return longitude;
    }

    @JsonProperty("longitude")
    public void setLongitude(String longitude) {
        this.longitude = longitude;
    }

    @JsonProperty("VDLlemma")
    public String getVDLlemma() {
        return vDLlemma;
    }

    @JsonProperty("VDLlemma")
    public void setVDLlemma(String vDLlemma) {
        this.vDLlemma = vDLlemma;
    }

    @JsonProperty("iri_pleiades")
    public String getPleiades() {
        return pleiades;
    }

    @JsonProperty("iri_pleiades")
    public void setPleiades(String pleiades) {
        this.pleiades = pleiades;
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
        sb.append(Toponym.class.getName()).append('@').append(Integer.toHexString(System.identityHashCode(this))).append('[');
        sb.append("name");
        sb.append('=');
        sb.append(((this.name == null)?"<null>":this.name));
        sb.append(',');
        sb.append("lemma");
        sb.append('=');
        sb.append(((this.lemma == null)?"<null>":this.lemma));
        sb.append(',');
        sb.append("form");
        sb.append('=');
        sb.append(((this.form == null)?"<null>":this.form));
        sb.append(',');
        sb.append("labelIta");
        sb.append('=');
        sb.append(((this.labelIta == null)?"<null>":this.labelIta));
        sb.append(',');
        sb.append("labelEng");
        sb.append('=');
        sb.append(((this.labelEng == null)?"<null>":this.labelEng));
        sb.append(',');
        sb.append("work");
        sb.append('=');
        sb.append(((this.work == null)?"<null>":this.work));
        sb.append(',');
        sb.append("occDeVulgari");
        sb.append('=');
        sb.append(((this.occDeVulgari == null)?"<null>":this.occDeVulgari));
        sb.append(',');
        sb.append("occEgloge");
        sb.append('=');
        sb.append(((this.occEgloge == null)?"<null>":this.occEgloge));
        sb.append(',');
        sb.append("occEpistole");
        sb.append('=');
        sb.append(((this.occEpistole == null)?"<null>":this.occEpistole));
        sb.append(',');
        sb.append("occMonarchia");
        sb.append('=');
        sb.append(((this.occMonarchia == null)?"<null>":this.occMonarchia));
        sb.append(',');
        sb.append("occQuestio");
        sb.append('=');
        sb.append(((this.occQuestio == null)?"<null>":this.occQuestio));
        sb.append(',');
        sb.append("totOccurrences");
        sb.append('=');
        sb.append(((this.totOccurrences == null)?"<null>":this.totOccurrences));
        sb.append(',');
        sb.append("context");
        sb.append('=');
        sb.append(((this.context == null)?"<null>":this.context));
        sb.append(',');
        sb.append("urlDS");
        sb.append('=');
        sb.append(((this.urlDS == null)?"<null>":this.urlDS));
        sb.append(',');
        sb.append("placeText");
        sb.append('=');
        sb.append(((this.placeText == null)?"<null>":this.placeText));
        sb.append(',');
        sb.append("position");
        sb.append('=');
        sb.append(((this.position == null)?"<null>":this.position));
        sb.append(',');
        sb.append("iriWD");
        sb.append('=');
        sb.append(((this.iriWD == null)?"<null>":this.iriWD));
        sb.append(',');
        sb.append("latitude");
        sb.append('=');
        sb.append(((this.latitude == null)?"<null>":this.latitude));
        sb.append(',');
        sb.append("longitude");
        sb.append('=');
        sb.append(((this.longitude == null)?"<null>":this.longitude));
        sb.append(',');
        sb.append("vDLlemma");
        sb.append('=');
        sb.append(((this.vDLlemma == null)?"<null>":this.vDLlemma));
        sb.append(',');
        sb.append("additionalProperties");
        sb.append('=');
        sb.append(((this.additionalProperties == null)?"<null>":this.additionalProperties));
        sb.append(',');
        if (sb.charAt((sb.length()- 1)) == ',') {
            sb.setCharAt((sb.length()- 1), ']');
        } else {
            sb.append(']');
        }
        return sb.toString();
    }

}
