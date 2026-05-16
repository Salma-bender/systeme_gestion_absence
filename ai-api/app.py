from fastapi import FastAPI, UploadFile, File
from services.face_embedding_service import register_face
from services.compare_service import scan_classroom

import shutil
import os

app = FastAPI()

TEMP_FOLDER = "temp"

if not os.path.exists(TEMP_FOLDER):
    os.makedirs(TEMP_FOLDER)


# ==========================================
# REGISTER STUDENT FACE
# ==========================================

@app.post("/register-face")
async def register(student_id: str, file: UploadFile = File(...)):

    temp_path = f"{TEMP_FOLDER}/{student_id}.jpg"

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = register_face(student_id, temp_path)

    os.remove(temp_path)

    return result


# ==========================================
# SCAN CLASSROOM
# ==========================================

@app.post("/scan-classroom")
async def scan(file: UploadFile = File(...)):

    temp_path = f"{TEMP_FOLDER}/classroom.jpg"

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = scan_classroom(temp_path)

    os.remove(temp_path)

    return result