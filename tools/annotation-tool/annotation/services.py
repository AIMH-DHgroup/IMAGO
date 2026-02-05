# define the function blocks
def I():
    return "I"

def II():
    return "II"

def III():
    return "III"

def IV():
    return "IV"

def V():
    return "V"

def VI():
    return "VI"

def VII():
    return "VII"

def VIII():
    return "VIII"

def IX():
    return "IX"

def X():
    return "X"

def XI():
    return "XI"

def XII():
    return "XII"

def XIII():
    return "XIII"

def XIV():
    return "XIV"

def XV():
    return "XV"

def XVI():
    return "XVI"

def XVII():
    return "XVII"

def XVIII():
    return "XVIII"

def XIX():
    return "XIX"

def XX():
    return "XX"

def XXI():
    return "XVI"
# map the inputs to the function blocks
romanNumbers = {0 : I,
           1 : II,
           2 : III,
           3 : IV,
           4 : V,
           5 : VI,
           6 : VII,
           7 : VIII,
           8 : IX,
           9 : X,
           10 : XI,
           11 : XII,
           12 : XIII,
           13 : XIV,
           14 : XV,
           15 : XVI,
           16 : XVII,
           17 : XVIII,
           18 : XIX,
           19 : XX,
           20 : XXI,
}
def checkPeriod(period_inizio, period_fine):
    if(period_inizio=="01" and period_fine=="00"):
        return ""
    elif (period_inizio=="01" and period_fine=="25"):
        return " inizio"
    elif (period_inizio=="01" and period_fine=="50"):
        return " prima metà"
    elif (period_inizio=="25" and period_fine=="75"):
        return " metà"
    elif (period_inizio=="51" and period_fine=="00"):
        return " seconda metà"
    elif (period_inizio=="75" and period_fine=="00"):
        return " fine"
    elif (period_inizio=="75" and period_fine=="25"):
        return 2
    else:
        return -1

def convertToSecolo(string, data_inizio, data_fine):
    # print(data_inizio + "-" + data_fine)
    if(len(data_inizio)==3):
        string += "sec. " +  romanNumbers[int(data_inizio[0])]()
        period_inizio = data_inizio[1:]
        if(len(data_fine)==3):
            period_fine = data_fine[1:]
        else:
            period_fine =  data_fine[2:]
        if(checkPeriod(period_inizio, period_fine) == 2):
            if(len(data_fine)==3):
                string += "-"+romanNumbers[int(data_fine[0])]()
            else:
                string += "-"+romanNumbers[int(data_fine[:2])]()
        elif(checkPeriod(period_inizio, period_fine) == -1):
            return "Inserito un intervallo non valido"
        else:
            string += checkPeriod(period_inizio, period_fine)
    else:
        string += "sec. " +  romanNumbers[int(data_inizio[:2])]()
        period_inizio = data_inizio[2:]
        period_fine =  data_fine[2:]
        if(checkPeriod(period_inizio, period_fine) == 2):
            string += "-"+romanNumbers[int(data_fine[:2])]()
        elif(checkPeriod(period_inizio, period_fine) == -1):
            return "Inserito un intervallo non valido"
        else:
            string += checkPeriod(period_inizio, period_fine)
    return string

def convertDatatoddMMYYY(data):
    if len(data)<=4:
        data = data
    elif len(data)>4 and len(data)<=7:
        arrayData = data.split("-")
        data = arrayData[1] + "-" + arrayData[0]
    else:
        arrayData = data.split("-")
        data = arrayData[2] + "-" + arrayData[1] + "-" + arrayData[0]
    
    return data

def toStringDatazioneOpera(datazione):
    string_datazione = ""
    incertezza = datazione["incertezza"]
    post = datazione["post"]
    ante = datazione["ante"]
    secolo = datazione["secolo"]
    data_inizio = datazione["dataInizio"]["data"]
    data_fine = datazione["dataFine"]["data"]
    if post:
            string_datazione += "post "
    if ante:
        string_datazione += "ante "
    if secolo:
        string_datazione = convertToSecolo(string_datazione, data_inizio, data_fine)
    else:
        if data_fine != "":
            string_datazione += data_inizio + "/" + data_fine 
        else:
            string_datazione += data_inizio
    if incertezza:
        string_datazione += " ca."
    
    return string_datazione

def toStringDatazione(datazione):
    string_datazione = ""
    if "floruit" in datazione:
        string_datazione += "fl. "
        incertezza = datazione["floruit"]["incertezza"]
        post = datazione["floruit"]["post"]
        ante = datazione["floruit"]["ante"]
        secolo = datazione["floruit"]["secolo"]
        data_inizio = datazione["floruit"]["dataInizio"]["data"]
        data_fine = datazione["floruit"]["dataFine"]["data"]
        if post:
            string_datazione += "post "
        if ante:
            string_datazione += "ante "
        if secolo:
            string_datazione = convertToSecolo(string_datazione, data_inizio, data_fine)
        else:
            if data_fine != "":
                string_datazione += data_inizio + "/" + data_fine
            else:
                string_datazione += data_inizio
        if incertezza:
            string_datazione += "ca."
    if "vescovo" in datazione:
        string_datazione += "v. "
        incertezza = datazione["vescovo"]["incertezza"]
        post = datazione["vescovo"]["post"]
        ante = datazione["vescovo"]["ante"]
        secolo = datazione["vescovo"]["secolo"]
        data_inizio = datazione["vescovo"]["dataInizio"]["data"]
        data_fine = datazione["vescovo"]["dataFine"]["data"]
        if post:
            string_datazione += "post "
        if ante:
            string_datazione += "ante "
        if secolo:
            string_datazione = convertToSecolo(string_datazione, data_inizio, data_fine)
        else:
            if data_fine != "":
                string_datazione += data_inizio + "/" + data_fine
            else:
                string_datazione += data_inizio
        if incertezza:
            string_datazione += " ca."
    
    if "vita" in datazione:
        nascita = datazione["vita"]["dataNascita"]
        dataNascitaInizio = nascita["dataInizio"]["data"]
        dataNascitaFine = nascita["dataFine"]["data"]
        if(dataNascitaInizio!="" or dataNascitaFine!=""):
            string_datazione += "n. "
            incertezza = nascita["incertezza"]
            post = nascita["post"]
            ante = nascita["ante"]
            secolo = nascita["secolo"]
            data_inizio = dataNascitaInizio
            data_fine = dataNascitaFine
            if post:
                string_datazione += "post "
            if ante:
                string_datazione += "ante "
            if secolo:
                string_datazione = convertToSecolo(string_datazione, data_inizio, data_fine)
            else:
                if data_fine != "":
                    string_datazione += convertDatatoddMMYYY(data_inizio) + "/" + convertDatatoddMMYYY(data_fine)
                else:
                    string_datazione += convertDatatoddMMYYY(data_inizio)
            if incertezza:
                string_datazione += " ca."

        morte = datazione["vita"]["dataMorte"]
        dataMorteInizio = morte["dataInizio"]["data"]
        dataMorteFine = morte["dataFine"]["data"]
        if(dataMorteInizio!="" or dataMorteFine!=""):
            if(dataNascitaInizio!="" or dataNascitaFine!=""):
                string_datazione += ", m. "
            elif "floruit" in datazione:
                string_datazione += ", m. "
            else:
                string_datazione += "m. "
            incertezza = morte["incertezza"]
            post = morte["post"]
            ante = morte["ante"]
            secolo = morte["secolo"]
            data_inizio = dataMorteInizio
            data_fine = dataMorteFine
            if post:
                string_datazione += "post "
            if ante:
                string_datazione += "ante "
            if secolo:
                string_datazione = convertToSecolo(string_datazione, data_inizio, data_fine)
            else:
                if data_fine != "":
                    string_datazione += convertDatatoddMMYYY(data_inizio) + "/" + convertDatatoddMMYYY(data_fine)
                else:
                    string_datazione += convertDatatoddMMYYY(data_inizio)
            if incertezza:
                string_datazione += " ca."
    return string_datazione

