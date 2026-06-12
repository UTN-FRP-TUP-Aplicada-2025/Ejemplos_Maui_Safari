$(document).on('ready', function () {
    if ($('.sidemenu').length) {
        $('.sidemenu').sidenav();                 // sidenav relocaliza el nodo
        try { new PerfectScrollbar('.sidemenu', { suppressScrollX: true }); } catch (e) {}
    }
});
