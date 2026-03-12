ADMIN_USERS = {
    "Janki Benkar": "adminjb@1811",
    "Sahil Kayasth": "adminsk@1612"
}

def update_admin_credentials(old_username, new_username, new_password=None):
    import os
    file_path = os.path.abspath(__file__)
    with open(file_path, "r") as f:
        lines = f.readlines()
    
    start_line = -1
    end_line = -1
    for i, line in enumerate(lines):
        if line.startswith("ADMIN_USERS = {"):
            start_line = i
        if start_line != -1 and line.strip() == "}":
            end_line = i
            break
            
    if start_line != -1 and end_line != -1:
        # Import the current state to be safe, though ADMIN_USERS is global
        from app.core.security import ADMIN_USERS as CURRENT_ADMINS
        current_admin_users = CURRENT_ADMINS.copy()
        if old_username in current_admin_users:
            password = current_admin_users.pop(old_username)
            if new_password:
                password = new_password
            current_admin_users[new_username] = password
            
            new_dict_lines = ["ADMIN_USERS = {\n"]
            items = list(current_admin_users.items())
            for i, (k, v) in enumerate(items):
                line = f'    "{k}": "{v}"'
                if i < len(items) - 1:
                    line += ","
                new_dict_lines.append(line + "\n")
            new_dict_lines.append("}\n")
            
            new_lines = lines[:start_line] + new_dict_lines + lines[end_line+1:]
            with open(file_path, "w") as f:
                f.writelines(new_lines)
            return True
    return False

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.models.user import User
from app.core.database import get_db

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(password: str, hashed:str):
    return pwd_context.verify(password, hashed)

SECRET_KEY="SECRET_KEY_CHANGE_LATER"
ALGORITHM="HS256"

def create_access_token(data: dict, expire_minutes=60):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expire_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

class VirtualAdmin:
    def __init__(self, id, username, role):
        self.id = id
        self.username = username
        self.role = role

def get_current_user(
        token: str = Depends(oauth2_scheme), 
        db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        role = payload.get("role")
        
        if user_id == 0 and role == "admin":
            admin_username = payload.get("username", "admin")
            return VirtualAdmin(id=0, username=admin_username, role="admin")

        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        
        return user
    
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")