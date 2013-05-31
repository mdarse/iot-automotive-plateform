var request;
// bind click on actions form buttons
$("form.actions button").on('click',function(event){

    // abort any pending request
    if (request) {
        request.abort();
    }

    var $button = $(this);

    // save button value
    var data = 'action=' + encodeURI($button.attr('value'));
    console.log(data);

    var request = $.ajax({
        url: "",
        type: "post",
        data: data,
        success: function(response, textStatus, xhr) {
            console.log('Success !');
        },
        error: function(xhr, type) {
            console.log('Error !');
        }
    });

    event.preventDefault();
});