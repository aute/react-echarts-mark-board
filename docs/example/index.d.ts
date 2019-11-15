/// <reference types="react" />
declare type Anchor = [number, number];
declare type Anchors = Anchor[];
declare type ShapeType = 'line' | 'polygon' | 'sides';
declare type Shape = {
    anchors: Anchors;
    color?: string;
    over: boolean;
    type: ShapeType;
    data?: object;
};
declare type Props = {
    selected: number;
    value: Shape[];
    showGrid?: boolean;
    onChange: (data: {
        selected: number;
        shapeList: Shape[];
    }) => void;
    onReady: (arg0: {
        createShape: (opt: {
            shapeType: ShapeType;
            color?: string;
            data?: object;
        }) => void;
        deleteShape: (shapeType: number) => void;
    }) => void;
};
declare const Shape: (option: {
    shapeType: ShapeType;
    color?: string;
    data?: object;
}) => Shape;
declare const MarkTool: (Props: Props) => JSX.Element;
export default MarkTool;
