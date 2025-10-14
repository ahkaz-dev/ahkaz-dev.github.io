const helloT = document.getElementById('helloText');
const quoteEl = document.getElementById('quote');
const copyContainer = document.getElementById('copyContainer');
const copyBtn = document.getElementById('copyBtn');
const roseInput = document.getElementById('roseInput');
const langToggle = document.getElementById('langToggle');

const displayRoses = '🌹'.repeat(10);
const copyRoses = '🌹'.repeat(1001);
roseInput.value = displayRoses;

let currentLang = 'eng';

const texts = {
  ru: {
    hello: 'Подари цифровую любовь каждому!',
    loading: 'Загружаем цитату…',
    copy: '📋 Копировать',
    copied: '✅ Скопировано!',
    lang: 'ru',
    fail: '❌ Не удалось загрузить цитату',
    defaultQuote: '❤️ Любовь прекрасна!'
  },
  eng: {
    hello: 'Give digital love to everyone!',
    loading: 'Loading quote…',
    copy: '📋 Copy',
    copied: '✅ Copied!',
    lang: 'eng',
    fail: '❌ Failed to load quote',
    defaultQuote: '❤️ Love is beautiful!'
  }
};

async function loadQuote() {
  fadeText(quoteEl);
  quoteEl.textContent = texts[currentLang].loading;

  try {
    const response = await fetch('https://api.quotable.io/random?tags=love');
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    const quote = data?.content || texts[currentLang].defaultQuote;

    setTimeout(() => {
      quoteEl.textContent = quote;
      showText(quoteEl);
    }, 300);

  } catch (e) {
    console.warn('Quote load failed:', e);
    setTimeout(() => {
      quoteEl.textContent = texts[currentLang].defaultQuote;
      showText(quoteEl);
    }, 300);
  }
}

function fadeText(el) {
  el.classList.add('fade-out');
}

function showText(el) {
  el.classList.remove('fade-out');
  el.classList.add('visible');
}

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(copyRoses).then(() => {
    copyBtn.textContent = texts[currentLang].copied;
    setTimeout(() => copyBtn.textContent = texts[currentLang].copy, 1500);
  });
});

langToggle.addEventListener('click', () => {
  fadeText(quoteEl);
  fadeText(helloT);
  fadeText(copyBtn);
  fadeText(langToggle);

  setTimeout(() => {
    currentLang = currentLang === 'ru' ? 'eng' : 'ru';
    copyBtn.textContent = texts[currentLang].copy;
    langToggle.textContent = texts[currentLang].lang;
    helloT.textContent = texts[currentLang].hello;
    loadQuote();
    showText(copyBtn);
    showText(langToggle);
    showText(helloT);
  }, 300);
});

window.addEventListener('DOMContentLoaded', () => {
  helloT.textContent = texts.eng.hello;
  copyBtn.textContent = texts.eng.copy;
  langToggle.textContent = texts.eng.lang;

  setTimeout(() => {
    helloT.classList.add('visible');
    quoteEl.classList.add('visible');
    copyContainer.classList.add('visible');
  }, 100);

  loadQuote();
});