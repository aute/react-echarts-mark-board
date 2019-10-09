/// <reference types="react" />
declare type Props = {
    selected: number;
    value: any;
    onChange: (arg0: any) => void;
    onReady: (arg0: {
        createShape: (shapeType: string, color?: string) => void;
        deleteShape: (shapeType: number) => void;
    }) => void;
};
declare const MarkTool: (Props: Props) => JSX.Element;
export { MarkTool };
