$('#navigation a').click(function () {
    var h = window.innerWidth;
    console.log(h < 768);
    if (h < 768) {
        $('#navigation').removeClass('collapse');
        $('#navigation').removeClass('in');
        $('#navigation').addClass('collapsing');
        $('#navigation').attr('aria-expanded', 'false');
        setTimeout(function () {
            $('#navigation').removeClass('collapsing');
            $('#navigation').addClass('collapse');
            $('#navigation').attr('aria-expanded', 'true');
        }, 300);
    }
});