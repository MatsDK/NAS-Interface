const newDirContainer = document.querySelector(".newDirContainer"),
  uploadContainer = document.querySelector(".uploadContainer"),
  dimmedOverlay = document.querySelector(".dimmedOverlay"),
  newDirInput = newDirContainer.querySelector(".newDirName"),
  sideBar = document.querySelector(".sideBar"),
  sideBarInner = document.querySelector(".sideBarInner");

const openUploadContainer = () => {
  dimmedOverlay.classList.toggle("hidden");
  uploadContainer.classList.toggle("hidden");
};

const toggleSidebar = () => {
  if (sideBar.classList.contains("active")) closeSideBar();
  else openSideBar();
};

dimmedOverlay.addEventListener("click", () => {
  newDirContainer.classList.add("hidden");
  uploadContainer.classList.add("hidden");
  dimmedOverlay.classList.toggle("hidden");
  resetContainers();
});

const openNewDirContainer = () => {
  newDirInput.focus();
  dimmedOverlay.classList.toggle("hidden");
  newDirContainer.classList.toggle("hidden");
};

const closeContainers = () => {
  newDirContainer.classList.add("hidden");
  uploadContainer.classList.add("hidden");
  dimmedOverlay.classList.add("hidden");
  resetContainers();
};

const resetContainers = () => {
  filesCount.classList.add("hidden");
  clearUploadInputBtn.classList.add("hidden");

  selectedFiles = [];
  dropZoneInp.value = null;
  fileInp.value = null;
  dropZone.classList.remove("invisible");
  filesList.classList.add("invisible");
};

const selection = Selection.create({
  class: "selector",
  boundaries: [".bottomFiles"],
  selectables: [".dataItem"],
  startareas: [".bottomFilesContainer"],
})
  .on("move", ({ changed: { removed, added } }) => {
    for (const el of added) {
      selectedData.push(dataArr[Number(el.id)]);
      updateSelectAllBtn();
      checkEl(el);
    }

    for (const el of removed) {
      selectedData.forEach((x, i) => {
        if (x.el.id == el.id) selectedData.splice(i, 1);
      });

      updateSelectAllBtn();

      uncheckEl(el);
    }
  })

  .on("start", ({ inst, selected, oe }) => {
    for (const el of selected) {
      uncheckEl(el);
      inst.removeFromSelection(el);
    }
    selectedData = [];
    updateSelectAllBtn();
    inst.clearSelection();
  })
  .on("stop", ({ inst }) => {
    inst.keepSelection();
  });

selection.on("beforestart", ({ inst, selected }) => {
  bottomFilesContainer.addEventListener("click", () => {
    for (const el of selected) {
      updateSelectAllBtn();
      uncheckEl(el);
      inst.removeFromSelection(el);
    }
  });
});

const uncheckEl = (el) => {
  el.querySelector(".inp-cbx").classList.remove("checked");
  el.classList.remove("active");
};

const checkEl = (el) => {
  el.querySelector(".inp-cbx").classList.add("checked");
  el.classList.add("active");
};

const updateSelectAllBtn = () => {
  if (selectedData.length && selectedData.length == dataArr.length)
    checkSelectAllBtn();
  else uncheckSelectAllBtn();
};

const bottomFiles = document.querySelector(".bottomFiles"),
  topFiles = document.querySelector(".topFilesContainer");

bottomFiles.addEventListener("scroll", () => {
  if (bottomFiles.scrollTop != 0) {
    topFiles.classList.add("fade");
  } else {
    topFiles.classList.remove("fade");
  }
});

const closeSideBar = () => {
  sideBarInner.classList.remove("active");
  setTimeout(() => {
    sideBar.classList.remove("active");
  }, 100);
};
const openSideBar = () => {
  sideBar.classList.add("active");
  setTimeout(() => {
    sideBarInner.classList.add("active");
  }, 100);
};
