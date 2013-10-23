/** jshint: global Handlebars */

var tpl = {
    compiledTemplates: {},

    compileTemplates: function() {
        var tpls = $('.handlebars_tpl');
        $.each(tpls, function(k, v) {
            var tp = $(v);
            var key = tp.data('tplid');
            var t =  tp.html();
            this.compiledTemplates[key] = Handlebars.compile(t);
        }.bind(this) );
    },
    getTemplate: function(k, vars) {
        return this.compiledTemplates[k](vars);
    }
};

Handlebars.registerHelper("eachk", function(obj, options) {
    var buffer = "",
        key;

    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            buffer += options.fn({key: key, value: obj[key]});
        }
    }

    return buffer;
});

Handlebars.registerHelper('trans', function(prefix, string) {

    return t(prefix +'_'+ string);
});


Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
            break;
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
            break;
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
            break;
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            break;
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
            break;
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            break;
        default:
            return options.inverse(this);
            break;
    }
    //return options.inverse(this);
});