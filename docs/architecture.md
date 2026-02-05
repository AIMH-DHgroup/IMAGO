# IMAGO System Architecture

This document describes the overall architecture of the IMAGO software ecosystem and the data flow between its components.  
It is intended to support transparency, reproducibility, and long-term maintainability of the project’s digital infrastructure.

---

## Architectural Overview

The IMAGO system follows a **modular, pipeline-based architecture** designed to support the scholarly creation, transformation, enrichment, and publication of cultural heritage data as Linked Open Data.

Each module has a clearly defined role and communicates with the others through explicit data formats (JSON, OWL), allowing components to be developed, tested, and reused independently.

At a high level, the architecture consists of four main layers:

1. **Annotation layer** – scholarly data creation  
2. **Transformation layer** – conversion to OWL  
3. **Linking and enrichment layer** – alignment with external authorities  
4. **Publication and access layer** – querying and exploration  

---

## Components and Data Flow

### 1. Annotation Layer: IMAGO Annotation Tool

**Component:** `tools/annotation-tool/`  
**Technology:** Django (Python), relational database  

The IMAGO Annotation Tool is a web-based environment used by scholars to curate and describe primary sources (e.g. works, manuscripts, places, agents).

Key characteristics:

- Structured data entry guided by the IMAGO data model
- Support for controlled vocabularies and entity reuse
- Validation at data-entry time to reduce inconsistencies

**Output:**  
Annotated records are exported as **structured JSON**, representing the authoritative internal data format of the IMAGO workflow.

---

### 2. Transformation Layer: Java-based Triplifier

**Component:** `tools/triplifier/`  
**Technology:** Java, Apache Jena  

The triplifier is a standalone Java application that converts the JSON exports produced by the annotation tool into OWL.

Its responsibilities include:

- Mapping the internal IMAGO data model to established ontologies
- Generating OWL compliant with:
  - CIDOC CRM
  - ILRMoo
  - IMAGO project-specific extensions
- Producing OWL in standard serializations (RDF/XML and Turtle)

This explicit transformation step ensures a **clear separation** between data creation and semantic representation.

**Output:**  
OWL/RDF files ready for ingestion into a triple store.

---

### 3. Linking and Enrichment Layer: Linking Tool

**Component:** `tools/linking/`  
**Technology:** Python  

The linking tool supports the reconciliation and alignment of IMAGO entities with external authority resources, such as Wikidata and MIRABILE.

Typical tasks include:

- Matching places, institutions, authors, works to external identifiers
- Generating individuals that can be incorporated into the IMAGO anntoation tool

Linking is performed as a **pre-annotation step**, allowing the scholars to annotate data with the aligned individuals.

**Output:**  
Mapping files integrated into the annotation tool.

---

### 4. Publication and Access Layer: Archive Frontend and SPARQL Endpoint

**Component:** `tools/archive-frontend/`  
**Technology:** HTML, JavaScript, YASGUI, Apache Fuseki  

The final RDF dataset is ingested into an Apache Fuseki triple store, which exposes a SPARQL endpoint.

Access to the data is provided through:

- A web-based archive frontend
- An embedded SPARQL editor (YASGUI)
- Curated example queries corresponding to those discussed in the paper

This layer supports both expert users (via SPARQL) and non-technical users (via guided exploration).

---

## Data Flow Summary

The complete workflow can be summarized as follows:

1. **Individuals → Linking Tool → Aligned Individuals**  
1. **Annotation Tool → JSON export**  
2. **JSON → Triplifier → RDF (OWL/Turtle)**  
4. **RDF → Fuseki → SPARQL Endpoint → Archive Frontend**

Each step uses open, documented formats to ensure interoperability and long-term reuse.

---

## Design Principles

The IMAGO architecture is guided by the following principles:

- **Modularity:** Each tool can be used independently or replaced if needed.
- **Transparency:** All transformations are explicit and documented.
- **Standards-based modeling:** Use of CIDOC CRM and related ontologies.
- **Reproducibility:** Deterministic transformation steps and versioned software.
- **Sustainability:** Clear separation between data creation, transformation, and publication.

---

## Future Extensions

The modular design of the IMAGO architecture allows for:

- additional linking services (e.g. VIAF, GeoNames),
- alternative RDF stores,
- new frontends or visualization layers,
- integration with other CIDOC CRM–based datasets.

Such extensions can be introduced without altering the core annotation or transformation logic.
