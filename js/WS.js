(()=>{
    // if(window.location != 'https://web.whatsapp.com/'){
    //     window.alert('This bookmarklet only works on web.whatsapp.com');
    //     return;
    // }
    
    const win = window.open('',"_blank", "width=500,height=700");
    
    const updateStates = {
        notFound:0,
        opened:1
    }
    let updateState = updateStates.notFound;
    let sc = 0;
    let chatName = undefined;

    win.document.body.innerHTML = `<style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
    :root{--bgC:rgb(19,28,33);--C:white;--hidC: rgb(203,204,182);--bgInput:rgb(51,56,59);--borderCol: rgb(50,55,57);--bgTitleC:rgb(32,38,42);}
    body{background-color: var(--bgC);color: var(--C);font-size: 20px;line-height: 32px;font-family: 'Roboto', sans-serif;}
    input{background-color: var(--bgInput);color: var(--C);outline: none;border: none;padding: 2px 10px;height: 32px;border-radius: 32px;width: calc(100% - 65px);}
    img{margin-top:10px;height: 32px;padding: 5px;filter: saturate(0);position:relative; top:3px;}
    img:hover{filter: saturate(1);}
    .hvr{filter: saturate(0);}
    .hvr:hover{filter: saturate(1);}
    .wordName{display:inline-block;background:var(--bgTitleC);width:20%;padding: 0px 5px;height: 100%;border: var(--borderCol) 1px solid;box-sizing: border-box;overflow-y: hidden;overflow-x: scroll;}
    .regExName{display:inline-block;background:var(--bgTitleC);color: var(--hidC);width: calc(80% - 45px);height: 100%;padding: 0px 5px;border: var(--borderCol) 2px solid;box-sizing: border-box;word-wrap: none;overflow-y: hidden;overflow-x: scroll;white-space: nowrap;}
    .wordEntry{height: 32px;padding: 0px;margin: 0px;}
    ::-webkit-scrollbar{height: 0px;width: 0px;}
    .col{margin-top:10px;padding:0px;border-radius:0px;width:50%;}
    .msg{background:var(--bgTitleC);cursor:pointer;border:var(--borderCol) 1px solid;}
    .msg:hover{background:var(--borderCol);}
    </style>
    <h1 style="margin: 10px 10px 10px 10px;">WhatsApp Summary</h1><div id="wordList" style="max-height:20%;overflow-y:scroll;"></div><input id='wordInput' type="text" placeholder="Add Word"><img id="addWordBtn" src="https://s2.svgbox.net/hero-solid.svg?ic=plus&color=00af9c" style="position:relative; top:15px;">
    <input id="bgCol" class="col" type="color"><input id="hlCol" class="col" type="color" value="#000000">
    <div><h2><span id="CN" style="box-sizing: border-box;"></span></h2><span id="ASBtn" class="hvr" style="box-sizing: border-box;background:#00af9c;padding:0px 2px;cursor:pointer;width:100%;display:inline-block;text-align: center">Auto Scroll</span><div>
    <div id="summary"></div>
    `;
    win.document.body.style.margin = '0px';
    win.document.body.style.padding = '0px';

    const summaryD = win.document.getElementById('summary');
    const cNameD = win.document.getElementById('CN');
    const ASBtn = win.document.getElementById('ASBtn');
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
        let vsc = "https://s2.svgbox.net/hero-solid.svg?ic=x&color=ff0000";
        let hsc ="https://s2.svgbox.net/heropatterns.svg?ic=architect&color=000000"; 
        // remDom.style.visibility = 'hidden';
        remDom.src = hsc;
        remDom.addEventListener('click',()=>{
            words.delete(word);
            updateListDom();
            saveWords();
        });

        regExDom.addEventListener('mouseenter',()=>{remDom.src = vsc;});
        regExDom.addEventListener('mouseleave',()=>{remDom.src = hsc;});
        textDom.addEventListener('mouseenter',()=>{remDom.src = vsc;});
        textDom.addEventListener('mouseleave',()=>{remDom.src = hsc;});
        remDom.addEventListener('mouseenter',()=>{remDom.src = vsc;});
        remDom.addEventListener('mouseleave',()=>{remDom.src = hsc;});


        dom.append(textDom,regExDom,remDom);

        return dom;
    }

    const createMsgDom = (msg,element)=>{
        const dom = document.createElement('div');
        dom.classList.add('msg');
        dom.innerText=msg;
        dom.addEventListener('click',()=>{console.log('focus');element.scrollIntoView();});
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
        sc = 0;
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
    
    const updateFunc = (searchElem)=>{
        console.log('whatsapp summary working !!!');
        let outArr = [];
        summaryD.innerHTML = '';
        recCheck(searchElem,outArr);
        for(let i = 0 ; i < outArr.length; ++i){
            outArr[i].style.backgroundColor = bgColDom.value;
            outArr[i].style.color = colDom.value;
            summaryD.append(createMsgDom(outArr[i].innerText,outArr[i]));
        }
    }

    
    const loop = ()=>{
        requestAnimationFrame(loop);
        let titleDoms = document.getElementsByClassName('YEe1t');
        if(titleDoms.length == 0){
            chatName = undefined;
            cNameD.innerText = "";
            ASBtn.style.visibility = "hidden";
            return;
        }else{
            let cN = titleDoms[0].innerText;
            if(cN != chatName){
                cNameD.innerText = cN;
                ASBtn.style.visibility = "visible";
                chatName = cN;
                sc = 0;
                updateState = updateStates.notFound;
            }
        }


        let elems = document.getElementsByClassName('_26MUt');
        if(elems.length == 0){
            updateState=updateStates.notFound;
            sc=0;
        }else{
            if(updateState === updateStates.notFound){
                console.log('nc', chatName);
                updateState = updateState.opened;
                updateFunc(elems[0]);
                sc = elems[0].scrollHeight;
            }else{
                if(elems[0].scrollHeight != sc){
                    console.log('messages');
                    sc = elems[0].scrollHeight;
                    updateFunc(elems[0]);
                }
            }
        }
    }
    loop();

    ASBtn.addEventListener('click',()=>{
        let lastSclH = 0;
        let failCt = 10;
        const scrollFunc = ()=>{
            let elems = document.getElementsByClassName('_26MUt');
            if(elems.length===0)return;
            if(lastSclH != elems[0].scrollHeight){
                elems[0].scrollTo(0,elems[0].scrollHeight);
                lastSclH = elems[0].scrollHeight;
                failCt = 10;
                setTimeout(scrollFunc,300);//3 sec time
            }else{
                failCt--;
                if(failCt>0)setTimeout(scrollFunc,300);//3 sec time
            }
        }
        scrollFunc();
    });

    window.addEventListener('unload',()=>{win.close();})
})();
