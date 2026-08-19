# GitHub Actions Practice

# To create Github action you need a folder called .github/workflows

# This REPO will have the full CICD Practice for 90daysofdevops Repo (day40-49). Please follow this Readme file for your refrence




# 🟢 Day 40 – Your First GitHub Actions Workflow

> **"This is the moment CI/CD stops being a concept and becomes real. That green checkmark hits different!"**

---

## 📄 The Workflow YAML (`.github/workflows/hello.yml`)

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

To understand how CI/CD protects our code, I intentionally added a step that runs `exit 1` (a forced failure command) to see what happens.

**What does a failed pipeline look like?**

* The beautiful green checkmark turns into an angry **Red X**.
* GitHub sends an automated email warning me that my workflow failed.
* **Crucially:** The pipeline instantly halts! It stops at the broken step and refuses to run any of the subsequent steps. This is exactly how pipelines prevent broken code from being deployed.

**How do you read the error?**
When you click into the failed run in the "Actions" tab, GitHub provides a sidebar with the jobs. You click on the failed job, and the logs automatically expand directly to the exact step that caused the crash. It shows the terminal output (the standard error or exit code), allowing you to pinpoint exactly what command broke so you can fix it locally and push again.
