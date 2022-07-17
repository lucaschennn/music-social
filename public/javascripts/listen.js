
axios
.get("/song-moods")
.then(res => {
    displaySong(res.data)
})
.catch(error => {
    console.error(error);
})

function displaySong(data) {

    const songs = JSON.parse(data).songs

    const song = songs[Math.floor(Math.random() * songs.length)];

    $('#song-wrapper h5').html(song['trackName'])
    $('#song-wrapper h6.text-muted').html(song['artistName'])
    $('#song-wrapper img').attr("src", song['artworkUrl100'])
}

/*
    axios
        .patch("/song-moods", {
            "songid": 1441133277,
            "moods": ["relaxed", "sad", "joy"]
        })
        .catch(error => {
            console.error(error.message)
          })
**/