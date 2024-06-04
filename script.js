let player = {
    "click": false,
    "shoot": false,
    "reload": false,
    "ammo": [15, 15],
    "points": 0,
    "combo": 0,
    "bestcombo": 0,
    "acc": 0,
    "bullets": [],
    "shots": []
}

let musicPlayer = new Audio("audio/Credits.mp3")

for (let x = 0; x < player.ammo[0]; x++){
    player.bullets.push({"x": 0, "y": 0, "xv": 0, "yv": 0, "r": 0, "rv": 0})

    let temp = document.createElement("div")
    temp.className = "bullet bullet" + x
    document.querySelector(".bullets").appendChild(temp)
}

function init(){
    player = {
        "click": false,
        "shoot": false,
        "reload": false,
        "ammo": [15, 15],
        "points": 0,
        "combo": 0,
        "bestcombo": 0,
        "acc": 0,
        "bullets": [],
        "shots": []
    }

    for (let x = 0; x < player.ammo[0]; x++){
        player.bullets.push({"x": 0, "y": 0, "xv": 0, "yv": 0, "r": 0, "rv": 0})
    
        let temp = document.createElement("div")
        temp.className = "bullet bullet" + x
        document.querySelector(".bullets").appendChild(temp)
    }
    
    musicPlayer = new Audio("audio/Credits.mp3")

    document.querySelector(".startScreen").style.display = "block"
    document.querySelector(".leaderboard").style.display = "none"
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
})

function distance(x, y){return Math.sqrt((x**2) + (y**2))}

onmousemove = function(e){mousePos = [e.clientX, e.clientY]}

function gameloop(){
    if (!player.click && player.shoot && player.ammo[1] > 0 && !player.reload){
        document.querySelector(".darkness").style.backgroundColor = "#00000000"
        player.shoot = false
        player.ammo[1] --

        let targetBounds = document.querySelector(".target").getBoundingClientRect()
        player.shots.push({"click": mousePos, "target": targetBounds})

        let x = Math.abs(mousePos[0] - (targetBounds.x + 64))
        let y = Math.abs(mousePos[1] - (targetBounds.y + 64))
        if (distance(x, y) < 64){
            player.points += Math.ceil((((64 - distance(x, y))*2)**2) + (1 + (player.combo/20)))
            player.combo++

            if (player.combo > player.bestcombo){
                player.bestcombo = player.combo
            }
        } else {
            player.combo = 0
        }

        let gunshot = new Audio(`audio/shot${Math.round(Math.random())+2}.mp3`);
        gunshot.volume = 0.2
        gunshot.play();
    } else {
        document.querySelector(".darkness").style.backgroundColor = "#000000"
    }

    if (key["r"] && !player.reload && player.ammo[1] != player.ammo[0]){
        player.reload = true
        player.shoot = false

        let gunshot = new Audio('audio/reload.mp3');
        gunshot.volume = 0.2
        gunshot.play();

        setTimeout(function(){
            player.reload = false

            player.ammo[1] = player.ammo[0]
        }, 750)
    }

    for (let x = 0; x < player.bullets.length; x++){
        let htmlBullet = document.querySelector(".bullet" + x)

        htmlBullet.style.left = player.bullets[x].x + "px"
        htmlBullet.style.bottom = player.bullets[x].y + "px"
        htmlBullet.style.rotate = player.bullets[x].r + "deg"
        htmlBullet.style.backgroundImage = "url('img/bullet.png')"
        
        if (player.ammo[1] <= x){
            if (player.reload && x > player.ammo[1]){
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
            }
        } else {
            if (player.ammo[1] == x+1){
                player.bullets[x].x = -5
            } else if (player.ammo[1] == x+2){
                player.bullets[x].x = -20
            } else if (player.ammo[1] == x+3){
                player.bullets[x].x = -25
            } else if (player.ammo[1] == x+4){
                player.bullets[x].x = -27.5
            } else {
                player.bullets[x].x = -30
                htmlBullet.style.backgroundImage = "url('img/case.png')"
            }
            
            player.bullets[x].y = 2 + (17*x)
            player.bullets[x].r = 0

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
        let x = Math.abs(player.shots[z].click[0] - (player.shots[z].target.x + 64))
        let y = Math.abs(player.shots[z].click[1] - (player.shots[z].target.y + 64))
        if (distance(x, y) < 64){
            player.acc += (32+(distance(x, y)/2))/64
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

let gameLoop = setInterval(gameloop, 10)