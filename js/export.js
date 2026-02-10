// ============================================================================
// Save/Export Functionality
// ============================================================================
function exportFile(type) {
    const count = wishes.length;
    const t = i18n[lang].export;

    if (count < 5) {
        showNotification(t.minWishes.replace("{count}", count), true);
        return;
    }

    if (count > 100) {
        showNotification(t.maxWishes.replace("{count}", count), true);
        return;
    }

    const content = wishes.map((w, i) => `${i + 1}. ${w}`).join("\n");

    if (type === "txt") {
        download("wishes.txt", content);
        showNotification(t.txtSaved);
    }

    if (type === "md") {
        const md = "# My current dreams\n\n" + wishes.map(w => "- " + w).join("\n");
        download("wishes.md", md);
        showNotification(t.mdSaved);
    }

if (type === "pdf") {
    // Store wishes for PDF
    sessionStorage.setItem("wishes_pdf", JSON.stringify(wishes));

    // Store current quote for PDF
    const currentQuotes = i18n[lang].quotes;
    const randomQuote = currentQuotes[Math.floor(Math.random() * currentQuotes.length)];
    sessionStorage.setItem("current_quote", JSON.stringify(randomQuote));

    window.open("/assets/pdf/pdf-template.html", "_blank");
}


}