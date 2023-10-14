import requests

r = requests.get("https://api.bluelytics.com.ar/v2/latest")

if r.status_code == 200:
    print(r.json())

# Dollar check function


# Write the dollar info in a database redis

# Calculate the dollar price