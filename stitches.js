export let selectedStitch = "empty";

export const stitches = {
  empty: { symbol: "", description: "пустая клетка" },
  knit: { symbol: "|", description: "1 лицевая петля" },
  purl: { symbol: "—", description: "1 изн.петля" },
  k2tog: { symbol: "◢", description: "2 лиц.вместе" },
  yo: { symbol: "◯", description: "1 накид" },
  ssk: { symbol: "◣", description: "2 лиц с наклоном влево" },
  sl1k2psso: {
    symbol: loadImage("./svgs/3l.svg"),
    isSymbolImage: true,
    description:
      "3 лиц вместе(=1 п.снять не провязывая,2 п. вместе и протянут через снятую)",
  },
  k1tbl: { symbol: "ʍ", description: "1 лиц. из протяжки" },
  p1tbl: { symbol: "∨", description: "1 петлю снять,нитка за вязанием" },
  sl1: { symbol: "∀", description: "1 петлю снять,нитка перед вязанием" },
  ktbl: { symbol: "ხ", description: "перекрученная петля" },
  bo: { symbol: "⌒", description: "закрыть 1 п." },
  ob: { symbol: "◡", description: "набрать 1 п." },
  p2tog: { symbol: "◺", description: "2 изн. вместе" },
  p2r: {
    symbol: "◿",
    description: "2 изн. с наклоном вправо(перекрутить и провязать)",
  },
  sssk: {
    symbol: loadImage("./svgs/3izn.svg"),
    isSymbolImage: true,
    description: "3 изн. вместе",
  },
  k4tog: {
    symbol: loadImage("./svgs/4tog.svg"),
    isSymbolImage: true,
    description: "4 лиц вместе",
  },
  p4tog: {
    symbol: loadImage("./svgs/4izn.svg"),
    isSymbolImage: true,
    description: "4 изн. вместе",
  },
};

export function selectStitch(stitch) {
  selectedStitch = stitch;
}

export function createStitchButtons() {
  const container = document.getElementById("stitchButtons");
  for (const [key, value] of Object.entries(stitches)) {
    const button = document.createElement("button");
    if (value.isSymbolImage) {
      button.append(value.symbol);
    } else {
      button.textContent = value.symbol === "" ? "🞐" : value.symbol;
    }

    button.title = value.description;
    button.className = "stitch-btn";
    button.onclick = (e) => {
      document.querySelector(".stitch-btn.active")?.classList.remove("active");
      e.currentTarget.classList.add("active");
      selectStitch(key);
    };
    container.appendChild(button);
  }
}

function loadImage(url) {
  let img = new Image();
  img.src = url;
  return img;
}
