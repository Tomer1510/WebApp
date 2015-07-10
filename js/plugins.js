/**
 * JS Library v0
 */

var __ = (function () {

    var configFile = "data/config.json";
    var config = {};

    return {
        config: config,
        /**
         * Check if a given value is a plain Object
         *
         * @param  {*}       o Any value to be checked
         * @return {Boolean}   true if it's an Object
         */
        isObject: function (o) {
            var toString = Object.prototype.toString;
            return (toString.call(o) === toString.call({}));
        },

        loadConfig: function() {
            var this_ = this;
            $.getJSON("data/config.json")
                .done(function(ret){
                    this_.config = ret;
                })
                .fail(function(){
                    this_.config = {};
                });
        },

        init: function() {
            this.loadConfig();

            $("#tabs").tabs({
                activate: function(event, ui) { 
                    history.pushState(null,null,ui.newPanel.selector); 
                }
            });

            window.onhashchange = function(ev) {
                ev.preventDefault();
            }
        }
    
    };
}());
