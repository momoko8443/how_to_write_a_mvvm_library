import {Scanner} from "./Scanner";
import {Watcher} from "./Watcher";
import {Renderer} from "./Renderer";
export let SegmentFault = class SegmentFault {
    private viewModelPool = {};
    private viewViewModelMap = {};
    private renderer = new Renderer();
    public init() {
        let scanner = new Scanner(this.viewModelPool);
        let watcher = new Watcher(this);
        for (let key in this.viewModelPool) {
            watcher.observe(this.viewModelPool[key],this.viewModelChangedHandler);
        }
        this.viewViewModelMap = scanner.scanBindDOM();
        Object.keys(this.viewViewModelMap).forEach(alias=>{
            this.refresh(alias);
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
}