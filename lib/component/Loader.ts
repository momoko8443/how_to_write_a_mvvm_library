import {ComponentModel} from "./ComponentModel";
export class Loader {
    private componentPool;
    private componentDefinitionPool = {};
    constructor(componentPool) {
        this.componentPool = componentPool;
    }

    public load(): Promise<any> {
        let compArray = [];
        for (var tagName in this.componentPool) {
            compArray.push({ name: tagName, path: this.componentPool[tagName] });
        }
        return this.doAsyncSeries(compArray).then(result=>{
            return result;
        });
    }

    private doAsyncSeries(componentArray): Promise<any> {
        return componentArray.reduce( (promise, comp) =>{
            return promise.then( (result) => {
                return fetch(comp.path).then((response) => {
                    return response.text().then(definition => {
                        let def = this.getComponentConfiguration(comp.name,definition);
                        this.componentDefinitionPool[comp.name] = def;
                        return this.componentDefinitionPool;
                    });
                });
            });
        }, new Promise<void>((resolve, reject) => {
            resolve();
        }));
    }

    private getComponentConfiguration(tagName:string, htmlString: string): ComponentModel {
        let tempDom: HTMLElement = document.createElement("div");
        tempDom.innerHTML = htmlString;
        let body: HTMLElement = tempDom.querySelectorAll("body")[0];
        let script: string = tempDom.querySelectorAll("script")[0] && tempDom.querySelectorAll("script")[0].innerHTML;
        let style: string = tempDom.querySelectorAll( "style")[0] && tempDom.querySelectorAll( "style")[0].innerHTML;

        return new ComponentModel(tagName,style,body,script);
    }
}