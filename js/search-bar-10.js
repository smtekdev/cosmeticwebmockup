$(function(){

    function encodeQueryData(data) {
        var ret = [];
        for (var d in data)
            ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
        return ret.join("&");
    }

    $('.search-bar-widget').each(function(){
        var elem = $(this);

        var inputText = elem.find('> input[type="text"]').keyup(function(event){
            if (event.which == 13) {
                searchBtn.trigger('click');
            }
        });


        var searchBtn = elem.find(".search-btn").unbind('click').click(function(event){

            var url = elem.attr('data-url').replace(/\s/g,'+');
            var variables = elem.attr('data-variables').replace(/\s/g, '').split(',');

            var data = {};
            $.each(variables,function(){
                var varName = String(this);
                data[varName] = inputText.val();
            });

            var postUrl = url + '?' + encodeQueryData(data);
            document.location = postUrl;

        });



    });
});