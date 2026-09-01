"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.callOpenRouter = callOpenRouter;
exports.buildSystemPrompt = buildSystemPrompt;
exports.buildContextBlock = buildContextBlock;
const vscode = __importStar(require("vscode"));
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
async function callOpenRouter(messages) {
    const config = vscode.workspace.getConfiguration('codesage');
    const apiKey = config.get('apiKey');
    const model = config.get('model') || 'google/gemini-2.0-flash-001';
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
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? '(empty response)';
}
function buildSystemPrompt(expertise) {
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
function buildContextBlock(code, filename, language, intent) {
    return `**Intent:** ${intent}
**File:** ${filename}
**Language:** ${language}

\`\`\`${language}
${code}
\`\`\``;
}
//# sourceMappingURL=api.js.map