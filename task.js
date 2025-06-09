document.addEventListener('DOMContentLoaded', () => {
  const notesContainer = document.getElementById('notes');
  const modal = document.querySelector('.modal');
  const modalText = document.getElementById('modal-text');
  let draggedNote = null;
  let touchOffset = { x: 0, y: 0 };

  function savePinnedNotes() {
    const pinned = [...document.querySelectorAll('.note.pinned')].map(note =>
      note.dataset.id
    );
    localStorage.setItem('pinnedNotes', JSON.stringify(pinned));
  }

  function saveNoteOrder() {
    const order = [...notesContainer.querySelectorAll('.note')]
      .map(note => note.dataset.id)
      .filter(id => id && id !== 'null' && id !== 'undefined');
    localStorage.setItem('noteOrder', JSON.stringify(order));
  }

  function loadPinnedNotes() {
    const pinnedIds = JSON.parse(localStorage.getItem('pinnedNotes') || '[]');
    document.querySelectorAll('.note').forEach(note => {
      if (pinnedIds.includes(note.dataset.id)) {
        note.classList.add('pinned');
      } else {
        note.classList.remove('pinned');
      }
    });
  }

  function loadNoteOrder() {
    const order = JSON.parse(localStorage.getItem('noteOrder') || '[]');
    const allNotes = [...document.querySelectorAll('.note')];
    const notesById = {};

    allNotes.forEach(note => {
      const id = note.dataset.id;
      if (id && id !== 'null' && id !== 'undefined') {
        notesById[id] = note;
      }
    });

    notesContainer.innerHTML = '';

    order.forEach(id => {
      if (notesById[id]) {
        notesContainer.appendChild(notesById[id]);
      }
    });

    allNotes.forEach(note => {
      if (!order.includes(note.dataset.id)) {
        notesContainer.appendChild(note);
      }
    });
  }


  function sortNotes() {
    const pinned = [];
    const others = [];

    document.querySelectorAll('.note').forEach(note => {
      (note.classList.contains('pinned') ? pinned : others).push(note);
    });

    notesContainer.innerHTML = '';
    [...pinned, ...others].forEach(note => notesContainer.appendChild(note));
  }

  function makeNoteInteractive(note) {
    let touchStartTime = 0;
    let touchMoved = false;

    if (!('ontouchstart' in window)) {
      note.setAttribute('draggable', 'true');
    } else {
      note.removeAttribute('draggable');
    }

    const pinBtn = note.querySelector('.pin-btn');

    if (pinBtn) {
      pinBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePin(note);
      });

      pinBtn.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        togglePin(note);
        e.preventDefault();
      }, { passive: false });
    }

    note.addEventListener('click', (e) => {
      e.stopPropagation();
      modalText.textContent = `${note.querySelector('.content').textContent.trim()}`;
      modal.style.display = 'flex';
    });

    note.addEventListener('dragstart', () => {
      draggedNote = note;
      note.classList.add('dragging');
    });

    note.addEventListener('dragend', () => {
      note.classList.remove('dragging');
      draggedNote = null;
      savePinnedNotes();
      saveNoteOrder();
      sortNotes();
    });

    note.addEventListener('touchstart', (e) => {
      if (e.target.closest('.pin-btn')) {
        return;
      }
      draggedNote = note;
      note.classList.add('dragging');
      const touch = e.touches[0];
      const rect = note.getBoundingClientRect();
      touchOffset = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };

      touchStartTime = Date.now();
      touchMoved = false;
    });

    note.addEventListener('touchmove', (e) => {
      if (!draggedNote) return;
      e.preventDefault();
      touchMoved = true;

      const touch = e.touches[0];
      const x = touch.clientX;
      const y = touch.clientY;

      const closest = getNoteAfter(notesContainer, x, y);

      if (closest && closest !== draggedNote) {
        const rect = closest.getBoundingClientRect();
        const isAfter = y > rect.top + rect.height / 2;
        if (isAfter) {
          closest.after(draggedNote);
        } else {
          closest.before(draggedNote);
        }
      } else if (!closest) {
        notesContainer.appendChild(draggedNote);
      }
    });

    note.addEventListener('touchend', (e) => {
      if (draggedNote) {
        draggedNote.classList.remove('dragging');

        const timeHeld = Date.now() - touchStartTime;

        if (!touchMoved && timeHeld < 200) {
          e.preventDefault();
          const h3 = note.querySelector('h3');
          if (h3) {
            modalText.textContent = `Заметка: "${h3.textContent}"`;
            modal.style.display = 'flex';
          }
        }

        draggedNote = null;
        savePinnedNotes();
        saveNoteOrder();
        sortNotes();
      }
    });
  }

  function togglePin(note) {
    note.classList.toggle('pinned');
    savePinnedNotes();
    saveNoteOrder();
    sortNotes();
  }

  notesContainer.addEventListener('dragover', e => {
    e.preventDefault();

    let draggedOverEl;
    try {
      draggedOverEl = document.elementFromPoint(e.clientX, e.clientY);
    } catch (err) {
      console.warn('Ошибка elementFromPoint:', err);
      return;
    }

    if (!draggedOverEl) return;

    const closestNote = draggedOverEl.closest('.note');
    if (
      closestNote &&
      closestNote !== draggedNote &&
      !closestNote.contains(draggedNote)
    ) {
      const box = closestNote.getBoundingClientRect();
      const isAfter = e.clientY > box.top + box.height / 2;
      if (isAfter) {
        closestNote.after(draggedNote);
      } else {
        closestNote.before(draggedNote);
      }
    } else if (!closestNote && draggedOverEl === notesContainer) {
      notesContainer.insertBefore(draggedNote, notesContainer.firstChild);
    }
  });


  function getNoteAfter(container, x, y) {
    const notes = [...container.querySelectorAll('.note:not(.dragging)')];
    let closestNote = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    notes.forEach(note => {
      const rect = note.getBoundingClientRect();
      const dx = x - (rect.left + rect.width / 2);
      const dy = y - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestNote = note;
      }
    });

    return closestNote;
  }

  function closeModal() {
    const modalContent = document.querySelector('.modal-content');
    modal.classList.add('fade-out');
    modalContent.classList.add('slide-down');

    setTimeout(() => {
      modal.style.display = 'none';
      modal.classList.remove('fade-out');
      modalContent.classList.remove('slide-down');
    }, 300);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.classList.contains('close-btn')) {
      closeModal();
    }
  });

  loadPinnedNotes();
  loadNoteOrder();
  sortNotes();
  document.querySelectorAll('.note').forEach(makeNoteInteractive);

});
