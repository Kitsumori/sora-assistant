FROM python:3.11.6-bullseye

RUN apt-get update \
&& apt-get install -y tzdata \
&& ln -fs /usr/share/zoneinfo/America/Argentina/Buenos_Aires /etc/localtime \
&& dpkg-reconfigure --frontend noninteractive tzdata

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY app .
CMD ["python", "./main.py"]