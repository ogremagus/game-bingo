import * as Color from 'color';
import { autobind } from 'core-decorators';
import * as React from 'react';
import FontAwesome from 'react-fontawesome';
import { Config } from '../modules/config';
import { Constants } from '../modules/constants';
import { GridGenerator } from '../modules/generator';
import { BingoFullScreenProps, BingoHelpScreen, BingoSettingsScreen, BingoSettingsScreenProps } from './BingoSettingsScreen';

enum BingoButtonType {
    Settings,
    Refresh,
    Help
}

type BingoButtonHandler = (button: BingoButtonType) => void;

export interface BingoButtonsState {
    visibleScreen: "settings" | "help" | "none";
}

export class BingoButton extends React.Component<{ onClick: () => void; icon: string }, { hover: boolean }> {

    constructor(props) {
        super(props);
        this.state = { hover: false};
    }

    render() {
        return  <div>
            <div style={this.styleIcon()} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover} onClick={this.handleClick} ><FontAwesome name={this.props.icon} /></div>
        </div>

    }

    private styleIcon(): React.CSSProperties {
        const color = new Color(Constants.BACKGROUND_COLOR).lighten(this.state.hover ? 0.7 : 0.4).toString();
        return {
            fontSize: "8vmin",
            color: color,
            textAlign: "center",
            textShadow: "-1px 1px 0 #000, 1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000, 3px 3px 5px #000",
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

export class BingoButtonsWrapper extends React.Component<{ handler: BingoButtonHandler }, { hidden: boolean }> {

    constructor(props) {
        super(props);
        this.state = { hidden: false };
    }

    render() {
       return <div style={this.styleWrapper()} onClick={() => this.props.handler(BingoButtonType.Settings)} onContextMenu={this.handleHide}>
            <BingoButton onClick={() => this.props.handler(BingoButtonType.Settings)} icon={"cog"} />
            <BingoButton onClick={() => this.props.handler(BingoButtonType.Refresh)} icon={"refresh"} />
            <BingoButton onClick={() => this.props.handler(BingoButtonType.Help)} icon={"question-circle"} />
        </div>
    }

    private styleWrapper(): React.CSSProperties {
        return {
            boxSizing: "border-box",
            position: "absolute",
            top: "2vmin",
            right: "2vmin",
            fontSize: "8vmin",
            opacity: this.state.hidden ? 0 : 1
        }
    }

    @autobind
    private handleHide(e) {
        e.preventDefault();
        this.setState({hidden: !this.state.hidden})
    }

}

export class BingoFullScreenWrapper extends React.Component<BingoFullScreenProps, null> {

    constructor(props) {
        super(props);
    }

    render() {
        return <div style={this.styleWrapper()} onClick={() => this.props.onClose()}>
            {this.props.children}
        </div>
    }

    private styleWrapper(): React.CSSProperties {
        return {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.75)",
        }
    }

}

export class BingoButtons extends React.Component<{ onRefresh: () => void }, BingoButtonsState> {

    constructor(props) {
        super(props);
        this.state = { visibleScreen: "none" };
    }

    render() {
        return this.state.visibleScreen != "none" ? <BingoFullScreenWrapper onClose={this.onSettingsClosed} >
            {this.state.visibleScreen === "settings" ? <BingoSettingsScreen onClose={this.onSettingsClosed} onRefresh={this.onSettingsRefreshCallback} onRegenerate={this.onSettingsRegenerateCallback} /> : null}
            {this.state.visibleScreen === "help" ? <BingoHelpScreen onClose={this.onSettingsClosed} /> : null}
        </BingoFullScreenWrapper> : <BingoButtonsWrapper handler={this.buttonPressed} />
    }

    @autobind
    private onSettingsClosed() {
        this.setState({ visibleScreen:"none" });
    }

    @autobind
    private onSettingsRefreshCallback() {
        this.props.onRefresh?.();
    }

    @autobind
    private onSettingsRegenerateCallback() {
        GridGenerator.generateTasks();
        this.props.onRefresh?.();
    }

    @autobind
    private buttonPressed(button: BingoButtonType) {
        if (button == BingoButtonType.Settings) {
            this.setState({ visibleScreen: "settings" });
        } else if (button == BingoButtonType.Help) {
            this.setState({ visibleScreen: "help" });
        } else if (button == BingoButtonType.Refresh) {
            GridGenerator.generateTasks();
            this.props.onRefresh?.();
        }
    }

}