var sprites = {
    data: {},
    nameToCell: {},

    init: function() {
        _.each(spriteData, function(spr, k) {
                fbug(spr);
                var sd = {};

                if(spr.type === 'sprite') {
                    var sdata = [];
                    this.nameToCell[k] = {};
                    var i = 1;
                    _.each(spr.sprites, function(sp, spName) {
                        sdata.push(sp);
                        this.nameToCell[k][spName] = i;

                        if(!this.data[spName]) {
                            this.data[spName] = {
                                type: spr.type,
                                sprites: sp
                            };
                        }

                        this.data[spName].cell = i;

                        i++;
                    }, this);

                    var texture = new IgeSpriteSheet(spr.image, sdata);
                    _.each(spr.sprites, function(sp, spName) {
                        this.data[spName].texture = texture;
                    }, this);
                }
                else if(spr.type === 'cell'){
                    this.data[k] = {
                        type: 'cell',
                        texture: new IgeCellSheet(spr.image, spr.sprites[0], spr.sprites[1])
                    };

                    if(spr.animation) {
                        this.data[k].animation = spr.animation;
                    }
                }


        }, this);
    },
    getSprite: function(spriteName) {
        return this.data[spriteName];
    }
};