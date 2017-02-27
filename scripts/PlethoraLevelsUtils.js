var config = {
    apiKey: "AIzaSyDpdQGnnJJUjjQoUsoNG3-bSYcPqmLVfWg",
    authDomain: "plethoradb-b25ff.firebaseapp.com",
    databaseURL: "https://plethoradb-b25ff.firebaseio.com",
    storageBucket: "plethoradb-b25ff.appspot.com",
    messagingSenderId: "942520102070"
};

$(function () {
    var pause = "";
    var levelNum = GetLevelNum();
    var shapes = [];
    var cards;
    var successCriterions;
    var canvas = document.querySelector('canvas');
    var ctx = canvas.getContext('2d');
    var checkSuccess = true;
    ctx.canvas.width = $("#sidebar").offset().left;
    ctx.canvas.height = window.innerHeight - $("#header").height();
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'black';
    var limitShapes;
    //var container = { x: 50, y: 20, width: ctx.canvas.width - 100, height: ctx.canvas.height - 80 };
    var container = { x: 60, y: 10, width: ctx.canvas.width - 130, height: ctx.canvas.height - 60 };
    ctx.fillRect(container.x, container.y, container.width, container.height);
    firebase.initializeApp(config);
    var sentences = [];
    var fps, fpsInterval, startTime, now, then, elapsed;

    var shapeObj = function (shape, position) {
        this.type = shape.type;
        this.color = shape.color;
        this.r = GetSize(shape).r;//radius for circle
        this.x = position.x;
        this.y = position.y;
        this.w = GetSize(shape).w;
        this.h = GetSize(shape).h;
        this.vx = 10 * Math.random();
        this.vy = 10 * Math.random();
        this.hitWallFlag = false;
        this.hitShapeFlag = false;
    }

    shapeObj.prototype.Equal = function (shape) {
        if (this.type == shape.type)
            if (this.color == shape.color)
                return true;
        return false;
    }

    shapeObj.prototype.Created = function () {        
        if (shapes.length < limitShapes)
        {
             shapes.push(this);
            //$("#limit-shapes").text(shapes.length + " out of " + limitShapes);
             $("#limit-shapes").text(shapes.length + " מתוך " +  limitShapes);
        }    
    }

    shapeObj.prototype.Remove = function () {
        shapes = jQuery.grep(shapes, function (value) {
            return value != this;
        });
    }

    shapeObj.prototype.ChangeColor = function (newColor) {
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

    function startAnimating(fps) {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;  
        draw();
    }

    function draw() {
        now = Date.now();
        elapsed = now - then;
        if (elapsed > fpsInterval) {

            // Get ready for next frame by setting then=now, but...
            // Also, adjust for fpsInterval not being multiple of 16.67
            then = now - (elapsed % fpsInterval);

            ctx.fillStyle = '#00031a';//'grey';
            //  ctx.strokeStyle = 'grey';
            ctx.fillRect(container.x, container.y, container.width, container.height);
            CheckSuccess();
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
                            ctx.rect(shapes[i].x, shapes[i].y, shapes[i].w, shapes[i].h);
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
                if ((shapes[i].x + shapes[i].vx + shapes[i].r > container.x + container.width) || (shapes[i].x - shapes[i].r + shapes[i].vx < container.x)) {
                    shapes[i].vx = -shapes[i].vx;
                    hitWall = true;
                }
                if ((shapes[i].y + shapes[i].vy + shapes[i].r > container.y + container.height) || (shapes[i].y - shapes[i].r + shapes[i].vy < container.y)) {
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
                                   //ChangeDirection(shapes[i], shapes[j]);
                                    HitTwoShapes(shapes[i], shapes[j]);
                                }
                            }
                        }
                    }
                }
                shapes[i].x += shapes[i].vx;
                shapes[i].y += shapes[i].vy;
            }
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

        //set task description and level name       
        //$("#task").text(level.task);
        //$("#level_name").text(level.name);
           
            $("#win_condition_text").text(level.task);

            //insert init-level shapes to shapes array     
            for (var i = 0; i < level.shapes.length ; i++) {
                var s = new shapeObj(level.shapes[i], GetPosition(shapes[i]));
            }

            shapes.push(s);
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
            startAnimating(25);
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

    function BlinkCloseLightColor()
    {
         $("#open-light").css({ fill: "#7799bb" });
        //  setTimeout(function () {
        //     $("#open-light").css({ fill: "#898989" });
        // }, 200);
        // setTimeout(function () {
        //     $("#open-light").css({ fill: "#7799bb" });
        // }, 400);
    }

    // function DrawSentences_ORG() {
    //     var sentencesCnt = sentences.length;

    //     for (var i = 0; i < sentences.length; i++) {
    //         var slots = sentences[i].slots;
    //         var slotsCnt = slots.length - 1;

    //         $('<div></div>').attr('id', 'sentence' + i).addClass('sentence').appendTo('#slots-container');

    //         for (var j = slotsCnt; j >= 0; j--) {            
    //             $('<div></div>').data('number', i + "_" + j).attr('id', 'slot' + i + '_' + j).addClass("slot").appendTo('#sentence' + i).droppable({
    //                 accept: '#cards-container div',
    //                 hoverClass: 'hovered',
    //                 drop: HandleCardDrop
    //             });
    //             if (slots[j].content == "question") {
    //                 $("<img src='images/rules/question.png'></img>").appendTo("#slot" + i + '_' + j);
    //                 $("#slot" + i + '_' + j).addClass("question").addClass(slots[j].type);
    //             }
    //             else {
    //                if(slots[j].type == "conjunction")
    //                 {
    //                     $("<p>"+slots[j].content_h+"</p>").appendTo("#slot" + i + '_' + j);
    //                     $("#slot" + i + '_' + j).addClass(slots[j].type);
    //                 }
    //                 else if (slots[j].type == "shape"){
    //                     $("#slot" + i + '_' + j).addClass(slots[j].type);
    //                     $("<div class='" + slots[j].content.type + " " + slots[j].content.color + " centered'></div>").appendTo("#slot" + i + '_' + j);
    //                 }
    //                 else //icon for method or param
    //                 {
    //                     $("<img src='images/rules/" + slots[j].content + ".png'></img>").appendTo("#slot" + i + '_' + j);
    //                     $("#slot" + i + '_' + j).addClass(slots[j].type);
    //                 }                                          
    //             }
    //         }
    //         $('<div></div>').addClass('sentence-margin').insertAfter('#sentence' + i);
    //     }
    // }


     function DrawSentences() {
        var sentencesCnt = sentences.length;

        for (var i = 0; i < sentences.length; i++) {
            var slots = sentences[i].slots;
            var slotsCnt = slots.length - 1;

            $('<div></div>').attr('id', 'sentence' + i).addClass('sentence').appendTo('#slots-container');

            for (var j = slotsCnt; j >= 0; j--) {            
                $('<div></div>').data('number', i + "_" + j).attr('id', 'slot' + i + '_' + j).addClass("slot").appendTo('#sentence' + i).droppable({
                    accept: '#cards-container div',
                    hoverClass: 'hovered',
                    drop: HandleCardDrop
                });

                var slotId = "#slot" + i + '_' + j;              
                drowCardContent(slots[j], slotId);
            }
            $('<div></div>').addClass('sentence-margin').insertAfter('#sentence' + i);
        }
    }

    function DrawCards() {
        var cardsCnt = cards.length - 1;
        for (var i = cardsCnt; i >= 0; i--) {
            $('<div></div>').data('number', i).attr('id', 'card' + i).appendTo('#cards-container').addClass("card").draggable({
                containment: '#sidebar',
                stack: '#slots-container div',
                cursor: 'move',
                revert: true
            });

                var cardId = "#card" + i;              
                drowCardContent(cards[i], cardId);
            // if (cards[i].type != "shape") {
            //     $("#card" + i).addClass(cards[i].type).text(cards[i].content_h);
            // }
            // else {
            //      $("#card" + i).addClass(cards[i].type);
            //     $("<div class='" + cards[i].content.type + " " + cards[i].content.color + " centered'></div>").appendTo("#card" + i);
            //     if (cards[i].content.type == "triangle") {
            //         var color = $("#card" + i + " > div").css("background-color");
            //         $("#card" + i + " > div").css("background", "none").css("color", color);
            //     }
            // }
        }
    }

    function drowCardContent(card, appentTo)
    {        
       if (card.content == "question") {
                    $("<img src='images/rules/question.png'></img>").appendTo(appentTo);
                    $(appentTo).addClass("question").addClass(card.type);
                }
                else {
                        if(card.type == "conjunction")
                        {
                            $("<p>" + card.content_h + "</p>").appendTo(appentTo);
                            $(appentTo).addClass(card.type);
                        }
                        else if (card.type == "shape"){
                            $(appentTo).addClass(card.type);
                            $("<div class='" + card.content.type + " " + card.content.color + " centered'></div>").appendTo(appentTo);
                            if (card.content.type == "triangle") {
                                var color = $(appentTo + " > div").css("background-color");
                                $(appentTo + " > div").css("background", "none").css("color", color);
                            }
                        }
                        else //icon for method or param
                        {
                            $("<img src='images/rules/" + card.content + ".png'></img>").appendTo(appentTo);
                            $(appentTo).addClass(card.type);
                        }                                          
                }
    }

    function HandleCardDrop(event, ui) {
        var slotData = $(this).data('number');
        var cardNum = ui.draggable.data('number');
        var sentenceNum = slotData.split("_")[0];
        var sentence = sentences[sentenceNum];
        var slotNum = slotData.split("_")[1];
        //if (sentence.slots[slotNum].question == true) {
        if (sentence.slots[slotNum].content == "question") {
            ui.draggable.position({ of: $(this), my: 'left top', at: 'left top' });
            ui.draggable.draggable('option', 'revert', false);
        }

        sentence.slots[slotNum].card = cardNum;
        CheckIfSentenceCompleted(sentence);
    }

    function CheckIfSentenceCompleted(sentence) {
        var slots = sentence.slots;
        for (var i = 0; i < slots.length; i++) {

            if (slots[i].content == "question" && (slots[i].card == undefined || slots[i].card < 0)) {
                return false;
            }
        }
        sentence.completed = true;

        BlinkCloseLightColor();

        return true;
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
                        if (sentence.slots[2].content == "hit" && sentence.slots[3].type == "wall") {
                            ExecuteAction(sentence, shape);
                        }
                    }
                }
            }
        }
    }

    //function HitWallEvent_ORG(shape) {
    //    if (shape.hitWallFlag == false) {            
    //        //check if there is sentence with hit wall event
    //        for (var i = 0; i < sentences.length; i++) {
    //            var sentence = sentences[i];          
    //            if (sentence.completed == true) {
    //                if (sentence.slots[2].content == "hit" && sentence.slots[3].type == "wall")
    //                {
    //                    var whenShape = GetSlotOrCard(sentence, 1).content;
    //                    if (shape.Equal(whenShape)) {
    //                       // var slots = sentence.slots;
    //                        var thenSlotNum = GetThenSlotNumber(sentence);                            
    //                        var thenShape = GetSlotOrCard(sentence, thenSlotNum + 1);
    //                        var thenMethod = GetSlotOrCard(sentence, thenSlotNum + 2);
    //                        if (thenShape.type == "shape") {
    //                            switch (thenMethod.content) {
    //                                case "created":
    //                                    {
    //                                        var hitPosition = { x: shape.x, y: shape.y };
    //                                        var newShape = new shapeObj(thenShape.content, hitPosition);
    //                                        newShape.hitWallFlag = true;
    //                                        shape.hitWallFlag = true;                                           
    //                                        newShape.Created();
    //                                        break;
    //                                    }
    //                                case "change_color":
    //                                    {
    //                                        var newColor = GetSlotOrCard(sentence, thenSlotNum + 3).content;
    //                                        shape.ChangeColor(newColor);
    //                                        break;
    //                                    }
    //                            }
    //                        }
    //                    }

    //                    setTimeout(function () {
    //                        newShape.hitWallFlag = false;
    //                        shape.hitWallFlag = false;
    //                    }, 200);
    //                }                 
    //            }
    //        }
    //    }
    //}

    //shape param is the shape that hitted the wall/ other shape...
    function ExecuteAction(sentence, shape) {
        var whenShape = GetSlotOrCard(sentence, 1).content;
        var thenSlotNum = GetThenSlotNumber(sentence);
        var thenShape = GetSlotOrCard(sentence, thenSlotNum + 1);
        var actionMethod = GetSlotOrCard(sentence, thenSlotNum + 2);

        switch (actionMethod.content) {
            case "created":
                {                    
                    var hitPosition = { x: shape.x, y: shape.y };
                    var newShape = new shapeObj(thenShape.content, hitPosition);
                    newShape.hitWallFlag = true;
                    newShape.Created();

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

    function ChangeDirection(shape1, shape2) {
       var tmpx1 = shape1.x;
       var tmpy1 = shape1.y;
       var tmpx2 = shape2.x;
       var tmpy2 = shape2.y;

       var Del = shape2.r + shape1.r;
       var dX = shape2.x - shape1.x;
       var dY = shape2.y - shape1.y;
       var dVX = shape2.vx - shape1.vx;
       var dVY = shape2.vy - shape1.vy;
       var dSq = dX * dX + dY * dY;
       var elasticity = .8;//1;
       var alpha = (1 + elasticity) / 2 * (dX * dVX + dY * dVY) / dSq;

       shape1.vx += dX * alpha;
       shape1.vy += dY * alpha;
       shape2.vx -= dX * alpha;
       shape2.vy -= dY * alpha;

       var DDist = ((Del + 1) / Math.sqrt(dSq) - 1) / 2;
       shape1.x -= dX * DDist;
       shape1.y -= dY * DDist;
       shape2.x += dX * DDist;
       shape2.y += dY * DDist;
    }

    // function ChangeDirection_TEST(shape1, shape2) {
    //     var Del = shape2.r + shape1.r;
    //     var dX = shape2.x - shape1.x;
    //     var dY = shape2.y - shape1.y;
    //     var dVX = shape2.vx - shape1.vx;
    //     var dVY = shape2.vy - shape1.vy;
    //     var dSq = dX * dX + dY * dY;
    //     var elasticity = .8;//1;
    //     var alpha = (1 + elasticity) / 2 * (dX * dVX + dY * dVY) / dSq;

    //     shape1.vx += dX * alpha;
    //     shape1.vy += dY * alpha;
    //     shape2.vx -= dX * alpha;
    //     shape2.vy -= dY * alpha;

    //     var DDist = ((Del + 1) / Math.sqrt(dSq) - 1) / 2;
    //     shape1.x -= dX * DDist;
    //     shape1.y -= dY * DDist;
    //     shape2.x += dX * DDist;
    //     shape2.y += dY * DDist;
    // }

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
                    return "#AA6666";
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

    function GetPosition(shape) {
        var x, y;
        //var shapeSize = GetSize(shape);
        //switch(shape.position)
        //{
        //    case "pos83":
        //        {
        //            x = container.width;              
        //            y = ctx.canvas.height * 0.5;
        //        }
        //}
        x = container.width * 0.5;
        y = ctx.canvas.height * 0.5;
        return { x: x, y: y };
    }

    function GetSize(shape) {
        var w, h, r;
        if (shape.size == undefined) {
            shape.size = "medium";
        }
        switch (shape.size) {
            case "medium":
                {
                   // if (shape.type == "circle") {
                        w = h = r = 20;
                        return { r: r, w: w, h: h };
                   // }
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
        $('.right-sidebar-outer').toggleClass('show-from-right');
        if (IsSidebarOpen()) //open sidebar 
        {
            cancelAnimationFrame(pause);
            clearInterval(blinkOpenSidebarLight);
            // $("#open-arrow").hide();
            // $("#close-arrow").show();
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

            
            // $("#open-arrow").show();
            // $("#close-arrow").hide();
            setTimeout(function () {
                requestAnimationFrame(draw);
            }, 500);
        
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

    $("#win_condition_btn").click(function(){
         $("#level_name").text(level.task);
           $("#win_condition").delay(100).animate({
             top: '-100%',    
        }, 1000);
           setTimeout(function () {
               blinkOpenSidebarLight = setInterval(AttentionSidebar, 400);
            }, 1500);
    });

        $("#move_to_next_lvl_btn").click(function(){     
        ClearLevel();
        levelNum++;
        shapes = [];
        LevelSetup();          

           $("#move_to_next_lvl").delay(100).animate({
             top: '-100%',    
        }, 1000);
           setTimeout(function () {
               blinkOpenSidebarLight = setInterval(AttentionSidebar, 400);
            }, 1500);
    });

        $("#home-btn").click(function () {
        window.location.href = "levels.html?level=" + levelNum;
    });

});

