var t = THREE

function updateStatus (players) {
	// console.log('updateStatus() {')
	// console.log(players)
	// console.log('}')
	Players.update(players.players);
}

/**
Players and stuff
****************/

var Players = {

	players : new Array(),
	cubes : new Array(),
	init: function (config) {

	},

	update: function (players) {
		this.clean(players);
		//this.players = players
		//MazeGL.addPlayers();
	},

	clean : function(players) {

		var clean1 = 0;

		//clean removed players
		for( var i = 0 ; i < this.players.length ; i++){
			clean1 = 0;
			for( var j = 0 ; j < players.length ; j++){
				if(this.players[i].name == players[j].name){
					this.players[i].status = players[j].status;
					this.players[i].win = players[j].win;
					console.log ( 'win: ' + players[j].win);
					if(players[j].win == 1){
						MazeGL.notifyMessage.innerHTML = players[j].name + ' won!';
						MazeGL.notifyElement.style.display = 'inline';
						MazeGL.controls.statusControls( false );
					}
					clean1 = 1;
					break;
				}
			}

			//remove player i
			if(clean1 == 0){
				MazeGL.removePlayer(this.cubes[i]);
				this.cubes.splice(i,1);
				this.players.splice(i,1);
				i--;
			}
		}

		//add news players
		for( var i = 0 ; i < players.length ; i++){
			clean1 = 0;
			for( var j = 0 ; j < this.players.length ; j++){
				if(players[i].name == this.players[j].name){
					clean1 = 1;
					break;
				}
			}

			// add player 
			if ( clean1 == 0){
				var cube = drawPlayer(players[i]);
				this.cubes.push( cube );
				if( get_player_name() != players[i].name){
					MazeGL.addPlayer(this.cubes[this.cubes.length-1]);
				}
				this.players.push(players[i]);
			}

		}
	},

	updatePlayer: function (name, coordsx, coordsy, coordsz, status) {
		for (var i = this.players.length - 1; i >= 0; i--) {
			if(this.players[i].name == name) {
				//console.log(this.players[i]);
				//console.log(this.players[i].name);
				this.players[i].coord[0] = coordsx;
				this.players[i].coord[1] = coordsy;
				this.players[i].coord[2] = coordsz;
				if(name != get_player_name()){
					this.cubes[i].position.x = - 10.0 * coordsx;
					this.cubes[i].position.y = 10.0 + coordsy;
					this.cubes[i].position.z = - 10.0 * coordsz;
					console.log('actualizou posiçao ' + this.players[i].name);
				}
			}
		}

		//MazeGL.addPlayers();
	}



}

function parseMaze (map) {
	// body...
	// console.log('I got the map' + JSON.stringify(map));
	// var maze = new MazeGL();
	MazeGL.init({maze: map})
}


function isActive(){
	return MazeGL.started;
}


var MazeGL = {

	/**
	 * Initialize
	 */

	started : false,
	exec_id : undefined,
	obstacles : new Array(),
	map_loaded : false,
	oldMaze : undefined,

	prepare: function () {
		this.players = new Object();
		this.map = new t.Object3D();

		// We need a scene
		this.scene = new t.Scene();
		this.scene.fog = new t.FogExp2(0x000000, 0.05);
		// this.scene.fog = new t.FogExp2(0xFFFFFF, 0.005);

		// A camera
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.camera = new t.PerspectiveCamera(75, this.width/this.height, 0.001, 1000);
		// And a renderer

		this.renderer = new t.WebGLRenderer();
		this.renderer.setClearColor(new t.Color(0x000000));
		// this.renderer.setClearColor(new t.Color(0x123466));
		this.renderer.setSize(this.width, this.height);
		// this.renderer.setSize(window.innerWidth, window.innerHeight);
		// this.renderer.shadowMapEnabled = true;
		// this.renderer.shadowMapSoft = true;

		// this.renderer.shadowCameraNear = 3;
		// this.renderer.shadowCameraFar = this.camera.far;
		// this.renderer.shadowCameraFov = 50;

		// this.renderer.shadowMapBias = 0.0039;
		// this.renderer.shadowMapDarkness = 0.5;
		// this.renderer.shadowMapWidth = 1024;
		// this.renderer.shadowMapHeight = 1024;
		document.body.appendChild(this.renderer.domElement);
	},

	init : function ( config ) {
		if( !this.started ){
			this.controls, this.time = Date.now();

			this.started = true;
			this.config = config
			this.objects = new Object()
			this.lastPos = new Object()
			this.players = new Object()

			// HTML elements to display information
			this.infoElement = document.getElementById( 'info-tab' )
			this.playerElement = document.getElementById( 'info-player' )
			this.notifyElement = document.getElementById( 'notification' )
			this.notifyMessage = document.getElementById( 'notification-message' )
			// COLISOES

			this.rays = [
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(-1, 0, 0) 
        	];
			this.caster = new t.Raycaster();



			this.attachEvents()
			this.addObjects()
			this.setLights()
			
			this.lockMouse()
			
			this.setUpControls()
			this.parseMaze()
			this.hideHTML()
			//this.render();

			this.start()

		} else {
			this.oldMaze = this.config.maze;
			this.config = config;
			this.parseMaze();

		}
		this.notifyElement.style.display = 'none';
		this.controls.statusControls( true );

		
		

	},

	hideHTML: function () {
		$('#absoluteCenter').hide();
	},

	attachEvents: function (){
		var self = MazeGL
		window.addEventListener( 'resize', self.onWindowResize, false )
		window.addEventListener( 'keypress', self.showInfo, false )
		window.addEventListener( 'keyup', self.hideInfo, false )

		// $('body').live('keydown', self.showInfo) 

	},

	showInfo: function (evt) {
		var keyCode = evt.keyCode || evt.which,
			self = MazeGL; 

		if (keyCode == 9) {
			self.infoElement.style.display = 'inline';
			evt.preventDefault(); 
		} 
	},

	hideInfo: function (evt) {
		var keyCode = evt.keyCode || evt.which,
			self = MazeGL; 

		if (keyCode == 9) {
			self.infoElement.style.display = 'none';
			evt.preventDefault(); 
		} 
	},

	/*addPlayers: function () {
		var self = MazeGL
		var players = Players.players;

		console.log('addPlayers() {');
		for (var i = players.length - 1; i >= 0; i--) {
			console.log(players[i].name)
			var tmp = drawPlayers(players[i]);
			self.scene.add(tmp);
		};
		console.log('}');
	},*/


	addPlayer : function (player) {
		var self = MazeGL;

		self.scene.add(player);

	},

	removePlayer : function (player) {
		var self = MazeGL;

		self.scene.remove(player);
	},

	addObjects : function () {
		var self = MazeGL


		// self.objects.ceiling = drawCeiling()
		// self.scene.add(self.objects.ceiling);
		// Now let's add a cube.
		// dim = {x: 30, y: 30, z: 30}, pos = {x: 70, y: 130, z: 0}
		// self.objects.cube1 = myCube(dim, pos, 'meme.jpg')
		// self.scene.add(self.objects.cube1)
		// // And another cube.
		// dim = {x: 30, y: 30, z: 30}, pos = {x: -50, y: 130, z: 10}
		// self.objects.cube2 = myCube(dim, pos, 'trololo.jpg')
		// self.scene.add(self.objects.cube2)
		// // And another cube.
		// dim = {x: 30, y: 30, z: 30}, pos = {x: 10, y: 100, z: -13}
		// self.objects.cube3 = myCube(dim, pos, 'wall-1.jpg')
		// self.scene.add(self.objects.cube3);
		
		// axes = buildAxes( 1000 );
		// self.scene.add( axes );
	},

	setLights : function () {
		this.directionalLight1 = new t.DirectionalLight( 0xF7EFBE, 0.9 )
		this.directionalLight1.position.set( 0.5, 0.5, 0.5 )
		this.scene.add( this.directionalLight1 )

		// this.spotLight = new THREE.SpotLight( 0xffffff );
		// this.spotLight.position.set( 100, 1000, 100 );

		// // this.spotLight.castShadow = true;

		// // this.spotLight.shadowMapWidth = 1024;
		// // this.spotLight.shadowMapHeight = 1024;

		// // this.spotLight.shadowCameraNear = 500;
		// // this.spotLight.shadowCameraFar = 4000;
		// // this.spotLight.shadowCameraFov = 30;

		// this.scene.add( this.spotLight );
		this.directionalLight2 = new t.DirectionalLight( 0xF7EFBE, 0.8 )
		this.directionalLight2.position.set( -0.5, -1, -0.5 )
		this.scene.add( this.directionalLight2 );

		this.directionalLight3 = new t.DirectionalLight( 0xF7EFBE, 0.4 )
		this.directionalLight3.position.set( 0, 2, 2.5 )
		this.scene.add( this.directionalLight3 )
	},

	parseMaze: function () {
		var self = MazeGL,
			maze = self.config.maze,
			cols = maze[0].length,
			rows = maze.length,
			half_z = rows / 2,
			half_x = cols / 2;

		/* reset do mapa */
		if ( self.map_loaded ) { 
			self.scene.remove( self.map );
			this.obstacles.length = 0;	
			self.map = new t.Object3D();

		} else {
			self.map_loaded = true;
		}
		/////////////////////////////////////////////////////////

		self.objects.floor = myFloor(cols, rows)
		self.scene.add(self.objects.floor);
		dim = {x: 10, y: 20, z: 10};
		for (var j = 0; j < cols; j++) {
			for (var i = 0; i < rows; i++) {
				// console.log(i + ' ' + j + 'ble -> ' + maze[i][j]);
				if(maze[j][i] == 0) {
					// console.log('nothing here')
				} else if(maze[j][i] == 1) {
					// pos = {x: i * dim.x - half_x * dim.x, y: dim.y/2, z: j * dim.z - half_z * dim.z};
					pos = {x: i * dim.x, y: dim.y/2, z: j * dim.z};
					cube = myCube(dim, pos, 'wall-1.jpg');
					self.map.add(cube);
					this.obstacles.push(cube);
				}else if( maze[j][i] == 2){
					//this.controls.getObject().position.set( -(j * dim.x + dim.x / 2), dim.y/2, -(i * dim.z + dim.z / 2)); ao contario 
					this.controls.getObject().position.set( -(i * dim.z + dim.z / 2), dim.y/2,  -(j * dim.x + dim.x / 2));
					//self.camera.position.x = i * dim.x - half_x * dim.x;
					//self.camera.position.y = dim.y/2 ;
					//self.camera.position.z = j * dim.z - half_z * dim.z; 
				} else if( maze[j][i] == 3) {
					// Saida
					pos = {x: i * dim.x + 5, y: 10, z: j * dim.z + 5};

					self.objects.sphere = drawSphere();

					self.objects.sphere.position = pos;

					self.map.add(self.objects.sphere);
					// self.map.add(drawExit(pos));
					// pos = {x: i * dim.x, y: dim.y/2, z: j * dim.z};
					// cube = myCube(dim, pos, 'wall-1.jpg');
					// self.map.add(cube);
				}
			}
		}
		self.map.applyMatrix( new THREE.Matrix4().makeRotationY( - Math.PI ) );
		self.scene.add(self.map)
	},

	detectIntersection : function(self){
		var collisions, i,
			// Maximum distance from the origin before we consider collision
			distance = 3;
			// Get the obstacles array from our world

		////////////// implementação das 4 direcçoes tendo em conta a direcçao do jogador . 


		//var cref = jQuery.extend(true, {}, self.controls);

		//var cref = clone(self.controls);

		//cref.update( Date.now() - self.time );





		var vector = new THREE.Vector3( 0, 0, -1 );	

		//vector = vector.applyEuler( cref.getObject().rotation, cref.getObject().eulerOrder );
		vector = vector.applyEuler( self.controls.getObject().rotation, self.controls.getObject().eulerOrder );  // aplica transformação da camara no vector , assim obtemos o vector para onde a camara está apontando. 
		//vector = Quaternion.Euler(self.controls.getObject().rotation.x, -45,self.controls.getObject().rotation.z ) * vector;
		//vector.x = - vector.x;
		//vector.z = - vector.z;
		var tempR;
		//console.log("direction x:" + vector.x + " y:" + vector.y + " z:" + vector.z);
		var direction;
		if(vector.x >= 0 && vector.z < 0){
			direction = 0;
			tempR = [
				new THREE.Vector3(vector.x, 0, vector.z),
                new THREE.Vector3(vector.z, 0, -vector.x),
                new THREE.Vector3(-vector.x, 0, -vector.z),
                new THREE.Vector3(-vector.z, 0, vector.x) 
       		];
		}else if( vector.x >= 0 && vector.z >= 0 )
		{
			direction = 1;
			tempR = [
				new THREE.Vector3(vector.x, 0, vector.z),
                new THREE.Vector3(-vector.z, 0, vector.x),
                new THREE.Vector3(-vector.x, 0, -vector.z),
                new THREE.Vector3(vector.z, 0, -vector.x) 
       		];
		}else if( vector.x < 0 && vector.z >= 0 )
		{
			direction = 2;
			tempR = [
				new THREE.Vector3(vector.x, 0, vector.z),
                new THREE.Vector3(vector.z, 0, -vector.x),
                new THREE.Vector3(-vector.x, 0, -vector.z),
                new THREE.Vector3(-vector.z, 0, vector.x) 
       		];
		}else{
			direction = 3;
			tempR = [
				new THREE.Vector3(vector.x, 0, vector.z),
                new THREE.Vector3(-vector.z, 0, vector.x),
                new THREE.Vector3(-vector.x, 0, -vector.z),
                new THREE.Vector3(vector.z, 0, -vector.x) 
       		];
		}
		//tempR.push([vector.x,0,vector.z]);
		//tempR.push([-vector.x,0,vector.z]);
		//tempR.push([vector.x,0,-vector.z]);
		//tempR.push([-vector.x,0,-vector.z]);


		//tempR.push(vector.toArray());
		// For each ray
		for (i = 0; i < tempR.length; i += 1) {  // this.rays
			// We reset the raycaster to this direction
			this.caster.set(this.controls.getObject().position, tempR[i]); // this.rays[i]
			//this.caster.set(cref.getObject().position, tempR[i]); // this.rays[i]
			// Test if we intersect with any obstacle mesh
			collisions = this.caster.intersectObjects(this.obstacles);
			// And disable that direction if we do
			
			if (collisions.length > 0){

				/*if(i == 1){
					for(var j = 0 ; j < collisions.length ; j++){
						console.log('distance from right ' + j + " " + collisions[j].distance);
					}
					
				}else if( i == 3){
					console.log('distance from left ' + collisions[0].distance);
				}else if( i == 0){
					console.log('distance from front ' + collisions[0].distance);
				}*/
				
				if(collisions[0].distance <= distance){
					//self.controls.reverseMove1 ( true );
					//self.controls.reverseMove3 ( true );

					//console.log( ' colisao com indice ' + i + ' com x: ' + tempR[i].x + " z:" + tempR[i].z);
					if( (i == 0 && direction == 0) || (i == 0 && direction == 1) || (i == 0 && direction == 2) || (i == 0 && direction == 3)){
						self.controls.reverseMove1 ( true );
						//self.controls.reverseMove4 ( true );
						
					}

					if( ( i == 1 && direction == 0 ) || ( i == 1 && direction == 1) || (i == 1 && direction == 2) || (i == 1 && direction == 3)){
						//self.controls.reverseMove4 ( true );
						self.controls.reverseMove2 ( true );
					}

					if ( (i == 2 && direction == 0) || (i == 2 && direction == 1) || (i == 2 && direction == 2) || (i == 2 && direction == 3) ){
						//self.controls.reverseMove4 ( true );
						//self.controls.reverseMove2 ( true );
						self.controls.reverseMove3 ( true );



					}

					if( (i == 3 && direction == 0) || (i == 3 && direction == 1) || ( i == 3 && direction == 2) || (i == 3 && direction == 3) ){
						//self.controls.reverseMove3 ( true );
						//self.controls.reverseMove1 ( true );
						self.controls.reverseMove4 ( true );

					}
					/*if ( i == 0 ){
						if(tempR[i].x >= 0)
						{
							
							self.controls.reverseMove3 ( true );
						}else{
							self.controls.reverseMove4 ( true );
							
						}

						if(tempR[i].z >= 0){
							
							self.controls.reverseMove2 ( true );
						}else{
							self.controls.reverseMove1 ( true );
							
						}
					}else if( i == 1){
						if(tempR[i].x >= 0)
						{
							
							self.controls.reverseMove3 ( true );
						}else{
							self.controls.reverseMove4 ( true );
							
						}

						if(tempR[i].z >= 0){
							
							self.controls.reverseMove2 ( true );
						}else{
							self.controls.reverseMove1 ( true );
							
						}
					}else if(i == 2){

					}else{

					}*/
					/*if(tempR[i].x >= 0)
					{
						console.log('bloqueio +x');
						self.controls.reverseMove3 ( true );
					}else{
						self.controls.reverseMove4 ( true );
						console.log('bloqueio -x');
					}

					if(tempR[i].z >= 0){
						console.log('bloqueio +z');
						self.controls.reverseMove2 ( true );
					}else{
						self.controls.reverseMove1 ( true );
						console.log('bloqueio -z');
					}*/

					
				}else{
					if( i == 0){
						self.controls.freeForward();
					}else if( i == 1){
						self.controls.freeLeft();
					}else if(i == 2){
						self.controls.freeBackward();
					}else{
						self.controls.freeRight();
					}
				}
			} 
				// console.log('COLIDIU com distancia ' + collisions[0].distance);
				
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
			
		
		
	},

	setUpControls: function () {
		var self = MazeGL

		self.controls = new t.PointerLockControls( self.camera );
		self.scene.add( self.controls.getObject() );


		// // Camera moves with mouse, flies around with WASD/arrow keys
		// self.controls = new t.FirstPersonControls(this.camera); // Handles camera control
		// self.controls.movementSpeed = 25; // How fast the player can walk around
		// self.controls.lookSpeed = 0.075; // How fast the player can look around with the mouse
		// self.controls.lookVertical = false; // Don't allow the player to look up or down. This is a temporary fix to keep people from flying
		// self.controls.noFly = true; // Don't allow hitting R or F to go up or down
		// self.scene.add( self.controls );
	},

	pointerlockchange : function ( event ) {
		var self = MazeGL,
			element = self.element

		if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

			self.controls.enabled = true;

			self.playerElement.style.display = 'inline';
			self.blocker.style.display = 'none';

		} else {
			self.controls.enabled = false;

			self.blocker.style.display = '-webkit-box';
			self.blocker.style.display = '-moz-box';
			self.blocker.style.display = 'box';

			self.blocker.style.display = 'inline';
			self.instructions.style.display = 'inline';
			self.playerElement.style.display = 'inline';
			// self.infoElement.style.display = 'inline';

		}
	},

	pointerlockerror : function ( event ) {
		var self = MazeGL
		self.instructions.style.display = 'inline';
		// self.infoElement.style.display = 'inline';
		self.playerElement.style.display = 'inline';
		self.blocker.style.display = 'inline';

	},

	lockMouse: function () {
		var self = MazeGL
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
		var self = MazeGL
		// self.instructions = document.getElementById( 'instructions' )
		$('#blocker').show()
		// $('#instructions').show()
	},

	onWindowResize: function () {
		var self = MazeGL
		self.camera.aspect = window.innerWidth / window.innerHeight;
		self.camera.updateProjectionMatrix();

		self.renderer.setSize( window.innerWidth, window.innerHeight );

	},

	/**
	 * Renders the scene.
	 */
	render : function () {
		
		var self = MazeGL,
			pos = self.controls.getObject().position;
			x = Math.abs(pos.x);
			y = Math.abs(pos.y);
			z = Math.abs(pos.z);

		// self.spotLight.position.set( pos.x + 2, pos.y, pos.z );

		//console.log("processando");
		this.exec_id = window.requestAnimationFrame(self.render); 
		self.controls.isOnObject( false );
		//self.controls.reverseMove1 ( false );
		self.detectIntersection(self)

		// Animations
		// self.objects.cube1.rotation.y += 0.01
		// self.objects.cube2.rotation.x += 0.01
		// self.objects.cube3.rotation.z -= 0.01
		self.objects.sphere.rotation.y += 0.5;

		// update controls 
		self.controls.update( Date.now() - self.time)

		

		// Set the scoreboard.
		var players = Players.players,
			infoHTML = '';

		for (var i = players.length - 1; i >= 0; i--) {
			// console.log(players[i].name)
			infoHTML += players[i].name +
				' <' + parseInt(players[i].coord[0]) + ',' + parseInt(players[i].coord[2]) + '><br>';
			// console.log(players[i]);
		};
		self.infoElement.innerHTML =  infoHTML
	

		// Add player HUD
		playerHTML = 
			get_player_name() + '<br>' +
			'x: ' + parseInt((x)/10.0) + '<br>' +
			'z: ' + parseInt((z)/10.0) + '<br>' +
			'y: ' + parseInt(y);

		self.playerElement.innerHTML = playerHTML;

		// If the position is changed, then update to the server
		if( x != self.lastPos.x || y != self.lastPos.y || z != self.lastPos.z ) {
			
			Players.updatePlayer(get_player_name(), ((x)/10.0), ((y)/10.0), ((z)/10.0), 1);

			sendPosition( ((x)/10.0), ((y)/10.0), ((z)/10.0) );

			self.lastPos.x = x
			self.lastPos.y = y
			self.lastPos.z = z
		}

		// Only render if game has started
		if(self.started) {
			self.renderer.render( self.scene, self.camera );
		}

		self.time = Date.now();
		
	},

	start : function () {
		if (!self.exec_id) {
       		MazeGL.render();
    	}
	},

	stop : function () {
		var self = MazeGL;
		if(self.exec_id){
			// document.body.removeChild(self.renderer.domElement)
			self.infoElement.style.display = 'none';
			self.blocker.style.display = 'none';
			self.playerElement.style.display = 'none';
			self.instructions.style.display = 'none';
			// self.infoElement.style.
			// window.body.removeChild(game.renderer.domElement); //Remove the renderer from the div
			//self.renderer.setSize(0, 0); //I guess this isn't needed, but welp
			window.cancelAnimationFrame(self.exec_id);
			//self.scene.dispose();
			//self.map.dispose();
			//self.scene.remove( self.map );

			//geometry.dispose();
			//texture.dispose();
			//material.dispose();
			//self.players.dispose();
			self.exec_id = undefined;
			self.started = false;
			console.log('webgl stopped');
       		
		}
	}
}

function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

MazeGL.prepare();
