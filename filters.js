const tagFilters = document.getElementById('tag-filters');
const notes = document.querySelectorAll('.note');

let selectedTags = new Set();
let tooltipTimeout = null;

// Create tooltip element for notification
const tooltip = document.createElement('div');
tooltip.textContent = 'Максимум 3 тега';
tooltip.style.position = 'fixed';
tooltip.style.padding = '6px 10px';
tooltip.style.background = 'rgba(0,0,0,0.75)';
tooltip.style.color = 'white';
tooltip.style.borderRadius = '6px';
tooltip.style.fontSize = '0.8rem';
tooltip.style.pointerEvents = 'none';
tooltip.style.transition = 'opacity 0.3s ease';
tooltip.style.opacity = '0';
tooltip.style.zIndex = '100000';
document.body.appendChild(tooltip);

let tooltipVisible = false;

function showTooltip(x, y) {
  const tooltipRect = tooltip.getBoundingClientRect();
  const offset = 15; // distance from cursor

  // Get viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Calculate horizontal position
  let left = x + offset;
  if (left + tooltipRect.width > viewportWidth) {
    left = x - tooltipRect.width - offset;
    if (left < 0) left = 0; // fallback to left edge
  }

  // Calculate vertical position
  let top = y + offset;
  if (top + tooltipRect.height > viewportHeight) {
    top = y - tooltipRect.height - offset;
    if (top < 0) top = 0; // fallback to top edge
  }

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;

  if (!tooltipVisible) {
    tooltip.style.opacity = '1';
    tooltipVisible = true;
  }

  // Reset hide timer on every show
  if (tooltipTimeout) clearTimeout(tooltipTimeout);
  tooltipTimeout = setTimeout(hideTooltip, 2000);
}


function hideTooltip() {
  tooltip.style.opacity = '0';
  tooltipVisible = false;
  tooltipTimeout = null;
}

// Update tooltip position on mousemove inside tagFilters only if tooltip is visible
tagFilters.addEventListener('mousemove', (e) => {
  if (tooltipVisible) {
    showTooltip(e.clientX, e.clientY);
  }
});

document.addEventListener('mousemove', (e) => {
  if (tooltipVisible) {
    showTooltip(e.clientX, e.clientY);
  }
});

tagFilters.addEventListener('click', (e) => {
  if (!e.target.classList.contains('filter-btn')) return;

  const clickedBtn = e.target;
  const tag = clickedBtn.dataset.tag;

  if (tag === 'all') {
    // Clear all selections
    selectedTags.clear();
    tagFilters.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');
    notes.forEach(note => note.style.display = '');
    hideTooltip();
    return;
  }

  if (selectedTags.has(tag)) {
    selectedTags.delete(tag);
    clickedBtn.classList.remove('active');
  } else {
    if (selectedTags.size < 3) {
      selectedTags.add(tag);
      clickedBtn.classList.add('active');
    } else {
      // Show tooltip near cursor and keep it visible for 5 seconds
      showTooltip(e.clientX, e.clientY);
      return;
    }
  }

  tagFilters.querySelector('.filter-btn[data-tag="all"]').classList.remove('active');

  notes.forEach(note => {
    const noteTags = [...note.querySelectorAll('.tag')].map(t => t.textContent.trim());
    const hasTag = [...selectedTags].some(t => noteTags.includes(t));
    note.style.display = hasTag || selectedTags.size === 0 ? '' : 'none';
  });

  if (selectedTags.size === 0) {
    tagFilters.querySelector('.filter-btn[data-tag="all"]').classList.add('active');
  }
});
