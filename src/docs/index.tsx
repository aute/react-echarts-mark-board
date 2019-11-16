import React from 'react'
import ReactDOM from 'react-dom';
import { ChangeHistory, ShowChart, CallMade, Clear } from '@material-ui/icons';
import './App.scss';

const App = () => {
  return (
    <div className='App'>
      <div className='App-right'>
        {/* <button>
          <ChangeHistory />
        </button> */}
      </div>
      <div className='App-Sketchpad'></div>
      <h1>React<br />echarts<br />draw<br />mark</h1>
    </div>
  )
}


ReactDOM.render(<App />, document.getElementById('root'));
