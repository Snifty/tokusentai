require('dotenv').config()

const Discord = require('discord.js')
const franc = require('franc')
const translate = require('google-translate-api')

const client = new Discord.Client()
const REPLY = 0
const SEND = 1
const REACT = 2

const MESSAGE = 0
const TIME = 1
const INTERVAL = 60000

var disabled = 0 // 0 => not disabled, 1 => will disable after this message, 2 => disabled
var now = (new Date()).getTime()

var emojis = {}
var youtube = []
var lastChannel

var simpleMsgReply = []
var simpleMsg = []
var reactions = []

const msg = [
  {
    trigger: () => {
      return (Math.floor(Math.random() * 1000) + 1) === 42
    },
    response: message => {
      message = message.content
      return new Promise(resolve => {
        resolve('<@!132867430937526272> leve du')
      })
    },
    triggerType: MESSAGE,
    responseType: SEND,
    lastSentAt: now,
    timeout: 80000000
  },
  {
    trigger: message => {
      var francMessage = franc(message)
      if (francMessage === 'und') {
        return ['cmn', 'kor', 'jpn', 'rus'].indexOf(franc(`${message} ${message} ${message} ${message} ${message} ${message} ${message} ${message} ${message} ${message}`)) > -1
      }
      return ['cmn', 'kor', 'jpn', 'rus'].indexOf(francMessage) > -1
    },
    response: message => {
      message = message.content
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
    triggerType: MESSAGE,
    responseType: REPLY,
    lastSentAt: 0,
    timeout: 3000
  },
  {
    trigger: message => {
      return (
        message.indexOf('REE') > -1 ||
        message.toLowerCase().indexOf('grr') > -1 ||
        message.toLowerCase().indexOf('jesus fucking christ') > -1 ||
        (
          (((message.length - message.replace(/[A-ZÆØÅ]/, '').length) / message.length) > 0.45) &&
          message.length > 10
        )
      )
    },
    response: message => {
      message = message.content
      return new Promise(resolve => {
        resolve('Tell til ti, kompis. :slight_smile:')
      })
    },
    triggerType: MESSAGE,
    responseType: REPLY,
    lastSentAt: 0,
    timeout: 30000
  },
  {
    trigger: message => {
      return message.toLowerCase().indexOf('fitte') > -1
    },
    response: message => {
      message = message.content
      return new Promise(resolve => {
        resolve(`Fitte ${emojis.yeye}`)
      })
    },
    triggerType: MESSAGE,
    responseType: SEND,
    lastSentAt: 0,
    timeout: 30000
  },
  {
    trigger: message => {
      return (
        message.toLowerCase().indexOf('weed') > -1 ||
        message.toLowerCase().indexOf('weeb') > -1
      )
    },
    response: message => {
      message = message.content
      return new Promise(resolve => {
        resolve(`weed ${emojis.yeye}\nweeb ${emojis.nono}`)
      })
    },
    responseType: SEND,
    triggerType: MESSAGE,
    lastSentAt: 0,
    timeout: 3000
  },
  {
    trigger: message => {
      let date = new Date()
      return (
        date.getHours() >= 6 &&
        date.getHours() < 12 &&
        (
          message.toLowerCase() === 'gm' ||
          message.toLowerCase() === `<@${process.env.CLIENT_ID}> gm`
        )
      )
    },
    response: () => {
      return new Promise(resolve => {
        resolve('gm')
      })
    },
    triggerType: MESSAGE,
    responseType: SEND,
    lastSentAt: 0,
    timeout: 3600000
  },
  {
    trigger: message => {
      let date = new Date()
      return (
        (date.getHours() === 4 && date.getMinutes() === 20) ||
        (date.getHours() === 16 && date.getMinutes() === 20)
      )
    },
    response: message => {
      return message.react(emojis.weed)
      .then(() => {
        return message.react(emojis.four)
      })
      .then(() => {
        return message.react(emojis.two)
      })
      .then(() => {
        return message.react(emojis.zero)
      }).then(() => {
        return new Promise(resolve => {
          resolve({})
        })
      })
    },
    triggerType: MESSAGE,
    responseType: SEND,
    lastSentAt: 0,
    timeout: 3000
  },
  {
    trigger: message => {
      return message === `<@${process.env.CLIENT_ID}> hold kjeft`
    },
    response: message => {
      message = message.content
      disabled = 1
      return new Promise(resolve => {
        resolve('oki brosjan')
      })
    },
    triggerType: MESSAGE,
    responseType: REPLY,
    lastSentAt: 0,
    timeout: 3000
  },
  {
    trigger: message => {
      return message === `<@${process.env.CLIENT_ID}> github`
    },
    response: message => {
      message = message.content
      return new Promise(resolve => {
        resolve('https://github.com/Markussss/tokusentai bare å klone og endre og sende pull requests kompis')
      })
    },
    triggerType: MESSAGE,
    responseType: REPLY,
    lastSentAt: 0,
    timeout: 3000
  },
  {
    trigger: message => {
      return message.indexOf(`<@${process.env.CLIENT_ID}>`) > -1
    },
    response: message => {
      message = message.content
      disabled = 0
      console.log(message)
      return new Promise(resolve => {
        var response = (simpleMsgReply.filter(msg => message.toLowerCase().indexOf(msg.trigger) > -1)[0] || {response: 'hey'}).response
        if (response.length) {
          response = response.split('|')
          response = response[[(Math.floor(Math.random() * response.length))]]
        }
        resolve(response)
      })
    },
    triggerType: MESSAGE,
    responseType: REPLY,
    lastSentAt: 0,
    timeout: 3000
  },
  {
    trigger: message => {
      return simpleMsg.filter(msg => message.toLowerCase().trim() === msg.trigger).length === 1
    },
    response: message => {
      message = message.content
      return new Promise(resolve => {
        var response = (simpleMsg.filter(msg => message.toLowerCase().indexOf(msg.trigger) > -1)[0] || {response: `${emojis.nani}`}).response
        if (response.length) {
          response = response.split('|')
          response = response[[(Math.floor(Math.random() * response.length))]]
        }
        resolve(response)
      })
    },
    triggerType: MESSAGE,
    responseType: SEND,
    lastSentAt: 0,
    timeout: 3000
  },
  {
    trigger: message => {
      return message.toLowerCase().indexOf('bra bot') > -1
    },
    response: () => {
      return new Promise(resolve => {
        resolve('hø snakka du om mj')
      })
    }
  }
]

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  emojis = client.emojis.reduce((emojis, emoji) => {
    emojis[emoji.name] = emoji
    return emojis
  }, emojis)
  emojis.one = '1⃣'
  emojis.two = '2⃣'
  emojis.three = '3⃣'
  emojis.four = '4⃣'
  emojis.five = '5⃣'
  emojis.six = '6⃣'
  emojis.seven = '7⃣'
  emojis.eight = '8⃣'
  emojis.nine = '9⃣'
  emojis.zero = '0⃣'
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

  simpleMsgReply = [
    // simple message-to-response mapping, all messages has to be prefixed with @bot (in chat) / <@${process.env.CLIENT_ID}> (in code)
    {
      trigger: 'hey',
      response: 'hey|hei|hallo'
    },
    {
      trigger: 'nice',
      response: 'takk|ye'
    },
    {
      trigger: 'jp',
      response: 'ins dd|ins dd|ins dd|ins dd|ins dd|fingre dd|ins dd|ronke dd|ronke dd|ronke dd'
    },
    {
      trigger: 'ins dd',
      response: 'ins dd|ins dd|ins dd|ins dd|ins dd|fingre dd|ins dd|ronke dd|ronke dd|ronke dd'
    },
    {
      trigger: 'ins',
      response: 'ok|oki|oja|ronke du|ka e din fav porno side'
    },
    {
      trigger: `${emojis.nani}`,
      response: `${emojis.nani}`
    }
  ]

  simpleMsg = [
    // simple message-to-response mapping, compares trigger to all messages, but will only react if the message is exactly the same as the trigger
    {
      trigger: `${emojis.nani}`,
      response: `${emojis.nani}`
    },
    {
      trigger: 'hey kara',
      response: 'hey kar'
    },
    {
      trigger: 'nok en gang',
      response: 'nok en gang ser vi behovet for en legalisering av marihuana i norge i dag|nok en gang ser vi behovet for et forbud mot anime i norge i dag'
    },
    {
      trigger: 'endelig',
      response: 'endelig. få det jævla korset vekk. ønsk revolusjonen velkommen, kamerater, endelig får vi oppleve ekte kommunisme!'
    },
    {
      trigger: 'mynt',
      response: 'e det noen som har kukmarinert no mynta i det siste da eller?'
    },
    {
      trigger: 'runescape',
      response: 'Bad Game! Run! Escape!'
    },
    {
      trigger: 'he lokt',
      response: 'lokt i tissn'
    }
  ]

  reactions = [
    {
      trigger: emojis.yeye.toString(),
      reaction: message => {
        message.react(emojis.yeye)
      }
    },
    {
      trigger: emojis.weed.toString(),
      reaction: message => {
        message.react(emojis.weed)
        .then(() => {
          return message.react(emojis.four)
        })
        .then(() => {
          return message.react(emojis.two)
        })
        .then(() => {
          return message.react(emojis.zero)
        })
      }
    },
    {
      trigger: 'elska hars',
      reaction: message => {
        message.react(emojis.weed)
        .then(() => {
          return message.react(emojis.four)
        })
        .then(() => {
          return message.react(emojis.two)
        })
        .then(() => {
          return message.react(emojis.zero)
        })
      }
    },
    {
      trigger: 'smoke weed everyday',
      reaction: message => {
        message.react(emojis.weed)
        .then(() => {
          return message.react(emojis.four)
        })
        .then(() => {
          return message.react(emojis.two)
        })
        .then(() => {
          return message.react(emojis.zero)
        })
      }
    },
    {
      trigger: 'fitte penga hars',
      reaction: message => {
        message.react(emojis.weed)
        .then(() => {
          return message.react(emojis.four)
        })
        .then(() => {
          return message.react(emojis.two)
        })
        .then(() => {
          return message.react(emojis.zero)
        })
      }
    }
  ]
})

client.on('message', message => {
  console.log(`${message.author.username}: ${message.content}`)
  now = (new Date()).getTime()
  lastChannel = message.channel
  if (message.author.bot) return

  /**
   * Do reactions
   */
  if (reactions.filter(msg => message.content.toLowerCase().indexOf(msg.trigger) > -1).length > 0) {
    reactions.filter(msg => message.content.toLowerCase().indexOf(msg.trigger) > -1)
    .forEach(reaction => {
      reaction.reaction(message)
    })
  }

  /**
   * Respond to messages
   */
  msg.filter(msg => {
    return (
      msg.triggerType === MESSAGE &&
      msg.lastSentAt + msg.timeout <= now
    )
  }).some((msg, i) => {
    if (msg.trigger(message.content)) {
      msg.response(message)
      .then(reply => {
        if (disabled === 0 || disabled === 1) {
          if (disabled === 1) disabled = 2
          if (msg.responseType === REPLY) {
            reply = `${message.author} ${reply}`
          } else if (msg.responseType === REACT) {
            return new Promise(resolve => {
              resolve({}) // empty promises
            })
          }
          return message.channel.send(reply)
        }
        msg.lastSentAt = now
      })
      .catch(error => {
        console.log(error)
      })
      return true
    }
  })
})

client.setInterval(() => {
  if (!lastChannel) return
  msg.filter(msg => msg.triggerType === TIME).some((msg, i) => {
    if (msg.trigger()) {
      msg.response()
      .then(reply => {
        if (disabled === 0 || disabled === 1) {
          lastChannel.send(reply)
          .catch(error => {
            console.log(error)
          })
        }
        if (disabled === 1) disabled = 2
      })
    }
  })
}, INTERVAL)

client.login(process.env.TOKEN)

process.stdin.on('readable', () => {
  const chunk = process.stdin.read()
  if (chunk !== null) {
    if (lastChannel) {
      lastChannel.send(chunk.toString())
    }
  }
})
