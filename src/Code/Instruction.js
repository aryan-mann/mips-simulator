import Assembler, { Operations } from "../Constants/Assembler";

// Matches the form: op arg1,arg2,arg3
const nopRegex = /^(nop)$/;
const skipRegex = /^(\w+)\s*:$/;
const branchRegex = /^(beq|bne)\s+(\$\w+)\s*,\s*(\$\w+)\s*,\s*(\w+)\s*$/;
const jumpRegex = /^(j|jal)\s+(\w+)$/;
const opRegRegRegRegex = /^(\w+)\s+(\$\w+)\s*,\s*(\$\w+)\s*,\s*(\$\w+)\s*$/;
const opRegRegImmediateRegex = /^(\w+)\s+(\$\w+)\s*,\s*(\$\w+)\s*,\s*(-?\d+)\s*$/;

class Instruction {

    /*
            INPUT FORMATS:-
            R[rd] = R[s] op R[t]
     */
    constructor(rawInstruction) {
        if (skipRegex.test(rawInstruction)) {
            this.instruction = "skip";
            this.instructionType = 0;

            this.executor = () => { return new Promise((rs) => { rs(); }); }
        } else if (nopRegex.test(rawInstruction)) {
            this.instruction = "nop";
            this.instructionType = 1;

            this.executor = () => { return new Promise((rs) => { rs(); }); }
        } else if (branchRegex.test(rawInstruction)) {
            const args = branchRegex.exec(rawInstruction);
            this.instruction = args[1];
            this.instructionType = 2;

            this.arg1 = args[2];
            this.arg2 = args[3];
            this.label = args[4];

            this.executor = () => {
                return new Promise((rs) => {
                    let jumpLabel = Operations[this.instruction](this.arg1, this.arg2, this.label);
                    rs(jumpLabel);
                });
            }
        } else if (jumpRegex.test(rawInstruction)) {
            const args = jumpRegex.exec(rawInstruction);
            this.instruction = args[1];
            this.instructionType = 3;

            this.label = args[2];

            this.executor = () => {
                return new Promise((rs) => {
                    Operations[this.instruction](this.label);
                    rs(this.label);
                });
            }
        } else if(opRegRegRegRegex.test(rawInstruction)) {
            const args = opRegRegRegRegex.exec(rawInstruction);
            this.instruction = args[1];
            this.instructionType = 4;

            this.destinationRegister = args[2];
            this.firstSourceRegister = args[3];
            this.secondSourceRegister = args[4];

            this.executor = () => {
                return new Promise((rs) => {
                Operations[this.instruction](this.destinationRegister, this.firstSourceRegister, this.secondSourceRegister);
                rs();
            })};
        } else if(opRegRegImmediateRegex.test(rawInstruction)) {
            const args = opRegRegImmediateRegex.exec(rawInstruction);
            this.instruction = args[1];
            this.instructionType = 5;

            this.destinationRegister = args[2];
            this.firstSourceRegister = args[3];
            this.constant = args[4];

            this.executor = () => {
                return new Promise((rs) => {
                    Operations[this.instruction](this.destinationRegister, this.firstSourceRegister, this.constant);
                    rs();
                });
            }
        }

    }

    async execute() {
        if (Operations[this.instruction] === undefined) { return new Promise(res => { res(); }); }
        return await (this.executor());
    }

}

export default Instruction;