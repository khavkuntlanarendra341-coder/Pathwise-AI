(() => {
  const session = FinPathAuth.getCurrentSession();
  const profile = session && session.profile;
  const analysis = session && (session.analysis || JSON.parse(localStorage.getItem('finpath_analysis_result_v1') || 'null'));
  const emptyState = document.getElementById('profileEmpty');
  const dashboard = document.getElementById('profileDashboard');
  const recommendationDashboard = document.getElementById('recommendationDashboard');
  const heading = document.getElementById('welcomeHeading');

  const escapeHTML = (value) => String(value || 'Not provided')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  const renderDetails = (elementId, entries) => {
    document.getElementById(elementId).innerHTML = entries.map(([label, value]) => `
      <div><dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value)}</dd></div>
    `).join('');
  };

  if (!session) {
    return;
  }

  heading.textContent = `Welcome back, ${session.name || session.email}`;

  if (!profile) {
    emptyState.hidden = false;
    return;
  }

  dashboard.hidden = false;
  renderDetails('personalDetails', [
    ['Name', profile.name],
    ['Age', profile.age],
    ['Category', profile.caste],
    ['Location', [profile.city, profile.country].filter(Boolean).join(', ')]
  ]);
  renderDetails('educationDetails', [
    ['Education level', profile.educationLevel],
    ['Degree', profile.degree],
    ['Major', profile.major],
    ['College', profile.college],
    ['Year of study', profile.yearOfStudy],
    ['GPA / CGPA', profile.gpa]
  ]);
  renderDetails('financialDetails', [
    ['Family income / year', profile.familyIncome],
    ['Savings', profile.savings],
    ['Maximum education budget', profile.maxBudget],
    ['Existing loans', profile.existingLoans],
    ['Maximum loan', profile.maxLoan],
    ['Scholarship preference', profile.scholarshipPreference]
  ]);
  renderDetails('careerDetails', [
    ['Career goal', profile.desiredCareer],
    ['Target salary', profile.targetSalary],
    ['Preferred industries', profile.preferredIndustries],
    ['Preferred locations', [profile.preferredCities, profile.preferredCountries].filter(Boolean).join(', ')],
    ['Higher education', profile.higherEducationInterest]
  ]);

  const skills = document.getElementById('skillsDetails');
  skills.innerHTML = (profile.skills || []).map((skill) => `<span class="skill">${escapeHTML(skill)} · ${escapeHTML(profile[skill] || 'Intermediate')}</span>`).join('') || '<span class="muted">No skills added yet.</span>';

  if (!analysis) return;

  recommendationDashboard.hidden = false;
  document.getElementById('recommendedCareer').textContent = analysis.career;
  document.getElementById('recommendationReason').textContent = (analysis.reason || []).join(' ');
  document.getElementById('recommendationMetrics').innerHTML = [
    ['Career match', `${analysis.match}%`],
    ['Expected salary', analysis.salary],
    ['Education cost', analysis.education_cost],
    ['Net cost after scholarship', analysis.net_cost]
  ].map(([label, value]) => `<div class="recommendation-metric"><strong>${escapeHTML(value)}</strong><span>${escapeHTML(label)}</span></div>`).join('');

  document.getElementById('collegeRecommendations').innerHTML = (analysis.colleges || []).map((college) => `
    <div class="recommendation-item"><strong>${escapeHTML(college.name)}</strong><span>${escapeHTML(college.program)} · ${escapeHTML(college.fit)} fit</span></div>
  `).join('');
  document.getElementById('skillRoadmap').innerHTML = (analysis.skills_to_develop || []).map((skill, index) => `
    <div class="roadmap-step"><b>${index + 1}</b><div><strong>${escapeHTML(skill)}</strong><span>Learn, practise with a project, then add it to your portfolio.</span></div></div>
  `).join('') || '<span class="muted">Your current skills cover the recommended career foundation.</span>';
  document.getElementById('scholarshipRecommendations').innerHTML = (analysis.scholarship_matches || []).map((scholarship) => `
    <div class="recommendation-item"><strong>${escapeHTML(scholarship.name)}</strong><span>Estimated support: ${escapeHTML(scholarship.amount)}</span><p>${escapeHTML(scholarship.reason)}</p></div>
  `).join('');
  const loan = analysis.loan_recommendation;
  document.getElementById('loanRecommendation').innerHTML = loan
    ? `<p class="loan-status">${escapeHTML(loan.status)}</p><dl class="detail-list"><div><dt>Estimated amount needed</dt><dd>${escapeHTML(loan.amount_needed)}</dd></div><div><dt>Remaining loan capacity</dt><dd>${escapeHTML(loan.remaining_capacity)}</dd></div></dl><p class="muted">${escapeHTML(loan.academic_guidance)}</p><p class="muted">${escapeHTML(loan.note)}</p>`
    : '<span class="muted">Complete your financial details to see loan guidance.</span>';
})();
