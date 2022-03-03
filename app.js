//This key press is the array how how many allowed key that the user is holding
//I use the array to allow smooth movement and ensure the first held key to be the movement
let keyPressed = [];
document.addEventListener("keydown", (event) => setKeyPressedValue(event.key));
document.addEventListener("keyup", (event) => deleteKeyUpValue(event.key));

//this is to check if the key is valid or not and add it to the array
function setKeyPressedValue(key) {
	let keyExistance = false;
	let accpetedKeyCheck = false;
	if (key == "ArrowLeft" || key == "ArrowRight" || key == "a" || key == "d") {
		accpetedKeyCheck = true;
	}
	for (let i = 0; i < keyPressed.length; i++) {
		if (keyPressed[i] === key) {
			keyExistance = true;
		}
	}

	if (keyExistance === false && accpetedKeyCheck === true) {
		keyPressed.push(key);
	}
}

//this is for deleting the key that we dont hold anymore from the array
function deleteKeyUpValue(key) {
	let keyPressedLength = keyPressed.length;
	if (key == "ArrowLeft" || key == "ArrowRight" || key == "a" || key == "d") {
		if (keyPressedLength === 1) {
			index = keyPressed.pop();
		} else {
			for (let i = 0; i < keyPressedLength; i++) {
				if (keyPressed[i] === key) {
					for (let j = i + 1; j < keyPressedLength; j++) {
						keyPressed[j - 1] = keyPressed[j];
					}
					keyPressed.pop();
					keyPressedLength--;
					i--;
				}
			}
		}
	}
}

//this is movement function
setInterval(movePaddle, 1);
function movePaddle() {
	const paddle = document.getElementById("paddle");
	let currentXPos = parseInt(getComputedStyle(paddle).left);
	const moveSpeed = 8;
	if (
		keyPressed[0] === "ArrowLeft" ||
		(keyPressed[0] === "a" && currentXPos > -710)
	) {
		currentXPos -= moveSpeed;
		paddle.style.left = currentXPos + "px";
	} else if (
		keyPressed[0] === "ArrowRight" ||
		(keyPressed[0] === "d" && currentXPos < 710)
	) {
		currentXPos += moveSpeed;
		paddle.style.left = currentXPos + "px";
	}
}

//THIS PART IS FOR BALL MOVEMENT AND COLLIDE

//Move speed
let initialSpeedX = 2;
let initialSpeedY = 2;
let movementSpeedAxisX = initialSpeedX;
let movementSpeedAxisY = -initialSpeedY;
const ballMove = setInterval(ballMovement, 1);
setInterval(onCollideWall, 1);
setInterval(onCollidePaddle, 1);

function ballMovement() {
	const ball = document.getElementById("ball");
	let ballPosY = parseInt(getComputedStyle(ball).top) + movementSpeedAxisY;
	let ballposX = parseInt(getComputedStyle(ball).left) + movementSpeedAxisX;
	ball.style.top = ballPosY + "px";
	ball.style.left = ballposX + "px";
}

//Collide with wall
function onCollideWall() {
	let ballPosY = parseInt(getComputedStyle(ball).top);
	let ballposX = parseInt(getComputedStyle(ball).left);
	if (ballPosY > 180) {
		movementSpeedAxisY = -initialSpeedY;
		// die
		const resetButton = document.getElementById("reset-button");
		resetButton.style.display = "block";
		window.clearInterval(ballMove);
	}
	if (ballPosY < -400) {
		movementSpeedAxisY = initialSpeedY;
	}
	if (ballposX < -780) {
		movementSpeedAxisX = initialSpeedX;
	}
	if (ballposX > 780) {
		movementSpeedAxisX = -initialSpeedX;
	}
}

//Hit the paddle
function onCollidePaddle() {
	const ball = document.getElementById("ball");
	const paddle = document.getElementById("paddle");
	let ballPosY = parseInt(getComputedStyle(ball).top);
	let ballHeight = ballPosY + 20;
	if (
		ball.offsetLeft + 10 >= paddle.offsetLeft &&
		ball.offsetLeft + 10 <= paddle.offsetLeft + 90 &&
		ballHeight > 160 &&
		ballHeight < 165
	) {
		movementSpeedAxisY = -initialSpeedY;
		changeSpeed(ball, paddle);
	}
}
//change speed depends on what place in the paddle hit
function changeSpeed(ball, paddle) {
	if (
		ball.offsetLeft + 10 < paddle.offsetLeft + 30 ||
		ball.offsetLeft + 10 > paddle.offsetLeft + 60
	) {
		initialSpeedX += 0.3;
	} else if (
		ball.offsetLeft + 10 >= paddle.offsetLeft + 30 &&
		ball.offsetLeft + 10 <= paddle.offsetLeft + 60
	) {
		initialSpeedX -= 0.2;
	}
	if (initialSpeedX < 1) {
		initialSpeedX = 1;
	}
	if (movementSpeedAxisX < 0) {
		movementSpeedAxisX = -initialSpeedX;
	} else {
		movementSpeedAxisX = initialSpeedX;
	}
}
//RESET BUTTON
document.getElementById("reset-button").onclick = function () {
	location.reload();
};

//brick collide
let brickList = document.getElementsByClassName("brick");

setInterval(checkBrickCollider, 1);
function checkBrickCollider() {
	for (let i = 0; i < brickList.length; i++) {
		if (
			brickList[i].style.visibility != "hidden" &&
			((ball.offsetTop + 20 > brickList[i].offsetTop &&
				ball.offsetTop < brickList[i].offsetTop) ||
				(ball.offsetTop < brickList[i].offsetTop + 30 &&
					ball.offsetTop + 20 > brickList[i].offsetTop))
		) {
			if (
				ball.offsetLeft + 20 > brickList[i].offsetLeft &&
				ball.offsetLeft < brickList[i].offsetLeft + 70
			) {
				if (ball.offsetLeft + 20 > brickList[i].offsetLeft) {
					if (brickList[i].offsetLeft > ball.offsetLeft + 10) {
						movementSpeedAxisX = -initialSpeedX;
					} else {
						movementSpeedAxisY = initialSpeedY;
					}
					brickList[i].style.visibility = "hidden";
				}
				if (ball.offsetLeft < brickList[i].offsetLeft + 70) {
					if (brickList[i].offsetLeft + 70 < ball.offsetLeft + 10) {
						movementSpeedAxisX = initialSpeedX;
					} else {
						movementSpeedAxisY = initialSpeedY;
					}
					brickList[i].style.visibility = "hidden";
				}
				score += 10;
			}
		}
	}
}

//SCORE
setInterval(setScore, 1);
score = 0;
function setScore() {
	scoreSheet = document.getElementById("scoreboard");
	scoreSheet.innerHTML = "Score: " + score;
}
