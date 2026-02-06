# IMAGO Annotation Tool

## Overview

The IMAGO Annotation Tool is a web‑based application that helps scholars annotate and enrich the [IMAGO ontology](https://imagoarchive.it/) with structured information about medieval and Renaissance works, authors, libraries and places. A user‑friendly interface guides researchers through the creation of lemmas—entries that connect authors, literary works and their physical manifestations (manuscripts or printed editions) together with geographical and temporal metadata. Data are stored in a PostgreSQL database, exported as JSON objects and converted into RDF/OWL for publication in a triple store.

## Features

- Structured lemmas – Forms are provided for authors, works, manuscripts and printed editions. Each form includes fields for names, titles, dates, physical descriptions (folios, incipits/excplicits) and external identifiers.

- Autocomplete & controlled vocabularies – Predefined lists of authors, works, libraries, places and genres populate autocomplete widgets so users can select existing entries rather than entering free text. Controlled vocabularies reduce spelling errors and duplicate records.

- Bulk import & export – Initial datasets are stored as JSON files and imported via Django management commands. Lemmas can be exported back to JSON; an external Java tool (`imagoTriplifier`) converts these JSON files into RDF encoded in Turtle or RDF/XML. Apache Jena supports a wide range of RDF serializations, including Turtle, JSON‑LD, TriG and RDF/XML.

- User management & review – The tool integrates with Django’s authentication system to restrict access and record who created or modified each lemma. Command‑line tools allow administrators to import new data, update existing entries or export records for publication.

## Requirements

- Python 3.8 or newer. The backend is built with Django 3.0. Follow Django’s installation guidelines; once installed you can start the development server using the runserver management command.

- PostgreSQL. The application uses a PostgreSQL database for persisting lemmas and lookup tables. Install PostgreSQL and create a database and user before running the tool.

- Optional: Java 11+ and Apache Jena. If you plan to run the imagoTriplifier to convert JSON exports into RDF/OWL, install Java and download Apache Jena. Jena’s riot tools can read and write several RDF formats.

## Installation

1. Clone the repository and create a virtual environment. Keeping dependencies in a virtual environment avoids polluting your system Python. Example commands:

```bash
git clone https://github.com/prate91/IMAGO_annotation_tool.git
cd IMAGO_annotation_tool
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements/requirements.txt
```

2. Create a .env file in the project root. This file stores database credentials used by Django:

```
DB=your_database_name
USERNAME=your_db_user
PASSWORD=your_db_password
HOST=localhost
```

Make sure the database and user exist in PostgreSQL and have appropriate privileges.

3. Apply database migrations. Django’s migration system propagates model changes into the database. Run:

```bash
python manage.py makemigrations
python manage.py migrate
```

4. Load initial data. The tool ships with curated JSON datasets for authors, works, libraries, places and genres. Populate the database by executing the provided management commands:

```bash
python manage.py import_iri      # loads controlled vocabularies from annotation/json/
python manage.py import_lemmas   # imports existing lemmas (optional)
```

Additional commands (e.g., `update_lemmas`, `export_libraries`, `export_places`) are documented in the annotation/README.md.

5. Start the development server. Django includes a lightweight server for testing. From the project root, run:
```bash
python manage.py runserver
```

Visit `http://127.0.0.1:8000/` in your web browser. The development server is not meant for production; deploy with a WSGI or ASGI server (e.g., Gunicorn or Daphne) when ready.

6. Export to RDF (optional). After annotating, export lemmas to JSON using the management commands and run the external imagoTriplifier (Java) to convert them into RDF/OWL. Apache Jena recognises multiple RDF syntaxes and distinguishes between JSON‑LD and RDF/JSON.

## Usage

Once logged in, select Add lemma to open the annotation form. Complete the author and work sections, then add one or more manuscript or print edition manifestations. Autocomplete fields let you search the imported vocabularies. If an entry is missing, click the “add author” or “add work” link to create it directly from the form. After saving, lemmas appear in the list view where you can filter, edit or delete them. Administrators can export lemmas or update datasets via the provided management commands.

## Citing the tool

If you use the IMAGO Annotation Tool in your research, please cite it in your publications:
```bibtex
@online{imagoAnnotatioTool,
  title   = {IMAGO Annotation Tool},
  author  = {Nicol\`o Pratelli and Valentina Bartalesi and Emanuele Lenzi},
  year    = {2022},
  url     = {https://github.com/prate91/IMAGO_annotation_tool},
  urldate = {2022-11-23}
}
```