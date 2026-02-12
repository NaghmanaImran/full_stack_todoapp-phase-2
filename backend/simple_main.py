from fastapi import FastAPI
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Simple startup event, no database initialization for now
    print("Backend started successfully")
    yield

app = FastAPI(lifespan=lifespan)

@app.get("/")
def read_root():
    return {"Hello": "Todo App Backend", "status": "running"}

# Simple task API for testing
@app.get("/api/tasks")
def get_tasks():
    return [{"id": 1, "title": "Sample task", "completed": False}]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)