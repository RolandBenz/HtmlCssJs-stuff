(() => {
    /* 1.0 */
    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.
    const width = 320; // We will scale the photo width to this
    let height = 0; // This will be computed based on the input stream
  
    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.
    let streaming = false;
  
    // The various HTML elements we need to configure or control. These
    // will be set by the startup() function.
    let video = null;
    let canvas = null;
    let photo = null;
    let startbutton = null;

    /* 4.0 Check if App has its own tab, otherwise clear App and add button to get one*/
    function showViewLiveResultButton() {
      if (window.self !== window.top) {
        // Ensure that if our document is in a frame, we get the user
        // to first open it in its own tab or window. Otherwise, it
        // won't be able to request permission for camera access.
        document.querySelector(".contentarea").remove();
        const button = document.createElement("button");
        button.textContent = "View live result of the example code above";
        document.body.append(button);
        button.addEventListener('click', () => window.open(location.href));
        return true;
      }
      return false;
    }
  
    /* 3.0 Start App up if App has its own tab*/ 
    function startup() {
      if (showViewLiveResultButton()) { return; }
      video = document.getElementById('video');
      canvas = document.getElementById('canvas');
      photo = document.getElementById('photo');
      startbutton = document.getElementById('startbutton');
      // start just the webcam, no audio
      navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then((stream) => {
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => {
          console.error(`An error occurred: ${err}`);
        });
      // Event listener for the video
      // Oncanplay sets dimensions of video and canvas
      video.addEventListener('canplay', (ev) => {
        if (!streaming) {
          height = video.videoHeight / (video.videoWidth/width);
          // Firefox currently has a bug where the height can't be read from
          // the video, so we will make assumptions if this happens. 
          if (isNaN(height)) {
            height = width / (4/3);
          }
          video.setAttribute('width', width);
          video.setAttribute('height', height);
          canvas.setAttribute('width', width);
          canvas.setAttribute('height', height);
          streaming = true;
        }
      }, false);
      // Event listener for the button, which is placed over the video, used to take a picture
      // OnClick Calls function takepicture()
      startbutton.addEventListener('click', (ev) => {
        takepicture();
        ev.preventDefault();
      }, false);
      // calls function clearphoto, which fills area with a grey image
      clearphoto();
    }

    /* 6.0 */
    // Fill the photo with an indication that none has been
    // captured.
    function clearphoto() {
      const context = canvas.getContext('2d');
      context.fillStyle = "#AAA";
      context.fillRect(0, 0, canvas.width, canvas.height);
      const data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
    }

    /* 5.0 */
    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it. 
    function takepicture() {
      const context = canvas.getContext('2d');
      if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
        const data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
      } else {
        clearphoto();
      }
    }
  
    /* 2.0 */
    // Set up our event listener to run the startup process
    // once loading is complete.
    window.addEventListener('load', startup, false);
  })();
  



