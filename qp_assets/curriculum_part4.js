/* =====================================================================
   QueryPilot v9 — Curriculum Data (Part 4: Module 8 + Capstone)
   Machine Learning Foundations + Build & Deploy
   ===================================================================== */

window.CURRICULUM.push(

/* ===================================================================
   MODULE 8 — MACHINE LEARNING FOUNDATIONS
   No PhD. Practical, honest, deployable. Mirrors Adewale's 12-project portfolio.
   =================================================================== */
{
  id: "m8",
  title: "Machine Learning Foundations",
  icon: "🤖",
  color: "#bc8cff",
  level: "Intermediate → Advanced",
  weeks: 5,
  summary: "Machine learning is the most-hyped corner of data science. This module strips away the magic, teaches honest fundamentals, and gets you deploying real models — using the same Scikit-learn library Adewale used in 8 of his 12 deployed projects.",
  prereq: "Modules 1-7. Especially Python (M5), Pandas (M6), Statistics (M4).",
  lessons: [

    { id:"m8.l1", type:"concept", title:"1. What ML really is — learning rules from examples", est:"10 min",
      learn: [
        "<strong>Traditional programming:</strong> a human writes rules. <code>If status='unpaid' AND due_date &lt; today, flag overdue</code>.",
        "<strong>Machine learning:</strong> the computer LEARNS rules from examples. You give it 10,000 past loan applications labelled 'defaulted' or 'repaid', and the algorithm figures out the rules that distinguish them.",
        "<strong>The fundamental flip:</strong> Instead of writing logic, you collect examples. The model is the logic — derived statistically.",
        "<strong>3 broad types of ML:</strong>",
        "<strong>1. Supervised learning</strong> — labelled examples. <em>'These 1,000 customers churned, these 9,000 didn't. Predict for new customers.'</em> Most business ML.",
        "<strong>2. Unsupervised learning</strong> — no labels, find structure. <em>'Cluster customers into segments.'</em>",
        "<strong>3. Reinforcement learning</strong> — agent learns by trial and error. <em>'Game AI, robotics, ad-bidding.'</em> Specialised.",
        "<strong>Within supervised:</strong><br>• <strong>Classification</strong> — predict a category (spam/not spam, default/repay, fraud/legit).<br>• <strong>Regression</strong> — predict a number (house price, sales forecast, age estimate).",
        "<strong>The ML mindset:</strong> The model is NOT magic. It's pattern-fitting. If your past data has biased patterns, your model will replicate them. Garbage in, garbage out.",
        "<strong>Adewale's 12 deployed ML projects breakdown:</strong><br>• 8 classification (fraud, churn, at-risk, promotion, fake news)<br>• 2 regression (burnout rate, income)<br>• 2 dashboards (no ML — just analytics)"
      ],
      example: "<strong>Concrete example — spam detection:</strong><br><strong>Traditional approach:</strong> human writes 100 rules ('contains \"won lottery\"', 'has &gt; 5 exclamation marks', 'no sender name'). Updates rules constantly as spammers evolve.<br><strong>ML approach:</strong> show 10,000 emails labelled spam/not-spam. Algorithm learns its own 100,000 rules from word patterns. Updates by retraining on new data. <strong>Wins because it adapts.</strong>",
      quiz: {
        q: "You want to predict which customers will churn next month. What ML type?",
        a: [
          { t:"Unsupervised clustering", c:false, why:"That would just group similar customers — doesn't predict churn." },
          { t:"Supervised classification — labelled past data of churned vs retained", c:true, why:"Yes! Binary classification trained on labelled history is the textbook approach." },
          { t:"Reinforcement learning", c:false, why:"Overkill — RL is for sequential decision-making." }
        ]
      },
      takeaway: "ML = learning rules from examples. Supervised (labelled), unsupervised (find structure), reinforcement (trial+error). Most business ML = supervised.",
      glossary: [
        { term:"Supervised learning", def:"Learning from labelled examples to predict the label of new inputs." },
        { term:"Classification", def:"Predicting a category. Binary (yes/no) or multi-class." },
        { term:"Regression", def:"Predicting a continuous number." }
      ]
    },

    { id:"m8.l2", type:"concept", title:"2. The ML workflow — 7 stages", est:"12 min",
      learn: [
        "Every ML project follows the same skeleton. Memorise it — every job interview tests it.",
        "<strong>Stage 1 — Define the question.</strong> What are you predicting? For whom? Why? <em>'Predict which fintech customers will default in 30 days, for the credit team, to decide who gets loans.'</em>",
        "<strong>Stage 2 — Get the data.</strong> Pull historical examples WITH the outcome (label) you want to predict. <em>'2 years of loan applications + whether they defaulted.'</em>",
        "<strong>Stage 3 — Clean & explore (EDA).</strong> Missing values, outliers, distributions. Module 6 territory.",
        "<strong>Stage 4 — Feature engineering.</strong> Transform raw columns into features the model can use. <em>'Age → age_group. Date → days_since_signup. Phone → country code.'</em> Often the most impactful stage.",
        "<strong>Stage 5 — Split data, train model.</strong> Hold out 20-30% as a TEST SET the model never sees during training. Train on the remaining 70-80%.",
        "<strong>Stage 6 — Evaluate honestly.</strong> Measure on the test set. Report accuracy, precision, recall, F1, AUC — not just one number. Compare to a baseline (random guess, majority-class).",
        "<strong>Stage 7 — Deploy & monitor.</strong> Wrap the model in a Streamlit app or API. Monitor for performance drift (the world changes; models go stale).",
        "<strong>Honest disclosure:</strong> Stages 2-4 take 80% of the time. Stage 5 takes 1 minute (Scikit-learn). Movies make ML look like Stage 5. The job is mostly the other 6 stages.",
        "<strong>Iteration:</strong> You'll loop back many times. Bad results → revisit features → retrain. Bad deployment → revisit problem definition."
      ],
      example: "<strong>Walk-through — Bank Customer Churn (one of Adewale's projects):</strong><br>1. Question: predict churn 30 days ahead.<br>2. Data: 2 years of customer activity + churn flag.<br>3. EDA: 12% churn rate. Mostly young customers. Tenure matters.<br>4. Features: transaction frequency, balance changes, last login, tenure, region.<br>5. Train: gradient boosting on 70% (7,000 customers).<br>6. Evaluate on 30% (3,000 customers): F1 = 0.609, AUC = 0.868. Better than baseline.<br>7. Deploy: Streamlit app at <code>adewale-bank-customer-churn-prediction.streamlit.app</code>.",
      quiz: {
        q: "Why do we hold out a test set the model never sees during training?",
        a: [
          { t:"To save computing power", c:false },
          { t:"To get an honest estimate of how the model will perform on NEW data — preventing overfitting illusions", c:true, why:"Yes! Test set ≈ real-world performance. Skipping it = lying to yourself." },
          { t:"Because Scikit-learn requires it", c:false }
        ]
      },
      takeaway: "7 stages: define → get → clean → engineer → split-train → evaluate → deploy. 80% of time on data, not algorithms.",
      glossary: [
        { term:"Feature engineering", def:"Transforming raw data into informative inputs for a model." },
        { term:"Train/test split", def:"Holding out part of the data to evaluate model performance fairly." }
      ]
    },

    { id:"m8.l3", type:"concept", title:"3. Train/test split & cross-validation", est:"10 min",
      learn: [
        "<strong>The cardinal rule of ML:</strong> evaluate on data the model HAS NEVER SEEN. Otherwise you measure memorisation, not learning.",
        "<strong>Simple split (most common):</strong><pre>from sklearn.model_selection import train_test_split\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y,\n    test_size=0.2,        # 20% for test\n    random_state=42,      # reproducibility\n    stratify=y            # preserve class balance\n)</pre>",
        "<strong>Why stratify=y?</strong> If your data is 90% non-churn 10% churn, a random split might give the test set only 5% churn — distorting your metric. Stratify preserves the original class ratio.",
        "<strong>K-fold cross-validation</strong> — more robust:<pre>from sklearn.model_selection import cross_val_score\nscores = cross_val_score(model, X, y, cv=5)\nprint(f\"Mean accuracy: {scores.mean():.3f} ± {scores.std():.3f}\")</pre>The data is split into 5 folds; each fold takes a turn as test set; results averaged. <strong>More reliable when data is limited.</strong>",
        "<strong>Time-series data is SPECIAL.</strong> You CANNOT random-split it. The future must NEVER leak into the past. Use <code>TimeSeriesSplit</code> instead:<pre>from sklearn.model_selection import TimeSeriesSplit\ntscv = TimeSeriesSplit(n_splits=5)</pre>",
        "<strong>3-way split for hyperparameter tuning:</strong> Train (60%) → Validation (20%) → Test (20%). Tune on validation. Final evaluation ONCE on test.",
        "<strong>Common mistake:</strong> peeking at the test set during model development. If you tune to the test set, your test set is no longer 'unseen' — and you're back to lying to yourself."
      ],
      example: "<pre>from sklearn.model_selection import train_test_split, cross_val_score\nfrom sklearn.ensemble import RandomForestClassifier\n\nX = df[['age','tenure','balance','txn_count']]\ny = df['churned']\n\n# Stratified split\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.25, random_state=42, stratify=y\n)\n\n# 5-fold CV on training set\nmodel = RandomForestClassifier(random_state=42)\nscores = cross_val_score(model, X_train, y_train, cv=5, scoring='f1')\nprint(f\"CV F1: {scores.mean():.3f} ± {scores.std():.3f}\")\n\n# Final fit + test\nmodel.fit(X_train, y_train)\nprint(f\"Test F1: {f1_score(y_test, model.predict(X_test)):.3f}\")</pre>",
      quiz: {
        q: "You have 1 year of daily sales data and want to predict tomorrow's sales. Which split?",
        a: [
          { t:"Random train_test_split", c:false, why:"Leaks future into past — overly optimistic." },
          { t:"TimeSeriesSplit — training set always EARLIER than test set", c:true, why:"Yes! Time-aware splitting is non-negotiable for forecasting." },
          { t:"No split needed", c:false }
        ]
      },
      takeaway: "Train/test split: ALWAYS hold out. stratify for imbalanced classes. cross_val_score for robustness. TimeSeriesSplit for forecasting. Never peek at test.",
      glossary: [
        { term:"Cross-validation", def:"Evaluating a model on multiple train/test splits and averaging for robustness." },
        { term:"Stratification", def:"Preserving class proportions when splitting." }
      ]
    },

    { id:"m8.l4", type:"concept", title:"4. Linear regression — the gateway model", est:"12 min",
      learn: [
        "Module 4 covered the theory. Now let's CODE one.",
        "<pre>from sklearn.linear_model import LinearRegression\nimport pandas as pd\n\n# X = predictors (DataFrame). y = target (Series).\nX = df[['ad_spend', 'season_index', 'price']]\ny = df['revenue']\n\nmodel = LinearRegression()\nmodel.fit(X, y)\n\nprint('Slopes:', model.coef_)         # impact per feature\nprint('Intercept:', model.intercept_)  # baseline\nprint('R²:', model.score(X, y))        # fit quality (training)\n\n# Predict\nnew_input = [[150000, 1.2, 1500]]   # one new observation\nprint('Predicted revenue:', model.predict(new_input))</pre>",
        "<strong>Interpreting coefficients:</strong> if <code>ad_spend</code>'s coefficient is 2.3, it means: <em>'Holding other features constant, ₦1 extra ad spend predicts ₦2.30 more revenue.'</em> Powerful for business communication.",
        "<strong>Always check assumptions:</strong> linearity (plot y vs each X), residuals roughly normal (plot residual histogram), no extreme outliers, multicollinearity low.",
        "<strong>When to use linear regression:</strong><br>• Continuous numeric target.<br>• Roughly linear relationships.<br>• You want interpretability (coefficients have meaning).<br>• Baseline for any regression problem (always try first).",
        "<strong>When NOT to:</strong><br>• Highly non-linear relationships → tree models (Lesson 6).<br>• Binary target → logistic regression (Lesson 5).<br>• Hundreds of correlated features → use ridge / lasso (regularised variants).",
        "<strong>Pro tip:</strong> Always scale your features (<code>StandardScaler</code>) before linear models so coefficients are comparable across features of different units."
      ],
      example: "<pre>from sklearn.linear_model import LinearRegression\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import mean_absolute_error, r2_score\nimport pandas as pd\n\ndf = pd.read_csv('housing.csv')\nX = df[['bedrooms','bathrooms','sqft','location_score']]\ny = df['price']\n\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42)\nmodel = LinearRegression().fit(Xtr, ytr)\npreds = model.predict(Xte)\n\nprint(f\"R²:  {r2_score(yte, preds):.3f}\")\nprint(f\"MAE: ₦{mean_absolute_error(yte, preds):,.0f}\")\n\n# Coefficients tell the business story\nfor name, coef in zip(X.columns, model.coef_):\n    print(f\"{name}: ₦{coef:+,.0f} per unit\")</pre>",
      tryq: "Linear regression to predict house prices",
      quiz: {
        q: "Your linear regression's R² = 0.85 on training but 0.45 on test. What's likely?",
        a: [
          { t:"Test set is too small", c:false },
          { t:"Overfitting — model memorised training data, doesn't generalise", c:true, why:"Yes! Big training-vs-test gap = overfitting. Try regularisation or simpler model." },
          { t:"The model is perfect", c:false }
        ]
      },
      takeaway: "LinearRegression.fit(X,y).predict. Coefficients = effect per unit. Use as baseline. Watch for overfitting gap.",
      glossary: [
        { term:"Coefficient", def:"In a linear model, the slope for one feature — how much y changes per unit change in that feature." },
        { term:"Overfitting", def:"Model memorises training data, fails on new data." }
      ]
    },

    { id:"m8.l5", type:"concept", title:"5. Logistic regression — binary classification baseline", est:"11 min",
      learn: [
        "Despite the name, <strong>logistic regression is for CLASSIFICATION</strong>, not regression. It predicts the PROBABILITY of a class (0 to 1).",
        "<pre>from sklearn.linear_model import LogisticRegression\n\nmodel = LogisticRegression(max_iter=1000)\nmodel.fit(X_train, y_train)\n\n# Predictions\npreds = model.predict(X_test)              # class: 0 or 1\nprobs = model.predict_proba(X_test)[:, 1]  # probability of class 1</pre>",
        "<strong>How it works:</strong> The model computes a weighted sum of features, then squashes it to [0,1] using the sigmoid function. If output &gt; 0.5 → class 1, else class 0.",
        "<strong>Threshold tuning matters!</strong> Default is 0.5, but for imbalanced problems you may want 0.3 (catch more positives) or 0.7 (only flag confident cases). Tune based on business cost of false positives vs false negatives.",
        "<strong>Interpreting coefficients</strong> (slightly trickier — they're log-odds):<pre>import numpy as np\n# odds_ratio = exp(coefficient)\nfor name, coef in zip(X.columns, model.coef_[0]):\n    print(f\"{name}: odds ratio {np.exp(coef):.2f}\")\n# odds ratio &gt; 1 → feature increases probability of class 1\n# odds ratio &lt; 1 → feature decreases it</pre>",
        "<strong>Real use cases:</strong> spam vs ham, fraud vs legit, churn vs stay, default vs repay, recovered vs not.",
        "<strong>Strengths:</strong> Fast, interpretable, good baseline, gives probabilities. Adewale's at-risk student predictor uses this concept.",
        "<strong>Weaknesses:</strong> Linear decision boundary. For complex non-linear data, use trees / boosting / neural nets."
      ],
      example: "<pre>from sklearn.linear_model import LogisticRegression\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import classification_report, roc_auc_score\n\nX = df[['age','tenure','balance','txn_freq']]\ny = df['churned']\n\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)\n\n# Always scale features for logistic regression\nscaler = StandardScaler().fit(Xtr)\nXtr_s = scaler.transform(Xtr)\nXte_s = scaler.transform(Xte)\n\nmodel = LogisticRegression(max_iter=1000, class_weight='balanced')\nmodel.fit(Xtr_s, ytr)\n\nprint(classification_report(yte, model.predict(Xte_s)))\nprobs = model.predict_proba(Xte_s)[:, 1]\nprint(f\"AUC: {roc_auc_score(yte, probs):.3f}\")</pre>",
      tryq: "Predict customer churn with logistic regression",
      quiz: {
        q: "Why use <code>class_weight='balanced'</code> in logistic regression?",
        a: [
          { t:"It speeds up training", c:false },
          { t:"For imbalanced data — gives more weight to the minority class so the model doesn't ignore it", c:true, why:"Yes! Without it, on 95%-no/5%-yes data, the model can score 95% accuracy by always predicting 'no'." },
          { t:"It's required by sklearn", c:false }
        ]
      },
      takeaway: "LogisticRegression for binary classification. Scale features. predict_proba for probabilities. class_weight='balanced' for imbalance.",
      glossary: [
        { term:"Logistic regression", def:"Despite name, a binary classification model. Outputs probabilities." },
        { term:"Class imbalance", def:"When one class is much rarer than others (e.g. 1% fraud, 99% legit). Requires special handling." }
      ]
    },

    { id:"m8.l6", type:"concept", title:"6. Decision trees & random forests — non-linear power", est:"12 min",
      learn: [
        "Trees split data into branches based on feature thresholds. <em>'Is age &gt; 30? If yes, is income &gt; ₦100k? If yes, ...'</em> Series of yes/no questions.",
        "<strong>Decision tree</strong> — single tree, fast, interpretable, but prone to overfitting.",
        "<strong>Random forest</strong> — many trees (typically 100-500), each trained on a random sample of data and features. Predictions averaged (regression) or majority-voted (classification). <strong>The Swiss army knife of ML.</strong>",
        "<pre>from sklearn.ensemble import RandomForestClassifier\n\nmodel = RandomForestClassifier(\n    n_estimators=200,         # how many trees\n    max_depth=10,             # max depth per tree (limits overfitting)\n    min_samples_leaf=5,       # don't split nodes with &lt;5 samples\n    random_state=42,\n    n_jobs=-1                  # use all CPU cores\n)\nmodel.fit(X_train, y_train)</pre>",
        "<strong>Feature importance</strong> — RFs tell you which features mattered:<pre>importances = pd.Series(model.feature_importances_, index=X.columns)\nimportances.sort_values(ascending=False).head(10).plot.barh()</pre>The single most useful diagnostic for any ML model.",
        "<strong>Strengths:</strong><br>• Handles non-linear relationships automatically.<br>• No need to scale features.<br>• Robust to outliers.<br>• Built-in feature importance.<br>• Adewale used RF in 6 of his 12 projects (Insurance Claim, Yakub Promotion, Student At-Risk, Income Level, etc.).",
        "<strong>Weaknesses:</strong><br>• Less interpretable than linear (though SHAP fixes this).<br>• Can still overfit if depth is unlimited.<br>• Slower than linear on huge data.",
        "<strong>When to use:</strong> Default choice for tabular data (rows × columns). If unsure what model to try, start here."
      ],
      example: "<pre>from sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import train_test_split, cross_val_score\nfrom sklearn.metrics import classification_report\nimport pandas as pd\n\nX = df[['age','tenure','balance','txn_freq','last_login_days']]\ny = df['churned']\n\nXtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, stratify=y, random_state=42)\n\nmodel = RandomForestClassifier(n_estimators=300, max_depth=12,\n                               class_weight='balanced', random_state=42, n_jobs=-1)\nmodel.fit(Xtr, ytr)\n\nprint(classification_report(yte, model.predict(Xte)))\n\n# Feature importance\nimp = pd.Series(model.feature_importances_, index=X.columns)\nprint(imp.sort_values(ascending=False))</pre>",
      tryq: "Random forest classifier for churn",
      quiz: {
        q: "When is Random Forest a great default choice?",
        a: [
          { t:"For text or image data", c:false, why:"Use neural networks / transformers for those." },
          { t:"For tabular data (rows × columns) — handles non-linearity, no scaling needed, gives feature importance", c:true, why:"Yes! RF is the bread-and-butter of tabular ML." },
          { t:"Only for binary classification", c:false }
        ]
      },
      takeaway: "Random forests = ensemble of trees. Non-linear, no scaling, feature importance. Default for tabular data.",
      glossary: [
        { term:"Random Forest", def:"Ensemble of decision trees, each trained on random subsets. Robust, interpretable." },
        { term:"Feature importance", def:"How much each feature contributes to predictions. Crucial for explaining models." }
      ]
    },

    { id:"m8.l7", type:"concept", title:"7. Gradient boosting & XGBoost — competition-grade", est:"10 min",
      learn: [
        "<strong>Gradient Boosting</strong> builds trees SEQUENTIALLY, each one correcting the errors of the previous. <strong>State-of-the-art for tabular data.</strong> Wins most Kaggle competitions.",
        "<strong>Three popular implementations:</strong>",
        "<strong>1. Scikit-learn's GradientBoostingClassifier</strong> — built-in, simple.",
        "<strong>2. XGBoost</strong> — fastest, most popular. Adewale's TruthLens fake-news detector uses this.",
        "<strong>3. LightGBM</strong> — Microsoft's version, often faster for huge data.",
        "<pre>from sklearn.ensemble import GradientBoostingClassifier\n\nmodel = GradientBoostingClassifier(\n    n_estimators=200,      # number of trees\n    max_depth=5,           # shallower than RF (typically 3-7)\n    learning_rate=0.1,     # how much each tree corrects (lower = slower, often better)\n    random_state=42\n)\nmodel.fit(X_train, y_train)</pre>",
        "<strong>XGBoost example:</strong><pre>import xgboost as xgb\n\nmodel = xgb.XGBClassifier(\n    n_estimators=300,\n    max_depth=6,\n    learning_rate=0.1,\n    use_label_encoder=False,\n    eval_metric='logloss',\n    random_state=42\n)\nmodel.fit(X_train, y_train)</pre>",
        "<strong>Hyperparameter tuning matters a lot</strong> — the difference between OK and great results. Key knobs: <code>n_estimators</code>, <code>learning_rate</code>, <code>max_depth</code>. Use GridSearchCV or Optuna.",
        "<strong>Strengths:</strong><br>• Best-in-class accuracy on tabular data.<br>• Handles missing values natively (XGBoost).<br>• Feature importance.",
        "<strong>Weaknesses:</strong><br>• Slower to train than RF.<br>• Many hyperparameters to tune.<br>• Easier to overfit if learning_rate too high.",
        "<strong>Rule of thumb:</strong> Use Random Forest as baseline. If accuracy matters, upgrade to XGBoost. If interpretability matters more, stick with RF + SHAP."
      ],
      example: "<pre>from sklearn.ensemble import GradientBoostingClassifier\nfrom sklearn.metrics import classification_report, roc_auc_score\n\nmodel = GradientBoostingClassifier(\n    n_estimators=200, max_depth=5, learning_rate=0.05, random_state=42\n)\nmodel.fit(X_train, y_train)\n\nprobs = model.predict_proba(X_test)[:, 1]\nprint(f\"AUC: {roc_auc_score(y_test, probs):.3f}\")\nprint(classification_report(y_test, model.predict(X_test)))</pre>",
      tryq: "Gradient boosting for prediction",
      quiz: {
        q: "Why does Gradient Boosting often win competitions on tabular data?",
        a: [
          { t:"It uses neural networks internally", c:false, why:"No — it uses sequential decision trees." },
          { t:"Sequential trees each correct previous errors, building powerful ensembles", c:true, why:"Yes! Each tree is small but the sequence is highly accurate." },
          { t:"It's the only ML algorithm Kaggle allows", c:false }
        ]
      },
      takeaway: "Gradient Boosting / XGBoost = state-of-the-art for tabular. Sequential error-correcting trees. Tune n_estimators, learning_rate, max_depth.",
      glossary: [
        { term:"Gradient Boosting", def:"Ensemble method building trees sequentially, each fitting the errors of the previous." },
        { term:"XGBoost", def:"Popular fast implementation of gradient boosting. Industry standard for tabular ML." }
      ]
    },

    { id:"m8.l8", type:"concept", title:"8. Evaluation metrics — beyond accuracy", est:"12 min",
      learn: [
        "<strong>Accuracy is the most overrated metric in ML.</strong> Knowing why is the difference between a junior and a senior data scientist.",
        "<strong>The 99% accuracy trap:</strong> on a fraud dataset that's 99% legit and 1% fraud, predicting 'always legit' gets 99% accuracy — and is useless. <strong>Use the right metric for the problem.</strong>",
        "<strong>For classification — the confusion matrix:</strong><pre>              Predicted: NO    Predicted: YES\nActual: NO    True Negative   False Positive\nActual: YES   False Negative  True Positive</pre>",
        "<strong>Key metrics:</strong>",
        "<strong>Accuracy</strong> = (TP + TN) / total. Beware imbalance.",
        "<strong>Precision</strong> = TP / (TP + FP). <em>'Of the cases I flagged, what fraction were actually positive?'</em> Use when false positives are costly (spam filter — false positive = important email lost).",
        "<strong>Recall (Sensitivity)</strong> = TP / (TP + FN). <em>'Of all actual positives, what fraction did I catch?'</em> Use when false negatives are costly (cancer screening — false negative = missed cancer).",
        "<strong>F1-score</strong> = harmonic mean of precision and recall. Balances both. Default for imbalanced classification.",
        "<strong>AUC-ROC</strong> = probability that the model ranks a random positive higher than a random negative. 0.5 = random, 1.0 = perfect. Threshold-independent.",
        "<strong>For regression:</strong>",
        "<strong>MAE (Mean Absolute Error)</strong> — average absolute difference. Same units as target. Easy to interpret.",
        "<strong>RMSE (Root Mean Squared Error)</strong> — penalises big errors more.",
        "<strong>R²</strong> — fraction of variance explained (Module 4).",
        "<strong>MAPE (Mean Absolute Percentage Error)</strong> — error as a % of true value. Beware when true value is near 0."
      ],
      example: "<pre>from sklearn.metrics import (classification_report, confusion_matrix,\n                              precision_score, recall_score, f1_score, roc_auc_score)\n\npreds = model.predict(X_test)\nprobs = model.predict_proba(X_test)[:, 1]\n\nprint(confusion_matrix(y_test, preds))\nprint(classification_report(y_test, preds))\nprint(f\"AUC: {roc_auc_score(y_test, probs):.3f}\")\n\n# Threshold tuning — try 0.3 instead of 0.5\nimport numpy as np\npreds_low_threshold = (probs &gt;= 0.3).astype(int)\nprint(\"At threshold 0.3:\")\nprint(f\"Precision: {precision_score(y_test, preds_low_threshold):.3f}\")\nprint(f\"Recall:    {recall_score(y_test, preds_low_threshold):.3f}\")</pre>",
      quiz: {
        q: "You're building a model to detect cancer. False negatives (missing cancer) are catastrophic. False positives (extra tests) are annoying but safe. What metric do you optimise for?",
        a: [
          { t:"Precision", c:false, why:"Precision minimises false positives — wrong priority here." },
          { t:"Recall — catching every true cancer matters most", c:true, why:"Yes! Recall = TP/(TP+FN). High recall = few false negatives = few missed cancers." },
          { t:"Accuracy", c:false, why:"Cancer is rare → 99% accuracy by always predicting healthy." }
        ]
      },
      takeaway: "Accuracy is overrated. Use precision (cost of false positives) or recall (cost of false negatives). F1 balances. AUC for thresholds. MAE/RMSE for regression.",
      glossary: [
        { term:"Precision", def:"TP/(TP+FP). Of predicted positives, how many were correct." },
        { term:"Recall", def:"TP/(TP+FN). Of actual positives, how many were caught." },
        { term:"F1-score", def:"Harmonic mean of precision and recall. Balanced metric for imbalanced classes." },
        { term:"AUC-ROC", def:"Area Under ROC Curve. Probability model ranks random positive above random negative." }
      ]
    },

    { id:"m8.l9", type:"concept", title:"9. Overfitting & regularisation", est:"10 min",
      learn: [
        "<strong>Overfitting:</strong> your model memorises training data but fails on new data. The #1 mistake in ML.",
        "<strong>Symptoms:</strong> training accuracy 99%, test accuracy 65%. Huge gap.",
        "<strong>Why it happens:</strong> the model is too complex for the available data. It learns noise in addition to signal.",
        "<strong>5 ways to fight overfitting:</strong>",
        "<strong>1. More data.</strong> The most effective cure. 10× more data often fixes overfitting better than any algorithm change.",
        "<strong>2. Simpler model.</strong> Fewer features. Less depth. Fewer parameters.",
        "<strong>3. Regularisation.</strong> Penalise large weights. <code>Ridge</code> (L2) shrinks; <code>Lasso</code> (L1) zeroes out features.",
        "<pre>from sklearn.linear_model import Ridge, Lasso\nRidge(alpha=1.0)    # alpha = regularisation strength\nLasso(alpha=0.1)    # zeroes out unhelpful features</pre>",
        "<strong>4. Early stopping</strong> (for iterative algorithms — boosting, neural nets): stop training when validation score stops improving.",
        "<strong>5. Cross-validation tuning</strong>: pick hyperparameters that generalise, not those that win training scores.",
        "<strong>For trees: limit complexity.</strong><pre>RandomForestClassifier(max_depth=10, min_samples_leaf=5)</pre>",
        "<strong>Underfitting</strong> (opposite problem): model too simple, can't learn even training patterns. Training and test both poor.",
        "<strong>The sweet spot:</strong> model complex enough to capture real patterns, simple enough to ignore noise. Find it with cross-validation."
      ],
      example: "<pre># Diagnose overfitting with a learning curve\nfrom sklearn.model_selection import learning_curve\nimport matplotlib.pyplot as plt\n\ntrain_sizes, train_scores, val_scores = learning_curve(\n    model, X, y, cv=5, train_sizes=[.1,.3,.5,.7,1.0]\n)\nplt.plot(train_sizes, train_scores.mean(axis=1), label='Train')\nplt.plot(train_sizes, val_scores.mean(axis=1), label='Validation')\nplt.legend(); plt.xlabel('Training samples'); plt.ylabel('Score')\nplt.show()\n\n# Big gap = overfitting. Both low = underfitting. Both high + close = good!</pre>",
      quiz: {
        q: "Training accuracy = 98%, test accuracy = 70%. Diagnosis?",
        a: [
          { t:"Underfitting", c:false, why:"Underfitting = both low. This is overfitting." },
          { t:"Overfitting — model memorised training, doesn't generalise", c:true, why:"Yes! Try simpler model, more data, regularisation, or early stopping." },
          { t:"Perfect model", c:false }
        ]
      },
      takeaway: "Overfitting = big train-test gap. Fix with more data, simpler model, regularisation, early stopping, CV-tuned hyperparams.",
      glossary: [
        { term:"Overfitting", def:"Model captures noise specific to training data, fails on new data." },
        { term:"Regularisation", def:"Techniques (L1, L2) that penalise model complexity to prevent overfitting." }
      ]
    },

    { id:"m8.l10", type:"concept", title:"10. Feature engineering — the secret sauce", est:"12 min",
      learn: [
        "<strong>Feature engineering</strong> = transforming raw columns into informative features. Often 10× more impactful than picking a fancy algorithm.",
        "<strong>10 high-impact feature engineering techniques:</strong>",
        "<strong>1. Datetime decomposition.</strong> <code>created_at → year, month, day, weekday, hour</code>. A model can't learn 'shoppers spike at weekends' from a raw timestamp.",
        "<strong>2. Categorical encoding.</strong> Models need numbers. Use <code>OneHotEncoder</code> for low-cardinality categoricals, <code>OrdinalEncoder</code> for ordered ones, <code>TargetEncoding</code> for high-cardinality.",
        "<strong>3. Binning numeric ranges.</strong> Age → ['Minor','Young','Adult','Senior']. Sometimes more useful than raw age.",
        "<strong>4. Log transform.</strong> Skewed features (income, price, follower count) often benefit from <code>np.log1p()</code> to spread out the long tail.",
        "<strong>5. Polynomial features.</strong> Square, cube, interactions. Captures non-linearities. <code>PolynomialFeatures(degree=2)</code>.",
        "<strong>6. Ratios.</strong> <code>revenue_per_customer = revenue / customer_count</code>. Often more predictive than raw values.",
        "<strong>7. Aggregations.</strong> For per-customer features: 'avg order value over last 90 days', 'days since last purchase', 'top product category'.",
        "<strong>8. Text features.</strong> TF-IDF (Module 4 of Adewale's TruthLens), word counts, sentiment.",
        "<strong>9. Missing-value indicators.</strong> Sometimes 'value is missing' itself carries signal. Add a <code>col_is_missing</code> boolean alongside imputation.",
        "<strong>10. Domain knowledge.</strong> The best features come from someone who knows the business. Talk to domain experts before modelling.",
        "<strong>Scikit-learn pipelines</strong> combine preprocessing + model into one reusable object:<pre>from sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.ensemble import RandomForestClassifier\n\npipe = Pipeline([\n    ('scale', StandardScaler()),\n    ('model', RandomForestClassifier(n_estimators=200))\n])\npipe.fit(X_train, y_train)</pre>Prevents data leakage and simplifies deployment."
      ],
      example: "<pre>import pandas as pd, numpy as np\nfrom sklearn.preprocessing import OneHotEncoder\n\ndf = pd.read_csv('orders.csv', parse_dates=['created_at'])\n\n# Datetime features\ndf['month']     = df['created_at'].dt.month\ndf['weekday']   = df['created_at'].dt.day_name()\ndf['hour']      = df['created_at'].dt.hour\ndf['is_weekend'] = df['created_at'].dt.weekday &gt;= 5\n\n# Log-transform skewed price\ndf['log_price'] = np.log1p(df['price'])\n\n# Ratio feature\ndf['price_per_unit'] = df['total'] / df['quantity']\n\n# Categorical encoding\nencoder = OneHotEncoder(sparse_output=False, drop='first')\nchannel_encoded = encoder.fit_transform(df[['channel']])\n\n# Aggregate per customer\nper_cust = df.groupby('customer_id').agg(\n    total_spent=('total','sum'),\n    order_count=('total','count'),\n    last_order=('created_at','max')\n).reset_index()\nper_cust['days_since_last'] = (pd.Timestamp.now() - per_cust['last_order']).dt.days</pre>",
      tryq: "Engineer features from raw transaction data",
      quiz: {
        q: "Adewale's TruthLens fake-news project uses TF-IDF. What is TF-IDF?",
        a: [
          { t:"A type of neural network", c:false },
          { t:"A way to convert text into numeric features by weighting word importance", c:true, why:"Yes! Term-Frequency × Inverse-Document-Frequency. Standard text feature engineering." },
          { t:"A regularisation technique", c:false }
        ]
      },
      takeaway: "Feature engineering = transforming raw → informative. Datetime, encoding, log, ratios, aggregations. Use Pipelines.",
      glossary: [
        { term:"Feature engineering", def:"Crafting input features that help the model learn." },
        { term:"One-hot encoding", def:"Converting a categorical column into one binary column per category." },
        { term:"TF-IDF", def:"Term-Frequency × Inverse-Document-Frequency. Standard text-to-features transformation." }
      ]
    },

    { id:"m8.l11", type:"concept", title:"11. Hyperparameter tuning — squeezing performance", est:"10 min",
      learn: [
        "<strong>Hyperparameters</strong> are model settings YOU choose (not learned from data). E.g. tree depth, number of trees, learning rate. Choosing well can dramatically improve performance.",
        "<strong>3 approaches:</strong>",
        "<strong>1. Manual tuning</strong> — try values, watch CV scores. Slow, biased, not reproducible. Avoid.",
        "<strong>2. Grid search</strong> — try every combination of a grid:<pre>from sklearn.model_selection import GridSearchCV\n\nparams = {\n    'n_estimators': [100, 200, 500],\n    'max_depth':    [5, 10, 20, None],\n    'min_samples_leaf': [1, 5, 10]\n}\ngrid = GridSearchCV(RandomForestClassifier(), params, cv=5, scoring='f1', n_jobs=-1)\ngrid.fit(X_train, y_train)\nprint(grid.best_params_, grid.best_score_)</pre>",
        "<strong>3. Random search</strong> — randomly sample combinations. Often as good as grid in less time:<pre>from sklearn.model_selection import RandomizedSearchCV\nrand_search = RandomizedSearchCV(model, params, n_iter=50, cv=5)</pre>",
        "<strong>4. Bayesian optimisation</strong> (advanced) — Optuna library. Smartest approach for expensive models.",
        "<strong>Best practice:</strong> Tune on training data using CV. Final evaluation on the held-out TEST set, ONCE. Don't tune ON the test set.",
        "<strong>Common hyperparameters by model:</strong>",
        "<strong>Logistic Regression:</strong> <code>C</code> (regularisation), <code>penalty</code> (l1/l2).",
        "<strong>Random Forest:</strong> <code>n_estimators</code>, <code>max_depth</code>, <code>min_samples_leaf</code>, <code>max_features</code>.",
        "<strong>Gradient Boosting:</strong> <code>n_estimators</code>, <code>learning_rate</code>, <code>max_depth</code>, <code>subsample</code>.",
        "<strong>SVM:</strong> <code>C</code>, <code>kernel</code>, <code>gamma</code>.",
        "<strong>Pro tip:</strong> Don't go crazy. The gains from hyperparameter tuning are usually 1-5%. The gains from better features are often 10-30%."
      ],
      example: "<pre>from sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import RandomizedSearchCV\nfrom scipy.stats import randint\n\nparam_dist = {\n    'n_estimators':     randint(100, 500),\n    'max_depth':        randint(5, 30),\n    'min_samples_leaf': randint(1, 20),\n    'max_features':     ['sqrt', 'log2', None]\n}\n\nsearch = RandomizedSearchCV(\n    RandomForestClassifier(random_state=42, n_jobs=-1),\n    param_dist, n_iter=30, cv=5, scoring='f1',\n    random_state=42, n_jobs=-1\n)\nsearch.fit(X_train, y_train)\n\nprint('Best F1:', search.best_score_)\nprint('Best params:', search.best_params_)\nbest_model = search.best_estimator_</pre>",
      quiz: {
        q: "Why is randomised search often preferred over grid search?",
        a: [
          { t:"It's the only one in sklearn", c:false },
          { t:"It explores the parameter space more efficiently — finds good combinations with fewer tries", c:true, why:"Yes! With a 5-dim search, grid quickly explodes. Random often gets 90% of the gain in 10% of the time." },
          { t:"It uses neural networks", c:false }
        ]
      },
      takeaway: "Hyperparams = model settings. GridSearchCV / RandomizedSearchCV with CV. Tune on training only, test once at end. Better features > better tuning.",
      glossary: [
        { term:"Hyperparameter", def:"Setting you choose for a model (not learned from data)." },
        { term:"Grid search", def:"Trying every combination of hyperparameter values." }
      ]
    },

    { id:"m8.l12", type:"concept", title:"12. Unsupervised learning — clustering & PCA", est:"10 min",
      learn: [
        "<strong>Unsupervised:</strong> no labels. Find structure in unlabelled data.",
        "<strong>Clustering — K-Means</strong> (most common):<pre>from sklearn.cluster import KMeans\n\nkm = KMeans(n_clusters=4, random_state=42, n_init=10)\ndf['cluster'] = km.fit_predict(X_scaled)</pre>K-means tries to partition data into K spherical clusters. <strong>Always scale features first</strong> (otherwise high-magnitude features dominate).",
        "<strong>How many clusters?</strong> Plot the elbow curve (inertia vs K) or use silhouette score. Heuristic: usually 3-7 for business segmentation.",
        "<strong>Use case — customer segmentation:</strong><pre>features = df[['recency', 'frequency', 'monetary']]   # RFM\nkm = KMeans(n_clusters=4, random_state=42).fit(features_scaled)\ndf['segment'] = km.labels_\nprint(df.groupby('segment')[['recency','frequency','monetary']].mean())</pre>",
        "<strong>Other clustering algorithms:</strong> DBSCAN (density-based, finds odd shapes), Hierarchical (gives a tree of nested clusters).",
        "<strong>PCA (Principal Component Analysis)</strong> — dimensionality reduction. Compresses many features into a few while preserving variance:<pre>from sklearn.decomposition import PCA\n\npca = PCA(n_components=2)   # reduce to 2D for visualisation\nX_reduced = pca.fit_transform(X_scaled)\nprint('Variance explained:', pca.explained_variance_ratio_)</pre>Use cases: visualise high-dim data in 2D, speed up training, reduce noise.",
        "<strong>t-SNE / UMAP</strong> (advanced) — better for visualisation than PCA, slower."
      ],
      example: "<pre>import pandas as pd\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.cluster import KMeans\nimport matplotlib.pyplot as plt\n\n# RFM customer segmentation\nrfm = df.groupby('customer_id').agg(\n    recency=('date', lambda x: (pd.Timestamp.now() - x.max()).days),\n    frequency=('order_id', 'count'),\n    monetary=('total', 'sum')\n).reset_index()\n\nX = StandardScaler().fit_transform(rfm[['recency','frequency','monetary']])\n\n# Elbow plot to pick K\ninertias = [KMeans(n_clusters=k, random_state=42, n_init=10).fit(X).inertia_\n            for k in range(2, 10)]\nplt.plot(range(2, 10), inertias, 'o-')\nplt.xlabel('K'); plt.ylabel('Inertia')\nplt.show()\n\n# Final segmentation with K=4\nrfm['segment'] = KMeans(n_clusters=4, random_state=42, n_init=10).fit_predict(X)\nprint(rfm.groupby('segment')[['recency','frequency','monetary']].mean())</pre>",
      tryq: "Cluster customers into segments",
      quiz: {
        q: "K-means needs you to choose K (number of clusters). What's a sensible way?",
        a: [
          { t:"Always use 5", c:false },
          { t:"Elbow plot or silhouette score + business judgement", c:true, why:"Yes! No 'right' K — use the plot to find natural break, plus what segments make business sense." },
          { t:"K = sqrt(N)", c:false }
        ]
      },
      takeaway: "Unsupervised = no labels. K-Means for clustering (scale first!). PCA for dimensionality reduction. Use for segmentation, exploration.",
      glossary: [
        { term:"Clustering", def:"Grouping similar data points without labels." },
        { term:"PCA", def:"Principal Component Analysis. Compresses many features into a few uncorrelated ones." }
      ]
    },

    { id:"m8.l13", type:"concept", title:"13. Model interpretability — SHAP & feature importance", est:"11 min",
      learn: [
        "<strong>Black-box models that say 'rejected' with no reason harm people and break laws (NDPR, GDPR).</strong> Explainability is now a job requirement.",
        "<strong>Built-in feature importance</strong> (Random Forest, XGBoost):<pre>importances = pd.Series(model.feature_importances_, index=X.columns)\nimportances.sort_values(ascending=False).head(10).plot.barh()</pre>Shows GLOBAL importance — which features matter on average. Doesn't tell you WHY this specific prediction was made.",
        "<strong>SHAP (SHapley Additive exPlanations)</strong> — explains INDIVIDUAL predictions:<pre>import shap\n\nexplainer = shap.TreeExplainer(model)\nshap_values = explainer.shap_values(X_test)\n\n# Global summary\nshap.summary_plot(shap_values, X_test)\n\n# Single-row explanation\nshap.force_plot(explainer.expected_value, shap_values[0], X_test.iloc[0])</pre>SHAP shows: <em>'For this specific customer, age=25 pushed prediction +0.15, balance=₦5k pushed -0.30, ...'</em> — actionable, customer-facing explanations.",
        "<strong>Adewale used SHAP in 4 of his 12 projects</strong> — including the Insurance Claim Predictor where underwriters needed to explain every flagged claim to managers.",
        "<strong>Other interpretability tools:</strong>",
        "<strong>LIME</strong> — model-agnostic local explanations.",
        "<strong>Partial dependence plots</strong> — how target changes with one feature (sklearn built-in).",
        "<strong>Permutation importance</strong> — drop a feature and measure score drop.",
        "<strong>When interpretability matters most:</strong><br>• Regulated industries (banking, healthcare, insurance).<br>• Decisions affecting humans (hiring, lending, parole).<br>• Anywhere a customer might ask 'why?'.<br>• Debugging your own model.",
        "<strong>Trade-off:</strong> Simpler models (linear, single tree) are easier to interpret. Complex models (deep nets, big ensembles) need post-hoc tools like SHAP."
      ],
      example: "<pre>import shap\nimport matplotlib.pyplot as plt\n\nexplainer = shap.TreeExplainer(model)\nshap_values = explainer.shap_values(X_test)\n\n# Beeswarm plot — global importance + direction\nshap.summary_plot(shap_values, X_test, show=False)\nplt.tight_layout()\nplt.savefig('shap_summary.png', dpi=120, bbox_inches='tight')\n\n# For a single customer explanation\nidx = 0\nprint(f\"Predicted: {model.predict_proba(X_test.iloc[[idx]])[0,1]:.3f}\")\nshap.waterfall_plot(shap.Explanation(\n    values=shap_values[idx],\n    base_values=explainer.expected_value,\n    data=X_test.iloc[idx]\n))</pre>",
      quiz: {
        q: "Why is SHAP often preferred over plain feature importance?",
        a: [
          { t:"It's faster", c:false },
          { t:"SHAP explains individual predictions (per-customer 'why'), not just global averages", c:true, why:"Yes! Per-prediction explanations are required by regulators and useful for customers." },
          { t:"It's required by sklearn", c:false }
        ]
      },
      takeaway: "SHAP explains individual predictions. Feature importance gives global view. Critical for regulated industries and customer-facing decisions.",
      glossary: [
        { term:"SHAP", def:"SHapley Additive exPlanations. Game-theory based method for explaining ML predictions." },
        { term:"Explainability", def:"Ability to articulate WHY a model made a specific prediction in human terms." }
      ]
    },

    { id:"m8.l14", type:"concept", title:"14. Handling imbalanced classes", est:"9 min",
      learn: [
        "<strong>Class imbalance</strong> — one class is much rarer than others. Fraud (1%), churn (15%), rare diseases (0.01%). Default ML algorithms ignore the minority class.",
        "<strong>3 approaches:</strong>",
        "<strong>1. Resample the data:</strong>",
        "<strong>SMOTE</strong> (Synthetic Minority Over-sampling) — generates synthetic minority examples. Adewale's Insurance Claim and Income Level projects use this.",
        "<pre>from imblearn.over_sampling import SMOTE\nsmote = SMOTE(random_state=42)\nX_resampled, y_resampled = smote.fit_resample(X_train, y_train)\n# Now both classes have equal count</pre>",
        "<strong>Random undersampling</strong> — drop majority-class examples. Faster but loses data.",
        "<strong>2. Class weights</strong> — tell the algorithm to penalise minority-class mistakes more:<pre>RandomForestClassifier(class_weight='balanced')\nLogisticRegression(class_weight='balanced')</pre>",
        "<strong>3. Threshold tuning</strong> — instead of 0.5, lower the threshold to catch more positives:<pre>probs = model.predict_proba(X_test)[:, 1]\npreds = (probs &gt;= 0.3).astype(int)   # catches more positives, more false positives</pre>",
        "<strong>Crucial — pick the right METRIC.</strong> Accuracy is meaningless on imbalanced data. Use F1, AUC-ROC, precision-recall curve, or precision/recall at specific thresholds.",
        "<strong>Real fraud detection workflow:</strong> SMOTE on training data, train XGBoost, evaluate with precision @ top-1% (most-confident predictions), tune threshold so you only flag the riskiest 1% of transactions.",
        "<strong>Never SMOTE before splitting!</strong> If you SMOTE first, synthetic minority examples appear in both training AND test, inflating test scores. ALWAYS split first, then SMOTE only on training."
      ],
      example: "<pre>from sklearn.model_selection import train_test_split\nfrom imblearn.over_sampling import SMOTE\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import classification_report\n\n# Split FIRST\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25,\n                                          stratify=y, random_state=42)\n\nprint('Before SMOTE:', y_tr.value_counts().to_dict())\n\n# SMOTE only on training\nX_tr_res, y_tr_res = SMOTE(random_state=42).fit_resample(X_tr, y_tr)\nprint('After SMOTE: ', pd.Series(y_tr_res).value_counts().to_dict())\n\n# Train on resampled, evaluate on ORIGINAL test\nmodel = RandomForestClassifier(n_estimators=300, random_state=42, n_jobs=-1)\nmodel.fit(X_tr_res, y_tr_res)\nprint(classification_report(y_te, model.predict(X_te)))</pre>",
      tryq: "Handle imbalanced classes with SMOTE",
      quiz: {
        q: "You SMOTE before train_test_split. What's the problem?",
        a: [
          { t:"Nothing", c:false },
          { t:"Synthetic minority samples leak into both train and test, inflating test scores deceptively", c:true, why:"Yes! Always: split first, resample training only. Test set must remain original distribution." },
          { t:"SMOTE is too slow", c:false }
        ]
      },
      takeaway: "Imbalanced data ≠ accuracy game. Use SMOTE (training only!), class_weight, or threshold tuning. Metric: F1/AUC, not accuracy.",
      glossary: [
        { term:"SMOTE", def:"Synthetic Minority Over-sampling Technique. Generates synthetic minority examples." },
        { term:"Class imbalance", def:"When one class dominates training data (e.g. 99/1 split)." }
      ]
    },

    { id:"m8.l15", type:"concept", title:"15. Deploying a model — Streamlit + Joblib", est:"12 min",
      learn: [
        "<strong>Saving and loading a trained model:</strong><pre>import joblib\n\n# Save\njoblib.dump(model, 'churn_model.joblib')\n\n# Load later\nmodel = joblib.load('churn_model.joblib')\npreds = model.predict(new_X)</pre>Joblib is the standard for sklearn models. Compact, fast.",
        "<strong>End-to-end Streamlit deployment:</strong><pre>import streamlit as st\nimport joblib\nimport pandas as pd\n\nst.title('Customer Churn Predictor')\n\n# Load saved model\nmodel = joblib.load('churn_model.joblib')\nscaler = joblib.load('scaler.joblib')\n\n# Inputs\nage = st.slider('Age', 18, 80, 30)\ntenure = st.slider('Tenure (months)', 0, 120, 24)\nbalance = st.number_input('Balance (₦)', 0, 10000000, 500000)\ntxn_freq = st.slider('Transactions per month', 0, 50, 10)\n\nif st.button('Predict'):\n    X = pd.DataFrame([[age, tenure, balance, txn_freq]],\n                     columns=['age','tenure','balance','txn_freq'])\n    X_scaled = scaler.transform(X)\n    prob = model.predict_proba(X_scaled)[0, 1]\n    pred = 'WILL CHURN' if prob &gt; 0.5 else 'Will stay'\n    st.metric('Prediction', pred)\n    st.metric('Churn probability', f\"{prob:.1%}\")\n    if prob &gt; 0.7:\n        st.error('🚨 High risk — recommend retention call')\n    elif prob &gt; 0.4:\n        st.warning('⚠️ Medium risk — send personalised offer')</pre>",
        "<strong>Deploy free on Streamlit Cloud</strong> (see Module 7, Lesson 6 for full steps):",
        "1. Push <code>app.py</code>, <code>requirements.txt</code>, model files to GitHub.",
        "2. Sign in at share.streamlit.io. 'New app'. Deploy.",
        "3. Share the URL. <strong>Your model is now used by anyone with a browser.</strong>",
        "<strong>What to include in requirements.txt:</strong><pre>streamlit\npandas\nnumpy\nscikit-learn\njoblib</pre>",
        "<strong>Pickling warning:</strong> joblib files include the sklearn version. Always match sklearn version between training and deployment, otherwise loading fails."
      ],
      example: "<pre># Train and save\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.preprocessing import StandardScaler\nimport joblib\n\nscaler = StandardScaler().fit(X_train)\nX_train_s = scaler.transform(X_train)\n\nmodel = RandomForestClassifier(n_estimators=300, random_state=42, n_jobs=-1)\nmodel.fit(X_train_s, y_train)\n\n# Save both — they must travel together\njoblib.dump(model, 'churn_model.joblib')\njoblib.dump(scaler, 'churn_scaler.joblib')\n\nprint('Saved! Now upload to GitHub + deploy to Streamlit Cloud.')</pre>",
      exercise: {
        steps: 5,
        tool: "Streamlit + GitHub + sklearn",
        task: "Train any sklearn model. Save with joblib. Build a 30-line Streamlit app that loads it and lets users predict. Deploy free to Streamlit Cloud."
      },
      quiz: {
        q: "Why save the SCALER alongside the model?",
        a: [
          { t:"For backup", c:false },
          { t:"Prediction requires the SAME scaling as training — load the same fitted scaler", c:true, why:"Yes! Different scaling = different scale = wrong predictions. Always save preprocessing artifacts." },
          { t:"Not necessary", c:false }
        ]
      },
      takeaway: "joblib.dump / joblib.load. Save model + ALL preprocessing. Wrap in Streamlit, deploy free on Streamlit Cloud.",
      glossary: [
        { term:"joblib", def:"Library for efficient serialisation of Python objects, especially sklearn models." },
        { term:"Deployment", def:"Making a trained model accessible to end users." }
      ]
    },

    { id:"m8.l16", type:"concept", title:"16. ML ethics — what NOT to do", est:"10 min",
      learn: [
        "Powerful tools can hurt. Module 1 Lesson 7 introduced ethics; here are the SPECIFIC ML pitfalls.",
        "<strong>1. Training on biased historical data.</strong> Amazon's hiring AI (2018) learned that women were rarely hired in tech and replicated the bias. Audit subgroups. Re-balance training data. Remove protected attributes.",
        "<strong>2. Proxy discrimination.</strong> Removing 'race' doesn't fix bias if your model uses 'zip code' as a proxy. Audit predictions per group regardless.",
        "<strong>3. Predicting people without their knowledge.</strong> Profiling, behavioural prediction, emotion detection — all require consent under NDPA. Don't deploy silently.",
        "<strong>4. Black-box decisions affecting lives.</strong> 'Computer says no' with no explanation is illegal under NDPA Article 28. Use SHAP / LIME for explanations. Offer a human appeal path.",
        "<strong>5. Optimising the wrong metric.</strong> Optimise clicks → clickbait. Optimise watch time → addiction. Optimise predicted recidivism → reinforce policing biases. Always ask: what HUMAN OUTCOME does the metric proxy for?",
        "<strong>6. Overconfidence.</strong> 'My model has 92% accuracy' becomes 'my model is right 92% of the time.' Not the same! Confidence intervals exist for a reason. Communicate uncertainty.",
        "<strong>7. Skipping the rare-event audit.</strong> Self-driving cars work 99.99% of the time. That 0.01% kills someone. Always stress-test edge cases.",
        "<strong>8. No monitoring after deployment.</strong> Models go stale as the world changes. A 2019-trained credit model failed disastrously during COVID. Set up alerts for distribution drift.",
        "<strong>Pre-deployment checklist:</strong><br>□ Subgroup performance audit (fairness)<br>□ SHAP explanations for sample predictions<br>□ Stress-test on rare / edge cases<br>□ Human appeal path documented<br>□ Privacy assessment (NDPA-compliant?)<br>□ Monitoring + retraining plan<br>□ Rollback plan if model misbehaves"
      ],
      example: "<strong>Real case — the Apple Card algorithm (2019).</strong> Apple Card gave significantly higher credit limits to husbands than wives, even when wives had higher credit scores. After viral outrage and a New York investigation, Goldman Sachs (the issuer) said the model 'didn't use gender'. True — but other features correlated with gender (income history, accumulated assets in male names). Proxy discrimination is real. Audit is not optional.",
      quiz: {
        q: "Your loan-default model achieves equal accuracy across genders. Are you done with the fairness audit?",
        a: [
          { t:"Yes, equal accuracy = fair", c:false, why:"Accuracy alone hides asymmetric errors (e.g. women get more false rejections, men more false approvals)." },
          { t:"No — also check false-positive rate, false-negative rate, approval rate by group; ensure errors are not systematically harming one group", c:true, why:"Yes! Audit all confusion-matrix metrics per group, not just accuracy." }
        ]
      },
      takeaway: "ML ethics: audit subgroups, watch proxies, explain decisions, communicate uncertainty, monitor for drift. NDPA / GDPR / NDPR compliance is mandatory.",
      glossary: [
        { term:"Proxy discrimination", def:"Discrimination via correlated features even after removing protected attributes." },
        { term:"Distribution drift", def:"When the real-world data shifts away from what the model was trained on." }
      ]
    },

    { id:"m8.l17", type:"concept", title:"17. What's next? Deep learning & beyond", est:"8 min",
      learn: [
        "Congratulations — you now know enough ML to solve 80% of business problems. The remaining 20% needs deeper specialisation. Here's the map:",
        "<strong>Deep Learning</strong> — neural networks with many layers. Required for images (CNNs), text/audio (Transformers), generative AI (LLMs like ChatGPT). Library: <strong>TensorFlow / Keras</strong> or <strong>PyTorch</strong>. Resources: Andrew Ng's Deep Learning Specialization (Coursera), Fast.ai (free).",
        "<strong>Time series forecasting</strong> — Prophet (Meta), ARIMA, LSTM. For sales/revenue forecasting.",
        "<strong>NLP (Natural Language Processing)</strong> — sentiment analysis, topic modelling, chatbots, summarisation. Libraries: spaCy, Hugging Face Transformers. Adewale's TruthLens project is NLP.",
        "<strong>Computer Vision</strong> — image classification, object detection, OCR. Libraries: OpenCV, PyTorch + torchvision.",
        "<strong>MLOps</strong> — productionising ML at scale. CI/CD for models, monitoring, A/B testing of models. Tools: MLflow, Kubeflow, Weights &amp; Biases.",
        "<strong>Reinforcement Learning</strong> — game playing (AlphaGo), robotics, recommendation. Library: Stable Baselines, Ray RLlib. Niche but powerful.",
        "<strong>Generative AI / LLMs</strong> — the 2023-2025 wave. But remember the QueryPilot principle: <strong>most business problems don't need LLMs.</strong> Use them only when nothing simpler works.",
        "<strong>Adewale's enrolled programmes for 2026:</strong><br>• <em>DSN × Google.org DeepTech_Ready</em> — deep learning, NLP, advanced ML.<br>• <em>WorldQuant University ADS Lab</em> — applied data science with international rigour.<br>• <em>Kodecamp Cohort 6 ML Track</em> — production ML.<br>• <em>IBM SkillsBuild Ambassador</em> — AI, data and cloud paths.<br>This shows the ongoing learning required. <strong>Career data science is a lifelong learning practice.</strong>",
        "<strong>Next steps for YOU:</strong>",
        "<strong>Week 1-2:</strong> Build the Capstone project (next module). Deploy. Share.",
        "<strong>Month 1-3:</strong> Build 2-3 more end-to-end projects in domains you care about.",
        "<strong>Month 3-6:</strong> Pick ONE deep specialty (NLP, vision, time series) and go deep.",
        "<strong>Always:</strong> read 1 paper / blog post per week. Follow practitioners (not influencers) on LinkedIn / X."
      ],
      example: "<strong>Recommended free resources to continue:</strong><br>• <em>Kaggle Learn</em> — free micro-courses on every DS topic.<br>• <em>fast.ai</em> — practical deep learning for coders.<br>• <em>Hugging Face Course</em> — NLP and transformers.<br>• <em>Made With ML</em> — MLOps and production patterns.<br>• <em>Adewale's YouTube channel</em> — <code>youtube.com/@hmgconcepts</code> — Nigerian-context project walkthroughs and prep videos.",
      quiz: {
        q: "You finish this curriculum. What's the MOST valuable next step for your career?",
        a: [
          { t:"Read more theory books", c:false, why:"Helpful, but doesn't get you hired." },
          { t:"Build and deploy 2-3 real projects to your GitHub and share them publicly", c:true, why:"Yes! Portfolio over certificates. Real deployed work demonstrates capability convincingly." },
          { t:"Buy a Master's degree", c:false, why:"Optional. Skills + portfolio matter more for most DS roles." }
        ]
      },
      takeaway: "DL, NLP, CV, time series, MLOps, RL, generative AI — next specialties. Build & deploy projects. Lifelong learning. Follow practitioners.",
      glossary: [
        { term:"Deep Learning", def:"ML using neural networks with many layers. Powers vision, language, generative AI." },
        { term:"MLOps", def:"Operations for ML — CI/CD, monitoring, scaling. Like DevOps but for models." }
      ]
    },

    { id:"m8.l18", type:"project", title:"18. Module 8 Project — End-to-end ML pipeline", est:"3 hours",
      learn: [
        "<strong>Mission:</strong> Build a complete ML project from data to deployed app. This is your portfolio piece.",
        "<strong>Pick a problem (or choose your own):</strong>",
        "<strong>Option A — Student At-Risk Predictor.</strong> Predict which students will fail an exam given their mid-term scores, attendance, homework completion. Inspired by Adewale's project.",
        "<strong>Option B — Property Price Predictor.</strong> Predict house prices in Lagos based on location, size, bedrooms.",
        "<strong>Option C — Crop Yield Predictor.</strong> Predict yield from rainfall, fertiliser, soil pH for smallholder farmers.",
        "<strong>Option D — Loan Default Predictor.</strong> Predict loan default for microfinance.",
        "<strong>End-to-end steps:</strong>",
        "<strong>1. Find / create data.</strong> Use Kaggle, data.gov.ng, or generate synthetic data with realistic distributions.",
        "<strong>2. EDA in Pandas + Seaborn.</strong> Notebook with: shape, dtypes, missing %, target distribution, feature correlations, key hypotheses.",
        "<strong>3. Feature engineering.</strong> Datetime parts, ratios, log transforms, encodings. Document each.",
        "<strong>4. Train/test split.</strong> 25% test, stratified if classification.",
        "<strong>5. Baseline.</strong> Logistic Regression (classification) or Linear Regression (regression). Score on test.",
        "<strong>6. Improved model.</strong> Random Forest + hyperparameter tuning. Score on test.",
        "<strong>7. Evaluate properly.</strong> Confusion matrix, precision/recall/F1/AUC (classification) or MAE/RMSE/R² (regression). Compare to baseline.",
        "<strong>8. Interpretability.</strong> Feature importance plot. SHAP summary plot for the final model.",
        "<strong>9. Save the model.</strong> joblib.dump for model + scaler.",
        "<strong>10. Build Streamlit app.</strong> Input form, prediction display, probability gauge, SHAP explanation if possible.",
        "<strong>11. Deploy to Streamlit Cloud.</strong> Push to GitHub. Deploy. Share URL.",
        "<strong>12. Write a 1-page README.</strong> Problem, data, approach, results (with honest disclosure of limits), deployment URL."
      ],
      example: "<strong>Skeleton notebook structure</strong> (adapt to your problem):<pre>1. Imports + load data\n2. Inspect: shape, dtypes, describe, isnull, value_counts of target\n3. EDA: histograms of numeric features, target distribution, correlations\n4. Feature engineering: encoding, datetime, ratios\n5. Train/test split (stratified)\n6. Baseline: LogisticRegression with CV\n7. Improved: RandomForest with RandomizedSearchCV\n8. Final eval on test: confusion matrix, classification_report, AUC\n9. SHAP summary plot\n10. joblib.dump(model, scaler)\n11. (Outside notebook) write app.py, requirements.txt, push, deploy</pre>",
      project: {
        deliverable: "GitHub repo + deployed Streamlit URL + README",
        time: "3 hours (or spread over a few sessions)",
        difficulty: "Intermediate-Advanced",
        skills: ["Full ML pipeline", "Feature engineering", "Model comparison", "SHAP", "Deployment", "Documentation"]
      },
      takeaway: "You now have one complete, end-to-end, deployed ML project. THIS IS THE PIECE that gets you hired. Share it.",
      glossary: []
    }

  ]
},

/* ===================================================================
   CAPSTONE — BUILD & DEPLOY A REAL PROJECT
   =================================================================== */
{
  id: "capstone",
  title: "Capstone — Build & Deploy",
  icon: "🏆",
  color: "#f85149",
  level: "Capstone",
  weeks: 2,
  summary: "Everything you've learned, applied to ONE substantial project of your choosing. Pick a real problem you care about. Build it. Deploy it. Document it. Share it. This is the project that lives on your CV and gets you interviews.",
  prereq: "All modules 1-8.",
  lessons: [

    { id:"cap.l1", type:"concept", title:"1. Pick the right capstone problem", est:"30 min",
      learn: [
        "<strong>The best capstone is one you care about personally and someone else (a friend, a school, an NGO, a relative's business) actually needs.</strong> Caring about the problem keeps you finishing it.",
        "<strong>5 criteria for a great capstone:</strong>",
        "<strong>1. Real data.</strong> Either you have access (your job, your school, a public dataset) or you can generate realistic synthetic data.",
        "<strong>2. End-to-end scope.</strong> Touches loading, cleaning, analysis or ML, visualisation, deployment.",
        "<strong>3. Specific question.</strong> Not 'analyse customer data'; instead 'identify which customers are at risk of churning next month and explain why per customer'.",
        "<strong>4. Deployable.</strong> Can be wrapped in a Streamlit dashboard or app.",
        "<strong>5. Shareable.</strong> Doesn't contain confidential data. Can live on GitHub publicly.",
        "<strong>10 capstone ideas (Nigerian context):</strong>",
        "<strong>1. JAMB / WAEC Performance Predictor.</strong> Predict UTME score from mid-term scores. Useful for SS2/SS3 teachers.",
        "<strong>2. Lagos Traffic Predictor.</strong> Predict travel time on a route given time-of-day and day-of-week. Useful for commuters.",
        "<strong>3. Naira-Dollar Forecaster.</strong> Predict the next week's exchange rate from public data. (Caveat: probably won't beat random — that's the lesson!)",
        "<strong>4. Pump Price Tracker.</strong> Track petrol prices across NNPC stations. Dashboard + alert when below average.",
        "<strong>5. Market Sales Analyser.</strong> Help a small market trader analyse their sales notebook. Daily/weekly trends. Best/worst items.",
        "<strong>6. School Pass-Rate Dashboard.</strong> Multi-year, multi-subject pass-rate dashboard for a school. Identify problem subjects.",
        "<strong>7. Customer RFM Segmentation.</strong> For any business: Recency-Frequency-Monetary segmentation with K-means.",
        "<strong>8. Loan Eligibility Predictor.</strong> Microfinance-style binary classification with SHAP.",
        "<strong>9. Local Restaurant Recommender.</strong> Sentiment-based recommendations from Google Reviews.",
        "<strong>10. NYSC Camp Comparison Tool.</strong> Compare NYSC PPA cities on cost-of-living, safety, jobs — for prospective corpers.",
        "<strong>Adewale's encouragement:</strong> <em>'CBT Pro started as 'I want better exams for my students'. Started with the problem, not the technology. Same for you.'</em>"
      ],
      example: "<strong>Walkthrough — picking the JAMB Performance Predictor:</strong><br><strong>Why it works:</strong> Real audience (SS2/SS3 students nationwide), feasible data (school mock + JAMB results), specific output (predicted JAMB score + topic recommendations), deployable (Streamlit), shareable (no PII if anonymised).<br><strong>Plan:</strong><br>Week 1: Collect/synthesise data, EDA, baseline regression.<br>Week 2: Improved model, SHAP explanations, Streamlit deployment, README.",
      quiz: {
        q: "Which is the BEST capstone candidate?",
        a: [
          { t:"Use the Boston Housing dataset everyone else uses", c:false, why:"Recruiters have seen 1,000 of these. Boring." },
          { t:"A specific problem you care about, with real or realistic data, deployable end-to-end", c:true, why:"Yes! Care + specificity + deployment = the trifecta." },
          { t:"The most complex deep learning model you can find", c:false, why:"Complexity ≠ value. Solve a real problem." }
        ]
      },
      takeaway: "Pick something you care about, with real(istic) data, end-to-end, deployable, shareable.",
      glossary: []
    },

    { id:"cap.l2", type:"concept", title:"2. Project planning — the 2-week sprint", est:"15 min",
      learn: [
        "<strong>Plan before you build.</strong> 30 minutes of planning saves 30 hours of rework.",
        "<strong>Week 1 — Data + Analysis</strong>",
        "<strong>Day 1.</strong> Write the README skeleton FIRST. Problem statement (1 paragraph). Audience. Success criteria. Data source.",
        "<strong>Day 2.</strong> Get the data. Inspect (shape, dtypes, missing, describe). Capture an initial-look snapshot.",
        "<strong>Day 3.</strong> Clean. Document every cleaning decision in a 'data_dictionary.md'.",
        "<strong>Day 4.</strong> EDA. 5 charts that tell the data's story. Save them as PNG/SVG.",
        "<strong>Day 5.</strong> Feature engineering. 5-10 features. Justify each.",
        "<strong>Day 6.</strong> Baseline model. Establish a reference number to beat.",
        "<strong>Day 7.</strong> Improved model. Tuning. Final test-set evaluation. Write up results honestly.",
        "<strong>Week 2 — Deployment + Polish</strong>",
        "<strong>Day 8.</strong> Save model with joblib. Build minimal Streamlit app (just inputs + prediction).",
        "<strong>Day 9.</strong> Add charts to the Streamlit app. SHAP if possible. KPI cards.",
        "<strong>Day 10.</strong> Deploy to Streamlit Cloud. Test on phone, tablet, laptop.",
        "<strong>Day 11.</strong> Write the README. Problem, data, approach, results, screenshots, limitations.",
        "<strong>Day 12.</strong> Write a LinkedIn post announcing the project.",
        "<strong>Day 13.</strong> Polish: error handling, loading spinners, footer with your name and contact.",
        "<strong>Day 14.</strong> Final QA. Share with 3 friends. Iterate on feedback.",
        "<strong>This is a TEMPLATE</strong>, not a strait jacket. The discipline of having a written plan and a date for each milestone is more valuable than the exact dates."
      ],
      example: "<strong>Sample README skeleton (write this FIRST, before any code):</strong><pre># Project Title\n\n## Problem\nOne paragraph: what problem are we solving, for whom, why now?\n\n## Approach\nML type (classification/regression/clustering), key features,\nmodel, evaluation strategy.\n\n## Data\nSource, size (rows × cols), date range, key columns, known issues.\n\n## Results\nMain metric and value. Comparison to baseline. Honest limitations.\n\n## Deployment\nLive URL: ...\nHow to run locally: ...\n\n## Reproducibility\npip install -r requirements.txt\npython train.py\nstreamlit run app.py\n\n## Author\nName, contact, links.</pre>",
      quiz: {
        q: "What's the single biggest planning mistake?",
        a: [
          { t:"Not planning at all — just diving into code", c:true, why:"Yes! Without a plan you'll spend 80% of the time on tangents and never finish. 30 min planning saves days." },
          { t:"Over-planning", c:false, why:"Sometimes a problem, but rarer." },
          { t:"Writing the README too early", c:false, why:"Writing the README first is actually a feature, not a bug." }
        ]
      },
      takeaway: "Plan first. Write the README before any code. Daily milestones. 2 weeks ≈ 1 polished deployed project.",
      glossary: []
    },

    { id:"cap.l3", type:"concept", title:"3. The portfolio README that gets you hired", est:"15 min",
      learn: [
        "<strong>Recruiters read your README in 90 seconds. Make it count.</strong>",
        "<strong>The 8 must-have sections (in this order):</strong>",
        "<strong>1. Title + 1-line tagline + screenshot/gif of the deployed app.</strong> Recruiters skim the top — show them the product.",
        "<strong>2. Live demo URL + GitHub link badges.</strong> Make it easy to click and try.",
        "<strong>3. Problem statement.</strong> 2-3 sentences. Specific. Real audience.",
        "<strong>4. Approach.</strong> Bullet points: data → preprocessing → model → evaluation → deployment. Skim-friendly.",
        "<strong>5. Results.</strong> One key metric prominently displayed. Comparison to baseline. <em>'AUC 0.87 vs baseline 0.62.'</em>",
        "<strong>6. Honest limitations.</strong> What the model can't do well. What's missing. What you'd do with more time. <strong>This is the #1 thing that distinguishes serious candidates from amateurs.</strong>",
        "<strong>7. How to run locally.</strong> A reproducible 3-line setup. <code>pip install -r requirements.txt</code>, <code>streamlit run app.py</code>.",
        "<strong>8. About the author.</strong> Your name, location, contact, LinkedIn, portfolio, other projects.",
        "<strong>Bonus: badges, GIFs, screenshots, architecture diagram.</strong> Visual content increases stickiness 10×.",
        "<strong>Adewale's actual README pattern</strong> (used on his 12 projects):<br>Problem → Solution → Impact → Tech stack badges → Live links → Visual screenshot → Honest disclosure of metric limits → Author bio. <strong>This pattern works. Copy it.</strong>",
        "<strong>Things to AVOID:</strong><br>• Long paragraphs of theory.<br>• Code dumps in the README (link to files instead).<br>• 'TODO' or 'work in progress'.<br>• No contact info.<br>• No live demo (especially for ML projects)."
      ],
      example: "<strong>Sample top of a great README:</strong><pre># 🎓 Student At-Risk Predictor\n\n&gt; ML-powered early-warning system for Nigerian secondary teachers.\n&gt; Predicts which SS3 students are likely to fail WAEC, weeks before mock exams.\n\n[![Live App](https://img.shields.io/badge/Streamlit-Live-FF4B4B?logo=streamlit)](https://student-at-risk-predictor.streamlit.app)\n[![GitHub](https://img.shields.io/badge/Code-GitHub-181717?logo=github)](https://github.com/cssadewale/student-at-risk-predictor)\n\n![Screenshot of the dashboard](./screenshots/dashboard.png)\n\n## The Problem\n95% of Nigerian schools have no early-warning system. Teachers see\nstruggling students too late to intervene. Result: avoidable failures.\n\n## What This Does\nGiven a student's mid-term scores, attendance, and homework completion,\nthe model predicts WAEC failure risk (Low / Medium / High) and explains\nwhich factors drove the prediction (via SHAP).\n\n## Results\nAUC 0.84 on held-out test set (n=600). Recall 78% at 70%-precision threshold.\nBaseline (always predict Pass): F1 = 0. Improved model: F1 = 0.72.\n\n## What This Does NOT Do\n- Replace teacher judgement\n- Predict beyond Nigerian SS3 context\n- Account for school-specific factors not in the data</pre>",
      quiz: {
        q: "Where should the live-demo URL go in your README?",
        a: [
          { t:"In the footer", c:false },
          { t:"Right at the top — recruiters click within 10 seconds or move on", c:true, why:"Yes! Above-the-fold links convert. Hidden ones don't." },
          { t:"Don't include it; let them figure it out", c:false }
        ]
      },
      takeaway: "README in 8 sections. Live demo link + screenshot at the top. Honest limitations distinguish you. Copy Adewale's pattern.",
      glossary: []
    },

    { id:"cap.l4", type:"concept", title:"4. Sharing your work — LinkedIn, X, GitHub", est:"10 min",
      learn: [
        "<strong>A capstone project nobody sees is wasted work.</strong> Sharing is part of the project.",
        "<strong>Where to share (in order of ROI):</strong>",
        "<strong>1. GitHub.</strong> Public repo with great README. Pin to your profile. <strong>This is your résumé in 2026.</strong>",
        "<strong>2. LinkedIn post.</strong> The single biggest accelerator for Nigerian DS careers. Tag #DataScience #Nigeria #MachineLearning. Include the live demo URL.",
        "<strong>3. Twitter / X.</strong> Tag #DataScienceNG. Quick wins, screenshots.",
        "<strong>4. Personal portfolio.</strong> A simple cssadewale.pages.dev-style site listing all your projects.",
        "<strong>5. Medium / Hashnode / dev.to.</strong> Write a 1,000-word tutorial about how you built it. Drives traffic to your portfolio.",
        "<strong>6. Kaggle.</strong> If your model uses a Kaggle dataset, publish the notebook there. Builds reputation.",
        "<strong>7. YouTube.</strong> Adewale's @hmgconcepts channel demonstrates this — walkthrough videos compound.",
        "<strong>LinkedIn post template that works:</strong><pre>I just deployed [PROJECT NAME] — [ONE-LINE WHAT].\n\nThe problem: [2 sentences]\n\nWhat I built:\n• [Bullet 1]\n• [Bullet 2]\n• [Bullet 3]\n\nResult: [main metric] vs [baseline].\n\nTry it: [URL]\nCode: [URL]\n\nBuilt with [tech stack]. Lessons learned:\n[1-2 honest lessons]\n\n#DataScience #MachineLearning #Nigeria #[domain]</pre>",
        "<strong>What NOT to post:</strong>",
        "• Long screenshots of code (nobody reads).",
        "• Humble-brag ('I made a tiny project but...').",
        "• Without a link.",
        "• In a corporate-speak voice. Be authentic — the Adewale model.",
        "<strong>Engagement compounds.</strong> Post regularly (1×/month is fine), comment on others' posts, build a small network. After 6-12 months of consistent posting, recruiters find YOU.",
        "<strong>Network in NIgerian DS:</strong> follow practitioners on LinkedIn — Yetunde Dada (Quantum Black), Akin Solanke (Andela), Aderemi Adekunle (DSN), Adewale Samson Adeagbo (HMG Concepts)."
      ],
      example: "<strong>Real Adewale LinkedIn-style post example:</strong><br><em>'Just deployed CBT Pro — a complete computer-based testing platform for Nigerian secondary schools, built on an Android tablet using Acode editor, with zero budget. ✅ Teacher portal with 4-tab analytics. ✅ Student exam engine with timer, randomisation, anti-cheat. ✅ Auto-marking, certificates, optional AI explanations. Live with real students sitting real exams: [URL]. Lessons: 1) Clear thinking + AI leverage = working software in unfamiliar fields. 2) You don't need a laptop to ship. #EdTech #Nigeria #DataScience'</em>",
      quiz: {
        q: "Which platform gives the best ROI for a Nigerian junior data scientist sharing projects?",
        a: [
          { t:"Instagram", c:false, why:"Hardly any DS audience." },
          { t:"LinkedIn + GitHub combo", c:true, why:"Yes! GitHub = portfolio. LinkedIn = distribution + recruiter audience. Symbiotic." },
          { t:"TikTok", c:false }
        ]
      },
      takeaway: "GitHub for proof. LinkedIn for distribution. Authenticity beats polish. Post regularly. Networks compound.",
      glossary: []
    },

    { id:"cap.l5", type:"project", title:"5. The Capstone — your own 2-week project", est:"2 weeks",
      learn: [
        "<strong>Now do it.</strong>",
        "<strong>Step 0:</strong> Open a new GitHub repo. Initialise with a README skeleton (using the structure from Lesson 3).",
        "<strong>Step 1:</strong> Pick your problem (Lesson 1) and write the problem statement in the README.",
        "<strong>Step 2:</strong> Follow the 2-week sprint plan (Lesson 2).",
        "<strong>Step 3:</strong> Deploy to Streamlit Cloud (Module 7 Lesson 6 + Module 8 Lesson 15).",
        "<strong>Step 4:</strong> Write the README (Lesson 3 template).",
        "<strong>Step 5:</strong> Share on LinkedIn and X (Lesson 4 template).",
        "<strong>Step 6:</strong> Add it to your QueryPilot saved queries (Saved sidebar) so the printable Data Pack documentation can include it.",
        "<strong>Step 7:</strong> Apply for a job. Send the live demo URL. With 1-3 deployed projects + this curriculum, you are now genuinely employable as a Junior Data Analyst or Junior Data Scientist in the Nigerian market.",
        "<strong>What 'done' looks like:</strong>",
        "□ GitHub repo with code, README, requirements.txt, data dictionary, screenshots.",
        "□ Deployed Streamlit URL accessible to anyone with a browser.",
        "□ README with: problem, approach, results, honest limitations, how-to-run, author.",
        "□ LinkedIn post with the live URL and a thoughtful caption.",
        "□ One person you don't know has used the app and given feedback.",
        "<strong>If you finish this:</strong>",
        "🎉 You have done what 95% of self-taught data-scientist hopefuls never do — completed and deployed end-to-end.",
        "🎉 You are ready to apply for entry-level data roles.",
        "🎉 You have the muscle memory to build the next 10 projects.",
        "🎉 You have joined the small group of Nigerian data scientists who SHIP.",
        "<strong>Adewale's invitation:</strong> When you finish, message him on WhatsApp at +234 810 086 6322 with your URL. He may amplify good work to his audience. <strong>That's how the community grows.</strong>"
      ],
      example: "<strong>The author's own pattern for inspiration:</strong> Adewale's portfolio at cssadewale.pages.dev shows 12 deployed projects — each with: problem statement, live link, GitHub, honest metrics. <strong>Copy the format. Replace the content with your own.</strong>",
      project: {
        deliverable: "1 deployed Streamlit app + GitHub repo + README + LinkedIn post.",
        time: "2 weeks (or 1 month at evenings/weekends pace)",
        difficulty: "All-level integration",
        skills: ["All of M1-M8 combined", "Project management", "Communication", "Public sharing"]
      },
      takeaway: "If you finish: you're employable. Period. Now go do it.",
      glossary: []
    }

  ]
});

window.CURRICULUM_PART = 4;
console.log("✅ Curriculum loaded:", window.CURRICULUM.length, "modules,",
  window.CURRICULUM.reduce(function(s,m){ return s+m.lessons.length; }, 0), "lessons");
