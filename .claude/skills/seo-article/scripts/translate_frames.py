#!/usr/bin/env python3
"""Make an English copy of a diagram page by exact string replacement per frame.

    translate_frames.py src.html out.html pairs.json

pairs.json: {"<frame-id>": [["Polish text", "English text"], ...], ...}
Every source string must exist inside its frame, or the script stops. At the
end it prints any Polish-looking words left outside <script>/<style>, so a
missed label is caught before rendering.
"""
import json
import re
import sys


def main() -> None:
    src, out, pairs_path = sys.argv[1:4]
    s = open(src, encoding="utf-8").read().replace('<html lang="pl">', '<html lang="en">')
    pairs = json.load(open(pairs_path, encoding="utf-8"))
    for frame, items in pairs.items():
        i = s.index(f'id="{frame}"')
        j = s.find("</section>", i)
        part = s[i:j]
        for a, b in items:
            if a not in part:
                sys.exit(f"{frame}: not found: {a!r}")
            part = part.replace(a, b)
        s = s[:i] + part + s[j:]
    open(out, "w", encoding="utf-8").write(s)
    body = re.sub(r"<script.*?</script>|<style.*?</style>|src=\"[^\"]*\"", "", s, flags=re.S)
    left = sorted(set(re.findall(r"[A-Za-z]*[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]*", body)))
    print("Polish words left:", left or "none")


if __name__ == "__main__":
    main()
