#!/usr/bin/env python3
"""
Script to initialize the database tables.
This should be run once to create the initial schema.
"""

import asyncio
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from db import create_tables


async def init_db():
    print("Creating database tables...")
    await create_tables()
    print("Database tables created successfully!")


if __name__ == "__main__":
    asyncio.run(init_db())