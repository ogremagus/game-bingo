import { BingoData } from "../data";
import { Config } from "./config";

import addParams from 'add-query-params-to-url';
import * as query from 'query-string';

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
}

function getTasksDefinitionString(tasks: BingoData.Task[]) {
    return tasks.map(task => task.id).join('');
}



function updateCurrentUrl(tasks: BingoData.Task[]) {
    const definitionString = getTasksDefinitionString(tasks);
    window.history.replaceState({}, "PoP bingo", addParams({ def: definitionString }, "/"));
}

export class GridGenerator {

    private static currentTasks: BingoData.Task[] = null;

    public static getTasks(size = Config.gridSize): BingoData.Task[] {
        if (GridGenerator.currentTasks == null) {
            GridGenerator.currentTasks = GridGenerator.generateTasks();
        }
        return GridGenerator.currentTasks;
    }

    public static regenerateTask(taskId: string) {

        const replacedIndex = GridGenerator.currentTasks.findIndex(task => task.id == taskId);

        if (replacedIndex > -1) {
            let tasks: BingoData.Task[] = [].concat(BingoData.TASKS.filter(task => task.category.id != 'FREE'));
            tasks = tasks.filter(task => !Config.bannedCategories.includes(task.category.id));
            tasks = tasks.filter(task => !GridGenerator.currentTasks.includes(task));

            shuffle(tasks);

            GridGenerator.currentTasks[replacedIndex] = tasks[0];
        }

        updateCurrentUrl(GridGenerator.currentTasks);
    }

    public static generateTasks(size = Config.gridSize): BingoData.Task[] {
        const COUNT = size ** 2;

        let tasks: BingoData.Task[] = [].concat(BingoData.TASKS.filter(task => task.category.id != 'FREE'));

        tasks = tasks.filter(task => !Config.bannedCategories.includes(task.category.id));

        shuffle(tasks);

        tasks = tasks.slice(0, COUNT);

        if (Config.hasFreeSpot) {
            const freeTask = BingoData.TASKS.find(task => task.category.id == "FREE");
            if (freeTask) {
                tasks[Math.floor(COUNT / 2)] = freeTask;
            }
        }

        GridGenerator.currentTasks = tasks;

        updateCurrentUrl(tasks);

        return tasks;
    }

    public static tryRecreateTasksFromUrl() {
        const parsed = query.parse(location.search);

        if (parsed && parsed.def) {
            const definitionString = parsed.def as string;
            const taskIds = definitionString.split(/(?=[a-z])/);
            if (taskIds) {
                const taskCount = taskIds.length;
                if (taskCount > 1 && (taskCount % 2 === 1) && (Math.sqrt(taskCount) % 1 === 0)) {
                    Config.gridSize = Math.sqrt(taskCount);
                    try {
                        const tasks: BingoData.Task[] = [];
                        taskIds.forEach((id) => {
                            const task = BingoData.TASK_ID_MAP.get(id);
                            if (task) {
                                tasks.push(task);
                            } else {
                                throw "Task not found for id: " + id;
                            }
                        });
                        GridGenerator.currentTasks = tasks;
                    } catch(e) {
                        console.log("Could not parse definition string: " + definitionString, e);
                    }
                } else {
                    console.log("Wrong amount of tasks in the definition string: " + taskIds.length);
                }
            }
        }

    }

}