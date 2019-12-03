import React, { useState, useReducer, useEffect } from 'react'
import ReactEcharts from 'echarts-for-react';
import * as R from "ramda";
import echarts from 'echarts';

export type Anchor = [number, number]

export type Anchors = Anchor[]

export type ShapeType = 'line' | 'polygon' | 'sides'

export type Shape = {
  anchors: Anchors,
  color?: string,
  over: boolean,
  type: ShapeType,
  data?: any
}

export type Props = {
  selected: number,
  value: Shape[],
  showGrid?: boolean,
  onChange: (data: {
    selected: number;
    shapeList: Shape[];
  }) => void,
  onReady?: (arg0: {
    createShape: (opt: {
      shapeType: ShapeType,
      color?: string,
      data?: any
    }) => void,
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
    splitLine: {
      show: false
    },
    axisLine: {
      lineStyle: { color: 'rgba(0,0,0,0)' }, onZero: false
    }
  },
  yAxis: {
    min: 0,
    max: 100,
    type: 'value',
    splitLine: {
      show: false
    },
    axisLine: {
      lineStyle: { color: 'rgba(0,0,0,0)' }, onZero: false
    }
  },
  series: []
}

const SYMBOL_SIZE = 14

// TODO remove abs
const getDistance = (anchor1: Anchor, anchor2: Anchor): number => {
  const s = Math.sqrt(Math.pow(Math.abs(anchor1[0] - anchor2[0]), 2) + Math.pow(Math.abs(anchor1[1] - anchor2[1]), 2))
  return s;
}
// TODO remove 100 , 归一化
const getPoint = (e: React.MouseEvent<HTMLElement>): Anchor => {
  const offsetX = e.nativeEvent.offsetX || 0
  const offsetY = e.nativeEvent.offsetY || 0
  const clientWidth = e.currentTarget.clientWidth || 0
  const clientHeight = e.currentTarget.clientHeight || 0
  const x = 100 * offsetX / clientWidth || 0;
  const y = 100 * offsetY / clientHeight || 0;
  return [x, y];
}

const magnetic = (staticPoint: Anchor, attractionPoint: Anchor): Anchor => {
  const gravitation = 5
  const distance = getDistance(staticPoint, attractionPoint)
  if (gravitation - distance < 0) {
    return attractionPoint
  }
  return staticPoint
}

const isClose = (polygon: Anchors): boolean => {
  return R.equals(R.head(polygon), R.last(polygon))
}

const setClose = (polygon: Anchors): Anchors => {
  return R.update(-1, magnetic(R.head(polygon), R.last(polygon)), polygon)
}

const Shape = (option: { shapeType: ShapeType; color?: string; data?: any }): Shape => {
  return {
    anchors: [],
    color: option.color,
    over: false,
    type: option.shapeType,
    data: option.data
  }
};

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
        shapeList: [...shapeList, Shape({
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
      // TODO fix if
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
// TODO default Props
const MarkTool = (Props: Props) => {
  const [myChart, setMayChart] = useState<any | null>(null)
  const [data, dispatch] = useReducer(reducer, { selected: 0, shapeList: Props.value })
  chartInit.xAxis.splitLine.show = Boolean(Props.showGrid)
  chartInit.yAxis.splitLine.show = Boolean(Props.showGrid)
  useEffect(() => {
    myChart && myChart.setOption({
      ...chartInit,
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
    Props.onChange(data)
  }, [data])

  useEffect(() => {
    dispatch({ type: 'CHANGE_SELECTED', shapeOrdinal: Props.selected })
  }, [Props.selected])

  useEffect(() => {
    if (myChart) {
      dispatch({ type: 'LOAD', newShapeList: Props.value, shapeOrdinal: Props.selected })
      Props.onReady && Props.onReady({
        createShape,
        deleteShape
      })
    }
  }, [myChart])

  useEffect(() => {
    R.equals(data.shapeList, Props.value) ||
      dispatch({ type: 'LOAD', newShapeList: Props.value })
  }, [Props.value])

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
      option={chartInit}
      style={{ height: '100%', width: '100%' }}
    />
  </div>
}

export default MarkTool
