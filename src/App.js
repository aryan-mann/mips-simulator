import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import IDE from "./Views/IDE";
import Toolbar from "./Views/Toolbar";

import registerStore from "./State/Store";
import {ReflashProgram, UpdateRegister} from "./State/registerReducer";
import Registers from "./Views/Registers";

class App extends Component {
  render() {
    return (
      <div id="App">
          <div className="Left">
              <Toolbar
                  items={[
                      { name: "Run", clicked: () => {
                          if(this.ideReference !== null) {
                              this.ideReference.run();
                          }
                      }},
                      { name: "Clear", clicked: () => {
                          if(this.ideReference !== null) {
                              this.ideReference.reflash();
                          }
                      }},
                      { name: "Step", clicked: () => {
                          if(this.ideReference !== null) {
                              this.ideReference.step();
                          }
                      }},
                      { name: "Assemble", clicked: () => {
                          if(this.ideReference !== null) {
                              this.ideReference.assemble();
                          }
                      }}
                  ]}
              />
              <IDE ref={(instance) => { this.ideReference = instance.getWrappedInstance(); }} />
          </div>
          <div className="Right">
              <Registers />
          </div>
      </div>
    );
  }
}

export default App;
