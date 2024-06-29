import { REST, Routes } from 'discord.js'
import fetch from 'node-fetch'

export default class Commands {

    constructor() {
        const CommandList = [
            {
                name: 'dolar_blue',
                description: 'Devuelve el valor del dolar blue en este momento'
            },
            {
                name: 'dolares_blue_a_pesos',
                description: 'Toma el monto de dolares y devuelve el valor de los mismos en pesos tomando el valor del dolar blue en ese momento'
            },
            {
                name: 'pesos_a_dolar_blue',
                description: 'Toma el monto en pesos y lo devuelve en dolares, tomando el valor del dolar blue del momento'
            },
            {
                name: 'dolares_oficial_a_pesos',
                description: 'Toma el monto de dolares y devuelve el valor de los mismos en pesos tomando el valor del dolar oficial en ese momento'
            },
            {
                name: 'pesos_a_dolar_oficial',
                description: 'Toma el monto en pesos y lo devuelve en dolares, tomando el valor del dolar oficial del momento'
            },
        ]
        if (process.env.DISCORD_TOKEN != undefined) this.token = process.env.DISCORD_TOKEN
        else throw Error('DISCORD_TOKEN undefined')
        if (process.env.APPLICATION_ID != undefined) this.appId = process.env.APPLICATION_ID
        else throw Error('APPLICATION_ID undefined')
        this.rest = new REST({ version: '10' }).setToken(this.token)
        
    }

    async start() {
        try {
            await this.rest?.put(Routes.applicationCommands(this.appId), { body: this.CommandList })
        } catch (error) {
            console.error(error)
        }
    }

    async dollarBlue() {
        const response = await fetch("https://api.bluelytics.com.ar/v2/latest")
        if(!response.ok) throw Error('Something went grong')

        const data = await response.json()

        return { "sell":data['blue'].value_sell, "buy":data['blue'].value_buy }
    }

    async dollarBlueToPesos() {

    }

    async pesosToDollarBlue() {

    }

    async dollarOficialToPesos() {

    }

    async PesosToDollarOficial() {

    }
}