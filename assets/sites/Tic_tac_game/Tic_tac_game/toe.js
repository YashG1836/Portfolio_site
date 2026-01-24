let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset");
let msg = document.querySelector(".msg");
let counter = 0;
let turnO = true;

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (turnO) {
            counter += 1;
            box.style.color = "green";
            box.innerText = "O";
            msg.innerText = `X : Player 2's turn`;
            turnO = false;
        } else {
            counter += 1;
            box.style.color = "red";
            box.innerText = "X";
            msg.innerText = `O : Player 1's turn`;
            turnO = true;
        }
        box.disabled = true;

        checkWinner();
    });
});

const checkWinner = () => {
    let winnerFound = false;

    for (let pattern of winPatterns) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
            if (pos1Val == pos2Val && pos2Val == pos3Val) {
                boxes[pattern[0]].style.border = "5px solid black";
                boxes[pattern[1]].style.border = "5px solid black";
                boxes[pattern[2]].style.border = "5px solid black";

                if (pos1Val == "O") {
                    msg.style.backgroundColor = "green";
                    msg.innerText = `Winner is Player 1`;
                } else {
                    msg.style.backgroundColor = "red";
                    msg.innerText = `Winner is Player 2`;
                }

                boxes.forEach((box) => (box.disabled = true));
                winnerFound = true;
                break;
            }
        }
    }

    if (!winnerFound && counter == 9) {
        msg.innerText = `Its a draw!! Play Again :)`;
        msg.style.backgroundColor = "#191913";
    }
};

resetBtn.addEventListener("click", () => {
    boxes.forEach((box) => {
        box.innerText = "";
        box.disabled = false;
        box.style.border = "none";
    });
    turnO = true;
    counter = 0;
    msg.innerText = "O is Player 1, X is Player 2!";
    msg.style.backgroundColor = "#a33f3f";
});
