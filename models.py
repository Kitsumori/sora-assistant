import json

class Currency:

    def __init__(self, name: str):
        self._name = name
        self._buy: float
        self._sell: float

    def __str__(self):
        return f"Compra: {self.buy}\n Venta: {self.sell}"
    
    def json(self):
        """
            Get the json date of the object
        """
        json_object = {
            "compra": self._buy,
            "venta": self._sell
        }
        return json.dumps(json_object)
    
    def update(self, object: dict) -> None:
        self._buy = object["value_buy"]
        self._sell = object["value_sell"]

    @property
    def name(self):
        return self._name
    @property
    def buy(self):
        return self._buy
    @property 
    def sell(self):
        return self._sell
