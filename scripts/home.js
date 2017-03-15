
$(function () {

    $("#play-div").click(function(){
        window.location.href = "levels.html?level=" + 0;
    });
});


var myVar;

function loader() {
    myVar = setTimeout(showPage, 2000);
}

function showPage() {
    document.getElementById("loader").style.display = "none";
   // $("#loader").fadeOut( "slow" );
    $("#big-logo-div, #play-div").fadeIn( 1200 );
}





