from pydantic import BaseModel, Field


class StudentProfile(BaseModel):
    education: str
    cgpa: float = Field(..., ge=0, le=10)
    skills: list[str]
    interests: list[str]
    career_goal: str
    budget: float
    caste: str = "General"
    family_income: float = 0
    savings: float = 0
    existing_loans: float = 0
    max_loan: float = 0


class CareerResponse(BaseModel):
    career: str
    match: int
    reason: list[str]
    required_skills: list[str]
    education_path: str
    education_cost: float
    scholarship: float
    net_cost: float
    salary: str
    career_path: list[str]
    colleges: list[dict]
    skills_to_develop: list[str]
    scholarship_matches: list[dict]
    loan_recommendation: dict