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

//FOR RESPONSIVE

let checkMobile = window.matchMedia(
	"screen and (max-width: 414px) and (max-height: 896px)"
);
movementConvertMobile(checkMobile);

function movementConvertMobile(event) {
	if (event.matches) {
		setInterval(function () {
			onCollideWall(160, -250, -270, 270);
		}, 1);
		setInterval(function () {
			onCollidePaddle(140, 145);
		}, 1);
	} else {
		setInterval(function () {
			movePaddle(-710, 710);
		}, 1);
		setInterval(function () {
			onCollideWall(180, -400, -780, 780);
		}, 1);
		setInterval(function () {
			onCollidePaddle(160, 165);
		}, 1);
	}
}

//THIS PART IS FOR BALL MOVEMENT AND COLLIDE

//Move speed
let initialSpeedX = 2;
let initialSpeedY = 2;
let movementSpeedAxisX = initialSpeedX;
let movementSpeedAxisY = -initialSpeedY;
const ballMove = setInterval(ballMovement, 1);
function ballMovement() {
	const ball = document.getElementById("ball");
	let ballPosY = parseInt(getComputedStyle(ball).top) + movementSpeedAxisY;
	let ballposX = parseInt(getComputedStyle(ball).left) + movementSpeedAxisX;
	ball.style.top = ballPosY + "px";
	ball.style.left = ballposX + "px";
}

//change speed depends on what place in the paddle hit
function changeSpeed(ball, paddle) {
	if (
		ball.offsetLeft + ball.offsetWidth / 2 <
			paddle.offsetLeft + paddle.offsetWidth / 3 ||
		ball.offsetLeft + ball.offsetWidth / 2 >
			paddle.offsetLeft + (paddle.offsetWidth * 2) / 3
	) {
		initialSpeedX += 0.3;
	} else if (
		ball.offsetLeft + ball.offsetWidth / 2 >=
			paddle.offsetLeft + paddle.offsetWidth / 3 &&
		ball.offsetLeft + ball.offsetWidth / 2 <=
			paddle.offsetLeft + (paddle.offsetWidth * 2) / 3
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
			((ball.offsetTop + ball.offsetHeight > brickList[i].offsetTop &&
				ball.offsetTop < brickList[i].offsetTop) ||
				(ball.offsetTop < brickList[i].offsetTop + brickList[i].offsetHeight &&
					ball.offsetTop + ball.offsetHeight > brickList[i].offsetTop))
		) {
			if (
				ball.offsetLeft + ball.offsetWidth > brickList[i].offsetLeft &&
				ball.offsetLeft < brickList[i].offsetLeft + brickList[i].offsetWidth
			) {
				if (ball.offsetLeft + ball.offsetWidth > brickList[i].offsetLeft) {
					if (
						brickList[i].offsetLeft >
						ball.offsetLeft + ball.offsetWidth / 2
					) {
						movementSpeedAxisX = -initialSpeedX;
					} else {
						movementSpeedAxisY = initialSpeedY;
					}
					brickList[i].style.visibility = "hidden";
				}
				if (
					ball.offsetLeft <
					brickList[i].offsetLeft + brickList[i].offsetWidth
				) {
					if (
						brickList[i].offsetLeft + brickList[i].offsetWidth <
						ball.offsetLeft + ball.offsetWidth / 2
					) {
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

//this is movement function
function movePaddle(paddleLeft, paddleRight) {
	const paddle = document.getElementById("paddle");
	let currentXPos = parseInt(getComputedStyle(paddle).left);
	const moveSpeed = 8;
	if (
		keyPressed[0] === "ArrowLeft" ||
		(keyPressed[0] === "a" && currentXPos > paddleLeft)
	) {
		currentXPos -= moveSpeed;

		paddle.style.left = currentXPos + "px";
	} else if (
		keyPressed[0] === "ArrowRight" ||
		(keyPressed[0] === "d" && currentXPos < paddleRight)
	) {
		currentXPos += moveSpeed;
		paddle.style.left = currentXPos + "px";
	}
}
//Collide with wall
function onCollideWall(
	playgroundBottom,
	playgroundTop,
	playgroundLeft,
	playgroundRight
) {
	let ballPosY = parseInt(getComputedStyle(ball).top);
	let ballposX = parseInt(getComputedStyle(ball).left);
	if (ballPosY > playgroundBottom) {
		movementSpeedAxisY = -initialSpeedY;
		// die
		const resetButton = document.getElementById("reset-button");
		resetButton.style.display = "block";
		window.clearInterval(ballMove);
	}
	if (ballPosY < playgroundTop) {
		movementSpeedAxisY = initialSpeedY;
	}
	if (ballposX < playgroundLeft) {
		movementSpeedAxisX = initialSpeedX;
	}
	if (ballposX > playgroundRight) {
		movementSpeedAxisX = -initialSpeedX;
	}
}

//Hit the paddle
function onCollidePaddle(paddleTop, paddleBottom) {
	const ball = document.getElementById("ball");
	const paddle = document.getElementById("paddle");
	let ballPosY = parseInt(getComputedStyle(ball).top);
	let ballHeight = ballPosY + ball.offsetHeight;
	if (
		ball.offsetLeft + ball.offsetWidth / 2 >= paddle.offsetLeft &&
		ball.offsetLeft + ball.offsetWidth / 2 <=
			paddle.offsetLeft + paddle.offsetWidth &&
		ballHeight > paddleTop &&
		ballHeight < paddleBottom
	) {
		movementSpeedAxisY = -initialSpeedY;
		changeSpeed(ball, paddle);
	}
}

//Touch control
document.addEventListener("touchstart", function () {
	score += 10000;
});
document.addEventListener("touchmove", handleMove);
document.addEventListener("touchend", handleEnd);
