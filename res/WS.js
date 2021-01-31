console.log('bhat');


const setup = ()=>{
let words = new Set();

const createWordDom = (word)=>{
    const dom = document.createElement('div');
    dom.classList.add('wordEntry');

    const textDom = document.createElement('span');
    textDom.innerText = word;
    textDom.classList.add('wordName');

    const regExDom = document.createElement('span');
    let reArr = [];
    window['rE'](word,reArr);
    regExDom.innerText = '';
    for(let i = 0 ; i < reArr.length; ++i)regExDom.innerText += reArr[i].toString()+"|";
    regExDom.classList.add('regExName');


    const remDom = document.createElement('img');
    remDom.src = 'http://127.0.0.1:5500/res/res/cancel.svg';
    remDom.addEventListener('click',()=>{
        words.delete(word);
        updateListDom();
        saveWords();
    });

    dom.append(textDom,regExDom,remDom);

    return dom;
}

const saveWords = ()=>{
    let arr = [];
    words.forEach((val)=>{
        arr.push(val);
    });
    window['sW'](arr);
}


const getWords = ()=>{
    let arr = window['gW']();
    words.clear();
    for(let i = 0 ; i < arr.length; ++i)words.add(arr[i]);
}

getWords();

const listDom = document.getElementById('wordList');

const updateListDom = ()=>{
    listDom.innerHTML = '';
    words.forEach((val)=>{
        listDom.append(createWordDom(val));
    });
}

updateListDom();


let addButton = document.getElementById('addWordBtn');
let addWordText = document.getElementById('wordInput');

addButton.addEventListener('click',()=>{
    words.add(addWordText.value);
    updateListDom();
    saveWords();
});

}


const check = ()=>{
    if(window['set'] !== undefined){
        setup();
    }else{
        setTimeout(check,100);
    }
}

check();