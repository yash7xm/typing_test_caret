const str = document.querySelector('.given-text');
const input = document.querySelector('#myInput');
const timerSet = document.querySelectorAll('li');
const watch = document.querySelector('.timer');
const time = document.querySelector('.bi-clock');
const caret = document.querySelector('.caret');
const container = document.querySelector('.container');

const originalString = str.textContent.replace(/\s+/g, ' ').trim();
let clock = 0;
let clockFlag = false;
let a = 0;
let gotInput = false;
let wordWidth = 20;
let backspaceHappend = false;
let wordHeight = 55;
let scrollStart = 0;
let scrollEnd = 55;
let lastWord = 0;
let ar =0;
const stopWatch = document.createElement('div');

const maxChars = Math.floor(str.getBoundingClientRect().width/14.412500381469727);
let currChars = 0;

makeHtml(originalString);
function makeHtml(originalString) {
    str.innerHTML = ''
    for (let i = 0; i < originalString.length; i++) {
        currChars++;
        if(currChars > maxChars){
            currChars = 0;
            let c = i-1;
            while(originalString[c] != ' '){
                currChars++;
                c--;
            }
            let lastIndex = document.querySelector(`.span${c}`);
            lastIndex.classList.add('lastIndex');
        }
        const span = document.createElement('span')
        span.textContent = originalString[i];
        span.classList.add(`span${i}`)
        str.insertAdjacentElement('beforeend', span)
    }
}

container.addEventListener('click', () => {
    input.focus();
});

input.style.height = '0';
input.style.width = '0';
input.style.border = '0';
input.style.padding = '0';


input.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Backspace') {
        e.preventDefault(); // Prevent the default behavior of the key combination
        return;
    }
    let ptr = input.value;
    let flag = false; // to check if removing notTyped class
    if (ptr.length < 1){
        wordWidth = 20;
        backspaceHappend = false;
        caret.style.left = `${wordWidth}px`;
        return;
    } //if no character is left
    if (e.key === 'Backspace') {
        backspaceHappend = true;
        let index = document.querySelector(`p.given-text span.span${ptr.length - 1}`);
        // remove notTyped class from all chars till the place where space was entered
        while (index.classList.contains('notTyped')) {
            index.classList.remove('notTyped')
            index.innerText = originalString[ptr.length - 1]
            ptr = ptr.slice(0, -1);
            wordWidth -= index.getBoundingClientRect().width;
            index = document.querySelector(`p.given-text span.span${ptr.length - 1}`);
            flag = true;
        }
        if (flag) { // only if above loop ran
            input.value = ptr;
            input.value += originalString[ptr.length - 1];
            caret.style.left = `${wordWidth}px`;
        }
        else { // remove classes
            wordWidth -= index.getBoundingClientRect().width;
            caret.style.left = `${wordWidth}px`;
            index.classList.remove('right')
            index.classList.remove('wrong')
            index.innerText = originalString[ptr.length - 1];
            console.log('in backspacce');
        }
    }
})

//handling the input
input.addEventListener('input', (e) => {
    if (input.value.length > 0 && clockFlag == true && clock !=0) {
        console.log('imin')
        clockFlag = false;
        watch.innerHTML = '';
        stopWatch.classList.add('watch');
        stopWatch.innerText = clock;
        watch.append(stopWatch);
        startTimer();
    }
    let p = input.value;
    if (p.length < 1) {
        wordWidth = 20;
        caret.style.left = `${wordWidth}px`;
        return;
    }

    let index = document.querySelector(`p.given-text span.span${p.length - 1}`);

    if (p[0] == ' ') { // to prevent typing space in start
        p = '';
        input.value = '';
        return;
    }
    if (p.length > 1 && (p[p.length - 1] == ' ' && p[p.length - 2] == ' ')) { // to prevent typing consecutive spaces
        input.value = input.value.slice(0, -1)
        return;
    }
    let spaceThingHappend = false;
    // if correct word is typed
    if (originalString[p.length - 1] === p[p.length - 1]) {
           index.classList.add('right');
           if(!backspaceHappend){
            wordWidth += index.getBoundingClientRect().width;
            caret.style.left = `${wordWidth}px`;
            // console.log('in correct input');
           }
    }
    else {
        // if space is typed b/w word
        if (p[p.length - 1] == ' ') {
            input.value = input.value.slice(0, -1);
            // add notTyped to all till next word, and copy orginal text
            for (let i = p.length - 1; i < originalString.length; i++) {
                if (originalString[p.length - 1] == ' ') break;
                index.classList.add('notTyped');
                p += originalString[i];
                input.value += originalString[i];
                spaceThingHappend = true;
                wordWidth += index.getBoundingClientRect().width;
                index = document.querySelector(`p.given-text span.span${p.length - 1}`);
            }
            input.value += " ";
            index.classList.add('notTyped');
            wordWidth += index.getBoundingClientRect().width;
            caret.style.left = `${wordWidth}px`;
            if(index.classList.contains('lastIndex')){
                wordWidth = 20;
                caret.style.left = `${wordWidth}px`;
                // caret.style.top = `${wordHeight}px`;
                // wordHeight+=55;
                container.scroll(`${scrollStart}`,`${scrollEnd}`);
                scrollEnd += caret.getBoundingClientRect().height;
                scrollStart += caret.getBoundingClientRect().height;
            }
            return;
        }
        if (originalString[p.length - 1] == ' ' && p[p.length - 1] != ' ') {
            input.value = input.value.slice(0, -1);
            return;
        }
        index.classList.add('wrong');
        // console.log('in wrong input');
        if(!backspaceHappend){
        if(!spaceThingHappend){
            wordWidth += index.getBoundingClientRect().width;
            caret.style.left = `${wordWidth}px`;
        }
        }
    }
    // console.log(caret.getBoundingClientRect().height);
    // console.log(wordWidth)
    if(index.classList.contains('lastIndex')){
        wordWidth = 20;
        caret.style.left = `${wordWidth}px`;
        lastWord++;
        if(lastWord>1){
        container.scroll(`${scrollStart}`,`${scrollEnd}`);

        if(ar!=0){
            scrollEnd += 36;
        }
        else{
            scrollEnd += 55;
            ar++;
        }
        wordHeight = 50;
        caret.style.top = `${wordHeight}px`;
        scrollStart += 36;
        }
    else{
        caret.style.top = `${wordHeight}px`;
        wordHeight+=36;
    }
    }
    caret.style.animationName = 'none';
    backspaceHappend = false;

    if (p.length === originalString.length) {
        input.disabled = true;
        over = true;
        score();
        return;
    }
})

time.addEventListener('click', () => {
    if(a>1) a=0;
    if (a % 2 == 0) {
        time.style.color = '#ffd700';
        clockFlag = true;
    }
    else {
        time.style.color = 'white';
        clockFlag = false;
    }
    a++;
})

timerSet.forEach(item => {
    item.addEventListener('click', () => {
        if (clockFlag) {
            item.style.color = '#ffd700';
            clock = (item.getAttribute('value'));
        }
    })
});

function startTimer() {
    setTimeout(() => {
        clock--;
        // console.log(clock);
        stopWatch.innerText = clock;
        if (clock != 0) startTimer();
    }, 1000)
}

