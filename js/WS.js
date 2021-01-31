(()=>{
    if(window.location != 'https://web.whatsapp.com/'){
        window.alert('This bookmarklet only works on web.whatsapp.com');
        return;
    }
    
    const win = window.open('',"_blank", "width=500,height=700");
    
    win.document.body.innerHTML = `<style>
    :root{--bgC:rgb(19,28,33);--C:white;--hidC: rgb(203,204,182);--bgInput:rgb(51,56,59);--borderCol: rgb(50,55,57);}
    body{background-color: var(--bgC);color: var(--C);font-size: 20px;line-height: 32px;}
    input{background-color: var(--bgInput);color: var(--C);outline: none;border: none;padding: 2px 10px;height: 32px;border-radius: 32px;width: calc(100% - 65px);}
    img{margin-top:10px;height: 32px;padding: 5px;position:relative; top:15px;filter: saturate(0);}
    img:hover{filter: saturate(1);}
    .wordName{display:inline-block;width:20%;padding: 0px 5px;height: 100%;border: var(--borderCol) 2px solid;box-sizing: border-box;overflow-y: hidden;overflow-x: scroll;position: relative;top: 8px;}
    .regExName{display:inline-block;color: var(--hidC);width: calc(80% - 45px);height: 100%;padding: 0px 5px;border: var(--borderCol) 2px solid;box-sizing: border-box;word-wrap: none;overflow-y: hidden;overflow-x: scroll;position: relative;top: 8px;white-space: nowrap;}
    .wordEntry{height: 32px;padding: 0px;margin: 0px;}
    ::-webkit-scrollbar{height: 0px;width: 0px;}
    .col{margin-top:10px;padding:0px;border-radius:0px;width:50%;}
    </style>
    <h1>WhatsApp Summary</h1><div id="wordList"></div><input id='wordInput' type="text" placeholder="Add Word"><img id="addWordBtn" src="https://s2.svgbox.net/hero-solid.svg?ic=plus&color=00af9c">
    <input id="bgCol" class="col" type="color"><input id="hlCol" class="col" type="color" value="#000000">
    `;

    const bgColDom = win.document.getElementById('bgCol');
    const colDom = win.document.getElementById('hlCol');

    {
        let bgc = localStorage.getItem('wasbgc');
        if(bgc===null)bgc="#00af9c";
        bgColDom.value = bgc;
        let hlc = localStorage.getItem('washlc');
        if(bgc===null)bgc="#000000";
        colDom.value = hlc;
    }

    bgColDom.addEventListener('change',()=>{localStorage.setItem('wasbgc',bgColDom.value)});
    colDom.addEventListener('change',()=>{localStorage.setItem('washlc',colDom.value)});

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
                    rVal += `(${char.toUpperCase()}|${char.toLowerCase()})`;
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
        for(let j = 1 ; j < word.length+1; ++j){
            let tempStr= escapeRegEx(word.slice(0,j));
            tempStr += '*';
            tempStr += escapeRegEx(word.slice(j,word.length));
            arr.push(new RegExp(tempStr));
        }
    }
    

    let words = new Set();
    let findList = [];

    const createWordDom = (word)=>{
        const dom = document.createElement('div');
        dom.classList.add('wordEntry');

        const textDom = document.createElement('span');
        textDom.innerText = word;
        textDom.classList.add('wordName');

        const regExDom = document.createElement('span');
        let reArr = [];
        getRegExps(word,reArr);
        regExDom.innerText = '';
        for(let i = 0 ; i < reArr.length; ++i)regExDom.innerText += reArr[i].toString()+"|";
        regExDom.classList.add('regExName');


        const remDom = document.createElement('img');
        remDom.src = "https://s2.svgbox.net/hero-solid.svg?ic=x&color=ff0000";
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
        localStorage.setItem('was',JSON.stringify(arr));
    }

    const getWords = ()=>{
        let arr = localStorage.getItem('was');;
        if(arr != null)arr=JSON.parse(arr);
        else arr = [];
        words.clear();
        for(let i = 0 ; i < arr.length; ++i)words.add(arr[i]);
    }

    getWords();

    const listDom = win.document.getElementById('wordList');


    const updateListDom = ()=>{
        listDom.innerHTML = '';
        findList = [];
        words.forEach((val)=>{
            listDom.append(createWordDom(val));
            getRegExps(val,findList);
        });
    }

    updateListDom();


    let addButton = win.document.getElementById('addWordBtn');
    let addWordText = win.document.getElementById('wordInput');

    addButton.addEventListener('click',()=>{
        words.add(addWordText.value);
        updateListDom();
        saveWords();
    });

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
            outArr[i].style.backgroundColor = bgColDom.value;
            outArr[i].style.color = colDom.value;
        }
    }
    setInterval(updateFunc,500);
})();
