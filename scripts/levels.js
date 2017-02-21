var config = {
    apiKey: "AIzaSyDpdQGnnJJUjjQoUsoNG3-bSYcPqmLVfWg",
    authDomain: "plethoradb-b25ff.firebaseapp.com",
    databaseURL: "https://plethoradb-b25ff.firebaseio.com",
    storageBucket: "plethoradb-b25ff.appspot.com",
    messagingSenderId: "942520102070"
};

$(function () {
    // var canvas = document.querySelector('canvas');
    // var ctx = canvas.getContext('2d');
    // ctx.canvas.width = window.innerWidth;
    // ctx.canvas.height = window.innerHeight - 60;
    // ctx.fillStyle = '#00031a';
    // //ctx.strokeStyle = '00031a';
    // var container = { x: 60, y: 0, width: ctx.canvas.width - 130, height: ctx.canvas.height - 60 };
    // ctx.fillStyle = '#00031a';
    // ctx.fillRect(container.x, container.y, container.width, container.height);

    firebase.initializeApp(config);
    var dbRef = firebase.database().ref('levels');
    dbRef.once("value", function (data) {

        var levelsCnt = data.numChildren();
        var row;

        for (var i = 0; i < levelsCnt; i++) {
           // var levelName = data.child(i).val().name;

            if (i % 4 == 0) {
                row = i;
                $('<div></div>').attr('id', 'row' + i).addClass('row').appendTo('#levels-container');
            }
            //  $('<div></div>').addClass('col-md-2').addClass('level').text(data.child(i).val().name).appendTo('#row' + row);
            var lvl = i + 1;
            //$('<img src="../images.levels/level"' + lvl + '.png />')
            //$('<div><img src="images/levels/level1.png"/></div>').attr('id', 'level_' + i).data('number', i).addClass('level').text(data.child(i).val().name).click(function () {
            //    window.location.href = "index.html?level=" + $(this).data('number');
            $('<div><img class="level-img" src="images/levels/level' + lvl + '.png"/><p class="level-name">' + data.child(i).val().name + '</p></div>').attr('id',
                'level_' + i).data('number', i).addClass('level').click(function () {
                window.location.href = "index.html?level=" + $(this).data('number');
            }).appendTo('#row' + row);
        }
    });

});

var myVar;

function loader() {
    myVar = setTimeout(showPage, 2000);
}

function showPage() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("logo-div").style.display = "none";
    //document.getElementById("levels-div").style.display = "block";
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