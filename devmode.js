/* ============================================================
   DEV MODE
   Type the letters "d" "e" "v" anywhere on the site to open an
   editor panel. Paste a GitHub token once (see README) and you
   can edit units, resources, and due dates and save them
   straight back to content.js on GitHub — no code required.
   ============================================================ */

const GH_OWNER = "wpr-creator";
const GH_REPO  = "cd";
const GH_FILE  = "content.js";
const GH_BRANCH = "main";
const TOKEN_KEY = "cd_gh_token";

const CONTENT_HEADER = `/* ============================================================
   CAREER DEVELOPMENT — SITE CONTENT
   ============================================================
   This is the ONLY file you should need to hand-edit.
   Everything on the website (units, resources, links, dates)
   is pulled from the SITE object below.

   Prefer not editing JSON by hand? Type "dev" anywhere on the
   live site to open the in-browser editor instead — it edits
   and saves this exact file for you.
   ============================================================ */

`;

let _devWorkingCopy = null;
let _devSha = null;

/* ---------- trigger: typing "dev" ---------- */
(function setupDevTrigger(){
  let buffer = "";
  document.addEventListener("keydown", (e)=>{
    const tag = (document.activeElement && document.activeElement.tagName) || "";
    if(tag === "INPUT" || tag === "TEXTAREA") return; // don't hijack while typing in a field
    if(e.key.length !== 1) return;
    buffer = (buffer + e.key).toLowerCase().slice(-3);
    if(buffer === "dev"){
      openDevPanel();
      buffer = "";
    }
  });
})();

function getToken(){ return localStorage.getItem(TOKEN_KEY) || ""; }
function setToken(t){ localStorage.setItem(TOKEN_KEY, t); }
function clearToken(){ localStorage.removeItem(TOKEN_KEY); }

/* ---------- panel shell ---------- */
function openDevPanel(){
  if(document.getElementById("dev-panel")) return;
  _devWorkingCopy = JSON.parse(JSON.stringify(SITE)); // deep clone, edits happen here first

  const panel = document.createElement("div");
  panel.id = "dev-panel";
  panel.innerHTML = `
    <div id="dev-overlay"></div>
    <div id="dev-sheet">
      <div id="dev-head">
        <strong>Dev Mode</strong>
        <span id="dev-status"></span>
        <button id="dev-close" title="Close (your edits stay until you reload)">&times;</button>
      </div>
      <div id="dev-body"></div>
    </div>`;
  document.body.appendChild(panel);
  document.getElementById("dev-close").onclick = closeDevPanel;
  document.getElementById("dev-overlay").onclick = closeDevPanel;

  getToken() ? renderDevEditor() : renderTokenGate();
}

function closeDevPanel(){
  const p = document.getElementById("dev-panel");
  if(p) p.remove();
}

function setStatus(msg, isError){
  const s = document.getElementById("dev-status");
  if(s){ s.textContent = msg; s.style.color = isError ? "#E2725B" : "#9adba0"; }
}

/* ---------- token gate ---------- */
function renderTokenGate(){
  const body = document.getElementById("dev-body");
  body.innerHTML = `
    <p>Paste your GitHub token (Settings → Developer settings → Fine-grained tokens). It's stored only in this browser.</p>
    <input type="password" id="dev-token-input" placeholder="github_pat_..." />
    <button class="dev-btn dev-btn-primary" id="dev-token-submit">Unlock editor</button>
    <p class="dev-hint">No token yet? See the README in the repo for a 2-minute walkthrough.</p>`;
  document.getElementById("dev-token-submit").onclick = async ()=>{
    const val = document.getElementById("dev-token-input").value.trim();
    if(!val) return;
    setStatus("Checking token…");
    const ok = await testToken(val);
    if(ok){
      setToken(val);
      setStatus("Connected ✓");
      renderDevEditor();
    } else {
      setStatus("Token didn't work — check repo access & permissions", true);
    }
  };
}

async function testToken(token){
  try{
    const r = await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" }
    });
    return r.ok;
  }catch(e){ return false; }
}

/* ---------- main editor ---------- */
function renderDevEditor(){
  const body = document.getElementById("dev-body");
  const unitOptions = _devWorkingCopy.units.map((u,i)=>`<option value="${i}">${u.shortTitle}</option>`).join("");
  body.innerHTML = `
    <div id="dev-toolbar">
      <select id="dev-unit-select">${unitOptions}</select>
      <button class="dev-btn" id="dev-forget">Forget token</button>
    </div>
    <div id="dev-unit-fields"></div>
    <div id="dev-actions">
      <button class="dev-btn dev-btn-primary" id="dev-save-all">Save to GitHub</button>
      <span class="dev-hint">Saves ALL units at once (not just the one shown).</span>
    </div>`;

  document.getElementById("dev-forget").onclick = ()=>{ clearToken(); closeDevPanel(); };
  document.getElementById("dev-unit-select").onchange = (e)=> renderUnitFields(+e.target.value);
  document.getElementById("dev-save-all").onclick = saveToGitHub;

  renderUnitFields(0);
}

function renderUnitFields(idx){
  const u = _devWorkingCopy.units[idx];
  const wrap = document.getElementById("dev-unit-fields");

  wrap.innerHTML = `
    <label>Title<input data-bind="title" value="${escAttr(u.title)}"></label>
    <label>Short title (nav label)<input data-bind="shortTitle" value="${escAttr(u.shortTitle)}"></label>
    <label>Season label<input data-bind="season" value="${escAttr(u.season)}"></label>
    <label>Summary<textarea data-bind="summary">${escHtml(u.summary)}</textarea></label>
    <label>Accent
      <select data-bind="accent">
        ${["teal","gold","coral"].map(a=>`<option value="${a}" ${a===u.accent?"selected":""}>${a}</option>`).join("")}
      </select>
    </label>

    <h4>Resources</h4>
    <div id="dev-resources"></div>
    <button class="dev-btn" id="dev-add-resource">+ Add resource</button>

    <h4>Key Dates</h4>
    <div id="dev-milestones"></div>
    <button class="dev-btn" id="dev-add-milestone">+ Add date</button>
  `;

  wrap.querySelectorAll("[data-bind]").forEach(el=>{
    el.addEventListener("input", ()=>{ u[el.dataset.bind] = el.value; });
  });

  renderResourceRows(u);
  renderMilestoneRows(u);

  document.getElementById("dev-add-resource").onclick = ()=>{
    u.resources.push({title:"New resource", url:"#", note:""});
    renderResourceRows(u);
  };
  document.getElementById("dev-add-milestone").onclick = ()=>{
    u.milestones.push({date: new Date().toISOString().slice(0,10), label:"New date"});
    renderMilestoneRows(u);
  };
}

function renderResourceRows(u){
  const wrap = document.getElementById("dev-resources");
  wrap.innerHTML = u.resources.map((r,i)=>`
    <div class="dev-row" data-i="${i}">
      <input data-f="title" placeholder="Title" value="${escAttr(r.title)}">
      <input data-f="url" placeholder="URL" value="${escAttr(r.url)}">
      <input data-f="note" placeholder="Note" value="${escAttr(r.note||"")}">
      <button class="dev-row-del" data-del="${i}">&times;</button>
    </div>`).join("");
  wrap.querySelectorAll(".dev-row").forEach(row=>{
    const i = +row.dataset.i;
    row.querySelectorAll("[data-f]").forEach(inp=>{
      inp.addEventListener("input", ()=>{ u.resources[i][inp.dataset.f] = inp.value; });
    });
  });
  wrap.querySelectorAll("[data-del]").forEach(btn=>{
    btn.onclick = ()=>{ u.resources.splice(+btn.dataset.del,1); renderResourceRows(u); };
  });
}

function renderMilestoneRows(u){
  const wrap = document.getElementById("dev-milestones");
  wrap.innerHTML = u.milestones.map((m,i)=>`
    <div class="dev-row" data-i="${i}">
      <input data-f="date" type="date" value="${m.date}">
      <input data-f="label" placeholder="What's due" value="${escAttr(m.label)}" style="flex:2;">
      <button class="dev-row-del" data-del="${i}">&times;</button>
    </div>`).join("");
  wrap.querySelectorAll(".dev-row").forEach(row=>{
    const i = +row.dataset.i;
    row.querySelectorAll("[data-f]").forEach(inp=>{
      inp.addEventListener("input", ()=>{ u.milestones[i][inp.dataset.f] = inp.value; });
    });
  });
  wrap.querySelectorAll("[data-del]").forEach(btn=>{
    btn.onclick = ()=>{ u.milestones.splice(+btn.dataset.del,1); renderMilestoneRows(u); };
  });
}

function escAttr(s){ return String(s).replace(/"/g,"&quot;"); }
function escHtml(s){ return String(s).replace(/</g,"&lt;"); }

/* ---------- save to GitHub ---------- */
async function saveToGitHub(){
  const token = getToken();
  setStatus("Saving…");
  try{
    // 1. get current sha (required to update a file)
    const getResp = await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_FILE}?ref=${GH_BRANCH}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" }
    });
    if(!getResp.ok) throw new Error("Couldn't read current file (" + getResp.status + ")");
    const getJson = await getResp.json();
    _devSha = getJson.sha;

    // 2. build new file text
    const fileText = CONTENT_HEADER + "const SITE = " + JSON.stringify(_devWorkingCopy, null, 2) + ";\n";
    const b64 = b64EncodeUnicode(fileText);

    // 3. commit
    const putResp = await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_FILE}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
      body: JSON.stringify({
        message: "Update site content via dev panel",
        content: b64,
        sha: _devSha,
        branch: GH_BRANCH
      })
    });
    if(!putResp.ok){
      const errJson = await putResp.json().catch(()=>({}));
      throw new Error(errJson.message || ("Save failed (" + putResp.status + ")"));
    }

    SITE.units = _devWorkingCopy.units; // reflect immediately on this page too
    setStatus("Saved ✓ — live site updates in ~1 min");
  }catch(err){
    setStatus(err.message, true);
  }
}

function b64EncodeUnicode(str){
  return btoa(unescape(encodeURIComponent(str)));
}
