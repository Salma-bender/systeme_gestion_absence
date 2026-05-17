from deepface import DeepFace
import numpy as np
import os

EMBEDDING_FILE = "model/embeddings.npy"

# ✅ Même seuil que compare_service
THRESHOLD = 1.15


def load_embeddings():
    if os.path.exists(EMBEDDING_FILE):
        return np.load(EMBEDDING_FILE, allow_pickle=True).tolist()
    return []


def save_embeddings(data):
    os.makedirs(os.path.dirname(EMBEDDING_FILE), exist_ok=True)
    np.save(EMBEDDING_FILE, data)


def register_face(student_id, image_path):
    try:
        embedding = DeepFace.represent(
            img_path=image_path,
            model_name="ArcFace",
            detector_backend="retinaface",
            enforce_detection=True
        )[0]["embedding"]

        data = load_embeddings()

        # ✅ Vérifier si le visage existe déjà
        for item in data:
            stored_embedding = np.array(item["embedding"])
            distance = np.linalg.norm(stored_embedding - np.array(embedding))

            if distance < THRESHOLD:
                return {
                    "success": False,
                    "message": "Visage déjà enregistré"
                }

        # ✅ Sauvegarder le nouvel embedding
        data.append({
            "studentId": student_id,
            "embedding": embedding
        })

        save_embeddings(data)

        return {
            "success": True,
            "message": "Visage enregistré avec succès"
        }

    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }