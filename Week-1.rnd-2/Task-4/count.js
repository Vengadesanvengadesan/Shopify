const {readFile}=require('fs');
const path =require('path')
function countWords(callback) {
    const filePath = path.join(__dirname, 'paragraph.txt');

readFile(filePath,'utf8', (err,data)=>{
    if(err){
        console.log(err);
        return;
    }
    const splitWords=data.split(/\s+/);
    let count=0;
    for(let i=0;i<splitWords.length;i++){
        if(splitWords[i].length>0){
            count++;
        }
    }
    

        callback(null, count);
})
}
module.exports=countWords;