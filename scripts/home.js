
$(function () {

    $("#play-div").click(function(){
        window.location.href = "levels.html?level=" + 0;
    });
});


var myVar;

function loader() {
   // hidePage();
//myVar = setTimeout(showPage, 2000);
checkMobileOrientation();
    
    
}

function hidePage()
{
     $("#loader").hide();
     $("#big-logo-div").hide();
     $("#play-div").hide();
     $('body').prepend('<img id="rotate-img" src="images/rotate.png" class="centered" />');
}

function showPage() {
    document.getElementById("loader").style.display = "none";
   // $("#loader").fadeOut( "slow" );
    $("#big-logo-div, #play-div").fadeIn( 1200 );
}


function checkMobileOrientation()
{    
    if(window.innerHeight > window.innerWidth){
       alert("profile - on load");
       hidePage();
        //alert("Please use Landscape!");
    }
    else
    {
        myVar = setTimeout(showPage, 2000);
    }


}







