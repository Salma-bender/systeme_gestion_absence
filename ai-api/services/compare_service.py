from deepface import DeepFace
import numpy as np
import os
from utils.image_utils import fix_image_orientation

EMBEDDING_FILE = "model/embeddings.npy"
THRESHOLD = 5


def load_embeddings():
    if os.path.exists(EMBEDDING_FILE):
        return np.load(EMBEDDING_FILE, allow_pickle=True).tolist()
    return []


def scan_classroom(image_path):
    try:
        data = load_embeddings()

        if not data:
            return {"success": False, "message": "Aucun embedding enregistré"}

        # ✅ Corriger l'orientation avant la détection
        fix_image_orientation(image_path)

        detected_students = []

        faces = DeepFace.represent(
            img_path=image_path,
            model_name="ArcFace",
            detector_backend="retinaface",
            enforce_detection=False
        )

        # ✅ Logs de diagnostic
        print(f"[SCAN] Nombre de visages détectés : {len(faces)}")
        for face in faces:
            print(f"[SCAN] Confiance : {face.get('face_confidence', 0):.2f}")

        for face in faces:

            if face.get("face_confidence", 0) < 0.85:
                continue

            embedding = np.array(face["embedding"])
            best_match = None
            best_distance = float("inf")

            for item in data:
                stored_embedding = np.array(item["embedding"])
                distance = np.linalg.norm(stored_embedding - embedding)

                print(f"[SCAN] StudentId: {item['studentId']} → distance: {distance:.4f}")

                if distance < best_distance:
                    best_distance = distance
                    best_match = item

            print(f"[SCAN] Meilleure distance : {best_distance:.4f} → seuil : {THRESHOLD}")

            if best_match and best_distance < THRESHOLD:
                student_id = best_match["studentId"]
                if student_id not in detected_students:
                    detected_students.append(student_id)

        return {
            "success": True,
            "detectedStudents": detected_students
        }

    except Exception as e:
        print(f"[SCAN] Exception : {str(e)}")
        return {"success": False, "message": str(e)}