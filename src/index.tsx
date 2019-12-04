import React, { useState, useReducer, useEffect } from 'react'
import ReactEcharts from 'echarts-for-react';
import * as R from "ramda";
import echarts from 'echarts';

import { Anchor, Props, Shape, ShapeType } from './types';
import { chartInitData, getPoint, getSides, } from './utils'
import { reducer } from './ common';

const SYMBOL_SIZE = 14

export default ({ onChange, onReady, selected, showGrid = false, value, lineWidth = 2 }: Props) => {

  useEffect(() => {
    R.equals(data.shapeList, value) || dispatch({ type: 'LOAD', newShapeList: value })
  }, [value])

  useEffect(() => {
    dispatch({ type: 'CHANGE_SELECTED', shapeOrdinal: selected })
  }, [selected])

  chartInitData.xAxis.splitLine.show = showGrid
  chartInitData.yAxis.splitLine.show = showGrid

  const [data, dispatch] = useReducer(reducer, { selected: 0, shapeList: value })
  useEffect(() => {
    if (myChart) {
      const winRatio = myChart._dom.clientWidth / myChart._dom.clientHeight
      const { shapeList, selected } = data
      const selectedShape = shapeList[selected]
      myChart.setOption({
        ...chartInitData,
        series: shapeList.map(
          (item: Shape, index: number) => {
            return {
              type: 'line',
              symbolSize: index === selected ? SYMBOL_SIZE : 0,
              data: item.anchors.map(i => {
                return [i[0], i[1]]
              }),
              lineStyle: {
                color: item.color,
                width: lineWidth,
              },
              itemStyle: {
                color: item.color,
              },
              markLine: item.type === 'sides' && {
                silent: true,
                symbol: ['circle', 'triangle'],
                symbolSize: R.max(12, lineWidth * 2.4),
                lineStyle: {
                  type: 'solid',
                  width: lineWidth,
                },
                // TODO optimize
                data: item.anchors[0] && [
                  [{
                    coord: getSides(item.anchors as [Anchor, Anchor], winRatio)[0]
                  },
                  {
                    coord: getSides(item.anchors as [Anchor, Anchor], winRatio)[1]
                  }]
                ]
              },
              clip: false,
            }
          }),
        graphic: selectedShape ? selectedShape.anchors.map(
          (item: Anchor, dataIndex: number) => {
            return {
              type: 'circle',
              position: myChart.convertToPixel('grid', [item[0], item[1]]),
              shape: { cx: 0, cy: 0, r: SYMBOL_SIZE },
              invisible: true,
              draggable: true,
              ondrag: echarts['util'].curry(function (this: any, dataIndex: number) {
                const location = myChart.convertFromPixel('grid', this.position);
                dispatch({
                  type: 'MOVE_ANCHOR',
                  location: [location[0], location[1]],
                  anchorOrdinal: dataIndex
                })
              }, dataIndex),
              z: 100
            }
          }) : null
      }, true);
      onChange(data)
    }
  }, [data])

  const [myChart, setMayChart] = useState<any | null>(null)
  useEffect(() => {
    if (myChart) {
      dispatch({ type: 'LOAD', newShapeList: value, shapeOrdinal: selected })
      onReady && onReady({ createShape, deleteShape })
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
    data-testid="MarkBoard"
  >
    <ReactEcharts
      onChartReady={setMayChart}
      option={chartInitData}
      style={{ height: '100%', width: '100%' }}
    />
  </div>
}

