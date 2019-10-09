import React from 'react'
import { MarkTool } from './Line'
import { useState, useEffect, useRef } from "react";

const Line = () => {
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
      width: '100%',
      marginTop: '100px'
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
        <button onClick={() => createShape('line','#fff000')}>添加线</button>
        <button onClick={() => createShape('polygon')}>添加多边形</button>
        <button onClick={() => createShape('sides','#fff000')}>添加指向划分</button>
        <button onClick={() => setShapeList([...shapeList, { "data": [[40.476190476190474, 27], [42.65862837093471, 45.47869842452812], [84.34510065285191, 79.31265771239623], [67.47115285773026, 28.76691698729245], [40.476190476190474, 27]], "over": true, "type": "polygon" }])}>添加完整多边形</button>
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

export { Line }

