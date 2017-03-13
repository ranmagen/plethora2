var drum = new Audio('sounds/drumloopunit.wav');
var hihat = new Audio('sounds/67209__akosombo__xbhhclo.wav');
var eventInterval;
var level = 1;

$(function () {
    $("#close-arrow").hide();
    $("#move_to_next_lvl").hide();
    $("#move_to_next_lvl").click(function () {
        $("#move_to_next_lvl").hide();
        ClearLevel();
        level++;
        clearInterval(eventInterval);
        correctCards = 0;
        shapesArray = [];
        SetUpLevel();
        $("#play-btn").removeClass("animate");
        $("#play-icon").addClass("play-icon").removeClass("pause-icon");
    });

    $('.foot').removeClass('slide-down');
    $('.foot').addClass('slide-up', 1000, '');

    $("#open-btn").click(function () {
        $('.right-sidebar-outer').toggleClass('show-from-right');
        if (IsSidebarOpen()) //if sidebar is open 
        {
            StopAllShapesAnimation();
            $("#play-btn").removeClass("animate");
            $("#play-icon").addClass("play-icon").removeClass("pause-icon");
            $("#open-arrow").hide();
            $("#close-arrow").show();
        }
        else
        {
            $("#open-arrow").show();
            $("#close-arrow").hide();
        }
    });

    $("#home-btn").click(function () {
        window.location.href = "instructions.html";
    });

    SetUpLevel();

    function IsSidebarOpen() {
        return $("#sidebar").hasClass("show-from-right");
    }

    $("#play-btn").click(function () {
        if (IsSidebarOpen()) //if sidebar is open- close it and start play
        {
            $('.right-sidebar-outer').toggleClass('show-from-right');
            setTimeout(function () {
                StartLevelAnimation();
            }, 1500);
            $("#open-arrow").show();
            $("#close-arrow").hide();
        }
        else {
            StartLevelAnimation();    
        }
    });

    $(".draggable").draggable();
});



