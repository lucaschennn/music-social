import json

f = open("mood_catalog.json", 'r')

a = json.load(f)

print(len(a["songs"]))

f.close()