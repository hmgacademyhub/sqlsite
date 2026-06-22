/* =====================================================================
   QueryPilot v9 — Curriculum Data (Part 3: Modules M6-M7)
   Pandas, Data Visualization & Storytelling
   ===================================================================== */

window.CURRICULUM.push(

/* ===================================================================
   MODULE 6 — DATA WRANGLING WITH PANDAS
   =================================================================== */
{
  id: "m6",
  title: "Data Wrangling with Pandas",
  icon: "🐼",
  color: "#f85149",
  level: "Intermediate",
  weeks: 3,
  summary: "Pandas is the data scientist's spreadsheet on steroids. It handles millions of rows, runs in Python, and is the most-used DS library in the world. This module turns you fluent in DataFrames — the structure that powers every Python data project.",
  prereq: "Modules 1-5 (especially Python basics and SQL GROUP BY).",
  lessons: [

    { id:"m6.l1", type:"concept", title:"1. Pandas in 60 seconds — your new best friend", est:"7 min",
      learn: [
        "<strong>Pandas</strong> is a Python library for data manipulation. Built on NumPy. Two core structures:",
        "<strong>Series</strong> = 1D labelled array (like a single Excel column).",
        "<strong>DataFrame</strong> = 2D table with named columns and an index (like an entire Excel sheet).",
        "<strong>If you know spreadsheets and SQL, you already understand 80% of Pandas conceptually.</strong> You just need the syntax.",
        "<strong>Why Pandas?</strong><br>• Handles millions of rows fast.<br>• Reads CSV, Excel, JSON, SQL, Parquet — anything.<br>• Same operations as SQL (filter, group, join) — but in Python syntax.<br>• Free, open-source, ubiquitous.",
        "<strong>Conventional import:</strong> <code>import pandas as pd</code>. Always.",
        "<strong>Create a DataFrame from a dict (3 columns × 3 rows):</strong><pre>import pandas as pd\ndf = pd.DataFrame({\n    \"name\":  [\"Adewale\", \"Chinwe\", \"Musa\"],\n    \"city\":  [\"Lagos\", \"Abuja\", \"Kano\"],\n    \"score\": [85, 72, 68]\n})\nprint(df)\n#       name   city   score\n# 0  Adewale  Lagos      85\n# 1   Chinwe  Abuja      72\n# 2     Musa   Kano      68</pre>",
        "<strong>The default index</strong> is 0, 1, 2, ... Each row has a label. Rows have positions AND labels."
      ],
      example: "<pre># 5-row real DataFrame\nimport pandas as pd\nsales = pd.DataFrame({\n    \"date\": [\"2026-01-01\", \"2026-01-02\", \"2026-01-03\", \"2026-01-04\", \"2026-01-05\"],\n    \"item\": [\"Jollof\", \"Eba\", \"Suya\", \"Jollof\", \"Amala\"],\n    \"qty\":  [12, 8, 20, 15, 6],\n    \"price\": [1200, 800, 500, 1200, 1000]\n})\nsales[\"total\"] = sales[\"qty\"] * sales[\"price\"]\nprint(sales)\nprint(f\"Total revenue: ₦{sales['total'].sum():,}\")</pre>",
      quiz: {
        q: "What does a Pandas DataFrame most resemble?",
        a: [
          { t:"A Python list", c:false },
          { t:"An Excel sheet — rows + named columns + index labels", c:true, why:"Yes! DataFrame = sheet. Series = column." },
          { t:"A JSON file", c:false }
        ]
      },
      takeaway: "Pandas = spreadsheets in Python. DataFrame (2D table) + Series (1D column). Foundation of every Python DS project.",
      glossary: [
        { term:"DataFrame", def:"Pandas 2D labelled table. Like an Excel sheet or SQL table." },
        { term:"Series", def:"Pandas 1D labelled array. Like a single column." }
      ]
    },

    { id:"m6.l2", type:"concept", title:"2. Loading data — CSV, Excel, SQL", est:"10 min",
      learn: [
        "<strong>Read a CSV file</strong> (most common):<pre>df = pd.read_csv(\"sales.csv\")</pre>That's it. One line. Pandas auto-detects types, headers.",
        "<strong>Common options:</strong><pre>pd.read_csv(\"data.csv\",\n    sep=\",\",              # delimiter\n    header=0,             # which row is the header (0 = first)\n    index_col=\"id\",       # use this column as index\n    parse_dates=[\"date\"], # auto-convert these to datetime\n    na_values=[\"N/A\", \"-\"], # treat these as NaN\n    nrows=1000,           # read only first 1000 rows\n    skiprows=2,           # skip first 2 rows\n    encoding=\"utf-8\")     # crucial for Nigerian text with ₦</pre>",
        "<strong>Excel files:</strong><pre>df = pd.read_excel(\"data.xlsx\", sheet_name=\"Sales\")</pre>(May require <code>pip install openpyxl</code>.)",
        "<strong>JSON:</strong> <code>pd.read_json(\"data.json\")</code>",
        "<strong>SQL database:</strong><pre>import sqlite3\nconn = sqlite3.connect(\"mydata.db\")\ndf = pd.read_sql(\"SELECT * FROM customers WHERE state='Lagos'\", conn)</pre>",
        "<strong>Web scraping a single HTML table:</strong> <code>pd.read_html(\"https://...\")</code> returns a list of DataFrames.",
        "<strong>Upload in Colab:</strong><pre>from google.colab import files\nuploaded = files.upload()   # opens picker\ndf = pd.read_csv(next(iter(uploaded)))</pre>",
        "<strong>Save back:</strong> <code>df.to_csv(\"out.csv\", index=False)</code> — index=False avoids writing the row numbers as a column."
      ],
      example: "<pre>import pandas as pd\n\n# Read a CSV with proper date parsing\norders = pd.read_csv(\n    \"orders.csv\",\n    parse_dates=[\"created_at\"],\n    encoding=\"utf-8\"\n)\nprint(orders.shape)         # (1000, 5) — 1000 rows, 5 columns\nprint(orders.head(3))       # first 3 rows\nprint(orders.dtypes)        # column types\nprint(orders.info())        # rows, types, memory usage</pre>",
      exercise: {
        steps: 3,
        tool: "Google Colab",
        task: "Upload any CSV you have. Use pd.read_csv. Print .shape, .head(), .info()."
      },
      quiz: {
        q: "Your CSV has dates as text and you want them as datetime for time-based analysis. Best parameter?",
        a: [
          { t:"parse_dates=['date_col']", c:true, why:"Yes! pd.read_csv auto-converts the listed columns to datetime." },
          { t:"date=True", c:false },
          { t:"converters={'date': lambda x: x}", c:false, why:"Works but verbose." }
        ]
      },
      takeaway: "pd.read_csv (and read_excel, read_json, read_sql) are your gateways. parse_dates, encoding, na_values are everyday options.",
      glossary: [
        { term:"DataFrame loading", def:"Reading data from external sources into a Pandas DataFrame." }
      ]
    },

    { id:"m6.l3", type:"concept", title:"3. Inspecting a DataFrame — first things to do", est:"9 min",
      learn: [
        "After loading data, ALWAYS run these inspections before any analysis. They reveal problems early.",
        "<strong>Shape & size:</strong><pre>df.shape          # (1000, 5)  — rows, columns\nlen(df)           # 1000\ndf.columns        # column names\ndf.index          # row index</pre>",
        "<strong>Peek at the data:</strong><pre>df.head()         # first 5 rows\ndf.head(20)       # first 20\ndf.tail()         # last 5\ndf.sample(10)     # random 10 rows\ndf.iloc[100:105]  # rows 100-104 by position\ndf.loc[100:105]   # rows with index labels 100-105</pre>",
        "<strong>Types & missing:</strong><pre>df.dtypes         # type of each column\ndf.info()         # column types + non-null counts + memory\ndf.isnull().sum() # missing values per column\ndf.duplicated().sum()  # number of duplicate rows</pre>",
        "<strong>Numeric summaries:</strong><pre>df.describe()         # count, mean, std, min, 25%, 50%, 75%, max\ndf.describe(include='all')   # also for text columns</pre>",
        "<strong>Categorical summaries:</strong><pre>df['city'].value_counts()       # frequency of each city\ndf['city'].unique()              # unique values\ndf['city'].nunique()             # count of uniques</pre>",
        "<strong>The mandatory 'first 5 commands' on any new dataset:</strong><pre>print(df.shape)\nprint(df.dtypes)\nprint(df.head(3))\nprint(df.isnull().sum())\nprint(df.describe())</pre>"
      ],
      example: "<pre>import pandas as pd\n\ndf = pd.read_csv(\"customers.csv\")\nprint(\"Shape:\", df.shape)              # (5000, 8)\nprint(\"\\nMissing per column:\")\nprint(df.isnull().sum())               # find problem columns\nprint(\"\\nCity distribution:\")\nprint(df['city'].value_counts().head(10))   # top 10 cities\nprint(\"\\nSummary stats:\")\nprint(df.describe())</pre>",
      exercise: {
        steps: 2,
        tool: "Google Colab",
        task: "Load any CSV. Run all 5 mandatory inspection commands. Note any concerns (high missing %, weird types, surprising distributions)."
      },
      quiz: {
        q: "What does <code>df.describe()</code> give you?",
        a: [
          { t:"Column names", c:false },
          { t:"Count, mean, std, min, quartiles, max for every numeric column", c:true, why:"Yes! Instant statistical summary — your second-most-used Pandas method." },
          { t:"The DataFrame's documentation", c:false }
        ]
      },
      takeaway: "Always inspect first: shape, dtypes, head, isnull, describe, value_counts. Spot problems early.",
      glossary: [
        { term:"describe()", def:"Pandas summary statistics for numeric columns: count, mean, std, min, 25/50/75 percentiles, max." }
      ]
    },

    { id:"m6.l4", type:"concept", title:"4. Selecting & filtering — Pandas like SQL", est:"12 min",
      learn: [
        "Selecting columns and filtering rows in Pandas mirrors SELECT and WHERE in SQL.",
        "<strong>Select columns:</strong><pre>df['name']                   # single column → Series\ndf[['name', 'email']]         # multiple → DataFrame\ndf.name                       # equivalent shortcut (only if no spaces)</pre>",
        "<strong>Filter rows (boolean indexing):</strong><pre>df[df['city'] == 'Lagos']               # WHERE city = 'Lagos'\ndf[df['age'] &gt; 30]                       # WHERE age &gt; 30\ndf[df['city'].isin(['Lagos', 'Abuja'])]  # WHERE city IN (...)\ndf[df['name'].str.contains('ade', case=False)]   # WHERE name LIKE '%ade%'</pre>",
        "<strong>Multiple conditions</strong> (parentheses are MANDATORY due to operator precedence):<pre>df[(df['city'] == 'Lagos') &amp; (df['age'] &gt; 30)]           # AND\ndf[(df['city'] == 'Lagos') | (df['city'] == 'Abuja')]    # OR\ndf[~(df['status'] == 'inactive')]                         # NOT</pre>",
        "<strong>Use <code>&amp;</code> and <code>|</code></strong> (not <code>and</code>/<code>or</code>) — Pandas does element-wise boolean logic.",
        "<strong>The .loc and .iloc indexers (used heavily):</strong><pre>df.loc[5, 'name']             # row index 5, column 'name'\ndf.loc[:, 'name':'city']      # all rows, columns name through city\ndf.loc[df['age'] &gt; 30, ['name', 'city']]  # combined filter + cols\n\ndf.iloc[5, 2]                  # row position 5, column position 2\ndf.iloc[:10, :3]                # first 10 rows, first 3 cols</pre>",
        "<strong>.loc</strong> uses LABELS (column names, index labels). <strong>.iloc</strong> uses POSITIONS (0, 1, 2...). Get this right and Pandas feels precise."
      ],
      example: "<pre>import pandas as pd\norders = pd.read_csv(\"orders.csv\")\n\n# Active Lagos customers with order > 5000\nbig_lagos = orders[\n    (orders['city'] == 'Lagos') &amp;\n    (orders['status'] == 'active') &amp;\n    (orders['total'] &gt; 5000)\n][['customer_name', 'total', 'created_at']]\n\nprint(f\"Found {len(big_lagos)} matching orders\")\nprint(big_lagos.head())</pre>",
      tryq: "Filter Lagos active customers",
      quiz: {
        q: "Why <code>df[(df.a &gt; 0) &amp; (df.b &lt; 5)]</code> and not <code>df[df.a &gt; 0 and df.b &lt; 5]</code>?",
        a: [
          { t:"Pandas requires element-wise & operator and parentheses around each condition", c:true, why:"Yes! `and` works on single booleans; `&` does element-wise on arrays. Parens fix operator precedence." },
          { t:"Style preference", c:false },
          { t:"They both work identically", c:false }
        ]
      },
      takeaway: "df[cond] for filter. & | ~ for element-wise boolean. .loc (labels) and .iloc (positions). Always parens around conditions.",
      glossary: [
        { term:"Boolean indexing", def:"Filtering rows by a boolean array of the same length as the DataFrame." },
        { term:".loc / .iloc", def:".loc = label-based access. .iloc = integer-position-based." }
      ]
    },

    { id:"m6.l5", type:"concept", title:"5. GroupBy — Pandas pivot tables", est:"12 min",
      learn: [
        "<code>df.groupby()</code> is Pandas' equivalent of SQL <code>GROUP BY</code> and Excel pivot tables. Most-used Pandas operation.",
        "<strong>Simple aggregation:</strong><pre>df.groupby('city')['revenue'].sum()\n# returns Series: revenue per city</pre>",
        "<strong>Multiple aggregations:</strong><pre>df.groupby('city')['revenue'].agg(['sum', 'mean', 'count'])\n# DataFrame with sum, mean, count of revenue per city</pre>",
        "<strong>Multiple columns, multiple aggregates:</strong><pre>df.groupby('city').agg({\n    'revenue': ['sum', 'mean'],\n    'orders':  'count',\n    'age':     'mean'\n})</pre>",
        "<strong>Group by multiple columns:</strong><pre>df.groupby(['city', 'month'])['revenue'].sum()\n# multi-level index: city + month → revenue</pre>",
        "<strong>Reset to flat DataFrame:</strong><pre>summary = df.groupby('city')['revenue'].sum().reset_index()\n# flat DataFrame with two columns: city, revenue</pre>",
        "<strong>Custom aggregation function:</strong><pre>df.groupby('city')['revenue'].agg(lambda x: x.max() - x.min())  # range per group</pre>",
        "<strong>Apply functions to each group (advanced):</strong><pre>def top_3(group):\n    return group.nlargest(3, 'revenue')\n\ndf.groupby('city').apply(top_3)   # top 3 per city</pre>",
        "<strong>Pandas equivalent of SQL pivot:</strong><pre>df.pivot_table(\n    index='city',         # rows\n    columns='month',      # columns\n    values='revenue',     # cell values\n    aggfunc='sum'         # how to aggregate\n)</pre>"
      ],
      example: "<pre>import pandas as pd\norders = pd.read_csv('orders.csv', parse_dates=['created_at'])\norders['month'] = orders['created_at'].dt.to_period('M')\n\n# Monthly revenue per city\nmonthly = orders.groupby(['city', 'month'])['total'].sum().reset_index()\nprint(monthly.head())\n\n# Pivot for human reading\npivot = orders.pivot_table(\n    index='city', columns='month',\n    values='total', aggfunc='sum', fill_value=0\n)\nprint(pivot)</pre>",
      tryq: "Sales summary by region",
      quiz: {
        q: "What's the Pandas equivalent of SQL <code>SELECT city, SUM(total), AVG(total) FROM orders GROUP BY city</code>?",
        a: [
          { t:"df.groupby('city')['total'].agg(['sum', 'mean'])", c:true, why:"Yes! Identical conceptually — groupby = GROUP BY, agg = aggregation." },
          { t:"df.filter('city')['total']", c:false },
          { t:"df.where('city')['total'].sum()", c:false }
        ]
      },
      takeaway: "groupby() = GROUP BY. agg() for aggregates. pivot_table() for cross-tabs. Reset index for flat output.",
      glossary: [
        { term:"groupby", def:"Pandas operation that splits rows by a column then applies aggregation per group." }
      ]
    },

    { id:"m6.l6", type:"concept", title:"6. Cleaning — missing values & duplicates", est:"12 min",
      learn: [
        "Real data is messy. Pandas has tools for every cleaning task.",
        "<strong>Detect missing:</strong><pre>df.isnull()              # boolean DataFrame: True where missing\ndf.isnull().sum()         # count of missing per column\ndf.isnull().mean() * 100  # percentage missing per column</pre>",
        "<strong>Drop rows with ANY missing:</strong> <code>df.dropna()</code>",
        "<strong>Drop rows where SPECIFIC columns are missing:</strong> <code>df.dropna(subset=['email', 'name'])</code>",
        "<strong>Drop COLUMNS with too many missing:</strong> <code>df.dropna(axis=1, thresh=len(df)*0.5)</code> (drop cols missing &gt;50%)",
        "<strong>Fill missing:</strong><pre>df['city'].fillna('Unknown', inplace=True)\ndf['age'].fillna(df['age'].mean(), inplace=True)   # impute mean\ndf['revenue'].fillna(0, inplace=True)\ndf.fillna(method='ffill', inplace=True)             # forward-fill (carry last value)</pre>",
        "<strong>Find duplicates:</strong><pre>df.duplicated()              # boolean: True if duplicate of an earlier row\ndf.duplicated(subset=['email'])  # duplicates by specific column\ndf[df.duplicated()]           # show duplicate rows\ndf.drop_duplicates(inplace=True)\ndf.drop_duplicates(subset=['email'], keep='first', inplace=True)</pre>",
        "<strong>Replace specific values:</strong><pre>df['city'].replace({'lagoss': 'Lagos', 'abj': 'Abuja'}, inplace=True)</pre>",
        "<strong>String cleaning</strong> (use .str accessor):<pre>df['city'] = df['city'].str.strip()    # whitespace\ndf['city'] = df['city'].str.lower()    # lowercase\ndf['city'] = df['city'].str.title()    # Title Case</pre>",
        "<strong>Type conversion:</strong><pre>df['price'] = df['price'].str.replace('₦','').str.replace(',','').astype(float)\ndf['date'] = pd.to_datetime(df['date'])</pre>",
        "<strong>Golden rule:</strong> Always do <code>df.isnull().sum()</code> BEFORE cleaning, then again AFTER. Verify your changes."
      ],
      example: "<pre>import pandas as pd\n\ndf = pd.DataFrame({\n    'name': ['Adewale', 'Chinwe', None, 'Musa', 'adewale'],\n    'city': ['Lagos', 'lagoss', 'Abuja', None, 'Lagos'],\n    'spend': ['₦12,000', '₦8,000', None, '₦15,000', '₦12,000']\n})\n\n# Clean steps\ndf['city'] = df['city'].replace({'lagoss': 'Lagos'}).str.title()\ndf['name'] = df['name'].str.title()\ndf['spend'] = df['spend'].str.replace('[₦,]', '', regex=True).astype(float)\ndf.dropna(subset=['name'], inplace=True)\ndf.drop_duplicates(subset=['name'], keep='first', inplace=True)\nprint(df)</pre>",
      exercise: {
        steps: 4,
        tool: "Google Colab",
        task: "Create a 10-row DataFrame with intentional dirt (nulls, dupes, typos, ₦ in numbers). Write a cleaning pipeline. Verify with isnull().sum()."
      },
      quiz: {
        q: "You have a 10,000-row dataset; 50 rows are missing email. Best move?",
        a: [
          { t:"Drop all 50 immediately", c:false, why:"Hasty. May lose valuable other-column data." },
          { t:"Investigate the missing pattern first, then decide: drop, fill 'unknown', or impute", c:true, why:"Yes! Missing data tells a story. Understand before you act." },
          { t:"Fill them all with 'no@email.com'", c:false }
        ]
      },
      takeaway: "isnull, dropna, fillna, drop_duplicates, .str cleaning, astype. Always verify isnull().sum() before AND after.",
      glossary: [
        { term:"NaN", def:"Not a Number. Pandas' standard 'missing value' marker for numeric columns." },
        { term:"Imputation", def:"Filling missing values with a sensible substitute (mean, median, mode, constant, model prediction)." }
      ]
    },

    { id:"m6.l7", type:"concept", title:"7. Creating new columns & transformations", est:"10 min",
      learn: [
        "Adding computed columns is constant in DS workflows.",
        "<strong>Basic arithmetic on columns:</strong><pre>df['total'] = df['qty'] * df['price']\ndf['vat']   = df['total'] * 0.075\ndf['after_vat'] = df['total'] + df['vat']</pre>",
        "<strong>String operations</strong> (via <code>.str</code>):<pre>df['initials'] = df['name'].str[0]      # first character\ndf['domain'] = df['email'].str.split('@').str[1]\ndf['name_upper'] = df['name'].str.upper()</pre>",
        "<strong>Date components</strong> (via <code>.dt</code>, requires datetime column):<pre>df['year']     = df['created_at'].dt.year\ndf['month']    = df['created_at'].dt.month\ndf['weekday']  = df['created_at'].dt.day_name()\ndf['quarter']  = df['created_at'].dt.quarter</pre>",
        "<strong>Conditional column (numpy where):</strong><pre>import numpy as np\ndf['big_sale'] = np.where(df['total'] &gt; 10000, 'Yes', 'No')</pre>",
        "<strong>Multiple conditions — bucket into categories:</strong><pre>def categorise(spend):\n    if spend &gt; 1000000: return 'VIP'\n    if spend &gt; 100000:  return 'Premium'\n    if spend &gt; 10000:   return 'Regular'\n    return 'New'\n\ndf['segment'] = df['spend'].apply(categorise)</pre>",
        "<strong>Or use pd.cut for binning numeric ranges:</strong><pre>df['age_group'] = pd.cut(df['age'],\n    bins=[0, 17, 35, 60, 120],\n    labels=['Minor', 'Young', 'Adult', 'Senior'])</pre>",
        "<strong>apply() for custom transformations:</strong><pre>df['name_length'] = df['name'].apply(len)\ndf['discounted'] = df.apply(\n    lambda row: row['price'] * 0.9 if row['qty'] &gt; 100 else row['price'],\n    axis=1                          # axis=1 means row-wise\n)</pre>"
      ],
      example: "<pre>import pandas as pd\nimport numpy as np\n\norders = pd.DataFrame({\n    'customer': ['Adewale', 'Chinwe', 'Musa', 'Folake'],\n    'qty': [5, 12, 1, 20],\n    'unit_price': [1200, 1500, 800, 1000],\n    'created_at': pd.to_datetime(['2026-01-15','2026-02-03','2026-01-22','2026-03-10'])\n})\n\norders['subtotal'] = orders['qty'] * orders['unit_price']\norders['vat'] = orders['subtotal'] * 0.075\norders['total'] = orders['subtotal'] + orders['vat']\norders['month_name'] = orders['created_at'].dt.month_name()\norders['big'] = np.where(orders['qty'] &gt;= 10, 'bulk', 'small')\n\nprint(orders)</pre>",
      tryq: "Add computed columns to my orders",
      quiz: {
        q: "Best way to compute a column based on a complex per-row rule?",
        a: [
          { t:"for loop", c:false, why:"Slow." },
          { t:"df.apply(func, axis=1) or np.where for simple conditions", c:true, why:"Yes! apply for general row functions; np.where for vectorised if/else." },
          { t:"There's no way", c:false }
        ]
      },
      takeaway: "Arithmetic, .str, .dt, np.where, apply, pd.cut. Vectorise — avoid for-loops.",
      glossary: [
        { term:".str accessor", def:"Pandas API for string operations on Series of strings." },
        { term:".dt accessor", def:"Pandas API for date/time component extraction." }
      ]
    },

    { id:"m6.l8", type:"concept", title:"8. Merging DataFrames — Pandas JOIN", est:"10 min",
      learn: [
        "<code>pd.merge()</code> is Pandas' JOIN. Same 4 join types as SQL.",
        "<pre>customers = pd.DataFrame({'id':[1,2,3], 'name':['Adewale','Chinwe','Musa']})\norders    = pd.DataFrame({'customer_id':[1,1,3], 'total':[1000,2000,3000]})\n\n# Inner join (default)\nresult = pd.merge(orders, customers, left_on='customer_id', right_on='id')\n\n# LEFT JOIN (keep all customers, even with no orders)\npd.merge(customers, orders, left_on='id', right_on='customer_id', how='left')\n\n# Same column name on both sides:\npd.merge(t1, t2, on='customer_id', how='inner')\n\n# Multiple keys:\npd.merge(t1, t2, on=['region', 'month'])</pre>",
        "<strong>The 4 how values:</strong> 'inner' (default), 'left', 'right', 'outer' (= SQL FULL OUTER).",
        "<strong>Concat for stacking</strong> (= SQL UNION):<pre>pd.concat([df1, df2, df3])              # stack rows\npd.concat([df1, df2], axis=1)           # side by side (columns)\npd.concat([df1, df2], ignore_index=True)  # reset index 0..N</pre>",
        "<strong>Method-style merge:</strong> <code>customers.merge(orders, left_on='id', right_on='customer_id')</code> — same thing, chainable.",
        "<strong>Suffixes</strong> for columns that exist in both:<pre>pd.merge(t1, t2, on='id', suffixes=('_left', '_right'))</pre>",
        "<strong>Indicator</strong> column to see source of each row (useful for debugging joins):<pre>pd.merge(t1, t2, on='id', how='outer', indicator=True)\n# adds _merge column: 'left_only' / 'right_only' / 'both'</pre>"
      ],
      example: "<pre>import pandas as pd\n\ncustomers = pd.DataFrame({\n    'customer_id': [1, 2, 3, 4],\n    'name': ['Adewale', 'Chinwe', 'Musa', 'Folake'],\n    'state': ['Lagos', 'Abuja', 'Kano', 'Lagos']\n})\norders = pd.DataFrame({\n    'order_id': [101, 102, 103, 104, 105],\n    'customer_id': [1, 1, 2, 4, 4],\n    'total': [5000, 3000, 4500, 2000, 8000]\n})\n\n# All customers + their orders (with NaN for Musa who has none)\nfull = customers.merge(orders, on='customer_id', how='left')\n\n# Total spend per customer (with 0 for non-spenders)\nspend = full.groupby('name')['total'].sum().fillna(0).reset_index()\nprint(spend)</pre>",
      tryq: "Join customers and orders, compute total spend",
      quiz: {
        q: "Which join keeps ALL rows from the left table, even when there's no match on the right?",
        a: [
          { t:"how='inner'", c:false },
          { t:"how='left'", c:true, why:"Yes! Same as SQL LEFT JOIN — keeps all rows of left." },
          { t:"how='cross'", c:false }
        ]
      },
      takeaway: "pd.merge(t1, t2, on=, how=). 4 hows: inner / left / right / outer. concat for stacking.",
      glossary: [
        { term:"Merge / Join", def:"Combining two DataFrames based on matching key column(s)." }
      ]
    },

    { id:"m6.l9", type:"concept", title:"9. Reshape — pivot, melt, stack", est:"10 min",
      learn: [
        "Sometimes data is in the wrong shape. Pandas converts between wide and long formats easily.",
        "<strong>Wide format:</strong> one row per entity, one column per measurement period.<pre>name      jan   feb   mar\nAdewale   100   120   130</pre>",
        "<strong>Long format (tidy):</strong> one row per entity-measurement combination.<pre>name      month  value\nAdewale   jan    100\nAdewale   feb    120\nAdewale   mar    130</pre>",
        "<strong>Wide → Long with melt:</strong><pre>long = wide.melt(\n    id_vars=['name'],          # columns to keep as-is\n    value_vars=['jan','feb','mar'],   # columns to melt\n    var_name='month',\n    value_name='value'\n)</pre>",
        "<strong>Long → Wide with pivot:</strong><pre>wide = long.pivot(\n    index='name',\n    columns='month',\n    values='value'\n)</pre>",
        "<strong>Pivot with aggregation (when long has duplicates):</strong><pre>long.pivot_table(\n    index='customer',\n    columns='product',\n    values='qty',\n    aggfunc='sum',\n    fill_value=0\n)</pre>",
        "<strong>When to use what:</strong><br>• <strong>Wide</strong> — easier for humans, dashboards, executive reports.<br>• <strong>Long / Tidy</strong> — required by most ML tools, charting libraries, statistical tests. <strong>Default to long for analysis.</strong>",
        "<strong>Stack / Unstack</strong> shift between rows and columns of MultiIndex DataFrames. Less common but useful for hierarchical data."
      ],
      example: "<pre>import pandas as pd\n\nsales_wide = pd.DataFrame({\n    'product': ['Jollof', 'Eba', 'Suya'],\n    'jan': [100, 80, 50],\n    'feb': [120, 90, 60],\n    'mar': [130, 85, 70]\n})\n\n# Melt to long (tidy) format\nsales_long = sales_wide.melt(\n    id_vars=['product'],\n    var_name='month',\n    value_name='units_sold'\n)\nprint(sales_long)\n\n# Pivot back to wide\nsales_wide_again = sales_long.pivot(\n    index='product', columns='month', values='units_sold'\n)\nprint(sales_wide_again)</pre>",
      tryq: "Reshape wide monthly data to long format",
      quiz: {
        q: "Which format do most ML libraries and statistical tests prefer?",
        a: [
          { t:"Wide — easier for humans", c:false },
          { t:"Long / tidy — one observation per row", c:true, why:"Yes! Long format is the universal input for ML, charting (seaborn), and statistical tests." }
        ]
      },
      takeaway: "melt (wide→long), pivot (long→wide), pivot_table (with aggregation). Long for analysis, wide for humans.",
      glossary: [
        { term:"melt", def:"Reshape DataFrame from wide to long format." },
        { term:"pivot", def:"Reshape DataFrame from long to wide format." }
      ]
    },

    { id:"m6.l10", type:"concept", title:"10. Working with dates & time series", est:"10 min",
      learn: [
        "Time-based data is everywhere. Pandas has world-class date handling.",
        "<strong>Convert to datetime:</strong><pre>df['date'] = pd.to_datetime(df['date'])              # auto-detect format\npd.to_datetime(df['date'], format='%d-%m-%Y')        # specific format</pre>",
        "<strong>Extract components</strong> (after conversion):<pre>df['year']     = df['date'].dt.year\ndf['month']    = df['date'].dt.month\ndf['day']      = df['date'].dt.day\ndf['weekday']  = df['date'].dt.day_name()    # Monday, Tuesday, ...\ndf['quarter']  = df['date'].dt.quarter\ndf['week']     = df['date'].dt.isocalendar().week</pre>",
        "<strong>Date arithmetic:</strong><pre>df['days_since'] = (pd.Timestamp.now() - df['signup_date']).dt.days\ndf['next_week'] = df['date'] + pd.Timedelta(days=7)</pre>",
        "<strong>Set date as index (for time series):</strong><pre>df.set_index('date', inplace=True)\ndf.sort_index(inplace=True)\n\n# Slice by date\ndf['2026']                  # all of 2026\ndf['2026-01']                # January 2026\ndf['2026-01-15':'2026-01-31']  # range</pre>",
        "<strong>Resample for time series rollups</strong> (the most powerful time-series function):<pre>df.resample('D').sum()       # daily total\ndf.resample('M').mean()      # monthly mean\ndf.resample('Q').count()     # quarterly count\ndf.resample('W-MON').sum()   # weekly, week starts Monday</pre>",
        "<strong>Rolling windows</strong> (moving averages, totals):<pre>df['rolling_7d'] = df['sales'].rolling(window=7).mean()\ndf['cumulative'] = df['sales'].cumsum()</pre>",
        "<strong>Shift / lag / lead:</strong><pre>df['previous_day'] = df['sales'].shift(1)             # yesterday\ndf['change'] = df['sales'] - df['sales'].shift(1)     # day-over-day diff</pre>"
      ],
      example: "<pre>import pandas as pd\n\norders = pd.read_csv('orders.csv', parse_dates=['created_at'])\norders.set_index('created_at', inplace=True)\norders.sort_index(inplace=True)\n\n# Monthly revenue\nmonthly_rev = orders['total'].resample('M').sum()\n\n# 7-day rolling average of daily revenue\ndaily_rev = orders['total'].resample('D').sum()\ndaily_rev_rolling = daily_rev.rolling(7).mean()\n\n# Month-over-month growth\nmom_growth = monthly_rev.pct_change() * 100   # percentage\n\nprint(\"Monthly revenue:\\n\", monthly_rev.head())\nprint(\"MoM growth:\\n\", mom_growth.head())</pre>",
      tryq: "Monthly sales trend with rolling average",
      quiz: {
        q: "You have daily sales data and want monthly totals. Best Pandas method?",
        a: [
          { t:"groupby(df['date'].dt.month)", c:false, why:"Works but conflates same months across years." },
          { t:"resample('M').sum() after setting date as index", c:true, why:"Yes! resample is built for time-series rollups — properly handles year-month combinations." },
          { t:".rolling(30).sum()", c:false, why:"Rolling 30-day = different from calendar-month." }
        ]
      },
      takeaway: "to_datetime, .dt accessor, set_index date, resample for rollups, rolling for windows, shift for lag.",
      glossary: [
        { term:"Resample", def:"Aggregate time-series data to a different frequency (daily → monthly etc.)." },
        { term:"Rolling window", def:"Moving aggregate (e.g. 7-day moving average) over a sliding window." }
      ]
    },

    { id:"m6.l11", type:"concept", title:"11. Pandas vs SQL — same patterns, different syntax", est:"8 min",
      learn: [
        "Once you know SQL (Module 3), Pandas is largely translation:",
        "<table style='width:100%;border-collapse:collapse;font-size:11px;margin:8px 0'><tr style='background:var(--sf2)'><th style='border:1px solid var(--bd);padding:6px'>SQL</th><th style='border:1px solid var(--bd);padding:6px'>Pandas</th></tr>" +
          [
            ["SELECT col FROM t",                   "df['col']"],
            ["SELECT * FROM t",                     "df"],
            ["WHERE col = 'x'",                     "df[df['col'] == 'x']"],
            ["WHERE col1 = 'x' AND col2 > 5",       "df[(df['col1']=='x') & (df['col2']>5)]"],
            ["WHERE col IN ('a','b')",              "df[df['col'].isin(['a','b'])]"],
            ["WHERE col LIKE '%abc%'",              "df[df['col'].str.contains('abc')]"],
            ["WHERE col IS NULL",                   "df[df['col'].isnull()]"],
            ["ORDER BY col DESC",                   "df.sort_values('col', ascending=False)"],
            ["LIMIT 10",                            "df.head(10)"],
            ["LIMIT 10 OFFSET 20",                  "df.iloc[20:30]"],
            ["GROUP BY a",                          "df.groupby('a')"],
            ["GROUP BY a HAVING SUM(x) > 10",       "df.groupby('a').filter(lambda g: g['x'].sum() > 10)"],
            ["COUNT(*)",                            "len(df) or df.shape[0]"],
            ["COUNT(DISTINCT c)",                   "df['c'].nunique()"],
            ["SUM(c)",                              "df['c'].sum()"],
            ["AVG(c)",                              "df['c'].mean()"],
            ["JOIN ON a.id = b.fk",                 "pd.merge(a, b, left_on='id', right_on='fk')"],
            ["UNION",                               "pd.concat([df1, df2]).drop_duplicates()"],
            ["UNION ALL",                           "pd.concat([df1, df2])"],
            ["CASE WHEN x THEN 'a' ELSE 'b' END",   "np.where(df['x'], 'a', 'b')"]
          ].map(function(r){
            return "<tr><td style='border:1px solid var(--bd);padding:5px;font-family:JetBrains Mono,monospace;color:var(--kw)'>" + r[0] + "</td><td style='border:1px solid var(--bd);padding:5px;font-family:JetBrains Mono,monospace;color:var(--ac)'>" + r[1] + "</td></tr>";
          }).join("") + "</table>",
        "<strong>The mental model is the same.</strong> Once you internalise filter → group → aggregate, both languages flow.",
        "<strong>Which to use when?</strong><br>• Data already in SQL? → use SQL.<br>• Data in CSV / files / mixed sources? → use Pandas.<br>• Need ML / statistical modelling? → Pandas (Python ecosystem).<br>• Need to share with non-coder analysts? → SQL or even Excel."
      ],
      example: "<pre># SAME ANALYSIS — two ways\n\n# SQL\n# SELECT city, COUNT(*) AS n, SUM(revenue) AS total\n# FROM orders\n# WHERE status = 'completed' AND revenue &gt; 5000\n# GROUP BY city\n# HAVING SUM(revenue) &gt; 100000\n# ORDER BY total DESC LIMIT 10\n\n# Pandas\ntop_cities = (\n    orders\n    [(orders['status'] == 'completed') &amp; (orders['revenue'] &gt; 5000)]\n    .groupby('city')\n    .agg(n=('revenue','count'), total=('revenue','sum'))\n    .query('total &gt; 100000')\n    .sort_values('total', ascending=False)\n    .head(10)\n)</pre>",
      quiz: {
        q: "SQL's <code>WHERE col IN ('a','b')</code> translates to:",
        a: [
          { t:"df[df['col'] == ['a','b']]", c:false, why:"Element-wise comparison, broken for unequal lengths." },
          { t:"df[df['col'].isin(['a','b'])]", c:true, why:"Yes! .isin() is the Pandas equivalent." },
          { t:"df.col == 'a' or 'b'", c:false, why:"Python truthy on 'b'; doesn't work element-wise." }
        ]
      },
      takeaway: "SQL skills transfer directly. Memorise the cheat sheet. Same filter/group/aggregate mental model.",
      glossary: []
    },

    { id:"m6.l12", type:"project", title:"12. Module 6 Project — Pandas analysis of Lagos sales", est:"90 min",
      learn: [
        "<strong>Mission:</strong> Use Pandas end-to-end on a real-ish dataset. Replicate a junior data analyst's typical workday.",
        "<strong>Setup:</strong> Open Colab. Run this to generate a synthetic 5,000-row dataset:",
        "<pre>import pandas as pd\nimport numpy as np\nnp.random.seed(42)\n\nN = 5000\ndf = pd.DataFrame({\n    'date': pd.date_range('2024-01-01', periods=N, freq='3H'),\n    'state': np.random.choice(['Lagos','Abuja','Kano','Ibadan','Port Harcourt'], N, p=[.5,.2,.15,.1,.05]),\n    'item': np.random.choice(['Jollof','Eba','Suya','Amala','Pounded Yam','Bole'], N),\n    'qty': np.random.randint(1, 25, N),\n    'unit_price': np.random.choice([800, 1000, 1200, 1500, 2000], N),\n    'customer_id': np.random.randint(1, 200, N),\n    'channel': np.random.choice(['App','Walk-in','Phone','Web'], N, p=[.4,.3,.2,.1]),\n})\n# Inject some dirt\ndf.loc[np.random.choice(N, 50, replace=False), 'qty'] = np.nan\ndf.loc[np.random.choice(N, 30, replace=False), 'state'] = 'lagos'  # typo\nprint(df.head())\nprint(df.info())</pre>",
        "<strong>Your tasks:</strong>",
        "<strong>1. INSPECT.</strong> Print shape, dtypes, isnull().sum(), describe(), value_counts() for state and channel.",
        "<strong>2. CLEAN.</strong> Standardise state (handle 'lagos' → 'Lagos'). Fill missing qty with the median qty.",
        "<strong>3. ENRICH.</strong> Compute 'revenue' = qty * unit_price. Extract month, weekday, hour from date.",
        "<strong>4. EXPLORE.</strong> Revenue per state. Revenue per channel. Top 10 customers by total revenue.",
        "<strong>5. TIME SERIES.</strong> Resample to monthly total revenue. Plot it (we'll do plotting properly in Module 7).",
        "<strong>6. PIVOT.</strong> Build a pivot_table: rows=state, columns=channel, values=revenue, aggfunc=sum.",
        "<strong>7. INSIGHT.</strong> Which weekday + channel combo has the highest average order value?",
        "<strong>8. SAVE.</strong> Export your cleaned + enriched DataFrame to clean_sales.csv."
      ],
      example: "<pre>df['state'] = df['state'].str.title().replace({'Lagos': 'Lagos'})\ndf['qty'] = df['qty'].fillna(df['qty'].median())\ndf['revenue'] = df['qty'] * df['unit_price']\ndf['month'] = df['date'].dt.to_period('M')\ndf['weekday'] = df['date'].dt.day_name()\n\n# Top 10 customers\ntop_customers = df.groupby('customer_id')['revenue'].sum().nlargest(10)\n\n# Pivot revenue by state x channel\npivot = df.pivot_table(index='state', columns='channel', values='revenue', aggfunc='sum', fill_value=0)\n\n# Best weekday+channel\nbest = (df.groupby(['weekday','channel'])['revenue']\n          .mean().sort_values(ascending=False).head(1))\nprint(best)\n\ndf.to_csv('clean_sales.csv', index=False)</pre>",
      project: {
        deliverable: "Colab notebook with 8 tasks + clean_sales.csv export",
        time: "90 minutes",
        difficulty: "Intermediate",
        skills: ["DataFrame I/O", "Cleaning", "groupby", "pivot_table", "Time series resample", "Data enrichment"]
      },
      takeaway: "You can now do a complete Pandas analysis: load → inspect → clean → enrich → group → pivot → save. The bread-and-butter of a junior data analyst.",
      glossary: []
    }

  ]
},

/* ===================================================================
   MODULE 7 — DATA VISUALIZATION & STORYTELLING
   =================================================================== */
{
  id: "m7",
  title: "Data Visualization & Storytelling",
  icon: "📉",
  color: "#d29922",
  level: "Intermediate",
  weeks: 2,
  summary: "A chart that doesn't tell a story is just decoration. This module makes you the kind of data scientist whose charts make executives nod and act. Tools: Matplotlib, Seaborn, Plotly, Streamlit — all free.",
  prereq: "Modules 1-6.",
  lessons: [

    { id:"m7.l1", type:"concept", title:"1. Why visualisation? The 'show, don't tell' principle", est:"7 min",
      learn: [
        "<strong>A picture is worth a thousand rows of CSV.</strong> Humans process visual patterns 60,000× faster than text. The job of a data scientist is to compress complexity into something a busy stakeholder grasps in 5 seconds.",
        "<strong>3 reasons we visualise:</strong>",
        "<strong>1. Exploration</strong> — understand the data we have. Histograms, scatter plots, box plots. <em>For you, the analyst.</em>",
        "<strong>2. Communication</strong> — explain findings to others. Bar charts, line charts, annotated charts. <em>For the audience.</em>",
        "<strong>3. Persuasion</strong> — drive action. Clear titles, callouts, decision-friendly visuals. <em>For the decision-maker.</em>",
        "<strong>The Anscombe's Quartet lesson</strong> — four datasets with IDENTICAL statistics (mean, variance, correlation, regression line) but totally different shapes. <strong>Statistics alone deceive; visualise.</strong>",
        "<strong>Charles Joseph Minard's 1869 Napoleon map</strong> — widely considered the best chart ever made. Encodes 6 variables (army size, location, direction, temperature, time, geography) in one image. The lesson: a great chart has high information density and one clear story.",
        "<strong>Bad chart hall of fame:</strong><br>• 3D pie charts<br>• Truncated y-axis exaggerating tiny differences<br>• Rainbow palettes (12+ colours)<br>• Charts without titles<br>• Bars that don't start at 0 (line charts may, bars must not)"
      ],
      example: "<strong>The same data, two ways:</strong><br>Table: <em>'Sales were ₦12,400,000 in 2024 and ₦13,800,000 in 2025, with regional breakdowns of...'</em> — eyes glaze over.<br>Chart: a column chart with 2 bars side-by-side, the 2025 bar slightly taller, annotated '+11.3% YoY'. <strong>Instant understanding.</strong>",
      quiz: {
        q: "When are statistics ALONE most likely to deceive you?",
        a: [
          { t:"With small samples", c:false },
          { t:"When the data has unusual shape that the chosen statistic doesn't capture (Anscombe's quartet)", c:true, why:"Yes! Identical mean/SD/r can hide wildly different data shapes. ALWAYS plot." },
          { t:"With round numbers", c:false }
        ]
      },
      takeaway: "Visualisation = compression of complexity. Always plot before concluding. Stats alone deceive (Anscombe).",
      glossary: [
        { term:"EDA", def:"Exploratory Data Analysis. Visualisation-heavy phase to understand your dataset." }
      ]
    },

    { id:"m7.l2", type:"concept", title:"2. Matplotlib basics — the grandfather of Python plotting", est:"10 min",
      learn: [
        "<strong>Matplotlib</strong> is Python's foundational charting library. Most other libraries (Seaborn, Pandas plotting) are built on top of it.",
        "<pre>import matplotlib.pyplot as plt\nplt.plot([1,2,3,4], [10,20,15,25])\nplt.title(\"My first chart\")\nplt.xlabel(\"Quarter\")\nplt.ylabel(\"Revenue (₦M)\")\nplt.show()</pre>",
        "<strong>2 styles of Matplotlib code:</strong>",
        "<strong>Functional (pyplot interface):</strong><pre>plt.figure(figsize=(10, 6))\nplt.bar([\"Lagos\",\"Abuja\",\"Kano\"], [12, 8, 5])\nplt.title(\"Sales by State\")\nplt.show()</pre>Quick and dirty. Good for notebooks.",
        "<strong>Object-Oriented (recommended for production):</strong><pre>fig, ax = plt.subplots(figsize=(10, 6))\nax.bar([\"Lagos\",\"Abuja\",\"Kano\"], [12, 8, 5])\nax.set_title(\"Sales by State\")\nax.set_ylabel(\"₦ Million\")\nfig.savefig(\"sales.png\", dpi=150)</pre>Cleaner for complex multi-panel figures.",
        "<strong>Common chart types in Matplotlib:</strong><pre>plt.plot(x, y)              # line\nplt.bar(x, y)                # vertical bars\nplt.barh(y, x)               # horizontal bars\nplt.scatter(x, y)            # scatter\nplt.hist(values, bins=20)    # histogram\nplt.boxplot(data)            # box plot\nplt.pie(values, labels=...)  # pie</pre>",
        "<strong>Save vs show:</strong> <code>plt.savefig('out.png')</code> saves to file. <code>plt.show()</code> displays.",
        "<strong>From Pandas:</strong> <code>df.plot(kind='bar')</code>, <code>df['col'].plot.hist()</code> — Pandas wraps Matplotlib for one-liners."
      ],
      example: "<pre>import matplotlib.pyplot as plt\nimport numpy as np\n\nstates = ['Lagos','Abuja','Kano','Ibadan','PH']\nsales = [12.4, 8.1, 4.7, 3.2, 2.8]\n\nfig, ax = plt.subplots(figsize=(10, 5))\nbars = ax.bar(states, sales, color='#3fb950', edgecolor='black')\nax.set_title('Q1 2026 Sales by State', fontsize=14, fontweight='bold')\nax.set_ylabel('Revenue (₦M)')\nax.spines['top'].set_visible(False)\nax.spines['right'].set_visible(False)\n# Annotate each bar with its value\nfor bar, val in zip(bars, sales):\n    ax.text(bar.get_x() + bar.get_width()/2, val + 0.2,\n            f'₦{val}M', ha='center')\nplt.tight_layout()\nplt.show()</pre>",
      exercise: {
        steps: 3,
        tool: "Google Colab",
        task: "Plot a bar chart of 5 Nigerian states' populations. Add title, axis labels, and value annotations on each bar."
      },
      quiz: {
        q: "Which Matplotlib code style is recommended for production / multi-panel figures?",
        a: [
          { t:"Functional (plt.bar, plt.title)", c:false, why:"Fine for quick notebooks; ambiguous in multi-axis figures." },
          { t:"Object-Oriented (fig, ax = plt.subplots; ax.bar; ax.set_title)", c:true, why:"Yes! Explicit ax references avoid bugs in complex figures." }
        ]
      },
      takeaway: "Matplotlib is the foundation. pyplot (quick) or OO (fig, ax — production). plt.show / savefig. Pandas wraps for one-liners.",
      glossary: [
        { term:"Matplotlib", def:"Python's foundational plotting library. Powerful, customisable, sometimes verbose." }
      ]
    },

    { id:"m7.l3", type:"concept", title:"3. Seaborn — beautiful charts in one line", est:"10 min",
      learn: [
        "<strong>Seaborn</strong> is built on Matplotlib but designed for statistical visualisation. Default styles are publication-quality. Most data scientists prefer it for quick beautiful plots.",
        "<pre>import seaborn as sns\nimport matplotlib.pyplot as plt\n\nsns.set_theme(style='whitegrid')\nsns.barplot(data=df, x='state', y='revenue')\nplt.show()</pre>",
        "<strong>The 7 essential Seaborn plots:</strong>",
        "<strong>1. sns.histplot(data, x='col')</strong> — histogram with KDE overlay.",
        "<strong>2. sns.boxplot(data, x='cat', y='value')</strong> — box plot showing distribution per category.",
        "<strong>3. sns.violinplot(data, x='cat', y='value')</strong> — like box plot but shows shape.",
        "<strong>4. sns.scatterplot(data, x='a', y='b', hue='cat')</strong> — scatter with colour by category.",
        "<strong>5. sns.lineplot(data, x='date', y='value', hue='group')</strong> — multiple lines.",
        "<strong>6. sns.barplot(data, x='cat', y='value')</strong> — bar chart with confidence intervals!",
        "<strong>7. sns.heatmap(matrix, annot=True)</strong> — correlation matrix, pivot results.",
        "<strong>Faceting (multiple subplots):</strong><pre>sns.relplot(data=df, x='date', y='revenue', col='state', kind='line')\n# one mini-chart per state, side by side</pre>",
        "<strong>Pairplot</strong> for quick EDA on numeric features:<pre>sns.pairplot(df.select_dtypes('number'), hue='category')\n# scatter-plot matrix of every pair</pre>"
      ],
      example: "<pre>import seaborn as sns\nimport matplotlib.pyplot as plt\nimport pandas as pd\n\ndf = pd.read_csv('orders.csv', parse_dates=['date'])\n\nsns.set_theme(style='whitegrid', palette='Set2')\n\n# Box plot: revenue distribution per channel\nfig, ax = plt.subplots(figsize=(10, 5))\nsns.boxplot(data=df, x='channel', y='revenue', ax=ax)\nax.set_title('Revenue Distribution per Channel')\nplt.show()\n\n# Heatmap of correlations\nfig, ax = plt.subplots(figsize=(8, 6))\nsns.heatmap(df.select_dtypes('number').corr(),\n            annot=True, cmap='RdBu_r', center=0, ax=ax)\nax.set_title('Correlation Matrix')\nplt.show()</pre>",
      tryq: "Visualise revenue distribution per channel",
      quiz: {
        q: "Which Seaborn function is best for a quick correlation overview of numeric columns?",
        a: [
          { t:"sns.heatmap(df.corr(), annot=True)", c:true, why:"Yes! Heatmap of correlation matrix with annotations is the standard EDA artifact." },
          { t:"sns.barplot(df)", c:false },
          { t:"sns.pieplot(df)", c:false }
        ]
      },
      takeaway: "Seaborn = beautiful one-liners on Matplotlib. histplot, boxplot, scatter, line, bar, heatmap, pairplot.",
      glossary: [
        { term:"Seaborn", def:"Statistical plotting library built on Matplotlib. Beautiful defaults." }
      ]
    },

    { id:"m7.l4", type:"concept", title:"4. Choosing the right chart — the decision guide", est:"10 min",
      learn: [
        "Module 2 introduced chart types. Now you have Python to make them. Here's the master decision tree:",
        "<strong>QUESTION 1 — What are you showing?</strong>",
        "<strong>A. Comparing categories</strong> → <strong>Bar chart</strong> (vertical for short names, horizontal for long).",
        "<strong>B. Trend over time</strong> → <strong>Line chart</strong>. Multiple series → multi-line with legend.",
        "<strong>C. Part-of-whole composition</strong> → <strong>Stacked bar</strong> (preferred) or <strong>Pie chart</strong> (only if 2-5 slices).",
        "<strong>D. Relationship between two numbers</strong> → <strong>Scatter plot</strong>. Add colour for a 3rd categorical variable.",
        "<strong>E. Distribution of one variable</strong> → <strong>Histogram</strong> or <strong>density plot</strong>.",
        "<strong>F. Distribution comparison across groups</strong> → <strong>Box plot</strong> or <strong>violin plot</strong>.",
        "<strong>G. Geographic data</strong> → <strong>Map</strong>. Folium / Plotly for interactive.",
        "<strong>H. Many variables at once</strong> → <strong>Heatmap</strong> (correlation, pivot table) or <strong>parallel coordinates</strong>.",
        "<strong>I. Flow / sequence</strong> → <strong>Sankey diagram</strong> (advanced).",
        "<strong>J. Hierarchical proportion</strong> → <strong>Treemap</strong>.",
        "<strong>QUESTION 2 — How many groups?</strong>",
        "<strong>1-2 groups:</strong> any chart works.",
        "<strong>3-10:</strong> faceting (small multiples) or careful legend.",
        "<strong>10+:</strong> consider aggregating into 'top N + Other'.",
        "<strong>QUESTION 3 — Is it for exploration or presentation?</strong>",
        "<strong>Exploration:</strong> ugly is fine. Quick. No titles needed.",
        "<strong>Presentation:</strong> polished. Title answers the question. Axes labelled. Sources cited."
      ],
      example: "<strong>Real choice walk-through:</strong><br><em>'Show our Q4 revenue split across regions, comparing this year vs last year.'</em><br>→ Comparison (regions), trend (yearly) → <strong>grouped bar chart</strong> (regions on x-axis, two bars per region for 2024 and 2025) OR a slope chart (showing change). Avoid pie — too many regions.",
      quiz: {
        q: "You want to show the distribution of order values, broken down by 5 product categories. Best chart?",
        a: [
          { t:"5 separate histograms", c:false, why:"Hard to compare." },
          { t:"Box plot (or violin plot) with category on x-axis", c:true, why:"Yes! Box / violin plots compare distributions across categories in one chart." },
          { t:"Pie chart of categories", c:false }
        ]
      },
      takeaway: "Match chart to data question: compare, trend, composition, relationship, distribution, geography. Avoid pie for many slices.",
      glossary: [
        { term:"Small multiples", def:"A grid of small charts, one per category. Often better than one cluttered chart." }
      ]
    },

    { id:"m7.l5", type:"concept", title:"5. Plotly — interactive charts for the web", est:"10 min",
      learn: [
        "<strong>Plotly</strong> creates INTERACTIVE charts: zoom, hover for values, click to filter. Great for dashboards and reports that live in browsers.",
        "<pre>import plotly.express as px\n\nfig = px.bar(df, x='state', y='revenue',\n             color='channel',\n             title='Revenue by State and Channel')\nfig.show()</pre>One line for a chart users can hover and zoom.",
        "<strong>Plotly Express (px)</strong> — high-level API, one function per chart type:<pre>px.line(df, x='date', y='revenue', color='state')\npx.scatter(df, x='qty', y='revenue', size='customers', color='channel')\npx.histogram(df, x='revenue', nbins=30)\npx.box(df, x='channel', y='revenue')\npx.pie(df, values='revenue', names='state')\npx.choropleth(df, locations='iso_code', color='gdp')   # maps</pre>",
        "<strong>Save as HTML</strong> (self-contained, sharable):<pre>fig.write_html('chart.html')</pre>",
        "<strong>Embed in a Streamlit dashboard</strong> (next lesson):<pre>import streamlit as st\nst.plotly_chart(fig)</pre>",
        "<strong>Trade-offs:</strong><br>• Beautiful interactivity → engages users more.<br>• Larger file sizes than static images.<br>• Bigger learning curve for fine-tuning compared to Matplotlib.<br>• Doesn't work in pure-PDF reports."
      ],
      example: "<pre>import plotly.express as px\nimport pandas as pd\n\ndf = pd.read_csv('sales.csv', parse_dates=['date'])\n\n# Interactive line chart: revenue by state over time\nfig = px.line(\n    df.groupby(['date','state'])['revenue'].sum().reset_index(),\n    x='date', y='revenue', color='state',\n    title='Daily Revenue by State'\n)\nfig.update_layout(hovermode='x unified')   # all-state hover at one x-position\nfig.show()\nfig.write_html('revenue_by_state.html')</pre>",
      tryq: "Interactive trend chart",
      quiz: {
        q: "When is Plotly preferred over Matplotlib?",
        a: [
          { t:"Always", c:false, why:"Static reports / publications prefer Matplotlib." },
          { t:"For web dashboards / interactive reports", c:true, why:"Yes! Interactivity (hover, zoom, filter) is Plotly's strength." },
          { t:"For 3D pie charts", c:false }
        ]
      },
      takeaway: "Plotly = interactive web charts. Use Plotly Express for one-line calls. Save as HTML, embed in Streamlit.",
      glossary: [
        { term:"Plotly", def:"Library for interactive web-based charts in Python." },
        { term:"Plotly Express", def:"High-level API for Plotly. One function per chart type." }
      ]
    },

    { id:"m7.l6", type:"concept", title:"6. Streamlit — turn analysis into a free web app", est:"12 min",
      learn: [
        "<strong>Streamlit</strong> turns a Python script into an interactive web app — no HTML, no JavaScript. Deploy free on Streamlit Cloud. Used by Adewale for 9 of his 12 deployed projects.",
        "<strong>Install:</strong> <code>pip install streamlit</code>",
        "<strong>Minimal app (app.py):</strong><pre>import streamlit as st\nimport pandas as pd\n\nst.title(\"My First Dashboard\")\nst.write(\"Welcome to the data!\")\n\ndf = pd.read_csv('sales.csv')\nst.dataframe(df)                          # interactive table\nst.line_chart(df.set_index('date')['revenue'])</pre>",
        "<strong>Run locally:</strong> <code>streamlit run app.py</code> opens at http://localhost:8501",
        "<strong>The Streamlit primitives:</strong><pre>st.title(\"...\")\nst.header(\"...\")\nst.subheader(\"...\")\nst.write(\"any text or object\")            # the magic catch-all\nst.markdown(\"**bold** _italic_ [link](url)\")\nst.image(\"logo.png\")\nst.metric(label=\"Revenue\", value=\"₦12M\", delta=\"+8%\")\nst.dataframe(df)\nst.bar_chart(df)\nst.plotly_chart(fig)\nst.map(df_with_lat_lon)</pre>",
        "<strong>Interactive widgets:</strong><pre>name = st.text_input(\"Your name\")\nage = st.slider(\"Age\", 18, 80, 30)\ncity = st.selectbox(\"City\", [\"Lagos\", \"Abuja\", \"Kano\"])\nclicked = st.button(\"Submit\")\nfile = st.file_uploader(\"Upload CSV\", type=\"csv\")\n\nif clicked:\n    st.success(f\"Hello {name} from {city}!\")</pre>",
        "<strong>Layout:</strong><pre>col1, col2 = st.columns(2)\nwith col1: st.metric(\"Sales\", \"₦12M\")\nwith col2: st.metric(\"Orders\", \"1,234\")\n\nwith st.sidebar:\n    region = st.selectbox(\"Filter by region\", regions)</pre>",
        "<strong>Deploy for FREE:</strong><br>1. Push your app.py + requirements.txt to GitHub.<br>2. Visit <a href='https://share.streamlit.io' target='_blank' style='color:var(--ac)'>share.streamlit.io</a>.<br>3. Sign in with GitHub.<br>4. Click 'New app', select your repo + file.<br>5. Click Deploy. <strong>Your dashboard is live at https://yourname-app.streamlit.app — free forever.</strong>"
      ],
      example: "<pre>import streamlit as st\nimport pandas as pd\nimport plotly.express as px\n\nst.title(\"📊 Nigeria Sales Dashboard\")\n\n# Sidebar filter\nwith st.sidebar:\n    st.header(\"Filters\")\n    states = st.multiselect(\"States\", ['Lagos','Abuja','Kano'], default=['Lagos'])\n\n# Load + filter\ndf = pd.read_csv('sales.csv', parse_dates=['date'])\nfiltered = df[df['state'].isin(states)]\n\n# KPI cards\ncol1, col2, col3 = st.columns(3)\ncol1.metric(\"Total Revenue\", f\"₦{filtered['revenue'].sum():,.0f}\")\ncol2.metric(\"Orders\",        f\"{len(filtered):,}\")\ncol3.metric(\"Avg Order\",     f\"₦{filtered['revenue'].mean():,.0f}\")\n\n# Chart\nst.plotly_chart(\n    px.line(filtered.groupby('date')['revenue'].sum().reset_index(),\n            x='date', y='revenue', title='Daily Revenue Trend')\n)\n\n# Data table\nst.dataframe(filtered.head(100))</pre>",
      exercise: {
        steps: 5,
        tool: "Streamlit Cloud (free)",
        task: "Write the example app.py above. Create a requirements.txt with: streamlit, pandas, plotly. Push to GitHub. Deploy to Streamlit Cloud. Share the URL."
      },
      quiz: {
        q: "What's special about Streamlit compared to Flask / Django?",
        a: [
          { t:"It's faster", c:false },
          { t:"It lets you build a UI in pure Python — no HTML, CSS, JS — perfect for data scientists", c:true, why:"Yes! Streamlit eliminates the front-end barrier for data folks." },
          { t:"It's the only Python web framework", c:false }
        ]
      },
      takeaway: "Streamlit = web apps in pure Python. Free deploy on Streamlit Cloud. Used by 9/12 of Adewale's projects.",
      glossary: [
        { term:"Streamlit", def:"Open-source Python library for building data apps and dashboards in pure Python." }
      ]
    },

    { id:"m7.l7", type:"concept", title:"7. The principles of good charts", est:"10 min",
      learn: [
        "Anyone can produce a chart. <strong>A GREAT chart obeys 8 principles:</strong>",
        "<strong>1. ONE clear message.</strong> Your title should answer one specific question. <em>'Revenue grew 12% YoY'</em> beats <em>'Sales Data'</em>.",
        "<strong>2. Maximise data-ink ratio.</strong> Remove anything that isn't data: thick borders, 3D effects, redundant labels, decorative backgrounds. Edward Tufte's principle.",
        "<strong>3. Sort by value</strong> (not alphabetically) — unless time is on the x-axis. A bar chart of states sorted by revenue is instantly readable.",
        "<strong>4. Bars start at 0; lines may not.</strong> Truncating a bar y-axis lies about proportions. Line charts can use a meaningful range.",
        "<strong>5. Direct labels &gt; legend.</strong> Place labels next to lines/bars when possible — saves eye-jumping to a legend.",
        "<strong>6. Use colour with purpose.</strong> Highlight one thing. Grey out the rest. Avoid rainbow palettes. Use colour-blind safe palettes (ColorBrewer, viridis).",
        "<strong>7. Annotate insights.</strong> A simple text arrow saying <em>'Peak: ₦12M on Dec 24'</em> guides the eye.",
        "<strong>8. Cite the source.</strong> <em>'Source: GTBank monthly summary, Q1 2026'</em> in a footnote. Credibility.",
        "<strong>The chart-checklist before sharing:</strong><br>□ Does the title answer a question?<br>□ Are axes labelled with units?<br>□ Did I sort sensibly?<br>□ Is there extra ink to remove?<br>□ Is there ONE colour highlighting the point?<br>□ Is there a source?"
      ],
      example: "<strong>Before:</strong> a chart titled 'Sales Data' showing rainbow bars in alphabetical order with grid lines, 3D bars, no labels. Stakeholder: <em>'What am I looking at?'</em><br><strong>After:</strong> a chart titled 'Lagos drove 49% of Q1 revenue', bars sorted descending, Lagos highlighted in green, rest grey, value labels on each bar, source cited. Stakeholder: <em>'Got it. We should double down on Lagos.'</em> Action taken. <strong>That's the difference.</strong>",
      quiz: {
        q: "Truncating a bar chart's y-axis from 50 to 100 to make a small difference look big is:",
        a: [
          { t:"Common practice", c:false },
          { t:"Misleading and a violation of chart ethics — bars MUST start at 0", c:true, why:"Yes! Truncated bar y-axes are universally considered deceptive." },
          { t:"Fine if you label it", c:false }
        ]
      },
      takeaway: "Great charts: one message, high data-ink ratio, sorted, bars from 0, direct labels, purposeful colour, annotated, cited.",
      glossary: [
        { term:"Data-ink ratio", def:"Tufte's principle: maximise ink that conveys data, minimise decorative ink." },
        { term:"ColorBrewer / viridis", def:"Colour palettes designed for perceptual clarity and colour-blind safety." }
      ]
    },

    { id:"m7.l8", type:"concept", title:"8. Dashboards — design for the executive", est:"9 min",
      learn: [
        "A <strong>dashboard</strong> is a collection of charts answering the questions a specific audience asks repeatedly.",
        "<strong>The KPI dashboard pattern:</strong>",
        "<strong>Top row:</strong> 3-5 BIG NUMBERS (KPIs). Total revenue, growth %, active users.",
        "<strong>Middle:</strong> 1-2 main trend charts (monthly revenue, weekly signups).",
        "<strong>Bottom:</strong> breakdown charts (by region, by product).",
        "<strong>Always:</strong> last-updated timestamp; filters (date range, region) in a sidebar.",
        "<strong>The 5 rules of dashboard design:</strong>",
        "<strong>1. Know your audience.</strong> CEO dashboard ≠ operations dashboard. Show what THEY need to act on.",
        "<strong>2. Above-the-fold first.</strong> Most important KPIs and the one decision-driving chart in the top half — no scrolling needed.",
        "<strong>3. Comparisons are the point.</strong> 'Revenue ₦12M' is useless. 'Revenue ₦12M (+8% vs last month)' is actionable.",
        "<strong>4. Less is more.</strong> 5 great charts beat 50 mediocre ones. Cut ruthlessly.",
        "<strong>5. Refresh expectations explicitly.</strong> 'Data refreshed every hour' tells viewers what to expect.",
        "<strong>Tools (all free):</strong><br>• <strong>Streamlit</strong> (Python)<br>• <strong>Power BI</strong> (Microsoft free desktop, paid hosting)<br>• <strong>Google Looker Studio</strong> (formerly Data Studio — entirely free)<br>• <strong>Tableau Public</strong> (free for public dashboards)",
        "<strong>For Nigerian context, Google Looker Studio is excellent</strong> — free, drag-and-drop, connects to Google Sheets, embed anywhere."
      ],
      example: "<strong>Adewale's CBT Pro teacher dashboard</strong> has 4 tabs:<br>1. <strong>Class overview</strong> — pass rate, average score, top/bottom students (KPI row + bar chart).<br>2. <strong>Student profiles</strong> — drill into individual students.<br>3. <strong>At-risk thresholds</strong> — students predicted to fail with reasons.<br>4. <strong>Question analysis</strong> — which questions students miss most (helps teacher revisit topics). Each tab answers ONE question a teacher asks. <strong>That's the model.</strong>",
      quiz: {
        q: "What's the single most important rule when designing a dashboard?",
        a: [
          { t:"Use as many colours as possible", c:false },
          { t:"Show what the audience needs to act on — every chart drives a decision", c:true, why:"Yes! A dashboard nobody acts on is dead furniture." },
          { t:"Always include a pie chart", c:false }
        ]
      },
      takeaway: "Dashboards = decision-driving. KPI row + trend + breakdown. Streamlit / Looker Studio / Power BI free.",
      glossary: [
        { term:"KPI", def:"Key Performance Indicator. The number(s) that matter most to the audience." },
        { term:"Dashboard", def:"A collection of related charts answering repeatedly-asked questions." }
      ]
    },

    { id:"m7.l9", type:"concept", title:"9. Storytelling with data — 3-act structure", est:"10 min",
      learn: [
        "<strong>A great analysis tells a story.</strong> Three acts, same as a film. Cole Nussbaumer Knaflic's book <em>'Storytelling with Data'</em> is the bible — and this lesson summarises its core.",
        "<strong>ACT 1 — SETUP.</strong> What's the situation? What were we expecting? Why does this matter NOW?<br><em>'In Q1 we launched our app in 3 new states. We hoped for 10,000 downloads. We tracked weekly metrics.'</em>",
        "<strong>ACT 2 — TENSION.</strong> What did the data reveal? What's the unexpected twist?<br><em>'Lagos overshot to 18,000 downloads. Abuja hit 9,500. But Kano flatlined at 2,200 — far below target. Something is wrong.'</em>",
        "<strong>ACT 3 — RESOLUTION.</strong> Diagnosis + recommendation + ask.<br><em>'Investigation showed Kano's marketing budget was 40% lower than the other two AND the local Hausa-language version was delayed. Recommend: shift ₦5M of marketing to Kano and accelerate Hausa launch. Decision needed by Friday.'</em>",
        "<strong>The 3 mistakes that kill stories:</strong>",
        "<strong>1. Burying the lead.</strong> The most important finding goes in the title and opening sentence. Don't make people scroll.",
        "<strong>2. Showing data without context.</strong> '₦12M revenue' means nothing. 'Q1 revenue: ₦12M, up 8% from Q4 (target: 10%)' is meaningful.",
        "<strong>3. No recommendation.</strong> Analysis without 'so what?' is academic. Always end with <em>'I recommend X. Decision needed by Y.'</em>",
        "<strong>Recommended deck/document structure:</strong><br>Slide 1: TITLE = your main finding (e.g. <em>'Kano expansion missed target by 78%'</em>).<br>Slide 2: Context (what we tried, why).<br>Slide 3: The data (charts).<br>Slide 4: Diagnosis (why).<br>Slide 5: Recommendation + ask (what to do).<br>Total: 5 slides max. Save details for appendix."
      ],
      example: "<strong>Compare two summary lines:</strong><br>BAD: <em>'Q1 sales analysis: revenue grew across most regions...'</em> — vague, unmemorable, no action.<br>GOOD: <em>'Kano expansion missed target by 78%. Increasing marketing spend by ₦5M and accelerating Hausa launch should close the gap in Q2. Decision needed Friday.'</em> — specific finding + recommendation + action ask.",
      quiz: {
        q: "Where should the most important finding go in a deck?",
        a: [
          { t:"Hide it in the middle for suspense", c:false, why:"Stakeholders don't read for entertainment." },
          { t:"Title and first slide — busy people stop reading after 30 seconds", c:true, why:"Yes! 'Pyramid principle' — main point first, supporting details after." },
          { t:"Last slide as a grand reveal", c:false }
        ]
      },
      takeaway: "Setup + tension + resolution. Title is the finding. Always include recommendation + decision ask.",
      glossary: [
        { term:"Pyramid principle", def:"Communication structure: main point first, supporting evidence after. Used by McKinsey, BCG and serious analysts." }
      ]
    },

    { id:"m7.l10", type:"project", title:"10. Module 7 Project — Build a deployed dashboard", est:"120 min",
      learn: [
        "<strong>Mission:</strong> Build a Streamlit dashboard for the Nigerian sales data from Module 6, deploy it to Streamlit Cloud, and share the public URL.",
        "<strong>Prerequisites:</strong> A GitHub account (Module 1 lesson 1) and the clean_sales.csv from Module 6 Project.",
        "<strong>Step 1.</strong> Create a new GitHub repo named 'sales-dashboard'.",
        "<strong>Step 2.</strong> Add 3 files:",
        "<strong>app.py:</strong><pre>import streamlit as st\nimport pandas as pd\nimport plotly.express as px\n\nst.set_page_config(page_title='Sales Dashboard', layout='wide')\nst.title('📊 Nigerian Sales Dashboard')\n\n@st.cache_data\ndef load_data():\n    df = pd.read_csv('clean_sales.csv', parse_dates=['date'])\n    return df\n\ndf = load_data()\n\nwith st.sidebar:\n    st.header('Filters')\n    states = st.multiselect('State', df['state'].unique(), default=df['state'].unique())\n    channels = st.multiselect('Channel', df['channel'].unique(), default=df['channel'].unique())\n    date_range = st.date_input('Date range', [df['date'].min(), df['date'].max()])\n\nfiltered = df[\n    (df['state'].isin(states)) &amp;\n    (df['channel'].isin(channels)) &amp;\n    (df['date'] &gt;= pd.Timestamp(date_range[0])) &amp;\n    (df['date'] &lt;= pd.Timestamp(date_range[1]))\n]\n\n# KPI row\nc1, c2, c3, c4 = st.columns(4)\nc1.metric('Total revenue', f\"₦{filtered['revenue'].sum():,.0f}\")\nc2.metric('Orders', f\"{len(filtered):,}\")\nc3.metric('Avg order value', f\"₦{filtered['revenue'].mean():,.0f}\")\nc4.metric('States covered', f\"{filtered['state'].nunique()}\")\n\n# Trend\nst.subheader('Daily revenue trend')\ndaily = filtered.groupby('date')['revenue'].sum().reset_index()\nst.plotly_chart(px.line(daily, x='date', y='revenue'), use_container_width=True)\n\n# Breakdowns\nc5, c6 = st.columns(2)\nwith c5:\n    st.subheader('Revenue by state')\n    state_rev = filtered.groupby('state')['revenue'].sum().sort_values(ascending=False).reset_index()\n    st.plotly_chart(px.bar(state_rev, x='state', y='revenue'), use_container_width=True)\nwith c6:\n    st.subheader('Revenue by channel')\n    ch_rev = filtered.groupby('channel')['revenue'].sum().reset_index()\n    st.plotly_chart(px.pie(ch_rev, values='revenue', names='channel'), use_container_width=True)\n\nst.subheader('Raw data')\nst.dataframe(filtered.head(100))</pre>",
        "<strong>requirements.txt:</strong><pre>streamlit\npandas\nplotly</pre>",
        "<strong>clean_sales.csv:</strong> from Module 6 Project (or regenerate).",
        "<strong>Step 3.</strong> Push all 3 files to GitHub.",
        "<strong>Step 4.</strong> Go to <a href='https://share.streamlit.io' target='_blank' style='color:var(--ac)'>share.streamlit.io</a>. Sign in with GitHub. Click 'New app'. Select your repo. Deploy.",
        "<strong>Step 5.</strong> In ~2 minutes, you have a live URL like <code>https://yourname-sales-dashboard.streamlit.app</code>. <strong>This is portfolio-worthy.</strong> Share on LinkedIn, add to your CV."
      ],
      example: "<strong>Stretch goals (optional, impress recruiters):</strong><br>• Add a download button: <code>st.download_button('Download CSV', filtered.to_csv(), 'export.csv')</code><br>• Use <code>st.tabs(['Overview','Details','Forecast'])</code> for multi-tab UX.<br>• Add a simple forecast line using Pandas' .rolling and a linear regression.<br>• Theme it with <code>st.set_page_config(page_icon='⚡')</code>.",
      project: {
        deliverable: "Deployed Streamlit URL + GitHub repo",
        time: "2 hours",
        difficulty: "Intermediate",
        skills: ["Pandas", "Plotly", "Streamlit", "GitHub", "Deployment", "Dashboard design"]
      },
      takeaway: "You now have a LIVE deployed data app. Share the URL on LinkedIn. This is the kind of project that gets you interviews.",
      glossary: []
    }

  ]
});

window.CURRICULUM_PART = 3;
