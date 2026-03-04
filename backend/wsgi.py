"""
ASGI entry point for production deployments.
Use with: gunicorn -w 4 -k uvicorn.workers.UvicornWorker wsgi:app
"""
from app.main import app

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=False,
        workers=4,
    )
