# CURING CALCULATIONS
def getCuringTime(self, resistanceEvolution, envConditions, concrete_temperature):
    if resistanceEvolution == "fast" and envConditions == "good" and concrete_temperature >= 10:
        return 1
    elif (resistanceEvolution == "fast" and envConditions == "good" and concrete_temperature < 10) or (resistanceEvolution == "fast" and envConditions == "normal" and concrete_temperature >= 10) or (resistanceEvolution == "average" and envConditions == "good" and concrete_temperature >= 10):
        return 2
    elif (resistanceEvolution == "fast" and envConditions == "bad" and concrete_temperature >= 10) or (resistanceEvolution == "average" and envConditions == "normal" and concrete_temperature >= 10) or (resistanceEvolution == "slow" and envConditions == "good" and concrete_temperature >= 10):
        return 3
    elif (resistanceEvolution == "fast" and envConditions == "normal" and concrete_temperature < 10) or (resistanceEvolution == "average" and envConditions == "good" and concrete_temperature < 10) or (resistanceEvolution == "average" and envConditions == "bad" and concrete_temperature >= 10) or (resistanceEvolution == "slow" and envConditions == "normal" and concrete_temperature >= 10) or (resistanceEvolution == "very slow" and envConditions == "good" and concrete_temperature >= 10):
        return 4
    elif (resistanceEvolution == "fast" and envConditions == "bad" and concrete_temperature < 10) or (resistanceEvolution == "slow" and envConditions == "good" and concrete_temperature < 10):
        return 5
    elif (resistanceEvolution == "average" and envConditions == "normal" and concrete_temperature < 10) or (resistanceEvolution == "very slow" and envConditions == "good" and concrete_temperature < 10) or (resistanceEvolution == "very slow" and envConditions == "normal" and concrete_temperature >= 10):
        return 6
    elif (resistanceEvolution == "slow" and envConditions == "bad" and concrete_temperature >= 10):
        return 7
    elif (resistanceEvolution == "average" and envConditions == "bad" and concrete_temperature < 10) or (resistanceEvolution == "slow" and envConditions == "normal" and concrete_temperature < 10):
        return 8
    elif (resistanceEvolution == "slow" and envConditions == "bad" and concrete_temperature < 10) or (resistanceEvolution == "very slow" and envConditions == "bad" and concrete_temperature >= 10):
        return 10
    elif (resistanceEvolution == "very slow" and envConditions == "normal" and concrete_temperature < 10):
        return 12
    elif (resistanceEvolution == "very slow" and envConditions == "bad" and concrete_temperature < 10):
        return 15


def getResistanceEvolution(self, fcm2_fcm28_ratio, type2_addition, rc2_rc28_ratio, cement_type):
    if fcm2_fcm28_ratio is not None:
        return ratio(fcm2_fcm28_ratio)
    elif type2_addition:
        return "very slow"
    elif rc2_rc28_ratio is not None:
        return ratio(rc2_rc28_ratio)
    elif cement_type is not None:
        return cementType(cement_type)
    else:
        return ("very slow")


def getEnvConditions(self, clouds, wind, humidity):
    if humidity < 50 or clouds < 25 or wind > 5:
        return 'bad'
    elif 50 <= humidity < 80 or 25 <= clouds < 75:
        return "normal"
    elif humidity >= 80 and clouds > 75 and wind < 5:
        return 'good'


def ratio(self, ratio):
    # Determines the evolution of the strength according to the ratio Fcm2/Fcm28 of the concrete or Rc2/Rc25 of the cement
    if 0 > ratio >= 0.5:
        return "fast"
    elif 0.3 <= ratio < 0.5:
        return "average"
    elif 0.15 <= ratio < 0.3:
        return "slow"
    elif ratio < 0.15:
        return "very slow"


def cementType(self, type):
    # Determines the evolution of the strength according to the type of cement
    cementTypes = {
        # CEM 1
        "CEM 1 52.5 N ou R": "fast",
        "CEM 1 42.5 N ou R": "average",
        # CEM 2
        "CEM 2/A-M ou -V 42.5 N ou R ou 32.5 R": "average",
        "CEM 2/A-S, -D ou -LL 52.5 N ou R": "fast",
        "CEM 2/A-S, -D ou -LL 42.5 N ou R": "fast",
        "CEM 2/A-S, -D OU -LL 32.5 R": "average",
        "CEM 2/A-S, -D, -LL, -M ou -V 32.5 N": "slow",
        "CEM 2/B-S, -LL, -M ou -V 42.5 N ou R ou 32.5 R": "average",
        "CEM 2/B-S, -LL, -M ou -V 32.5 N": "slow",
        # CEM 3
        "CEM 3/A 52.5 N ou 42.5 N": "average",
        "CEM 3/A 32.5 N": "slow",
        "CEM 3/B 42.5 N ou 32.5 N": "slow",
        "CEM 3/C 32.5 N": "slow",
        # CEM 5
        "CEM 5/A 32.5 N": "slow",
        # OTHER
        "oversulfated cement": "very slow",

    }
    return cementTypes[type]
