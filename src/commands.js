import { ApplicationCommandOptionType, Options, REST, Routes } from 'discord.js'
import fetch from 'node-fetch'

async function getCurrencies() {
    const response = await fetch("https://api.bluelytics.com.ar/v2/latest")
    if(!response.ok) throw Error('Something went grong')
    
    return response.json()
}

const money = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
})

const CommandList = [
    {
        name: 'dolar_blue',
        description: 'Devuelve el valor del dolar blue'
    },
    {
        name: 'dolares_blue_a_pesos',
        description: 'Toma el monto de dolares y devuelve el valor en pesos tomando el valor del dolar blue',
        options: [
            {
                name: "dolares",
                description: "Monto de dolares",
                type: ApplicationCommandOptionType.Number,
                require: true
            }
        ]
    },
    {
        name: 'pesos_a_dolares_blue',
        description: 'Toma el monto en pesos y lo devuelve en dolares blue',
        options: [
            {
                name: "pesos",
                description: "Monto de pesos",
                type: ApplicationCommandOptionType.Number,
                require: true
            }
        ]
    },
    {
        name: 'dolares_oficial_a_pesos',
        description: 'Toma el monto de dolares y devuelve el valor en pesos segun el dolar oficial',
        options: [
            {
                name: "dolares",
                description: "Monto de dolares",
                type: ApplicationCommandOptionType.Number,
                require: true
            }
        ]
    },
    {
        name: 'pesos_a_dolar_oficial',
        description: 'Toma el monto en pesos y lo devuelve en dolares, tomando el valor del dolar oficial del momento',
        options: [
            {
                name: "pesos",
                description: "Monto en pesos",
                type: ApplicationCommandOptionType.Number,
                require: true
            }
        ]
    }
]

export default class Commands {

    constructor() {
        if (process.env.DISCORD_TOKEN != undefined) this.token = process.env.DISCORD_TOKEN
        else throw Error('DISCORD_TOKEN undefined')
        if (process.env.APPLICATION_ID != undefined) this.appId = process.env.APPLICATION_ID
        else throw Error('APPLICATION_ID undefined')
        this.rest = new REST({ version: '10' }).setToken(this.token)
        
    }

    async start() {
        try {
            await this.rest.put(Routes.applicationCommands(this.appId), { body: CommandList })
        } catch (error) {
            console.error(error)
        }
    }

    /**
     * 
     * @returns {Object} - { sell: Float number, buy: Float number}
     */
    async dollarBlue() {

        const data = await getCurrencies()

        return { 
            "sell": money.format(parseFloat(data['blue'].value_sell)), 
            "buy": money.format(parseFloat(data['blue'].value_buy)) 
        }
    }

    /**
     * 
     * @param {Number} dollars 
     * @returns {Intl.NumberFormat}
     */
    async dollarBlueToPesos(dollars) {
        const data = await getCurrencies()
        const dollarBlue = parseFloat(data['blue'].value_buy)
        const result = dollars * dollarBlue
        return money.format(result)
    }


    /**
     * 
     * @param {Number} pesos 
     * @returns {Intl.NumberFormat}
     */
    async pesosToDollarBlue(pesos) {
        const data = await getCurrencies()
        const dollarBlue = parseFloat(data['blue'].value_buy)
        const result = pesos / dollarBlue
        return money.format(result)
    }

    /**
     * 
     * @param {Number} dollars 
     * @returns {Intl.NumberFormat}
     */
    async dollarOficialToPesos(dollars) {
        const data = await getCurrencies()
        const dollar = parseFloat(data['oficial'].value_buy)
        const result = dollars * dollar
        return money.format(result)
    }

    /**
     * 
     * @param {Number} pesos 
     * @returns {Intl.NumberFormat}
     */
    async pesosToDollarOficial(pesos) {
        const data = await getCurrencies()
        const dollar = parseFloat(data['oficial'].value_buy)
        const result = pesos / dollar
        return money.format(result)
    }
}