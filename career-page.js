const sampleInput = {
  academicPerformance: 90,
  skills: [
    { name: 'Python', proficiency: 'advanced' },
    { name: 'SQL', proficiency: 'advanced' },
    { name: 'Statistics', proficiency: 'intermediate' },
    { name: 'Data Visualization', proficiency: 'intermediate' },
    { name: 'Research Methods', proficiency: 'beginner' }
  ],
  interests: ['data', 'research', 'analytics'],
  desiredSalary: 95000,
  preferredLocation: 'Austin',
  educationLevel: 'Undergraduate',
  careerGoals: 'Data career with analytics, research, and decision support.'
};

const careerCatalog = [
  {
    careerName: 'Data Analyst',
    industry: 'Analytics',
    salaryRange: '$75k - $95k',
    educationRequirements: 'Bachelor\'s degree',
    growthPotential: 'High growth in analytics and business intelligence',
    skillCategory: 'Analytics',
    requiredSkills: ['Python', 'SQL', 'Statistics', 'Data Visualization'],
    skills: ['Python', 'SQL', 'Statistics', 'Data Visualization'],
    location: 'Austin',
    educationLevel: 'Undergraduate',
    educationMatch: 'Bachelor'
  },
  {
    careerName: 'Data Scientist',
    industry: 'Analytics',
    salaryRange: '$92k - $140k',
    educationRequirements: 'Bachelor\'s degree plus analytics methods foundation',
    growthPotential: 'Very high growth in data-driven decision science',
    skillCategory: 'Analytics',
    requiredSkills: ['Python', 'Statistics', 'Machine Learning', 'Research'],
    skills: ['Python', 'Statistics', 'Machine Learning', 'Research'],
    location: 'Austin',
    educationLevel: 'Undergraduate',
    educationMatch: 'Bachelor'
  },
  {
    careerName: 'Product Manager',
    industry: 'Technology',
    salaryRange: '$98k - $150k',
    educationRequirements: 'Bachelor\'s degree',
    growthPotential: 'High growth in strategic product leadership',
    skillCategory: 'Strategy',
    requiredSkills: ['Strategy', 'Research', 'Stakeholder Management', 'Analytics'],
    skills: ['Strategy', 'Research', 'Stakeholder Management', 'Analytics'],
    location: 'Austin',
    educationLevel: 'Undergraduate',
    educationMatch: 'Bachelor'
  }
];

function parseSkillList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((name) => ({
      name,
      proficiency: 'intermediate'
    }));
}

function parseInterests(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function getFormInput() {
  return {
    academicPerformance: Number(document.getElementById('academicPerformance').value || 75),
    skills: parseSkillList(document.getElementById('skills').value),
    interests: parseInterests(document.getElementById('interests').value),
    desiredSalary: Number(document.getElementById('desiredSalary').value || 80000),
    preferredLocation: document.getElementById('preferredLocation').value || 'Austin',
    educationLevel: document.getElementById('educationLevel').value || 'Undergraduate',
    careerGoals: document.getElementById('careerGoals').value || ''
  };
}

function buildRecommendationCard(result) {
  const card = document.createElement('article');
  card.className = 'recommendation-card';

  card.innerHTML = `
    <div class="recommendation-card-head">
      <div>
        <span class="recommendation-label">Career Recommendation</span>
        <h3>${result.careerName}</h3>
      </div>
      <div class="score-badge">
        <span class="score-number">${result.fitScore}</span>
        <span class="score-label">Fit Score</span>
      </div>
    </div>

    <div class="score-grid">
      <div class="score-metric">
        <span class="metric-label">Academic Fit</span>
        <span class="metric-value">${result.academicFit}%</span>
      </div>
      <div class="score-metric">
        <span class="metric-label">Skill Fit</span>
        <span class="metric-value">${result.skillFit}%</span>
      </div>
      <div class="score-metric">
        <span class="metric-label">Interest Fit</span>
        <span class="metric-value">${result.interestFit}%</span>
      </div>
      <div class="score-metric">
        <span class="metric-label">Salary Alignment</span>
        <span class="metric-value">${result.salaryAlignment}%</span>
      </div>
      <div class="score-metric">
        <span class="metric-label">Location Fit</span>
        <span class="metric-value">${result.locationFit}%</span>
      </div>
      <div class="score-metric">
        <span class="metric-label">Education Compatibility</span>
        <span class="metric-value">${result.educationCompatibility}%</span>
      </div>
    </div>

    <div class="recommendation-details">
      <div class="detail-block">
        <span class="detail-label">Why it matches</span>
        <p>${result.whyItMatches}</p>
      </div>
      <div class="detail-grid">
        <div class="detail-block">
          <span class="detail-label">Required skills</span>
          <p>${result.requiredSkills.join(', ')}</p>
        </div>
        <div class="detail-block">
          <span class="detail-label">Missing skills</span>
          <p>${result.missingSkills.length ? result.missingSkills.join(', ') : 'No major missing skills detected.'}</p>
        </div>
        <div class="detail-block">
          <span class="detail-label">Typical education requirements</span>
          <p>${result.educationRequirements}</p>
        </div>
        <div class="detail-block">
          <span class="detail-label">Salary range</span>
          <p>${result.salaryRange}</p>
        </div>
        <div class="detail-block">
          <span class="detail-label">Growth potential</span>
          <p>${result.growthPotential}</p>
        </div>
      </div>
    </div>
  `;

  return card;
}

function scoreCareer(career, input) {
  const academicFit = Math.min(100, Math.round(input.academicPerformance));
  const skillMatch = career.requiredSkills.reduce((sum, skill) => {
    return sum + (input.skills.some((item) => item.name === skill) ? 10 : 0);
  }, 0);
  const skillFit = Math.min(100, Math.round(skillMatch + (input.skills.length * 3)));
  const interestFit = Math.min(100, Math.round(78 + input.interests.length * 7));
  const salaryAlignment = Math.min(100, Math.round((input.desiredSalary / 120000) * 100));
  const locationFit = career.location === input.preferredLocation ? 100 : 78;
  const educationCompatibility = input.educationLevel === career.educationLevel ? 100 : 84;
  const fitScore = Math.round(academicFit * 0.20 + skillFit * 0.22 + interestFit * 0.18 + salaryAlignment * 0.16 + locationFit * 0.12 + educationCompatibility * 0.12);

  const missingSkills = career.requiredSkills.filter((skill) => !input.skills.some((item) => item.name === skill));

  return {
    careerName: career.careerName,
    academicFit,
    skillFit,
    interestFit,
    salaryAlignment,
    locationFit,
    educationCompatibility,
    fitScore,
    whyItMatches: `${career.careerName} aligns with your ${input.careerGoals || 'career goals'} and current academic, skill, and interest profile.`,
    requiredSkills: career.requiredSkills,
    missingSkills,
    educationRequirements: career.educationRequirements,
    salaryRange: career.salaryRange,
    growthPotential: career.growthPotential,
    requiredSkills: career.requiredSkills
  };
}

function generateLocalRecommendations(input = sampleInput) {
  const recommendations = careerCatalog.map((career) => scoreCareer(career, input));
  recommendations.sort((a, b) => b.fitScore - a.fitScore);
  const averageFitScore = Math.round(recommendations.reduce((sum, item) => sum + item.fitScore, 0) / Math.max(1, recommendations.length));
  return {
    recommendations,
    averageFitScore
  };
}

function loadRecommendations(input = sampleInput) {
  const recommendationContainer = document.getElementById('recommendationResults');
  const recommendationError = document.getElementById('recommendationError');
  const avgFitScore = document.getElementById('avgFitScore');

  try {
    const payload = generateLocalRecommendations(input);

    if (!payload.recommendations || payload.recommendations.length === 0) {
      recommendationError.textContent = 'No recommendations were generated for this profile.';
      return;
    }

    recommendationContainer.innerHTML = '';
    payload.recommendations.forEach((result) => {
      recommendationContainer.appendChild(buildRecommendationCard(result));
    });

    avgFitScore.textContent = payload.averageFitScore;
    recommendationError.textContent = '';
  } catch (error) {
    recommendationError.textContent = 'Unable to load deterministic career recommendations.';
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const runButton = document.getElementById('runRecommendation');
  const resetButton = document.getElementById('resetRecommendation');

  if (runButton) {
    runButton.addEventListener('click', () => {
      loadRecommendations(getFormInput());
    });
  }

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      document.getElementById('academicPerformance').value = sampleInput.academicPerformance;
      document.getElementById('skills').value = sampleInput.skills.map((skill) => skill.name).join(', ');
      document.getElementById('interests').value = sampleInput.interests.join(', ');
      document.getElementById('desiredSalary').value = sampleInput.desiredSalary;
      document.getElementById('preferredLocation').value = sampleInput.preferredLocation;
      document.getElementById('educationLevel').value = sampleInput.educationLevel;
      document.getElementById('careerGoals').value = sampleInput.careerGoals;
      loadRecommendations(sampleInput);
    });
  }

  loadRecommendations();
});
