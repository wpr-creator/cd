# Career Development — Senior Year Roadmap

A simple, fast, no-build website for your Career Development course. Pure HTML/CSS/JS — no installs, no build step, free hosting on GitHub Pages.

## What's in here
- `index.html` — homepage with the visual "roadmap" of all 8 units
- `timeline.html` — every key date across the year, filterable by unit
- `unit.html` — one template that renders all 8 unit pages (driven by content.js)
- `content.js` — **the only file you need to edit.** All text, links, and dates live here.
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

## 3. Editing content (no coding needed)
Everything you'll ever want to change — unit descriptions, links, due dates — lives in **content.js**.

1. Open `content.js` on github.com
2. Click the **pencil icon** (top right) to edit in the browser
3. Find the unit or date you want to change
4. To add a new resource link, copy an existing line like:
   ```
   { title: "Fastweb", url: "https://www.fastweb.com", note: "Searchable scholarship database" },
   ```
   and edit the text inside the quotes.
5. To add a new date, copy a line like:
   ```
   { date: "2026-09-11", label: "Brag Packet due" },
   ```
   Dates must stay in `YYYY-MM-DD` format.
6. Scroll down, write a short commit message, click **Commit changes**
7. The live site updates automatically within a minute or two — no other steps needed.

**The two rules that keep it from breaking:** keep text inside `" "` quotes, and keep a comma after every line except the last one in a group. If you mess one up, GitHub Pages will just show a blank section — fix the quote/comma and recommit.

## Ideas for later (didn't build yet — happy to add any of these)
- **Search bar** across all resources/dates
- **"This Week" widget** on the homepage that auto-highlights what's due now
- **Printable/PDF view** of the timeline for students without devices
- **Student-facing checklist** (localStorage-based, "mark as done") for things like Brag Packet, PIQs, Resume
- **A Day / B Day schedule note** baked into relevant milestones
- **Google Form embeds** for things like the Decision Day Survey, directly on the unit page
- **Auto-generated "What's due this week" email/Slack digest** for yourself, pulled from content.js
- **Spanish-language toggle** if your seniors/families would benefit
- A **counselor/teacher login-free "suggest an edit" form** so other CD teachers can propose changes without needing GitHub access
