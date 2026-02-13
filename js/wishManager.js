// ============================================================================
// Core Wish Management
// ============================================================================
function render() {
    elements.list.innerHTML = "";

    if (wishes.length === 0) {
        elements.emptyHint.classList.remove("hidden");
    } else {
        elements.emptyHint.classList.add("hidden");
    }

    if (wishes.length >= 5) {
        elements.saveBtn.classList.add("notify");
    } else {
        elements.saveBtn.classList.remove("notify");
    }

    wishes.forEach((w, i) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="number">${String(i + 1).padStart(2, '0')}.</div>
            <div class="text">${w}</div>
            <div class="icons">
                <span class="edit">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M2 14V11.1667L10.8 2.38333C10.9333 2.26111 11.0807 2.16667 11.242 2.1C11.4033 2.03333 11.5727 2 11.75 2C11.9273 2 12.0996 2.03333 12.2667 2.1C12.4338 2.16667 12.5782 2.26667 12.7 2.4L13.6167 3.33333C13.75 3.45556 13.8473 3.6 13.9087 3.76667C13.97 3.93333 14.0004 4.1 14 4.26667C14 4.44444 13.9696 4.614 13.9087 4.77533C13.8478 4.93667 13.7504 5.08378 13.6167 5.21667L4.83333 14H2ZM11.7333 5.2L12.6667 4.26667L11.7333 3.33333L10.8 4.26667L11.7333 5.2Z" fill="#8C8FA3"/>
                    </svg>
                </span>
                <span class="del">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M4.66663 14C4.29996 14 3.98618 13.8696 3.72529 13.6087C3.4644 13.3478 3.33374 13.0338 3.33329 12.6667V4H2.66663V2.66667H5.99996V2H9.99996V2.66667H13.3333V4H12.6666V12.6667C12.6666 13.0333 12.5362 13.3473 12.2753 13.6087C12.0144 13.87 11.7004 14.0004 11.3333 14H4.66663ZM5.99996 11.3333H7.33329V5.33333H5.99996V11.3333ZM8.66663 11.3333H9.99996V5.33333H8.66663V11.3333Z" fill="#8C8FA3"/>
                    </svg>
                </span>
            </div>`;

        li.querySelector(".del").onclick = () => {
            wishes.splice(i, 1);
            saveLocal();
            render();
        };

        li.querySelector(".edit").onclick = () => {
            showEditModal(w, i);
        };

        elements.list.appendChild(li);
    });
}

function showEditModal(wishText, index) {
    const t = i18n[lang].modal;

    const modal = document.createElement('div');
    modal.className = 'clearModal editModal';
    modal.innerHTML = `
        <div class="clearModal__card">
            <div class="clearModal__title">${t.editTitle}</div>
            <div class="clearModal__text">
                <label>${t.editLabel}</label>
                <input class="editInput" value="${wishText}" maxlength="200">
            </div>
            <div class="clearModal__buttons">
                <button class="clearModal__btn clearModal__btn--cancel">${t.editCancel}</button>
                <button class="clearModal__btn clearModal__btn--confirm">${t.editConfirm}</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('show'));

    const input = modal.querySelector('.editInput');
    input.focus();
    input.select();

    const cancelBtn = modal.querySelector('.clearModal__btn--cancel');
    const confirmBtn = modal.querySelector('.clearModal__btn--confirm');

    const closeModal = () => {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 250);
    };

    cancelBtn.onclick = closeModal;

    confirmBtn.onclick = () => {
        const newText = input.value.trim();
        if (newText) {
            wishes[index] = newText;
            saveLocal();
            render();
        }
        closeModal();
    };

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') confirmBtn.click();
    });

    modal.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escHandler);
        }
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

function addWish() {
    if (!elements.input.value.trim()) return;
    wishes.push(elements.input.value.trim());
    elements.input.value = "";
    saveLocal();
    render();
}