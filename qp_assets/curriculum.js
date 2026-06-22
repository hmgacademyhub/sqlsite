/* =====================================================================
   QueryPilot v9 — Curriculum Data
   "Data Science from Zero to Expert"
   By Adewale Samson Adeagbo (HMG Concepts, Lagos, Nigeria)

   Pedagogy: spiral, concrete-before-abstract, Nigerian-context examples,
   no prior knowledge assumed, one idea per lesson, active learning,
   honest disclosure of limits and pitfalls.

   Structure:
     CURRICULUM = [Module, Module, ...]
     Module    = { id, title, icon, color, summary, prereq, weeks, lessons:[Lesson,...] }
     Lesson    = { id, type, title, est, learn:[], example, exercise?, quiz?, project?, takeaway, glossary:[] }

   Types: "concept" | "exercise" | "quiz" | "project" | "playground" | "video"
   ===================================================================== */

window.CURRICULUM = [

/* ===================================================================
   MODULE 1 — WHAT IS DATA SCIENCE?
   Audience: complete beginner, market trader, school teacher,
             non-technical manager. Goal: vocabulary + mental model.
   =================================================================== */
{
  id: "m1",
  title: "What is Data Science?",
  icon: "🌱",
  color: "#3fb950",
  level: "Beginner",
  weeks: 1,
  summary: "Start here. Before any code, any math, any SQL — what actually IS data science, and why does it matter? Designed for absolute beginners, including non-technical professionals, students and curious career-switchers.",
  prereq: "None. If you can read this sentence, you can do this module.",
  lessons: [

    { id:"m1.l1", type:"concept", title:"1. What is Data? (it's not what you think)", est:"8 min",
      learn: [
        "Data is simply <strong>recorded observations</strong>. When you write down today's market price for jollof rice, that is data. When your phone records how many steps you walked, that is data. When a school registrar lists every student in JSS1, that is data.",
        "Data is <strong>nothing more, nothing less</strong> than information you have stored somewhere — on paper, in a spreadsheet, in a database, even in your head.",
        "<strong>Two kinds of data you meet every day:</strong><br>• <strong>Numbers</strong> — your age (25), market price (₦1,200), goals scored (3). We call this <em>quantitative</em>.<br>• <strong>Categories or text</strong> — your state (Lagos), favourite food (Amala), customer status (active). We call this <em>qualitative</em>.",
        "<strong>Key insight:</strong> The same fact can be stored as either type. 'My height is 1.78 metres' (number) vs 'My height is tall' (category). The choice changes what questions you can answer.",
      ],
      example: "<strong>Example — A market record:</strong><pre>Date        Item         Price (₦)   Sold?\n01-Jan-2026  Jollof Rice  1200        Yes\n01-Jan-2026  Pounded Yam  1500        No\n02-Jan-2026  Suya         2000        Yes</pre>This table has <strong>4 columns</strong>. Date is data. Item is data. Price is data. 'Sold?' is data. Together they tell a story.",
      quiz: {
        q: "Which of these is NOT data?",
        a: [
          { t:"Your WhatsApp last-seen time", c:false },
          { t:"The number of okada drivers in your street", c:false },
          { t:"Your favourite Nollywood movie title", c:false },
          { t:"A thought you forgot to write down", c:true, why:"Correct! Unrecorded observations are not data. Once you write or capture them, they become data." }
        ]
      },
      takeaway: "Data is recorded observations. Every spreadsheet, sales receipt, attendance register and WhatsApp chat log is data.",
      glossary: [
        { term:"Data", def:"Recorded observations. Can be numbers, text, dates, images, anything captured." },
        { term:"Quantitative", def:"Numerical data you can add, average or count. e.g. price, age, score." },
        { term:"Qualitative", def:"Categorical / text data you cannot meaningfully add. e.g. state, status, name." }
      ]
    },

    { id:"m1.l2", type:"concept", title:"2. What is a Data Scientist?", est:"7 min",
      learn: [
        "A <strong>data scientist</strong> is a person who turns data into decisions. They take a messy pile of recorded observations and squeeze out an answer that helps someone act.",
        "Think of three professions you already know:",
        "<strong>1. A market trader</strong> who notices that pepper sells better on Saturdays and stocks up accordingly. That is data science in its simplest form — pattern recognition leading to action.",
        "<strong>2. A football coach</strong> who watches videos of every match, counts how often the striker shoots from the left flank, and re-trains the team. That is data science with measurement and intervention.",
        "<strong>3. A pharmacist</strong> who tracks which medicines run out fastest and orders more of those. That is data-driven inventory.",
        "The modern data scientist does the same things, but at <strong>much larger scale</strong> (millions of rows instead of dozens) using <strong>computers, code and statistics</strong> instead of pen and intuition.",
        "<strong>Four core activities</strong> of a data scientist:<br>1. <strong>Collect</strong> data (from databases, files, APIs, surveys)<br>2. <strong>Clean</strong> data (fix missing values, typos, duplicates)<br>3. <strong>Analyse</strong> data (find patterns, test hypotheses)<br>4. <strong>Communicate</strong> data (charts, dashboards, reports, models)"
      ],
      example: "<strong>Real-world example — CBT Pro (built by the author of QueryPilot):</strong><br>The data scientist asks: <em>'Which students are at risk of failing JAMB based on their mock-exam performance?'</em> They collect the mock scores, clean missing entries, train a model that flags at-risk students, and give the teacher a dashboard showing who needs intervention this week.<br><br>That entire chain — from raw mock-exam CSV to a teacher saying <em>'Let me sit with Bola tomorrow'</em> — is data science.",
      quiz: {
        q: "What's the most important final step in data science?",
        a: [
          { t:"Writing complex code", c:false },
          { t:"Using AI / machine learning", c:false },
          { t:"Communicating insights so someone can act on them", c:true, why:"Yes! An analysis nobody acts on is wasted work. The most important skill is making your findings clear and useful." },
          { t:"Getting a fancy job title", c:false }
        ]
      },
      takeaway: "A data scientist turns recorded observations into decisions. The job is collect, clean, analyse, communicate — at scale.",
      glossary: [
        { term:"Insight", def:"A useful pattern or fact discovered in data that leads to action." },
        { term:"Hypothesis", def:"A specific testable guess you have before looking at data. 'I think Saturday sales are higher.'" }
      ]
    },

    { id:"m1.l3", type:"concept", title:"3. The Data Science Workflow (5 stages)", est:"10 min",
      learn: [
        "Every data science project — from a school's attendance analysis to Netflix's recommendation system — follows the same five-stage workflow. Memorise this; it is the skeleton of your entire career.",
        "<strong>Stage 1 — Ask a good question.</strong> Without a question, data is just noise. Bad: <em>'Look at sales data.'</em> Good: <em>'Which product category grew fastest in Q4 2025 compared to Q4 2024?'</em> A good question is <strong>specific, measurable and actionable</strong>.",
        "<strong>Stage 2 — Get the data.</strong> From a database (SQL), a spreadsheet (Excel/CSV), a website (web scraping), a survey, an API. Adewale's first 12 ML projects all started by getting CSV files into Pandas.",
        "<strong>Stage 3 — Clean and explore.</strong> Real data is messy. Missing values, typos ('Lagoss' instead of 'Lagos'), duplicates, wrong types ('₦1,200' stored as text not number). This stage is 60-80% of the real job. Then <strong>EDA — Exploratory Data Analysis</strong>: charts and summaries to understand what you have.",
        "<strong>Stage 4 — Model or analyse.</strong> Apply statistics (averages, correlations, hypothesis tests) or machine learning (predict, classify, cluster) to answer the question.",
        "<strong>Stage 5 — Communicate.</strong> Write a report. Build a dashboard. Make a slide deck. Tell a stakeholder, in plain language, what you found and what they should do.",
        "<strong>Honest disclosure:</strong> Stages 2 and 3 take 80% of the time. Movies make data scientists look like wizards casting spells — the reality is patient janitorial work followed by careful analysis."
      ],
      example: "<strong>Walk-through — A school's pass-rate question:</strong><br><strong>Q1:</strong> 'Did our SS3 WAEC pass rate improve this year compared to last year, and which subjects drove the change?'<br><strong>Q2:</strong> Collect last year's and this year's results from the school registry.<br><strong>Q3:</strong> Clean: some students wrote NECO instead of WAEC, exclude them. Fix subject name typos ('Maths' vs 'Mathematics').<br><strong>Q4:</strong> Compare pass rates per subject. Maybe Further Mathematics dropped 12 percentage points.<br><strong>Q5:</strong> Tell the principal: 'Pass rate dropped 12pp in Further Maths. Recommend hiring an additional Further Maths teacher.' The principal acts.",
      quiz: {
        q: "Which stage typically consumes the most time in a real data science project?",
        a: [
          { t:"Asking the question", c:false },
          { t:"Getting and cleaning the data", c:true, why:"Yes! 60-80% of real data science is wrangling messy data. Don't let movies fool you." },
          { t:"Building fancy ML models", c:false },
          { t:"Writing the final report", c:false }
        ]
      },
      takeaway: "5 stages, every time: Ask → Get → Clean → Analyse → Communicate. Stages 2-3 take 80% of the time.",
      glossary: [
        { term:"EDA", def:"Exploratory Data Analysis. The 'looking around' phase where you make summaries and charts to understand what you have." },
        { term:"Stakeholder", def:"The person who will act on your findings. A manager, principal, doctor, marketer." }
      ]
    },

    { id:"m1.l4", type:"concept", title:"4. Data Analysis vs Data Science vs Machine Learning vs AI — clear up the jargon", est:"9 min",
      learn: [
        "These four words are constantly mixed up. Let's separate them once and for all.",
        "<strong>Data Analysis</strong> = looking at existing data to describe what happened. <em>'Last quarter we sold 5,000 jerry cans of oil.'</em> Mostly descriptive. Tools: Excel, SQL, Power BI.",
        "<strong>Data Science</strong> = data analysis PLUS using statistics and programming to find deeper patterns, sometimes to predict the future. <em>'Based on rainfall patterns the last 5 years, we expect 30% lower oil demand next month.'</em> Includes everything in data analysis.",
        "<strong>Machine Learning (ML)</strong> = a specific technique within data science where the computer learns rules from data, instead of being told the rules. <em>'Given this loan application, predict the probability of default.'</em> Subset of data science.",
        "<strong>Artificial Intelligence (AI)</strong> = the broader umbrella that includes ML, plus other approaches (rule-based systems, expert systems, robotics). When people say 'AI' today they usually mean ML — specifically <em>large language models</em> like ChatGPT.",
        "<strong>Visualise the nesting:</strong><pre>┌──────────────── AI ────────────────┐\n│  ┌────────── Machine Learning ─┐  │\n│  │  ┌── Deep Learning ──┐      │  │\n│  │  │  (Neural networks)│      │  │\n│  │  └────────────────────┘      │  │\n│  └──────────────────────────────┘  │\n└────────────────────────────────────┘\n   Data Science overlaps with all of the above\n   Data Analysis overlaps with Data Science</pre>",
        "<strong>What this means for your career:</strong> You don't need ML to be a useful data scientist. Adewale solved real classroom problems for 10 years using just data analysis. ML is one (powerful) tool — not the whole job."
      ],
      example: "<strong>One business problem, four answers:</strong><br><strong>Question: Why are customers leaving our bank?</strong><br>• <strong>Analyst:</strong> 'Of the 1,200 customers who left last month, 60% closed their accounts within 90 days of a fee increase.' (description)<br>• <strong>Data Scientist:</strong> 'Customers in the 25-35 age band are 3× more likely to leave after a fee increase than other age bands. Statistically significant at p<0.01.' (deeper pattern)<br>• <strong>ML Engineer:</strong> 'I've trained a model that predicts which of our current customers will leave in the next 30 days, with 78% precision. Here's a list of 800 customers to retain.' (prediction)<br>• <strong>AI Researcher:</strong> 'We've built a system that automatically tailors retention offers per customer using reinforcement learning.' (automated decision-making)",
      quiz: {
        q: "True or false: You need machine learning to do useful data science.",
        a: [
          { t:"True", c:false },
          { t:"False", c:true, why:"Most real data-science wins come from clear questions, clean data, and good analysis — not from ML. ML is a tool, not the goal." }
        ]
      },
      takeaway: "Data Analysis ⊂ Data Science ⊃ ML ⊂ AI. You don't need ML to do useful work. Don't be fooled by hype.",
      glossary: [
        { term:"ML (Machine Learning)", def:"Algorithms that learn patterns from data instead of being explicitly programmed." },
        { term:"Deep Learning", def:"ML using artificial neural networks with many layers. Powers image recognition, ChatGPT, etc." }
      ]
    },

    { id:"m1.l5", type:"concept", title:"5. Tools of the Trade — what you'll learn (and what you won't need)", est:"7 min",
      learn: [
        "<strong>Spreadsheets (Excel, Google Sheets)</strong> — your first tool. Every data scientist must be excellent at spreadsheets. They handle up to ~1 million rows. Pivot tables, VLOOKUP, charts. <strong>You will use these in Module 2.</strong>",
        "<strong>SQL</strong> — the language databases speak. If your data is in a database (most companies), you must know SQL to get it out. <strong>You will master this in Module 3 — right here in QueryPilot.</strong>",
        "<strong>Python</strong> — the dominant data-science programming language. Free, open-source, beginner-friendly. Has libraries (toolboxes) like <code>Pandas</code> (data wrangling), <code>Matplotlib</code> / <code>Seaborn</code> (charts), <code>Scikit-learn</code> (machine learning). <strong>Modules 5-8.</strong>",
        "<strong>Statistics</strong> — not a tool, a mindset. The honest interpretation of numbers. <strong>Module 4.</strong>",
        "<strong>Visualization tools (Power BI, Tableau, Streamlit)</strong> — for building dashboards your stakeholders can click around in. <strong>Module 7 + Capstone.</strong>",
        "<strong>What you DON'T need at the start:</strong> R (alternative to Python — good but less common in Nigeria). MATLAB (academic, expensive). Spark / Hadoop (only for very large data). Cloud platforms (AWS / Azure / GCP — useful later, not now).",
        "<strong>Adewale's honest opinion:</strong> Get excellent at Spreadsheets + SQL + Python + Statistics. That covers 95% of paid data work in Nigeria today."
      ],
      example: "<strong>Adewale's actual stack on the 12 deployed projects:</strong><pre>• Python                — every project\n• Pandas + NumPy        — every project\n• Scikit-learn          — 8 of 12 projects (ML ones)\n• XGBoost               — 3 projects (advanced ML)\n• SHAP                  — 4 projects (explainability)\n• Matplotlib + Seaborn  — every project\n• Streamlit             — 9 projects (deployment)\n• SQL                   — every database-backed project\n• Power BI / Tableau    — analytics dashboards\n• GitHub                — every project\n• Google Colab          — for prototyping</pre>Note: zero proprietary tools. All free.",
      quiz: {
        q: "If you can only learn ONE programming language for data science, which should it be?",
        a: [
          { t:"R", c:false },
          { t:"Python", c:true, why:"Yes! Python has the largest ecosystem, easiest syntax for beginners, and dominates Nigerian and global job listings." },
          { t:"JavaScript", c:false },
          { t:"Java", c:false }
        ]
      },
      takeaway: "Excel + SQL + Python + Statistics covers 95% of data jobs. Everything else is bonus.",
      glossary: [
        { term:"Library", def:"A collection of pre-written code that solves a common problem. Saves you reinventing the wheel." },
        { term:"Open-source", def:"Free to use, the code is public, anyone can contribute. Python and all major DS libraries are open-source." }
      ]
    },

    { id:"m1.l6", type:"concept", title:"6. Real Nigerian Data Science Use Cases", est:"8 min",
      learn: [
        "Theory is empty without examples. Here are <strong>10 real ways data science is creating value in Nigeria today</strong>:",
        "<strong>1. Banking — Fraud Detection.</strong> GTBank, Access, Zenith all use ML to flag suspicious transactions in real time. Without it, fraud losses would be in billions of naira monthly.",
        "<strong>2. Banking — Credit Scoring.</strong> Carbon, FairMoney, Branch use ML to lend to people without traditional credit history. Trained on phone data, transaction patterns, BVN.",
        "<strong>3. E-commerce — Recommendations.</strong> Jumia, Konga recommend products based on browsing and purchase history. Increases basket size 15-30%.",
        "<strong>4. Logistics — Route Optimisation.</strong> Gokada, MAX.ng, Kobo360 use data science to route riders/trucks for minimum fuel & time.",
        "<strong>5. Agriculture — Yield Prediction.</strong> Farmcrowdy, Babban Gona use satellite data + weather + soil data to predict crop yields for smallholder farmers.",
        "<strong>6. Health — Disease Outbreak Tracking.</strong> NCDC tracks Lassa fever, cholera and now COVID-19 outbreaks using geographic data analysis.",
        "<strong>7. Education — Student At-Risk Prediction.</strong> (Like Adewale's Student At-Risk Predictor project.) Identify students likely to fail BEFORE exam season so teachers can intervene.",
        "<strong>8. Telecom — Churn Prediction.</strong> MTN, Glo, Airtel predict which subscribers will switch carriers and target them with retention offers.",
        "<strong>9. Government — Tax Compliance.</strong> FIRS uses data analytics to spot under-reporting based on industry benchmarks.",
        "<strong>10. Media / Politics — Sentiment Analysis.</strong> Track public opinion on Twitter/X about politicians, brands, policies. Pulse and SBM Intelligence publish reports.",
        "<strong>The pattern:</strong> Every industry has data. Every industry needs people who can turn that data into decisions. That person could be you."
      ],
      example: "<strong>Case study: Adewale's CBT Pro</strong><br>The problem: Nigerian secondary schools lacked free, reliable digital exam platforms.<br>The data: 7-column CSV format for questions, student responses, timing data.<br>The analysis: Per-student randomisation, anti-cheat scoring logic, auto-marking, 4-tab teacher analytics.<br>The decision: Teachers see who's at risk, which questions students struggle with, who's likely cheating.<br>The impact: Real students sat real exams. Real teachers made real interventions. Built on an Android tablet, zero budget. <a href='https://cssadewale.pages.dev' target='_blank' style='color:var(--ac)'>cssadewale.pages.dev</a>",
      quiz: {
        q: "Which of these is NOT a typical data science use case in Nigerian industry?",
        a: [
          { t:"Predicting bank fraud", c:false },
          { t:"Optimising okada / motorcycle delivery routes", c:false },
          { t:"Predicting which students may fail their exams", c:false },
          { t:"Writing the operating system for ATMs", c:true, why:"Correct! Writing an OS is systems programming, not data science. The other three are all real Nigerian DS applications today." }
        ]
      },
      takeaway: "Every Nigerian industry uses data science — banking, agric, telecom, education, government. The job market is large and growing.",
      glossary: [
        { term:"Use case", def:"A specific business problem solved by a tool or technique." },
        { term:"BVN", def:"Bank Verification Number. Nigeria's banking identity number used across all Nigerian banks." }
      ]
    },

    { id:"m1.l7", type:"concept", title:"7. Ethics — Just Because You Can, Doesn't Mean You Should", est:"10 min",
      learn: [
        "Data science is powerful. Powerful tools can hurt people if used carelessly. <strong>Every data scientist must wrestle with ethics.</strong> Here are the five questions to ask before every project.",
        "<strong>1. Did the people whose data this is, consent?</strong> Just because a hospital has my medical records doesn't mean a third party can use them for research. <strong>Nigeria's NDPR (Nigeria Data Protection Regulation, 2019)</strong> and the new <strong>NDPA (Nigeria Data Protection Act, 2023)</strong> require explicit consent for personal data processing.",
        "<strong>2. Could my model harm a group of people?</strong> A credit-scoring model trained mostly on Lagos residents may unfairly reject loans from northern Nigeria applicants — even if you didn't intend it. This is called <strong>bias</strong>. You must actively check for and correct bias.",
        "<strong>3. Am I being transparent?</strong> Black-box models that say 'rejected' with no explanation harm people. Use <strong>explainability tools (SHAP, LIME)</strong> so a customer can understand WHY a decision was made.",
        "<strong>4. What is the worst-case scenario if my model is wrong?</strong> A movie recommender getting it wrong → annoyed user. A medical-diagnosis model getting it wrong → dead patient. Match the rigour to the stakes.",
        "<strong>5. Who benefits, who pays?</strong> A targeting model that helps a tobacco company sell more cigarettes to teenagers makes the company richer and the teenagers sicker. Just because it's possible doesn't mean it's right.",
        "<strong>Three ethical principles to internalise:</strong><br>• <strong>Privacy by default.</strong> Strip personal identifiers (names, BVN, phone) before analysis whenever possible. Anonymise.<br>• <strong>Fairness audits.</strong> Compare your model's performance across demographic subgroups (gender, age, region). Fix disparities.<br>• <strong>Honest communication.</strong> Report uncertainty. <em>'I'm 78% confident'</em> not <em>'this is the answer.'</em>",
      ],
      example: "<strong>Real Nigerian example:</strong> In 2020, a fintech company's loan-rejection model was found to reject applicants from certain northern states at 3× the rate of southern applicants — not because they were riskier, but because the training data had very few northern customers. After a fairness audit and re-training with re-balanced data, the rejection gap closed to 1.1×. <strong>This is the work.</strong>",
      quiz: {
        q: "An ML model rejects bank loans from women at twice the rate of men with the same income and credit history. What should the data scientist do?",
        a: [
          { t:"Deploy it — the model is accurate on average", c:false },
          { t:"Investigate the bias, retrain with balanced data, and document the finding", c:true, why:"Yes. Bias in ML is a serious harm and a legal risk (NDPA). Auditing and fixing is not optional — it's the job." },
          { t:"Add a warning label", c:false },
          { t:"Quit the job", c:false }
        ]
      },
      takeaway: "Ethics is not optional. Consent, bias, transparency, stakes, beneficiaries — ask before every project.",
      glossary: [
        { term:"NDPR / NDPA", def:"Nigeria's data protection laws. Require consent, purpose limitation, security, data subject rights." },
        { term:"Bias", def:"When a model systematically performs worse for one group than another." },
        { term:"Explainability", def:"The ability to explain WHY a model made a specific prediction in human terms." }
      ]
    },

    { id:"m1.l8", type:"project", title:"8. Module 1 Project — Your First Data Audit", est:"30 min",
      learn: [
        "Time to do, not just read. This is a <strong>no-code project</strong> you can finish in 30 minutes.",
        "<strong>Mission:</strong> Pick any one of the following data sources you have access to, and write a one-page 'Data Audit' answering five questions about it.",
        "<strong>Pick ONE data source:</strong><br>• Your last 3 months of bank statements<br>• A school's attendance register<br>• Your WhatsApp chat history with one contact<br>• Your phone's call log<br>• A market trader's sales notebook<br>• Your grocery receipts<br>• Your social media followers list",
        "<strong>Answer all five questions in writing (paper or a Word doc):</strong>",
        "<strong>Q1. What is this data?</strong> One sentence describing what each row represents. Example: 'Each row is one transaction on my GTBank account.'",
        "<strong>Q2. What columns / fields does it have?</strong> List them. Mark each as quantitative (number) or qualitative (text/category).",
        "<strong>Q3. How clean is it?</strong> Spot 3 problems: missing values, typos, duplicates, wrong format, inconsistent date format, etc.",
        "<strong>Q4. What is one interesting question this data could answer?</strong> Be specific and measurable. Bad: 'How is my spending?' Good: 'Which day of the week do I spend the most money?'",
        "<strong>Q5. Who else might want this data, and what would the ethical concerns be?</strong> Think privacy, consent, harm.",
        "<strong>Bonus (optional):</strong> Open the data in Excel or Google Sheets and answer Q4 with a chart. Save it. Compare your answer to what you guessed."
      ],
      example: "<strong>Worked example — bank statement audit:</strong><br><strong>Q1.</strong> Each row is one transaction (debit or credit) on my GTBank account.<br><strong>Q2.</strong> Date (quantitative-ish), Description (qualitative), Debit ₦ (quantitative), Credit ₦ (quantitative), Balance (quantitative), Channel (qualitative — POS/ATM/Mobile).<br><strong>Q3.</strong> (1) Description column has inconsistent vendor names — 'CHICKEN REP' vs 'CHICKEN REPUBLIC'. (2) Some rows have missing channel. (3) ATM withdrawal fees are separate rows, making the debit count inflated.<br><strong>Q4.</strong> 'Which day of the week do I spend most money on food deliveries?'<br><strong>Q5.</strong> A scammer with my full statement could profile my habits, know when I'm paid, and target social-engineering attacks. Never share full statements casually.",
      project: {
        deliverable: "A one-page document answering Q1-Q5 for your chosen data source.",
        time: "30-60 minutes",
        difficulty: "Beginner",
        skills: ["Data identification", "Field type recognition", "Ethical thinking", "Question framing"]
      },
      takeaway: "You've now done your first data analysis. The hard skill of data science isn't coding — it's asking the right questions of a dataset.",
      glossary: []
    }

  ]
},

/* ===================================================================
   MODULE 2 — DATA LITERACY & SPREADSHEET THINKING
   =================================================================== */
{
  id: "m2",
  title: "Data Literacy & Spreadsheet Thinking",
  icon: "📊",
  color: "#58a6ff",
  level: "Beginner",
  weeks: 2,
  summary: "Master the language of data and the most-used data tool on Earth — the spreadsheet. By the end you'll think in rows, columns and tables, and use formulas to answer real questions. Tool: Excel, Google Sheets, LibreOffice Calc.",
  prereq: "Module 1, and access to any spreadsheet program (free options: Google Sheets, LibreOffice Calc).",
  lessons: [

    { id:"m2.l1", type:"concept", title:"1. Anatomy of a Dataset — Rows, Columns, Cells", est:"6 min",
      learn: [
        "Every spreadsheet, database table, CSV file, and machine-learning input shares the same structure. Once you learn it, you've learned the universal language of data.",
        "<strong>A dataset is a table.</strong> A table has <strong>rows</strong> (going across) and <strong>columns</strong> (going up-down). The intersection of a row and a column is a <strong>cell</strong>.",
        "<strong>Each ROW is one observation.</strong> One row = one customer, one sale, one student, one football match, one tweet. Whatever entity you're studying — one row per instance.",
        "<strong>Each COLUMN is one variable / feature.</strong> One column = one piece of information about every observation. Name. Age. State. Status.",
        "<strong>The top row is special</strong> — it's the <strong>header</strong> giving the column names. Everything below is real data.",
        "<strong>Vocabulary alert.</strong> The same thing has multiple names depending on who you talk to:<pre>Excel says:        Row · Column · Cell\nStatisticians say: Observation · Variable · Value\nDatabases say:     Record · Field · Value\nML people say:     Sample · Feature · Value</pre>It is all the same thing. Don't be confused when someone uses a different word."
      ],
      example: "<strong>A student dataset:</strong><pre>name        age   state    status     score\nAdebola     16    Lagos    active     85\nChinwe      17    Anambra  active     72\nMusa        16    Kano     active     68\nFunmi       18    Oyo      inactive   91</pre>4 rows (4 students = 4 observations). 5 columns (5 things we know about each student). 20 cells of actual data. The header row gives the column names.",
      quiz: {
        q: "In a sales dataset where each row is one transaction, what would each COLUMN typically be?",
        a: [
          { t:"A different transaction", c:false },
          { t:"A piece of information about every transaction (date, amount, item, etc.)", c:true, why:"Yes! Rows = observations (transactions), columns = variables (date, amount, item)." },
          { t:"A different customer", c:false }
        ]
      },
      takeaway: "Rows = observations. Columns = variables. Header row at the top. This structure is universal — Excel, SQL, Python all use it.",
      glossary: [
        { term:"Row / observation / record / sample", def:"One entity being studied. All four words mean the same thing." },
        { term:"Column / variable / feature / field", def:"One piece of information about every entity. All four words mean the same thing." },
        { term:"Cell", def:"One value at the intersection of one row and one column." }
      ]
    },

    { id:"m2.l2", type:"concept", title:"2. Data Types — what kind of value is in each cell?", est:"8 min",
      learn: [
        "Spreadsheets and computers care DEEPLY about the type of value in each cell. Wrong type = wrong calculations.",
        "<strong>The 5 common data types you'll meet:</strong>",
        "<strong>1. Integer (whole number).</strong> 5, 100, -3, 2026. Use for counts, ages, IDs. <em>Cannot be 5.5.</em>",
        "<strong>2. Decimal / Float (number with fractions).</strong> 1.78, ₦1200.50, 99.9%. Use for prices, percentages, measurements.",
        "<strong>3. Text / String.</strong> 'Adebola', 'Lagos', 'active'. Anything wrapped in quotes. Numbers can also be stored as text — 'phone: 08012345678' is text, not a number, even though it has digits.",
        "<strong>4. Date / Time.</strong> 2026-01-15, 14:30:00. Special type that knows about months, days of the week, leap years. <em>Critical:</em> a date stored as text ('15/01/2026') cannot be sorted or filtered correctly.",
        "<strong>5. Boolean (TRUE / FALSE).</strong> Yes/no. Paid/unpaid. Active/inactive. Stored as the words TRUE or FALSE, or as 1/0.",
        "<strong>Why this matters:</strong> If you store '₦1,200' in a cell, Excel sees it as TEXT (because of the ₦ symbol and comma). You cannot SUM text. You must store it as 1200 (a number) and let formatting add the ₦ separately."
      ],
      example: "<strong>Same data, two ways — only one works:</strong><pre>✘ BAD (stored as text — won't sum):\nAmount\n₦1,200\n₦2,500\n₦750\n[SUM formula returns #VALUE error]\n\n✓ GOOD (stored as numbers — sums correctly):\nAmount\n1200\n2500\n750\n[SUM = 4450, formatted to display ₦4,450]</pre>",
      quiz: {
        q: "Which data type would you use to store a phone number like 08012345678?",
        a: [
          { t:"Integer", c:false, why:"Phone numbers starting with 0 lose the leading 0 if stored as integers." },
          { t:"Text / String", c:true, why:"Yes! Phone numbers, BVN, account numbers should be text — to preserve leading zeros and disable accidental math." },
          { t:"Decimal", c:false },
          { t:"Date", c:false }
        ]
      },
      takeaway: "5 types: integer, decimal, text, date, boolean. Mismatched types break calculations. Phone/BVN/account numbers should be text.",
      glossary: [
        { term:"String", def:"Programmer-speak for text. Originated from 'string of characters'." },
        { term:"Type coercion", def:"When the computer tries to convert a value from one type to another automatically. Often the source of bugs." }
      ]
    },

    { id:"m2.l3", type:"concept", title:"3. CSV — the universal data format", est:"6 min",
      learn: [
        "<strong>CSV stands for Comma-Separated Values.</strong> It is the simplest, oldest, most-supported data format in computing. Excel, Google Sheets, Python, R, SQL databases — every tool reads CSV.",
        "<strong>What a CSV file looks like inside</strong> (it is just plain text):<pre>name,age,state,score\nAdebola,16,Lagos,85\nChinwe,17,Anambra,72\nMusa,16,Kano,68</pre>The first line is the header. Each subsequent line is one row. Columns are separated by commas. That's it.",
        "<strong>Why CSV?</strong><br>• <strong>Universal.</strong> Every tool on Earth reads it.<br>• <strong>Tiny.</strong> No formatting, no images, no formulas — just data.<br>• <strong>Plain text.</strong> Open in Notepad and read it.<br>• <strong>Easy to share.</strong> Email it, drop it in WhatsApp, attach to any system.",
        "<strong>Two gotchas to know:</strong>",
        "<strong>Gotcha 1 — commas inside data.</strong> What if a customer's name is 'Smith, John'? The comma confuses the parser. Solution: wrap the field in quotes: <code>\"Smith, John\",30,Lagos</code>.",
        "<strong>Gotcha 2 — encoding.</strong> CSV files saved on one computer may have funny characters (₦ becomes ?) when opened elsewhere. Always save as <strong>UTF-8</strong> encoding.",
        "<strong>You can drag a CSV file right into QueryPilot's sidebar (CSV tab) and it will auto-detect the schema.</strong> Try it later."
      ],
      example: "<strong>Live example — a tiny CSV you can paste into Notepad and save as <code>sales.csv</code>:</strong><pre>date,item,quantity,unit_price,customer\n2026-01-15,Jollof,12,1200,Tunde\n2026-01-15,Eba,8,800,Folake\n2026-01-16,Suya,20,500,\"Adebayo, J.\"\n2026-01-16,Jollof,15,1200,Bola</pre>Then open with Excel — it auto-creates 5 columns and 4 data rows.",
      quiz: {
        q: "Your colleague sends a CSV but when you open it the column for 'Vendor' is jumbled into two columns. What's most likely?",
        a: [
          { t:"The file is corrupted", c:false },
          { t:"A vendor name contains a comma, but the field isn't quoted", c:true, why:"Yes! 'Smith, John' splits across two columns unless wrapped in quotes." },
          { t:"You need a paid Excel license", c:false }
        ]
      },
      takeaway: "CSV = plain text with commas. Universal. Tiny. Watch for commas-inside-data and encoding (UTF-8).",
      glossary: [
        { term:"Encoding", def:"How text is stored as bytes. UTF-8 handles all world languages including ₦ and emoji." },
        { term:"Delimiter", def:"The character separating columns. Usually comma. Sometimes tab (TSV) or semicolon." }
      ]
    },

    { id:"m2.l4", type:"exercise", title:"4. Hands-on — your first spreadsheet exercise", est:"15 min",
      learn: [
        "<strong>Open your spreadsheet program right now.</strong> (Google Sheets is free at sheets.google.com — no account needed if you sign in with Google.)",
        "<strong>Type or paste this data starting in cell A1:</strong><pre>name        sales       region\nAdewale     250000      Lagos\nChinwe      180000      Abuja\nMusa        320000      Kano\nFolake      210000      Lagos\nTunde       150000      Ibadan\nNkechi      290000      Lagos\nBayo        175000      Abuja</pre>",
        "<strong>Now do each of these tasks:</strong>",
        "<strong>Task 1:</strong> In cell B9, type <code>=SUM(B2:B8)</code> and press Enter. <em>What number appears?</em>",
        "<strong>Task 2:</strong> In cell B10, type <code>=AVERAGE(B2:B8)</code>. <em>What's the average?</em>",
        "<strong>Task 3:</strong> In cell B11, type <code>=MAX(B2:B8)</code>. Who is the top seller? In B12 type <code>=MIN(B2:B8)</code> for the lowest.",
        "<strong>Task 4:</strong> In cell B13, type <code>=COUNTIF(C2:C8,\"Lagos\")</code>. <em>How many sellers are in Lagos?</em>",
        "<strong>Task 5:</strong> In B14, type <code>=SUMIF(C2:C8,\"Lagos\",B2:B8)</code>. <em>What's the total Lagos revenue?</em>"
      ],
      example: "<strong>Expected answers:</strong><br>Task 1: 1,575,000<br>Task 2: 225,000<br>Task 3: 320,000 (Musa is top), 150,000 (Tunde is lowest)<br>Task 4: 3<br>Task 5: 750,000 (Adewale + Folake + Nkechi)",
      exercise: {
        steps: 5,
        tool: "Any spreadsheet (Google Sheets free)",
        checkpoint: "Compare your numbers to the example. If they match, you can do basic spreadsheet analytics."
      },
      takeaway: "SUM, AVERAGE, MAX, MIN, COUNTIF, SUMIF — these 6 formulas handle 70% of basic spreadsheet analysis.",
      glossary: [
        { term:"Formula", def:"An expression starting with = that computes a value from other cells." },
        { term:"Range", def:"A group of cells, written as start:end. e.g. B2:B8 = cells B2 through B8." }
      ]
    },

    { id:"m2.l5", type:"concept", title:"5. The 6 essential spreadsheet formulas", est:"10 min",
      learn: [
        "If you master these six formulas, you can answer most business questions in a spreadsheet:",
        "<strong>1. SUM</strong> — adds numbers. <code>=SUM(B2:B100)</code>",
        "<strong>2. AVERAGE</strong> — mean. <code>=AVERAGE(B2:B100)</code>",
        "<strong>3. COUNT / COUNTA</strong> — COUNT counts numbers; COUNTA counts ANY non-empty cell. <code>=COUNTA(A2:A100)</code> to count rows.",
        "<strong>4. IF</strong> — conditional logic. <code>=IF(B2>200000, \"High\", \"Low\")</code> returns 'High' if B2 > 200,000, else 'Low'.",
        "<strong>5. VLOOKUP</strong> — look up a value in another table. <code>=VLOOKUP(A2, customers!A:C, 3, FALSE)</code> finds A2's name in the customers sheet column A, returns the value in the 3rd column. <strong>This is the most important formula in business spreadsheets.</strong>",
        "<strong>6. SUMIF / SUMIFS</strong> — sum with conditions. <code>=SUMIFS(B:B, C:C, \"Lagos\", D:D, \">100\")</code> sums B where C='Lagos' AND D>100.",
        "<strong>Bonus power formulas:</strong> CONCATENATE (join text), LEFT / RIGHT / MID (extract substrings), TODAY (current date), DATEDIF (days between dates), TEXT (format numbers), IFERROR (handle errors gracefully)."
      ],
      example: "<strong>Real scenario — compute commission:</strong><br>Column B has sales, column D should show 5% commission for sales above ₦200,000, 2% otherwise.<br>In D2: <code>=IF(B2>200000, B2*0.05, B2*0.02)</code><br>Drag down. Every row computes its own commission automatically.",
      quiz: {
        q: "You have a list of 500 employees in Sheet1 and a salary table in Sheet2. Which formula efficiently looks up each employee's salary?",
        a: [
          { t:"SUM", c:false },
          { t:"VLOOKUP", c:true, why:"Yes! VLOOKUP (or its modern replacement XLOOKUP) is the staple for cross-sheet lookups." },
          { t:"IF", c:false },
          { t:"COUNT", c:false }
        ]
      },
      takeaway: "SUM, AVERAGE, COUNT, IF, VLOOKUP, SUMIFS — your 6 essentials. Master these before anything else.",
      glossary: [
        { term:"VLOOKUP", def:"Vertical Lookup. Searches the first column of a range and returns a value from another column in the same row." },
        { term:"Argument", def:"An input to a formula. =SUM(B2:B100) has one argument (the range). =IF(B2>0, \"Yes\", \"No\") has three." }
      ]
    },

    { id:"m2.l6", type:"concept", title:"6. Pivot Tables — magic in 30 seconds", est:"12 min",
      learn: [
        "If formulas are the workhorses, <strong>pivot tables are the magic wand</strong>. They summarise thousands of rows into a clean cross-tabulation in seconds. Every employer expects you to know them.",
        "<strong>What a pivot table does:</strong> Takes a long list (1,000 sales) and produces a summary table (sales-per-region, sales-per-month, etc.) without you writing a single formula.",
        "<strong>Mental model:</strong> You drag column names into 3 boxes:<br>• <strong>Rows</strong> — what goes down the left side (e.g. Region)<br>• <strong>Columns</strong> — what goes across the top (e.g. Month)<br>• <strong>Values</strong> — what gets calculated in the body (e.g. SUM of Sales)",
        "<strong>5-step workflow (works in Excel and Google Sheets):</strong>",
        "<strong>Step 1:</strong> Select all your data including headers.",
        "<strong>Step 2:</strong> Insert → Pivot Table (Excel) or Insert → Pivot Table (Sheets).",
        "<strong>Step 3:</strong> Drag the field you want to GROUP BY into <strong>Rows</strong>.",
        "<strong>Step 4:</strong> Drag the field you want to MEASURE into <strong>Values</strong> (defaults to SUM).",
        "<strong>Step 5:</strong> Optionally drag another field into <strong>Columns</strong> for cross-tabulation.",
        "<strong>Critical insight:</strong> A pivot table is just SQL's <code>GROUP BY</code> in a friendly UI. <em>You will see this same pattern in SQL in Module 3.</em>"
      ],
      example: "<strong>Pivot table example — sales by region:</strong><br>Raw data: 1,000 rows of sales transactions with columns date, item, region, amount.<br>Pivot setup: Rows=Region, Values=SUM of Amount.<br>Result (3 rows!):<pre>Region    Sum of Amount\nAbuja     12,500,000\nKano      8,300,000\nLagos     31,200,000\nGrand Total: 52,000,000</pre>That's 1,000 rows summarised into 4 lines. <strong>This is the same answer as SQL: <code>SELECT region, SUM(amount) FROM sales GROUP BY region;</code></strong>",
      quiz: {
        q: "You have 5,000 rows of sales data. You want to see total sales by month. What's the fastest tool?",
        a: [
          { t:"Write 12 SUMIF formulas", c:false },
          { t:"Pivot table with Month in Rows, SUM(amount) in Values", c:true, why:"Yes! Pivot table = 30 seconds. SUMIF = 10 minutes." },
          { t:"Open the file in Word", c:false }
        ]
      },
      takeaway: "Pivot tables = drag-and-drop GROUP BY. Rows + Columns + Values = summary in seconds. Mental model for SQL GROUP BY in Module 3.",
      glossary: [
        { term:"Pivot table", def:"A summary table generated by aggregating data across one or more categorical dimensions." },
        { term:"Cross-tabulation (cross-tab)", def:"A table with categories on both axes (e.g. region × month). Also called contingency table." }
      ]
    },

    { id:"m2.l7", type:"concept", title:"7. Data Cleaning — the 80% job", est:"12 min",
      learn: [
        "Real data is dirty. Always. You will spend more time cleaning data than analysing it — typically 60-80% of your project time. Embrace it; this is the work.",
        "<strong>The 7 most common data quality issues:</strong>",
        "<strong>1. Missing values.</strong> Some cells are empty (blank, NULL, NaN, NA, '-'). You must decide: delete the row, fill with a default (0, 'unknown', the average), or flag for follow-up.",
        "<strong>2. Duplicates.</strong> Same customer recorded twice. Use Excel's <em>Remove Duplicates</em> (Data tab) or Sheets' UNIQUE function.",
        "<strong>3. Typos & inconsistencies.</strong> 'Lagos', 'lagos', 'LAGOS', 'Lagoss', 'Lag.', 'L.A' — all the same place. Use TRIM, LOWER, UPPER, PROPER to standardise.",
        "<strong>4. Wrong data types.</strong> Numbers stored as text (because of ₦ or commas). Dates stored as text. Use VALUE() and DATEVALUE() to convert.",
        "<strong>5. Inconsistent date formats.</strong> '15/01/2026' (DD/MM) vs '01/15/2026' (MM/DD) vs '2026-01-15' (ISO). Always convert to ISO 8601 (<code>YYYY-MM-DD</code>) — unambiguous worldwide.",
        "<strong>6. Outliers and impossible values.</strong> A customer aged 250. A price of -₦500. Validate ranges. Decide: bad data (delete) or rare-but-real (keep).",
        "<strong>7. Mixed units.</strong> Some prices in ₦, some in $. Some weights in kg, some in lbs. Standardise everything to one unit before analysis.",
        "<strong>The cleaning checklist (memorise):</strong> Inspect → Standardise → Validate → Deduplicate → Handle missing → Document.",
        "<strong>Document everything.</strong> Keep a 'cleaning log' note: <em>'Removed 14 duplicate customer IDs. Filled 23 missing 'region' values with 'Unknown'. Converted prices from ₦ to plain numbers.'</em> This protects you when a stakeholder asks 'why are your numbers different from mine?'"
      ],
      example: "<strong>A typical 'before / after' clean:</strong><pre>BEFORE:                              AFTER:\nName       State        Amount       Name       State    Amount\n adebola    LAGOS       ₦1,200       Adebola    Lagos    1200\nADEBOLA     Lagos       1,200        Bola       Abuja    800\nbola        Abuja        800         Chioma     Lagos    1500\nChioma      lagoss      1500\n[adebola listed twice; \"Lagos\" inconsistent;\n one typo (lagoss); ₦ symbol breaks SUM]\n\nOperations: TRIM whitespace, PROPER case,\ndedup, fix typo, strip ₦ symbol.</pre>",
      quiz: {
        q: "You find 50 rows missing a 'region' value out of 10,000 rows. What's typically the best first move?",
        a: [
          { t:"Delete all 50 rows immediately", c:false, why:"Hasty — you may be deleting valuable records." },
          { t:"Fill them all with 'Lagos' since most are Lagos", c:false, why:"Introduces bias and false confidence." },
          { t:"Investigate WHY they're missing, then decide (delete, fill 'Unknown', or impute carefully)", c:true, why:"Yes! Missing data tells a story. Find out WHY before deciding HOW to handle it." }
        ]
      },
      takeaway: "Cleaning is 60-80% of the job. 7 common issues. Inspect → Standardise → Validate → Deduplicate → Handle missing → Document.",
      glossary: [
        { term:"NULL / NaN / NA", def:"Different conventions for 'missing'. NULL = SQL. NaN = Python/NumPy. NA = R / generic." },
        { term:"ISO 8601", def:"International date format YYYY-MM-DD. Unambiguous, sortable as text. Always use this." },
        { term:"Outlier", def:"A value far from the rest. Either an error (250-year-old human) or a rare-but-real event (₦10M one-off sale)." }
      ]
    },

    { id:"m2.l8", type:"concept", title:"8. Conditional formatting — let colours tell the story", est:"6 min",
      learn: [
        "<strong>Conditional formatting</strong> colours cells based on rules. Done well, it turns a table of numbers into an instant visual summary.",
        "<strong>3 high-value uses:</strong>",
        "<strong>1. Heatmaps.</strong> Colour cells from red (low) to green (high) automatically. Instantly see top performers vs underperformers.",
        "<strong>2. Threshold alerts.</strong> Colour any cell red if value < target. Spot problems at a glance.",
        "<strong>3. Duplicate highlighting.</strong> Highlight cells that appear more than once. Find dupes visually before deciding to remove.",
        "<strong>How to do it (Excel / Sheets — almost identical):</strong>",
        "<strong>Step 1:</strong> Select your range.",
        "<strong>Step 2:</strong> Excel: Home → Conditional Formatting. Sheets: Format → Conditional formatting.",
        "<strong>Step 3:</strong> Choose a rule (Color Scale, Greater Than, Duplicate Values, Custom Formula).",
        "<strong>Step 4:</strong> Pick colours. Apply.",
        "<strong>Be tasteful.</strong> Three colours max. Avoid red-green only (colour-blind users). Use blue-orange or grey-orange instead."
      ],
      example: "<strong>Example — sales dashboard:</strong> 200 salespeople, monthly target ₦500,000. Apply conditional formatting: <em>cells &lt; ₦500,000 = light red; cells ≥ ₦500,000 = light green</em>. The manager scrolls down once and instantly sees who missed target. No mental arithmetic required.",
      quiz: {
        q: "What's the main risk of overusing conditional formatting?",
        a: [
          { t:"It slows down Excel", c:false },
          { t:"The dashboard becomes a rainbow nobody can read", c:true, why:"Yes! 3 colours max. Less is more." },
          { t:"It deletes your data", c:false }
        ]
      },
      takeaway: "Conditional formatting = automatic visual cues. Heatmaps, alerts, duplicate-highlights. Use sparingly.",
      glossary: [
        { term:"Heatmap", def:"A visual where colour intensity represents numeric magnitude." }
      ]
    },

    { id:"m2.l9", type:"concept", title:"9. Charts — pick the right one", est:"10 min",
      learn: [
        "Choosing the wrong chart is a beginner mistake that screams 'I don't know what I'm doing'. There are 7 chart types worth knowing, and a rule for when to use each.",
        "<strong>1. Bar chart (horizontal bars).</strong> Use when: comparing categories. Best when category names are long (Lagos, Port Harcourt, Owerri).",
        "<strong>2. Column chart (vertical bars).</strong> Use when: comparing categories with short names, or showing change over time with discrete periods (months, quarters).",
        "<strong>3. Line chart.</strong> Use when: showing trend over <em>continuous</em> time (daily sales over 6 months). Lines imply connection between points.",
        "<strong>4. Pie chart.</strong> Use when: showing parts of a whole, with <em>2-5 slices max</em>. Pie charts with 12 slices are unreadable. Most data scientists rarely use pie charts.",
        "<strong>5. Scatter plot.</strong> Use when: showing relationship between two numeric variables (age vs salary). Each dot is one observation.",
        "<strong>6. Histogram.</strong> Use when: showing the <em>distribution</em> of one numeric variable (how many customers fall in each age bracket).",
        "<strong>7. Stacked bar chart.</strong> Use when: comparing totals AND composition across categories (each region's sales, broken down by product type).",
        "<strong>Chart anti-patterns to avoid:</strong><br>• 3D charts — distort proportions<br>• Charts with no axis labels<br>• Truncated y-axis that exaggerates tiny differences<br>• More than 5 colours<br>• Charts without a title that answers the question"
      ],
      example: "<strong>The chart-choice flowchart:</strong><pre>Are you comparing categories?\n  ├─ Few (2-5) and parts of whole? → Pie or Donut\n  ├─ Many categories?              → Bar chart\nAre you showing trend over time?\n  ├─ Continuous (days, months)?    → Line chart\n  └─ Discrete periods?              → Column chart\nAre you showing a relationship?\n  └─ Two numeric variables?         → Scatter plot\nAre you showing a distribution?\n  └─ How values spread out?          → Histogram</pre>",
      quiz: {
        q: "You want to show how monthly revenue changed over the last 2 years. Best chart?",
        a: [
          { t:"Pie chart", c:false, why:"Pie shows composition, not trend." },
          { t:"Line chart", c:true, why:"Yes! Line charts excel at trends over continuous time." },
          { t:"Scatter plot", c:false }
        ]
      },
      takeaway: "7 chart types. Bar/column for compare. Line for trend. Pie sparingly. Scatter for relationship. Histogram for distribution.",
      glossary: [
        { term:"Distribution", def:"How values of a variable are spread out across their range. Visualised with a histogram." },
        { term:"Trend", def:"The general direction (up, down, flat) of a variable over time." }
      ]
    },

    { id:"m2.l10", type:"exercise", title:"10. Hands-on — build a 3-chart dashboard", est:"30 min",
      learn: [
        "Time to build something real. <strong>Open Google Sheets.</strong> Create a new blank spreadsheet.",
        "<strong>Step 1 — Paste this data starting at A1:</strong><pre>month       region      revenue\nJan         Lagos       450000\nJan         Abuja       320000\nJan         Kano        210000\nFeb         Lagos       510000\nFeb         Abuja       340000\nFeb         Kano        225000\nMar         Lagos       490000\nMar         Abuja       360000\nMar         Kano        240000\nApr         Lagos       560000\nApr         Abuja       380000\nApr         Kano        255000</pre>",
        "<strong>Step 2 — Pivot Table #1: Total revenue by region.</strong> Select all data → Insert → Pivot table. Rows = region. Values = SUM of revenue.",
        "<strong>Step 3 — Chart #1: Bar chart of region totals.</strong> Select the pivot output → Insert → Chart. Choose horizontal bar. Title: 'Q1 2026 Revenue by Region'.",
        "<strong>Step 4 — Pivot Table #2: Monthly revenue trend (regions side by side).</strong> New pivot. Rows = month. Columns = region. Values = SUM of revenue.",
        "<strong>Step 5 — Chart #2: Line chart of monthly trend.</strong> Insert chart on the new pivot. Choose 'Line chart'. Three coloured lines (one per region).",
        "<strong>Step 6 — Chart #3: 100% stacked column.</strong> Same data, but choose '100% stacked column' as the chart type. Each month becomes a stack showing each region's share.",
        "<strong>Step 7 — Caption each chart with one insight.</strong> Example: 'Chart 1: Lagos contributed 49% of Q1 revenue.' This is the most important step — without an insight, the chart is just decoration."
      ],
      example: "<strong>Expected insights:</strong><br>• Chart 1: Lagos is by far the largest region (~₦2M of ~₦4.3M total = ~46%).<br>• Chart 2: All three regions are growing. Lagos accelerated in April.<br>• Chart 3: The proportion of revenue from Lagos vs Kano is roughly stable across months.",
      exercise: {
        steps: 7,
        tool: "Google Sheets (free)",
        deliverable: "Three charts with one-sentence insights each."
      },
      takeaway: "Pivot + chart + insight = a mini-dashboard. Always include the insight; the chart alone is not the answer.",
      glossary: []
    },

    { id:"m2.l11", type:"concept", title:"11. Tidy Data — the format ML and SQL prefer", est:"8 min",
      learn: [
        "<strong>'Tidy data' is the gold standard format.</strong> Coined by statistician Hadley Wickham. Three simple rules — when followed, every tool works smoothly:",
        "<strong>Rule 1:</strong> Each <strong>variable</strong> is a column.",
        "<strong>Rule 2:</strong> Each <strong>observation</strong> is a row.",
        "<strong>Rule 3:</strong> Each <strong>type of observational unit</strong> is a table.",
        "<strong>Common UNTIDY formats and their fixes:</strong>",
        "<strong>Untidy 1 — values stuffed into column headers.</strong><pre>name    Jan    Feb    Mar\nAdewale 100    120    130</pre>The months should be values, not columns. Fix: <strong>melt / unpivot</strong>:<pre>name    month  amount\nAdewale Jan    100\nAdewale Feb    120\nAdewale Mar    130</pre>",
        "<strong>Untidy 2 — multiple variables in one column.</strong><pre>name        contact\nAdewale     phone:08012; email:a@x</pre>Two variables crammed into 'contact'. Fix: split into two columns.",
        "<strong>Untidy 3 — multiple tables in one sheet.</strong> A single Excel sheet containing customer info AND order info side by side. Fix: separate into two tables (sheets).",
        "<strong>Why tidy?</strong> Pivot tables work. SQL GROUP BY works. Pandas works. Charts work. Untidy data fights you at every step."
      ],
      example: "<strong>Power of tidy:</strong> Once your data is tidy, you can: filter by any column, group by any column, chart any combination, paste straight into Pandas/SQL without preprocessing. <strong>Untidy data wastes hours; tidy data flies.</strong>",
      quiz: {
        q: "Is this dataset tidy? <pre>student   maths  english  physics\nAdebola   85     72       90\nMusa      68     81       75</pre>",
        a: [
          { t:"Yes, perfectly tidy", c:false, why:"Almost — the subjects (maths, english, physics) are really VALUES of a 'subject' variable, not separate variables." },
          { t:"No — the subject names are values stuffed into column headers; should be melted", c:true, why:"Correct. Tidy form would have 6 rows: each student-subject pair, with columns student / subject / score." }
        ]
      },
      takeaway: "Tidy = 1 variable per column, 1 observation per row, 1 unit per table. Reshape with melt/pivot until tidy.",
      glossary: [
        { term:"Tidy data", def:"A standardised format making analysis easy: vars=columns, obs=rows, unit-types=tables." },
        { term:"Melt / unpivot", def:"Reshape data from wide format (many columns) to long format (more rows, fewer columns)." }
      ]
    },

    { id:"m2.l12", type:"project", title:"12. Module 2 Project — Clean & analyse a real dataset", est:"60 min",
      learn: [
        "<strong>Mission:</strong> Download a real Nigerian dataset, clean it, and produce 3 insights in a spreadsheet.",
        "<strong>Suggested datasets (all free, no signup):</strong><br>• <em>Nigeria National Bureau of Statistics</em> (nigerianstat.gov.ng) — pick any CSV<br>• <em>Kaggle 'Nigerian Population by State'</em> — search on kaggle.com<br>• <em>data.gov.ng</em> — government open data portal<br>• <em>Or use the practice data below</em>",
        "<strong>Practice data (paste into Sheets if you can't access the above):</strong><pre>state,population_2022,unemployment_pct,gdp_billion_naira\nLagos,15388000,11.4,30000\nKano,15462000,15.2,2500\nRivers,7303924,18.7,7200\nAbuja FCT,3564126,9.8,4500\nOgun,5217716,12.1,2900\nKaduna,8252366,16.8,2100\nOyo,7976100,13.5,2400\nKatsina,7831319,17.9,1200\nImo,5408755,13.2,1800\nBenue,5741815,14.6,1500\n,4000000,,1100\nKogi,4473490,13.1,1300\nDelta,5663362,11.7,3500\nLagos,15388000,11.4,30000\nEdo,4235595,12.8,1900</pre>",
        "<strong>Your tasks:</strong>",
        "<strong>1. CLEAN:</strong> The dataset has 2 quality issues — find and fix them. (Hint: a duplicate row and a row with a missing state name.)",
        "<strong>2. CHART:</strong> Create a bar chart of population by state, sorted descending. Title it meaningfully.",
        "<strong>3. PIVOT:</strong> Compute average unemployment_pct. How many states are above average?",
        "<strong>4. INSIGHT #1:</strong> Is there a relationship between population and GDP? Build a scatter plot.",
        "<strong>5. INSIGHT #2:</strong> Which state has the highest GDP per person (gdp/population)? Add a computed column.",
        "<strong>6. INSIGHT #3:</strong> Of states above the unemployment average, what's their combined population?",
        "<strong>7. WRITE-UP:</strong> Save a 1-page document with screenshots of your 2 charts and a 3-bullet summary of insights."
      ],
      example: "<strong>Expected findings:</strong><br>• Cleaning: 1 duplicate Lagos row (last copy), 1 row with missing state name.<br>• Population: Kano edges out Lagos by ~75k.<br>• Average unemployment: ~13.7%. 7 states above average.<br>• Insight: GDP per person varies wildly — Lagos and Abuja FCT are far ahead.",
      project: {
        deliverable: "1-page document with 2 charts + 3 insight bullets.",
        time: "60 minutes",
        difficulty: "Beginner",
        skills: ["Data cleaning", "Pivot tables", "Charts", "Insight writing"]
      },
      takeaway: "You can now: clean a real dataset, build charts, and write insights. You're already more capable than 80% of 'I know Excel' resumes.",
      glossary: []
    }

  ]
},

/* ===================================================================
   MODULE 3 — SQL FOR DATA ANALYSIS
   The existing 17 lessons become the body of this module.
   Adding 8 advanced lessons after.
   =================================================================== */
{
  id: "m3",
  title: "SQL for Data Analysis",
  icon: "🔍",
  color: "#f69d50",
  level: "Beginner → Intermediate",
  weeks: 3,
  summary: "SQL is the universal language of databases. Almost every Nigerian bank, telecom, fintech and government system stores data in a SQL database. This module makes you fluent — using QueryPilot's own tools so you can practice as you learn.",
  prereq: "Modules 1-2.",
  lessons: [
    // Bridges to the existing 17 lessons in app.js
    { id:"m3.l1", type:"concept", title:"1. SELECT & FROM — getting columns", est:"7 min",
      learn: [
        "SQL stands for <strong>Structured Query Language</strong>. It's how you ask databases for data. The first and most important command is <code>SELECT</code>.",
        "<strong>Anatomy of the simplest SQL query:</strong><pre>SELECT column1, column2\nFROM table_name;</pre>Read it left-to-right: <em>'Pick these columns FROM this table.'</em>",
        "<strong>Special: <code>SELECT *</code></strong> — the asterisk means 'all columns'. Use it for exploration; in production prefer naming columns explicitly (faster, more stable, more readable).",
        "<strong>Always end with a semicolon (<code>;</code>).</strong> It tells SQL 'I'm done with this statement.' Most databases will complain if you forget it.",
        "<strong>SQL is NOT case-sensitive</strong> for keywords. <code>SELECT</code>, <code>select</code>, <code>Select</code> all work. <strong>Convention:</strong> uppercase keywords, lowercase table/column names. Easier to read.",
        "<strong>Try it right now in QueryPilot.</strong> Switch to Ask mode and type: <code>show me all customers</code>. QueryPilot will generate the SQL. Click '▶ Try' below to do this automatically."
      ],
      example: "<pre>-- Get all columns from customers\nSELECT * FROM customers;\n\n-- Get just two columns\nSELECT name, email FROM customers;\n\n-- Rename a column in output using AS\nSELECT name AS customer_name, email FROM customers;</pre>",
      tryq: "Show me all customers",
      quiz: {
        q: "What does the asterisk (*) mean in SELECT * FROM customers?",
        a: [
          { t:"Multiply by a number", c:false },
          { t:"Select all columns", c:true, why:"Yes! * is shorthand for 'every column'." },
          { t:"Select all rows", c:false, why:"SELECT chooses columns, not rows. WHERE filters rows." }
        ]
      },
      takeaway: "SELECT columns FROM table. End with ;. Use * for exploration, named columns for production.",
      glossary: [
        { term:"Query", def:"A request for data from a database, written in SQL." },
        { term:"Table", def:"A 2D structure of data with named columns and rows. Like a spreadsheet sheet." }
      ]
    },

    { id:"m3.l2", type:"concept", title:"2. WHERE — filtering rows", est:"8 min",
      learn: [
        "Selecting columns gives you columns. Often you only want some rows — those matching a condition. That's what <code>WHERE</code> does.",
        "<strong>Syntax:</strong><pre>SELECT name, status\nFROM customers\nWHERE status = 'active';</pre>WHERE comes AFTER FROM. The condition is checked against every row; only matching rows are returned.",
        "<strong>Comparison operators:</strong><br>• <code>=</code> equals (note: single = in SQL, not == like Python)<br>• <code>!=</code> or <code>&lt;&gt;</code> not equal<br>• <code>&lt;</code> <code>&gt;</code> <code>&lt;=</code> <code>&gt;=</code> standard comparisons",
        "<strong>String comparison:</strong> wrap text in single quotes. <code>WHERE state = 'Lagos'</code> NOT <code>WHERE state = \"Lagos\"</code> (some DBs reject double quotes for strings).",
        "<strong>Multiple conditions — AND / OR:</strong><pre>WHERE status = 'active' AND age &gt;= 18\nWHERE state = 'Lagos' OR state = 'Abuja'</pre>",
        "<strong>Special operators:</strong><br>• <code>LIKE '%Smith%'</code> — text contains 'Smith'<br>• <code>BETWEEN 10 AND 100</code> — inclusive range<br>• <code>IN ('a','b','c')</code> — match any in list<br>• <code>IS NULL</code> / <code>IS NOT NULL</code> — missing values"
      ],
      example: "<pre>-- Customers in Lagos who are active\nSELECT name, email\nFROM customers\nWHERE state = 'Lagos' AND status = 'active';\n\n-- Orders worth between 1,000 and 5,000\nSELECT *\nFROM orders\nWHERE total BETWEEN 1000 AND 5000;\n\n-- Customers from any of these states\nSELECT name\nFROM customers\nWHERE state IN ('Lagos', 'Abuja', 'Port Harcourt');</pre>",
      tryq: "Show active customers in Lagos",
      quiz: {
        q: "How do you find customers whose name contains 'ade' (anywhere)?",
        a: [
          { t:"WHERE name = 'ade'", c:false },
          { t:"WHERE name LIKE '%ade%'", c:true, why:"Yes! % is a wildcard meaning 'any characters'. %ade% means 'something + ade + something'." },
          { t:"WHERE name CONTAINS 'ade'", c:false }
        ]
      },
      takeaway: "WHERE filters rows. =, !=, <, >, AND, OR, LIKE, IN, BETWEEN, IS NULL. Strings in single quotes.",
      glossary: [
        { term:"Predicate", def:"The condition in a WHERE clause that evaluates to TRUE or FALSE per row." },
        { term:"Wildcard", def:"A character with special meaning in pattern matching. % = any chars; _ = exactly one char." }
      ]
    },

    { id:"m3.l3", type:"concept", title:"3. ORDER BY & LIMIT — sorting and pagination", est:"6 min",
      learn: [
        "Without sorting, SQL returns rows in <strong>no guaranteed order</strong>. Use <code>ORDER BY</code> to make order predictable.",
        "<pre>SELECT name, total\nFROM orders\nORDER BY total DESC;</pre>DESC = highest first. ASC = lowest first (default, can be omitted).",
        "<strong>Sort by multiple columns:</strong> <code>ORDER BY state ASC, total DESC</code> — sorts by state alphabetically; within each state, by total highest first. Like sorting Excel by two columns.",
        "<strong>LIMIT N</strong> returns only the first N rows. Use it for 'top 10' lists.",
        "<strong>OFFSET N</strong> skips the first N rows. Combine with LIMIT for pagination: page 2 with 10 per page = <code>LIMIT 10 OFFSET 10</code>.",
        "<strong>Note for SQL Server / Oracle users:</strong> these use slightly different syntax (<code>TOP</code>, <code>FETCH FIRST</code>). QueryPilot adapts based on your dialect selection."
      ],
      example: "<pre>-- Top 10 customers by revenue (highest first)\nSELECT name, SUM(total) AS revenue\nFROM orders\nGROUP BY name\nORDER BY revenue DESC\nLIMIT 10;\n\n-- Page 3 of customers, 20 per page\nSELECT *\nFROM customers\nORDER BY name\nLIMIT 20 OFFSET 40;</pre>",
      tryq: "Top 5 customers by revenue",
      quiz: {
        q: "What does LIMIT 10 OFFSET 20 return?",
        a: [
          { t:"The first 10 rows starting from row 21 (rows 21-30)", c:true, why:"Yes! OFFSET 20 skips the first 20 rows; LIMIT 10 takes the next 10." },
          { t:"Rows 10 through 20", c:false },
          { t:"Only 10 rows from the top", c:false }
        ]
      },
      takeaway: "ORDER BY for sorting (ASC default, DESC for highest first). LIMIT N + OFFSET N for pagination.",
      glossary: [
        { term:"Pagination", def:"Returning data in pages (e.g. 20 rows per page) instead of all at once." }
      ]
    },

    { id:"m3.l4", type:"concept", title:"4. Aggregates — COUNT, SUM, AVG, MAX, MIN", est:"8 min",
      learn: [
        "Aggregates collapse many rows into one number. <em>'How many?'</em>, <em>'What's the total?'</em>, <em>'What's the average?'</em> These are aggregate questions.",
        "<strong>The 5 essential aggregate functions:</strong>",
        "<strong>COUNT(*)</strong> — number of rows. <em>How many customers do we have?</em>",
        "<strong>COUNT(col)</strong> — number of rows where col is NOT NULL. <em>How many customers gave us their email?</em>",
        "<strong>COUNT(DISTINCT col)</strong> — number of unique values. <em>How many different states do our customers come from?</em>",
        "<strong>SUM(col)</strong> — adds up numeric values. <em>Total revenue?</em>",
        "<strong>AVG(col)</strong> — arithmetic mean. <em>Average order value?</em>",
        "<strong>MAX(col)</strong> / <strong>MIN(col)</strong> — extremes. <em>Highest sale? Earliest signup?</em>",
        "<strong>Important:</strong> When you use an aggregate without GROUP BY (next lesson), it collapses the entire table into ONE row of summary numbers."
      ],
      example: "<pre>-- One row of dashboard numbers\nSELECT\n  COUNT(*) AS total_customers,\n  COUNT(DISTINCT state) AS unique_states,\n  COUNT(email) AS customers_with_email,\n  AVG(age) AS average_age,\n  MAX(created_at) AS most_recent_signup\nFROM customers;</pre>Returns a single row with 5 numbers — your dashboard KPIs in one query.",
      tryq: "Count total orders and their average value",
      quiz: {
        q: "What's the difference between COUNT(*) and COUNT(email)?",
        a: [
          { t:"They're identical", c:false },
          { t:"COUNT(*) counts all rows; COUNT(email) counts rows where email is not NULL", c:true, why:"Yes! COUNT(col) skips NULL values, COUNT(*) counts every row." },
          { t:"COUNT(email) is faster", c:false }
        ]
      },
      takeaway: "5 aggregates: COUNT, SUM, AVG, MAX, MIN. COUNT(DISTINCT) for unique values. Collapses many rows to one.",
      glossary: [
        { term:"Aggregate function", def:"A function that takes many input values and returns a single output value." }
      ]
    },

    { id:"m3.l5", type:"concept", title:"5. GROUP BY — aggregates per category", est:"10 min",
      learn: [
        "<code>GROUP BY</code> is the single most powerful clause in SQL. <strong>It is the SQL equivalent of a pivot table.</strong>",
        "<strong>What it does:</strong> Splits rows into groups by a column's value. Then runs aggregates per group instead of for the whole table.",
        "<pre>SELECT state, COUNT(*) AS customer_count\nFROM customers\nGROUP BY state;</pre>This returns one row per unique state, with the count of customers in each. Compare to a pivot table with Rows=state, Values=COUNT.",
        "<strong>Rule:</strong> Every column in SELECT must either (a) be in the GROUP BY, or (b) be wrapped in an aggregate function. Mixing 'individual values' with 'group values' makes no sense and SQL will reject it.",
        "<strong>Group by multiple columns:</strong> <code>GROUP BY state, age_group</code> creates one row per state-and-age-group combination. Like a pivot with two dimensions.",
        "<strong>This is the pattern that powers 70% of business reports.</strong> Sales by region, customers by month, defects by product — all GROUP BY."
      ],
      example: "<pre>-- Revenue per region, per month\nSELECT\n  region,\n  EXTRACT(MONTH FROM created_at) AS month,\n  SUM(total) AS revenue,\n  COUNT(*) AS order_count,\n  AVG(total) AS avg_order_value\nFROM orders\nGROUP BY region, EXTRACT(MONTH FROM created_at)\nORDER BY region, month;</pre>One row per region-month combination. Exactly what a pivot table with Rows=region, Columns=month, Values=SUM/COUNT/AVG would show.",
      tryq: "Total revenue by region",
      quiz: {
        q: "Why does this query fail? <code>SELECT name, region, SUM(total) FROM orders GROUP BY region;</code>",
        a: [
          { t:"Missing semicolon", c:false },
          { t:"'name' is in SELECT but not GROUP BY and not aggregated", c:true, why:"Yes! Every non-aggregated column in SELECT must appear in GROUP BY. SQL doesn't know WHICH name to show per region." },
          { t:"You can't have SUM with GROUP BY", c:false }
        ]
      },
      takeaway: "GROUP BY = SQL pivot table. Every SELECT column must be in GROUP BY or wrapped in an aggregate.",
      glossary: [
        { term:"GROUP BY", def:"Splits rows into groups and applies aggregates per group. Equivalent to a spreadsheet pivot table." }
      ]
    },

    { id:"m3.l6", type:"concept", title:"6. HAVING — filtering after aggregation", est:"7 min",
      learn: [
        "<strong>WHERE</strong> filters <em>before</em> aggregation. <strong>HAVING</strong> filters <em>after</em> aggregation. Both are filters; the difference is timing.",
        "<pre>SELECT region, SUM(total) AS revenue\nFROM orders\nWHERE status = 'completed'      -- filter rows first\nGROUP BY region\nHAVING SUM(total) &gt; 1000000;     -- filter groups after</pre>WHERE removes rows before grouping; HAVING removes groups after.",
        "<strong>Rule of thumb:</strong> Filter on aggregate functions (SUM, COUNT, AVG…) → use HAVING. Filter on plain column values → use WHERE.",
        "<strong>Common use case:</strong> Find duplicate values.<pre>SELECT email, COUNT(*) AS dup_count\nFROM customers\nGROUP BY email\nHAVING COUNT(*) &gt; 1;</pre>Returns only emails that appear more than once — the duplicates."
      ],
      example: "<pre>-- Regions with at least 100 active customers AND avg order > 5000\nSELECT region, COUNT(*) AS active_count, AVG(total) AS avg_order\nFROM orders\nWHERE status = 'active'\nGROUP BY region\nHAVING COUNT(*) &gt;= 100 AND AVG(total) &gt; 5000\nORDER BY active_count DESC;</pre>",
      tryq: "Find duplicate emails",
      quiz: {
        q: "Where should you put the condition 'AVG(salary) > 100000' — in WHERE or HAVING?",
        a: [
          { t:"WHERE", c:false, why:"WHERE can't reference aggregate functions because aggregates don't exist until after grouping." },
          { t:"HAVING", c:true, why:"Yes! AVG is an aggregate — filters on aggregates go in HAVING, after grouping." }
        ]
      },
      takeaway: "WHERE filters rows (before grouping). HAVING filters groups (after grouping). Aggregate filters use HAVING.",
      glossary: [
        { term:"HAVING", def:"A WHERE-like clause that filters groups after GROUP BY aggregation." }
      ]
    },

    { id:"m3.l7", type:"concept", title:"7. JOINs — combining tables (the big one)", est:"15 min",
      learn: [
        "Databases split data across multiple tables to avoid duplication. <strong>JOIN</strong> stitches them back together.",
        "<strong>The classic example:</strong> You have a <code>customers</code> table and an <code>orders</code> table. Orders has <code>customer_id</code> linking to customers. To show 'order date AND customer name in one report', you must JOIN.",
        "<strong>Anatomy:</strong><pre>SELECT customers.name, orders.total, orders.created_at\nFROM customers\nINNER JOIN orders ON customers.id = orders.customer_id;</pre>Read it as: <em>'Take customers. INNER JOIN it with orders. The link is: customers.id matches orders.customer_id.'</em>",
        "<strong>The 4 join types you must know:</strong>",
        "<strong>1. INNER JOIN</strong> — only rows that match in BOTH tables. (Customer must have an order.)",
        "<strong>2. LEFT JOIN</strong> — all rows from the LEFT table, plus matching rows from the right. NULLs where no match. (All customers, even those without orders.)",
        "<strong>3. RIGHT JOIN</strong> — mirror of LEFT. Rarely used in practice (you can always rewrite as LEFT).",
        "<strong>4. FULL OUTER JOIN</strong> — all rows from both tables, with NULLs where no match. Rare but useful for reconciliation.",
        "<strong>QueryPilot has a visual JOIN Builder (top tabs).</strong> Use it whenever you're unsure — it auto-detects the ON column.",
        "<strong>Beginner mistake:</strong> Forgetting the ON clause produces a <em>Cartesian product</em> — every row matched with every other row. 1,000 customers × 10,000 orders = 10,000,000 rows. Crashes everything."
      ],
      example: "<pre>-- All customers with their total spend (including those with zero orders)\nSELECT c.name, c.email, COALESCE(SUM(o.total), 0) AS total_spent\nFROM customers c                       -- 'c' is an alias for customers\nLEFT JOIN orders o ON c.id = o.customer_id\nGROUP BY c.name, c.email\nORDER BY total_spent DESC;</pre>The LEFT JOIN ensures customers with zero orders still appear (with NULL total → COALESCE converts to 0).",
      tryq: "Join customers and orders to show each customer's total spend",
      quiz: {
        q: "If you want a report showing ALL customers (even those who never ordered) alongside their order totals, which JOIN?",
        a: [
          { t:"INNER JOIN", c:false, why:"INNER JOIN drops customers with no orders." },
          { t:"LEFT JOIN customers ON the left side", c:true, why:"Yes! LEFT keeps all customers; orders may be NULL for those without orders." },
          { t:"FULL OUTER JOIN", c:false, why:"Works but unnecessary — LEFT is cleaner." }
        ]
      },
      takeaway: "JOIN combines tables on a matching column. INNER=both, LEFT=all left + matches, RIGHT=mirror, FULL=both with NULLs. Always specify ON.",
      glossary: [
        { term:"JOIN", def:"Combines rows from two tables based on a matching column value." },
        { term:"Alias", def:"A short nickname for a table or column. <code>customers c</code> lets you write <code>c.name</code>." },
        { term:"Cartesian product", def:"What you get if you JOIN without an ON clause: every row × every other row. Disaster." }
      ]
    },

    { id:"m3.l8", type:"concept", title:"8. Subqueries — queries inside queries", est:"10 min",
      learn: [
        "A <strong>subquery</strong> is a SELECT inside another SELECT. The inner query runs first; the outer query uses its result.",
        "<strong>Use case 1: Filter using a computed value.</strong><pre>SELECT name, total\nFROM orders\nWHERE total &gt; (SELECT AVG(total) FROM orders);</pre>Returns orders above the average order value. The inner query computes AVG; the outer uses it as the comparison.",
        "<strong>Use case 2: Subquery as a temporary table.</strong><pre>SELECT region, top_customers.name\nFROM customers c\nJOIN (\n  SELECT customer_id, SUM(total) AS spent\n  FROM orders\n  GROUP BY customer_id\n  HAVING SUM(total) &gt; 100000\n) top_customers ON c.id = top_customers.customer_id;</pre>The inner query produces 'big spenders'; the outer joins them to customers.",
        "<strong>Use case 3: EXISTS / NOT EXISTS</strong> — check if related rows exist.<pre>SELECT name FROM customers c\nWHERE EXISTS (SELECT 1 FROM orders WHERE customer_id = c.id);</pre>Customers who placed at least one order.",
        "<strong>When to use subqueries vs JOINs vs CTEs:</strong><br>• <strong>Simple filter on aggregate</strong> → subquery in WHERE<br>• <strong>Need to join to derived data</strong> → subquery in FROM, or CTE<br>• <strong>Reusing the same derived data multiple times</strong> → CTE (next lesson)",
        "<strong>QueryPilot has a Subquery Builder</strong> (top tab → Subquery) that helps you compose these visually."
      ],
      example: "<pre>-- Customers who spent more than the average customer\nSELECT c.name, customer_totals.total_spent\nFROM customers c\nJOIN (\n  SELECT customer_id, SUM(total) AS total_spent\n  FROM orders\n  GROUP BY customer_id\n) customer_totals ON c.id = customer_totals.customer_id\nWHERE customer_totals.total_spent &gt; (\n  SELECT AVG(total_per_customer) FROM (\n    SELECT customer_id, SUM(total) AS total_per_customer\n    FROM orders\n    GROUP BY customer_id\n  ) avg_calc\n);</pre>Nested subqueries get hard to read fast — that's why we have CTEs (next lesson).",
      tryq: "Find customers who spent more than the average",
      quiz: {
        q: "What does a subquery in the WHERE clause typically return?",
        a: [
          { t:"A whole table", c:false, why:"A WHERE subquery usually returns a single value for comparison." },
          { t:"A single value used for comparison", c:true, why:"Yes — e.g. WHERE total > (SELECT AVG(total) FROM orders) — the subquery returns one number." },
          { t:"Always returns NULL", c:false }
        ]
      },
      takeaway: "Subqueries are SELECTs inside SELECTs. Use for filtering, derived tables, or existence checks. CTEs are usually clearer.",
      glossary: [
        { term:"Subquery", def:"A SELECT statement nested inside another query." },
        { term:"Correlated subquery", def:"A subquery that references a column from the outer query. Runs once per outer row." }
      ]
    },

    { id:"m3.l9", type:"concept", title:"9. CTEs — readable subqueries", est:"8 min",
      learn: [
        "<strong>CTE = Common Table Expression.</strong> It's a named subquery written at the top of a query, making complex queries readable.",
        "<strong>Syntax:</strong><pre>WITH big_spenders AS (\n  SELECT customer_id, SUM(total) AS spent\n  FROM orders\n  GROUP BY customer_id\n  HAVING SUM(total) &gt; 100000\n)\nSELECT c.name, b.spent\nFROM customers c\nJOIN big_spenders b ON c.id = b.customer_id;</pre>The WITH clause defines <code>big_spenders</code> as a temporary named result. The main query then uses it like any table.",
        "<strong>Multiple CTEs in one query:</strong><pre>WITH big_spenders AS (...),\n     active_customers AS (...)\nSELECT ... FROM big_spenders JOIN active_customers ...;</pre>Comma-separated. Each CTE can reference previous CTEs.",
        "<strong>Why CTEs over subqueries?</strong><br>• <strong>Readable.</strong> Named steps, top-to-bottom logic.<br>• <strong>Reusable.</strong> Reference a CTE multiple times in the main query.<br>• <strong>Debuggable.</strong> Run each CTE separately to inspect intermediate results.",
        "<strong>Recursive CTEs</strong> (advanced) can walk hierarchies — org charts, family trees, file folders. Beyond beginner scope but powerful."
      ],
      example: "<pre>WITH monthly_revenue AS (\n  SELECT\n    EXTRACT(YEAR FROM created_at) AS yr,\n    EXTRACT(MONTH FROM created_at) AS mo,\n    SUM(total) AS revenue\n  FROM orders\n  WHERE status = 'completed'\n  GROUP BY yr, mo\n),\nwith_growth AS (\n  SELECT\n    yr, mo, revenue,\n    LAG(revenue) OVER (ORDER BY yr, mo) AS prev_revenue\n  FROM monthly_revenue\n)\nSELECT\n  yr, mo, revenue,\n  ROUND(100.0 * (revenue - prev_revenue) / prev_revenue, 2) AS growth_pct\nFROM with_growth\nORDER BY yr, mo;</pre>Three steps, top to bottom, each named. Try doing this with nested subqueries — unreadable.",
      tryq: "CTE total sales by department",
      quiz: {
        q: "What's the main advantage of CTEs over nested subqueries?",
        a: [
          { t:"They run faster", c:false, why:"Performance depends on the database engine — usually equivalent." },
          { t:"Better readability and reusability — named, top-to-bottom logic", c:true, why:"Yes! CTEs make complex SQL feel like a recipe instead of a riddle." },
          { t:"They use less memory", c:false }
        ]
      },
      takeaway: "CTEs = named subqueries via WITH. Use them for multi-step, readable, complex queries.",
      glossary: [
        { term:"CTE", def:"Common Table Expression. A named, temporary result defined with WITH at the top of a query." }
      ]
    },

    { id:"m3.l10", type:"concept", title:"10. Window functions — analytics without losing rows", est:"12 min",
      learn: [
        "<strong>Window functions</strong> are SQL's superpower for analytics. They compute aggregates ALONGSIDE each row instead of collapsing rows like GROUP BY.",
        "<strong>The pattern:</strong><pre>function_name() OVER (PARTITION BY ... ORDER BY ...)</pre><code>PARTITION BY</code> = like GROUP BY but doesn't collapse. <code>ORDER BY</code> = ordering within each partition.",
        "<strong>The 5 most useful window functions:</strong>",
        "<strong>1. ROW_NUMBER()</strong> — assigns 1, 2, 3... within each partition. <em>'Number each order per customer in time order.'</em>",
        "<strong>2. RANK() / DENSE_RANK()</strong> — like row number but ties get the same rank. <em>'Rank salespeople by revenue, ties allowed.'</em>",
        "<strong>3. LAG() / LEAD()</strong> — value from the previous / next row in the partition. <em>'Compare this month's revenue to last month's.'</em>",
        "<strong>4. SUM() OVER (...)</strong> — running total. <em>'Cumulative revenue over time.'</em>",
        "<strong>5. AVG() OVER (... ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)</strong> — rolling average. <em>'7-day moving average of daily sales.'</em>",
        "<strong>Mental model:</strong> Window functions look at a 'window' of rows around the current row and compute something. The current row stays put."
      ],
      example: "<pre>-- Rank salespeople by revenue, partitioned by region\nSELECT\n  region,\n  salesperson,\n  revenue,\n  RANK() OVER (PARTITION BY region ORDER BY revenue DESC) AS region_rank,\n  RANK() OVER (ORDER BY revenue DESC) AS overall_rank\nFROM sales_totals\nORDER BY region, region_rank;\n\n-- Month-over-month growth using LAG\nSELECT\n  month,\n  revenue,\n  LAG(revenue) OVER (ORDER BY month) AS prev_month,\n  revenue - LAG(revenue) OVER (ORDER BY month) AS growth\nFROM monthly_summary;\n\n-- 7-day rolling average\nSELECT\n  date,\n  daily_sales,\n  AVG(daily_sales) OVER (\n    ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW\n  ) AS rolling_7day_avg\nFROM daily_metrics;</pre>",
      tryq: "Rank employees by salary using a window function",
      quiz: {
        q: "How is window function aggregation different from GROUP BY?",
        a: [
          { t:"They're the same", c:false },
          { t:"GROUP BY collapses rows; window functions keep all rows and add a computed column", c:true, why:"Yes! Windows give you per-row context (rank, running total, lag) without losing detail." },
          { t:"Window functions only work in PostgreSQL", c:false }
        ]
      },
      takeaway: "Window functions = per-row analytics. PARTITION BY (like GROUP) + ORDER BY (within partition). ROW_NUMBER, RANK, LAG, LEAD, running SUM, rolling AVG.",
      glossary: [
        { term:"Window function", def:"A function computed over a 'window' of related rows, without collapsing them." },
        { term:"PARTITION BY", def:"Like GROUP BY for window functions — defines the boundaries of each window." }
      ]
    },

    { id:"m3.l11", type:"concept", title:"11. CASE WHEN — IF-statements inside SQL", est:"7 min",
      learn: [
        "<code>CASE WHEN</code> is SQL's IF/ELSE. It lets you compute conditional values inline.",
        "<strong>Syntax:</strong><pre>CASE\n  WHEN condition1 THEN value1\n  WHEN condition2 THEN value2\n  ELSE default_value\nEND</pre>Reads top-to-bottom; first matching WHEN wins.",
        "<strong>Use case 1 — Bucket numbers into categories:</strong><pre>SELECT name, age,\n  CASE\n    WHEN age &lt; 18 THEN 'Minor'\n    WHEN age &lt; 35 THEN 'Young Adult'\n    WHEN age &lt; 60 THEN 'Adult'\n    ELSE 'Senior'\n  END AS age_group\nFROM customers;</pre>",
        "<strong>Use case 2 — Pivot rows to columns (poor man's pivot):</strong><pre>SELECT month,\n  SUM(CASE WHEN region = 'Lagos' THEN total ELSE 0 END) AS lagos_revenue,\n  SUM(CASE WHEN region = 'Abuja' THEN total ELSE 0 END) AS abuja_revenue,\n  SUM(CASE WHEN region = 'Kano'  THEN total ELSE 0 END) AS kano_revenue\nFROM orders\nGROUP BY month;</pre>This is exactly what most databases use to emulate Excel-style pivots.",
        "<strong>Tip:</strong> Always include an ELSE clause to avoid NULLs."
      ],
      example: "<pre>-- Customer segmentation by spend\nSELECT\n  c.name,\n  SUM(o.total) AS total_spend,\n  CASE\n    WHEN SUM(o.total) &gt; 1000000 THEN 'VIP'\n    WHEN SUM(o.total) &gt; 100000  THEN 'Premium'\n    WHEN SUM(o.total) &gt; 10000   THEN 'Regular'\n    ELSE 'New'\n  END AS segment\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nGROUP BY c.name;</pre>",
      tryq: "Categorise customers by spend tier",
      quiz: {
        q: "What does CASE WHEN do?",
        a: [
          { t:"Selects which CASE statement to run", c:false },
          { t:"Inline IF/ELSE that computes conditional values per row", c:true, why:"Yes! It's SQL's IF — first matching WHEN wins; ELSE catches everything else." },
          { t:"Changes the case of text (UPPER/LOWER)", c:false }
        ]
      },
      takeaway: "CASE WHEN = SQL's IF/ELSE. Bucket numbers, pivot rows, segment customers. Always include ELSE.",
      glossary: [
        { term:"CASE expression", def:"SQL's conditional expression. Evaluates WHEN clauses in order, returns the THEN value of the first match." }
      ]
    },

    { id:"m3.l12", type:"concept", title:"12. NULL handling — the silent destroyer", est:"8 min",
      learn: [
        "<strong>NULL is SQL's way of saying 'unknown' or 'missing'.</strong> It is NOT zero. It is NOT empty string. It is a special value with special rules.",
        "<strong>Rule 1: NULL is contagious.</strong> Any arithmetic with NULL returns NULL. <code>5 + NULL = NULL</code>. <code>NULL = NULL</code> returns NULL, not TRUE!",
        "<strong>Rule 2: Use IS NULL / IS NOT NULL to test for NULL.</strong> Never use <code>= NULL</code> — it always returns NULL (which behaves like FALSE).",
        "<strong>Rule 3: Aggregates ignore NULL.</strong> <code>AVG(salary)</code> averages only non-NULL salaries. <code>COUNT(salary)</code> counts only non-NULL rows.",
        "<strong>4 NULL-handling tools:</strong>",
        "<strong>COALESCE(col, default)</strong> — returns the first non-NULL value. <code>COALESCE(phone, 'no phone')</code>.",
        "<strong>NULLIF(a, b)</strong> — returns NULL if a equals b, else a. Useful for preventing division by zero: <code>x / NULLIF(y, 0)</code>.",
        "<strong>IFNULL(col, default)</strong> / <strong>ISNULL(col, default)</strong> — MySQL / SQL Server flavours of COALESCE.",
        "<strong>CASE WHEN col IS NULL THEN ...</strong> — explicit handling."
      ],
      example: "<pre>-- Average salary, treating NULL as 0 (usually a bad idea)\nSELECT AVG(COALESCE(salary, 0)) FROM employees;\n\n-- Customers without an email\nSELECT name FROM customers WHERE email IS NULL;\n\n-- Safe division (avoid divide-by-zero)\nSELECT product, revenue / NULLIF(units_sold, 0) AS unit_revenue\nFROM products;</pre>",
      tryq: "Find customers with missing email",
      quiz: {
        q: "Does WHERE email = NULL find rows where email is missing?",
        a: [
          { t:"Yes, that's the standard syntax", c:false, why:"No! email = NULL always evaluates to NULL (effectively FALSE)." },
          { t:"No — you must use WHERE email IS NULL", c:true, why:"Correct! NULL comparisons need IS NULL / IS NOT NULL, never = or !=." }
        ]
      },
      takeaway: "NULL = unknown. Contagious in arithmetic. Use IS NULL not =NULL. COALESCE replaces NULL with a default.",
      glossary: [
        { term:"NULL", def:"SQL's special 'unknown / missing' value. Distinct from 0, empty string, or FALSE." },
        { term:"COALESCE", def:"Returns the first non-NULL argument. COALESCE(NULL, NULL, 5) returns 5." }
      ]
    },

    { id:"m3.l13", type:"concept", title:"13. INSERT, UPDATE, DELETE — modifying data", est:"8 min",
      learn: [
        "Until now we've only READ data. <strong>DML (Data Manipulation Language)</strong> writes data: INSERT (add rows), UPDATE (change rows), DELETE (remove rows).",
        "<strong>INSERT:</strong><pre>INSERT INTO customers (name, email, region)\nVALUES ('Adewale', 'a@example.com', 'Lagos');\n\n-- Multiple rows at once\nINSERT INTO products (name, price) VALUES\n  ('Jollof', 1200),\n  ('Eba',     800),\n  ('Suya',   2000);</pre>",
        "<strong>UPDATE:</strong><pre>UPDATE customers\nSET status = 'inactive'\nWHERE last_login &lt; '2025-01-01';</pre><strong>DANGER:</strong> <code>UPDATE customers SET status = 'inactive';</code> (no WHERE) updates EVERY ROW. Always WHERE-first when writing UPDATEs.",
        "<strong>DELETE:</strong><pre>DELETE FROM orders\nWHERE created_at &lt; '2020-01-01';</pre><strong>DANGER:</strong> <code>DELETE FROM orders;</code> (no WHERE) deletes EVERY ROW. QueryPilot v8's governance blocks this automatically.",
        "<strong>Safety practices:</strong><br>• Always test the WHERE clause first as a SELECT: <em>does it return the rows I expect?</em> Then convert SELECT to UPDATE/DELETE.<br>• Use transactions: <code>BEGIN; ... ROLLBACK;</code> if unsure.<br>• Take a backup before bulk operations.<br>• In production, prefer 'soft delete' (a <code>deleted_at</code> column) over actual DELETE."
      ],
      example: "<pre>-- THE GOLDEN PRE-UPDATE/DELETE HABIT:\n\n-- Step 1: Run as SELECT to see what you're about to touch\nSELECT * FROM customers\nWHERE region = 'Wakanda' AND created_at &lt; '2020-01-01';\n\n-- Step 2: ONLY if the rows look right, convert to UPDATE/DELETE\nUPDATE customers\nSET status = 'archived'\nWHERE region = 'Wakanda' AND created_at &lt; '2020-01-01';</pre>",
      tryq: "Update customer status to inactive",
      quiz: {
        q: "What does this do? <code>DELETE FROM orders;</code>",
        a: [
          { t:"Deletes all rows from orders", c:true, why:"Yes — and that's almost certainly a disaster. ALWAYS use WHERE when deleting." },
          { t:"Deletes the orders table itself", c:false, why:"That would be DROP TABLE." },
          { t:"Asks for confirmation first", c:false, why:"SQL never asks. It assumes you mean what you say." }
        ]
      },
      takeaway: "INSERT adds, UPDATE changes, DELETE removes. ALWAYS include WHERE. Test as SELECT first.",
      glossary: [
        { term:"DML", def:"Data Manipulation Language: INSERT, UPDATE, DELETE." },
        { term:"DDL", def:"Data Definition Language: CREATE, ALTER, DROP tables/columns." },
        { term:"Transaction", def:"A group of writes that succeed or fail together. BEGIN...COMMIT or BEGIN...ROLLBACK." }
      ]
    },

    { id:"m3.l14", type:"concept", title:"14. Dates and times — calendar arithmetic", est:"10 min",
      learn: [
        "Dates have their own rules. Get them right, and time-based analysis becomes easy.",
        "<strong>The 4 essential date functions:</strong>",
        "<strong>1. CURRENT_DATE / CURRENT_TIMESTAMP</strong> — right now.",
        "<strong>2. EXTRACT(part FROM date)</strong> — get year, month, day, hour, dow (day-of-week).<br>e.g. <code>EXTRACT(MONTH FROM created_at)</code>",
        "<strong>3. DATE_TRUNC(part, date)</strong> — round down to nearest month/week/day.<br>e.g. <code>DATE_TRUNC('month', created_at)</code> turns 2026-01-15 into 2026-01-01.",
        "<strong>4. Date arithmetic</strong> — add/subtract intervals.<br>PostgreSQL: <code>created_at + INTERVAL '7 days'</code><br>MySQL: <code>created_at + INTERVAL 7 DAY</code><br>SQLite: <code>date(created_at, '+7 days')</code>",
        "<strong>Common date patterns:</strong>",
        "<strong>Last 30 days:</strong> <code>WHERE created_at &gt;= CURRENT_DATE - INTERVAL '30 days'</code>",
        "<strong>This month:</strong> <code>WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)</code>",
        "<strong>This year so far (YTD):</strong> <code>WHERE created_at &gt;= DATE_TRUNC('year', CURRENT_DATE)</code>",
        "<strong>Days between two dates:</strong> <code>created_at - shipped_at</code> (returns interval).",
        "<strong>Dialect warning:</strong> date syntax varies across PostgreSQL, MySQL, SQLite, SQL Server, BigQuery. QueryPilot adapts to your selected dialect."
      ],
      example: "<pre>-- Monthly revenue trend for the last 12 months\nSELECT\n  DATE_TRUNC('month', created_at) AS month,\n  SUM(total) AS revenue,\n  COUNT(*) AS order_count\nFROM orders\nWHERE created_at &gt;= CURRENT_DATE - INTERVAL '12 months'\nGROUP BY DATE_TRUNC('month', created_at)\nORDER BY month;\n\n-- Average days from order to shipment\nSELECT AVG(shipped_at - created_at) AS avg_fulfilment_days\nFROM orders\nWHERE shipped_at IS NOT NULL;</pre>",
      tryq: "Orders in the last 30 days",
      quiz: {
        q: "What does DATE_TRUNC('month', '2026-01-15') return?",
        a: [
          { t:"'2026-01-15'", c:false },
          { t:"'2026-01-01' — rounded down to start of month", c:true, why:"Yes! DATE_TRUNC zeros out everything below the specified unit." },
          { t:"'01'", c:false }
        ]
      },
      takeaway: "EXTRACT (get part), DATE_TRUNC (round down), CURRENT_DATE (now), INTERVAL (arithmetic). Watch dialect differences.",
      glossary: [
        { term:"DATE_TRUNC", def:"Rounds a timestamp down to a specified unit (year, month, day, hour)." },
        { term:"INTERVAL", def:"A duration. '7 days', '3 months', '1 year 2 months'." }
      ]
    },

    { id:"m3.l15", type:"concept", title:"15. UNION & INTERSECT — combining result sets", est:"7 min",
      learn: [
        "JOINs combine tables horizontally (matching by a key). <strong>UNION</strong> combines result sets vertically (stacking rows).",
        "<strong>UNION:</strong><pre>SELECT name FROM customers WHERE region = 'Lagos'\nUNION\nSELECT name FROM employees WHERE region = 'Lagos';</pre>Returns one combined list. <strong>UNION removes duplicates</strong>; <strong>UNION ALL keeps them</strong> (and is faster).",
        "<strong>Rules:</strong><br>• Both SELECTs must have the SAME NUMBER OF COLUMNS.<br>• Column types must match.<br>• Column names of the first SELECT become the output column names.",
        "<strong>INTERSECT</strong> — rows that appear in BOTH SELECTs.<pre>SELECT email FROM customers\nINTERSECT\nSELECT email FROM newsletter_subscribers;</pre>",
        "<strong>EXCEPT</strong> (MINUS in Oracle) — rows in the first SELECT but NOT in the second.<pre>SELECT email FROM customers\nEXCEPT\nSELECT email FROM newsletter_subscribers;</pre>Find customers not subscribed to the newsletter.",
        "<strong>Performance tip:</strong> Use <code>UNION ALL</code> unless you specifically need deduplication. UNION's hidden dedup is expensive."
      ],
      example: "<pre>-- All people connected to our organisation (customers + employees + vendors)\nSELECT name, 'customer' AS type, email FROM customers\nUNION ALL\nSELECT name, 'employee' AS type, email FROM employees\nUNION ALL\nSELECT contact_name AS name, 'vendor' AS type, contact_email AS email FROM vendors\nORDER BY type, name;</pre>",
      tryq: "Combine customers and employees lists",
      quiz: {
        q: "What's the practical difference between UNION and UNION ALL?",
        a: [
          { t:"UNION ALL removes duplicates; UNION keeps them", c:false, why:"It's the opposite." },
          { t:"UNION removes duplicates (slower); UNION ALL keeps them (faster)", c:true, why:"Yes! Prefer UNION ALL unless you need dedup." },
          { t:"They're identical", c:false }
        ]
      },
      takeaway: "UNION stacks rows. UNION ALL keeps duplicates (faster). INTERSECT = both. EXCEPT = first not in second.",
      glossary: [
        { term:"UNION", def:"Combines results of two SELECTs by stacking rows. Removes duplicates." },
        { term:"UNION ALL", def:"Like UNION but keeps duplicates. Faster." }
      ]
    },

    { id:"m3.l16", type:"concept", title:"16. Indexes — making queries fast", est:"10 min",
      learn: [
        "An <strong>index</strong> is a data structure that lets the database find rows quickly without scanning every row. Like the index at the back of a book.",
        "<strong>Without an index:</strong> Finding 'Adewale' among 10 million customers means reading every row. Slow.",
        "<strong>With an index on name:</strong> The database jumps directly to 'A...Adewale...' Fast.",
        "<strong>Create an index:</strong><pre>CREATE INDEX idx_customers_email ON customers(email);</pre>Now <code>WHERE email = 'x@y.z'</code> uses the index instead of a full scan.",
        "<strong>When to add indexes:</strong><br>• Columns used in WHERE clauses (high-selectivity)<br>• Columns used in JOIN ON clauses<br>• Columns used for ORDER BY (avoids sort)<br>• Foreign key columns (almost always)",
        "<strong>When NOT to add indexes:</strong><br>• Small tables (&lt;1000 rows) — overhead exceeds benefit<br>• Columns rarely filtered<br>• Columns with very few distinct values (e.g. boolean) — indexes help less<br>• Tables with very heavy INSERT/UPDATE — indexes slow writes",
        "<strong>The cost of indexes:</strong> They take disk space and slow down writes (every INSERT must update every index). Don't over-index.",
        "<strong>Composite indexes:</strong> <code>CREATE INDEX idx ON orders(customer_id, created_at);</code> — speeds up queries filtering on both columns OR filtering on customer_id alone (leftmost prefix rule)."
      ],
      example: "<pre>-- Typical indexes for an orders table\nCREATE INDEX idx_orders_customer ON orders(customer_id);    -- FK\nCREATE INDEX idx_orders_status   ON orders(status);          -- filter\nCREATE INDEX idx_orders_date     ON orders(created_at);      -- range queries\nCREATE INDEX idx_orders_status_date ON orders(status, created_at);  -- composite</pre>",
      tryq: "Show me a query that would benefit from an index",
      quiz: {
        q: "Which is the BEST candidate for an index?",
        a: [
          { t:"A boolean column (is_active TRUE/FALSE)", c:false, why:"Low cardinality — index helps less." },
          { t:"customer_id used in many JOIN ON clauses", c:true, why:"Yes! JOIN-ON columns are textbook index candidates." },
          { t:"A timestamp column that's never filtered", c:false, why:"Unused for filtering = no benefit." }
        ]
      },
      takeaway: "Indexes speed reads, slow writes. Add to WHERE / JOIN / FK columns. Don't index everything.",
      glossary: [
        { term:"Index", def:"A data structure (usually a B-tree) that lets the database find rows by a column quickly." },
        { term:"Full table scan", def:"Reading every row to find matches. Slow on big tables. What an index avoids." }
      ]
    },

    { id:"m3.l17", type:"concept", title:"17. Query performance — reading EXPLAIN plans", est:"12 min",
      learn: [
        "When a query is slow, the database can SHOW you what it's doing. The tool is <code>EXPLAIN</code> (in PostgreSQL / SQL Server) or <code>EXPLAIN ANALYZE</code> (with actual timing).",
        "<pre>EXPLAIN SELECT * FROM orders WHERE customer_id = 42;</pre>",
        "<strong>What to look for:</strong>",
        "<strong>1. 'Seq Scan' or 'Full Table Scan'</strong> — reading every row. Slow on big tables. Add an index on the WHERE column.",
        "<strong>2. 'Index Scan' / 'Index Seek'</strong> — using an index. Good.",
        "<strong>3. 'Hash Join' vs 'Nested Loop'</strong> — different JOIN strategies. The database picks; usually correct, sometimes wrong.",
        "<strong>4. 'Sort'</strong> — sorting rows. If ORDER BY is on an indexed column, sort can be avoided.",
        "<strong>5. 'Rows' estimate</strong> — how many rows each step processes. Big numbers = expensive.",
        "<strong>5 quick wins for slow queries:</strong>",
        "<strong>a) Add a WHERE clause</strong> if you don't need all rows.",
        "<strong>b) Add an index</strong> on WHERE / JOIN / ORDER columns (Lesson 16).",
        "<strong>c) SELECT only needed columns</strong> instead of <code>*</code>.",
        "<strong>d) LIMIT</strong> if you only need top N.",
        "<strong>e) Avoid functions on indexed columns</strong> — <code>WHERE UPPER(email) = 'A@B'</code> breaks index use. Store / compare in consistent case.",
        "<strong>QueryPilot has a Performance Tips tool</strong> (Tools → Performance Tips) that scans any SQL and flags these issues automatically."
      ],
      example: "<pre>-- SLOW:\nSELECT * FROM orders WHERE EXTRACT(YEAR FROM created_at) = 2026;\n-- The EXTRACT() function on every row prevents index use.\n\n-- FAST equivalent:\nSELECT * FROM orders\nWHERE created_at &gt;= '2026-01-01'\n  AND created_at &lt;  '2027-01-01';\n-- Range query uses an index on created_at.</pre>",
      tryq: "Tools → Performance Tips with: SELECT * FROM orders WHERE UPPER(email) = 'X@Y.Z'",
      quiz: {
        q: "Why is WHERE UPPER(email) = 'X@Y' slow even with an index on email?",
        a: [
          { t:"UPPER is broken", c:false },
          { t:"The function call prevents the index from being used; database scans every row", c:true, why:"Yes! Functions on indexed columns kill index use. Store data in consistent case." },
          { t:"= comparisons are always slow", c:false }
        ]
      },
      takeaway: "EXPLAIN reveals the plan. Avoid full scans, functions on indexed columns. Use LIMIT, indexes, narrow SELECT.",
      glossary: [
        { term:"EXPLAIN", def:"A command that shows the database's execution plan for a query without running it." },
        { term:"Seq Scan", def:"Sequential scan: reading every row. Slow on big tables." }
      ]
    },

    // 8 NEW advanced lessons
    { id:"m3.l18", type:"concept", title:"18. Common Table Expressions — recursive CTEs for hierarchies", est:"12 min",
      learn: [
        "<strong>Recursive CTEs</strong> let SQL walk hierarchical / tree-shaped data. Org charts, family trees, file folders, supply chains — anything where a row references another row in the same table.",
        "<strong>Pattern:</strong><pre>WITH RECURSIVE name AS (\n  -- ANCHOR: starting rows (e.g. root nodes)\n  SELECT id, name, manager_id, 1 AS depth\n  FROM employees WHERE manager_id IS NULL\n\n  UNION ALL\n\n  -- RECURSIVE STEP: rows referencing previous level\n  SELECT e.id, e.name, e.manager_id, parent.depth + 1\n  FROM employees e\n  JOIN name parent ON e.manager_id = parent.id\n)\nSELECT * FROM name;</pre>",
        "<strong>What's happening:</strong> The anchor finds the CEO (no manager). The recursive step finds people whose manager is in the previous level. Repeat until no more matches.",
        "<strong>Use cases:</strong><br>• Org chart depth<br>• Folder structure / file paths<br>• Parts explosion (a product made of parts, which are made of sub-parts)<br>• Following referral chains<br>• Connected components in graphs",
        "<strong>Safety:</strong> Always have a way for the recursion to terminate. Otherwise infinite loops. Most DBs cap recursion depth automatically."
      ],
      example: "<pre>-- Find all subordinates (direct + indirect) of employee #42\nWITH RECURSIVE subordinates AS (\n  SELECT id, name, manager_id, 1 AS level\n  FROM employees\n  WHERE manager_id = 42\n\n  UNION ALL\n\n  SELECT e.id, e.name, e.manager_id, s.level + 1\n  FROM employees e\n  JOIN subordinates s ON e.manager_id = s.id\n)\nSELECT * FROM subordinates ORDER BY level, name;</pre>",
      tryq: "Recursive CTE to walk an org chart",
      quiz: {
        q: "What's the role of the UNION ALL in a recursive CTE?",
        a: [
          { t:"Removes duplicates", c:false },
          { t:"Combines the anchor (base case) with the recursive step", c:true, why:"Yes! Anchor establishes starting rows; recursive step grows by joining back." },
          { t:"Optional decoration", c:false }
        ]
      },
      takeaway: "Recursive CTEs walk hierarchies. Anchor + UNION ALL + recursive step. Use for org charts, trees, graphs.",
      glossary: [
        { term:"Recursive CTE", def:"A CTE that references itself to walk hierarchical data." }
      ]
    },

    { id:"m3.l19", type:"concept", title:"19. JSON in SQL — querying nested data", est:"10 min",
      learn: [
        "Modern databases (PostgreSQL, MySQL 5.7+, SQL Server 2016+) can store and query <strong>JSON</strong> columns. Useful when data is semi-structured (varying fields per row).",
        "<strong>Storing JSON:</strong> Column type is <code>JSONB</code> (PostgreSQL — binary, indexed) or <code>JSON</code> (others).",
        "<pre>CREATE TABLE events (id INTEGER, payload JSONB);\nINSERT INTO events VALUES (1, '{\"user\":\"adewale\",\"action\":\"login\",\"ip\":\"102.89.x\"}');</pre>",
        "<strong>Querying JSON (PostgreSQL syntax):</strong><br>• <code>payload-&gt;'user'</code> returns the value as JSON<br>• <code>payload-&gt;&gt;'user'</code> returns as text<br>• <code>payload-&gt;'meta'-&gt;&gt;'country'</code> nested access",
        "<pre>-- All login events from Nigerian IPs\nSELECT id, payload-&gt;&gt;'user' AS username\nFROM events\nWHERE payload-&gt;&gt;'action' = 'login'\n  AND payload-&gt;&gt;'country' = 'NG';</pre>",
        "<strong>MySQL syntax:</strong> <code>JSON_EXTRACT(payload, '$.user')</code> or <code>payload-&gt;'$.user'</code>",
        "<strong>Indexing JSON:</strong> Create indexes on specific JSON paths (PG GIN index, MySQL functional index).",
        "<strong>When to use JSON columns:</strong> Schemaless attributes that vary per row, audit logs, user-defined fields. <strong>When NOT to:</strong> if every row has the same fields — use regular columns (faster, simpler)."
      ],
      example: "<pre>-- Survey responses (every survey has different questions)\nCREATE TABLE responses (\n  id SERIAL PRIMARY KEY,\n  user_id INTEGER,\n  answers JSONB\n);\nINSERT INTO responses VALUES (DEFAULT, 1, '{\"age\":25,\"city\":\"Lagos\",\"satisfied\":true}');\n\n-- Average age of satisfied users in Lagos\nSELECT AVG((answers-&gt;&gt;'age')::INTEGER) AS avg_age\nFROM responses\nWHERE answers-&gt;&gt;'city' = 'Lagos'\n  AND (answers-&gt;&gt;'satisfied')::BOOLEAN = TRUE;</pre>",
      tryq: "Query a JSON column for user actions",
      quiz: {
        q: "When is a JSONB column a good choice over regular columns?",
        a: [
          { t:"Always — it's more flexible", c:false, why:"More flexibility = slower queries, less validation." },
          { t:"When the structure varies per row (schemaless attributes)", c:true, why:"Yes! Use JSONB for genuinely variable structures, not for everyday columns." },
          { t:"Never, regular columns are always better", c:false }
        ]
      },
      takeaway: "JSONB stores semi-structured data. Use -> and ->> to extract. Don't replace regular columns — use only when schema truly varies.",
      glossary: [
        { term:"JSONB", def:"PostgreSQL's binary JSON type. Indexed, queryable, fast." }
      ]
    },

    { id:"m3.l20", type:"concept", title:"20. Transactions & ACID", est:"10 min",
      learn: [
        "A <strong>transaction</strong> is a group of SQL statements that succeed or fail together. The classic example: transferring money between two bank accounts — debit ONE without crediting the OTHER is a disaster.",
        "<pre>BEGIN;  -- start transaction\nUPDATE accounts SET balance = balance - 5000 WHERE id = 1;\nUPDATE accounts SET balance = balance + 5000 WHERE id = 2;\nCOMMIT;  -- both succeed atomically</pre>If anything fails between BEGIN and COMMIT: <code>ROLLBACK;</code> undoes everything.",
        "<strong>ACID</strong> — the four properties databases guarantee for transactions:",
        "<strong>A — Atomicity.</strong> All-or-nothing. Either every statement in the transaction commits, or none does.",
        "<strong>C — Consistency.</strong> The database moves from one valid state to another. Constraints (FKs, NOT NULL, CHECK) are never violated.",
        "<strong>I — Isolation.</strong> Concurrent transactions don't interfere. Two users can't both withdraw the last ₦100 from an account.",
        "<strong>D — Durability.</strong> Once committed, the change survives crashes (written to disk).",
        "<strong>Isolation levels</strong> (most → least strict): SERIALIZABLE, REPEATABLE READ, READ COMMITTED (default in most DBs), READ UNCOMMITTED. Stricter = slower but safer.",
        "<strong>Practical tip:</strong> Wrap multi-statement business operations in transactions. Always. Even a 'transfer ₦100, then log the transfer' is two statements that must succeed together."
      ],
      example: "<pre>-- Refund + audit log, atomically\nBEGIN;\n\nUPDATE orders SET status = 'refunded'\n  WHERE id = 1234;\n\nINSERT INTO audit_log (action, ref_id, actor, ts)\n  VALUES ('refund', 1234, 'admin', NOW());\n\nUPDATE accounts SET balance = balance + 5000\n  WHERE customer_id = (SELECT customer_id FROM orders WHERE id = 1234);\n\nCOMMIT;</pre>If the bank credit fails, ROLLBACK undoes the status change AND the audit log entry.",
      tryq: "Wrap two updates in a transaction",
      quiz: {
        q: "If a transaction with 5 statements fails on statement 3, what happens by default?",
        a: [
          { t:"Statements 1-2 are kept, 3-5 are skipped", c:false },
          { t:"All 5 statements are rolled back (atomicity)", c:true, why:"Yes! Atomicity = all-or-nothing. Either all 5 commit or none do." },
          { t:"The database asks for user input", c:false }
        ]
      },
      takeaway: "BEGIN ... COMMIT (or ROLLBACK). ACID = Atomicity, Consistency, Isolation, Durability. Wrap multi-step business operations.",
      glossary: [
        { term:"Transaction", def:"A group of SQL statements treated as one atomic unit." },
        { term:"ACID", def:"Atomicity, Consistency, Isolation, Durability — the database's transaction guarantees." }
      ]
    },

    { id:"m3.l21", type:"concept", title:"21. Views & materialised views", est:"8 min",
      learn: [
        "A <strong>VIEW</strong> is a saved SELECT query that you can use like a table.",
        "<pre>CREATE VIEW active_customers AS\nSELECT * FROM customers WHERE status = 'active';\n\n-- Use it like a table\nSELECT name FROM active_customers WHERE region = 'Lagos';</pre>",
        "<strong>Why views?</strong><br>• <strong>Hide complexity.</strong> Wrap a complex JOIN in a view; analysts query the simple view.<br>• <strong>Enforce filters.</strong> Hide soft-deleted rows. Apply RBAC by exposing only certain columns/rows.<br>• <strong>Single source of truth.</strong> 'Active customer' is defined in ONE place.",
        "<strong>Regular views</strong> = no data stored. Query runs every time. Always fresh, can be slow.",
        "<strong>Materialised views</strong> = computed and stored. Fast reads but data is 'frozen' until you <code>REFRESH MATERIALIZED VIEW</code>. Great for expensive aggregates that don't need to be perfectly fresh (e.g. yesterday's revenue rollup, refreshed nightly).",
        "<strong>Trade-off:</strong> Regular view = fresh + slow. Materialised view = stale + fast."
      ],
      example: "<pre>-- Regular view: complex query as a virtual table\nCREATE VIEW customer_summary AS\nSELECT\n  c.id, c.name, c.region,\n  COUNT(o.id) AS total_orders,\n  COALESCE(SUM(o.total), 0) AS total_spent,\n  MAX(o.created_at) AS last_order_date\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nGROUP BY c.id, c.name, c.region;\n\n-- Use it\nSELECT * FROM customer_summary WHERE total_spent &gt; 50000;\n\n-- Materialised version (PostgreSQL)\nCREATE MATERIALIZED VIEW customer_summary_mv AS\nSELECT ... [same query] ...;\n\n-- Refresh nightly via cron\nREFRESH MATERIALIZED VIEW customer_summary_mv;</pre>",
      tryq: "Create a view for active customers",
      quiz: {
        q: "When should you use a materialised view over a regular view?",
        a: [
          { t:"Always — they're faster", c:false, why:"Materialised views go stale. If data must be live, don't use them." },
          { t:"For expensive aggregates that don't need real-time freshness", c:true, why:"Yes — e.g. dashboards refreshed nightly. Trade staleness for speed." },
          { t:"Never — they're a security risk", c:false }
        ]
      },
      takeaway: "Views save queries as virtual tables. Hide complexity, enforce filters. Materialised views = fast but stale; refresh on a schedule.",
      glossary: [
        { term:"VIEW", def:"A saved SELECT query usable as a table. Recomputed on every query." },
        { term:"Materialised view", def:"A view whose results are precomputed and stored. Fast but needs refreshing." }
      ]
    },

    { id:"m3.l22", type:"concept", title:"22. Stored procedures — saved logic on the server", est:"9 min",
      learn: [
        "A <strong>stored procedure</strong> is a named block of SQL stored in the database, callable by name with parameters. Like a function for SQL.",
        "<strong>PostgreSQL example:</strong><pre>CREATE OR REPLACE FUNCTION get_customer_revenue(c_id INTEGER)\nRETURNS NUMERIC AS $$\n  SELECT COALESCE(SUM(total), 0)\n  FROM orders\n  WHERE customer_id = c_id\n    AND status = 'completed';\n$$ LANGUAGE SQL;\n\n-- Call it\nSELECT get_customer_revenue(42);</pre>",
        "<strong>MySQL syntax (different):</strong><pre>DELIMITER //\nCREATE PROCEDURE get_revenue(IN c_id INT, OUT total DECIMAL(10,2))\nBEGIN\n  SELECT COALESCE(SUM(total), 0) INTO total\n  FROM orders WHERE customer_id = c_id;\nEND //\nDELIMITER ;</pre>",
        "<strong>Why use stored procedures?</strong><br>• Centralise logic in the database (apps in any language can call them).<br>• Hide table structure (security + abstraction).<br>• Reduce network round-trips (one call instead of many).<br>• Database can optimise repeated execution.",
        "<strong>Drawbacks:</strong><br>• Logic split between app and DB (debugging harder).<br>• Different syntax per dialect (poor portability).<br>• Version control is awkward (must store DDL alongside app code).",
        "<strong>QueryPilot's Stored Procedure Generator tool</strong> (Tools tab) writes the boilerplate for MySQL / PostgreSQL / SQL Server / Oracle automatically."
      ],
      example: "<pre>-- A reusable revenue calculator with options\nCREATE OR REPLACE FUNCTION get_revenue(\n  p_customer_id INTEGER,\n  p_status_filter VARCHAR DEFAULT 'completed',\n  p_since DATE DEFAULT '2020-01-01'\n) RETURNS NUMERIC AS $$\n  SELECT COALESCE(SUM(total), 0)\n  FROM orders\n  WHERE customer_id = p_customer_id\n    AND status = p_status_filter\n    AND created_at &gt;= p_since;\n$$ LANGUAGE SQL;\n\n-- Usage variants\nSELECT get_revenue(42);                              -- defaults\nSELECT get_revenue(42, 'pending');                   -- different status\nSELECT get_revenue(42, 'completed', '2026-01-01');   -- since this year</pre>",
      tryq: "Tools → Stored Procedure Generator — pick a table",
      quiz: {
        q: "What's a stored procedure good for?",
        a: [
          { t:"Storing photos in the database", c:false },
          { t:"Reusable SQL logic callable by name with parameters", c:true, why:"Yes — like a function for SQL, centralising business logic in the database." },
          { t:"Replacing all application code", c:false }
        ]
      },
      takeaway: "Stored procedures = named, parameterised SQL functions. Centralise logic, but split between app/DB. Use QueryPilot's tool for boilerplate.",
      glossary: [
        { term:"Stored procedure", def:"A named block of SQL stored in the database, callable with parameters." },
        { term:"Function (SQL)", def:"Similar to stored procedure but returns a value. Both have dialect-specific syntax." }
      ]
    },

    { id:"m3.l23", type:"concept", title:"23. Pivoting & unpivoting in SQL", est:"10 min",
      learn: [
        "<strong>Pivoting</strong> turns rows into columns. <strong>Unpivoting</strong> turns columns into rows. Both are essential reshaping operations.",
        "<strong>Pivoting with CASE WHEN (universal):</strong><pre>SELECT\n  region,\n  SUM(CASE WHEN status='completed' THEN total ELSE 0 END) AS completed_revenue,\n  SUM(CASE WHEN status='pending'   THEN total ELSE 0 END) AS pending_revenue,\n  SUM(CASE WHEN status='cancelled' THEN total ELSE 0 END) AS cancelled_revenue\nFROM orders\nGROUP BY region;</pre>",
        "<strong>Dialect-specific PIVOT (SQL Server, Oracle):</strong><pre>SELECT region, [completed], [pending], [cancelled]\nFROM (SELECT region, status, total FROM orders) src\nPIVOT (SUM(total) FOR status IN ([completed], [pending], [cancelled])) p;</pre>",
        "<strong>Unpivoting with UNION ALL (universal):</strong><pre>-- Wide → Long\nSELECT region, 'jan' AS month, jan AS amount FROM monthly UNION ALL\nSELECT region, 'feb', feb FROM monthly UNION ALL\nSELECT region, 'mar', mar FROM monthly;</pre>",
        "<strong>When to pivot:</strong> Reports for humans (executives like wide tables: region × month).",
        "<strong>When to unpivot:</strong> Feeding into ML or charts (tools like ggplot, Pandas prefer long/tidy format).",
        "<strong>QueryPilot recognises 'pivot' as a natural-language pattern</strong> — try 'pivot revenue by month' in the chat."
      ],
      example: "<pre>-- Pivot: orders count per region per month (compact 12-column table)\nSELECT region,\n  COUNT(CASE WHEN EXTRACT(MONTH FROM created_at)=1  THEN 1 END) AS jan,\n  COUNT(CASE WHEN EXTRACT(MONTH FROM created_at)=2  THEN 1 END) AS feb,\n  COUNT(CASE WHEN EXTRACT(MONTH FROM created_at)=3  THEN 1 END) AS mar\nFROM orders\nWHERE EXTRACT(YEAR FROM created_at) = 2026\nGROUP BY region;</pre>",
      tryq: "Pivot revenue by month",
      quiz: {
        q: "Why does Module 2 say 'tidy data has variables as columns' but pivot tables seem to put values as columns?",
        a: [
          { t:"Tidy is wrong", c:false },
          { t:"Tidy is for analysis tools (ML, charts); pivots are for human reading", c:true, why:"Yes! Different formats for different audiences. Convert with PIVOT / UNPIVOT as needed." },
          { t:"Pivot tables are obsolete", c:false }
        ]
      },
      takeaway: "Pivot = rows→columns (use CASE WHEN, universal). Unpivot = columns→rows (UNION ALL or UNPIVOT). Pivot for humans, unpivot for tools.",
      glossary: [
        { term:"Pivot", def:"Reshaping data so categorical values become columns." },
        { term:"Unpivot / melt", def:"Reverse of pivot — turn columns into rows." }
      ]
    },

    { id:"m3.l24", type:"concept", title:"24. SQL anti-patterns — common mistakes", est:"10 min",
      learn: [
        "Some SQL patterns work but cause subtle bugs, security holes, or performance disasters. Here are the <strong>10 anti-patterns every beginner makes (and you can now avoid)</strong>.",
        "<strong>1. <code>SELECT *</code> in production code.</strong> Breaks when columns are added/removed. List columns explicitly.",
        "<strong>2. Forgetting WHERE on UPDATE/DELETE.</strong> Wipes the entire table. Always test as SELECT first.",
        "<strong>3. Using <code>=</code> with NULL.</strong> Always returns NULL (falsy). Use <code>IS NULL</code>.",
        "<strong>4. <code>NOT IN</code> with NULLs.</strong> Returns no rows if any inner-query row is NULL. Use <code>NOT EXISTS</code>.",
        "<strong>5. Implicit JOINs (Cartesian product).</strong> <code>FROM customers, orders</code> without ON = millions of rows. Always use explicit JOIN ... ON.",
        "<strong>6. Function on indexed column.</strong> <code>WHERE UPPER(email) = ...</code> kills index use. Store / compare consistently.",
        "<strong>7. SQL injection.</strong> Building queries by string concatenation: <code>\"SELECT * WHERE id = \" + user_input</code>. ALWAYS use parameterised queries.",
        "<strong>8. SELECT in a loop.</strong> <code>for customer in customers: SELECT orders WHERE customer_id = X</code>. 1,000 queries instead of one JOIN. Classic N+1 problem.",
        "<strong>9. GROUP BY confusion.</strong> Including non-aggregated, non-grouped columns. Most databases reject; MySQL silently picks one (worst).",
        "<strong>10. Storing CSVs in cells.</strong> <code>tags = 'red,green,blue'</code> in one column. Cannot query effectively. Normalise into a separate table.",
        "<strong>QueryPilot's Linter (Enterprise tab) catches 50+ such issues automatically.</strong>"
      ],
      example: "<pre>-- ANTI-PATTERN: NOT IN with possible NULLs\nSELECT * FROM customers\nWHERE id NOT IN (SELECT customer_id FROM orders); -- WRONG if any customer_id is NULL\n\n-- FIX: NOT EXISTS\nSELECT * FROM customers c\nWHERE NOT EXISTS (\n  SELECT 1 FROM orders WHERE customer_id = c.id\n);</pre>",
      tryq: "Enterprise → Linter — paste any query to scan for anti-patterns",
      quiz: {
        q: "Why is string-concatenated SQL ('SELECT * WHERE id = ' + user_input) dangerous?",
        a: [
          { t:"It's slow", c:false },
          { t:"SQL injection: attacker types ' OR 1=1 -- and reads the entire table", c:true, why:"Yes! Always use parameterised queries / prepared statements. This is the #1 security mistake." },
          { t:"Strings break in PostgreSQL", c:false }
        ]
      },
      takeaway: "10 common mistakes. SELECT *, no-WHERE writes, =NULL, NOT IN with NULLs, implicit JOINs, functions on indexed cols, SQL injection, N+1, GROUP BY confusion, CSV-in-cell.",
      glossary: [
        { term:"SQL injection", def:"Attacker controls part of a query string. Always use parameterised queries to prevent." },
        { term:"N+1 problem", def:"Running 1 query to get N parents, then N more queries to get each parent's children. Use JOIN." }
      ]
    },

    { id:"m3.l25", type:"project", title:"25. Module 3 Project — Real analytics on real schema", est:"90 min",
      learn: [
        "<strong>Mission:</strong> Using QueryPilot's default schema (customers, orders, products, employees, invoices), answer 10 business questions <strong>using SQL only</strong>. Save each query.",
        "<strong>Setup:</strong> Open QueryPilot. Confirm the default schema is loaded in the sidebar. Switch to Ask mode.",
        "<strong>The 10 questions:</strong>",
        "<strong>Q1.</strong> Total revenue across all completed orders.",
        "<strong>Q2.</strong> Top 5 customers by total revenue.",
        "<strong>Q3.</strong> Average order value, per status.",
        "<strong>Q4.</strong> Monthly revenue trend for the last 12 months.",
        "<strong>Q5.</strong> Customers who haven't ordered anything (LEFT JOIN + IS NULL).",
        "<strong>Q6.</strong> Products with stock below 20 in the 'Electronics' category.",
        "<strong>Q7.</strong> Employees in the top 25% of salary, ranked using a window function.",
        "<strong>Q8.</strong> Overdue invoices grouped by customer (due_date &lt; today).",
        "<strong>Q9.</strong> Find duplicate emails in customers (HAVING COUNT(*) &gt; 1).",
        "<strong>Q10.</strong> Year-over-year revenue growth by region (window LAG over yearly aggregates).",
        "<strong>Bonus 11.</strong> Use the Migration Generator (Enterprise tab) to add a 'phone' column to customers.",
        "<strong>Deliverable:</strong> Open Enterprise → Compliance → 'Print Data Pack' — a printable PDF of all your saved queries with the schema dictionary. <strong>This is your portfolio piece.</strong>"
      ],
      example: "<pre>-- Q10 worked example: YoY revenue growth by region\nWITH yearly AS (\n  SELECT region,\n         EXTRACT(YEAR FROM created_at) AS yr,\n         SUM(total) AS revenue\n  FROM orders\n  GROUP BY region, yr\n)\nSELECT region, yr, revenue,\n  LAG(revenue) OVER (PARTITION BY region ORDER BY yr) AS prev_year,\n  ROUND(100.0 * (revenue - LAG(revenue) OVER (PARTITION BY region ORDER BY yr))\n        / NULLIF(LAG(revenue) OVER (PARTITION BY region ORDER BY yr), 0), 2) AS growth_pct\nFROM yearly\nORDER BY region, yr;</pre>",
      project: {
        deliverable: "10 saved queries + printed Data Pack PDF",
        time: "90 minutes",
        difficulty: "Intermediate",
        skills: ["SELECT", "JOIN", "GROUP BY", "HAVING", "window functions", "CTE", "data analysis thinking"]
      },
      takeaway: "You've now used SQL for real business analytics — the same tasks junior data analysts do daily. Your saved queries are a portfolio.",
      glossary: []
    }

  ]
}

// Modules M4-M8 + Capstone continue in part 2 (curriculum_part2.js)
];

// Splice-in marker — part 2 will push more modules into this array
window.CURRICULUM_PART = 1;
