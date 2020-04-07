import { Shape, Anchor, ShapeType } from "./types";
declare type Payload = {
    selected: number;
    shapeList: Shape[];
};
declare type Action = {
    type: string;
    location?: Anchor;
    shapeType?: ShapeType;
    anchorOrdinal?: number;
    shapeOrdinal?: number;
    newShapeList?: Shape[];
    color?: string;
    data?: any;
};
export declare function reducer(payload: Payload, action: Action): Payload;
export {};
