var config = {
    apiKey: "AIzaSyDpdQGnnJJUjjQoUsoNG3-bSYcPqmLVfWg",
    authDomain: "plethoradb-b25ff.firebaseapp.com",
    databaseURL: "https://plethoradb-b25ff.firebaseio.com",
    storageBucket: "plethoradb-b25ff.appspot.com",
    messagingSenderId: "942520102070"
};

$(function () {

    firebase.initializeApp(config);

    //var dbRef = firebase.database().ref('levels').child('0');
    var dbRef = firebase.database().ref('levels');
    dbRef.once("value", function (data) {

        var levelsCnt = data.numChildren();
        var row;

        for (var i = 0; i < levelsCnt; i++) {
           // var levelName = data.child(i).val().name;

            if (i % 5 == 0) {
                row = i;
                $('<div></div>').attr('id', 'row' + i).addClass('row').appendTo('#container');
            }
            //  $('<div></div>').addClass('col-md-2').addClass('level').text(data.child(i).val().name).appendTo('#row' + row);
            $('<div></div>').attr('id', 'level_' + i).data('number', i).addClass('level').text(data.child(i).val().name).click(function () {
                window.location.href = "index.html?level=" + $(this).data('number');
                //alert($(this).data('number'));
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
    document.getElementById("container").style.display = "block";
}