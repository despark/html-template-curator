# Laravel HTML Template Curator
Laravel 5 package, which enables you to manage complicated HTML templates, preserving the design integrity. (if you want to use this plugin with Laravel 4 please require the *v1.0.2* )

The purpose of this package is to help you implement rich text editing for complicated HTML views, but remove the risk of breaking the beautiful designs, which your talanted designers produced.
The idea is that when coding your HTML templates you add the `eg-editable` class to all the elements, which you want to enable for editing through the HTML Template Curator and the curator automatically injects inline editors for them only when initialised.

## Genting Started
1. Add the following dependency to your composer.json's require section:
	```
	"despark/html-template-curator": "2.*"
	```
	In order to use the plugin you need to set composer's `minimum-stability` to **beta**, because we are using *cviebrock/image-validator* in beta release, since stable is still not provided for Laravel 5.
2. Run composer update
3. Add the HTML template curator's service provider in * config/app.php*
	```php
	'Despark\HtmlTemplateCurator\HtmlTemplateCuratorServiceProvider::class',
	```
4. Run `php artisan vendor:publish --provider="Despark\HtmlTemplateCurator\HtmlTemplateCuratorServiceProvider" --tag="views"` to publish views
5. Run `php artisan vendor:publish --provider="Despark\HtmlTemplateCurator\HtmlTemplateCuratorServiceProvider" --tag="config"` to publish the configuration files
6. Run `php artisan vendor:publish --provider="Despark\HtmlTemplateCurator\HtmlTemplateCuratorServiceProvider" --tag="public"` to publish the assets
7. Put your amazing HTML templates (which include the required `eg-editable` on all the editable sections) in a new folder called *templates* in your public directory. (In the */public/packages/despark/html-template-curator/templates/* folder you will find some examples of HTML templates)
8. In the views where you want to enable the Template Curator functionality you need to have atleast the following two elements.

	A `<select>` field which will load the available templates, so that the user can select the layout, which to edit.
	**E.g.**
	```php
	{{ Form::select('template', [], null, ['class' => 'form-control js-artice-template']) }}
	```

	A `<textarea>` element in which the raw and up to date HTML of the template will be loaded. (keep in mind that this element will be automatically hidden by the script)
	**E.g.**
	```php
	{{ Form::textarea('content', null, ['id' => 'content']) }}
	```
9. In the view which will hold the editor after the definition of the elements above add the following code:
	```php
	@include('packages.despark.html-template-curator.partials.modal_editor_definition') {{-- Includes the modal popup --}}
	@include('packages.despark.html-template-curator.partials.script') {{-- The needed JavaScript files for the HTML Template Curator --}}

	<script>
		$(function () {
			$('.js-artice-template').templateEditor('#content');
			/* In addition you can define the currently selected template with its value in select box as second parameter - usefull when editing already saved page. And custom selector for the container, which will contain the visual presentation of the template as a 3rd parameter
			E.g. $('.js-artice-template').templateEditor('#content', 'book', '#my_selector');*/
		});
	</script>
	```
You can uncoment `{{-- <script src="{{ asset('vendor/html-template-curator/js/vendor/jquery/dist/jquery.min.js') }}"></script> --}}` if you don't already have jQuery required somewhre in your code.
10. Add the available templates in the following config: * config/html-template-curator.php* under the `templates` key of the config array. As key for each element of the array put the name of the folder in which the template is stored  and as a value put the display name you want to appear in the select field.
11. Make sure you have set the proper app URL in the * config/app.php* file
12. After you are done navigate the page you just created and start editing your templates.

In the package views you will find a folder called **examples**, which contains sample implementations of the editor.

*P.S.: Keep in mind that this is still work in progress, so there might some small issues for resolving, but I count on you and your great pull-requests to make it a great plugin*
