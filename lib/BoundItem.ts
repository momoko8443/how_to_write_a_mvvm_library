export class BoundItem {
    public viewModel: object;
    public element: Element;
    public expression: string;
    public attributeName: string;
    private interactiveDomConfig = {
        "INPUT":{
            "text":"input",
            "password":"input",
            "email":"input",
            "url":"input",
            "tel":"input",
            "radio":"change",
            "checkbox":"change",
            "color":"change",
            "date":"change",
            "datetime":"change",
            "datetime-local":"change",
            "month":"change",
            "number":"change",
            "range":"change",
            "search":"change",
            "time":"change",
            "week":"change",
            "button":"N/A",
            "submit":"N/A"
        },
        "SELECT":"change",
        "TEXTAREA":"change"
    }
    constructor(viewModel: object, element: Element, expression: string, attributeName: string) {
        this.viewModel = viewModel;
        this.element = element;
        this.expression = expression;
        this.attributeName = attributeName;
        this.addListener(this.element,this.expression);
    }

    private addListener(element,expression){
        let tagName = element.tagName;
        let eventName = this.interactiveDomConfig[tagName];
        if(!eventName){
            return;
        }
        if(typeof eventName === "object"){
            let type = element.getAttribute("type");
            eventName = eventName[type];
        }
        element.addEventListener(eventName, (e)=> {
            let newValue = (element as HTMLInputElement).value;
            let cmd = expression + "= \"" + newValue + "\"";
            try{
                eval(cmd);
            }catch(e){
                console.error(e);
            }
        });
    }
}