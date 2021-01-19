const dirPath = document.querySelector(".dirPath"),
  filesContainer = document.querySelector(".files");
let folder = [],
  selectedData = [],
  dataArr = [],
  sideBarTreePath = "/";

const setData = () => {
  if (TREE) {
    displayData();

    const temp = document.querySelector(".arrowTemp");
    let newLocation = "";

    const p = document.createElement("p");
    p.innerText = "My files";
    dirPath.append(p);

    // create path element
    if (CURR_PATH != "/") {
      p.addEventListener("click", () => {
        window.location = "/";
      });
      const arrow = temp.content.cloneNode(true);
      dirPath.append(arrow);
    } else {
      p.setAttribute("class", "currentDir");
    }

    if (CURR_PATH != "/") {
      CURR_PATH.split("&").forEach((dir, i) => {
        if (CURR_PATH.split("&").length - 1 > i) {
          const p = document.createElement("p");
          p.innerText = dir;

          if (CURR_PATH.split("&")[CURR_PATH.split("&").length - 2] != dir) {
            newLocation += `${dir}&`;
            const thisLoc = newLocation;
            p.addEventListener("click", () => {
              window.location = thisLoc;
            });
          } else {
            p.setAttribute("class", "currentDir");
          }
          dirPath.append(p);

          if (CURR_PATH.split("&").length - 2 != i) {
            const arrow = temp.content.cloneNode(true);
            dirPath.append(arrow);
          }
        }
      });
    }
  }
};

const displayData = () => {
  folders = [];
  const filesArr = [];
  if (TREE && TREE.children) {
    TREE.children.forEach((element) => {
      if (element.type == "file") {
        filesArr.push(element);
      } else {
        folders.push(element);
      }
    });
  }

  folders.forEach((folder, i) => {
    createFolderEl(folder, i);
  });

  filesArr.forEach((file, i) => {
    createFileEl(file, i);
  });
};

document.addEventListener("DOMContentLoaded", function () {
  setData();
});

const createFolderEl = (folder, i) => {
  const folderElTemp = document.querySelector(".folderElTemp"),
    folderEl = folderElTemp.content.cloneNode(true),
    dataName = folderEl.querySelector(".dataName"),
    dataSize = folderEl.querySelector(".dataSize"),
    element = folderEl.querySelector(".dataItem"),
    checkbox = folderEl.querySelector(".inputWrapper"),
    checkBoxEl = folderEl.querySelector(".inp-cbx"),
    openMenuBtn = folderEl.querySelector(".menuBtn"),
    dropDownWrapper = folderEl.querySelector(".dropDownMenu"),
    dropDownRenameBtn = dropDownWrapper.querySelector(".itemRenameBtn"),
    dropDownDeleteBtn = dropDownWrapper.querySelector(".itemDeleteBtn"),
    dropDownMoveBtn = dropDownWrapper.querySelector(".itemMoveBtn"),
    dropDownCopyBtn = dropDownWrapper.querySelector(".itemCopyBtn"),
    dropDownDownloadBtn = dropDownWrapper.querySelector(".itemDownloadBtn");

  dataName.innerText = folder.name;
  if (folder.children && folder.children.length) {
    dataSize.innerText = `${folder.children.length} ${
      folder.children.length == 1 ? "item" : "items"
    }, ${folder.size}`;
  } else dataSize.innerText = `0 items, ${folder.size}`;
  element.id = i;
  const dataObj = { el: element, data: folder };
  dataArr.push(dataObj);

  openMenuBtn.addEventListener("click", () => {
    openMenu();
  });
  element.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    openMenu();
  });

  const openMenu = () => {
    if (dropDownWrapper.classList.contains("active")) {
      dropDownWrapper.classList.remove("active");
    } else {
      selectBtn();
      dropDownWrapper.classList.add("active");
    }
  };

  dropDownRenameBtn.addEventListener("click", () => {
    selectBtn();
    renameSelectedFile();
  });

  dropDownDownloadBtn.addEventListener("click", () => {
    selectBtn();
    dowloadAllSelected();
  });

  dropDownDeleteBtn.addEventListener("click", () => {
    selectedData = [dataObj];
    deleteSelectedData();
  });
  dropDownMoveBtn.addEventListener("click", () => {
    selectBtn();
    moveSelected();
  });
  dropDownCopyBtn.addEventListener("click", () => {
    selectBtn();
    copySelected();
  });

  checkbox.addEventListener("click", (e) => {
    toggleSelectBtn(true);
  });
  element.addEventListener("dblclick", () => {
    openFolder();
  });

  dataName.addEventListener("click", () => {
    openFolder();
  });

  element.addEventListener("click", (e) => {
    if (
      !e.target.classList.contains("cbx") &&
      dataName != e.target &&
      !e.target.classList.contains("inputWrapper") &&
      !e.target.classList.contains("dropDownBtn")
    ) {
      toggleSelectBtn(false);
    }
  });

  const openFolder = () => {
    const id = folder.name,
      newPathExt = id;
    window.location += `${newPathExt}&`;
  };

  const toggleSelectBtn = (isCheckBox) => {
    checkBoxEl.classList.toggle("checked");
    if (checkBoxEl.classList.contains("checked")) {
      if (!isCheckBox) uncheckAllOtherSelectedData();
      selectedData.push(dataObj);
      if (selectedData.length == dataArr.length) checkSelectAllBtn();
      element.classList.add("active");
    } else {
      selectedData.forEach((x, i) => {
        if (x.data == folder) selectedData.splice(i, 1);
      });
      if (selectedData.length != dataArr.length) uncheckSelectAllBtn();
      element.classList.remove("active");
    }
  };

  const selectBtn = () => {
    closeDropDowns();
    uncheckAllOtherSelectedData();
    selectedData = [dataObj];
    element.classList.add("active");
    checkBoxEl.classList.add("checked");
  };
  filesContainer.append(folderEl);
};

const createFileEl = (file, i) => {
  const folderElTemp = document.querySelector(".fileElTemp"),
    folderEl = folderElTemp.content.cloneNode(true),
    dataName = folderEl.querySelector(".dataName"),
    dataSize = folderEl.querySelector(".dataSize"),
    element = folderEl.querySelector(".dataItem"),
    checkbox = folderEl.querySelector(".inputWrapper"),
    checkBoxEl = folderEl.querySelector(".inp-cbx"),
    openMenuBtn = folderEl.querySelector(".menuBtn"),
    dropDownWrapper = folderEl.querySelector(".dropDownMenu"),
    dropDownRenameBtn = dropDownWrapper.querySelector(".itemRenameBtn"),
    dropDownDeleteBtn = dropDownWrapper.querySelector(".itemDeleteBtn"),
    dropDownMoveBtn = dropDownWrapper.querySelector(".itemMoveBtn"),
    dropDownCopyBtn = dropDownWrapper.querySelector(".itemCopyBtn"),
    dropDownDownloadBtn = dropDownWrapper.querySelector(".itemDownloadBtn");

  dataName.innerText = file.name.split("$")[file.name.split("$").length - 1];
  dataSize.innerText = file.size;
  element.id = folders.length + i;
  const dataObj = { el: element, data: file };
  dataArr.push(dataObj);

  openMenuBtn.addEventListener("click", () => {
    openMenu();
  });

  element.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    openMenu();
  });

  const openMenu = () => {
    if (dropDownWrapper.classList.contains("active")) {
      dropDownWrapper.classList.remove("active");
    } else {
      selectBtn();
      dropDownWrapper.classList.add("active");
    }
  };

  dropDownRenameBtn.addEventListener("click", () => {
    selectBtn();
    renameSelectedFile();
  });

  dropDownDownloadBtn.addEventListener("click", () => {
    selectBtn();
    dowloadAllSelected();
  });

  dropDownMoveBtn.addEventListener("click", () => {
    selectBtn();
    moveSelected();
  });
  dropDownCopyBtn.addEventListener("click", () => {
    selectBtn();
    copySelected();
  });

  dropDownDeleteBtn.addEventListener("click", () => {
    selectedData = [dataObj];
    deleteSelectedData();
  });

  checkbox.addEventListener("click", (e) => {
    toggleSelectBtn(true);
  });

  element.addEventListener("click", (e) => {
    if (
      !e.target.classList.contains("cbx") &&
      dataName != e.target &&
      !e.target.classList.contains("inputWrapper") &&
      !e.target.classList.contains("dropDownBtn")
    ) {
      toggleSelectBtn(false);
    }
  });

  const toggleSelectBtn = (isCheckBox) => {
    checkBoxEl.classList.toggle("checked");
    if (checkBoxEl.classList.contains("checked")) {
      if (!isCheckBox) uncheckAllOtherSelectedData();
      selectedData.push(dataObj);
      if (selectedData.length == dataArr.length) checkSelectAllBtn();
      element.classList.add("active");
    } else {
      selectedData.forEach((x, i) => {
        if (x.data == file) selectedData.splice(i, 1);
      });
      if (selectedData.length != dataArr.length) uncheckSelectAllBtn();

      element.classList.remove("active");
    }
  };

  const selectBtn = () => {
    closeDropDowns();
    uncheckAllOtherSelectedData();
    selectedData = [dataObj];
    element.classList.add("active");
    checkBoxEl.classList.add("checked");
  };
  filesContainer.append(folderEl);
};

const panelContainer = document.querySelector(".cbx"),
  selectAllDataBtn = document.querySelector(".inp-cbx"),
  inputWrapperAllBtn = document.querySelector(".dataHeader .inputWrapper");

panelContainer.addEventListener("click", () => {
  selectAllDataBtn.classList.toggle("checked");

  if (selectAllDataBtn.classList.contains("checked")) {
    selectedData = [];
    inputWrapperAllBtn.classList.add("active");
    dataArr.forEach((x) => {
      x.el.classList.add("active");
      x.el.querySelector(".inp-cbx").classList.add("checked");
      selectedData.push(x);
    });
  } else {
    uncheckAllOtherSelectedData();
  }
});

bottomFilesContainer.addEventListener("click", () => {
  uncheckAllOtherSelectedData();
});

const uncheckSelectAllBtn = () => {
  selectAllDataBtn.classList.remove("checked");
  inputWrapperAllBtn.classList.remove("active");
};

const checkSelectAllBtn = () => {
  selectAllDataBtn.classList.add("checked");
  inputWrapperAllBtn.classList.add("active");
};

const uncheckAllOtherSelectedData = () => {
  uncheckSelectAllBtn();
  selectedData.forEach((x) => {
    x.el.classList.remove("active");
    selectedData = [];
    x.el.querySelector(".inp-cbx").classList.remove("checked");
  });
};

const dowloadAllSelected = () => {
  if (
    selectedData &&
    selectedData.length &&
    ((selectedData.length && selectedData.length > 1) ||
      (selectedData[0].data.type == "directory" && selectedData.length == 1))
  ) {
    let newLocation;
    if (CURR_PATH == "/") CURR_PATH = "&root";
    if (selectedData[0].data.type == "directory" && selectedData.length == 1) {
      newLocation = `zipdownload/${CURR_PATH}/directory@${selectedData[0].data.name}`;
      window.location = newLocation;
      return;
    }
    newLocation = `zipdownload/${CURR_PATH}/`;
    selectedData.forEach((x) => {
      newLocation += `${x.data.type}@${x.data.name}&`;
    });
    window.location = newLocation;
  } else if (selectedData.length && selectedData.length == 1) {
    if (CURR_PATH == "/" && selectedData[0].data.type != "directory")
      window.location = `/download/${selectedData[0].data.name}`;
    else {
      if (CURR_PATH == "/" || CURR_PATH == "&root") CURR_PATH = "";
      window.location = `/download/${CURR_PATH}${selectedData[0].data.name}`;
    }
  }
};

const renameSelectedFile = () => {
  if (selectedData.length == 1) {
    selectedData[0].el.classList.add("active");
    const renameForm = selectedData[0].el.querySelector(".renameForm"),
      renameInput = selectedData[0].el.querySelector(".renameInput"),
      dataNameEl = selectedData[0].el.querySelector(".dataName");
    renameInput.value = null;
    renameInput.focus();
    renameForm.classList.remove("hidden");

    if (selectedData[0].data.type == "file") {
      selectedData[0].data.name
        .split("$")
        [selectedData[0].data.name.split("$").length - 1].split(".")
        .forEach((x, i) => {
          if (selectedData[0].data.name.split(".").length - 1 > i)
            renameInput.value += x;
        });
    } else {
      renameInput.value = selectedData[0].data.name.split("$")[
        selectedData[0].data.name.split("$").length - 1
      ];
    }

    renameInput.select();
    if (dataNameEl.getBoundingClientRect().width > 500)
      renameForm.style.width = `${
        dataNameEl.getBoundingClientRect().width + 20
      }px`;

    const thisItem = selectedData[0];
    renameForm.addEventListener("submit", (e) => {
      let newName = renameInput.value;
      e.preventDefault();
      if (thisItem.data.type == "file") {
        newName = renameInput.value + "." + thisItem.data.extension;
      }

      if (renameInput.value.replace(/\s/g, "").length) {
        if (CURR_PATH == "/") CURR_PATH = "";
        axios({
          method: "post",
          url: "/rename",
          data: {
            path: CURR_PATH,
            srcName: thisItem.data.name,
            newName: newName,
            isFile: thisItem.data.type == "file",
          },
        }).then((res) => {
          if (res.data == "OK") window.location = CURR_PATH;
        });
      }
    });
  } else alert("invalid selection");
};

const deleteSelectedData = () => {
  if (selectedData.length) {
    if (CURR_PATH == "/" || CURR_PATH == "&root") CURR_PATH = "";
    const deletedPaths = [];
    selectedData.forEach((x) => {
      deletedPaths.push(`${x.data.type}#${CURR_PATH}${x.data.name}`);
    });

    axios({
      method: "post",
      url: `/delete`,
      data: deletedPaths,
    }).then((res) => {
      if (res.status == 200) window.location = CURR_PATH;
    });
  }
};

document.addEventListener("click", (e) => {
  if (
    !e.target.classList.contains("renameBtn") &&
    !e.target.classList.contains("renameInput") &&
    !e.target.classList.contains("dropDownBtn")
  )
    document.querySelectorAll(".renameForm").forEach((x) => {
      x.classList.add("hidden");
    });
});

document.addEventListener("click", (e) => {
  if (
    !e.target.classList.contains("menuBtn") &&
    !e.target.classList.contains("dropDownBtn")
  ) {
    closeDropDowns();
  }
});

const closeDropDowns = () => {
  const dropDowns = document.querySelectorAll(".dropDownMenu");
  dropDowns.forEach((x) => {
    x.classList.remove("active");
  });
};

const sideBarTitle = document.querySelector(".sideBarHeaderTitle");
const copyBtn = document.querySelector(".sideBarCopyBtn");
const moveBtn = document.querySelector(".sideBarMoveBtn");

copyBtn.addEventListener("click", () => {
  sendCopyReq();
});
moveBtn.addEventListener("click", () => {
  sendMoveReq();
});

const copySelected = () => {
  copyBtn.classList.remove("hidden");
  moveBtn.classList.add("hidden");
  sideBarTitle.innerText = "Copy to";
  openSideBar();
};

const sendCopyReq = () => {
  const paths = getSelectedDataPaths();
  if (paths && paths.length) {
    if (sideBarTreePath == "/") sideBarTreePath = "";

    axios({
      method: "post",
      url: "/copyData",
      data: { paths: paths, dest: sideBarTreePath },
      onUploadProgress: (progressEvent) => {
        updateProgressBar(
          Math.round((progressEvent.loaded * 100) / progressEvent.total)
        );
      },
    }).then((res) => {
      // if (res.status == 200) window.location = CURR_PATH;
    });
  } else {
    alert("select data");
  }
};

const moveSelected = () => {
  sideBarTitle.innerText = "Move to";
  copyBtn.classList.add("hidden");
  moveBtn.classList.remove("hidden");
  openSideBar();
};

const sendMoveReq = () => {
  const paths = getSelectedDataPaths();
  if (paths && paths.length) {
    if (sideBarTreePath == "/") sideBarTreePath = "";

    axios({
      method: "post",
      url: "/moveData",
      data: { paths: paths, dest: sideBarTreePath },
    }).then((res) => {
      if (res.status == 200) window.location = CURR_PATH;
    });
  } else {
    alert("select data");
  }
};

const getSelectedDataPaths = () => {
  const paths = [];
  if (CURR_PATH == "/") CURR_PATH = "";

  selectedData.forEach((x) => {
    paths.push({
      srcPath: CURR_PATH.replace(/&/g, "/") + x.data.name,
      fileName: x.data.name,
    });
  });
  return paths;
};

const sideBarFolderContainer = document.querySelector(".sideBarFileTree");

const renderSidebarTree = (children, path) => {
  sideBarFolderContainer.innerHTML = null;
  renderSideBarPath(path);
  if (path != "/") sideBarTreePath = path + "/";
  else sideBarTreePath = path;
  if (children) {
    children
      .filter((x) => x.type == "directory")
      .forEach((x, i) => {
        const folderTemp = document.querySelector(".sideBarFolderTemp");
        const element = folderTemp.content
          .cloneNode(true)
          .querySelector(".sideBarTreeFolder");
        const nameEl = element.querySelector(".sideBarFolderName");
        nameEl.innerText = x.name;

        element.addEventListener("click", () => {
          if (x) renderSidebarTree(x.children, x.relativePath);
        });

        sideBarFolderContainer.append(element);
      });
  }
};

const sideBarPath = document.querySelector(".sideBarPath"),
  sideBarBtns = document.querySelectorAll(".sideBarBtn");

const renderSideBarPath = (path) => {
  sideBarPath.innerHTML = null;

  if (path == "/") {
    const el = document.createElement("p");
    el.classList.add("currTreePath");
    el.innerText = "My files";
    sideBarPath.append(el);
  } else {
    const arrowTmp = document.querySelector(".arrowTemp");
    const arrowEl = arrowTmp.content
      .cloneNode(true)
      .querySelector(".pathArrow");

    const rootBtnTmp = document.querySelector(".sideBarRootBtn");
    const rootBtnEl = rootBtnTmp.content
      .cloneNode(true)
      .querySelector(".sideBarRootIcon");

    rootBtnEl.addEventListener("click", () => {
      renderSidebarTree(fullTree.children, "/");
    });
    if (path.split("/").length == 1) {
      const el = document.createElement("p");
      el.classList.add("sideBarPathBtn");
      const currPathEl = document.createElement("p");
      currPathEl.classList.add("currTreePath");
      currPathEl.innerText = path.split("/")[0];
      el.innerText = "My files";
      el.addEventListener("click", () => {
        renderSidebarTree(fullTree.children, "/");
      });
      sideBarPath.append(rootBtnEl, el, arrowEl, currPathEl);
    } else {
      const parentPath = document.createElement("p");
      parentPath.classList.add("sideBarPathBtn");
      const currPathEl = document.createElement("p");
      currPathEl.classList.add("currTreePath");

      parentPath.innerText = path.split("/")[path.split("/").length - 2];
      currPathEl.innerText = path.split("/")[path.split("/").length - 1];

      sideBarPath.append(rootBtnEl, parentPath, arrowEl, currPathEl);

      const parentsChildren = getParentsChildren(path);

      let prevPath = "";
      path.split("/").forEach((el, i) => {
        if (i < path.split("/").length - 1)
          prevPath = `${prevPath}${
            i == path.split("/").length - 2 && i != 0 ? "/" : ""
          }${el}`;
      });
      parentPath.addEventListener("click", () => {
        renderSidebarTree(parentsChildren.children, prevPath);
      });
    }
  }

  if (
    CURR_PATH.replace(/&/g, "").replace(/\//g, "") == path.replace(/\//g, "")
  ) {
    sideBarBtns.forEach((x) => x.classList.add("invinsible"));
  } else {
    sideBarBtns.forEach((x) => x.classList.remove("invinsible"));
  }
};

const getParentsChildren = (path) => {
  let currObj = fullTree;
  path.split("/").forEach((x, i) => {
    if (i < path.split("/").length - 1) {
      const newObj = currObj.children.find((child) => child.name == x);
      if (newObj) currObj = newObj;
    }
  });
  return currObj;
};

if (fullTree && fullTree.children) {
  renderSidebarTree(fullTree.children, "/");
}

const totalFilesSize = document.querySelector(".totalFilesSize");

if (fullTree) totalFilesSize.innerText = fullTree.size;

const navBarUserData = document.querySelector(".userDataInfo");

if (userData) navBarUserData.innerHTML = userData.name;

const logout = () => {
  axios({
    url: "/auth/logout",
    method: "GET",
  }).then((res) => {
    if (res.data.redirect) window.location = res.data.redirect;
    console.log(res);
  });
};
