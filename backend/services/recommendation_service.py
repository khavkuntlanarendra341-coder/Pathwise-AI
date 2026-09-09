CAREERS = [
	{
		"name": "Software Developer",
		"skills": ["Python", "Java", "JavaScript", "C++"],
		"interests": ["Programming", "Technology", "Software"],
		"education_path": "B.Tech CSE followed by software development skills",
		"education_cost": 200000,
		"scholarship": 50000,
		"salary": "4-8 LPA",
		"career_path": [
			"Intermediate",
			"B.Tech CSE",
			"Programming Skills",
			"Internship",
			"Software Developer"
		]
	},
	{
		"name": "AI/ML Engineer",
		"skills": ["Python", "Machine Learning", "Statistics"],
		"interests": ["AI", "Machine Learning", "Technology"],
		"education_path": "B.Tech CSE/AI followed by Machine Learning specialization",
		"education_cost": 240000,
		"scholarship": 50000,
		"salary": "6-10 LPA",
		"career_path": [
			"Intermediate",
			"B.Tech CSE/AI",
			"Python & ML",
			"AI Internship",
			"AI/ML Engineer"
		]
	},
	{
		"name": "Data Analyst",
		"skills": ["Python", "SQL", "Excel", "Statistics"],
		"interests": ["Data", "Analytics", "Technology"],
		"education_path": "Degree in CSE/Data Science followed by analytics skills",
		"education_cost": 180000,
		"scholarship": 40000,
		"salary": "4-7 LPA",
		"career_path": [
			"Intermediate",
			"Degree",
			"SQL & Python",
			"Data Internship",
			"Data Analyst"
		]
	},
	{
		"name": "Cybersecurity Analyst",
		"skills": ["Networking", "Linux", "Python", "Cybersecurity"],
		"interests": ["Cybersecurity", "Technology", "Networking"],
		"education_path": "B.Tech CSE followed by cybersecurity specialization",
		"education_cost": 220000,
		"scholarship": 45000,
		"salary": "4-9 LPA",
		"career_path": [
			"Intermediate",
			"B.Tech CSE",
			"Networking & Linux",
			"Security Internship",
			"Cybersecurity Analyst"
		]
	},
	{
		"name": "Web Developer",
		"skills": ["HTML", "CSS", "JavaScript"],
		"interests": ["Web Development", "Design", "Technology"],
		"education_path": "Degree followed by frontend and backend development skills",
		"education_cost": 160000,
		"scholarship": 30000,
		"salary": "3-7 LPA",
		"career_path": [
			"Intermediate",
			"Degree",
			"HTML/CSS/JavaScript",
			"Web Development Internship",
			"Web Developer"
		]
	},
	{
		"name": "Cloud Engineer",
		"skills": ["Linux", "Python", "Networking", "Cloud"],
		"interests": ["Cloud", "Technology", "Infrastructure"],
		"education_path": "B.Tech CSE followed by cloud computing specialization",
		"education_cost": 230000,
		"scholarship": 50000,
		"salary": "5-10 LPA",
		"career_path": [
			"Intermediate",
			"B.Tech CSE",
			"Linux & Networking",
			"Cloud Certification",
			"Cloud Engineer"
		]
	}
]


def calculate_match(student, career):
    score = 0

    student_skills = [skill.lower() for skill in student.skills]
    student_interests = [interest.lower() for interest in student.interests]

    career_skills = [skill.lower() for skill in career["skills"]]
    career_interests = [interest.lower() for interest in career["interests"]]

    # Career goal matching
    goal = student.career_goal.lower()
    career_name = career["name"].lower()

    goal_keywords = goal.replace("/", " ").split()
    career_keywords = career_name.replace("/", " ").split()

    if "ai" in goal and "ai" in career_name:
        score += 40
    elif any(word in career_keywords for word in goal_keywords):
        score += 40

    # Skill matching
    for skill in student_skills:
        if skill in career_skills:
            score += 10

    # Interest matching
    for interest in student_interests:
        if interest in career_interests:
            score += 10

    # CGPA matching
    if student.cgpa >= 8.0:
        score += 10
    elif student.cgpa >= 7.0:
        score += 5

    return min(score, 100)


def get_best_career(student):
	best_career = None
	best_score = -1

	for career in CAREERS:
		score = calculate_match(student, career)

		if score > best_score:
			best_score = score
			best_career = career

	return best_career, best_score


def get_colleges(career, education):
	college_map = {
		"AI/ML Engineer": [
			{"name": "IIT Hyderabad", "program": "B.Tech Artificial Intelligence", "fit": "Excellent"},
			{"name": "IIT Ropar", "program": "B.Tech Artificial Intelligence and Data Engineering", "fit": "Strong"},
			{"name": "IIIT Hyderabad", "program": "B.Tech Computer Science and Engineering", "fit": "Strong"}
		],
		"Data Analyst": [
			{"name": "IISc Bengaluru", "program": "Data Science and Analytics", "fit": "Excellent"},
			{"name": "IIT Madras", "program": "BS Data Science", "fit": "Strong"},
			{"name": "Manipal University", "program": "B.Sc. Data Science", "fit": "Strong"}
		]
	}
	default = [
		{"name": "IIT Madras", "program": education or "Computer Science and Engineering", "fit": "Strong"},
		{"name": "NIT Trichy", "program": "Computer Science and Engineering", "fit": "Strong"},
		{"name": "BITS Pilani", "program": "Computer Science", "fit": "Good"}
	]
	return college_map.get(career["name"], default)


def get_skills_to_develop(student, career):
	student_skills = {skill.lower().strip() for skill in student.skills}
	return [skill for skill in career["skills"] if skill.lower() not in student_skills]


def get_scholarships(student, career):
	academic_award = 50000 if student.cgpa >= 9 else 35000 if student.cgpa >= 8 else 20000 if student.cgpa >= 7 else 10000
	category = student.caste.lower().strip()
	matches = [{
		"name": "Merit-Cum-Means Scholarship",
		"amount": academic_award,
		"reason": f"Estimated academic award based on CGPA {student.cgpa:.1f} and family income."
	}]
	if category in {"sc", "st", "obc", "ews"}:
		matches.append({
			"name": f"{student.caste.upper()} Education Support Scheme",
			"amount": 40000,
			"reason": "Category-based government support may apply; verify the official eligibility rules before applying."
		})
	matches.append({
		"name": "National Scholarship Portal opportunities",
		"amount": career["scholarship"],
		"reason": "Potential match for the recommended education pathway; final award depends on application review."
	})
	return matches


def get_loan_recommendation(student, education_cost, scholarship):
	amount_needed = max(education_cost - scholarship - student.budget - student.savings, 0)
	remaining_capacity = max(student.max_loan - student.existing_loans, 0)
	if amount_needed == 0:
		status = "No education loan expected"
	elif remaining_capacity >= amount_needed:
		status = "Within your stated loan limit"
	else:
		status = "Review lower-cost colleges or additional funding"
	if student.cgpa >= 8.5:
		academic_guidance = "Your strong CGPA may improve eligibility for merit-linked education loan concessions; confirm terms with each lender."
	elif student.cgpa >= 7:
		academic_guidance = "Your CGPA supports standard education-loan applications; compare lenders that accept your academic profile."
	else:
		academic_guidance = "Strengthen your academic record where possible and compare lenders with flexible academic eligibility rules."
	return {
		"amount_needed": amount_needed,
		"remaining_capacity": remaining_capacity,
		"status": status,
		"academic_guidance": academic_guidance,
		"note": "Compare interest rates, repayment holidays, collateral, and total repayment before accepting a loan."
	}
