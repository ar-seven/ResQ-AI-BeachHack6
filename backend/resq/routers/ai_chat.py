from fastapi import APIRouter, Depends, status, HTTPException

router = APIRouter(tags=['rescue chat'])


@router.post('/')
def login():
    return {"working": "yeah"}
