let songs = Object.assign({}, songsDONE, songsWIP)

let musicPlayer = new Audio("../" + songs["tutorial"].music)
let song = "tutorial"
let startPos = 0
const target = document.querySelector(".target")

async function importSongs(url){
    let newSongs = await (await fetch(url)).json()

    songs = Object.assign({}, newSongs, songs)

    console.log(`Successfully imported ${Object.keys(newSongs).length} new song(s)`)
}

function setMusic(){
    musicPlayer.pause()
    musicPlayer = new Audio("../" + songs[song].music)
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

function populateSongData(){
    let songData = document.querySelector(".songdata")
    songData.innerHTML = ""

    for (let x = 0; x < songs[song].chart.length; x++){
        let temp = document.createElement("div")
        temp.className = "gap" + x
        songData.appendChild(temp)
        
        temp = document.createElement("div")
        let diff = 0

        if (x != 0){
            diff = songs[song].chart[x].time-songs[song].chart[x-1].time
        }

        temp.className = "gap" + (x+1)
        temp.innerHTML = `
        <input type="number" class="songtime${x}" value="${Math.round(diff*1000)/1000}">
        <input type="number" class="songposx${x}" value="${songs[song].chart[x].pos[0]}">
        <input type="number" class="songposy${x}" value="${songs[song].chart[x].pos[1]}">`

        songData.appendChild(temp)

        if (x+1 == songs[song].chart.length){
            temp = document.createElement("div")
            temp.className = "gap" + (x+1)
            songData.appendChild(temp)
        }
    }
}

function renderSongData(){
    let songData = document.querySelector(".songdata")
    let newData = []
    let time = 0

    for (let x = 0; x < (songData.children.length/2)-1; x++){
        let temp = {"pos":[0,0]}

        time += parseFloat(document.querySelector(`.songtime${x}`).value)
        temp.time = Math.round(time*1000)/1000
        temp.pos[0] = parseFloat(document.querySelector(`.songposx${x}`).value)
        temp.pos[1] = parseFloat(document.querySelector(`.songposy${x}`).value)

        newData.push(temp)
    }

    songs[song].chart = newData
}

function pushBlank(){
    renderSongData()
    let songData = document.querySelector(".songdata")
    let temp = {"pos":[0,0]}
    let time = 0

    for (let x = 0; x < (songData.children.length/2)-1; x++){
        time += parseFloat(document.querySelector(`.songtime${x}`).value)
    }

    temp.time = time
    temp.pos[0] = 0
    temp.pos[1] = 0

    songs[song].chart.push(temp)
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
    document.querySelector(".name").textContent = songs[song].artist + " - " + songs[song].name
    if (!document.querySelector(".light").src.includes(songs[song].background)){
        document.querySelector(".light").src = "../" + songs[song].background + "#"
    }
}

let loop = setInterval(gameloop, 10)
populateSongData()