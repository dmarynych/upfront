var Entity = Backbone.Model.extend({
    idAttribute: 'id',
    initialize: function() {
        fbug('add ent');
        fbug(this);
        var entity = this;
        this.set('dir', 't');


        var ss = sprites.getSprite(this.get('sprite'));
        fbug(['pos', [entity.get('pos')[0], entity.get('pos')[1], entity.get('pos')[2]]])
        if(ss) {
            this.set('spritesheet', ss);
            var container = new IgeEntity()
                .id('entity_'+ entity.id)
                .isometric(true)
                .drawBounds(false)
                .mount(ige.client.entitiesMap)
                .translateToTile(entity.get('pos')[0], entity.get('pos')[1], entity.get('pos')[2])
                .mouseOver(function() {
                    this.highlight(true);
                    this.drawBounds(true);
                    this.drawBoundsData(true);
                })
                .mouseOut(function() {
                    this.highlight(false);
                    this.drawBounds(false);
                    this.drawBoundsData(false);
                });
            if(ss.type === 'sprite') {
                container.size3d(ss.sprites[2] / 2, ss.sprites[2] / 2, ss.sprites[3] / 2)
            }
            else {
                container.size3d(32, 32, 32);
            }


            var igentity = new IgeEntity()
                .texture(ss.texture)
                .drawBounds(false)
                .drawBoundsData(false);

            if(ss.type === 'sprite') {
                igentity
                    .width(ss.sprites[2])
                    .height(ss.sprites[3]);
            }
            else {
                igentity.dimensionsFromCell();
            }


            igentity.mount(container);

            if(ss.cell) {
                igentity.cell(ss.cell);
            }

            if(ss.animation) {
                igentity.addComponent(IgeAnimationComponent);

                _.each(ss.animation, function(animData, animName) {
                    igentity.animation.define(animName, _.range(animData[0], animData[1] + 1), 8, -1);
                });

                igentity.animation.select('stand_l');

            }

            entity.set('container', container);
            entity.set('igentity', igentity);
        }



    }
});

Entity.prototype.playAnim = function(animName) {
    this.get('igentity').animation.select(animName + '_'+ this.get('dir'));
};
Entity.prototype.getIgePos = function() {
    return this.get('igentity')._parent.pointToTile(this.get('igentity')._translate);
};

Entity.prototype.walkToPath = function(walkPath) {
    var self = this,
        ent = this.get('container');

    /*this.animation.select('walkDown');*/

    // Start tweening the little person to their destination
    var tween = ent._translate.tween()
        .stopAll();

    var dirToAnim = {}, i = 0, prev;

    _.each(walkPath, function(step) {
        var tile = ige.$('tile_'+ step[0] +'_'+ step[1] +'_0'),
            x = tile.translate().x(),
            y = tile.translate().y();

        tween.stepTo({
            x: x,
            y: y
        });

        var xx = prev ? prev[0] : this.get('pos')[0];
        var yy = prev ? prev[1] : this.get('pos')[1];

        dirToAnim[i] = ggame.getDirection(xx, yy, step[0], step[1]);

        prev = [step[0], step[1]];

        i++;
    }, this);
        /*.properties({x: x, y: y})*/


    tween.duration(700)
        .beforeStep(function (tween, step) {
            var dir = dirToAnim[step];
            self.set('dir', dir);
            self.playAnim('walk');
            //ent
            // And you could make him reset back
            // to his original animation frame with:
            //self.cell(10);
        })
        .afterTween(function() {
            self.playAnim('stand');
        })
        .start();

    return this;
};





var EntitiesView = Backbone.View.extend({
    el: '.mobileListTbody',

    initialize: function() {
        ggame.entities.on('add', this.renderOne, this);


        this.render();
    },

    render: function() {
        ggame.entities.each(function(entity) {
            this.renderOne(entity);
        }, this);
    },
    renderRow: function(entity) {
        return tpl.getTemplate('peopleListRow', entity.attributes);
    },
    renderOne: function(entity) {
        if(entity.get('entityType') === 'Mobile') {
            this.$el.append(this.renderRow(entity));

            entity.on('change:action change:task', this.change, this);
        }

        return this;
    },
    change: function(entity) {
        fbug('ch')
        if(entity.get('entityType') === 'Mobile') {
            this.$el.find('.mobileListRow'+ entity.id).replaceWith(this.renderRow(entity));
        }

        return this;
    }
});