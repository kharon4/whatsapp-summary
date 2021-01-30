


let findList = [];


const escapeRegEx = (word)=>{
    let rVal = "";
    for(let i = 0 ; i < word.length; ++i){
        let char = word.charAt(i);
        switch(char){
            case ".":
            case "\\":
            case "+":
            case "-":
            case "?":
            case "*":
            case '^':
            case "$":
            case "/":
                rVal += ("\\"+char);
                break;
            default:
                rVal += char;
        }
    }
    return rVal;
}

const getRegExps = (word,arr)=>{
    //original
    arr.push(new RegExp(escapeRegEx(word)));
    //spelling mistakes

    //character change
    for(let j = 0 ; j < word.length; ++j){
       let tempStr= escapeRegEx(word.slice(0,j));
       tempStr += '.';
       tempStr += escapeRegEx(word.slice(j+1,word.length));
       arr.push(new RegExp(tempStr));
    }

    //character missing or repeated multiple times
    for(let j = 1 ; j < word.length; ++j){
        let tempStr= escapeRegEx(word.slice(0,j));
        tempStr += '*';
        tempStr += escapeRegEx(word.slice(j,word.length));
        arr.push(new RegExp(tempStr));
    }
}

const generateList = (words)=>{
    findList = [];

    for(let i = 0 ; i < words.length; ++i){
        
        getRegExps(words[i],findList);

        // //original
        // findList.push(new RegExp(escapeRegEx(words[i])));
        // //spelling mistakes

        // //character change
        // for(let j = 0 ; j < words[i].length; ++j){
        //    let tempStr= escapeRegEx(words[i].slice(0,j));
        //    tempStr += '.';
        //    tempStr += escapeRegEx(words[i].slice(j+1,words[i].length));
        //    findList.push(new RegExp(tempStr));
        // }

        // //character missing or repeated multiple times
        // for(let j = 1 ; j < words[i].length; ++j){
        //     let tempStr= escapeRegEx(words[i].slice(0,j));
        //     tempStr += '*';
        //     tempStr += escapeRegEx(words[i].slice(j,words[i].length));
        //     findList.push(new RegExp(tempStr));
        // }
    }
}


const getWords = ()=>{
    let rVal = localStorage.getItem('was');
    if(rVal===null)return [];
    return JSON.parse(rVal);
}

const saveWords = (words)=>{
    localStorage.setItem('was',JSON.stringify(words));
    generateList(getWords());
}



const recCheck = (element,outArr)=>{
    let found = 0;
    //find in children
    for(let i = 0 ; i < element.children.length; ++i){
        if(recCheck(element.children[i],outArr))found++;
    }
    
    if(found>0){
        return true;
    }
    //self check
    if(element.innerText != undefined)for(let i = 0 ; i < findList.length ; ++i){
        if(element.innerText.search(findList[i])>=0){
            outArr.push(element);
            return true;
        }
    }

    return false;
}

const updateFunc = ()=>{
    console.log('whatsapp summary working !!!');
    let outArr = [];
    recCheck(document.body,outArr);
    for(let i = 0 ; i < outArr.length; ++i){
        outArr[i].style.backgroundColor = 'lightblue';
        outArr[i].style.color = 'black';
    }
}

let win = window.open('',"MsgWindow", "width=500,height=700");

win.location = 'http://127.0.0.1:5500/res/WS.html';

const setWindFunc = ()=>{
    win['sW'] = saveWords;
    win['gW'] = getWords;
    win['rE'] = getRegExps;
    win['set'] = 'done';
    console.log('here');
}

generateList(getWords());
console.log(findList);

setInterval(updateFunc,100);
setInterval(setWindFunc,100);