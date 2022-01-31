<h1>Cron job encrypted and decryted</h1>

<p>This command line application examines an input folder from time to time and encrypts the contents of this folder in PGP format

When the program is run the first time and only the first time, it will detect if the folders exist, origin and destination, if they do not exist, it will create them. Additionally, in the first traversal it will create a json file with the public and private keys in a json format.

The parameters are loaded through an .env file that must be generated

Encrypted files must be indicated by the final adjective of the file name **-encryted**</p>

<h3>star = npm start</h3>
<h3>dev = npm run dev</h3>


this version 1.0.0 - encryted only text