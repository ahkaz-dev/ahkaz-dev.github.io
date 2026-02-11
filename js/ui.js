// ============================================================================
// UI Helpers
// ============================================================================
function showNotification(message, isError = false) {
    const oldNotify = document.querySelector('.notification');
    if (oldNotify) oldNotify.remove();

    const notify = document.createElement('div');
    notify.className = `notification ${isError ? 'error' : ''}`;
    notify.innerHTML = message;
    notify.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${isError ? '#ff6b6b' : '#7b7cff'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-family: inherit;
        font-size: 14px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;

    document.body.appendChild(notify);

    requestAnimationFrame(() => {
        notify.style.opacity = '1';
        notify.style.transform = 'translateX(0)';
    });

    setTimeout(() => {
        notify.style.opacity = '0';
        notify.style.transform = 'translateX(100%)';
        setTimeout(() => notify.remove(), 300);
    }, 3000);
}

function download(filename, content) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

function renderAboutPage() {
    const t = i18n[lang].about;

    document.getElementById("aboutTitle").textContent = t.title;
    document.getElementById("aboutContent").innerHTML = `
        <div class='about-div-c' >
            <a class='about-div-c-link' href="${t.linkedinLink}" target="_blank" >
                <span>🎨</span>
                <span>UX/UI Design</span>
            </a>
            <a class='about-div-c-link' href="${t.githubLink}" target="_blank" ">
                <span class='about-div-c-span'>💻</span>
                <span>Frontend Dev</span>
            </a>
        </div>
        <p class='about-sm-0'>${t.p3}</p>
        <p>${t.p1}</p>
        <p>${t.p2}</p>
        <p>${t.p4}</p>
        <p>${t.p5}</p>
        <p class='about-sm-1'>(${t.idea})</p>
    `;
}

function setRandomQuote() {
    const currentQuotes = i18n[lang].quotes;
    const randomQuote = currentQuotes[Math.floor(Math.random() * currentQuotes.length)];

    document.getElementById("quoteText").textContent = "«" + randomQuote.text + "»";
    document.getElementById("quoteAuthor").textContent = randomQuote.author;
}

// Function to initialize the app (called after onboarding)
function initApp() {
    render();
    applyLang();
    setRandomQuote();
}

function showClearConfirm() {
    if (wishes.length === 0) {
        showNotification(i18n[lang].modal.noWishes, true);
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'clearModal';
    const t = i18n[lang].modal;
    modal.innerHTML = `
        <div class="clearModal__card">
            <div class="clearModal__title">${t.title}</div>
            <div class="clearModal__text">${t.text}</div>
            <div class="clearModal__buttons">
                <button class="clearModal__btn clearModal__btn--cancel">${t.cancel}</button>
                <button class="clearModal__btn clearModal__btn--confirm">${t.confirm}</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    requestAnimationFrame(() => {
        modal.classList.add('show');
    });

    const cancelBtn = modal.querySelector('.clearModal__btn--cancel');
    const confirmBtn = modal.querySelector('.clearModal__btn--confirm');

    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 250);
    };

    cancelBtn.onclick = closeModal;

    confirmBtn.onclick = () => {
        wishes = [];
        saveLocal();
        render();
        closeModal();
        const message = typeof key === 'string' ? key : i18n[lang][key] || key;
    };

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    });
}