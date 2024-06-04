let player = {}
const guns = {
    "basic": {
        "ammo": [15, 15],
        "auto": false,
        "rate": 0,
        "reload": 750,
        "autoReload": false,
        "name": "Basic Pistol",
        "spread": [5, 1e100],
        "spreadRate": 20,
        "scoreMult": 1,
        "bullet": "img/bullet.png",
        "case": "img/case.png",
        "crosshair": {
            "img": "img/cross.png",
            "size": 15
        }
    },
    "pico": {
        "ammo": [32, 32],
        "auto": true,
        "rate": 40,
        "reload": 1000,
        "autoReload": false,
        "name": "Pico's MAC-10",
        "spread": [10, 65],
        "spreadRate": 25,
        "scoreMult": 0.25,
        "bullet": "img/bullet.png",
        "case": "img/case.png",
        "crosshair": {
            "img": "img/crosspico.png",
            "size": 69
        }
    },
    "fortnite": {
        "ammo": [7, 7],
        "auto": false,
        "rate": 0,
        "reload": 1000,
        "autoReload": false,
        "name": "Hand Cannon",
        "spread": [0, 1e100],
        "spreadRate": 1000,
        "scoreMult": 10,
        "bullet": "img/bullet.png",
        "case": "img/case.png",
        "crosshair": {
            "img": "img/crossdeadshot.png",
            "size": 3
        }
    }
}

let musicPlayer = new Audio("audio/Credits.mp3")

function init(){
    player = {
        "click": false,
        "shoot": false,
        "reload": false,
        "gun": guns[document.querySelector(".weapon").value],
        "lastShot": 0,
        "spread": 0,
        "points": 0,
        "combo": 0,
        "bestcombo": 0,
        "acc": 0,
        "bullets": [],
        "shots": []
    }

    document.querySelector(".bullets").innerHTML = ""
    for (let x = 0; x < player.gun.ammo[0]; x++){
        player.bullets.push({"x": 0, "y": 0, "xv": 0, "yv": 0, "r": 0, "rv": 0})
    
        let temp = document.createElement("div")
        temp.className = "bullet bullet" + x
        document.querySelector(".bullets").appendChild(temp)
    }

    document.querySelector(".gunName").innerHTML = player.gun.name
    
    musicPlayer = new Audio("audio/Credits.mp3")

    document.querySelector(".startScreen").style.display = "none"
    document.querySelector(".leaderboard").style.display = "none"

    gameLoop = setInterval(gameloop, 10)

    musicPlayer.play()

    player.gun.ammo[1] = player.gun.ammo[0]
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
    player.click = true
    player.shoot = true
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
        document.querySelector(".darkness").style.backgroundColor = "#00000000"
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

        let x = (mousePos[0]+((Math.random()*player.spread)-(player.spread/2))) 
        let y = (mousePos[1]+((Math.random()*player.spread)-(player.spread/2)))

        console.log(player.spread)

        player.shots.push(distance(Math.abs(x - (targetBounds.x + 64)), Math.abs(y - (targetBounds.y + 64))))
        if (player.shots[player.shots.length-1] < 64){
            player.points += Math.ceil(((((64 - player.shots[player.shots.length-1])*2)**2) + (1 + (player.combo/20)))*player.gun.scoreMult)
            player.combo++

            if (player.combo > player.bestcombo){
                player.bestcombo = player.combo
            }

            document.querySelector(".hitmarker").style.top = (y -7.5) + "px"
            document.querySelector(".hitmarker").style.left = (x -7.5) + "px"
            document.querySelector(".hitmarker").style.display = "block"
        } else {
            player.combo = 0
        }

        player.spread += player.gun.spreadRate

        let gunshot = new Audio(`audio/shot${Math.round(Math.random())+2}.mp3`);
        gunshot.volume = 0.2
        gunshot.play();
    } else {
        document.querySelector(".hitmarker").style.display = "none"
        document.querySelector(".darkness").style.backgroundColor = "#000000"

        player.spread *= 0.9
        if (player.spread < player.gun.spread[0]){
            player.spread = player.gun.spread[0]
        } else
        if (player.spread > player.gun.spread[1]){
            player.spread = player.gun.spread[1]
        }
    }

    if (key["r"] && !player.reload && player.gun.ammo[1] != player.gun.ammo[0] || player.gun.autoReload && player.gun.ammo[1] == 0){
        player.reload = true
        player.shoot = false

        let gunshot = new Audio('audio/reload.mp3');
        gunshot.volume = 0.2
        gunshot.play();

        setTimeout(function(){
            player.reload = false

            player.gun.ammo[1] = player.gun.ammo[0]
        }, player.gun.reload)
    }

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
            player.bullets[x].x = 30 + (40*Math.floor(x/16))
            player.bullets[x].y = 20+ 2 + (17*(x-(Math.floor(x/16)*16)))
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
            player.bullets[x].rv = Math.random()*39-20
        }
    }

    // frame rate of object drops if you don't have this?
    if (musicPlayer.playbackRate = 1){
        musicPlayer.playbackRate = 0.999
    } else {
        musicPlayer.playbackRate = 1
    }

    player.acc = 0
    for (let z = 0; z < player.shots.length; z++){
        if (player.shots[z] < 64){
            player.acc += (32+(Math.floor(player.shots[z])/2))/64
        }
    }
    player.acc /= player.shots.length

    document.querySelector(".acc").textContent = numeral(player.acc).format("0.00%")

    if (musicPlayer.ended){
        document.querySelector(".leaderboard").style.display = "block"

        let options = {
            "period": NGIO.PERIOD_ALL_TIME,
            "limit": 5
        }

        NGIO.postScore(13801, player.points, function(){
            NGIO.getScores(13801, options, function(scores, board, options){
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
        NGIO.postScore(13802, player.bestcombo, function(){
            NGIO.getScores(13802, options, function(scores, board, options){
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

        NGIO.postScore(13804, Math.floor((player.acc)*10000), function(){
            NGIO.getScores(13804, options, function(scores, board, options){
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

        clearInterval(gameLoop)
        return
    }

    document.querySelector(".score").textContent = numeral(player.points).format("0,0")
    document.querySelector(".combo").textContent = "x" + numeral(player.combo).format("0,0") + " (x" + numeral(player.bestcombo).format("0") + ")"
    document.querySelector(".time").textContent = numeral(musicPlayer.currentTime).format("00:00") + " / " + numeral(musicPlayer.duration).format("00:00")
}

let gameLoop = ""

setInterval(function(){
    let gun = document.querySelector(".weapon").value
    document.querySelector(".crosshair").style.backgroundImage = "url('" + guns[gun].crosshair.img + "')"
    document.querySelector(".crosshair").style.height = guns[gun].crosshair.size + "px"
    document.querySelector(".crosshair").style.width = guns[gun].crosshair.size + "px"
    document.querySelector(".crosshair").style.top = (mousePos[1] -(guns[gun].crosshair.size/2)) + "px"
    document.querySelector(".crosshair").style.left = (mousePos[0] -(guns[gun].crosshair.size/2)) + "px"

    document.querySelector(".gunInfoName").textContent = guns[gun].name
    document.querySelector(".gunInfoMag").textContent = guns[gun].ammo[0]
    if (guns[gun].rate != 0){
        document.querySelector(".gunInfoRate").textContent = (1000/guns[gun].rate) + "/s"
    } else {
        document.querySelector(".gunInfoRate").textContent = "As Fast As You Can Click!"
    }
    document.querySelector(".gunInfoScore").textContent = guns[gun].scoreMult + "x"
}, 10)