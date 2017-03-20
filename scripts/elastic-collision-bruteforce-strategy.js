function CollisionStrategy(shapes){	
for(var j=0;j<shapes.length;j++){
	var shape = shapes[j];
	for(var i=j+1 ; i<shapes.length ; i++){
		if(shape.id == shapes[i].id){
			continue;
		}
		var cx = shapes[i].x;
		var cy = shapes[i].y;
		var xDiff = Math.abs(cx - shape.x);
		var yDiff = Math.abs(cy - shape.y);
		var c2cDist = Math.sqrt(Math.pow(xDiff,2) + Math.pow(yDiff,2))

		if((c2cDist + gap) > (shapes[i].r + shape.r)){
		}else{

		//	shape.colideWith.add(shapes[i].id);
		//	shapes[i].colideWith.add(shape.id);

		//	 setTimeout(resetColide(shape,shapes[i]),500);
		
		if(shape.x >= shapes[i].x){
			shapes[i].vx = -speed;
			shape.vx = speed;
		}else{
			shapes[i].vx = speed;
			shape.vx = -speed;
		}

		if(shape.y >= shapes[i].y){
					shapes[i].vy = -speed;
					shape.vy = speed;
				}else{
				shapes[i].vy = speed;
					shape.vy = -speed;
				}
		}
		// if((c2cDist + gap ) > (shapes[i].r + shape.r)){
		// }else{
		// 	var tx = shape.vx;
		// 	shape.vx = shapes[i].vx;
		// 	shapes[i].vx = tx;
			
		// 	var ty = shape.vy;
		// 	shape.vy = shapes[i].vy;
		// 	shapes[i].vy = ty;
		// }
	}
}
}


