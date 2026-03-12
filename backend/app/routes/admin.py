from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User, BusinessListing
from app.core.security import get_current_user

router = APIRouter(prefix="/admin", tags=["Admin"])

def admin_only(user = Depends(get_current_user)):

    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access only.")
    return user

#=============== GET ALL BUSINESSES FOR APPROVAL ONLY ===============#
@router.get("/businesses")
def get_all_businesses( db: Session = Depends(get_db), admin = Depends(admin_only)):
    return (
        db.query(BusinessListing)
        .filter(BusinessListing.status == "pending")
        .all()
        )

#=============== APPROVE / REJECT BUSINESSES ===============#
@router.put("/business/{business_id}/{status}")
def update_business_status(
    business_id: int,
    status: str,
    db: Session = Depends(get_db),
    admin = Depends(admin_only)
):
    if status not in ["approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status.")
    
    business = db.query(BusinessListing).filter(BusinessListing.id == business_id).first()

    if not business:
        raise HTTPException(status_code=404, detail="Business not found.")
    
    business.status = status
    if admin.id != 0:
        business.approved_by = admin.id
        
    db.commit()
    db.refresh(business)

    return {
        "message": f"Business {status} successfully.",
        "business_id": business_id,
        "status": status
    }

#=============== GET ALL USERS ===============#
@router.get("/users")
def get_all_users(db: Session = Depends(get_db), admin = Depends(admin_only)):
    return db.query(User).all()

#=============== DELETE USER ===============#
@router.delete("/user/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), admin = Depends(admin_only)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    
    # Prevent self-deletion
    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="Admins cannot delete themselves.")

    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully.", "user_id": user_id}
