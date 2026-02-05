# IMAGO Deployment Guide

This document describes how the IMAGO software components can be deployed and configured.  
It is intended to support reproducibility of the system and to clarify the relationship between the different tools in the IMAGO pipeline.

The deployment described here reflects the setup used during development and evaluation; alternative configurations are possible due to the modular architecture of the system.

---

## Deployment Overview

The IMAGO system is composed of four main software components:

1. IMAGO Annotation Tool (Django-based web application)
2. Java-based Triplifier
3. Linking Tool
4. Archive Frontend and SPARQL Endpoint

These components can be deployed independently, but are typically used together following the workflow described in `docs/architecture.md`.

---

## Prerequisites

The following software is required for a full deployment:

- **Operating system:** Linux or macOS (tested); Windows via WSL is possible
- **Python:** ≥ 3.9
- **Java:** ≥ 11
- **Maven:** ≥ 3.6
- **Database:** PostgreSQL ≥ 12
- **RDF Store:** Apache Fuseki ≥ 4.x
- **Web browser:** Modern browser for frontend access

---

## 1. Annotation Tool Deployment

**Location:** `tools/annotation-tool/`

### Setup

1. Create and activate a Python virtual environment:
```bash
python -m venv venv
source venv/bin/activate
```
2. Install Python dependencies:
```bash
pip install -r requirements.txt
```
3. Configure the database connection in the Django settings.

4. Apply database migrations:
```bash
python manage.py migrate
```

5. (Optional) Create a superuser:
``` bash
python manage.py createsuperuser
```

6. Start the development server:
```bash
python manage.py runserver
```

The annotation tool will be accessible at http://localhost:8000/.

### Data Export
Annotated data can be exported through the web interface as structured JSON files, which are used as input for the triplifier.

## 2. Triplifier Deployment
Location: tools/triplifier/

### Build
The triplifier is a Java application managed with Maven.
```bash
mvn clean package
```
This produces an executable JAR file in the target/ directory.

### Execution
```bash
java -jar imago-triplifier.jar path/to/input.json path/to/output.rdf
```
- Input: JSON exported from the annotation tool
- Output: RDF in RDF/XML or Turtle format

Configuration files control namespace declarations, ontology mappings, and serialization options.

## 3. Linking Tool Deployment
Location: tools/linking/

### Setup
1. Create and activate a Python virtual environment (recommended).

2. Install dependencies:
```bash
pip install -r requirements.txt
```
### Usage
The linking tool is executed as a set of Python scripts operating on RDF or tabular exports.

Example:
```bash
python link_places.py input.rdf output_links.ttl
```
The generated linksets can be merged with the core RDF dataset before or after ingestion into the triple store.

## 4. SPARQL Endpoint Deployment

### Apache Fuseki
1. Download and install Apache Fuseki.

2. Create a new dataset (e.g. imago).

3. Load the RDF files produced by the triplifier and linking tool.

The SPARQL endpoint will typically be available at:
```
http://localhost:3030/imago/sparql
```
## 5. Archive Frontend Deployment
Location: tools/archive-frontend/

The archive frontend is a static web application.

### Setup
1. Configure the SPARQL endpoint URL in the frontend configuration (e.g. in index.html or a JS config file).

2. Serve the files using any web server, for example:
```bash
python -m http.server 8080
```
Access the frontend at:
```
http://localhost:8080/
```

The interface includes an embedded SPARQL editor (YASGUI) and example queries corresponding to those discussed in the paper.

## Minimal Reproducibility Setup
For they wishing to inspect the system with minimal effort:

1. Deploy Apache Fuseki

2. Load the provided RDF dataset

3. Open the archive frontend and execute the example SPARQL queries

This setup does not require deploying the annotation or triplification components.

## Security and Production Notes
- The Django annotation tool should be deployed behind a production-grade web server (e.g. Nginx, Gunicorn).

- Authentication and authorization should be configured according to institutional policies.

- Public deployments should expose only the SPARQL endpoint and frontend, not the annotation backend.

## Versioning and Releases
- Each tool is versioned within this repository.

- Tagged releases correspond to stable configurations used in the paper.

- Configuration files used for evaluation are preserved to support reproducibility.

## Troubleshooting
Common issues include:

- Java version mismatches when building the triplifier

- Incorrect namespace configuration in RDF output

- SPARQL endpoint URL misconfiguration in the frontend

Refer to the individual tool READMEs for detailed troubleshooting steps.