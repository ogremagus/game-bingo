import * as React from 'react';
import { autobind } from 'core-decorators';

import { BingoData } from '../data';
import { Constants } from '../modules/constants';
import * as Color from 'color';
import { Config } from '../modules/config';

export interface BingoCellProps {
    cellSize: number;
    task: BingoData.Task;
    replaceHandler: () => void;
}

export interface BingoCellState {
    hover: boolean;
    done: boolean;
}

export class BingoDoneMarker extends React.Component<{}, null> {
    constructor(props) {
        super(props);
    }

    render() {
        return <div style={this.styleMarker()}></div>
    }

    private styleMarker(): React.CSSProperties {
        return {
            backgroundImage: `url("img/${Config.doneMarkerImage}")`,
            width: "100%",
            height: "100%",
            opacity: Config.doneMarkerOpacity,
            backgroundSize: "contain",
            position: "absolute",
            // filter: "drop-shadow(5px 5px 5px black) drop-shadow(0px 0px 20px black)",
            filter: "drop-shadow(0.4vmin 0.4vmin 1vmin black)",
            top: 0,
            left: 0
        }
    }
}

export class BingoCell extends React.Component<BingoCellProps, BingoCellState> {

    constructor(props) {
        super(props);
        this.state = { hover: false, done: this.props.task.category.id == "FREE" ? true : false };
    }

    render() {
        return <div style={this.styleCell()} onMouseEnter={this.setHover} onMouseLeave={this.unsetHover} onClick={this.toggleDone} onContextMenu={this.handleReplace}>
            {Config.showCategoryName ? <span style={this.styleCategoryText()}>{this.props.task.category.name}</span> : null }
            {this.state.done ? <BingoDoneMarker /> : null}
            <span style={this.styleText()}>{this.props.task.name}</span>
        </div>
    }

    private styleCell(): React.CSSProperties {
        const CELL_BORDER_PERCENTAGE = 0.05;
        const cellBorderAmount = this.props.cellSize * CELL_BORDER_PERCENTAGE;
        const actualCellSize = this.props.cellSize - 2 * (cellBorderAmount);
        const backgroundColor = new Color(this.getCellBackgroundColor()).darken(this.state.hover ? 0.1 : 0).toString();
        return {
            display: "block",
            boxSizing: "border-box",
            height: "100%",
            width: "100%",
            lineHeight: `${actualCellSize}vmin`,
            textAlign: "center",
            position: "relative",
            backgroundColor: backgroundColor,
            padding: `${cellBorderAmount}vmin`,
            borderBottom: "solid 2px #000000",
            borderRight: "solid 2px #000000",
            boxShadow: "inset -1px -1px 20px rgba(0,0,0,0.33), inset 1px 1px 20px rgba(0,0,0,0.25)",
            cursor: this.state.hover ? "pointer" : "auto"
        }
    }

    private styleCategoryText(): React.CSSProperties {
        const lineFactor = 7;
        const lineHeight = (this.props.cellSize) / lineFactor;
        const fontHeight = (this.props.cellSize) / (lineFactor + 1);
        const textColor = new Color(this.getCellBackgroundColor()).lighten(this.state.hover ? 0.1 : 0.33).alpha(this.state.done ? 0.75 : 1).toString();
        const outlineColor = new Color(textColor).darken(0.75).alpha(this.state.done ? 0 : 1).toString();
        const outline = `-1px 1px 0 ${outlineColor}, 1px 1px 0 ${outlineColor}, 1px -1px 0 ${outlineColor}, -1px -1px 0 ${outlineColor}`;
        return {
            display: "inline-block",
            position: "absolute",
            top: `0vmin`, //PoP hack
            left: `${lineHeight / 4}vmin`,
            lineHeight: `${lineHeight}vmin`,
            fontSize: `${lineHeight - 1}vmin`,
            textAlign: "left",
            overflow: "hidden",
            color: Constants.TILE_CATEGORY_TEXT_COLOR || textColor,
            textShadow: outline,
        }
    }

    private styleText(): React.CSSProperties {
        const textLength = this.props.task.name.length;
        const lineFactor = 5 + Math.floor(textLength / 15.0);
        const lineHeight = (this.props.cellSize) / lineFactor;
        const fontHeight = (this.props.cellSize) / (lineFactor + 2);
        const textColor = new Color(Constants.TILE_TASK_TEXT_COLOR).alpha(this.state.done ? 0.5 : 1).toString();
        const outlineColor = new Color("black").alpha(this.state.done ? 0 : 1).toString();
        const outline = `-1px 1px 0 ${outlineColor}, 1px 1px 0 ${outlineColor}, 1px -1px 0 ${outlineColor}, -1px -1px 0 ${outlineColor}`;
        return {
            display: "inline-block",
            verticalAlign: "middle",
            lineHeight: `${lineHeight}vmin`,
            fontSize: `${fontHeight}vmin`,
            textAlign: "center",
            color: textColor,
            textShadow: outline,
            // textShadow: "-1px 1px 0 #000, 1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000, 3px 3px 5px #000",
            hyphens: "auto",
        }
    }

    private getCellBackgroundColor() {
        return this.props.task.category.backgroundColor ?? Constants.TILE_DEFAULT_BACKGROUND;
    }

    @autobind
    private setHover() {
        this.setState({hover: true})
    }

    @autobind
    private unsetHover() {
        this.setState({hover: false})
    }

    @autobind
    private toggleDone() {
        this.setState({done: !this.state.done})
    }

    @autobind
    private handleReplace(e) {
        e.preventDefault();
        this.props.replaceHandler?.();
        // this.setState({done: !this.state.done})
    }


}