<?php

// HTML Template Curator Routes

Route::get('load_template_editor_config', function()
{
	return Response::json(
        [
        	'soundcloudClientId' => Config::get("html-template-curator::soundcloud.client_id"),
        ]
    );
});
Route::get('html_template_curator/load_available_templates', function()
{
	return Response::json(
		[null => '--'] + Config::get('html-template-curator::templates')
	);
});

Route::get('html_template_curator/load_template', function()
{
	return Response::json(
        [
	        'html' => file_get_contents(Config::get('html-template-curator::templates_location').Input::get('template').'/index.html'),
	        'style' => asset('templates/'.Input::get('template').'/style.css'),
        ]
    );
});

// uploads
Route::put('html_template_curator/upload', 'UploadController@store');
Route::post('html_template_curator/upload', 'UploadController@store');
Route::post('html_template_curator/inline_upload', 'UploadController@inline_upload');
Route::post('html_template_curator/inline_crop', 'UploadController@inline_crop');