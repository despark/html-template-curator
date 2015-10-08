<?php

// HTML Template Curator Routes
use Illuminate\Http\Request;

Route::get('load_template_editor_config', function () {
    return response()->json(
        [
            'soundcloudClientId' => config('html-template-curator.soundcloud.client_id'),
        ]
    );
});
Route::get('html_template_curator/load_available_templates', function () {
    return response()->json(
        [null => '--'] + config('html-template-curator.templates')
    );
});

Route::get('html_template_curator/load_template', function (Request $request) {
    return response()->json(
        [
            'html' => file_get_contents(config('html-template-curator.templates_location').$request->input('template').'/index.html'),
            'style' => asset('templates/'.$request->input('template').'/style.css'),
        ]
    );
});

Route::get('html_template_curator/load_template_style', function (Request $request) {
    return response()->json(
        [
            'style' => asset('templates/'.$request->input('template').'/style.css'),
        ]
    );
});

// uploads
Route::put('html_template_curator/upload', 'Despark\HtmlTemplateCurator\UploadController@store');
Route::post('html_template_curator/upload', 'Despark\HtmlTemplateCurator\UploadController@store');
Route::post('html_template_curator/inline_upload', 'Despark\HtmlTemplateCurator\UploadController@inline_upload');
Route::post('html_template_curator/inline_crop', 'Despark\HtmlTemplateCurator\UploadController@inline_crop');
