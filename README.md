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
7. In the views where you want to enable the Template Curator functionality you need to have atleast the following two elements. A `<select>` field which will load the available templates, so that the user can select the layout, which to edit.**E.g.**
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
@include('packages.despark.html-template-curator.partials.modal_editor_definition')
@include('packages.despark.html-template-curator.partials.script')

<script>
  $(function () {
    $('.js-artice-template').templateEditor('#content');
	});
</script>
```
