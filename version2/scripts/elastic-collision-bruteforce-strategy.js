function CollisionStrategy(shapes){	
for(var j=0;j<shapes.length;j++){
	var shape = shapes[j];
	for(var i=j+1 ; i<shapes.length ; i++){
		if(shape.id == shapes[i].id){
			continue;
		}


		// if(shape.hitWallFlag || shapes[i].hitWallFlag || shape.hitShapeFlag || shapes[i].hitShapeFlag)
		// {
		// 	continue;
		// }

		var cx = shapes[i].x;
		var cy = shapes[i].y;
		var xDiff = Math.abs(cx - shape.x);
		var yDiff = Math.abs(cy - shape.y);
		var c2cDist = Math.sqrt(Math.pow(xDiff,2) + Math.pow(yDiff,2))
		if((c2cDist + gap ) > (shapes[i].r + shape.r)){
		}else{
			var tx = shape.vx;
			shape.vx = shapes[i].vx;
			shapes[i].vx = tx;
			
			var ty = shape.vy;
			shape.vy = shapes[i].vy;
			shapes[i].vy = ty;
		}
	}
}
}