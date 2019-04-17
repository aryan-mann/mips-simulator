import ActionTypes from "../Store/ActionTypes";

class Operations {

    static New(pattern, stateFunctor) {
        pattern = pattern.replace(/#/g, '(.+)')
            .replace(/_/g, '\\s*');
        Operations.Instructions[pattern] = stateFunctor;
    }

    static Nop() {
        return Operations.GetInstruction('nop');
    }

    static GetInstruction(userInput) {
        userInput = userInput.trim();
        const patterns = Object.keys(Operations.Instructions);
        let foundIndex = -1; let currentIndex = 0;

        let patternAsRegex;
        while (foundIndex < 0 && currentIndex < patterns.length) {
            patternAsRegex = new RegExp(patterns[currentIndex]);
            if (patternAsRegex.test(userInput)) { foundIndex = currentIndex; }
            currentIndex++;
        }

        // Replace null with a nop to get Nop when cant recognize instruction
        if (foundIndex < 0) { return Operations.GetInstruction('nop'); }
        // Calling this with the appropriate number of arguments will give us the state mutator
        const args = patternAsRegex.exec(userInput).slice(1).map((x) => x.trim());

        // Function that takes in arguments for an operation and returns a function
        // that takes in a state and mutates it based on the operation
        const stateFunctor = Operations.Instructions[patterns[foundIndex]];
        const valueFunctor = stateFunctor.apply(null, args);

        return {
            type: ActionTypes.INSTRUCTION,
            payload: valueFunctor
        }
        //console.log((stateFunctor("$s0", "$s1", "$s2"))({ registers: { "$s1": 5, "$s2": 7 }}));
        //console.log((stateFunctor.apply(null, args))({ registers: { "$s1": 5, "$s2": 7 }}));
    }

}
Operations.Instructions = {};

///////////////////////////////////////////////////////////////////////
//\\//\\//\\//          HELPER FUNCTIONS                 //\\//\\//\\//
///////////////////////////////////////////////////////////////////////
// add $s0, $s1, $s2
Operations.New(
    'add _#_,_#_,_#_',
    (rd, rs, rt) => {
        return ((state) => {
            return {
                ...state,
                registers: {
                    ...state.registers,
                    [rd]: parseInt(state.registers[rs]) + parseInt(state.registers[rt])
                }
            }
        })
    }
);

// sub $s0, $s1, $s2
Operations.New(
    'sub _#_,_#_,_#_',
    (rd, rs, rt) => {
        return ((state) => {
            return {
                ...state,
                registers: {
                    ...state.registers,
                    [rd]: parseInt(state.registers[rs] - state.registers[rt])
                }
            }
        })
    }
);

// add $s0, $s1, 100
Operations.New(
    'addi _#_,_#_,_#_',
    (rd, rs, immediate) => {
        return ((state) => {
            let v1 = parseInt(state.registers[rs]);
            let v2 = parseInt(immediate);

            return {
                ...state,
                registers: {
                    ...state.registers,
                    [rd]: (v1 + v2)
                }
            }
        });
    }
);

// li $t0, 100
Operations.New(
    'li _#_,_#_',
    (rd, immediate) => {
        return ((state) => {

            immediate = parseInt(immediate);
            immediate = isNaN(immediate) ? 0: immediate;

            return {
                ...state,
                registers: {
                    ...state.registers,
                    [rd]: immediate
                }
            }

        });
    }
);

// beq $s0, $s1, label
Operations.New(
    'beq _#_,_#_,_#_',
    (rs,rt, label) => {
        return ((state) => {
            let shouldBranch = (state.registers[rs] === state.registers[rt]);
            if (shouldBranch) {
                return {
                    ...state,
                    programCounter: state.jumpTable[label]
                }
            } else {
                return {...state};
            }
        });
    }
);

// nop
Operations.New(
    'nop',
    () => {
        return ((state) => {
            return {...state};
        })
    }
);

// j loop
Operations.New(
    'j _#_',
    (label) => {
        return ((state) => {
            return {
                ...state,
                programCounter: state.jumpTable[label]
            }
        });
    }
);

// jal loop
Operations.New(
    'jal _#_',
    (label) => {
        return ((state) => {
            return {
                ...state,
                programCounter: state.jumpTable[label],
                registers: {
                    ...state.registers,
                    "$ra": state.programCounter
                }
            }
        })
    }
);

// Extra Functions (that are not generally available)
Operations.New(
    'mod _#_, _#_, _#_',
    (reg, a, m) => {
        return ((state) => {

            return {
                ...state,
                registers: {
                    ...state.registers,
                    [reg]: ((a + m) % m)
                }
            }

        });
    }
);

// Mimics
Operations.New('addu _#_,_#_,_#_', Operations.GetInstruction('add'));
Operations.New('subu _#_,_#_,_#_', Operations.GetInstruction('sub'));

export default Operations;