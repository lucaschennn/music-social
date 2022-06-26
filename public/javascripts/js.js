const searchWrapper = document.querySelector(".input-group")
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector("list-group");
let num_songs = 0;

inputBox.onkeyup = (e) => {
    let songs = [];
    input = e.target.value;
    if(input) {
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
//top and bottom change to mouseenter and mouseleave or something
searchWrapper.addEventListener("mouseleave", () => {
    document.getElementById("autocom-box").innerHTML = "";
});

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
                buttonCall(e.target.secret);
            });

            console.log(lst[i])
            var text = document.createTextNode(`${lst[i]['trackName']}, ${lst[i]['artistName']}`)
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
function buttonCall(params) {
    if(num_songs >= 5) {
        alert("You have already added five songs! Remove a song to make room for this one.");
        return
    }
    var wrapper = document.createElement("div")
    wrapper.classList.add('col-2')
    wrapper.classList.add('bg-light')

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
    num_songs++;
}
