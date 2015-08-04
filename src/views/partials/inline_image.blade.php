@if(array_get($data, 'url') !== '')
	<a href="{{ $data['url'] }}"> {{HTML::image($data['full_path'], $data['image_title'], ['title' => $data['image_title']]) }}</a>
@else
	{{ HTML::image($data['full_path'], $data['image_title'], ['title' => $data['image_title']]) }}
@endif