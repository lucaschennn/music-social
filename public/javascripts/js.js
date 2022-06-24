const searchWrapper = document.querySelector(".input-group")
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector("list-group");

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
                songs[i] = [data[i]['trackName'], data[i]['artistName'], data[i]['trackId']]
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
            tag.href=`/songs-list?add=${lst[i][2]}`
            console.log(lst[i])
            var text = document.createTextNode(`${lst[i][0]}, ${lst[i][1]}`)
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