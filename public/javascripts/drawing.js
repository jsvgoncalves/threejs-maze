/**
 * Draws a cube on the map.
 * @arg dim The cube dimensions
 * @arg pos The cube position
 */
function myCube(dim, pos, color) {
	var cube_geometry = new t.CubeGeometry(dim.x, dim.y, dim.z);
	//var cube_material = new t.MeshBasicMaterial({color: color});
	var cube_material = new t.MeshLambertMaterial({map: t.ImageUtils.loadTexture('images/' + color)});
	var cube = new t.Mesh(cube_geometry, cube_material);
	cube.position = {x: pos.x + dim.x / 2, y: pos.y, z: pos.z + dim.z / 2};
	return cube;
}

function myFloor (argument) {
	//PlaneGeometry( width, height, widthSegments, heightSegments )
	//var floor_geometry = new t.CubeGeometry(30, 1, 30);
	var floor_geometry = new t.PlaneGeometry(35, 35, 64, 64);
	floor_geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
	//var floor_geometry = new t.CubeGeometry(30, 1, 30);
	//.MeshLambertMaterial({color: 0xEDCBA0})
	//var floor_material = new t.MeshBasicMaterial({color: 0xecda1f});
	//var floor_material = new THREE.MeshBasicMaterial({color: 0x000000	, wireframe: true});
	var floor_material = new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture('images/gravel.jpg')});
	var floor = new t.Mesh(floor_geometry, floor_material);
	floor.position.y = 0;
	// floor.rotation.x -= 90 * Math.PI / 180;
	return floor;
}

function drawFloor () {
	geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

	for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {

		var vertex = geometry.vertices[ i ];
		vertex.x += Math.random() * 20 - 10;
		// vertex.y += Math.random() * 2;
		vertex.z += Math.random() * 20 - 10;

	}

	for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {

		var face = geometry.faces[ i ];
		face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 3 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

	}

	material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

	mesh = new THREE.Mesh( geometry, material );
	return mesh;
}

function drawCeiling () {
	geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
	geometry.applyMatrix( new THREE.Matrix4().makeRotationX(  Math.PI / 2 ) );

	for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {

		var vertex = geometry.vertices[ i ];
		vertex.x += Math.random() * 20 - 10;
		// vertex.y += Math.random() * 2;
		vertex.z += Math.random() * 20 - 10;

	}

	for ( var i = 0, l = geometry.faces.length; i < l; i ++ ) {

		var face = geometry.faces[ i ];
		face.vertexColors[ 0 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 1 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 2 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
		face.vertexColors[ 3 ] = new THREE.Color().setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

	}

	material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

	mesh = new THREE.Mesh( geometry, material );
	mesh.position.y = 20
	return mesh;
}

function drawPlayer(player) {
	console.log('drawPlayers')
	console.log(player)
	dim = {x: 5, y: 5, z: 5}, pos = {x: - player.coord[0] * 10.0, y: player.coord[1] + 10.0 , z: - player.coord[2] * 10.0};
	var cube = myCube(dim, pos, 'buh.jpg');
	return cube;
}


function drawSphere() {
	// set up the sphere vars
	var radius = 1,
	    segments = 16,
	    rings = 16;
	var sphereMaterial =
	  new THREE.MeshLambertMaterial(
	    {
	      color: 0xFFE500
	    });


	// create a new mesh with
	// sphere geometry - we will cover
	// the sphereMaterial next!
	var sphere = new THREE.Mesh(

	  new THREE.SphereGeometry(
	    radius,
	    segments,
	    rings),

	  sphereMaterial);

	return sphere;
}


function buildAxes( length ) {
	var axes = new THREE.Object3D();

	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z

	return axes;

}

function buildAxis( src, dst, colorHex, dashed ) {
	var geom = new THREE.Geometry(),
		mat; 

	if(dashed) {
		mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
	} else {
		mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
	}

	geom.vertices.push( src.clone() );
	geom.vertices.push( dst.clone() );
	geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

	var axis = new THREE.Line( geom, mat, THREE.LinePieces );

	return axis;

}