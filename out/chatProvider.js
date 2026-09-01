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
exports.ChatPanel = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const api_1 = require("./api");
class ChatPanel {
    static createOrShow(extensionUri) {
        const column = vscode.window.activeTextEditor?.viewColumn ?? vscode.ViewColumn.Beside;
        if (ChatPanel.current) {
            ChatPanel.current.panel.reveal(column);
            return ChatPanel.current;
        }
        const panel = vscode.window.createWebviewPanel(ChatPanel.viewType, 'CodeSage AI', column, {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
        });
        ChatPanel.current = new ChatPanel(panel, extensionUri);
        return ChatPanel.current;
    }
    constructor(panel, extensionUri) {
        this.history = [];
        this.disposables = [];
        this.panel = panel;
        this.extensionUri = extensionUri;
        this.panel.webview.html = this.getHtml();
        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
        this.panel.webview.onDidReceiveMessage(async (msg) => {
            if (msg.type === 'send') {
                await this.handleUserMessage(msg.text, msg.expertise, msg.action);
            }
            else if (msg.type === 'clear') {
                this.history = [];
            }
        }, null, this.disposables);
    }
    async sendQuickAction(action) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('Open a file and select code first.');
            return;
        }
        const selection = editor.document.getText(editor.selection);
        if (!selection.trim()) {
            vscode.window.showWarningMessage('Select some code first.');
            return;
        }
        const expertise = vscode.workspace.getConfiguration('codesage').get('expertiseLevel') || 'Intermediate';
        await this.handleUserMessage(`Please ${action.toLowerCase()} this code.`, expertise, action);
    }
    async handleUserMessage(text, expertise, action) {
        const editor = vscode.window.activeTextEditor;
        let userContent = text;
        if (editor && !editor.selection.isEmpty) {
            const code = editor.document.getText(editor.selection);
            const filename = path.basename(editor.document.fileName);
            const language = editor.document.languageId;
            userContent = `${text}\n\n${(0, api_1.buildContextBlock)(code, filename, language, action || 'Discuss')}`;
        }
        this.history.push({ role: 'user', content: userContent });
        this.panel.webview.postMessage({ type: 'userMessage', text });
        this.panel.webview.postMessage({ type: 'typing', on: true });
        try {
            const messages = [
                { role: 'system', content: (0, api_1.buildSystemPrompt)(expertise) },
                ...this.history
            ];
            const reply = await (0, api_1.callOpenRouter)(messages);
            this.history.push({ role: 'assistant', content: reply });
            this.panel.webview.postMessage({ type: 'assistantMessage', text: reply });
        }
        catch (err) {
            this.panel.webview.postMessage({ type: 'assistantMessage', text: `❌ **Error:** ${err.message}` });
        }
        finally {
            this.panel.webview.postMessage({ type: 'typing', on: false });
        }
    }
    getHtml() {
        const mediaPath = path.join(this.extensionUri.fsPath, 'media');
        const html = fs.readFileSync(path.join(mediaPath, 'chat.html'), 'utf-8');
        const cssUri = this.panel.webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media', 'chat.css'));
        const jsUri = this.panel.webview.asWebviewUri(vscode.Uri.joinPath(this.extensionUri, 'media', 'chat.js'));
        return html.replace('{{CSS}}', cssUri.toString()).replace('{{JS}}', jsUri.toString());
    }
    dispose() {
        ChatPanel.current = undefined;
        this.panel.dispose();
        while (this.disposables.length)
            this.disposables.pop()?.dispose();
    }
}
exports.ChatPanel = ChatPanel;
ChatPanel.viewType = 'codesageChat';
//# sourceMappingURL=chatProvider.js.map