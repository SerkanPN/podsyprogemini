import json
with open('C:/Users/Administrator/.gemini/antigravity/brain/ef471977-9b9f-40be-9bad-98cc4319a84d/.system_generated/logs/transcript_full.jsonl', 'r', encoding='utf-8') as f:
    lines = f.readlines()
matches = [json.loads(line) for line in lines if '\"USER_INPUT\"' in line and 'media__' in line]
with open('user_images.json', 'w', encoding='utf-8') as f:
    json.dump(matches, f, indent=2)
