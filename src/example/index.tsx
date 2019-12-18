import React from "react";
import ReactDOM from "react-dom";
import { ChangeHistory, ShowChart, CallMade, Clear, GitHub } from "@material-ui/icons";
import MarkBoard from "../index";
import { useState, useEffect, useRef } from "react";
import { shapeListInitData } from "./data";
import "./App.scss";

const App = () => {
    const markTool = useRef(null);
    const [shapeList, setShapeList] = useState(shapeListInitData);
    const [selected, setSelected] = useState(1);

    const [activeButton, setActiveButton] = useState("");

    useEffect(() => {
        shapeList[selected] ?
            (
                !shapeList[selected].over ?
                    setActiveButton(shapeList[selected].type) :
                    setActiveButton(null)
            ) :
            setActiveButton(null);
    }, [shapeList, selected]);


    const onReady = (tool) => {
        markTool.current = tool;
    };
    const createShape = (p, color?: string) => {
        markTool.current.createShape(p, color);
    };
    const deleteShape = (n: number) => {
        markTool.current.deleteShape(n);
    };
    return (
        <div className='App'>
            <div className='App-content'>
                <Sketchpad
                    onReady={onReady}
                    setShapeList={setShapeList}
                    setSelected={setSelected}
                    shapeList={shapeList}
                    selected={selected}
                />
                <div className='App-tools'>
                    <Buttons
                        activeButton={activeButton}
                        createShape={createShape} />
                    <ShapeList
                        shapeList={shapeList}
                        selected={selected}
                        setSelected={setSelected}
                        deleteShape={deleteShape} />
                </div>
                <h1>React<br />echarts<br />mark<br />board</h1>
            </div>
            <a className='GitHub-icon' href="https://github.com/aute/react-echarts-mark-board">
                <GitHub /><span>GitHub</span>
            </a>
            <footer>
                Aute
            </footer>
        </div>
    );
};

const Buttons = (props: any) => {
    return <div className='buttons'>
        <button onClick={() => props.createShape({ shapeType: "polygon", color: "#14FF8E" })}
            className={props.activeButton === "polygon" ? "active" : ""}>
            <ChangeHistory style={{ transform: "translateY(-0.03125rem)" }} />
        </button>
        <button onClick={() => props.createShape({ shapeType: "line", color: "#F276A3" })}
            className={props.activeButton === "line" ? "active" : ""}>
            <ShowChart />
        </button>
        <button onClick={() => props.createShape({ shapeType: "sides", color: "#fff000" })}
            className={props.activeButton === "sides" ? "active" : ""}>
            <CallMade />
        </button>
    </div>;
};

const ShapeList = (props: any) => {
    return <ul>
        {
            props.shapeList && props.shapeList.map((i, index: number) => {
                return (
                    <li key={index} className={props.selected === index ? "active" : ""} onClick={() => {
                        props.setSelected(index);
                    }}>
                        <p>{i.data ? i.data.lable : i.type}</p>
                        <Clear className='clear' onClick={(e) => {
                            e.stopPropagation();
                            props.deleteShape(index);
                        }} />
                    </li>
                );
            }).reverse()
        }
    </ul>;
};

const Sketchpad = (props: any) => {
    return <div className='App-Sketchpad-Wrap'>
        <div className='App-Sketchpad'>
            <MarkBoard
                lineWidth={6}
                onReady={props.onReady}
                onChange={e => {
                    props.setShapeList([...e.shapeList]);
                    props.setSelected(e.selected);
                }}
                selected={props.selected}
                value={props.shapeList} />
        </div>
    </div>;
};

ReactDOM.render(<App />, document.getElementById("root"));
