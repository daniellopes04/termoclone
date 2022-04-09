const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const words = ['casei', 'termo', 'casos', 'teste', 'trens']

const cells = document.getElementsByClassName('cell');
const firstRow = document.getElementById('first-row');

var currentWord = words[getRandomInt(0, 4)]
console.log(currentWord)

window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
        return;
    }

    if (alphabet.includes(event.key.toLowerCase())) {
        var current = document.getElementById('selected-cell');
        current.textContent = event.key.toUpperCase();
        setSelectedCell(1);
    }
    switch (event.key) {
        case ('Enter'):
            checkWordInput();
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
            break;
        default:
            break;
    }
    
    event.preventDefault();
}, true);


for (let index = 0; index < firstRow.children.length; index++) {
    const element = firstRow.children[index];
    element.onclick = setCurrentCell
}

function setCurrentCell() {
    for (let index = 0; index < firstRow.children.length; index++) {
        const element = firstRow.children[index];
        element.id = '';
    }

    if (!this.classList.contains('correct-position') || !this.classList.contains('correct-position')) {
        this.id = 'selected-cell';
    }
}

function checkWordInput() {
    for (let index = 0; index < firstRow.children.length; index++) {
        const element = firstRow.children[index];
        if (element.textContent.toLowerCase() == currentWord[index].toLowerCase()) {
            element.classList.add('correct-position');
            element.id = '';
        } else if (currentWord.includes(element.textContent.toLowerCase())) {
            element.classList.add('correct-letter');
            element.id = '';
        }
    }
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