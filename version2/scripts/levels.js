var config = {
    apiKey: "AIzaSyDpdQGnnJJUjjQoUsoNG3-bSYcPqmLVfWg",
    authDomain: "plethoradb-b25ff.firebaseapp.com",
    databaseURL: "https://plethoradb-b25ff.firebaseio.com",
    storageBucket: "plethoradb-b25ff.appspot.com",
    messagingSenderId: "942520102070"
};

$(function () {
    drawLevels();
    showLevels();
});

function drawLevels()
{
    firebase.initializeApp(config);
    var dbRef = firebase.database().ref('levels');
    dbRef.once("value", function (data) {

    var levelsCnt = data.numChildren();
    var row;
    var currentLevel = GetLevelNum();

    for (var i = 0; i < levelsCnt; i++) {
            var levelType;
            if (i % 4 == 0) {
              row = i;
             $('<div></div>').attr('id', 'row' + i).addClass('row').appendTo('#levels-container');
        }

        if(i < currentLevel)
        {
            levelType = 'done';
        }
        else if(i == currentLevel)
        {
            levelType = 'regular';
        }
        else if(i > currentLevel)
        {
            levelType = 'locked';
        }
            var lvl = i + 1;
            $('<div><img class="level-img" src="images/levels/'+ levelType +'/level' + lvl + '.png"/><p class="level-name '
             +'">' + data.child(i).val().name + '</p></div>').attr('id',
                'level_' + i).data('number', i).addClass('level').addClass(levelType).click(function () {
                  if(!$(this).hasClass('locked'))
                  {                     
                    window.location.href = "index.html?level=" + $(this).data('number');
                  }               
            }).appendTo('#row' + row);
        }
    });
}

    function GetLevelNum()
    {
        //TODO: take level from db
        var levelNum = window.location.href.split('=')[1];
        return levelNum == undefined ? 0 : levelNum;
    }


var myVar;

function showLevels()
{
    var bodyHeight = $('body').height();
    var footerOffsetTop = $('#levels-div').offset().top;
    var topToBottom = bodyHeight - footerOffsetTop;
    $('#levels-div').css({
        top: 'auto',
        bottom: topToBottom
    });
    $("#levels-div").delay(100).animate({
        top: '0px',
    }, 3000);
}





