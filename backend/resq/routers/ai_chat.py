from fastapi import APIRouter, Depends, status, HTTPException

router = APIRouter(tags=['rescue chat'])


@router.post('/')
def ai_chat():
    return {"working": "yeah"}
