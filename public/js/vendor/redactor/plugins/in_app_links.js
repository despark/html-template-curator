if ( ! RedactorPlugins) var RedactorPlugins = {};

RedactorPlugins.in_app_links = {
    init: function()
    {
        this.buttonAdd('in_app_links', 'In-App link', this.inAppLinkShow);
        this.buttonAwesome('in_app_links', 'fa-link');
        this.observeInAppLinks();
        this.idSuffix = '-' + $(this.$editor).next('textarea').attr('id');
    },

    // LINK
    inAppLinkShow: function()
    {
        this.selectionSave();

        var entryValue;

        var callback = $.proxy(function()
        {
            this.in_app_insert_link_node = false;

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

                this.in_app_insert_link_node = elem;
            }
            else text = sel.toString();

            var thumbnail = $(this.getParent()).find('img:first');

            if (thumbnail.length) {
                $('#in-app-link-title'+this.idSuffix).val('');
                $('#in-app-videos-thumb'+this.idSuffix).attr('checked', true);
            }
            else {
                $('#in-app-link-title'+this.idSuffix).val(text);
                $('#in-app-videos-thumb'+this.idSuffix).removeAttr('checked');
            }

            // set url
            if (url != '') {
                url = url.split('=')

                if (url.length > 1 && url[url.length-1] !== undefined) {
                    entryValue = url[url.length-1];
                    delete url[url.length-1];
                }
                url = url.join('=');
                $('#in-app-link-section'+this.idSuffix).val(url);
            }

            this.inAppLinkInsertPressed = false;
            $('#insert-in-app-link'+this.idSuffix).on('click', $.proxy(this.inAppLinkProcess, this));
        }, this);

        this.modalInit('In-App Link', '#in-app-link-modal'+this.idSuffix, 460, callback);

        this.showHideEntrySlector($('#in-app-link-section'+this.idSuffix+' option:selected').val());
        this.preselectEntry(entryValue);

        // Init Chosen
        $('.js-chzn-select').unchosen();
        $('.js-chzn-select').removeClass('disabled').chosen();

        // Entry selection
        $('.js-select-section').on('change', function(e) {
            RedactorPlugins.in_app_links.showHideEntrySlector($(this).val());
        });
    },

    entrySections: [
        'ask_me',
        'what_does_that_mean',
        'videos'
    ],

    showHideEntrySlector: function(val) {
        $.each(this.entrySections, function(i, sectionName) {
            $('.js-'+sectionName).addClass('hidden');
        });

        if (val.search('\\?') > -1) {
            $.each(this.entrySections, function(i, sectionName) {
                if (val.search(sectionName) > -1) {
                    $('.js-'+sectionName).removeClass('hidden');
                }
            });
        }
    },

    preselectEntry: function(val) {
        if (val !== undefined) {
            var entry = this.findEntryInput();
            if (entry !== undefined) {
                entry.val(val);
            }
        }
    },

    getThumbnail: function(val) {
        if (val !== undefined) {
            var entry = this.findEntryInput();
            return entry.find('option[value="' + val + '"]').data('thumb');
        }
    },

    findEntryInput: function() {
        var entry;

        $.each(this.entrySections, function(i, sectionName) {
            var item = $('.js-'+sectionName+':not(.hidden)');
            if (item.length) {
                entry = item.find('select');
                return false;
            }
        });

        return entry;
    },

    inAppLinkProcess: function()
    {
        if (this.inAppLinkInsertPressed)
        {
            return;
        }

        this.inAppLinkInsertPressed = true;

        var link = $('#in-app-link-section'+this.idSuffix).val();
        var text = $('#in-app-link-title'+this.idSuffix).val();
        text = text.replace(/<|>/g, '');
        var sectionName = $('#in-app-link-section'+this.idSuffix+' option:selected').text();
        var entry = this.findEntryInput(),
            thumbnail;

        // Append entry value to link url
        if (entry != undefined) {
            link += entry.val();

            // Video thumbnail instead of title
            if ($('#in-app-videos-thumb'+this.idSuffix).is(':checked')) {
                text = thumbnail =
                    $('<img>')
                        .attr('src', this.getThumbnail(entry.val()))
                        .attr('draggable', false)
                        .addClass('video-thumb')
                        .outerHtml();
            }
        }

        // Remember to ask
        if (link.search('\\?') > -1 && link.search('remember_to_ask') > -1) {
            link += text;
        }

        // console.log(entry.val());
        // console.log(link);
        // console.log(text);
        // console.log(sectionName);
        // return;

        this.inAppLinkInsert('<a href="' + link + '"' + ' class="in-app-link" data-section="' + sectionName + '">' + text + '</a>', $.trim(text), link, sectionName, thumbnail);
    },
    inAppLinkInsert: function (a, text, link, sectionName, thumbnail)
    {
        this.selectionRestore();

        if (text !== '')
        {
            if (this.in_app_insert_link_node)
            {
                this.bufferSet();

                $(this.in_app_insert_link_node)
                    .attr('href', link)
                    .attr('data-section', sectionName)
                    .data('section', sectionName);

                if (thumbnail !== undefined) {
                    $(this.in_app_insert_link_node).html(thumbnail);
                }
                else {
                    $(this.in_app_insert_link_node).text(text);
                }
            }
            else
            {
                var $a = $(a).addClass('redactor-added-link');
                this.exec('inserthtml', this.outerHtml($a), false);

                var link = this.$editor.find('a.redactor-added-link');

                link.removeAttr('style').removeClass('redactor-added-link').each(function()
                {
                    if (this.className == '') $(this).removeAttr('class');
                });
            }

            this.sync();
        }

        // link tooltip
        setTimeout($.proxy(function()
        {
            this.observeInAppLinks();

        }, this), 5);

        this.observeImages();
        this.modalClose();
    },

    // OBSERVE LINKS
    observeInAppLinks: function()
    {
        this.$editor.find('a.in-app-link').on('click', $.proxy(this.inAppLinkObserver, this));
        this.$editor.on('click.redactor', $.proxy(function(e)
        {
            this.linkObserverTooltipClose(e);

        }, this));
        $(document).on('click.redactor', $.proxy(function(e)
        {
            this.linkObserverTooltipClose(e);

        }, this));
    },
    inAppLinkObserver: function(e)
    {
        var $link = $(e.target);

        if ($link.size() == 0 || $link[0].tagName !== 'A') return;

        var pos = $link.offset();
        if (this.opts.iframe)
        {
            var posFrame = this.$frame.offset();
            pos.top = posFrame.top + (pos.top - $(this.document).scrollTop());
            pos.left += posFrame.left;
        }

        var tooltip = $('<span class="redactor-link-tooltip"></span>');

        var href = $link.attr('href');
        if (href === undefined)
        {
            href = '';
        }

        if (href.length > 24) href = href.substring(0, 24) + '...';

        var spanLink = $('<span style="color: #ccc;">' + $link.data('section') + '</span>');

        var aEdit = $('<a href="#">' + this.opts.curLang.edit + '</a>').on('click', $.proxy(function(e)
        {
            e.preventDefault();
            // console.log(this);
            this.inAppLinkShow();
            this.linkObserverTooltipClose(false);

        }, this));

        var aUnlink = $('<a href="#">' + this.opts.curLang.unlink + '</a>').on('click', $.proxy(function(e)
        {
            e.preventDefault();
            this.execCommand('unlink');
            this.linkObserverTooltipClose(false);

        }, this));

        tooltip.append(spanLink);
        tooltip.append(' | ');
        tooltip.append(aEdit);
        tooltip.append(' | ');
        tooltip.append(aUnlink);
        tooltip.css({
            top: (pos.top + 20) + 'px',
            left: pos.left + 'px'
        });

        $('.redactor-link-tooltip').remove();
        $('body').append(tooltip);
    }
};
