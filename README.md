# Laravel HTML Template Curator
Laravel 4.2 package, which enables you to manage complicated HTML templates, preserving the design integrity.

The purpose of this package is to help you implement rich text editing for complicated HTML views, but remove the risk of breaking the beautiful designs, which your talanted designers produced.
The idea is that when coding your HTML templates you add the `eg-editable` class to all the elements, which you want to enable for editing through the HTML Template Curator and the curator automatically injects inline editors for them only when initialised.

## Genting Started
1. Add the following dependency to your composer.json's require section:
	```javascript
	"despark/html-template-curator": "1.*"
	```
2. Run composer update
3. Put your amazing HTML templates (which include the required `eg-editable` on all the editable sections) in a new folder called *templates* in your public directory.
4. Run `php artisan view:publish despark/html-template-curator` to publish views
5. Run `php artisan config:publish despark/html-template-curator` to publish the configuration files
6. Run `php artisan asset:publish despark/html-template-curator` to publish the assets
7. In the views where you want to enable the Template Curator functionality you need to have atleast the following two elements.

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
8. In the view which will hold the editor after the definition of the elements above add the following code:
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
9. Add the available templates in the following config: * config/packages/despark/html-template-curator/config.php* under the `templates` key of the config array. As key for each element of the array put the name of the folder in which the template is stored  and as a value put the display name you want to appear in the select field.
10. Add the HTML template curator's service provider in * config/app.php*
	```php
	'Despark\HtmlTemplateCurator\HtmlTemplateCuratorServiceProvider',
	```
11. Make sure you have set the proper app URL in the * config/app.php* file
12. After you are done navigate the page you just created and start editing your templates.

In the package views you will find a folder called **examples**, which contains sample implementations of the editor. 

