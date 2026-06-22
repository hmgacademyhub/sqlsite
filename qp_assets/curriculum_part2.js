/* =====================================================================
   QueryPilot v9 — Curriculum Data (Part 2: Modules M4-M5)
   Statistics, Python for Data Science
   ===================================================================== */

window.CURRICULUM.push(

/* ===================================================================
   MODULE 4 — STATISTICS, THE HONEST VERSION
   No calculus, no proofs. Intuition + practical formulas + Nigerian examples.
   =================================================================== */
{
  id: "m4",
  title: "Statistics — The Honest Version",
  icon: "📈",
  color: "#bc8cff",
  level: "Intermediate",
  weeks: 3,
  summary: "Statistics is how we tell signal from noise. Without it, we mistake random fluctuation for real patterns and embarrass ourselves in front of stakeholders. This module teaches the intuition first, formulas second, and the brutal limits of statistics third. No PhD required.",
  prereq: "Modules 1-3.",
  lessons: [

    { id:"m4.l1", type:"concept", title:"1. Why statistics? The 'is it real or random?' problem", est:"8 min",
      learn: [
        "<strong>The fundamental data-science question:</strong> when I see a pattern in the data, is it REAL — or did it happen by chance?",
        "<strong>Example:</strong> In your shop, last week's sales were 12% higher than the previous week. Is your business actually growing? Or is this just random variation?",
        "<strong>Without statistics</strong>, you trust your gut. Sometimes right, often wrong, always at risk of being fooled by randomness.",
        "<strong>With statistics</strong>, you can say: <em>'There's only a 3% chance this 12% jump happened by random fluctuation alone. It's probably real.'</em>",
        "<strong>The Nigerian classroom example:</strong> Your school's Maths pass rate this year is 78%, vs 72% last year. Six-point jump. Real improvement, or just luck of the year? If you have 30 students, that's 23 vs 22 — basically noise. If you have 300 students, that's 234 vs 216 — much more meaningful.",
        "<strong>Statistics gives you 3 superpowers:</strong><br>1. <strong>Describe</strong> a dataset compactly (averages, spreads).<br>2. <strong>Infer</strong> from a sample to a population (surveys, polls, AB tests).<br>3. <strong>Decide</strong> whether observed patterns are signal or noise.",
        "<strong>The honest disclaimer:</strong> Statistics can be tortured into saying anything. The job of a serious data scientist is to use stats <em>responsibly</em> — knowing the limits, reporting uncertainty, never overclaiming."
      ],
      example: "<strong>A common error to avoid:</strong> 'Customers who use feature X spend 30% more.' Maybe... or maybe customers who already spend a lot are more likely to discover feature X. <em>Correlation is not causation.</em> This module will arm you to spot the difference.",
      quiz: {
        q: "Last year your shop sold 1,000 units of jollof. This year it sold 1,030. Did jollof demand grow?",
        a: [
          { t:"Yes, it went up 3%", c:false, why:"Maybe — but 3% could easily be random noise. Statistics asks: is 3% beyond what we'd expect from chance?" },
          { t:"We need more info — typical weekly variation, time period, other factors", c:true, why:"Yes! Without context (variability, sample size, other variables), 3% is just a number — not yet a finding." },
          { t:"No, sales are stable", c:false }
        ]
      },
      takeaway: "Statistics separates signal from noise. Without it, you trust gut and get fooled by randomness.",
      glossary: [
        { term:"Signal", def:"A real underlying pattern in data." },
        { term:"Noise", def:"Random variation that creates false patterns." }
      ]
    },

    { id:"m4.l2", type:"concept", title:"2. Mean, median, mode — three kinds of 'average'", est:"9 min",
      learn: [
        "When we say 'average', we usually mean one of three things. They give DIFFERENT answers — and choosing the wrong one is misleading.",
        "<strong>1. Mean</strong> — add all values, divide by count. The 'arithmetic average' everyone learns in school. <code>SUM / COUNT</code>.",
        "<strong>2. Median</strong> — sort the values, pick the middle one. (If even count, average the two middle ones.) The 'typical' value.",
        "<strong>3. Mode</strong> — the most common value. The 'popular' value.",
        "<strong>When they differ — and why it matters:</strong>",
        "Suppose 9 people earn ₦50,000/month and 1 earns ₦5,000,000/month.<pre>Mean   = (9 × 50,000 + 5,000,000) / 10 = ₦545,000\nMedian = ₦50,000  (middle value when sorted)\nMode   = ₦50,000  (most common)</pre>The MEAN says 'average earnings are ₦545,000' — technically true but <strong>massively misleading</strong>. The MEDIAN tells the honest story: most people earn ₦50,000.",
        "<strong>Rule:</strong> When the data has <strong>extreme values (outliers)</strong> or is <strong>skewed</strong> (most values low, a few high — like income, house prices, sales), use the MEDIAN. When it's roughly symmetric (heights, exam scores), use the MEAN.",
        "<strong>The 'average Nigerian earner' trap:</strong> Government and journalists often quote mean salaries. With a few billionaires, this exaggerates typical income wildly. Always ask 'mean or median?'"
      ],
      example: "<pre>-- SQL examples\nSELECT AVG(salary) AS mean_salary FROM employees;          -- mean\n\n-- Median (PostgreSQL / Standard SQL)\nSELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary)\nFROM employees;                                            -- median\n\n-- Mode (most common)\nSELECT salary, COUNT(*) AS freq\nFROM employees\nGROUP BY salary\nORDER BY freq DESC\nLIMIT 1;                                                    -- mode</pre>",
      tryq: "Compute average salary by department",
      quiz: {
        q: "House prices on your street: ₦10M, ₦12M, ₦11M, ₦13M, ₦200M. What's the median?",
        a: [
          { t:"₦200M (the highest)", c:false },
          { t:"₦49.2M (the mean — pulled up by the outlier)", c:false },
          { t:"₦12M (sort and pick middle: 10, 11, 12, 13, 200 → 12)", c:true, why:"Yes! Median is the middle value of the sorted list — much more representative of the typical house." }
        ]
      },
      takeaway: "Mean = arithmetic average. Median = middle value. Mode = most common. Skewed data → use median. Always ask 'which average?'",
      glossary: [
        { term:"Skewed", def:"A distribution that's lopsided (long tail on one side). Income, house prices, sales are typically right-skewed." },
        { term:"Outlier", def:"A value far from the rest. Can be an error or a rare-but-real event." }
      ]
    },

    { id:"m4.l3", type:"concept", title:"3. Spread — variance, standard deviation, IQR", est:"10 min",
      learn: [
        "The 'average' tells you the centre. <strong>Spread</strong> tells you how much values vary around that centre. Two datasets can have the same mean and be totally different.",
        "<strong>Example:</strong> Class A: scores 65, 70, 75 → mean 70. Class B: scores 0, 70, 140 → mean 70. Same mean. Very different stories.",
        "<strong>4 spread measures:</strong>",
        "<strong>1. Range</strong> = max - min. Simple but easily distorted by one outlier.",
        "<strong>2. Variance</strong> = average of squared deviations from the mean. Squared because we want positive numbers (so big departures count). Units are squared (₦² for currency — ugly).",
        "<strong>3. Standard Deviation (SD)</strong> = square root of variance. Same units as data. <strong>This is the workhorse</strong>. Roughly: 'typical distance from the mean'.",
        "<strong>4. Interquartile Range (IQR)</strong> = 75th percentile minus 25th percentile. The 'middle 50%' range. Robust to outliers. Use this for skewed data.",
        "<strong>The 68-95-99.7 rule</strong> (for roughly bell-shaped data): about 68% of values fall within 1 SD of the mean, 95% within 2 SDs, 99.7% within 3 SDs. <strong>This is the most useful single rule in statistics.</strong>",
        "<strong>Example:</strong> Class average 70, SD 10. Then ~95% of students scored between 50 and 90. Anyone outside that is unusual."
      ],
      example: "<pre>-- SQL: mean and standard deviation of test scores\nSELECT\n  AVG(score)    AS mean_score,\n  STDDEV(score) AS sd_score,\n  MAX(score) - MIN(score) AS range_score,\n  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY score) -\n  PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY score) AS iqr\nFROM exam_results;</pre>",
      tryq: "Standard deviation of salary by department",
      quiz: {
        q: "Mean = 100, SD = 15. By the 68-95-99.7 rule, about 95% of values lie between:",
        a: [
          { t:"85 and 115 (mean ± 1 SD)", c:false, why:"That's the 68% interval." },
          { t:"70 and 130 (mean ± 2 SDs)", c:true, why:"Yes! 95% of values lie within 2 SDs for roughly bell-shaped data." },
          { t:"55 and 145 (mean ± 3 SDs)", c:false, why:"That's the 99.7% interval." }
        ]
      },
      takeaway: "Spread tells you how varied data is. SD (typical departure from mean) is the workhorse. IQR for skewed data. 68-95-99.7 rule for bell-shaped.",
      glossary: [
        { term:"Variance", def:"Average squared deviation from the mean. Units are squared." },
        { term:"Standard Deviation", def:"Square root of variance. Same units as data. 'Typical distance from the mean.'" },
        { term:"IQR", def:"Interquartile Range = Q3 - Q1. Middle 50% spread. Robust to outliers." }
      ]
    },

    { id:"m4.l4", type:"concept", title:"4. Distributions — how values are spread out", est:"10 min",
      learn: [
        "A <strong>distribution</strong> describes how values of a variable are spread across their range. Knowing the shape is essential — it dictates what stats you can use.",
        "<strong>4 shapes you must recognise:</strong>",
        "<strong>1. Normal (bell curve)</strong> — symmetric, single peak in the middle. Heights, IQ, measurement errors. The 68-95-99.7 rule applies.",
        "<strong>2. Right-skewed (long tail right)</strong> — most values low, a few very high. <strong>Most real-world money data</strong>: incomes, sales, house prices, view counts. Mean &gt; median.",
        "<strong>3. Left-skewed (long tail left)</strong> — less common. Examples: age at death, exam scores when most pass.",
        "<strong>4. Bimodal (two peaks)</strong> — two clusters mixed. Hidden subgroups. Example: heights mixing men and women shows two peaks.",
        "<strong>How to spot the shape: draw a HISTOGRAM.</strong> A histogram bins values into ranges and shows the count per bin. Single most useful exploratory chart.",
        "<strong>Why shape matters:</strong>",
        "• Normal-ish data → mean + SD describe it well, parametric stats apply.",
        "• Skewed data → use median + IQR, log-transform if needed.",
        "• Bimodal → split into subgroups first; analysing them as one population is misleading.",
        "<strong>Always plot a histogram before computing summary stats.</strong> If the shape isn't what you assumed, your conclusions could be wrong."
      ],
      example: "<strong>Income in Nigeria</strong> is heavily right-skewed: median ~₦400k/year, mean pulled up by a few billionaires. A histogram of incomes shows a long tail to the right. Reporting mean income would mislead policy decisions. Median tells the typical-Nigerian story.",
      tryq: "Show distribution of order amounts",
      quiz: {
        q: "Your daily website visitors histogram looks like one big peak on the left and a long tail to the right. What shape?",
        a: [
          { t:"Normal (bell curve)", c:false },
          { t:"Right-skewed", c:true, why:"Yes! Long tail right = right-skewed (positively skewed). Typical for traffic, sales, sizes." },
          { t:"Bimodal", c:false }
        ]
      },
      takeaway: "Distributions describe how values spread. Normal, right-skewed, left-skewed, bimodal. Always histogram first; shape dictates analysis.",
      glossary: [
        { term:"Distribution", def:"How values of a variable are spread across their range." },
        { term:"Histogram", def:"Bar chart of value-frequency. Bins on x-axis, count on y-axis." }
      ]
    },

    { id:"m4.l5", type:"concept", title:"5. Probability basics — the language of uncertainty", est:"10 min",
      learn: [
        "Probability is the language for talking about uncertainty. <strong>It's a number between 0 and 1</strong> (or 0% and 100%) describing how likely something is.",
        "<strong>P = 0</strong> impossible. <strong>P = 1</strong> certain. <strong>P = 0.5</strong> equally likely.",
        "<strong>The 3 rules everyone must know:</strong>",
        "<strong>Rule 1 (complement):</strong> <code>P(NOT A) = 1 - P(A)</code>. If raining tomorrow has P=0.3, then NOT-raining has P=0.7.",
        "<strong>Rule 2 (and, independent):</strong> If A and B are <em>independent</em>, <code>P(A AND B) = P(A) × P(B)</code>. Two coin flips both heads = 0.5 × 0.5 = 0.25.",
        "<strong>Rule 3 (or, mutually exclusive):</strong> If A and B can't both happen, <code>P(A OR B) = P(A) + P(B)</code>. Rolling a 1 or 2 on a die = 1/6 + 1/6 = 1/3.",
        "<strong>Conditional probability:</strong> <code>P(A|B)</code> = probability of A given that B happened. <em>'What's the probability of fraud GIVEN the transaction is over ₦5M?'</em> — much higher than the baseline.",
        "<strong>The gambler's fallacy</strong> — common mistake. After 5 reds in a row at roulette, black is NOT 'due'. Each spin is independent; previous spins don't influence the next.",
        "<strong>The base rate fallacy</strong> — also common. A 95%-accurate fraud detector still produces mostly false alarms if real fraud is rare (1 in 10,000 transactions). Always consider the base rate."
      ],
      example: "<strong>The cancer screening paradox</strong> — a 99%-accurate test for a disease that affects 1 in 10,000 people. You test positive. What's the chance you actually have it?<br>Answer: only about 1%. The 1% false-positive rate, multiplied by 9,999 healthy people, produces about 100 false alarms — vs only 1 true case. <strong>Base rates matter more than test accuracy.</strong>",
      quiz: {
        q: "You flip a coin 5 times and get HHHHH. What's the probability of H on the 6th flip?",
        a: [
          { t:"Less than 50% — tails is 'due'", c:false, why:"Gambler's fallacy. Coins don't remember." },
          { t:"50% — coin has no memory", c:true, why:"Yes! Independent events. Previous outcomes don't affect the next." },
          { t:"More than 50% — the coin must be biased toward H", c:false, why:"With only 5 flips, this is the wrong inference. 1 in 32 chance of 5 heads from a fair coin." }
        ]
      },
      takeaway: "Probability is between 0 and 1. Complement, AND (independent: multiply), OR (exclusive: add). Watch for gambler's fallacy and base rate fallacy.",
      glossary: [
        { term:"Independent events", def:"Events whose outcomes don't influence each other." },
        { term:"Conditional probability", def:"P(A|B) — probability of A given B has occurred." }
      ]
    },

    { id:"m4.l6", type:"concept", title:"6. Sampling — why we can't measure everyone", est:"9 min",
      learn: [
        "We rarely have data on the WHOLE population. We have a <strong>sample</strong> and we infer about the population from it. This is the heart of inferential statistics.",
        "<strong>Population</strong> = everyone you care about (all Nigerian voters, all GTBank customers, all jollof orders ever).<br><strong>Sample</strong> = the subset you actually measured (1,000 polled voters, 10,000 customers, last month's orders).",
        "<strong>The golden rule:</strong> sample must be REPRESENTATIVE. If you only ask Lagos residents about a national election, your sample is biased.",
        "<strong>4 sampling techniques:</strong>",
        "<strong>1. Simple random</strong> — every person has equal chance. Hard to achieve in practice (who has a list of all Nigerians?).",
        "<strong>2. Stratified</strong> — split population into groups (regions, ages), sample proportionally from each. Best for surveys.",
        "<strong>3. Cluster</strong> — pick a few groups, sample everyone in those groups. Practical but groups must be similar.",
        "<strong>4. Convenience</strong> — whoever is easy to reach. Cheap, common, often biased. Twitter polls are convenience samples — they tell you about Twitter users, not Nigerians.",
        "<strong>Sample size matters.</strong> Bigger ≠ always better, but smaller = noisier estimates.",
        "<strong>Rule of thumb:</strong><br>• &lt;30 — very noisy, large margin of error<br>• 100-400 — typical for online surveys, ±5-10% margin<br>• 1,000-2,000 — national-level polls, ±3% margin<br>• 30,000+ — diminishing returns for most questions",
        "<strong>The classic disaster:</strong> the 1936 US Literary Digest poll predicted Roosevelt would lose. They sampled 2.4 million people — but only from car/phone owners (a wealthy subset). The sample was huge AND biased. Better to have 1,000 representative people than 1 million biased ones."
      ],
      example: "<strong>Real-world failure:</strong> A Nigerian fintech surveyed app users about loan repayment willingness. 80% said they'd repay on time. Actual repayment rate: 40%. The sample (current happy users) didn't represent future borrowers. The survey was a convenience sample, not a random one.",
      quiz: {
        q: "You want to predict the next Lagos governorship election. Which sampling approach is BEST?",
        a: [
          { t:"Poll 10,000 people on Twitter/X", c:false, why:"Convenience sample — represents Twitter users, not Lagos voters." },
          { t:"Poll 1,000 people stratified by LGA, age and gender", c:true, why:"Yes! Stratified by demographics matching Lagos's actual population." },
          { t:"Poll everyone at the busiest market", c:false, why:"Convenience + biased toward people who shop there." }
        ]
      },
      takeaway: "Sample to estimate population. Representativeness > size. Stratified is usually best. Bigger sample doesn't fix a biased one.",
      glossary: [
        { term:"Population", def:"Everyone you want to draw conclusions about." },
        { term:"Sample", def:"The subset you actually measure." },
        { term:"Sampling bias", def:"Systematic difference between sample and population that distorts conclusions." }
      ]
    },

    { id:"m4.l7", type:"concept", title:"7. Confidence intervals — honest uncertainty", est:"10 min",
      learn: [
        "When you compute an average from a sample, you don't know the TRUE population average. You know your estimate. <strong>A confidence interval (CI)</strong> is the range that's likely to contain the true value.",
        "<strong>Example:</strong> You survey 500 Lagosians; 60% say they support candidate A. The TRUE percentage among all Lagosians is probably between 56% and 64% (a 95% confidence interval).",
        "<strong>The standard formula (approximately):</strong><pre>95% CI = sample_mean ± 1.96 × (SD / √sample_size)</pre>The <code>1.96</code> is the magic number for 95% confidence (use 2.58 for 99%, 1.64 for 90%).",
        "<strong>The smaller the sample, the wider the interval.</strong> Quadruple your sample size, halve the interval width.",
        "<strong>Common misinterpretation:</strong> '95% confidence' does NOT mean 'there's a 95% chance the true value is in this interval.' It means 'if I repeated this study 100 times, 95 of my intervals would contain the truth.' Subtle but important.",
        "<strong>Margin of error</strong> is half the CI width. The thing news headlines quote.",
        "<strong>Practical use:</strong> Always report a CI alongside your estimate. <em>'Sales grew by 7% (95% CI: 4% to 10%)'</em> is honest. <em>'Sales grew by 7%'</em> is misleadingly precise."
      ],
      example: "<pre>-- Approximate 95% CI for a column's mean (Python pseudo-code)\n-- Not a single SQL function, but compute:\nimport scipy.stats as st\nci = st.t.interval(0.95, len(data)-1, loc=data.mean(),\n                                       scale=st.sem(data))\n# scale = standard error = SD / sqrt(n)</pre>The interval tells stakeholders how confident to be. Without it, every estimate looks like exact truth.",
      quiz: {
        q: "Sample of 100 has mean 50, SD 10. Approximate 95% CI?",
        a: [
          { t:"40 to 60", c:false, why:"That would be ± SD, which is wider than a CI of the mean." },
          { t:"48.04 to 51.96 (≈ 50 ± 1.96 × 10/√100)", c:true, why:"Yes! ± 1.96 × SE, where SE = SD/√n = 10/10 = 1. So 50 ± 1.96 ≈ 48 to 52." },
          { t:"30 to 70", c:false }
        ]
      },
      takeaway: "CI = range likely to contain true value. Quote it with every estimate. Wider CI = more uncertainty. Bigger n = narrower CI.",
      glossary: [
        { term:"Confidence interval", def:"Range that contains the true parameter with stated confidence (usually 95%)." },
        { term:"Standard error (SE)", def:"SD / √sample_size. Measures uncertainty of the SAMPLE MEAN as estimate of population mean." }
      ]
    },

    { id:"m4.l8", type:"concept", title:"8. Hypothesis testing & p-values", est:"12 min",
      learn: [
        "Hypothesis testing is how we decide: <em>is this difference real, or could it have happened by chance?</em>",
        "<strong>The setup:</strong>",
        "<strong>Null hypothesis (H₀)</strong> = the boring default. <em>'There is NO real difference.'</em>",
        "<strong>Alternative hypothesis (H₁)</strong> = what you want to show. <em>'There IS a real difference.'</em>",
        "<strong>Example:</strong> You redesigned your checkout page. Conversion went from 12% to 14%. Is the new page actually better, or did 2% appear by chance?<br>H₀: the pages have identical true conversion rates.<br>H₁: the new page is genuinely better.",
        "<strong>The p-value</strong> is the probability of seeing your observed difference (or larger) IF the null hypothesis were true.",
        "<strong>Tiny p (e.g. 0.001)</strong> = the observed pattern would be EXTREMELY UNLIKELY under H₀, so we reject H₀ → 'statistically significant.'<br><strong>Large p (e.g. 0.4)</strong> = the pattern is consistent with H₀ being true → 'not significant.'",
        "<strong>The conventional threshold:</strong> p &lt; 0.05 = significant. It's a CONVENTION, not a law of nature.",
        "<strong>Common p-value MYTHS (memorise these — they're constantly violated):</strong>",
        "<strong>MYTH 1:</strong> 'p &lt; 0.05 means there's a 95% chance the effect is real.' <strong>FALSE.</strong> p is about data under H₀, not about H₁.",
        "<strong>MYTH 2:</strong> 'p = 0.04 vs p = 0.06 — one is significant, the other isn't.' <strong>FALSE.</strong> Both are similar; the threshold is arbitrary.",
        "<strong>MYTH 3:</strong> 'Significant means important / large.' <strong>FALSE.</strong> With huge samples, tiny meaningless differences become significant. Always report EFFECT SIZE alongside p.",
        "<strong>P-hacking</strong> — testing dozens of hypotheses and only reporting the 'significant' ones — is a serious ethical violation. Pre-register your hypotheses."
      ],
      example: "<strong>Real example:</strong> You run an A/B test of two ad creatives. Variant A: 100 clicks from 1,000 views (10% CTR). Variant B: 130 clicks from 1,000 views (13% CTR). Difference looks meaningful. But is it real?<br>Run a chi-square test or proportions test. p-value comes out to ~0.04 → significant at 5% level. So B is probably better. <strong>Effect size:</strong> 3 percentage points absolute, 30% relative — practically meaningful.",
      quiz: {
        q: "Your A/B test shows p = 0.02. What does this mean?",
        a: [
          { t:"There's a 2% chance the effect is real", c:false, why:"Common misinterpretation!" },
          { t:"If there were no real difference, you'd see data this extreme only 2% of the time — strong evidence against the null", c:true, why:"Yes! p is the probability of the data under H₀, not the probability of the hypothesis." },
          { t:"The effect is huge", c:false, why:"p says nothing about effect size." }
        ]
      },
      takeaway: "p = probability of observed data (or worse) given the null. p < 0.05 = significant convention. ALWAYS report effect size. Avoid p-hacking.",
      glossary: [
        { term:"Null hypothesis", def:"The default 'no effect / no difference' assumption to be tested." },
        { term:"p-value", def:"P(data ≥ observed | H₀ true). Small = evidence against null." },
        { term:"Effect size", def:"The MAGNITUDE of an effect. p tells you 'is it real?'; effect size tells you 'how big?'" }
      ]
    },

    { id:"m4.l9", type:"concept", title:"9. Correlation — measuring relationships", est:"9 min",
      learn: [
        "<strong>Correlation</strong> measures how strongly two numeric variables move together. Number between -1 and +1.",
        "<strong>+1</strong> = perfect positive (as A goes up, B goes up proportionally).<br><strong>0</strong> = no linear relationship.<br><strong>-1</strong> = perfect negative (as A goes up, B goes down proportionally).",
        "<strong>The most common measure: Pearson correlation coefficient (r).</strong> Measures LINEAR relationships only.",
        "<strong>Rough interpretation:</strong> |r| &gt; 0.7 strong. 0.3-0.7 moderate. 0.1-0.3 weak. &lt;0.1 negligible. Signs (+/-) show direction.",
        "<strong>Always visualise.</strong> A scatter plot shows the relationship. Compute correlation only AFTER looking at the plot. The famous <em>Anscombe's quartet</em> shows 4 totally different datasets with identical r — always plot.",
        "<strong>THE MOST IMPORTANT RULE IN STATISTICS:</strong> <strong>Correlation is NOT causation.</strong>",
        "<strong>Examples of misleading correlations:</strong>",
        "• Ice cream sales correlate with drowning. Cause? Hot weather (third variable).",
        "• Country chocolate consumption correlates with Nobel prizes. Cause? Wealth (third variable).",
        "• In Lagos schools, students with bigger feet score better on exams. Cause? Age (older students = bigger feet AND better at exams).",
        "<strong>To establish causation,</strong> you need: (a) randomised experiment (A/B test), or (b) very careful observational study with control for confounders.",
        "<strong>Spearman correlation</strong> — measures rank correlation (any monotonic relationship, not just linear). Use for non-linear or ordinal data."
      ],
      example: "<pre>-- Compute correlation between sales and ad-spend in SQL (PostgreSQL)\nSELECT CORR(sales, ad_spend) AS r\nFROM monthly_summary;\n\n-- A high r (e.g. 0.85) says they move together strongly.\n-- It does NOT prove ads CAUSE sales. Maybe sales-rich months\n-- also happen to be ad-spend-rich months (e.g. December).</pre>",
      tryq: "Correlation between price and units sold",
      quiz: {
        q: "Correlation between number of fire trucks at a fire and damage caused is +0.85. Conclusion?",
        a: [
          { t:"Sending more trucks causes more damage", c:false, why:"Classic confounder! Bigger fires cause BOTH more trucks AND more damage." },
          { t:"Bigger fires cause both — trucks and damage are co-effects of fire size", c:true, why:"Yes! Third variable (fire size) confounds the relationship." },
          { t:"Trucks should be sent in smaller numbers", c:false }
        ]
      },
      takeaway: "Correlation = how variables move together (-1 to +1). NEVER assume causation. Always plot. Watch for confounders.",
      glossary: [
        { term:"Correlation", def:"Measure of how strongly two variables move together. Pearson r for linear, Spearman for monotonic." },
        { term:"Confounder", def:"A third variable that influences both A and B, creating apparent correlation without direct cause." }
      ]
    },

    { id:"m4.l10", type:"concept", title:"10. Regression — predicting one variable from another", est:"12 min",
      learn: [
        "<strong>Regression</strong> finds the best mathematical line (or curve) describing how one variable predicts another.",
        "<strong>Simple linear regression:</strong> <code>y = m·x + b</code> — the equation of a straight line.<br>• <strong>y</strong> = what we predict (e.g. monthly revenue).<br>• <strong>x</strong> = predictor (e.g. ad spend).<br>• <strong>m</strong> = slope (₦ revenue per ₦ ad spend).<br>• <strong>b</strong> = intercept (revenue when ad spend = 0).",
        "<strong>How it works:</strong> Among all possible lines, regression picks the one MINIMISING the sum of squared distances from actual points to the line (the famous 'least squares' method).",
        "<strong>Interpreting output:</strong>",
        "<strong>Slope (coefficient):</strong> '₦1 spent on ads → ₦2.50 of revenue.' Direct, useful.",
        "<strong>R² (R-squared):</strong> 0 to 1. Fraction of variance in y explained by x. R² = 0.7 means 70% of revenue variation is explained by ad spend; 30% is something else.",
        "<strong>P-value for the slope:</strong> Is the slope statistically distinguishable from zero? p &lt; 0.05 → yes, the relationship is real.",
        "<strong>Multiple regression</strong> = several predictors at once: <code>revenue = b + m₁·ads + m₂·season + m₃·promotion</code>. Lets you isolate each variable's effect while controlling for others.",
        "<strong>Assumptions (often violated, always check):</strong> linearity, no extreme outliers, residuals roughly normal, residuals independent (no autocorrelation).",
        "<strong>Critical reminder:</strong> regression establishes association, NOT causation. Adding more variables doesn't fix this."
      ],
      example: "<pre># Python sneak peek — what we'll do in Module 8\nfrom sklearn.linear_model import LinearRegression\nmodel = LinearRegression()\nmodel.fit(X, y)\nprint('Slope:', model.coef_)\nprint('Intercept:', model.intercept_)\nprint('R²:', model.score(X, y))</pre>",
      tryq: "Regression analysis of sales vs ad spend",
      quiz: {
        q: "Your regression has R² = 0.45. What does that mean?",
        a: [
          { t:"45% accuracy in predicting individual values", c:false },
          { t:"45% of the variance in y is explained by x; the rest is from other factors or noise", c:true, why:"Yes! R² is the fraction of variation in y that the model captures." },
          { t:"45% confidence in the slope", c:false }
        ]
      },
      takeaway: "Regression fits a line predicting y from x. Slope = effect per unit. R² = fraction of variance explained. Multiple regression for several predictors.",
      glossary: [
        { term:"Regression", def:"Statistical method to model the relationship between a target variable and one or more predictors." },
        { term:"R² (R-squared)", def:"Fraction of variance in the target explained by the model. 0 (useless) to 1 (perfect)." }
      ]
    },

    { id:"m4.l11", type:"concept", title:"11. A/B testing — the gold standard for causation", est:"12 min",
      learn: [
        "<strong>A/B testing</strong> (also called a randomised experiment, controlled trial, or split test) is the only reliable way to establish CAUSATION outside the lab. Used by every tech company, every drug trial, every modern political campaign.",
        "<strong>The setup:</strong>",
        "1. Take a population (e.g. website visitors).",
        "2. Randomly assign each one to either Group A (old version) or Group B (new version). <strong>Randomly</strong> is the key word — it neutralises all confounders, even ones you didn't think of.",
        "3. Run for long enough to collect data.",
        "4. Measure the metric you care about (conversion rate, revenue per user, etc.).",
        "5. Run a hypothesis test (proportions test for rates, t-test for means).",
        "<strong>Why randomisation is magic:</strong> If you randomly assign 10,000 people, both groups will have similar age distributions, similar income distributions, similar weather exposure, similar everything — by random chance. So any DIFFERENCE in outcomes must be caused by the treatment.",
        "<strong>Sample size calculation:</strong> Before running, compute how many users you need to detect the effect size you care about. Tools: Optimizely's calculator, Evan Miller's online calculator. Free.",
        "<strong>Common mistakes:</strong>",
        "<strong>1. Peeking</strong> — checking results halfway and stopping when p &lt; 0.05. INFLATES false-positive rate massively. Fix: pre-commit to a sample size.",
        "<strong>2. Running too many tests</strong> — if you test 100 hypotheses, ~5 will be 'significant' at p&lt;0.05 by pure chance. Use Bonferroni correction or false discovery rate.",
        "<strong>3. Novelty effect</strong> — new design feels exciting for a week, returns to baseline. Run long enough.",
        "<strong>4. Survivorship bias</strong> — only counting users who completed. Include drop-outs in the denominator."
      ],
      example: "<strong>A real Nigerian fintech A/B test:</strong> The team tested two loan-application form layouts. Variant A (control): existing 8-step form. Variant B: new 3-step form. Random assignment to 10,000 new users over 4 weeks.<br><strong>Result:</strong> Variant B had 21% completion vs A's 14%. Lift: +7 percentage points (50% relative). p &lt; 0.001 — very significant. <strong>Decision:</strong> roll out B to 100% of users.",
      tryq: "Compare conversion rates of two variants",
      quiz: {
        q: "You're A/B testing a new homepage. Two weeks in, p = 0.06. You decide to keep running for one more week and check again. What's the problem?",
        a: [
          { t:"No problem — more data is always better", c:false, why:"Peeking & stopping early when significant inflates false-positive rate severely." },
          { t:"This is 'peeking' — repeatedly checking and stopping inflates false positives. Pre-commit to a sample size.", c:true, why:"Correct! Frequentist tests assume a fixed sample. Sequential testing requires special methods." },
          { t:"You should run until p = 0.001", c:false }
        ]
      },
      takeaway: "A/B test = randomised experiment. Only way to prove causation. Random assignment neutralises confounders. Pre-commit to sample size; don't peek.",
      glossary: [
        { term:"A/B test", def:"Randomised controlled experiment comparing two (or more) variants." },
        { term:"Treatment vs control", def:"Treatment = the new thing being tested. Control = the existing version." }
      ]
    },

    { id:"m4.l12", type:"concept", title:"12. Bias & fairness — when statistics goes wrong", est:"10 min",
      learn: [
        "Numbers are not neutral. The choices you make in collecting, sampling and modelling data embed assumptions that can harm people. <strong>Every data scientist needs a fairness lens.</strong>",
        "<strong>5 common bias types:</strong>",
        "<strong>1. Selection bias</strong> — your sample isn't representative. (Module 4 Lesson 6 covered this.) Surveying only smartphone users excludes the poor.",
        "<strong>2. Confirmation bias</strong> — you find what you're looking for. Analysts who start with a conclusion select data and tests until they 'prove' it.",
        "<strong>3. Survivorship bias</strong> — you only see the survivors. <em>'All successful entrepreneurs dropped out of college!'</em> You don't see the millions who dropped out and failed.",
        "<strong>4. Measurement bias</strong> — your instrument systematically misreads. Asking 'how often do you drink?' produces under-reports.",
        "<strong>5. Historical bias</strong> — your data reflects past injustices. Training a hiring model on past decisions reproduces past biases (women being hired less in tech, for example).",
        "<strong>Algorithmic fairness — 3 definitions (they conflict!):</strong>",
        "<strong>Demographic parity:</strong> equal positive-rate across groups. <em>'Loan-approval rate same for men/women.'</em> Simple but ignores risk differences.",
        "<strong>Equal opportunity:</strong> equal true-positive rate across groups. <em>'Among qualified applicants, equal hire rate for men/women.'</em> Better.",
        "<strong>Calibration:</strong> a 70% predicted risk means 70% actual risk regardless of group. <em>Predictions are equally honest per group.</em>",
        "<strong>The COMPAS scandal:</strong> A US recidivism prediction algorithm was calibrated, BUT had unequal false-positive rates by race. Both definitions could not be satisfied simultaneously. <strong>Mathematical theorem (Kleinberg et al.):</strong> the three fairness definitions are mathematically incompatible unless base rates are equal. There's no purely-technical fix.",
        "<strong>What to do:</strong> Always audit your model across demographic subgroups. Report disparities. Involve affected communities in the design. Be honest about trade-offs."
      ],
      example: "<strong>The Amazon hiring AI</strong> (2018) was trained on 10 years of resumes. Most past hires were men. The model learned to downgrade resumes containing 'women's' (as in 'women's chess club'). Amazon scrapped the project. <strong>Historical bias</strong> in training data → biased model.",
      quiz: {
        q: "You build a credit-scoring model. Its overall accuracy is 92%. But for applicants in northern Nigeria, it's 70%; for southern Nigeria, 94%. Should you deploy?",
        a: [
          { t:"Yes — 92% overall is great", c:false, why:"Average accuracy hides disparities that may legally and ethically harm a group." },
          { t:"No — investigate why accuracy differs by region, fix the bias (more data, re-weighting, fairness constraints), then re-evaluate", c:true, why:"Yes! Subgroup audits are mandatory. Deploying disparate models risks legal action (NDPA) and harm." },
          { t:"Deploy only in the south", c:false, why:"Discriminatory by design." }
        ]
      },
      takeaway: "Bias hides in samples, choices, history. Audit subgroups always. Fairness definitions conflict — no technical fix; need ethical judgement.",
      glossary: [
        { term:"Algorithmic fairness", def:"The study of bias in algorithms and methods to mitigate it." },
        { term:"Historical bias", def:"When training data reflects past discrimination, perpetuating it in new models." }
      ]
    },

    { id:"m4.l13", type:"concept", title:"13. Statistical pitfalls — Simpson's paradox & friends", est:"10 min",
      learn: [
        "Sometimes statistics produces results that defy intuition. Recognising these <strong>paradoxes</strong> protects you from wrong conclusions.",
        "<strong>1. Simpson's paradox</strong> — a trend that appears in groups DISAPPEARS or REVERSES when groups are combined.",
        "<strong>Famous example:</strong> A US university analysed admissions and found <em>'women are admitted at 35%, men at 44% — therefore discrimination!'</em>. But when broken down by department: women had HIGHER admission rates in MOST departments. The reversal? Women applied to harder-to-get-into departments. Aggregate stats lied.",
        "<strong>Lesson:</strong> Always check sub-groups before declaring aggregate findings.",
        "<strong>2. Regression to the mean</strong> — extreme values tend to be followed by less-extreme values. The 'genius' student who scored 99 will probably score lower next time. The CEO who turned around the company may have just been lucky in year 1. Don't mistake regression for failure.",
        "<strong>3. Survivorship bias</strong> — already covered, but worth re-mention. Analysing only successful startups gives a wrong picture of what works.",
        "<strong>4. Selection bias in observational studies</strong> — people who CHOOSE a treatment differ from those who don't. <em>'Vitamin-takers live longer'</em> — maybe vitamin-takers are also wealthier, more health-conscious, more likely to exercise.",
        "<strong>5. Multiple comparisons</strong> — testing 100 hypotheses, ~5 'significant' by chance at p&lt;0.05. Use Bonferroni correction.",
        "<strong>6. P-hacking</strong> — trying different splits / subsets / variables until something is 'significant.' Cousin of cherry-picking.",
        "<strong>7. Goodhart's Law</strong> — 'when a measure becomes a target, it ceases to be a good measure.' Optimising click-through rate produces clickbait. Optimising for grades produces test prep. The metric corrupts the goal.",
        "<strong>Defensive practice:</strong> Pre-register your hypothesis. Compute confidence intervals. Always sanity-check with domain knowledge. Be deeply suspicious of results that perfectly confirm your prior."
      ],
      example: "<strong>Real Simpson's paradox in Nigerian schools:</strong> School A has 75% pass rate, School B has 80%. Looks like B is better. Break down by stream (Arts/Science/Commercial): School A is BETTER in all three streams. The aggregate flipped because A has more Science students (harder to pass) and B has more Commercial (easier to pass). Composition matters.",
      quiz: {
        q: "After firing the lowest-performing 10% of salespeople, the next quarter's TEAM average sales jumps 5%. Did the firings cause the improvement?",
        a: [
          { t:"Yes — removing weak performers raised the average", c:false, why:"Maybe, but you've removed observations from the bottom — average mechanically rises even without behaviour change." },
          { t:"You can't tell — survivorship bias + regression to the mean make causation unclear", c:true, why:"Yes! Both effects could explain the jump without any real improvement." },
          { t:"No, it's pure coincidence", c:false }
        ]
      },
      takeaway: "Simpson's paradox, regression to mean, survivorship, p-hacking, Goodhart. Always sanity-check. Pre-register hypotheses.",
      glossary: [
        { term:"Simpson's paradox", def:"A trend in groups that reverses when groups are combined (or vice versa)." },
        { term:"Regression to the mean", def:"Extreme values tend to be followed by less-extreme ones." },
        { term:"Goodhart's Law", def:"When a measure becomes a target, it stops being a good measure." }
      ]
    },

    { id:"m4.l14", type:"project", title:"14. Module 4 Project — analyse a real survey", est:"75 min",
      learn: [
        "<strong>Mission:</strong> Apply statistical reasoning to a real dataset. Compute summaries, build a hypothesis test, report results honestly.",
        "<strong>Dataset (paste into a sheet or open as CSV in Pandas):</strong> A simulated employee satisfaction survey of 200 Nigerian employees across departments.",
        "<strong>You don't have the actual data file — instead, in QueryPilot, use the default schema (employees table) and these tasks:</strong>",
        "<strong>Task 1 — Descriptive statistics.</strong> Compute mean, median, SD of salary by department. Which department has highest mean? Highest spread?",
        "<strong>Task 2 — Identify outliers.</strong> Any salaries beyond mean ± 3 SD per department? Are they typos or real high earners?",
        "<strong>Task 3 — Hypothesis test.</strong> Is the mean salary in 'Engineering' significantly higher than in 'Sales'? State H₀, H₁, and what test you'd use (t-test for means).",
        "<strong>Task 4 — Correlation.</strong> Is age correlated with salary? Compute and interpret. (Use the schema you defined, with any relevant columns).",
        "<strong>Task 5 — Bias check.</strong> Compute mean salary by status (active vs inactive). Could leaving employees skew your active-employee-only analysis?",
        "<strong>Task 6 — Write a 1-page memo.</strong> Tell a fictional HR director what you found, with confidence intervals and honest caveats. Avoid jargon. Avoid overclaiming."
      ],
      example: "<strong>Sample memo opening:</strong> <em>'Among 87 active employees, mean salary is ₦485,000 (median ₦450,000, SD ₦120,000). The right-skew suggests a few high earners. Engineering and Sales differ by ₦80,000 mean salary; however, with samples of 22 and 19 respectively, the 95% CI for the difference is ₦15k to ₦145k — significant but imprecise. Recommend collecting more data before deciding pay-policy.'</em>",
      project: {
        deliverable: "6 SQL queries + a 1-page memo with honest statistical interpretation.",
        time: "75 minutes",
        difficulty: "Intermediate",
        skills: ["Descriptive stats", "Hypothesis testing", "Correlation", "Bias awareness", "Statistical writing"]
      },
      takeaway: "You can now produce statistical analyses that pass professional scrutiny — with confidence intervals, caveats, and no overclaiming.",
      glossary: []
    }

  ]
},

/* ===================================================================
   MODULE 5 — PYTHON FOR DATA SCIENCE
   =================================================================== */
{
  id: "m5",
  title: "Python for Data Science",
  icon: "🐍",
  color: "#79c0ff",
  level: "Intermediate",
  weeks: 3,
  summary: "Python is the world's most popular data-science language. Free, beginner-friendly, with a massive library ecosystem. This module covers Python from zero — installation, syntax, data structures, control flow, functions — preparing you for Pandas (Module 6) and ML (Module 8).",
  prereq: "Modules 1-4. No prior coding required.",
  lessons: [

    { id:"m5.l1", type:"concept", title:"1. Why Python? Installing your environment", est:"10 min",
      learn: [
        "<strong>Python</strong> is a programming language designed for readability. Its syntax looks closer to English than most languages. Combined with massive libraries (Pandas, NumPy, Scikit-learn) it has become the standard for data science worldwide.",
        "<strong>3 free ways to run Python (pick one):</strong>",
        "<strong>Option 1 — Google Colab (recommended for beginners).</strong> Visit <a href='https://colab.research.google.com' target='_blank' style='color:var(--ac)'>colab.research.google.com</a>. Sign in with Google. Click 'New notebook'. You now have a free Python environment in the browser. <strong>No installation required.</strong> Works on any device including Android tablets.",
        "<strong>Option 2 — Anaconda (recommended for serious work).</strong> Download from <a href='https://www.anaconda.com/download' target='_blank' style='color:var(--ac)'>anaconda.com/download</a>. Installs Python + Jupyter Notebook + all data-science libraries in one go. Free for individuals.",
        "<strong>Option 3 — Plain Python + VS Code.</strong> Install Python from <a href='https://python.org' target='_blank' style='color:var(--ac)'>python.org</a>. Install VS Code editor. Lightweight; you install libraries as needed.",
        "<strong>For this module, use Google Colab.</strong> It's instant, free, runs in any browser.",
        "<strong>Your first Python command:</strong> In a Colab cell, type and press Shift+Enter:<pre>print(\"Hello, Lagos!\")</pre>You should see the output below. Congratulations — you've run your first Python code.",
        "<strong>Two flavours of 'doing Python':</strong><br>• <strong>Scripts</strong> — files ending in .py, run top-to-bottom. Used in production.<br>• <strong>Notebooks</strong> (.ipynb) — interactive cells. Used for analysis and exploration. <strong>Data scientists live in notebooks.</strong>"
      ],
      example: "<pre>print(\"Hello, Lagos!\")             # outputs: Hello, Lagos!\n2 + 3                              # outputs: 5\n\"Adewale\" + \" \" + \"Adeagbo\"         # string concatenation\nlen(\"QueryPilot\")                  # outputs: 10 (length of string)</pre>",
      quiz: {
        q: "You're a beginner on a low-end laptop. What's the easiest way to start running Python?",
        a: [
          { t:"Install Visual Studio + .NET", c:false },
          { t:"Open Google Colab in a browser — no installation needed", c:true, why:"Yes! Colab runs Python in the cloud, free, in any browser." },
          { t:"Buy a MacBook", c:false }
        ]
      },
      takeaway: "Python = beginner-friendly, library-rich, dominates data science. Use Google Colab to start — free, browser-based.",
      glossary: [
        { term:"Python", def:"A general-purpose programming language with simple syntax, widely used in data science." },
        { term:"Notebook (Jupyter / Colab)", def:"An interactive document mixing code, output, charts and prose. The data scientist's workspace." }
      ]
    },

    { id:"m5.l2", type:"concept", title:"2. Variables & basic types", est:"9 min",
      learn: [
        "A <strong>variable</strong> is a name pointing to a value. Use the <code>=</code> sign to assign.",
        "<pre>name = \"Adewale\"        # text (string)\nage = 35                # whole number (integer)\nheight = 1.78           # decimal (float)\nis_active = True        # yes/no (boolean)</pre>",
        "<strong>Variable naming rules:</strong> letters, digits, underscores. Start with a letter or underscore. Case-sensitive (<code>Age</code> ≠ <code>age</code>). <strong>Use snake_case</strong> (lower with underscores): <code>customer_email</code>, not <code>customerEmail</code>.",
        "<strong>Check the type</strong> of any variable with <code>type()</code>:<pre>type(name)        # &lt;class 'str'&gt;\ntype(age)         # &lt;class 'int'&gt;\ntype(height)      # &lt;class 'float'&gt;\ntype(is_active)   # &lt;class 'bool'&gt;</pre>",
        "<strong>Convert between types:</strong><pre>int(\"5\")          # 5    (string to int)\nfloat(\"3.14\")     # 3.14 (string to float)\nstr(99)           # \"99\" (int to string)\nbool(0)           # False (0 is falsy; everything else truthy)</pre>",
        "<strong>Arithmetic:</strong> <code>+</code> <code>-</code> <code>*</code> <code>/</code> (always returns float) <code>//</code> (integer division) <code>%</code> (remainder) <code>**</code> (exponent).",
        "<strong>Comments</strong> start with <code>#</code>. Everything after <code>#</code> on a line is ignored by Python — use for human notes."
      ],
      example: "<pre>price = 1200\nquantity = 50\nrevenue = price * quantity\nprint(\"Total revenue: ₦\" + str(revenue))   # ₦60000\n\n# f-strings (modern, recommended)\nprint(f\"Total revenue: ₦{revenue:,}\")        # ₦60,000 with comma formatting</pre>",
      exercise: {
        steps: 3,
        tool: "Google Colab",
        task: "Create variables for your name, age, city. Compute days_alive = age * 365. Print everything using an f-string."
      },
      quiz: {
        q: "What does <code>5 / 2</code> return in Python?",
        a: [
          { t:"2", c:false, why:"That's 5 // 2 (integer division)." },
          { t:"2.5", c:true, why:"Yes! Single / is always float division." },
          { t:"3", c:false }
        ]
      },
      takeaway: "Variables hold values. 4 types: str, int, float, bool. Use snake_case. type() reveals type. f-strings for formatting.",
      glossary: [
        { term:"Variable", def:"A named container for a value." },
        { term:"f-string", def:"f\"text {variable}\" — modern Python string formatting." }
      ]
    },

    { id:"m5.l3", type:"concept", title:"3. Strings — text manipulation", est:"9 min",
      learn: [
        "Strings are sequences of characters. Wrap in single <code>'</code> or double <code>\"</code> quotes — either works. Use triple <code>\"\"\"</code> for multi-line strings.",
        "<strong>The 10 most useful string operations:</strong>",
        "<strong>1. Length:</strong> <code>len(\"Lagos\") → 5</code>",
        "<strong>2. Concatenate:</strong> <code>\"Lagos\" + \" \" + \"Nigeria\"</code>",
        "<strong>3. Repeat:</strong> <code>\"ha\" * 3 → \"hahaha\"</code>",
        "<strong>4. Indexing:</strong> <code>\"Lagos\"[0] → \"L\"</code> (0-based!)",
        "<strong>5. Slicing:</strong> <code>\"Lagos\"[0:3] → \"Lag\"</code>",
        "<strong>6. Upper/lower:</strong> <code>\"Lagos\".upper() → \"LAGOS\"</code>",
        "<strong>7. Strip whitespace:</strong> <code>\"  hello  \".strip() → \"hello\"</code>",
        "<strong>8. Replace:</strong> <code>\"jollof\".replace(\"j\", \"J\") → \"Jollof\"</code>",
        "<strong>9. Split:</strong> <code>\"a,b,c\".split(\",\") → [\"a\",\"b\",\"c\"]</code>",
        "<strong>10. Contains:</strong> <code>\"o\" in \"jollof\" → True</code>",
        "<strong>F-strings (modern formatting):</strong><pre>name = \"Adewale\"\nage = 35\nprint(f\"{name} is {age} years old\")\nprint(f\"Price: ₦{1234567:,}\")           # ₦1,234,567 (comma format)\nprint(f\"Pi to 2 decimals: {3.14159:.2f}\")  # 3.14</pre>"
      ],
      example: "<pre>email = \"  ADEWALE@HMG.NG  \"\nclean = email.strip().lower()    # \"adewale@hmg.ng\"\ndomain = clean.split(\"@\")[1]     # \"hmg.ng\"\nprint(f\"Cleaned: {clean}, domain: {domain}\")</pre>",
      tryq: "Process a CSV-formatted string",
      quiz: {
        q: "What does <code>\"Lagos\"[1:4]</code> return?",
        a: [
          { t:"\"Lag\"", c:false, why:"That's [0:3]." },
          { t:"\"ago\"", c:true, why:"Yes! Index 1 (a), 2 (g), 3 (o) — slicing is end-exclusive." },
          { t:"\"agos\"", c:false }
        ]
      },
      takeaway: "Strings are sequences. Indexing 0-based. Slicing end-exclusive. .strip, .lower, .replace, .split — your daily tools.",
      glossary: [
        { term:"Slicing", def:"Extracting a substring by index range: str[start:end] (end exclusive)." }
      ]
    },

    { id:"m5.l4", type:"concept", title:"4. Lists & tuples — ordered collections", est:"10 min",
      learn: [
        "<strong>List</strong> = ordered, changeable collection. Square brackets. The Python workhorse.",
        "<pre>cities = [\"Lagos\", \"Abuja\", \"Kano\"]\ncities[0]              # \"Lagos\"   (0-indexed)\ncities[-1]             # \"Kano\"    (negative = from end)\nlen(cities)            # 3\ncities.append(\"Ibadan\")  # add to end\ncities.remove(\"Abuja\")   # remove by value\ncities.sort()            # sort in place\ncities.reverse()         # reverse in place\nsorted(cities)           # returns NEW sorted list (doesn't modify original)</pre>",
        "<strong>Slicing works on lists:</strong> <code>cities[0:2]</code> first two elements.",
        "<strong>Mixed types allowed:</strong> <code>[\"Adewale\", 35, 1.78, True]</code> — but usually a sign you should use a dict.",
        "<strong>Nested lists (2D):</strong><pre>grid = [[1,2,3], [4,5,6], [7,8,9]]\ngrid[1][2]    # 6</pre>",
        "<strong>Tuple</strong> = ordered, IMMUTABLE collection. Parentheses. Use when you DON'T want the data to change.",
        "<pre>point = (3, 5)         # tuple\npoint[0]               # 3\n# point[0] = 10        # ERROR — tuples are immutable</pre>",
        "<strong>When to use what:</strong> List for collections that grow/shrink/change. Tuple for fixed records (latitude, longitude) or returning multiple values from a function."
      ],
      example: "<pre>sales = [120000, 95000, 180000, 110000, 230000]\ntotal = sum(sales)        # 735000\navg = total / len(sales)   # 147000\nbiggest = max(sales)       # 230000\nsmallest = min(sales)      # 95000\nsorted_desc = sorted(sales, reverse=True)\n# [230000, 180000, 120000, 110000, 95000]</pre>",
      exercise: {
        steps: 4,
        tool: "Google Colab",
        task: "Create a list of 5 weekly sales figures. Print total, mean, max, the top-3 (sorted descending and sliced)."
      },
      quiz: {
        q: "Which is mutable (can be changed after creation)?",
        a: [
          { t:"tuple", c:false },
          { t:"list", c:true, why:"Yes! Lists are mutable; you can .append, .remove, reassign elements." },
          { t:"string", c:false, why:"Strings are immutable too." }
        ]
      },
      takeaway: "Lists [...] = ordered, mutable. Tuples (...) = ordered, immutable. .append, .remove, sorted, sum, max, min.",
      glossary: [
        { term:"List", def:"Ordered, mutable collection. Square brackets." },
        { term:"Tuple", def:"Ordered, immutable collection. Parentheses." }
      ]
    },

    { id:"m5.l5", type:"concept", title:"5. Dictionaries & sets", est:"9 min",
      learn: [
        "<strong>Dictionary (dict)</strong> = key-value pairs. Curly braces. Like a JSON object. <strong>Most important data structure in Python for data work.</strong>",
        "<pre>person = {\n  \"name\": \"Adewale\",\n  \"age\": 35,\n  \"city\": \"Lagos\"\n}\n\nperson[\"name\"]           # \"Adewale\"\nperson[\"name\"] = \"Sam\"   # update\nperson[\"role\"] = \"DS\"    # add new key\nperson.keys()             # dict_keys(['name','age','city','role'])\nperson.values()           # dict_values(['Sam',35,'Lagos','DS'])\nperson.get(\"phone\", \"N/A\") # safe access with default\n\"name\" in person           # True</pre>",
        "<strong>Nested dicts:</strong><pre>students = {\n  \"adebola\": {\"age\":16, \"score\":85},\n  \"chinwe\":  {\"age\":17, \"score\":72}\n}\nstudents[\"adebola\"][\"score\"]   # 85</pre>",
        "<strong>Set</strong> = unordered collection of UNIQUE values. Curly braces (no key-value).",
        "<pre>states_visited = {\"Lagos\", \"Abuja\", \"Lagos\", \"Kano\"}\n# becomes: {\"Lagos\", \"Abuja\", \"Kano\"}  (dupes removed)\nstates_visited.add(\"Ibadan\")\nlen(states_visited)        # 4\n\"Lagos\" in states_visited  # True (very fast lookup)</pre>",
        "<strong>Set operations</strong> (like in maths): <code>|</code> union, <code>&amp;</code> intersection, <code>-</code> difference.",
        "<strong>When to use what:</strong><br>• <strong>List</strong> — ordered, allows duplicates, position matters.<br>• <strong>Tuple</strong> — fixed record, immutable.<br>• <strong>Dict</strong> — lookup by key. Configuration. Anywhere you'd use a JSON object.<br>• <strong>Set</strong> — uniqueness, membership testing, set algebra."
      ],
      example: "<pre># Counting word frequencies in a sentence\nsentence = \"to be or not to be that is the question\"\ncounts = {}\nfor word in sentence.split():\n    counts[word] = counts.get(word, 0) + 1\nprint(counts)\n# {'to': 2, 'be': 2, 'or': 1, 'not': 1, 'that': 1, 'is': 1, 'the': 1, 'question': 1}</pre>",
      exercise: {
        steps: 3,
        tool: "Google Colab",
        task: "Create a dict mapping 5 customer names to their total spend. Print the top spender (use max() with a key argument)."
      },
      quiz: {
        q: "You need to track which states a salesperson has visited (no duplicates, order doesn't matter). Best structure?",
        a: [
          { t:"list", c:false, why:"Lists allow duplicates and order matters." },
          { t:"set", c:true, why:"Yes! Sets enforce uniqueness and are great for fast 'is X in here?' checks." },
          { t:"dict", c:false }
        ]
      },
      takeaway: "Dict {key:value} = lookup. Set {value} = unique values. Both use curly braces; dicts have colons.",
      glossary: [
        { term:"Dictionary", def:"Unordered key-value mapping. Lookup by key is O(1) — very fast." },
        { term:"Set", def:"Unordered collection of unique values. Supports set algebra (union, intersection)." }
      ]
    },

    { id:"m5.l6", type:"concept", title:"6. If-else & comparison operators", est:"8 min",
      learn: [
        "Control flow: telling Python to do different things based on conditions.",
        "<strong>The basic form:</strong><pre>age = 25\nif age &lt; 18:\n    print(\"Minor\")\nelif age &lt; 65:\n    print(\"Adult\")\nelse:\n    print(\"Senior\")</pre>",
        "<strong>Indentation is mandatory.</strong> Python uses indentation (typically 4 spaces) to group code blocks. No <code>{}</code> like other languages. Get it wrong → syntax error.",
        "<strong>Comparison operators:</strong> <code>==</code> equal, <code>!=</code> not equal, <code>&lt; &gt; &lt;= &gt;=</code>. Note: <code>=</code> assigns, <code>==</code> compares. Common bug.",
        "<strong>Boolean operators:</strong> <code>and</code> <code>or</code> <code>not</code>. <em>Word-based</em> not symbols (no &amp;&amp; or || like other languages).",
        "<pre>if status == \"active\" and age &gt;= 18:\n    print(\"Eligible\")\nif state in [\"Lagos\", \"Abuja\"]:\n    print(\"Major city\")\nif not is_verified:\n    print(\"Please verify\")</pre>",
        "<strong>Truthy / falsy:</strong> In an <code>if</code>, these are FALSE: <code>False</code>, <code>0</code>, <code>0.0</code>, <code>\"\"</code> (empty string), <code>[]</code> (empty list), <code>{}</code> (empty dict), <code>None</code>. Everything else is TRUE.",
        "<strong>Ternary expression</strong> (one-line if):<pre>label = \"Pass\" if score &gt;= 50 else \"Fail\"</pre>"
      ],
      example: "<pre>def grade(score):\n    if score &gt;= 70:\n        return \"A\"\n    elif score &gt;= 60:\n        return \"B\"\n    elif score &gt;= 50:\n        return \"C\"\n    elif score &gt;= 40:\n        return \"D\"\n    else:\n        return \"F\"\n\nprint(grade(85))   # \"A\"\nprint(grade(45))   # \"D\"</pre>",
      exercise: {
        steps: 2,
        tool: "Google Colab",
        task: "Write a function that takes a customer's annual spend and returns 'VIP' (>1M), 'Premium' (>100k), 'Regular' (>10k), 'New' (else)."
      },
      quiz: {
        q: "What's wrong with this code? <pre>if score = 50:\n    print(\"middle\")</pre>",
        a: [
          { t:"Indentation", c:false },
          { t:"Should be == for comparison, not = (assignment)", c:true, why:"Yes! Common bug. = assigns; == compares." },
          { t:"Missing else", c:false }
        ]
      },
      takeaway: "if/elif/else with indentation. ==, !=, <, >, and, or, not. Empty values are falsy.",
      glossary: [
        { term:"Conditional", def:"Code that runs only when a condition is true." },
        { term:"Truthy / falsy", def:"Values that act as TRUE / FALSE in if-statements without being strictly True/False." }
      ]
    },

    { id:"m5.l7", type:"concept", title:"7. Loops — for & while", est:"10 min",
      learn: [
        "Loops repeat work over a collection.",
        "<strong>For loop (most common):</strong><pre>cities = [\"Lagos\", \"Abuja\", \"Kano\"]\nfor city in cities:\n    print(city.upper())</pre>",
        "<strong>Loop a number of times</strong> using <code>range()</code>:<pre>for i in range(5):    # 0, 1, 2, 3, 4\n    print(i)\nfor i in range(1, 11):    # 1 to 10\n    print(i)\nfor i in range(0, 100, 10):  # 0, 10, 20, ... 90\n    print(i)</pre>",
        "<strong>Loop with index</strong> using <code>enumerate()</code>:<pre>for index, city in enumerate(cities):\n    print(f\"{index}: {city}\")</pre>",
        "<strong>Loop two lists in parallel</strong> using <code>zip()</code>:<pre>cities = [\"Lagos\", \"Abuja\"]\npops = [15400000, 3500000]\nfor city, pop in zip(cities, pops):\n    print(f\"{city}: {pop:,}\")</pre>",
        "<strong>While loop</strong> — repeats while condition is true. Use sparingly:<pre>count = 0\nwhile count &lt; 5:\n    print(count)\n    count += 1   # important — avoid infinite loop</pre>",
        "<strong>Loop control:</strong><br>• <code>break</code> — exit the loop entirely.<br>• <code>continue</code> — skip to next iteration."
      ],
      example: "<pre># Find the top customer\ncustomers = {\"Adewale\": 250000, \"Chinwe\": 180000, \"Musa\": 320000}\nbest_name = None\nbest_amount = 0\nfor name, amount in customers.items():\n    if amount &gt; best_amount:\n        best_amount = amount\n        best_name = name\nprint(f\"Top customer: {best_name} (₦{best_amount:,})\")\n# Top customer: Musa (₦320,000)\n\n# Or pythonic one-liner\ntop = max(customers, key=customers.get)\nprint(top)   # Musa</pre>",
      exercise: {
        steps: 3,
        tool: "Google Colab",
        task: "Loop through a list of 10 student scores. Count how many passed (≥50) and how many failed. Print percentages."
      },
      quiz: {
        q: "What does <code>range(2, 10, 2)</code> generate?",
        a: [
          { t:"2, 3, 4, 5, 6, 7, 8, 9", c:false },
          { t:"2, 4, 6, 8 (start 2, stop before 10, step 2)", c:true, why:"Yes! range(start, stop, step). Stop is exclusive." },
          { t:"2, 10, 2", c:false }
        ]
      },
      takeaway: "for ... in ... is the workhorse. range() for counts. enumerate() for index. zip() for parallel lists. break/continue.",
      glossary: [
        { term:"Iteration", def:"Going through each item of a collection one at a time." },
        { term:"range()", def:"Generates a sequence of integers. range(stop), range(start, stop), range(start, stop, step)." }
      ]
    },

    { id:"m5.l8", type:"concept", title:"8. Functions — reusable code", est:"10 min",
      learn: [
        "A <strong>function</strong> is a named block of code you can call with inputs and get an output. Eliminates copy-paste.",
        "<pre>def greet(name):                  # 'def' starts a function\n    return f\"Hello, {name}!\"      # 'return' = function output\n\nmessage = greet(\"Adewale\")        # call the function\nprint(message)                    # Hello, Adewale!</pre>",
        "<strong>Multiple arguments + defaults:</strong><pre>def compute_total(price, quantity, discount=0):\n    return price * quantity * (1 - discount)\n\ncompute_total(1200, 5)              # 6000\ncompute_total(1200, 5, 0.1)         # 5400 (10% discount)\ncompute_total(price=1200, quantity=5, discount=0.1)  # named args</pre>",
        "<strong>Return multiple values</strong> (Python returns a tuple):<pre>def stats(numbers):\n    return min(numbers), max(numbers), sum(numbers)/len(numbers)\n\nlowest, highest, average = stats([10, 20, 30, 40])\nprint(lowest, highest, average)   # 10 40 25.0</pre>",
        "<strong>Docstrings</strong> — describe what a function does:<pre>def grade(score):\n    \"\"\"Return letter grade for a numeric score.\n    \n    score : int between 0 and 100\n    returns : 'A', 'B', 'C', 'D', or 'F'\n    \"\"\"\n    if score &gt;= 70: return 'A'\n    # ...</pre>Use help(grade) or grade.__doc__ to see docstrings.",
        "<strong>Why functions matter:</strong><br>• DRY — Don't Repeat Yourself.<br>• Each function does ONE thing well.<br>• Easy to test in isolation.<br>• Easy to reuse in different projects.",
        "<strong>Lambda</strong> — anonymous one-line functions:<pre>square = lambda x: x**2\nsquare(4)   # 16\n# Common usage in sort:\nstudents = [(\"Adebola\", 85), (\"Chinwe\", 72)]\nstudents.sort(key=lambda s: s[1], reverse=True)  # sort by score desc</pre>"
      ],
      example: "<pre># A real-world function\ndef apply_vat(price, vat_rate=0.075):\n    \"\"\"Add Nigerian VAT (7.5%) to a price.\"\"\"\n    return round(price * (1 + vat_rate), 2)\n\napply_vat(1000)             # 1075.0\napply_vat(1500, 0.05)        # 1575.0\napply_vat(price=2500)        # 2687.5</pre>",
      exercise: {
        steps: 3,
        tool: "Google Colab",
        task: "Write a function classify_customer(spend) returning 'VIP', 'Premium', 'Regular', or 'New'. Test with 5 different spend values."
      },
      quiz: {
        q: "What's the main reason to write a function instead of repeating code?",
        a: [
          { t:"Functions are faster", c:false, why:"Negligible speed difference." },
          { t:"Don't Repeat Yourself (DRY) — change in one place updates all uses", c:true, why:"Yes! Maintainability is the killer feature of functions." },
          { t:"Python requires them", c:false }
        ]
      },
      takeaway: "def name(args): ...return.... Defaults, multiple returns, docstrings. Functions = DRY + testable + reusable.",
      glossary: [
        { term:"Function", def:"A named block of code accepting inputs (arguments) and optionally returning an output." },
        { term:"DRY", def:"Don't Repeat Yourself — a core programming principle." }
      ]
    },

    { id:"m5.l9", type:"concept", title:"9. Modules & libraries — importing power", est:"8 min",
      learn: [
        "Python comes with a 'standard library' (built-in modules) and a HUGE ecosystem of third-party libraries (NumPy, Pandas, etc.).",
        "<strong>Import syntax:</strong><pre>import math                  # whole module\nmath.sqrt(16)                # 4.0\n\nfrom math import sqrt, pi    # specific things\nsqrt(16)                     # 4.0\npi                           # 3.14159...\n\nimport pandas as pd          # rename for short access\nimport numpy as np           # universal conventions</pre>",
        "<strong>The 5 standard-library modules every data scientist uses:</strong>",
        "<strong>math</strong> — sqrt, log, exp, sin, etc.",
        "<strong>random</strong> — random numbers, sampling: <code>random.choice([list])</code>, <code>random.sample(list, k)</code>",
        "<strong>datetime</strong> — dates and times: <code>datetime.date.today()</code>, <code>datetime.timedelta(days=7)</code>",
        "<strong>os</strong> — file system: <code>os.listdir()</code>, <code>os.path.join(\"folder\", \"file.csv\")</code>",
        "<strong>csv / json</strong> — reading/writing CSV and JSON files.",
        "<strong>Install third-party packages</strong> using <code>pip</code> in Colab:<pre>!pip install pandas numpy scikit-learn matplotlib seaborn</pre>The <code>!</code> prefix runs a shell command from inside a notebook. In Colab, the big DS libraries are pre-installed — no install needed.",
        "<strong>Standard conventions (memorise these aliases):</strong><pre>import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\nimport seaborn as sns\nimport scipy.stats as stats</pre>"
      ],
      example: "<pre>import random\nfrom datetime import date, timedelta\n\n# Pick 3 random Nigerian cities for a sales tour\ncities = [\"Lagos\", \"Abuja\", \"Kano\", \"Ibadan\", \"Port Harcourt\", \"Owerri\"]\ntour = random.sample(cities, 3)\n\n# Compute the tour start date (2 weeks from today)\nstart = date.today() + timedelta(days=14)\n\nprint(f\"Tour: {tour}, starting {start}\")</pre>",
      quiz: {
        q: "Why is <code>import pandas as pd</code> the standard convention?",
        a: [
          { t:"It's faster to type and universal — every tutorial / book uses pd", c:true, why:"Yes! Conventions like pd, np, plt are universal — your code is instantly readable to others." },
          { t:"It's required by Python", c:false },
          { t:"It uses less memory", c:false }
        ]
      },
      takeaway: "import X; from X import Y; import X as Y. Standard library: math, random, datetime, os. Conventions: pd, np, plt, sns.",
      glossary: [
        { term:"Module", def:"A .py file containing reusable code." },
        { term:"Library / package", def:"A collection of modules. Installed via pip." }
      ]
    },

    { id:"m5.l10", type:"concept", title:"10. File I/O — reading and writing files", est:"9 min",
      learn: [
        "Data lives in files — CSV, Excel, JSON, text. Python reads and writes all of them.",
        "<strong>Plain text:</strong><pre># Reading\nwith open(\"notes.txt\", \"r\") as f:\n    content = f.read()\n\n# Writing\nwith open(\"output.txt\", \"w\") as f:\n    f.write(\"Hello from Python\\n\")\n\n# Appending (don't overwrite)\nwith open(\"log.txt\", \"a\") as f:\n    f.write(\"new entry\\n\")</pre><strong>The <code>with</code> statement</strong> auto-closes the file when done — always use it.",
        "<strong>CSV files:</strong><pre>import csv\n\n# Read\nwith open(\"sales.csv\", \"r\") as f:\n    reader = csv.DictReader(f)   # treats first row as headers\n    for row in reader:\n        print(row[\"item\"], row[\"price\"])\n\n# Write\nwith open(\"output.csv\", \"w\", newline=\"\") as f:\n    writer = csv.DictWriter(f, fieldnames=[\"name\", \"score\"])\n    writer.writeheader()\n    writer.writerow({\"name\": \"Adebola\", \"score\": 85})</pre>",
        "<strong>BUT — for data science, use Pandas (Module 6).</strong> <code>pd.read_csv(\"file.csv\")</code> does in one line what raw csv module does in many.",
        "<strong>JSON files</strong> (API responses, config):<pre>import json\n\n# Read\nwith open(\"config.json\", \"r\") as f:\n    data = json.load(f)   # returns dict / list\n\n# Write\nwith open(\"out.json\", \"w\") as f:\n    json.dump({\"name\": \"Adewale\", \"age\": 35}, f, indent=2)</pre>",
        "<strong>In Colab, upload files</strong>:<pre>from google.colab import files\nuploaded = files.upload()   # opens a file picker</pre>"
      ],
      example: "<pre># Read a CSV, count records per city\nimport csv\n\ncounts = {}\nwith open(\"customers.csv\", \"r\") as f:\n    for row in csv.DictReader(f):\n        city = row[\"city\"]\n        counts[city] = counts.get(city, 0) + 1\n\nfor city, n in sorted(counts.items(), key=lambda x: -x[1]):\n    print(f\"{city}: {n}\")</pre>",
      exercise: {
        steps: 2,
        tool: "Google Colab",
        task: "Create a CSV file with 5 rows of (name, score) data. Read it back and print the highest scorer."
      },
      quiz: {
        q: "Why use <code>with open(...) as f:</code> instead of plain <code>f = open(...)</code>?",
        a: [
          { t:"It's faster", c:false },
          { t:"It auto-closes the file even if an error occurs", c:true, why:"Yes! Never forget to close. with-statements guarantee cleanup." },
          { t:"It's the only way that works", c:false }
        ]
      },
      takeaway: "with open(...) as f → auto-close. csv module for CSV. json module for JSON. For DS, prefer Pandas (next module).",
      glossary: [
        { term:"File I/O", def:"Input/Output — reading from / writing to files." },
        { term:"Context manager", def:"The 'with' statement that auto-cleans up resources." }
      ]
    },

    { id:"m5.l11", type:"concept", title:"11. NumPy — fast number crunching", est:"10 min",
      learn: [
        "<strong>NumPy</strong> (Numerical Python) is the foundation of all data science in Python. It provides the <strong>array</strong> — a fast, fixed-type collection of numbers. Pandas, Scikit-learn, TensorFlow are all built on NumPy arrays.",
        "<strong>Why arrays not lists?</strong> Arrays are <strong>50-100x faster</strong> for numerical work. Same memory, vectorised operations (no Python loops).",
        "<pre>import numpy as np\n\n# Create arrays\na = np.array([1, 2, 3, 4, 5])\nb = np.zeros(5)              # [0., 0., 0., 0., 0.]\nc = np.ones((3, 3))          # 3x3 matrix of ones\nd = np.arange(10)            # [0,1,2,3,4,5,6,7,8,9]\ne = np.linspace(0, 1, 5)     # 5 evenly spaced: [0, 0.25, 0.5, 0.75, 1]\n\n# Element-wise operations (no loop!)\na * 2          # [2, 4, 6, 8, 10]\na + 10         # [11, 12, 13, 14, 15]\na ** 2         # [1, 4, 9, 16, 25]\nnp.sqrt(a)     # [1., 1.414, 1.732, 2., 2.236]\n\n# Aggregations\na.sum()        # 15\na.mean()       # 3.0\na.std()        # 1.414\na.max()        # 5</pre>",
        "<strong>2D arrays (matrices):</strong><pre>m = np.array([[1, 2, 3],\n              [4, 5, 6],\n              [7, 8, 9]])\nm.shape        # (3, 3)\nm[0, 1]        # 2 (row 0, col 1)\nm[:, 0]        # column 0: [1, 4, 7]\nm.T            # transpose</pre>",
        "<strong>Boolean indexing</strong> (super powerful, used everywhere in Pandas):<pre>scores = np.array([45, 78, 92, 50, 33, 68])\nscores[scores &gt;= 60]    # [78, 92, 68]\nscores &gt;= 60             # [F, T, T, F, F, T]</pre>"
      ],
      example: "<pre>import numpy as np\n\n# Simulate 1000 dice rolls and compute statistics\nrolls = np.random.randint(1, 7, 1000)\nprint(f\"Mean:   {rolls.mean():.2f}\")     # ~3.5\nprint(f\"Std:    {rolls.std():.2f}\")      # ~1.7\nprint(f\"Sixes:  {(rolls == 6).sum()}\")   # ~167\n\n# Vectorised operations — no for loop!\nweights = np.array([0.1, 0.2, 0.4, 0.2, 0.1])\nvalues  = np.array([100, 200, 300, 400, 500])\nweighted_avg = (weights * values).sum()  # 300.0</pre>",
      exercise: {
        steps: 4,
        tool: "Google Colab",
        task: "Create a NumPy array of 20 random salaries (use np.random.randint(50000, 500000, 20)). Compute mean, std, percentile 90, and count how many are above ₦300k."
      },
      quiz: {
        q: "Why use NumPy arrays instead of Python lists for numerical work?",
        a: [
          { t:"They're 50-100× faster due to vectorised C operations", c:true, why:"Yes! Arrays bypass Python's slow loop interpreter. Essential for any real data work." },
          { t:"They look prettier", c:false },
          { t:"They're easier to type", c:false }
        ]
      },
      takeaway: "NumPy = fast arrays. Vectorised ops (no loops). Slicing, boolean indexing, aggregations. Foundation of Pandas and ML.",
      glossary: [
        { term:"NumPy", def:"Numerical Python. The fast-array library at the foundation of Python data science." },
        { term:"Vectorisation", def:"Performing operations on entire arrays at once (in C), avoiding slow Python loops." }
      ]
    },

    { id:"m5.l12", type:"concept", title:"12. Error handling — try/except", est:"8 min",
      learn: [
        "Errors happen. Files don't exist. APIs go down. Users enter junk. <strong>try/except</strong> lets you handle errors gracefully instead of crashing.",
        "<pre>try:\n    age = int(input(\"Age: \"))\n    print(f\"You are {age} years old.\")\nexcept ValueError:\n    print(\"That wasn't a valid number.\")</pre>",
        "<strong>Catch specific errors:</strong><pre>try:\n    f = open(\"missing.csv\")\nexcept FileNotFoundError:\n    print(\"File not found\")\nexcept PermissionError:\n    print(\"No permission to read\")\nexcept Exception as e:        # catch anything else\n    print(f\"Unexpected error: {e}\")</pre>",
        "<strong>The full structure:</strong><pre>try:\n    ...               # code that might fail\nexcept SomeError:\n    ...               # runs ONLY if SomeError occurred\nelse:\n    ...               # runs if NO error\nfinally:\n    ...               # always runs (cleanup)</pre>",
        "<strong>Raising your own errors:</strong><pre>def divide(a, b):\n    if b == 0:\n        raise ValueError(\"Cannot divide by zero\")\n    return a / b</pre>",
        "<strong>Best practices:</strong><br>• Catch SPECIFIC errors, not bare <code>except:</code> (which hides bugs).<br>• Log the error before swallowing it.<br>• Re-raise if you can't truly handle it.",
        "<strong>The 5 most common errors you'll meet:</strong><br>• <code>ValueError</code> — wrong type of value (e.g. int('abc'))<br>• <code>TypeError</code> — wrong type (e.g. 'a' + 5)<br>• <code>KeyError</code> — dict key missing<br>• <code>IndexError</code> — list index out of range<br>• <code>FileNotFoundError</code> — file doesn't exist"
      ],
      example: "<pre>def safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        print(\"Division by zero — returning None\")\n        return None\n    except TypeError:\n        print(\"Both arguments must be numbers\")\n        return None\n\nsafe_divide(10, 2)      # 5.0\nsafe_divide(10, 0)      # None, with message\nsafe_divide(10, \"a\")    # None, with message</pre>",
      quiz: {
        q: "Why is <code>except:</code> (bare except) considered bad?",
        a: [
          { t:"It's slow", c:false },
          { t:"It catches ALL errors including KeyboardInterrupt and SystemExit, hiding bugs", c:true, why:"Yes! Always catch specific exceptions. Bare except masks real problems." },
          { t:"It's not valid Python", c:false }
        ]
      },
      takeaway: "try/except for graceful errors. Catch specific exceptions. Use else/finally for cleanup. Raise your own with raise.",
      glossary: [
        { term:"Exception", def:"Python's term for an error raised during execution." },
        { term:"Stack trace", def:"The path of function calls leading to an exception. Read top-down to find your bug." }
      ]
    },

    { id:"m5.l13", type:"concept", title:"13. List comprehensions — Pythonic shortcuts", est:"8 min",
      learn: [
        "<strong>List comprehensions</strong> are the most Pythonic way to build a list from another iterable. They replace verbose for-loops with one expressive line.",
        "<strong>Basic form:</strong><pre>squares = [x**2 for x in range(10)]\n# [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]\n\n# Equivalent (verbose) for-loop:\nsquares = []\nfor x in range(10):\n    squares.append(x**2)</pre>",
        "<strong>With filtering:</strong><pre>evens = [x for x in range(20) if x % 2 == 0]\n# [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]</pre>",
        "<strong>Transform strings:</strong><pre>names = [\"adewale\", \"chinwe\", \"musa\"]\nproper = [n.title() for n in names]\n# ['Adewale', 'Chinwe', 'Musa']</pre>",
        "<strong>Dict comprehension:</strong><pre>scores = {\"adebola\": 85, \"chinwe\": 72, \"musa\": 68}\npassed = {name: score for name, score in scores.items() if score &gt;= 70}\n# {'adebola': 85, 'chinwe': 72}</pre>",
        "<strong>Set comprehension:</strong><pre>unique_states = {s.lower() for s in [\"Lagos\", \"lagos\", \"LAGOS\", \"Abuja\"]}\n# {'lagos', 'abuja'}</pre>",
        "<strong>When NOT to use:</strong> if the comprehension exceeds one readable line, use a regular for-loop. Readability beats cleverness."
      ],
      example: "<pre>customers = [\n    {\"name\": \"Adewale\", \"spend\": 250000, \"state\": \"Lagos\"},\n    {\"name\": \"Chinwe\", \"spend\": 180000, \"state\": \"Abuja\"},\n    {\"name\": \"Musa\", \"spend\": 320000, \"state\": \"Kano\"},\n    {\"name\": \"Folake\", \"spend\": 210000, \"state\": \"Lagos\"},\n]\n\n# All Lagos customers' names\nlagos_names = [c[\"name\"] for c in customers if c[\"state\"] == \"Lagos\"]\n# ['Adewale', 'Folake']\n\n# Mapping name -> spend\nspend_map = {c[\"name\"]: c[\"spend\"] for c in customers}\n# {'Adewale': 250000, 'Chinwe': 180000, ...}\n\n# Total spend\ntotal = sum(c[\"spend\"] for c in customers)  # generator expression (no [])\n# 960000</pre>",
      exercise: {
        steps: 3,
        tool: "Google Colab",
        task: "Given a list of 10 scores, use a list comprehension to compute: (1) only passing scores ≥50, (2) percentages (score/100), (3) labels ('Pass' or 'Fail')."
      },
      quiz: {
        q: "What does <code>[x*2 for x in [1,2,3,4] if x &gt; 2]</code> produce?",
        a: [
          { t:"[2, 4, 6, 8]", c:false, why:"Filter excludes 1 and 2." },
          { t:"[6, 8]", c:true, why:"Yes! Only x > 2 (so 3, 4), each doubled (6, 8)." },
          { t:"[3, 4]", c:false }
        ]
      },
      takeaway: "List comprehensions = concise way to build lists from iterables, with optional filter. Also dict / set versions.",
      glossary: [
        { term:"List comprehension", def:"[expr for item in iterable if condition] — concise list construction syntax." }
      ]
    },

    { id:"m5.l14", type:"project", title:"14. Module 5 Project — analyse Nigerian states data in Python", est:"60 min",
      learn: [
        "<strong>Mission:</strong> Apply everything in this module (variables, lists, dicts, loops, functions, file I/O) to analyse a small Nigerian dataset.",
        "<strong>Step 1 — Open Google Colab.</strong> Create a new notebook.",
        "<strong>Step 2 — Paste this Python dictionary (simulated 2022 NBS-style data):</strong><pre>states = {\n    \"Lagos\":    {\"population\": 15388000, \"unemployment\": 11.4, \"gdp_b\": 30000},\n    \"Kano\":     {\"population\": 15462000, \"unemployment\": 15.2, \"gdp_b\": 2500},\n    \"Rivers\":   {\"population\":  7303924, \"unemployment\": 18.7, \"gdp_b\": 7200},\n    \"FCT\":      {\"population\":  3564126, \"unemployment\":  9.8, \"gdp_b\": 4500},\n    \"Ogun\":     {\"population\":  5217716, \"unemployment\": 12.1, \"gdp_b\": 2900},\n    \"Kaduna\":   {\"population\":  8252366, \"unemployment\": 16.8, \"gdp_b\": 2100},\n    \"Oyo\":      {\"population\":  7976100, \"unemployment\": 13.5, \"gdp_b\": 2400},\n    \"Katsina\":  {\"population\":  7831319, \"unemployment\": 17.9, \"gdp_b\": 1200},\n    \"Delta\":    {\"population\":  5663362, \"unemployment\": 11.7, \"gdp_b\": 3500},\n    \"Edo\":      {\"population\":  4235595, \"unemployment\": 12.8, \"gdp_b\": 1900},\n}</pre>",
        "<strong>Task 1.</strong> Write a function <code>gdp_per_capita(state_data)</code> that returns gdp_b * 1e9 / population (₦ per person).",
        "<strong>Task 2.</strong> Loop through states. For each, print: name, population, GDP per capita.",
        "<strong>Task 3.</strong> Use a list comprehension to build a list of (state, gdp_per_capita) tuples. Sort it descending. Print the top 3.",
        "<strong>Task 4.</strong> Compute mean and SD of unemployment across all 10 states (no external libraries — use sum() and a comprehension).",
        "<strong>Task 5.</strong> Identify states with above-average unemployment AND below-average GDP per capita. Print them. These are the 'high stress' states.",
        "<strong>Task 6.</strong> Write the results to a CSV file using the <code>csv</code> module. Columns: state, population, unemployment, gdp_b, gdp_per_capita, stress_flag."
      ],
      example: "<pre>def gdp_per_capita(d):\n    \"\"\"₦ GDP per person.\"\"\"\n    return d[\"gdp_b\"] * 1e9 / d[\"population\"]\n\n# Top 3 by GDP/capita\nranked = sorted(\n    [(s, gdp_per_capita(d)) for s, d in states.items()],\n    key=lambda x: x[1], reverse=True\n)\nfor s, gpc in ranked[:3]:\n    print(f\"{s}: ₦{gpc:,.0f}/person\")</pre>",
      project: {
        deliverable: "A Colab notebook with 6 tasks completed + a CSV file output.",
        time: "60 minutes",
        difficulty: "Beginner-Intermediate",
        skills: ["Functions", "Loops", "List comprehensions", "Dict access", "File I/O", "Statistical thinking"]
      },
      takeaway: "You've now used Python end-to-end on a real Nigerian dataset. Variables, loops, functions, comprehensions, CSV — all in one workflow.",
      glossary: []
    }

  ]
});

window.CURRICULUM_PART = 2;
