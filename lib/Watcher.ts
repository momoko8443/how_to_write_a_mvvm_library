export class Watcher {
    private sf;
    constructor(sf) {
        this.sf = sf;
    }
    public observe(viewModel, callback) {
        let host = this.sf;
        for (var key in viewModel) {
            var defaultValue = viewModel[key];
            (function (k, dv) {
                if (k !== "_alias") {
                    Object.defineProperty(viewModel, k, {
                        get: function () {
                            return dv;
                        },
                        set: function (value) {
                            dv = value;
                            console.log("do something after set a new value");
                            callback.call(host, viewModel, k);
                        }
                    });
                }
            })(key, defaultValue);
        }
    }
}