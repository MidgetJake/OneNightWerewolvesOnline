'use strict';

module.exports = function() {
    return {
        setRouting: function(router){
            router.get('*', this.indexPage);
        },

        indexPage: function(req, res){
            return res.render('index/index.ejs', {title: 'One Night!'});
        },
    };
};