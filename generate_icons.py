import os
import struct
import zlib

def make_png(width, height, bg_rgb, fg_rgb):
    # PNG signature
    png_sig = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data)
    ihdr_chunk = struct.pack('>I', 13) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)

    # Raw image data (RGB)
    raw_data = bytearray()
    
    center_x, center_y = width / 2, height / 2
    radius = min(width, height) * 0.38
    
    for y in range(height):
        raw_data.append(0) # filter type 0
        for x in range(width):
            # Draw rounded circle icon in center
            dx = x - center_x
            dy = y - center_y
            dist = (dx*dx + dy*dy) ** 0.5
            
            # Checkmark diagonal line test or circle
            is_check = (abs(dx + dy * 0.5) < width * 0.08 and abs(dx * 0.5 - dy) < height * 0.15) or (dist < radius)
            
            if is_check and (dist < radius):
                raw_data.extend(fg_rgb)
            else:
                raw_data.extend(bg_rgb)

    # IDAT chunk
    compressed_data = zlib.compress(raw_data)
    idat_crc = zlib.crc32(b'IDAT' + compressed_data)
    idat_chunk = struct.pack('>I', len(compressed_data)) + b'IDAT' + compressed_data + struct.pack('>I', idat_crc)

    # IEND chunk
    iend_crc = zlib.crc32(b'IEND')
    iend_chunk = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)

    return png_sig + ihdr_chunk + idat_chunk + iend_chunk

os.makedirs('assets', exist_ok=True)

# Emerald green background (#0F172A = 15, 23, 42), Emerald green logo (#10B981 = 16, 185, 129)
bg = (15, 23, 42)
fg = (16, 185, 129)

with open('assets/icon-192.png', 'wb') as f:
    f.write(make_png(192, 192, bg, fg))

with open('assets/icon-512.png', 'wb') as f:
    f.write(make_png(512, 512, bg, fg))

with open('assets/icon.png', 'wb') as f:
    f.write(make_png(512, 512, bg, fg))

with open('assets/favicon.png', 'wb') as f:
    f.write(make_png(64, 64, bg, fg))

with open('assets/splash.png', 'wb') as f:
    f.write(make_png(512, 512, bg, fg))

print("Successfully generated all PNG icon assets!")
