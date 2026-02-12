from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from models.task import Task, Status


async def get_user_tasks(
    session: AsyncSession,
    user_id: str,
    completed: Optional[bool] = None,
    status: Optional[Status] = None,
    priority: Optional[str] = None
) -> List[Task]:
    """
    Retrieve tasks for a specific user with optional filters.
    Implements basic ownership enforcement by filtering by user_id.
    """
    query = select(Task).where(Task.user_id == user_id)

    if completed is not None:
        query = query.where(Task.completed == completed)

    if status is not None:
        query = query.where(Task.status == status)

    if priority is not None:
        query = query.where(Task.priority == priority)

    result = await session.exec(query)
    return result.all()


async def get_user_task_by_id(session: AsyncSession, user_id: str, task_id: int) -> Optional[Task]:
    """
    Retrieve a specific task for a user by ID.
    Implements ownership enforcement by ensuring the task belongs to the user.
    """
    query = select(Task).where(Task.user_id == user_id).where(Task.id == task_id)
    result = await session.exec(query)
    return result.first()


async def create_task_for_user(session: AsyncSession, user_id: str, task: Task) -> Task:
    """
    Create a new task for a specific user.
    Automatically assigns the user_id to enforce ownership.
    """
    task.user_id = user_id
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task


async def update_user_task(session: AsyncSession, user_id: str, task_id: int, update_data: dict) -> Optional[Task]:
    """
    Update a task for a specific user.
    Implements ownership enforcement by ensuring the task belongs to the user.
    """
    task = await get_user_task_by_id(session, user_id, task_id)
    if not task:
        return None

    # Update task attributes
    for key, value in update_data.items():
        if hasattr(task, key):
            setattr(task, key, value)

    await session.commit()
    await session.refresh(task)
    return task


async def delete_user_task(session: AsyncSession, user_id: str, task_id: int) -> bool:
    """
    Delete a task for a specific user.
    Implements ownership enforcement by ensuring the task belongs to the user.
    """
    task = await get_user_task_by_id(session, user_id, task_id)
    if not task:
        return False

    await session.delete(task)
    await session.commit()
    return True


async def toggle_user_task_completion(session: AsyncSession, user_id: str, task_id: int, completed: bool) -> Optional[Task]:
    """
    Toggle the completion status of a task for a specific user.
    Implements ownership enforcement by ensuring the task belongs to the user.
    Updates both the 'completed' boolean and 'status' field appropriately.
    """
    task = await get_user_task_by_id(session, user_id, task_id)
    if not task:
        return None

    # Update both the completed field and status
    task.completed = completed
    task.status = Status.completed if completed else Status.pending
    # Don't manually set updated_at - let the DB trigger handle it

    await session.commit()
    await session.refresh(task)
    return task