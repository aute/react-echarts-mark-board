import { Shape, Anchor, ShapeType } from "./types";
export declare function reducer(payload: {
    selected: number;
    shapeList: Shape[];
}, action: {
    type: string;
    location?: Anchor;
    shapeType?: ShapeType;
    anchorOrdinal?: number;
    shapeOrdinal?: number;
    newShapeList?: Shape[];
    color?: string;
    data?: any;
}): {
    selected: number;
    shapeList: Shape[];
};
