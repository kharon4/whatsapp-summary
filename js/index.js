


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

const generateList = (words)=>{
    findList = [];

    for(let i = 0 ; i < words.length; ++i){
        
        

        //original
        findList.push(new RegExp(escapeRegEx(words[i])));
        //spelling mistakes

        //character change
        for(let j = 0 ; j < words[i].length; ++j){
           let tempStr= escapeRegEx(words[i].slice(0,j));
           tempStr += '.';
           tempStr += escapeRegEx(words[i].slice(j+1,words[i].length));
           findList.push(new RegExp(tempStr));
        }

        //character missing or repeated multiple times
        for(let j = 1 ; j < words[i].length; ++j){
            let tempStr= escapeRegEx(words[i].slice(0,j));
            tempStr += '*';
            tempStr += escapeRegEx(words[i].slice(j,words[i].length));
            findList.push(new RegExp(tempStr));
        }
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
        outArr[i].style.backgroundColor = 'lightgrey';
        outArr[i].style.color = 'black';
    }
}

let win = window.open('http://127.0.0.1:5500/res/WS.html',"MsgWindow", "width=500,height=700");
win['sW'] = saveWords;
win['gW'] = getWords;

generateList(getWords());
console.log(findList);

setInterval(updateFunc,100);
