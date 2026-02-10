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
        const win = window.open();
        win.document.write("<pre>" + content + "</pre>");
        win.print();
        showNotification(t.pdfReady);
    }
}