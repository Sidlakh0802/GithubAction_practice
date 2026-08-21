# GitHub Actions Practice

# To create Github action you need a folder called .github/workflows

# This REPO will have the full CICD Practice for 90daysofdevops Repo (day40-49). Please follow this Readme file for your refrence




# 🟢 Day 40 – Your First GitHub Actions Workflow

> **"This is the moment CI/CD stops being a concept and becomes real. That green checkmark hits different!"**

---

## 📄 The Workflow YAML (`.github/workflows/greet.yml`)

Here is the final version of my very first GitHub Actions workflow. It checks out the code, prints a greeting, and outputs dynamic information about the runner environment using GitHub's built-in variables.

```yaml
name: First Action Workflow

on:
  push:
    branches:
      - main

jobs:
  greet:
    runs-on: ubuntu-latest
    
    steps:
      - name: Step 1 - Check out the code
        uses: actions/checkout@v4
        
      - name: Step 2 - Print Greeting
        run: echo "Hello from GitHub Actions!"
        
      - name: Step 3 - Print Current Date and Time
        run: date
        
      - name: Step 4 - Print the Branch Name
        run: echo "This run was triggered by branch -> ${{ github.ref_name }}"
        
      - name: Step 5 - List Repository Files
        run: ls -la
        
      - name: Step 6 - Print Runner Operating System
        run: echo "This runner is running on -> ${{ runner.os }}"

```

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/9d770eb1-3b76-4413-bb7f-17d7ee552971" />

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/126ac2fd-5568-4c53-9d6f-16c552121ec0" />

---

## 🧠 Understanding the Anatomy

Writing pipelines is just learning the vocabulary. Here is what each key in the YAML file actually does:

* **`on:`** The Trigger. This tells GitHub *when* to wake up and run the pipeline. (e.g., "Run this every time someone pushes code").
* **`jobs:`** The major groupings of work. A workflow can have multiple jobs (like `build`, `test`, `deploy`) that can run at the same time or sequentially.
* **`runs-on:`** The Server. This tells GitHub which operating system the temporary virtual machine (Runner) should boot up with. `ubuntu-latest` is the standard.
* **`steps:`** The literal sequence of tasks the Runner must execute, one by one, inside the specific job.
* **`uses:`** The Shortcut. Instead of writing custom shell scripts to do complex things (like securely downloading our repo), we can "use" pre-built actions made by GitHub or the community. `actions/checkout@v4` is the most common one.
* **`run:`** The Terminal. This tells the Runner to execute a raw Linux shell command, just like you would on your own laptop (e.g., `npm install` or `echo`).
* **`name:`** The Label. This doesn't affect how the code runs, but it gives the step a clean, human-readable title in the GitHub UI so you know exactly what is happening while watching the logs.

---

## 🚨 Breaking it on Purpose (The Red 'X')

To understand how CI/CD protects our code, I intentionally changed a command and wrote wrong one to see what happens.
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/1f436db0-b4d2-46c7-951f-2bf63cba9a82" />
**What does a failed pipeline look like?**

* The beautiful green checkmark turns into an angry **Red X**.
* GitHub sends an automated email warning me that my workflow failed.
* **Crucially:** The pipeline instantly halts! It stops at the broken step and refuses to run any of the subsequent steps. This is exactly how pipelines prevent broken code from being deployed.

**How do you read the error?**
When you click into the failed run in the "Actions" tab, GitHub provides a sidebar with the jobs. You click on the failed job, and the logs automatically expand directly to the exact step that caused the crash. It shows the terminal output (the standard error or exit code), allowing you to pinpoint exactly what command broke so you can fix it locally and push again.




# 🔀 Day 41 – Triggers & Matrix Builds

> **"A smart pipeline doesn't just run when you push code. It runs on a schedule, waits for human commands, and clones itself to test every environment at once."**

---

## 🚦 Task 1: Trigger on Pull Request

The `pull_request` event triggers a workflow when a PR is opened, updated, or reopened, running tests against the proposed merge commit. Think of it as a **nightclub bouncer**: before your new code is allowed to merge into the `main` branch, the pipeline stops it at the door, checks its ID, and runs automated tests. If the code is broken, it doesn't get in.

### 📄 `.github/workflows/pr-check.yml`
```yaml
name: PR Gatekeeper

on:
  pull_request:
    branches:
      - main

jobs:
  check-pr:
    runs-on: ubuntu-latest
    steps:
      - name: Print PR info
        run: echo "PR check running for branch -> ${{ github.head_ref }}"

```

*Note for Submission: After pushing this, I created a new branch, made a dummy commit, and opened a Pull Request. The GitHub UI immediately showed the yellow "pending" dot, proving the pipeline attached itself to the PR page!*

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/e49c56c4-3eba-44e6-9cad-094cbe2a8077" />

---

## ⏰ Task 2: Scheduled Trigger (Cron)

The `schedule` event triggers a workflow automatically at a specific time using standard POSIX cron syntax. It acts like an **automated robot butler** that you program once, allowing it to wake up in the background—say, exactly at midnight—to run security scans or database backups while the whole team is asleep.

**My Notes & Answers:**

* **Midnight UTC Cron:** `0 0 * * *`
* **Question:** What is the cron expression for every Monday at 9 AM?
* **Answer:** `0 9 * * 1` (Minute 0, Hour 9, Every Day of the Month, Every Month, Day of the week 1=Monday).

---

## 🔘 Task 3: Manual Trigger (`workflow_dispatch`)

The `workflow_dispatch` event allows you to trigger a workflow manually via the GitHub Actions UI, uniquely supporting custom `inputs` so you can pass variables at runtime. This is essentially your **big red launch button**. It waits for a human to log in, click "Run workflow," and explicitly type in instructions (like "deploy this to production") before it fires off.

### 📄 `.github/workflows/manual.yml`

```yaml
name: Manual Deployment

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Target Environment (staging/production)'
        required: true
        default: 'staging'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Announce Deployment Target
        run: echo "Deploying the application to the ${{ github.event.inputs.environment }} environment!"

```

*Note for Submission: I went to the Actions tab, selected "Manual Deployment" on the left, clicked "Run workflow", typed "production" into the box, and saw the runner print it in the logs!*

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/7193f0f6-1a9b-4982-87bb-c956590a0527" />


---

## 🧬 Task 4 & 5: Matrix Builds & Fail-Fast

A `matrix` strategy automatically generates multiple job runs based on an array of variables, executing them in parallel. It works exactly like a **cloning machine**: instead of writing the same test code six times, you write it once, and GitHub clones your pipeline into parallel universes (e.g., testing different OS and Python combinations simultaneously).

### 📊 How the Cloning Works (Matrix Expansion)

```text
OS: [Ubuntu, Windows]  x  Python: [3.10, 3.11, 3.12]
         │
         ▼ (GitHub multiplies them: 2 x 3 = 6 parallel jobs)
         │
    ├── Job 1: Ubuntu + Python 3.10
    ├── Job 2: Ubuntu + Python 3.11
    ├── Job 3: Ubuntu + Python 3.12
    ├── Job 4: Windows + Python 3.10  🚫 (We EXCLUDED this one in the code)
    ├── Job 5: Windows + Python 3.11
    └── Job 6: Windows + Python 3.12

```

### 📄 `.github/workflows/matrix.yml`

```yaml
name: Python Matrix Test

on:
  push:
    branches:
      - main
  schedule:
    - cron: '0 0 * * *' # Scheduled for Midnight UTC

jobs:
  test-across-environments:
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false  # Added for Task 5
      matrix:
        os: [ubuntu-latest, windows-latest]
        python-version: ["3.10", "3.11", "3.12"]
        exclude:
          - os: windows-latest
            python-version: "3.10"
            
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python ${{ matrix.python-version }}
        uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
          
      - name: Print OS and Python Version
        run: |
          echo "Running on OS: ${{ matrix.os }}"
          python --version

```
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/9d51e05f-0994-4ea9-89d2-1f61eac8b8af" />

**My Notes & Answers:**

* **How many total jobs run without the exclude rule?** 6 jobs. (2 Operating Systems × 3 Python versions).
* **What does `fail-fast: true` do vs `false`?**
* **`true` (Default): The Domino Effect.** If the Windows/Python 3.12 job fails, GitHub immediately aborts all other jobs running in the matrix to save computing power.
* **`false`: The "Let it Burn" Approach.** If the Windows job fails, GitHub ignores it and lets the Ubuntu jobs finish completely. We want this in matrix testing so we can see exactly which specific combinations pass and which fail!




# 🏃‍♂️ Day 42 – Runners: GitHub-Hosted & Self-Hosted

> **"Every job needs a machine to run on. Today, I took control of the physical infrastructure that powers my CI/CD pipelines."**

---

## ☁️ Task 1: GitHub-Hosted Runners

A GitHub-hosted runner is a fresh, temporary virtual machine provided directly by GitHub. It acts like a fully furnished hotel room: the moment your workflow starts, GitHub hands you the keys to a brand new Ubuntu, Windows, or macOS server. The moment the job finishes, the server is completely destroyed and thrown away. GitHub manages all the maintenance, networking, and OS updates.

### 📄 `.github/workflows/hosted-runners.yml`
```yaml
name: GitHub Hosted Runners Explorer

on:
  push:
    branches: [ "main" ]

jobs:
  explore-ubuntu:
    runs-on: ubuntu-latest
    steps:
      - name: Print OS, Hostname, User
        run: |
          echo "OS: $RUNNER_OS"
          hostname
          whoami
          
      # (Task 2 included here)
      - name: Check Pre-installed Tools
        run: |
          docker --version
          python --version
          node --version
          git --version

  explore-windows:
    runs-on: windows-latest
    steps:
      - name: Print OS, Hostname, User
        run: |
          echo "OS: $env:RUNNER_OS"
          hostname
          whoami

  explore-macos:
    runs-on: macos-latest
    steps:
      - name: Print OS, Hostname, User
        run: |
          echo "OS: $RUNNER_OS"
          hostname
          whoami

```

---
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/a38a02fc-145f-456a-857a-5b30627772d1" />

## 🛠️ Task 2: Explore What's Pre-installed

When checking the `ubuntu-latest` runner, I was able to successfully print the versions for Docker, Python, Node, and Git without installing a single thing.

**Why does this matter?**
If runners did not come heavily pre-loaded with these developer tools, we would have to write dozens of lines of complex setup scripts to download and configure them every single time a pipeline ran. Pre-installed tools save massive amounts of execution time, keep our YAML files clean, and drastically reduce computing costs.

---

## 🖥️ Task 3: Set Up a Self-Hosted Runner

I successfully configured a self-hosted Linux runner. A self-hosted runner is a physical or virtual machine that *you* own (like an AWS EC2 instance) that is securely connected to GitHub. Instead of GitHub spinning up a temporary server, your machine constantly listens and says, "Give me the jobs, I will run them right here."

*(Note: My runner successfully showed up in my GitHub Settings with a green dot indicating it is **Idle** and ready for jobs! Screenshot attached in my repository).*
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/be105223-dbc4-4750-86e5-117f6bc234df" />
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/410f5bc2-a5a3-436c-845d-e5e085afc77b" />


---

## 🚀 Task 4: Use Your Self-Hosted Runner

To prove the runner was executing code on my actual machine, I wrote a workflow targeting `self-hosted`, printed the server's hostname, and created a text file. When I SSH'd back into my server, the file `i-was-created-by-github-actions.txt` was sitting right there in my directory!

### 📄 `.github/workflows/self-hosted.yml`

```yaml
name: Self-Hosted Runner Test

on:
  push:
    branches: [ "main" ]

jobs:
  run-on-my-machine:
    # Notice the label added here for Task 5!
    runs-on: [self-hosted, my-linux-runner]
    
    steps:
      - name: Prove it is my physical machine
        run: |
          hostname
          pwd
          
      - name: Create a physical file
        run: touch i-was-created-by-github-actions.txt

```
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/5d3d1644-0aa3-45c0-b2d1-8c7c80f4e066" />
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/629e1830-3bee-430b-a4f1-6bf49b4f3aa1" />

---

## 🏷️ Task 5: Labels

During configuration, I assigned the custom label `my-linux-runner` to my machine.

**Why are labels useful?**
Labels act as precise routing tags for your physical servers. If a company has 10 different self-hosted runners, labels ensure that a heavy Machine Learning pipeline is routed exactly to `[self-hosted, gpu-enabled]`, and a highly sensitive deployment script only goes to `[self-hosted, secure-internal-network]`.

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/8c25594d-c6ec-4e3c-b407-b976949ca9e4" />


---

## ⚖️ Task 6: GitHub-Hosted vs. Self-Hosted

Here is a quick breakdown of when to use which infrastructure:

| Feature | GitHub-Hosted | Self-Hosted |
| --- | --- | --- |
| **Who manages it?** | GitHub handles all hardware, networking, and OS updates. | You handle all OS updates, patches, and physical maintenance. |
| **Cost** | Pay-per-minute (includes a generous free tier). | You pay your cloud provider (AWS/Azure) for the constant VM uptime. |
| **Pre-installed tools** | Massive library of tools (Docker, Node, Java, etc.) | None. You must install exactly what your pipeline needs manually. |
| **Good for** | Standard web apps, open-source projects, generic builds. | Apps that need access to internal private VPNs, databases, or massive CPU. |
| **Security concern** | Very low. The VM is destroyed after every single run. | Moderate. Because the server persists between jobs, malicious code could leave malware behind. |

```

```


