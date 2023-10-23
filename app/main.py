from discord.ext import tasks, commands
from discord import app_commands
from models import Currency
from dotenv import read_dotenv
from datetime import datetime
from pytz import timezone

import discord
import os
import aiohttp
import requests

def get_datetime() -> str:
    n = datetime.now(timezone('America/Argentina/Buenos_Aires'))
    return n.strftime('%Y-%m-%dT%H:%M:%S.%f%:z')

def check_dates(internal_time: str, external_time: str) -> bool:
    time_format = "%Y-%m-%dT%H:%M:%S.%f%z"
    internal = datetime.strptime(internal_time, time_format)
    external = datetime.strptime(external_time, time_format)
    if internal < external:
        return True
    else:
        return False

# Quotes
DOLLAR_BLUE = Currency("Dolar blue")
DOLLAR = Currency("Dolar oficial")
EURO = Currency("Euro oficial")
EURO_BLUE = Currency("Euro blue")

def set_currency() -> str:
    response = requests.get("https://api.bluelytics.com.ar/v2/latest")
    res = response.json()
    DOLLAR.update(res["oficial"])
    DOLLAR_BLUE.update(res["blue"])
    EURO.update(res["oficial_euro"])
    EURO_BLUE.update(res["blue_euro"])
    return res["last_update"]

# Server
read_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')
GUILD = discord.Object(id=int(os.getenv('GUILD')))
TESTING_CHANNEL = int(os.getenv('TESTING_CHANNEL'))
GENERAL_CHANNEL = int(os.getenv('GENERAL_CHANNEL'))

class Sora(discord.Client):

    def __init__(self, last_update: str, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.tree = app_commands.CommandTree(self)
        self._last_update =  last_update
        self.market_opening = True
        self.market_closing = False

    async def setup_hook(self) -> None:
        # start the task to run in the background
        self.bluelytics.start()
        self.market.start()
        self.tree.copy_global_to(guild=GUILD)
        await self.tree.sync(guild=GUILD)

    async def on_ready(self):
        print(f'Logged in as {self.user} (ID: {self.user.id})')
        print('------')

    @tasks.loop(minutes=30.0)  # task runs every 60 seconds
    async def bluelytics(self):
        async with aiohttp.ClientSession() as session:
            async with session.get("https://api.bluelytics.com.ar/v2/latest") as res:
                data = await res.json()
                if check_dates(self._last_update, data["last_update"]):
                    DOLLAR.update(data["oficial"])
                    DOLLAR_BLUE.update(data["blue"])
                    EURO.update(data["oficial_euro"])
                    EURO_BLUE.update(data["blue_euro"])
                    self._last_update = data["last_update"]
    
    @tasks.loop(minutes=15.0)
    async def market(self):
        channel = self.get_channel(GENERAL_CHANNEL)
        t = datetime.now()
        if t.hour == 10 and self.market_opening == True:
            await self.bluelytics()
            message = f"""Holis!!!! arrancamos el mercado con el dolar blue en los valores:
            {DOLLAR_BLUE.__str__()}"""
            self.market_opening = False
            self.market_closing = True
            await channel.send(message)

        if t.hour == 15 and self.market_closing == True:
            await self.bluelytics()
            message = f"""Holis!!!! finaliza el mercado con el dolar blue en los valores:\n{DOLLAR_BLUE.__str__()}"""
            self.market_opening = True
            self.market_closing = False
            await channel.send(message)



    @bluelytics.before_loop
    async def before_bluelytics(self):
        await self.wait_until_ready()  # wait until the bot logs in
    
    @market.before_loop
    async def before_market(self):
        await self.wait_until_ready()


def main():
    
    client = Sora(last_update=set_currency(), intents=discord.Intents.default())
    @client.tree.command(name="dolar_blue")
    async def dollar_blue(interaction: discord.Integration):
        await interaction.response.send_message(f"{DOLLAR_BLUE.__str__()}", ephemeral=True)

    @client.tree.command(name="dolares_blue_a_pesos")
    @app_commands.describe(dolares = "Por cuantos dolares se debe multiplicar el dolar de mercado (blue)")
    async def dollar_blue_to_pesos(interaction: discord.Interaction, dolares: float):
        pesos = dolares * DOLLAR_BLUE.sell
        await interaction.response.send_message(f"Son {pesos} pesos", ephemeral=True)
    
    client.run(TOKEN)

if __name__ == "__main__":
    main()