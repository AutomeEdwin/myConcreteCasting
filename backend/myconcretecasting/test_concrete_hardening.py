# -*- coding: utf-8 -*-
"""
Created on Fri Jul 23 14:35:50 2021
@author: tlo
"""
##############################################################
#    TESTING
##############################################################

import matplotlib.pyplot as plt
import datetime
import time
import random
import numpy as np
import matplotlib.pyplot as plt
from concrete_hardening import StrengthClass, CementType, ConcreteStrength

################################################################
# SOME FUNCTIONS IN ORDER TO GENERATE A FAKE TEMPERATURE HISTORY
##################################################################


def weib(x, n, a):
    return (a / n) * (x / n)**(a - 1) * np.exp(-(x / n)**a)


def functTemp(t, DT, T0, shift=0):
    r = weib(t, 15/24., 3)+3*weib(t, 30/24., 3)+2 * \
        weib(t, 50/24., 3) + 3*weib(t, 80/24., 3)
    r = r/3.8*DT + T0
    r = r + np.sin(2*np.pi*t) * T0*0.1*random.random()
    r = r + np.sin(2*np.pi*t*24) * T0*0.05*random.random()
    r = r + np.sin(2*np.pi*t/30.) * T0*0.05*random.random()
    r = r + np.cos(2*np.pi*(t-shift)/(30.*12)) * T0*1
    #r = r + np.sin(2*np.pi*t*30.) * T0*0.1*random.random()
    #r = T0
    return r


def test():
    # factor to convert second to days
    s2d = 1./(3600.*24)

    # I create the fake temperature history
    # t --> time (in timestamp)
    # T --> Temperature
    # t0 -> time when the measurement starts
    # tCast -> time when the casting start

    Duration = 35  # days
    now = time.time()
    t0 = now - 15.0/s2d
    tCast = now - 5.0/s2d

    t = np.linspace(t0, t0+Duration/s2d, 100)
    DT = 50.  # degree
    T0 = 5.0  # degree
    DTn = DT * (1 + 0.2 * 2*(random.random() - 0.5))
    T0n = T0 * (1 + 0.2 * 2*(random.random() - 0.5))

    T = []
    for tt in t:
        if (tt < tCast):
            tt = tCast
        temperature = functTemp((tt-tCast)*s2d, DTn, T0n, shift=-200)
        T.append(round(temperature, 2))
    T = np.array(T)

    # I create a concrete cast with their properties (Strength CLass, Cement TYpe)
    myConcreteCast = ConcreteStrength(StrengthClass.C30_37, CementType.R)
    # I provide the Temperature History
    myConcreteCast.setTempHistory(t, T)

    # I provide the time when the casting starts
    myConcreteCast.setCastingTime(tCast)

    # Computing the concrete Maturity
    # sur base des temp => recalculer age équivalent (age selon les temp et non selon un environnement normatif (20°C et 95% humidité))
    # équivalence entre temps réelle (B_cc_) et le
    myConcreteCast.computeMaturity()

    # COMPUTING how long do we have to wait the achieve a desired compressive strength treshhold....
    # inverser la formule avec Beta => "que vaut mon T pour que f_cm(T) atteigne la valeur cible"
    # cmb de temps attendre pour que f_cm soit au moins à une certains valeur
    r = myConcreteCast.getTimeStrength(25)
    tUncast = r.x[0]

    print('Ready to uncast in %d days' % int(np.ceil((tUncast-now)*s2d)))


if __name__ == '__main__':
    test()
