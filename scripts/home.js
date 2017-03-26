
$(function () {
    $("#play-div").click(function(){
        window.location.href = "levels.html?level=" + 0;
    });

    // $('#play-btn').on({
    //     'click': function(){
    //         alert("in");
    //         $('#play-btn').attr('src','images/play2.png');
    //     }
    // });
});


var myVar;

function loader() {
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


  document.body.requestFullscreen();
    // if(navigator.userAgent.match(/Android/i)){
    //     window.scrollTo(0,1);
    // }
}


function checkMobileOrientation()
{    
    if(window.innerHeight > window.innerWidth){
       hidePage();
    }
    else
    {
        myVar = setTimeout(showPage, 2000);
    }
}







