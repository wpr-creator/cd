(() => {
  "use strict";

  const SCHOOL_YEAR_START = "2026-08-04";
  const SCHOOL_YEAR_END = "2027-05-28";
  const STORAGE_KEY = "cd-agenda-content-v1";
  const TOKEN_KEY = "cd-github-token-v1";
  const GITHUB_CONTENT_URL = "https://api.github.com/repos/wpr-creator/cd/contents/agenda-content.json";

  const closedRanges = [
    ["2026-09-28", "2026-10-02"],
    ["2026-11-23", "2026-11-27"],
    ["2026-12-21", "2027-01-01"],
    ["2027-03-29", "2027-04-02"]
  ];
  const closedDates = new Set(["2026-11-11"]);

  let content = { entries: {} };
  let classDays = [];
  let selectedIndex = 0;
  let devKeys = "";

  const iso = date => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const dateFromIso = value => new Date(`${value}T12:00:00`);
  const inClosedRange = key => closedRanges.some(([start, end]) => key >= start && key <= end);

  function buildClassDays() {
    const days = [];
    const cursor = dateFromIso(SCHOOL_YEAR_START);
    const end = dateFromIso(SCHOOL_YEAR_END);
    while (cursor <= end) {
      const key = iso(cursor);
      const weekday = cursor.getDay();
      if ([2, 3, 5].includes(weekday) && !closedDates.has(key) && !inClosedRange(key)) days.push(key);
      cursor.setDate(cursor.getDate() + 1);
    }
    return days;
  }

  function normalize(input) {
    const entries = input && typeof input.entries === "object" && !Array.isArray(input.entries) ? input.entries : {};
    return { entries };
  }

  function formatOption(key) {
    return dateFromIso(key).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }).toUpperCase();
  }

  function findInitialIndex() {
    const requested = new URLSearchParams(location.search).get("date");
    if (requested && classDays.includes(requested)) return classDays.indexOf(requested);
    const today = iso(new Date());
    const next = classDays.findIndex(key => key >= today);
    return next === -1 ? classDays.length - 1 : next;
  }

  function populateSelect(select) {
    select.replaceChildren();
    classDays.forEach(key => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = formatOption(key);
      select.appendChild(option);
    });
  }

  function renderAgenda() {
    const key = classDays[selectedIndex];
    const date = dateFromIso(key);
    const entry = content.entries[key] || {};
    document.getElementById("agenda-weekday").textContent = date.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
    const time = document.getElementById("agenda-date");
    time.textContent = date.toLocaleDateString("en-US", { month: "long", day: "numeric" }).toUpperCase();
    time.dateTime = key;
    document.getElementById("agenda-title").textContent = (entry.title || "CAREER DEVELOPMENT").toUpperCase();
    const notes = document.getElementById("agenda-notes");
    notes.textContent = entry.notes || "AGENDA COMING SOON.";
    notes.classList.toggle("empty", !entry.notes);
    document.getElementById("agenda-date-select").value = key;
    document.getElementById("agenda-prev").disabled = selectedIndex === 0;
    document.getElementById("agenda-next").disabled = selectedIndex === classDays.length - 1;
  }

  function showDate(key) {
    const index = classDays.indexOf(key);
    if (index < 0) return;
    selectedIndex = index;
    renderAgenda();
    history.replaceState(null, "", `agenda.html?date=${key}`);
  }

  async function loadContent() {
    try {
      const response = await fetch("agenda-content.json", { cache: "no-store" });
      if (response.ok) content = normalize(await response.json());
    } catch (error) {
      console.warn("Published agenda could not be loaded.", error);
    }
    try {
      const preview = localStorage.getItem(STORAGE_KEY);
      if (preview) content = normalize(JSON.parse(preview));
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
    }
    renderAgenda();
  }

  function loadAdminForm(key) {
    const entry = content.entries[key] || {};
    document.getElementById("admin-agenda-date").value = key;
    document.getElementById("admin-agenda-title").value = entry.title || "";
    document.getElementById("admin-agenda-notes").value = entry.notes || "";
  }

  function renderConnection(message = "") {
    const connected = Boolean(localStorage.getItem(TOKEN_KEY));
    document.getElementById("admin-connection-status").textContent = message || (connected ? "GITHUB CONNECTED ON THIS DEVICE." : "GITHUB IS NOT CONNECTED.");
    document.getElementById("admin-token-remove").disabled = !connected;
    document.getElementById("admin-publish").disabled = !connected;
    document.getElementById("admin-github-token").placeholder = connected ? "TOKEN SAVED ON THIS DEVICE" : "PASTE TOKEN";
  }

  function openAdmin() {
    loadAdminForm(classDays[selectedIndex]);
    document.getElementById("admin-github-token").value = "";
    renderConnection();
    document.getElementById("agenda-admin").hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("admin-close").focus();
  }

  function closeAdmin() {
    document.getElementById("agenda-admin").hidden = true;
    document.body.style.overflow = "";
  }

  function buildNextContent() {
    const next = normalize(structuredClone(content));
    const key = document.getElementById("admin-agenda-date").value;
    const title = document.getElementById("admin-agenda-title").value.trim().toUpperCase();
    const notes = document.getElementById("admin-agenda-notes").value.trim();
    if (title || notes) next.entries[key] = { title: title || "CAREER DEVELOPMENT", notes };
    else delete next.entries[key];
    return next;
  }

  function applyContent(next) {
    content = normalize(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    showDate(document.getElementById("admin-agenda-date").value);
  }

  function encodeBase64(text) {
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    bytes.forEach(byte => { binary += String.fromCharCode(byte); });
    return btoa(binary);
  }

  async function publish() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return renderConnection("ADD AND SAVE A GITHUB TOKEN FIRST.");
    const button = document.getElementById("admin-publish");
    const status = document.getElementById("admin-status");
    button.disabled = true;
    button.textContent = "PUBLISHING…";
    status.textContent = "CONNECTING TO GITHUB…";
    try {
      const headers = {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28"
      };
      const currentResponse = await fetch(`${GITHUB_CONTENT_URL}?ref=main`, { headers, cache: "no-store" });
      if (!currentResponse.ok) {
        if (currentResponse.status === 401) throw new Error("TOKEN NOT ACCEPTED. CHECK OR REPLACE IT.");
        if (currentResponse.status === 403) throw new Error("TOKEN NEEDS CONTENTS: READ AND WRITE ACCESS TO THE CD REPOSITORY.");
        throw new Error(`GITHUB COULD NOT READ THE AGENDA FILE (${currentResponse.status}).`);
      }
      const currentFile = await currentResponse.json();
      const next = buildNextContent();
      const output = `${JSON.stringify(next, null, 2)}\n`;
      const updateResponse = await fetch(GITHUB_CONTENT_URL, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Update Career Development agenda", content: encodeBase64(output), sha: currentFile.sha, branch: "main" })
      });
      if (!updateResponse.ok) {
        if (updateResponse.status === 409) throw new Error("THE AGENDA CHANGED ON GITHUB. RESET TO LIVE AND TRY AGAIN.");
        if (updateResponse.status === 401 || updateResponse.status === 403) throw new Error("TOKEN NEEDS CONTENTS: READ AND WRITE ACCESS TO THE CD REPOSITORY.");
        throw new Error(`GITHUB COULD NOT PUBLISH THE AGENDA (${updateResponse.status}).`);
      }
      applyContent(next);
      status.textContent = "PUBLISHED. THE SITE SHOULD UPDATE IN ABOUT A MINUTE.";
    } catch (error) {
      status.textContent = error.message || "THE AGENDA COULD NOT BE PUBLISHED.";
    } finally {
      button.textContent = "SAVE & PUBLISH";
      button.disabled = !localStorage.getItem(TOKEN_KEY);
    }
  }

  classDays = buildClassDays();
  populateSelect(document.getElementById("agenda-date-select"));
  populateSelect(document.getElementById("admin-agenda-date"));
  selectedIndex = findInitialIndex();

  document.getElementById("agenda-prev").addEventListener("click", () => { if (selectedIndex > 0) showDate(classDays[selectedIndex - 1]); });
  document.getElementById("agenda-next").addEventListener("click", () => { if (selectedIndex < classDays.length - 1) showDate(classDays[selectedIndex + 1]); });
  document.getElementById("agenda-date-select").addEventListener("change", event => showDate(event.target.value));
  document.getElementById("admin-agenda-date").addEventListener("change", event => loadAdminForm(event.target.value));
  document.getElementById("admin-close").addEventListener("click", closeAdmin);
  document.getElementById("admin-save-preview").addEventListener("click", () => {
    applyContent(buildNextContent());
    document.getElementById("admin-status").textContent = "PREVIEW SAVED IN THIS BROWSER.";
  });
  document.getElementById("admin-publish").addEventListener("click", publish);
  document.getElementById("admin-token-save").addEventListener("click", () => {
    const input = document.getElementById("admin-github-token");
    const token = input.value.trim();
    if (!token) return renderConnection("PASTE A TOKEN BEFORE SAVING.");
    localStorage.setItem(TOKEN_KEY, token);
    input.value = "";
    renderConnection("TOKEN SAVED. SAVE & PUBLISH IS READY.");
  });
  document.getElementById("admin-token-remove").addEventListener("click", () => {
    localStorage.removeItem(TOKEN_KEY);
    renderConnection("TOKEN REMOVED FROM THIS DEVICE.");
  });
  document.getElementById("admin-reset").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });
  document.getElementById("agenda-admin").addEventListener("click", event => { if (event.target.id === "agenda-admin") closeAdmin(); });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !document.getElementById("agenda-admin").hidden) closeAdmin();
    if (!event.metaKey && !event.ctrlKey && !event.altKey && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
      devKeys = (devKeys + event.key.toLowerCase()).slice(-3);
      if (devKeys === "dev") {
        if (document.getElementById("agenda-admin").hidden) openAdmin(); else closeAdmin();
        devKeys = "";
      }
    }
  });

  renderAgenda();
  loadContent();
})();
