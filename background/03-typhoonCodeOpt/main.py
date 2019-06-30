import model
import mongoengine
import os

filename = "typhoonNumCode.txt"
mongoengine.connect('typhoon', host="127.0.0.1:27017")
gt = model.GeoTyphoonRealData


res = gt.objects.aggregate(
    {"$group": {"_id": "$num", "codes": {"$push": "$code"}}},
    {"$sort": {"_id": 1}}
)

lst = list(res)
diclist = []
for item in lst:
    numcode = {}
    for code in item['codes']:
        if code not in numcode.values():
            numcode[item['_id']] = code
    diclist.append(numcode)

if os.path.exists(filename):
    os.remove(filename)

f = open(filename, 'w')
for item in diclist:
    for k in item.keys():
        f.write(k+','+item[k]+',\n')

f.close()
