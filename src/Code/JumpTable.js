class JumpTable {

    constructor() {
        this.internalObj = {};
    }

    addOrUpdate = (symbol, line) => {
        this.internalObj[symbol] = line;
    };

    getLineFromSymbol = (symbol) => {
        return this.internalObj[symbol];
    };
}

export default JumpTable;