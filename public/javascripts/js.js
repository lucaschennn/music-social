const searchWrapper = document.querySelector(".input-group")
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector("list-group");
let num_songs = 0;
//function $(x) {return document.getElementById(x);} 


inputBox.onkeyup = (e) => updateSearch(e);
inputBox.addEventListener("click", (e) => updateSearch(e));
//top and bottom change to mouseenter and mouseleave or something
searchWrapper.addEventListener("mouseleave", () => {
    document.getElementById("autocom-box").innerHTML = "";
});

function updateSearch(e) {
    let songs = [];
    input = e.target.value;
    if(input.length > 2) {
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

        $('#removeBtn').on("click", (e) => {
            if($(`#${params['trackId']}`)) {
                $(`#${params['trackId']}`).remove();
            }
            num_songs--;
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