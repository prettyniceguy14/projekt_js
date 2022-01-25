async function sha1(message) {
    const msgBuffer = new TextEncoder().encode(message);                    
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));              
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function currentDate(){
    var date = new Date();
    var day = date.getDate();
    var month = (date.getMonth() + 1).toString();
    var year = (date.getFullYear() + "").substring(2);
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    var hour = date.getHours().toString();
    var min = date.getMinutes().toString();
    var sec = date.getSeconds().toString();
    if (hour.length < 2) 
        hour = '0' + hour;
    if (min.length < 2) 
        min = '0' + min;
    if (sec.length < 2) 
        sec = '0' + sec;   

    return [day,month,year].join("/") + " " + [hour, min, sec].join(":");
}

class Block{
    constructor(index, time, data,diff, previousHash = ''){
        this.index = index;
        this.time = time;
        this.data = data;
        this.block_difficulty = diff;
        this.previousHash = previousHash;
        this.hash = "";
        this.nonce = 0;
    }

    async calculateHash(){
        var result =  await sha1(this.index + this.previousHash + this.time + JSON.stringify(this.data) + this.nonce);
        return result;
    }

    async mineBlock(diff){
        this.nonce = 0;
        this.hash = await this.calculateHash();
        while(this.hash.substring(0, diff) !== Array(diff + 1).join("0")){
            this.nonce++;
            this.hash = await this.calculateHash();
        }
    }
}

class Blockchain{
    constructor(){
        this.chain = [];
        this.difficulty = 2;
    }

    async createGenesisBlock(){
        let genesis = new Block(0, "01/11/19 09:11:15", "Genesis block - by Karol Bobowski", 0 , "0");
        let result = await genesis.calculateHash();
        genesis.hash = result;
        this.chain.push(genesis);
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    async addBlock(newBlock,mine){
        newBlock.index = this.chain.length;
        newBlock.previousHash = this.getLatestBlock().hash;
        const hashed = await newBlock.calculateHash();
        newBlock.hash = hashed;
        if(mine)
            await newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    async isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            const hashed = await currentBlock.calculateHash();
            if(currentBlock.hash !== hashed){
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }

    async findFirstNonValidBlock(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            const hashed = await currentBlock.calculateHash();
            if(currentBlock.hash !== hashed){
                return i;
            }
            if(currentBlock.previousHash !== previousBlock.hash){
                return i;
            }
        }
        return -1;
    }

    isBlockValid(index){
        const block = this.chain[index];
        return block.hash.substring(0, block.block_difficulty) === Array(block.block_difficulty + 1).join("0");
    }

    getAllInvalidBlocks(){
        var result = []
        for(let i = 1; i < this.chain.length; i++){
             if(!this.isBlockValid(i))
                result.push(i);   
        }
        return result;
    }
}