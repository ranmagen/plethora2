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
 var checkSuccessFlag = false;

$(function () {
    var pause = "";
    var levelNum = GetLevelNum();
    var successCriterions;
    var canvas = document.querySelector('canvas');
    var ctx = canvas.getContext('2d');
    var checkSuccess = true;
    ctx.canvas.width = $("#sidebar").offset().left;
    var winHight = window.innerHeight == 950 ? 850 : window.innerHeight;
    ctx.canvas.height = winHight - $("#header").height();
    ctx.fillStyle = '#00031a';
    var limitShapes;
    var container = { x: 60, y: 10, width: ctx.canvas.width - 130, height: ctx.canvas.height - 60 };
    ctx.fillRect(container.x, container.y, container.width, container.height);


 /***********************************************************/
 /*                       Create Border                     */
 /***********************************************************/
var borderColorsTop = ['color9', 'color8', 'color7', 'color6', 'color5', 'color4', 'color11', 'color10', 'color9','color8', 'color7', 'color6', 'color5', 'color4'];
var borderLengthTop = [0.11, 0.06, 0.03, 0.11, 0.06, 0.06, 0.11, 0.03,  0.11, 0.06, 0.03, 0.11, 0.06, 0.06 ];

var borderColorsRight = ['color4', 'color5', 'color6', 'color7', 'color8', 'color9', 'color10'];
var borderLengthRight = [0.2, 0.1, 0.06, 0.22, 0.1, 0.12, 0.2];

var borderColorsBottom = ['color9', 'color8', 'color7', 'color6', 'color5', 'color4', 'color11', 'color10', 'color9', 'color8', 'color7', 'color6', 'color5', 'color4'];
var borderLengthBottom = [0.06, 0.06, 0.11, 0.03, 0.06, 0.11, 0.03, 0.11, 0.06, 0.06, 0.11, 0.03, 0.06, 0.11 ];

var borderColorsLeft = ['color4', 'color5', 'color6', 'color7', 'color8', 'color9', 'color10'];
var borderLengthLeft = [0.2, 0.1, 0.1, 0.22, 0.06, 0.12, 0.2];

var xpos = container.x;
//Top Border
for(b in borderColorsTop)
{
    bLength = container.width * borderLengthTop[b];
    ctx.beginPath();
    ctx.moveTo(xpos, container.y);
    if(b == borderColorsTop.length-2)
    {
        bLength += 10;
    }
    ctx.lineTo(xpos + bLength, container.y);
    ctx.lineWidth = 20;
    ctx.strokeStyle = GetColor(borderColorsTop[b]);
    ctx.stroke();
    xpos = xpos + bLength;
}
xpos -= 10;
var ypos = container.y;

//Right Border
for(b in borderColorsRight)
{
    bLength = container.height * borderLengthRight[b];
    ctx.beginPath();
    ctx.moveTo(xpos, ypos);
    if(b == borderColorsRight.length-2)
    {
        bLength += 10;
    }
    ctx.lineTo(xpos, ypos + bLength);
    ctx.lineWidth = 20;
    ctx.strokeStyle = GetColor(borderColorsRight[b]);
    ctx.stroke();
    ypos = ypos + bLength;
}
ypos -= 10;

//Bottom Border
for(b in borderColorsBottom)
{
    bLength = container.width * borderLengthBottom[b];
    ctx.beginPath();
    ctx.moveTo(xpos, ypos);
    if(b == borderColorsBottom.length-2)
    {
        bLength += 10;
    }
    ctx.lineTo(xpos - bLength, ypos);
    ctx.lineWidth = 20;
    ctx.strokeStyle = GetColor(borderColorsBottom[b]);
    ctx.stroke();
    xpos = xpos - bLength;
}
xpos += 10;

//Left Border
for(b in borderColorsLeft)
{
    bLength = container.height * borderLengthLeft[b];
    ctx.beginPath();
    ctx.moveTo(xpos, ypos);
    if(b == borderColorsLeft.length-2)
    {
        bLength += 10;
    }
    ctx.lineTo(xpos, ypos - bLength);
    ctx.lineWidth = 20;
    ctx.strokeStyle = GetColor(borderColorsLeft[b]);
    ctx.stroke();
    ypos = ypos - bLength;
}

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
        // this.vx = vx;// 10 * Math.random();
        // this.vy = vy;//10 * Math.random();
        this.vx = getRandom(vx-1, vx+1);
        this.vy = getRandom(vy-1, vy+1);
        this.hitWallFlag = false;
        this.hitShapeFlag = false;
        this.delete = false;
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
            SetShapesCurrentState();
        }
    }

    Shape.prototype.Deleted = function () {  
        this.delete = true;
    }

    Shape.prototype.ChangeColor = function (newColor) {
        this.color = newColor;
    }

    function SetShapesCurrentState()
    {
        var circle = {type:"circle", color:"color4"};
        var triangle = {type:"triangle", color:"color6"};
        var square = {type:"square", color:"color5"};
        var circleCnt = CountShapes(circle);
        var triangleCnt = CountShapes(triangle);
        var squareCnt = CountShapes(square);
        var shapesCntString = "עיגולים: " + circleCnt + " | משולשים: " + triangleCnt + " | ריבועים: " + squareCnt;
        $("#limit-shapes").text(shapesCntString);
    }

    var slotObj = function (slot) {
        this.type = slot.type;
        this.content = slot.content;
        this.content_h = slot.content_h;
        this.tooltip = slot.tooltip;
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
            if(checkSuccessFlag)
            {              
                CheckSuccess();
            }
            
            CollisionStrategy(shapes);

            for (var i = 0; i < shapes.length; i++) {
                if(shapes[i].delete)
                {
                     for(var j in shapes)
                    {
                        if(shapes[j].id == shapes[i].id)
                        {
                            shapes.splice(i,1);
                        }
                    }   
                    SetShapesCurrentState();
                    continue;
                }

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
                if (hitWall == true && shapes[i].hitWallFlag == false) {
                    HitWallEvent(shapes[i]);
                }
                else {
                    //check if shape hits other shape
                    for (var j = 0; j < shapes.length; j++) {
                        if (i != j) {
                            if (shapes[i].hitShapeFlag == false && shapes[j].hitShapeFlag == false
                             &&
                             //   shapes[i].hitWallFlag == false && shapes[j].hitWallFlag == false &&
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
                if(shapes.length > 0)
                {
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
           $("#level_num").text(level.name);
        limitShapes = level.limitShapes == undefined ? 70 : level.limitShapes;        
        $("#win_condition_text").text(level.task);
        
        for (i in level.shapes) {                
            var size = level.shapes[i].size == undefined ? "medium" : level.shapes[i].size;         
            var radius = GetSize(size, level.shapes[i].type).r;  
            var cx = Math.floor(Math.random() * ((container.width  - radius  - radius)+1) + container.x + radius);
            var cy = Math.floor(Math.random() * ((container.height - container.y-container.y - radius)+1) + container.y + radius);
            shapes.push(new Shape(i, level.shapes[i].type, level.shapes[i].color, size, cx, cy, speed, speed));
        }

        SetShapesCurrentState();

        if(levelNum == 0)
        {
            $("#itroduction").show();
            //itroduction
                $("#itroduction").click(function(){
                    $( "#dialog" ).dialog( "close" );
                });

                $( "#dialog" ).dialog({
                    modal: true,
                        open: function() {
                        $('.ui-widget-overlay').addClass('custom-overlay');
                    }
                });            
        }
        else
        {
            //$("#itroduction").hide();
        }
  
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
    
        //if (shape.hitWallFlag == false) {
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
                            shape.hitWallFlag = true;
                            setTimeout(function () {
                                shape.hitWallFlag = false;
                            }, 200);
                            ExecuteAction(sentence, shape);
                        }
                    }
                }
            }
        //}
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
                    var radius = GetSize(size, thenShape.content.type).r;
                    var newShape = new Shape(shapes.length, thenShape.content.type, thenShape.content.color, 
                                             size, shape.x, shape.y, speed, speed);

                    newShape.hitWallFlag = true;

                    setTimeout(function () {
                         newShape.Created();
                    }, 200);
                                                                               
                    setTimeout(function () {
                        newShape.hitWallFlag = false;
                    }, 250);
                    break;
                }
                case "deleted":
                {  
                    if (shape.Equal(thenShape.content)) {  
                        shape.Deleted();
                    }
                    break;
                }
            case "change_color":
                {
                    if (shape.Equal(whenShape.content)) {
                        var newColor = GetSlotOrCard(sentence, thenSlotNum + 3).content;
                        shape.ChangeColor(newColor);
                    }
                    break;
                }
        }
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
                }
            case "color5":
                {
                    return "#dd4400";
                }
            case "color6":
                {
                    return "#ffbb00";
                }
            case "color7":
                {
                    return "#ccbb33";
                }
            case "color8":
                {
                    return "#bbbb99";
                }
            case "color9":
                {
                    return "#77ccaa";
                }
             case "color10":
                {
                    return "#bbccdd";
                }
              case "color11":
                {
                    return "#7799bb";
                }
             case "color12":
                {
                    return "#845478";
                }
            case "color13":
                {
                    return "#f1a2b9";
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
            checkSuccessFlag = false;

        for (s in sentences) {
            sentences[s].completed = false;
        }

            setTimeout(function () {
                if (checkSuccess == true) {                   
                    checkSuccess = false;

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
                        if(CountShapes(successCriterion.shape1) == successCriterion.amount)
                        {        
                            return true;
                        }
                    }
                    break;
                }
                case "greater-equal":
                {
                       if(CountShapes(successCriterion.shape1) >= successCriterion.amount)
                        {        
                            return true;
                        }
                    break;
                }
            case "greater":
                {
                       if(CountShapes(successCriterion.shape1) > successCriterion.amount)
                        {        
                            return true;
                        }
                    break;
                }
            case "less":
                {
                       if(CountShapes(successCriterion.shape1) < successCriterion.amount)
                        {        
                            return true;
                        }
                    break;
                }
        }
        return false;
    }

    function CountShapes(shape)
    {     
        cnt = 0;
        for(s in shapes)
        {             
           if(shapes[s].Equal(shape))
           {
               cnt++;
           }
        }        
        return cnt;
    }

    function ClearLevel() {
        $("#slots-container div").remove();
        $("#cards-container div").remove();
        ctx.fillStyle = '#00031a';
        ctx.fillRect(container.x, container.y, container.width, container.height);
        sentences = [];
        shapes = [];
        checkSuccess = true;
        $("#task").text("");
        $("#level_name").text("");
        $("#level_num").text("");
        $("#open-light").css({ fill: "#898989" });
    }

    $("#open-btn").click(function () {
        var ding = new Audio('sounds/open-drawer.mp3');
        ding.play(); 

        if(levelNum == 0) //remove cursor image
        {
            clearInterval(clickOpenSidebarInstruction);
            $(".click-cursor-img").hide();
            $(".pointer-cursor-img").hide();
        }

        if(closeTaskTray)
        {
                $('.right-sidebar-outer').toggleClass('show-from-right');
                if (IsSidebarOpen()) //open sidebar
                {
                    cancelAnimationFrame(pause);
                    clearInterval(blinkOpenSidebarLight);
                    blurPage();

                    setTimeout(function() {
                        $(".card").effect( "shake", {times: 1}, 200 );
                    }, 300);

                    if(levelNum == 0 )
                    {
                        showTooltiopInterval = setInterval(showTooltip, 1000);
                    }                                   
                }
                else //close sidebar
                {
                    unBlurPage();
                    checkSuccessFlag = true;
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
         location.reload();
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

                       var ding = new Audio('sounds/tada.wav');
        ding.play();

setTimeout(function() {
        $("#move_to_next_lvl").delay(100).animate({
             top: '0px',
        }, 2000);
        $("#move_to_next_lvl_btn").delay(100).animate({
             top: '0px',
        }, 2000);
        blurPage();
}, 1000);

    
    }

    function showWinCondition(){
        $("#win_condition").delay(100).animate({
             top: '0px',
        }, 750);
            $("#win_condition_btn").delay(100).animate({
             top: '0px',
        }, 750);
        setTimeout(function () {            
                setShapesSpeed(1.5);
                blurPage();
            }, 750);
       
    }

    function setShapesSpeed(newSpeed)
    {
        for(i in shapes){
            shapes[i].vx = shapes[i].vy = newSpeed;
            speed = newSpeed;
        }
    }

function blurPage()
{
    canvas.style.webkitFilter = "blur(3px)";
}

function unBlurPage()
{
    canvas.style.webkitFilter = "blur(0px)";
}
 
    var blinkOpenSidebarLight;
    var blinkCloseSidebarLight;

    $("#ok_win_btn").click(function(){

   var ding = new Audio('sounds/mouse-click.wav');
   ding.play();

        closeTaskTray = true;
         $("#level_name").text(level.task);      
           $("#win_condition").delay(100).animate({
             top: '-100%',
        }, 750);
           setTimeout(function () {
               blinkOpenSidebarLight = setInterval(AttentionSidebar, 400);

            if(levelNum == 0)
            {
                showInsructionOpenSidebar();
            }
                }, 1500);
       setTimeout(function () {
            setShapesSpeed(3);
            unBlurPage();
        }, 750);
    });

    $("#next_lvl_btn").click(function(){
           var ding = new Audio('sounds/mouse-click.wav');
            ding.play();

            levelNum++;
            window.location.href = "levels.html?level=" + levelNum;
    });

        $("#logo-div").click(function () {
        window.location.href = "levels.html?level=" + levelNum;
    });

     function getRandom(min, max) {
        return min + Math.random() * (max - min + 1);
    }

    function CalcNewSpeed()
    {
        var shapesCnt = shapes.length;
        if(shapesCnt == 1)
        {

        }
        else if(shapesCnt >= 2 && shapesCnt <= 10)
        {

        }
        else if(shapesCnt >= 11 && shapesCnt <= 30)
        {

        }
        for(i in shapes){
            shapes[i].vx = shapes[i].vy = newSpeed;
            speed = newSpeed;
        }
    }

    var clickOpenSidebarInstruction;

    function showInsructionOpenSidebar()
    {
        var topPosition = $("#open-btn").position().top + 50;
        var cusrsor1 = $("<img src='images/cursor_pointer.png' class='pointer-cursor-img'></img>").css({ top: topPosition +'px' }).appendTo(".containerDiv");
        var leftPosition = innerWidth - 55;

        cusrsor1.animate({
                    left: leftPosition + 'px',
                    opacity: '1',            
                }, 1000);
        
        setTimeout(function(){
            var cusrsor2 = $("<img src='images/click_cursor.png' class='click-cursor-img'></img>")
            .css({ top: topPosition +'px' }).css({ left: leftPosition +'px' }).appendTo(".containerDiv");
            clickOpenSidebarInstruction = window.setInterval("$('.click-cursor-img').toggle();",500);
        }, 1100);        
    }

    var topPosition = $("#slots-container").position().top;// + 70;
    var leftPosition = $("#slots-container").position().left + 295;// + 640;
    var pointer = levelNum == 0 ? $("<img src='images/cursor.png' class='cursor-img'></img>")
            .css({ top: topPosition +'px', left: leftPosition +'px' , position: 'absolute'}).appendTo("#sidebar") : null;
    var slot = 0;

    function showTooltip()
    {           
        if(slot < 7)   
        {          
            pointer.animate({
            left: leftPosition - slot * 100 + 'px'          
                                    }, 680);                   
            $('#slot0_' + slot + ' .tooltiptext').css("visibility", "visible").css("opacity", "1");
            slot++;
        }
        else
        {
            clearInterval(showTooltiopInterval);
            setTimeout(function() {
                pointer.hide();
                dragInterval = window.setInterval(
                    "$('#card0').toggle();"
                    , 350);
            }, 1000);

            setTimeout(function() {
                toggleBorderQuestionSlot();
            }, 1500);

            setTimeout(function() {
                clearInterval(dragInterval);
                 $('#card0').css("display", "block");
            }, 4500);
           

        }      
    }

function toggleBorderQuestionSlot()
{
    var cnt = 0;    
    var timer = setInterval(function () {
        cnt++
        if (cnt == 6) {
            $("#slot0_5").css('border', '2px white solid');
            clearInterval(timer);
        } else {
            cnt % 2 == 1 ? $("#slot0_5").css('border', 'none') : $("#slot0_5").css('border', '2px white solid');
        }
    }, 1000);
}
 
});




