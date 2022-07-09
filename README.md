# Crypt
This is the official repo reprsenting the official website for the official discord server. A lot of 'officiality'.
Would love to grow this thing into a fully functioning passive income for all users. If this gets enough support I'm opening the bot for public Pull Requests and more.
In the mean time you can check the [server](https://discord.com/invite/3bZDVq84cP) for real time working version of the bot.


# Code:

## Imports
```python
from binance.client import Client
from binance.enums import *
import json, urllib.parse, sys, os
from http.server import BaseHTTPRequestHandler, HTTPServer
from subprocess import call
import subprocess
import time
import discord
import sys
import asyncio
import aiohttp
from asyncio import sleep
from discord.utils import get
from discord.ext import commands, tasks
from datetime import timedelta, date
import re
import os
import datetime
import calendar
import requests
import pytz
from pytz import timezone
import pandas as pd
import ta
from ta import add_all_ta_features
from ta.utils import dropna
from ta.momentum import RSIIndicator
from ta.volatility import BollingerBands
from ta.trend import EMAIndicator
from ta.volume import ChaikinMoneyFlowIndicator
import plotly.graph_objs as go
from plotly.subplots import make_subplots
import plotly.offline as py
```
## Binance
```python
api_key = ''
api_secret = ''
client_crypto = Client(api_key, api_secret)
official_guild_id = 0
official_channel_id = 0
```
## Discord
```python
intents = discord.Intents.default()
intents.members = True

client = discord.Client()
bot = commands.Bot(command_prefix=('cr!'), intents=intents)

bot_token = ''
```
## REPEATING FUNCTIONS
```python
async def send_em(embed):
    channel = bot.get_channel(official_channel_id)
    await channel.send(embed=embed)

def get_desired_string(start, end, string):
    s = string
    entry_range = (s.split(start))[1].split(end)[0].lstrip()
    return entry_range

def get_coin_price(symbol):
    info = client_crypto.get_avg_price(symbol=symbol)
    price = float(info['price'])
    return price


def get_date():
    timezone = pytz.timezone("Europe/Sofia")
    now = datetime.datetime.now(tz=timezone)
    day = now.strftime("%A")
    day_strict = now.strftime('%Y-%m-%d %H:%M')
    #print(day_strict)

    now = datetime.datetime.now(tz=timezone).time()
    time = now.strftime("%I:%M %p")

    global timeofcommand, fancy, strict
    timeofcommand = day+ ' at ' + time 
    fancy = f"It is {day}, exactly {time}.\n\nHave an amazing day sir!"
    strict = day_strict

def check_last_play(coin):
    passing = False
    with open("logs.txt") as f:
        contents = f.readlines()
    last_play_record = contents[-1]
    if "status" in last_play_record.lower():
        last_play_record = contents[-2]
    coin_entry = last_play_record.split("Symbol: ")[1].split(" --- Entry:")[0]
    date = last_play_record.split("Time: ")[1]
    date = date.split("\n")[0]
    date = datetime.datetime.strptime(date, '%Y-%m-%d %H:%M')
    get_date()
    date_now = datetime.datetime.strptime(strict, '%Y-%m-%d %H:%M')

    difference = date_now - date
    if coin == coin_entry:
        if difference > datetime.timedelta(minutes = 10):
            passing = True
        else:
            passing = False
    else:
        passing = True
    # print(difference)
    # print(passing)
    return passing

def listToString(s): 
    
    # initialize an empty string
    str1 = "" 
    
    # traverse in the string  
    for ele in s: 
        str1 += ele  
    
    # return string  
    return str1 

def convert_int(x):
    if isinstance(x, list):
        return list(map(convert_int, x))
    else:
        return int(float(x))

def get_change_in_list(listche):
    current = listche[1]
    previous = listche[0]
    if current == previous:
        return 100.0
    try:
        return (abs(current - previous) / previous) * 100.0
    except ZeroDivisionError:
        return 0

def split_to_pairs(listche):
    n = 0
    even_numbers = []
    odd_numbers = []
    
    for number in listche:
        if (n % 2) == 0:
            even_numbers.append(number)
        else:
            odd_numbers.append(number)
        n += 1
        
    ready_list = []
    
    for even, odd in zip(even_numbers, odd_numbers):
        even = int(float(even))
        odd = int(float(odd))
        mid_ready = [even, odd]
        ready_list.append(mid_ready)
        
    return ready_list

def get_max_min_change(listche, option='max'):
    all_changes = []
    for change in listche:
       all_changes.append( get_change_in_list(change) )
    if option == 'max':
        value = max(all_changes)
    else:
        value = min(all_changes)

    return value
        

def get_coin_data(symbol,interval, option = 'n'):
    candles = client_crypto.get_historical_klines(symbol, interval, "1 day ago UTC")
    if option == 'n':
        return candles
    else:
        candles = client_crypto.get_historical_klines(symbol, interval, "1 day ago UTC")
        candles = pd.DataFrame(candles)
        # print(candles)
        return candles

def get_trading_view_link(symbol):
    link = f"https://www.tradingview.com/chart/?symbol=BINANCE%3A{symbol}"
    return link
```
## Strategies
```python
def rsi(coin, data, periods = 14):
    # data = get_coin_data(coin,'1m','d')
    price = get_coin_price(coin)
    rsi_print = RSIIndicator(pd.to_numeric(data[close_num]),periods).rsi()
    rsi_print = rsi_print.dropna()
    dates = []
    for epoch in data[date_num]:
        read_date = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(int(epoch/1000)))
        dates.append(read_date)
    dates = pd.Series(dates)
    fig = go.Figure([go.Scatter(x=dates, y=rsi_print)])
    return rsi_print.iloc[-1]

def bb(coin, data):
    price = get_coin_price(coin)
    bb_print = BollingerBands(pd.to_numeric(data[close_num]))
    high_bb = bb_print.bollinger_hband()
    low_bb = bb_print.bollinger_lband()
    high_bb = high_bb.dropna()
    low_bb = low_bb.dropna()
    dates = []
    for epoch in data[date_num]:
        read_date = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(int(epoch/1000)))
        dates.append(read_date)
    dates = pd.Series(dates)

    low_bb = low_bb.iloc[-1]
    high_bb = high_bb.iloc[-1]

    latest_rsi = rsi(coin,data)

    if price > low_bb and price < high_bb:
        bb_value = "normal"
    elif price >= high_bb: # you should SELL
        bb_value = "sell"
    elif price <= low_bb: # you should BUY
        bb_value = "buy"

    
    if latest_rsi <= 30 and bb_value == "buy":
        return "buy"
    elif latest_rsi >= 70 and bb_value == "sell":
        return "sell"
    else:
        return "neutral"

def ema(coin, data):
    price = get_coin_price(coin)
    ema_print_40 = EMAIndicator(pd.to_numeric(data[close_num]),40).ema_indicator().dropna()
    latest_40 = ema_print_40.iloc[-1]

    latest_rsi = rsi(coin,data)

    # BUY WHEN: 40-period gets through price and RSI is above 50
    
    if latest_40 == price and latest_rsi >= 55 :
        return "buy"

    # SELL WHEN: 40-period gets through price and RSI is below 50

    elif latest_40 == price and latest_rsi <= 45 :
        return "sell"
    
    else:
        return "neutral"

def get_visual_chart(coin, data):
    dates = []
    for epoch in data[date_num]:
        read_date = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(int(epoch/1000)))
        dates.append(read_date)
    dates = pd.Series(dates)
    rsi_print = RSIIndicator(pd.to_numeric(data[close_num]),14).rsi()
    ema_print_40 = EMAIndicator(pd.to_numeric(data[close_num]),40).ema_indicator()
    bb_printH = BollingerBands(pd.to_numeric(data[close_num])).bollinger_hband()
    bb_printL = BollingerBands(pd.to_numeric(data[close_num])).bollinger_lband()

    crypto_chart = [
        go.Scatter(
            line_color = 'blue',
            x=bb_printH.index,
            y=bb_printH,
            # fill = 'tonext',
            # fillpattern={"fgopacity" :0.2},
            name='Bollinger High'),
        go.Scatter(
            line_color = 'blue',
            x=bb_printL.index,
            y=bb_printL,
            fill = 'tonexty',
            name='Bollinger Low'),
        go.Candlestick(
            x=data.index,
            open=data[open_num],
            high=data[high_num],
            low=data[low_num],
            close=data[close_num], name="Price"),
        go.Scatter(
            line_color = 'yellow',
            x=ema_print_40.index,
            y=ema_print_40,
            name='EMA 40'),
        ]

    layout = go.Layout(title=f'{coin} Alert',
                   xaxis={'rangeslider':{'visible':False}})

    fig = go.Figure(data=crypto_chart,layout=layout)
    path = f"charts/{coin}.png"
    fig.write_image(path)

    return path
```
