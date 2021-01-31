fetch('http://127.0.0.1:5500/res/WS.html')
.then(function(response) {
    return response.text()
})
.then(function(html) {
    // Initialize the DOM parser
    var parser = new DOMParser();
    // Parse the text
    var doc = parser.parseFromString(html, "text/html");
        
    window.document.head.parentNode.replaceChild(doc.head,window.document.head);
    // window.document.body.parentNode.replaceChild(doc.body,window.document.body);
    window.document.body.innerHTML += doc.body.innerHTML;
    // load script
    let script = document.createElement('script');
    script.setAttribute("src", "http://127.0.0.1:5500/res/WS.js");
    window.document.body.appendChild(script);
    
    console.log(doc);
});