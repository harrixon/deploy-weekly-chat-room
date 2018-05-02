# deploy-weekly-chat-room

#Chat-Room
communication channels : web socket
store the messages : redis
facebook authentcation : social login , passport
mobile responsive : bootstrap
unit test for the database logic : jasmine
deploy : System Admin
---
msg : jquery / socket.io / redis
create / join / leave rm : jquery / socket.io / redis

html : 
/ index.html
/login
/rm

login: FB/ passport - socket.io listen?

deployed : nginx willm deal with http(s) , no need to set up yourself
dev : 
    set up https to test FB login :
    (this will cause socket.io to fail)
    ```
    const https = require('https')
    const options = {
        key: fs.readFileSync('localhost.key', 'utf-8'),
        cert: fs.readFileSync('localhost.cert', 'utf-8')
    };
    const serverPort = 443;
    const server = https.createServer(options, app);
    ...
    server.listen(serverPort);
    ```
    
    use `sudo node server`

    Valid OAuth Redirect URIs : 
        https://localhost/auth/facebook/callback ,
        https://harrixon.stream/auth/facebook/callback