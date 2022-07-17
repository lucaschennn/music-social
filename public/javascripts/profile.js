window.onload = () => {
    axios.get("/user_profile")
    .then(res => {
        postData(res.data)
    })
}

function postData(data) {
    let email = data.email
    axios
    .get(`/users/email/${email}`)
    .then(res => {
        var posts = res.data.data.posts;
        return posts
    })
    .then(res => { // res equals posts
        for (let i = JSON.parse(res).length - 1; i >= 0; i--) {
            createPost(JSON.parse(res)[i], i)
        }
    })
    .catch(error => {
        console.error(error);
    })
}

function createPost(post, count) { // {description: str, songs: arr, time: ms}
    var time = formatMS(post.time)
    var header = $(`<div id='date-wrapper-${count}' class='row align-items-top'> </div>`)
    var date = $(`<h6 class='display-6'> ${time} </h6>`)
    if(post.description) {
        var description = $(`<p class='text-muted'> ${post.description} </p>`)
    }
    header.append(date)
    header.append(description)
        
    for (const song of post.songs) {
        var wrapper = $(`<div id='song-${count}' class='col-2'> </div>`)
        var img = $(`<img src=${song.artworkUrl100}>`)
        var name = $(`<h5> ${song.trackName} </h5>`)
        var artist = $(`<h6 class='text-muted'> ${song.artistName} </h6`)

        wrapper.append(img)
        wrapper.append(name)
        wrapper.append(artist)
        header.append(wrapper)

    }
    $('#post-wrapper').append(header)
}

function formatMS(ms) {
    var time = new Date(ms);
    return time.toLocaleString();
}