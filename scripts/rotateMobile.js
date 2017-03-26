$(function () {
    OrientationChange();
});

function OrientationChange()
{
    alert("OrientationChange");
       $(document).on("pagecreate",function(event){ 
        $(window).on("orientationchange",function(){
            if(window.orientation == 0) //profile
            {
                alert("profile");
                $("#overlay").show();
            }
            else //landscape
            {
                alert("landscape");
                $("#overlay").hide();
            }
        });                   
    });
}