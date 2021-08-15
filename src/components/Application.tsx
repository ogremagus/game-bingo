import * as React from 'react';
import { autobind } from 'core-decorators';
import { BingoData } from '../data';
import { BingoGrid } from './BingoGrid';
import { BingoCell } from './BingoCell';
import { GridGenerator } from '../modules/generator';
import { Config } from '../modules/config';
import { BingoButtons } from './BingoSettings';
import { Constants } from '../modules/constants';

interface ApplicationState {
}

export class Logo extends React.Component<{clickHandler: () => void}, null> {

    constructor(props) {
        super(props);
    }

    render() {
        return <div style={this.styleLogo()} onClick={this.props.clickHandler}></div>
    }

    private styleLogo(): React.CSSProperties {
        return {
            backgroundImage: `url("${Constants.LOGO_URL}")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            marginLeft: "auto",
            marginRight: "auto",
            height: `${Constants.LOGO_HEIGHT_PERCENTAGE}vmin`,
            width: "90vmin",
            opacity: Config.doneMarkerOpacity,
            backgroundSize: "contain",
        }
    }
}

export class Application extends React.Component<{}, ApplicationState> {

    constructor(props) {
        super(props);
        this.state = { }
        GridGenerator.tryRecreateTasksFromUrl();
    }

    render() {
        const size = Config.gridSize;
        const backgroundImage: React.CSSProperties = (Config.drawBackground && Constants.BACKGROUND_URL) ? {
            backgroundImage: `url("${Constants.BACKGROUND_URL}")`
        } : {};
        return <div style={{width: "100%", height: "100%", backgroundColor: Constants.SITE_BACKGROUND_COLOR, ...backgroundImage}}>
            {Config.showLogo ? <Logo clickHandler={() => {Config.showLogo = false; this.forceUpdate()}} /> : null }
            <BingoGrid logoVisible={Config.showLogo} logoSize={Constants.LOGO_HEIGHT_PERCENTAGE} size={size} tasks={GridGenerator.getTasks(size)} replaceTaskHandler={this.handleReplaceTask} />
            <BingoButtons onRefresh={this.handleRefresh} />
        </div>
    }

    @autobind
    private handleReplaceTask(taskId: string) {
        GridGenerator.regenerateTask(taskId);
        this.forceUpdate();
    }

    @autobind
    private handleRefresh() {
        this.forceUpdate();
    }
}
