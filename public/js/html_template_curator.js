(function ($) {
    $.fn.outerHTML = function (s) {
        return (s) ? this.before(s).remove() : jQuery('<p>').append(this.eq(0).clone()).html();
    }

    $(document).ajaxStart(function () {
        $('.modal-header img.modal-preloader').show();
    });


    $(document).ajaxStop(function () {
        $('.modal-header img.modal-preloader').hide();
    });

    $(document).on('focusin', function (e) {
        if ($(e.target).closest(".mce-window").length) {
            e.stopImmediatePropagation();
        }
    });

    $.extend(templateEditorConfig, {
        hideEditButton: function () {
            $('.edit-toolbar').remove();
        },

        hideDeleteButton: function () {
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

    $.fn.templateEditor = function (templateContentSelector, selectedTemplate, templateContainerSelector) {
        var self = this;

        //Append the approriate styles
        $('head').append('<link rel="stylesheet" href="/vendor/html-template-curator/js/vendor/bootstrap/dist/css/bootstrap.min.css" type="text/css" />');
        $('head').append('<link rel="stylesheet" href="/vendor/html-template-curator/css/vendor/fontawesome/css/font-awesome.min.css" type="text/css" />');
        $('head').append('<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css" type="text/css" />');
        $('head').append('<link rel="stylesheet" href="/vendor/html-template-curator/css/vendor/bootstrap-responsive.css" type="text/css" />');
        $('head').append('<link rel="stylesheet" href="/vendor/html-template-curator/css/vendor/bootstrap-tokenizer.css" type="text/css" />');
        $('head').append('<link rel="stylesheet" href="/vendor/html-template-curator/css/vendor/imgareaselect-default.css" type="text/css" />');

        $('head').append('<link rel="stylesheet" href="/vendor/html-template-curator/css/html_template_curator.css" type="text/css" />');

        var editToolbarHtml =
            '<div class="btn-group edit-toolbar" role="group" aria-label="Edit">' + '<button type="button" class="btn btn-primary js-edit">Edit</button>' + '</div>';

        var deleteToolbarHtml =
            '<div class="btn-group js-delete-toolbar" role="group" aria-label="Delete">' + '<button type="button" class="btn btn-danger js-delete">X</button>' + '</div>';

        $.ajax({
            url: templateEditorConfig.baseUrl + '/html_template_curator/load_available_templates',
            type: 'get',
            dataType: 'json',
            success: function (response) {
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
                        success: function (response) {
                            templateEditorConfig.loadArticleStyle(response.style);

                            body = document.getElementsByTagName('body')[0];
                            clientWidth = body.clientWidth;

                            body.dataset.clientWidth = clientWidth;

                            if ($('.js-choose-image').length) {
                                $('.js-choose-image img').each(function () {
                                    $(this).attr('src',
                                        (clientWidth < 641 ?
                                            $(this).data('imageSrcMobile') :
                                            $(this).data('imageSrcDesktop')
                                        ));
                                });
                            }

                            responsiveImages();
                        }
                    });
                }
            }
        });

        var hiddenInputForContent = $(templateContentSelector);
        hiddenInputForContent.hide();

        if (templateContainerSelector) {
            $(templateContainerSelector).html('<div id="' + templateEditorConfig.idForHtmlTemplateContainer + '">' + hiddenInputForContent.val() + '</div>');
        } else {
            hiddenInputForContent.after('<div id="' + templateEditorConfig.idForHtmlTemplateContainer + '">' + hiddenInputForContent.val() + '</div>');
        }

        var appendParagraph = function (settings) {
            var align = '';
            var title = '';
            if (!settings.wholeWidth) {
                align = '-right';
            }

            var textContainer = settings.parent.find('.text-container' + align);

            if (settings.withTitle) {
                title = '<h2 class="eg-editable eg-cancellable">New title</h2>';
            }

            if (textContainer.length) {
                textContainer.append(
                    title + '<p class="eg-editable eg-cancellable">New paragraph</p>'
                );
            } else {
                settings.parent.after(
                    '<section class="section-container add-element"><div class="text-container' + align + '">' + title +
                    '<p class="eg-editable eg-cancellable">New paragraph</p></div></section>'
                );
            }
        };

        var appendVideo = function (parent) {
            var textContainer = parent.find('.text-container-right');

            if (textContainer.length) {
                textContainer.append(
                    '<div class="eg-editable eg-cancellable"><video width="620" autoplay loop>\n' +
                    '<source src="/uploads/videos/samplevideo_1280x720_2mb.mp4" type="video/mp4" />\n' +
                    '</video></div>'
                );
            } else {
                parent.append(
                    '<section class="section-container add-element"><div class="text-container-right">' +
                    '<video autoplay loop>\n' +
                    '<source src="/uploads/videos/samplevideo_1280x720_2mb.mp4" type="video/mp4" />\n' +
                    '</video></div></section>'
                );
            }
        };

        var appendBlockquote = function (parent) {
            var textContainer = parent.find('.text-container-right');

            if (textContainer.length) {
                textContainer.append(
                    '<blockquote class="eg-editable is-cs-color eg-cancellable">New blockquote</blockquote></div>'
                );
            } else {
                parent.append(
                    '<section class="section-container add-element"><div class="text-container-right">' +
                    '<blockquote class="eg-editable is-cs-color eg-cancellable">New blockquote</blockquote></div></section>'
                );
            }
        };

        self.on('change', function () {
            $.ajax({
                url: templateEditorConfig.baseUrl + '/html_template_curator/load_template',
                data: {
                    template: self.val()
                },
                type: 'get',
                dataType: 'json',
                success: function (response) {
                    $('#' + templateEditorConfig.idForHtmlTemplateContainer).html(response.html);
                    $(templateContentSelector).val(response.html);

                    templateEditorConfig.loadArticleStyle(response.style);

                    if ($('.js-choose-image').length) {
                        $('.js-choose-image img').each(function () {
                            $(this).attr('src',
                                (clientWidth < 641 ?
                                    $(this).data('imageSrcMobile') :
                                    $(this).data('imageSrcDesktop')
                                ));
                        });
                    }

                    body = document.getElementsByTagName('body')[0];
                    clientWidth = body.clientWidth;

                    body.dataset.clientWidth = clientWidth;

                    responsiveImages();
                }
            });
        });

        $('#' + templateEditorConfig.idForHtmlTemplateContainer)
            .on('mouseenter', '.eg-editable', function (e) {
                var editToolbar = $(editToolbarHtml);
                editToolbar.css({
                    top: '-34px'
                });
                $(this).prepend(editToolbar);

                if ($(this).hasClass('eg-cancellable')) {

                    var cancelButtonValue = 'Cancel';
                    if ($(this).hasClass('js-cancelled')) {
                        cancelButtonValue = 'Add';
                    }

                    $(this).find('> .edit-toolbar').append('<button type="button" class="btn btn-success js-cancel">' + cancelButtonValue + '</button>');
                };
            })
            .on('mouseleave', '.eg-editable', templateEditorConfig.hideEditButton)

        .on('mouseenter', '.eg-removeable', function (e) {
                var removeToolbar = $('<div class="custom-remove js-remove">Hide Panel</a></div>');
                $(this).append(removeToolbar);
            })
            .on('mouseleave', '.eg-removeable', function (e) {
                $(this).find('.custom-remove').remove();
            })

        .on('click', '.js-remove', function (e) {
            $(this).parent().toggleClass('js-cancelled');

            $('div.edit-toolbar, div.js-remove, div.add-toolbar').remove();

            hiddenInputForContent.val($('#' + templateEditorConfig.idForHtmlTemplateContainer).html());
        })

        .on('click', '.edit-toolbar .js-edit', function (e) {
                var self = $(this).closest('.eg-editable');

                // Editable item is an image
                var img = $('img', self),
                    imgArea = null;

                // Editable item is video
                var video = $('iframe', $(this).closest('.fourth-section'));
                // Editable item is sound
                var soundcloud = $('iframe', $(this).closest('.sound'));

                if (img.length) {
                    imgTitle = $("figcaption:not('.photo-author')", self);
                    imgAuthor = $("figcaption.photo-author", self);

                    var html =
                        '<div class="form-group">' +
                        '<label for="caption">Image title:</label>' +
                        '<input id="image-caption" class="form-control" name="caption" type="text" value="' + (imgTitle.length ? imgTitle.text() : '') + '" />' +
                        '<label for="author">Image author:</label>' +
                        '<input id="author-caption" class="form-control" name="author_caption" type="text" value="' + (imgAuthor.length ? imgAuthor.text() : '') + '" />' +
                        '<label for="image">Image:</label>' +
                        '<input id="inline-uploader" class="form-control" name="image" type="file" />' +
                        '<div id="inlineImageContainer" style="position: relative;"></div>' +
                        '<label for="mobile-image">Mobile Image:</label>' +
                        '<input id="inline-uploader-mobile" class="form-control" name="image" type="file" />' +
                        '<div id="inlineImageContainerMobile"></div>' +
                        '</div>';
                    html = html.concat('<input type="text" id="inputUrl" style="width: 100%" placeholder="Paste your link"/>');

                    $('#redactorDialog')
                        .off('show.bs.modal')
                        .on('show.bs.modal', function (e) {
                            $('.modal-body', this).html(html);

                            // Article thumbnails uploader
                            $('#inline-uploader')
                                .fileupload({
                                    url: templateEditorConfig.baseUrl + '/html_template_curator/inline_upload?w=' + img.width() + '&h=' + img.height() + '&_token=' + templateEditorConfig.csrfToken,
                                    dataType: 'json',
                                    done: function (e, response) {
                                        $('#inline-uploader').siblings('.text-danger').remove();

                                        if (response.result.status == 'success') {
                                            $('.js-update-content').prop('disabled', false);
                                            $('#inlineImageContainer').html(response.result.html);
                                            $('.modal-dialog').css({
                                                width: (40 + response.result.image_width) + 'px'
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

                                            imgArea = $('#inlineImageContainer #inlineImage').imgAreaSelect({
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
                                        } else {
                                            $('#inline-uploader').after('<div class="text-danger">' + response.result.msg + '</div>');
                                            $('.js-update-content').prop('disabled', true);
                                        }
                                    }
                                })
                                .prop('disabled', !$.support.fileInput)
                                .parent().addClass($.support.fileInput ? undefined : 'disabled');

                            $('#inline-uploader-mobile')
                                .fileupload({
                                    url: templateEditorConfig.baseUrl + '/html_template_curator/inline_upload?w=0&h=0&_token=' + templateEditorConfig.csrfToken,
                                    dataType: 'json',
                                    done: function (e, response) {
                                        $('#inline-uploader').siblings('.text-danger').remove();

                                        if (response.result.status == 'success') {
                                            $('.js-update-content').prop('disabled', false);
                                            $('#inlineImageContainerMobile').html(response.result.html);
                                        } else {
                                            $('#inline-uploader').after('<div class="text-danger">' + response.result.msg + '</div>');
                                            $('.js-update-content').prop('disabled', true);
                                        }
                                    }
                                })
                                .prop('disabled', !$.support.fileInput)
                                .parent().addClass($.support.fileInput ? undefined : 'disabled');
                        });
                } else if (soundcloud.length) {
                    // Editable item is sound
                    $('#redactorDialog')
                        .off('show.bs.modal')
                        .on('show.bs.modal', function (e) {
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
                } else if (video.length) {
                    // Editable item is video
                    $('#redactorDialog')
                        .off('show.bs.modal')
                        .on('show.bs.modal', function (e) {
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
                } else if (self.prop("tagName").toLowerCase() == 'div' && self.hasClass('slider')) {
                    // Editable item is slider
                    var editSlider = true;



                    var currentSlides = self.find('.slider-item'),
                        currentSlidesArray = [];

                    var sliderContent = self.find('.js-slider-wrapper').html();

                    $.each(currentSlides, function (i, item) {
                        currentSlidesArray.push(item.dataset);
                    });

                    initSlidesEditor(templateEditorConfig, currentSlidesArray, sliderContent);
                } else {
                    // Editable item is text
                    elementTag = self.prop("tagName").toLowerCase();
                    var editableText = $('<div/>').html(self.html());
                    $('.edit-toolbar', editableText).remove();
                    editableText = '<' + elementTag + '>' + editableText.html() + '</' + elementTag + '>';

                    $('#redactorDialog')
                        .off('show.bs.modal')
                        .on('show.bs.modal', function (e) {
                            $('.modal-body', this).html(
                                '<textarea id="redactor" name="content">' + editableText + '</textarea>'
                            );

                            tinymce.init({
                                selector: "#redactor",
                                plugins: [
                                    "advlist autolink lists link image charmap print preview anchor",
                                    "searchreplace visualblocks code fullscreen responsivefilemanager",
                                    "insertdatetime media table contextmenu paste imagetools jbimages"
                                ],
                                content_css: "/css/styles.css",
                                menubar: false,
                                toolbar: "code undo redo | styleselect | bold italic | bullist numlist | link image jbimages | media",
                                image_advtab: true,
                                relative_urls: false,
                                imagetools_cors_hosts: ['despark.app', 'despark.com', '2015.despark.com'],
                                valid_elements: '*[*]',
                                height: 400,
                                external_filemanager_path: "/plugins/filemanager/",
                                filemanager_title: "Responsive Filemanager",
                                external_plugins: {
                                    "filemanager": "/plugins/filemanager/plugin.min.js"
                                },
                                video_template_callback: function (data) {
                                    return '<video width="' + data.width + '" height="' + data.height + '"' + (data.poster ? ' poster="' + data.poster + '"' : '') + ' autoplay loop>\n' + '<source src="' + data.source1 + '"' + (data.source1mime ? ' type="' + data.source1mime + '"' : '') + ' />\n' +
                                        (data.source2 ? '<source src="' + data.source2 + '"' + (data.source2mime ? ' type="' + data.source2mime + '"' : '') + ' />\n' : '') + '</video>';
                                },
                                visualblocks_default_state: true,
                                end_container_on_empty_block: true
                            });
                        });
                }

                $('#redactorDialog')
                    .off('hidden.bs.modal')
                    .on('hidden.bs.modal', function (e) {
                        $('.modal-body', this).html('');
                        $('.modal-dialog').removeAttr('style');

                        if (imgArea !== null) {
                            imgArea.setOptions({
                                disabled: true,
                                hide: true
                            });
                        }

                        $('div.edit-toolbar, div.js-remove, div.add-toolbar').remove();

                        hiddenInputForContent.val($('#' + templateEditorConfig.idForHtmlTemplateContainer).html());
                    })
                    .off('click', '.js-update-content')
                    .on('click', '.js-update-content', function (e) {
                        if (img.length) {
                            if (imgArea) {
                                var imgFilename = $('#inlineImageContainer #inlineImage').data('filename');
                                var mobileFilename = $('#inlineImageContainerMobile #inlineImage').data('filename')
                                $.ajax({
                                    url: templateEditorConfig.baseUrl + '/html_template_curator/award_inline_crop',
                                    data: {
                                        x1: $('#_x1').val(),
                                        y1: $('#_y1').val(),
                                        x2: $('#_x2').val(),
                                        y2: $('#_y2').val(),
                                        url: $('#inputUrl').val(),
                                        width: $('#_x2').val() - $('#_x1').val(),
                                        height: $('#_y2').val() - $('#_y1').val(),
                                        filename: imgFilename,
                                        mobileFilename: mobileFilename,
                                        author_caption: $('#author-caption').val(),
                                        image_caption: $('#image-caption').val(),
                                        _token: templateEditorConfig.csrfToken
                                    },
                                    type: 'post',
                                    dataType: 'json',
                                    success: function (response) {
                                        self.children('img').replaceWith(response.image);
                                        self.children('figcaption').text($('#image-caption').val());
                                        self.children('.photo-author').text($('#author-caption').val());
                                        $('#redactorDialog').modal('hide');
                                        $('.add-toolbar').remove();
                                    },
                                    error: function (request, status, error) {
                                        $('#inlineImageContainer').after('<div class="text-danger">' + request.responseText + '</div>');
                                    }
                                });
                            } else if ($('#image-caption').val() || $('#author-caption').val() || $('#inputUrl').val()) {
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
                                    self.children('img')
                                        .prop('title', titleText)
                                        .prop('alt', titleText);
                                }

                                if ($('#inputUrl').val()) {
                                    self.children('a').prop('href', $('#inputUrl').val());
                                }

                                $('#redactorDialog').modal('hide');
                                $('.add-toolbar').remove();
                            }
                        } else if (soundcloud.length) {
                            var url = $($('#redactor').val()).html();

                            $.get('https://api.soundcloud.com/resolve.json?url=' + url + '&client_id=' + templateEditorConfig.soundcloudClientId, function (responseSoundcloud) {
                                if (responseSoundcloud.id.length > 0) {
                                    alert('Invalid Soundcloud.com URL ');
                                } else {
                                    var soundHtml =
                                        '<iframe width="100%" height="166" scrolling="no" frameborder="no"' + 'src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + responseSoundcloud.id + '&amp;color=ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;' + 'show_user=true&amp;show_reposts=false">'
                                    '</iframe>';

                                    self.html(soundHtml);
                                    $('#redactorDialog').modal('hide');
                                    $('.add-toolbar').remove();
                                }
                            }).fail(function () {
                                alert('Invalid Soundcloud.com URL');
                            });

                        } else if (video.length) {
                            var spQrStr = $($('#redactor').val()).html().substring(1);
                            var arrQrStr = new Array();
                            var arr = spQrStr.split('&');

                            for (var i = 0; i < arr.length; i++) {
                                var queryvalue = arr[i].split('=');
                                var videoId = queryvalue[1];
                                break;
                            }

                            if (typeof videoId === "undefined") {
                                alert('Invalid YouTube.com URL');
                            } else {
                                var videoHtml =
                                    '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe>';
                                self.html(videoHtml);
                                $('#redactorDialog').modal('hide');
                                $('.add-toolbar').remove();
                            }
                        } else if ($('#js-save-slide').length) {

                            $('#js-save-slide').on('submit', function (e) {
                                e.preventDefault();
                                var form = $(this);
                                var formData = new FormData(this);

                                formData.append('desktop_image', $('input[name="desktop_image"]', form).get(0).files[0]);
                                formData.append('mobile_image', $('input[name="mobile_image"]', form).get(0).files[0]);

                                $.ajax({
                                        method: form.attr('method'),
                                        url: form.attr('action') + '?_token=' + templateEditorConfig.csrfToken + '&order=' + $('input[name="order"]', form).val(),
                                        data: formData,
                                        cache: false,
                                        contentType: false,
                                        processData: false,
                                        dataType: 'json',
                                    })
                                    .fail(function (response) {
                                        $('.text-danger', form).hide();
                                        // set errors
                                        $.each(response.responseJSON, function (i, item) {
                                            $('#error_' + item.key).html(item.errors).show();
                                        });

                                        return false;
                                    })
                                    .done(function (data) {
                                        var editSlider = true;

                                        var currentSlides = $('<div>' + data.newSliderHtml + '</div>').find('.slider-item'),
                                            currentSlidesArray = [];

                                        var sliderContent = data.newSliderHtml;

                                        $.each(currentSlides, function (i, item) {
                                            currentSlidesArray.push(item.dataset);
                                        });

                                        initSlidesEditor(templateEditorConfig, currentSlidesArray, sliderContent);

                                        return false;
                                    });
                            });

                            $('#js-save-slide').submit();
                        } else if (editSlider == true) {
                            var newRawContent = $('#cs-slider-edit-raw').html();

                            $('.js-slider-wrapper', self).html(newRawContent);
                            $('#redactorDialog').modal('hide');
                            $('.add-toolbar').remove();
                        } else {
                            tinymce.activeEditor.save();
                            var newContent = [],
                                classAttr = self.attr('class'),
                                content = $('<div/>').html($('#redactor').val()),
                                elementTag = self.prop("tagName").toLowerCase();

                            $.each($('>*', content), function (i, item) {
                                var obj = $(item);
                                var element = $('<' + elementTag + ' class="' + classAttr + '">' + obj.html() + '</' + elementTag + '>');
                                newContent.push(element.outerHTML());
                            });

                            if (newContent.length === 0) {
                                $.each($(content), function (i, item) {
                                    var obj = $(item),
                                        html = obj.html();
                                    newContent.push('<' + elementTag + ' class="' + classAttr + '">' + html + '</' + elementTag + '>');
                                });
                            }

                            self.replaceWith(newContent.join(''));
                            $('#redactorDialog').modal('hide');
                        }
                    })
                    .modal('show');
                $('.add-toolbar').remove();
            })
            .on('click', '.edit-toolbar .js-cancel', function (e) {
                var self = $(this),
                    grandparent = 1;

                self.parents().eq(grandparent).toggleClass('js-cancelled');

                if (self.parents().eq(grandparent).hasClass('js-cancelled')) {
                    self.text('Add');
                } else {
                    self.text('Cancel');
                }

                $('div.edit-toolbar, div.js-remove, div.add-toolbar').remove();
                hiddenInputForContent.val($('#' + templateEditorConfig.idForHtmlTemplateContainer).html());

            });

        var addToolbarHtml =
            '<div class="btn-group add-toolbar" role="group" aria-label="Add">' +
            '<button type="button" class="btn btn-success js-add-blockquote">Blockquote</button>' +
            '<button type="button" class="btn btn-success js-add-title-p-right">Right title+p</button>' +
            '<button type="button" class="btn btn-success js-add-paragraph-right">Right p</button>' +
            '<button type="button" class="btn btn-success js-add-title-p">Left title+p</button>' +
            '<button type="button" class="btn btn-success js-add-paragraph">Left p</button>' +
            '<button type="button" class="btn btn-success js-add-image">Image</button>' +
            '<button type="button" class="btn btn-success js-add-three-images">3 images</button>' +
            '<button type="button" class="btn btn-success js-add-slider">Slider</button>' +
            '<button type="button" class="btn btn-success js-add-video">Video</button>' +
            '</div>';
        var addToolbar = $(addToolbarHtml);

        $('#' + templateEditorConfig.idForHtmlTemplateContainer)
            .on('mouseenter', '.add-element', function (e) {
                $(this).prepend(addToolbar);
            })
            .on('mouseleave', '.add-element', function (e) {
                $('.add-toolbar').remove();
            })
            .on('click', '.js-add-blockquote', function (e) {
                var parent = $(this).closest('.add-element');
                appendBlockquote(parent);
            })
            .on('click', '.js-add-video', function (e) {
                var parent = $(this).closest('.add-element');
                appendVideo(parent);
            })
            .on('click', '.js-add-title-p-right', function (e) {
                var parent = $(this).closest('.add-element');
                appendParagraph({
                    parent: parent,
                    withTitle: true
                });
            })
            .on('click', '.js-add-paragraph-right', function (e) {
                var parent = $(this).closest('.add-element');
                appendParagraph({
                    parent: parent
                });
            })
            .on('click', '.js-add-title-p', function (e) {
                var parent = $(this).closest('.add-element');
                appendParagraph({
                    parent: parent,
                    withTitle: true,
                    wholeWidth: true
                });
            })
            .on('click', '.js-add-paragraph', function (e) {
                var parent = $(this).closest('.add-element');
                appendParagraph({
                    parent: parent,
                    wholeWidth: true
                });
            })
            .on('click', '.js-add-three-images', function (e) {
                var parent = $(this).closest('.add-element');
                parent.after(
                    '<section class="section-container three-image-container eg-editable eg-cancellable add-element">' +
                    '<div class="eg-editable" style="display:inline-block;"><img src="http://placehold.it/480x640" alt="Pic description"></div>' +
                    '<div class="eg-editable" style="display:inline-block;"><img src="http://placehold.it/640X400" alt="Pic description"></div>' +
                    '<div class="eg-editable" style="display:inline-block;"><img src="http://placehold.it/640x400" alt="Pic description"></div>' +
                    '</section>'
                );
            })
            .on('click', '.js-add-image', function (e) {
                var parent = $(this).closest('.add-element');
                parent.after(
                    '<section class="section-container img-full eg-editable eg-cancellable add-element">' +
                    '<img src="/templates/case_study/img/cs-pic-01.jpg" alt="Pic description">' +
                    '</section>'
                );
            })
            .on('click', '.js-add-slider', function (e) {
                var parent = $(this).closest('.add-element');
                parent.after(
                    '<div class="slider eg-editable eg-cancellable add-element">' +
                    '<div class="slider-container">' +
                    '<section class="js-slider-wrapper owl-carousel">' +
                    '<div class="slider-item js-responsive-image js-is-background"' +
                    'data-responsiveimagewidth640="/templates/case_study/img/BMW-01-mobile.png"' +
                    'data-responsiveimagewidth1024="/templates/case_study/img/BMW-01.jpg"' +
                    'data-responsiveimagewidth1440="/templates/case_study/img/BMW-01.jpg"' +
                    'data-responsiveimagewidth1920="/templates/case_study/img/BMW-01.jpg"' +
                    'data-responsiveimagewidth2560="/templates/case_study/img/BMW-01.jpg"' +
                    '></div>' +
                    '<div class="slider-item js-responsive-image js-is-background"' +
                    'data-responsiveimagewidth640="/templates/case_study/img/BMW-02-mobile.png"' +
                    'data-responsiveimagewidth1024="/templates/case_study/img/BMW-02.jpg"' +
                    'data-responsiveimagewidth1440="/templates/case_study/img/BMW-02.jpg"' +
                    'data-responsiveimagewidth1920="/templates/case_study/img/BMW-02.jpg"' +
                    'data-responsiveimagewidth2560="/templates/case_study/img/BMW-02.jpg"' +
                    '></div>' +
                    '<div class="slider-item js-responsive-image js-is-background"' +
                    'data-responsiveimagewidth640="/templates/case_study/img/BMW-03-mobile.png"' +
                    'data-responsiveimagewidth1024="/templates/case_study/img/BMW-03.jpg"' +
                    'data-responsiveimagewidth1440="/templates/case_study/img/BMW-03.jpg"' +
                    'data-responsiveimagewidth1920="/templates/case_study/img/BMW-03.jpg"' +
                    'data-responsiveimagewidth2560="/templates/case_study/img/BMW-03.jpg"' +
                    '></div>' +
                    '<div class="slider-item js-responsive-image js-is-background"' +
                    'data-responsiveimagewidth640="/templates/case_study/img/BMW-04-mobile.png"' +
                    'data-responsiveimagewidth1024="/templates/case_study/img/BMW-04.jpg"' +
                    'data-responsiveimagewidth1440="/templates/case_study/img/BMW-04.jpg"' +
                    'data-responsiveimagewidth1920="/templates/case_study/img/BMW-04.jpg"' +
                    'data-responsiveimagewidth2560="/templates/case_study/img/BMW-04.jpg"' +
                    '></div>' +
                    '</section>' +
                    '</div>' +
                    '</div>'
                );
            });
    };
}(jQuery));

var clientWidth;


function closest(array, num) {
    var i = 0;
    var min = null;
    var size = null;

    for (i in array) {
        var m = Math.abs(num - array[i]);
        if (min == null || m < min) {
            min = m;
            size = array[i]
        }
    }

    return size;
}

function responsiveImages() {
    var viewWidth = Number(body.dataset.clientWidth);
    var elements = document.getElementsByClassName('js-responsive-image');
    var imageSize, i, item, arr;

    for (i = 0; i < elements.length; i++) {
        item = elements[i];
        arr = Object.keys(item.dataset).map(function (key) {
            return Number(key.split("responsiveImageWidth-").pop());
        });
        var imageSizeToUse = closest(arr, viewWidth);
        var imageUrl = item.dataset['responsiveImageWidth-' + imageSizeToUse];

        if (item.classList.contains('js-is-background')) {
            imageUrl = 'url(' + imageUrl + ')';
            item.style.backgroundImage = imageUrl;
        }
    }
}

function updateSlides(slidesSelector, contentSelector) {
    contentSelector.html('');

    $.each(slidesSelector, function (i, item) {
        var slide = '<div class="slider-item js-responsive-image js-is-background"';

        item.dataset.order = i;

        $.each(item.dataset, function (size, url) {
            slide += ' data-responsive-image-width-' + size + '="' + url + '"';
        });

        slide += '></div>';

        contentSelector.append(slide);
    });
}

function initSlidesEditor(templateEditorConfig, currentSlidesArray, sliderContent) {
    $.ajax({
        url: templateEditorConfig.baseUrl + '/html_template_curator/manage_slides',
        data: {
            slides: currentSlidesArray,
            sliderContent: sliderContent,
            _token: templateEditorConfig.csrfToken
        },
        type: 'post',
        success: function (response) {
            var modalDialog = $('.modal-body', $('#redactorDialog'));

            if (modalDialog.length) {
                modalDialog.html(response);
            } else {
                $('#redactorDialog')
                    .off('show.bs.modal')
                    .on('show.bs.modal', function (e) {
                        $('.modal-body', this).html(response);
                    });
            }

            $('.slides-list').sortable({
                update: function (event, ui) {
                    updateSlides($('.slides-list li'), $('#cs-slider-edit-raw'));
                }
            });
            $('.slides-list').disableSelection();

            $('.slides-list li').on('click', function () {
                var image640 = $(this).data('responsiveimagewidth640'),
                    image2560 = $(this).data('responsiveimagewidth2560'),
                    order = $(this).data('order'),
                    sliderContent = $('#cs-slider-edit-raw').html();

                $.ajax({
                    url: templateEditorConfig.baseUrl + '/html_template_curator/manage_slide',
                    data: {
                        image640: image640,
                        image2560: image2560,
                        order: order,
                        model_id: templateEditorConfig.projectModelId,
                        slider_content: sliderContent,
                        _token: templateEditorConfig.csrfToken
                    },
                    type: 'post',
                    success: function (response) {
                        $('.modal-body').slideUp(function () {
                            $(this).html(response).slideDown();
                        });
                    }
                });
            });
        },
        error: function (request, status, error) {
            $('#inlineImageContainer').after('<div class="text-danger">' + request.responseText + '</div>');
        }
    });
}
