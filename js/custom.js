$('#navigation a').click(function () {
    $('#navigation').removeClass('collapse');
    $('#navigation').removeClass('in');
    $('#navigation').addClass('collapsing');
    $('#navigation').attr('aria-expanded', 'false');
    setTimeout(function () {
        $('#navigation').removeClass('collapsing');
        $('#navigation').addClass('collapse');
        $('#navigation').attr('aria-expanded', 'true');
    }, 300);
});