from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from typing import Optional
import httpx
import os
from datetime import datetime

# Initialize the security scheme
security = HTTPBearer()

# Get the JWKS URL from environment variable
BASE_URL = os.getenv("NEXT_PUBLIC_BASE_URL", "http://localhost:3000")
JWKS_URL = f"{BASE_URL}/api/auth/jwks"

# Cache for JWKS to avoid repeated requests
_cached_jwks = None
_cached_jwks_timestamp = None


async def get_jwks():
    """Fetch JWKS from the auth provider with caching"""
    global _cached_jwks, _cached_jwks_timestamp
    
    import time
    current_time = time.time()
    
    # Refresh cache every 5 minutes
    if (_cached_jwks is None or 
        _cached_jwks_timestamp is None or 
        current_time - _cached_jwks_timestamp > 300):
        
        async with httpx.AsyncClient() as client:
            response = await client.get(JWKS_URL)
            response.raise_for_status()
            _cached_jwks = response.json()
            _cached_jwks_timestamp = current_time
    
    return _cached_jwks


async def verify_token(token: str) -> dict:
    """Verify the JWT token and return the payload"""
    try:
        # Get the JWKS
        jwks = await get_jwks()
        
        # Find the signing key
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get('kid')
        
        signing_key = None
        for key in jwks['keys']:
            if key['kid'] == kid:
                signing_key = key
                break
        
        if not signing_key:
            raise HTTPException(status_code=401, detail="Invalid token: signing key not found")
        
        # Decode and verify the token
        payload = jwt.decode(
            token,
            signing_key,
            algorithms=["RS256"],
            audience=BASE_URL,  # Verify the audience
            issuer=BASE_URL,    # Verify the issuer
        )
        
        return payload
    
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {str(e)}")


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """
    Dependency to get the current user ID from the JWT token.
    Returns the user ID (sub) from the token.
    """
    token = credentials.credentials
    payload = await verify_token(token)
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token: no user ID found")
    
    return user_id