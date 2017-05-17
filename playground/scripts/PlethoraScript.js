
var eventInterval;


$(function () {
    $("#close-arrow").hide();
   // $("#move_to_next_lvl").hide();
    $('.foot').removeClass('slide-down');
    $('.foot').addClass('slide-up', 1000, '');




    //$("#play-btn").click(function () {
    //    if (IsSidebarOpen()) //if sidebar is open- close it and start play
    //    {
    //        $('.right-sidebar-outer').toggleClass('show-from-right');
    //        setTimeout(function () {
    //        }, 1500);
    //        $("#open-arrow").show();
    //        $("#close-arrow").hide();
    //    }
    //    else {
    //    }
    //});

    $(".draggable").draggable();
});



