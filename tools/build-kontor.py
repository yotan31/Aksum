"""
Baut die Kontor-Web-App (kontor/index.html) aus kontor/app.html.
kontor/app.html ist dieselbe Datei, die auch als Claude-Seite läuft.
Aufruf:  python3 tools/build-kontor.py
"""
import pathlib
root = pathlib.Path(__file__).resolve().parent.parent
app = (root / "kontor" / "app.html").read_text()
head = """<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#261a12">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="../images/logo-kranz.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="icon-192.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Kontor">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
"""
inject = """<script src="../js/config.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js"></script>
<script src="receipt-parser.js"></script>
<script src="kontor-supabase.js"></script>
<script>if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(function () {});</script>
"""
marker = '<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>'
assert app.count(marker) == 1
out = head + app.replace(marker, inject + marker) + "\n</body>\n</html>\n"
(root / "kontor" / "index.html").write_text(out)
print("kontor/index.html gebaut")
