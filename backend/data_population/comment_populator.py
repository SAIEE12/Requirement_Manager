from sqlalchemy.orm import Session
from app.models import Requirement, Comment, User
from app.schemas.comment import CommentCreate
import random
from datetime import datetime, timedelta

def populate_comments(db: Session):
    requirements = db.query(Requirement).all()
    users = db.query(User).all()
    
    if not requirements or not users:
        print("No requirements or users found. Make sure to populate them first.")
        return

    for requirement in requirements:
        num_comments = random.randint(0, 5)
        for _ in range(num_comments):
            comment = Comment(
                content=f"Sample comment for requirement {requirement.id}",
                requirement_id=requirement.id,
                user_id=random.choice(users).id
            )
            db.add(comment)
    
    db.commit()
    print(f"Populated comments for {len(requirements)} requirements")

def run_comment_population(db: Session):
    print("Populating comments...")
    populate_comments(db)
    print("Comment population completed")
