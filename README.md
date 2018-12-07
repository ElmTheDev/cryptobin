<center align="center">
	
# CryptoBin

# **The Encrypted PasteBin**
</center>

- What is CryptoBin?
	- CryptoBin is text-hosting application where the nobody but server and user know what's stored on the server!

- How does this work?
	- Whenever API call is made for new paste to be created server encrypts the content with user provided key and stores *only* the encrypted version of content in .EP file on the server. The .EP files is then encrypted once again with key *only* known to the server.
	
- What encryption is used?
	- The encryption used in this project is AES-256.

- How secure is AES-256?
	- The cipher AES-256 is used among other places in SSL/TLS across the Internet. It's considered among the top ciphers.
    - In theory it's not crackable since the combinations of keys are massive. 

- Are there any logs?
	- In this version of source code there is no code that logs anything!
