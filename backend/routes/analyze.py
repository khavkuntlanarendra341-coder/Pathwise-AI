from fastapi import APIRouter

from schemas import StudentProfile, CareerResponse
from services.recommendation_service import (
    get_best_career,
    get_colleges,
    get_scholarships,
    get_skills_to_develop,
    get_loan_recommendation,
)
from services.finance_service import calculate_financials

router = APIRouter()


@router.post("/analyze", response_model=CareerResponse)
def analyze_student(student: StudentProfile):

    career, match_score = get_best_career(student)

    financials = calculate_financials(
        career["education_cost"],
        career["scholarship"]
    )

    reasons = []

    reasons.append(
        f"Your profile matches the requirements for {career['name']}."
    )

    if student.skills:
        reasons.append(
            f"Your skills include {', '.join(student.skills)}."
        )

    if student.interests:
        reasons.append(
            f"Your interests include {', '.join(student.interests)}."
        )

    return {
        "career": career["name"],
        "match": match_score,
        "reason": reasons,
        "required_skills": career["skills"],
        "education_path": career["education_path"],
        "education_cost": financials["education_cost"],
        "scholarship": financials["scholarship"],
        "net_cost": financials["net_cost"],
        "salary": career["salary"],
        "career_path": career["career_path"],
        "colleges": get_colleges(career, student.education),
        "skills_to_develop": get_skills_to_develop(student, career),
        "scholarship_matches": get_scholarships(student, career),
        "loan_recommendation": get_loan_recommendation(
            student,
            financials["education_cost"],
            financials["scholarship"]
        )
    }