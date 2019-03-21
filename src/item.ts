export interface Option {
}

export interface Dependency {
    name: string;
    option?: Option;
}

export type Func = () => Promise<void> | void;

export default class {
    public name: string;

    public dependencies: Dependency[];

    public func: Func;

    constructor(name: string, func: Func) {
        this.name = name;
        this.dependencies = [];
        this.func = func;
    }

    /**
     * 添加依赖关系。
     * @param moduleName 依赖的模块名
     * @param option 配置选项
     */
    public addDependency(moduleName: string, option?: Option): boolean {
        const isExist = this.dependencies.some(i => i.name === moduleName);
        if (!isExist) {
            this.dependencies.push({
                name: moduleName,
                option: option,
            });
        }
        return !isExist;
    }
}