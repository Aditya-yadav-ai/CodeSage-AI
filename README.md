# CodeSage AI

> An AI-powered coding assistant built as a Visual Studio Code extension to help developers understand, analyze, and work with their code more effectively.

## Overview

**CodeSage AI** is an AI-powered VS Code extension designed to act as an intelligent coding companion inside the developer's workflow.

Instead of switching between a code editor and external AI tools, CodeSage AI brings AI-powered assistance directly into VS Code. It can analyze code, explain programming concepts, answer questions about the codebase, and provide contextual assistance while developing.

## Features

* **AI Code Assistant** — Ask questions about your code directly inside VS Code.
* **Code Explanation** — Understand complex or unfamiliar code with AI-generated explanations.
* **Context-Aware Assistance** — Work with the selected code and project context.
* **Interactive Chat Interface** — Communicate with the AI through an integrated chat interface.
* **Developer-Focused Workflow** — Get AI assistance without leaving VS Code.
* **TypeScript-Based Extension** — Built using the VS Code Extension API and TypeScript.

## Tech Stack

* **TypeScript**
* **Node.js**
* **VS Code Extension API**
* **HTML / CSS / JavaScript**
* **AI / LLM API**
* **npm**

## Project Structure

```text
CodeSage-AI/
│
├── media/
│   ├── chat.html
│   ├── chat.css
│   └── chat.js
│
├── src/
│   ├── api.ts
│   ├── chatProvider.ts
│   └── extension.ts
│
├── out/
│   ├── api.js
│   ├── chatProvider.js
│   └── extension.js
│
├── package.json
├── package-lock.json
├── tsconfig.json
├── .vscodeignore
└── README.md
```

## How It Works

The extension connects the VS Code environment with an AI model through an API.

```text
Developer
    │
    ▼
VS Code
    │
    ▼
CodeSage AI Extension
    │
    ├── Code / Project Context
    │
    ▼
AI / LLM API
    │
    ▼
AI Response
    │
    ▼
Integrated Chat Interface
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Aditya-yadav-ai/CodeSage-AI.git
```

### 2. Open the project

```bash
cd CodeSage-AI
```

Open the project in VS Code:

```bash
code .
```

### 3. Install dependencies

```bash
npm install
```

### 4. Compile the extension

```bash
npm run compile
```

### 5. Run the extension

Open the project in VS Code and press:

```text
F5
```

This launches a new **Extension Development Host** window where CodeSage AI can be tested.

## Usage

1. Open CodeSage AI in the Extension Development Host.
2. Open a source-code file.
3. Use the CodeSage AI interface.
4. Ask questions about your code.
5. Review the AI-generated explanation or response.

Example questions:

```text
Explain this function.

What does this class do?

Find potential problems in this code.

Explain this code step by step.

How can I improve this implementation?
```

## Future Improvements

* Multi-file project understanding
* Code summarization
* Automated code review
* Bug detection and debugging assistance
* Improved context retrieval
* Support for multiple AI models
* Conversation history
* Code generation and refactoring
* Developer productivity analytics

## Why CodeSage AI?

Traditional AI coding assistants often focus primarily on generating code.

CodeSage AI is designed with an additional focus on **understanding code**.

The goal is to make AI behave more like an interactive programming tutor—helping developers understand *why* code works, not just generating the code itself.

## Author

**Aditya Yadav**

GitHub: https://github.com/Aditya-yadav-ai

---

## License

This project is developed for educational and project purposes.
