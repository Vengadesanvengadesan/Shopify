const {readFileSync , writeFileSync} =require('fs');

function convert(){
    const first=readFileSync('./Task-5/message.txt','utf8');
     const upperData=first.toUpperCase();
     writeFileSync('./Task-5/upper.txt',upperData,{
        encoding:'utf8'
     })
    console.log("Converted to uppercase and saved!");
      
}
convert()
module.exports=convert;