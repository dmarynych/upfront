var Entities = Backbone.Collection.extend({
    model: Entity,
    initialize: function() {
        this.on('change:walkPath', function(ent) {
            fbug('keke');
            fbug(arguments);
            ent.walkToPath(ent.get('walkPath'));
        });
    }
});
