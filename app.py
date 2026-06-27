import mimetypes
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def _safe_file_path(request_path: str) -> str:
    clean_path = (request_path or "/").split("?", 1)[0].lstrip("/")
    if not clean_path or clean_path.endswith("/"):
        clean_path = "index.html"
    if ".." in clean_path:
        clean_path = "index.html"

    file_path = os.path.join(BASE_DIR, clean_path)
    if not os.path.isfile(file_path):
        file_path = os.path.join(BASE_DIR, "index.html")
    return file_path


def app(environ, start_response):
    """Minimal WSGI app for Vercel's Python runtime.

    The project setting in Vercel is currently `python`, so Vercel requires a
    top-level `app`, `application`, or `handler`. This app serves the existing
    static charter portal files from the repository.
    """
    request_path = environ.get("PATH_INFO", "/")
    file_path = _safe_file_path(request_path)
    content_type = mimetypes.guess_type(file_path)[0] or "text/html; charset=utf-8"

    with open(file_path, "rb") as file:
        body = file.read()

    start_response(
        "200 OK",
        [
            ("Content-Type", content_type),
            ("Cache-Control", "public, max-age=60"),
        ],
    )
    return [body]


application = app
