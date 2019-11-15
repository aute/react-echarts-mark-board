import React from 'react'
import ReactDOM from 'react-dom';
import  MarkTool  from '../index'
import { useState, useRef } from "react";

const Example = () => {
  const markTool = useRef(null)
  const [shapeList, setShapeList] = useState([])
  const [selected, setSelected] = useState(0)
  const onReady = (tool) => {
    markTool.current = tool
  }
  const createShape = (p,color?:string) => {
    markTool.current.createShape(p,color)
  }
  const deleteShape = (n) => {
    markTool.current.deleteShape(n)
  }
  
  return (
    <div style={{
      width: '100%'
    }}>
      <div style={{
        width: '60%',
        height: '400px',
        display: 'inline-block',
      }}>
        <MarkTool onReady={onReady} onChange={e => {
          setShapeList(e.shapeList)
          setSelected(e.selected)
        }} value={shapeList} selected={selected}></MarkTool>
        <button onClick={() => createShape({shapeType:'line',color:'#fff000'})}>添加线</button>
        <button onClick={() => createShape({shapeType:'polygon'})}>添加多边形</button>
        <button onClick={() => createShape({shapeType:'sides',color:'#fff000'})}>添加指向划分</button>
      </div>
      {
        shapeList && shapeList.map((i, index) => {
          return (
            <div key={index} onClick={() => {
              setSelected(index)
            }}
              style={{ padding: "0.5rem", border: '1px solid #ddd', backgroundColor: selected === index ? '#ddd' : '#f0f2f5' }}
            >
              <p>{index}<span onClick={(e) => {
              e.stopPropagation()
              deleteShape(index)
            }}> Delete</span></p>
            </div>
          )
        })
      }
    </div>
  )
}


ReactDOM.render(<Example />, document.getElementById('root'));
