"""
Baut die Kontor-Web-App (kontor/index.html) aus kontor/app.html.
kontor/app.html ist dieselbe Datei, die auch als Claude-Seite läuft.
Aufruf:  python3 tools/build-kontor.py
"""
import base64, hashlib, pathlib, re
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
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js" integrity="sha256-hZaWX+kY5lZgChtWjToWj1wNPSKmAIhrtvRKZVXbAec=" crossorigin="anonymous"></script>
<script src="receipt-parser.js"></script>
<script src="kontor-supabase.js"></script>
<script>if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(function () {});</script>
"""
marker = '<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>'
assert app.count(marker) == 1
# JSZip liegt in der Web-App lokal (keine fremde Quelle nötig)
body = app.replace(marker, inject + '<script src="vendor/jszip-3.10.1.min.js"></script>')
# Sicherheitsregel (CSP): nur eigene Skripte, die festen Bibliotheken und Supabase
hashes = " ".join("'sha256-" + base64.b64encode(hashlib.sha256(m.encode()).digest()).decode() + "'" for m in re.findall(r"<script>([\s\S]*?)</script>", body))
csp = ("default-src 'self'; "
       f"script-src 'self' https://cdn.jsdelivr.net 'wasm-unsafe-eval' {hashes}; "
       "worker-src 'self' blob: https://cdn.jsdelivr.net; "
       "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://cdn.jsdelivr.net data: blob:; "
       "img-src 'self' data: blob: https://*.supabase.co; "
       "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
       "font-src https://fonts.gstatic.com; "
       "frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'self'")
head = head.replace('<meta name="robots"', f'<meta http-equiv="Content-Security-Policy" content="{csp}">\n<meta name="referrer" content="no-referrer">\n<meta name="robots"')
out = head + body + "\n</body>\n</html>\n"
(root / "kontor" / "index.html").write_text(out)
print("kontor/index.html gebaut")
