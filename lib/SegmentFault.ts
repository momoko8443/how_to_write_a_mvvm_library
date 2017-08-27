import {Scanner} from "./Scanner";
import {Watcher} from "./Watcher";
import {Renderer} from "./Renderer";
import {Loader} from "./component/Loader";
import {ComponentGenerator} from "./component/ComponentGenerator";
export let SegmentFault = class SegmentFault {
    private viewModelPool = {};
    private viewViewModelMap = {};
    private renderer = new Renderer();
    private generator:ComponentGenerator;
    public init():Promise<any>{
        //web component相关功能的扩展 从此行开始
        //Hi Scanner,Watch你们俩先别急着监视，扫描,先让我把Componont的定义load进来。
        return new Promise((resolve,reject)=>{
            let loader = new Loader(this.componentPool);
            loader.load().then( componentDefinitionPool =>{
                console.log(componentDefinitionPool);
    
                this.generator = new ComponentGenerator(this,componentDefinitionPool);
                return this.generator.scanComponent(document);
            }).then(()=>{
                let scanner = new Scanner(this.viewModelPool);
                let watcher = new Watcher(this);
                for (let key in this.viewModelPool) {
                    watcher.observe(this.viewModelPool[key],this.viewModelChangedHandler);
                }
                this.viewViewModelMap = scanner.scanBindDOM();
                Object.keys(this.viewViewModelMap).forEach(alias=>{
                    this.refresh(alias);
                }); 
                resolve();
            });
        });
    };
    public registerViewModel(alias:string, viewModel:object) {
        viewModel["_alias"] = alias;
        window[alias] = this.viewModelPool[alias] = viewModel;
    };
    public refresh(alias:string){
        let boundItems = this.viewViewModelMap[alias];
        boundItems.forEach(boundItem => {
            this.renderer.render(boundItem);
        });
    }
    private viewModelChangedHandler(viewModel,prop) {
        this.refresh(viewModel._alias);
    }

    //web component相关功能的扩展 从此行开始
    private componentPool = {};
    public registerComponent(tagName,path){
        this.componentPool[tagName] = path;
    }
}