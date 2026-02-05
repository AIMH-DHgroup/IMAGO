import json
newData = {}
data = json.load(open("provaPrimoGlam_4.json"))
#print(len(data))
for key in data.keys():
    value = data.get(key, None)
    if (value['coord'] or value['country'] or value['gpe']):
        newData[key]=value
#print(len(newData))
with open("provaPrimoGlamIRIs_4.json", "w") as outfile:
    json.dump(newData, outfile)
        




