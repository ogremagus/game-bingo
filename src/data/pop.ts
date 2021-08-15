import * as Color from "color";
import { Constants } from "../modules/constants";

export namespace POPBingoData {

    export interface Category {
        id: string,
        prefix: string,
        name: string;
        count?: number;
        backgroundColor?: string;
    }

    export interface Task {
        id: string,
        category: Category,
        name: string,
    }

    const TASK_NAMES_CATEGORY_MAP: Map<Category, string[]> = new Map([
        [{id: "FREE", prefix: "f", name: "Free", backgroundColor: new Color(Constants.TILE_DEFAULT_BACKGROUND).lighten(0.75).alpha(0.8).toString()}, [
            "Free spot",
        ]],

        [{id: "TIMING", prefix: "t", name: "Timing" }, [
            "Elapsed time under 18 minutes",
            "Elapsed time over 17 minutes",
        ]],

        [{id: "GUARDS", prefix: "g", name: "Guards" }, [
            "Kill every guard on any level",
            "Kill a guard in spikes",
            "Kill a guard by making him fall",
            "Kill a guard with chomper",
            "Spare a guard who has 1HP",
            "Get your strike parried twice in a row"
        ]],

        [{id: "DYING", prefix: "d", name: "Dying" }, [
            "Die to spikes",
            "Die to a chomper",
            "Die to a sword strike",
            "Die to a fall",
            "Die to a hurting potion",
            "Get hit in the back and die",
            "Fall through more than two screens"
        ]],

        [{id: "GLITCHLESS", prefix: "i", name: "Glitchless" }, [
            "Complete Level 1 Glitchless <1:00",
            "Do a level in glitchless route",
            "Do not run-jump any guards",
            "Listen to at least one end level music",
        ]],

        [{id: "LEVEL", prefix: "l", name: "Levels" }, [
            "Kill both guards on Level 1",
            "Pick up the sword on Level 1",
            "Kill purple guard on Level 2",
            "Throw skeleton into a pit",
            "Kill orange guard on Level 4",
            "Make the Shadow drink a potion",
            "Throw the fatso into a pit",
            "Complete Level 7 without feather fall",
            "Let the mouse push the button",
            "Drink the upside down potion",
            "Kill at least two guards on level 10",
            "Kill a guard on level 11",
            "Let the Shadow take the sword on level 12",
            "Don't let Jaffar fall",
            "Get hit by a falling tile on level 13",
            "Walk slowly to Princess' chamber",
            "Make Roberto fall"
        ]],

        [{id: "POTIONS", prefix: "p", name: "Potions" }, [
            "Drink big potion on Level 2",
            "Drink big potion on Level 3",
            "Drink big potion on Level 4",
            "Drink big potion on Level 7",
            "Drink big potion on Level 9",
            "Drink big potion on Level 11",
        ]],

        [{id: "RUNNER", prefix: "r", name: "Runner" }, [
            "Scream with rage or complain",
            "Sing a song while playing",
            "Give nicknames to every enemy fought",
            "Imitate a duck while ducking"
        ]],

        [{id: "CHALLENGES", prefix: "c", name: "Challenges" }, [
            "Run jump a guard twice",
            "Do a YOLO on Level 10",
            "Drink two big potions",
            "Make a Hard Jump",
            "Kill Jaffar flawlessly without making him fall",
            "True Glitchless run (no ducking to avoid tiles)",
        ]],

        [{id: "WEIRD", prefix: "w", name: "Weird" }, [
            "Get hit by a falling tile",
            "Drink both hurting potions in the game",
            "Teabag every guard you kill",
            "Drink only one upside down potion",
            "Celibate mode: CTRL+R on Level 14",
            "Hit the Shadow",
            "Get hit by the Shadow",
            "Watch a full cutscene",
            "Moonwalk dance with a guard",
            "Throw the skeleton into a pit to the right",
            "Slow-walk through every chomper in your way"
        ]],

        [{id: "HARDCORE", prefix: "h", name: "Hardcore" }, [
            "Drink every health potion in the game",
            "Kill every guard in the game",
            "Finish a level walking only (unless necessary)",
            "Complete the game without taking damage",
            "Let every guard hit you",
            "Make a guard survive a two-story fall",
            "Lose health on every level",
            "Visit every reachable screen of a level",
            "Touch the mouse with your feet",
            "Kill a guard without hitting him",
            "Do a Level 7 hard skip",
            "Do a Level 8 hard skip",
        ]],

    ]);

   export let CATEGORIES: Category[] = [];
   export let TASKS: Task[] = [];
   export let TASK_ID_MAP: Map<string, Task> = new Map();

   TASK_NAMES_CATEGORY_MAP.forEach((taskNames, category, map) => {
       category.count = taskNames.length;
       CATEGORIES.push(category);
       taskNames.forEach((name, index, array) => {
           const task: Task = {id: `${category.prefix}${index.toString(36).toUpperCase()}`, category, name};
           TASKS.push(task);
           TASK_ID_MAP.set(task.id, task);
       });
   });
   TASKS = TASKS.filter((task) => { return task.name && task.name.trim().length > 0 });
   console.log("Total tasks: ", TASKS.length);
}

