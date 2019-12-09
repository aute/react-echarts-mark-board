import * as R from "ramda";
import { Anchor, Anchors, Shape, ShapeType } from "./types";

export const chartInitData = {
  grid: {
    top: 0,
    right: 1,
    bottom: 1,
    left: 0
  },
  xAxis: {
    min: 0,
    max: 1,
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
    max: 1,
    inverse:true,
    type: 'value',
    splitLine: {
      show: false
    },
    axisLine: {
      lineStyle: { color: 'rgba(0,0,0,0)' }, onZero: false
    }
  },
  series: []
};

export const getDistance = (anchor1: Anchor, anchor2: Anchor): number => {
  const s = Math.sqrt(Math.pow(anchor1[0] - anchor2[0], 2) + Math.pow(anchor1[1] - anchor2[1], 2));
  return s;
};

export const getPoint = (e: React.MouseEvent<HTMLElement>): Anchor => {
  const offsetX = e.nativeEvent.offsetX || 0;
  const offsetY = e.nativeEvent.offsetY || 0;
  const clientWidth = e.currentTarget.clientWidth || 0;
  const clientHeight = e.currentTarget.clientHeight || 0;
  const x = offsetX / clientWidth || 0;
  const y = offsetY / clientHeight || 0;
  return [x, y];
};

export const magnetic = (staticPoint: Anchor, attractionPoint: Anchor): Anchor => {
  const gravitation = 0.05;
  const distance = getDistance(staticPoint, attractionPoint);
  if (gravitation - distance < 0) {
    return attractionPoint;
  }
  return staticPoint;
};

export const isClose = (polygon: Anchors): boolean => {
  return R.equals(R.head(polygon), R.last(polygon));
};

export const setClose = (polygon: Anchors): Anchors => {
  return R.update(-1, magnetic(R.head(polygon), R.last(polygon)), polygon);
};

export const createShape = (option: { shapeType: ShapeType; color?: string; data?: any }): Shape => {
  return {
    anchors: [],
    color: option.color,
    over: false,
    type: option.shapeType,
    data: option.data
  };
};

export const getSides = (line:[Anchor, Anchor], viewRatio:number): [Anchor, Anchor] => {
  const [[startX, startY], [endX, endY]] = line;

  return [
    [
      (startX + endX) / 2 - (startY - endY) / 4 / viewRatio,
      (startY + endY) / 2 + (startX - endX) / 4 * viewRatio
    ],
    [
      (startX + endX) / 2 + (startY - endY) / 4 / viewRatio,
      (startY + endY) / 2 - (startX - endX) / 4 * viewRatio
    ]
  ];
};