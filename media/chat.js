const vscode = acquireVsCodeApi();
const messagesEl = document.getElementById('messages');
const form = document.getElementById('composer');
const input = document.getElementById('input');
const expertiseEl = document.getElementById('expertise');
const clearBtn = document.getElementById('clearBtn');

let typingEl = null;

// Minimal markdown -> HTML (headings, bold, italic, code, lists)
function md(text) {
  const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  // code blocks
  text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) =>
    `<pre><code class="lang-${lang || ''}">${escape(code)}</code></pre>`);
  // inline code
  text = text.replace(/`([^`\n]+)`/g, (_, c) => `<code>${escape(c)}</code>`);
  // headings
  text = text.replace(/^### (.*)$/gm, '<h3>$1</h3>');
  text = text.replace(/^## (.*)$/gm, '<h2>$1</h2>');
  // bold + italic
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  // bullets
  text = text.replace(/^(?:- |\* )(.*)$/gm, '<li>$1</li>');
  text = text.replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`);
  // paragraphs
  text = text.split(/\n{2,}/).map(p =>
    /^<(h\d|ul|pre|ol)/.test(p.trim()) ? p : `<p>${p.replace(/\n/g, '<br/>')}</p>`
  ).join('\n');
  return text;
}

function clearWelcome() {
  const w = messagesEl.querySelector('.welcome');
  if (w) w.remove();
}

function addMessage(role, text) {
  clearWelcome();
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  div.innerHTML = role === 'assistant' ? md(text) : escapeHtml(text);
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function showTyping(on) {
  if (typingEl) { typingEl.remove(); typingEl = null; }
  if (on) {
    typingEl = document.createElement('div');
    typingEl.className = 'typing';
    typingEl.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(typingEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  vscode.postMessage({ type: 'send', text, expertise: expertiseEl.value });
  input.value = '';
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    form.requestSubmit();
  }
});

document.querySelectorAll('.qa').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    vscode.postMessage({
      type: 'send',
      text: `Please ${action.toLowerCase()} the selected code.`,
      expertise: expertiseEl.value,
      action
    });
  });
});

clearBtn.addEventListener('click', () => {
  messagesEl.innerHTML = '<div class="welcome"><h2>Chat cleared 🧹</h2><p>Ask anything to start again.</p></div>';
  vscode.postMessage({ type: 'clear' });
});

window.addEventListener('message', (event) => {
  const msg = event.data;
  if (msg.type === 'userMessage') addMessage('user', msg.text);
  else if (msg.type === 'assistantMessage') addMessage('assistant', msg.text);
  else if (msg.type === 'typing') showTyping(msg.on);
});
