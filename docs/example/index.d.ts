/// <reference types="react" />
export declare type Anchor = [number, number];
export declare type Anchors = Anchor[];
export declare type ShapeType = 'line' | 'polygon' | 'sides';
export declare type Shape = {
    anchors: Anchors;
    color?: string;
    over: boolean;
    type: ShapeType;
    data?: any;
};
export declare type Props = {
    selected: number;
    value: Shape[];
    showGrid?: boolean;
    onChange: (data: {
        selected: number;
        shapeList: Shape[];
    }) => void;
    onReady?: (arg0: {
        createShape: (opt: {
            shapeType: ShapeType;
            color?: string;
            data?: any;
        }) => void;
        deleteShape: (shapeType: number) => void;
    }) => void;
};
declare const MarkTool: (Props: Props) => JSX.Element;
export default MarkTool;
