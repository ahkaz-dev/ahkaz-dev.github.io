// ============================================================================
// Main Application Logic
// ============================================================================

// ============================================================================
// Language Switching
// ============================================================================
function applyLang() {
    const t = i18n[lang];
    const langElements = document.querySelectorAll(".langFade");

    langElements.forEach(el => el.classList.add("hide"));

    setTimeout(() => {
        elements.lang.textContent = t.lang;
        elements.clear.textContent = t.clear;
        document.getElementById("title").textContent = t.title;
        elements.input.placeholder = t.placeholder;
        elements.saveBtn.textContent = t.save;
        elements.emptyHint.innerHTML = t.emptyHint.replace("\\n", "<br>");

        if (about) {
            elements.switchLink.textContent = t.mywishes;
        } else {
            elements.switchLink.textContent = t.aboutBtn;
        }
        setRandomQuote();
        renderAboutPage();
        langElements.forEach(el => el.classList.remove("hide"));
    }, 80);
}

// ============================================================================
// Page Switching
// ============================================================================
elements.switchLink.onclick = () => {
    about = !about;

    if (about) {
        elements.wishesPage.classList.remove("active");
        elements.aboutPage.classList.add("active");
        elements.switchLink.textContent = i18n[lang].mywishes;
    } else {
        elements.aboutPage.classList.remove("active");
        elements.wishesPage.classList.add("active");
        elements.switchLink.textContent = i18n[lang].aboutBtn;
    }
};

// ============================================================================
// Event Listeners & Initialization
// ============================================================================
elements.add.onclick = addWish;
elements.input.addEventListener("keypress", e => {
    if (e.key === "Enter") addWish();
});

elements.clear.onclick = () => {
    showClearConfirm();
};

elements.lang.onclick = () => {
    lang = lang === "en" ? "ru" : "en";
    localStorage.setItem("wishLang", lang);
    applyLang();
};

elements.saveBtn.onclick = (e) => {
    e.stopPropagation();
    elements.saveWrapper.classList.toggle("open");
};

document.addEventListener("click", () => {
    elements.saveWrapper.classList.remove("open");
});

elements.saveMenu.querySelectorAll("div").forEach(option => {
    option.onclick = () => {
        const type = option.dataset.type;
        exportFile(type);
        elements.saveWrapper.classList.remove("open");
    };
});

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", function() {
    // Check if onboarding was already shown
    if (!localStorage.getItem("onboardingShown")) {
        // Show onboarding first time
        showOnboarding();
    } else {
        // Initialize app directly on subsequent visits
        render();
        applyLang();
        setRandomQuote();
        renderAboutPage();
    }

    // Add event listener for "Show onboarding again" link using event delegation
    document.body.addEventListener("click", function(e) {
        if (e.target && e.target.id === "show-onboarding") {
            showOnboardingAgain();
        }
    });
});
