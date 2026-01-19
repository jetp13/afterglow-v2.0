from PIL import Image
import os

def create_icon(source_path, output_path, size):
    # Open the source image
    img = Image.open(source_path).convert("RGBA")
    
    # Create a new black square image
    background = Image.new('RGBA', (size, size), (0, 0, 0, 255))
    
    # Calculate position to center the logo
    # Resize logo to fit within the square with some padding
    target_width = int(size * 0.8)
    aspect_ratio = img.height / img.width
    target_height = int(target_width * aspect_ratio)
    
    resized_img = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    x = (size - target_width) // 2
    y = (size - target_height) // 2
    
    # Paste the logo onto the background
    background.paste(resized_img, (x, y), resized_img)
    
    # Save the result
    background.save(output_path)
    print(f"Generated {output_path}")

source_logo = '/home/ubuntu/afterglow/client/public/assets/afterglow-logo.png'
output_dir = '/home/ubuntu/afterglow/client/public/assets/icons'

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

create_icon(source_logo, os.path.join(output_dir, 'icon-192x192.png'), 192)
create_icon(source_logo, os.path.join(output_dir, 'icon-512x512.png'), 512)
