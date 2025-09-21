console.log('hello');
let currentsong = new Audio()

function formatSeconds(totalSeconds) {
    totalSeconds = Math.floor(totalSeconds);  // Convert to integer seconds

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}.${formattedSeconds}`;
}


async function getSongs() {

    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }

    }
    return songs

}

const playMusic = (track, pause = false) => {
    currentsong.src = "/songs/" + track
    if (!pause) {
        currentsong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}
async function main() {

    // get list of all the songs
    let songs = await getSongs()
    playMusic(songs[0], true)
   

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `   <li>
                        <img class="invert" src="music.svg" alt="">
                        <div class="info ">
                            <div>${song.replaceAll("%20", "")}</div>
                            <div>Arbaj khan</div>
                        </div>
                        <div class="playnow">
                          <span>PlayNow</span>
                            <img class="invert" src="play.svg" alt="">
                        </div>
                      </li>`
    }

    // attch an event listner to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {

            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })

    // attach event listner to play
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "play.svg"
        }
    })

  
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatSeconds(currentsong.currentTime)}:
       / ${formatSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

    // add the event listner on the hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    // add the event listner on the close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

      // attech enent listner to previous 
      previous.addEventListener("click",()=>{
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
       if((index-1) >= 0){
        playMusic(songs[index-1])
       }
       
        
    })
    // attech enent listner to next
    next.addEventListener("click",()=>{
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
       if((index+1) > length){
        playMusic(songs[index+1])
       }
       
        
    })
    

}
main()