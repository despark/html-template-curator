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
