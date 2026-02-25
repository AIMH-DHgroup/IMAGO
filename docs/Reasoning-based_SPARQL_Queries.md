# IMAGO Knowledge Graph – Reasoning-based SPARQL Queries

This repository provides a set of SPARQL queries designed to demonstrate reasoning over the IMAGO Knowledge Graph (KG).  
By enabling OWL reasoning with Openllet, the queries retrieve not only explicitly asserted triples, but also implicit knowledge inferred from class hierarchies, subproperty axioms, and inverse property definitions defined in the IMAGO ontology and its imported reference ontologies.

The following queries show how the reasoner allows the extraction of inferred class memberships, subproperty relations, and inverse property assertions from the IMAGO KG.

To test these queries, load the IMAGO KG (https://github.com/AIMH-DHgroup/IMAGO/blob/main/data/dumps/imago-archive.ttl.gz
) into a triplestore such as Fuseki with Openllet enabled, and execute the SPARQL queries through the endpoint. Alternatively, if running Openllet is not possible, a version of the Imago KG containing all triples already inferred by Openllet is available (https://github.com/AIMH-DHgroup/IMAGO/blob/main/data/dumps/imago-archive-inferences.ttl.gz
)

---

## 1️⃣ Individuals belonging to subclasses of E39 Actor

This query retrieves all individuals inferred to belong to subclasses of **:contentReference[oaicite:0]{index=0}** (e.g., `imago:Author`, `imago:Curator`, `imago:Publisher`).  
Thanks to reasoning, individuals explicitly typed as these subclasses are also returned as instances of `crm:E39_Actor`.

```sparql
PREFIX rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs:  <http://www.w3.org/2000/01/rdf-schema#>
PREFIX crm:   <http://erlangen-crm.org/211015/>
PREFIX imago: <https://imagoarchive.it/ontology/>

SELECT ?actor ?roleClass 
WHERE {
  ?actor rdf:type crm:E39_Actor .          
  # inferred from rdf:type imago:Author/Curator/Publisher

  OPTIONAL { 
    ?actor rdf:type ?roleClass .
    FILTER(?roleClass IN (imago:Author, imago:Curator, imago:Publisher)) 
  }
}
```

## 2️⃣ Subproperties of P3 has note

This query retrieves assertions made via subproperties of P3 has note.
When reasoning is enabled, triples asserted using subproperties defined in the IMAGO ontology are also retrieved as instances of crm:P3_has_note.

```sparql
PREFIX rdfs:  <http://www.w3.org/2000/01/rdf-schema#>
PREFIX crm:   <http://erlangen-crm.org/211015/>
PREFIX imago: <https://imagoarchive.it/ontology/>

SELECT ?s ?whichSubprop
WHERE {
  ?s crm:P3_has_note ?note .                 
  # returns triples asserted via subproperties under reasoning

  OPTIONAL {
    ?whichSubprop rdfs:subPropertyOf crm:P3_has_note .
    ?s ?whichSubprop ?note .
    FILTER(STRSTARTS(STR(?whichSubprop), STR(imago:)))
  }
}
```
## 3️⃣ Items retrieved via inverse property R7i

This query retrieves manuscript items connected to a manifestation through the inverse of R7i is materialized in.
The reasoner infers the triple using ilrmoo:R7_is_materialization_of from assertions made with its inverse (R7i).

```sparql
PREFIX rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX ilrmoo:  <http://imagoarchive.it/ilrmoo/>
PREFIX imago:   <https://imagoarchive.it/ontology/>

SELECT ?item ?manifestation
WHERE {
  ?item rdf:type imago:Manuscript .
  ?item ilrmoo:R7_is_materialization_of ?manifestation .
  # inferred from ?manifestation R7i ?item
}
```
