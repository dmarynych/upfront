var ui = {
    init: function() {
        $('.openPeopleWin').click(function() {
            ui.openWin({
                id: 'peopleModal',
                open: function(win) {
                    new EntitiesView();


                    $('[data-toggle=popover]')
                        .popover({html: true})
                        .on('shown.bs.popover', function() {
                            var pop = $(this).parent().find('.popover');

                            pop.find('.popover-content').html(tpl.getTemplate('mobileWorkPopover'));

                            $('.bs-slider').slider();
                        });
                }
            });
        });
    },

    openWin: function(config) {
        var html = tpl.getTemplate(config.id);
        $('body').append(html);
        var win = $('#'+ config.id);
        win.modal({
            backdrop: false
        });

        win.on('hide.bs.modal', function() {
            $(this).find('.modal-content').empty();
        });



        if(config.open && _.isFunction(config.open)) {
            config.open(win);
        }
    }
};