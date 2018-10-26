import {UPDATE_REGISTER, READ_REGISTER, REFLASH_PROGRAM} from "../Constants/ActionTypes";
import {
    GetRegisterName, GetRegisterNumber, IsValidRegister,
    IsValidRegisterNumber, ConvertToBinary, CanUpdateRegister
} from "../Constants/RegisterTools";

/* MIPS Register Reference Card */
/*
  [Number]  :   [Name(s)]   :   [Use]
   0        :    $zero      :    Stores the value of 0
   1        :    $at        :    Assembler temporary
   2-3      :    ${v0-v1}   :    Return values
   4-7      :    ${a0-a3}   :    Arguments
   8-15     :    ${t0-t7}   :    Temporaries
   16-23    :    ${s0-s7}   :    Saved Temporaries
   24-25    :    ${t8-t9}   :    Temporaries (Pt.2)
   26-27    :    ${k0-k1}   :    Reserved for OS Kernel
   28       :    $gp        :    Global pointer
   29       :    $sp        :    Stack pointer
   30       :    $fp        :    Frame pointer
   31       :    $ra        :    Return address
 */

const initialState = {
    registers: []    // Array containing 32 elements (for 32 registers)
};

const registerReducer = (state = initialState, action) => {
    if (action === null) { return state; }

    switch (action.type) {
        case UPDATE_REGISTER: //newState.registers[action.payload.index] = action.payload.value;
            return {
                ...state,
                registers: [
                    ...state.registers.slice(0, action.payload.index),
                    action.payload.value,
                    ...state.registers.slice(action.payload.index+1)
                ]
            };
        case REFLASH_PROGRAM:
            return {
                ...state,
                registers: [
                    ...state.registers.map((itm) => 0)
                ]
            };
        default: return state;
    }
};

const ReflashProgram = () => {
    return {
        type: REFLASH_PROGRAM,
        payload: {}
    }
};

const UpdateRegister = (registerName, newValue) => {
    if (!CanUpdateRegister(registerName)) { return null; }

    return {
        type: UPDATE_REGISTER,
        payload: {
            index: GetRegisterNumber(registerName),
            value: ConvertToBinary(newValue)
        }
    }
};

const UpdateRegisterByNumber = (registerNumber, newValue) => {
    if(!IsValidRegisterNumber(registerNumber)) { return null; }

    return {
        type: UPDATE_REGISTER,
        payload: {
            index: GetRegisterName(registerNumber),
            value: ConvertToBinary(newValue)
        }
    }
};

export { registerReducer, UpdateRegister, UpdateRegisterByNumber, ReflashProgram }