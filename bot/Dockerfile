FROM node:latest

RUN apt-get update \
&& apt-get install -y tzdata \
&& ln -fs /usr/share/zoneinfo/America/Argentina/Buenos_Aires /etc/localtime \
&& dpkg-reconfigure --frontend noninteractive tzdata

WORKDIR /app

COPY bot .

RUN npm install

CMD ["npm", "run", "prod"]