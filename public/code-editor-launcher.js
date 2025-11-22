// Immediately-invoked function to avoid polluting page namespace
(function () {
    // --- Styles for launcher and modal ---
    const style = document.createElement('style');
    style.innerHTML = `
    .ce-launcher-btn {
      position: fixed;
      bottom: 28px;
      left: 28px;
      z-index: 2147483000;
      background: linear-gradient(135deg, #191b20 60%, #32343d 100%);
      width: 58px;
      height: 58px;
      border-radius: 50%;
      box-shadow: 0 3px 18px #000a, 0 0.5px 3px #2020;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: none;
      transition: box-shadow 0.17s, transform 0.15s, background 0.15s;
    }
    .ce-launcher-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 8px 32px #0008;
      background: linear-gradient(128deg, #23232b 70%, #3b3d46 100%);
    }
    .ce-launcher-btn svg {
      width: 33px;
      height: 33px;
      color: #fff;
      display: block;
    }
    .ce-modal-bg {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(24,24,32,0.67);
      z-index: 2147483200;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ce-modal {
      background: none;
      border: none;
      border-radius: 14px;
      padding: 0;
      max-width: 99vw;
      max-height: 96vh;
      box-shadow: 0 6px 48px #2a236d42, 0 1.5px 8px #0004;
      position: relative;
      display: flex;
      flex-direction: column;
    }
    .ce-modal-close {
      position: absolute;
      right: 12px; top: 9px;
      color: #fff;
      background: #283985bb;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      width: 34px;
      height: 34px;
      font-size: 1.9em;
      z-index: 9;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: filter .15s;
    }
    .ce-modal-close:hover { filter: brightness(1.18); background: #2226; }
    .ce-modal-iframe {
      width: 620px;
      height: 520px;
      border: none;
      border-radius: 10px;
      background: #232323;
      display: block;
      margin: 0;
      box-shadow: 0 0 24px #0002;
      animation: ce-fadein .42s cubic-bezier(.38,.09,.19,1.1);
    }
    @media (max-width: 700px) {
      .ce-modal-iframe { width: 97vw; height: 89vh; }
    }
    @keyframes ce-fadein {
      from {opacity:0; transform: scale(1.08);}
      to {opacity:1; transform: scale(1);}
    }
    `;
    document.head.appendChild(style);
  
    // --- Create launcher button ---
    const launcher = document.createElement('button');
    launcher.className = 'ce-launcher-btn';
    launcher.innerHTML = `
      <svg viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="19" cy="19" r="18" stroke="#fff7" stroke-width="2"/>
        <path d="M13.2 21.7l-2.6-2.7 2.6-2.7M24.8 21.7l2.6-2.7-2.6-2.7M16.5 25.3l5-12.6" stroke="white" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    document.body.appendChild(launcher);
  
    // --- Modal creation ---
    let modal, overlay;
    function openEditor() {
      // Prevent multiple modals
      if (document.querySelector('.ce-modal-bg')) return;
      overlay = document.createElement('div');
      overlay.className = 'ce-modal-bg';
      overlay.addEventListener('click', closeModal);
  
      modal = document.createElement('div');
      modal.className = 'ce-modal';
      modal.addEventListener('click', e => e.stopPropagation());
  
      // x-close button
      const closeBtn = document.createElement('button');
      closeBtn.className = 'ce-modal-close';
      closeBtn.innerHTML = '&times;';
      closeBtn.title = 'Close code editor';
      closeBtn.onclick = closeModal;
      modal.appendChild(closeBtn);
  
      // iframe
      const iframe = document.createElement('iframe');
      iframe.className = 'ce-modal-iframe';
      iframe.src = 'code-editor.html'; // use your actual path if needed
      iframe.allow = 'clipboard-write; clipboard-read;';
      modal.appendChild(iframe);
  
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
      // Prevent scrolling
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      overlay = null;
      // Restore scrolling
      document.body.style.overflow = '';
    }
    launcher.onclick = openEditor;
  })();
  