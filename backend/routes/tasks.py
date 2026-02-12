from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from db import get_async_session
from auth.dependencies import get_current_user
from models.task import Task, Priority, Status
from crud.task_crud import (
    get_user_tasks,
    get_user_task_by_id,
    create_task_for_user,
    update_user_task,
    delete_user_task,
    toggle_user_task_completion
)

router = APIRouter(prefix="/api/tasks", tags=["tasks"])

# Pydantic models for request validation
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    priority: Optional[Priority] = Field(None)
    status: Optional[Status] = Field(None)


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    priority: Optional[Priority] = Field(None)
    status: Optional[Status] = Field(None)


class TaskToggleComplete(BaseModel):
    completed: bool


@router.get("/", response_model=List[Task])
async def list_tasks(
    current_user_id: str = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session),
    status: Optional[str] = Query(None, description="Filter by status: all, pending, completed"),
    sort: Optional[str] = Query("created", description="Sort by: created, title")
):
    """
    Get list of tasks for the current user.
    Optionally filter by status (pending/completed/all) and sort.
    """
    completed_filter = None
    if status == "pending":
        completed_filter = False
    elif status == "completed":
        completed_filter = True
    elif status and status != "all":
        raise HTTPException(status_code=422, detail="Status must be 'all', 'pending', or 'completed'")

    tasks = await get_user_tasks(session, current_user_id, completed_filter)

    # Apply sorting
    if sort == "title":
        tasks.sort(key=lambda x: x.title)
    # Default is sort by created date (which is how DB returns them)

    return tasks


@router.post("/", response_model=Task)
async def create_task(
    task_create: TaskCreate,
    current_user_id: str = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Create a new task for the current user.
    """
    # Create a new Task instance
    task = Task(
        title=task_create.title,
        description=task_create.description,
        completed=False  # Default to not completed
    )

    # Use CRUD function to create task for user (automatically assigns user_id)
    created_task = await create_task_for_user(session, current_user_id, task)
    return created_task


@router.get("/{task_id}", response_model=Task)
async def get_task(
    task_id: int,
    current_user_id: str = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Get a specific task by ID for the current user.
    Returns 404 if task doesn't exist or doesn't belong to the user.
    """
    task = await get_user_task_by_id(session, current_user_id, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.put("/{task_id}", response_model=Task)
async def update_task(
    task_id: int,
    task_update: TaskUpdate,
    current_user_id: str = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Update a specific task by ID for the current user.
    Returns 404 if task doesn't exist or doesn't belong to the user.
    """
    # Prepare update data (only include fields that are not None)
    update_data = {}
    if task_update.title is not None:
        update_data['title'] = task_update.title
    if task_update.description is not None:
        update_data['description'] = task_update.description

    # If no fields to update, return 400
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    updated_task = await update_user_task(session, current_user_id, task_id, update_data)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")

    return updated_task


@router.delete("/{task_id}")
async def delete_task(
    task_id: int,
    current_user_id: str = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Delete a specific task by ID for the current user.
    Returns 404 if task doesn't exist or doesn't belong to the user.
    """
    success = await delete_user_task(session, current_user_id, task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")

    return {"message": "Task deleted successfully"}


@router.patch("/{task_id}/complete")
async def toggle_task_complete(
    task_id: int,
    toggle_data: TaskToggleComplete,
    current_user_id: str = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
):
    """
    Toggle the completion status of a specific task for the current user.
    Returns 404 if task doesn't exist or doesn't belong to the user.
    """
    task = await toggle_user_task_completion(session, current_user_id, task_id, toggle_data.completed)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return task