import model
import mongoengine
import os

filename = "stationCode.txt"
mongoengine.connect('typhoon', host="127.0.0.1:27017")
st = model.StationTideData

res = st.objects.distinct('stationname')

stlist = list(res)

stlist.sort()

f = open(filename, 'w')
for s in stlist:
    f.write(s+',\n')


f.close()
