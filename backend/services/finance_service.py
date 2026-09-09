def calculate_financials(education_cost: int, scholarship: int):
    net_cost = max(education_cost - scholarship, 0)

    return {
        "education_cost": education_cost,
        "scholarship": scholarship,
        "net_cost": net_cost
    }
