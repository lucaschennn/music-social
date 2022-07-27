const searchWrapper = document.getElementById("song-input")
const inputBox = searchWrapper.querySelector("#song-search");
const suggBox = searchWrapper.querySelector("#autocom-box");

let num_songs = 0;
let songs_list = [];
inputBox.onkeyup = (e) => updateSearch(e);
inputBox.addEventListener("click", (e) => updateSearch(e));
//top and bottom change to mouseenter and mouseleave or something
searchWrapper.addEventListener("mouseleave", () => {
    document.getElementById("autocom-box").innerHTML = "";
});

function updateSearch(e) {
    console.log(inputBox)
    let songs = [];
    input = e.target.value;
    if(input.length >= 2) {
        axios
        .get("/songs-list", {params: {"term":input}})
        .then(res => {
            console.log(res['data'])
            data = res['data']['results']
            for(var i = 0; i < data.length; i++) {
                songs[i] = data[i]
            }
            showSuggestions(songs);
        })
        .catch(error => {
            console.error(error);
        })
    }
}

function showSuggestions(lst) {
    let listData;
    const list = document.createElement("li");

    document.getElementById("autocom-box").innerHTML = "";
    if(lst) {
        for(var i = 0; i < lst.length; i++) {
            var tag = document.createElement("a");
            tag.classList.add('list-group-item')
            tag.classList.add('list-group-item-action')
            tag.style.cursor = "pointer";
            tag.secret = lst[i];
            tag.addEventListener("click", (e) => {
                console.log(e.target.secret)
                for(let i = 0; i < songs_list.length; i++) {
                    if(songs_list[i]['trackId'] == e.target.secret['trackId']) {
                        console.log("song already added")
                        return
                    }
                }
                addSong(e.target.secret);
            });

            console.log(lst[i])
            var text = document.createTextNode(`  ${lst[i]['trackName']}, ${lst[i]['artistName']}`)
            var cover = document.createElement("img");
            cover.src = lst[i]['artworkUrl30'];
            tag.appendChild(cover)
            tag.appendChild(text);
            document.getElementById("autocom-box").appendChild(tag);
        }
        searchWrapper.querySelector(".list-group-item").addEventListener("click", (e) => {
            console.log(e.target)
        })
        //listData = lst.join('');
        //suggBox.innerHTML = listData;
    }
}


$(document).ready(function() {
    $('#do-mood-search').on("click", (e) => {
        $('#do-mood-search').addClass("active")
        $('#do-song-search').removeClass("active")

        $('#mood-input').removeClass("d-none")
        $('#song-input').addClass("d-none")

    })
    $('#do-song-search').on("click", (e) => {
        $('#do-song-search').addClass("active")
        $('#do-mood-search').removeClass("active")


        $('#song-input').removeClass("d-none")
        $('#mood-input').addClass("d-none")
        $('#mood-sugg').empty()
    })
})




function millisToMins(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

function addSong(params) {
    if(num_songs >= 5) {
        alert("You have already added five songs! Remove a song to make room for this one.");
        return
    }
    var wrapper = document.createElement("div")
    wrapper.classList.add('col-2')
    wrapper.classList.add('bg-light')
    wrapper.classList.add('song-present')
    wrapper.setAttribute('id', params['trackId'])
    wrapper.addEventListener("click", (e) => {
        $("#infoModal").modal('show');
        $("#infoModal .modal-title").html(` ${params['trackName']} by ${params['artistName']}`)

        let date = new Date(params['releaseDate']);
        let content = `Album: ${params['collectionName']} <br> Release: ${date.toDateString()}
            <br> Length: ${millisToMins(params['trackTimeMillis'])}`
        $("#infoModal .modal-body").html(content)
        $("#infoModal .modal-body").append()

        $("#previewAudio").attr("src", params['previewUrl'])
        document.getElementById("previewAudio").volume = .1

        $('#previewBtn').on("click", (e) => {
            if($('#previewBtn').html() == "Preview Song") {
                document.getElementById("previewAudio").play()
                $('#previewBtn').html("Stop Preview")
            }
            else {
                document.getElementById("previewAudio").pause()
                document.getElementById("previewAudio").currentTime = 0
                $('#previewBtn').html("Preview Song")
            }

        })

        $('#removeBtn').html("Remove Song")
        $('#removeBtn').on("click", (e) => {
            if($(`#${params['trackId']}`)) {
                $(`#${params['trackId']}`).remove();
                let victim = songs_list.indexOf(params);
                if (victim > -1) {
                    songs_list.splice(victim);
                    num_songs--;
                }

            }

            if(num_songs <= 0) {
                showSubmitButton(false);
            }
        })
    })
    const img_src = params['artworkUrl100'];
    var tag = document.createElement("img");
    tag.src = img_src;

    const song = params['trackName'];
    var song_tag = document.createElement("h5");
    var text = document.createTextNode(`${song}`)
    song_tag.appendChild(text);

    const artist = params['artistName'];
    var artist_tag = document.createElement("h6");
    artist_tag.classList.add('text-muted');
    var a_text = document.createTextNode(`${artist}`);
    artist_tag.append(a_text)

    wrapper.appendChild(tag)
    wrapper.appendChild(song_tag)
    wrapper.appendChild(artist_tag)
    document.getElementById("song-picks").appendChild(wrapper);

    showSubmitButton(true);
    
    songs_list.push(params);
    num_songs++;
}

function showSubmitButton(toshow) {
    if(toshow) {
        $('#submitBtn').removeClass('d-none')
    }
    else {
        $('#submitBtn').addClass('d-none')
    }
}

$('#submitBtn').on('click', () => submitEntry(songs_list));

//callback for submit button click
function submitEntry(songs) {
    //1. put current entry into object
    //2. call /api/user/idk USER IS DB ENDPOINTS AND STUFF
    const cur_time = new Date().getTime()
    const text_entry = $("#form-content").val()

    axios.get("")
    axios
        .patch("http://localhost:3000/users/update-songs", {
            songs: songs, time: cur_time, description: text_entry
        })
        .catch(error => {
            console.error(error.message)
          })
    window.location.reload();
    alert("Songs successfully added!")

}

$('#text-btn').on('click', (e) => {
    if($('#text-box').hasClass('d-none')) {
        $('#text-box').removeClass('d-none')
        $('#text-btn').html("Remove text")
    }
    else {
        $('#text-box').addClass('d-none')
        $('#text-btn').html("Add optional text")
        $('#form-content').val("")
    }
})

$('.btn-outline-primary.mood-btn').each((index, value) => {
    $(value).on("click", (e) => {
        moodz = []
        $('.btn-outline-primary').each((index, i_value) => {
            if($(i_value).children().is(':checked')) {
                $('#dyn-text').append(" " + i_value.id)
                moodz.push(i_value.id)
            }
        })
        console.log(moodz)
        if(moodz.length) {
            axios
            .get("/song-moods", {params: {"moods": moodz}})
            .then(res => {
                $('#mood-sugg').empty()
                showMoodSuggestions(res.data)
            })
        }
    })

})

function showMoodSuggestions(data) {
    for(const [i1, key] of Object.keys(data).sort().reverse().entries()) {
        for(const [i2, song] of data[key].entries()) {
            console.log(song)
            let wrapper = $(`<div id=sugg-${i1}-${i2} class='col'> </div>`)
            let img = $(`<img src=${song['artworkUrl60']}>`) //if too big do 30
            let text = $(`<p><strong>${song['trackName']}</strong>
                                <br> ${song['artistName']}
                            </p>`)
            wrapper.append(img)
            wrapper.append(text)
    
            $('#mood-sugg').append(wrapper)
            let $moodModal = $("#infoModal").clone();
            $moodModal.attr("id", "moodModal")
            $moodModal.find("#removeBtn").attr("id", "addBtn")
            wrapper.on("click", (e) => {
                $moodModal.modal('show')
                $("#moodModal .modal-title").html(` ${song['trackName']} by ${song['artistName']}`)

                let date = new Date(song['releaseDate']);
                let content = `Album: ${song['collectionName']} <br> Release: ${date.toDateString()}
                    <br> Length: ${millisToMins(song['trackTimeMillis'])}`
                $("#moodModal .modal-body").html(content)
                $("#moodModal .modal-body").append()

                $("#moodModal #previewAudio").attr("src", song['previewUrl'])
                $("#moodModal #previewAudio")[0].volume = .1 //problem line
        
                $('#moodModal #previewBtn').on("click", (e) => {
                    if($('#moodModal #previewBtn').html() == "Preview Song") {
                        $("#moodModal #previewAudio")[0].play()//problem line
                        $('#moodModal #previewBtn').html("Stop Preview")
                    }
                    else {
                        $("#moodModal #previewAudio")[0].pause()//problem line
                        document.getElementById("previewAudio").currentTime = 0
                        $('#moodModal #previewBtn').html("Preview Song")
                    }
        
                })

            })
            $moodModal.find('#addBtn').html("Add Song")
            $moodModal.find('#addBtn').on("click", (e) => {
                for(let i = 0; i < songs_list.length; i++) {
                    if(songs_list[i]['trackId'] == song['trackId']) {
                        console.log("song already added")
                        return
                    }
                }
                addSong(song)
            })
        }

    }
}