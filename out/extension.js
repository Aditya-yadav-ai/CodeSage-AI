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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const chatProvider_1 = require("./chatProvider");
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('codesage.openChat', () => {
        chatProvider_1.ChatPanel.createOrShow(context.extensionUri);
    }), vscode.commands.registerCommand('codesage.explain', async () => {
        const panel = chatProvider_1.ChatPanel.createOrShow(context.extensionUri);
        await panel.sendQuickAction('Explain');
    }), vscode.commands.registerCommand('codesage.debug', async () => {
        const panel = chatProvider_1.ChatPanel.createOrShow(context.extensionUri);
        await panel.sendQuickAction('Debug');
    }), vscode.commands.registerCommand('codesage.improve', async () => {
        const panel = chatProvider_1.ChatPanel.createOrShow(context.extensionUri);
        await panel.sendQuickAction('Improve');
    }), vscode.commands.registerCommand('codesage.setApiKey', async () => {
        const key = await vscode.window.showInputBox({
            prompt: 'Enter your OpenRouter API Key',
            password: true,
            ignoreFocusOut: true
        });
        if (key) {
            await vscode.workspace.getConfiguration('codesage').update('apiKey', key, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage('✅ CodeSage API key saved.');
        }
    }));
}
function deactivate() { }
//# sourceMappingURL=extension.js.map