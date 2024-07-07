# Sora assitant

This assistant is for markets, family calendar, games

## Install

Create and config .env file in src directory with the variables

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