import json
import requests
from difflib import SequenceMatcher


def getSongObj(track, artist):
    res = requests.get("https://itunes.apple.com/search", params = {
        "media": "music",
        "limit": 10,
        "term": track
    })
    try:
        res = res.json()
    except:
        print(f"Messed up at track {track} by {artist}")
        return "API NULL RESPONSE"

    for i in range(0, len(res["results"])):
        res_track = res["results"][i]
        track_sim = SequenceMatcher(None, track, res_track["trackName"])
        artist_sim = SequenceMatcher(None, artist, res_track["artistName"])
        if track_sim.ratio() > .5 and artist_sim.ratio() > .5:
            res_track["moods"] = {}
            return res_track


def writeToFile(os, obj):
    if(obj == "API NULL RESPONSE"):
        return
    output = open(os)
    jsonOutput = json.loads(output.read())
    if obj not in jsonOutput["songs"]:
        jsonOutput["songs"].append(obj)
    output.close()

    output = open(os, "w")
    output.write(json.dumps(jsonOutput))
    output.close()



f = open("songs.json", "r")
jsonObj = json.loads(f.read())


#to revert mood_catalog.json, copy paste {"songs": []}
for song in jsonObj["data"]:
    writeToFile("mood_catalog.json", getSongObj(song["songTitle"], song["artistTitle"]))