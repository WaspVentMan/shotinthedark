let offline = false

// Set up the options for NGIO.
var options = {
    version: "0",
    preloadScoreBoards: true,
    preloadMedals: true,
    preloadSaveSlots: true
};

NGIO.init("58408:0ZunjkMB", "Ca7ijAMxmngDx6FYGVsVOg==", options);

let ngLoop = setInterval(function(){
    document.querySelector(".con").innerHTML = ["ONLINE", "OFFLINE"][offline+0]
    NGIO.getConnectionStatus(function(status) {
        
        // You could hide any login/preload UI elements here (we'll show what we need later).

        // This is a generic check to see if we're waiting for something...
        if (NGIO.isWaitingStatus) {
            let genericWait = "WAITING FOR<br><img src=\"img/newgroundstitle.png\" style=\"width: 256px\">"
            document.querySelector(".NewgroundsIO").innerHTML = genericWait

            // We're either waiting for the server to respond, or the user to sign in on Newgrounds.
            // Show a "please wait" message and/or a spinner so the player knows something is happening
        }

        // check the actual connection status
        switch (status) {

            // we have version and license info
            case NGIO.STATUS_LOCAL_VERSION_CHECKED:

                if (NGIO.isDeprecated) {
                    document.querySelector(".ver").innerHTML = "v" + options.version + " (outdated)"
                } else {
                    document.querySelector(".ver").innerHTML = "v" + options.version
                }

                if (!NGIO.legalHost) {
                    document.body.innerHTML = "<h1>THIS GAME IS BEING HOSTED ILLEGALLY, GO TO <a href=\"https://waspventman.co.uk\">WASPVENTMAN.CO.UK</a> OR <a href=\"https://waspventman.newgrounds.com/\">WASPVENTMAN.NEWGROUNDS.COM</a></h1>"
                }

                break

            // user needs to log in
            case NGIO.STATUS_LOGIN_REQUIRED:
                document.querySelector(".NewgroundsIO").innerHTML = "<p onclick=\"NGIO.openLoginPage()\" style=\"height: max-content\">PLEASE LOG INTO<br><img src='img/newgroundstitle.png' style='width: 256px'></p><div onclick=\"NGIO.skipLogin(); offline = true\"><p>No thanks</p><p>(No Medals or Leaderboards)</p></div>"

                // Show a "Log In" button that calls NGIO.openLoginPage();
                // Show a "No Thanks" button that calls NGIO.skipLogin();

                break

            // We are waiting for the user to log in (they should have a login page in a new browser tab)
            case NGIO.STATUS_WAITING_FOR_USER:
                document.querySelector(".NewgroundsIO").innerHTML = "<p onclick=\"NGIO.cancelLogin(); offline = true\">CONNECTING TO<br><img src='img/newgroundstitle.png' style='width: 256px'><br>Click to cancel and play logged out</p>"

                // Show a "Cancel Login" button that calls NGIO.cancelLogin();
                
                break;

            // user needs to log in
            case NGIO.STATUS_READY:
                document.querySelector(".NewgroundsIO").innerHTML = "Click To Start."

                // If NGIO.hasUser is false, the user opted not to sign in, so you may
                // need to do some special handling in your game.

                let slot = NGIO.getSaveSlot(1);

                if (slot.hasData) {
                    // It sure does! You can even see when it was last updated via: slot.getDate()

                    // The slot instance has a method for loading as well, if you don't want to use the NGIO wrapper:
                    slot.getData(function(data){
                        scores = JSON.parse(data)
                    })
                }
                
                break
        }

    })
}, 100)

function unlockMedal(medal, condition = true){
    if (!offline){
        if (!NGIO.getMedal(medal).unlocked && condition){
            NGIO.unlockMedal(medal, onMedalUnlocked)
        }
    }
}

function onMedalUnlocked(medal)
{
    console.log(`Granted medal: "${medal.name}"`)
    document.querySelector(".achievement").innerHTML += `<div style="display: flex; background-color: black;" onclick="this.remove()"><div style="text-align: right; margin-right: 8px; margin-left: auto;"><p style="text-align: right; text-overflow: ellipsis; overflow: hidden;">${medal.name}</p><p style="text-align: right; text-overflow: ellipsis; overflow: hidden;">${medal.description}</p><p style="text-align: right; text-overflow: ellipsis; overflow: hidden;">+${medal.value} Points</p></div><img style="height: 50px" src="https:${medal.icon}.png"></div>`
    /**
     * Show a medal popup.  You can get medal information like so:
     *   medal.id
     *   medal.name
     *   medal.description
     *   medal.value
     *   medal.icon  (note, these are usually .webp files, and may not work in all frameworks)
     */
}

//NGIO.UnlockMedal(medal_id, onMedalUnlocked);