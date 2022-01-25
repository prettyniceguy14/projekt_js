document.getElementById("add-button").addEventListener("click", ()=>{
    boboChain.addBlock(new Block(-1,currentDate(),"", boboChain.difficulty), false).then(()=>{
        render(boboChain);
     });
});

document.getElementById("inc-diff").addEventListener("click", ()=>{
    boboChain.difficulty++;
    render(boboChain);
});

document.getElementById("dec-diff").addEventListener("click", ()=>{
    boboChain.difficulty--;
    render(boboChain);
});

var loadingObj = document.getElementById("loading");

let boboChain = new Blockchain();

boboChain.createGenesisBlock().then(() => {boboChain.addBlock(new Block(-1,"01/11/20 12:01:05","II rok Informatyka stacj.", boboChain.difficulty),true).then(()=>{
    boboChain.addBlock(new Block(-1,"15/01/22 14:39:15","Uniwerstytet Rzeszowski", boboChain.difficulty), true).then(()=>{
       render(boboChain);
    });
});});


function render(chain){
    const stateElem = document.getElementById("bc-state");
    const diffElem = document.getElementById("bc-difficulty");
    diffElem.innerText = chain.difficulty;

    chain.findFirstNonValidBlock().then((notValidIndex) => {
    const invalidBlockIds = chain.getAllInvalidBlocks();

    if(invalidBlockIds.length > 0 || notValidIndex != -1){
        stateElem.innerText = "Invalid";
        stateElem.style.color = "#b3010f";
    }else{
        stateElem.innerText = "Valid";
        stateElem.style.color = "#c495fd";
    }

    const container = document.getElementsByClassName("container")[0];
    container.innerHTML = "";

    for(let i = 0; i < chain.chain.length; i++){
        const block = chain.chain[i];
        
        const newDiv = document.createElement("div");
        newDiv.classList.add("block");
        newDiv.innerHTML = `<div class="block-section id-section">
                                <label class="text-input-label">ID:</label>
                                <input type="text" placeholder="ID..." class="text-input" disabled value="${block.index}" name="id" id="id">
                            </div>
                            <div class="block-section hash-section">
                                <label class="text-input-label">Poprzedni hash:</label>
                                <input type="text" placeholder="Poprzedni hash..." class="text-input" disabled value="${block.previousHash}">
                            </div>
                            <div class="block-section hash-section">
                                <label class="text-input-label">Aktualny hash:</label>
                                <input type="text" placeholder="Aktualny hash..." class="text-input" disabled value="${block.hash}">
                            </div>
                            <div class="block-section date-section">
                                <label class="text-input-label">Data:</label>
                                <input type="text" placeholder="Data..." class="text-input" value="${block.time}" name="time">
                            </div>
                            <div class="block-section data-section">
                                <label class="text-input-label">Dane:</label>
                                <input type="text" placeholder="Dane..." class="text-input" value='${block.data}' name="data">
                            </div>
                            <div class="action-section">
                                <label class="text-input-label">Akcje:</label>
                                <button class="button-elem action-button">Wykop</button>
                            </div>`;
        container.appendChild(newDiv);
        if(block.index === 0){
            //genesis block, disable textfields
            newDiv.querySelector("input[name='time']").disabled = "true";
            newDiv.querySelector("input[name='data']").disabled = "true";
            newDiv.querySelector(".action-button").disabled = "true";
        }

        if(invalidBlockIds.includes(block.index)){
            const allFields = newDiv.querySelectorAll(".text-input");
            allFields[2].classList.add("invalid-hash");
            allFields[2].classList.add("invalid-hash-text");
            newDiv.children[5].children[1].style.backgroundColor = "#c495fdff";
        }

        if(notValidIndex != -1 && notValidIndex <= block.index){
            const allFields = newDiv.querySelectorAll(".text-input");
            for(let j = 0; j < allFields.length; j++){
                allFields[j].classList.add("invalid-hash");
                allFields[j].classList.add("invalid-hash-text");
            }
            newDiv.children[5].children[1].style.backgroundColor = "#c495fdff";
        }

        newDiv.children[3].children[1].addEventListener("blur", function(r) {
            const newValue = r.target.value;
            const blockID = r.target.parentElement.parentElement.children[0].children[1].value;
            chain.chain[blockID].time = newValue;
            chain.chain[blockID].calculateHash().then(newHash => {
                chain.chain[blockID].hash = newHash;
                render(chain);
            });
        });

        newDiv.children[4].children[1].addEventListener("blur", function(r) {
            const newValue = r.target.value;
            const blockID = r.target.parentElement.parentElement.children[0].children[1].value;
            chain.chain[blockID].data = newValue;
            chain.chain[blockID].calculateHash().then(newHash => {
                chain.chain[blockID].hash = newHash;
                render(chain);
            });
        });

        newDiv.children[5].querySelector("button").addEventListener("click", function(r){
            const blockID =  r.target.parentElement.parentElement.children[0].children[1].value;
            if(blockID == 0)
                return;
            loadingObj.style.display = "flex";
            chain.chain[blockID].previousHash = chain.chain[blockID - 1].hash;
            chain.chain[blockID].mineBlock(chain.difficulty).then(() => {
                loadingObj.style.display = "none";
                render(chain);
            });
        });
    }
    });
}