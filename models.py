import json

class Currency:

    def __init__(self, name: str, buy: float, avg: float, sell: float):
        self._name = name
        self._buy = buy
        self._avg = avg
        self._sell = sell

    def __str__(self):
        return f"{self.name}: {self.avg}"
    
    def json(self):
        """
            Get the json date of the object
        """
        json_object = {
            "compra": self._buy,
            "promedio": self._avg,
            "venta": self._sell
        }
        return json.dumps(json_object)
    
    @property
    def name(self):
        return self._name
    @property
    def buy(self):
        return self._buy
    
    @property
    def avg(self):
        return self._avg
    
    @property
    def sell(self):
        return self._sell
    
    @buy.setter
    def buy(self, buy):
        if self._buy != buy:
            self._buy = buy

    @avg.setter
    def avg(self, avg):
        if self._avg != avg:
            self._avg = avg
    
    @sell.setter
    def sell(self, sell):
        if self._sell != sell:
            self._sell = sell


