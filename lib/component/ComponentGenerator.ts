import { ComponentDefinition } from "./ComponentDefinition";
export class ComponentGenerator {
    private sf;
    private componentDefinitionPool;
    constructor(sf, componentDefinitionPool) {
        this.componentDefinitionPool = componentDefinitionPool;
        this.sf = sf;
    }
    public async scanComponent(element): Promise<any> {
        let compDef: ComponentDefinition = this.componentDefinitionPool[element.localName];
        if (compDef) {
            let attrs = element.attributes;
            return this.generate(element, compDef, attrs);
        } else {
            if (element.children && element.children.length > 0) {
                for (let i = 0; i < element.children.length; i++) {
                    let child = element.children[i];
                    await this.scanComponent(child);
                }
                return element;
            } else {
                return element;
            }
        }
    }

    private async generate(tagElement: HTMLElement, compDef: ComponentDefinition, attrs) {
        this.dealWithShadowStyle(compDef);
        let randomAlias = 'vm_' + Math.floor(10000 * Math.random()).toString();
        let template = compDef.template;
        template = template.replace(new RegExp('this', 'gm'), randomAlias);
        let tempFragment = document.createElement('div');
        tempFragment.insertAdjacentHTML('afterBegin' as InsertPosition, template);
        if (tempFragment.children.length > 1) {
            template = tempFragment.outerHTML;
        }
        tagElement.insertAdjacentHTML('beforeBegin' as InsertPosition, template);
        let htmlDom = tagElement.previousElementSibling;
        htmlDom.classList.add(tagElement.localName);
        if (compDef.script) {
            let ViewModelClass: Function = new Function(compDef.script);
            this.sf.registerViewModel(randomAlias, new ViewModelClass.prototype.constructor());

        } else {
            for (let i = 0; i < attrs.length; i++) {
                let attr = attrs[i];
                htmlDom.setAttribute(attr.nodeName, attr.nodeValue);
            }
        }

        tagElement.parentNode.removeChild(tagElement);
        if (htmlDom.children && htmlDom.children.length > 0) {
            for (let j = 0; j < htmlDom.children.length; j++) {
                let child = htmlDom.children[j];
                await this.scanComponent(child);
            }
            return htmlDom;
        } else {
            return htmlDom;
        }
    }



    private dealWithShadowStyle(compDef:ComponentDefinition): void {
        let stylesheet = compDef.style;
        let tagName = compDef.tagName;
        let head = document.getElementsByTagName('HEAD')[0];
        let style = document.createElement('style');
        style.type = 'text/css';
        var styleArray = stylesheet.split("}");
        var newArray = [];
        styleArray.forEach((value: string, index: number) => {
            var newValue = value.replace(/^\s*/, "");
            if (newValue) {
                newArray.push(newValue);
            }
        });
        stylesheet = newArray.join("}\n" + "." + tagName + " ");
        stylesheet = "." + tagName + " " + stylesheet + "}";
        style.innerHTML = stylesheet;
        head.appendChild(style);
    }
}