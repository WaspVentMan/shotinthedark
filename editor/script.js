const blankSong = {
    "music": "",
    "prev": "",
    "artist": "",
    "name": "",
    "cover": "",
    "background": "",
    "link": [],
    "leaderboards": [],
    "chart": [],
    "guns": [],
    "subtitle": []
}

let songs = Object.assign({}, songsDONE, songsWIP, songsXTRA)

let musicPlayer = new Audio("../" + songs["tutorial"].music)
let song = "tutorial"
let startPos = 0
const target = document.querySelector(".target")

async function importSongs(url){
    let newSongs = await (await fetch(url)).json()

    songs = Object.assign({}, newSongs, songs)

    console.log(`Successfully imported ${Object.keys(newSongs).length} new song(s)`)
}

function importSong(data){
    songs = Object.assign({}, data, songs)
}

function setMusic(){
    musicPlayer.pause()

    if (songs[song].music.startsWith("https://")) {
        musicPlayer = new Audio(songs[song].music)
    } else {
        musicPlayer = new Audio("../" + songs[song].music)
    }
    
    musicPlayer.currentTime = startPos
    musicPlayer.volume = 0.1 
    musicPlayer.play()
}

function songUpdateAhead(){
    while (x < songs[song].chart.length){
        songs[song].chart[x].time += inc
        x++
    }
}

function listAllSongs(){
    document.querySelector(".allsongs").innerHTML = ""
    for (let x = 0; x < Object.keys(songs).length; x++){
        document.querySelector(".allsongs").innerHTML += `<p>${Object.keys(songs).sort()[x]}</p>`
    }
}

function populateSongData(){
    let songData = document.querySelector(".songdata")
    songData.innerHTML = ""

    for (let x = 0; x < songs[song].chart.length; x++){
        let temp = document.createElement("div")
        let diff = 0

        if (x != 0){
            diff = songs[song].chart[x].time-songs[song].chart[x-1].time
        }

        temp.innerHTML = `
        <input type="number" class="songtime${x}" style="width: 10%;" value="${Math.round(diff*1000)/1000}">
        <input type="number" class="songposx${x}" value="${songs[song].chart[x].pos[0]}">
        <input type="number" class="songposy${x}" value="${songs[song].chart[x].pos[1]}">`

        songData.appendChild(temp)

        if (x+1 == songs[song].chart.length){
            temp = document.createElement("div")
            temp.className = "gap" + (x+1)
            songData.appendChild(temp)
        }
    }

    let subData = document.querySelector(".lyricdata")
    subData.innerHTML = ""

    for (let x = 0; x < songs[song].subtitle.length; x++){
        let temp = document.createElement("div")
        let diff = 0

        if (x != 0){
            diff = songs[song].subtitle[x].time-songs[song].subtitle[x-1].time
        }

        temp.className = "gap" + (x+1)
        temp.innerHTML = `
        <input type="number" class="lyrictime${x}" style="width: 10%;" value="${Math.round(diff*1000)/1000}">
        <input type="text" class="lyriclyric${x}" style="width: 80%; text-align: left;" value="${songs[song].subtitle[x].subtitle.replaceAll("\"", "'")}">`

        subData.appendChild(temp)

        if (x+1 == songs[song].chart.length){
            temp = document.createElement("div")
            temp.className = "gap" + (x+1)
            subData.appendChild(temp)
        }
    }

    let gunData = document.querySelector(".gundata")
    gunData.innerHTML = ""

    for (let x = 0; x < songs[song].guns.length; x++){
        let temp = document.createElement("div")
        let diff = 0

        if (x != 0){
            diff = songs[song].guns[x].time-songs[song].guns[x-1].time
        }

        temp.className = "gap" + (x+1)
        temp.innerHTML = `
        <input type="number" class="guntime${x}" style="width: 10%;" value="${Math.round(diff*1000)/1000}">
        <input type="text" class="gungun${x}" style="width: 80%; text-align: left;" value="${songs[song].guns[x].gun}">`

        gunData.appendChild(temp)

        if (x+1 == songs[song].chart.length){
            temp = document.createElement("div")
            temp.className = "gap" + (x+1)
            gunData.appendChild(temp)
        }
    }

    document.querySelector(".title").value = songs[song].name
    document.querySelector(".name").value = songs[song].artist
    document.querySelector(".song").value = songs[song].music
    document.querySelector(".prev").value = songs[song].prev
    document.querySelector(".cover").value = songs[song].cover
    document.querySelector(".back").value = songs[song].background
}

function renderSongData(){
    let newsong = songs[song]

    let newData = []
    let time = 0
    let songData = document.querySelector(".songdata")
    for (let x = 0; x < songData.children.length-1; x++){
        let temp = {"pos":[0,0]}

        time += parseFloat(document.querySelector(`.songtime${x}`).value)
        temp.time = Math.round(time*1000)/1000
        temp.pos[0] = parseFloat(document.querySelector(`.songposx${x}`).value)
        temp.pos[1] = parseFloat(document.querySelector(`.songposy${x}`).value)

        newData.push(temp)
    }

    newsong.chart = newData

    newData = []
    time = 0
    let subData = document.querySelector(".lyricdata")
    for (let x = 0; x < subData.children.length-1; x++){
        let temp = {}

        time += parseFloat(document.querySelector(`.lyrictime${x}`).value)
        temp.time = Math.round(time*1000)/1000
        temp.subtitle = document.querySelector(`.lyriclyric${x}`).value

        newData.push(temp)
    }

    newsong.subtitle = newData

    newData = []
    time = 0
    let gunData = document.querySelector(".gundata")
    for (let x = 0; x < gunData.children.length-1; x++){
        let temp = {}

        try{
            time += parseFloat(document.querySelector(`.guntime${x}`).value)
            temp.time = Math.round(time*1000)/1000
            temp.gun = document.querySelector(`.gungun${x}`).value
        } catch {break}

        newData.push(temp)
    }

    newsong.guns = newData

    newsong.name       = document.querySelector(".title").value
    newsong.artist     = document.querySelector(".name").value
    newsong.music      = document.querySelector(".song").value
    newsong.prev       = document.querySelector(".prev").value
    newsong.cover      = document.querySelector(".cover").value
    newsong.background = document.querySelector(".back").value
    
    
    console.log(newsong)
    songs[song] = newsong
}

function pushBlankSong(name){
    song = name
    songs[name] = blankSong

    populateSongData()
}

function pushBlank(loc){
    if (loc == ".songdata"){
        let temp = {"pos":[0,0]}

        temp.time = 0
        temp.pos[0] = 0
        temp.pos[1] = 0

        songs[song].chart.push(temp)
    }

    if (loc == ".lyricdata"){
        let temp = {}

        temp.time = 0
        temp.subtitle = ""

        songs[song].subtitle.push(temp)
    }

    if (loc == ".gundata"){
        let temp = {}

        temp.time = 0
        temp.gun = ""

        songs[song].guns.push(temp)
    }

    populateSongData()
}

function gameloop(){
    // frame rate of object drops if you don't have this?
    if (musicPlayer.playbackRate = 1){
        musicPlayer.playbackRate = 0.999
    } else {
        musicPlayer.playbackRate = 1
    }

    for (let x = 0; x < songs[song].chart.length; x++){
        if (musicPlayer.currentTime > songs[song].chart[x].time && musicPlayer.currentTime < songs[song].chart[x+1].time){
            let ratio = (musicPlayer.currentTime - songs[song].chart[x].time) / (songs[song].chart[x+1].time - songs[song].chart[x].time)
            target.style.marginLeft = (songs[song].chart[x].pos[0] + ((songs[song].chart[x+1].pos[0] - songs[song].chart[x].pos[0])*ratio))-64 + "px"
            target.style.marginTop = (songs[song].chart[x].pos[1] + ((songs[song].chart[x+1].pos[1] - songs[song].chart[x].pos[1])*ratio))-64 + "px"

            break
        }
    }

    for (let x = 0; x < songs[song].subtitle.length; x++){
        if (musicPlayer.currentTime > songs[song].subtitle[x].time && musicPlayer.currentTime < songs[song].subtitle[x+1].time){
            document.querySelector(".subtitle").innerHTML = songs[song].subtitle[x].subtitle
            break
        }
    }
    
    document.querySelector(".time").textContent = numeral(musicPlayer.currentTime).format("00:00") + " / " + numeral(musicPlayer.duration).format("00:00")
    
    if (!document.querySelector(".light").src.includes(songs[song].background)){
        document.querySelector(".light").src = "../" + songs[song].background + "#"
    }
}

let loop = setInterval(gameloop, 10)
populateSongData()