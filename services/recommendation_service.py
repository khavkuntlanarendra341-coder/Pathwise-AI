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

    student_skills = [
        skill.lower()
        for skill in student.skills
    ]

    student_interests = [
        interest.lower()
        for interest in student.interests
    ]

    career_skills = [
        skill.lower()
        for skill in career["skills"]
    ]

    career_interests = [
        interest.lower()
        for interest in career["interests"]
    ]

    for skill in student_skills:
        if skill in career_skills:
            score += 15

    for interest in student_interests:
        if interest in career_interests:
            score += 15

    if student.marks >= 80:
        score += 10
    elif student.marks >= 60:
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