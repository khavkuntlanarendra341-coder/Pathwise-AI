const careers = [
  {
    name: 'Data Scientist',
    industry: 'Technology',
    salary: { min: 75000, max: 130000 },
    education: 'Bachelor\'s degree in analytics, statistics, computer science, or related field',
    location: 'Austin',
    experience: 'Mid-level',
    skillCategory: 'Technical',
    skills: ['Python', 'SQL', 'Statistics', 'Data Visualization'],
    topSkills: ['Python', 'SQL', 'Statistics'],
    growth: 'High growth',
    fitScore: 89,
    growthOutlook: 'High growth, strong demand across analytics and applied research roles.'
  },
  {
    name: 'UX Researcher',
    industry: 'Design',
    salary: { min: 68000, max: 115000 },
    education: 'Bachelor\'s degree in psychology, design, HCI, or related field',
    location: 'Austin',
    experience: 'Entry-level',
    skillCategory: 'Human-centered',
    skills: ['Research Methods', 'Interviewing', 'Stakeholder Mapping', 'Communication'],
    topSkills: ['Research Methods', 'Interviewing', 'Communication'],
    growth: 'Moderate growth',
    fitScore: 65,
    growthOutlook: 'Moderate growth with strong demand in product and design organizations.'
  },
  {
    name: 'Software Engineer',
    industry: 'Technology',
    salary: { min: 82000, max: 150000 },
    education: 'Bachelor\'s degree in computer science or software engineering',
    location: 'Remote',
    experience: 'Mid-level',
    skillCategory: 'Technical',
    skills: ['Programming', 'Data Structures', 'Algorithms', 'Software Design'],
    topSkills: ['Programming', 'Data Structures', 'Algorithms'],
    growth: 'High growth',
    fitScore: 76,
    growthOutlook: 'High growth with broad opportunities across emerging technology platforms.'
  },
  {
    name: 'Financial Analyst',
    industry: 'Finance',
    salary: { min: 70000, max: 120000 },
    education: 'Bachelor\'s degree in finance, economics, accounting, or business analytics',
    location: 'Dallas',
    experience: 'Entry-level',
    skillCategory: 'Business',
    skills: ['Excel', 'Finance Modeling', 'Budgeting', 'Communication'],
    topSkills: ['Excel', 'Finance Modeling', 'Budgeting'],
    growth: 'Stable growth',
    fitScore: 72,
    growthOutlook: 'Stable growth with demand in strategy, planning, and corporate finance teams.'
  },
  {
    name: 'Policy Analyst',
    industry: 'Public Policy',
    salary: { min: 65000, max: 110000 },
    education: 'Bachelor\'s or master\'s degree in public policy, economics, or political science',
    location: 'Austin',
    experience: 'Entry-level',
    skillCategory: 'Research',
    skills: ['Research Methods', 'Communication', 'Policy Analysis', 'Stakeholder Mapping'],
    topSkills: ['Research Methods', 'Communication', 'Policy Analysis'],
    growth: 'Moderate growth',
    fitScore: 70,
    growthOutlook: 'Moderate growth with recurring policy and government planning demand.'
  }
];

function formatCareerSalary(salary) {
  const minimum = new Intl.NumberFormat('en-US').format(salary.min);
  const maximum = new Intl.NumberFormat('en-US').format(salary.max);
  return `$${minimum} - $${maximum}`;
}

function getCareerFilterPanel() {
  return typeof document !== 'undefined' ? document.getElementById('careerFilterPanel') : null;
}

function renderCareerExplorer() {
  const container = document.getElementById('careerExplorerCards');
  if (!container) {
    return;
  }

  const query = (document.getElementById('careerSearch') || { value: '' }).value.trim().toLowerCase();
  const industry = (document.getElementById('filterIndustry') || { value: 'All' }).value;
  const salary = (document.getElementById('filterSalary') || { value: 'all' }).value;
  const education = (document.getElementById('filterEducation') || { value: 'All' }).value;
  const location = (document.getElementById('filterLocation') || { value: 'All' }).value;
  const experience = (document.getElementById('filterExperience') || { value: 'All' }).value;
  const skillCategory = (document.getElementById('filterSkillCategory') || { value: 'All' }).value;

  let filtered = careers.filter((career) => {
    const matchesQuery = career.name.toLowerCase().includes(query) || career.skills.some((skill) => skill.toLowerCase().includes(query));
    const matchesIndustry = industry === 'All' || career.industry === industry;
    const matchesEducation = education === 'All' || career.education.toLowerCase().includes(education.toLowerCase());
    const matchesLocation = location === 'All' || career.location === location;
    const matchesExperience = experience === 'All' || career.experience === experience;
    const matchesCategory = skillCategory === 'All' || career.skillCategory === skillCategory;

    const salaryCap = salary === 'all' || salary === 'all' ? true : (() => {
      if (salary === 'low') return career.salary.max < 75000;
      if (salary === 'mid') return career.salary.min >= 75000 && career.salary.max <= 120000;
      if (salary === 'high') return career.salary.min >= 120000;
      return true;
    })();

    return matchesQuery && matchesIndustry && matchesEducation && matchesLocation && matchesExperience && matchesCategory && salaryCap;
  });

  if (!filtered.length) {
    container.innerHTML = '<article class="no-cards"><span class="no-card-title">No matching careers</span><p>Adjust your filters to see more opportunities.</p></article>';
    return;
  }

  container.innerHTML = filtered.map((career) => `
    <article class="career-explorer-card">
      <div class="career-card-top">
        <div>
          <span class="career-category">${career.industry}</span>
          <h3>${career.name}</h3>
        </div>
        <span class="career-fit-score">${career.fitScore}</span>
      </div>
      <div class="career-card-meta">
        <span>${formatCareerSalary(career.salary)}</span>
        <span>${career.location}</span>
      </div>
      <div class="career-card-grid">
        <div>
          <span class="card-label">Required education</span>
          <span class="card-value">${career.education}</span>
        </div>
        <div>
          <span class="card-label">Experience level</span>
          <span class="card-value">${career.experience}</span>
        </div>
      </div>
      <div class="career-card-skills">
        <span class="card-label">Top skills</span>
        <div class="skill-chip-row">
          ${career.topSkills.map((skill) => `<span class="skill-chip">${skill}</span>`).join('')}
        </div>
      </div>
      <div class="career-growth-row">
        <span class="card-label">Growth outlook</span>
        <span class="growth-value">${career.growth}</span>
      </div>
      <div class="career-card-actions">
        <button class="button button-primary card-button">Explore</button>
        <a class="button button-secondary card-button" href="career-detail.html">Details</a>
      </div>
    </article>
  `).join('');
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('careerExplorerCards');
    if (!container) {
      return;
    }

    const elements = ['careerSearch', 'filterIndustry', 'filterSalary', 'filterEducation', 'filterLocation', 'filterExperience', 'filterSkillCategory'];
    elements.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('input', renderCareerExplorer);
        element.addEventListener('change', renderCareerExplorer);
      }
    });

    renderCareerExplorer();
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { careers, formatCareerSalary, renderCareerExplorer };
}
