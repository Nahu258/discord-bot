const { Client, Intents } = require('discord.js');
const axios = require('axios')

const client = new Client({ 
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] 
});

const logger = (a, b, c) => {
  console.log('--------------------')
  console.log('Floor price:', a)
  console.log('Listed count:', b)
  console.log('Average price:', c)
}

const setStats = async () => {
  try{
    const stats = await getStats()
    const fp = (stats.floorPrice / 1000000000).toFixed(2)
    const lc = stats.listedCount
    const average = (Math.trunc(stats.avgPrice24hr) / 1000000000).toFixed(2)
    //console.log(stats)
    logger(fp, lc, average)
    client.user.setPresence({
      activities: [{name: `Floor: ${fp} ◎`,type: 'WATCHING'}],
      status: 'online'
    })
  } catch(e) {
    console.log(e)
  }
}

const getStats = async () => {
  const url = 'http://api-mainnet.magiceden.dev/v2/collections/ddac/stats'
  const { data } = await axios.get(url)
  return data
}

client.on('ready', () => {
  setInterval(() => setStats(), 60000);
})

module.exports = { client }
