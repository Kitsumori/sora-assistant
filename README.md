# Sora assitant

This assistant is for markets, family calendar, games

## TODO list

[ ] Logger

[ ] Add crypto currencies

[ ] Add calendar conection if it is posible

[ ] Add welcome for new members

## Install

Create and config .env file with the variables

- DISCORD_TOKEN
- GUILD
- TESTING_CHANNEL
- GENERAL_CHANNEL

Execute the build 

```bash
sudo docker build -t sora-assistant:1.0 .
```

Execute the run

```bash
sudo docker run -d --name sora-assistant sora-assistant:1.0
```