# IMAGO Dataset

This directory contains the RDF datasets produced within the IMAGO project and used in the analyses presented in the paper.  
All data are released in **Turtle (TTL)** format and are intended to support transparency, inspection, and reuse.

The datasets include:
- IRIs minted by the IMAGO project
- Explicit links to external authority identifiers (e.g. Wikidata, Mirabile)
- RDF statements compliant with CIDOC CRM, ILRMoo, and IMAGO-specific extensions

---

## Directory Structure

```text
data/
├── README.md # this file
├── dumps/
│ ├── imago-archive.ttl.gz # core IMAGO archive dataset
│ ├── imago-mmm.ttl.gz # links between the Mapping–Manuscript–Migration project and IMAGO
│ └── imago-toponyms.ttl.gz # Dante’s Latin toponyms
└── checksums/
└── sha256sums.txt # integrity checksums
```

All dataset files are compressed using gzip to reduce repository size.

---

## Dataset Files

### imago-archive.ttl.gz

This file contains the **core RDF dataset of the IMAGO archive**.

It includes:
- Works, expressions, manuscripts, and agents described in the IMAGO project
- Resources identified by **IMAGO-minted IRIs**
- Descriptive metadata expressed using CIDOC CRM, ILRMoo, and project-specific extensions
- References to external identifiers (e.g. Wikidata, Mirabile) where available

This dataset represents the primary body of data curated and published by the IMAGO project.

---

### imago-mmm.ttl.gz

This file contains **linking statements between the IMAGO dataset and the Mapping–Manuscript–Migration (MMM) project**.

It includes:
- Alignments between IMAGO resources and corresponding entities in the MMM dataset
- Explicit links expressed using standard RDF predicates (e.g. `owl:sameAs`, `skos:exactMatch`, or `skos:closeMatch`)
- No duplication of external data; only identifiers and linking assertions are provided

This file supports interoperability and reuse across related projects.

---

### imago-toponyms.ttl.gz

This file contains **Dante’s Latin toponyms** curated within the IMAGO project.

It includes:
- IMAGO-minted IRIs identifying toponyms
- Lexical and descriptive information associated with Latin place names
- Geographic references and links to external authority files (e.g. Wikidata, Mirabile) where applicable

The separation of toponym data supports focused reuse and independent analysis.

---

## Ontology

The ontology used to model all datasets is provided in the `ontology/` directory at the root of the repository.

It includes:
- The IMAGO ontology in Turtle and OWL formats
- Local copies of imported ontologies where necessary

Users are encouraged to load the ontology alongside the datasets to ensure correct interpretation of classes and properties.

---

## External Identifiers and Linking Policy

The datasets clearly distinguish between:

- **IMAGO-minted IRIs**, created and maintained by the project
- **External IRIs**, reused from authoritative external sources

External resources are **referenced, not replicated**.  
Linking predicates are selected conservatively to reflect the strength of the alignment and to avoid unintended identity claims.

---

## Loading the Datasets

The datasets can be loaded into any RDF triple store supporting Turtle.

Example using Apache Fuseki / TDB:

```bash
tdbloader --loc=DB data/dumps/imago-archive.ttl.gz
tdbloader --loc=DB data/dumps/imago-mmm.ttl.gz
tdbloader --loc=DB data/dumps/imago-toponyms.ttl.gz
```

Each file can be loaded independently or together, depending on the intended use.

## Versioning and Integrity

- Dataset releases are aligned with tagged software releases of the IMAGO tools.

- Cryptographic checksums are provided in checksums/sha256sums.txt to verify data integrity after download.

## Licensing

The datasets and the ontology are released under the GNU General Public License v3.0 (GPLv3), unless otherwise specified.

External identifiers (e.g. Wikidata, Mirabile, MMM) are reused in accordance with their respective licensing terms.

## Contact

For questions regarding the datasets or their reuse, please refer to the main repository README or open an issue in the repository.