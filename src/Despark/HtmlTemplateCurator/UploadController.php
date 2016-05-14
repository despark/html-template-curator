<?php

namespace Despark\HtmlTemplateCurator;

use Despark\HtmlTemplateCurator\Uploader\ImageUploader;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Input;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller as BaseController;
use Validator;
use Intervention\Image\Facades\Image;
use Imagick;

class UploadController extends BaseController
{
    /**
     * @var ImageUploader
     */
    protected $uploader;

    private $uploadDirectory;

    /**
     * @param ImageUploader $uploader
     */
    public function __construct(ImageUploader $uploader)
    {
        $this->uploader = $uploader;

        $this->uploadDirectory = public_path().'/'.config('html_template_curator.upload_directory_name').'/';

        // Check if uploads folder exists and create if not
        if (! File::isDirectory($this->uploadDirectory)) {
            File::makeDirectory($this->uploadDirectory, 0755, true, true);
        }

        // Check if folder for storing images and temp dir exists and create if not
        if (! File::isDirectory($this->uploadDirectory.'images/temp/')) {
            File::makeDirectory($this->uploadDirectory.'images/temp/', 0755, true, true);
        }
    }

    /**
     * Store an image to temp dir.
     *
     * @return Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),
            [
                'image' => 'required|image|image_size:>=720,>=480',
            ]
        );

        if ($validator->passes()) {
            // upload image
            $this->uploader->upload('image');
            $this->uploader->image->orientate();
            $filename = $this->uploader->getFilename();
            $path = 'images/temp/';
            $image = $path.$filename;
            $extention = $this->uploader->getExt();
            $this->uploader->image->save($this->uploadDirectory.$image);

            $orientation = $this->uploader->image->width() > $this->uploader->image->height()
                ? 'landscape'
                : 'portrait';

            if ($orientation == 'landscape') {
                $this->uploader->image->resize(
                    1024, 768, function ($constraint) {
                        $constraint->aspectRatio();
                        $constraint->upsize();
                    }
                );
            } else {
                $this->uploader->image->resize(
                    768, 1024, function ($constraint) {
                        $constraint->aspectRatio();
                        $constraint->upsize();
                    }
                );
            }

            $resized_image = str_replace($extention, '-resized'.$extention, $image);
            $resized_image = $path.'resized-'.$filename;
            $this->uploader->image->save($this->uploadDirectory.$resized_image);

            return response()->json(
                [
                'status' => 'success',
                'html' => $this->view(
                    'articles.thumbs', [
                    'image' => asset(Config::get('html-template-curator::upload_directory_name').'/'.$resized_image),
                    'temp_filename' => $filename,
                    'width' => $this->uploader->image->width(),
                    'height' => $this->uploader->image->height(),
                    ]
                )->render(),
                ]
            );
        } else {
            return response()->json(
                [
                'status' => 'error',
                'msg' => $validator->messages()->first('image'),
                ]
            );
        }
    }

    /**
     * Store an image to temp dir.
     *
     * @return Response
     */
    public function inline_upload(Request $request)
    {
        $validator = Validator::make($request->all(),
            [
                'image' => 'required|image',
            ]
        );

        if ($validator->passes()) {
            // upload image
            $this->uploader->upload('image');

            $filename = $this->uploader->getFilename();
            $path = 'images/temp/';
            $image = $path.$filename;

            if (! is_a($this->uploader->image, 'Imagick')) {
                $this->uploader->image->orientate();
                $extention = $this->uploader->getExt();

                $orientation = $this->uploader->image->width() > $this->uploader->image->height()
                    ? 'landscape'
                    : 'portrait';

                if ($orientation == 'landscape') {
                    $this->uploader->image->resize(
                        1024, 768, function ($constraint) {
                            $constraint->aspectRatio();
                            $constraint->upsize();
                        }
                    );
                } else {
                    $this->uploader->image->resize(
                        768, 1024, function ($constraint) {
                            $constraint->aspectRatio();
                            $constraint->upsize();
                        }
                    );
                }

                $this->uploader->image->save($this->uploadDirectory.$image);

                $w = $this->uploader->image->width();
                $h = $this->uploader->image->height();
            } else {
                $this->uploader->image->writeImages($this->uploadDirectory.$image, true);
                $d = $this->uploader->image->getImageGeometry();
                $w = $d['width'];
                $h = $d['height'];
            }

            return response()->json(
                [
                'status' => 'success',
                'html' => '<img id="inlineImage" src="'.asset(config('html_template_curator.upload_directory_name').'/'.$image).'" data-filename="'.$filename.'" />'
                    .'<input type="hidden" id="_x1" value="" />'
                    .'<input type="hidden" id="_y1" value="" />'
                    .'<input type="hidden" id="_x2" value="" />'
                    .'<input type="hidden" id="_y2" value="" />',
                'image_width' => $w,
                'image_height' => $h,
                ]
            );
        } else {
            return response()->json(
                [
                'status' => 'error',
                'msg' => $validator->messages()->first('image'),
                ]
            );
        }
    }

    /**
     * Store an image to temp dir.
     *
     * @return Response
     */
     public function inline_crop(Request $request)
     {
         $data = $request->all();

         File::makeDirectory($this->uploadDirectory.'images/articles/inline_images/', 0755, true, true);

         $width = $data['x2'] - $data['x1'];
         $height = $data['y2'] - $data['y1'];

         $imageExtension = explode('.', $data['filename'])[1];
         if ($imageExtension === 'gif') {
            //  $img = File::make($this->uploadDirectory.'images/temp/'.$data['filename']);
             $image = new Imagick($this->uploadDirectory.'images/temp/'.$data['filename']);

             $image = $image->coalesceImages();

             foreach ($image as $frame) {
                 $frame->cropImage($width, $height, 0, 0);
                 $frame->thumbnailImage($width, $height);
                 $frame->setImagePage($width, $height, 0, 0);
             }

             $image = $image->deconstructImages();
             $image->writeImages($this->uploadDirectory.'images/articles/inline_images/'.$data['filename'], true);
         } else {
             $img = Image::make($this->uploadDirectory.'images/temp/'.$data['filename']);
             $img->crop((int) $width, (int) $height, (int) $data['x1'], (int) $data['y1']);

             if ($width > $data['width']) {
                 $img->resize($data['width'], $data['height']);
             }

             $img->save($this->uploadDirectory.'images/articles/inline_images/'.$data['filename']);
         }

         $data['image_title'] = array_get($data, 'image_caption', 'image').(array_get($data, 'author_caption', '') !== '' ? ' by '.$data['author_caption'] : '');
         $data['full_path'] = asset(config('html_template_curator.upload_directory_name').'/'.'images/articles/inline_images/'.$data['filename']);

         if ($request->has('mobileFilename')) {
             $imgMobile = Image::make($this->uploadDirectory.'images/temp/'.$data['mobileFilename']);
             $imgMobile->save($this->uploadDirectory.'images/articles/inline_images/'.$data['mobileFilename']);
             $data['mobile_path'] = asset(config('html_template_curator.upload_directory_name').'/'.'images/articles/inline_images/'.$data['mobileFilename']);
         } else {
             $data['mobile_path'] = '';
         }

         $imageHtml = view('html-template-curator::partials.inline_image', array('data' => $data))->render();

         return json_encode([
             'image' => $imageHtml,
         ]);
     }
}
