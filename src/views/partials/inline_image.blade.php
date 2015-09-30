@if(array_get($data, 'url') !== '')
	<a href="{{ $data['url'] }}"> <img src="{{ $data['full_path'] }}" alt="{{ $data['image_title'] }}" title = "{{ $data['image_title'] }}" /></a>
@else
	<img src="{{ $data['full_path'] }}" alt="{{ $data['image_title'] }}" title = "{{ $data['image_title'] }}" />
@endif
