"""Prerender the public pages into dist/ so search engines can index them.

Run after `vite build` (npm run deploy does both):
    uv run -q --with playwright python -I scripts/prerender.py

The app routes by hash (#/pinyin), and Google ignores everything after "#", so to Google
the whole site is one page. This opens each public page in a headless browser as a
signed-out visitor and saves what it renders as static HTML at a real path:

    dist/index.html          landing page      → SITE
    dist/pinyin/index.html   pinyin chart      → SITE + "pinyin/"
    dist/grammar/index.html  grammar index     → SITE + "grammar/"
    dist/music/index.html    中国风 songs       → SITE + "music/"
    dist/poems/index.html    古诗词 handscroll  → SITE + "poems/"
    dist/poems/{slug}/index.html  one per poem → SITE + "poems/{slug}/"  (list from src/data/poems/meta.json)

plus dist/sitemap.xml. The copy is plain HTML inside <div id="app"><div class="prerendered">;
the normal app boots on top and replaces it on mount (index.html's inline script turns /pinyin/
into /pinyin/#/pinyin and hides the copy for signed-in students). Course pages are
login-only and keep their #/… URLs — nothing here touches them.

Page list, titles and descriptions come from src/seo.js (the app sets them at runtime;
this script just captures them), so add a page there and to PAGES below.
"""

import datetime
import functools
import html
import http.server
import json
import re
import sys
import threading
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
SEO_JS = ROOT / "src" / "seo.js"
POEMS_META = ROOT / "src" / "data" / "poems" / "meta.json"

# (route, output dir under dist, element that means "the page has rendered", button to click
#  until it's gone — the grammar index pages its list, and all 792 names belong in the copy)
PAGES = [
    ("/", "", ".landing", None),
    ("/pinyin", "pinyin", ".fgroup", None),
    ("/grammar", "grammar", ".grp", ".btn.more"),
    ("/music", "music", ".trk", None),
    ("/poems", "poems", ".poems-ready", None),
]
# every poem gets its own page (PoemView sets its title/description via applyPoemSeo)
PAGES += [(f"/poems/{p['slug']}", f"poems/{p['slug']}", ".poem-ready", None)
          for p in json.loads(POEMS_META.read_text(encoding="utf-8"))["poems"]]
# public routes that have a static copy — their #/… links in the copy become real paths
STATIC_ROUTES = {route: outdir + "/" if outdir else "" for route, outdir, _, _ in PAGES}

HEAD_TAGS = 'meta[name="description"], link[rel="canonical"], meta[property^="og:"]'


def site_url():
    m = re.search(r'export const SITE = "([^"]+)"', SEO_JS.read_text(encoding="utf-8"))
    if not m:
        sys.exit("SITE not found in src/seo.js")
    return m.group(1)


def serve(directory):
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *args):
            pass

    handler = functools.partial(Quiet, directory=str(directory))
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def capture(browser, origin, route, ready, more):
    ctx = browser.new_context(viewport={"width": 1440, "height": 900})  # fresh = signed out
    page = ctx.new_page()
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto(f"{origin}/#{route}", wait_until="networkidle")
    page.wait_for_selector(ready, state="attached", timeout=20000)  # may sit in a hidden tab
    page.evaluate("document.fonts.ready")
    page.wait_for_timeout(1500)  # lazy data (grammar index, carousels) settles
    while more and page.locator(more).count():
        page.locator(more).first.click()
        page.wait_for_timeout(150)
    data = page.evaluate(
        """(sel) => ({
            app: document.querySelector('#app').innerHTML,
            title: document.title,
            head: [...document.head.querySelectorAll(sel)].map((el) => el.outerHTML),
            css: [...document.head.querySelectorAll('link[rel="stylesheet"]')].map((el) => el.getAttribute('href')),
        })""",
        HEAD_TAGS,
    )
    ctx.close()
    if errors:
        sys.exit(f"{route}: page errors while prerendering: {errors}")
    if not data["head"]:
        sys.exit(f"{route}: no SEO tags set — is it in src/seo.js?")
    return data


def build_page(template, data, route, depth, origin):
    # Pages in a subfolder get <base href="../">: every relative URL (assets, images, links) then resolves
    # from the site root as in index.html, and vue-router — which in hash mode only honours the path
    # before "#" when a <base> exists — roots its URLs there too (leaving /pinyin/ gives /#/grammar,
    # not /pinyin/#/grammar).
    up = "./"
    body = data["app"]
    # absolute dev-server URLs (images resolved via import.meta.url) → relative to this file
    body = body.replace(origin + "/", up)
    # links to pages that have a static copy → their real path, so crawlers can follow them
    def relink(path, rest, whole):
        if path in STATIC_ROUTES and not rest.startswith("#"):  # index.html carries ?… over into the hash
            return f'href="{up}{STATIC_ROUTES[path]}{rest}"'
        return whole
    body = re.sub(r'href="#(/[a-z0-9/-]*)([?#][^"]*)?"', lambda m: relink(m.group(1), m.group(2) or "", m.group(0)), body)

    out = template
    out = re.sub(r"<title>.*?</title>", f"<title>{html.escape(data['title'])}</title>", out, count=1, flags=re.S)
    # the route meta must precede index.html's inline boot script, which reads it
    base = f'\n    <base href="{"../" * depth}" />' if depth else ""  # before any relative URL
    out = out.replace(
        '<meta charset="UTF-8" />',
        f'<meta charset="UTF-8" />{base}\n    <meta name="prerender-route" content="{route}" />',
        1,
    )
    extra = list(data["head"])
    for href in data["css"]:
        if "fonts.googleapis" in href or href in out:
            continue
        href = href.replace(origin + "/", up)
        extra.append(f'<link rel="stylesheet" href="{href}">')
    out = out.replace("</head>", "    " + "\n    ".join(extra) + "\n  </head>", 1)
    out = out.replace(
        '<div id="app"></div>', f'<div id="app"><div class="prerendered">{body}</div></div>', 1
    )
    return out


def main():
    template_path = DIST / "index.html"
    if not template_path.exists():
        sys.exit("dist/index.html missing — run `npm run build` first")
    template = template_path.read_text(encoding="utf-8")
    if '<div id="app"><div class="prerendered">' in template:
        sys.exit("dist/index.html is already prerendered — rebuild first (npm run build)")
    if '<div id="app"></div>' not in template:
        sys.exit("dist/index.html has no empty #app")

    site = site_url()
    httpd = serve(DIST)
    origin = f"http://127.0.0.1:{httpd.server_address[1]}"
    rendered = {}
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for route, outdir, ready, more in PAGES:
            rendered[outdir] = (route, capture(browser, origin, route, ready, more))
        browser.close()
    httpd.shutdown()

    for outdir, (route, data) in rendered.items():
        depth = outdir.count("/") + 1 if outdir else 0
        target = DIST / outdir / "index.html"
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(build_page(template, data, route, depth, origin), encoding="utf-8")
        if not outdir.startswith("poems/"):  # 92 poem pages — don't list each one
            print(f"  {target.relative_to(ROOT)}  {target.stat().st_size // 1024} KB  {data['title'][:60]}")
    print(f"  dist/poems/*/index.html  {sum(o.startswith('poems/') for o in rendered)} poem pages")

    today = datetime.date.today().isoformat()
    urls = "".join(
        f"  <url><loc>{site}{outdir + '/' if outdir else ''}</loc><lastmod>{today}</lastmod></url>\n"
        for _, outdir, _, _ in PAGES
    )
    (DIST / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + "</urlset>\n",
        encoding="utf-8",
    )
    print("  dist/sitemap.xml")


if __name__ == "__main__":
    main()
