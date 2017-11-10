var width;
var height;
var bombsNumberTotal;
var bombsNumber;
var bombMaps;
var difficulty;
var mark;
var gameover;

startGame();

function startGame() {
    this.width            = 8;
    this.height           = 8;
    this.bombsNumber      = 0;
    this.bombMaps         = [];
    this.difficulty       = 15;
    this.mark             = true;
    this.gameover         = false;

    stopTimer();
    document.getElementById('board').innerHTML = '';
    document.getElementById("timer").innerHTML = 'Time: 00:00';

    for (var i = 0; i < height; i++) {
        bombMaps[i] = [];
        for (var j = 0; j < width; j++) {
            bombMaps[i][j] = Math.floor((Math.random() * 100/difficulty)) == 0;
            bombsNumber += bombMaps[i][j] ? 1 : 0;
            document.getElementById('board').innerHTML += `<div id="square_${ i }_${ j }" class="item square" onclick="selectItem(${ i }, ${ j }, true, event)" clicked="0">&nbsp;</div>`;
        }
        document.getElementById('board').innerHTML += '<br>';
    }
    bombsNumberTotal = bombsNumber;
    document.getElementById('bombsNumber').innerHTML = bombsNumber + ' of ' + bombsNumberTotal;
}

function selectItem(column, row, allowRecursion, event) {
    if (!timerActive) {
        startTimer();
    }
    if (gameover) {
        return false;
    }

    if (event && event.ctrlKey) {
        mark = !mark;
    }
    if (mark) {
        if (document.getElementById(`square_${ column }_${ row }`).marked != '1') {
            if (bombMaps[column][row]) {
                stopTimer();
                document.getElementById(`square_${ column }_${ row }`).className = 'item explosion';
                if (allowRecursion) {
                    changeItensToRed();
                    for (var i = 0; i < height; i++) {
                        for (var j = 0; j < width; j++) {
                            selectItem(i, j, false);
                        }
                    }
                    stopTimer();
                    this.gameover = true;
                    alert('Game over!\nYour time: ' + document.getElementById('timer').innerHTML);
                }
            } else {
                var bombNumberOnSides = getbombNumberOnSides(column, row);

                if (bombNumberOnSides == 0 && allowRecursion) {
                    for (var i = -1; i < 2; i++) {
                        for (var j = -1; j < 2; j++) {
                            if ((column + i >= 0) && (row + j >= 0) && (column + i < height) && (row + j < width)) {
                                selectItem(column + i, row + j, false);
                            }
                        }
                    }
                }

                if (bombNumberOnSides > 0) {
                    document.getElementById(`square_${ column }_${ row }`).innerHTML = bombNumberOnSides;
                }
                document.getElementById(`square_${ column }_${ row }`).className = 'item square-green';
                document.getElementById(`square_${ column }_${ row }`).clicked = 1;

                if (allowRecursion) {
                    if (verifyGameOver()) {
                        alert('Game over!\nYour time: ' + document.getElementById('timer').innerHTML);
                    }
                }
            }
        }
    } else {
        if (document.getElementById(`square_${ column }_${ row }`).marked == '1') {
            bombsNumber++;
            document.getElementById(`square_${ column }_${ row }`).marked = '0';
            document.getElementById(`square_${ column }_${ row }`).className = 'item square';
        } else {
            bombsNumber--;
            document.getElementById(`square_${ column }_${ row }`).marked = '1';
            document.getElementById(`square_${ column }_${ row }`).className = 'item square-yellow';
        }
        document.getElementById('bombsNumber').innerHTML = bombsNumber + ' of ' + bombsNumberTotal;
    }
    if (event && event.ctrlKey) {
        mark = !mark;
    }
}

function getbombNumberOnSides(column, row) {
    var bombNumberOnSides = 0;

    for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
            if ((column + i >= 0) && (row + j >= 0) && (column + i < height) && (row + j < width)) {
                if (bombMaps[column + i][row + j]) {
                    bombNumberOnSides++;
                }
            }
        }
    }

    return bombNumberOnSides;
}

function changeMovement() {
    mark = !mark;
    document.getElementById('movementType').className = 'square-' + (mark ? 'green' : 'yellow');
}

function changeItensToRed() {
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            if (document.getElementById(`square_${ i }_${ j }`).marked == '1' && !bombMaps[i][j]) {
                document.getElementById(`square_${ i }_${ j }`).className = 'item square-red';
            }
        }
    }
}

function verifyGameOver() {
    if (this.gameover) {
        return false;
    }
    blank  = 0;

    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            if (document.getElementById(`square_${ i }_${ j }`).clicked != '1') {
                blank++;
            }

            if (blank > bombsNumberTotal) {
                return false;
            }
        }
    }
    this.gameover = true;
    stopTimer();
    return true;
}

function removeAllClass(item) {
    item.className = 'item';
}

// Timer
var timer;
var timerActive = false;

function startTimer() {
    timerActive = true;
    var s = 1;
    var m = 0;
    timer = window.setInterval(function() {
        document.getElementById("timer").innerHTML = 'Time: ';
        if (s == 60) { m++; s = 0; }
        if (m < 10) document.getElementById("timer").innerHTML += "0" + m + ":"; else document.getElementById("timer").innerHTML += m + ":";
        if (s < 10) document.getElementById("timer").innerHTML += "0" + s; else document.getElementById("timer").innerHTML += s;
        s++;
    }, 1000);
}

function stopTimer() {
    timerActive = false;
    window.clearInterval(timer);
}