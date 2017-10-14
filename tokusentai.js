require('dotenv').config()

const Discord = require('discord.js')
const franc = require('franc')
const translate = require('google-translate-api')

const client = new Discord.Client()

var emojis = {}
var lastChannel

var youtube = []
const REPLY = 0
const SEND = 1
var disabled = 0

const msg = [
  {
    trigger: message => {
      if (franc(message) === 'und') {
        return ['cmn', 'kor', 'jpn', 'rus'].indexOf(franc(`${message} ${message} ${message} ${message} ${message} ${message} ${message} ${message} ${message} ${message}`)) > -1
      }
      return ['cmn', 'kor', 'jpn', 'rus'].indexOf(franc(message)) > -1
    },
    response: message => {
      return translate(message, {to: 'no'})
      .then(function (response) {
        return new Promise(function (resolve, reject) {
          resolve(
            `Moonrunes ${emojis.RRRREEEE} \n` +
            response.text + '\n' +
            `${emojis.RRRREEEE} ${emojis.RRRREEEE} ${emojis.RRRREEEE} ${emojis.RRRREEEE} ${emojis.RRRREEEE} ${emojis.RRRREEEE}`
          )
        })
      })
    },
    type: REPLY
  },
  {
    trigger: message => {
      return (
        message.indexOf('REE') > -1 ||
        message.toLowerCase().indexOf('grr') > -1 ||
        message.toLowerCase().indexOf('jesus fucking christ') > -1 ||
        (
          ((message.length - message.replace(/[A-ZÆØÅ]/, '').length) / message.length) > 0.2
        )
      )
    },
    response: message => {
      return new Promise(resolve => {
        resolve('Tell til ti, kompis. :slight_smile:')
      })
    },
    type: REPLY
  },
  {
    trigger: message => {
      return message.toLowerCase().indexOf('fitte') > -1
    },
    response: message => {
      return new Promise(resolve => {
        resolve(`Fitte ${emojis.yeye}`)
      })
    },
    type: SEND
  },
  {
    trigger: message => {
      return (
        message.toLowerCase().indexOf('weed') > -1 ||
        message.toLowerCase().indexOf('weeb') > -1
      )
    },
    response: message => {
      return new Promise(resolve => {
        resolve(`weed ${emojis.yeye}\nweeb ${emojis.nono}`)
      })
    },
    type: SEND
  },
  {
    trigger: message => {
      if (message.indexOf('weed') > -1) {
        if (message.indexOf('video') > -1) {
          return (Math.floor(Math.random() * 10) + 1) === 5
        }
        return (Math.floor(Math.random() * 25) + 1) === 5
      }
      return (Math.floor(Math.random() * 100) + 1) === 5
    },
    response: message => {
      return new Promise(resolve => {
        resolve(youtube[(message.length % youtube.length)])
      })
    },
    type: SEND
  },
  {
    trigger: message => {
      return message === '<@368684667399962625> hold kjeft'
    },
    response: message => {
      disabled = 1
      return new Promise(resolve => {
        resolve('oki brosjan')
      })
    },
    type: REPLY
  },
  {
    trigger: message => {
      return message.indexOf('<@368684667399962625>') > -1
    },
    response: message => {
      disabled = 0
      return new Promise(resolve => {
        resolve('hey')
      })
    },
    type: REPLY
  }
]

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  emojis = client.emojis.reduce((emojis, emoji) => {
    emojis[emoji.name] = emoji.toString()
    return emojis
  }, emojis)
  youtube = [
    `https://www.youtube.com/watch?v=eEoMI9BwHp4 ${emojis.weed} ${emojis.weed} ${emojis.weed}`,
    `https://www.youtube.com/watch?v=iPXKfGxeHIY ${emojis.weed} ${emojis.weed} ${emojis.weed}`,
    `https://www.youtube.com/watch?v=lxptFSJJ14Y ${emojis.weed} ${emojis.weed} ${emojis.weed}`,
    `https://www.youtube.com/watch?v=pNdO95XfJ8I ${emojis.weed} ${emojis.weed} ${emojis.weed}`,
    `https://www.youtube.com/watch?v=Gmf-TW5rWiY ${emojis.weed} ${emojis.weed} ${emojis.weed}`,
    `https://www.youtube.com/watch?v=W5Jj6iTY1X0 ${emojis.weed} ${emojis.weed} ${emojis.weed}`,
    `https://www.youtube.com/watch?v=Wrr7JwGImvs ${emojis.weed} ${emojis.weed} ${emojis.weed}`,
    `https://www.youtube.com/watch?v=WznC9N5r-bk ${emojis.weed} ${emojis.weed} ${emojis.weed}`,
    `https://www.youtube.com/watch?v=XXlMwL5MDqw ${emojis.weed} ${emojis.weed} ${emojis.weed}`,
    `https://www.youtube.com/watch?v=IwLi67b5tjo ${emojis.weed} ${emojis.weed} ${emojis.weed}`,
    `https://www.youtube.com/watch?v=UuLXfju0i_I ${emojis.weed} ${emojis.weed} ${emojis.weed}`,
    `https://www.youtube.com/watch?v=ZqN4J3GGJ8M ggoctg ${emojis.yeye}`,
    `https://www.youtube.com/watch?v=56yPhgGK2ek ggoctg ${emojis.yeye}`,
    `https://www.youtube.com/watch?v=qvqvCRbNS0s ${emojis.weed} ${emojis.weed} ${emojis.weed}`,
    `https://www.youtube.com/watch?v=mxFifH8yrds ${emojis.weed} ${emojis.weed} ${emojis.weed}`,
    `https://www.youtube.com/watch?v=cfrMOti_V-I ${emojis.weed} ${emojis.weed} ${emojis.weed}`,
    `https://www.youtube.com/watch?v=axhiO4SBBjo ${emojis.weed} ${emojis.weed} ${emojis.weed}`,
    `https://www.youtube.com/watch?v=d2As4r6XGog ${emojis.weed} ${emojis.weed} ${emojis.weed}`,
    `https://www.youtube.com/watch?v=SB7UVftunJI ${emojis.weed} ${emojis.weed} ${emojis.weed}`,
    `https://www.youtube.com/watch?v=y1-5MAMC3Og ${emojis.weed} ${emojis.weed} ${emojis.weed}`,
    `https://www.youtube.com/watch?v=-mrmExPzLs4 fitte ${emojis.yeye}`,
    `https://www.youtube.com/watch?v=xc8KdyU8N8Q ${emojis.weed} ${emojis.weed} ${emojis.weed}`,
    `https://www.youtube.com/watch?v=rnS-05XoXs4 ${emojis.weed} ${emojis.weed} ${emojis.weed}`,
    `https://www.youtube.com/watch?v=sifVwz5Nguc ${emojis.weed} ${emojis.weed} ${emojis.weed}`,
    `https://www.youtube.com/watch?v=o2TO5atI4rU ${emojis.weed} ${emojis.weed} ${emojis.weed}`
  ]
})

client.on('message', message => {
  console.log(`${message.author.username}: ${message.content}`)
  lastChannel = message.channel
  if (message.author.bot) return
  msg.some((cur, i) => {
    if (cur.trigger(message.content)) {
      cur.response(message.content)
      .then(reply => {
        if (disabled === 0 || disabled === 1) {
          if (cur.type === REPLY) {
            message.reply(reply)
          } else if (cur.type === SEND) {
            message.channel.send(reply)
          } else {
            throw new Error('msg[' + i + '] does not have a type property, or the specified type property is not supported')
          }
          if (disabled === 1) disabled = 2
        }
      })
      .catch(error => {
        console.log(error)
      })
      return true
    }
  })
})

client.login(process.env.TOKEN)

process.stdin.on('readable', () => {
  const chunk = process.stdin.read()
  if (chunk !== null) {
    if (lastChannel) {
      lastChannel.send(chunk.toString())
    }
  }
})
