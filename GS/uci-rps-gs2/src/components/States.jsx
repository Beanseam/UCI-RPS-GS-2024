import './Components.css';
import React from 'react';

export default class Container extends React.Component {
    constructor() {
        super();
        this.state = {
          
        };
      }


      componentDidUpdate(prevProps) {
        if (prevProps.stateData !== this.props.stateData) {
            const rootEl = document.querySelector(':root');
            switch(stateData){
                case 0:
                    root.style.setProperty('--lr-state', '#ff0303');
                    break;
                case 1:
                    root.style.setProperty('--lr-state', '#444444');
                    root.style.setProperty('--if-state', '#4ba22f');
                    break;
                case 2:
                    root.style.setProperty('--ddepl-state', '#003dff');
                    console.log("");
                    break;
                case 3:
                    root.style.setProperty('--ddepl-state', '#444444');
                    root.style.setProperty('--mdepl-state', '#5f0899');
                    console.log("");
                    break;
                default:
                    console.log("State was not in bounds");
            }
        }
      }
      

    render() {
    return (
        <div class="state-container">
        <div class="state">Launch Ready</div>
        <div class="state">In-Flight</div>
        <div class="state">Drogue Deployed</div>
        <div class="state">Main Deployed</div>
      </div>
        );
    }
}

//   function States() {
//     return (
//         <div class="state-container">
//         <div class="state" style={{backgroundColor:"#ff0303"}}>Launch Ready</div>
//         <div class="state" style={{backgroundColor:"#4ba22f"}}>In-Flight</div>
//         <div class="state" style={{backgroundColor:"#003dff"}}>Drogue Deployed</div>
//         <div class="state" style={{backgroundColor:"#5f0899"}}>Main Deployed</div>
//       </div>
