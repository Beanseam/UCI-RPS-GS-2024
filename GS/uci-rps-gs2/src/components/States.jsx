import './Components.css';
import React from 'react';

export default class Container extends React.Component {
  componentDidUpdate(prevProps) {
    if (prevProps.stateData !== this.props.stateData) {
      const root = document.querySelector(':root');

      for (let i = 0; i < 4; i++) {
        root.style.setProperty(`--state-${i}`, 'white');
        root.style.setProperty(`--text-${i}`, 'black');
      }

      const active = this.props.stateData;
      if (active >= 0 && active < 4) {
        root.style.setProperty(`--state-${active}`, 'red');
        root.style.setProperty(`--text-${active}`, 'white');
      } else {
        console.warn('State out of bounds:', active);
      }
    }
  }

  render() {
    return (
      <div className="state-container">
        <div className="state">Launch Ready</div>
        <div className="state">In-Flight</div>
        <div className="state">Drogue Deployed</div>
        <div className="state">Main Deployed</div>
      </div>
    );
  }
}
