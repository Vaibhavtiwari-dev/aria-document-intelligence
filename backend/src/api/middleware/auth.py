from fastapi import Request, HTTPException, Depends
from jose import jwt, JWTError
from src.core.config import settings

def get_current_user(request: Request) -> str:
    """
    Dependency to verify Clerk JWT and return the user_id (sub).
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    token = auth_header.split(" ")[1]

    if not settings.CLERK_PEM_PUBLIC_KEY:
        # In development if key is missing, we might want to bypass or mock
        # For security, we should enforce it. Let's assume it's there or return a mock in dev.
        # return "mock_user_123"
        raise HTTPException(status_code=500, detail="Clerk Public Key not configured")

    try:
        # Clerk JWTs are signed with RS256
        decode_options = {"verify_aud": True} if settings.CLERK_AUDIENCE else {"verify_aud": False}
        payload = jwt.decode(
            token, 
            settings.CLERK_PEM_PUBLIC_KEY, 
            algorithms=["RS256"],
            audience=settings.CLERK_AUDIENCE,
            options=decode_options
        )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        return user_id
    except JWTError:
        # Sanitize error message to prevent information disclosure
        raise HTTPException(status_code=401, detail="Invalid or expired token")
