/***********************************************************/
/*                     Firebase Config                     */
/***********************************************************/
var config = {
    apiKey: "AIzaSyDpdQGnnJJUjjQoUsoNG3-bSYcPqmLVfWg",
    authDomain: "plethoradb-b25ff.firebaseapp.com",
    databaseURL: "https://plethoradb-b25ff.firebaseio.com",
    storageBucket: "plethoradb-b25ff.appspot.com",
    messagingSenderId: "942520102070"
};

/***********************************************************/
/*                      Global Params                      */
/***********************************************************/
 var shapes = [];
 var sentences = [];
 var cards;
 var gap = .5;
 var speed = 3;
 var closeTaskTray = false;

$(function () {
    var pause = "";
    var levelNum = GetLevelNum();
    var successCriterions;
    var canvas = document.querySelector('canvas');
    var ctx = canvas.getContext('2d');
    var checkSuccess = true;
    ctx.canvas.width = $("#sidebar").offset().left;
    ctx.canvas.height = window.innerHeight - $("#header").height();
    ctx.fillStyle = '#00031a';
    var limitShapes;
    var container = { x: 60, y: 10, width: ctx.canvas.width - 130, height: ctx.canvas.height - 60 };
    ctx.fillRect(container.x, container.y, container.width, container.height);
    firebase.initializeApp(config);


 /***********************************************************/
 /*                       Shape Class                       */
 /***********************************************************/
       var Shape = function (id, type, color, size, x, y, vx, vy) {
        this.id = id;
        this.type = type;
        this.color = color;
        this.r = GetSize(size, type).r;//radius for circle
        this.x = x;
        this.y = y;
        this.w = GetSize(size, type).w;
        this.h = GetSize(size, type).h;
        this.vx = vx;// 10 * Math.random();
        this.vy = vy;//10 * Math.random();
        this.hitWallFlag = false;
        this.hitShapeFlag = false;
    }

    Shape.prototype.Equal = function (shape) {
        if (this.type == shape.type)
            if (this.color == shape.color)
                return true;
        return false;
    }

    Shape.prototype.Created = function () {
        if (shapes.length < limitShapes)
        {
             shapes.push(this);
             $("#limit-shapes").text(shapes.length + " מתוך " +  limitShapes);
        }
    }

    Shape.prototype.Remove = function () {
        shapes = jQuery.grep(shapes, function (value) {
            return value != this;
        });
    }

    Shape.prototype.ChangeColor = function (newColor) {
        this.color = newColor;
    }

    var slotObj = function (slot) {
        this.type = slot.type;
        this.content = slot.content;
        this.content_h = slot.content_h;
        this.card;
    }

    var sentenceObj = function (sentence) {
        this.slots = InitSlots(sentence);
        this.completed = false;
    }

    function InitSentences(sentencesArray) {
        for (var i = 0; i < sentencesArray.length; i++) {
            sentences.push(new sentenceObj(sentencesArray[i]));
        }
    }

    function InitSlots(sentence) {
        var slots = [];
        for (var i = 0; i < sentence.length; i++) {
            var slot = new slotObj(sentence[i]);
            slots.push(slot);
        }
        return slots;
    }

    $(function () {
        LevelSetup();
    });

    function draw() {
            ctx.fillStyle = '#00031a';
            ctx.fillRect(container.x, container.y, container.width, container.height);
            CheckSuccess();
            CollisionStrategy(shapes);

            for (var i = 0; i < shapes.length; i++) {
                ctx.fillStyle = GetColor(shapes[i].color);
                ctx.beginPath();
                switch (shapes[i].type) {
                    case "circle":
                        {
                            ctx.arc(shapes[i].x, shapes[i].y, shapes[i].r, 0, 2 * Math.PI, false);
                            break;
                        }
                    case "square":
                        {                         
                            //ctx.rect(shapes[i].x, shapes[i].y, shapes[i].w, shapes[i].h);
                            var path = new Path2D();
                            ctx.moveTo(shapes[i].x - shapes[i].r, shapes[i].y + shapes[i].r);
                            ctx.lineTo(shapes[i].x + shapes[i].r, shapes[i].y + shapes[i].r);
                            ctx.lineTo(shapes[i].x + shapes[i].r, shapes[i].y - shapes[i].r);
                            ctx.lineTo(shapes[i].x - shapes[i].r, shapes[i].y - shapes[i].r);
                            ctx.closePath();
                            break;
                        }
                    case "triangle":
                        {
                            var path = new Path2D();
                            ctx.moveTo(shapes[i].x - 20, shapes[i].y + 20);
                            ctx.lineTo(shapes[i].x, shapes[i].y - 20);
                            ctx.lineTo(shapes[i].x + 20, shapes[i].y + 20);
                            ctx.closePath();
                            break;
                        }
                }
                ctx.fill();
                var hitWall = false;

                if ((shapes[i].x + shapes[i].vx + shapes[i].r > container.x + container.width) ||
                   (shapes[i].x - shapes[i].r + shapes[i].vx < container.x))          
                   {
                    shapes[i].vx = -shapes[i].vx;
                    hitWall = true;
                }
                if ((shapes[i].y + shapes[i].vy + shapes[i].r > container.y + container.height) ||
                  (shapes[i].y - shapes[i].r + shapes[i].vy < container.y)) 
                   {
                    shapes[i].vy = -shapes[i].vy;
                    hitWall = true;
                }
                if (hitWall == true) {
                    HitWallEvent(shapes[i]);
                }
                else {
                    //check if shape hits other shape
                    for (var j = 0; j < shapes.length; j++) {
                        if (i != j) {
                            if (shapes[i].hitShapeFlag == false && shapes[j].hitShapeFlag == false &&
                            shapes[i].hitWallFlag == false && shapes[j].hitWallFlag == false &&
                            hitWall == false) {
                                if (GetDistance(shapes[i].x, shapes[i].y, shapes[j].x, shapes[j].y) > shapes[i].r + shapes[j].r ) {
                                    continue;
                                }
                                else
                                {
                                    HitTwoShapes(shapes[i], shapes[j]);
                                }
                            }
                        }
                    }
                }
                shapes[i].x += shapes[i].vx;
                shapes[i].y += shapes[i].vy;
            }

        pause = requestAnimationFrame(draw);
    }

    let level = null;

    function LevelSetup() {
        $("#open-light").css({ fill: "#898989" });
        var dbRef = firebase.database().ref('levels');

        dbRef.once("value", function (data) {
        level = data.val()[levelNum];

        limitShapes = level.limitShapes == undefined ? 70 : level.limitShapes;
        $("#win_condition_text").text(level.task);

        //insert init-level shapes to shapes array
        // for (var i = 0; i < level.shapes.length ; i++) {
        //     var size = level.shapes[i].size == undefined ? "medium" : level.shapes[i].size;
        //     var cx = Math.floor((Math.random() * (container.width-10)),10);
	    //     var cy = Math.floor((Math.random() * (container.height-10)),10);
        //     shapes.push(new Shape(i, level.shapes[i].type, level.shapes[i].color, size, cx, cy, 3, 3));
        // }
        //  for (var i = 0; i < 10 ; i++) {
        //for (var i = 0; i < level.shapes.length ; i++) {
            for (i in level.shapes) {
                
            var size = level.shapes[i].size == undefined ? "medium" : level.shapes[i].size; 
            //var cx = Math.floor((Math.random() * (container.width-10)),10);
	        //var cy = Math.floor((Math.random() * (container.height-10)),10);
            //min_x: container.x + shape.r
            //max_x: container.width + container.x - shape.r
            //min_y: container.y + radius (30)
            //max_y: container.height- container.y (508)
         
            var radius = GetSize(size, level.shapes[i].type).r;  
            var cx = Math.floor(Math.random() * ((container.width  - radius  - radius)+1) + container.x + radius);
            var cy = Math.floor(Math.random() * ((container.height - container.y-container.y - radius)+1) + container.y + radius);
            shapes.push(new Shape(i, level.shapes[i].type, level.shapes[i].color, size, cx, cy, speed, speed));
        }

        $("#limit-shapes").text(shapes.length + " מתוך " +  limitShapes);

        //draw senteces
        InitSentences(level.sentences);
        DrawSentences();

        //draw cards
        cards = level.cards;
        DrawCards();

        //init success criteria object
        successCriterions = level.successCriterions;

        //start animation
        draw();
        setTimeout(showWinCondition, 1000);
        });
    }

    function AttentionSidebar()
    {
        setTimeout(function () {
            $("#open-light").css({ fill: "#898989" });
        }, 200);
        setTimeout(function () {
            $("#open-light").css({ fill: "#d93f07" });
        }, 400);
    }

    function HitTwoShapes(shape1, shape2) {
        for (var i = 0; i < sentences.length; i++) {
            var sentence = sentences[i];
            if (sentence.completed == true) {
                if (sentence.slots[2].content == "hit" && sentence.slots[3].type == "shape") {

                    var whenShape1 = GetSlotOrCard(sentence, 1).content;
                    var whenShape2 = GetSlotOrCard(sentence, 3).content;
                    if ((shape1.Equal(whenShape1) && shape2.Equal(whenShape2)) ||
                        (shape1.Equal(whenShape2) && shape2.Equal(whenShape1))) {
                        shape1.hitShapeFlag = true;
                        shape2.hitShapeFlag = true;
                        setTimeout(function () {
                            shape1.hitShapeFlag = false;
                            shape2.hitShapeFlag = false;
                        }, 500);
                        ExecuteAction(sentence, shape1);
                    }
                }
            }
        }
    }

    function HitWallEvent(shape) {
        if (shape.hitWallFlag == false) {
            //check if there is sentence with hit wall event
            for (var i = 0; i < sentences.length; i++) {
                var sentence = sentences[i];
                if (sentence.completed == true) {
                    var whenShape = GetSlotOrCard(sentence, 1).content;
                    if (shape.Equal(whenShape)) {
                        var whenMethod = GetSlotOrCard(sentence, 2);
                        var whenSecondShape = GetSlotOrCard(sentence, 3);
                        //if (sentence.slots[2].content == "hit" && sentence.slots[3].type == "wall") {
                        if (whenMethod.content == "hit" && whenSecondShape.type == "wall") {
                            ExecuteAction(sentence, shape);
                        }
                    }
                }
            }
        }
    }

    //shape param is the shape that hitted the wall/ other shape...
    function ExecuteAction(sentence, shape) {
        var whenShape = GetSlotOrCard(sentence, 1).content;
        var thenSlotNum = GetThenSlotNumber(sentence);
        var thenShape = GetSlotOrCard(sentence, thenSlotNum + 1);
        var actionMethod = GetSlotOrCard(sentence, thenSlotNum + 2);

        switch (actionMethod.content) {
            case "created":
                {                  
                    var size = thenShape.content.size == undefined ? "medium" : thenShape.content.size;                    
                    var newX = shape.x;// + 2*shape.r;
                    var newY = shape.y;// + 2*shape.r;
                 
                    if(shape.x <= container.x + shape.r) //left wall
                    {
                        newY = shape.y - shape.r - thenShape.r;
                    }
                    if(shape.x + shape.r >= container.width + container.x  + 5)
                    {
                        //alert("r");
                    }
                    // if(shape.x <= container.x + shape.r || shape.x >= container.width + container.x - shape.r)
                    // {
                    //     newX = shape.x;
                    //     newY = shape.y - shape.r - thenShape.r;
                    // }
                    // if(shape.y <= container.y + shape.r || shape.y >= container.height- container.y)
                    // {
                    //     newY = shape.y;
                    //     newX = shape.x + shape.r + thenShape.r;
                    // }
                    var radius = GetSize(size, thenShape.content.type).r;
                    //var cx = Math.floor(Math.random() * ((container.width  - radius  - radius)+1) + container.x + radius);
                    //var cy = Math.floor(Math.random() * ((container.height - container.y-container.y - radius)+1) + container.y + radius);




                    var newShape = new Shape(shapes.length, thenShape.content.type, thenShape.content.color, 
                                             size, newX, newY, speed, speed);

                    // var newShape = new Shape(shapes.length, thenShape.content.type, thenShape.content.color, 
                    //                          size, newX, newY, speed, speed);
                    newShape.hitWallFlag = true;

                    setTimeout(function () {
                         newShape.Created();
                    }, 200);
                   
                    
                    
                    
                    setTimeout(function () {
                        newShape.hitWallFlag = false;
                    }, 200);
                    break;
                }
            case "change_color":
                {
                    if (shape.Equal(whenShape)) {
                        var newColor = GetSlotOrCard(sentence, thenSlotNum + 3).content;
                        shape.ChangeColor(newColor);
                    }
                    break;
                }
        }
        setTimeout(function () {
            shape.hitWallFlag = false;
        }, 200);
    }

    function getRandom(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

    function GetSlotOrCard(sentence, slotNum)
    {
        if (sentence.slots[slotNum].content == "question") {
            var cardNum = sentence.slots[slotNum].card;
            return cards[cardNum];
        }
        else {
            return sentence.slots[slotNum];
        }
    }

    function GetThenSlotNumber(sentence) {
        var slotsCnt = sentence.slots.length - 1;
        for (var i = slotsCnt; i >= 0; i--) {
            if (sentence.slots[i].content == "then")
                return i;
        }
    }

    function GetColor(colorName) {
        switch (colorName) {
            case "color1":
                {
                    return "#51af87";
                }
            case "color2":
                {
                    return "#c2c2c2";
                }
            case "color3":
                {
                    return "#737373";
                }
            case "color4":
                {
                    return "#845478";
                    // return "#AA6666";
                }
            case "color5":
                {
                    return "#dd4400";
                }
            case "color6":
                {
                    return "#ffbb00";
                }
        }
    }


    function GetSize(size, type) {
        var w, h, r;
        if (size == undefined) {
                size = "medium";
        }
        switch (size) {
            case "medium":
                {
                    if(type == "square")
                    {
                                r = 20;
                                w = h = 40;
                        return { r: r, w: w, h: h };
                    }
                    else {// (type == "circle") {
                        w = h = r = 20;
                        return { r: r, w: w, h: h };
                    }
                
                }
        }

    }

    function GetDistance(x1, y1, x2, y2) {
        var diffX = x2 - x1;
        var diffY = y2 - y1;
        return Math.sqrt((diffX * diffX) + (diffY * diffY));
    }


    function CheckSuccess() {
        var isSuccess = true;
        for (var i = 0; i < successCriterions.length; i++) {
            isSuccess = isSuccess && CheckSuccessCriterion(successCriterions[i]);
        }
        if (isSuccess == true) {
            setTimeout(function () {
                if (checkSuccess == true) {
                    //clearInterval(blinkOpenSidebarLight);
                    checkSuccess = false;
                   // $("#move_to_next_lvl").show();
                   showLevelComplete();
                    cancelAnimationFrame(pause);
                    clearInterval(blinkOpenSidebarLight);
                }
            }, 1000);
        }
    }

    function CheckSuccessCriterion(successCriterion) {
        switch(successCriterion.method)
        {
            case "equal":
                {
                    var cnt = 0;
                    if (successCriterion.amount != undefined) {
                        for (var i = 0; i < shapes.length; i++) {
                            if (shapes[i].Equal(successCriterion.shape1)) {
                                cnt++;
                                if (cnt == successCriterion.amount) {
                                    for (var j = 0; j < sentences.length; j++) {
                                        sentences[j].completed = false;
                                    }
                                    return true;
                                }

                            }
                        }
                    }
                    break;
                }
            case "greater":
                {
                    break;
                }
            case "less":
                {
                    break;
                }
        }
    }

    // $("#move_to_next_lvl").click(function () {
    //     $("#move_to_next_lvl").hide();
    //     ClearLevel();
    //     levelNum++;
    //     shapes = [];
    //     LevelSetup();
    // });

    function ClearLevel() {
        $("#slots-container div").remove();
        $("#cards-container div").remove();
        ctx.fillStyle = 'grey';
        ctx.strokeStyle = 'grey';
        ctx.fillRect(container.x, container.y, container.width, container.height);
        sentences = [];
        shapes = [];
        checkSuccess = true;
        $("#task").text("");
        $("#level_name").text("");
        $("#open-light").css({ fill: "#898989" });
    }

    $("#open-btn").click(function () {
        if(closeTaskTray)
        {
                $('.right-sidebar-outer').toggleClass('show-from-right');
                if (IsSidebarOpen()) //open sidebar
                {
                    cancelAnimationFrame(pause);
                    clearInterval(blinkOpenSidebarLight);
                }
                else //close sidebar
                {
                if (checkSuccess == true)
                {
                    setTimeout(function () {
                    if(checkSuccess == true)
                        {
                            blinkOpenSidebarLight = setInterval(AttentionSidebar, 400);
                        }

                    }, 10000);

                }
                    setTimeout(function () {
                        pause = requestAnimationFrame(draw);
                    }, 500);

                }
        }
    });

    $("#reload-btn").click(function () {
        ClearLevel();
        shapes = [];
        LevelSetup();
    });

    function IsSidebarOpen() {
        return $("#sidebar").hasClass("show-from-right");
    }

    function GetLevelNum()
    {
        var levelNum = window.location.href.split('=')[1];
        return levelNum == undefined ? 0 : levelNum;
    }


    function showLevelComplete(){
        $("#move_to_next_lvl").delay(100).animate({
             top: '0px',
        }, 2000);
        $("#move_to_next_lvl_btn").delay(100).animate({
             top: '0px',
        }, 2000);
    }


    function showWinCondition(){
        $("#win_condition").delay(100).animate({
             top: '0px',
        }, 2000);
            $("#win_condition_btn").delay(100).animate({
             top: '0px',
        }, 2000);
    }


var blinkOpenSidebarLight;
var blinkCloseSidebarLight;

    $("#ok_win_btn").click(function(){
        closeTaskTray = true;
         $("#level_name").text(level.task);
           $("#win_condition").delay(100).animate({
             top: '-100%',
        }, 1000);
           setTimeout(function () {
               blinkOpenSidebarLight = setInterval(AttentionSidebar, 400);
            }, 1500);
    });

    //     $("#move_to_next_lvl_btn").click(function(){
    //     ClearLevel();
    //     levelNum++;
    //     shapes = [];
    //     LevelSetup();

    //        $("#move_to_next_lvl").delay(100).animate({
    //          top: '-100%',
    //     }, 1000);
    //        setTimeout(function () {
    //            blinkOpenSidebarLight = setInterval(AttentionSidebar, 400);
    //         }, 1500);
    // });

        $("#move_to_next_lvl_btn").click(function(){
            levelNum++;
                 window.location.href = "levels.html?level=" + levelNum;
    });

        $("#home-btn").click(function () {
        window.location.href = "levels.html?level=" + levelNum;
    });

});

