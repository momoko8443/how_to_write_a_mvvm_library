import { BoundItem } from "./BoundItem";
export class Scanner {
    private prefix = "sf-";
    private viewModelPool;

    constructor(viewModelPool) {
        this.viewModelPool = viewModelPool;
    }
    public scanBindDOM() :object{
        let boundMap = {};
        
        let boundElements = this.getAllBoundElements(this.prefix);
        boundElements.forEach(element => {
           for (let i = 0; i < element.attributes.length; i++) {
                let attr = element.attributes[i];
                if (attr.nodeName.search(this.prefix) > -1) {
                    let attributeName = attr.nodeName;
                    let expression = element.getAttribute(attributeName);
                    for (let alias in this.viewModelPool) {
                        if (expression.search(alias + ".") != -1) {
                            let boundItem = new BoundItem(this.viewModelPool[alias], element, expression,attributeName);
                            if (!boundMap[alias]) {
                                boundMap[alias] = [boundItem];
                            } else {
                                boundMap[alias].push(boundItem);
                            }
                        }
                    }
                }
            }
        });  
        return boundMap;
    }

    private fuzzyFind(element:HTMLElement,text:string):HTMLElement {
        if (element && element.attributes) {
            for (let i = 0; i < element.attributes.length; i++) {
                let attr = element.attributes[i];
                if (attr.nodeName.search(text) > -1) {
                    return element;
                }
            }
        }
        return null;
    }
     private getAllBoundElements(prefix): Array<HTMLElement> {
        let elements = [];
        let allChildren = document.querySelectorAll("*");
        for (let i = 0; i < allChildren.length; i++) {
            let child: HTMLElement = allChildren[i] as HTMLElement;
            let matchElement = this.fuzzyFind(child, prefix);
            if (matchElement) {
                elements.push(matchElement);
            }
        }
        return elements;
    }
}