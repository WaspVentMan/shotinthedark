let player = {}
const target = document.querySelector(".target")
const songSelect = document.querySelector(".songSelect")

const guns = {
    "none": {
        "ammo": [0, 0],
        "auto": false,
        "rate": 1e100,
        "reload": 1e100,
        "autoReload": false,
        "name": "",
        "spread": [0, 0],
        "spreadRate": 0,
        "scoreMult": 0,
        "bullet": "",
        "case": ""
    },
    "basic": {
        "ammo": [15, 15],
        "auto": true,
        "rate": 160,
        "reload": 750,
        "autoReload": false,
        "name": "Automatic Pistol",
        "spread": [15, 50],
        "spreadRate": 2,
        "scoreMult": 1,
        "bullet": "img/bullet.png",
        "case": "img/case.png"
    },
    "classic": {
        "ammo": [15, 15],
        "auto": false,
        "rate": 40,
        "reload": 750,
        "autoReload": false,
        "name": "Manual Pistol",
        "spread": [15, 50],
        "spreadRate": 2,
        "scoreMult": 1,
        "bullet": "img/bullet.png",
        "case": "img/case.png"
    },
    "pico": {
        "ammo": [32, 32],
        "auto": true,
        "rate": 40,
        "reload": 1000,
        "autoReload": false,
        "name": "Pico's MAC-10",
        "spread": [29, 200],
        "spreadRate": 7.5,
        "scoreMult": 0.25,
        "bullet": "img/bullet.png",
        "case": "img/case.png",
        "img": "img/pico.png"
    },
    "picoPlus": {
        "ammo": [312, 312],
        "auto": true,
        "rate": 40,
        "reload": 0,
        "autoReload": true,
        "name": "Pico's Debug MAC-10",
        "spread": [5, 1.79e308],
        "spreadRate": 2,
        "scoreMult": 1,
        "bullet": "img/bullet.png",
        "case": "img/case.png"
    },
    "fortnite": {
        "ammo": [7, 7],
        "auto": false,
        "rate": 40,
        "reload": 1000,
        "autoReload": false,
        "name": "Hand Cannon",
        "spread": [5, 200],
        "spreadRate": 100,
        "scoreMult": 4,
        "bullet": "img/heavy.png",
        "case": "img/heavycase.png",
        "shootS": "audio/HC_shoot.mp3",
        "reloadS": "audio/HC_reload.mp3"
    },
    "buckshot": {
        "ammo": [6, 6],
        "auto": false,
        "rate": 400,
        "reload": 1300,
        "autoReload": false,
        "name": "Shotgun",
        "spread": [50, 500],
        "spreadRate": 100,
        "scoreMult": 0.5,
        "buckshot": 10,
        "bullet": "img/slug.png",
        "case": "img/slug.png",
        "shootS": "audio/HC_shoot.mp3",
        "reloadS": "audio/HC_reload.mp3",
        "img": "img/pico.png"
    }
}

let musicPlayer = new Audio(songs["credits"].music)
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
    
    musicPlayer = new Audio(songs[songSelect.value].music)

    document.querySelector(".startScreen").style.display = "none"
    document.querySelector(".leaderboard").style.display = "none"

    gameLoop = setInterval(gameloop, 10)

    musicPlayer.play()
}

let key = {}
let mousePos = []

window.addEventListener('keydown', function (e) {
    key[e.key] = true
})

window.addEventListener('keyup', function (e) {
    key[e.key] = false
})

window.addEventListener('mousedown', function (e) {
    console.log(e.buttons)
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
    if (player.click && player.shoot && player.gun.ammo[1] > 0 && !player.reload && player.lastShot+player.gun.rate < Date.now()){
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
    
            console.log(player.spread)
    
            player.shots.push(Math.floor(distance(Math.abs(x - (targetBounds.x + 64)), Math.abs(y - (targetBounds.y + 64))))-1)
            if (player.shots[player.shots.length-1] < 64){
                player.points += Math.ceil(((((64 - player.shots[player.shots.length-1])*2)**2) + (1 + (player.combo/20)))*player.gun.scoreMult)
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
            } else {
                player.combo = 0
            }
        }

        player.spread += player.gun.spreadRate

        if (player.gun.shootS != undefined){
            let gunshot = new Audio(player.gun.shootS);
            gunshot.volume = 0.2
            gunshot.play();
        } else {
            let gunshot = new Audio(`audio/shot${Math.round(Math.random())+2}.mp3`);
            gunshot.volume = 0.2
            gunshot.play();
        }
    } else {
        if (flashForward < 50){
            flashForward += 25/2
        }

        player.spread -= 2
       
        if (player.spread < player.gun.spread[0]){
            player.spread = player.gun.spread[0]
        } else
        if (player.spread > player.gun.spread[1]){
            player.spread = player.gun.spread[1]
        }
    }

    if (player.gun.name == ""){
        flashForward = 75
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
                gunshot.volume = 0.2
                gunshot.play();
            } else {
                let gunshot = new Audio('audio/reload.mp3');
                gunshot.volume = 0.2
                gunshot.play();
            }

            setTimeout(function(){
                player.reload = false

                player.gun.ammo[1] = player.gun.ammo[0]
            }, player.gun.reload)
        } else {
            player.gun = guns[["basic","pico","fortnite","buckshot"][Math.round(Math.random()*3)]]
            player.reload = false
    
            gunInit()
        }
    }

    if (key["l"]){
        musicPlayer.currentTime = 1e100

        document.querySelector(".leaderboard").style.display = "block"

        let options = {
            "period": NGIO.PERIOD_ALL_TIME,
            "limit": 5
        }

        NGIO.getScores(songs[songSelect.value].leaderboards[0], options, function(scores, board, options){
            document.querySelector(".scoreleader").innerHTML = ""
            for (let rank = 0; rank < 5; rank++){
                if (rank < scores.length){
                    if (scores[rank].user.name == NGIO.user.name ){
                        document.querySelector(".scoreleader").innerHTML += `<u>${rank+1}</u><u>${numeral(scores[rank].value).format("0,0")}</u><u>${scores[rank].user.name}</u>`
                    } else {
                        document.querySelector(".scoreleader").innerHTML += `<p>${rank+1}</p><p>${numeral(scores[rank].value).format("0,0")}</p><p>${scores[rank].user.name}</p>`
                    }
                } else {
                    document.querySelector(".scoreleader").innerHTML += `<p>${rank+1}</p><p></p><p></p>`
                }
            }
        })
        NGIO.getScores(songs[songSelect.value].leaderboards[1], options, function(scores, board, options){
            document.querySelector(".comboleader").innerHTML = ""
            for (let rank = 0; rank < 5; rank++){
                if (rank < scores.length){
                    if (scores[rank].user.name == NGIO.user.name ){
                        document.querySelector(".comboleader").innerHTML += `<u>${rank+1}</u><u>x${numeral(scores[rank].value).format("0,0")}</u><u>${scores[rank].user.name}</u>`
                    } else {
                        document.querySelector(".comboleader").innerHTML += `<p>${rank+1}</p><p>x${numeral(scores[rank].value).format("0,0")}</p><p>${scores[rank].user.name}</p>`
                    }
                } else {
                    document.querySelector(".comboleader").innerHTML += `<p>${rank+1}</p><p></p><p></p>`
                }
            }
        })
        NGIO.getScores(songs[songSelect.value].leaderboards[2], options, function(scores, board, options){
            document.querySelector(".accleader").innerHTML = ""
            for (let rank = 0; rank < 5; rank++){
                if (rank < scores.length){
                    if (scores[rank].user.name == NGIO.user.name ){
                        document.querySelector(".accleader").innerHTML += `<u>${rank+1}</u><u>${numeral(scores[rank].value/10000).format("0.00%")}</u><u>${scores[rank].user.name}</u>`
                    } else {
                        document.querySelector(".accleader").innerHTML += `<p>${rank+1}</p><p>${numeral(scores[rank].value/10000).format("0.00%")}</p><p>${scores[rank].user.name}</p>`
                    }
                } else {
                    document.querySelector(".accleader").innerHTML += `<p>${rank+1}</p><p></p><p></p>`
                }
            }
        })

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
                player.bullets[x].x = 30 + (40*Math.floor(x/24))
                player.bullets[x].y = 20+ 2 + (17*(x-(Math.floor(x/24)*24)))
                player.bullets[x].r = 0

                if (player.gun.ammo[1] == x+1){
                    player.bullets[x].x -= 5
                } else if (player.gun.ammo[1] == x+2){
                    player.bullets[x].x -= 20
                } else if (player.gun.ammo[1] == x+3){
                    player.bullets[x].x -= 25
                } else if (player.gun.ammo[1] == x+4){
                    player.bullets[x].x -= 27.5
                } else {
                    player.bullets[x].x -= 30
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

    player.acc = 0
    for (let z = 0; z < player.shots.length; z++){
        if (player.shots[z] < 64){
            player.acc += (64-(Math.ceil(player.shots[z]/4)))/64
        }
    }
    player.acc /= player.shots.length

    document.querySelector(".acc").textContent = numeral(player.acc).format("0.00%")

    if (musicPlayer.ended){
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

            if (!NGIO.getMedal(79203).unlocked && player.points >= 1e6){
                NGIO.unlockMedal(79203, onMedalUnlocked)
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
        }

        let options = {
            "period": NGIO.PERIOD_ALL_TIME,
            "limit": 5
        }

        if (player.gun.name == "Pico's Debug MAC-10" || player.shots.length <= 10){
            NGIO.getScores(songs[songSelect.value].leaderboards[0], options, function(scores, board, options){
                document.querySelector(".scoreleader").innerHTML = ""
                for (let rank = 0; rank < 5; rank++){
                    if (rank < scores.length){
                        if (scores[rank].user.name == NGIO.user.name ){
                            document.querySelector(".scoreleader").innerHTML += `<u>${rank+1}</u><u>${numeral(scores[rank].value).format("0,0")}</u><u>${scores[rank].user.name}</u>`
                        } else {
                            document.querySelector(".scoreleader").innerHTML += `<p>${rank+1}</p><p>${numeral(scores[rank].value).format("0,0")}</p><p>${scores[rank].user.name}</p>`
                        }
                    } else {
                        document.querySelector(".scoreleader").innerHTML += `<p>${rank+1}</p><p></p><p></p>`
                    }
                }
            })
            NGIO.getScores(songs[songSelect.value].leaderboards[1], options, function(scores, board, options){
                document.querySelector(".comboleader").innerHTML = ""
                for (let rank = 0; rank < 5; rank++){
                    if (rank < scores.length){
                        if (scores[rank].user.name == NGIO.user.name ){
                            document.querySelector(".comboleader").innerHTML += `<u>${rank+1}</u><u>x${numeral(scores[rank].value).format("0,0")}</u><u>${scores[rank].user.name}</u>`
                        } else {
                            document.querySelector(".comboleader").innerHTML += `<p>${rank+1}</p><p>x${numeral(scores[rank].value).format("0,0")}</p><p>${scores[rank].user.name}</p>`
                        }
                    } else {
                        document.querySelector(".comboleader").innerHTML += `<p>${rank+1}</p><p></p><p></p>`
                    }
                }
            })
            NGIO.getScores(songs[songSelect.value].leaderboards[2], options, function(scores, board, options){
                document.querySelector(".accleader").innerHTML = ""
                for (let rank = 0; rank < 5; rank++){
                    if (rank < scores.length){
                        if (scores[rank].user.name == NGIO.user.name ){
                            document.querySelector(".accleader").innerHTML += `<u>${rank+1}</u><u>${numeral(scores[rank].value/10000).format("0.00%")}</u><u>${scores[rank].user.name}</u>`
                        } else {
                            document.querySelector(".accleader").innerHTML += `<p>${rank+1}</p><p>${numeral(scores[rank].value/10000).format("0.00%")}</p><p>${scores[rank].user.name}</p>`
                        }
                    } else {
                        document.querySelector(".accleader").innerHTML += `<p>${rank+1}</p><p></p><p></p>`
                    }
                }
            })
        } else {
            NGIO.postScore(songs[songSelect.value].leaderboards[0], player.points, function(){
                NGIO.getScores(songs[songSelect.value].leaderboards[0], options, function(scores, board, options){
                    document.querySelector(".scoreleader").innerHTML = ""
                    for (let rank = 0; rank < 5; rank++){
                        if (rank < scores.length){
                            if (scores[rank].user.name == NGIO.user.name ){
                                document.querySelector(".scoreleader").innerHTML += `<u>${rank+1}</u><u>${numeral(scores[rank].value).format("0,0")}</u><u>${scores[rank].user.name}</u>`
                            } else {
                                document.querySelector(".scoreleader").innerHTML += `<p>${rank+1}</p><p>${numeral(scores[rank].value).format("0,0")}</p><p>${scores[rank].user.name}</p>`
                            }
                        } else {
                            document.querySelector(".scoreleader").innerHTML += `<p>${rank+1}</p><p></p><p></p>`
                        }
                    }
                })
            })
            NGIO.postScore(songs[songSelect.value].leaderboards[1], player.bestcombo, function(){
                NGIO.getScores(songs[songSelect.value].leaderboards[1], options, function(scores, board, options){
                    document.querySelector(".comboleader").innerHTML = ""
                    for (let rank = 0; rank < 5; rank++){
                        if (rank < scores.length){
                            if (scores[rank].user.name == NGIO.user.name ){
                                document.querySelector(".comboleader").innerHTML += `<u>${rank+1}</u><u>x${numeral(scores[rank].value).format("0,0")}</u><u>${scores[rank].user.name}</u>`
                            } else {
                                document.querySelector(".comboleader").innerHTML += `<p>${rank+1}</p><p>x${numeral(scores[rank].value).format("0,0")}</p><p>${scores[rank].user.name}</p>`
                            }
                        } else {
                            document.querySelector(".comboleader").innerHTML += `<p>${rank+1}</p><p></p><p></p>`
                        }
                    }
                })
            })
            NGIO.postScore(songs[songSelect.value].leaderboards[2], Math.floor((player.acc)*10000), function(){
                NGIO.getScores(songs[songSelect.value].leaderboards[2], options, function(scores, board, options){
                    document.querySelector(".accleader").innerHTML = ""
                    for (let rank = 0; rank < 5; rank++){
                        if (rank < scores.length){
                            if (scores[rank].user.name == NGIO.user.name ){
                                document.querySelector(".accleader").innerHTML += `<u>${rank+1}</u><u>${numeral(scores[rank].value/10000).format("0.00%")}</u><u>${scores[rank].user.name}</u>`
                            } else {
                                document.querySelector(".accleader").innerHTML += `<p>${rank+1}</p><p>${numeral(scores[rank].value/10000).format("0.00%")}</p><p>${scores[rank].user.name}</p>`
                            }
                        } else {
                            document.querySelector(".accleader").innerHTML += `<p>${rank+1}</p><p></p><p></p>`
                        }
                    }
                })
            })
        }

        clearInterval(gameLoop)
        return
    }

    //try {
        for (let x = 0; x < songs[songSelect.value].chart.length; x++){
            if (musicPlayer.currentTime > songs[songSelect.value].chart[x].time && musicPlayer.currentTime < songs[songSelect.value].chart[x+1].time){
                let ratio = (musicPlayer.currentTime - songs[songSelect.value].chart[x].time) / (songs[songSelect.value].chart[x+1].time - songs[songSelect.value].chart[x].time)
                target.style.marginLeft = (songs[songSelect.value].chart[x].pos[0] + ((songs[songSelect.value].chart[x+1].pos[0] - songs[songSelect.value].chart[x].pos[0])*ratio)) + "px"
                target.style.marginTop = (songs[songSelect.value].chart[x].pos[1] + ((songs[songSelect.value].chart[x+1].pos[1] - songs[songSelect.value].chart[x].pos[1])*ratio)) + "px"
    
                break
            }
        }
    
        for (let x = 0; x < songs[songSelect.value].guns.length; x++){
            if (musicPlayer.currentTime > songs[songSelect.value].guns[x].time && musicPlayer.currentTime < songs[songSelect.value].guns[x+1].time && player.gun.name != guns[songs[songSelect.value].guns[x].gun].name){
                player.gun = guns[songs[songSelect.value].guns[x].gun]
                gunInit()
                break
            }
        }
    
        for (let x = 0; x < songs[songSelect.value].subtitle.length; x++){
            if (musicPlayer.currentTime > songs[songSelect.value].subtitle[x].time && musicPlayer.currentTime < songs[songSelect.value].subtitle[x+1].time){
                document.querySelector(".subtitle").innerHTML = songs[songSelect.value].subtitle[x].subtitle
                break
            }
        }
    //} catch (e) {
    //    console.log(e)
    //}
    
    
    document.querySelector(".score").textContent = numeral(player.points).format("0,0") + " "
    document.querySelector(".combo").textContent = "x" + numeral(player.combo).format("0,0") + " (x" + numeral(player.bestcombo).format("0") + ")"
    document.querySelector(".time").textContent = numeral(musicPlayer.currentTime).format("00:00") + " / " + numeral(musicPlayer.duration).format("00:00")
    document.querySelector(".name").textContent = songs[songSelect.value].artist + " - " + songs[songSelect.value].name
    document.querySelector(".light").style.backgroundImage = "url('" + songs[songSelect.value].art + "')"
}

let gameLoop = ""

setInterval(function(){
    let gun = document.querySelector(".weapon").value

    if (player.gun != undefined){
        document.querySelector(".crosshair").style.height = player.spread + "px"
        document.querySelector(".crosshair").style.width = player.spread + "px"
        document.querySelector(".crosshair").style.top = (mousePos[1] -(player.spread/2)) + "px"
        document.querySelector(".crosshair").style.left = (mousePos[0] -(player.spread/2)) + "px" 
        document.querySelector(".crosshair").style.rotate = "0deg"   

        if (player.gun.name == ""){
            document.querySelector(".crosshair").style.rotate = "45deg"
            document.querySelector(".crosshair").style.height = "10px"
            document.querySelector(".crosshair").style.width = "10px"
        }
    } else {
        document.querySelector(".crosshair").style.height = guns[gun].spread[0] + "px"
        document.querySelector(".crosshair").style.width = guns[gun].spread[0] + "px"
        document.querySelector(".crosshair").style.top = (mousePos[1] -(guns[gun].spread[0]/2)) + "px"
        document.querySelector(".crosshair").style.left = (mousePos[0] -(guns[gun].spread[0]/2)) + "px"
    }
    
    document.querySelector(".gunInfoMag").textContent = guns[gun].ammo[0]
    document.querySelector(".gunInfoMode").textContent = ["Manual", "Automatic"][guns[gun].auto+0]
    if (guns[gun].rate != 0){
        document.querySelector(".gunInfoRate").textContent = (1000/guns[gun].rate) + "/s"
    } else {
        document.querySelector(".gunInfoRate").textContent = "As Fast As You Can Click!"
    }
    document.querySelector(".gunInfoReload").textContent = (guns[gun].reload/1000) + "s"
    document.querySelector(".gunInfoAcc").textContent = guns[gun].spread[0] + " (Max " + guns[gun].spread[1] + ")"
    document.querySelector(".gunInfoAccDec").textContent = guns[gun].spreadRate
    document.querySelector(".gunInfoScore").textContent = guns[gun].scoreMult + "x"
}, 10)