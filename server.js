const http = require('http');

const PORT = process.env.PORT || 3000;

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Siddharth Lakhani | DevOps & Cloud Engineer</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0d1117;
      --card-bg: #161b22;
      --border: #30363d;
      --text: #c9d1d9;
      --text-bright: #f0f6fc;
      --accent: #58a6ff;
      --accent-glow: rgba(88, 166, 255, 0.15);
      --green: #2ea043;
      --purple: #bc8cff;
      --orange: #f0883e;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      padding: 2rem 1rem;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
    }

    /* Header Banner */
    header {
      background: linear-gradient(135deg, #161b22 0%, #1f2937 100%);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      position: relative;
    }

    .badge-bar {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(46, 160, 67, 0.15);
      color: #3fb950;
      border: 1px solid rgba(46, 160, 67, 0.4);
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      font-family: 'Fira Code', monospace;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background-color: #3fb950;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.2); }
      100% { opacity: 1; transform: scale(1); }
    }

    h1 {
      font-size: 2.2rem;
      font-weight: 800;
      color: var(--text-bright);
      margin-bottom: 0.5rem;
    }

    .headline {
      color: var(--accent);
      font-weight: 600;
      font-size: 1.05rem;
      margin-bottom: 1rem;
    }

    .meta-info {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
      font-size: 0.9rem;
      color: #8b949e;
    }

    .meta-info a {
      color: var(--accent);
      text-decoration: none;
      font-weight: 600;
    }
    .meta-info a:hover { text-decoration: underline; }

    /* Interactive Tab Navigation */
    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.5rem;
      overflow-x: auto;
    }

    .tab-btn {
      background: none;
      border: none;
      color: #8b949e;
      padding: 8px 16px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.2s ease;
      font-family: 'Inter', sans-serif;
    }

    .tab-btn:hover {
      background: var(--card-bg);
      color: var(--text-bright);
    }

    .tab-btn.active {
      background: var(--accent-glow);
      color: var(--accent);
      border-bottom: 2px solid var(--accent);
    }

    /* Section & Cards */
    .tab-content { display: none; }
    .tab-content.active { display: block; animation: fadeIn 0.3s ease-in-out; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1.25rem;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }

    .card:hover {
      border-color: #58a6ff;
      transform: translateY(-2px);
    }

    .card-title {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--text-bright);
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 0.25rem;
    }

    .card-subtitle {
      color: var(--purple);
      font-weight: 600;
      font-size: 0.95rem;
      margin-bottom: 0.75rem;
    }

    .date-tag {
      font-family: 'Fira Code', monospace;
      font-size: 0.8rem;
      color: #8b949e;
      background: #21262d;
      padding: 2px 8px;
      border-radius: 4px;
    }

    /* Tag Pills */
    .pill-group {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-top: 0.8rem;
    }

    .pill {
      background: #21262d;
      color: var(--text);
      border: 1px solid var(--border);
      font-size: 0.75rem;
      font-family: 'Fira Code', monospace;
      padding: 2px 8px;
      border-radius: 12px;
    }

    .pill.tech {
      border-color: rgba(88, 166, 255, 0.4);
      color: var(--accent);
    }

    ul {
      padding-left: 1.2rem;
      margin-top: 0.5rem;
    }

    li {
      margin-bottom: 0.4rem;
      font-size: 0.92rem;
    }

    footer {
      text-align: center;
      margin-top: 3rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border);
      color: #8b949e;
      font-size: 0.85rem;
      font-family: 'Fira Code', monospace;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="badge-bar">
        <div class="status-badge">
          <span class="status-dot"></span> Container Live (Node v18 Alpine)
        </div>
        <div class="status-badge" style="color: #bc8cff; border-color: rgba(188, 140, 255, 0.4); background: rgba(188, 140, 255, 0.1);">
          🚀 Multi-Stage Dockerized
        </div>
      </div>

      <h1>Siddharth Lakhani</h1>
      <div class="headline">Building & Automating Scalable, Secure & Reliable Infrastructure | Ex-Network & Infrastructure Engineer</div>

      <div class="meta-info">
        <span>📍 Haryana, India</span>
        <span>💼 Open to Work (Remote / Hybrid / On-site)</span>
        <span>🔗 <a href="https://www.linkedin.com/in/siddharth-lakhani-4a1b32202" target="_blank" rel="noreferrer">LinkedIn Profile</a></span>
      </div>
    </header>

    <div class="tabs">
      <button class="tab-btn active" onclick="openTab(event, 'skills')">Core Skills & Stack</button>
      <button class="tab-btn" onclick="openTab(event, 'projects')">Featured Projects</button>
      <button class="tab-btn" onclick="openTab(event, 'experience')">Work Experience</button>
      <button class="tab-btn" onclick="openTab(event, 'education')">Education & Certifications</button>
    </div>

    <!-- TAB 1: SKILLS -->
    <div id="skills" class="tab-content active">
      <div class="card">
        <h3 class="card-title">Cloud & Infrastructure as Code</h3>
        <p>Designing repeatable, automated infrastructure deployments and cloud architectures.</p>
        <div class="pill-group">
          <span class="pill tech">AWS</span>
          <span class="pill tech">Terraform</span>
          <span class="pill tech">Ansible</span>
          <span class="pill tech">IaC</span>
          <span class="pill tech">Cloud Security</span>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">Containers & Orchestration</h3>
        <p>Containerizing microservices and orchestrating container workloads for high availability.</p>
        <div class="pill-group">
          <span class="pill tech">Docker</span>
          <span class="pill tech">Kubernetes</span>
          <span class="pill tech">Helm</span>
          <span class="pill tech">Multi-Stage Builds</span>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">CI/CD, DevSecOps & Automation</h3>
        <p>Automated pipeline orchestration, code vulnerability scanning, and GitOps workflows.</p>
        <div class="pill-group">
          <span class="pill tech">GitHub Actions</span>
          <span class="pill tech">GitOps</span>
          <span class="pill tech">ArgoCD</span>
          <span class="pill tech">SonarQube</span>
          <span class="pill tech">Trivy</span>
          <span class="pill tech">OWASP ZAP</span>
          <span class="pill tech">Python</span>
          <span class="pill tech">Linux/Bash</span>
        </div>
      </div>
    </div>

    <!-- TAB 2: PROJECTS -->
    <div id="projects" class="tab-content">
      <div class="card">
        <div class="card-title">
          <span>End-to-End DevSecOps CI/CD Pipeline</span>
          <span class="date-tag">Production Ready</span>
        </div>
        <div class="card-subtitle">GitHub Actions · Docker · SonarQube · Trivy · OWASP ZAP</div>
        <ul>
          <li>Designed and implemented an automated CI/CD pipeline incorporating Static Application Security Testing (SAST), secret scanning, and dependency vulnerability analysis.</li>
          <li>Enforced SonarQube quality gates and automated Trivy container image scans before registry push.</li>
          <li>Implemented Dynamic Application Security Testing (DAST) using OWASP ZAP for post-deployment verification.</li>
        </ul>
      </div>

      <div class="card">
        <div class="card-title">
          <span>Automated AWS EC2 Provisioning via Python & Terraform</span>
          <span class="date-tag">IaC Automation</span>
        </div>
        <div class="card-subtitle">Python · Terraform · AWS EC2 · Subprocess Automation</div>
        <ul>
          <li>Orchestrated Terraform workflows programmatically via Python subprocess execution.</li>
          <li>Enabled non-interactive, repeatable infrastructure provisioning with automatic lockfile and state management.</li>
        </ul>
      </div>
    </div>

    <!-- TAB 3: EXPERIENCE -->
    <div id="experience" class="tab-content">
      <div class="card">
        <div class="card-title">
          <span>Full-Time DevOps & Cloud Engineering Sprint</span>
          <span class="date-tag">May 2026 – Present</span>
        </div>
        <div class="card-subtitle">Independent Professional Development · India</div>
        <ul>
          <li>Intensive hands-on implementation across the full DevOps lifecycle: IaC (Terraform, AWS), Containerization (Docker, Kubernetes), and CI/CD (GitHub Actions, GitOps).</li>
          <li>Practiced shift-left DevSecOps methodologies and telemetry monitoring with Prometheus & Grafana.</li>
        </ul>
      </div>

      <div class="card">
        <div class="card-title">
          <span>Network and Infrastructure Engineer</span>
          <span class="date-tag">Jan 2025 – Apr 2026</span>
        </div>
        <div class="card-subtitle">Tech Mahindra · Ipswich, England, UK (On-site)</div>
        <ul>
          <li>Supported enterprise communication modernization, migrating legacy PSTN systems to IP-based Media Gateway (MGW) platforms with minimal service disruption.</li>
          <li>Executed infrastructure capacity planning and resource analysis using Nokia SRIMS, PACS, and BERT.</li>
          <li>Diagnosed and troubleshot production incidents with Wireshark and deep packet inspection tools.</li>
          <li>Validated deployments and managed system configurations using Asterisk and FreeSWITCH.</li>
        </ul>
      </div>

      <div class="card">
        <div class="card-title">
          <span>Human Centric Digital Innovation Lead</span>
          <span class="date-tag">Sep 2024 – Dec 2024</span>
        </div>
        <div class="card-subtitle">Allied Worldwide · London, UK (Remote)</div>
        <ul>
          <li>Implemented AI frameworks and ethical governance models adhering to data compliance standards.</li>
          <li>Designed smart workspace strategies enhancing human-AI collaborative workflows by 35%.</li>
        </ul>
      </div>

      <div class="card">
        <div class="card-title">
          <span>Data Analyst and Associate Researcher</span>
          <span class="date-tag">Aug 2023 – Sep 2024</span>
        </div>
        <div class="card-subtitle">Allied Worldwide · London, UK</div>
        <ul>
          <li>Automated reporting and data workflows across HubSpot and Excel, saving 25% administrative time.</li>
          <li>Delivered Power BI executive dashboards for data-driven strategic planning.</li>
        </ul>
      </div>
    </div>

    <!-- TAB 4: EDUCATION & CERTIFICATIONS -->
    <div id="education" class="tab-content">
      <div class="card">
        <div class="card-title">
          <span>University of Strathclyde</span>
          <span class="date-tag">Jan 2023 – Jan 2024</span>
        </div>
        <div class="card-subtitle">Master of Science (MS) — Supply Chain & Logistics (Grade: Merit)</div>
        <p>Activities: Program Representative, Presidential Election Runner-up.</p>
      </div>

      <div class="card">
        <div class="card-title">
          <span>New Delhi Institute Of Management (NDIM)</span>
          <span class="date-tag">Sep 2019 – Sep 2022</span>
        </div>
        <div class="card-subtitle">Bachelor of Business Administration (BBA) — 80%</div>
      </div>

      <div class="card">
        <h3 class="card-title">Key Certifications</h3>
        <div class="pill-group">
          <span class="pill tech">AWS Zero to Hero (TrainWithShubham)</span>
          <span class="pill tech">GitHub Copilot Certified (Tech Mahindra)</span>
        </div>
      </div>
    </div>

    <footer>
      ⚡ Served dynamically by Node.js in an unprivileged Docker container | Siddharth Lakhani
    </footer>
  </div>

  <script>
    function openTab(evt, tabName) {
      const contents = document.getElementsByClassName('tab-content');
      for (let i = 0; i < contents.length; i++) {
        contents[i].classList.remove('active');
      }

      const buttons = document.getElementsByClassName('tab-btn');
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
      }

      document.getElementById(tabName).classList.add('active');
      evt.currentTarget.classList.add('active');
    }
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(htmlContent);
});

server.listen(PORT, () => {
  console.log(`Server is running and listening on port ${PORT}`);
});
