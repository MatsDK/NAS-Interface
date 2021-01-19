const rightPanel = document.querySelector(".panel-right");
const resizeContainer = document.querySelector(".dataHeader");

const interactable = interact(".panel-right");
interactable.resizable({
  edges: { left: true },

  listeners: {
    move(event) {
      // target.classList.add("resizing");
      var target = event.target;
      var x = parseFloat(target.getAttribute("data-x")) || 0;

      // update the element's style
      target.style.width = event.rect.width + "px";

      // translate when resizing from top or left edges
      x += event.deltaRect.left;

      // target.style.webkitTransform = target.style.transform =
      //   "translateX(" + x + "px)";

      target.setAttribute("data-x", x);
      resizeContainer.classList.add("resizing");
      const dataDetail = document.querySelectorAll(".rightDataDetails");
      const rightData = document.querySelectorAll(".leftData");

      dataDetail.forEach((x) => {
        x.style.width = rightPanel.getBoundingClientRect().width - 27 + "px";
      });
      rightData.forEach((x) => {
        x.classList.add("resizing");
      });
    },
  },
});

interactable.on("resizeend", (e) => {
  const rightData = document.querySelectorAll(".leftData");
  rightData.forEach((x) => {
    x.classList.remove("resizing");
  });
  resizeContainer.classList.remove("resizing");
});
