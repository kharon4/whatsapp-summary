console.log(window['sW'],window['gW']);//should be deleted


let words = new Set();

words.add('temp');


const createWordDom = (word)=>{
    const dom = document.createElement('div');
    
    const textDom = document.createElement('span');
    textDom.innerText = word;
    textDom.classList.add('wordName');

    const regExDom = document.createElement('span');
    regExDom.innerText = 'regEx';
    regExDom.classList.add('regExName');


    const remDom = document.createElement('img');
    remDom.src = './res/cancel.svg';

    dom.append(textDom,regExDom,remDom);

    return dom;
}


const listDom = document.getElementById('wordList');

const updateListDom = ()=>{
    listDom.innerHTML = '';
    words.forEach((val)=>{
        listDom.append(createWordDom(val));
    });
}

updateListDom();