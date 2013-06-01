/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function ( camera ) {

	var scope = this;

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	yawObject.position.y = 10;
	yawObject.add( pitchObject );

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;
	var reverse1 = false;
	var reverse2 = false;
	var reverse3 = false;
	var reverse4 = false;
	var enabled = true;
	var freeR = false;
	var freeL = false;
	var freeF = false;
	var freeB = false;

	var isOnObject = false;
	var canJump = false;

	var velocity = new THREE.Vector3();

	var PI_2 = Math.PI / 2;

	var SPEED = 0.1, // Default 0.12
		SLOWING = 0.20, // Default 0.08
		JUMPSPEED = 6, // Default 10
		JUMPSLOWING = 0.75, // Default 0.25
		JUMPMAX = 140;

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
		//console.log('movimento x: ' + movementX + ' y:' + movementY);
		yawObject.rotation.y -= movementX * 0.002;
		pitchObject.rotation.x -= movementY * 0.002;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

	};

	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true; break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;

			case 32: // space
				if ( canJump === true ) velocity.y += JUMPSPEED;
				canJump = false;
				break;

		}

	};

	var onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // a
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;

		}

	};

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	this.enabled = false;

	this.getObject = function () {

		return yawObject;

	};

	this.isOnObject = function ( boolean ) {

		isOnObject = boolean;
		canJump = boolean;

	};

	this.reverseMove1 = function ( boolean ) {
		reverse1 = boolean;
	};

	this.reverseMove2 = function ( boolean ) {
		reverse2 = boolean;
	};

	this.reverseMove3 = function ( boolean ) {
		reverse3 = boolean;
	};

	this.reverseMove4 = function ( boolean ) {
		reverse4 = boolean;
	};

	this.statusControls = function ( boolean ) {
		enabled = boolean;
	};

	this.freeForward = function () {
		freeF = true;
	};

	this.freeRight = function () {
		freeR = true;
	};

	this.freeBackward = function () {
		freeB = true;
	};

	this.freeLeft = function () {
		freeL = true;
	};

	this.update = function ( delta ) {
		
		if ( scope.enabled === false ) return;

		if( enabled ){
			delta *= 0.1;

			velocity.x += ( - velocity.x ) * SLOWING * delta;
			velocity.z += ( - velocity.z ) *  SLOWING * delta;

			velocity.y -= JUMPSLOWING * delta;

			if ( moveForward && freeF ) velocity.z -= SPEED * delta;
			if ( moveBackward && freeB ) velocity.z += SPEED * delta;

			if ( moveLeft && freeL) velocity.x -= SPEED * delta;
			if ( moveRight && freeR) velocity.x += SPEED * delta;


			//if ( reverse1 && moveForward ) velocity.z += 2 *SPEED * delta;
			//if ( reverse2 && moveBackward ) velocity.z -= 2 *SPEED * delta;
			//if ( reverse3 && moveLeft ) velocity.x += 2 * SPEED * delta;
			//if ( reverse4 && moveRight ) velocity.x -= 2 * SPEED * delta;

			

			if ( isOnObject === true ) {

				velocity.y = Math.max( 0, velocity.y );
				
				
			}

			//if ( ( reverse1 && moveForward ) || ( reverse2 && moveBackward) ) velocity.z = 0;
			//if ( ( reverse3 && moveLeft ) || ( reverse4 && moveRight ) ) velocity.x = 0;

			if( reverse1 || reverse2 || reverse3 || reverse4 ){
				/*if ( moveForward && !freeB && !freeF ) velocity.z = 0;
				if ( moveBackward && !freeF && !freeB )  velocity.z = 0;
				if ( moveLeft && !freeR  && freeL ) velocity.x = 0;
				if ( moveRight && !freeL && freeR ) velocity.x = 0;*/

				if ( ( reverse1 && !freeB ) || ( reverse3 && !freeF ) ) velocity.z = 0;
				if ( ( reverse2 && !freeL ) || ( reverse4 && !freeR ) ) velocity.x = 0;
			}
			reverse1 = false;
			reverse2 = false;
			reverse3 = false;
			reverse4 = false;
			freeR = false;
			freeF = false;
			freeL = false;
			freeB = false;
			

			yawObject.translateX( velocity.x );
			yawObject.translateY( velocity.y ); 
			yawObject.translateZ( velocity.z );

			if ( yawObject.position.y < 10 ) {

				velocity.y = 0;
				yawObject.position.y = 10;

				canJump = true;

			} 

			if ( yawObject.position.y > JUMPMAX ) {
				
				velocity.y = 0;
				yawObject.position.y = JUMPMAX;

			} 
		}

	};

};
