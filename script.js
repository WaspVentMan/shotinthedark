let player = {}
const target = document.querySelector(".target")
const songSelect = document.querySelector(".songSelect")

let volume = [50, 20]
let single = true
let preview = false
let load = false

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
    } else {
        document.querySelector(".gundisp").style.display = "none"
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

    if (!offline){
        if (!NGIO.getMedal(79344).unlocked){
            NGIO.unlockMedal(79344, onMedalUnlocked)
        }
    }
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

    document.querySelector(".songLinks").innerHTML = ""
    for (let x = 0; x < songs[Object.keys(songs)[select[0]]].link.length; x++){
        document.querySelector(".songLinks").innerHTML += `<a href="${songs[Object.keys(songs)[select[0]]].link[x].url}" target="_blank"><img src="img/link_${songs[Object.keys(songs)[select[0]]].link[x].type}.png"></a>`
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

        let targetBounds = document.querySelector(".target").getBoundingClientRect()

        for (let z = 0; z < player.gun.buckshot; z++){
            let x = (mousePos[0]+((Math.random()*player.spread)-(player.spread/2))) 
            let y = (mousePos[1]+((Math.random()*player.spread)-(player.spread/2)))
    
            player.shots.push({"shot": Math.floor(distance(Math.abs(x - (targetBounds.x + 64)), Math.abs(y - (targetBounds.y + 64))))-1, "mult": player.gun.scoreMult})
            if (player.shots[player.shots.length-1].shot < 64){
                if (player.gun.name == "Rude Buster"){
                    setTimeout(function(){
                        player.points += Math.ceil(((((64 - player.shots[player.shots.length-1].shot)*2)**2) + (1 + (player.combo/20)))*player.gun.scoreMult)
                        player.combo++
            
                        if (player.combo > player.bestcombo){
                            player.bestcombo = player.combo
                        }
                        let hitmarker = document.createElement("div")

                        let gunshot = new Audio("audio/snd_rudebuster_hit.wav")
                        gunshot.volume = volume[1]/100
                        gunshot.play()
            
                        hitmarker.style.top = (y -7.5) + "px"
                        hitmarker.style.left = (x -7.5) + "px"
                        hitmarker.style.display = "block"
                        
                        hitmarker.className = "hitmarker hitmarker" + Math.round(x) + Math.round(y) + z

                        document.body.appendChild(hitmarker)
                        setTimeout(function(){
                            document.querySelector(".hitmarker" + Math.round(x) + Math.round(y) + z).style.opacity = "0%"
                        }, 500)
                        setTimeout(function(){
                            document.querySelector(".hitmarker" + Math.round(x) + Math.round(y) + z).remove()
                        }, 1500)
                    }, player.gun.delay)
                } else {
                    player.points += Math.ceil(((((64 - player.shots[player.shots.length-1].shot)*2)**2) + (1 + (player.combo/20)))*player.gun.scoreMult)
                    player.combo++
        
                    if (player.combo > player.bestcombo){
                        player.bestcombo = player.combo
                    }
                    let hitmarker = document.createElement("div")
    
                    hitmarker.style.top = (y -7.5) + "px"
                    hitmarker.style.left = (x -7.5) + "px"
                    hitmarker.style.display = "block"
                    
                    hitmarker.className = "hitmarker hitmarker" + Math.round(x) + Math.round(y) + z
    
                    document.body.appendChild(hitmarker)
                    setTimeout(function(){
                        document.querySelector(".hitmarker" + Math.round(x) + Math.round(y) + z).style.opacity = "0%"
                    }, 500)
                    setTimeout(function(){
                        document.querySelector(".hitmarker" + Math.round(x) + Math.round(y) + z).remove()
                    }, 1500)
                }
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

                player.gun.ammo[1] = player.gun.ammo[0]
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

        let tag = "Normal"
        if (single){
            tag = guns[Object.keys(guns)[select[1]]].name
        }
            
        let options = {
            "period": NGIO.PERIOD_ALL_TIME,
            "limit": 5,
            "tag": tag
        }

        NGIO.getScores(songs[Object.keys(songs)[select[0]]].leaderboards[0], options, function(scores, board, options){
            document.querySelector(".scoreleader").innerHTML = ""
            for (let rank = 0; rank < 5; rank++){
                if (rank < scores.length){
                    if (scores[rank].user.name == NGIO.user.name ){
                        document.querySelector(".scoreleader").innerHTML += `<p style="background-color: white; color: black">${rank+1}</p><p style="background-color: white; color: black">${numeral(scores[rank].value).format("0,0")}</p><p style="background-color: white; color: black">${scores[rank].user.name}</p>`
                    } else {
                        document.querySelector(".scoreleader").innerHTML += `<p>${rank+1}</p><p>${numeral(scores[rank].value).format("0,0")}</p><p>${scores[rank].user.name}</p>`
                    }
                } else {
                    document.querySelector(".scoreleader").innerHTML += `<p>${rank+1}</p><p></p><p></p>`
                }
            }
        })
        NGIO.getScores(songs[Object.keys(songs)[select[0]]].leaderboards[1], options, function(scores, board, options){
            document.querySelector(".comboleader").innerHTML = ""
            for (let rank = 0; rank < 5; rank++){
                if (rank < scores.length){
                    if (scores[rank].user.name == NGIO.user.name ){
                        document.querySelector(".comboleader").innerHTML += `<p style="background-color: white; color: black">${rank+1}</p><p style="background-color: white; color: black">x${numeral(scores[rank].value).format("0,0")}</p><p style="background-color: white; color: black">${scores[rank].user.name}</p>`
                    } else {
                        document.querySelector(".comboleader").innerHTML += `<p>${rank+1}</p><p>x${numeral(scores[rank].value).format("0,0")}</p><p>${scores[rank].user.name}</p>`
                    }
                } else {
                    document.querySelector(".comboleader").innerHTML += `<p>${rank+1}</p><p></p><p></p>`
                }
            }
        })
        NGIO.getScores(songs[Object.keys(songs)[select[0]]].leaderboards[2], options, function(scores, board, options){
            document.querySelector(".accleader").innerHTML = ""
            for (let rank = 0; rank < 5; rank++){
                if (rank < scores.length){
                    if (scores[rank].user.name == NGIO.user.name ){
                        document.querySelector(".accleader").innerHTML += `<p style="background-color: white; color: black">${rank+1}</p><p style="background-color: white; color: black">${numeral(scores[rank].value/10000).format("0.0%")}</p><p style="background-color: white; color: black">${scores[rank].user.name}</p>`
                    } else {
                        document.querySelector(".accleader").innerHTML += `<p>${rank+1}</p><p>${numeral(scores[rank].value/10000).format("0.00%")}</p><p>${scores[rank].user.name}</p>`
                    }
                } else {
                    document.querySelector(".accleader").innerHTML += `<p>${rank+1}</p><p></p><p></p>`
                }
            }
        })

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
    if (musicPlayer.playbackRate = 1){
        musicPlayer.playbackRate = 0.999
    } else {
        musicPlayer.playbackRate = 1
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
        if (player.gun.name != "Pico's Debug MAC-10" && player.shots.length > 10){
            if (!NGIO.getMedal(79212).unlocked && player.acc == 0){
                NGIO.unlockMedal(79212, onMedalUnlocked)
            }

            if (!NGIO.getMedal(79201).unlocked && player.acc >= 0.3){
                NGIO.unlockMedal(79201, onMedalUnlocked)
            }

            if (!NGIO.getMedal(79200).unlocked && player.acc >= 0.6){
                NGIO.unlockMedal(79200, onMedalUnlocked)
            }

            if (!NGIO.getMedal(79199).unlocked && player.acc >= 0.8){
                NGIO.unlockMedal(79199, onMedalUnlocked)
            }

            if (!NGIO.getMedal(79198).unlocked && player.acc >= 0.9){
                NGIO.unlockMedal(79198, onMedalUnlocked)
            }

            if (!NGIO.getMedal(79197).unlocked && player.acc >= 0.95){
                NGIO.unlockMedal(79197, onMedalUnlocked)
            }

            if (!NGIO.getMedal(79213).unlocked && player.points == 0){
                NGIO.unlockMedal(79213, onMedalUnlocked)
            }

            if (!NGIO.getMedal(79202).unlocked && player.points >= 7e4){
                NGIO.unlockMedal(79202, onMedalUnlocked)
            }

            if (!NGIO.getMedal(79203).unlocked && player.points >= 5e5){
                NGIO.unlockMedal(79203, onMedalUnlocked)
            }

            if (!NGIO.getMedal(79209).unlocked && player.points >= 1e6){
                NGIO.unlockMedal(79209, onMedalUnlocked)
            }

            if (!NGIO.getMedal(79210).unlocked && player.points >= 2e6){
                NGIO.unlockMedal(79210, onMedalUnlocked)
            }

            if (!NGIO.getMedal(79211).unlocked && player.points >= 5e6){
                NGIO.unlockMedal(79211, onMedalUnlocked)
            }

            if (!NGIO.getMedal(79214).unlocked && player.bestcombo == 0){
                NGIO.unlockMedal(79214, onMedalUnlocked)
            }

            if (!NGIO.getMedal(79204).unlocked && player.bestcombo >= 10){
                NGIO.unlockMedal(79204, onMedalUnlocked)
            }

            if (!NGIO.getMedal(79205).unlocked && player.bestcombo >= 50){
                NGIO.unlockMedal(79205, onMedalUnlocked)
            }

            if (!NGIO.getMedal(79206).unlocked && player.bestcombo >= 100){
                NGIO.unlockMedal(79206, onMedalUnlocked)
            }

            if (!NGIO.getMedal(79207).unlocked && player.bestcombo >= 200){
                NGIO.unlockMedal(79207, onMedalUnlocked)
            }

            if (!NGIO.getMedal(79208).unlocked && player.bestcombo >= 500){
                NGIO.unlockMedal(79208, onMedalUnlocked)
            }

            if (!NGIO.getMedal(79343).unlocked && single){
                NGIO.unlockMedal(79343, onMedalUnlocked)
            }
        }

        let boards = {}

        if (player.gun.name == "Pico's Debug MAC-10" || player.shots.length < 10){
            let tag = "Normal"
            if (single){
                tag = guns[Object.keys(guns)[select[1]]].name
            }
            
            let options = {
                "period": NGIO.PERIOD_ALL_TIME,
                "limit": 5,
                "tag": tag
            }
    
            NGIO.getScores(songs[Object.keys(songs)[select[0]]].leaderboards[0], options, function(scores, board, options){
                boards.score = scores
            })
            NGIO.getScores(songs[Object.keys(songs)[select[0]]].leaderboards[1], options, function(scores, board, options){
                boards.combo = scores
            })
            NGIO.getScores(songs[Object.keys(songs)[select[0]]].leaderboards[2], options, function(scores, board, options){
                boards.acc = scores
            })
        } else {
            let tag = "Normal"
            if (single){
                tag = guns[Object.keys(guns)[select[1]]].name
            }
            
            let options = {
                "period": NGIO.PERIOD_ALL_TIME,
                "limit": 5,
                "tag": tag
            }
    
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
        }

        musicPlayer = new Audio("audio/Boot Sequence.mp3")
        musicPlayer.loop = false
        musicPlayer.volume = volume[0]/100
        musicPlayer.play()

        document.querySelector(".endScore").textContent = "?"
        document.querySelector(".endCombo").textContent = "?"
        document.querySelector(".endAcc").textContent = "?"
        document.querySelector(".endRank").innerHTML = "?"

        document.querySelector(".scoreleader").innerHTML = ""
        document.querySelector(".comboleader").innerHTML = ""
        document.querySelector(".accleader").innerHTML = ""
        setTimeout(function(){
            document.querySelector(".endScore").textContent = numeral(player.points).format("0,0")
            document.querySelector(".endCombo").textContent = "x" + numeral(player.bestcombo).format("0,0")
            document.querySelector(".endAcc").textContent = numeral(player.acc).format("0.00%")

            if (player.acc >= 0.95){
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

        if (document.querySelector(".crosshair").style.rotate != "0deg"){
            document.querySelector(".crosshair").style.rotate = "0deg"
        }

        if (player.gun.name == ""){
            document.querySelector(".crosshair").style.height = "10px"
            document.querySelector(".crosshair").style.width = "10px"

            if (document.querySelector(".crosshair").style.rotate != "45deg"){
                document.querySelector(".crosshair").style.rotate = "45deg"
            }
        }
    } else {
        document.querySelector(".crosshair").style.height = guns[gun].spread[0] + "px"
        document.querySelector(".crosshair").style.width = guns[gun].spread[0] + "px"
        document.querySelector(".crosshair").style.top = (mousePos[1] -(guns[gun].spread[0]/2)) + "px"
        document.querySelector(".crosshair").style.left = (mousePos[0] -(guns[gun].spread[0]/2)) + "px"
    }
}, 10)

console.log("cock and/or balls")