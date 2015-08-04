if ( ! RedactorPlugins) var RedactorPlugins = {};

RedactorPlugins.constants = {
    init: function()
    {
        var dropdown = {}, counter = 1;

        for (key in bestBeginnings.constants) {
            dropdown['point'+(counter++)] = { title: bestBeginnings.constants[key], constant: key, callback: this.addConstantCallback };
        }

        this.buttonAdd('constants', 'Insert Constant', false, dropdown);
        this.buttonAwesome('constants', 'fa-tasks');
    },
    addConstantCallback: function(buttonName, buttonDOM, buttonObj, e)
    {
        this.insertHtml(buttonObj.constant);
    }
};
