window.HMG_DATA = {
  version: 'ClassDesk SQL Intelligence v1.0.0',
  generated: '2026-06-22',
  tables: {
    learners: {
      columns: ['id','name','department','status','score','created_at'],
      rows: [
        [1,'Ada Okafor','Data','Active',91,'2026-01-15'],[2,'Kunle Bello','Finance','Active',78,'2026-02-02'],[3,'Mariam Yusuf','Data','Active',86,'2026-02-20'],[4,'Chioma Eze','Marketing','Inactive',64,'2025-12-09'],[5,'Tunde Adebayo','Operations','Active',82,'2026-03-05'],[6,'Grace Musa','Finance','Active',94,'2026-04-01'],[7,'Ifeanyi Obi','Marketing','Active',73,'2026-04-14'],[8,'Amina Saleh','Data','Active',88,'2026-05-01'],[9,'Samuel John','Operations','Inactive',59,'2026-05-11'],[10,'Blessing Nwosu','Finance','Active',81,'2026-05-18']
      ]
    },
    courses: {
      columns: ['id','title','level','hours','track'],
      rows: [[1,'SQL Foundations','Novice',6,'SQL'],[2,'Joins and Relationships','Explorer',8,'SQL'],[3,'Analytics with GROUP BY','Analyst',7,'SQL'],[4,'Window Functions','Architect',10,'SQL'],[5,'Dashboard Storytelling','Analyst',5,'BI']]
    },
    enrollments: {
      columns: ['id','learner_id','course_id','progress','completed'],
      rows: [[1,1,1,100,1],[2,1,2,90,0],[3,2,1,70,0],[4,3,1,100,1],[5,3,3,85,0],[6,4,1,40,0],[7,5,2,75,0],[8,6,3,100,1],[9,7,1,60,0],[10,8,4,55,0],[11,10,2,88,0]]
    },
    sales: {
      columns: ['id','department','month','revenue','cost','region'],
      rows: [[1,'Data','Jan',120000,62000,'Lagos'],[2,'Finance','Jan',95000,43000,'Abuja'],[3,'Marketing','Jan',78000,50000,'Lagos'],[4,'Operations','Jan',88000,54000,'Kano'],[5,'Data','Feb',134000,68000,'Lagos'],[6,'Finance','Feb',101000,45000,'Abuja'],[7,'Marketing','Feb',89000,52000,'Lagos'],[8,'Operations','Feb',92000,58000,'Kano'],[9,'Data','Mar',149000,72000,'Lagos'],[10,'Finance','Mar',111000,47000,'Abuja']]
    },
    departments: {
      columns: ['id','department','manager','budget'],
      rows: [[1,'Data','Adewale',500000],[2,'Finance','Ngozi',360000],[3,'Marketing','Halima',300000],[4,'Operations','Bala',420000]]
    }
  },
  relationships: [
    ['learners.id','enrollments.learner_id'], ['courses.id','enrollments.course_id'], ['departments.department','learners.department'], ['departments.department','sales.department']
  ],
  starterSQL: `CREATE TABLE learners (id INTEGER PRIMARY KEY, name TEXT, department TEXT, status TEXT, score INTEGER, created_at TEXT);
INSERT INTO learners VALUES
(1,'Ada Okafor','Data','Active',91,'2026-01-15'),(2,'Kunle Bello','Finance','Active',78,'2026-02-02'),(3,'Mariam Yusuf','Data','Active',86,'2026-02-20'),(4,'Chioma Eze','Marketing','Inactive',64,'2025-12-09'),(5,'Tunde Adebayo','Operations','Active',82,'2026-03-05'),(6,'Grace Musa','Finance','Active',94,'2026-04-01'),(7,'Ifeanyi Obi','Marketing','Active',73,'2026-04-14'),(8,'Amina Saleh','Data','Active',88,'2026-05-01'),(9,'Samuel John','Operations','Inactive',59,'2026-05-11'),(10,'Blessing Nwosu','Finance','Active',81,'2026-05-18');
CREATE TABLE courses (id INTEGER PRIMARY KEY, title TEXT, level TEXT, hours INTEGER, track TEXT);
INSERT INTO courses VALUES (1,'SQL Foundations','Novice',6,'SQL'),(2,'Joins and Relationships','Explorer',8,'SQL'),(3,'Analytics with GROUP BY','Analyst',7,'SQL'),(4,'Window Functions','Architect',10,'SQL'),(5,'Dashboard Storytelling','Analyst',5,'BI');
CREATE TABLE enrollments (id INTEGER PRIMARY KEY, learner_id INTEGER, course_id INTEGER, progress INTEGER, completed INTEGER);
INSERT INTO enrollments VALUES (1,1,1,100,1),(2,1,2,90,0),(3,2,1,70,0),(4,3,1,100,1),(5,3,3,85,0),(6,4,1,40,0),(7,5,2,75,0),(8,6,3,100,1),(9,7,1,60,0),(10,8,4,55,0),(11,10,2,88,0);
CREATE TABLE sales (id INTEGER PRIMARY KEY, department TEXT, month TEXT, revenue INTEGER, cost INTEGER, region TEXT);
INSERT INTO sales VALUES (1,'Data','Jan',120000,62000,'Lagos'),(2,'Finance','Jan',95000,43000,'Abuja'),(3,'Marketing','Jan',78000,50000,'Lagos'),(4,'Operations','Jan',88000,54000,'Kano'),(5,'Data','Feb',134000,68000,'Lagos'),(6,'Finance','Feb',101000,45000,'Abuja'),(7,'Marketing','Feb',89000,52000,'Lagos'),(8,'Operations','Feb',92000,58000,'Kano'),(9,'Data','Mar',149000,72000,'Lagos'),(10,'Finance','Mar',111000,47000,'Abuja');
CREATE TABLE departments (id INTEGER PRIMARY KEY, department TEXT, manager TEXT, budget INTEGER);
INSERT INTO departments VALUES (1,'Data','Adewale',500000),(2,'Finance','Ngozi',360000),(3,'Marketing','Halima',300000),(4,'Operations','Bala',420000);`,
  challenges: [
    {id:'c1', level:'Novice', title:'Select active learners', concept:'SELECT, WHERE', prompt:'Return name, department and score for active learners only.', starter:'SELECT name, department, score\nFROM learners\nWHERE status = \'Active\';', expected:'SELECT name, department, score FROM learners WHERE status = \'Active\';', hints:['Start with SELECT name, department, score.','Filter rows using WHERE status = \'Active\'.'], badge:'Foundation Finder'},
    {id:'c2', level:'Novice', title:'Sort top learners', concept:'ORDER BY, LIMIT', prompt:'Show the top 5 learners by score with name and score.', starter:'SELECT name, score\nFROM learners\nORDER BY score DESC\nLIMIT 5;', expected:'SELECT name, score FROM learners ORDER BY score DESC LIMIT 5;', hints:['Use ORDER BY score DESC.','LIMIT restricts the number of rows returned.'], badge:'Ranking Rookie'},
    {id:'c3', level:'Explorer', title:'Average score by department', concept:'GROUP BY, AVG', prompt:'Return each department with average score rounded to 1 decimal and learner count.', starter:'SELECT department, ROUND(AVG(score), 1) AS avg_score, COUNT(*) AS learners\nFROM learners\nGROUP BY department;', expected:'SELECT department, ROUND(AVG(score), 1) AS avg_score, COUNT(*) AS learners FROM learners GROUP BY department;', hints:['Aggregates need GROUP BY for non-aggregated columns.','Use ROUND(AVG(score), 1).'], badge:'Aggregator'},
    {id:'c4', level:'Explorer', title:'Join learner enrollments', concept:'JOIN', prompt:'Show learner name, course title and progress by joining three tables.', starter:'SELECT l.name, c.title, e.progress\nFROM enrollments e\nJOIN learners l ON l.id = e.learner_id\nJOIN courses c ON c.id = e.course_id;', expected:'SELECT l.name, c.title, e.progress FROM enrollments e JOIN learners l ON l.id = e.learner_id JOIN courses c ON c.id = e.course_id;', hints:['Start from enrollments because it has learner_id and course_id.','Join learners on l.id = e.learner_id and courses on c.id = e.course_id.'], badge:'Join Explorer'},
    {id:'c5', level:'Analyst', title:'Revenue margin', concept:'Calculated fields', prompt:'For each sales row, calculate profit and margin percentage.', starter:'SELECT department, month, revenue - cost AS profit, ROUND((revenue - cost) * 100.0 / revenue, 1) AS margin_pct\nFROM sales;', expected:'SELECT department, month, revenue - cost AS profit, ROUND((revenue - cost) * 100.0 / revenue, 1) AS margin_pct FROM sales;', hints:['Profit is revenue minus cost.','Use 100.0 to force decimal math in SQLite.'], badge:'Profit Analyst'},
    {id:'c6', level:'Architect', title:'Department performance', concept:'JOIN + GROUP BY', prompt:'Join sales with departments and return manager, total revenue and total profit by department.', starter:'SELECT d.manager, s.department, SUM(s.revenue) AS total_revenue, SUM(s.revenue - s.cost) AS total_profit\nFROM sales s\nJOIN departments d ON d.department = s.department\nGROUP BY d.manager, s.department\nORDER BY total_profit DESC;', expected:'SELECT d.manager, s.department, SUM(s.revenue) AS total_revenue, SUM(s.revenue - s.cost) AS total_profit FROM sales s JOIN departments d ON d.department = s.department GROUP BY d.manager, s.department ORDER BY total_profit DESC;', hints:['Join on department names.','Group by every non-aggregate selected column.'], badge:'SQL Architect'}
  ],
  patterns: [
    {match:['top','score'], sql:'SELECT name, department, score FROM learners ORDER BY score DESC LIMIT 5;'},
    {match:['active','learners'], sql:"SELECT name, department, score FROM learners WHERE status = 'Active' ORDER BY score DESC;"},
    {match:['average','score','department'], sql:'SELECT department, ROUND(AVG(score), 1) AS avg_score, COUNT(*) AS learners FROM learners GROUP BY department ORDER BY avg_score DESC;'},
    {match:['revenue','department'], sql:'SELECT department, SUM(revenue) AS total_revenue, SUM(revenue - cost) AS profit FROM sales GROUP BY department ORDER BY total_revenue DESC;'},
    {match:['course','progress'], sql:'SELECT l.name, c.title, e.progress FROM enrollments e JOIN learners l ON l.id=e.learner_id JOIN courses c ON c.id=e.course_id ORDER BY e.progress DESC;'},
    {match:['margin'], sql:'SELECT department, month, revenue, cost, revenue-cost AS profit, ROUND((revenue-cost)*100.0/revenue,1) AS margin_pct FROM sales ORDER BY margin_pct DESC;'}
  ],
  featureExplanations: [
    {icon:'🛠️', title:'Workbench', detail:'A browser SQL IDE for querying sample tables or uploaded CSVs. It includes a textarea editor, run/format/explain/lint buttons, result table, CSV/report exports, audit log, visual query builder and dashboard pinning.'},
    {icon:'🤖', title:'Rule-based Intelligence Pilot', detail:'Instead of an AI API, the system maps natural language patterns to vetted SQL templates. This avoids recurring API costs and keeps user data in the browser.'},
    {icon:'🎓', title:'Academy', detail:'Guided certification modules include prompts, starter code, hints, result-set validation, local progress tracking, badges and practical projects.'},
    {icon:'📓', title:'Notebook', detail:'Users can combine Markdown explanation cells, executable SQL cells and chart cells into an analysis story, then export a portable HTML report.'},
    {icon:'🔎', title:'Diagnostics', detail:'Static SQL checks identify risky SELECT *, destructive queries without WHERE, missing GROUP BY patterns, wildcard LIKE scans, complexity risks and dialect issues.'},
    {icon:'📊', title:'Dashboard', detail:'Charts and summaries can be pinned from the workbench/notebook to an executive dashboard. It stores cards locally and can export an HTML snapshot.'},
    {icon:'📦', title:'Project portability', detail:'Export/import .hmg.json projects containing theme, snippets, notebook cells, dashboard pins, audit records and learner progress.'},
    {icon:'🔐', title:'Privacy and governance', detail:'Default operation is client-side. Audit logs, local storage, security checks and data quality scans support classroom and enterprise governance without paid services.'}
  ]
};
