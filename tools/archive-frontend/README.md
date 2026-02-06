# IMAGO Archive Front‑End

The IMAGO archive front‑end is a web application for exploring the geographic works (lemmas), authors, manuscripts, print editions and places preserved in the IMAGO digital archive. It uses SPARQL queries to fetch data from an RDF triplestore and presents it through interactive tables, cards and maps. The goal of this README is to document the structure of the front‑end, describe its features, and provide instructions for running and customising it locally.

## Overview

This application implements a set of searchable pages that communicate with an Apache Jena Fuseki SPARQL endpoint. Fuseki is a SPARQL server that provides REST‑style SPARQL Query and SPARQL Update operations over HTTP. Each JavaScript file in the `js/` directory defines the endpoint URL and target graph (named graph) and issues SPARQL queries via `fetch`. Results are parsed from JSON and displayed using Bootstrap components, jQuery, DataTables and Leaflet.

The homepage (`index.html`) presents different search options: by author/title, by genre, by place, by library, by publisher and by date. Each option leads to specialised pages for searching and browsing. The application does not require a server‑side framework; it can be served as static files using any HTTP server.

## Key Features

The front‑end offers the following functionality:

### Search and Browse

- **Author and Title (lemma) search** – users can search for lemmas by entering an author and/or title. Results are displayed in a list with links to individual lemma pages.

- **Genre search** – a select‑box allows users to choose a genre. After selecting a genre, the corresponding works are listed.

- **Place/toponym search** – the Toponyms page displays all places mentioned in the archive on an interactive Leaflet map. Clicking a marker shows the works that mention that place. Leaflet is the leading open‑source JavaScript library for mobile‑friendly interactive maps, weighing only about 42 KB and offering features such as tile layers, markers, popups and vector layers.

- **Library search** – the Libraries map page shows the locations of libraries holding manuscripts. Markers can be clicked to display manuscripts kept in that library. A separate Libraries List page lists all libraries alphabetically with links to detailed pages.

- **Publisher search** – the Publishers page maps places of publication of printed editions and lists the editions printed in each location.

- **Date search** – users can select one or more centuries and view manuscripts copied in those centuries. Results are paginated and can be downloaded as CSV.

### Detailed Views

- **Lemma page** – presents detailed metadata about a work, including its author, title, abstract, genres, places mentioned, associated manuscripts and printed editions.

- **Author page** – shows information about an author and lists their works.

- **Manuscript page** – displays manuscript details such as library location, shelf mark, folios, incipit/explicit texts, decoration, notes and sources.

- **Print edition page** – shows publication details (place, publisher, curator, format, pages, illustrations, notes). Links connect the edition back to its lemma and author.

- **Library page** – lists manuscripts held by a specific library and provides coordinates for the library.

- **Place page** – shows a toponym’s coordinates and lists associated libraries, works and printed editions.

### Interactive UI Components

- **DataTables integration** – tables are enhanced using the DataTables jQuery plug‑in. DataTables is a simple‑to‑use jQuery plug‑in with a huge range of customisable options, such as sorting, searching and pagination. The project uses the bundled minified files in libs/DataTables.

- **jQuery** – most DOM manipulation and AJAX operations rely on jQuery. The jQuery website describes it as a fast, small and feature‑rich JavaScript library that makes HTML document traversal, event handling, animation and Ajax much simpler with an easy‑to‑use API. jQuery is included in libs/jquery/1.11.0.

- **Leaflet** – interactive maps for toponyms, libraries and publishers are created with Leaflet. According to the Leaflet website, it is the leading open‑source library for mobile‑friendly interactive maps, with a lightweight core and comprehensive features. Additional Leaflet plug‑ins (marker clustering and full‑screen control) are included in libs/leaflet.markercluster and libs/leaflet.fullscreen.

- **Bootstrap** – the site uses Bootstrap 5 for styling and responsive layout. Components such as cards, nav tabs, forms and navigation bars provide a consistent look and feel. The Bootstrap CSS and JS files are stored in libs/bootstrap/5.0.2.

- **Selectize** – multi‑select dropdowns on the date and genre pages are powered by Selectize, a lightweight select enhancement library.

## Directory Structure
```graphql
archive‑frontend/
├── index.html              # Homepage offering search options
├── search.html             # Search by author/title
├── genres.html             # Search by genre
├── toponyms.html           # Map of places mentioned in works
├── libraries.html          # Map of libraries
├── librariesList.html      # Alphabetical list of libraries
├── library.html            # Detail page for a library
├── authors.html            # Alphabetical list of authors and aliases
├── author.html             # Detail page for an author and their works
├── lemma.html              # Detail page for a work (lemma)
├── manuscript.html         # Manuscript metadata
├── printEdition.html       # Print edition metadata
├── works.html              # List of all works
├── publishers.html         # Map of publishing places and print editions
├── dateSearch.html         # Search manuscripts by century
├── place.html              # Detail page for a place/toponym
├── placesList.html         # List of all places
├── placesListPrint.html    # List of printing places
├── placesListToponyms.html # List of toponyms
├── css/                    # CSS styles (custom and responsive)
├── js/                     # JavaScript files (one per page plus shared utilities)
├── libs/                   # Third‑party libraries (Bootstrap, jQuery, DataTables, Leaflet, Selectize)
├── html/                   # Shared header and footer templates
└── queries.rq              # Example SPARQL queries (for reference)
```

## JavaScript Modules

The `js/` folder contains one script per HTML page. Each script defines a constant url pointing to the Fuseki query endpoint (e.g. `https://imagoarchive.it/fuseki/imago/query?output=json&query=`) and a `named_graph` identifying the RDF graph. Functions construct SPARQL queries with appropriate filters, send them via `fetch`, and update the DOM with the results. A common `functions.js` file provides utility functions for parsing WKT coordinates, sorting, Roman numeral handling and list rendering. The include.js script loads the shared header and footer into each page.

## Running the Application Locally

Because this project is a set of static files, it must be served over HTTP in order for AJAX requests to work correctly. The simplest way to run a local server is using Python’s built‑in `http.server` module. The Python documentation notes that you can start a server with `python -m http.server` and it will listen on port 8000 by default. You can override the port by passing it as an argument. For example:

```bash
cd archive‑frontend
python3 -m http.server 8000
# or use another port, e.g. python3 -m http.server 9000
```

After starting the server, open your browser at `http://localhost:8000/` (or your chosen port). The homepage will appear and you can navigate through the application. If you prefer to use another static server (e.g. Node’s `http-server` or Nginx), any method that serves files from the project directory will work.

## Configuring the SPARQL Endpoint

The application is configured to query the IMAGO triple store at `https://imagoarchive.it/fuseki/imago/`. If you want to point the front‑end at your own Fuseki instance, edit the `url` and `named_graph` constants at the top of each JavaScript file in `js/`. For example, in `js/lemma.js` you’ll find:

```js
const url = "https://imagoarchive.it/fuseki/imago/query?output=json&query=";
const named_graph = "https://imagoarchive.it/fuseki/imago/archive";
```

Change these values to point to your own query endpoint and dataset graph. Fuseki’s default query endpoint for a dataset named ds is `http://host:3030/ds/query`.

If your Fuseki server requires authentication or uses HTTPS with self‑signed certificates, you may need to adapt the fetch requests accordingly.

## Developing and Customising

- **Custom styling** – CSS files in css/ define the layout, typography and responsive breakpoints. You can modify these files or add new styles to adjust the look and feel. Bootstrap is used as the underlying framework.

- **Adding new pages** – to add a new search or visualisation page, copy the structure of an existing page (e.g. search.html and its js/search.js), create a corresponding HTML and JS file, and register it in the navigation header (html/header_it.html). Use SPARQL queries in your script to retrieve the required data.

- **Extending SPARQL queries** – the queries.rq file provides sample SPARQL queries. You can test queries against your triple store using the Fuseki web interface or command line. Fuseki’s SPARQL endpoint is described by the Apache Jena documentation.

- **Internationalisation** – the current templates are written in Italian (labels like “Opere geografiche” and “Biblioteche”). To support other languages, duplicate the HTML pages and translate the strings, or use a client‑side internationalisation library.

## Notes and Best Practices

- Use DataTables wisely – DataTables can make large tables easier to navigate. Pass the appropriate options when initialising tables (e.g. sorting, pagination) as demonstrated in `authors.js` and `librariesList.js`. The DataTables documentation shows that options can be passed as an object to customise behaviour.

- Handle asynchronous requests – all SPARQL queries are asynchronous; update the DOM only after the `fetch` promise resolves. Use `async/await` for clarity.

- Cache repeated queries – some pages fetch the same information multiple times (e.g. list of genres or centuries). Consider caching results in local variables to reduce network calls.

- Accessibility – where possible, add ARIA labels to improve accessibility. For example, map markers include accessible popups, and tables use semantic headings.

# Contributing

Contributions are welcome! If you find bugs, wish to add new functionality or improve the UI, please open an issue or submit a pull request. When working with SPARQL queries or modifying the underlying ontology, ensure that any changes remain consistent with the IMAGO data model.