from PIL import Image
import io

def fix_image_orientation(image_path):
    """
    Corrige l'orientation EXIF des images venant du téléphone.
    Les photos mobiles sont souvent tournées de 90°.
    """
    try:
        img = Image.open(image_path)
        
        # Lire les données EXIF
        exif = img._getexif()
        
        if exif:
            orientation = exif.get(274)  # 274 = tag orientation EXIF
            
            rotations = {
                3: 180,
                6: 270,
                8: 90
            }
            
            if orientation in rotations:
                img = img.rotate(rotations[orientation], expand=True)
        
        # Sauvegarder l'image corrigée
        img.save(image_path, quality=95)
        img.close()
        
    except Exception:
        pass  # Si pas d'EXIF, on laisse l'image telle quelle