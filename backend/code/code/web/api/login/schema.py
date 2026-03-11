from pydantic import BaseModel

class UserLoginRequest(BaseModel):
    email: str
    password: str
    
class UserCreateRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str
    
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    
class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    role: str