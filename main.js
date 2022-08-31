const server = require('./index')
const PORT = process.env.PORT||8080



server.listen(PORT, ()=>{
    console.log("server is running")
})