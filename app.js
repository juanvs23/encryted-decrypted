require('dotenv').config()
const Cron = require('cron').CronJob

const {FilesSystem} = require('./lib/classes/files-system')
const Encrypt = require('./lib/classes/encrypt')


const {INPUT_FOLDER,
    OUTPUT_FOLDER,
    CRON_TIME,
    CURVE,
    EMAIL , 
    NAME}=process.env
const inputFolder =INPUT_FOLDER
const outputFolder =OUTPUT_FOLDER

const encrypt=new Encrypt(EMAIL, NAME, CURVE, __dirname)
const filesSystem = new FilesSystem(inputFolder,outputFolder,__dirname,encrypt)
const job = new Cron(  CRON_TIME ,function(){
                    let date= new Date()
                    filesSystem.encrypt()
                    console.log(date);
                }, 
                null, 
                true, 
                'America/Los_Angeles')

/* 
encrypt
filesSystem.encrypt()
*/
/*
Dencrypt
filesSystem.deEncrypt() 
*/
job.start()





