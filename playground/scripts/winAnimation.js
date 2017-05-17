function WinAnimation()
{
    alert("win");
    window.requestAnimFrame = (function(){
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function(callback){
                window.setTimeout(callback, 1000 / 60);
            };
    })();
    //laggy? Turn down partNum
    var partNum = 100;

    var canvas = document.getElementById('c');
    var ctx = canvas.getContext('2d');

    var w = window.innerWidth; var h = window.innerHeight;
    var x = 100; var y = 100;

    var particles = [];
    for(i = 0; i < partNum; i++) {
    setTimeout(function(){
        particles.push(new newParticle);
    }, i * 20);
    }

    function newParticle() {
    this.x = w / 2;
    this.y = h / 2;
    
    this.vx = Math.random() * 10 - 5;
    this.vy = Math.random() * 10 - 5;
    
    this.radius = Math.random() * 15;
    
    this.mass = 1;
    
    var r = '#aa6666';
    var o = '#dd4400';
    var y = '#ffbb00';
    var array = [r, o, y];
        this.color = array[Math.floor(Math.random() * 3)];
    
    this.g = 0.15; 
    }

    var draw = function() {
    requestAnimFrame(draw);
    
    c.width = w;
    c.height = h;
    
    for(t = 0; t < particles.length; t++){
        var p = particles[t];
        
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.radius, Math.PI * 2, false);
        ctx.fill();
        
        p.x+=p.vx;
        p.y+=p.vy+=p.g;
        
        if(p.y <= p.radius)     //top
        p.vy *= -1;
        if(p.y >= h - p.radius) //bottom
        p.vy *= -1;
        if(p.y > h - p.radius && p.vy > 0) //bottom error
        p.vy *= -1;
        if(p.x <= p.radius)     //left
        p.vx *= -1;
        if(p.x >= w - p.radius) //right
        p.vx *= -1;
        if(p.radius < 3) {
        p.color = 'white';
        };
        
        for(var j = i + 1; j < particles.length; j++) {

        p2 = particles[j];

        var disance,
        distanceX = p.x - p2.x,
        distanceY = p.y - p2.y,
        color;

        distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if(distance <= p.radius + p2.radius) {


            var normX = p.x - p2.x;
            var normY = p.y - p2.y;

            var normLength = Math.sqrt( normX * normX + normY * normY);

            normX = normX / normLength;
            normY = normY / normLength;

            var myProj    = (p.vx * normX) + (p.vy * normY);

            var otherProj = (p2.vx * normX) + (p2.vy * normY);

            var impulse = ( 2 * (myProj - otherProj) );

            p.mass = 1; // Replace with "mass" calculation (based on area?)
            p2.mass = 1;   
            impulse = impulse / (p.mass + p2.mass);


            p.vx = p.vx - (impulse * p2.mass * normX);
            p.vy = p.vy - (impulse * p2.mass * normY);

            p2.vx = p2.vx + (impulse * p.mass * normX);
            p2.vy = p2.vy + (impulse * p.mass * normY);
        }             
        }
    }
    };

    draw();
}