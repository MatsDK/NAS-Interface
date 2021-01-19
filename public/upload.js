const fileInp = document.querySelector(".fileInput");
const submitBtn = document.querySelector(".submitBtn");
const progressWrapper = document.querySelector(".rightProgress");

let selectedFiles = [];

const newDirName = document.querySelector(".newDirName");
const newDirForm = document.querySelector(".newDirForm");

// create directory
newDirForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (CURR_PATH == "&root") CURR_PATH = "/";

  if (newDirName.value.replace(/\s/g, "").length) {
    const name = newDirName.value;

    axios({
      method: "post",
      url: `/createDir`,
      data: { name, path: CURR_PATH },
    }).then((res) => {
      if (res.data != "OK") alert(res.data);
      else window.location = CURR_PATH;
    });
  } else alert("Enter valid name!");
});

const dropZone = document.querySelector(".dropZone");
const filesList = document.querySelector(".filesList");
const dropZoneInp = document.querySelector(".dropZoneInput");
const filesCount = document.querySelector(".filesCount");
const clearUploadInputBtn = document.querySelector(".clearUploadInput");

dropZoneInp.addEventListener("change", (e) => {
  for (let i = 0; i < e.target.files.length; i++) {
    selectedFiles.push(e.target.files[i]);
  }
  showSelectedFiles();
});

fileInp.addEventListener("change", (e) => {
  for (let i = 0; i < e.target.files.length; i++) {
    selectedFiles.push(e.target.files[i]);
  }
  showSelectedFiles();
});

dropZone.addEventListener("dragover", (event) => {
  event.stopPropagation();
  event.preventDefault();
  dropZone.classList.add("active");
  event.dataTransfer.dropEffect = "copy";
});

dropZone.addEventListener("dragleave", (e) => {
  e.stopPropagation();
  e.preventDefault();
  dropZone.classList.remove("active");
});

dropZone.addEventListener("drop", (event) => {
  event.stopPropagation();
  event.preventDefault();
  const fileList = event.dataTransfer.files;
  for (let i = 0; i < fileList.length; i++) {
    selectedFiles.push(fileList[i]);
  }
  showSelectedFiles();
});

const showSelectedFiles = () => {
  if (selectedFiles.length) {
    clearUploadInputBtn.classList.remove("hidden");
    filesCount.classList.remove("hidden");
    filesCount.innerText = `${selectedFiles.length} ${
      selectedFiles.length == 1 ? "item" : "items"
    } selected`;

    dropZone.classList.add("invisible");
    filesList.classList.remove("invisible");
    filesList.innerHTML = [];
    selectedFiles.forEach((file) => {
      const temp = document.querySelector(".uploadListItemTemp"),
        element = temp.content.cloneNode(true),
        nameEl = element.querySelector(".uploadListItemName"),
        sizeEl = element.querySelector(".uploadListItemSize"),
        deleteBtn = element.querySelector(".removeFromUploadListBtn");

      sizeEl.innerText = formatFileSize(file.size);
      nameEl.innerText = file.name;

      deleteBtn.addEventListener("click", () => {
        selectedFiles.forEach((x, i) => {
          if (x == file) selectedFiles.splice(i, 1);
        });
        showSelectedFiles();
      });
      filesList.append(element);
    });
  } else {
    clearUploadInputBtn.classList.add("hidden");
    filesCount.classList.add("hidden");
    dropZone.classList.remove("invisible");
    filesList.classList.add("invisible");
  }
};

function formatFileSize(bytes, decimalPoint) {
  if (bytes == 0) return "0 B";
  var k = 1000,
    dm = decimalPoint || 2,
    sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

const clearUploadInput = () => {
  selectedFiles = [];
  showSelectedFiles();
};

// create file elements
submitBtn.addEventListener("click", () => {
  uploadContainer.classList.add("hidden");
  dimmedOverlay.classList.add("hidden");

  const formData = new FormData();

  // add to form data
  for (let i = 0; i < selectedFiles.length; i++) {
    formData.append("file", selectedFiles[i]);
  }

  // upload with axios post request
  if (CURR_PATH == "/") CURR_PATH = "&root";

  if (formData.getAll("file").length && formData.getAll("file").length <= 100) {
    try {
      axios({
        method: "post",
        url: `/upload/${CURR_PATH}`,
        data: formData,
        onUploadProgress: (progressEvent) => {
          updateProgressBar(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          );
        },
      });
    } catch (err) {
      console.log(err);
    }
  } else alert("select file");
});

const progressBarEl = document.querySelector(".progressBarInner");
const progressEl = document.querySelector(".progressProcent");

const updateProgressBar = (progress) => {
  progressWrapper.classList.add("active");
  progressEl.innerText = progress + "%";
  progressBarEl.style.transform = `scaleX(${progress / 100})`;
  if (progress == 100) {
    setTimeout(() => {
      progressWrapper.classList.remove("active");
    }, 2000);
  }
};

const bottomFilesContainer = document.querySelector(".bottomFilesContainer");

// bottomFilesContainer.addEventListener("dragover", (event) => {
//   event.stopPropagation();
//   event.preventDefault();
//   event.dataTransfer.dropEffect = "copy";
// });

// bottomFilesContainer.addEventListener("dragleave", (e) => {
//   e.stopPropagation();
//   e.preventDefault();
// });

// bottomFilesContainer.addEventListener("drop", (e) => {
//   e.preventDefault();
//   e.stopPropagation();
//   console.log(e.dataTransfer.files);
// });
