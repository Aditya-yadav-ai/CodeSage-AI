import * as vscode from 'vscode';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function callOpenRouter(messages: ChatMessage[]): Promise<string> {
  const config = vscode.workspace.getConfiguration('codesage');
  const apiKey = config.get<string>('apiKey');
  const model = config.get<string>('model') || 'google/gemini-2.0-flash-001';

  if (!apiKey) {
    throw new Error('OpenRouter API key not set. Run "CodeSage: Set OpenRouter API Key".');
  }

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/codesage-ai',
      'X-Title': 'CodeSage AI'
    },
    body: JSON.stringify({ model, messages, temperature: 0.7 })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${text}`);
  }

  const data: any = await res.json();
  return data.choices?.[0]?.message?.content ?? '(empty response)';
}

export function buildSystemPrompt(expertise: string): string {
  return `You are CodeSage AI — an elite personal coding tutor, not a chatbot.

Audience expertise level: ${expertise}.
Adapt vocabulary, depth, and analogies to match this level.

EVERY answer MUST follow this exact teaching formula using markdown headings:

## 🎯 WHAT
A crisp summary of what the code/concept does.

## ⚙️ HOW
A step-by-step execution walkthrough.

## 🧠 WHY
The design intent — why it's written this way, trade-offs.

## 🚀 IMPROVE
Concrete optimization or refactoring suggestions (with code).

## ⚠️ EDGE CASES
Pitfalls, failure modes, and inputs that break it.

## ❓ FOLLOW-UP
End with ONE thoughtful question that pushes the learner deeper.

Rules:
- Be precise, never hand-wavy.
- Use code blocks with language tags.
- Never skip a section. If a section truly doesn't apply, write "N/A — <brief reason>".`;
}

export function buildContextBlock(
  code: string,
  filename: string,
  language: string,
  intent: string
): string {
  return `**Intent:** ${intent}
**File:** ${filename}
**Language:** ${language}

\`\`\`${language}
${code}
\`\`\``;
}
