/* ============================================================
   Rendering logic. You shouldn't need to edit this file —
   edit content.js instead.
   ============================================================ */

const ICONS = {
  "college-apps": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3 1 8l11 5 9-4.1V15" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 10.5V16c0 1.4 3.1 3 7 3s7-1.6 7-3v-5.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "scholarships": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M15 9.5c0-1.4-1.3-2.5-3-2.5s-3 1-3 2.3c0 3 6 1.4 6 4.4 0 1.4-1.3 2.5-3 2.5s-3-1-3-2.3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "finance-park": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 13c0-3.5 3.2-6.5 8-6.5 1 0 2 .1 2.8.4L17 5l1.5 3.2c1 .8 1.5 2 1.5 3.3 0 .6-.1 1.1-.3 1.6L21 16h-3l-1-1.6c-1 .4-2.1.6-3 .6-.8 0-1.6-.1-2.3-.3L9 17H6l1.3-2.6C4.9 13.6 3 13.4 3 13Z" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="11" r=".6" fill="currentColor" stroke="none"/></svg>`,
  "career-exploration": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M14.5 9.5 13 13l-3.5 1.5L11 11l3.5-1.5Z" stroke-linejoin="round"/></svg>`,
  "work-experience": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="8" width="18" height="11" rx="1.5"/><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "senior-exhibition": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="12" rx="1.2"/><path d="M9 20h6M12 16v4M7 9.5l3 2.5 3-3.5 4 3" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  "networking-linkedin": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="7" cy="8" r="2.3"/><circle cx="17" cy="6" r="2"/><circle cx="17" cy="17" r="2.3"/><path d="m8.9 9.2 6.3-2.6M8.7 9.6l6.6 6" stroke-linecap="round"/></svg>`,
  "decision-day": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 3v18" stroke-linecap="round"/><path d="M6 4h11l-2.5 3.5L17 11H6" stroke-linejoin="round"/></svg>`
};

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
        <a href="index.html" class="nav-brand">${SITE.courseTitle}</a>
        <ul class="nav-links">
          <li><a href="index.html" class="${activePage==='home'?'active':''}">HOME</a></li>
          <li><a href="agenda.html" class="${activePage==='agenda'?'active':''}">AGENDA</a></li>
          <li><a href="timeline.html" class="${activePage==='timeline'?'active':''}">TIMELINE</a></li>
          <li><a href="${SITE.syllabusUrl}" target="_blank" rel="noopener">SYLLABUS</a></li>
          <li><a href="${SITE.classroomUrl}" target="_blank" rel="noopener">GOOGLE CLASSROOM</a></li>
        </ul>
        <button class="nav-toggle" aria-label="Menu">&#9776;</button>
      </div>`;
  }
  const footer = document.getElementById("site-footer");
  if(footer){
    footer.innerHTML = `
      <div class="container">
        <strong>${SITE.courseTitle} · ${SITE.schoolYear}</strong>
        <span>GOOGLE CLASSROOM CODE: <b>${SITE.classroomCode}</b></span>
      </div>`;
  }
  mobileNavToggle();
}

/* ---------- homepage roadmap ---------- */
function renderRoadmap(){
  const track = document.getElementById("roadmap-track");
  if(!track) return;
  track.innerHTML = SITE.units.map((u)=>`
    <a class="stop" href="unit.html?id=${u.id}">
      <span class="stop-icon accent-${u.accent}">${ICONS[u.id]||""}</span>
      <div class="stop-season">${u.season}</div>
      <h3>${u.title}</h3>
      <p>${u.summary}</p>
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
      <a href="index.html" class="back-link">&larr; BACK TO ROADMAP</a>
      <span class="unit-icon">${ICONS[unit.id]||""}</span>
      <div class="eyebrow">${unit.season}</div>
      <h1>${unit.title}</h1>
      <p>${unit.summary}</p>
    </div>`;

  const resWrap = document.getElementById("unit-resources");
  if(unit.resources && unit.resources.length){
    resWrap.innerHTML = `<h2>RESOURCES</h2><div class="resource-grid">` +
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
    msWrap.innerHTML = `<h2>KEY DATES</h2><ul class="milestone-list">` +
      sorted.map(m=>`
        <li>
          <span class="milestone-date">${fmtDate(m.date)}</span>
          <span class="milestone-label">${m.url ? `<a href="${m.url}" target="_blank" rel="noopener">${m.label} <span aria-hidden="true">↗</span></a>` : m.label}</span>
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
    <h2>THIS WEEK</h2>
    <div class="tw-sub">${rangeLabel}</div>
    ${items.length
      ? items.map(m=>`
          <div class="tw-item">
            <span class="tw-date">${fmtDate(m.date)}</span>
            <span>${m.url ? `<a class="date-link date-link-light" href="${m.url}" target="_blank" rel="noopener">${m.label} ↗</a>` : m.label} <span class="tw-unit">— ${m.unit.shortTitle}</span></span>
          </div>`).join("")
      : `<div class="tw-empty">NO MAJOR ROADMAP DATES THIS WEEK. CHECK GOOGLE CLASSROOM FOR CURRENT ASSIGNMENTS.</div>`
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
          ${m.url ? `<a class="date-link" href="${m.url}" target="_blank" rel="noopener">${m.label} ↗</a>` : m.label}
          <div class="tl-unit">${m.unit.shortTitle}</div>
        </div>
      </div>`;
  });
  wrap.innerHTML = html || `<p>No dates for this filter yet.</p>`;
}

function renderTimelineControls(){
  const wrap = document.getElementById("timeline-controls");
  if(!wrap) return;
  const chips = [{id:"all",label:"ALL SECTIONS"}, ...SITE.units.map(u=>({id:u.id,label:u.shortTitle}))];
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
