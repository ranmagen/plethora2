$(function(){});
   $(document).on("pagecreate",function(event){ 
        $(window).on("orientationchange",function(){
            if(window.orientation == 0) //profile
            {
                $('body').prepend('<img id="rotate-img" src="images/rotate.png" class="centered" />');
            }
            else //landscape
            {
              $("#rotate-img").hide();
            }
        });                   
    });

