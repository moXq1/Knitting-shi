import { selectStitch } from "./stitches";

export function initDialog() {
  let dialog = document.querySelector("dialog");
  let infobtn = document.querySelector(".info");

  dialog.addEventListener("click", closeFromEvent);

  function closeFromEvent(e) {
    const modalRect = dialog.getBoundingClientRect();

    if (
      e.clientX < modalRect?.left ||
      e.clientX > modalRect.right ||
      e.clientY < modalRect.top ||
      e.clientY > modalRect.bottom
    ) {
      close();
    }
  }

  function close() {
    if (window.history.state.isOpen) {
      window.history.back();
    }
  }

  function closeModal() {
    dialog.close();
    window.removeEventListener("popstate", closeModal);
  }

  infobtn.addEventListener("click", (e) => {
    window.addEventListener("popstate", closeModal);
    window.history.pushState({ isOpen: true }, "ttt");
    dialog.showModal();
  });
}

function getDescriptionEl(obj, key) {
  const stich = document.createElement("div");
  stich.className = "stich";
  stich.onclick = () => {
    selectStitch(key);
  };

  let symbol = obj.symbol;
  if (obj.isSymbolImage) {
    symbol = obj.symbol.outerHTML;
  }
  stich.insertAdjacentHTML(
    "afterbegin",
    `  
    <div class="symbol">${symbol || "🞐"}</div>
    <div class="description">${obj.description}</div>

  `
  );

  return stich;
}

export function renderDialogContent(stiches) {
  const artical = dialog.querySelector("article");

  for (const [key, value] of Object.entries(stiches)) {
    const stichesEl = getDescriptionEl(value, key);

    artical.append(stichesEl);
  }
}
