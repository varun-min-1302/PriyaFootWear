import os

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content.replace('text-[10px]', 'text-xs').replace('text-[9px]', 'text-xs')
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

def process_directory(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                replace_in_file(os.path.join(root, file))

process_directory(r'c:\Users\VARUN\OneDrive\Desktop\PriyaFootWear\src')
print("Done.")
