
function makeNewPosition() {
    // Get viewport dimensions (remove the dimension of the div)
    var h = $(window).height() - 50;
    var w = $(window).width() - 200;

    var nh = Math.floor(Math.random() * h);
    var nw = Math.floor(Math.random() * w);

    return [nh, nw];
}

function animateDiv(element) {
    var newq = makeNewPosition();
    var oldq = $('.a').offset();
	var divCnt = $('.a').length;
	var speed = calcSpeed([oldq.top, oldq.left], newq);
	
    $(element).animate({ top: newq[0], left: newq[1] }, speed, function () {
        animateDiv(element);
    });
};

function animateDivTwo() {
    var newq = makeNewPosition();
    var oldq = $('.a').offset();
    var speed = calcSpeed([oldq.top, oldq.left], newq);

    $('.a').animate({ top: newq[0], left: newq[1] }, speed, function () {
        animateDiv(this);
    });
};

function calcSpeed(prev, next) {
    var x = Math.abs(prev[1] - next[1]);
    var y = Math.abs(prev[0] - next[0]);
    var greatest = x > y ? x : y;
    var speedModifier = .4;
    var speed = Math.ceil(greatest / speedModifier);
//TO REMOVE
//	speed = 3000;
	speed = speed*2.5;
//
    return speed;
}