var config = {
    apiKey: "AIzaSyDpdQGnnJJUjjQoUsoNG3-bSYcPqmLVfWg",
    authDomain: "plethoradb-b25ff.firebaseapp.com",
    databaseURL: "https://plethoradb-b25ff.firebaseio.com",
    storageBucket: "plethoradb-b25ff.appspot.com",
    messagingSenderId: "942520102070"
};

$(function () {
    var pause = "";
    var levelNum = 5;
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
    var container = { x: 50, y: 50, width: ctx.canvas.width - 100, height: ctx.canvas.height - 100 };
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

    var slotObj = function (slot) {
        this.type = slot.type;
        this.content = slot.content;
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

    shapeObj.prototype.Equal = function (shape) {
        if (this.type == shape.type)
            if (this.color == shape.color)
                return true;
        return false;
    }

    shapeObj.prototype.Created = function()
    {
        //TEST
        //if (shapes.length < 20)
        shapes.push(this);
    }

    shapeObj.prototype.ChangeColor = function(newColor)
    {
        this.color = newColor;
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

            ctx.fillStyle = 'grey';
            ctx.strokeStyle = 'grey';
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
                                    ChangeDirection(shapes[i], shapes[j]);
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

    function LevelSetup() {
        var dbRef = firebase.database().ref('levels');

        dbRef.once("value", function (data) {
            var level = data.val()[levelNum];            
            //set task description
            $("#task").text(level.task);

            //insert init-level shapes to shapes array     
            for (var i = 0; i < level.shapes.length ; i++) {
                var s = new shapeObj(level.shapes[i], GetPosition(shapes[i]));
            }
            shapes.push(s);

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

            //requestAnimationFrame(draw);
        });
    }

    function DrawSentences() {
        var sentencesCnt = sentences.length;// - 1;
        // for (var i = sentencesCnt; i >= 0; i--) {
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
                if (slots[j].content == "question") {
                    $("#slot" + i + '_' + j).addClass("question");
                }
                else {
                    if (slots[j].type != "shape")
                        $("#slot" + i + '_' + j).addClass(slots[j].type).text(slots[j].content);
                    else {
                        $("<div class='" + slots[j].content.type + " " + slots[j].content.color + " centered'></div>").appendTo("#slot" + i + '_' + j);
                    }
                }
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
                //cursor: '-webkit-grab',
                revert: true
            });
            if (cards[i].type != "shape") {
                $("#card" + i).addClass(cards[i].type).text(cards[i].content);
            }
            else {
                $("<div class='" + cards[i].content.type + " " + cards[i].content.color + " centered'></div>").appendTo("#card" + i);
                if (cards[i].content.type == "triangle") {
                    var color = $("#card" + i + " > div").css("background-color");

                    $("#card" + i + " > div").css("background", "none").css("color", color);
                }
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
        return true;
    }

    //function HitTwoShapes_ORG(shape1, shape2)
    //{
    //    for (var i = 0; i < sentences.length; i++) {
    //        var sentence = sentences[i];
    //        if (sentence.completed == true) {
    //            if (sentence.slots[2].content == "hit" && sentence.slots[3].type == "shape") {
    //                var whenShape1 = GetSlotOrCard(sentence, 1).content;
    //                var whenShape2 = GetSlotOrCard(sentence, 3).content;
    //                if ((shape1.Equal(whenShape1) && shape2.Equal(whenShape2)) ||
    //                    (shape1.Equal(whenShape2) && shape2.Equal(whenShape1))) {
    //                    var thenSlotNum = GetThenSlotNumber(sentence);
    //                    var thenShape = GetSlotOrCard(sentence, thenSlotNum + 1);
    //                    var thenMethod = GetSlotOrCard(sentence, thenSlotNum + 2);
    //                    switch (thenMethod.content) {
    //                        case "created":
    //                            {
    //                                var hitPosition = { x: shape1.x, y: shape1.y };
    //                                var newShape = new shapeObj(thenShape.content, hitPosition);
    //                                newShape.Created();
    //                                newShape.hitShapeFlag = true;
    //                                shape1.hitShapeFlag = true;
    //                                shape2.hitShapeFlag = true;
    //                                //shapes.push(newShape);

    //                                setTimeout(function () {
    //                                    newShape.hitShapeFlag = false;
    //                                    shape1.hitShapeFlag = false;
    //                                    shape2.hitShapeFlag = false;
    //                                }, 300);

    //                                break;
    //                            }
                      
    //                    }
    //                }
    //            }
    //        }
    //    }
    //}

    function HitTwoShapes(shape1, shape2) {
        for (var i = 0; i < sentences.length; i++) {
            var sentence = sentences[i];
            if (sentence.completed == true) {
                if (sentence.slots[2].content == "hit" && sentence.slots[3].type == "shape") {
                    
                    var whenShape1 = GetSlotOrCard(sentence, 1).content;
                    var whenShape2 = GetSlotOrCard(sentence, 3).content;
                    if ((shape1.Equal(whenShape1) && shape2.Equal(whenShape2)) ||
                        (shape1.Equal(whenShape2) && shape2.Equal(whenShape1))) {          
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
                    if (sentence.slots[2].content == "hit" && sentence.slots[3].type == "wall") {                    
                        ExecuteAction(sentence, shape);                     
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
        var elasticity = 1;//.8;
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

      //  if ((shape1.x + shape1.vx + shape1.r > container.x + container.width) ||
      //      (shape1.x - shape1.r + shape1.vx < container.x)) {
      //      shape1.x = tmpx1;
      //      shape1.vx = 10 * Math.random();
      //  }
      //  if ((shape1.y + shape1.vy + shape1.r > container.y + container.height) ||
      //      (shape1.y - shape1.r + shape1.vy < container.y)) {
      //      shape1.y = tmpy1;
      //      shape1.vy = 10 * Math.random();
      //  }
      //  if ((shape2.x + shape2.vx + shape2.r > container.x + container.width) ||
      //(shape2.x - shape2.r + shape2.vx < container.x)) {
      //      shape2.x = tmpx2;
      //      shape2.vx = 10 * Math.random();
      //  }
      //  if ((shape2.y + shape2.vy + shape2.r > container.y + container.height) ||
      //      (shape2.y - shape2.r + shape2.vy < container.y)) {
      //      shape2.y = tmpy2;
      //      shape2.vy = 10 * Math.random();
      //  }
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
                    checkSuccess = false;
                    $("#move_to_next_lvl").show();
                    cancelAnimationFrame(pause);
                }
            }, 1500);
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

    $("#move_to_next_lvl").click(function () {
        $("#move_to_next_lvl").hide();
        ClearLevel();
        levelNum++;
        shapes = [];
        LevelSetup();
    });

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
    }

    $("#open-btn").click(function () {
        $('.right-sidebar-outer').toggleClass('show-from-right');
        if (IsSidebarOpen()) //open sidebar 
        {
            cancelAnimationFrame(pause);
            $("#open-arrow").hide();
            $("#close-arrow").show();
        }
        else //close sidebar
        {
            $("#open-arrow").show();
            $("#close-arrow").hide();
            setTimeout(function () {
                requestAnimationFrame(draw);
            }, 500);
        
        }
    });

    function IsSidebarOpen() {
        return $("#sidebar").hasClass("show-from-right");
    }

});