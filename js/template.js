var WebVRConfig = { 
	DEFER_INITIALIZATION: true, 
	ROTATE_INSTRUCTIONS_DISABLED: true,
	CARDBOARD_UI_DISABLED: true, 
}	

function getDirectionalLight( _ ) {
	var directionalLight = new THREE.DirectionalLight( _.color, _.intensity );				
	directionalLight.castShadow = _.shadow;
	if( _.x ) {				
		directionalLight.translateX( _.x );
	}
	if( _.y ) {
		directionalLight.translateY( _.y );
	}	
	if( _.z ) {
		directionalLight.translateZ( _.z );
	}	
	return directionalLight;
}

function getAmbientLight( _ ) {
	var ambientLight = new THREE.AmbientLight( _.color, _.intensity );
	return ambientLight;
}

function getSpotLight( _ ) {
	var spotLight = new THREE.SpotLight( _.color, _.intensity );
	if( _.x ) {				
		spotLight.translateX( _.x );
	}
	if( _.y ) {
		spotLight.translateY( _.y );
	}	
	if( _.z ) {
		spotLight.translateZ( _.z );
	}	
	return spotLight;
}

function getPlane( _ ) {
	var planeGeometry = new THREE.PlaneGeometry( _.width, _.height, 10, 10 );    
	planeGeometry.center();
	var planeMaterial = new THREE.MeshBasicMaterial( { 
		color: _.color, 
		side: THREE.DoubleSide,
	} );		
	if( _.imageUrl ) {
		planeMaterial.map = THREE.ImageUtils.loadTexture( _.imageUrl );
	}		
	var planeMesh = new THREE.Mesh( planeGeometry, planeMaterial );
	if(_.receiveShadow) {
		planeMesh.receiveShadow = _.receiveShadow;				
	}				
	if( _.x ) {				
		planeMesh.translateX( _.x );
	}
	if( _.y ) {
		planeMesh.translateY( _.y );
	}	
	if( _.z ) {
		planeMesh.translateZ( _.z );
	}	
	if( _.layout == 'flat' ) {
		planeMesh.rotateX( deg( 90 ) );
	}
	if( _.name ) {
		planeMesh.name = _.name;
	}			
	return planeMesh; 
}

function getBox( _ ) {
	var boxGeometry = new THREE.BoxGeometry( _.width, _.height, _.depth );
	boxGeometry.center();
	var boxMaterial = new THREE.MeshPhongMaterial( {
		color: _.color,//new THREE.Color( "rgb(" + Math.floor( rand( 0, 255 ) ) + ", " + Math.floor( rand( 0, 255 ) ) + ", " + Math.floor( rand( 0, 255 ) ) + ")" ),
	});
	if( _.imageUrl ) {
		boxMaterial.map = THREE.ImageUtils.loadTexture( _.imageUrl );
	}	
	var boxMesh = new THREE.Mesh( boxGeometry, boxMaterial );
	boxMesh.receiveShadow = true;
	if( _.x ) {				
		boxMesh.translateX( _.x );
	}
	if( _.y ) {
		boxMesh.translateY( _.y );
	}	
	if( _.z ) {
		boxMesh.translateZ( _.z );
	}
	return boxMesh;
}

function getTree( _ ) {
	var tree = new THREE.Tree( {
		generations: _.generations,
		length : _.length,
		uvLength : _.uvLength,
		radius : _.radius,
		radiusSegments : _.radiusSegments,
		heightSegments : _.heightSegments,
	});

	var geometry = THREE.TreeGeometry.build( tree );

	var material = new THREE.MeshPhongMaterial( [

	]);
	if( _.map ) {
		material.map = THREE.ImageUtils.loadTexture( _.map );
	}	

	var mesh = new THREE.Mesh(
		geometry,
		new THREE.MeshPhongMaterial({
			color : _.color,
		})
	);

	if( _.x ) {				
		mesh.translateX( _.x );
	}
	if( _.y ) {
		mesh.translateY( _.y );
	}	
	if( _.z ) {
		mesh.translateZ( _.z );
	}

	return mesh;
}

function rendering( _ ) {
	this.position = _.position,
	this.width =_.width, 
	this.height = _.height,
	this.depth = _.depth, 
	this.url = _.url,
	this.receiveShadow = true;
	this.tweenTree = []; 
}

function addMusic() {
	music = document.createElement( 'audio' );
	music.src = 'media/Eric_Clapton_-_Tears_In_Heaven.mp3';
	music.type = "audio/mpeg";
	music.autoplay = true;
	music.volume = .2;
	//music.controls = true;
	music.loop = true;
	document.body.appendChild( music );
}

function deg( degree ) { 
	return degree * ( Math.PI / 180 ); 
}

function rand( min, max ) {
	return Math.random() * max + min;
}

function randColor() {
	return Math.floor(Math.random()*16777215).toString(16);
}

function padLeft( number, size ) {
	return ("00000" + number).slice(-'00000'.length);
}

window.onload = function() {
	window.addEventListener( 'resize', onWindowResize, false );

	//All these need work for custom controls
	//window.addEventListener( 'mousedown', function( event ) {}, false );
	//window.addEventListener( 'mousemove', onMouseMove, false );
	//window.addEventListener( 'mouseup', onMouseUp, false );

	//window.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); 

	//window.addEventListener( 'touchstart', function( event ) {}, false );
	//window.addEventListener( 'touchmove', onTouchMove, false );
	//window.addEventListener( 'touchend', onTouchEnd, false );
	//window.addEventListener( 'orientationchange', onOrientationChange, false );

	//window.addEventListener( 'keydown', onKeyDown, false );

	var head;
	var ground;
	function startAnimation( delta ) {								
		stepAnimation( delta );
		effect.requestAnimationFrame( startAnimation );				
	}


	function stopAnimation() {				
	}

	function stepAnimation( delta ) {
		orbitControls.update();
		vrControls.update();

		//FUN CODE HERE
		if( animateScene ) {
			animateScene( delta );
		}

		orbitPos = camera.position.clone();
		
		var rotatedPosition = fakeCamera.position.applyQuaternion( camera.quaternion );
		camera.position.add( rotatedPosition );
		camera.quaternion.multiply( fakeCamera.quaternion );  		

		effect.render( scene, camera );

		camera.position.copy( orbitPos );
	}

	function onWindowResize( event ){
		if( vrButton !== undefined ) {
			vrButton.style.left = window.innerWidth / 2 - 32 + 'px'; //Needs work
			//vrButton.style.top = window.innerHeight - 58 + 'px'; //Needs work
		}

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		//renderer.setViewport( 0, 0 , window.innerWidth, window.innerHeight );

		renderer.setSize( window.innerWidth, window.innerHeight );
		effect.setSize( window.innerWidth, window.innerHeight );

		renderer.render( scene, camera );
		effect.render( scene, camera );
	}
	
	InitializeWebVRPolyfill();

	mainCanvas = document.createElement( 'canvas' );
	mainCanvas.style.top = 0;
	mainCanvas.style.left = 0;
	mainCanvas.width = window.innerWidth;
	mainCanvas.height = window.innerHeight;

	renderer = new THREE.WebGLRenderer({ canvas:mainCanvas, antilias: true, alpha: true, clearAlpha: 1});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor( 0x000000, 1 );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.renderReverseSided = true;
	renderer.sortObjects = false;

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 10000 );
	camera.translateY( 100 );
	camera.translateZ( -500 );

	orbitControls = new THREE.OrbitControls( camera );
	orbitControls.zoomSpeed = .25;
	orbitControls.rotateSpeed = .001;
	orbitControls.keyPanSpeed = .001;
	orbitControls.target = new THREE.Vector3( 0, 0, 10000 );

	fakeCamera = new THREE.Object3D();
	vrControls = new THREE.VRControls( fakeCamera );

	effect = new THREE.VREffect( renderer );
	if ( WEBVR.isAvailable() === true ) {
		vrButton = WEBVR.getButton( effect );
		document.body.appendChild( vrButton );
	}

	scene = new THREE.Scene();
	clock = new THREE.Clock( false );

	if( drawScene ) {
		drawScene( scene );
	}
	
	clock.start();
	startAnimation();
}