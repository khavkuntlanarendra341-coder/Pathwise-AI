const pathwayData = {
  currentEducationOptions: [
    'High School',
    'Associate Degree',
    'B.Tech / Undergraduate',
    'Diploma',
    'Graduate Certificate'
  ],
  careerMap: {
    'Software Engineer': { salary: 82000, educationCost: 46000, duration: 2 },
    'AI Engineer': { salary: 95000, educationCost: 54000, duration: 3 },
    'Data Scientist': { salary: 88000, educationCost: 52000, duration: 2 },
    'UX Researcher': { salary: 76000, educationCost: 42000, duration: 2 },
    'Product Analyst': { salary: 78000, educationCost: 50000, duration: 2 },
    'Policy Analyst': { salary: 72000, educationCost: 43000, duration: 2 }
  }
};

function normalizeInput(value) {
  return String(value || '').trim().toLowerCase();
}

function normalizeSkills(skills) {
  return String(skills || '')
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function educationCostBase(currentEducation) {
  if (currentEducation === 'High School') return 26000;
  if (currentEducation === 'Associate Degree') return 23000;
  if (currentEducation === 'Diploma') return 19000;
  if (currentEducation === 'Graduate Certificate') return 16000;
  return 36000;
}

function locationLivingCost(location) {
  const rates = {
    'Austin': 9400,
    'Dallas': 8900,
    'Chicago': 9100,
    'Remote': 6400,
    'Atlanta': 8300,
    'New York': 12000,
    'Boston': 11800,
    'Seattle': 11200,
    'Denver': 9800
  };

  return rates[location] || 8200;
}

function budgetRisk(budget, cost) {
  if (budget >= cost) return 'Low';
  if (budget >= cost * 0.75) return 'Medium';
  return 'High';
}

function scholarshipAmount(cost, budget, location) {
  const base = Math.min(cost * 0.22, 16000);
  const locationBoost = location === 'Remote' ? 1800 : 2600;
  const budgetGap = Math.max(0, cost - budget);
  return Math.round(Math.min(base + locationBoost + budgetGap * 0.05, cost * 0.35));
}

function estimatedSalaryForCareer(career, location, skillsCount, budget) {
  const careerMeta = pathwayData.careerMap[career] || { salary: 78000, educationCost: 42000, duration: 2 };
  const skillBoost = Math.min(skillsCount * 1200, 7000);
  const locationBoost = location === 'Remote' ? 4500 : location === 'New York' ? 7000 : 2500;
  const budgetAdjustment = budget >= careerMeta.educationCost ? 2500 : -3500;
  return Math.round(careerMeta.salary + skillBoost + locationBoost + budgetAdjustment);
}

function durationToMonths(durationLabel) {
  const year = Number(durationLabel.replace(/[^0-9.]/g, '')) || 1;
  return Math.round(year * 12);
}

function riskFromCost(cost, salary) {
  const ratio = cost / Math.max(salary, 1);
  if (ratio < 0.65) return 'Low';
  if (ratio < 1.05) return 'Medium';
  return 'High';
}

function buildPathway(profile) {
  const career = profile.careerGoal || 'AI Engineer';
  const skills = normalizeSkills(profile.skills);
  const educationBase = educationCostBase(profile.currentEducation);
  const livingCost = locationLivingCost(profile.location);
  const baselineBudget = Number(profile.budget) || 0;
  const careerMeta = pathwayData.careerMap[career] || pathwayData.careerMap['AI Engineer'];

  const educationYears = profile.currentEducation === 'High School' ? 4 : profile.currentEducation === 'Associate Degree' ? 2 : 2;

  // Path A: B.Tech -> Internship -> Software Engineer
  const pathA = {
    name: 'Path A',
    title: 'B.Tech → Internship → Software Engineer',
    careerOutcome: 'Software Engineer',
    steps: ['B.Tech / Undergraduate', 'Internship', 'Software Engineer'],
    duration: `${Math.max(1, educationYears + 1)} years`,
    educationCost: Math.round(educationBase + 12000),
    livingCost: Math.round(livingCost * 1.2),
    scholarshipOpportunities: 2,
    expectedStartingSalary: estimatedSalaryForCareer('Software Engineer', profile.location, skills.length, baselineBudget),
    financialRisk: budgetRisk(baselineBudget, Math.round(educationBase + 12000) + Math.round(livingCost * 1.2)),
    outcome: 'Software Engineer'
  };

  // Path B: B.Tech -> Master's -> AI Engineer
  const pathB = {
    name: 'Path B',
    title: 'B.Tech → Master\'s → AI Engineer',
    careerOutcome: 'AI Engineer',
    steps: ['B.Tech / Undergraduate', 'Master\'s degree', 'AI Engineer'],
    duration: `${Math.max(2, educationYears + 2)} years`,
    educationCost: Math.round(educationBase + careerMeta.educationCost + 10000),
    livingCost: Math.round(livingCost * 1.4),
    scholarshipOpportunities: 3,
    expectedStartingSalary: estimatedSalaryForCareer('AI Engineer', profile.location, skills.length, baselineBudget),
    financialRisk: budgetRisk(baselineBudget, Math.round(educationBase + careerMeta.educationCost + 10000) + Math.round(livingCost * 1.4)),
    outcome: 'AI Engineer'
  };

  // Path C: B.Tech -> Job -> Master's -> AI Engineer
  const pathC = {
    name: 'Path C',
    title: 'B.Tech → Job → Master\'s → AI Engineer',
    careerOutcome: 'AI Engineer',
    steps: ['B.Tech / Undergraduate', 'Job / early work experience', 'Master\'s degree', 'AI Engineer'],
    duration: `${Math.max(3, educationYears + 3)} years`,
    educationCost: Math.round(educationBase + careerMeta.educationCost + 14000),
    livingCost: Math.round(livingCost * 1.5),
    scholarshipOpportunities: 2,
    expectedStartingSalary: estimatedSalaryForCareer('AI Engineer', profile.location, skills.length, baselineBudget),
    financialRisk: budgetRisk(baselineBudget, Math.round(educationBase + careerMeta.educationCost + 14000) + Math.round(livingCost * 1.5)),
    outcome: 'AI Engineer'
  };

  // Path D: B.Tech -> Certification -> AI Engineer
  const pathD = {
    name: 'Path D',
    title: 'B.Tech → Certification → AI Engineer',
    careerOutcome: 'AI Engineer',
    steps: ['B.Tech / Undergraduate', 'Certification track', 'AI Engineer'],
    duration: `${Math.max(1, educationYears + 1)} years`,
    educationCost: Math.round(educationBase + 7000),
    livingCost: Math.round(livingCost * 1.15),
    scholarshipOpportunities: 4,
    expectedStartingSalary: estimatedSalaryForCareer('AI Engineer', profile.location, skills.length, baselineBudget),
    financialRisk: budgetRisk(baselineBudget, Math.round(educationBase + 7000) + Math.round(livingCost * 1.15)),
    outcome: 'AI Engineer'
  };

  const total = [pathA, pathB, pathC, pathD].map((path) => {
    return {
      ...path,
      costForBudget: path.educationCost + path.livingCost,
      scholarships: scholarshipAmount(path.educationCost, baselineBudget, profile.location),
      risk: riskFromCost(path.educationCost + path.livingCost, path.expectedStartingSalary)
    };
  });

  return total;
}

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

function renderPathwayResult(pathways) {
  const container = document.getElementById('pathwayResults');
  if (!container || !Array.isArray(pathways)) {
    return;
  }

  const count = document.getElementById('pathwayCount');
  if (count) {
    count.textContent = String(pathways.length);
  }

  container.innerHTML = pathways.map((pathway) => `
    <article class="pathway-card">
      <div class="pathway-card-head">
        <div>
          <span class="pathway-label">${pathway.name}</span>
          <h3>${pathway.title}</h3>
        </div>
        <div class="pathway-risk risk-${pathway.risk.toLowerCase()}">${pathway.risk} Risk</div>
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
          <span class="metric-value">${pathway.scholarships}</span>
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
          <span class="metric-value">${pathway.risk}</span>
        </div>
      </div>

      <div class="pathway-card-actions">
        <button class="button button-primary save-pathway" data-pathway='${JSON.stringify(pathway)}'>Save Pathway</button>
      </div>
    </article>
  `).join('');

  bindSaveButtons();
}

function bindSaveButtons() {
  const buttons = Array.from(document.getElementsByClassName('save-pathway'));
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const pathway = JSON.parse(button.dataset.pathway);
      savePathway(pathway);
      button.textContent = 'Saved';
      button.disabled = true;
    });
  });
}

function savePathway(pathway) {
  const existing = JSON.parse(localStorage.getItem('finpath_saved_pathways') || '[]');
  const unique = existing.find((item) => item.title === pathway.title);
  if (!unique) {
    existing.push({
      id: `${pathway.name}-${Date.now()}`,
      title: pathway.title,
      name: pathway.name,
      steps: pathway.steps,
      duration: pathway.duration,
      educationCost: pathway.educationCost,
      livingCost: pathway.livingCost,
      scholarshipOpportunities: pathway.scholarships,
      expectedStartingSalary: pathway.expectedStartingSalary,
      careerOutcome: pathway.careerOutcome,
      financialRisk: pathway.risk,
      savedAt: new Date().toISOString()
    });
    localStorage.setItem('finpath_saved_pathways', JSON.stringify(existing));
  }
}

function readAndGenerate() {
  const profile = {
    currentEducation: document.getElementById('currentEducation').value,
    careerGoal: document.getElementById('careerGoal').value,
    skills: document.getElementById('skills').value,
    budget: document.getElementById('budget').value,
    location: document.getElementById('locationPreference').value
  };

  const pathways = buildPathway(profile);
  renderPathwayResult(pathways);
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generatePathways');
    if (generateButton) {
      generateButton.addEventListener('click', readAndGenerate);
    }

    const defaultProfile = {
      currentEducation: 'B.Tech / Undergraduate',
      careerGoal: 'AI Engineer',
      skills: 'Python, Statistics, Research Methods, Data Visualization',
      budget: 60000,
      location: 'Austin'
    };

    const initialPathways = buildPathway(defaultProfile);
    renderPathwayResult(initialPathways);
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    pathwayData,
    normalizeSkills,
    locationLivingCost,
    educationCostBase,
    budgetRisk,
    scholarshipAmount,
    estimatedSalaryForCareer,
    buildPathway,
    renderPathwayResult,
    formatMoney,
    savePathway
  };
}
