import dotenv from 'dotenv'
dotenv.config({path: './src/.env'})

import Commands from './commands.js'
import { Client, GatewayIntentBits, EmbedBuilder, Colors } from 'discord.js'
import { CronJob } from 'cron'
import { GetCurrencies, Money } from './assets.js'

const dt = process.env.DISCORD_TOKEN || "There is no key"
const generalChannelId = process.env.GENERAL_CHANNEL

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = new Commands()

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

// Schedule message
async function MarketClose() {
    const currencies = await GetCurrencies()
    const values = `Dolar oficial\n- Compra: ${Money.format(currencies.oficial.value_buy)}\n- Venta: ${Money.format(currencies.oficial.value_buy)}\n\nDolar blue\n- Compra: ${Money.format(currencies.blue.value_buy)}\n- Venta: ${Money.format(currencies.blue.value_buy)}`
    const message = new EmbedBuilder({
        title: "Cierre del mercado",
        color: Colors.DarkPurple,
        description: values
    })
    const generalChannel = await client.channels.fetch(generalChannelId)
    generalChannel.send({ embeds: [message]})
}

const MarketCloseMessage = new CronJob(
    '0 0 18 * * 1-5', // Cron time "Second Minute Hour 'Day of the Month' Month 'Day of week'"
    MarketClose, // Function to run
    null, // On complete
    true, // Start
    'America/Argentina/Buenos_Aires' // Time zone

)

client.on('ready', async () => {
    try {
        await commands.start()
        const generalChannel = await client.channels.fetch(generalChannelId)
        generalChannel.send({content: "Estoy conectado si me necesitan"})
    } catch (error) {
        console.error(error)
    }
    console.log(`Logged In!`)
})

client.login(dt)