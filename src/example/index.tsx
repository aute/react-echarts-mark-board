import React from 'react'
import ReactDOM from 'react-dom';
import { ChangeHistory, ShowChart, CallMade, Clear } from '@material-ui/icons';
import MarkTool from '../index'
import { useState, useEffect, useRef } from "react";
import './App.scss';

const App = () => {
  const markTool = useRef(null)
  const [shapeList, setShapeList] = useState([])
  const [selected, setSelected] = useState(0)

  const [activeButton, setActiveButton] = useState('')

  useEffect(() => {
    shapeList[selected] && (!shapeList[selected].over ? setActiveButton(shapeList[selected].type) : setActiveButton(null))

  }, [shapeList, selected])


  const onReady = (tool) => {
    markTool.current = tool
  }
  const createShape = (p, color?: string) => {
    markTool.current.createShape(p, color)
  }
  const deleteShape = (n) => {
    markTool.current.deleteShape(n)
  }
  return (
    <div className='App'>
      <div className='App-right'>
        <div className='App-content'>
          <div className='buttons'>
            <button onClick={() => createShape({ shapeType: 'polygon' })} className={activeButton === 'polygon' ? 'active' : ''}>
              <ChangeHistory style={{ transform: 'translateY(-0.03125rem)' }} />
            </button>
            <button onClick={() => createShape({ shapeType: 'line', color: '#fff000' })} className={activeButton === 'line' ? 'active' : ''}>
              <ShowChart />
            </button>
            <button onClick={() => createShape({ shapeType: 'sides', color: '#fff000' })}>
              <CallMade />
            </button>
          </div>
          <ul>
            {
              shapeList && shapeList.map((i, index) => {
                return (
                  <li key={index} className={selected === index ?'active':''} onClick={() => {
                    setSelected(index)
                  }}>
                    <p>spaceman</p>
                    <Clear className='clear' onClick={(e) => {
                      e.stopPropagation()
                      deleteShape(index)
                    }}/>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
      <div className='App-Sketchpad'>
        <MarkTool onReady={onReady} onChange={e => {
          setShapeList([...e.shapeList])
          setSelected(e.selected)
        }} value={shapeList} selected={selected}></MarkTool>
      </div>
      <h1>React<br />echarts<br />draw<br />mark</h1>
    </div>
  )
}


ReactDOM.render(<App />, document.getElementById('root'));
