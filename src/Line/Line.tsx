import React from 'react'
import ReactEcharts from "echarts-for-react";
import * as R from "ramda";
import echarts from 'echarts';
import { useState, useReducer, useEffect } from "react";

type Anchor = [number, number]

type Shape = {
  data: Anchor[],
  color?: string,
  over: boolean,
  type: string,
}

type Props = {
  selected: number, value, onChange: (arg0) => void, onReady: (arg0: {
    createShape: (shapeType: string, color?: string) => void,
    deleteShape: (shapeType: number) => void;
  }) => void;
}

const chartInit = {
  grid: {
    top: 0,
    right: 1,
    bottom: 1,
    left: 0
  },
  xAxis: {
    min: 0,
    max: 100,
    type: 'value',
    axisLine: { lineStyle: { color: '#DEDEDE' }, onZero: false }
  },
  yAxis: {
    min: 0,
    max: 100,
    type: 'value',
    axisLine: { lineStyle: { color: '#DEDEDE' }, onZero: false }
  },
  series: []
}

const getDistance = (x1: number, y1: number, x2: number, y2: number): number => {
  const s = Math.sqrt(Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2))
  return s;
}

const getPoint = (e: any): Anchor => {
  const x = 100 * e.nativeEvent.offsetX / e.target.clientWidth;
  const y = 100 - 100 * e.nativeEvent.offsetY / e.target.clientHeight;
  return [x, y];
}

const magnetic = (staticPoint: Anchor, attractionPoint: Anchor): Anchor => {
  const gravitation = 5
  const distance = (getDistance as any)(...staticPoint, ...attractionPoint)
  if (gravitation - distance < 0) {
    return attractionPoint
  }
  return staticPoint
}

const isClose = (polygon: Anchor[]): boolean => {
  return R.equals(R.head(polygon), R.last(polygon))
}

const setClose = (polygon: Anchor[]): Anchor[] => {
  return R.update(-1, magnetic(R.head(polygon), R.last(polygon)), polygon)
}

const Shape = (option: { shapeType: string; color?: string; }): Shape => {
  return {
    data: [],
    color: option.color,
    over: false,
    type: option.shapeType,
  }
};

function reducer(data: { selected: number, shapeList: Shape[] }, action: { type: string; location?: Anchor; shapeType?: string; anchorOrdinal?: number; shapeOrdinal?: number; newShapeList?: any; color?: string }) {
  const { type, location, newShapeList, shapeOrdinal, shapeType, anchorOrdinal, color } = action
  let { shapeList, selected } = data
  let selectedItem = shapeList[selected]
  switch (type) {
    case 'CREATE_SHAPE':
      data = {
        shapeList: [...shapeList, Shape({
          shapeType: shapeType ? shapeType : 'line',
          color
        })],
        selected: shapeList.length
      }
      break
    case 'DELETE_SHAPE':
      if (typeof (shapeOrdinal) === "undefined") {
        break
      }
      data = {
        shapeList: R.remove(shapeOrdinal, 1, shapeList),
        selected: 0
      }
      break

    case 'CHANGE_SELECTED':
      if (typeof (shapeOrdinal) === "undefined") {
        break
      }
      data = {
        ...data,
        selected: shapeOrdinal
      }
      break

    case 'PUSH_ANCHOR':
      if (!selectedItem || selectedItem.over || !location) {
        break
      }
      if (selectedItem.data.length < 1) {
        selectedItem.data.push(location)
      }
      if (selectedItem.type === 'polygon' && selectedItem.data.length > 2) {
        selectedItem.data = setClose(selectedItem.data)
        selectedItem.over = isClose(selectedItem.data)
        if (selectedItem.over) data = {
          ...data
        }
      }
      if (selectedItem.type === 'sides' && selectedItem.data.length > 1) {
        selectedItem.over = true
        data = { ...data }
        break
      }
      selectedItem.data.push(location)
      data = { ...data }
      break

    case 'MOVE_LAST_ANCHOR':
      if (selectedItem && !selectedItem.over && selectedItem.data.length > 0) {
        selectedItem.data = R.update(-1, location, selectedItem.data) as Anchor[];
        data = { ...data }
      }
      break
    case 'MOVE_ANCHOR':
      if (selectedItem && selectedItem.data.length > 0 && typeof anchorOrdinal === 'number') {
        selectedItem.data = R.update(anchorOrdinal, location, selectedItem.data) as Anchor[];
        if (selectedItem.type === 'polygon' && selectedItem.over && action.anchorOrdinal === selectedItem.data.length - 1) {
          selectedItem.data = R.update(0, location, selectedItem.data) as Anchor[];
        }
        data = { ...data }
      }
      break
    case 'OVER':
      if (selectedItem && !selectedItem.over && selectedItem.data.length > 0) {
        selectedItem.data = R.slice(0, -2, selectedItem.data)
        if (selectedItem.type === 'polygon' && selectedItem.data.length > 3) {
          selectedItem.data = R.update(-1, R.head(selectedItem.data), selectedItem.data);
        }
        if (selectedItem.type === 'polygon' && selectedItem.data.length <= 3) {
          break
        }
        if (selectedItem.type === 'line' && selectedItem.data.length < 2) {
          break
        }
        selectedItem.over = true
        data = { ...data }
      }
      break
    case 'LOAD':
      data = {
        selected: 0,
        shapeList: newShapeList
      }
      break
  }
  return data
}

const MarkTool = (Props: Props) => {
  const [myChart, setMayChart] = useState<any | null>(null)
  const [data, dispatch] = useReducer(reducer, { selected: 0, shapeList: Props.value });
  useEffect(() => {
    myChart && myChart.setOption({
      ...chartInit,
      series: data.shapeList.map((item: { data: Anchor[]; type: string; color?: string; }, index: number) => {
        return {
          type: 'line',
          symbolSize: index === data.selected ? 14 : 0,
          data: item.data,
          lineStyle: {
            color: item.color,
          },
          itemStyle: {
            color: item.color,
          },
          markLine: item.type === 'sides' && {
            symbol: ['circle', 'triangle'],
            data: item.data[0] && [
              [{
                coord: [(item.data[0][0] + item.data[1][0]) / 2
                  - (item.data[0][1] - item.data[1][1]) / 4
                  * (myChart._dom.clientHeight / myChart._dom.clientWidth)
                  , (item.data[0][1] + item.data[1][1]) / 2
                + (item.data[0][0] - item.data[1][0]) / 4
                * (myChart._dom.clientWidth / myChart._dom.clientHeight)
                ]
              },
              {
                coord: [(item.data[0][0] + item.data[1][0]) / 2 + (item.data[0][1] - item.data[1][1]) / 4
                  * (myChart._dom.clientHeight / myChart._dom.clientWidth)
                  , (item.data[0][1] + item.data[1][1]) / 2 - (item.data[0][0] - item.data[1][0]) / 4
                  * (myChart._dom.clientWidth / myChart._dom.clientHeight)
                ]
              }]
            ]
          }
        }
      }),
      graphic: data.shapeList[data.selected] ? echarts['util'].map(data.shapeList[data.selected].data, (item: any, dataIndex: any) => {
        return {
          type: 'circle',
          position: myChart.convertToPixel('grid', item),
          shape: { cx: 0, cy: 0, r: 5 },
          invisible: true,
          draggable: true,
          ondrag: echarts['util'].curry(function (this: any, dataIndex: number) {
            const location = myChart.convertFromPixel('grid', this.position);
            dispatch({ type: 'MOVE_ANCHOR', location, anchorOrdinal: dataIndex })
          }, dataIndex),
          z: 100
        }
      }) : null
    }, true);

    Props.onChange(data)
  }, [data])

  useEffect(() => {
    dispatch({ type: 'CHANGE_SELECTED', shapeOrdinal: Props.selected })
  }, [Props.selected])

  useEffect(() => {
    Props.onReady({
      createShape,
      deleteShape
    })
    dispatch({ type: 'LOAD', newShapeList: Props.value })
  }, [myChart])

  useEffect(() => {
    R.equals(data.shapeList, Props.value) ||
      dispatch({ type: 'LOAD', newShapeList: Props.value })
  }, [Props.value])

  const editAnchor = R.curry((mode: string, location?: Anchor) => {
    dispatch({ type: mode, location })
  })

  const createShape = (shapeType: string, color?: string) => {
    dispatch({ type: 'CREATE_SHAPE', shapeType, color })
  }

  const deleteShape = (shapeOrdinal: number) => {
    dispatch({ type: 'DELETE_SHAPE', shapeOrdinal })
  }

  return <div style={{ height: '100%', width: '100%' }}
    onClick={R.compose(editAnchor('PUSH_ANCHOR') as any, getPoint)}
    onMouseMove={R.compose(editAnchor('MOVE_LAST_ANCHOR') as any, getPoint)}
    onDoubleClick={R.compose(editAnchor('OVER') as any, getPoint)}
  >
    <ReactEcharts
      onChartReady={e => {
        setMayChart(e)
      }}
      option={chartInit}
      style={{ height: '100%', width: '100%' }}
    />
  </div>
}

export { MarkTool }
