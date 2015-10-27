(function ($) {
    $.fn.outerHTML = function(s) {
        return (s)
            ? this.before(s).remove()
            : jQuery('<p>').append(this.eq(0).clone()).html();
    }

    $.extend(templateEditorConfig, {
        hideEditButton: function() {
            $('.edit-toolbar').remove();
        },

        hideDeleteButton: function() {
            $('.js-delete-toolbar').remove();
        },

        loadArticleStyle: function (url) {
            var link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.className = 'aricle-style';
            link.href = url;
            $('head').append(link);
        },

        idForHtmlTemplateContainer: 'template-editor-html-content',
    });

    $.fn.templateEditor = function(templateContentSelector, selectedTemplate, templateContainerSelector) {
        var self = this;

        //Append the approriate styles
        $('head').append('<link rel="stylesheet" href="/vendor/html-template-curator/js/vendor/bootstrap/dist/css/bootstrap.min.css" type="text/css" />');
        $('head').append('<link rel="stylesheet" href="/vendor/html-template-curator/css/vendor/fontawesome/css/font-awesome.min.css" type="text/css" />');
        $('head').append('<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css" type="text/css" />');
        $('head').append('<link rel="stylesheet" href="/vendor/html-template-curator/css/vendor/bootstrap-responsive.css" type="text/css" />');
        $('head').append('<link rel="stylesheet" href="/vendor/html-template-curator/css/vendor/bootstrap-tokenizer.css" type="text/css" />');
        $('head').append('<link rel="stylesheet" href="/vendor/html-template-curator/css/vendor/imgareaselect-default.css" type="text/css" />');
        $('head').append('<link rel="stylesheet" href="/vendor/html-template-curator/css/vendor/redactor/redactor.css" type="text/css" />');
        $('head').append('<link rel="stylesheet" href="/vendor/html-template-curator/css/html_template_curator.css" type="text/css" />');

        var editToolbarHtml =
            '<div class="btn-group edit-toolbar" role="group" aria-label="Edit">'
                +'<button type="button" class="btn btn-primary js-edit">Edit</button>'
            +'</div>';

        var deleteToolbarHtml =
            '<div class="btn-group js-delete-toolbar" role="group" aria-label="Delete">'
                +'<button type="button" class="btn btn-danger js-delete">X</button>'
            +'</div>';

        $.ajax({
            url: templateEditorConfig.baseUrl + '/html_template_curator/load_available_templates',
            type: 'get',
            dataType: 'json',
            success: function(response) {
                $.each(response, function (i, v) {
                    self.append('<option value="' + i + '" ' + (i == selectedTemplate ? 'selected="selected"' : '') + '>' + v + '</option>');
                });

                if (selectedTemplate) {
                    $.ajax({
                        url: templateEditorConfig.baseUrl + '/html_template_curator/load_template_style',
                        data: {
                            template: selectedTemplate
                        },
                        type: 'get',
                        dataType: 'json',
                        success: function(response) {
                            templateEditorConfig.loadArticleStyle(response.style);
                        }
                    });
                }
            }
        });

        var hiddenInputForContent = $(templateContentSelector);
        hiddenInputForContent.hide();

        if (templateContainerSelector) {
            $(templateContainerSelector).html('<div id="' + templateEditorConfig.idForHtmlTemplateContainer + '">' + hiddenInputForContent.val() + '</div>');
        }
        else {
            hiddenInputForContent.after('<div id="' + templateEditorConfig.idForHtmlTemplateContainer + '">' + hiddenInputForContent.val() + '</div>');
        }



        self.on('change', function () {
            $.ajax({
                url: templateEditorConfig.baseUrl + '/html_template_curator/load_template',
                data: {
                    template: self.val()
                },
                type: 'get',
                dataType: 'json',
                success: function(response) {
                    $('#' + templateEditorConfig.idForHtmlTemplateContainer ).html(response.html);
                    $(templateContentSelector).val(response.html);

                    templateEditorConfig.loadArticleStyle(response.style);
                }
            });
        });

        $('#' + templateEditorConfig.idForHtmlTemplateContainer )
            .on('mouseenter', '.eg-editable', function(e) {
                var editToolbar = $(editToolbarHtml);
                editToolbar.css({top: '-34px'});
                $(this).prepend(editToolbar);

                if ($(this).hasClass('eg-cancellable')) {

                    var cancelButtonValue = 'Cancel';
                    if (
                        $('.related-stories').hasClass('js-cancelled') ||
                        $('.general .fourth-section').hasClass('js-cancelled') ||
                        $('.sound').hasClass('js-cancelled')
                    ) {
                            cancelButtonValue = 'Add';
                    }
                    $('.edit-toolbar', this).append('<button type="button" class="btn btn-success js-cancel">'+cancelButtonValue+'</button>');
                };
            })
            .on('mouseleave', '.eg-editable', templateEditorConfig.hideEditButton)

            .on('click', '.edit-toolbar .js-edit', function(e) {
                var self = $(this).closest('.eg-editable');

                // Editable item is an image
                var img = $('img', self),
                    imgArea = null;

                // Editable item is video
                var video = $('iframe',$(this).closest('.fourth-section'));
                // Editable item is sound
                var soundcloud = $('iframe',$(this).closest('.sound'));

                if (img.length) {

                    imgTitle = $("figcaption:not('.photo-author')", self);
                    imgAuthor = $("figcaption.photo-author", self);

                    var html =
                        '<div class="form-group">'+
                            '<label for="caption">Image title:</label>'+
                            '<input id="image-caption" class="form-control" name="caption" type="text" value="'+(imgTitle.length ? imgTitle.text() : '')+'" />'+
                            '<label for="author">Image author:</label>'+
                            '<input id="author-caption" class="form-control" name="author_caption" type="text" value="'+(imgAuthor.length ? imgAuthor.text() : '')+'" />'+
                            '<label for="image">Image:</label>'+
                            '<input id="inline-uploader" class="form-control" name="image" type="file" />'+
                            '<div id="inlineImageContainer" style="position: relative;"></div>'+
                        '</div>';
                        html = html.concat('<input type="text" id="inputUrl" style="width: 100%" placeholder="Paste your link"/>');

                    $('#redactorDialog')
                        .off('show.bs.modal')
                        .on('show.bs.modal', function(e) {
                            $('.modal-body', this).html(html);

                            // Article thumbnails uploader
                            $('#inline-uploader')
                                .fileupload({
                                    url: templateEditorConfig.baseUrl + '/html_template_curator/inline_upload?w='+img.width()+'&h='+img.height()+'&_token='+templateEditorConfig.csrfToken,
                                    dataType: 'json',
                                    done: function (e, response) {
                                        $('#inline-uploader').siblings('.text-danger').remove();

                                        if (response.result.status == 'success') {
                                            $('.js-update-content').prop('disabled', false);

                                            $('#inlineImageContainer').html(response.result.html);
                                            $('.modal-dialog').css({
                                                width: (40 + response.result.image_width)+'px'
                                            });
                                            // $(window).trigger('resize');

                                            var x1 = (response.result.image_width - img.width()) / 2,
                                                y1 = (response.result.image_height - img.height()) / 2,
                                                x2 = x1 + img.width(),
                                                y2 = y1 + img.height();

                                            $('#_x1').val(x1);
                                            $('#_y1').val(y1);
                                            $('#_x2').val(x2);
                                            $('#_y2').val(y2);

                                            imgArea = $('#inlineImage').imgAreaSelect({
                                                x1: x1,
                                                y1: y1,
                                                x2: x2,
                                                y2: y2,
                                                instance: true,
                                                minWidth: img.width(),
                                                minHeight: img.height(),
                                                aspectRatio: img.width() + ':' + img.height(),
                                                handles: true,
                                                persistent: true,
                                                parent: '#inlineImageContainer',
                                                forceAbsolutePosition: true,
                                                onSelectEnd: function (img, selection) {
                                                    $('#_x1').val(selection.x1);
                                                    $('#_y1').val(selection.y1);
                                                    $('#_x2').val(selection.x2);
                                                    $('#_y2').val(selection.y2);
                                                }
                                            });
                                        }
                                        else {
                                            $('#inline-uploader').after('<div class="text-danger">'+response.result.msg+'</div>');
                                            $('.js-update-content').prop('disabled', true);
                                        }
                                    }
                                })
                                .prop('disabled', !$.support.fileInput)
                                .parent().addClass($.support.fileInput ? undefined : 'disabled');
                        });
                }
                // Editable item is sound
                else if (soundcloud.length) {
                    $('#redactorDialog')
                        .off('show.bs.modal')
                        .on('show.bs.modal', function(e) {
                            $('.modal-body', this).html(
                                '<textarea id="redactor" name="content" placeholder="Paste your SoundCloud link"></textarea>'
                            );

                            $('#redactor').redactor({
                                observeLinks: true,
                                buttons: false,
                                pastePlainText: true,
                                convertDivs: false,
                                tidyHtml: false
                            });
                        });
                }
                // Editable item is video
                else if (video.length) {

                    $('#redactorDialog')
                        .off('show.bs.modal')
                        .on('show.bs.modal', function(e) {
                            $('.modal-body', this).html(
                                '<textarea id="redactor" name="content" placeholder="Paste your YouTube link"></textarea>'
                            );

                            $('#redactor').redactor({
                                observeLinks: true,
                                buttons: false,
                                pastePlainText: true,
                                convertDivs: false,
                                tidyHtml: false
                            });
                        });
                }
                // Editable item is text
                else {

                    elemetnTag = self.prop("tagName").toLowerCase();
                    var editableText = $('<div/>').html(self.html());
                    $('.edit-toolbar', editableText).remove();
                    editableText = '<'+elemetnTag+'>'+editableText.html()+'</'+elemetnTag+'>';

                    $('#redactorDialog')
                        .off('show.bs.modal')
                        .on('show.bs.modal', function(e) {
                            $('.modal-body', this).html(
                                '<textarea id="redactor" name="content">'
                                    +editableText
                                +'</textarea>'
                            );

                            $('#redactor').redactor({
                                observeLinks: true,
                                pastePlainText: true,
                                convertDivs: false,
                                tidyHtml: false
                            });
                        });
                }

                $('#redactorDialog')
                    .off('hidden.bs.modal')
                    .on('hidden.bs.modal', function(e) {
                        $('.modal-body', this).html('');
                        $('.modal-dialog').removeAttr('style');

                        if (imgArea !== null) {
                            imgArea.setOptions({
                                disabled: true,
                                hide: true
                            });
                        }

                        $('div.edit-toolbar').remove();

                        hiddenInputForContent.val($('#' + templateEditorConfig.idForHtmlTemplateContainer ).html());
                    })

                    .off('click', '.js-update-content')
                    .on('click', '.js-update-content', function(e) {
                        if (img.length) {
                            if (imgArea) {
                                $.ajax({
                                    url: templateEditorConfig.baseUrl + '/html_template_curator/inline_crop',
                                    data: {
                                        x1: $('#_x1').val(),
                                        y1: $('#_y1').val(),
                                        x2: $('#_x2').val(),
                                        y2: $('#_y2').val(),
                                        url: $('#inputUrl').val(),
                                        filename: $('#inlineImage').data('filename'),
                                        width: img.width(),
                                        height: img.height(),
                                        author_caption: $('#author-caption').val(),
                                        image_caption: $('#image-caption').val(),
                                        _token: templateEditorConfig.csrfToken
                                    },
                                    type: 'post',
                                    dataType: 'json',
                                    success: function(response) {
                                        self.children('img').replaceWith(response.image);
                                        self.children('figcaption').text($('#image-caption').val());
                                        self.children('.photo-author').text($('#author-caption').val());
                                        $('#redactorDialog').modal('hide');
                                    },
                                    error: function (request, status, error) {
                                        $('#inlineImageContainer').after('<div class="text-danger">'+request.responseText+'</div>');
                                    }
                                });
                            }
                            else if ($('#image-caption').val() || $('#author-caption').val() || $('#inputUrl').val()) {
                                var titleText = '';

                                if ($('#image-caption').val()) {
                                    self.children('figcaption').text($('#image-caption').val());
                                    titleText = $('#image-caption').val();
                                }

                                if ($('#author-caption').val()) {
                                    self.children('.photo-author').text($('#author-caption').val());

                                    titleText += (titleText.trim() != '' ? '' : 'Image') + ' by ' + $('#author-caption').val();
                                }

                                if (titleText.trim() != '') {
                                    self
                                        .children('img')
                                        .prop('title', titleText)
                                        .prop('alt', titleText);
                                }

                                if ($('#inputUrl').val()) {
                                    self.children('a').prop('href', $('#inputUrl').val());
                                }

                                $('#redactorDialog').modal('hide');
                            }
                        }
                        else if (soundcloud.length) {
                            var url = $($('#redactor').val()).html();

                            $.get('https://api.soundcloud.com/resolve.json?url='+url+'&client_id='+templateEditorConfig.soundcloudClientId, function(responseSoundcloud) {
                                if (responseSoundcloud.id.length > 0) {
                                    alert('Invalid Soundcloud.com URL ');
                                }
                                else {
                                    var soundHtml=
                                        '<iframe width="100%" height="166" scrolling="no" frameborder="no"'
                                            +'src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/'+responseSoundcloud.id
                                            +'&amp;color=ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;'
                                            +'show_user=true&amp;show_reposts=false">'
                                        '</iframe>';

                                    self.html(soundHtml);
                                    $('#redactorDialog').modal('hide');
                                }
                            }).fail(function() {
                                alert('Invalid Soundcloud.com URL');
                            });

                        }
                        else if (video.length) {
                            var spQrStr = $($('#redactor').val()).html().substring(1);
                            var arrQrStr = new Array();
                            var arr = spQrStr.split('&');

                            for (var i=0;i<arr.length;i++){
                                var queryvalue = arr[i].split('=');
                                var videoId = queryvalue[1];
                                break;
                            }

                            if (typeof videoId === "undefined") {
                                alert('Invalid YouTube.com URL');
                            }
                            else {
                                var videoHtml =
                                '<iframe width="560" height="315" src="https://www.youtube.com/embed/'+videoId+'" frameborder="0" allowfullscreen></iframe>';
                                self.html(videoHtml);
                                $('#redactorDialog').modal('hide');
                            }
                        }
                        else {

                            var newContent = [],
                                classAttr = self.attr('class'),
                                content = $('<div/>').html($('#redactor').val()),
                                elemetnTag= self.prop("tagName").toLowerCase();

                            $.each($('>*', content), function(i, item) {
                                var obj = $(item);
                                obj.attr('class', classAttr);
                                newContent.push(obj.outerHTML());
                            });

                            if(newContent.length === 0){
                                $.each($(content), function(i, item) {
                                    var obj = $(item),
                                        html = obj.html();
                                    newContent.push('<'+elemetnTag+' class="'+classAttr+'">'+html+'</'+elemetnTag+'>');
                                });
                            }

                            self.replaceWith(newContent.join(''));
                            $('#redactorDialog').modal('hide');
                        }
                    })
                    .modal('show');
            })
            .on('click', '.edit-toolbar .js-cancel', function(e) {
                var self = $(this),
                    grandparent = 1;

                // if element is related-stories
                if (self.parents().eq(1).is("p")) {
                     grandparent = 2;
                }

                self.parents().eq(grandparent).toggleClass('js-cancelled');

                if (self.parents().eq(grandparent).hasClass('js-cancelled')) {
                    self.text('Add');
                }
                else {
                    self.text('Cancel');
                }

                hiddenInputForContent.val($('#' + templateEditorConfig.idForHtmlTemplateContainer ).html());
            });
    };
}(jQuery));