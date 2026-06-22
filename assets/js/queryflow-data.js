/* QueryFlow v3 data pack converted from the Streamlit/DuckDB repository to static JavaScript. */
(function(){
  if(!window.HMG_DATA) return;
  Object.assign(HMG_DATA.tables, {
    hmg_projects: {columns:['project','type','industry','tech','metric','status'], rows:[
      ['CBT Pro (CBT.ng)','EdTech Platform','Education','HTML/CSS/JS, Supabase','Live','Live'],
      ['Insurance Claim Prediction','Binary Classification','Insurance','Random Forest, SMOTE, SHAP','7014 records','Live'],
      ['Yakub Staff Promotion Prediction','Binary Classification','HR','Random Forest','AUC 0.891','Live'],
      ['Bank Customer Churn Prediction','Binary Classification','Banking','Gradient Boosting','AUC 0.868','Live'],
      ['TruthLens Fake News Detector','NLP Classification','Media','XGBoost, TF-IDF','Acc 86.75%','Live'],
      ['NeuroWell Burnout Predictor','Regression','Wellbeing','Gradient Boosting','R2 0.855','Live'],
      ['SwiftChain Delivery Delay','Multiclass Classification','Logistics','Gradient Boosting','Acc 62%','Live'],
      ['Income Level Prediction','Binary Classification','Finance','Random Forest, SMOTE','5-model comparison','Live'],
      ['Student At-Risk Predictor','Binary Classification','Education','Random Forest, SHAP','Two modes','Live'],
      ['Student Performance Tracker v3','Analytics Dashboard','Education','Streamlit, Plotly','4 tabs','Live'],
      ['Portfolio Website','Web','Personal Brand','HTML/CSS/JS, Cloudflare Pages','Live','Live'],
      ['HMG Concepts Website','Web','Education','HTML/CSS/JS, Cloudflare Pages','Live','Live']
    ]},
    hmg_students: {columns:['student_id','name','level','stream','exam_target','subject','score','grade','term','state'], rows:[
      ['HMG001','Tolu Fasanya','SSS3','Science','WAEC','Mathematics',82,'B2','First','Lagos'],['HMG002','Chidinma Okeke','SSS3','Science','WAEC','Physics',76,'B3','First','Lagos'],['HMG003','Ibrahim Bello','SSS2','Science','NECO','Chemistry',68,'C4','First','Ogun'],['HMG004','Funmilayo Ade','SSS3','Commercial','WAEC','Financial Accounting',90,'A1','First','Lagos'],['HMG005','Emeka Nwosu','JSS3','General','BECE','Mathematics',71,'B3','First','Lagos'],['HMG006','Aisha Yusuf','SSS3','Science','JAMB','Further Mathematics',64,'C4','First','Ogun'],['HMG007','David Adeyemi','SSS1','Science','Internal','Computer Science',88,'A1','First','Lagos'],['HMG008','Grace Olawale','SSS3','Arts','WAEC','Literature',79,'B2','First','Lagos'],['HMG009','Samuel Eze','SSS2','Science','NECO','Biology',55,'C6','First','Ogun'],['HMG010','Halima Sani','JSS2','General','Internal','English Language',74,'B3','First','Lagos'],['HMG011','Kunle Bakare','SSS3','Science','JAMB','Physics',48,'D7','First','Lagos'],['HMG012','Ngozi Okafor','SSS3','Commercial','WAEC','Economics',85,'B2','First','Ogun'],['HMG013','Yusuf Lawal','SSS2','Science','NECO','Mathematics',92,'A1','First','Lagos'],['HMG014','Blessing Udo','JSS3','General','BECE','Basic Science',67,'C4','First','Lagos'],['HMG015','Oluwaseun Ojo','SSS3','Science','WAEC','Chemistry',73,'B3','First','Ogun'],['HMG016','Fatima Abubakar','SSS1','Arts','Internal','Government',81,'B2','First','Lagos'],['HMG017','Chinedu Obi','SSS3','Science','JAMB','Further Mathematics',58,'C5','First','Lagos'],['HMG018','Adaeze Eze','SSS2','Commercial','NECO','Commerce',77,'B3','First','Ogun'],['HMG019','Musa Danjuma','JSS3','General','BECE','Mathematics',63,'C4','First','Lagos']
    ]},
    hmg_enrollments: {columns:['enrollment_id','student_name','programme','exam_board','fee_naira','month','channel','status'], rows:[
      ['EN001','Tolu Fasanya','WAEC Prep','WAEC',25000,'January','WhatsApp','Active'],['EN002','Chidinma Okeke','Virtual Classes','WAEC',30000,'January','Website','Active'],['EN003','Ibrahim Bello','NECO Prep','NECO',25000,'January','WhatsApp','Active'],['EN004','Funmilayo Ade','Virtual Classes','WAEC',30000,'February','Referral','Active'],['EN005','Emeka Nwosu','BECE Prep','BECE',18000,'February','Website','Active'],['EN006','Aisha Yusuf','JAMB Prep','JAMB',28000,'February','WhatsApp','Active'],['EN007','David Adeyemi','Data Science Training','Internal',40000,'March','Website','Active'],['EN008','Grace Olawale','Virtual Classes','WAEC',30000,'March','WhatsApp','Completed'],['EN009','Samuel Eze','NECO Prep','NECO',25000,'March','Referral','Active'],['EN010','Halima Sani','Virtual Classes','Internal',22000,'April','Website','Active'],['EN011','Kunle Bakare','JAMB Prep','JAMB',28000,'April','WhatsApp','Dropped'],['EN012','Ngozi Okafor','WAEC Prep','WAEC',25000,'April','Referral','Active'],['EN013','Yusuf Lawal','Data Science Training','Internal',40000,'May','Website','Active'],['EN014','Blessing Udo','BECE Prep','BECE',18000,'May','WhatsApp','Active'],['EN015','Oluwaseun Ojo','WAEC Prep','WAEC',25000,'May','Referral','Completed'],['EN016','Fatima Abubakar','Virtual Classes','Internal',22000,'May','Website','Active'],['EN017','Chinedu Obi','JAMB Prep','JAMB',28000,'May','WhatsApp','Active'],['EN018','Adaeze Eze','NECO Prep','NECO',25000,'May','Referral','Active']
    ]},
    ministry: {columns:['member_id','name','group_name','department','location','attendance','giving','month'], rows:[
      [1,'John','Youth','Choir','Lagos',4,5000,'January'],[2,'Mary','Women','Ushering','Abuja',3,8000,'January'],[3,'Peter','Men','Media','Lagos',4,12000,'January'],[4,'Grace','Youth','Choir','Ibadan',2,3000,'January'],[5,'Paul','Men','Security','Lagos',4,15000,'January'],[6,'Esther','Women','Children','Abuja',4,6000,'January'],[7,'David','Youth','Media','Lagos',3,4000,'February'],[8,'Ruth','Women','Choir','Ibadan',4,7000,'February'],[9,'Samuel','Men','Ushering','Lagos',2,10000,'February'],[10,'Hannah','Youth','Children','Abuja',4,3500,'February'],[11,'Joseph','Men','Media','Lagos',4,20000,'February'],[12,'Sarah','Women','Choir','Ibadan',3,9000,'February']
    ]},
    sample_sales: {columns:['order_id','date','region','category','product','quantity','price','sales'], rows:[
      [1001,'2025-01-05','West','Electronics','Laptop',2,1200,2400],[1002,'2025-01-07','East','Furniture','Desk',5,150,750],[1003,'2025-01-09','West','Electronics','Phone',3,800,2400],[1004,'2025-01-12','North','Office','Chair',10,90,900],[1005,'2025-01-15','South','Electronics','Tablet',4,400,1600],[1006,'2025-01-20','West','Furniture','Bookshelf',2,200,400],[1007,'2025-02-01','East','Office','Notebook',50,5,250],[1008,'2025-02-03','North','Electronics','Laptop',1,1200,1200],[1009,'2025-02-10','South','Furniture','Desk',3,150,450],[1010,'2025-02-14','West','Office','Pen',100,2,200],[1011,'2025-02-18','East','Electronics','Phone',5,800,4000],[1012,'2025-03-01','North','Furniture','Chair',8,90,720],[1013,'2025-03-05','South','Electronics','Tablet',6,400,2400],[1014,'2025-03-09','West','Office','Notebook',30,5,150],[1015,'2025-03-15','East','Furniture','Bookshelf',4,200,800]
    ]}
  });
  HMG_DATA.relationships.push(['hmg_students.name','hmg_enrollments.student_name'], ['hmg_projects.industry','hmg_students.stream']);
  HMG_DATA.queryFlowTemplates = {
    '🏢 HMG / Adewale': ['count project by industry','top 5 student by score','average score by subject','total fee_naira by programme','count enrollment by channel','total fee_naira where status = Active'],
    '📊 Business / Sales': ['total sales by region','top 5 product by total sales','average price by category','count orders by region','maximum sales by category','total sales where region = West'],
    '🎓 EdTech / Students': ['average score by subject','count students by grade','top 10 students by score','maximum score by level','list students where score greater than 70','minimum score by subject'],
    '⛪ FaithTech / Ministry': ['total attendance by month','count members by group_name','average giving by department','top 5 department by attendance','total giving where group_name = Youth','count members by location'],
    '🧪 General exploration': ['show all data','count rows by category','average of every numeric column']
  };
  HMG_DATA.creator = {
    name:'Adewale Samson Adeagbo', tagline:'Data Scientist · STEM Educator · AI-Augmented Solutions Developer', location:'Lagos, Nigeria', brand:'HMG Concepts / HMG Technologies', founded:'2015', motto:'Learning Deliberately. Teaching Authentically.',
    stats:{'Years Teaching':'15+','Live Projects':'12','Industries':'7','Students Reached':'500+','AI API Budget':'₦0'},
    links:{Portfolio:'https://cssadewale.pages.dev','HMG Concepts':'https://hmgconcepts.pages.dev','HMG Academy':'https://hmgacademy.pages.dev',GitHub:'https://github.com/cssadewale',YouTube:'https://youtube.com/@hmgconcepts'}
  };
  HMG_DATA.patterns.push(
    {match:['fee','programme'], sql:'SELECT programme, SUM(fee_naira) AS total_fee FROM hmg_enrollments GROUP BY programme ORDER BY total_fee DESC;'},
    {match:['project','industry'], sql:'SELECT industry, COUNT(*) AS projects FROM hmg_projects GROUP BY industry ORDER BY projects DESC;'},
    {match:['score','subject'], sql:'SELECT subject, ROUND(AVG(score),1) AS avg_score, COUNT(*) AS students FROM hmg_students GROUP BY subject ORDER BY avg_score DESC;'},
    {match:['attendance','month'], sql:'SELECT month, SUM(attendance) AS total_attendance FROM ministry GROUP BY month ORDER BY total_attendance DESC;'}
  );
  HMG_DATA.featureExplanations.push(
    {icon:'🧩', title:'QueryFlow v3 Lab', detail:'A static replacement for the Streamlit QueryFlow experience: visual query builder, plain-English parser, pivot tables, profiler, insights, charts, share links, saved/history and creator profile.'},
    {icon:'🔗', title:'Shareable query links', detail:'Queries can be encoded into URL-safe tokens and restored using ?q= without a backend or database server.'},
    {icon:'🔀', title:'Pivot tables', detail:'Spreadsheet-style cross-tab summaries are generated locally from query/table results.'}
  );
})();
