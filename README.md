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

# 🔒 Day 44 – Secrets, Artifacts & Running Real Tests in CI

> **"Today, the pipeline starts doing real work. It is securely managing passwords, saving build files, and acting as the automated Quality Inspector for my code."**

---

## 🤫 Tasks 1 & 2: GitHub Secrets & Environment Variables

**The Concept:** 
In DevOps, you never, ever type passwords or API tokens directly into your code (this is called "hardcoding"). If you do, anyone who can read your repository can steal your credentials. 
Instead, we use **GitHub Secrets**. Think of Secrets as a **high-security vault**. You lock the password inside the vault via the GitHub UI. When the pipeline runs, it opens the vault, injects the password into a temporary environment variable, uses it, and then destroys it.

**Why should you never print secrets in CI logs?**
If a secret is printed in the logs, it remains visible in the Actions tab forever. Anyone on your team (or the public, if the repo is open-source) can read the log file and steal your database password. Thankfully, if you try to print it, GitHub actively intercepts it and **masks it with `***`** to protect you.

### 📄 `.github/workflows/task1-2-secrets.yml`
*(Note: Before running this, go to Settings -> Secrets and variables -> Actions, and create `MY_SECRET_MESSAGE`, `DOCKER_USERNAME`, and `DOCKER_TOKEN`)*

```yaml
name: Task 1 & 2 - Secrets
on: [push]

jobs:
  test-secrets:
    runs-on: ubuntu-latest
    steps:
      - name: Try to print the secret directly (It will be masked)
        run: echo "The secret is ${{ secrets.MY_SECRET_MESSAGE }}"
        
      - name: Use secret securely via Environment Variable
        env:
          SECURE_VAR: ${{ secrets.MY_SECRET_MESSAGE }}
        run: |
          if [ -n "$SECURE_VAR" ]; then
            echo "The secret is set: true"
          else
            echo "The secret is missing!"
          fi

```
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/03ebf629-ab21-4eb4-a785-b84312872636" />

---

## 📦 Tasks 3 & 4: Uploading & Downloading Artifacts

**The Concept:**
Because every job runs on a brand-new, isolated server, any files generated by Job 1 are instantly destroyed when Job 1 finishes.
**Artifacts** solve this. Think of an artifact as an **Armored Delivery Truck**. Job 1 finishes generating a file, packs it into the truck (`upload-artifact`), and sends it to GitHub's storage. When Job 2 boots up on a new server, it calls the truck (`download-artifact`) to deliver the exact same file.

**When would you use artifacts in a real pipeline?**

1. **Test Reports:** Saving a PDF or HTML report of test results so managers can download and read it later.
2. **Compiled Code:** Job 1 compiles Java code into a `.jar` file. Job 2 downloads that `.jar` file and deploys it to the server.

### 📄 `.github/workflows/task3-4-artifacts.yml`

```yaml
name: Task 3 & 4 - Artifacts
on: [push]

jobs:
  job1-create-artifact:
    runs-on: ubuntu-latest
    steps:
      - name: Generate a test report file
        run: echo "Test results: 50/50 tests passed successfully." > report.txt
        
      - name: Upload the file to GitHub Storage
        uses: actions/upload-artifact@v4
        with:
          name: my-test-report
          path: report.txt

  job2-read-artifact:
    needs: job1-create-artifact
    runs-on: ubuntu-latest
    steps:
      - name: Download the file from GitHub Storage
        uses: actions/download-artifact@v4
        with:
          name: my-test-report
          
      - name: Read the contents
        run: cat report.txt

```
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/eee4e7ec-c485-4d92-aebc-0aa23cbdf06e" />

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/649d7891-524e-499e-a633-6f53e3873912" />

*(Self-Note: Insert a screenshot here showing the artifact available for download at the bottom of the workflow summary page!)*

---

## 🚨 Task 5: Run Real Tests in CI

**The Concept:**
This is the core of Continuous Integration. The pipeline acts as an **Automated Quality Inspector**. It downloads your code (`actions/checkout`), runs your script, and looks at the exit code. If the script fails (exits with anything other than `0`), the pipeline turns red and blocks the deployment.

*(For this task, I created a simple bash script called `test.sh` in my repository that just echoes a message and exits with 0).*

### 📄 `.github/workflows/task5-real-test.yml`

```yaml
name: Task 5 - Real Tests
on: [push]

jobs:
  run-my-script:
    runs-on: ubuntu-latest
    steps:
      - name: Check out the repository code
        uses: actions/checkout@v4
        
      - name: Make the script executable
        run: chmod +x test.sh
        
      - name: Run the test script
        run: ./test.sh

```

*(Self-Note: I intentionally broke the script by adding `exit 1` to see the red X, then fixed it to see the green checkmark. Screenshot of the passing run attached!)*
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/cba1275c-4a91-4e59-8eb8-ef294bc93118" />

---

## ⚡ Task 6: Caching

**The Concept:**
Downloading dependencies (like thousands of Node.js modules or Python packages) takes a long time. **Caching** is like putting leftovers in a **refrigerator**. The first time the pipeline runs, it downloads everything from the internet and then stores a copy in the GitHub Cache (the fridge). The second time the pipeline runs, it just pulls the packages directly from the fridge, skipping the download and saving massive amounts of time.

**What is being cached and where is it stored?**
The specific folders where package managers (like `pip` or `npm`) store their downloaded files are being zipped up and stored directly on GitHub's secure cloud servers, linked to a specific cache "key".

### 📄 `.github/workflows/task6-caching.yml`

```yaml
name: Task 6 - Caching
on: [push]

jobs:
  test-cache:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Cache Python pip dependencies
        uses: actions/cache@v4
        with:
          path: ~/.cache/pip
          key: ${{ runner.os }}-pip-test
          
      - name: Install a huge package (TensorFlow)
        run: pip install tensorflow

```
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/25732461-af2e-41aa-b9cd-ef4e5f90341c" />
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/6ca1955e-11b6-46a7-8ae7-df742ca14407" />


*(Self-Note: The first run took roughly 37 seconds to download TensorFlow. The second run used the cache and completed in under 15 seconds!)*


# 🐳 Day 45 – Docker Build & Push in GitHub Actions

> **"Today I built a complete, end-to-end CI/CD pipeline. No more manual building. I push code, and GitHub automatically packages it and ships it to Docker Hub."**

---

## 🛠️ Task 1: Prepare

For this pipeline, I used a highly optimized, multi-stage Node.js `Dockerfile`. It uses a "Builder" stage to install dependencies for caching, and a "Production" stage that runs the app as a non-root user for maximum security. I also ensured my `DOCKER_USERNAME` and `DOCKER_TOKEN` were securely stored in GitHub Actions Secrets.

**My Dockerfile:**
```dockerfile
# STAGE 1: Builder
FROM node:18.17.0-alpine3.18 AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install && mkdir -p node_modules/
COPY . .

# STAGE 2: Production
FROM node:18.17.0-alpine3.18
WORKDIR /app
RUN addgroup -S nodeapp && adduser -S nodeapp -G nodeapp \
    && chown -R nodeapp:nodeapp /app
USER nodeapp
COPY --from=builder --chown=nodeapp:nodeapp /app/node_modules ./node_modules
COPY --from=builder --chown=nodeapp:nodeapp /app/server.js .
COPY --from=builder --chown=nodeapp:nodeapp /app/package.json .
EXPOSE 3000
CMD ["node", "server.js"]

```
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/f59e6e09-1fd2-4d56-88db-19cf600be9d2" />

---

## 🏗️ Task 2: Build the Docker Image in CI

To build the image, I needed to check out the repository code and use the official `docker/build-push-action@v5`. Here is the core YAML snippet that handles the checkout and build process:

```yaml
      - name: Check out the code
        uses: actions/checkout@v4
        
      - name: Build the Docker Image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: false 

```
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/5952297b-2e46-4251-b658-3534b02e4cae" />

---

## 📤 Task 3: Push to Docker Hub

To actually push the image, the runner first needs to authenticate. It also needs to generate a short commit hash so we can tag the image specifically. Here are the YAML steps I added to handle authentication and tagging:

**1. Generate the short SHA and log in:**

```yaml
      - name: Extract Short SHA for tagging
        id: vars
        run: echo "short_sha=${GITHUB_SHA::7}" >> $GITHUB_OUTPUT

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_TOKEN }}

```
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/46a666d4-0fc7-4843-994b-78e1acc1b816" />

**2. Add tags to the build step:**

```yaml
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/node-practice-app:latest
            ${{ secrets.DOCKER_USERNAME }}/node-practice-app:sha-${{ steps.vars.outputs.short_sha }}

```

*(Self-Note: Insert Link to the Docker Hub repository here!)*

---

## 🚦 Task 4: Only Push on Main

To prevent experimental feature branches from accidentally overwriting my production `latest` image on Docker Hub, I added a conditional statement directly to the `push` parameter inside the build step.

**The YAML configuration:**

```yaml
          # Evaluates to true on main, and false on PRs/feature branches
          push: ${{ github.ref == 'refs/heads/main' }} 

```

If I push to a feature branch, the pipeline will still build the image to verify the code compiles, but it safely skips the push to Docker Hub.

---

## 📛 Task 5: Add a Status Badge

I added a dynamic SVG badge to the top of my repository's `README.md`. This pings GitHub's API to show the real-time status of my Docker pipeline.

**The Markdown for the badge:**

```markdown
[![Docker Publish Pipeline](https://github.com/Sidlakh0802/GithubAction_practice/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/Sidlakh0802/GithubAction_practice/actions/workflows/docker-publish.yml)

```

*(Self-Note: Insert Screenshot of the green pipeline run and badge here!)*

---

## 🚀 Task 6: Pull and Run It (The Full Journey)

**What is the full journey from `git push` to a running container?**

1. **Trigger:** A developer types `git push`. GitHub Webhooks detect this event and instantly spin up an isolated Ubuntu server (runner).
2. **Checkout:** The server clones the repository, grabbing the Node.js source code and the multi-stage `Dockerfile`.
3. **Authenticate:** The server retrieves credentials from the secret vault and securely logs into Docker Hub.
4. **Build & Push:** The server executes the multi-stage build, packages the app into a secure image, tags it with the commit hash, and pushes it to the public Docker Hub registry.
5. **Pull & Run:** On my local machine or production server, I execute:
`docker run -d -p 3000:3000 myusername/node-practice-app:latest`
The server pulls the freshly built image and spins it up, exposing the Node.js application securely on port 3000!

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/5f16a514-ff0a-4eea-88dd-4a5e5b22cec8" />
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/cd997f49-058f-4a00-a0d6-3bed6da54f70" />
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/b80fa409-0629-4980-97f8-3b2cb7592eef" />
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/c7833e1e-7e06-4aeb-88b2-92e86e5bc1be" />

---

## 📜 The Complete Pipeline YAML

Here is the final, assembled `.github/workflows/docker-publish.yml` file combining all the tasks above:

```yaml
name: Docker Publish Pipeline
on: [push]

jobs:
  docker-cicd:
    runs-on: ubuntu-latest
    steps:
      - name: Check out the code
        uses: actions/checkout@v4
        
      - name: Extract Short SHA for tagging
        id: vars
        run: echo "short_sha=${GITHUB_SHA::7}" >> $GITHUB_OUTPUT

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_TOKEN }}

      - name: Build and Push Docker Image
        uses: docker/build-push-action@v5
        with:
          context: .
          # Push only if the push event happened on the main branch
          push: ${{ github.ref == 'refs/heads/main' }} 
          tags: |
            ${{ secrets.DOCKER_USERNAME }}/node-practice-app:latest
            ${{ secrets.DOCKER_USERNAME }}/node-practice-app:sha-${{ steps.vars.outputs.short_sha }}

```
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/2feee164-7fdf-4946-9054-82496016361d" />
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/de1c418c-7ea9-4319-a38b-88b486c0ef95" />


# ♻️ Day 46 – Reusable Workflows & Composite Actions

> **"Today I learned how to keep my CI/CD pipelines DRY (Don't Repeat Yourself). I built a modular architecture using reusable workflows to share entire jobs, and composite actions to bundle recurring steps."**

---

## 🧠 Task 1: Understand `workflow_call`

Before writing code, I researched the core concepts of modular GitHub Actions:
* **What is a reusable workflow?** It is a complete workflow template (containing jobs and steps) designed to be called by other workflows. It prevents the duplication of YAML code across multiple repositories.
* **What is the `workflow_call` trigger?** It is the specific event listener that allows a workflow file to be triggered programmatically by another workflow, rather than by a standard repository event (like a `push`).
* **How is calling a reusable workflow different from using a regular action (`uses:`)?** A reusable workflow dictates the entire execution environment (it spins up the runners and defines the `jobs`). A regular action is just a series of `steps` that run *inside* a runner you have already provisioned in your caller workflow.
* **Where must a reusable workflow file live?** It must be placed strictly in the `.github/workflows/` directory.

---

## 🏗️ Task 2: Create Your First Reusable Workflow

I created the initial central template. It accepts variables (`inputs`), securely accepts a token (`secrets`), and executes a basic build process.

**File:** `.github/workflows/reusable-build.yml`
```yaml
name: Reusable Build Template
on:
  workflow_call:
    inputs:
      app_name:
        required: true
        type: string
      environment:
        required: true
        type: string
        default: "staging"
    secrets:
      docker_token:
        required: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Print Build Details
        run: |
          echo "Building ${{ inputs.app_name }} for${{ inputs.environment }}"
          echo "Docker token is set: true"

```

---

## 📞 Task 3: Create a Caller Workflow

I created the workflow that actually triggers when I push code to `main`. It "calls" the template from Task 2 and passes in the required inputs and secrets.

**File:** `.github/workflows/call-build.yml`

```yaml
name: Call Build Workflow
on:
  push:
    branches: [main]

jobs:
  execute-reusable-job:
    uses: ./.github/workflows/reusable-build.yml
    with:
      app_name: "my-web-app"
      environment: "production"
    secrets:
      docker_token: ${{ secrets.DOCKER_TOKEN }}

```

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/7a1440c1-6d94-45ce-bc27-903c5364f2e1" />


---

## 🚀 Task 4: Add Outputs to the Reusable Workflow

I extended both files so the reusable workflow could generate a version number and pass it back up to the caller workflow.

**Extended Reusable Workflow:** `.github/workflows/reusable-build.yml`

```yaml
name: Reusable Build Template
on:
  workflow_call:
    inputs:
      app_name:
        required: true
        type: string
      environment:
        required: true
        type: string
        default: "staging"
    secrets:
      docker_token:
        required: true
    outputs:
      build_version:
        description: "The generated version tag for the build"
        value: ${{ jobs.build.outputs.version }}

jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.version_step.outputs.version_tag }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Print Build Details
        run: |
          echo "Building ${{ inputs.app_name }} for${{ inputs.environment }}"
          echo "Docker token is set: true"
          
      - name: Generate Version String
        id: version_step
        run: echo "version_tag=v1.0-${GITHUB_SHA::7}" >> $GITHUB_OUTPUT

```

**Extended Caller Workflow:** `.github/workflows/call-build.yml`

```yaml
name: Call Build Workflow
on:
  push:
    branches: [main]

jobs:
  execute-reusable-job:
    uses: ./.github/workflows/reusable-build.yml
    with:
      app_name: "my-web-app"
      environment: "production"
    secrets:
      docker_token: ${{ secrets.DOCKER_TOKEN }}

  read-output-job:
    runs-on: ubuntu-latest
    needs: execute-reusable-job
    steps:
      - name: Print the version from the previous workflow
        run: echo "The version is ${{ needs.execute-reusable-job.outputs.build_version }}"

```

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/9acbf5da-37b9-4653-b57a-5c3dd8fb77e2" />
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/6f651146-6209-4dab-8c53-e635274f9f6c" />

---

## 🛠️ Task 5: Create a Composite Action

To bundle multiple repeating steps into a single command, I created a Custom Composite Action. Unlike reusable workflows, this acts as a step-level tool.

**File:** `.github/actions/setup-and-greet/action.yml`

```yaml
name: Setup and Greet
description: Custom composite action
inputs:
  name:
    required: true
  language:
    default: 'en'
outputs:
  greeted:
    description: "Returns true"
    value: 'true'
runs:
  using: "composite"
  steps:
    - name: Print Greeting
      shell: bash
      run: |
        if [ "${{ inputs.language }}" = "es" ]; then
          echo "¡Hola, ${{ inputs.name }}!"
        else
          echo "Hello, ${{ inputs.name }}!"
        fi
        
    - name: Print System Info
      shell: bash
      run: |
        echo "Current Date: $(date)"
        echo "Runner OS: $RUNNER_OS"

```

**Testing the Action:** `.github/workflows/test-composite.yml`

```yaml
name: Test Composite Action
on: [push]

jobs:
  test-action:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Run my custom action
        uses: ./.github/actions/setup-and-greet
        with:
          name: "Siddharth"

```

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/6d8afe45-990f-4929-807e-575f29a4f0c8" />

---

## ⚖️ Task 6: Reusable Workflow vs Composite Action

| Feature | Reusable Workflow | Composite Action |
| --- | --- | --- |
| **Triggered by** | `workflow_call` | `uses:` in a step |
| **Can contain jobs?** | **Yes** (Defines the runner/execution environment) | **No** (Only contains steps) |
| **Can contain multiple steps?** | **Yes** | **Yes** |
| **Lives where?** | `.github/workflows/` | Anywhere (commonly `.github/actions/`) |
| **Can accept secrets directly?** | **Yes** (Via the `secrets:` mapping) | **No** (Secrets must be passed as standard inputs) |
| **Best for?** | Entire CI/CD pipelines, standardizing full deployment jobs across multiple repos. | Bundling a repetitive sequence of specific steps to clean up a job. |

```

```


# ⚡ Day 47 – Advanced Triggers: PR Events, Cron Schedules & Event-Driven Pipelines

> **"Today I moved past basic push triggers and engineered intelligent, event-driven pipelines. I built PR quality gates, scheduled health checks, and chained modular workflows together."**

---

## 🚦 Task 1: PR Lifecycle Events (`pr-lifecycle.yml`)
This workflow tracks specific activity types during a pull request.
```yaml
name: PR Lifecycle Tracker
on:
  pull_request:
    types: [opened, synchronize, reopened, closed]
jobs:
  pr-details:
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "Event: ${{ github.event.action }}"
          echo "Title: ${{ github.event.pull_request.title }}"
          echo "Author: ${{ github.event.pull_request.user.login }}"
      - if: github.event.pull_request.merged == true
        run: echo "🎉 The PR was merged!"

```

## 1. OPENED
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/1deae599-6be6-40ec-9f02-f17f86ef9b33" />

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/e6ff1d52-3575-4a4c-bd7a-4ba57ffaa7de" />


## 2. SYNCHRONIZE
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/cef36228-43c0-4473-b0ed-54df01393e9d" />


## 3. CLOSED
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/3a0fb356-7a08-4bc1-a479-c4fd61dfd022" />

---

## 🛡️ Task 2: PR Validation Workflow (`pr-checks.yml`)

A real-world DevOps gate ensuring code hygiene before merges are allowed.

```yaml
name: PR Quality Gate
on:
  pull_request:
    branches: [main]
jobs:
  file-size-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: |
          LARGE_FILES=$(find . -type f -size +1M -not -path "./.git/*")
          if [ -n "$LARGE_FILES" ]; then exit 1; fi

  branch-name-check:
    runs-on: ubuntu-latest
    steps:
      - run: |
          BRANCH="${{ github.head_ref }}"
          if [[ "$BRANCH" != feature/* && "$BRANCH" != fix/* && "$BRANCH" != docs/* ]]; then exit 1; fi

  pr-body-check:
    runs-on: ubuntu-latest
    steps:
      - run: |
          if [ -z "${{ github.event.pull_request.body }}" ]; then
            echo "::warning::PR description is empty!"
          fi

```
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/170f8f22-4485-404a-a1fc-37ceb4ee5eac" />


---

## 🕒 Task 3: Scheduled Workflows (Cron Deep Dive)

**Cron Expression Answers:**

* **Every weekday at 9 AM IST:** `30 3 * * 1-5` (IST is UTC +5:30, so 9:00 AM IST is 3:30 AM UTC).
* **First day of every month at midnight:** `0 0 1 * *`
* **Why GitHub delays inactive repos:** GitHub disables cron schedules on repositories that haven't had any push activity in 60 days to prevent wasting compute resources on abandoned projects.

```yaml
name: Scheduled Health Check
on:
  schedule:
    - cron: '30 2 * * 1'
  workflow_dispatch:
jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - run: curl -o /dev/null -s -w "%{http_code}\n" [https://github.com](https://github.com)

```
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/770c47a7-07de-4df4-afef-2d0bf9defd18" />

---

## 📂 Task 4: Path & Branch Filters

**Notes: When to use `paths` vs `paths-ignore`?**
* Use **`paths`** when you want a highly specific pipeline to run *only* when that specific directory changes. 
* Use **`paths-ignore`** for general pipelines where you want them to run almost always, except for harmless changes like markdown docs.

**File 1: `smart-triggers.yml` (Runs only for code)**
```yaml
name: Backend Code Trigger
on:
  push:
    branches:
      - main
      - 'release/*'
    paths:
      - 'src/**'
      - 'app/**'
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Changes detected in src/ or app/. Starting build!"

```

**File 2: `docs-only.yml` (Ignores markdown changes)**

```yaml
name: General Pipeline
on:
  push:
    paths-ignore:
      - '*.md'
      - 'docs/**'
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Running tests because non-documentation files changed."

```

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/9640b59e-1423-4370-a08a-a7c844f76824" />

---

## 🔗 Task 5: `workflow_run` — Chain Workflows Together

```yaml
name: Deploy Application
on:
  workflow_run:
    workflows: ["Run Tests"]
    types: [completed]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - if: github.event.workflow_run.conclusion == 'success'
        run: echo "Deploying!"

```
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/096d4281-b4d1-4159-9409-09ecf9c65c83" />

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/fd01ded8-54a9-497f-9d74-92a59f3f1a55" />

**`workflow_run` vs `workflow_call`:**

* `workflow_call` is an active function call (Template A asks Template B to run and waits for the output).
* `workflow_run` is reactive and decoupled (Pipeline B sits quietly, sees that Pipeline A finished, and triggers itself autonomously).

---

## 🤖 Task 6: External Event Triggers (`repository_dispatch`)

**When would an external system trigger a pipeline?**

* **Monitoring Tool (Datadog/Prometheus):** Detects a server crash and fires a webhook to GitHub to run an automated rollback/recovery pipeline.
* **ChatOps (Slack/Teams):** A manager approves a deployment in a Slack channel, which triggers a webhook to GitHub to push the release to Production.
* **CMS Updates:** A marketing team publishes a new blog post in a Headless CMS, triggering GitHub to rebuild the static website.

```yaml
name: External API Trigger
on:
  repository_dispatch:
    types: [deploy-request]
jobs:
  handle-dispatch:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying to: ${{ github.event.client_payload.environment }}"

```
<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/6a19463f-f6de-47b4-acc6-93252a4f0239" />

<img width="3420" height="2214" alt="image" src="https://github.com/user-attachments/assets/9da73e18-bf5b-4e22-80d0-191f6e7c1edf" />


---

## 🧠 Key Learnings & Takeaways

* **The Power of the Event Payload:** GitHub Actions isn't just a basic trigger; it passes a massive JSON payload (`github.event`) into the runner. You can extract granular details like the PR author, the exact branch name, or whether a PR was just closed versus actually merged.
* **Bash is the Engine:** GitHub Actions handles the orchestration, but standard Linux Bash scripting does the heavy lifting. Using commands like `find` and forcing a step to turn red using `exit 1` is how real-world DevOps quality gates are built.
* **Coupled vs. Decoupled Pipelines:** 
  * `workflow_call` creates a strict dependency where Workflow A specifically commands Workflow B to run. 
  * `workflow_run` creates a decoupled, reactive architecture where Workflow B just sits and listens for Workflow A to finish before acting.
* **Saving Compute Minutes:** In enterprise environments, compute time costs money. Using `paths` and `paths-ignore` filters ensures we don't spin up expensive Docker builds just because someone fixed a typo in a `.md` file.
* **Cron Timezones:** GitHub Actions cron schedules always operate in **UTC**. As an engineer, you must always manually calculate the timezone offset (like IST) when setting up scheduled maintenance tasks.
* **External Integration:** Pipelines don't have to be triggered by code changes. Using `repository_dispatch`, external tools like Slack, Datadog, or AWS can push payloads to GitHub to trigger emergency rollbacks or automated tasks.## 🌟 Proactive Real-World Enhancements (Beyond the Prompt)

While completing these tasks, I implemented a few advanced techniques that weren't explicitly requested but are essential for production-grade pipelines:

* **Ignoring the `.git` Directory in Size Checks (`-not -path "./.git/*"`):** 
  When checking for oversized files (>1MB) in Task 2, I explicitly told the Linux `find` command to ignore the hidden `.git` folder. When GitHub Actions checks out code, it downloads the version history into this hidden folder, and Git's internal database files frequently exceed 1MB. Without this exclusion, the PR gate would falsely fail almost every time!
* **Native GitHub Annotations (`::warning::`):** 
  In the PR body check, instead of just using a standard `echo` command to print text hidden deep in the logs, I used GitHub's special workflow command syntax (`echo "::warning::PR description is empty!"`). This tells the GitHub UI to extract that message and highlight it in yellow directly on the Pull Request summary page, making it instantly visible to developers.
* **Explicit Failure Codes (`exit 1`):** 
  I utilized standard Linux exit codes to bridge the gap between Bash scripts and GitHub Actions. By explicitly running `exit 1` when a condition isn't met (like a bad branch name), it forces the runner to interpret the step as a "Failure" and turn the check red, successfully blocking the Pull Request from being merged.

  
