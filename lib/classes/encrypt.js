const openpgp = require('openpgp')
const fs = require('fs')
const path= require('path')
const colors= require('colors')


class Encrypt{
    name=''
    email=''
    pathDir=''
    curve=''
    constructor(name,email,curve,path){
        this.name=name
        this.email=email
        this.pathDir=path
        this.curve=curve
        this.passphrase="qwerty"
        this.generateKey(this.email,this.name)
       
    }
    /**
     * 
     * @param {String} name 
     * @param {String} email 
     */
   async generateKey(name,email){
       if(!fs.existsSync(`${this.pathDir}/keys.json`)){
           console.log(colors.red(`Keys don't exists`));
           console.log(colors.yellow(`genereting keys...`));
            let option= {
                curve:this.curve,
                userIDs:[{ name, email }],
                passphrase:this.passphrase ,
            } 
           openpgp.generateKey(option).then(key=>{
               
               let data=key
            
               fs.writeFile(`${this.pathDir}/keys.json`,JSON.stringify(data), {
                    encoding: "utf8",
                    flag: "w",
                    mode: 0o666
                  },(err)=>{
                    console.log(colors.green('key generated ✔'))
                  
                })
           })
          }else{
            console.log(colors.green('keys exits')); 
          }  
    }
    /**
     * 
     * @param {Buffer} data 
     * @returns {String} encryted
     */
   async encryptData(data){
        let key = require('../../keys.json') 
      let text= data.toString('utf-8')
    
       let encryptionKeys = (await openpgp.readKey({armoredKey:key.publicKey}))
       let message = await openpgp.createMessage({text})
        const encrypted = await openpgp.encrypt({
            message,
            encryptionKeys,
          });
      
        return encrypted
    }
    /**
     * 
     * @param {Buffer} encrypted 
     * @returns 
     */
    async deEncryptData(encrypted){
        let key = require('../../keys.json') 
        let {privateKey,publicKey}=key,
            decryptionKeys= await await openpgp.decryptKey({
            privateKey: await openpgp.readPrivateKey({ armoredKey: privateKey }),
            passphrase:this.passphrase
        }),
            verificationKeys = (await openpgp.readKey({armoredKey:key.publicKey})),
            message = await openpgp.readMessage({
                armoredMessage: encrypted.toString('utf-8')
        });

        
        const decrypted = await openpgp.decrypt({
            message,
            verificationKeys, // optional
            decryptionKeys
        });
      
        return  decrypted.data 
    }

} 
module.exports=Encrypt 