import React from "react";
import { render, fireEvent } from "@testing-library/react";
import MarkBoard from "../index";
import { Shape } from "../types";

test("onReady call", () => {
    const onReady = jest.fn();
    render(<MarkBoard
        onReady={onReady}
        value={[]}
        selected={0} />);
    expect(onReady).toHaveBeenCalledTimes(1);
});

test("data init", () => {
    let changeData = null;
    const initData = {
        selected: 1,
        shapeList: [{
            anchors: [[0, 0]],
            over: false,
            type: "line",
        }, {
            anchors: [[0, 0]],
            over: false,
            type: "line",
        }]
    };
    render(<MarkBoard
        onChange={(e): void => { changeData = e; }}
        value={initData.shapeList as Shape[]}
        selected={initData.selected} />);
        
    // expect(changeData).toStrictEqual(initData);
});

test("data init. selected > shapeList.length", () => {
    let changeData = null;
    const initData = {
        selected: 1,
        shapeList: [{
            anchors: [[0, 0]],
            over: false,
            type: "line",
        }]
    };
    render(<MarkBoard
        onChange={(e): void => { changeData = e; }}
        value={initData.shapeList as Shape[]}
        selected={initData.selected} />);
    initData.selected = 0;
    expect(changeData).toStrictEqual(initData);
});

test("createShape", () => {
    let changeData = null;
    render(<MarkBoard
        onReady={({ createShape }): void => {
            createShape({ shapeType: "line", color: "#fff000" });
        }}
        onChange={(e): void => { changeData = e; }}
        value={[]}
        selected={0} />);
    expect(changeData).toStrictEqual({
        shapeList:
            [{
                anchors: [],
                color: "#fff000",
                over: false,
                type: "line",
                data: undefined
            }],
        selected: 0
    });
});

test("deleteShape", () => {
    let changeData = null;
    render(<MarkBoard
        onReady={({ deleteShape }): void => {
            deleteShape(0);
        }}
        onChange={(e): void => { changeData = e; }}
        value={[{ "anchors": [[0, 0], [0, 0]], "color": "#fff000", "over": false, "type": "polygon" }, { "anchors": [[0, 0], [0, 0]], "color": "#fff000", "over": false, "type": "polygon" }]}
        selected={0} />);
    expect(changeData).toStrictEqual({
        shapeList:
            [{
                anchors: [[0, 0], [0, 0]],
                color: "#fff000",
                over: false,
                type: "polygon",
            }],
        selected: 0
    });
});

test("line", () => {
    let changeData = null;
    const { getByTestId, } = render(<MarkBoard
        onReady={({ createShape }): void => {
            createShape({ shapeType: "line", color: "#fff000" });
        }}
        onChange={(e): void => { changeData = e; }}
        value={[]}
        selected={0} />);
    const markBoard = getByTestId("MarkBoard");
    fireEvent.click(markBoard);
    expect(JSON.stringify(changeData)).toStrictEqual("{\"shapeList\":[{\"anchors\":[[0,0],[0,0]],\"color\":\"#fff000\",\"over\":false,\"type\":\"line\"}],\"selected\":0}");
    fireEvent.click(markBoard);
    fireEvent.click(markBoard);
    fireEvent.dblClick(markBoard);
    expect(JSON.stringify(changeData)).toStrictEqual("{\"shapeList\":[{\"anchors\":[[0,0],[0,0]],\"color\":\"#fff000\",\"over\":true,\"type\":\"line\"}],\"selected\":0}");
});

test("polygon", () => {
    let changeData = null;
    const { getByTestId, } = render(<MarkBoard
        onReady={({ createShape }): void => {
            createShape({ shapeType: "polygon", color: "#fff000" });
        }}
        onChange={(e): void => { changeData = e; }}
        value={[]}
        selected={0} />);
    const markBoard = getByTestId("MarkBoard");
    fireEvent.click(markBoard);
    expect(JSON.stringify(changeData)).toStrictEqual("{\"shapeList\":[{\"anchors\":[[0,0],[0,0]],\"color\":\"#fff000\",\"over\":false,\"type\":\"polygon\"}],\"selected\":0}");
    fireEvent.click(markBoard);
    fireEvent.click(markBoard);
    fireEvent.dblClick(markBoard);
    expect(JSON.stringify(changeData)).toStrictEqual("{\"shapeList\":[{\"anchors\":[[0,0],[0,0]],\"color\":\"#fff000\",\"over\":false,\"type\":\"polygon\"}],\"selected\":0}");
    fireEvent.click(markBoard);
    fireEvent.click(markBoard);
    fireEvent.click(markBoard);
    fireEvent.dblClick(markBoard);
    expect(JSON.stringify(changeData)).toStrictEqual("{\"shapeList\":[{\"anchors\":[[0,0],[0,0],[0,0],[0,0]],\"color\":\"#fff000\",\"over\":true,\"type\":\"polygon\"}],\"selected\":0}");
});

test("sides", () => {
    let changeData = null;
    const { getByTestId, } = render(<MarkBoard
        onReady={({ createShape }): void => {
            createShape({ shapeType: "sides", color: "#fff000" });
        }}
        onChange={(e): void => { changeData = e; }}
        value={[]}
        selected={0} />);
    const markBoard = getByTestId("MarkBoard");
    fireEvent.click(markBoard);
    expect(JSON.stringify(changeData)).toStrictEqual("{\"shapeList\":[{\"anchors\":[[0,0],[0,0]],\"color\":\"#fff000\",\"over\":false,\"type\":\"sides\"}],\"selected\":0}");
    fireEvent.click(markBoard);
    expect(JSON.stringify(changeData)).toStrictEqual("{\"shapeList\":[{\"anchors\":[[0,0],[0,0]],\"color\":\"#fff000\",\"over\":true,\"type\":\"sides\"}],\"selected\":0}");
});
