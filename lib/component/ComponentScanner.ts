import { ComponentGenerator } from "./ComponentGenerator";
import { ComponentDefinition } from "./ComponentDefinition";
export class ComponentScanner {
    private componentDefinitionPool;
    private componentGenerator: ComponentGenerator;
    constructor(sf, componentDefinitionPool) {
        this.componentGenerator = new ComponentGenerator(sf, componentDefinitionPool);
        this.componentDefinitionPool = componentDefinitionPool;
    }
   
}