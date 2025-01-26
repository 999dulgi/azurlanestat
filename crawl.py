import requests
import json
from bs4 import BeautifulSoup

def campswitch(key, ship: BeautifulSoup):
    if key == "Iron Blood" or key == "Dragon Empery":
        return ship.select_one('.card-headline > span:nth-child(1)').text.split()[0]
    camp = {"Eagle Union" : "USS", "Royal Navy": "HMS", "Sakura Empire" : "IJN", "Northern Parliament" : "SN", "Iris Libre" : "FFNF", "Vichya Dominion" : "MNF", "Sardegna Empire" : "RN", "Tempesta" : "MOT", "META" : "META"}.get(key, "None")
    return camp

def shipstat(ship: BeautifulSoup):
    shipstatclass1 = []
    shipstatclass2 = []
    shipstattype1 = ''
    shipstattype2 = ''
    shipstat1 = 0
    shipstat2 = 0
    if ship.select_one('.ship-research > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1)'):
        return { "classType1" : "None", "statType1" : "None", "stat1" : "None", "classType2" : "None", "statType2" : "None", "stat2" : "None" }

    shipstattype1 = ship.select_one('.ship-fleettech > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > .mw-default-size > span > img')['alt']
    shipstat1 = ship.select_one('.ship-fleettech > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2)').text[-1]
    bsshipstatclass1 = ship.select('.ship-fleettech > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2)>span')
    for shiptype in bsshipstatclass1:
        try:
            shipstatclass1.append(shiptype.select_one('a')['title'])
        except:
            continue

    shipstattype2 = ship.select_one('.ship-fleettech > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(2) > .mw-default-size > span > img')['alt']
    shipstat2 = ship.select_one('.ship-fleettech > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(2)').text[-1]
    bsshipstatclass2 = ship.select('.ship-fleettech > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(2)>span')
    for shiptype in bsshipstatclass2:
        try:
            shipstatclass2.append(shiptype.select_one('a')['title'])
        except:
            continue
    
    shipreturn = { "classType1" : shipstatclass1, "statType1" : shipstattype1, "stat1" : shipstat1, "classType2" : shipstatclass2, "statType2" : shipstattype2, "stat2" : shipstat2 }
    
    return shipreturn

wiki = 'https://azurlane.koumakan.jp'

r = requests.get('https://azurlane.koumakan.jp/wiki/List_of_Ships_by_Class')

soup = BeautifulSoup(r.text, 'html.parser')
shiptable = BeautifulSoup(str(soup.select('.wikitable')), 'html.parser')
shiptrs = shiptable.select('tr')

shipadrrlist = []
for shiptr in shiptrs:
    if not shiptr.select('td'):
        continue
    shiptd = BeautifulSoup(str(shiptr.select('td')), 'html.parser')
    ships = shiptd.select('.alicon')

    for ship in ships:
        shipadrrlist.append(ship.a['href'])

file_path = './src/stats/stats.json'

f = open(file_path, 'a')

for shipaddr in shipadrrlist:
    print(shipaddr)
    shiprequest = wiki + shipaddr
    r = requests.get(shiprequest)

    ship = BeautifulSoup(r.text, 'html.parser')
    shipname = ship.select_one('title').text
    shipimage = '/images/ship/' + shipname.replace(' ', '_') + '.png'
    shipclass = ship.select_one('.card-info-tbl > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(2) > a:nth-child(2)').text
    shipcamp = campswitch(ship.select_one('.card-info-tbl > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(2) > a:nth-child(1)').text, ship)
    shipstats = shipstat(ship)
    techpoint = []
    if ship.select_one('.ship-research > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1)'):
        techpoint = ["0", "0", "0"]
    else:
        techpoint.append(ship.select_one('.ship-fleettech > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(3)').text.split(' ')[-1])
        techpoint.append(ship.select_one('.ship-fleettech > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(3)').text.split(' ')[-1])
        techpoint.append(ship.select_one('.ship-fleettech > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(3)').text.split(' ')[-1])

    shipinfo = {"name" : shipname, "korean_name" : "", "imgsrc" : shipimage, "rarity": "", "class" : shipclass, "camp" : shipcamp, "shipstats" : shipstats, "techpoint" : techpoint, "howtoget" : ""}

    json.dump(shipinfo, f)
    f.write(', ')

f.close()