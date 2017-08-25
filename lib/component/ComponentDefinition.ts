export class ComponentDefinition{
    public tagName;
    public style;
    public template;
    public script; 
    constructor(tagName,style,template,script){
        this.tagName = tagName;
        this.style = style;
        this.template = template;
        this.script = script;
    }

    public generateRealComponent(){
        
    }
}