from sqlalchemy import Column, Integer, String, Text
from database import Base


class Career(Base):
    __tablename__ = "careers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    required_skills = Column(Text)
    education_path = Column(Text)
    education_cost = Column(Integer)
    expected_salary = Column(String(50))


class Scholarship(Base):
    __tablename__ = "scholarships"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    description = Column(Text)
    amount = Column(Integer)
    eligibility = Column(Text)
    deadline = Column(String(50))