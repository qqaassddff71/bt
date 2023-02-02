function levelCalculator(exp) {
    if (exp >= 0 && exp < 50) return 1
    if (exp >= 50 && exp < 100) return 2
    if (exp >= 100 && exp < 200) return 3
    if (exp >= 200 && exp < 500) return 4
    if (exp >= 500 && exp < 1000) return 5
    if (exp >= 1000 && exp < 1500) return 6
    if (exp >= 1500 && exp < 2000) return 7
    if (exp >= 2000 && exp < 2750) return 8
    if (exp >= 2750 && exp < 4500) return 9
    if (exp >= 4500 && exp < 5500) return 10
    if (exp >= 5500 && exp < 10000) return 11
    if (exp >= 10000 && exp < 12000) return 12
    if (exp >= 12000 && exp < 15000) return 13
    if (exp >= 15000 && exp < 20000) return 14
    if (exp >= 20000 && exp < 25000) return 15
    if (exp >= 25000 && exp < 30000) return 16
    if (exp >= 30000 && exp < 40000) return 17
    if (exp >= 40000 && exp < 550000) return 18
    if (exp >= 55000 && exp < 650000) return 19
    if (exp >= 65000 && exp < 1000000) return 20
}
module.exports = {
    levelCalculator
};