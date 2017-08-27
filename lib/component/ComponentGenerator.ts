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
            let debugComment = "//# sourceURL="+tagElement.tagName+".js";
            let script = compDef.script + debugComment;
            let ViewModelClass: Function = new Function(script);
            let vm_instance = new ViewModelClass.prototype.constructor();
            this.sf.registerViewModel(randomAlias, vm_instance);

            vm_instance._dom = htmlDom;
            vm_instance.dispatchEvent = (eventType: string, data: any, bubbles: boolean = false, cancelable: boolean = true) => {
                let event = new CustomEvent(eventType.toLowerCase(), { "bubbles": bubbles, "cancelable": cancelable });
                event['data'] = data;
                vm_instance._dom.dispatchEvent(event);
            };

            for (let i = 0; i < attrs.length; i++) {
                let attr = attrs[i];
                if(attr.nodeName.search("sf-") !== -1){
                    if(attr.nodeName.search("sf-on") !== -1){
                        let eventName = attr.nodeName.substr(5);
                        vm_instance._dom.addEventListener(eventName,eval(attr.nodeValue));
                    }else{
                        let setTarget = attr.nodeName.split("-")[1];
                        vm_instance[setTarget] = eval(attr.nodeValue);
                    }                 
                }           
            }

        }
        for (let i = 0; i < attrs.length; i++) {
            let attr = attrs[i];
            console.log(attr);
            if(attr.nodeName.search("sf-") === -1){
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