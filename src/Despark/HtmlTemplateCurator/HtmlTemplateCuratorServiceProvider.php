<?php

namespace Despark\HtmlTemplateCurator;

use Illuminate\Support\ServiceProvider;
use App;

class HtmlTemplateCuratorServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application events.
     */
    public function boot()
    {
        $this->loadViewsFrom(__DIR__.'/../../views', 'html-template-curator');

        $this->publishes([
                __DIR__.'/../../views' => base_path('resources/views/vendor/html-template-curator'),
            ], 'views');

        $this->publishes([
                __DIR__.'/../../config/html-template-curator.php' => config_path('html-template-curator.php'),
            ], 'config');

        $this->publishes([
                __DIR__.'/../../../public' => public_path('vendor/html-template-curator'),
            ], 'public');

        if (! $this->app->routesAreCached()) {
            require __DIR__.'/../../routes.php';
        }
    }

    /**
     * Register the service provider.
     */
    public function register()
    {
        $this->app->register('Cviebrock\ImageValidator\ImageValidatorServiceProvider');
        $this->app->register('Intervention\Image\ImageServiceProvider');
        $this->app->bind('html-template-curator', function ($app) {
            return new HtmlTemplateCurator();
        });
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
