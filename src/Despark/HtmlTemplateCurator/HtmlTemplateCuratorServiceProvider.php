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
            ]);

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
        $this->app->bind('html-template-curator', function ($app) {
            return new HtmlTemplateCurator();
        });

        $this->app->bind('Cviebrock\ImageValidator\ImageValidatorServiceProvider', function ($app) {
            return new ImageValidator();
        });

        $this->app->bind('Intervention\Image\ImageServiceProvider', function ($app) {
            return new Image();
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
