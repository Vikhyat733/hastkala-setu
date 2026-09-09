from fastapi import APIRouter

router = APIRouter()


@router.get("/inquiries")
def list_inquiries():
    return {"message": "Buyer inquiries placeholder", "inquiries": []}
