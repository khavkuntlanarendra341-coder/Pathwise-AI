# API Contract

## Endpoint
`POST /analyze`

### Request Body
```json
{
  "education": "string",
  "marks": 0,
  "skills": [],
  "interests": [],
  "career_goal": "string",
  "budget": 0,
  "caste": "General",
  "family_income": 0,
  "savings": 0,
  "existing_loans": 0,
  "max_loan": 0
}

{
  "career": "string",
  "match": 0,
  "reason": [],
  "education_cost": 0,
  "scholarship": 0,
  "net_cost": 0,
  "salary": "string",
  "skills_to_develop": [],
  "colleges": [],
  "scholarship_matches": [],
  "loan_recommendation": {}
}
