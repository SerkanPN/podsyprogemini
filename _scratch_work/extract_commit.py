import re

with open('git_search_aiclone_pages_utf8.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

current_commit = ""
for line in lines:
    if line.startswith("commit "):
        current_commit = line.strip()
    if "+  const estMonthlyViews" in line:
        print("FOUND IN:", current_commit)
