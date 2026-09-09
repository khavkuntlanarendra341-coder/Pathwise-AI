const FinPathWizard = (() => {
  const STORAGE_KEY = 'finpath_student_onboarding_v1';
  const steps = [
    { title: 'Step 1 — Personal', fields: ['name', 'age', 'country', 'city'] },
    { title: 'Step 2 — Education', fields: ['educationLevel', 'degree', 'major', 'college', 'yearOfStudy', 'gpa'] },
    { title: 'Step 3 — Skills', fields: ['skills'] },
    { title: 'Step 4 — Career goals', fields: ['desiredCareer', 'preferredIndustries', 'preferredCountries', 'preferredCities', 'targetSalary', 'higherEducationInterest'] },
    { title: 'Step 5 — Financial situation', fields: ['familyIncome', 'savings', 'maxBudget', 'existingLoans', 'maxLoan', 'scholarshipPreference'] },
    { title: 'Step 6 — Preferences', fields: ['riskTolerance', 'studyMode', 'relocate', 'workLifeBalance'] }
  ];

  let currentStep = 0;

  function loadData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  }

  function persistData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function initWizard() {
    const wizardForm = document.getElementById('studentWizardForm');
    const panels = Array.from(document.querySelectorAll('[data-panel]'));
    const stepIndicators = Array.from(document.querySelectorAll('[data-step-indicator]'));
    const title = document.getElementById('wizardTitle');
    const stepState = document.getElementById('wizardStepState');
    const backBtn = document.getElementById('backBtn');
    const nextBtn = document.getElementById('nextBtn');
    const finishBtn = document.getElementById('finishBtn');
    const saveBtn = document.getElementById('saveBtn');
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    const summary = document.getElementById('wizardSummary');

    const raw = loadData();

    function applyData(data) {
      Object.entries(data).forEach(([key, value]) => {
        const control = wizardForm.elements.namedItem(key);
        if (!control) return;

        if (control instanceof RadioNodeList || control.type === 'checkbox') {
          return;
        }

        if (Array.isArray(value)) {
          value.forEach((item) => {
            const skillCheckbox = Array.from(wizardForm.elements.skills || []).find((checkbox) => checkbox.value === item.name);
            if (skillCheckbox) skillCheckbox.checked = true;
          });
        } else {
          control.value = value;
        }
      });

      const checkedSkills = Array.from(document.querySelectorAll('[name="skills"]:checked'));
      checkedSkills.forEach((skill) => {
        const level = wizardForm.elements.namedItem(skill.value);
        if (level) {
          const selected = raw[skill.value] || 'Intermediate';
          level.value = selected;
        }
      });
    }

    function updateSkillLevels() {
      Array.from(document.querySelectorAll('[name="skills"]')).forEach((checkbox) => {
        const skillName = checkbox.value;
        const levelSelect = wizardForm.elements.namedItem(skillName);
        if (levelSelect) {
          levelSelect.disabled = !checkbox.checked;
        }
      });
    }

    function updateProgress() {
      const completed = Math.round(((currentStep + 1) / steps.length) * 100);
      progressFill.style.width = `${completed}%`;
      progressPercent.textContent = `${Math.round(completed)}%`;
    }

    function updateStepPanels() {
      panels.forEach((panel) => {
        panel.classList.toggle('active', Number(panel.dataset.panel) === currentStep);
      });

      stepIndicators.forEach((item) => {
        item.classList.toggle('active', Number(item.dataset.stepIndicator) === currentStep);
      });

      title.textContent = steps[currentStep].title;
      stepState.textContent = `${currentStep + 1} / ${steps.length}`;
      backBtn.disabled = currentStep === 0;
      nextBtn.hidden = currentStep === steps.length - 1;
      finishBtn.hidden = currentStep !== steps.length - 1;

      updateProgress();
    }

    function collectDataFromForm() {
      const data = loadData();
      const selectedSkills = Array.from(wizardForm.querySelectorAll('[name="skills"]:checked')).map((box) => box.value);
      selectedSkills.forEach((skill) => {
        const skillLevel = wizardForm.elements.namedItem(skill);
        if (skillLevel) {
          data[skill] = skillLevel.value;
        }
      });

      const payload = {
        name: wizardForm.elements.name.value,
        age: wizardForm.elements.age.value,
        country: wizardForm.elements.country.value,
        city: wizardForm.elements.city.value,
        educationLevel: wizardForm.elements.educationLevel.value,
        degree: wizardForm.elements.degree.value,
        major: wizardForm.elements.major.value,
        college: wizardForm.elements.college.value,
        yearOfStudy: wizardForm.elements.yearOfStudy.value,
        gpa: wizardForm.elements.gpa.value,
        desiredCareer: wizardForm.elements.desiredCareer.value,
        preferredIndustries: wizardForm.elements.preferredIndustries.value,
        preferredCountries: wizardForm.elements.preferredCountries.value,
        preferredCities: wizardForm.elements.preferredCities.value,
        targetSalary: wizardForm.elements.targetSalary.value,
        higherEducationInterest: wizardForm.elements.higherEducationInterest.value,
        familyIncome: wizardForm.elements.familyIncome.value,
        savings: wizardForm.elements.savings.value,
        maxBudget: wizardForm.elements.maxBudget.value,
        existingLoans: wizardForm.elements.existingLoans.value,
        maxLoan: wizardForm.elements.maxLoan.value,
        scholarshipPreference: wizardForm.elements.scholarshipPreference.value,
        riskTolerance: wizardForm.elements.riskTolerance.value,
        studyMode: wizardForm.elements.studyMode.value,
        relocate: wizardForm.elements.relocate.value,
        workLifeBalance: wizardForm.elements.workLifeBalance.value,
        skills: selectedSkills
      };

      Object.assign(data, payload);
      persistData(data);
      return data;
    }

    function updateSummary(data) {
      const fields = {
        personal: [
          ['Name', data.name], ['Age', data.age], ['Country', data.country], ['City', data.city]
        ],
        education: [
          ['Education', data.educationLevel], ['Degree', data.degree], ['Major', data.major], ['College', data.college], ['Year', data.yearOfStudy], ['GPA', data.gpa]
        ],
        career: [
          ['Desired career', data.desiredCareer], ['Industries', data.preferredIndustries], ['Countries', data.preferredCountries], ['Cities', data.preferredCities], ['Target salary', data.targetSalary], ['Higher education', data.higherEducationInterest]
        ],
        financial: [
          ['Family income', data.familyIncome], ['Savings', data.savings], ['Max budget', data.maxBudget], ['Existing loans', data.existingLoans], ['Max loan', data.maxLoan], ['Scholarship', data.scholarshipPreference]
        ]
      };

      const personalEl = document.getElementById('summaryPersonal');
      const educationEl = document.getElementById('summaryEducation');
      const careerEl = document.getElementById('summaryCareer');
      const financialEl = document.getElementById('summaryFinancial');

      personalEl.innerHTML = fields.personal.map(([label, value]) => `<div><span class="summary-kicker">${label}</span><span class="summary-value">${value || '—'}</span></div>`).join('');
      educationEl.innerHTML = fields.education.map(([label, value]) => `<div><span class="summary-kicker">${label}</span><span class="summary-value">${value || '—'}</span></div>`).join('');
      careerEl.innerHTML = fields.career.map(([label, value]) => `<div><span class="summary-kicker">${label}</span><span class="summary-value">${value || '—'}</span></div>`).join('');
      financialEl.innerHTML = fields.financial.map(([label, value]) => `<div><span class="summary-kicker">${label}</span><span class="summary-value">${value || '—'}</span></div>`).join('');
    }

    backBtn.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep -= 1;
        updateStepPanels();
      }
    });

    nextBtn.addEventListener('click', () => {
      if (!wizardForm.checkValidity()) {
        wizardForm.reportValidity();
        return;
      }

      collectDataFromForm();
      if (currentStep < steps.length - 1) {
        currentStep += 1;
        updateStepPanels();
      }
    });

    finishBtn.addEventListener('click', () => {
      if (!wizardForm.checkValidity()) {
        wizardForm.reportValidity();
        return;
      }

      const data = collectDataFromForm();
      updateSummary(data);
      summary.hidden = false;
      finishBtn.textContent = 'Saved';
      finishBtn.disabled = true;
      panels.forEach((panel) => panel.classList.toggle('active', false));
      panels[0].classList.add('active');
      updateProgress();
    });

    saveBtn.addEventListener('click', () => {
      const data = collectDataFromForm();
      updateSummary(data);
      summary.hidden = false;
      saveBtn.textContent = 'Saved';
    });

    document.getElementById('addSkill').addEventListener('click', () => {
      const customSkill = document.getElementById('customSkill').value.trim();
      if (!customSkill) return;

      const row = document.createElement('div');
      row.className = 'skill-row';
      row.innerHTML = `<label class="skill-option"><input type="checkbox" name="skills" value="${customSkill}" checked /><span>${customSkill}</span></label><select class="skill-level" name="${customSkill}"><option>Beginner</option><option selected>Intermediate</option><option>Advanced</option></select>`;

      const skillsGrid = document.querySelector('.skills-grid');
      skillsGrid.appendChild(row);
      document.getElementById('customSkill').value = '';
      updateSkillLevels();
    });

    Array.from(document.querySelectorAll('[name="skills"]')).forEach((box) => {
      box.addEventListener('change', updateSkillLevels);
    });

    applyData(raw);
    updateSkillLevels();
    updateStepPanels();
    updateSummary(raw);
  }

  return { initWizard };
})();

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('studentWizardForm')) {
    FinPathWizard.initWizard();
  }
});
