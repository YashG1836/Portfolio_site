/*
 * ---------------------------------------------------------------------------
 *  PROJECTS - the single source of truth for this site.
 * ---------------------------------------------------------------------------
 *  Both the home page ("Selected work") and /projects/ read from this array.
 *  To add a project: copy a block below, paste it where you want it to appear,
 *  and edit the fields. Nothing else needs to change.
 *
 *  Full field reference lives in README.md. Quick version:
 *
 *    tier       "featured" -> home page + top of /projects/ (big, detailed)
 *               "course"   -> /projects/ "Course & team projects"
 *               "applied"  -> /projects/ "Applied ML & side builds"
 *               "early"    -> /projects/ collapsed "Early work"
 *    kind       small label above the title, e.g. "Research"
 *    timeline   the date shown to visitors, e.g. "Jan - Apr 2026"
 *    context    optional line for advisor / lab / course
 *    summary    one or two sentences: what it is and why it exists
 *    highlights bullet list (featured tier only)
 *    metric     optional headline number: { value, label }
 *    tech       list of technologies
 *    links      list of { label, href } - any number, any label
 *
 *  Order inside each tier is exactly the order of this array.
 * ---------------------------------------------------------------------------
 */

window.PROJECTS = [
  {
    tier: "featured",
    kind: "Research",
    title: "Under Vehicle Surveillance System",
    context: "CVIG Lab, IIT Gandhinagar · Advisor: Prof. Shanmuganathan Raman",
    timeline: "Aug – Nov 2025",
    summary:
      "A panoramic under-vehicle inspection pipeline. Fisheye cameras mounted below a ramp capture an undercarriage, and the system undistorts and stitches those frames into one continuous image an operator can actually inspect for contraband.",
    highlights: [
      "Calibrated fisheye and planar cameras with Scaramuzza's OCamCalib model, making undistortion accurate enough to reconstruct a flat undercarriage from curved lenses.",
      "Built the capture → undistort → stitch pipeline in C++ and Python on OpenCV and OpenPano, using SIFT feature matching with RANSAC homography estimation.",
      "Deployed the whole thing behind a Streamlit interface so an operator runs an inspection without touching the code."
    ],
    tech: ["C++", "Python", "OpenCV", "OpenPano", "SIFT / RANSAC", "Streamlit"],
    links: [
      { label: "Live demo", href: "https://uvss-system.streamlit.app/" },
      { label: "Code", href: "https://github.com/BhavayGoyal/UVSS" },
      { label: "IEEE report", href: "/assets/reports/UVSS_IEEE_report.pdf" },
      { label: "Poster", href: "/assets/reports/UVSS_poster_final.pdf" },
      { label: "Full theory report", href: "/assets/reports/UVSS_Full_Theory_Report.pdf" }
    ]
  },
  {
    tier: "featured",
    kind: "Course research",
    title: "Fairness in Federated Learning",
    context: "Semester project · Advisor: Prof. Manisha Padala",
    timeline: "Jan – Apr 2026",
    summary:
      "A federated gender-classification framework that measures how unevenly a model performs across racial groups, then narrows that gap without centralising anyone's data or giving up accuracy.",
    highlights: [
      "Trained across 10 clients over 8 rounds on UTKFace (23K images) and FairFace (50K images), establishing baseline race-wise fairness gaps of 8.52% and 9.92%.",
      "Proposed Dynamic Client-Adaptive Fairness Weighting (DCA-FW), where designated fairness clients reweight per-group cross-entropy loss each round — cutting the UTKFace gap to 5.07% at ~87% accuracy, and the FairFace gap to 8.12%.",
      "Benchmarked four interventions (static weighting, fairness regularisation, race-adversarial training, attack-based) under SPD and EOD metrics, and showed label-flipping attacks harm minority groups disproportionately under FedAvg."
    ],
    metric: { value: "8.52% → 5.07%", label: "race-wise fairness gap, UTKFace" },
    tech: ["Python", "PyTorch", "Federated Learning", "CNNs", "SPD / EOD"],
    links: [
      { label: "Code", href: "https://github.com/YashG1836/Federated_Learning_Project_Course" },
      { label: "Report", href: "/assets/reports/Final_Report_FL.pdf" },
      { label: "Poster", href: "/assets/reports/FL_poster.pdf" },
      { label: "Extended write-up", href: "/assets/reports/Federated_Learning_Elaborated.pdf" }
    ]
  },
  {
    tier: "featured",
    kind: "Course project",
    title: "Semantic Search Engine",
    context: "Data Science course · Advisor: Prof. Anirban Das Gupta",
    timeline: "Jan – Apr 2026",
    summary:
      "Dense retrieval over a 50K-document MS MARCO corpus. Keyword search misses documents that mean the right thing but say it differently — this combines BERT embeddings with BM25 and approximate nearest-neighbour indexing to catch them.",
    highlights: [
      "Indexed 50K MS MARCO documents with BERT embeddings in FAISS, running both exact and HNSW-based ANN search to trade a little recall for a large latency win.",
      "Hybrid ranking over sparse BM25 and dense semantic scores reached 95.7% Recall@10.",
      "On 200 held-out queries, semantic retrieval improved Precision@10 and Recall@10 by roughly 18% over BM25 alone and was close to 10× more effective than Word2Vec retrieval."
    ],
    metric: { value: "95.7%", label: "Recall@10 on MS MARCO" },
    tech: ["Python", "BERT", "FAISS", "HNSW", "BM25"],
    links: [
      { label: "Live demo", href: "https://sementicsearchengine.streamlit.app/" },
      { label: "Code", href: "https://github.com/YashG1836/Semantic_Search_Engine-" },
      { label: "Report", href: "/assets/reports/final_data_science_sementic_search.pdf" },
      { label: "Extended write-up", href: "/assets/reports/Sementic_search_elaborated_DS.pdf" }
    ]
  },
  {
    tier: "featured",
    kind: "Self-directed",
    title: "RAG-Based AI Teaching Assistant",
    timeline: "Dec 2025",
    summary:
      "Turns a folder of lecture recordings into something you can ask questions of. Instead of scrubbing through an hour of video for one definition, you ask and get an answer grounded in what the lecturer actually said.",
    highlights: [
      "End-to-end pipeline: MP4 → FFmpeg audio extraction → Whisper transcription → overlapping chunk embeddings → cosine-similarity retrieval → LLM-grounded generation.",
      "Runs against both OpenAI GPT and a locally hosted DeepSeek model, so the same knowledge base works online or fully offline.",
      "A joblib-backed embedding store makes ingestion incremental — adding one lecture doesn't recompute the corpus — and is structured to swap in FAISS or a vector DB for production."
    ],
    tech: ["Python", "Whisper", "FFmpeg", "Embeddings", "OpenAI GPT", "DeepSeek"],
    links: [
      { label: "Live demo", href: "https://yash-llmbased-rag-chatbot.streamlit.app/" },
      { label: "Code", href: "https://github.com/YashG1836/streamlit-projects/tree/main/rag-implementation-chatbot" }
    ]
  },
  {
    tier: "featured",
    kind: "Course project",
    title: "Algorithmic Trading Strategy Backtester",
    context: "Financial Modelling course · Advisor: Prof. Mithun Radhakrishnan",
    timeline: "Jan – Apr 2026",
    summary:
      "A modular backtesting engine that runs four classical trading strategies over historical market data and reports, honestly, whether any of them would have made money.",
    highlights: [
      "Implemented Moving Average Crossover, RSI Momentum, Z-score Mean Reversion and Breakout as interchangeable strategy modules over Yahoo Finance data, with configurable tickers and timeframes.",
      "Streamlit dashboard compares strategies side by side with cumulative return curves and a metrics table — total return, Sharpe ratio and maximum drawdown."
    ],
    metric: { value: "4 strategies", label: "scored on Sharpe & max drawdown" },
    tech: ["Python", "Pandas", "yfinance", "Streamlit"],
    links: [
      { label: "Live demo", href: "https://algotradingstrategybacktest.streamlit.app/" },
      { label: "Code", href: "https://github.com/YashG1836/Algo_Trading_Strategy_Backtest" }
    ]
  },

  /* ---------------------------------------------------------------- course */

  {
    tier: "course",
    kind: "Course project",
    title: "COVID-19 Data Analysis",
    context: "Data Science writing assignment",
    timeline: "Feb 2026",
    summary:
      "Exploratory analysis of COVID-19 trends, written up as a data-driven narrative rather than a notebook dump.",
    tech: ["Python", "Pandas", "Matplotlib"],
    links: [
      { label: "Read it", href: "https://yashg1836.github.io/Writing_Assignment_DataScience_Covid19" },
      { label: "Code", href: "https://github.com/YashG1836/Writing_Assignment_DataScience_Covid19" }
    ]
  },
  {
    tier: "course",
    kind: "Course project",
    title: "Smart Highway Lighting System",
    context: "Electrical systems course",
    timeline: "Jan – Apr 2025",
    summary:
      "Sensor-driven highway lighting that brightens on approach and dims when the road is empty, built as a working Arduino prototype.",
    tech: ["Arduino", "Sensors", "Embedded C"],
    links: [{ label: "Report", href: "/assets/reports/Elec_Project.pdf" }]
  },
  {
    tier: "course",
    kind: "Team project",
    title: "VirtuGrip — Force-Feedback Smart Glove",
    context: "World of Engineering, IIT Gandhinagar",
    timeline: "Jan – Apr 2025",
    summary:
      "A motion-tracking glove with force feedback, built and demoed with a team for the World of Engineering showcase.",
    tech: ["Hardware", "Sensors", "Computer Vision"],
    links: [
      { label: "Project site", href: "https://akshit-codes.github.io/virtugrip-crew/" },
      { label: "Demo video", href: "/assets/videos/WOE_FINAL.mp4" }
    ]
  },

  /* --------------------------------------------------------------- applied */

  {
    tier: "applied",
    kind: "Self-directed",
    title: "StudentOS",
    timeline: "",
    summary:
      "A dashboard that pulls the scattered parts of student life — academics, career, everyday admin — into one interface.",
    tech: ["TypeScript", "React", "Vite", "Tailwind", "shadcn/ui"],
    links: [
      { label: "Live demo", href: "https://student-os-seven.vercel.app/" },
      { label: "Code", href: "https://github.com/YashG1836/Student_os" }
    ]
  },
  {
    tier: "applied",
    kind: "Self-directed",
    title: "Stock Price Predictor",
    timeline: "2025",
    summary:
      "Trains an LSTM on demand against live Yahoo Finance data, then reports test metrics and a multi-day forecast instead of a single unexplained number.",
    tech: ["Python", "Keras", "yfinance", "Streamlit"],
    links: [
      { label: "Live demo", href: "https://yash-stock-price-predictor.streamlit.app/" },
      { label: "Code", href: "https://github.com/YashG1836/streamlit-projects/tree/main/stock-price-predictor" }
    ]
  },
  {
    tier: "applied",
    kind: "Self-directed",
    title: "Movie Recommendation Engine",
    timeline: "2025",
    summary:
      "Content-based recommender over TMDB credits and metadata, matching films on what they are rather than on who else watched them.",
    tech: ["Python", "Pandas", "NLTK", "Streamlit"],
    links: [
      { label: "Live demo", href: "https://yash-movie-recommendation-ml.streamlit.app/" },
      { label: "Code", href: "https://github.com/YashG1836/streamlit-projects/tree/main/movie-recommendation" }
    ]
  },
  {
    tier: "applied",
    kind: "Self-directed",
    title: "Email & SMS Spam Detector",
    timeline: "2025",
    summary:
      "A supervised text classifier for spam, taken from notebook exploration through to a deployed app anyone can paste a message into.",
    tech: ["Python", "scikit-learn", "Streamlit"],
    links: [
      { label: "Live demo", href: "https://yash-spam-email-detector.streamlit.app/" },
      { label: "Code", href: "https://github.com/YashG1836/streamlit-projects/tree/main/spam-email-detector" }
    ]
  },
  {
    tier: "applied",
    kind: "Self-directed",
    title: "California House Price Predictor",
    timeline: "2025",
    summary:
      "Random forest regression on the California housing dataset, with a UI for both single predictions and batch uploads.",
    tech: ["Python", "scikit-learn", "Streamlit"],
    links: [
      { label: "Live demo", href: "https://yash-property-price-predictor.streamlit.app/" },
      { label: "Code", href: "https://github.com/YashG1836/streamlit-projects/tree/main/property-price-predictor" }
    ]
  },

  /* ----------------------------------------------------------------- early */

  {
    tier: "early",
    title: "Amazon storefront clone",
    timeline: "2025",
    summary: "Responsive product grid and offer banners, built to learn layout.",
    tech: ["HTML", "CSS"],
    links: [
      { label: "Open", href: "/assets/sites/Amazon_Project/amz_html.html" },
      { label: "Code", href: "https://github.com/YashG1836/Html_css_js_Projects/tree/main/projects/Amazon_site" }
    ]
  },
  {
    tier: "early",
    title: "Currency Converter",
    timeline: "2025",
    summary: "Live-rate conversion between currencies.",
    tech: ["HTML", "CSS", "JavaScript"],
    links: [
      { label: "Open", href: "/assets/sites/Currency_convertor/convertor.html" },
      { label: "Code", href: "https://github.com/YashG1836/Html_css_js_Projects/tree/main/projects/Currency_convertor" }
    ]
  },
  {
    tier: "early",
    title: "Rock Paper Scissors",
    timeline: "2025",
    summary: "Score tracking and instant result feedback.",
    tech: ["HTML", "CSS", "JavaScript"],
    links: [
      { label: "Open", href: "/assets/sites/Rock_paper_game/game_html.html" },
      { label: "Code", href: "https://github.com/YashG1836/Html_css_js_Projects/tree/main/projects/Rock_paper_scissors" }
    ]
  },
  {
    tier: "early",
    title: "Tic Tac Toe",
    timeline: "2025",
    summary: "Board state handling and win detection.",
    tech: ["HTML", "CSS", "JavaScript"],
    links: [
      { label: "Open", href: "/assets/sites/Tic_tac_game/tic.html" },
      { label: "Code", href: "https://github.com/YashG1836/Html_css_js_Projects/tree/main/projects/Tic_Tac_Toe" }
    ]
  }
];
