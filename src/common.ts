import { Shape, Anchor, ShapeType } from "./types";
import { createShape, isClose, setClose } from "./utils";
import * as R from "ramda";

type Payload = {
    selected: number;
    shapeList: Shape[];
};
type Action = {
    type: string;
    location?: Anchor;
    shapeType?: ShapeType;
    anchorOrdinal?: number;
    shapeOrdinal?: number;
    newShapeList?: Shape[];
    color?: string;
    data?: any;
};

export function reducer(
    payload: Payload,
    action: Action
): Payload {
    const { type, location, newShapeList, shapeOrdinal, shapeType, anchorOrdinal, color, data } = action;
    const { shapeList, selected } = payload;
    const selectedItem = shapeList[selected];
    switch (type) {
    case "CREATE_SHAPE":
        payload = {
            shapeList: [...shapeList, createShape({
                shapeType: shapeType ? shapeType : "line",
                color,
                data
            })],
            selected: shapeList.length
        };
        break;
    case "DELETE_SHAPE":
        if (typeof (shapeOrdinal) === "undefined") {
            break;
        }
        payload = {
            shapeList: R.remove(shapeOrdinal, 1, shapeList),
            selected: 0
        };
        break;

    case "CHANGE_SELECTED":
        if (typeof (shapeOrdinal) === "undefined") {
            break;
        }
        payload = {
            ...payload,
            selected: shapeOrdinal
        };
        break;
    case "PUSH_ANCHOR":
        if (!selectedItem || selectedItem.over || !location) {
            break;
        }
        if (selectedItem.anchors.length < 1) {
            selectedItem.anchors.push(location);
        }
        if ((selectedItem.type === "polygon" || selectedItem.type === "sides_polygon") && selectedItem.anchors.length > 3) {
            selectedItem.anchors = setClose(selectedItem.anchors);
            selectedItem.over = isClose(selectedItem.anchors);
            if (selectedItem.over) {
                payload = {
                    ...payload
                };
                break;
            }
        }
        if (selectedItem.type === "sides" && selectedItem.anchors.length > 1) {
            selectedItem.over = true;
            payload = { ...payload };
            break;
        }
        if (selectedItem.type === "arrow" && selectedItem.anchors.length > 1) {
            selectedItem.over = true;
            payload = { ...payload };
            break;
        }
        selectedItem.anchors.push(location);
        payload = { ...payload };
        break;

    case "MOVE_LAST_ANCHOR":
        if (selectedItem && !selectedItem.over && selectedItem.anchors.length > 0) {
            selectedItem.anchors = R.update(-1, location, selectedItem.anchors);
            payload = { ...payload };
        }
        break;
    case "MOVE_ANCHOR":
        if (selectedItem && selectedItem.anchors.length > 0 && typeof anchorOrdinal === "number") {
            selectedItem.anchors = R.update(anchorOrdinal, location, selectedItem.anchors);
            if ((selectedItem.type === "polygon" || selectedItem.type === "sides_polygon") && selectedItem.over && action.anchorOrdinal === selectedItem.anchors.length - 1) {
                selectedItem.anchors = R.update(0, location, selectedItem.anchors);
            }
            payload = { ...payload };
        }
        break;
    case "OVER":
        if (selectedItem && !selectedItem.over && selectedItem.anchors.length > 0) {
            selectedItem.anchors = R.slice(0, -2, selectedItem.anchors);
            if ((selectedItem.type === "polygon" || selectedItem.type === "sides_polygon") && selectedItem.anchors.length > 3) {
                selectedItem.anchors = R.update(-1, R.head(selectedItem.anchors), selectedItem.anchors);
            }
            if ((selectedItem.type === "polygon" || selectedItem.type === "sides_polygon") && selectedItem.anchors.length <= 3) {
                break;
            }
            if (selectedItem.type === "line" && selectedItem.anchors.length < 2) {
                break;
            }
            selectedItem.over = true;
            payload = { ...payload };
        }
        break;
    case "LOAD":
        payload = {
            selected: !shapeOrdinal || shapeOrdinal < 0 || shapeOrdinal >= newShapeList.length ? 0 : shapeOrdinal,
            shapeList: newShapeList
        };
        break;
    }
    return payload;
}