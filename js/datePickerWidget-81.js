var datePickerWidget;
datePickerWidget = {
    init: function(format) {

        var dateFormat = format || 'mm/dd/yyyy';

        $('[data-datepicker]').each(function () {
            var input = $(this);
            input.datepicker({
                format: dateFormat,
                todayBtn: 'linked',
                todayHighlight: true,
                autoclose: true
            });
        });
    }
};