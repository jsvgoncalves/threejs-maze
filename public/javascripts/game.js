var t = THREE

function parseMaze (map) {
	// body...
	// console.log('I got the map' + JSON.stringify(map));
	// var maze = new mazeGL();
	mazeGL.init({maze: map})
}


function isActive(){
	return mazeGL.started;
}


var mazeGL = {

	/**
	 * Initialize
	 */

	started : false,
	exec_id : undefined,
	obstacles : new Array(),


	init : function ( config ) {
		if( !this.started ){
			this.controls, this.time = Date.now();


			this.started = true;
			this.config = config
			this.objects = new Object()
			this.map = new t.Object3D()

			// We need a scene
			this.scene = new t.Scene();
			//scene.fog = new t.FogExp2(0xD6F1FF, 0.0005);

			// A camera
			 // window.innerWidth / window.innerHeight
			this.width = window.innerWidth
			this.height = window.innerHeight
			this.camera = new t.PerspectiveCamera(75, this.width/this.height, 1, 1000)
			// this.camera = new t.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1000)
			//this.camera.position = {x: 0, y: 20.5, z: 0}
			// this.camera.lookAt ( {x: 2, y: 1.5, z: -1})
			// And a renderer

			/// COLISOES

			this.rays = [
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(-1, 0, 0) 
        	];
			this.caster = new t.Raycaster();




			this.renderer = new t.WebGLRenderer()
			this.renderer.setClearColor(new t.Color(0x123466))
			this.renderer.setSize(this.width, this.height)
			// this.renderer.setSize(window.innerWidth, window.innerHeight);
			document.body.appendChild(this.renderer.domElement)

			this.attachEvents()
			this.addObjects()
			this.setLights()
			
			this.lockMouse()
			
			this.setUpControls()
			this.parseMaze()
			this.hideHTML()
			this.render()

		}
		

	},

	hideHTML: function () {
		$('#absoluteCenter').hide();
	},

	attachEvents: function (){
		var self = mazeGL
		window.addEventListener( 'resize', self.onWindowResize, false );

	},

	addObjects : function () {
		var self = mazeGL

		self.objects.floor = drawFloor()
		
		self.scene.add(self.objects.floor);
		// self.objects.ceiling = drawCeiling()
		// self.scene.add(self.objects.ceiling);
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
		dim = {x: 10, y: 20, z: 10}
		for (var i = 0; i < cols; i++) {
			for (var j = 0; j < rows; j++) {
				// console.log(i + ' ' + j + 'ble -> ' + maze[i][j]);
				if(maze[i][j] == 0) {
					// console.log('nothing here')
				} else if(maze[i][j] == 1) {
					pos = {x: i * dim.x - half_x * dim.x, y: dim.y/2, z: j * dim.z - half_z * dim.z};
					cube = myCube(dim, pos, 'wall-1.jpg');
					self.map.add(cube);
					this.obstacles.push(cube);
				}else if( maze[i][j] == 2){
					this.controls.getObject().position.set( i * dim.x - half_x * dim.x, dim.y/2, j * dim.z - half_z * dim.z);
					//self.camera.position.x = i * dim.x - half_x * dim.x;
					//self.camera.position.y = dim.y/2 ;
					//self.camera.position.z = j * dim.z - half_z * dim.z; 
				}
			}
		}
		self.scene.add(self.map)
	},

	detectIntersection : function(self){
		var collisions, i,
			// Maximum distance from the origin before we consider collision
			distance = 2;
			// Get the obstacles array from our world
			
		// For each ray
		for (i = 0; i < this.rays.length; i += 1) {
			// We reset the raycaster to this direction
			this.caster.set(this.controls.getObject().position, this.rays[i]);
			// Test if we intersect with any obstacle mesh
			collisions = this.caster.intersectObjects(this.obstacles);
			// And disable that direction if we do
			
			if (collisions.length > 0 && collisions[0].distance <= distance) {
				console.log('COLIDIU com distancia ' + collisions[0].distance);
				self.controls.reverseMove1 ( true );
				/*if(i == 0){
					
					self.controls.reverseMove1(true);
				}else if( i == 1){
					self.controls.reverseMove3(true);
				}else if( i == 2){
					self.controls.reverseMove2(true);
				}else{
					self.controls.reverseMove4(true);
					
				}*/

				/*
			this.rays = [
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(-1, 0, 0) 
        	];*/
				 // && collisions[0].distance <= distance
				// Yep, this.rays[i] gives us : 0 => up, 1 => up-left, 2 => left, ...
				/*if ((i === 0 || i === 1 || i === 7) && this.direction.z === 1) {
				this.direction.setZ(0);
				} else if ((i === 3 || i === 4 || i === 5) && this.direction.z === -1) {
				this.direction.setZ(0);
				}
				if ((i === 1 || i === 2 || i === 3) && this.direction.x === 1) {
				this.direction.setX(0);
				} else if ((i === 5 || i === 6 || i === 7) && this.direction.x === -1) {
				this.direction.setX(0);
				}*/
				
			}
		}
		
	},

	setUpControls: function () {
		var self = mazeGL
		self.controls = new t.PointerLockControls( self.camera );
		// // Camera moves with mouse, flies around with WASD/arrow keys
		// self.controls = new t.FirstPersonControls(this.camera); // Handles camera control
		// self.controls.movementSpeed = 25; // How fast the player can walk around
		// self.controls.lookSpeed = 0.075; // How fast the player can look around with the mouse
		// self.controls.lookVertical = false; // Don't allow the player to look up or down. This is a temporary fix to keep people from flying
		// self.controls.noFly = true; // Don't allow hitting R or F to go up or down
		// self.scene.add( self.controls );
		self.scene.add( self.controls.getObject() );
	},

	pointerlockchange : function ( event ) {
		var self = mazeGL,
			element = self.element

		if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

			self.controls.enabled = true;

			self.blocker.style.display = 'none';

		} else {
			console.log('i no have it now!')
			self.controls.enabled = false;

			self.blocker.style.display = '-webkit-box';
			self.blocker.style.display = '-moz-box';
			self.blocker.style.display = 'box';

			self.blocker.style.display = 'inline';
			self.instructions.style.display = 'inline';

		}
	},

	pointerlockerror : function ( event ) {
		console.log('error pointer');
		var self = mazeGL
		self.instructions.style.display = 'inline';
		self.blocker.style.display = 'inline';

	},

	lockMouse: function () {
		var self = mazeGL
		self.showLockRequest()

		self.blocker = document.getElementById( 'blocker' )
		self.instructions = document.getElementById( 'instructions' )
		var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

		if ( havePointerLock ) {
			self.element = document.body;

			// Hook pointer lock state change events
			document.addEventListener( 'pointerlockchange', self.pointerlockchange, false );
			document.addEventListener( 'mozpointerlockchange', self.pointerlockchange, false );
			document.addEventListener( 'webkitpointerlockchange', self.pointerlockchange, false );

			document.addEventListener( 'pointerlockerror', self.pointerlockerror, false );
			document.addEventListener( 'mozpointerlockerror', self.pointerlockerror, false );
			document.addEventListener( 'webkitpointerlockerror', self.pointerlockerror, false );

			self.instructions.addEventListener( 'click', function ( event ) {

				self.instructions.style.display = 'none';

				// Ask the browser to lock the pointer
				self.element.requestPointerLock = self.element.requestPointerLock || self.element.mozRequestPointerLock || self.element.webkitRequestPointerLock;

				if ( /Firefox/i.test( navigator.userAgent ) ) {

					var fullscreenchange = function ( event ) {

						if ( document.fullscreenElement === self.element || document.mozFullscreenElement === self.element || document.mozFullScreenElement === self.element ) {

							document.removeEventListener( 'fullscreenchange', fullscreenchange );
							document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

							self.element.requestPointerLock();
						}

					}

					document.addEventListener( 'fullscreenchange', fullscreenchange, false );
					document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

					self.element.requestFullscreen = self.element.requestFullscreen || self.element.mozRequestFullscreen || self.element.mozRequestFullScreen || self.element.webkitRequestFullscreen;

					self.element.requestFullscreen();

				} else {

					self.element.requestPointerLock();

				}

			}, false );

		} else {

			self.instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

		}
	},

	showLockRequest: function() {
		var self = mazeGL
		// self.instructions = document.getElementById( 'instructions' )
		$('#blocker').show()
		// $('#instructions').show()
	},

	onWindowResize: function () {
		var self = mazeGL
		self.camera.aspect = window.innerWidth / window.innerHeight;
		self.camera.updateProjectionMatrix();

		self.renderer.setSize( window.innerWidth, window.innerHeight );

	},

	/**
	 * Renders the scene.
	 */
	render : function () {
		
		var self = mazeGL
		this.exec_id = requestAnimationFrame(self.render) 
		// Animations
		self.controls.isOnObject( false );
		self.controls.reverseMove1 ( false );
		self.objects.cube1.rotation.y += 0.01
		self.objects.cube2.rotation.x += 0.01
		self.objects.cube3.rotation.z -= 0.01
		//self.controls.update();
		// self.renderer.render(self.scene, self.camera)
		//console.log(self.controls.getObject().position)

		self.detectIntersection(self)

		self.controls.update( Date.now() - self.time)
		
		

		self.renderer.render( self.scene, self.camera )

		self.time = Date.now()
		
	},

	//suposta funcao para parar mas nao funciona
	stop : function () {
		if(this.exec_id){
			window.cancelAnimationFrame(this.exec_id);
			this.exec_id = undefined;
			this.started = false;
			console.log('webgl stopped');
       		
		}
	}
}

