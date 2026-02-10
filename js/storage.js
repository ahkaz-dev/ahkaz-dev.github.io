// ============================================================================
// Data & Storage
// ============================================================================
let lang = localStorage.getItem("wishLang") || "en";
let wishes = JSON.parse(localStorage.getItem("wish100")) || [];
let about = false;

function saveLocal() {
    localStorage.setItem("wish100", JSON.stringify(wishes));
}