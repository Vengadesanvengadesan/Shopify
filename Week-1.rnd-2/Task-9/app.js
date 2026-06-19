const word=require('./found')


word((err,result)=>{
    if(err){
        console.log(err);
        return ;
    }

console.log(`"Node.js"  found ${result} times`)
});