var t = THREE

function parseMaze (map) {
	// body...
	// console.log('I got the map' + JSON.stringify(map));
	// var maze = new mazeGL();
	mazeGL.init({maze: map})
}


var mazeGL = {

	/**
	 * Initialize
	 */
	init : function ( config ) {
		this.config = config
		this.objects = new Object()
		this.map = new t.Object3D()


		// We need a scene
		this.scene = new t.Scene();
		//scene.fog = new t.FogExp2(0xD6F1FF, 0.0005);

		// A camera
		this.width = 600
		this.height = 600
		this.camera = new t.PerspectiveCamera(75, this.width/this.height, 1, 1000)
		// this.camera = new t.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1000)
		this.camera.position = {x: 0, y: 20.5, z: 0}
		this.camera.lookAt ( {x: 2, y: 1.5, z: -1})
		// And a renderer
		this.renderer = new t.WebGLRenderer()
		this.renderer.setClearColor(new t.Color(0x123466))
		this.renderer.setSize(this.width, this.height)
		// this.renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(this.renderer.domElement)

		this.addObjects()
		this.setLights()
		this.parseMaze()
		this.render()

	},
	
	/**
	 * Renders the scene.
	 */
	render : function () {
		var self = mazeGL
		requestAnimationFrame(mazeGL.render)

		// Animations
		self.objects.cube1.rotation.y += 0.01
		self.objects.cube2.rotation.x += 0.01
		self.objects.cube3.rotation.z -= 0.01
		//controls.update();
		self.renderer.render(self.scene, self.camera)
	},

	addObjects : function () {
		var self = mazeGL


		self.objects.floor = myFloor()
		
		self.scene.add(self.objects.floor);
		// Now let's add a cube.
		dim = {x: 1, y: 1, z: 1}, pos = {x: 2, y: 4.5, z: 0}
		self.objects.cube1 = myCube(dim, pos, 'meme.jpg')
		self.scene.add(self.objects.cube1)
		// And another cube.
		dim = {x: 1, y: 1, z: 1}, pos = {x: -2, y: 4.5, z: 0}
		self.objects.cube2 = myCube(dim, pos, 'trololo.jpg')
		self.scene.add(self.objects.cube2)
		// And another cube.
		dim = {x: 1, y: 1, z: 1}, pos = {x: 0, y: 5, z: -3}
		self.objects.cube3 = myCube(dim, pos, 'wall-1.jpg')
		self.scene.add(self.objects.cube3)
	},

	setLights : function () {
		this.directionalLight1 = new t.DirectionalLight( 0xF7EFBE, 0.9 )
		this.directionalLight1.position.set( 0.5, 0.5, 0.5 )
		this.scene.add( this.directionalLight1 )

		this.directionalLight2 = new t.DirectionalLight( 0xF7EFBE, 0.8 )
		this.directionalLight2.position.set( -0.5, -1, -0.5 )
		this.scene.add( this.directionalLight2 );

		this.directionalLight3 = new t.DirectionalLight( 0xF7EFBE, 0.4 )
		this.directionalLight3.position.set( 0, 2, 2.5 )
		this.scene.add( this.directionalLight3 )
	},

	parseMaze: function () {
		var self = mazeGL,
			maze = self.config.maze,
			rows = maze[0].length,
			cols = maze.length,
			half_z = cols / 2,
			half_x = rows / 2

		dim = {x: 1, y: 2, z: 1}
		for (var i = 0; i < rows; i++) {
			for (var j = 0; j < cols; j++) {
				if(maze[i][j] == 0) {
					// console.log('nothing here')
				} else if(maze[i][j] == 1) {
					pos = {x: i - half_x, y: 1, z: j - half_z};
					cube = myCube(dim, pos, 'wall-1.jpg');
					self.map.add(cube);
				}
			}
		}
		self.scene.add(self.map)
	}
}

