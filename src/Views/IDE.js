import React, {Component} from "react";
import { connect } from "react-redux";
import AceEditor from "react-ace";
import 'brace/mode/mips_assembler';
import 'brace/theme/monokai';
import { ReflashProgram } from "../State/registerReducer";
import { convertLineToInstruction } from "../Constants/Assembler";
import JumpTable from "../Code/JumpTable";

const mapStateToProps = (state) => {
    return {}
};

const mapDispatchToProps = (dispatch, myProps) => {
    return {
        reflashMemory() {
            dispatch(ReflashProgram());
        }
    }
};

class IDE extends Component {

    componentDidMount = () => {
        this.symbols = new JumpTable();
    };

    reflash = () => {
        this.editor.session.removeGutterDecoration(this.lastInstruction, "select");

        this.instructionToExecute = 0;
        this.lastInstruction = -1;

        this.props.reflashMemory();
    };

    step = async () => {
        await this.executeInstruction();
    };

    run = async () => {
        while (this.instructionToExecute < this.instructions.length) {
            this.step();
        }
    };

    assemble = async () => {
        if (this.editor === null) {
            return;
        }

        const session = this.editor.session;
        const lines = session.getLines(0, session.getLength());
        this.instructions = lines.map((line) => convertLineToInstruction(line));

        this.instructionToExecute = 0;
        this.lastInstruction = -1;

        lines.forEach((line, index) => {
            if (/^\s*(\w+)\s*:$/.test(line)) {
                const symbol = /^\s*(\w+)\s*:$/.exec(line)[1];
                this.symbols.addOrUpdate(symbol, index);
            }
        });
    };

    executeInstruction = async () => {
        if (this.instructionToExecute >= this.instructions.length) {
            return true;
        }

        // Highlight the instruction being run
        if (this.lastInstruction >= 0) {
            this.editor.session.removeGutterDecoration(this.lastInstruction, "select");
        }
        this.editor.session.addGutterDecoration(
            this.instructionToExecute,
            (this.instructionToExecute === (this.instructions.length-1)) ? "select-last" : "select"
        );

        let jmp = await (this.instructions[this.instructionToExecute]).execute();

        this.lastInstruction = this.instructionToExecute;
        if (jmp !== null && jmp !== undefined) {
            this.instructionToExecute = this.symbols.getLineFromSymbol(jmp);
        } else {
            this.instructionToExecute += 1;
        }

        return false;
    };

    render() {
        return (
            <AceEditor
                className={"IDE"}
                mode="mips_assembler" theme="monokai" onChange={this.handleInput}
                fontSize={24} style={{width: "100%", height: "100%"}}
                name="mipsIDE" editorProps={{$blockScrolling: true}}
                setOptions={{tabSize: 4, wrap: false}} ref={(instance) => {
                this.editor = instance.editor
            }}
                value={
                    `    addi $t0, $zero, 5      # Set t0 = 5
loop:
    beq $t0, $zero, exit    # if(t0 === 0) exit();
    nop
    addi $t1, $t1, 5        # t1 += 5 (n number of times)
    addi $t0, $t0, -1       # t0 -= 1
    j loop
    nop
exit:
    addi $v0, $zero, 1      # Program ended`
                }
            />
        );
    }

}

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(IDE);