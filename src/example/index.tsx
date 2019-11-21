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
      <div className='App-content'>
        <Sketchpad
          onReady={onReady}
          setShapeList={setShapeList}
          setSelected={setSelected}
          shapeList={shapeList}
          selected={selected}
        />
        <div className='App-tools'>
          <Buttons
            activeButton={activeButton}
            createShape={createShape} />
          <ShapeList
            shapeList={shapeList}
            selected={selected}
            setSelected={setSelected}
            deleteShape={deleteShape} />
        </div>
        <h1>React<br />echarts<br />draw<br />mark</h1>
      </div>

    </div>
  )
}

const Buttons = (props) => {
  return <div className='buttons'>
    <button onClick={() => props.createShape({ shapeType: 'polygon' })} className={props.activeButton === 'polygon' ? 'active' : ''}>
      <ChangeHistory style={{ transform: 'translateY(-0.03125rem)' }} />
    </button>
    <button onClick={() => props.createShape({ shapeType: 'line', color: '#fff000' })} className={props.activeButton === 'line' ? 'active' : ''}>
      <ShowChart />
    </button>
    <button onClick={() => props.createShape({ shapeType: 'sides', color: '#fff000' })} className={props.activeButton === 'sides' ? 'active' : ''}>
      <CallMade />
    </button>
  </div>
}

const ShapeList = (props) => {
  return <ul>
    {
      props.shapeList && props.shapeList.map((i, index) => {
        return (
          <li key={index} className={props.selected === index ? 'active' : ''} onClick={() => {
            props.setSelected(index)
          }}>
            <p>spaceman</p>
            <Clear className='clear' onClick={(e) => {
              e.stopPropagation()
              props.deleteShape(index)
            }} />
          </li>
        )
      }).reverse()
    }
  </ul>
}

const Sketchpad = (props) => {
  return <div className='App-Sketchpad-Wrap'>
  <div className='App-Sketchpad'>
    <MarkTool
      onReady={props.onReady} onChange={e => {
        props.setShapeList([...e.shapeList])
        props.setSelected(e.selected)
      }}
      value={props.shapeList}
      selected={props.selected} />
  </div>
  </div>
}

ReactDOM.render(<App />, document.getElementById('root'));
