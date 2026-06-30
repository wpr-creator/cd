/* ============================================================
   CAREER DEVELOPMENT — SITE CONTENT
   ============================================================
   This is the ONLY file you should need to edit.
   Everything on the website (units, resources, links, dates)
   is pulled from the SITE object below.

   HOW TO EDIT ON GITHUB (no coding tools needed):
   1. Open this file on github.com (content.js)
   2. Click the pencil icon (top right) to edit
   3. Find the section you want to change
   4. Copy an existing line/block as your pattern, and edit the
      text inside the quotes " "
   5. Scroll down, click "Commit changes" — the live site updates
      automatically within a minute or two.

   RULES TO AVOID BREAKING THE SITE:
   - Always keep text inside straight double quotes "like this"
   - Always put a comma after each line EXCEPT the very last item
     in a { } or [ ] group
   - Don't delete the { }, [ ], or commas — only edit the text
   - If you're ever unsure, just add a new resource by copying an
     existing { ... } block under "resources" and editing it.
   ============================================================ */

const SITE = {

  // Shown at the top of the homepage
  courseTitle: "Career Development",
  courseTagline: "Senior Year Roadmap — College, Career & Beyond",
  schoolYear: "2026–27",

  // The 8 units. Order here = order they appear on the site & roadmap.
  units: [

    {
      id: "college-apps",
      shortTitle: "College Applications",
      title: "College Applications & PIQs",
      accent: "teal",
      summary: "College fit, building your college list, and writing strong UC/CSU/Common App essays.",
      season: "Aug – Nov",
      resources: [
        { title: "UC Application Portal", url: "https://admission.universityofcalifornia.edu/apply-now.html", note: "Official UC application" },
        { title: "UC A–G Course List", url: "https://hs-articulation.ucop.edu/agcourselist", note: "Check which courses count" },
        { title: "CSU Application Portal", url: "https://www2.calstate.edu/apply", note: "Official CSU application" },
        { title: "CCGI", url: "https://www.cacollegeguidance.org/", note: "Build & track your college list" },
        { title: "College Essay Guy — Mundane Moments", url: "https://www.collegeessayguy.com/", note: "PIQ brainstorming article" },
        { title: "College Essay Guy — EOP Requirements", url: "https://www.collegeessayguy.com/blog/eop-application-requirements-deadlines", note: "EOP deadlines by campus" }
      ],
      milestones: [
        { date: "2026-08-17", label: "College fit sessions begin" },
        { date: "2026-08-24", label: "Build your college list" },
        { date: "2026-08-31", label: "Calculate your GPA" },
        { date: "2026-09-11", label: "Brag packet due" },
        { date: "2026-10-05", label: "UC & CSU applications open" },
        { date: "2026-10-12", label: "First essay draft due" },
        { date: "2026-10-17", label: "All essays due" },
        { date: "2026-11-21", label: "Applications due" }
      ]
    },

    {
      id: "scholarships",
      shortTitle: "Scholarships & Aid",
      title: "Scholarships & Financial Aid",
      accent: "gold",
      summary: "Finding, tracking, and applying to scholarships all year — goal: 2 applications a month.",
      season: "Sept – May",
      resources: [
        { title: "Fastweb", url: "https://www.fastweb.com", note: "Searchable scholarship database" },
        { title: "BigFuture Scholarship Search", url: "https://bigfuture.collegeboard.org/scholarship-search", note: "College Board's database" },
        { title: "Scholarships.com", url: "https://www.scholarships.com", note: "" },
        { title: "Niche Scholarships", url: "https://www.niche.com/colleges/scholarships/", note: "" },
        { title: "Local Community Scholarship Fund", url: "#", note: "One application, many scholarships" },
        { title: "WebGrants4Students", url: "https://www.webgrants4students.org/", note: "California state financial aid tracking" }
      ],
      milestones: [
        { date: "2026-09-11", label: "Funding application closes" },
        { date: "2026-09-30", label: "Coca-Cola Scholars due" },
        { date: "2026-10-01", label: "QuestBridge College Match due" },
        { date: "2026-11-21", label: "Standout scholarship applications due" },
        { date: "2027-01-11", label: "Scholarship goal: 2 applications a month" },
        { date: "2027-04-12", label: "Financial aid package guidance" }
      ]
    },

    {
      id: "finance-park",
      shortTitle: "Finance Park",
      title: "Financial Literacy",
      accent: "teal",
      summary: "Junior Achievement Finance Park workbook units, ending in a real-world budgeting field trip.",
      season: "Jan – Mar",
      resources: [
        { title: "Financial Literacy Portal", url: "https://learn.ja.org/", note: "Workbook lessons & activities" }
      ],
      milestones: [
        { date: "2027-01-18", label: "Financial literacy unit begins" },
        { date: "2027-01-18", label: "Employment & income" },
        { date: "2027-01-25", label: "Employment & education" },
        { date: "2027-02-01", label: "Financial decision making" },
        { date: "2027-02-15", label: "Budgeting" },
        { date: "2027-02-22", label: "Risk management & insurance" },
        { date: "2027-03-01", label: "Investing for the future" },
        { date: "2027-03-08", label: "Field trip simulation" },
        { date: "2027-03-15", label: "Field trip simulation" },
        { date: "2027-03-22", label: "Field trip simulation" }
      ]
    },

    {
      id: "career-exploration",
      shortTitle: "Career Exploration",
      title: "Career Exploration & Speakers",
      accent: "coral",
      summary: "RIASEC interest profiles, guest speakers, trade schools, and community college tours.",
      season: "Aug – Mar",
      resources: [
        { title: "RIASEC Interest Profiler", url: "https://www.mynextmove.org/explore/ip", note: "Free official assessment" },
        { title: "O*NET Career Clusters", url: "https://www.onetonline.org/find/career", note: "Explore careers by cluster" }
      ],
      milestones: [
        { date: "2026-08-03", label: "Vision-setting activity" },
        { date: "2026-09-07", label: "Guest presentations begin (monthly through May)" },
        { date: "2027-01-13", label: "Local college campus tours" },
        { date: "2027-02-22", label: "Trade school exploration begins" },
        { date: "2027-03-01", label: "Weekly trade guest presentations" }
      ]
    },

    {
      id: "work-experience",
      shortTitle: "Resume & Interviewing",
      title: "Resume, Cover Letter & Interviewing",
      accent: "gold",
      summary: "Build a real resume and cover letter in Canva, then practice interviewing.",
      season: "Nov – Dec",
      resources: [
        { title: "Canva for Education", url: "https://www.canva.com/education/", note: "Resume & cover letter templates" }
      ],
      milestones: [
        { date: "2026-11-30", label: "Unit begins" },
        { date: "2026-12-09", label: "Resume due" },
        { date: "2026-12-16", label: "Cover letter due" },
        { date: "2026-12-18", label: "Mock interview practice" }
      ]
    },

    {
      id: "senior-exhibition",
      shortTitle: "Senior Exhibition",
      title: "Senior Exhibition",
      accent: "coral",
      summary: "A culminating presentation reflecting on the college & career planning process.",
      season: "Mar – Apr",
      resources: [
        { title: "Senior Exhibition Rubric", url: "#", note: "What a strong exhibition looks like" },
        { title: "Tips & Tricks Guide", url: "#", note: "Presentation skills reference" }
      ],
      milestones: [
        { date: "2027-03-08", label: "Guidelines introduced" },
        { date: "2027-03-22", label: "Work time continues" },
        { date: "2027-04-05", label: "Presentations begin" }
      ]
    },

    {
      id: "networking-linkedin",
      shortTitle: "Networking & LinkedIn",
      title: "Networking & LinkedIn",
      accent: "teal",
      summary: "Build a professional LinkedIn profile and apply for the Senior Networking Event.",
      season: "Apr – May",
      resources: [
        { title: "LinkedIn", url: "https://www.linkedin.com", note: "Create or update your profile" }
      ],
      milestones: [
        { date: "2027-04-05", label: "Networking event application opens" },
        { date: "2027-04-10", label: "Application due" },
        { date: "2027-04-26", label: "Profile-building project begins" },
        { date: "2027-04-28", label: "Networking event" }
      ]
    },

    {
      id: "decision-day",
      shortTitle: "Decision Day & Graduation",
      title: "Decision Day & Graduation",
      accent: "gold",
      summary: "Finalize your post-grad plan, update your tracker, and close out senior year.",
      season: "Apr – May",
      resources: [
        { title: "Naviance", url: "#", note: "Update with final college/post-grad decision" }
      ],
      milestones: [
        { date: "2027-04-26", label: "Decision Day Survey opens" },
        { date: "2027-05-10", label: "Letter to Next Year's Seniors due" },
        { date: "2027-05-17", label: "Decision Day!" },
        { date: "2027-05-24", label: "Awards ceremony & graduation" }
      ]
    }

  ]
};
