/***********************************/
/*          Shape Object           */
/***********************************/
function Shape(id, type, color, size, startPosition, animation) {
    this.id = id;
    this.type = type;
    this.color = color;
    this.size = size;
    this.startPosition = startPosition;
    this.animation = animation;
    this.left = function () { return $("#" + this.id).offset().left; };
    this.top = function () { return $("#" + this.id).offset().top; };
    this.height = function () { return $("#" + this.id).height(); };
    this.width = function () { return $("#" + this.id).width(); };
    this.create = function () {
        if (type.indexOf("triangle") >= 0) {
            color = "color-" + color;
        }
        var classes = "shape " + type + " " + color + " " + this.size + " " + startPosition;
        $("#stageDiv").append("<div class='" + classes + "' id='" + this.id + "'></div>");
    };
    this.remove = function () {
        $("#" + this.id).remove();
    };
    this.hide = function () {
        $("#" + this.id).hide();
    };
    this.startAnimation = function (animation) {
        if (this.animation != "")
        {
            animation = this.animation;
        }
        StartShapeAnimation(this.id, animation);
    };
    this.stopAnimation = function () {
        $("#" + this.id).stop();
    };
    this.changeColor = function (newColor) {
        $("#" + this.id).removeClass("red").removeClass("green").removeClass("yellow").removeClass("blue").removeClass("purple");
        $("#" + this.id).removeClass(this.color).addClass(newColor);
    };
    this.increaseSize = function () {
        if ($("#" + this.id).hasClass("small-size")) {
            $("#" + this.id).removeClass("small-size");
            $("#" + this.id).addClass("medium-size");
        }
        else if ($("#" + this.id).hasClass("medium-size")) {
            $("#" + this.id).removeClass("medium-size");
            $("#" + this.id).addClass("large-size");
        }
    };
    this.rotate = function () {
        $('#' + this.id).animate({ borderSpacing: -180 }, {
            step: function (now, fx) {
                $(this).css('-webkit-transform', 'rotate(' + now + 'deg)');
                $(this).css('-moz-transform', 'rotate(' + now + 'deg)');
                $(this).css('transform', 'rotate(' + now + 'deg)');
            },
            duration: 'slow'
        }, 'linear');
    };
};

/***********************************/
/*             Animations          */
/***********************************/

function StartShapeAnimation(id, animationType) {
    switch (animationType) {
        case "ltrAnimation":
            {
                LtrAnimation(id);
                break;
            }
        case "rtlAnimation":
            {
                RtlAnimation(id);
                break;
            }
        case "vertical":
            {
                VerticalAnimation(id);
                break;
            }
        case "random-slow":
            {
                RandomAnimation(id, 8000);
                break;
            }
        case "random":
            {
                RandomAnimation(id, 2000);
                break;
            }
        case "random-fast":
            {
                RandomAnimation(id, 800);
                break;
            }
    }
}

function StopAllShapesAnimation() {
    for (var i = 0; i < shapesArray.length; i++) {
        shapesArray[i].stopAnimation();
    }
}

function StartAllShapesAnimation() {
    for (var i = 0; i < shapesArray.length; i++) {
        shapesArray[i].startAnimation();
    }
}

function StartLevelAnimation() {
    if ($("#play-btn").hasClass("animate")) {//pause animation         
        StopAllShapesAnimation();
        $("#play-btn").removeClass("animate");
        $("#play-icon").addClass("play-icon").removeClass("pause-icon");
    }
    else { //play animation
        $("#play-btn").addClass("animate");
        $("#play-icon").removeClass("play-icon").addClass("pause-icon");
        StartAllShapesAnimation();
    }
}

/***********************************/
/*          Setup Level            */
/***********************************/

function SetUpLevel() {
    var cardsNumber;
    switch (level) {
        case 1:
            {
                $("#mission").text("שלב 1: צור משולש צהוב");
                //var square = jQuery.extend(true, {}, shape);
                //square.create("square1", "square", "green", "medium-size", "right-center", "rtlAnimation");
                var square = new Shape("square1", "square", "green", "medium-size", "right-center", "rtlAnimation");
                square.create();
                shapesArray.push(square);
                //var circle = jQuery.extend(true, {}, shape);
                //circle.create("circle1", "circle", "purple", "medium-size", "left-center", "ltrAnimation");
                var circle = new Shape("circle1", "circle", "purple", "medium-size", "left-center", "ltrAnimation");
                circle.create();
                shapesArray.push(circle);
                cardsNumber = 3;
                //CreateRuleParts();
                //CreateCards(3);
                //AddCardsContentLevel();                
                break;
            }
        case 2:
            {
                $("#mission").text("שלב 2: שנה את הצבע של הריבוע לאדום");
                var square = new Shape("square1", "square", "green", "medium-size", "center-center", "vertical");
                square.create();
                shapesArray.push(square);
                cardsNumber = 3;
                break;
            }
        case 3:
            {
                $("#mission").text("שלב 3: הגדל את העיגול");
                var circle = new Shape("circle1", "circle", "purple", "medium-size", "center-center", "random");
                circle.create();
                shapesArray.push(circle);
                cardsNumber = 3;
                break;
            }
        case 4:
            {
                $("#mission").text("שלב 4: סובב שלושה מלבנים");
                var rectangle1 = new Shape("rectangle1", "rectangle", "azure1", "medium-size", "left-center", "random-slow");
                var rectangle2 = new Shape("rectangle2", "rectangle", "azure1", "medium-size", "right-center", "random-slow");
                var rectangle3 = new Shape("rectangle3", "rectangle", "azure1", "medium-size", "right-center", "random-slow");
                var rectangle4 = new Shape("rectangle4", "rectangle", "azure1", "medium-size", "left-center", "random-slow");
                var rectangle5 = new Shape("rectangle5", "rectangle", "azure1", "medium-size", "right-center", "random-slow");
                rectangle1.create();
                rectangle2.create();
                rectangle3.create();
                rectangle4.create();
                rectangle5.create();
                shapesArray.push(rectangle1);
                shapesArray.push(rectangle2);
                shapesArray.push(rectangle3);
                shapesArray.push(rectangle4);
                shapesArray.push(rectangle5);
                cardsNumber = 3;
                break;
            }
        case 5:
            {
                $("#mission").text("שלב 5: מחק את כל חצאי- העיגול");
                var halfcircle1 = new Shape("halfcircle1", "half-circle", "blue", "medium-size", "center-center", "");
                halfcircle1.create();
                shapesArray.push(halfcircle1);
                var halfcircle2 = new Shape("halfcircle2", "half-circle", "red", "medium-size", "center-right40", "");
                halfcircle2.create();
                shapesArray.push(halfcircle2);
                var halfcircle3 = new Shape("halfcircle3", "half-circle", "azure1", "medium-size", "center-right60", "");
                halfcircle3.create();
                shapesArray.push(halfcircle3);

                var circle1 = new Shape("circle1", "circle", "pink", "medium-size", "top-center", "vertical");
                circle1.create();
                shapesArray.push(circle1);
                var circle2 = new Shape("circle2", "circle", "pink", "medium-size", "top-right40", "vertical");
                circle2.create();
                shapesArray.push(circle2);
                var circle3 = new Shape("circle3", "circle", "pink", "medium-size", "top-right60", "vertical");
                circle3.create();
                shapesArray.push(circle3);
                cardsNumber = 4;
                break;
            }
        case 6:
            {
                //$("#mission").text("שלב 6: גרום לעיגול לפעום");
                //var circle1 = new Shape("circle1", "circle", "yellow", "medium-size", "center-center", "");
                //circle1.create();
                //shapesArray.push(circle1);
                //var triangle1 = new Shape("triangle1", "triangle-up", "azure2", "", "center-bottom70", "");
                //triangle1.create();
                //shapesArray.push(triangle1);                
                //break;
            }
    }
    CreateRuleParts();
    CreateCards(cardsNumber);
    AddCardsContentLevel();
}

function CreateRuleParts() {
    switch (level) {
        case 1:
            {
                for (var i = 6; i >= 0; i--) {
                    $('<div></div>').data('number', i).attr('id', 'rule-part' + i).addClass("rule-part").appendTo('#rules-container').droppable({
                        accept: '#cards-container div',
                        hoverClass: 'hovered',
                        drop: handleCardDrop
                    });
                }
                $("#rule-part0").addClass("if-then-class");
                $("#rule-part4").addClass("if-then-class");
                $("#rule-part2").addClass("method-class");
                $("#rule-part6").addClass("method-class");
                $("#rule-part1").addClass("entity-class").addClass("question-class");
                $("#rule-part3").addClass("entity-class").addClass("question-class");
                $("#rule-part5").addClass("entity-class").addClass("question-class");
                $('<p>כאשר</p>').appendTo("#rule-part0");
                $('<p>אז</p>').appendTo("#rule-part4");
                $('<p>פוגש</p>').appendTo("#rule-part2");
                $('<p>נוצר</p>').appendTo("#rule-part6");
                break;
            }
        case 2:
            {
                for (var i = 7; i >= 0; i--) {
                    $('<div></div>').data('number', i).attr('id', 'rule-part' + i).addClass("rule-part").appendTo('#rules-container').droppable({
                        accept: '#cards-container div',
                        hoverClass: 'hovered',
                        drop: handleCardDrop
                    });
                }
                $("#rule-part0").addClass("if-then-class");
                $("#rule-part4").addClass("if-then-class");
                $("#rule-part2").addClass("method-class");
                $("#rule-part6").addClass("method-class");
                $("#rule-part1").addClass("entity-class");
                $("#rule-part5").addClass("entity-class");
                $("#rule-part3").addClass("param-class");
                $("#rule-part7").addClass("param-class").addClass("question-class");
                $('<div class="medium-size green centered"></div>').appendTo("#rule-part1");
                $('<div class="medium-size green centered"></div>').appendTo("#rule-part5");
                $('<p>כאשר</p>').appendTo("#rule-part0");
                $('<p>פוגש את</p>').appendTo("#rule-part2");
                $('<p>אז</p>').appendTo("#rule-part4");
                $('<p>משנה צבע ל-</p>').appendTo("#rule-part6");
                $('<p>תקרת המסך</p>').appendTo("#rule-part3");
                break;
            }
        case 3:
            {
                for (var i = 6; i >= 0; i--) {
                    $('<div></div>').data('number', i).attr('id', 'rule-part' + i).addClass("rule-part").appendTo('#rules-container').droppable({
                        accept: '#cards-container div',
                        hoverClass: 'hovered',
                        drop: handleCardDrop
                    });
                }
                $("#rule-part0").addClass("if-then-class");
                $("#rule-part4").addClass("if-then-class");
                $("#rule-part2").addClass("method-class");
                $("#rule-part6").addClass("method-class");
                $("#rule-part1").addClass("entity-class");
                $("#rule-part5").addClass("entity-class");
                $("#rule-part3").addClass("param-class").addClass("question-class");
                $('<div class="medium-size purple circle centered"></div>').appendTo("#rule-part1");
                $('<div class="medium-size purple circle centered"></div>').appendTo("#rule-part5");
                $('<p>כאשר</p>').appendTo("#rule-part0");
                $('<p>פוגש</p>').appendTo("#rule-part2");
                $('<p>אז</p>').appendTo("#rule-part4");
                $('<p>גדל</p>').appendTo("#rule-part6");
                break;
            }
        case 4:
            {
                for (var i = 5; i >= 0; i--) {
                    $('<div></div>').data('number', i).attr('id', 'rule-part' + i).addClass("rule-part").appendTo('#rules-container').droppable({
                        accept: '#cards-container div',
                        hoverClass: 'hovered',
                        drop: handleCardDrop
                    });
                }
                $("#rule-part0").addClass("if-then-class");
                $("#rule-part3").addClass("if-then-class");
                $("#rule-part1").addClass("entity-class").addClass("question-class");
                $("#rule-part5").addClass("method-class").addClass("question-class");
                $("#rule-part2").addClass("method-class");
                $("#rule-part4").addClass("entity-class");
                $('<p>כאשר</p>').appendTo("#rule-part0");
                $('<p>נלחץ</p>').appendTo("#rule-part2");
                $('<p>אז</p>').appendTo("#rule-part3");
                $('<div class="azure1 rectangle centered"></div>').appendTo("#rule-part4");
                break;
            }
        case 5:
            {
                for (var i = 6; i >= 0; i--) {
                    $('<div></div>').data('number', i).attr('id', 'rule-part' + i).addClass("rule-part").appendTo('#rules-container').droppable({
                        accept: '#cards-container div',
                        hoverClass: 'hovered',
                        drop: handleCardDrop
                    });
                }
                $("#rule-part0").addClass("if-then-class");
                $("#rule-part1").addClass("entity-class").addClass("question-class");
                $("#rule-part4").addClass("if-then-class");
                $("#rule-part2").addClass("method-class").addClass("question-class");
                $("#rule-part6").addClass("method-class");
                $("#rule-part3").addClass("entity-class");
                $("#rule-part5").addClass("entity-class").addClass("question-class");
                $('<p>כאשר</p>').appendTo("#rule-part0");
                $('<p>אז</p>').appendTo("#rule-part4");
                $('<div class="half-circle grey-gradient centered medium-size"></div>').appendTo("#rule-part3");
                $('<p>נמחק</p>').appendTo("#rule-part6");
                break;
            }
        case 6:
            {
                //for (var i = 6; i >= 0; i--) {
                //    $('<div></div>').data('number', i).attr('id', 'rule-part' + i).addClass("rule-part").appendTo('#rules-container').droppable({
                //        accept: '#cards-container div',
                //        hoverClass: 'hovered',
                //        drop: handleCardDrop
                //    });
                //}
                //$("#rule-part0").addClass("if-then-class");
                //$("#rule-part1").addClass("entity-class").addClass("question-class");
                //$("#rule-part2").addClass("method-class");
                //$("#rule-part3").addClass("entity-class");
                //$("#rule-part4").addClass("if-then-class");
                //$("#rule-part5").addClass("entity-class");
                //$("#rule-part6").addClass("method-class").addClass("question-class");                               
                //$('<p>כאשר</p>').appendTo("#rule-part0");
                //$('<p>אז</p>').appendTo("#rule-part4");
                //$('<p>מסתובב סביב</p>').appendTo("#rule-part2");
                
                break;
            }
    }

}

function AddCardsContentLevel() {
    switch (level) {
        case 1:
            {
                $('<div class="triangle-up color-yellow centered"></div>').appendTo("#card0");
                $('<div class="medium-size green centered"></div>').appendTo("#card1");
                $('<div class="circle medium-size purple centered"></div>').appendTo("#card2");
                break;
            }
        case 2:
            {
                $('<div class="blue-color centered"></div>').appendTo("#card0");
                $('<div class="yellow-color centered"></div>').appendTo("#card1");
                $('<div class="red-color centered"></div>').appendTo("#card2");
                break;
            }
        case 3:
            {
                $('<div class="top-position centered"></div>').appendTo("#card0");
                $('<div class="left-position centered"></div>').appendTo("#card1");
                $('<div class="bottom-position centered"></div>').appendTo("#card2");
                break;
            }
        case 4:
            {
                $('<div class="centered" style="font-size:20px;color:black">מסתובב</div>').appendTo("#card0");
                $('<div class="green circle centered medium-size"></div>').appendTo("#card1");
                $('<div class="azure1 rectangle centered"></div>').appendTo("#card2");
                break;
            }
        case 5:
            {
                $('<div class="centered" style="font-size:20px;color:black">פוגש</div>').appendTo("#card0");
                $('<div class="half-circle grey-gradient centered medium-size"></div>').appendTo("#card1");
                $('<div class="half-circle red centered medium-size"></div>').appendTo("#card2");
                $('<div class="circle pink centered medium-size"></div>').appendTo("#card3");
                break;
            }
    }

}

function CreateCards(NumOfCards) {
    for (var i = NumOfCards - 1; i >= 0; i--) {
        $('<div></div>').data('number', i).attr('id', 'card' + i).appendTo('#cards-container').addClass("card").draggable({
            containment: '#sidebar',
            stack: '#rules-container div',
            cursor: '-webkit-grab',
            revert: true
        });
    }
}

var correctCards = 0;

function handleCardDrop(event, ui) {
    var slotNumber = $(this).data('number');
    var cardNumber = ui.draggable.data('number');
    switch (level) {
        case 1:
            {

                if (slotNumber == 1 || slotNumber == 3 || slotNumber == 5) {
                    //ui.draggable.addClass('correct');
                    //ui.draggable.draggable('disable');
                    //$(this).droppable('disable');
                    ui.draggable.position({ of: $(this), my: 'left top', at: 'left top' });
                    ui.draggable.draggable('option', 'revert', false);
                }
                if (slotNumber == 1 && (cardNumber == 1 || cardNumber == 2) ||
                    slotNumber == 3 && (cardNumber == 1 || cardNumber == 2) ||
                    slotNumber == 5 && cardNumber == 0) {
                    correctCards++;
                }
                if (correctCards == 3) {
                    setInterval(CreateTriangleWhenCircleAndSquareCrash, 50);
                }
                break;
            }
        case 2:
            {
                if (slotNumber == 7) {
                    ui.draggable.position({ of: $(this), my: 'left top', at: 'left top' });
                    ui.draggable.draggable('option', 'revert', false);
                    clearInterval(eventInterval);
                    if (cardNumber == 2) {
                        correctCards++;
                    }
                }
                if (cardNumber == 0) {
                    eventInterval = setInterval(function () { ChaneColorWhenPositionTop("blue", false); }, 50);
                }
                else if (cardNumber == 1) {
                    eventInterval = setInterval(function () { ChaneColorWhenPositionTop("yellow", false); }, 50);
                }
                else if (cardNumber == 2) { //correct answer                                   
                    eventInterval = setInterval(function () { ChaneColorWhenPositionTop("red", true); }, 50);

                }
                break;
            }
        case 3:
            {
                if (slotNumber == 3) {
                    ui.draggable.position({ of: $(this), my: 'left top', at: 'left top' });
                    ui.draggable.draggable('option', 'revert', false);
                    //clearInterval(eventInterval);            
                }
                var shape = shapesArray[0];
                switch (cardNumber) {
                    case 0:
                        IncreaseShapeWhenBumpWall("top");
                        break;
                    case 1:
                        IncreaseShapeWhenBumpWall("left");
                        break;
                    case 2:
                        IncreaseShapeWhenBumpWall("bottom");
                        break;
                }
                break;
            }
        case 4:
            {
                if (slotNumber == 1 || slotNumber == 5) {
                    ui.draggable.position({ of: $(this), my: 'left top', at: 'left top' });
                    ui.draggable.draggable('option', 'revert', false);
                    if (slotNumber == 1 && cardNumber == 2 || slotNumber == 5 && cardNumber == 0) {
                        correctCards++;
                    }
                }
                if (correctCards == 2) {
                    var rotateCnt = 0;
                    $("#stageDiv > .rectangle").click(function () {
                        $(this).animate({ borderSpacing: -180 }, {
                            step: function (now, fx) {
                                $(this).css('-webkit-transform', 'rotate(' + now + 'deg)');
                                $(this).css('-moz-transform', 'rotate(' + now + 'deg)');
                                $(this).css('transform', 'rotate(' + now + 'deg)');
                            },
                            //  duration: 'slow'
                        }, 'linear');
                        rotateCnt++;
                        if (rotateCnt == 3) {
                            MoveToNextLevel();
                        }
                    });
                }
                break;
            }
        case 5:
            {
                if (slotNumber == 1 || slotNumber == 2 || slotNumber == 5) {
                    ui.draggable.position({ of: $(this), my: 'left top', at: 'left top' });
                    ui.draggable.draggable('option', 'revert', false);
                    if (slotNumber == 1 && cardNumber == 3 || slotNumber == 2 && cardNumber == 0 || slotNumber == 5 && cardNumber == 1) {
                        correctCards++;
                    }
                }
                if (correctCards == 3) {
                    eventInterval = setInterval(function () { DeleteHalfCircle(); }, 50);
                }
                else if (slotNumber == 1 && cardNumber == 3 || slotNumber == 2 && cardNumber == 0 || slotNumber == 5 && cardNumber == 2) {
                    eventInterval = setInterval(function () { DeleteRedHalfCircle(); }, 50);
                }
                break;
            }
    }

}

function IncreaseShape(shape) {
    if (shape.width() <= 60) {
        shape.increaseSize();
    }
}

function IncreaseShapeWhenBumpWall(wall) {
    var shape = shapesArray[0];
    if (shape.width() <= 60) {
        switch (wall) {
            case "left":
                eventInterval = setInterval(function () {
                    if (shape.left() <= 1) {
                        IncreaseShape(shape);
                        clearInterval(eventInterval);
                        MoveToNextLevel();
                    }
                }, 50);
                break;
            case "right":

                break;
            case "top":
                eventInterval = setInterval(function () {
                    if (shape.top() <= 1) {
                        IncreaseShape(shape);
                        clearInterval(eventInterval);
                        MoveToNextLevel();
                    }
                }, 50);

                break;
            case "bottom":
                var winHeight = $(window).height() - shape.height() - 1;
                eventInterval = setInterval(function () {
                    if (shape.top() >= winHeight) {
                        IncreaseShape(shape);
                        clearInterval(eventInterval);
                        MoveToNextLevel();
                    }
                }, 50);
                break;
        }
    }
}

var crash = false;

function ChaneColorWhenPositionTop(color, isCorrect) {
    var square = shapesArray[0];
    var topPos = $(window).height() - square.height() + 10;

    if (square.top() <= 1) {
        square.changeColor(color);
        if (isCorrect == true)
            MoveToNextLevel();
    }
}

function MoveToNextLevel() {
    setTimeout(function () {
        StopAllShapesAnimation();
    }, 1250);
    setTimeout(function () {
        $("#move_to_next_lvl").show("slow");
    }, 1000);
    $("#move_to_next_lvl").animate({ fontSize: '80px' }, "slow");
}

function CreateTriangleWhenCircleAndSquareCrash() {
    if ($("#play-btn").hasClass("animate")) {
        var circleLeft = shapesArray[1].left();
        var squareLeft = shapesArray[0].left();
        var squareTop = shapesArray[0].top();

        if (crash == false && squareLeft - 50 <= circleLeft && circleLeft <= squareLeft + 50) {
            crash = true;

            //Create yellow triangle
            //$("#stageDiv").append("<div class='triangle-up' style='position: absolute;border-bottom-color:" + "#f4e542" +
            //        ";top:" + squareTop + "px;left:" + squareLeft + "px'></div>");
            $("#stageDiv").append("<div class='triangle-up color-yellow' style='position: absolute;" +
                  "top:" + squareTop + "px;left:" + squareLeft + "px'></div>");
            MoveToNextLevel();
        }
    }
}

function LtrAnimation(shapeId) {
    if ($("#" + shapeId).hasClass("pos1")) {
        $("#" + shapeId).animate({ left: '-10%' }, 3000, function () { LtrAnimation(shapeId) });
        $("#" + shapeId).removeClass("pos1");
    }
    else {
        $("#" + shapeId).animate({ left: '100%' }, 3000, function () { LtrAnimation(shapeId) });
        $("#" + shapeId).addClass("pos1");
    }
}

function RtlAnimation(shapeId) {
    if ($("#" + shapeId).hasClass("pos1")) {
        $("#" + shapeId).animate({ left: '100%' }, 3000, function () { RtlAnimation(shapeId) });
        $("#" + shapeId).removeClass("pos1");
    }
    else {
        $("#" + shapeId).animate({ left: '-10%' }, 3000, function () { RtlAnimation(shapeId) });
        $("#" + shapeId).addClass("pos1");
    }
}

function VerticalAnimation(shapeId) {
    if ($("#" + shapeId).hasClass("pos1")) {
        $("#" + shapeId).animate({ top: '0' }, 3000, function () { VerticalAnimation(shapeId) });
        $("#" + shapeId).removeClass("pos1");
    }
    else {
        var topPos = $(window).height() - $("#" + shapeId).height();
        $("#" + shapeId).animate({ top: topPos }, 3000, function () { VerticalAnimation(shapeId) });
        $("#" + shapeId).addClass("pos1");
    }
}

function RandomAnimation(shapeId, speed) {
    var x, y;
    var position = Math.floor(Math.random() * 4) + 1;
    if (position == 1) {
        x = ($(window).width() - $("#" + shapeId).offset().left) * Math.random();
        y = 0;
    }
    else if (position == 2) {
        y = ($(window).height() - $("#" + shapeId).height()) * Math.random();
        x = 0;
    }
    else if (position == 3) {
        y = $(window).height() - $("#" + shapeId).height();
        x = ($(window).width() - $("#" + shapeId).offset().left - 75) * Math.random();
    }
    else if (position == 4) {
        y = ($(window).height() - $("#" + shapeId).height()) * Math.random();
        x = $(window).width() - $("#" + shapeId).width() - 75;
    }
    $("#" + shapeId).animate({ top: y, left: x }, {
        queue: false,
        duration: speed,//8000,
        complete: function () {
            RandomAnimation(shapeId, speed);
        }
    });
}

function DeleteRedHalfCircle() {
    if (shapesArray[1].top() - 10 < shapesArray[4].top() && shapesArray[4].top() < shapesArray[1].top() + 10) {
        {
            shapesArray[1].hide();
        }

    }
}

function DeleteHalfCircle() {
    for (var i = 0; i < 3; i++) {
        if (shapesArray[i].top() - 10 < shapesArray[i + 3].top() && shapesArray[i + 3].top() < shapesArray[i].top() + 10) {
            {
                shapesArray[i].hide();
                if (i == 2) {
                    clearInterval(eventInterval);
                    MoveToNextLevel();
                }
            }
        }
    }
}

function SurroundAnimation(shapeId, radius) {

}

function ClearLevel() {
    $("#stageDiv > div").remove();
    $("#rules-container > div").remove();
    $("#cards-container > div").remove();
}