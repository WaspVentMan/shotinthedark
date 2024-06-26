class gunForge{
    constructor(
        name,
        ammo = [0, 0],
        rate = 0,
        auto = false,
        reload = 0,
        autoReload = false,
        spread = [0, 0],
        spreadRate = 0,
        scoreMult = 0,
        buckshot = 0,
        bulletImg = "",
        caseImg = "",
        shootSnd = "",
        reloadSnd = "",
        img = ""
    ){
        this.ammo = ammo
        this.auto = auto
        this.rate = rate
        this.reload = reload
        this.autoReload = autoReload
        this.name = name
        this.spread = spread
        this.spreadRate = spreadRate
        this.scoreMult = scoreMult
        this.buckshot = buckshot
        this.bullet = bulletImg
        this.case = caseImg
        this.shootS = shootSnd
        this.reloadS = reloadSnd
        this.img = img
    }
}

const guns = {
    "none": new gunForge(""),
    "classic": {
        "ammo": [17, 17],
        "auto": false,
        "rate": 0,
        "reload": 750,
        "autoReload": false,
        "name": "Pistol",
        "spread": [15, 50],
        "spreadRate": 10,
        "scoreMult": 1,
        "reloadS": "audio/reload.mp3",
        "bullet": "img/bullet.png",
        "case": "img/case.png",
        "img": "img/classic.png"
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
        "scoreMult": 0.5,
        "reloadS": "audio/reload.mp3",
        "bullet": "img/bullet.png",
        "case": "img/case.png",
        "img": "img/pico.png"
    },
    "fortnite": {
        "ammo": [7, 7],
        "auto": false,
        "rate": 0,
        "reload": 1000,
        "autoReload": false,
        "name": "Hand Cannon",
        "spread": [5, 200],
        "spreadRate": 50,
        "scoreMult": 4,
        "bullet": "img/heavy.png",
        "case": "img/heavycase.png",
        "shootS": "audio/HC_shoot.mp3",
        "reloadS": "audio/HC_reload.mp3",
        "img": "img/classic.png"
    },
    "buckshot": {
        "ammo": [6, 6],
        "auto": false,
        "rate": 400,
        "reload": 1300,
        "autoReload": false,
        "name": "Shotgun",
        "spread": [50, 500],
        "spreadRate": 50,
        "scoreMult": 0.5,
        "buckshot": 10,
        "bullet": "img/slug.png",
        "case": "img/slug.png",
        "shootS": "audio/HC_shoot.mp3",
        "reloadS": "audio/HC_reload.mp3",
        "img": "img/buckshot.png"
    },
    "rbuster": {
        "ammo": [1, 1],
        "auto": false,
        "rate": 0,
        "reload": 0,
        "delay": 250,
        "autoReload": true,
        "name": "Rude Buster",
        "spread": [29, 200],
        "spreadRate": 35,
        "scoreMult": 1,
        "bullet": "img/none.png",
        "case": "img/none.png",
        "shootS": "audio/snd_rudebuster_swing.wav",
        "reloadS": null,
        "img": "img/rudeBust.png"
    },
    "lmg": {
        "ammo": [100, 100],
        "auto": true,
        "rate": 80,
        "reload": 5000,
        "autoReload": false,
        "name": "LMG",
        "spread": [29, 200],
        "spreadRate": 12.5,
        "scoreMult": 0.75,
        "reloadS": "audio/reload.mp3",
        "bullet": "img/heavy.png",
        "case": "img/heavycase.png",
        "img": "img/pico.png"
    },
    "minigun": {
        "ammo": [250, 250],
        "auto": true,
        "rate": 40,
        "reload": 10000,
        "autoReload": false,
        "name": "Minigun",
        "spread": [29, 999],
        "spreadRate": 5,
        "scoreMult": 0.75,
        "reloadS": "audio/reload.mp3",
        "bullet": "img/bullet.png",
        "case": "img/case.png",
        "img": "img/pico.png"
    }
}