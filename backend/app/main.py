import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import chaos, remediate
from app.config import settings

app = FastAPI(title="Aegis API")

# We use this regex to whitelist dynamic Cloud Run URLs and localhost, solving the CORS issues we faced during deployment.
origins_regex = r"https://.*\.run\.app|http://localhost:\d+"

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=origins_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chaos.router)
app.include_router(remediate.router)

@app.get("/")
def health_check():
    # We added this mode check to easily verify if we are hitting the Production DB or the Demo mocks.
    return {"status": "Aegis Online", "mode": "DEMO_MODE" if settings.DEMO_MODE else "PROD"}