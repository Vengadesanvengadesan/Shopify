const fs=require('fs');
const path=require('path');
const folderPath=path.join(__dirname,'document');
fs.readdir(folderPath,(err,items)=>{
    if(err){
        console.log(err);
        return;
    }
    let fileCount=0;
    for(let i=0;i<items.length;i++){
        const fullPath=path.join(folderPath,items[i]);
        if(fs.statSync(fullPath).isFile()){
            fileCount++;
        }
    }
    console.log(`Total Files in documents folder: ${fileCount}`);
})