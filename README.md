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


# 🎛️ Day 43 – Jobs, Steps, Env Vars & Conditionals

> **"Pipelines aren't just rigid lists of terminal commands. Today, I learned how to build smart, context-aware workflows that make decisions, pass data across servers, and control their own execution flow."**

---

## 🔗 Task 1: Multi-Job Workflow & Dependencies

By default, if you put multiple jobs in a GitHub Actions workflow, GitHub will spin up separate servers and run them all at the exact same time (in parallel) to save time. However, in DevOps, we usually need things to happen in a strict order: you cannot deploy code that hasn't been tested.

We solve this using the **`needs:`** keyword. 

**The Technical Definition:** The `needs` key explicitly defines a dependency chain. It forces a downstream job to wait in a "Pending" state until its prerequisite job finishes with a "Success" exit code.
**The Everyday Definition:** Think of it like a **relay race**. The `deploy` runner is standing on the track, waiting. It physically cannot start running until the `test` runner officially crosses the finish line and hands off the baton. If the `test` runner trips and crashes (fails), the race is called off, and the `deploy` runner never starts. This is how we protect production environments from broken code.

### 📄 `.github/workflows/multi-job.yml`
```yaml
name: Multi-Job Chain
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Building the app"
  
  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo "Running tests"
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying"

```
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/d4f9fb39-fec4-46b1-a944-d3910b63112c" />

*(Self-Note: The Actions tab generates a beautiful visual graph showing this exact dependency chain!)*

---

## 🌍 Tasks 2, 3 & 4: Variables, Outputs, and Conditionals

I combined Tasks 2, 3, and 4 into a single workflow file called `data-and-logic.yml` to see how they all interact with each other.

### 1. Environment & Context Variables (Task 2)

Variables allow us to inject reusable data into our pipelines without hardcoding it. I scoped these variables at three different levels of visibility:

* **Workflow Level (`env:` at the very top):** This is the **Global Loudspeaker**. Any variable declared here (like `APP_NAME: myapp`) can be read by every single job and step.
* **Job Level:** This is the **Department Memo**. If I define `ENVIRONMENT: staging` inside a specific job, only the steps inside that isolated job can see it.
* **Step Level:** This is a **Sticky Note**. A variable like `VERSION: 1.0.0` defined on a single step is destroyed the moment that specific terminal command finishes.
* **Context Variables:** Data like `${{ github.actor }}` gives our pipeline "omniscience"—it inherently knows who triggered the pipeline and what commit hash is being tested.

### 2. Job Outputs (Task 3)

Every job boots up on a completely fresh, separate virtual machine. **They do not share memory or hard drives.** Setting an output is like **Job A writing a secure text message and sending it back to GitHub right before its server is destroyed**. When Job B boots up on a new server, it asks GitHub for that message using the `needs` context.

### 3. Conditionals & Flow Control (Task 4)

Conditionals (`if:`) act as traffic lights for our pipelines:

* **Branch Filtering (`if: github.ref == 'refs/heads/main'`):** Ensures a step only executes if the code is on the main branch.
* **Running on Failure (`if: failure()`):** Acts as a **Fire Alarm**. It runs *only* when something breaks, usually to trigger an automated alert.
* **The `continue-on-error: true` flag:** Tells GitHub, "Even if this command fails, put a band-aid on it, mark it green, and keep going."

### 📄 `.github/workflows/data-and-logic.yml`

```yaml
name: Data and Logic Explorer
on: [push]

# TASK 2: Workflow Level Variable
env:
  APP_NAME: myapp 

jobs:
  job-one-producer:
    runs-on: ubuntu-latest
    # TASK 2: Job Level Variable
    env:
      ENVIRONMENT: staging 
    
    # TASK 3: Exposing the step output to the job level so other jobs can see it
    outputs:
      shared_date: ${{ steps.date_generator.outputs.date }}
      
    steps:
      - name: Print Variables (Task 2)
        # TASK 2: Step Level Variable
        env:
          VERSION: 1.0.0 
        run: |
          echo "App: $APP_NAME, Env: $ENVIRONMENT, Ver:$VERSION"
          echo "Triggered by actor: ${{ github.actor }}, Commit SHA:${{ github.sha }}"
          
      - name: Set an Output (Task 3)
        id: date_generator
        run: echo "date=$(date)" >> $GITHUB_OUTPUT
        
      - name: Force a failure but continue (Task 4)
        continue-on-error: true
        run: exit 1

      - name: Run only if previous step failed (Task 4)
        if: failure()
        run: echo "The previous step failed, but we survived!"

  job-two-consumer:
    needs: job-one-producer
    runs-on: ubuntu-latest
    steps:
      - name: Read Output from Job One (Task 3)
        run: echo "The date generated in the previous server was ${{ needs.job-one-producer.outputs.shared_date }}"
      
      - name: Run ONLY on main branch (Task 4)
        if: github.ref == 'refs/heads/main'
        run: echo "This only prints if we are on the main branch!"

```
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/88e153ba-d194-4802-a496-c0bc920769ed" />
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/929175af-d583-479d-a330-cceeb2c9ba75" />

---

## 🧠 Task 5: The "Smart Pipeline" Synthesis

I combined all these concepts into a final `smart-pipeline.yml`. This utilized a highly common DevOps architecture known as the **"Diamond Pattern" (Fan-Out / Fan-In)**.

1. **Fan-Out:** The pipeline triggers on a push. It instantly spins up a `lint` job and a `test` job. Because neither `needs` the other, they run in parallel, cutting our execution time in half.
2. **Fan-In:** I created a `summary` job with `needs: [lint, test]`. This job acts as a manager. It waits until both parallel jobs succeed before booting up.
3. **Context Awareness:** Finally, the summary job dynamically reads the exact commit message entered by the developer using `${{ github.event.commits[0].message }}` and uses a bash `if/else` statement to evaluate if it was pushed to `main` or a feature branch.

### 📄 `.github/workflows/smart-pipeline.yml`

```yaml
name: Smart Pipeline
on: 
  push:
    branches:
      - '**' # Triggers on push to ANY branch

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Linting code..."
      
  test:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Testing code..."
      
  summary:
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - name: Print Push Details
        run: |
          echo "Commit Message: ${{ github.event.commits[0].message }}"
          if [ "${{ github.ref }}" = "refs/heads/main" ]; then
            echo "This was a push to the MAIN branch."
          else
            echo "This was a push to a FEATURE branch."
          fi

```
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/ddbb5707-ac41-4e81-a6f8-ef16ef349f98" />


