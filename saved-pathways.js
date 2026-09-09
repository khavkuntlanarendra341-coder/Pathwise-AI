function getSavedPathways() {
  try {
    return JSON.parse(localStorage.getItem('finpath_saved_pathways') || '[]');
  } catch (error) {
    return [];
  }
}

function renderSavedPathways() {
  const container = document.getElementById('savedPathwayResults');
  if (!container) return;

  const pathways = getSavedPathways();
  const savedCount = document.getElementById('savedPathwayCount');
  if (savedCount) {
    savedCount.textContent = String(pathways.length);
  }

  if (!pathways.length) {
    container.innerHTML = `
      <article class="placeholder-card page-panel saved-empty-card">
        <span class="panel-label">No saved pathways</span>
        <h3>No saved pathways yet</h3>
        <p>Generate and save a pathway from the Education Pathway Generator.</p>
      </article>
    `;
    return;
  }

  container.innerHTML = pathways.map((pathway) => `
    <article class="saved-pathway-card">
      <div class="saved-pathway-head">
        <div>
          <span class="pathway-label">${pathway.name}</span>
          <h3>${pathway.title}</h3>
        </div>
        <span class="pathway-risk risk-${String(pathway.financialRisk || 'Low').toLowerCase()}">${pathway.financialRisk || 'Low'} Risk</span>
      </div>

      <div class="pathway-timeline">
        ${pathway.steps.map((step, index) => `
          <div class="timeline-node">
            <span class="timeline-node-core"></span>
            <span class="timeline-label">${step}</span>
            ${index < pathway.steps.length - 1 ? '<span class="timeline-line"></span>' : ''}
          </div>
        `).join('')}
      </div>

      <div class="pathway-metrics">
        <div class="metric-tile">
          <span class="metric-label">Duration</span>
          <span class="metric-value">${pathway.duration}</span>
        </div>
        <div class="metric-tile">
          <span class="metric-label">Education Cost</span>
          <span class="metric-value">${formatMoney(pathway.educationCost)}</span>
        </div>
        <div class="metric-tile">
          <span class="metric-label">Living Cost</span>
          <span class="metric-value">${formatMoney(pathway.livingCost)}</span>
        </div>
        <div class="metric-tile">
          <span class="metric-label">Scholarships</span>
          <span class="metric-value">${pathway.scholarshipOpportunities || pathway.scholarships || 0}</span>
        </div>
        <div class="metric-tile">
          <span class="metric-label">Starting Salary</span>
          <span class="metric-value">${formatMoney(pathway.expectedStartingSalary)}</span>
        </div>
        <div class="metric-tile">
          <span class="metric-label">Career Outcome</span>
          <span class="metric-value">${pathway.careerOutcome}</span>
        </div>
        <div class="metric-tile">
          <span class="metric-label">Financial Risk</span>
          <span class="metric-value">${pathway.financialRisk || 'Low'}</span>
        </div>
      </div>

      <div class="pathway-card-actions">
        <button class="button button-secondary remove-saved" data-id="${pathway.id || pathway.title}">Remove</button>
      </div>
    </article>
  `).join('');

  const removeButtons = Array.from(document.getElementsByClassName('remove-saved'));
  removeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      const saved = getSavedPathways().filter((item) => (item.id || item.title) !== id);
      localStorage.setItem('finpath_saved_pathways', JSON.stringify(saved));
      renderSavedPathways();
    });
  });
}

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value || 0);
}

document.addEventListener('DOMContentLoaded', () => {
  renderSavedPathways();
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getSavedPathways, renderSavedPathways, formatMoney };
}
