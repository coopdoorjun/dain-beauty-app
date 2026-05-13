from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

# 통신 허용 설정 (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    username: str
    pin: str

@app.post("/login")
async def login(data: LoginRequest):
    if data.username == "user1" and data.pin == "1111":
        return {"success": True, "message": "로그인 성공!", "user": "user1"}
    raise HTTPException(status_code=401, detail="아이디 또는 PIN이 틀렸습니다.")

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
