export class ComponentModel{
    public tagName;
    public style;
    public body;
    public script; 
    constructor(tagName,style,body,script){
        this.tagName = tagName;
        this.style = style;
        this.body = body;
        this.script = script;
    }

    public generate(){
        
    }
}