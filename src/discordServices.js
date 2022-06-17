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

const setCounter = () => {
  // 
  const date = new Date()
  var day = date.getDate()
  var hour = date.getHours()-3
  const minute = date.getMinutes()
  const arriveDay = 31
  const arriveHour = 7
  const arriveMinute = 10

  if(date.getHours() === 0 || date.getHours() === 1 || date.getHours() === 2 ){
    hour += 24
  }

  var diasRestantes = 0
  var horasRestantes = 0
  while(day < arriveDay){
      diasRestantes++
      day++
      horasRestantes = diasRestantes * 24
  }
  var minutesLeft = 0
  if(hour > arriveHour){
      diasRestantes --
      if(arriveMinute<minute){
          horasRestantes-=1
          minutesLeft = 60 - (minute - arriveMinute)
      }else {
          minutesLeft = (arriveMinute - minute)
      }
      horasRestantes -= (hour - arriveHour)
  } else {
    horasRestantes += arriveHour - hour
    if(arriveMinute<minute){
        horasRestantes-=1
        minutesLeft = 60 - (minute - arriveMinute)
    }else {
        minutesLeft = (arriveMinute - minute)
    }
}
  // 
  client.user.setPresence({
    activities: [{name: `${horasRestantes}:${minutesLeft}`,type: 'WATCHING'}],
    // activities: [{name: `TODO MAL`,type: 'WATCHING'}],
    status: 'dnd'
  })
}

client.on('ready', () => {
  // setInterval(() => setStats(), 60000);
  // setInterval(() => setCounter(), 3600000);
  setInterval(() => setCounter(), 10000);
})

module.exports = { client }
