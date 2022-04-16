const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

const cells = document.getElementsByClassName('cell');
const rows = document.getElementById('rows');
let firstRow = document.getElementById('first-row');
const warning = document.getElementById('warning');

let words = [];
let currentWord = '';
let animating = false;
let tries = 0;


const victoryMessage = ['Genial', 'Fantástico', 'Extraordinário', 'Fenomenal', 'Impressionante', 'Ufa!']

fetch("https://raw.githubusercontent.com/daniellopes04/termoclone/main/assets/dict/dictionary.txt")
.then(response => response.text())
.then(text => setWords(text));

function setWords(text) {
    words = text.split('\n');
    currentWord = words[getRandomInt(0, words.length)]
    // currentWord = 'chova';
}

window.addEventListener("keydown", function (event) {
    // if (event.defaultPrevented) {
    //     return;
    // }

    if (alphabet.includes(event.key.toLowerCase())) {
        var current = document.getElementById('selected-cell');
        current.textContent = event.key.toUpperCase();
        animateCSS(current, 'pulse');
        setSelectedCell(1);
        closeWarning();
    } else {
        switch (event.key) {
            case ('Enter'):
                if (checkRowComplete()) {
                    checkWordInput();
                } else {
                    showWarning('só palavras com 5 letras');
                }
                break;
            case('ArrowLeft'):
                setSelectedCell(-1);
                break;
            case('ArrowRight'):
                setSelectedCell(1);
                break;
            case('Backspace'):
                eraseSelectedCell();
                setSelectedCell(-1);
                closeWarning();
                break;
            default:
                break;
        }
    }
    // event.preventDefault();
}, true);

function setOnClickRow() {
    document.querySelectorAll('.row .cell').forEach(element => {
        element.onclick = '';
    });

    document.querySelectorAll('#first-row .open-cell').forEach(element => {
        element.onclick = setCurrentCell;
    });
}

function setCurrentCell() {
    for (let index = 0; index < firstRow.children.length; index++) {
        const element = firstRow.children[index];
        element.id = '';
    }

    if (!this.classList.contains('correct-position') && !this.classList.contains('correct-letter') && !this.classList.contains('incorrect')) {
        this.id = 'selected-cell';
    }
}

function checkRowComplete() {
    var count = 0;
    for (let index = 0; index < firstRow.children.length; index++) {
        const element = firstRow.children[index];
        if (element.textContent.toLowerCase() !== '') {
            count = count + 1;
        }
    }
    if (count == firstRow.children.length) {
        return true;
    }
    return false;
}

function showWarning(text) {
    warning.querySelector('#warning-text').textContent = text;
    warning.style.visibility = 'visible';
    animateCSS(warning, 'zoomIn');
}

function closeWarning() {
    if (warning.style.visibility !== 'hidden' && warning.style.visibility !== '') {
        animateCSS(warning, 'zoomOut').then((message) => {
            warning.style.visibility = 'hidden';
        });
    }   
}

async function checkWordInput() {
    let inputWord = '';
    for (let index = 0; index < firstRow.children.length; index++) {
        const element = firstRow.children[index];
        inputWord += element.textContent.toLowerCase();
    }

    if (words.includes(inputWord)) {
        for (let index = 0; index < firstRow.children.length; index++) {
            const element = firstRow.children[index];
            if (!element.textContent.toLowerCase().localeCompare(currentWord[index].toLowerCase(), 'pt-br', { sensitivity: 'base' })) {
                element.textContent = currentWord[index].toUpperCase();
                element.classList.add('correct-position');
                element.id = '';

                document.getElementById(element.textContent.toLowerCase() + '-key').classList.remove('correct-letter-key');
                document.getElementById(element.textContent.toLowerCase() + '-key').classList.add('correct-key');
            } else if (currentWord.includes(element.textContent.toLowerCase())) {
                var correctIndex = currentWord.indexOf(element.textContent.toLowerCase());
                var appearCount = 0;
                var letterCount = currentWord.split('').filter(x => x == element.textContent.toLowerCase()).length;
                if (!firstRow.children[correctIndex].classList.contains('correct-position')) {
                    document.querySelectorAll('#first-row .correct-letter').forEach(el => {
                        if (el.innerHTML.toLowerCase() === element.textContent.toLowerCase()) {
                            appearCount += 1;
                        }
                    });

                    if (appearCount < letterCount) {
                        element.classList.add('correct-letter');
                        element.id = '';
    
                        document.getElementById(element.textContent.toLowerCase() + '-key').classList.add('correct-letter-key');
                    } else {
                        element.classList.add('incorrect');
                        element.id = '';
    
                        document.getElementById(element.textContent.toLowerCase() + '-key').classList.add('selected-key');
                    }
                } else {
                    element.classList.add('incorrect');
                    element.id = '';

                    document.getElementById(element.textContent.toLowerCase() + '-key').classList.add('selected-key');
                }
            } else {
                element.classList.add('incorrect');
                element.id = '';

                document.getElementById(element.textContent.toLowerCase() + '-key').classList.add('selected-key');
            }

            await animateCSS(element, 'bounce');
        }

        tries += 1;
        goToNextRow();
        setOnClickRow();
    } else {
        animateCSS(firstRow, 'shakeX')
        showWarning('essa palavra não é aceita');
    }
}

function goToNextRow() {
    var row, newIndex, children;
    for (let index = 0; index < rows.children.length; index++) {
        row = rows.children[index];
        if (row.id == 'first-row') {
            if (checkVictory()) {
                animateCSS(row, 'shakeY');
                showWarning(victoryMessage[tries - 1]);
            } else if (tries == rows.children.length) {
                showWarning('palavra certa: ' + currentWord.toLowerCase());
            } else {
                children = document.querySelectorAll('#first-row .open-cell');
                children.forEach(element => {
                    element.classList.remove('open-cell');
                    element.classList.add('cell');
                });
    
                row.id = '';
                row.classList.add('row');
                newIndex = (index + 1) % rows.children.length;
                rows.children[newIndex].id = 'first-row';
                rows.children[newIndex].classList.remove('row');
                firstRow = document.getElementById('first-row')
    
                children = document.querySelectorAll('#first-row .cell');
                children.forEach(element => {
                    element.classList.remove('cell');
                    element.classList.add('open-cell');
                });
    
                children[0].id = 'selected-cell';
    
                break;
            }
        }
    }
}

function checkVictory() {
    if (document.querySelectorAll('#first-row .correct-position').length == firstRow.children.length) {
        return true;
    }
    return false;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function setSelectedCell(shift) {
    var element, newIndex;
    for (let index = 0; index < firstRow.children.length; index++) {
        element = firstRow.children[index];
        if (element.id == 'selected-cell') {
            if ((shift > 0 && index < firstRow.children.length - 1) || (shift < 0 && index > 0)) {
                element.id = '';
                newIndex = (index + shift) % firstRow.children.length;
                firstRow.children[newIndex].id = 'selected-cell';
                break;
            }
        }
    }
}

function eraseSelectedCell() {
    var element;
    for (let index = 0; index < firstRow.children.length; index++) {
        element = firstRow.children[index];
        if (element.id == 'selected-cell') {
            element.textContent = ''
            break;
        }
    }
}

const animateCSS = (element, animation, prefix = 'animate__') =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        // const node = document.querySelector(element);
        const node = element;

        node.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
            event.stopPropagation();
            node.classList.remove(`${prefix}animated`, animationName);
            resolve('Animation ended');
        }

        node.addEventListener('animationend', handleAnimationEnd, {once: true});
    });

setOnClickRow();