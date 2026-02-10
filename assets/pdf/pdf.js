function getData() {
    const raw = sessionStorage.getItem("wishes_pdf");
    return raw ? JSON.parse(raw) : [];
}

function render() {
    const wishes = getData();

    // Get current language from localStorage
    const lang = localStorage.getItem("wishLang") || "en";

    // Get current quote from sessionStorage
    const currentQuote = sessionStorage.getItem("current_quote");
    let quoteText = "«The future belongs to those who believe in the beauty of their dreams.»";
    let quoteAuthor = "Eleanor Roosevelt";

    if (currentQuote) {
        try {
            const quoteData = JSON.parse(currentQuote);
            quoteText = lang === "ru" ? "«" + quoteData.text + "»" : "«" + quoteData.text + "»";
            quoteAuthor = quoteData.author;
        } catch (e) {
            console.error("Error parsing quote data:", e);
        }
    }


    // Set title based on language
    document.getElementById("title").textContent =
        lang === "ru" ? "Мои желания" : "My current dreams";


    const list = document.getElementById("list");

    list.innerHTML = wishes.map((w, i) => `
        <li>
            <div class="number">${String(i + 1).padStart(2, '0')}.</div>
            <div class="text">${w}</div>
        </li>
    `).join('');
}

async function generatePDF() {
    render();

    await new Promise(r => setTimeout(r, 100));

    const element = document.body;

    const opt = {
        margin: 10,
        filename: 'wishes.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    await html2pdf().set(opt).from(element).save();

    sessionStorage.removeItem("wishes_pdf");
    sessionStorage.removeItem("current_quote");

    setTimeout(() => window.close(), 100);
}

window.addEventListener("load", generatePDF);