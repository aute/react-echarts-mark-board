export type Anchor = [number, number];
export type Anchors = Anchor[];
export type ShapeType = 'line' | 'polygon' | 'sides';
export type Shape = {
    anchors: Anchors;
    color?: string;
    over: boolean;
    type: ShapeType;
    data?: any;
};
export interface Props {
    selected: number;
    value: Shape[];
    showGrid?: boolean;
    lineWidth?: number;
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
}
