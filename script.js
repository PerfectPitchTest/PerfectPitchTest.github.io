const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
let notesAudio = [];
let chosenNote;
let writtenNote;
let difficalty = 11;
let lastNote;
let lastWrittenNote;
let score = 0;
let isRunning = false;
const questionElement = document.getElementsByClassName("Question");
let seconds = 45;
let randomIndex;
const timerElement = document.querySelector(".timer");
const timerOffColor = "#999898"
const timerOnColor = "#e9e7e7"

timerElement.style.color = timerOffColor;
for(let i=0; i<notes.length; i++){
    let currentNote = notes[i]
    notesAudio[i] = new Audio(currentNote.replace('#', ' sharp') + ".mp3");
    notesAudio[i].preload = "auto";
}

function selectNote(){
    randomIndex = Math.floor(Math.random() * notes.length);
    while (notes[randomIndex] == lastWrittenNote || notes[randomIndex] == lastNote){
        randomIndex = Math.floor(Math.random() * notes.length);
    }
    chosenNote = notes[randomIndex];
    writtenNote = chosenNote;
    lastWrittenNote = writtenNote;
    questionElement[0].textContent = 'Is this the note ' + chosenNote + '?';
    if (Math.floor(Math.random() * 2) == 0){
        randomIndex = Math.floor(Math.random() * notes.length);
        while (notes[randomIndex] == chosenNote || notes[randomIndex] == lastNote){
            randomIndex = Math.floor(Math.random() * notes.length);
        }
        chosenNote = notes[randomIndex];
    }
    
    lastNote = chosenNote;
}

function playNote(pressed) {
    if (!isRunning && pressed) {
        seconds = 45;
        isRunning = true;
        timerElement.style.color = timerOnColor;

        
        selectNote();
    }

    notesAudio[randomIndex].play();

    notesAudio[randomIndex].currentTime = 0;
}


function isNote(bool) {
    if(!isRunning)
        return;
    const correctColor = "rgb(90, 179, 90)";
    const wrongColor = "rgb(226, 78, 78)";

    // Change the background color based on the answer
    if ((writtenNote == chosenNote) == bool) {
        timerElement.style.color = correctColor;  // Correct answer
        seconds += 5;
        score += 1;
    } else {
        timerElement.style.color = wrongColor;  // Wrong answer
        seconds -= 10;
    }

    setTimeout(() => {
        timerElement.style.color = isRunning ? timerOnColor : timerOffColor;

        if (isRunning) {
            notesAudio[randomIndex].pause();     // Pause the playback
            selectNote();
        }
    }, 380);

    setTimeout(() => {
        if (isRunning) {
            playNote(false);
        }
    }, 420);
    
}



function updateTimer() {
    // Increment seconds
    if(isRunning){
        seconds -= 0.2;

        if(seconds <= 0){
            seconds = 0;
            isRunning = false;
            timerElement.style.color = timerOffColor;
            questionElement[0].innerHTML = `<b>Score: ${score}</b><br>Press the note to restart`;
            score = 0;
        }
    }
    // Convert seconds to minutes and seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds) % 60;

    // Format the time as MM:SS
    const timeFormatted = `${minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;

    // Update the text content of the timer element
    timerElement.textContent = timeFormatted;

    // Stop the timer after 60 seconds
    if (seconds === 60) {
        clearInterval(timerInterval);
    }
}

// Start the timer
const timerInterval = setInterval(updateTimer, 200); // Update every 200ms
