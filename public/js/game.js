
var ggame = {
    init: function(client) {
        var game = this;

        $.i18n({
            locale: 'ru' // Locale is Hebrew
        });
        window.t = $.i18n;

        this.entities = new Entities();
        this.client = client;

        client.textures = {};
        client.textures.terrain = new IgeSpriteSheet('./art/tiles/terrain.png', [
            // Format of the sprite bounding rectangle array is x, y, width, height
            [320,0,64,32],
            [384,0,64,32],
            [448,0,64,32]
        ]);
        client.textures.pattern = new IgeTexture('./art/tiles/terrain.png');


        sprites.init();

        // Wait for all textures to load
        ige.on('texturesLoaded', function () {
            // All our textures have loaded!
            // Create the HTML canvas element with auto-sizing
            ige.createFrontBuffer(true);

            // Request engine startup
            ige.start(function (success) {
                if (success) {
                    // The engine started successfully!
                    client.mainScene = new IgeScene2d()
                        .id('mainScene');

                    var bgss = sprites.getSprite('grass1');
                    client.backgroundScene = new IgeScene2d()
                        .id('backgroundScene')
                        .depth(0)
                        .backgroundPattern(bgss.texture.textureFromCell(2), 'repeat', true, true)
                        .ignoreCamera(true) // We want the scene to remain static
                        .mount(client.mainScene);

                    // Create a scene
                    client.tilesScene = new IgeScene2d()
                        .id('tilesScene')
                        .depth(1)
                        .isometricMounts(true)
                        .mount(client.mainScene);

                    client.entitiesScene = new IgeScene2d()
                        .id('entitiesScene')
                        .depth(2)
                        .isometricMounts(true)
                        .mount(client.mainScene);

                    client.uiScene = new IgeScene2d()
                        .id('uiScene')
                        .ignoreCamera(true)
                        .layer(3)
                        .mount(client.mainScene);


                    // Create a viewport that "looks"
                    // at scene1 and mount it to the
                    // main engine "ige" instance
                    client.vp1 = new IgeViewport()
                        .id('vp1')
                        .autoSize(false)
                        .width(900)
                        .height(500)
                        .scene(client.mainScene)
                        .drawBounds(false)
                        .addComponent(IgeMousePanComponent)
                        .mousePan.enabled(true)
                        .mount(ige);


                    client.tilesMap = new IgeTileMap2d()
                        .id('tileMap1')
                        .isometricMounts(true)
                        .depthSortMode(2)//fastest
                        .tileWidth(32)
                        .tileHeight(32)
                        .drawBounds(false)
                        //.drawGrid(8)
                        //.drawMouse(true)
                        .mount(client.tilesScene);


                    client.entitiesMap = new IgeTileMap2d()
                        .id('entitiesMap1')
                        .isometricMounts(true)
                        .drawBounds(false)
                        .tileWidth(32)
                        .tileHeight(32)
                        //.drawGrid(3)
                        .mount(client.entitiesScene);


                    game.load.bind(game)();



                    tpl.compileTemplates();
                    ui.init();

                }
            });
        });
    },

    load: function() {
        var url = config.front_url +'/game/load';
        $.getJSON(url, function(data) {

            var map = data.world.map;
            for (var y = 0; y < map.length; y++) {
                for (var x = 0; x < map[y].length; x++) {
                    //fbug(map[y][x])
                    this.addTile(map[y][x], [x, y, 0]);
                }
            }

            fbug(data);
            _.each(data.entities, function(obj, k) {
                this.addEntity(obj);
            }, this);

            sockets.init();
        }.bind(this));
    },

    addTile: function(tileName, pos) {
        var tileId = 'tile_'+ pos[0] +'_'+ pos[1] +'_'+ pos[2],
            ss = sprites.getSprite(tileName);
        if(!ss) {
            return;
        }
        //if(ss.cell === 2) return;

        var container = new IgeEntity()
            .id(tileId)
            .isometric(true)
            .depth(0)
            .drawBounds(false)
            .mount(this.client.tilesMap)
            /*.mouseOver(function() {
                this.highlight(true);
                this.drawBounds(true);
                this.drawBoundsData(true);
            })
            .mouseOut(function() {
                this.highlight(false);
                this.drawBounds(false);
                this.drawBoundsData(false);
            })*/
            .mouseDown(function() {
                //fbug(this._parent.pointToTile(this._translate))
            })
            .translateToTile(pos[0], pos[1], pos[2])
            .size3d(32, 32, 1);

        var tile = new IgeEntity()
            .texture(ss.texture)
            .cell(ss.cell)
            .drawBounds(false)
            .drawBoundsData(false)
            .dimensionsFromCell()
            .mount(container);


    },

    addEntity: function(entityData) {
        var entity = new Entity(entityData);
        this.entities.add(entity);


    },


    getDirection: function(fx, fy, tx, ty) {
        fx = parseInt(fx, 10);
        fy = parseInt(fy, 10);
        tx = parseInt(tx, 10);
        ty = parseInt(ty, 10);

        var ret = 'l';

        if( fx === tx ) {
            if( fy > ty ) {
                ret = 'tr';
            }
            else {
                ret = 'lb';
            }
        }
        else if( fy === ty ) {
            if( fx > tx ) {
                ret = 'lt';
            }
            else {
                ret = 'br';
            }
        }//4,6 5,5
        else if( fx > tx && fy > ty ) {
            ret = 't';
        }
        else if( fx < tx && fy < ty ) {
            ret = 'b';
        }
        else if( fx > tx && fy < ty ) {
            ret = 'l';
        }
        else if( fx < tx && fy > ty ) {
            ret = 'r';
        }

        if( fx === ty && tx === ty ) {
            ret = 'l';
        }

        return ret;
    }
};


