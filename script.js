const imageLoader = document.getElementById("imageLoader");
imageLoader.addEventListener("change", handleImage, false);
const canvas = document.getElementById("imageCanvas");
const ctx = canvas.getContext("2d");
const messageInput = document.getElementById("message");

const textCanvas = document.getElementById("textCanvas");
const tctx = textCanvas.getContext("2d");

const decodeCanvas = document.getElementById("imageCanvas2");
const dctx = decodeCanvas.getContext("2d");
const imageLoader2 = document.getElementById("imageLoader2");
imageLoader2.addEventListener("change", handleImage2, false);

const alertFailed = document.querySelector('#alert');
const close = document.querySelector('#close');

close.addEventListener('click', () => {
  alertFailed.classList.add('hidden')
})

// Handle upload and encode image
function handleImage(e) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      console.log(img.src)
      if (img.src.includes("image/jpeg") || img.src.includes("image/jpg")) {
        canvas.width = img.width;
        canvas.height = img.height;
        textCanvas.width = img.width;
        textCanvas.height = img.height;
        tctx.font = "30px Arial";
        const messageText = messageInput.value.length
          ? messageInput.value
          : "Hello";
        tctx.fillText(messageText, 10, 50);
        ctx.drawImage(img, 0, 0);
        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let textData = tctx.getImageData(0, 0, canvas.width, canvas.height);
        let pixelsInMsg = 0;
        pixelsOutMsg = 0;
        for (let i = 0; i < textData.data.length; i += 4) {
          if (textData.data[i + 3] !== 0) {
            if (imgData.data[i + 1] % 10 == 7) {
              //do nothing, we're good
            } else if (imgData.data[i + 1] > 247) {
              imgData.data[i + 1] = 247;
            } else {
              while (imgData.data[i + 1] % 10 != 7) {
                imgData.data[i + 1]++;
              }
            }
            pixelsInMsg++;
          } else {
            if (imgData.data[i + 1] % 10 == 7) {
              imgData.data[i + 1]--;
            }
            pixelsOutMsg++;
          }
        }
        console.log("pixels within message borders: " + pixelsInMsg);
        console.log("pixels outside of message borders: " + pixelsOutMsg);
        ctx.putImageData(imgData, 0, 0);
      } else {
        alertFailed.classList.remove("hidden");
        return;
      }
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
}

// Handle upload and decode image
function handleImage2(e) {
  console.log("handle image 2");
  const reader2 = new FileReader();
  reader2.onload = function (event) {
    console.log("reader2 loaded");
    const img2 = new Image();
    img2.onload = function () {
      console.log("img2 loaded");
      decodeCanvas.width = img2.width;
      decodeCanvas.height = img2.height;
      dctx.drawImage(img2, 0, 0);
      let decodeData = dctx.getImageData(
        0,
        0,
        decodeCanvas.width,
        decodeCanvas.height
      );
      for (let i = 0; i < decodeData.data.length; i += 4) {
        if (decodeData.data[i + 1] % 10 == 7) {
          decodeData.data[i] = 0;
          decodeData.data[i + 1] = 0;
          decodeData.data[i + 2] = 0;
          decodeData.data[i + 3] = 255;
        } else {
          decodeData.data[i + 3] = 0;
        }
      }
      dctx.putImageData(decodeData, 0, 0);
    };
    img2.src = event.target.result;
  };
  reader2.readAsDataURL(e.target.files[0]);
}
