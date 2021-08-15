import * as Color from 'color';
import { autobind } from 'core-decorators';
import * as React from 'react';
import FontAwesome from 'react-fontawesome';
import { Config } from '../modules/config';
import { Constants } from '../modules/constants';
import { GridGenerator } from '../modules/generator';
import { BoolMultiChooser, CategoryChooser, ImageMultiChooser, MultiChooser } from './Choosers';

export class CloseButton extends React.Component<{ onClick: () => void }, { hover: boolean }> {

    constructor(props) {
        super(props);
        this.state = { hover: false};
    }

    render() {
        return <div style={this.styleIcon()} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} onClick={this.handleClick} ><FontAwesome name={"times"} /></div>

    }

    private styleIcon(): React.CSSProperties {
        const color = new Color(Constants.BACKGROUND_COLOR).darken(this.state.hover ? 0.66 : 0.33).toString();
        return {
            position: "absolute",
            top: "2vmin",
            right: "3vmin",
            fontSize: "6vmin",
            color: color,
            cursor: this.state.hover ? "pointer" : "auto",
        }
    }

    @autobind
    private toggleHover() {
        this.setState({hover: !this.state.hover})
    }

    @autobind
    private handleClick(e) {
        e.stopPropagation();
        this.props.onClick();
    }
}

export interface BingoFullScreenProps {
    onClose:() => void;
}
export abstract class BingoFullScreen<P, S> extends React.Component<BingoFullScreenProps & P, S> {

    constructor(props) {
        super(props);
    }

    render() {
        return <div style={this.styleScreen()} onClick={(e) => {e.stopPropagation()}}>
            <CloseButton onClick={() => this.props.onClose()} />
            <span style={this.styleHeader()}>{this.headerText()}</span>
            {this.renderChildren()}
        </div>
    }

    abstract headerText(): string;
    abstract renderChildren(): JSX.Element | JSX.Element[];

    private styleHeader(): React.CSSProperties {
        return {
            display: "block",
            fontSize: "6vmin",
            textAlign: "center",
            marginBottom: "1vmin",
            color: Constants.SETTING_TITLE_COLOR
        }
    }

    private styleScreen(): React.CSSProperties {
        return {
            boxSizing: "border-box",
            padding: "1vmin",
            height: "calc(100vh - 10vmin",
            width: "calc(100vw - 10vmin)",
            marginLeft: "auto",
            fontSize: "3vh",
            marginRight: "auto",
            marginTop: "5vmin",
            backgroundColor: Constants.BACKGROUND_COLOR,
            borderRadius: "2vmin",
            textAlign: "center",
            filter: "drop-shadow(1vmin 1vmin 1vmin #000000)"
        }
    }
}


export class BingoHelpScreen extends BingoFullScreen<{}, null> {

    constructor(props) {
        super(props);
    }

    headerText() {
        return "HELP";
    }

    renderChildren() {
        return <div style={this.styleText()}>
            <p>The objective of <span style={this.styleGameName()}>Prince of Persia</span> {this.bingo()} is to complete a full row or a column (or a diagonal) of tasks, specified in the grid, as fast as possible. This fun activity is suitable for online speedrunning races or casual streaming.</p>
            <div style={this.styleMidHeader()}>Rules</div>
            <ol style={{marginLeft: "10vmin"}}>
                <li style={this.styleLi()}>A single thing happening can complete only one task, even if it fits multiple tasks in the grid. The runner must choose which task to mark as completed. For example, killing a guard on level 2 in spikes can complete either a <span style={this.styleEmphasis()}>"kill a guard on level 2"</span> task or <span style={this.styleEmphasis()}>"kill a guard in spikes"</span>, but not both.</li>
                <li style={this.styleLi()}>Depending on the board size, there's a limited number of tasks that can be marked as completed per level:
                    <ul style={{marginLeft: `5vmin`, listStyleType: "square"}}>
                        <li>3x3: 1 task per level</li>
                        <li>5x5: 2 tasks per level</li>
                        <li>7x7: 3 tasks per level, but unused slots (maximum 3 total) advance to next level.</li>
                    </ul>
                </li>
                <li style={this.styleLi()}>The above limit does not apply to "global" tasks - ones that affect the entire run. Example: <span style={this.styleEmphasis()}>"Drink every health potion in the game"</span>.</li>
                <li style={this.styleLi()}>The runner chooses what to do and marks tasks manually after completion. </li>
                <li>The run ends either when a {this.bingo()} is completed or when the princess is saved after a {this.bingo()} is completed (you decide!) </li>
            </ol>
            <div style={this.styleMidHeader()}>Additional info</div>
            <ol style={{marginLeft: `10vmin`}}>
                <li>the settings menu is fairly self-explanatory but some of the settings regenerate the board</li>
                <li>the buttons in the top-right can be made invisible by right-clicking them</li>
                <li>a single task can be regenerated to another by right-clicking it</li>
                <li>logo can be hidden by clicking it (and restored in settings)</li>
                <li>the URL of the board is shareable</li>
                <li>everything is stored in your browser (no server-side stuff)</li>
            </ol>
            <div style={this.styleMidHeader()}>Credits</div>
            <p>Special thanks to <span style={this.styleEmphasis()}>VelCheran</span> anc <span style={this.styleEmphasis()}>7eraser7</span> for helping with task ideas :)</p>
            <div style={this.styleFooter()}>POPBINGO 0.7.1 - (c) WinterThunder 2021</div>
        </div>
    }

    private styleX(): React.CSSProperties {
        return {

        }
    }

    private bingo(): JSX.Element[] {
        const colors = [
            "royalblue",
            "limegreen",
            "gold",
            "red",
            "magenta"
        ]
        return ["B","I","N","G","O"].map((letter, index) => {
            return <span style={{
                color: colors[index],
                textShadow: "-2px 2px 0 #000, 2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000",
            }}>{letter}</span>
        });
    }

    private styleGameName(): React.CSSProperties {
        return {
            textShadow: "-2px 2px 0 #000, 2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000",
        }
    }


    private styleEmphasis(): React.CSSProperties {
        const textColor = new Color(Constants.BACKGROUND_COLOR).rotate(10).lighten(1.5).toString();
        return {
            color: textColor,
        }
    }

    private styleLi(): React.CSSProperties {
        return {
            paddingBottom: `0.5vmin`
        }
    }


    private styleFooter(): React.CSSProperties {
        return {
            color: Constants.SETTINGS_LABEL_COLOR,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: `1vmin`,
            fontSize: '3vmin',
            textAlign: "center",
        }
    }

    private styleMidHeader(): React.CSSProperties {
        const textColor = new Color(Constants.SETTING_TITLE_COLOR).rotate(-20).toString();
        return {
            color: textColor,
            fontSize: '2.5vmin',
            paddingTop: '2vmin',
            paddingBottom: '0.5vmin'
        }
    }

    private styleText(): React.CSSProperties {
        const textColor = new Color(Constants.TILE_TASK_TEXT_COLOR).toString();
        return {
            overflowY: "auto",
            height: "75vh",
            display: "inline-block",
            verticalAlign: "middle",
            fontSize: `2vmin`,
            textAlign: "left",
            color: textColor,
            marginLeft: "3vmin",
            marginRight: "3vmin",
            // textShadow: outline,
            // textShadow: "-1px 1px 0 #000, 1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000",
            // hyphens: "auto",
        }
    }


}
export interface BingoSettingsScreenProps extends BingoFullScreenProps {
    onRefresh:() => void;
    onRegenerate:() => void;
}
export class BingoSettingsScreen extends BingoFullScreen<BingoSettingsScreenProps, null> {

    constructor(props) {
        super(props);
    }

    headerText() {
        return "SETTINGS";
    }

    renderChildren() {
        return [
            <MultiChooser label="Grid size" initialValue={Config.gridSize.toString()} values={["3", "5", "7"]} onValueChange={this.gridSizeChanged}/>,
            <BoolMultiChooser label="Free spot" initialValue={Config.hasFreeSpot ? "true" : "false"} values={["true", "false"]} onValueChange={this.freeSpotChanged}/>,
            <BoolMultiChooser label="Category names" initialValue={Config.showCategoryName ? "true" : "false"} values={["true", "false"]} onValueChange={this.categoryNamesChanged}/>,
            <ImageMultiChooser label="Marker image" initialValue={Config.doneMarkerImage} values={["pop-head.png", "pop-hourglass.png", "pop-potion1.png", "pop-potion2.png", "pop-princess.png", "pop-vizier.png","pop-roberto.png"]} onValueChange={this.markerImageChanged}/>,
            <MultiChooser label="Marker opacity" initialValue={Config.doneMarkerOpacity.toString()} values={["50%", "80%", "100%"]} onValueChange={this.opacityChanged}/>,
            <BoolMultiChooser label="Show logo" initialValue={Config.showLogo ? "true" : "false"} values={["true", "false"]} onValueChange={this.showLogoChanged}/>,
            <BoolMultiChooser label="Draw background" initialValue={Config.drawBackground ? "true" : "false"} values={["true", "false"]} onValueChange={this.drawBackgroundChanged}/>,
            <CategoryChooser label="Categories" onValueChange={this.categoriesChanged} />
        ];
    }

    @autobind
    private gridSizeChanged(value: string) {
        try {
            const newGridSize = parseInt(value, 10);
            Config.gridSize = newGridSize;
            this.props.onRegenerate();
        } catch (e) {
            console.warn(e);
        }
    }
    @autobind
    private opacityChanged(value: string) {
        try {
            Config.doneMarkerOpacity = value;
            this.props.onRefresh();
        } catch (e) {
            console.warn(e);
        }
    }

    @autobind
    private markerImageChanged(value: string) {
        try {
            Config.doneMarkerImage = value;
            this.props.onRefresh();
        } catch (e) {
            console.warn(e);
        }
    }

    @autobind
    private freeSpotChanged(value: string) {
        try {
            const hasFreeSpot = (value === "true");
            Config.hasFreeSpot = hasFreeSpot;
            this.props.onRegenerate();
        } catch (e) {
            console.warn(e);
        }
    }

    @autobind
    private showLogoChanged(value: string) {
        try {
            const showLogo = (value === "true");
            Config.showLogo = showLogo;
            this.props.onRefresh();
        } catch (e) {
            console.warn(e);
        }
    }

    @autobind
    private drawBackgroundChanged(value: string) {
        try {
            const drawBackground = (value === "true");
            Config.drawBackground = drawBackground;
            this.props.onRefresh();
        } catch (e) {
            console.warn(e);
        }
    }


    @autobind
    private categoryNamesChanged(value: string) {
        try {
            const showCategoryName = (value === "true");
            Config.showCategoryName = showCategoryName;
            this.props.onRefresh();
        } catch (e) {
            console.warn(e);
        }
    }

    @autobind
    private categoriesChanged(value: string[]) {
        try {
            Config.bannedCategories = value;
            this.props.onRegenerate();
        } catch (e) {
            console.warn(e);
        }
    }

}