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
        <p>${t.p1}</p>
        <p>${t.p2}</p>
        <p>${t.p3}</p>
        <h3>${t.authors}</h3>
        <p>${t.authorName}</p>
        <p>${t.github}: <a href="${t.githubLink}" target="_blank">${t.github}</a></p>
    `;
}

function setRandomQuote() {
    const currentQuotes = i18n[lang].quotes;
    const randomQuote = currentQuotes[Math.floor(Math.random() * currentQuotes.length)];

    document.getElementById("quoteText").textContent = "«" + randomQuote.text + "»";
    document.getElementById("quoteAuthor").textContent = randomQuote.author;
}

// Onboarding translations
const onboardingTranslations = {
    en: {
        slides: [
            {
                title: "Welcome!",
                texts: [
                    "This is your personal wish notebook.",
                    "Here you can save and track your dreams."
                ]
            },
            {
                title: "How it works",
                texts: [
                    "1. Enter your wish in the input field",
                    "2. Click the '+' button or press Enter",
                    "3. Your wish will appear in the list"
                ]
            },
            {
                title: "Additional features",
                texts: [
                    "You can edit and delete wishes",
                    "Export the list to PDF, TXT or MD",
                    "Change the interface language"
                ]
            },
            {
                title: "Ready to start?",
                texts: [
                    "We're waiting for your wishes!",
                    "Start writing down your dreams right now."
                ]
            }
        ],
        buttons: {
            next: "Next",
            start: "Start!",
            skip: "Skip",
            back: "Back"
        }
    },
    ru: {
        slides: [
            {
                title: "Добро пожаловать!",
                texts: [
                    "Это ваша личная записная книжка желаний.",
                    "Здесь вы можете сохранять и отслеживать свои мечты."
                ]
            },
            {
                title: "Как это работает",
                texts: [
                    "1. Введите ваше желание в поле ввода",
                    "2. Нажмите кнопку '+' или Enter",
                    "3. Ваше желание появится в списке"
                ]
            },
            {
                title: "Дополнительные функции",
                texts: [
                    "Вы можете редактировать, удалять желания",
                    "Экспортировать список в PDF, TXT или MD",
                    "Менять язык интерфейса"
                ]
            },
            {
                title: "Готовы начать?",
                texts: [
                    "Мы ждем ваши желания!",
                    "Начните записывать свои мечты прямо сейчас."
                ]
            }
        ],
        buttons: {
            next: "Далее",
            start: "Начать!",
            skip: "Пропустить",
            back: "Назад"
        }
    }
};

function showOnboarding() {
    // Check if onboarding was already shown
    if (localStorage.getItem("onboardingShown")) {
        return;
    }

    const onboarding = document.getElementById("onboarding");
    const slides = document.querySelectorAll(".onboarding-slide");
    const dots = document.querySelectorAll(".onboarding-dots .dot");
    const nextBtn = document.getElementById("onboarding-next");
    const skipBtn = document.getElementById("onboarding-skip");
    const backBtn = document.getElementById("onboarding-back");
    const langTexts = document.querySelectorAll(".lang-text");

    let currentSlide = 0;
    let currentLang = "en"; // Default to English

    // Set initial language
    langTexts.forEach(text => {
        text.classList.toggle("active", text.dataset.lang === currentLang);
    });

    function updateLanguage() {
        const translations = onboardingTranslations[currentLang];

        // Update slide content
        slides.forEach((slide, index) => {
            const slideData = translations.slides[index];
            slide.querySelector(".slide-title").textContent = slideData.title;

            const textElements = slide.querySelectorAll(".slide-text");
            textElements.forEach((textEl, textIndex) => {
                if (slideData.texts[textIndex]) {
                    textEl.textContent = slideData.texts[textIndex];
                }
            });
        });

        // Update buttons
        nextBtn.textContent = currentSlide === slides.length - 1
            ? translations.buttons.start
            : translations.buttons.next;
        skipBtn.textContent = translations.buttons.skip;
        backBtn.textContent = translations.buttons.back;
    }

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });

        // Show/hide back button
        backBtn.style.display = index === 0 ? "none" : "inline-block";

        // Update button text based on current slide and language
        const translations = onboardingTranslations[currentLang];
        nextBtn.textContent = index === slides.length - 1
            ? translations.buttons.start
            : translations.buttons.next;
    }

    function nextSlide() {
        currentSlide++;
        if (currentSlide >= slides.length) {
            endOnboarding();
            return;
        }
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide--;
        showSlide(currentSlide);
    }

    function goToSlide(index) {
        currentSlide = index;
        showSlide(currentSlide);
    }

    function switchLanguage(lang) {
        currentLang = lang;

        // Update language texts
        langTexts.forEach(text => {
            text.classList.toggle("active", text.dataset.lang === lang);
        });

        // Update content
        updateLanguage();

        // Save language preference for main app
        localStorage.setItem("wishLang", lang);
    }

    function endOnboarding() {
        onboarding.classList.remove("active");
        localStorage.setItem("onboardingShown", "true");

        // Trigger the main app initialization with the selected language
        render();
        applyLang();
        setRandomQuote();
        renderAboutPage();
    }

    // Event listeners
    nextBtn.addEventListener("click", nextSlide);
    skipBtn.addEventListener("click", endOnboarding);
    backBtn.addEventListener("click", prevSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => goToSlide(index));
    });

    // Language toggle - now using text spans
    langTexts.forEach(text => {
        text.addEventListener("click", () => {
            switchLanguage(text.dataset.lang);
        });
    });

    // Initialize with English
    updateLanguage();

    // Show onboarding
    onboarding.classList.add("active");
    showSlide(currentSlide);
}

// Function to show onboarding again
function showOnboardingAgain() {
    // Remove the "shown" flag
    localStorage.removeItem("onboardingShown");

    // Get all the elements we need
    const onboarding = document.getElementById("onboarding");
    const slides = document.querySelectorAll(".onboarding-slide");
    const dots = document.querySelectorAll(".onboarding-dots .dot");
    const nextBtn = document.getElementById("onboarding-next");
    const skipBtn = document.getElementById("onboarding-skip");
    const backBtn = document.getElementById("onboarding-back");
    const langTexts = document.querySelectorAll(".lang-text");

    let currentSlide = 0;
    let currentLang = localStorage.getItem("wishLang") || "en";

    // Set initial language
    langTexts.forEach(text => {
        text.classList.toggle("active", text.dataset.lang === currentLang);
    });

    function updateLanguage() {
        const translations = onboardingTranslations[currentLang];

        // Update slide content
        slides.forEach((slide, index) => {
            const slideData = translations.slides[index];
            slide.querySelector(".slide-title").textContent = slideData.title;

            const textElements = slide.querySelectorAll(".slide-text");
            textElements.forEach((textEl, textIndex) => {
                if (slideData.texts[textIndex]) {
                    textEl.textContent = slideData.texts[textIndex];
                }
            });
        });

        // Update buttons
        nextBtn.textContent = currentSlide === slides.length - 1
            ? translations.buttons.start
            : translations.buttons.next;
        skipBtn.textContent = translations.buttons.skip;
        backBtn.textContent = translations.buttons.back;
    }

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });

        // Show/hide back button
        backBtn.style.display = index === 0 ? "none" : "inline-block";

        // Update button text based on current slide and language
        const translations = onboardingTranslations[currentLang];
        nextBtn.textContent = index === slides.length - 1
            ? translations.buttons.start
            : translations.buttons.next;
    }

    function nextSlide() {
        currentSlide++;
        if (currentSlide >= slides.length) {
            endOnboarding();
            return;
        }
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide--;
        showSlide(currentSlide);
    }

    function goToSlide(index) {
        currentSlide = index;
        showSlide(currentSlide);
    }

    function switchLanguage(lang) {
        currentLang = lang;

        // Update language texts
        langTexts.forEach(text => {
            text.classList.toggle("active", text.dataset.lang === lang);
        });

        // Update content
        updateLanguage();

        // Save language preference for main app
        localStorage.setItem("wishLang", lang);
    }

    function endOnboarding() {
        onboarding.classList.remove("active");
        localStorage.setItem("onboardingShown", "true");

        // Don't re-initialize the app since it's already running
    }

    // Set up event listeners
    nextBtn.onclick = nextSlide;
    skipBtn.onclick = endOnboarding;
    backBtn.onclick = prevSlide;

    dots.forEach((dot, index) => {
        dot.onclick = () => goToSlide(index);
    });

    // Language toggle
    langTexts.forEach(text => {
        text.onclick = () => {
            switchLanguage(text.dataset.lang);
        };
    });

    // Initialize and show
    updateLanguage();
    onboarding.classList.add("active");
    showSlide(currentSlide);
}

// Function to initialize the app (called after onboarding)
function initApp() {
    render();
    applyLang();
    setRandomQuote();
    renderAboutPage();
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