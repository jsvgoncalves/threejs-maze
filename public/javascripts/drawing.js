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
	cube.position = {x: pos.x, y: pos.y, z: pos.z};
	return cube;
}

function myFloor (argument) {
	//PlaneGeometry( width, height, widthSegments, heightSegments )
	//var floor_geometry = new t.CubeGeometry(30, 1, 30);
	var floor_geometry = new t.PlaneGeometry(35, 35, 64, 64);
	//var floor_geometry = new t.CubeGeometry(30, 1, 30);
	//.MeshLambertMaterial({color: 0xEDCBA0})
	//var floor_material = new t.MeshBasicMaterial({color: 0xecda1f});
	//var floor_material = new THREE.MeshBasicMaterial({color: 0x000000	, wireframe: true});
	var floor_material = new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture('images/gravel.jpg')});
	var floor = new t.Mesh(floor_geometry, floor_material);
	floor.position.y = 0;
	floor.rotation.x -= 90 * Math.PI / 180;
	return floor;
}