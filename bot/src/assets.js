import fetch from 'node-fetch'

export async function GetCurrencies() {
    const response = await fetch("https://api.bluelytics.com.ar/v2/latest")
    if(!response.ok) throw Error('Something went grong')
    
    return response.json()
}

export const Money = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
})