function diamondPrice(diamond) {
    if (diamond == 0) {
        return 100
    }
    return Math.floor((2 ** (diamond + 1)) * Math.PI / 2 + 100)
}

module.exports = { diamondPrice }