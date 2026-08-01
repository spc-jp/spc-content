// ============================
// SPCコンシェルジュ チャットボット
// chat.js - 全ページ共通
// ============================

(function() {

  // CSSを動的に追加
  const style = document.createElement('style');
  style.textContent = `
    .float-buttons {
      position: fixed;
      bottom: 28px;
      right: 24px;
      z-index: 500;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .float-top {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #FFE566;
      color: #0d1b2e;
      border: none;
      font-size: 1.2rem;
      font-weight: 900;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      transition: all 0.3s;
      opacity: 0;
      transform: translateY(10px);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .float-top.visible { opacity: 1; transform: translateY(0); }
    .float-top:hover { background: #fff; transform: translateY(-3px); }

    .float-chat {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #1a2d4a;
      color: white;
      border: none;
      cursor: pointer;
      font-weight: 700;
      font-size: 0.75rem;
      padding: 10px 16px;
      border-radius: 40px;
      box-shadow: 0 4px 20px rgba(26,45,74,0.35);
      transition: transform 0.3s, box-shadow 0.3s;
      white-space: nowrap;
      font-family: 'Noto Sans JP', sans-serif;
    }

    .float-chat:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(26,45,74,0.45); }

    .float-line {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #06C755;
      color: white;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.75rem;
      padding: 10px 16px;
      border-radius: 40px;
      box-shadow: 0 4px 20px rgba(6,199,85,0.45);
      transition: transform 0.3s, box-shadow 0.3s;
      white-space: nowrap;
    }

    .float-line:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(6,199,85,0.55); }

    .chat-window {
      position: fixed;
      bottom: 140px;
      right: 24px;
      width: 380px;
      max-height: calc(100vh - 160px);
      background: white;
      border-radius: 20px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.18);
      z-index: 600;
      display: none;
      flex-direction: column;
      overflow: hidden;
    }

    @media (max-width: 768px) {
      .chat-window {
        width: calc(100vw - 32px);
        right: 16px;
        bottom: auto;
        top: 16px;
        max-height: calc(100vh - 160px);
      }
    }

    .chat-window.open { display: flex; }

    .chat-header {
      background: #1a2d4a;
      color: white;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .chat-header-icon {
      width: 40px;
      height: 40px;
      min-width: 40px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
      padding: 4px;
    }

    .chat-header-icon img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }
    .chat-header-title { font-weight: 700; font-size: 0.95rem; }
    .chat-header-sub { font-size: 0.7rem; opacity: 0.7; margin-top: 2px; }

    .chat-close {
      margin-left: auto;
      background: none;
      border: none;
      color: white;
      font-size: 1rem;
      cursor: pointer;
      opacity: 0.7;
      padding: 4px;
    }

    .chat-close:hover { opacity: 1; }

    .chat-body {
      padding: 16px;
      max-height: 360px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .chat-bubble {
      padding: 10px 14px;
      border-radius: 16px;
      font-size: 0.85rem;
      line-height: 1.6;
      max-width: 90%;
    }

    .chat-bubble.bot { background: #f0f4f8; color: #1a2d4a; border-bottom-left-radius: 4px; }
    .chat-bubble.user { background: #00b4c8; color: white; align-self: flex-end; border-bottom-left-radius: 16px; border-bottom-right-radius: 4px; }

    .chat-options { display: flex; flex-direction: column; gap: 6px; }

    .chat-option {
      background: white;
      border: 1px solid #e0e8f0;
      border-radius: 10px;
      padding: 10px 14px;
      font-size: 0.82rem;
      color: #1a2d4a;
      cursor: pointer;
      text-align: left;
      font-family: 'Noto Sans JP', sans-serif;
      font-weight: 700;
      transition: background 0.2s, border-color 0.2s;
      text-decoration: none;
      display: block;
    }

    .chat-option:hover { background: #e6f7fa; border-color: #00b4c8; }

    .chat-footer {
      padding: 12px 16px;
      font-size: 0.72rem;
      color: #999;
      border-top: 1px solid #f0f0f0;
      text-align: center;
    }

    .chat-footer a { color: #00b4c8; text-decoration: none; }
    .chat-footer a:hover { text-decoration: underline; }

    @media (max-width: 768px) {
      .chat-window { width: calc(100vw - 32px); right: 16px; bottom: 160px; }
      .float-buttons { bottom: 20px; right: 16px; }
    }
  `;
  document.head.appendChild(style);

  // お問い合わせページのURL（各ページから正しく飛ぶ）
  const contactUrl = document.location.pathname.includes('index') || document.location.pathname === '/' ? '#contact' : 'index.html#contact';

  // HTMLを挿入
  const html = `
    <div class="float-buttons" id="floatButtons">
      <button class="float-top" id="backToTop" aria-label="トップへ戻る">↑</button>
      <button class="float-chat" id="chatToggle">💬 チャットで相談する</button>
      <a href="https://lin.ee/s9t1ERI" class="float-line" target="_blank">🌱 LINEで相談</a>
    </div>

    <div class="chat-window" id="chatWindow">
      <div class="chat-header">
        <div class="chat-header-icon">
          <img src="https://www.smileplusctg.com/favicon.png" alt="SPC" onerror="this.parentElement.innerHTML='💼'">
        </div>
        <div>
          <div class="chat-header-title">SPCコンシェルジュ</div>
          <div class="chat-header-sub">Smile Plus Consulting</div>
        </div>
        <button class="chat-close" id="chatClose">✕</button>
      </div>
      <div class="chat-body" id="chatBody">
        <div class="chat-bubble bot">こんにちは！SPCコンシェルジュです。<br>ご用件を選んでください😊</div>
        <div class="chat-options" id="chatOptions">
          <button class="chat-option" onclick="spcChat.select(1)">1️⃣ AIって何から始めればいいの？</button>
          <button class="chat-option" onclick="spcChat.select(2)">2️⃣ Web・SNS・集客で困っている</button>
          <button class="chat-option" onclick="spcChat.select(3)">3️⃣ AI・DXのセミナー講師を探している</button>
          <button class="chat-option" onclick="spcChat.select(4)">4️⃣ まず話だけ聞いてみたい</button>
          <button class="chat-option" onclick="spcChat.select(5)">5️⃣ 使えるAIアプリを探している</button>
          <button class="chat-option" onclick="spcChat.select(6)">6️⃣ 自分のサイト、AI検索で見つかってる？</button>
        </div>
      </div>
      <div class="chat-footer">選択肢にない場合は<a href="${contactUrl}" id="chatContactLink">こちらから直接お問い合わせください</a></div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);

  // 返答データ
  const responses = {
    1: { user: '1️⃣ AIって何から始めればいいの？', bot: 'ChatGPTなどAIツールの活用方法をご支援しています！業務効率化・集客・SNS運用など幅広く対応しています。まずは無料Zoom相談でお気軽にご相談ください🌱', link: { text: '📅 無料Zoom相談を予約する', url: 'https://lin.ee/s9t1ERI', external: true }},
    2: { user: '2️⃣ Web・SNS・集客で困っている', bot: 'ホームページ制作・SNS運用・LINE活用・広告運用など、集客に関するお悩みを一緒に解決します🌱', link: { text: '📅 無料Zoom相談を予約する', url: 'https://lin.ee/s9t1ERI', external: true }},
    3: { user: '3️⃣ AI・DXのセミナー講師を探している', bot: 'AI活用セミナー・研修講師のご依頼を承っています。業種問わず対応可能です。オンライン・対面どちらもOKです✨', link: { text: '📩 お問い合わせフォームへ', url: contactUrl, external: false }},
    4: { user: '4️⃣ まず話だけ聞いてみたい', bot: '30分の無料Zoom相談を随時受付中です！LINEで希望日時をお送りください。話を聞くだけでも大歓迎です😊', link: { text: '🌱 LINEで予約する', url: 'https://lin.ee/s9t1ERI', external: true }},
    5: { user: '5️⃣ 使えるAIアプリを探している', bot: 'SPCが開発した中小企業向けAIアプリ60本以上のカタログです。無料お試し機能つきで、まず触ってから判断できます✨', link: { text: '🗂 みっけカタログを見てみる', url: 'https://mikke-catalog.pages.dev/', external: true }},
    6: { user: '6️⃣ 自分のサイト、AI検索で見つかってる？', bot: 'AI検索（ChatGPT・Perplexityなど）であなたのサイトが正しく認識されているか無料でチェックできます。まずは診断してみてください✨', link: { text: '🔍 AI検索対応チェックはこちら', url: 'https://spc-jp.github.io/aio-vision/', external: true }}
  };

  // チャット機能
  window.spcChat = {
    select: function(num) {
      const res = responses[num];
      const chatBody = document.getElementById('chatBody');
      document.getElementById('chatOptions').style.display = 'none';

      const userBubble = document.createElement('div');
      userBubble.className = 'chat-bubble user';
      userBubble.textContent = res.user;
      chatBody.appendChild(userBubble);

      setTimeout(() => {
        const botBubble = document.createElement('div');
        botBubble.className = 'chat-bubble bot';
        botBubble.innerHTML = res.bot;
        chatBody.appendChild(botBubble);

        const linkBtn = document.createElement('a');
        linkBtn.className = 'chat-option';
        linkBtn.style.textAlign = 'center';
        linkBtn.textContent = res.link.text;
        linkBtn.href = res.link.url;
        if (res.link.external) {
          linkBtn.target = '_blank';
        } else {
          linkBtn.addEventListener('click', () => document.getElementById('chatWindow').classList.remove('open'));
        }
        chatBody.appendChild(linkBtn);

        const resetBtn = document.createElement('button');
        resetBtn.className = 'chat-option';
        resetBtn.style.textAlign = 'center';
        resetBtn.style.color = '#999';
        resetBtn.style.fontWeight = 'normal';
        resetBtn.textContent = '🔄 最初に戻る';
        resetBtn.addEventListener('click', window.spcChat.reset);
        chatBody.appendChild(resetBtn);

        chatBody.scrollTop = chatBody.scrollHeight;
      }, 500);
    },

    reset: function() {
      const chatBody = document.getElementById('chatBody');
      chatBody.innerHTML = `
        <div class="chat-bubble bot">こんにちは！SPCコンシェルジュです。<br>ご用件を選んでください😊</div>
        <div class="chat-options" id="chatOptions">
          <button class="chat-option" onclick="spcChat.select(1)">1️⃣ AIって何から始めればいいの？</button>
          <button class="chat-option" onclick="spcChat.select(2)">2️⃣ Web・SNS・集客で困っている</button>
          <button class="chat-option" onclick="spcChat.select(3)">3️⃣ AI・DXのセミナー講師を探している</button>
          <button class="chat-option" onclick="spcChat.select(4)">4️⃣ まず話だけ聞いてみたい</button>
          <button class="chat-option" onclick="spcChat.select(5)">5️⃣ 使えるAIアプリを探している</button>
          <button class="chat-option" onclick="spcChat.select(6)">6️⃣ 自分のサイト、AI検索で見つかってる？</button>
        </div>`;
    }
  };

  // イベント設定
  document.getElementById('chatToggle').addEventListener('click', () => {
    document.getElementById('chatWindow').classList.toggle('open');
  });

  document.getElementById('chatClose').addEventListener('click', () => {
    document.getElementById('chatWindow').classList.remove('open');
  });

  // トップへ戻る
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
  });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

})();
