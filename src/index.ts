import Item, * as ItemType from './item';

const rootNode: Item[] = [];

export default {
    Item: Item,
    add: _add,
    process: _process,
}

/**
 * 添加初始化模块操作。
 * @param name 模块名称
 * @param func 初始化函数
 * @param dependencies 依赖关系列表
 */
function _add(name: string, func: ItemType.Func, dependencies?: ItemType.Dependency[] = []) {
    const item = new Item(name, func);
    dependencies.forEach(d => item.addDependency(d.name, d.option));
    rootNode.push(item);
}

/**
 * 执行所有初始化操作。
 */
async function _process(): Promise<void> {
    const doneList: string[] = [];
    while (doneList.length < rootNode.length) {
        const todoList = rootNode.filter(i => {
            if (doneList.indexOf(i.name) >= 0) {
                return false;
            }
            if (i.dependencies.some(j => doneList.indexOf(j.name) < 0)) {
                return false;
            }
            return true;
        });
        if (todoList.length === 0) {
            console.error('初始化失败', rootNode, doneList); // eslint-disable-line no-console
            break;
        }
        await Promise.all(todoList.map(i => { // eslint-disable-line no-await-in-loop
            return Promise.resolve(i.func())
                .then(function () {
                    console.log('Initialize', i.name); // eslint-disable-line no-console
                });
        }));
        doneList.push(...todoList.map(i => i.name));
    }
}