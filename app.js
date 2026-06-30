/* ============================================================
   Rendering logic. You shouldn't need to edit this file —
   edit content.js instead.
   ============================================================ */

function fmtDate(iso){
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US",{month:"short",day:"numeric"});
}

function monthKey(iso){
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US",{month:"long",year:"numeric"});
}

function mobileNavToggle(){
  const btn = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if(!btn) return;
  btn.addEventListener("click",()=>links.classList.toggle("open"));
}

/* ---------- shared header/footer injection ---------- */
function renderChrome(activePage){
  const nav = document.getElementById("site-nav");
  if(nav){
    nav.innerHTML = `
      <div class="container">
        <a href="index.html" class="nav-brand">${SITE.courseTitle} <span>26–27</span></a>
        <ul class="nav-links">
          <li><a href="index.html" class="${activePage==='home'?'active':''}">Home</a></li>
          <li><a href="timeline.html" class="${activePage==='timeline'?'active':''}">Full Timeline</a></li>
          ${SITE.units.map(u=>`<li><a href="unit.html?id=${u.id}">${u.shortTitle}</a></li>`).join("")}
        </ul>
        <button class="nav-toggle" aria-label="Menu">&#9776;</button>
      </div>`;
  }
  const footer = document.getElementById("site-footer");
  if(footer){
    footer.innerHTML = `
      <div class="container">
        ${SITE.courseTitle} · ${SITE.schoolYear} · Edit content on
        <a href="https://github.com/wpr-creator/cd/edit/main/content.js" target="_blank" rel="noopener">GitHub</a>
      </div>`;
  }
  mobileNavToggle();
}

/* ---------- homepage roadmap ---------- */
function renderRoadmap(){
  const track = document.getElementById("roadmap-track");
  if(!track) return;
  track.innerHTML = SITE.units.map((u,i)=>`
    <a class="stop" data-num="${i+1}" href="unit.html?id=${u.id}">
      <div class="stop-season">${u.season}</div>
      <h3>${u.title}</h3>
      <p>${u.summary}</p>
      <span class="tag tag-${u.accent}">${u.shortTitle}</span>
    </a>
  `).join("");
}

/* ---------- unit page ---------- */
function renderUnitPage(){
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const unit = SITE.units.find(u=>u.id===id) || SITE.units[0];

  document.title = unit.title + " — " + SITE.courseTitle;

  const header = document.getElementById("unit-header");
  header.classList.add("unit-header","bg-"+unit.accent);
  header.innerHTML = `
    <div class="container">
      <a href="index.html" class="back-link">&larr; Back to roadmap</a>
      <div class="eyebrow">${unit.season}</div>
      <h1>${unit.title}</h1>
      <p>${unit.summary}</p>
    </div>`;

  const resWrap = document.getElementById("unit-resources");
  if(unit.resources && unit.resources.length){
    resWrap.innerHTML = `<h2>Resources</h2><div class="resource-grid">` +
      unit.resources.map(r=>`
        <a class="resource-card" href="${r.url}" target="_blank" rel="noopener">
          <span class="arrow">&#8599;</span>
          <h4>${r.title}</h4>
          <span>${r.note||""}</span>
        </a>`).join("") + `</div>`;
  } else {
    resWrap.innerHTML = "";
  }

  const msWrap = document.getElementById("unit-milestones");
  if(unit.milestones && unit.milestones.length){
    const sorted = [...unit.milestones].sort((a,b)=> a.date.localeCompare(b.date));
    msWrap.innerHTML = `<h2>Key Dates</h2><ul class="milestone-list">` +
      sorted.map(m=>`
        <li>
          <span class="milestone-date">${fmtDate(m.date)}</span>
          <span class="milestone-label">${m.label}</span>
        </li>`).join("") + `</ul>`;
  } else {
    msWrap.innerHTML = "";
  }
}

/* ---------- this week widget ---------- */
function renderThisWeek(){
  const el = document.getElementById("this-week");
  if(!el) return;

  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const monday = new Date(now);
  monday.setHours(0,0,0,0);
  monday.setDate(now.getDate() - ((day+6)%7)); // back to Monday
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate()+6);
  sunday.setHours(23,59,59,999);

  let items = [];
  SITE.units.forEach(u=>{
    (u.milestones||[]).forEach(m=>{
      const d = new Date(m.date + "T00:00:00");
      if(d >= monday && d <= sunday){
        items.push({...m, unit:u});
      }
    });
  });
  items.sort((a,b)=> a.date.localeCompare(b.date));

  const rangeLabel = monday.toLocaleDateString("en-US",{month:"short",day:"numeric"}) + " – " +
                      sunday.toLocaleDateString("en-US",{month:"short",day:"numeric"});

  el.innerHTML = `
    <h2>This Week</h2>
    <div class="tw-sub">${rangeLabel}</div>
    ${items.length
      ? items.map(m=>`
          <div class="tw-item">
            <span class="tw-date">${fmtDate(m.date)}</span>
            <span>${m.label} <span style="color:#9aa1b5;font-size:.82rem;">— ${m.unit.shortTitle}</span></span>
          </div>`).join("")
      : `<div class="tw-empty">Nothing due this week.</div>`
    }`;
}


function renderTimeline(filterId){
  const wrap = document.getElementById("timeline-list");
  if(!wrap) return;

  let all = [];
  SITE.units.forEach(u=>{
    (u.milestones||[]).forEach(m=>{
      all.push({...m, unit:u});
    });
  });
  if(filterId && filterId !== "all"){
    all = all.filter(m=>m.unit.id===filterId);
  }
  all.sort((a,b)=> a.date.localeCompare(b.date));

  let html = "";
  let lastMonth = "";
  all.forEach(m=>{
    const mk = monthKey(m.date);
    if(mk !== lastMonth){
      html += `<div class="tl-month">${mk}</div>`;
      lastMonth = mk;
    }
    html += `
      <div class="tl-item">
        <div class="tl-date">${fmtDate(m.date)}</div>
        <div class="tl-dot tag-${m.unit.accent}" style="background:var(--${m.unit.accent==='gold'?'gold-dark':m.unit.accent})"></div>
        <div class="tl-text">
          ${m.label}
          <div class="tl-unit">${m.unit.shortTitle}</div>
        </div>
      </div>`;
  });
  wrap.innerHTML = html || `<p>No dates for this filter yet.</p>`;
}

function renderTimelineControls(){
  const wrap = document.getElementById("timeline-controls");
  if(!wrap) return;
  const chips = [{id:"all",label:"All Units"}, ...SITE.units.map(u=>({id:u.id,label:u.shortTitle}))];
  wrap.innerHTML = chips.map((c,i)=>
    `<button class="chip ${i===0?'active':''}" data-id="${c.id}">${c.label}</button>`
  ).join("");
  wrap.querySelectorAll(".chip").forEach(btn=>{
    btn.addEventListener("click",()=>{
      wrap.querySelectorAll(".chip").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      renderTimeline(btn.dataset.id);
    });
  });
}
