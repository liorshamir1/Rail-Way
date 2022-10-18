
function createButton(text){
    var buttonElement = document.createElement('button');
    buttonElement.classList.add("button-pushable");
    buttonElement.setAttribute('role','button');
    var shadowSpan = document.createElement('span');
    shadowSpan.classList.add('button-shadow')
    var edgeSpan = document.createElement('span');
    edgeSpan.classList.add('button-edge')
    var frontSpan = document.createElement('span');
    frontSpan.classList.add('button-front')
    if(text) frontSpan.innerText=text;
    buttonElement.appendChild(shadowSpan)
    buttonElement.appendChild(edgeSpan)
    buttonElement.appendChild(frontSpan)
    return buttonElement;
}
