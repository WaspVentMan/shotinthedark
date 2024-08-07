let player = {}
const target = document.querySelector(".target")
const songSelect = document.querySelector(".songSelect")

let volume = [50, 20]
let single = true
let preview = false
let double = false
let load = false

let scores = {}
let savedS = localStorage.getItem("scores")

if (savedS != null){
    scores = JSON.parse(savedS)
}

let select = [0, 1]

let songs = songsDONE

function allSongs(){
    songs = Object.assign({}, songsDONE, songsWIP)
}

async function importSongs(url){
    try {
        let newSongs = await (await fetch(url)).json()

        songs = Object.assign({}, newSongs, songs)

        document.querySelector(".importInfo").textContent = `Successfully imported ${Object.keys(newSongs).length} new song(s)`

        unlockMedal(79650)
    } catch {
        document.querySelector(".importInfo").textContent = `Error importing song`
    }

    setTimeout(function(){
        document.querySelector(".importInfo").textContent = ""
    }, 5000)
}

let gun = Object.keys(guns)[select[1]]
let musicPlayer = new Audio(songs["tutorial"].music)
let flashForward = 100

function gunInit(){
    document.querySelector(".bullets").innerHTML = ""
    for (let x = 0; x < player.gun.ammo[0]; x++){
        player.bullets.push({"x": 0, "y": 0, "xv": 0, "yv": 0, "r": 0, "rv": 0})
    
        let temp = document.createElement("div")
        temp.className = "bullet bullet" + x
        document.querySelector(".bullets").appendChild(temp)
    }

    if (player.gun.img){
        document.querySelector(".gundisp").src = player.gun.img
        document.querySelector(".gundisp").style.display = "block"
        document.querySelector(".ammoDisp").textContent = player.gun.ammo[0]
    } else {
        document.querySelector(".gundisp").style.display = "none"
        document.querySelector(".ammoDisp").textContent = ""
    }

    if (player.gun.name == "Rude Buster"){
        let gunshot = new Audio(`audio/rude_equip.mp3`);
        gunshot.volume = volume[1]/100
        gunshot.play();
    }

    document.querySelector(".gunName").innerHTML = player.gun.name

    player.gun.ammo[1] = player.gun.ammo[0]

    if (player.gun.buckshot == undefined){
        player.gun.buckshot = 1
    }

    player.lastShot = 0
}

function init(){
    player = {
        "click": false,
        "shoot": false,
        "reload": false,
        "gun": guns.none,
        "lastShot": 0,
        "spread": 0,
        "points": 0,
        "combo": 0,
        "bestcombo": 0,
        "acc": 0,
        "bullets": [],
        "shots": []
    }

    gunInit()
    
    musicPlayer.pause()
    musicPlayer = new Audio(songs[Object.keys(songs)[select[0]]].music)
    musicPlayer.volume = volume[0]/100

    document.querySelector(".startScreen").style.display = "none"
    document.querySelector(".leaderboard").style.display = "none"

    gameLoop = setInterval(gameloop, 10)

    musicPlayer.play()

    unlockMedal(79344)
}

function songchange(value){
    select[0] += value

    if (select[0] < 0){select[0] = Object.keys(songs).length-1}
    else if (select[0] > Object.keys(songs).length-1){select[0] = 0}

    musicPlayer.pause()
    musicPlayer = new Audio(songs[Object.keys(songs)[select[0]]].prev)
    musicPlayer.loop = true
    musicPlayer.volume = volume[0]/250
    musicPlayer.play()

    document.querySelector(".songAAdisp").src = songs[Object.keys(songs)[select[0]]].cover

    if (select[0]-1 < 0){document.querySelector(".prevAAdisp").src = songs[Object.keys(songs)[Object.keys(songs).length-1]].cover}
    else {document.querySelector(".prevAAdisp").src = songs[Object.keys(songs)[select[0]-1]].cover}

    if (select[0]+1 > Object.keys(songs).length-1){document.querySelector(".nextAAdisp").src = songs[Object.keys(songs)[0]].cover}
    else {document.querySelector(".nextAAdisp").src = songs[Object.keys(songs)[select[0]+1]].cover}

    document.querySelector(".songnamedisp").textContent = songs[Object.keys(songs)[select[0]]].name
    document.querySelector(".songartistdisp").textContent = songs[Object.keys(songs)[select[0]]].artist

    if (typeof scores == "string"){
        scores = JSON.parse(scores)
    }

    if (scores[Object.keys(songs)[select[0]]] != undefined){
        document.querySelector(".bestPointsDisp").textContent = numeral(scores[Object.keys(songs)[select[0]]].points).format("0,0")
        document.querySelector(".bestComboDisp").textContent = "x" + numeral(scores[Object.keys(songs)[select[0]]].combo).format("0,0")
        document.querySelector(".bestAccDisp").textContent = numeral(scores[Object.keys(songs)[select[0]]].acc).format("0.00%")

        if (scores[Object.keys(songs)[select[0]]].acc == 1){
            document.querySelector(".bestRankDisp").src = "img/rankP.png"
        } else if (scores[Object.keys(songs)[select[0]]].acc >= 0.95){
            document.querySelector(".bestRankDisp").src = "img/rankS.png"
        } else if (scores[Object.keys(songs)[select[0]]].acc >= 0.9){
            document.querySelector(".bestRankDisp").src = "img/rankA.png"
        } else if (scores[Object.keys(songs)[select[0]]].acc >= 0.8){
            document.querySelector(".bestRankDisp").src = "img/rankB.png"
        } else if (scores[Object.keys(songs)[select[0]]].acc >= 0.6){
            document.querySelector(".bestRankDisp").src = "img/rankC.png"
        } else if (scores[Object.keys(songs)[select[0]]].acc >= 0.3){
            document.querySelector(".bestRankDisp").src = "img/rankD.png"
        } else {
            document.querySelector(".bestRankDisp").src = "img/rankF.png"
        }
    } else {
        document.querySelector(".bestPointsDisp").textContent = "0"
        document.querySelector(".bestComboDisp").textContent = "x0"
        document.querySelector(".bestAccDisp").textContent = "0%"

        document.querySelector(".bestRankDisp").src = "img/rankU.png"
    }

    document.querySelector(".songLinks").innerHTML = ""
    for (let x = 0; x < songs[Object.keys(songs)[select[0]]].link.length; x++){
        document.querySelector(".songLinks").innerHTML += `<a href="${songs[Object.keys(songs)[select[0]]].link[x].url}" target="_blank"><img src="img/link/${songs[Object.keys(songs)[select[0]]].link[x].type}.png"></a>`
    }
}

function gunchange(value){
    select[1] += value

    if (select[1] < 1){select[1] = Object.keys(guns).length-1}
    else if (select[1] > Object.keys(guns).length-1){select[1] = 1}

    gun = Object.keys(guns)[select[1]]

    if (guns[gun].reload != 0){
        document.querySelector(".gunInfoMag").textContent = guns[gun].ammo[0]
    } else {
        document.querySelector(".gunInfoMag").textContent = "Infinite"
    }
    
    if (guns[gun].name == "Pistol"){
        document.querySelector(".gunInfoMode").textContent = "M to toggle"
    } else {
        document.querySelector(".gunInfoMode").textContent = ["Manual", "Automatic"][guns[gun].auto+0]
    }

    if (guns[gun].rate != 0){
        document.querySelector(".gunInfoRate").textContent = (1000/guns[gun].rate) + "/s"
    } else {
        document.querySelector(".gunInfoRate").textContent = "Unlimited"
    }

    if (guns[gun].reload != 0){
    document.querySelector(".gunInfoReload").textContent = (guns[gun].reload/1000) + "s"
    } else {
        document.querySelector(".gunInfoReload").textContent = "None"
    }

    document.querySelector(".gunInfoAcc").textContent = guns[gun].spread[0] + " (" + guns[gun].spread[1] + ")"
    document.querySelector(".gunInfoAccDec").textContent = guns[gun].spreadRate
    document.querySelector(".gunInfoScore").textContent = guns[gun].scoreMult + "x"
    
    document.querySelector(".gundispstart").src = guns[gun].img
    document.querySelector(".gundispname").textContent = guns[gun].name
}

function singlechange(){
    single = !single
    if (single){
        document.querySelector(".songSel").style.width = "256px"
        document.querySelector(".weaponSel").style.display = "block"
        document.querySelector(".gundispstartcontain").style.display = "block"
    } else {
        document.querySelector(".songSel").style.width = "512px"
        document.querySelector(".weaponSel").style.display = "none"
        document.querySelector(".gundispstartcontain").style.display = "none"
        document.querySelector(".songSel").style.width = "512px"
    }
}

function volchange(v, c){
    volume[v] += c

    if (volume[0] < 0){
        volume[0] = 0
    } else if (volume[0] > 100){
        volume[0] = 100
    }

    if (volume[1] < 0){
        volume[1] = 0
    } else if (volume[1] > 100){
        volume[1] = 100
    }

    document.querySelector(".musVol").textContent = volume[0]
    document.querySelector(".sndVol").textContent = volume[1]
}

async function leaderboardUltra(submit){
    let boards = {}

    let tag = "Normal"
    if (single){
        tag = guns[Object.keys(guns)[select[1]]].name
    }

    let options = {
        "period": NGIO.PERIOD_ALL_TIME,
        "limit": 5,
        "tag": tag
    }

    if (submit && !offline){
        NGIO.postScore(songs[Object.keys(songs)[select[0]]].leaderboards[0], player.points, tag, function(){
            NGIO.getScores(songs[Object.keys(songs)[select[0]]].leaderboards[0], options, function(scores, board, options){
                boards.score = scores
            })
        })
        NGIO.postScore(songs[Object.keys(songs)[select[0]]].leaderboards[1], player.bestcombo, tag, function(){
            NGIO.getScores(songs[Object.keys(songs)[select[0]]].leaderboards[1], options, function(scores, board, options){
                boards.combo = scores
            })
        })
        NGIO.postScore(songs[Object.keys(songs)[select[0]]].leaderboards[2], Math.floor((player.acc)*10000), tag, function(){
            NGIO.getScores(songs[Object.keys(songs)[select[0]]].leaderboards[2], options, function(scores, board, options){
                boards.acc = scores
            })
        })
    } else {
        NGIO.getScores(songs[Object.keys(songs)[select[0]]].leaderboards[0], options, function(scores, board, options){
            boards.score = scores
        })
        NGIO.getScores(songs[Object.keys(songs)[select[0]]].leaderboards[1], options, function(scores, board, options){
            boards.combo = scores
        })
        NGIO.getScores(songs[Object.keys(songs)[select[0]]].leaderboards[2], options, function(scores, board, options){
            boards.acc = scores
        })
    }

    document.querySelector(".scoreleader").innerHTML = "<br><p>Loading...</p>"
    document.querySelector(".comboleader").innerHTML = "<br><p>Loading...</p>"
    document.querySelector(".accleader").innerHTML = "<br><p>Loading...</p>"

    const sleepUntil = async () => {
        return new Promise((resolve) => {
            const wait = setInterval(function() {
                if (boards.score != undefined && boards.combo != undefined && boards.acc != undefined) {
                    clearInterval(wait)
                    resolve()
                }
            }, 20)
        })
    }

    await sleepUntil()

    document.querySelector(".scoreleader").innerHTML = ""
    document.querySelector(".comboleader").innerHTML = ""
    document.querySelector(".accleader").innerHTML = ""

    try {
        if (!offline){ 
            document.querySelector(".scoreleader").innerHTML = ""
            for (let rank = 0; rank < 5; rank++){
                if (rank < boards.score.length){
                    if (boards.score[rank].user.name == NGIO.user.name ){
                        document.querySelector(".scoreleader").innerHTML += `<p style="background-color: white; color: black">${rank+1}</p><p style="background-color: white; color: black">${numeral(boards.score[rank].value).format("0,0")}</p><p style="background-color: white; color: black">${boards.score[rank].user.name}</p>`
                    } else {
                        document.querySelector(".scoreleader").innerHTML += `<p>${rank+1}</p><p>${numeral(boards.score[rank].value).format("0,0")}</p><p>${boards.score[rank].user.name}</p>`
                    }
                } else {
                    document.querySelector(".scoreleader").innerHTML += `<p>${rank+1}</p><p></p><p></p>`
                }
            }

            document.querySelector(".comboleader").innerHTML = ""
            for (let rank = 0; rank < 5; rank++){
                if (rank < boards.combo.length){
                    if (boards.combo[rank].user.name == NGIO.user.name ){
                        document.querySelector(".comboleader").innerHTML += `<p style="background-color: white; color: black">${rank+1}</p><p style="background-color: white; color: black">x${numeral(boards.combo[rank].value).format("0,0")}</p><p style="background-color: white; color: black">${boards.combo[rank].user.name}</p>`
                    } else {
                        document.querySelector(".comboleader").innerHTML += `<p>${rank+1}</p><p>x${numeral(boards.combo[rank].value).format("0,0")}</p><p>${boards.combo[rank].user.name}</p>`
                    }
                } else {
                    document.querySelector(".comboleader").innerHTML += `<p>${rank+1}</p><p></p><p></p>`
                }
            }

            document.querySelector(".accleader").innerHTML = ""
            for (let rank = 0; rank < 5; rank++){
                if (rank < boards.acc.length){
                    if (boards.acc[rank].user.name == NGIO.user.name ){
                        document.querySelector(".accleader").innerHTML += `<p style="background-color: white; color: black">${rank+1}</p><p style="background-color: white; color: black">${numeral(boards.acc[rank].value/10000).format("0.00%")}</p><p style="background-color: white; color: black">${boards.acc[rank].user.name}</p>`
                    } else {
                        document.querySelector(".accleader").innerHTML += `<p>${rank+1}</p><p>${numeral(boards.acc[rank].value/10000).format("0.00%")}</p><p>${boards.acc[rank].user.name}</p>`
                    }
                } else {
                    document.querySelector(".accleader").innerHTML += `<p>${rank+1}</p><p></p><p></p>`
                }
            }
        } else {
            document.querySelector(".scoreleader").innerHTML = "<br><p>Log into Newgrounds to view leaderboards</p>"
            document.querySelector(".comboleader").innerHTML = "<br><p>Log into Newgrounds to view leaderboards</p>"
            document.querySelector(".accleader").innerHTML = "<br><p>Log into Newgrounds to view leaderboards</p>"
        }
    } catch (e) {
        console.log(e)
        document.querySelector(".scoreleader").innerHTML = "An error has occured"
        document.querySelector(".comboleader").innerHTML = "An error has occured"
        document.querySelector(".accleader").innerHTML = "An error has occured"
    }
}

gunchange(0)
singlechange()
volchange()

let key = {}
let mousePos = []

window.addEventListener('keydown', function (e) {
    key[e.key] = true
})

window.addEventListener('keyup', function (e) {
    key[e.key] = false

    if (e.key == "ArrowLeft"){
        songchange(-1)
    } else if (e.key == "ArrowRight"){
        songchange(1)
    }
})

window.addEventListener('mousedown', function (e) {
    if (e.buttons == 2){
        key['r'] = true
    } else {
        player.click = true
        player.shoot = true
    }
})

window.addEventListener('mouseup', function (e) {
    player.click = false
    player.shoot = false
})

function distance(x, y){return Math.sqrt((x**2) + (y**2))}

onmousemove = function(e){mousePos = [e.clientX, e.clientY]}

function gameloop(){
    if (player.click && player.shoot && player.gun.ammo[1] > 0 && !player.reload && player.lastShot+player.gun.rate < Date.now() && !preview){
        player.lastShot = Date.now()
        flashForward = 0

        if (!player.gun.auto){
            player.shoot = false
        } else {
            player.shoot = false
            setTimeout(function(){
                if (player.click){
                    player.shoot = true
                }
            }, player.gun.rate)
        }
        player.gun.ammo[1] --
        document.querySelector(".ammoDisp").textContent = player.gun.ammo[1]

        let targetBounds = document.querySelector(".target").getBoundingClientRect()

        for (let z = 0; z < player.gun.buckshot; z++){
            let x = (mousePos[0]+((Math.random()*player.spread)-(player.spread/2))) 
            let y = (mousePos[1]+((Math.random()*player.spread)-(player.spread/2)))

            shot = Math.floor(distance(Math.abs(x - (targetBounds.x + 64)), Math.abs(y - (targetBounds.y + 64))))-1

            if (shot < 10){
                shot = 0
            }
    
            player.shots.push({"shot": shot, "mult": player.gun.scoreMult})
            if (player.shots[player.shots.length-1].shot < 64){
                player.points += Math.ceil(((((64 - player.shots[player.shots.length-1].shot)*2)**2) + (1 + (player.combo/20)))*player.gun.scoreMult)*[1, 2][double+0]
                player.combo++
    
                if (player.combo > player.bestcombo){
                    player.bestcombo = player.combo
                }
                let hitmarker = document.createElement("div")

                hitmarker.style.top = (y -7.5) + "px"
                hitmarker.style.left = (x -7.5) + "px"
                hitmarker.style.display = "block"

                if (shot == 0){
                    hitmarker.style.backgroundImage = "url('img/hitmarkerP.png')"
                }
                
                hitmarker.className = "hitmarker hitmarker" + Math.round(x) + Math.round(y) + z

                if (player.gun.name == "Rude Buster"){
                    setTimeout(function(){
                        let gunshot = new Audio("audio/snd_rudebuster_hit.wav")
                        gunshot.volume = volume[1]/100
                        gunshot.play()
                    }, player.gun.delay)
                }

                document.body.appendChild(hitmarker)
                setTimeout(function(){
                    document.querySelector(".hitmarker" + Math.round(x) + Math.round(y) + z).style.opacity = "0%"
                }, 500)
                setTimeout(function(){
                    document.querySelector(".hitmarker" + Math.round(x) + Math.round(y) + z).remove()
                }, 1500)
            } else {
                player.combo = 0
            }
        }

        player.spread += player.gun.spreadRate

        if (player.gun.shootS != undefined){
            let gunshot = new Audio(player.gun.shootS);
            gunshot.volume = volume[1]/100
            gunshot.play();
        } else {
            let gunshot = new Audio(`audio/shot${Math.round(Math.random())+2}.mp3`);
            gunshot.volume = volume[1]/100
            gunshot.play();
        }
    } else {
        if (flashForward < 100){
            flashForward += 25/2
        }

        if (player.spread > player.gun.spread[1]){
            player.spread = player.gun.spread[1]
        }
       
        if (player.spread < player.gun.spread[0]-1){
            player.spread += 2
        } else if (player.spread > player.gun.spread[0]+1){
            player.spread -= 2
        } else {
            player.spread = player.gun.spread[0]
        }
    }

    if (player.gun.name == ""){
        flashForward = 75
    }

    if (preview){
        flashForward = 50
    }

    let temp = Math.round(flashForward*2.55).toString(16)
    if (temp.length == 1){
        temp = "0" + temp
    }
    document.querySelector(".darkness").style.backgroundColor = "#000000" + temp

    if (key["r"] && !player.reload && player.gun.ammo[1] != player.gun.ammo[0] || player.gun.autoReload && player.gun.ammo[1] == 0){
        key['r'] = false
        player.reload = true
        player.shoot = false

        if (true){
            if (player.gun.reloadS != undefined){
                let gunshot = new Audio(player.gun.reloadS);
                gunshot.volume = volume[1]/100
                gunshot.play();
            } else if (player.gun.reloadS != null){
                let gunshot = new Audio('audio/reload.mp3');
                gunshot.volume = volume[1]/100
                gunshot.play();
            }

            setTimeout(function(){
                player.reload = false
                key['r'] = false

                player.gun.ammo[1] = player.gun.ammo[0]
                document.querySelector(".ammoDisp").textContent = player.gun.ammo[1]
            }, player.gun.reload)
        }
    }

    if (key["m"] && player.gun.name == "Pistol"){
        key["m"] = false
        if (player.gun.auto){
            player.gun.auto = false
            player.gun.rate = 0
        } else {
            player.gun.auto = true
            player.gun.rate = 160
        }
    }

    if (key["p"]){
        if (preview || songs[Object.keys(songs)[select[0]]].leaderboards == null){
            document.querySelector('.startScreen').style.display = 'block'; document.querySelector('.leaderboard').style.display = 'none'
            clearInterval(gameLoop)
            
            return
        }

        NGIO.logEvent("SongAborted", function(){})

        musicPlayer.currentTime = 1e100

        document.querySelector(".leaderboard").style.display = "block"

        leaderboardUltra(false)

        document.querySelector(".endScore").textContent = "Run Aborted"
        document.querySelector(".endCombo").textContent = "Run Aborted"
        document.querySelector(".endAcc").textContent = "Run Aborted"
        document.querySelector(".endRank").innerHTML = "Run Aborted"

        clearInterval(gameLoop)
        
        return
    }

    try {
        for (let x = 0; x < player.bullets.length; x++){
            let htmlBullet = document.querySelector(".bullet" + x)

            htmlBullet.style.left = player.bullets[x].x + "px"
            htmlBullet.style.bottom = player.bullets[x].y + "px"
            htmlBullet.style.rotate = player.bullets[x].r + "deg"
            htmlBullet.style.backgroundImage = "url('" + player.gun.bullet + "')"
            
            if (player.gun.ammo[1] <= x){
                if (player.reload && x > player.gun.ammo[1]){
                    player.bullets[x].x -= player.bullets[x].xv*1.25
                    player.bullets[x].y -= player.bullets[x].yv
                    player.bullets[x].r -= player.bullets[x].rv

                    player.bullets[x].yv += 0.75
                } else if (player.bullets[x].x < 512){
                    player.bullets[x].x += player.bullets[x].xv
                    player.bullets[x].y += player.bullets[x].yv
                    player.bullets[x].r += player.bullets[x].rv

                    player.bullets[x].yv -= 0.5
                    player.bullets[x].rv *= 0.99

                    htmlBullet.style.backgroundImage = "url('" + player.gun.case + "')"
                }
            } else {
                player.bullets[x].x = 15 + ((40*Math.floor(x/24)) - ((player.gun.ammo[1]/24)*40))
                player.bullets[x].y = 22 + (17*(x-(Math.floor(x/24)*24)))
                player.bullets[x].r = 0

                if (player.gun.ammo[1] == x+1){
                    player.bullets[x].x += 5
                }
                
                player.bullets[x].xv = Math.random()*5+10
                player.bullets[x].yv = Math.random()*5+5
                player.bullets[x].rv = Math.random()*39
            }
        }
    } catch {}

    // frame rate of object drops if you don't have this?
    if (musicPlayer.playbackRate = [1, 2][double+0]){
        musicPlayer.playbackRate = [1, 2][double+0]-0.001
    } else {
        musicPlayer.playbackRate = [1, 2][double+0]
    }

    player.points = 0
    for (let z = 0; z < player.shots.length; z++){
        if (player.shots[z].shot < 64){
            player.points += Math.ceil(((((64 - player.shots[z].shot)*2)**2) + (1 + (player.combo/20)))*player.shots[z].mult)
        }
    }

    player.combo = 0
    player.bestcombo = 0
    for (let z = 0; z < player.shots.length; z++){
        if (player.shots[z].shot < 64){
            player.combo++
            if (player.combo > player.bestcombo){
                player.bestcombo = player.combo
            }
        } else {
            player.combo = 0
        }
    }

    player.acc = 0
    for (let z = 0; z < player.shots.length; z++){
        if (player.shots[z].shot < 64){
            player.acc += (64-(Math.ceil(player.shots[z].shot/4)))/64
        }
    }
    player.acc /= player.shots.length

    if (musicPlayer.ended){
        if (preview || songs[Object.keys(songs)[select[0]]].leaderboards == null){
            document.querySelector('.startScreen').style.display = 'block'; document.querySelector('.leaderboard').style.display = 'none'
            clearInterval(gameLoop)
            return
        }

        NGIO.logEvent("SongComplete", function(){})

        document.querySelector(".leaderboard").style.display = "block"

        // medals
        if (player.shots.length >= 10){
            unlockMedal(79212, player.acc == 0)
            unlockMedal(79201, player.acc >= 0.3)
            unlockMedal(79200, player.acc >= 0.6)
            unlockMedal(79199, player.acc >= 0.8)
            unlockMedal(79198, player.acc >= 0.9)
            unlockMedal(79197, player.acc >= 0.95)
            unlockMedal(79213, player.points == 0)
            unlockMedal(79202, player.points >= 7e4)
            unlockMedal(79203, player.points >= 5e5)
            unlockMedal(79209, player.points >= 1e6)
            unlockMedal(79210, player.points >= 2e6)
            unlockMedal(79211, player.points >= 5e6)
            unlockMedal(79214, player.bestcombo == 0)
            unlockMedal(79204, player.bestcombo >= 10)
            unlockMedal(79205, player.bestcombo >= 50)
            unlockMedal(79206, player.bestcombo >= 100)
            unlockMedal(79207, player.bestcombo >= 200)
            unlockMedal(79208, player.bestcombo >= 500)
            unlockMedal(79343, single)

            if (songs[Object.keys(songs)[select[0]]].achievement != undefined){
                unlockMedal(songs[Object.keys(songs)[select[0]]].achievement)
            }
        }

        leaderboardUltra(player.shots.length >= 10)

        musicPlayer = new Audio("audio/Boot Sequence.mp3")
        musicPlayer.loop = false
        musicPlayer.volume = volume[0]/100
        musicPlayer.play()

        document.querySelector(".endScore").textContent = "?"
        document.querySelector(".endCombo").textContent = "?"
        document.querySelector(".endAcc").textContent = "?"
        document.querySelector(".endRank").innerHTML = "?"

        let bests = [false, false, false]

        if (player.shots.length >= 10){
            if (scores[Object.keys(songs)[select[0]]] == undefined){
                scores[Object.keys(songs)[select[0]]] = {
                    "points": player.points,
                    "combo": player.bestcombo,
                    "acc": player.acc
                }
            } else {
                if (player.points > scores[Object.keys(songs)[select[0]]].points){
                    scores[Object.keys(songs)[select[0]]].points = player.points
                    bests[0] = true
                }
                if (player.bestcombo > scores[Object.keys(songs)[select[0]]].combo){
                    scores[Object.keys(songs)[select[0]]].combo = player.bestcombo
                    bests[1] = true
                }
                if (player.acc > scores[Object.keys(songs)[select[0]]].acc){
                    scores[Object.keys(songs)[select[0]]].acc = player.acc
                    bests[2] = true
                }
            }

            document.querySelector(".warning").textContent = ""
        } else {
            document.querySelector(".warning").textContent = "SCORE NOT SAVED DUE TO SHOOTING LESS THAN 10 TIMES"
        }

        localStorage.setItem("scores", JSON.stringify(scores))

        if (!offline){
            let slot = NGIO.getSaveSlot(1);

            console.log(slot)
            slot.setData(JSON.stringify(scores), function(){console.log("SAVED SCORES TO NG")})
        }

        setTimeout(function(){
            document.querySelector(".endScore").textContent = numeral(player.points).format("0,0")
            document.querySelector(".endCombo").textContent = "x" + numeral(player.bestcombo).format("0,0")
            document.querySelector(".endAcc").textContent = numeral(player.acc).format("0.00%")

            if (bests[0]){
                document.querySelector(".endScore").textContent += " (NEW BEST)"
            }
            if (bests[1]){
                document.querySelector(".endCombo").textContent += " (NEW BEST)"
            }
            if (bests[2]){
                document.querySelector(".endAcc").textContent += " (NEW BEST)"
            }

            if (player.acc == 1){
                document.querySelector(".endRank").innerHTML = "<img src=\"img/rankP.png\">"
            } else if (player.acc >= 0.95){
                document.querySelector(".endRank").innerHTML = "<img src=\"img/rankS.png\">"
            } else if (player.acc >= 0.9){
                document.querySelector(".endRank").innerHTML = "<img src=\"img/rankA.png\">"
            } else if (player.acc >= 0.8){
                document.querySelector(".endRank").innerHTML = "<img src=\"img/rankB.png\">"
            } else if (player.acc >= 0.6){
                document.querySelector(".endRank").innerHTML = "<img src=\"img/rankC.png\">"
            } else if (player.acc >= 0.3){
                document.querySelector(".endRank").innerHTML = "<img src=\"img/rankD.png\">"
            } else {
                document.querySelector(".endRank").innerHTML = "<img src=\"img/rankF.png\">"

                musicPlayer.volume = 0.01

                let voicePlayer = new Audio("audio/rank_F_talk.mp3")
                voicePlayer.volume = volume[1]/100
                voicePlayer.play()
            }
        }, 2650)

        clearInterval(gameLoop)
        
        return
    }

    for (let x = 0; x < songs[Object.keys(songs)[select[0]]].chart.length; x++){
        if (musicPlayer.currentTime > songs[Object.keys(songs)[select[0]]].chart[x].time && musicPlayer.currentTime < songs[Object.keys(songs)[select[0]]].chart[x+1].time){
            let ratio = (musicPlayer.currentTime - songs[Object.keys(songs)[select[0]]].chart[x].time) / (songs[Object.keys(songs)[select[0]]].chart[x+1].time - songs[Object.keys(songs)[select[0]]].chart[x].time)
            target.style.marginLeft = (songs[Object.keys(songs)[select[0]]].chart[x].pos[0] + ((songs[Object.keys(songs)[select[0]]].chart[x+1].pos[0] - songs[Object.keys(songs)[select[0]]].chart[x].pos[0])*ratio))-64 + "px"
            target.style.marginTop = (songs[Object.keys(songs)[select[0]]].chart[x].pos[1] + ((songs[Object.keys(songs)[select[0]]].chart[x+1].pos[1] - songs[Object.keys(songs)[select[0]]].chart[x].pos[1])*ratio))-64 + "px"

            break
        }
    }

    for (let x = 0; x < songs[Object.keys(songs)[select[0]]].guns.length; x++){
        if (musicPlayer.currentTime > songs[Object.keys(songs)[select[0]]].guns[x].time && musicPlayer.currentTime < songs[Object.keys(songs)[select[0]]].guns[x+1].time){
            if (player.gun.name != guns[songs[Object.keys(songs)[select[0]]].guns[x].gun].name && !single || (player.gun.name != guns[Object.keys(guns)[select[1]]].name || guns[songs[Object.keys(songs)[select[0]]].guns[x].gun].name == "") && single){
                if (single){
                    if (guns[songs[Object.keys(songs)[select[0]]].guns[x].gun].name != ""){
                        player.gun = guns[Object.keys(guns)[select[1]]]
                    } else {
                        player.gun = guns.none
                    }
                } else {
                    player.gun = guns[songs[Object.keys(songs)[select[0]]].guns[x].gun]
                }

                gunInit()
                break
            }
        }
    }

    for (let x = 0; x < songs[Object.keys(songs)[select[0]]].subtitle.length; x++){
        if (musicPlayer.currentTime > songs[Object.keys(songs)[select[0]]].subtitle[x].time && musicPlayer.currentTime < songs[Object.keys(songs)[select[0]]].subtitle[x+1].time){
            document.querySelector(".subtitle").innerHTML = songs[Object.keys(songs)[select[0]]].subtitle[x].subtitle
            break
        }
    }
    
    document.querySelector(".score").textContent = numeral(player.points).format("0,0") + " "

    if (player.combo == player.bestcombo){
        document.querySelector(".combo").textContent = "x" + numeral(player.combo).format("0,0")
    } else {
        document.querySelector(".combo").textContent = "x" + numeral(player.combo).format("0,0") + " (x" + numeral(player.bestcombo).format("0") + ")"
    }

    document.querySelector(".acc").textContent = numeral(player.acc).format("0.00%")
    document.querySelector(".time").textContent = numeral(musicPlayer.currentTime).format("00:00") + " / " + numeral(musicPlayer.duration).format("00:00")
    document.querySelector(".newTime").style.width = (512*(musicPlayer.currentTime/musicPlayer.duration)) + "px"
    document.querySelector(".name").textContent = songs[Object.keys(songs)[select[0]]].name
    document.querySelector(".artistName").textContent = songs[Object.keys(songs)[select[0]]].artist
    document.querySelector(".lbTitle").textContent = songs[Object.keys(songs)[select[0]]].artist + " - " + songs[Object.keys(songs)[select[0]]].name
    if (single){
        document.querySelector(".lbmode").textContent = "Single gun: " + guns[Object.keys(guns)[select[1]]].name
    } else {
        document.querySelector(".lbmode").textContent = ""
    }
    if (!document.querySelector(".light").src.includes(songs[Object.keys(songs)[select[0]]].background)){
        document.querySelector(".light").src = songs[Object.keys(songs)[select[0]]].background
    }
}

let gameLoop = ""

setInterval(function(){
    gun = Object.keys(guns)[select[1]]

    if (player.gun != undefined){
        document.querySelector(".crosshair").style.height = player.spread + "px"
        document.querySelector(".crosshair").style.width = player.spread + "px"
        document.querySelector(".crosshair").style.top = (mousePos[1] -(player.spread/2)) + "px"
        document.querySelector(".crosshair").style.left = (mousePos[0] -(player.spread/2)) + "px"

        if (player.gun.name == ""){
            document.querySelector(".crosshair").style.height = "11px"
            document.querySelector(".crosshair").style.width = "11px"
        }
    } else {
        document.querySelector(".crosshair").style.height = guns[gun].spread[0] + "px"
        document.querySelector(".crosshair").style.width = guns[gun].spread[0] + "px"
        document.querySelector(".crosshair").style.top = (mousePos[1] -(guns[gun].spread[0]/2)) + "px"
        document.querySelector(".crosshair").style.left = (mousePos[0] -(guns[gun].spread[0]/2)) + "px"
    }
}, 10)

console.log("cock and/or balls")