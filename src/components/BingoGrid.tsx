import * as React from 'react';
import { autobind } from 'core-decorators';
import { BingoData } from '../data';
import { BingoCell } from './BingoCell';
import { Constants } from '../modules/constants';

export interface BingoGridProps {
    size: number;
    logoVisible: boolean;
    logoSize: number;
    tasks: BingoData.Task[];
    replaceTaskHandler: (taskId: string) => void;
}

export interface BingoGridState {
}

export class BingoGrid extends React.Component<BingoGridProps, BingoGridState> {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const gridSize = 97.5 - (this.props.logoVisible ? this.props.logoSize : 2.5);
        const cellSize = gridSize / this.props.size;
        return <div style={this.styleGrid(gridSize)}>
            {this.props.tasks.map(task => <BingoCell cellSize={cellSize} task={task} key={task.id} replaceHandler={() => this.props.replaceTaskHandler?.(task.id)} />)}
        </div>
    }

    private styleGrid(gridSize: number): React.CSSProperties {
        const cellSizePercent = `${100 / this.props.size}% `;
        const gridTemplate = cellSizePercent.repeat(this.props.size);
        // return {
        //     boxSizing: "border-box",
        //     marginLeft: "auto",
        //     marginRight: "auto",
        //     display: "grid",
        //     height: `${gridSize}vmin`,
        //     width: `${gridSize}vmin`,
        //     gridTemplateRows: gridTemplate,
        //     gridTemplateColumns: gridTemplate,
        //     borderTop: "solid 2px #000000",
        //     borderLeft: "solid 2px #000000"
        // }

        const remainingSizePercent = 100 - gridSize;
        const topMargin = this.props.logoVisible ? this.props.logoSize : (remainingSizePercent / 2);

        return {
            boxSizing: "border-box",
            position: "absolute",
            top: `${topMargin}vmin`,
            left: 0,
            right: 0,
            marginLeft: "auto",
            marginRight: "auto",
            display: "grid",
            height: `${gridSize}vmin`,
            width: `${gridSize}vmin`,
            gridTemplateRows: gridTemplate,
            gridTemplateColumns: gridTemplate,
            borderTop: "solid 2px #000000",
            borderLeft: "solid 2px #000000"
        }
    }


}