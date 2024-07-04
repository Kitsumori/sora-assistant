import dotenv from 'dotenv'
dotenv.config({path: './src/.env'})

import Commands from './commands.js'
import { Client, GatewayIntentBits, EmbedBuilder, Colors } from 'discord.js'

const dt = process.env.DISCORD_TOKEN || "There is no key"

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = new Commands()

client.on('ready', async () => {
    try {
        await commands.start()
    } catch (error) {
        console.error(error)
    }
    console.log(`Logged In!`)
})

// Commands
client.on('interactionCreate', async interaction => {
    if( !interaction.isChatInputCommand()) return

    // Return to the chat the dollar blue quote
    if(interaction.commandName === 'dolar_blue') {
        const blue = await commands.dollarBlue()
        const message = new EmbedBuilder({
            title: 'Precio del dolar blue',
            color: Colors.DarkGreen,
            description: `Compra: ${blue.buy}\nVenta: ${blue.sell}`
        })
        await interaction.reply({ embeds: [message]  })
    }
    // Return a message with the number
    if(interaction.commandName === 'dolares_blue_a_pesos') {
        const pesos = await commands.dollarBlueToPesos(interaction.options.get('dolares').value)
        const message = new EmbedBuilder({
            title: 'Pesos segun el precio del dolar blue',
            color: Colors.DarkGreen,
            description: pesos
        })
        await interaction.reply({ embeds: [message]  })
    }

    if(interaction.commandName === 'pesos_a_dolares_blue') {
        const dollars = await commands.pesosToDollarBlue(interaction.options.get('pesos').value)
        const message = new EmbedBuilder({
            title: 'Dolares a los que equivalen los pesos recibidos',
            color: Colors.DarkGreen,
            description: dollars
        })
        await interaction.reply({ embeds: [message]  })
    }

    if(interaction.commandName === 'dolares_oficial_a_pesos') {
        const dollars = await commands.dollarOficialToPesos(interaction.options.get('dolares').value)
        const message = new EmbedBuilder({
            title: 'Pesos segun el dolar oficial',
            color: Colors.DarkGreen,
            description: dollars
        })
        await interaction.reply({ embeds: [message]  })
    }

    if(interaction.commandName === 'pesos_a_dolar_oficial') {
        const pesos = await commands.pesosToDollarOficial(interaction.options.get('pesos').value)
        const message = new EmbedBuilder({
            title: 'Dolares oficiales segun los pesos',
            color: Colors.DarkGreen,
            description: pesos
        })
        await interaction.reply({ embeds: [message]  })
    }
})

// Messages with time

client.login(dt)