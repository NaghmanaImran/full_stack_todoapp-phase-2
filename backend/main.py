from fastapi import FastAPI
import routes.tasks  # Import the tasks router

app = FastAPI()

# Include the tasks router
app.include_router(routes.tasks.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)