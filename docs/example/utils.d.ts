/// <reference types="react" />
import { Anchor, Anchors, Shape, ShapeType } from "./types";
export declare const chartInitData: {
    grid: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    xAxis: {
        min: number;
        max: number;
        type: string;
        splitLine: {
            show: boolean;
        };
        axisLine: {
            lineStyle: {
                color: string;
            };
            onZero: boolean;
        };
    };
    yAxis: {
        min: number;
        max: number;
        type: string;
        splitLine: {
            show: boolean;
        };
        axisLine: {
            lineStyle: {
                color: string;
            };
            onZero: boolean;
        };
    };
    series: any[];
};
export declare const getDistance: (anchor1: Anchor, anchor2: Anchor) => number;
export declare const getPoint: (e: import("react").MouseEvent<HTMLElement, MouseEvent>) => Anchor;
export declare const magnetic: (staticPoint: Anchor, attractionPoint: Anchor) => Anchor;
export declare const isClose: (polygon: Anchors) => boolean;
export declare const setClose: (polygon: Anchors) => Anchors;
export declare const createShape: (option: {
    shapeType: ShapeType;
    color?: string;
    data?: any;
}) => Shape;
export declare const getSides: (line: [Anchor, Anchor], viewRatio: number) => [Anchor, Anchor];
