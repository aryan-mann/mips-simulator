import Instruction from "../Code/Instruction";
import store from "../State/Store";
import {GetRegisterNumber} from "./RegisterTools";
import {UpdateRegister} from "../State/registerReducer";

const containsComment = (line) => {
    return /^(.+)#(.+)$/.test(line);
};
const stripCommentsFromLine = (line) => {
    if (!containsComment(line)) { return line; }
    return /^([\s|\t]*)(.+)([\s|\t]*)#(.+)$/.exec(line)[2].trim();
};

const convertLineToInstruction = (line) => {
    // Remove comments from a line
    line = stripCommentsFromLine(line);
    line = line.trim();
    return new Instruction(line);
};

/******************
** MIMIC METHODS **
*******************/
const GetRegisterState = () => {
    return store.getState().registers;
};

const Operations = {
    nop: () => {

    },
    add: (rd, rs, rt) => {
        const registers = GetRegisterState();

        const rsIndex = GetRegisterNumber(rs);
        const rtIndex = GetRegisterNumber(rt);

        const sum = parseInt(registers[rsIndex]) + parseInt(registers[rtIndex]);

        store.dispatch(UpdateRegister(rd, parseInt(sum)));
    },
    addi: (rd, rs, constant) => {
        const registers = GetRegisterState();

        const rsIndex = GetRegisterNumber(rs);
        const sum = parseInt(registers[rsIndex]) + parseInt(constant);

        store.dispatch(UpdateRegister(rd, parseInt(sum)));
    },
    sub: (rd, rs, rt) => {
        const registers = GetRegisterState();

        const rsIndex = GetRegisterNumber(rs);
        const rtIndex = GetRegisterNumber(rt);

        const sum = parseInt(registers[rsIndex]) - parseInt(registers[rtIndex]);

        store.dispatch(UpdateRegister(rd, parseInt(sum)));
    },
    beq: (rd, rs, label) => {
        const registers = GetRegisterState();

        const rdIndex = GetRegisterNumber(rd);
        const rsIndex = GetRegisterNumber(rs);

        return (parseInt(registers[rdIndex]) === parseInt(registers[rsIndex])) ? label : null;
    },
    j: (label) => { }
};


export { Operations, convertLineToInstruction }