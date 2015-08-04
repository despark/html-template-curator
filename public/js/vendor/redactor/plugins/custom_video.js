if ( ! RedactorPlugins) var RedactorPlugins = {};

RedactorPlugins.custom_video = {
    init: function()
    {
        this.buttonAdd('custom_video', 'Insert Video', this.showVideoModal);
        this.buttonAwesome('custom_video', 'fa-video-camera');
    },

    showVideoModal: function()
    {
        var callback = $.proxy(function()
        {
            this.insert_link_node = false;

            var sel = this.getSelection();
            var url = '', text = '';

            var elem = this.getParent();
            var par = $(elem).parent().get(0);
            if (par && par.tagName === 'A')
            {
                elem = par;
            }

            if (elem && elem.tagName === 'A')
            {
                url = $(elem).attr('href');
                text = $(elem).text();

                this.insert_link_node = elem;
            }
            else text = sel.toString();

            $('#in-app-link-title').val(text);

            // set url
            if (url != '') {
                $('#in-app-link-section').val(url);
            }

            this.inAppLinkInsertPressed = false;
            $('#redactor-modal-custom-video .row-fluid img').on('click', function(e) {
                e.preventDefault();
                var self = $(this);
                self.closest('#redactor-modal-custom-video').find('.active').removeClass('active');
                self.parent().addClass('active');
            })
            $('#insert-custom-video').on('click', $.proxy(this.insertCustomVideo, this));
            bestBeginnings.initTooltips();
        }, this);

        this.modalInit('Insert Video', '#custom-video-modal', 460, callback);
    },
    insertCustomVideo: function()
    {
        var selectedVideo = $('#redactor-modal-custom-video .row-fluid .active img'),
            video =
            '<br/><div contenteditable="false"><video width="320" height="240" controls>' +
                '<source type="video/mp4" src="' + selectedVideo.data('videoSource') + '">' +
            '</video></div><br/>';

        this.insertHtmlAdvanced(video);
        this.modalClose();
    }
};
