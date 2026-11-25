#!/bin/sh
# Print a JavaScript snippet that replaces the Senuto Writer editor content with
# an HTML file and, ~10 s later, returns the Content Score and the "Twoje cele"
# readout. Paste the output into claude-in-chrome javascript_tool (javascript_exec)
# on the Writer article tab. Fetching the HTML from localhost does not work there,
# so the file is inlined as a JSON string.
#
#   writer-js.sh draft.html
[ -f "$1" ] || { echo "usage: writer-js.sh file.html" >&2; exit 1; }
printf 'const html=%s;\n' "$(python3 -c "import json,sys;print(json.dumps(open(sys.argv[1]).read()))" "$1")"
cat <<'JS'
const sl=ms=>new Promise(r=>setTimeout(r,ms));
const tg=()=>[...document.querySelectorAll('a')].find(e=>e.textContent.trim()==='Źródło HTML');
if(!document.querySelector('.cm-content')){tg().click();await sl(1500);}
const v=document.querySelector('.cm-content').cmView.view; v.dispatch({changes:{from:0,to:v.state.doc.length,insert:html}});
await sl(500); tg().click(); await sl(10000);
const score=[...document.querySelectorAll('*')].find(e=>e.childElementCount===0&&/^\d{1,3}$/.test(e.textContent.trim())&&e.closest('[class*=score i]'))?.textContent; const t=document.body.innerText; const a=t.indexOf('Twoje cele'); 'score='+score+' '+t.slice(a,a+2500)
JS
