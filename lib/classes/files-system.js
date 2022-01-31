const fs = require('fs')
const path = require('path')
const colors= require('colors')

/**
 * Mana all files action
 */
class FilesSystem{
   date=new Date()
   inputFolder=''
   outputFolder=''
   dirPath=''

    /**
     * construtor
     * @param {string} input 
     * @param {string} output 
     * @param {string} pathFile 
     * @param {object | function} callback 
     */
    constructor(input,output,pathFile,callback){
        this.dirPath= pathFile
        this.dataPath = path.join(this.dirPath,'data')
        this.encryptedInputFolder = path.join(this.dirPath,`/data/encryted/${input}`) 
        this.deencryptedInputFolder =  path.join(this.dirPath,`/data/deencryted/${input}`) 
        this.encryptedoutputFolder =  path.join(this.dirPath,`/data/encryted/${output}`) 
        this.deencryptedoutputFolder =  path.join(this.dirPath,`/data/deencryted/${output}`) 
        this.date = new Date()
        this.callback = callback
        this.initial() 
    }
    /**
     * Create check if exist folder and ceate it's
     */
    initial(){
         let folders=[
            this.dataPath,
            this.encryptedInputFolder,
            this.encryptedoutputFolder,
            this.deencryptedInputFolder,
            this.deencryptedoutputFolder
         ]
        try {
            folders.forEach(async folder=>{
             
                if (!fs.existsSync(folder)) {
                  let makeDir=await fs.mkdirSync(folder,{recursive: true}, err => {console.log(error);})
                  if(makeDir){
                    console.log(colors.green(`${folder} -- created ✔`)); 
                  }
                }
            })
          
        } catch (error) { 
            console.log(error);  
        }
      
    }
    /**
     * search folder and read files
     * @param {String} action 
     */
   readFiles(action){

        if (action==='encript') {
            let files= fs.readdirSync(this.encryptedInputFolder)
            files.forEach( (file,index)=>{
              fs.readFile(`${this.encryptedInputFolder}/${file}`,{},(err,content)=>{
                   if(err){
                       console.log(err);
                   }
                  
                   let newData= this.callback.encryptData(content);
                   let newName= `${file.split(path.extname(file))[0]}-encryted${path.extname(file)}`
                   newData.then(data=>{
                       
                    this.createFiles(data,newName,this.encryptedoutputFolder)
                 })
                    
                })
            })  
        }
        if(action==='deencript'){
            let files= fs.readdirSync(this.deencryptedInputFolder)
          
            files.forEach( (file,index)=>{
              fs.readFile(`${this.deencryptedInputFolder}/${file}`,{},(err,content)=>{
                   if(err){
                       console.log(err);
                   }
                   let newData= this.callback.deEncryptData(content);
                   let newName= `${file.split('-encryted',file.length)[0]}${path.extname(file)}`
                   
                  
                  newData.then(data=>{
                    this.createFiles(data,newName,this.deencryptedoutputFolder)
                }) 
                
                    
                })
            })  
        }
       
    }
    /**
     * Create files preview reading
     * @param {Buffer} data 
     * @param {String} name 
     * @param {String} output
     * 
     */
    createFiles(data,name, output){
      if(!fs.existsSync(`${output}/${name}`)){
        fs.writeFile(`${output}/${name}`,data, {
            encoding: "utf8",
            flag: "w",
            mode: 0o666 
          },(err)=>{
               if(err){
                console.log(err);
               }else{
                console.log(colors.green(`${name} -- created ✔`));
               } 
        })
      }
    }
    /**
     * Encrypt
     */ 
    encrypt(){
        this.readFiles('encript')
    }
    /**
     * deEncrypt
     */
    deEncrypt(){
        this.readFiles('deencript')
    } 
}

 
module.exports={FilesSystem}