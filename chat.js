// ============================
// SPCコンシェルジュ チャットボット v2（3段階）
// chat.js - 全ページ共通
// ============================

(function() {

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
      max-height: calc(100vh - 200px);
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
        left: 16px;
        bottom: 140px;
        top: auto;
        max-height: calc(100vh - 200px);
      }
      .float-buttons { bottom: 20px; right: 16px; }
    }

    .chat-window.open { display: flex; }

    .chat-header {
      background: #1a2d4a;
      color: white;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
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

    .chat-header-icon img { width: 100%; height: 100%; object-fit: contain; display: block; }
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
      max-height: calc(100vh - 320px);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .chat-bubble {
      padding: 10px 14px;
      border-radius: 16px;
      font-size: 0.85rem;
      line-height: 1.7;
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
      width: 100%;
    }

    .chat-option:hover { background: #e6f7fa; border-color: #00b4c8; }

    .chat-footer {
      padding: 10px 16px;
      font-size: 0.72rem;
      color: #999;
      border-top: 1px solid #f0f0f0;
      text-align: center;
      flex-shrink: 0;
    }

    .chat-footer a { color: #00b4c8; text-decoration: none; }
    .chat-footer a:hover { text-decoration: underline; }
  `;
  document.head.appendChild(style);

  const contactUrl = document.location.pathname.includes('index') || document.location.pathname === '/' ? '#contact' : 'index.html#contact';

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
      <div class="chat-body" id="chatBody"></div>
      <div class="chat-footer">選択肢にない場合は<a href="${contactUrl}" id="chatContactLink">こちらから直接お問い合わせください</a></div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);

  // 3段階チャットデータ
  const stage1 = [
    { id: 1, text: '1️⃣ AIって何から始めればいいの？' },
    { id: 2, text: '2️⃣ Web・SNS・集客で困っている' },
    { id: 3, text: '3️⃣ AI・DXのセミナー講師を探している' },
    { id: 4, text: '4️⃣ まず話だけ聞いてみたい' },
    { id: 5, text: '5️⃣ 使えるAIアプリを探している' },
    { id: 6, text: '6️⃣ 自分のサイト、AI検索で見つかってる？' }
  ];

  const stage2 = {
    1: {
      question: 'どんな場面で活用したいですか？',
      options: [
        { id: '1-1', text: '📋 業務効率化に使いたい' },
        { id: '1-2', text: '📣 集客・SNSに活用したい' },
        { id: '1-3', text: '👥 社員・スタッフに教えたい' },
        { id: '1-4', text: '🔍 まず何ができるか知りたい' }
      ]
    },
    2: {
      question: 'どんな状況でお困りですか？',
      options: [
        { id: '2-1', text: '🏠 ホームページへの問い合わせが来ない' },
        { id: '2-2', text: '📱 SNSを始めたけど続かない' },
        { id: '2-3', text: '💸 広告を出しても反応が少ない' }
      ]
    },
    3: {
      question: 'どんな場でご活用ですか？',
      options: [
        { id: '3-1', text: '🏢 社内研修・勉強会に呼びたい' },
        { id: '3-2', text: '👥 顧客向けセミナーの講師が欲しい' },
        { id: '3-3', text: '🏛️ 商工会・協会のイベントに呼びたい' }
      ]
    },
    5: {
      question: 'どんな目的のアプリをお探しですか？',
      options: [
        { id: '5-1', text: '⚙️ 業務効率化のアプリが欲しい' },
        { id: '5-2', text: '📣 集客・SNS用のアプリが欲しい' },
        { id: '5-3', text: '⚖️ 士業・専門家向けのアプリが欲しい' }
      ]
    }
  };

  const stage3 = {
    '1-1': { bot: 'メール作成・議事録・資料作成などから始めるのが最短です。まず30分で現状を聞かせてください🌱', link: { text: '📅 無料Zoom相談を予約する', url: 'https://lin.ee/s9t1ERI', external: true }},
    '1-2': { bot: 'SNS投稿・広告文・ブログをAIで効率化できます。具体的な方法を一緒に考えましょう✨', link: { text: '📅 無料Zoom相談を予約する', url: 'https://lin.ee/s9t1ERI', external: true }},
    '1-3': { bot: 'ChatGPT研修は1回2時間から対応しています。業種に合わせた内容でご提案します✨', link: { text: '📩 詳細をお問い合わせ', url: contactUrl, external: false }},
    '1-4': { bot: 'まず30分話しましょう。何ができるか具体的にお見せします🌱', link: { text: '📅 無料Zoom相談を予約する', url: 'https://lin.ee/s9t1ERI', external: true }},
    '2-1': { bot: '見せ方と導線の改善で変わるケースが多いです。まずサイトを一緒に見てみましょう🌱', link: { text: '📅 無料Zoom相談を予約する', url: 'https://lin.ee/s9t1ERI', external: true }},
    '2-2': { bot: '続けられる仕組みを一緒に作ります。投稿ネタ出しもAIで解決できますよ🌱', link: { text: '📅 無料Zoom相談を予約する', url: 'https://lin.ee/s9t1ERI', external: true }},
    '2-3': { bot: 'ターゲット設定と文言が鍵です。現状の広告を一緒に見直しましょう🌱', link: { text: '📅 無料Zoom相談を予約する', url: 'https://lin.ee/s9t1ERI', external: true }},
    '3-1': { bot: 'ChatGPTの基礎から実践まで、御社の業種に合わせてカスタマイズします✨', link: { text: '📩 詳細をお問い合わせ', url: contactUrl, external: false }},
    '3-2': { bot: '顧客の業種・レベルに合わせた内容でご提案します。まずご要件をお聞かせください✨', link: { text: '📩 詳細をお問い合わせ', url: contactUrl, external: false }},
    '3-3': { bot: '多数の登壇実績があります。日程・テーマ・参加者規模などをお聞かせください✨', link: { text: '📩 詳細をお問い合わせ', url: contactUrl, external: false }},
    '5-1': { bot: '業務効率化アプリが60本以上揃っています。まずカタログをご覧ください✨', link: { text: '🗂 みっけカタログを見てみる', url: 'https://mikke-catalog.pages.dev/', external: true }},
    '5-2': { bot: 'SNS投稿・広告文生成など集客系アプリが充実しています✨', link: { text: '🗂 みっけカタログを見てみる', url: 'https://mikke-catalog.pages.dev/', external: true }},
    '5-3': { bot: '税理士・弁護士向けの専門アプリも揃っています✨', link: { text: '🗂 みっけカタログを見てみる', url: 'https://mikke-catalog.pages.dev/', external: true }}
  };

  // 直接回答（2段階目なし）
  const directResponse = {
    4: { bot: '30分の無料Zoom相談を随時受付中です！LINEで希望日時をお送りください。話を聞くだけでも大歓迎です😊', link: { text: '🌱 LINEで予約する', url: 'https://lin.ee/s9t1ERI', external: true }},
    6: { bot: 'AI検索（ChatGPT・Perplexityなど）であなたのサイトが正しく認識されているか無料でチェックできます✨', link: { text: '🔍 AI検索対応チェックはこちら', url: 'https://spc-jp.github.io/aio-vision/', external: true }}
  };

  function addBubble(text, type) {
    const chatBody = document.getElementById('chatBody');
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${type}`;
    bubble.innerHTML = text;
    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
    return bubble;
  }

  function addOptions(options, onclick) {
    const chatBody = document.getElementById('chatBody');
    const wrap = document.createElement('div');
    wrap.className = 'chat-options';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'chat-option';
      btn.textContent = opt.text;
      btn.addEventListener('click', () => onclick(opt));
      wrap.appendChild(btn);
    });
    chatBody.appendChild(wrap);
    chatBody.scrollTop = chatBody.scrollHeight;
    return wrap;
  }

  function addFinalResponse(res) {
    const chatBody = document.getElementById('chatBody');
    setTimeout(() => {
      addBubble(res.bot, 'bot');

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
  }

  window.spcChat = {
    reset: function() {
      const chatBody = document.getElementById('chatBody');
      chatBody.innerHTML = '';
      addBubble('こんにちは！SPCコンシェルジュです。<br>ご用件を選んでください😊', 'bot');
      addOptions(stage1, (opt) => window.spcChat.selectStage1(opt.id));
    },

    selectStage1: function(id) {
      document.querySelector('.chat-options').style.display = 'none';
      addBubble(stage1.find(o => o.id === id).text, 'user');

      setTimeout(() => {
        if (directResponse[id]) {
          addFinalResponse(directResponse[id]);
        } else if (stage2[id]) {
          addBubble(stage2[id].question, 'bot');
          addOptions(stage2[id].options, (opt) => window.spcChat.selectStage2(opt));
        }
      }, 400);
    },

    selectStage2: function(opt) {
      document.querySelectorAll('.chat-options').forEach(el => el.style.display = 'none');
      addBubble(opt.text, 'user');
      addFinalResponse(stage3[opt.id]);
    }
  };

  // 初期表示
  window.spcChat.reset();

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
