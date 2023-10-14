import os

import discord
from discord.ext import commands
from discord import app_commands
from dotenv import read_dotenv

read_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')
bot = commands.Bot(command_prefix=">", intents=discord.Intents.all())

@bot.event
async def on_ready():
    print("Bot is up and ready")
    try:
        synchronized = await bot.tree.sync()
        print(f"Synchronized: {len(synchronized)} command(s)")
    except Exception as e:
        print(e)

@bot.tree.command(name="dolar_hoy")
async def dollar_today(interaction: discord.Integration):
    dollar_today = "Dolar blue: 1010\nDolar oficial: 395"
    await interaction.response.send_message(f"{dollar_today}", ephemeral=True)

@bot.tree.command(name="dolares_a_pesos")
@app_commands.describe(dolares = "Por cuantos dolares se debe multiplicar el dolar de mercado (blue)")
async def dollar_to_pesos(interaction: discord.Interaction, dolares: int):
    pesos = dolares * 1010
    await interaction.response.send_message(f"Son {pesos} pesos", ephemeral=True)

bot.run(TOKEN)
