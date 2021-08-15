
interface ConfigEntry {
    key: string,
    defaultValue: string | number;
}

const CONFIG_ENTRIES: ConfigEntry[] = [
    { key: "gridSize", defaultValue: 5 },
    { key: "hasFreeSpot", defaultValue: "true" },
    { key: "showCategoryName", defaultValue: "true" },
    { key: "showLogo", defaultValue: "true" },
    { key: "drawBackground", defaultValue: "true" },
    { key: "bannedCategories", defaultValue: "[]" },
    { key: "doneMarkerImage", defaultValue: "pop-hourglass.png" },
    { key: "doneMarkerOpacity", defaultValue: "100%" },
]

function intVal(n: number | string): number {
    return typeof n === "number" ? n : parseInt(n, 10);
}

function stringVal(n: number | string): string {
    return typeof n === "string" ? n : n.toString();
}

export class Config {

    private static configMap: Map<string, string | number> = Config.loadSettingsFromStorage()

    public static get gridSize(): number {
        return Config.readIntCachedProperty("gridSize");
    }
    public static set gridSize(value: number) {
        Config.setAndSaveProperty("gridSize", value);
    }

    public static get hasFreeSpot(): boolean {
        return Config.readStringCachedProperty("hasFreeSpot") == "true";
    }
    public static set hasFreeSpot(value: boolean) {
        Config.setAndSaveProperty("hasFreeSpot", value ? "true" : "false");
    }

    public static get showCategoryName(): boolean {
        return Config.readStringCachedProperty("showCategoryName") == "true";
    }
    public static set showCategoryName(value: boolean)  {
        Config.setAndSaveProperty("showCategoryName", value ? "true" : "false");
    }

    public static get showLogo(): boolean {
        return Config.readStringCachedProperty("showLogo") == "true";
    }
    public static set showLogo(value: boolean)  {
        Config.setAndSaveProperty("showLogo", value ? "true" : "false");
    }

    public static get drawBackground(): boolean {
        return Config.readStringCachedProperty("drawBackground") == "true";
    }
    public static set drawBackground(value: boolean)  {
        Config.setAndSaveProperty("drawBackground", value ? "true" : "false");
    }

    public static get bannedCategories(): string[] {
        const stringArray = Config.readStringCachedProperty("bannedCategories");
        try {
            return JSON.parse(stringArray);
        } catch(e) {
            return [];
        }
    }
    public static set bannedCategories(value: string[])  {
        Config.setAndSaveProperty("bannedCategories", JSON.stringify(value));
    }


    public static get doneMarkerImage(): string {
        return Config.readStringCachedProperty("doneMarkerImage");
    }
    public static set doneMarkerImage(value: string) {
        Config.setAndSaveProperty("doneMarkerImage", value);
    }

    public static get doneMarkerOpacity(): string {
        return Config.readStringCachedProperty("doneMarkerOpacity");
    }
    public static set doneMarkerOpacity(value: string) {
        Config.setAndSaveProperty("doneMarkerOpacity", value);
    }

    /************** Private */

    private static readStringCachedProperty(key: string) {
        return stringVal(Config.configMap.get(key));
    }
    private static readIntCachedProperty(key: string) {
        return intVal(Config.configMap.get(key));
    }

    private static setAndSaveProperty(key: string, value: string | number) {
        const stringValue = stringVal(value);
        Config.configMap.set(key, stringValue);
        const storage = window.localStorage;
        if (storage) {
            try {
                storage.setItem(key, stringValue);
            } catch (e) {
                console.log("Error saving config: " + key, e);
            }
        }
    }

    private static loadSettingsFromStorage() {
        const map: Map<string, string | number> = new Map();
        const storage = window.localStorage;
        if (storage) {
            CONFIG_ENTRIES.forEach((entry) => {
                try {
                    const value = storage.getItem(entry.key);
                    map.set(entry.key, value ?? entry.defaultValue);
                } catch (e) {
                    console.log("Error loading config: " + entry.key, e);
                    map.set(entry.key, entry.defaultValue);
                }
            });
        }
        console.log("Loaded config: ", map);
        return map;
    }

}