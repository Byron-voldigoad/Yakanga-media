from PIL import Image
import numpy as np

def remove_solid_background(input_path, output_path, 
                             bg_color, tolerance=30):
    img = Image.open(input_path).convert('RGBA')
    data = np.array(img)
    
    r, g, b = bg_color
    mask = (
        (np.abs(data[:,:,0].astype(int) - r) < tolerance) &
        (np.abs(data[:,:,1].astype(int) - g) < tolerance) &
        (np.abs(data[:,:,2].astype(int) - b) < tolerance)
    )
    data[mask] = [0, 0, 0, 0]
    
    result = Image.fromarray(data)
    result.save(output_path)
    print(f"OK : {output_path}")

# Fond blanc pour logo-noir et logo-couleur
remove_solid_background(
    'public/logo-noir.jpg', 
    'public/logo-noir.png', 
    bg_color=(255, 255, 255),
    tolerance=25
)

remove_solid_background(
    'public/logo-couleur.jpg', 
    'public/logo-couleur.png', 
    bg_color=(255, 255, 255),
    tolerance=25
)

# Fond vert pour logo-vert
remove_solid_background(
    'public/logo-vert.jpg', 
    'public/logo-vert.png', 
    bg_color=(45, 106, 45),
    tolerance=40
)
