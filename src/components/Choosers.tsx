import * as Color from 'color';
import { autobind } from 'core-decorators';
import * as React from 'react';
import FontAwesome from 'react-fontawesome';
import { BingoData } from '../data';
import { Config } from '../modules/config';
import { Constants } from '../modules/constants';
import { GridGenerator } from '../modules/generator';

interface ChooserProps {
    label: string
}

abstract class Chooser<P, S> extends React.Component<ChooserProps & P, S> {

    protected static readonly BASE_FLEX = 7;

    constructor(props) {
        super(props);
    }

    render() {
        return <div style={this.styleChooser()}>
                <div style={this.styleLabel()}>{this.props.label + ":"}</div>
                {this.renderChooserOptions()}
            </div>

    }

    abstract renderChooserOptions();

    private styleLabel(): React.CSSProperties {
        return {
            textAlign: "right",
            fontSize: "2vmin",
            marginRight: "2vmin",
            color: Constants.SETTINGS_LABEL_COLOR,
            flex: 2.5
        }
    }

    protected styleChooser(): React.CSSProperties {
        return {
            lineHeight: "5vmin",
            fontSize: "3vmin",
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: "2vmin",
            display: "flex",
            width: "95%"
        }
    }
}


interface CategoryChooserProps {
    onValueChange: (categories: string[]) => void
}

interface CategoryChooserState {
    bannedCategoryIds: string[];
}

export class CategoryChooser extends Chooser<CategoryChooserProps, CategoryChooserState> {

    constructor(props) {
        super(props);
        this.state = {bannedCategoryIds: Config.bannedCategories};
    }

    renderChooserOptions() {
        const options = BingoData.CATEGORIES.filter(category => category.id != 'FREE').map((value, index) => {
            return <div key={value.id} style={this.styleCategory(value)} onClick={() => this.handleCategoryClick(value)}>{this.renderCategory(value)}</div>;
        });
        return <div key="realoptions" style={this.styleCategoriesWrap()}>{options}</div>
    }

    renderCategory(category: BingoData.Category): JSX.Element {
        return <span>{`${category.name} (${category.count})`}</span>;
    }

    @autobind
    private handleCategoryClick(value: BingoData.Category) {
        let bannedCategoryIds = [...this.state.bannedCategoryIds];
        if (bannedCategoryIds.includes(value.id)) {
            bannedCategoryIds = bannedCategoryIds.filter(c => c != value.id);
        } else {
            bannedCategoryIds.push(value.id);
        }

        this.setState({ bannedCategoryIds });
        this.props.onValueChange(bannedCategoryIds);
    }

    private styleCategoriesWrap(): React.CSSProperties {
        return {
            // marginTop: "3vmin",
            flex: Chooser.BASE_FLEX,
            display: "flex",
            flexWrap: "wrap"
        }
    }

    private styleCategory(category: BingoData.Category): React.CSSProperties {
        const selected = !(this.state.bannedCategoryIds.includes(category.id));
        const color = new Color(Constants.BACKGROUND_COLOR).rotate(-60).darken(0.6).toString();
        return {
            fontSize: "3vmin",
            boxSizing: "border-box",
            border: `solid 1px ${color}`,
            borderRadius: "2vmin",
            paddingLeft: "1vmin",
            paddingRight: "1vmin",
            marginRight: "1vmin",
            marginBottom: "1vmin",
            color: selected ? Constants.SETTING_SELECTED_COLOR : Constants.SETTING_COLOR,
            backgroundColor: selected ? Constants.SETTING_SELECTED_BACKGROUND : Constants.SETTING_BACKGROUND,
        }
    }

}

interface MultiChooserProps {
    initialValue: string,
    values: string[],
    onValueChange: (value: string) => void
}

interface MultiChooserState {
    currentValue: string;
}

export class MultiChooser extends Chooser<MultiChooserProps, MultiChooserState> {

    constructor(props) {
        super(props);
        this.state = {currentValue: props.initialValue};
    }

    renderChooserOptions() {
        const options = this.props.values.map((value, index) => {
            return <div key={value} style={this.styleOption(value, index)} onClick={() => this.handleValueClick(value)}>{this.renderValue(value)}</div>;
        });
    return [<div key="realoptions" style={this.styleOptionsWrap()}>{options}</div>, this.renderStretcher()];
    }

    renderValue(value: string): JSX.Element {
        return <span>{value}</span>;
    }

    renderStretcher() {
        return <div key={"stretcher"} style={{flex: MultiChooser.BASE_FLEX - this.props.values.length}}></div>
    }

    @autobind
    private handleValueClick(value: string) {
        this.setState({currentValue: value});
        this.props.onValueChange(value);
    }

    private styleOptionsWrap(): React.CSSProperties {
        const color = new Color(Constants.BACKGROUND_COLOR).rotate(-60).darken(0.6).toString();
        return {
            flex: (this.props.values.length),
            display: "flex",
            border: `solid 1px ${color}`,
            borderRadius: "2vmin",
            overflow: "hidden",
        }
    }

    private styleOption(optionValue: string, index: number): React.CSSProperties {
        const selected = (optionValue === this.state.currentValue);
        return {
            boxSizing: "border-box",
            flex: 1,
            color: selected ? Constants.SETTING_SELECTED_COLOR : Constants.SETTING_COLOR,
            backgroundColor: selected ? Constants.SETTING_SELECTED_BACKGROUND : Constants.SETTING_BACKGROUND,
            borderLeft: (index > 0 ) ? `solid 2px ${Constants.SETTING_SELECTED_BACKGROUND}` : null
        }
    }

}

export class ImageMultiChooser extends MultiChooser {


    styleChooser() {
        return {...super.styleChooser(), ...{lineHeight: "10vmin"}}
    }

    renderValue(value: string): JSX.Element {
        return <div key="i" style={this.styleImage(value)}></div>
    }

    private styleImage(value) {
        return {
            width: "100%",
            height: "100%",
            backgroundImage: `url(img/${value})`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain"
        }
    }

}

export class BoolMultiChooser extends MultiChooser {

    renderValue(value: string): JSX.Element {
        return <span>{value === "true" ? "YES" : "NO"}</span>
    }


}

