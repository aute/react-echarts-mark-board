import React, { useState, useReducer, useEffect } from 'react'
import ReactEcharts from 'echarts-for-react';
import * as R from "ramda";
import echarts from 'echarts';

import { Anchor, Props, Shape, ShapeType } from './types';
import { chartInitData, getPoint, } from './utils'
import { reducer } from './ common';

const SYMBOL_SIZE = 14

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
      series: data.shapeList.map((item: Shape, index: number) => {
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
