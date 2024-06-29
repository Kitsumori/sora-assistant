import dotenv from 'dotenv'
dotenv.config({path: './src/.env'})

import Commands from './commands.js'
import { Client, GatewayIntentBits, EmbedBuilder, Colors } from 'discord.js'

const dt = process.env.DISCORD_TOKEN || "There is no key"

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = new Commands()

const money = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
})

client.on('ready', async () => {
    try {
        await commands.start()
    } catch (error) {
        console.error(error)
    }
    console.log(`Logged In!`)
})


client.on('interactionCreate', async interaction => {
    if( !interaction.isChatInputCommand()) return

    if(interaction.commandName === 'dolar_blue') {
        const blue = await commands.dollarBlue()
        const message = new EmbedBuilder({
            title: 'Precio del dolar blue',
            color: Colors.DarkGreen,
            description: `Compra: ${money.format(parseFloat(blue.buy))}\nVenta: ${money.format(parseFloat(blue.sell))}`
        })
        await interaction.reply({ embeds: [message]  })
    }
})

client.login(dt)