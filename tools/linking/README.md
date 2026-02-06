# IMAGO Linking Toolkit

The IMAGO linking toolkit is a set of Python scripts used to enrich data from the [IMAGO](https://imagoarchive.it/) digital archive. It links authors, works, sources, libraries and places from IMAGO to their corresponding entities in Wikidata, a free and open knowledge base that anyone can read and edit. By connecting IMAGO data to Wikidata identifiers (IRIs), the toolkit makes it easier to integrate the archive into the Linked Data web and to retrieve additional metadata such as geographic coordinates, country and official place names.

The toolkit also contains a scraper for Mirabile (a digital library of medieval manuscripts and works) to gather complementary data. All scripts are written in Python 3 and use standard modules (csv, json, urllib) and a small set of third‑party libraries to query external services.

## Contents
```graphql
linking/
├── imago.tsv                   # Tab‑separated list of authors and sources from IMAGO
├── imago_wd.py                 # Match IMAGO authors and sources to Wikidata
├── imago_wd_library.py         # Match libraries to Wikidata (requires TSV file)
├── Estrazione country e gpe/   # Extract geographic information for libraries and places
│   ├── biblioteche.tsv         # List of library names
│   ├── estrazione_country_gpe.py   # Extract coordinates, country and administrative regions
│   ├── extract_official_names.py   # Retrieve official names of places
│   ├── jsonUpdate.py           # Filter JSON records by presence of geographic data
│   └── json/                   # Duplicate scripts for convenience
└── Scraped on Mirabile/
    └── code/
        └── scrape_mirabile.py  # Scrape authors and works from the Mirabile website
```

## Data files

- **imago.tsv** — Contains lines with three fields separated by tabs: author name, author aliases (in angle brackets) and work title. It is used by `imago_wd.py` to create dictionaries of authors and sources. You can modify or replace this file to suit your dataset.

- **biblioteche.tsv** — A list of library names, one per line, used by `estrazione_country_gpe.py` to look up geographic information. If you have a different list of libraries, replace this file accordingly.

## Linking to Wikidata

Wikidata is a multilingual knowledge graph that acts as the central repository for structured data used by Wikipedia and other Wikimedia projects. It contains over 119 million items that can be queried and edited by both humans and machines. The Wikidata Query Service exposes a public SPARQL endpoint with a web‑based editor; SPARQL is a semantic query language for RDF data that allows you to extract arbitrary information by combining triples. The linking toolkit interacts with this endpoint via HTTP to search for matching entities and to retrieve additional properties.

## Dependencies

All scripts are compatible with Python 3. Some require external libraries; install them with pip:
```bash
pip install requests beautifulsoup4 urllib3 random2 proxybroker
```
- requests — An Apache‑licensed HTTP library written in Python “for human beings”. It simplifies sending HTTP requests, adding headers and decoding responses, and is used for API calls.
- beautifulsoup4 (bs4) — For parsing HTML in the Mirabile scraper.
- urllib3 and random2 — Used in the scraper to handle HTTP connections and random navigation.
- proxybroker — Optional, used to discover proxies for scraping; the scraper can run without it if proxies are not needed.

Note: If you only run the Wikidata linking scripts (`imago_wd.py` and scripts under Estrazione country e gpe), requests is sufficient; the other dependencies are only needed for the Mirabile scraper.

## Scripts and Usage
### 1. `imago_wd.py` – Link authors and sources

This script reads a TSV file of IMAGO authors and works (`imago.tsv`), constructs a list of authors and sources, and searches Wikidata for matching entities using the Wikidata Query Service. It supports two modes:

- **Import from TSV** — When `IMPORT_FROM_TSV` is set to `True`, the script parses `imago.tsv` and writes two JSON files (`authors.json` and `sources.json`) where each entry contains the author or source name and its aliases. The script then proceeds to search Wikidata.

- **Use existing JSON** — When `IMPORT_FROM_TSV` is `False`, the script loads existing `authors.json` and `sources.json` files created in a previous run.

The script defines flags to control which entities to search:
```python
IMPORT_FROM_TSV  = False  # Load data from imago.tsv if True
SEARCH_WD_AUTHORS = True   # Search Wikidata for authors
SEARCH_WD_SOURCES = True   # Search Wikidata for sources (works)
```

During execution the script assembles a SPARQL query that looks for items with matching labels or aliases in multiple languages. The results are displayed one at a time and the user is asked to confirm the match, skip to the next candidate or manually enter a Wikidata identifier. Confirmed IRIs are stored in the JSON files. At the end of the run the script reports how many authors and sources have associated Wikidata IRIs.

To run:
```bash
cd linking
python3 imago_wd.py
```
You can interrupt the script at any time; confirmed matches are saved incrementally.

### 2. `imago_wd_library.py` – Link libraries

`imago_wd_library.py` performs a similar task for libraries. Set `IMPORT_FROM_TSV` to True and specify the path of a TSV file containing library names (`bibliotecheOutput2.tsv` or similar). The script reads each name, constructs search queries to Wikidata, and writes out `authors.json` and `sources.json` files. This script is meant to be customised: change `TSV_FILE` to point to your own list and adjust `SEARCH_WD_AUTHORS/SEARCH_WD_SOURCES` flags to control what is matched.

```python
TSV_FILE = 'bibliotecheOutput2.tsv'  # replace with your TSV file
IMPORT_FROM_TSV  = True
SEARCH_WD_AUTHORS = True  # search for libraries as instances of Q1030034 (library)
SEARCH_WD_SOURCES = False # disable source search
```

After execution, `authors.json` contains your library names and their matched Wikidata IRIs. The script prints statistics summarising how many items were linked.

### 3. Geographic extraction scripts (Estrazione country e gpe)

The `Estrazione country e gpe` directory contains utilities to enrich library and place data with geographic information:

- `estrazione_country_gpe.py` — Reads a list of library or place IRIs (from `places.json`) and queries Wikidata to obtain geographic coordinates (P625), country (P17) and administrative unit (P131) for each item. The script writes the results to `place_complete.json`. It also includes commented code to search for libraries by name using the Wikidata search API. Before running, ensure that `places.json` contains items with iri and name keys.

- `extract_official_names.py` — Given a JSON file of libraries with IRIs, this script retrieves the official names (P1448) and labels for each item. It produces `places.json` containing place IRIs and their official names. You can adjust the input (`LIBRARY_FILE`) and output (`PLACES_FILE`) file names.

- `jsonUpdate.py` — Utility to filter a JSON file of libraries or places, keeping only records that have at least one of coord, country or gpe fields populated. This helps prune incomplete entries before further processing.

Run these scripts as follows:
```bash
cd linking/Estrazione\ country\ e\ gpe
python3 extract_official_names.py    # builds places.json from libraries.json
python3 estrazione_country_gpe.py    # enriches places.json with coordinates and countries
python3 jsonUpdate.py                # optional: filters the resulting JSON
```
### 4. Mirabile scraper

The `scrape_mirabile.py` script in Scraped on Mirabile/code is a web scraper used to extract authors and works from the Mirabile digital library. It relies on Beautiful Soup for HTML parsing and uses Django’s management command interface. The scraper accepts command‑line options to specify starting author/work IDs, output file names and whether to scrape authors or works:
```bash
cd linking/Scraped\ on\ Mirabile/code
python3 scrape_mirabile.py -a -f mirabile_authors.csv   # scrape authors
python3 scrape_mirabile.py -w -n mirabile_works.csv     # scrape works
```

The script navigates the Mirabile website, collects metadata for each author or work (names, links, ratings, prices) and writes results to CSV files. It supports proxies and random navigation, although proxies are optional. You may need to set up a Django project environment if using the management command features; alternatively, remove the Django imports and run the scraping functions directly.

## Tips and Best Practices

1. Use small batches — The Wikidata Query Service has fair use guidelines  limiting the number of requests per second. Insert delays or process a small number of items at a time to avoid throttling.

2. Cache intermediate results — The scripts write intermediate JSON files after each confirmed match; if the process is interrupted, you can resume without losing previous work. Back up your authors.json/sources.json files between runs.

3. Validate matches manually — Automatic name matching can yield false positives. Always review the candidate items displayed by the scripts and confirm only the correct ones. You may also enter a known Wikidata Q‑identifier manually to bypass the search.

4. Extend SPARQL queries — If your dataset requires different properties (e.g. birth/death dates for authors), adapt the query strings in imago_wd.py accordingly. The Wikidata Query Service documentation explains how to build SPARQL queries.

5. Leverage the requests library — The scripts use Python’s urllib for basic HTTP; you can replace these calls with the higher‑level requests API. Requests supports sessions, automatic decompression, connection pooling and many other features.

## Contributing

Contributions are welcome! If you encounter issues, wish to support new entity types or extract additional properties from Wikidata, feel free to fork the repository and submit pull requests. Please respect Wikidata’s usage policies and avoid overloading their query service.
