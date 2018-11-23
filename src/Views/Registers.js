import React, {Component} from "react";
import {connect} from "react-redux";
import ReactTable from "react-table";
import 'react-table/react-table.css';

const mapStateToProps = (state) => {
    const registerKeys = Object.keys(state.registers);
    const stateRegister = state.registers;
    return {
        registers: registerKeys.map((key) => [key, stateRegister[key]])
    }
};

class Registers extends Component {
    render() {
        //console.log(this.props.registers);
        return (
            <ReactTable
                data={this.props.registers || []}
                columns={[
                    {
                        Header: "Name",
                        id: "name",
                        maxWidth: 64,
                        accessor: i => i[0],
                        className: "centered"
                    },
                    {
                        Header: "Value",
                        id: "dec-val",
                        maxWidth: 128,
                        accessor: i => i[1],
                        className: "centered"
                    },
                    {
                        Header: "Hex Value",
                        id: "hex-val",
                        maxWidth: 128,
                        accessor: i => Number(i[1]).toString(16).toUpperCase(),
                        className: "centered"
                    },
                    {
                        Header: "Binary Value",
                        id: "binary-val",
                        maxWidth: 128,
                        accessor: i => i[1].toString(2),
                        className: "centered"
                    }
                ]}
                defaultPageSize={32}
                className={"-striped -highlight"}
                showPagination={false}
            />
        );
    }

}

export default connect(mapStateToProps)(Registers);