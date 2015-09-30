<!-- Modal -->
<div class="modal fade" id="redactorDialog" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">Edit</h4>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary js-update-content">Save</button>
            </div>
        </div>
    </div>
</div>
<script>
    var templateEditorConfig = {
        baseUrl: '{{ Config::get("app.url") }}',
        csrfToken: '{{ csrf_token() }}'
    };
</script>
