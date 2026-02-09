import os
import re

def is_emoji(char):
    code = ord(char)
    return (
        0x1F300 <= code <= 0x1F5FF or  # Misc Symbols and Pictographs
        0x1F900 <= code <= 0x1F9FF or  # Supplemental Symbols and Pictographs
        0x1F600 <= code <= 0x1F64F or  # Emoticons
        0x1F680 <= code <= 0x1F6FF or  # Transport and Map Symbols
        0x2700 <= code <= 0x27BF or    # Dingbats
        0x2600 <= code <= 0x26FF       # Misc Symbols
    )

def scan_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    found = False
    for i, line in enumerate(lines):
        for char in line:
            if is_emoji(char):
                print(f"Found emoji '{char}' in {filepath}:{i+1}")
                print(f"Line content: {line.strip()}")
                found = True
                break # One per line is enough to flag

root_dir = '/home/ubuntu/afterglow/client/public'
for subdir, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith('.html'):
            scan_file(os.path.join(subdir, file))
