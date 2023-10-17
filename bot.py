import os
import time
import requests
from models import Currency

# DISCORD
import discord
from discord.ext import commands, tasks
from discord import app_commands
from dotenv import read_dotenv

# QUOTES
DOLLAR_BLUE = Currency("Dolar blue", 0, 0, 0)
DOLLAR = Currency("Dolar oficial", 0, 0, 0)
EURO = Currency("Euro oficial", 0, 0, 0)
EURO_BLUE = Currency("Euro blue", 0, 0, 0)

read_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')
bot = commands.Bot(command_prefix=">", intents=discord.Intents.all())

@bot.event
async def on_ready():
    print("Sora assistant is up and ready")
    try:
        synchronized = await bot.tree.sync()
        print(f"Synchronized: {len(synchronized)} command(s)")
    except Exception as e:
        print(e)

@bot.tree.command(name="dolar_blue")
async def dollar_blue(interaction: discord.Integration):
    await interaction.response.send_message(f"{DOLLAR_BLUE.__str__()}", ephemeral=True)

@bot.tree.command(name="dolares_blue_a_pesos")
@app_commands.describe(dolares = "Por cuantos dolares se debe multiplicar el dolar de mercado (blue)")
async def dollar_blue_to_pesos(interaction: discord.Interaction, dolares: float):
    pesos = dolares * DOLLAR_BLUE.avg
    await interaction.response.send_message(f"Son {pesos} pesos", ephemeral=True)

@tasks.loop(minutes=30)
async def quotes_update():
    ct = time.localtime()
    current_time = time.strftime("%H", ct)
    if current_time == "10":
        get_quotes()
        general_channel = bot.get_channel(1161842553352630316)
        message = f"Comienzo de mercado los valores del dolar blue son los siguientes:\n{DOLLAR_BLUE.json()}"
        await general_channel.send(message)
    if current_time == "15":
        get_quotes()
        general_channel = bot.get_channel(1161842553352630316)
        message = f"Comienzo de mercado los valores del dolar blue son los siguientes:\n{DOLLAR_BLUE.json()}"
        await general_channel.send(message)



def get_quotes():
    q = requests.get("https://api.bluelytics.com.ar/v2/latest")
    if q.status_code == 200:
        quotes = q.json()
        DOLLAR_BLUE.avg = quotes["blue"]["value_avg"]
        DOLLAR_BLUE.buy = quotes["blue"]["value_buy"]
        DOLLAR_BLUE.sell = quotes["blue"]["value_sell"]
        DOLLAR.avg = quotes["oficial"]["value_avg"]
        DOLLAR.buy = quotes["oficial"]["value_buy"]
        DOLLAR.sell = quotes["oficial"]["value_sell"]
        EURO.avg = quotes["oficial_euro"]["value_avg"]
        EURO.buy = quotes["oficial_euro"]["value_buy"]
        EURO.sell = quotes["oficial_euro"]["value_sell"]
        EURO_BLUE.avg = quotes["blue_euro"]["value_avg"]
        EURO_BLUE.buy = quotes["blue_euro"]["value_buy"]
        EURO_BLUE.sell = quotes["blue_euro"]["value_sell"]

if __name__ == "__main__":
    get_quotes()
    bot.run(TOKEN)
