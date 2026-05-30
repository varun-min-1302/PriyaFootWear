import os
import re

replacements = {
    r'text-5xl sm:text-6xl lg:text-7xl': 'text-fluid-hero',
    r'text-4xl sm:text-5xl lg:text-6xl': 'text-fluid-h1',
    r'text-4xl sm:text-5xl md:text-6xl': 'text-fluid-h1',
    r'text-4xl sm:text-5xl': 'text-fluid-h2',
    r'text-3xl sm:text-4xl md:text-5xl': 'text-fluid-h2',
    r'text-3xl sm:text-4xl': 'text-fluid-h3',
}

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for pattern, replacement in replacements.items():
        new_content = re.sub(pattern, replacement, new_content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

def process_directory(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx'):
                replace_in_file(os.path.join(root, file))

process_directory(r'c:\Users\VARUN\OneDrive\Desktop\PriyaFootWear\src')
print("Done.")
