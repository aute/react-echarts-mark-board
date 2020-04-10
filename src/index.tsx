import React, { useState, useReducer, useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import * as R from "ramda";
import echarts from "echarts";

import { Anchor, Props, Shape, ShapeType } from "./types";
import { chartInitData, getPoint, getSides, getArrow } from "./utils";
import { reducer } from "./common";

const SYMBOL_SIZE = 12;

const markBoard: React.FC<Props> = ({ onChange, onReady, selected, showGrid = false, value, lineWidth = 2 }: Props) => {
    const [data, dispatch] = useReducer(reducer, { selected: 0, shapeList: value });

    useEffect(() => {
        R.equals(data.shapeList, value) || dispatch({ type: "LOAD", newShapeList: value });
    }, [value]);

    useEffect(() => {
        dispatch({ type: "CHANGE_SELECTED", shapeOrdinal: selected });
    }, [selected]);

    chartInitData.xAxis.splitLine.show = showGrid;
    chartInitData.yAxis.splitLine.show = showGrid;

    const [myChart, setMayChart] = useState<any | null>(null);
    useEffect(() => {
        if (myChart) {
            const winRatio = myChart._dom.clientWidth / myChart._dom.clientHeight;
            const { shapeList, selected } = data;
            const selectedShape = shapeList[selected];
            myChart.setOption({
                ...chartInitData,
                series: shapeList.map(
                    (item: Shape, index: number) => {
                        const getMarkLineData = (): object => {
                            const coords = item.anchors[0] ? getSides(item.anchors as [Anchor, Anchor], winRatio) : null;
                            return coords ? [
                                [{
                                    coord: coords[0]
                                },
                                {
                                    coord: coords[1]
                                }]
                            ] : null;
                        };
                        const [[startX, startY], [endX, endY]] = item.anchors[0] && item.anchors[1]? item.anchors : [[0,0],[0,0]];
                        const getMarkPointData = (): object => {
                            const coord = item.anchors[0] ? getArrow(item.anchors as [Anchor, Anchor]) : null;
                            return coord ? [{coord}]: null;
                        };
                        return {
                            type: "line",
                            symbolSize: index === selected ? SYMBOL_SIZE : 0,
                            data: item.anchors,
                            lineStyle: {
                                color: item.color,
                                width: lineWidth,
                            },
                            itemStyle: {
                                color: item.color,
                            },
                            markPoint: item.type === "arrow" && {
                                silent: true,
                                symbol: "triangle",
                                symbolSize: R.max(18, lineWidth * 3.6),
                                symbolRotate: (endX-startX) > 0 ? Math.atan((-endY+startY)/(endX-startX)/winRatio)*180/Math.PI-90 : Math.atan((endY-startY)/(-endX+startX)/winRatio)*180/Math.PI+90,
                                data: getMarkPointData(),
                                animation: false
                            },
                            markLine: (item.type === "sides" || item.type === "sides_polygon") && {
                                silent: true,
                                symbol: ["circle", "triangle"],
                                symbolSize:  R.max(18, lineWidth * 3.6),
                                lineStyle: {
                                    type: "solid",
                                    width: lineWidth,
                                    clip: false,
                                },
                                data: getMarkLineData(),
                                animation: false,
                            },
                            clip: false,
                        };
                    }),
                graphic: selectedShape ? selectedShape.anchors.map(
                    (item: Anchor, dataIndex: number) => {
                        return {
                            type: "circle",
                            position: myChart.convertToPixel("grid", [item[0], item[1]]),
                            shape: { cx: 0, cy: 0, r: SYMBOL_SIZE },
                            invisible: true,
                            draggable: true,
                            ondrag: echarts["util"].curry(function (this: any, dataIndex: number) {
                                const location = myChart.convertFromPixel("grid", this.position);
                                dispatch({
                                    type: "MOVE_ANCHOR",
                                    location: [location[0], location[1]],
                                    anchorOrdinal: dataIndex
                                });
                            }, dataIndex),
                            z: 100
                        };
                    }) : null
            }, true);
            onChange && onChange(data);
        }
    }, [data]);

    const createShape = (opt: {
        shapeType: ShapeType;
        color?: string;
        data?: any;
    }): void => {
        dispatch({ type: "CREATE_SHAPE", shapeType: opt.shapeType, color: opt.color, data: opt.data });
    };

    const deleteShape = (shapeOrdinal: number): void => {
        dispatch({ type: "DELETE_SHAPE", shapeOrdinal });
    };

    useEffect(() => {
        if (myChart) {
            dispatch({ type: "LOAD", newShapeList: value, shapeOrdinal: selected });
            onReady && onReady({ createShape, deleteShape });
        }
    }, [myChart]);

    const editAnchor = R.curry((mode: string, location: Anchor) => {
        dispatch({ type: mode, location });
    });

    return <div style={{ height: "100%", width: "100%" }}
        onClick={R.compose(editAnchor("PUSH_ANCHOR"), getPoint)}
        onMouseMove={R.compose(editAnchor("MOVE_LAST_ANCHOR"), getPoint)}
        onDoubleClick={R.compose(editAnchor("OVER"), getPoint)}
        data-testid='MarkBoard'
    >
        <ReactEcharts
            onChartReady={setMayChart}
            option={chartInitData}
            style={{ height: "100%", width: "100%" }}
        />
    </div>;
};
export default markBoard;