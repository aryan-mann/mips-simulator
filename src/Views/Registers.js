import React, {Component} from "react";
import store from "../State/Store";
import {connect} from "react-redux";
import {GetRegisterName} from "../Constants/RegisterTools";
import ReactTable from "react-table";
import 'react-table/react-table.css';

const mapStateToProps = (state) => {

    return {
        registers: state.registers || []
    };

};

class RegistersProxy extends Component {

    render() {
        let registers = this.props.registers;
        let elements = Array.from(Array(registers.length).keys());

        return (
            <ReactTable
                data={elements}
                columns={[
                    {
                        Header: "",
                        id: "_gutter1",
                        maxWidth: 32,
                        accessor: i => ""
                    },
                    {
                        Header: "#",
                        id: "num",
                        maxWidth: 32,
                        accessor: i => i,
                        className: "centered"
                    },
                    {
                        Header: "Name",
                        id: "name",
                        maxWidth: 64,
                        accessor: i => GetRegisterName(i),
                        className: "centered"
                    },
                    {
                        Header: "Decimal",
                        id: "dec-val",
                        maxWidth: 128,
                        accessor: i => registers[i],
                        className: "centered"
                    },
                    {
                        Header: "",
                        id: "_gutter2",
                        accessor: i => ""
                    }
                ]}
                defaultPageSize={32}
                className={"-striped -highlight"}
                showPagination={false}
            />
        );
    }

}

const Registers = connect(mapStateToProps)(RegistersProxy);
export default Registers;