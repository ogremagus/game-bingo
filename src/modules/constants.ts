import { BingoData } from "../data";
import * as Color from 'color';
export class Constants {
    public static readonly LOGO_URL = "img/pop-logo2.png";
    public static readonly LOGO_HEIGHT_PERCENTAGE = 15;
    public static readonly BACKGROUND_URL = "img/pop-background.png";
    // public static readonly BACKGROUND_URL = null;
    // public static readonly BACKGROUND_COLOR = "#ffd302"; //smm
    public static readonly BACKGROUND_COLOR = "#374755"; //pop
    // public static readonly BACKGROUND_COLOR = "#203050";

    public static readonly SETTING_TITLE_COLOR = "#ffd060";

    public static readonly TILE_TASK_TEXT_COLOR = "#ffffff";
    public static readonly TILE_CATEGORY_TEXT_COLOR = null;
    public static readonly TILE_DEFAULT_BACKGROUND = new Color(Constants.BACKGROUND_COLOR).rotate(0).lighten(0.8).alpha(0.9).toString();

    public static readonly SITE_BACKGROUND_COLOR = new Color(Constants.BACKGROUND_COLOR).darken(0.33).toString();

    public static readonly SETTING_BACKGROUND = new Color(Constants.BACKGROUND_COLOR).lighten(0.5).toString();
    public static readonly SETTING_SELECTED_BACKGROUND = new Color(Constants.BACKGROUND_COLOR).rotate(10).darken(0.33).toString();
    public static readonly SETTING_SELECTED_COLOR = "#ffffff";
    public static readonly SETTING_COLOR = new Color(Constants.SETTING_SELECTED_BACKGROUND).lighten(0.33).saturate(0.33).toString();
    // public static readonly SETTING_COLOR = new Color(Constants.SETTING_BACKGROUND).darken(0.5).saturate(-0.5).toString();
    public static readonly SETTINGS_LABEL_COLOR = new Color(Constants.BACKGROUND_COLOR).rotate(-10).darken(0.8).toString();
}