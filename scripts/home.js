
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
       hidePage();
        //alert("Please use Landscape!");
    }
    else
    {
        myVar = setTimeout(showPage, 2000);
    }

    $(document).on("pagecreate",function(event){ 
        $(window).on("orientationchange",function(){
            if(window.orientation == 0)
            {
               hidePage();
            //alert("(if) Orientation changed to: " + event.orientation);
            }
            else
            {
                $("#rotate-img").hide();
                $("#loader").show();
                $("#big-logo-div").show();
                $("#play-div").show();
                myVar = setTimeout(showPage, 2000);
            //alert("(else) Orientation changed to: " + event.orientation);
            }
        });                   
    });
}





