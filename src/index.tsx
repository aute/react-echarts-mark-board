import React, { useState, useReducer, useEffect } from 'react'
import ReactEcharts from 'echarts-for-react';
import * as R from "ramda";
import echarts from 'echarts';

import { Anchor, Anchors, Props, Shape, ShapeType } from './types';
import { chartInitData, createShape, getPoint, isClose, setClose, } from './utils'

const SYMBOL_SIZE = 14


function reducer(
  payload: {
    selected: number,
    shapeList: Shape[]
  },
  action: {
    type: string;
    location?: Anchor;
    shapeType?: ShapeType;
    anchorOrdinal?: number;
    shapeOrdinal?: number;
    newShapeList?: Shape[];
    color?: string,
    data?: any
  }) {
  const { type, location, newShapeList, shapeOrdinal, shapeType, anchorOrdinal, color, data } = action
  let { shapeList, selected } = payload
  let selectedItem = shapeList[selected]
  switch (type) {
    case 'CREATE_SHAPE':
      payload = {
        shapeList: [...shapeList, createShape({
          shapeType: shapeType ? shapeType : 'line',
          color,
          data
        })],
        selected: shapeList.length
      }
      break
    case 'DELETE_SHAPE':
      if (typeof (shapeOrdinal) === "undefined") {
        break
      }
      payload = {
        shapeList: R.remove(shapeOrdinal, 1, shapeList),
        selected: 0
      }
      break

    case 'CHANGE_SELECTED':
      if (typeof (shapeOrdinal) === "undefined") {
        break
      }
      payload = {
        ...payload,
        selected: shapeOrdinal
      }
      break
    case 'PUSH_ANCHOR':
      if (!selectedItem || selectedItem.over || !location) {
        break
      }
      if (selectedItem.anchors.length < 1) {
        selectedItem.anchors.push(location)
      }
      if (selectedItem.type === 'polygon' && selectedItem.anchors.length > 3) {
        selectedItem.anchors = setClose(selectedItem.anchors)
        selectedItem.over = isClose(selectedItem.anchors)
        if (selectedItem.over) {
          payload = {
            ...payload
          }
          break
        }
      }
      if (selectedItem.type === 'sides' && selectedItem.anchors.length > 1) {
        selectedItem.over = true
        payload = { ...payload }
        break
      }
      selectedItem.anchors.push(location)
      payload = { ...payload }
      break

    case 'MOVE_LAST_ANCHOR':
      if (selectedItem && !selectedItem.over && selectedItem.anchors.length > 0) {
        selectedItem.anchors = R.update(-1, location, selectedItem.anchors);
        payload = { ...payload }
      }
      break
    case 'MOVE_ANCHOR':
      if (selectedItem && selectedItem.anchors.length > 0 && typeof anchorOrdinal === 'number') {
        selectedItem.anchors = R.update(anchorOrdinal, location, selectedItem.anchors);
        if (selectedItem.type === 'polygon' && selectedItem.over && action.anchorOrdinal === selectedItem.anchors.length - 1) {
          selectedItem.anchors = R.update(0, location, selectedItem.anchors);
        }
        payload = { ...payload }
      }
      break
    case 'OVER':
      if (selectedItem && !selectedItem.over && selectedItem.anchors.length > 0) {
        selectedItem.anchors = R.slice(0, -2, selectedItem.anchors)
        if (selectedItem.type === 'polygon' && selectedItem.anchors.length > 3) {
          selectedItem.anchors = R.update(-1, R.head(selectedItem.anchors), selectedItem.anchors);
        }
        if (selectedItem.type === 'polygon' && selectedItem.anchors.length <= 3) {
          break
        }
        if (selectedItem.type === 'line' && selectedItem.anchors.length < 2) {
          break
        }
        selectedItem.over = true
        payload = { ...payload }
      }
      break
    case 'LOAD':
      selected = shapeOrdinal
      if (!shapeOrdinal || shapeOrdinal < 0 || shapeOrdinal >= newShapeList.length) {
        selected = 0
      }
      payload = {
        selected: selected,
        shapeList: newShapeList
      }
      break
  }
  return payload
}

const MarkTool = ({ onChange, onReady, selected, showGrid = false, value }: Props) => {

  useEffect(() => {
    R.equals(data.shapeList, value) ||
      dispatch({ type: 'LOAD', newShapeList: value })
  }, [value])

  useEffect(() => {
    dispatch({ type: 'CHANGE_SELECTED', shapeOrdinal: selected })
  }, [selected])

  chartInitData.xAxis.splitLine.show = showGrid
  chartInitData.yAxis.splitLine.show = showGrid

  const [data, dispatch] = useReducer(reducer, { selected: 0, shapeList: value })
  useEffect(() => {
    myChart && myChart.setOption({
      ...chartInitData,
      series: data.shapeList.map((item: { anchors: Anchors; type: string; color?: string; }, index: number) => {
        return {
          type: 'line',
          symbolSize: index === data.selected ? SYMBOL_SIZE : 0,
          data: item.anchors.map(i => {
            return [i[0], 100 - i[1]]
          }),
          lineStyle: {
            color: item.color,
          },
          itemStyle: {
            color: item.color,
          },
          markLine: item.type === 'sides' && {
            symbol: ['circle', 'triangle'],
            data: item.anchors[0] && [
              [{
                // TODO fun
                coord: [(item.anchors[0][0] + item.anchors[1][0]) / 2
                  - (item.anchors[0][1] - item.anchors[1][1]) / 4
                  * (myChart._dom.clientHeight / myChart._dom.clientWidth)
                  , 100 - ((item.anchors[0][1] + item.anchors[1][1]) / 2
                    + (item.anchors[0][0] - item.anchors[1][0]) / 4
                    * (myChart._dom.clientWidth / myChart._dom.clientHeight))
                ]
              },
              {
                coord: [(item.anchors[0][0] + item.anchors[1][0]) / 2 + (item.anchors[0][1] - item.anchors[1][1]) / 4
                  * (myChart._dom.clientHeight / myChart._dom.clientWidth)
                  , 100 - ((item.anchors[0][1] + item.anchors[1][1]) / 2 - (item.anchors[0][0] - item.anchors[1][0]) / 4
                    * (myChart._dom.clientWidth / myChart._dom.clientHeight))
                ]
              }]
            ]
          }
        }
      }),
      graphic: data.shapeList[data.selected] ? echarts['util'].map(data.shapeList[data.selected].anchors, (item: Anchor, dataIndex: number) => {
        return {
          type: 'circle',
          position: myChart.convertToPixel('grid', [item[0], 100 - item[1]]),
          shape: { cx: 0, cy: 0, r: SYMBOL_SIZE },
          invisible: true,
          draggable: true,
          ondrag: echarts['util'].curry(function (this: any, dataIndex: number) {
            const location = myChart.convertFromPixel('grid', this.position);
            dispatch({ type: 'MOVE_ANCHOR', location: [location[0], 100 - location[1]], anchorOrdinal: dataIndex })
          }, dataIndex),
          z: 100
        }
      }) : null
    }, true);
    onChange(data)
  }, [data])

  const [myChart, setMayChart] = useState<any | null>(null)
  useEffect(() => {
    if (myChart) {
      dispatch({ type: 'LOAD', newShapeList: value, shapeOrdinal: selected })
      onReady && onReady({
        createShape,
        deleteShape
      })
    }
  }, [myChart])



  const editAnchor = R.curry((mode: string, location: Anchor) => {
    dispatch({ type: mode, location })
  })

  const createShape = (opt: { shapeType: ShapeType, color?: string, data?: any }) => {
    dispatch({ type: 'CREATE_SHAPE', shapeType: opt.shapeType, color: opt.color, data: opt.data })
  }

  const deleteShape = (shapeOrdinal: number) => {
    dispatch({ type: 'DELETE_SHAPE', shapeOrdinal })
  }

  return <div style={{ height: '100%', width: '100%' }}
    onClick={R.compose(editAnchor('PUSH_ANCHOR'), getPoint)}
    onMouseMove={R.compose(editAnchor('MOVE_LAST_ANCHOR'), getPoint)}
    onDoubleClick={R.compose(editAnchor('OVER'), getPoint)}
    data-testid="MarkTool"
  >
    <ReactEcharts
      onChartReady={setMayChart}
      option={chartInitData}
      style={{ height: '100%', width: '100%' }}
    />
  </div>
}

export default MarkTool
