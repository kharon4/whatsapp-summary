
let findList = [/bhai/];

const recCheck = (element,outArr)=>{
    console.log(element.children.length);
    let found = 0;
    //find in children
    for(let i = 0 ; i < element.children.length; ++i){
        if(recCheck(element.children[i],outArr))found++;
    }
    
    if(found>0){
        console.log('pL',found);
        return true;
    }
    //self check
    if(element.innerText != undefined)for(let i = 0 ; i < findList.length ; ++i){
        if(element.innerText.search(findList[i])>=0){
            outArr.push(element);
            console.log('pushed');
            return true;
        }
    }

    return false;
}

const updateFunc = ()=>{
    console.log('was');
    let outArr = [];
    recCheck(document.body,outArr);
    console.log(outArr);
    for(let i = 0 ; i < outArr.length; ++i){
        console.log(outArr[i].innerText)
        outArr[i].style.backgroundColor = 'lightgrey';
        outArr[i].style.color = 'black';
    }
}

updateFunc();