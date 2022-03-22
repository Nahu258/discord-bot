require('dotenv').config()
const { app } = require('./src/server')
const { client } = require('./src/discordServices')
const port = process.env.PORT

client.login(process.env.TOKEN)

app.listen(port, () => {console.log(`Server running on port ${ port }`)})
