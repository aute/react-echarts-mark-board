import React from 'react'
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";


import MarkTool from '../index'

let container = null;
beforeEach(() => {
  // 创建一个 DOM 元素作为渲染目标
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // 退出时进行清理
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test("MarkTool", () => {
  act(() => {
    render(<MarkTool
        onReady={e=>{}}
        onChange={e=>{}}
        value={[]}
        selected={0} />, container);
  });
});

