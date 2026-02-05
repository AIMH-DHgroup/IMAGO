# IMAGO annotation tool

To populate the ontology developed within the [Index Medii Aevi Geographiae Operum (IMAGO)](https://imagoarchive.it) -- Italian National Research Project (2020-23), we developed a semi-automatic Web tool, called IMAGO Annotation Tool, to allow scholars to insert knowledge about Medieval and Reinassance works through a user-friendly interface. 

The tool was created to reduce the time to insert knowledge and to avoid the insertion of mistakes thanks to the use of predefined lists of works, authors, libraries, places, geographic coordinates, and literary genres. Each field of the interface maps a class of the [IMAGO ontology](https://imagoarchive.it/documentation/doc/index-en.html). The frontend interface is built using HTML5, CSS3, JavaScript, and the Bootstrap library, using a Python backend, i.e., a Django framework and a PostgreSQL DB. 

Once the data about a work is inserted through the tool interface, this is encoded as an OWL knowledge base and stored in a triple store. The data is first exported to a JSON object. Indeed our software uses a JSON schema to represent the data, structured according to the IMAGO ontology classes. The JSON object is processed by [Java software](https://github.com/prate91/imagoTriplifier), which transforms it into an OWL graph encoded in RDF/XML and Turtle formats. This software carries out its task by relying on the Apache Jena library. The graph is finally stored in a Fuseki triple store, and it can be queried through a SPARQL endpoint.

## Requirements

PostgreSQL


## Installation

In order to install the package just download (or clone) the current project and copy the folder in the root of your application.

Create a Database PostgreSQL and a user with grants on that database.

Create a file .env and put it in the root of IMAGO annotation tool with the information of your DB:

```bash
DB=database_name
USERNAME=username
PASSWORD=pw
HOST=localhost
```

### Activate the virtual environment

```bash
source .venv/bin/activate
```

### Initialize the DB of the tool
```bash
python3 manage.py makemigrations
python3 manage.py migrate
```

### Populate the tool

```bash
python3 manage.py import_iri
python3 manage.py import_lemmas
```

### Launch the application

```bash
python3 manage.py runserver
```

## Cite as


```bibtex
@online{imagoAnnotatioTool,
	title = {IMAGO Annotation Tool},
	author = {Nicol\`o Pratelli and Valentina Bartalesi and Emanuele Lenzi},
	year = {2022},
	url = {https://github.com/prate91/IMAGO\_annotation\_tool},
	urldate = {2022-11-23}
}
```