let userScore = 0;
let compScore = 0;

const choices = document.querySelectorAll(".choice");
const msg = document.querySelector("#msg");
const msgContainer = document.querySelector(".msg-container");

const update_1 = document.querySelector("#user-score");
const update_2 = document.querySelector("#comp-score");

const compChoice = () =>{
    const options = ["rock", "paper", "scissor"];
    const x = Math.floor(Math.random()*3);
    return options[x];
};

const drawGame = () => {
    console.log("Game Draw");
    msg.innerText = "Game is drawn!!";
    msgContainer.style.backgroundColor = "Blue";
};


const showWinner = (UserWin, userChoice, comp) => {
    if (UserWin){
        console.log("You win!");
        msg.innerText = `You Win! Your ${userChoice} beats computer's ${comp}`;
        msgContainer.style.backgroundColor = "green";
        update_1.innerText = parseInt(update_1.innerText) + 1;

    } else{
        console.log("You Lost!");
        msg.innerText = `You Lose! Computer's ${userChoice} beats your ${comp}`;
        msgContainer.style.backgroundColor = "red";
        update_2.innerText = parseInt(update_2.innerText) + 1;
    }
};


const playGame =(userChoice) =>{
    console.log("User Choice =",userChoice);
    const comp = compChoice();
    console.log("Comp Choice =",comp);

    if (userChoice==comp){
        // draw
        drawGame();
    } 
    else {
        let UserWin = true;
        if (userChoice == "rock"){
            UserWin = comp == "paper" ? false : true ;
        }
        else if (userChoice == "paper"){
            UserWin = comp == "scissor" ? false : true ;
        }
        else {
            UserWin = comp == "rock" ? false : true ;
        }
    showWinner(UserWin, userChoice, comp);
    }
    
};

choices.forEach((choice) => {
    choice.addEventListener("click", ()=>{
        const userChoice = choice.getAttribute("id");
        playGame(userChoice);
    });
});




