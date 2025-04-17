function hasGetUserMedia() {
	return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

if (hasGetUserMedia()) {
	// Good to go!
} else {
	alert('getUserMedia() is not supported by your browser');
}

var selectedCamera = '';

function askForPermission(){
    let constraints = { video : true };
    navigator.mediaDevices.getUserMedia(constraints)
    .then(() => {
        // alert("Permission Granted!");
        populateCameraList();
    })
    .catch(() => {
        alert("TODO: write error message for when camera permisison is denied!");
    });
}


document.addEventListener('DOMContentLoaded', () => {
    askForPermission();

		document.querySelector('#camera-select').onchange = () => {
			// console.log("New selection!")
			let new_selection = document.querySelector('#camera-select').children[
				document.querySelector('#camera-select').selectedIndex
			].value;
			selectedCamera = new_selection;
			console.log(selectedCamera);
			setCamera();
	    };

	//     populateCameraList();
});

function populateCameraList() {
	document.querySelector('#camera-select').innerHTML = '';

	navigator.mediaDevices.enumerateDevices().then((deviceList) => {
		console.log(deviceList);

		selectedCamera = deviceList.filter((x) => x.kind == 'videoinput')[0].deviceId;
		setCamera();

		deviceList.forEach((device) => {
			if (device.kind == 'videoinput') {
				console.log(device.label);
				let item = document.createElement('option');
				// item.setAttribute("value", device.label);
				item.value = device.deviceId;
				item.innerHTML = device.label;
				document.querySelector('#camera-select').appendChild(item);
			}
		});
	});
}

function updateResolutionInfo(video) {
    const resolutionInfo = document.querySelector('#resolution-info');
    resolutionInfo.textContent = `Current Resolution: ${video.videoWidth}×${video.videoHeight} @ ${video.videoWidth * video.videoHeight} pixels`;
}

function setCamera() {
	let constraints = {
		video: {
			deviceId: selectedCamera,
			width: { ideal: 4096 },
			height: { ideal: 2160 },
			frameRate: { ideal: 60 }
		}
	};

	navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
		let video = document.querySelector('#webcam-output');
		video.srcObject = stream;
		video.play();
		
		// Update resolution info when video metadata is loaded
		video.onloadedmetadata = () => {
			updateResolutionInfo(video);
		};
		
		// Update resolution info if it changes (e.g., when switching cameras)
		video.onresize = () => {
			updateResolutionInfo(video);
		};
	}).catch((error) => {
		console.error('Error accessing camera:', error);
		// Fallback to basic constraints if max resolution fails
		constraints = {
			video: {
				deviceId: selectedCamera
			}
		};
		navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
			let video = document.querySelector('#webcam-output');
			video.srcObject = stream;
			video.play();
			
			// Update resolution info when video metadata is loaded
			video.onloadedmetadata = () => {
				updateResolutionInfo(video);
			};
			
			// Update resolution info if it changes
			video.onresize = () => {
				updateResolutionInfo(video);
			};
		});
	});
}
