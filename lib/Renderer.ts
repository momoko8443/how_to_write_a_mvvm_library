import {BoundItem} from "./BoundItem";
export class Renderer{
    public render(boundItem:BoundItem) {
        var value = this.getValue(boundItem.viewModel, boundItem.expression);
        var attribute = boundItem.attributeName.split('-')[1];

        if (attribute.toLowerCase() === "innertext") {
            attribute = "innerText";
        }
        boundItem.element[attribute] = value;
    };
    private getValue(viewModel, expression) {
        return (function () {
            var alias = viewModel._alias;
            var tempScope = {};
            tempScope[alias] = viewModel;
            try {
                var pattern = new RegExp("\\b" + alias + "\\b", "gm");
                expression = expression.replace(pattern, "tempScope." + alias);
                var result = eval(expression);
                tempScope = null;
                return result;
            } catch (e) {
                throw e;
            }
        })();
    }
}