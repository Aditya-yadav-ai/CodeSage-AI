# CodeSage AI — Personal Coding Tutor (VS Code Extension)

An elite AI coding tutor that doesn't just answer — it **teaches**. Powered by [OpenRouter](https://openrouter.ai).

Every response follows the **CodeSage Teaching Formula**:

1. **WHAT** — Summary of what the code does
2. **HOW** — Step-by-step execution
3. **WHY** — Design intent & reasoning
4. **IMPROVE** — Optimization suggestions
5. **EDGE CASES** — Pitfalls to watch for
6. **FOLLOW-UP** — A question to deepen learning

## Features

- 🎓 Expertise levels: Beginner / Intermediate / Expert
- ⚡ Quick actions: Explain, Debug, Improve, Summarize
- 🖱️ Right-click context menu integration
- ⌨️ `Ctrl+Shift+A` (or `Cmd+Shift+A`) to open chat
- 🌙 Modern dark-themed Webview UI with typing indicator
- 🔐 API key stored securely in VS Code settings
- 🧠 Auto-captures selected code, filename & language

## Setup

```bash
npm install
npm run compile
```

Then press **F5** in VS Code to launch the Extension Development Host.

### Configure your API key

1. Get a key at https://openrouter.ai/keys
2. Run command: **CodeSage: Set OpenRouter API Key**
   *(or set `codesage.apiKey` in Settings)*

### Supported Models

- `google/gemini-2.0-flash-001` (default)
- `x-ai/grok-2`
- `openai/gpt-4o-mini`
- `anthropic/claude-3.5-sonnet`

## Usage

- **Open chat:** `Ctrl+Shift+A`
- **Explain code:** Select code → Right-click → *CodeSage: Explain*
- **Debug:** Select code → Right-click → *CodeSage: Debug*
- **Improve:** Select code → Right-click → *CodeSage: Improve*

## License

MIT
