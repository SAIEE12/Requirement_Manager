from sqlalchemy.orm import Session
from app.crud.skill import create_skill
from app.crud.domain import get_domain_by_name
from app.schemas.skill import SkillCreate

def populate_skills(db: Session):
    skills_by_domain = {
        "Hardware": ["ASIC Design", "PCB Design", "FPGA Programming", "Embedded Systems"],
        "Software": ["Python", "Java", "JavaScript", "C++", "React", "Node.js"],
        "Embedded": ["Firmware Development", "RTOS", "Device Drivers", "Microcontroller Programming"],
        "Automotive": ["AUTOSAR", "CAN Protocol", "Automotive Ethernet", "ISO 26262"]
    }

    for domain_name, skills in skills_by_domain.items():
        domain = get_domain_by_name(db, domain_name)
        if domain:
            for skill_name in skills:
                skill = SkillCreate(name=skill_name, domain_id=domain.id, is_active=True)
                db_skill = create_skill(db, skill)
                if db_skill:
                    print(f"Created skill: {db_skill.name} in domain: {domain_name}")
                else:
                    print(f"Skill {skill_name} already exists in domain {domain_name}")
        else:
            print(f"Domain {domain_name} not found. Skipping skills for this domain.")

def run_skill_population(db: Session):
    print("Populating skills...")
    populate_skills(db)
    print("Skill population completed")