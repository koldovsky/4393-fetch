// Chat-specific client behaviors: auto-scroll messages and focus the input
export function initChat() {
  const focusMessageInput = () => {
    const input = document.querySelector('#chat-form [name="message"]');
    if (input) input.focus();
  };

  const scrollMessagesToBottom = (el) => {
    if (!el) return;
    // Delay slightly to allow images/media inside messages to layout
    setTimeout(() => {
      el.scrollTop = el.scrollHeight;
    }, 50);
  };

  // Ensure we scroll when messages are swapped in or updated by htmx
  document.body.addEventListener('htmx:afterSwap', (evt) => {
    if (evt.detail && evt.detail.target && evt.detail.target.id === 'chat-messages') {
      scrollMessagesToBottom(evt.detail.target);
      focusMessageInput();
    }
  });

  // When partials finish loading, focus the input if chat is present
  document.body.addEventListener('htmx:afterOnLoad', () => {
    const messages = document.getElementById('chat-messages');
    if (messages) {
      scrollMessagesToBottom(messages);
      focusMessageInput();
    }
  });
}

// Auto-run when module is imported (the main index.js will import this)
initChat();
