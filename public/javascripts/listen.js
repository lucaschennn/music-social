let cur_song = {}
let moodz = []

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
    cur_song = song
    $('#song-wrapper h5').html(song['trackName'])
    $('#song-wrapper h6.text-muted').html(song['artistName'])
    $('#song-wrapper #cover').attr("src", song['artworkUrl100'])

    $('#previewAudio').attr("src", song['previewUrl'])
    $('#previewAudio')[0].volume = $('#volume')[0].value * .01
}


$('.btn-mood-select').each((index, value) => {
    $(value).on("click", (e) => {
        $('#dyn-text').text("This song makes me feel")
        moodz = []
        $('.btn-outline-primary').each((index, i_value) => {
            if($(i_value).children().is(':checked')) {
                $('#dyn-text').append(" " + i_value.id)
                moodz.push(i_value.id)
            }
        })
        console.log(moodz)
        if(moodz.length) {
            $('#submit-btn').removeClass("d-none")
        }
        else {
            $('#submit-btn').addClass("d-none")
        }

    })
    console.log($(value).children().is(':checked'))
})

$('#submit-btn').on("click", (e) => {
    axios
        .patch("/song-moods", {
            "songid": cur_song.trackId,
            "moods": moodz
        })
        .catch(error => {
            console.error(error.message)
        })
    window.location.reload();
})

$('#play-btn').on("click", (e) => {
    if($('#play-btn').attr("state") == "playing") {
        document.getElementById("previewAudio").pause()
        $('#play-btn').attr("state", "paused")
        $('#play-btn-img').attr("src", './images/play_button.ico')
    }
    else {
        document.getElementById("previewAudio").play()
        $('#play-btn').attr("state", "playing")
        $('#play-btn-img').attr("src", './images/pause_button.ico')
    }
/*
    if($('#previewBtn').html() == "Preview Song") {
        document.getElementById("previewAudio").play()
        $('#previewBtn').html("Stop Preview")
    }
    else {
        document.getElementById("previewAudio").pause()
        document.getElementById("previewAudio").currentTime = 0
        $('#previewBtn').html("Preview Song")
    }
    **/
})

$('#volume').on("input", () => {
    //$('#volume')[0] equivalent to document.getElementById("volume")
    $('#previewAudio')[0].volume = $('#volume')[0].value * .01
})

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