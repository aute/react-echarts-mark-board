import React from 'react'
import { render, unmountComponentAtNode } from "react-dom"
import { act } from "react-dom/test-utils"

import MarkTool, { Shape } from '../index'

let container = null
beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
});

afterEach(() => {
    unmountComponentAtNode(container)
    container.remove();
    container = null;
});

test("onReady call", () => {
    const onReady = jest.fn();
    act(() => {
        render(<MarkTool
            onReady={onReady}
            onChange={onChange => { }}
            value={[]}
            selected={0} />, container)
    });
    expect(onReady).toHaveBeenCalledTimes(1)
});

test("data init", () => {
    let changeData = null;
    const initData = {
        selected: 1,
        shapeList: [{
            anchors: [[0, 0]],
            over: false,
            type: 'line',
        }, {
            anchors: [[0, 0]],
            over: false,
            type: 'line',
        }]
    }
    act(() => {
        render(<MarkTool
            onChange={e => { changeData = e }}
            value={initData.shapeList as Shape[]}
            selected={initData.selected} />, container);
    });
    expect(changeData).toStrictEqual(initData);
});

test("data init. selected > shapeList.length", () => {
    let changeData = null;
    const initData = {
        selected: 1,
        shapeList: [{
            anchors: [[0, 0]],
            over: false,
            type: 'line',
        }]
    }
    act(() => {
        render(<MarkTool
            onChange={e => { changeData = e }}
            value={initData.shapeList as Shape[]}
            selected={initData.selected} />, container)
    });
    initData.selected = 0
    expect(changeData).toStrictEqual(initData)
});

test("createShape", () => {
    let changeData = null;
    act(() => {
        render(<MarkTool
            onReady={({ createShape }) => {
                createShape({ shapeType: 'line', color: '#fff000' })
            }}
            onChange={e => { changeData = e }}
            value={[]}
            selected={0} />, container)
    });
    expect(changeData).toStrictEqual({
        shapeList:
            [{
                anchors: [],
                color: '#fff000',
                over: false,
                type: 'line',
                data: undefined
            }],
        selected: 0
    })
});

test("click", () => {
    let changeData = null;
    act(() => {
        render(<MarkTool
            onReady={({ createShape }) => {
                createShape({ shapeType: 'line', color: '#fff000' })
            }}
            onChange={e => { changeData = e }}
            value={[]}
            selected={0} />, container)
    });
    const markTool = document.querySelector("[data-testid=MarkTool]");
    act(() => {
        markTool.dispatchEvent(new MouseEvent("click", { 
            bubbles: true,
         }));
    });
    console.log(changeData.shapeList[0].anchors);
    
    //expect(changeData).toStrictEqual({ selected: 0, shapeList: [] })
});
