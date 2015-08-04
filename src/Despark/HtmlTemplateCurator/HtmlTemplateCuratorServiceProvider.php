<?php namespace Despark\HtmlTemplateCurator;

use Illuminate\Support\ServiceProvider;
use App;

class HtmlTemplateCuratorServiceProvider extends ServiceProvider {

    /**
     * Indicates if loading of the provider is deferred.
     *
     * @var bool
     */
    protected $defer = false;

    /**
     * Bootstrap the application events.
     *
     * @return void
     */
    public function boot()
    {
        $this->package('despark/html-template-curator');

        require __DIR__.'/../../routes.php';

        App::register('Cviebrock\ImageValidator\ImageValidatorServiceProvider');
        App::register('Intervention\Image\ImageServiceProvider');
    }

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array
     */
    public function provides()
    {
        return array();
    }

}
