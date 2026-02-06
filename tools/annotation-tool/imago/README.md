# IMAGO Django project

## Overview

The imago directory contains the top‑level Django project that stitches together the annotation app and provides global configuration for the IMAGO Annotation Tool. It defines settings, root URL patterns and WSGI/ASGI entry points, and bundles the static assets used by the application. In Django terms, a project is a collection of settings and applications, whereas the annotation app implements the domain logic.

## Structure

| File/Directory        | Purpose                                                                                                                                                                                                                                                                                                                    |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `settings.py`         | Defines the Django settings.  It reads environment variables from the `.env` file to configure the database (`DATABASES`), secret key and debug mode.  It registers installed apps (including `annotation`), sets time zone and language, specifies template loaders and static file locations, and configures middleware. |
| `urls.py`             | Root URL configuration.  Includes the `annotation` app’s URL patterns and the built‑in Django admin site, mapping URL paths to views.                                                                                                                                                                                      |
| `asgi.py` / `wsgi.py` | Entry points for ASGI and WSGI servers respectively.  Use `wsgi.py` when deploying with WSGI servers such as Gunicorn, or `asgi.py` with ASGI servers such as Daphne or Uvicorn.                                                                                                                                           |
| `static/`             | Contains static assets bundled with the project:                                                                                                                                                                                                                                                                           |

- `bootstrap/` and `bootstrap-autocomplete/` – CSS and JavaScript used to style the annotation interface and provide autocomplete functionality.

`fontawesome/` – Icons used throughout the interface.

`tinymce/` – A rich text editor used in notes and abstract fields.

`admin/` – Stylesheets, fonts and images for Django’s built‑in admin.

`hdn/` and `imago/` – Custom styles and scripts for this project. |

## Configuration

1. Database – `settings.py` reads credentials from the `.env` file. To change the backend (for example, use SQLite during development), update the `ENGINE` and `NAME` keys of the `DATABASES` dictionary. Django officially supports PostgreSQL, MariaDB, MySQL, Oracle and SQLite. Other databases can be supported via third‑party backends.

2. Secret key and debug mode – For security, set `SECRET_KEY` and `DEBUG` via environment variables. Never commit real secret keys to version control. In production, set `DEBUG = False` and configure `ALLOWED_HOSTS` accordingly.

3. Static files – During development the `runserver` command can serve static files. For production, run `python manage.py collectstatic` to collect all static assets into a single directory and configure your web server to serve them efficiently. `settings.py` defines `STATIC_URL` and `STATIC_ROOT` to control this behaviour.

4. Installed apps – Ensure `'annotation'` is included in `INSTALLED_APPS` so that the models, templates and static files of the annotation app are loaded. You can add other Django apps (e.g., `django.contrib.sites`, `rest_framework`) here as needed.

## Running the project

- Development – After installing dependencies and applying migrations (see the root README.md
 for details), run `python manage.py runserver` to start the development server. This will serve the site at `http://127.0.0.1:8000/` and automatically reload when code changes.

- Production – For deployment, configure a proper WSGI or ASGI server. For example, with Gunicorn:

```bash
gunicorn imago.wsgi:application --bind 0.0.0.0:8000
```

and place a reverse proxy (such as Nginx) in front of Gunicorn to serve static files and handle TLS. Consult Django’s deployment checklist and choose a server (Gunicorn, uWSGI, Daphne, Uvicorn) appropriate for your environment.

## Customization

- Templates – Global templates (such as `base.html`) live in your `templates` directory (not included here). To customise the look and feel of the application, extend or override these templates. Use Bootstrap classes and FontAwesome icons provided in `static/`.

- Static assets – To upgrade Bootstrap or FontAwesome, replace the corresponding directories in `static/`. If you add new JavaScript or CSS libraries, update `settings.py` and your templates to reference them.

By separating the project configuration (`imago`) from the domain‑specific application (`annotation`), the IMAGO Annotation Tool remains modular and easy to maintain.