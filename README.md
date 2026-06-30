# Career Development — Senior Year Roadmap

A simple, fast, no-build website for your Career Development course. Pure HTML/CSS/JS — no installs, no build step, free hosting on GitHub Pages.

## What's in here
- `index.html` — homepage with "This Week" widget + the visual roadmap of all 8 units
- `timeline.html` — every key date across the year, filterable by unit
- `unit.html` — one template that renders all 8 unit pages (driven by content.js)
- `content.js` — your content. Edit via Dev Mode (recommended) or by hand.
- `devmode.js` — powers the in-browser editor (type "dev" on the live site)
- `styles.css`, `app.js` — design + logic, you shouldn't need to touch these

## 1. Upload to your repo (wpr-creator/cd)
1. Go to https://github.com/wpr-creator/cd
2. Click **Add file → Upload files**
3. Drag in all 6 files from this folder (don't upload the folder itself, just the files)
4. Commit directly to the `main` branch

## 2. Turn on GitHub Pages (one-time)
1. In the repo, go to **Settings → Pages**
2. Under "Build and deployment," set **Source: Deploy from a branch**
3. Branch: `main`, folder: `/ (root)` → **Save**
4. Wait ~1 minute. Your site will be live at:
   `https://wpr-creator.github.io/cd/`

## 3. Editing content — Dev Mode (recommended, no code)
1. On the live site, click anywhere on the page (not in a text box) and type **d e v**
2. A panel slides in from the right
3. **First time only:** paste your GitHub token (see below) and click **Unlock editor**
4. Pick a unit from the dropdown, edit titles, summaries, resource links, or due dates directly
5. Use **+ Add resource** / **+ Add date** to add new ones, or the **×** to delete
6. Click **Save to GitHub** — this commits straight to `content.js` in your repo
7. The live site updates within about a minute

Your token is stored only in that browser's local storage — it's not sent anywhere except GitHub. Use **Forget token** in the panel if you're on a shared computer.

### Getting a GitHub token (one-time, ~2 minutes)
1. Go to https://github.com/settings/tokens?type=beta
2. Click **Generate new token**
3. Name it `CD Site Editor`
4. Under **Repository access** → **Only select repositories** → choose `wpr-creator/cd`
5. Under **Permissions → Repository permissions**, set **Contents** to **Read and write**
6. Click **Generate token** and copy it immediately (shown only once)
7. Paste it into the Dev Mode panel the first time you use it

## 4. Editing content — manual (fallback)
You can also edit `content.js` directly on github.com (click the pencil icon) if you ever prefer that over Dev Mode. Keep text inside `" "` quotes and a comma after every line except the last one in a group.

## Ideas for later (didn't build yet — happy to add any of these)
- **Search bar** across all resources/dates
- **Printable/PDF view** of the timeline for students without devices
- **Student-facing checklist** ("mark as done") for things like Brag Packet, PIQs, Resume
- **A Day / B Day schedule note** baked into relevant milestones
- **Google Form embeds** for things like the Decision Day Survey, directly on the unit page
- **Multiple unit edits before saving** — currently Dev Mode commits one save per click; could batch
- **Edit history / undo** — GitHub already keeps commit history, but a friendlier "revert last change" button in the panel would help
- **Spanish-language toggle** if your seniors/families would benefit
- A **"suggest an edit" form** so other CD teachers can propose changes without a GitHub token
