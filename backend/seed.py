from database import Base, engine, SessionLocal
from models import Career, Scholarship
from services.recommendation_service import CAREERS


SCHOLARSHIPS = [
    {
        "name": "National Scholarship Portal",
        "description": "Government scholarship opportunities for eligible students.",
        "amount": 50000,
        "eligibility": "Depends on scholarship scheme and student eligibility.",
        "deadline": "Check official portal"
    },
    {
        "name": "AICTE Pragati Scholarship",
        "description": "Scholarship support for eligible students pursuing technical education.",
        "amount": 50000,
        "eligibility": "Eligible technical education students.",
        "deadline": "Check official portal"
    },
    {
        "name": "Tata Capital Pankh Scholarship",
        "description": "Financial assistance for eligible students pursuing higher education.",
        "amount": 50000,
        "eligibility": "Based on academic and financial criteria.",
        "deadline": "Check official announcement"
    },
    {
        "name": "HDFC Bank Parivartan Scholarship",
        "description": "Educational financial support for eligible students.",
        "amount": 75000,
        "eligibility": "Based on academic and financial criteria.",
        "deadline": "Check official announcement"
    },
    {
        "name": "Reliance Foundation Scholarship",
        "description": "Scholarship support for selected undergraduate students.",
        "amount": 200000,
        "eligibility": "Based on academic and other eligibility criteria.",
        "deadline": "Check official announcement"
    }
]


def seed_database():

    # Create database tables
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Add careers
        existing_careers = db.query(Career).count()

        if existing_careers == 0:

            for career in CAREERS:

                new_career = Career(
                    name=career["name"],
                    description=f"Career opportunity in {career['name']}.",
                    required_skills=", ".join(career["skills"]),
                    education_path=career["education_path"],
                    education_cost=career["education_cost"],
                    expected_salary=career["salary"]
                )

                db.add(new_career)

        # Add scholarships
        existing_scholarships = db.query(Scholarship).count()

        if existing_scholarships == 0:

            for scholarship in SCHOLARSHIPS:

                new_scholarship = Scholarship(
                    name=scholarship["name"],
                    description=scholarship["description"],
                    amount=scholarship["amount"],
                    eligibility=scholarship["eligibility"],
                    deadline=scholarship["deadline"]
                )

                db.add(new_scholarship)

        db.commit()

        print("Database seeded successfully!")
        print(f"Careers: {db.query(Career).count()}")
        print(f"Scholarships: {db.query(Scholarship).count()}")

    except Exception as e:

        db.rollback()
        print("Error while seeding database:")
        print(e)

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()