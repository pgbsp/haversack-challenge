// Prairie Grove Battlefield State Park
// Soldier's Load Interpretive Activity
// Build a realistic Civil War marching load weighing exactly 60 pounds.

const ITEMS = [
  {
    id: "rifle_acc",
    name: "Rifle & accouterments",
    weight: 14,
    desc: "Firearm grouped with bayonet, belt, and cartridge boxes."
  },
  {
    id: "ammo",
    name: "Ammunition (cartridges)",
    weight: 5,
    desc: "Typical ammunition carried on campaign."
  },
  {
    id: "canteen_full",
    name: "Canteen (full)",
    weight: 4,
    desc: "Water carried for the march."
  },
  {
    id: "knapsack_packed",
    name: "Knapsack (packed)",
    weight: 15,
    desc: "Clothing, blanket roll, and personal belongings."
  },
  {
    id: "blanket_wool",
    name: "Wool blanket",
    weight: 5,
    desc: "Essential bedding for field service."
  },
  {
    id: "shelter_half",
    name: "Shelter half",
    weight: 2,
    desc: "Half of a small tent carried by each soldier."
  },
  {
    id: "haversack_rations",
    name: "Haversack + 3 days cooked rations",
    weight: 6,
    desc: "Food carried in a tarred canvas haversack."
  },
  {
    id: "mess_tinware",
    name: "Mess kit (tin cup, plate, utensils)",
    weight: 2,
    desc: "Tinware used for eating and cooking."
  },
  {
    id: "gum_blanket",
    name: "Gum blanket (ground cloth)",
    weight: 2,
    desc: "Rubberized cloth used beneath bedding."
  },
  {
    id: "overcoat",
    name: "Winter overcoat",
    weight: 5,
    desc: "Heavy outer garment for cold-weather campaigns."
  },
  {
    id: "underclothing",
    name: "Extra underclothing",
    weight: 2,
    desc: "Spare shirt, drawers, and socks."
  },
  {
    id: "bible_letters",
    name: "Bible & letters from home",
    weight: 1,
    desc: "Personal keepsakes carried by many soldiers."
  },
  {
    id: "housewife",
    name: "Housewife (sewing kit)",
    weight: 1,
    desc: "Needles, thread, and buttons for repairing clothing."
  },
  {
    id: "coffee_sugar",
    name: "Coffee & sugar pokes",
    weight: 2,
    desc: "Common ration staples on campaign."
  },
  {
    id: "soap_candles",
    name: "Soap & candles",
    weight: 2,
    desc: "Small comforts and practical necessities."
  },
  {
    id: "tent_poles",
    name: "Tent poles & pegs",
    weight: 4,
    desc: "Shelter-support equipment."
  },
  {
    id: "frying_pan",
    name: "Mess frying pan",
    weight: 3,
    desc: "Useful but often discarded to reduce weight."
  },
  {
    id: "extra_socks",
    name: "Extra socks",
    weight: 1,
    desc: "An important comfort on long marches."
  },
  {
    id: "hardtack_bag",
    name: "Hardtack bag",
    weight: 2,
    desc: "Additional marching rations."
  },
  {
    id: "spare_clothes",
    name: "Spare trousers & shirt",
    weight: 3,
    desc: "An extra set of clothing."
  }
];

// Historical activity goals
const MAX_ITEMS = 10;
const TARGET_WEIGHT = 60;

// DOM references
const gridEl = document.getElementById("itemGrid");
const selectedCountEl = document.getElementById("selectedCount");
const totalWeightEl = document.getElementById("totalWeight");
const resultMessageEl = document.getElementById("resultMessage");
const checkButton = document.getElementById("checkButton");
const resetButton = document.getElementById("resetButton");

// Render item grid
function renderGrid() {
  gridEl.replaceChildren();

  const fragment = document.createDocumentFragment();

  ITEMS.forEach(item => {
    const card = document.createElement("div");
    card.className = "item-card";

    const title = document.createElement("h3");
    title.textContent = item.name;

    const weight = document.createElement("div");
    weight.className = "weight";
    weight.textContent = `Approximate Weight: ${item.weight} lb`;

    const desc = document.createElement("div");
    desc.className = "desc";
    desc.textContent = item.desc;

    const selectWrap = document.createElement("label");
    selectWrap.className = "item-select";
    selectWrap.setAttribute("aria-label", `Pack ${item.name}`);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = item.id;

    checkbox.addEventListener("change", (e) => {
      card.classList.toggle("selected", e.target.checked);
      onSelectionChange(e);
    });

    const labelText = document.createElement("span");
    labelText.textContent = "Pack This Item";

    card.appendChild(title);
    card.appendChild(weight);
    card.appendChild(desc);
    card.appendChild(selectWrap);

    selectWrap.appendChild(checkbox);
    selectWrap.appendChild(labelText);

    fragment.appendChild(card);
  });

  gridEl.appendChild(fragment);
}

function getSelectedIds() {
  return Array.from(
    gridEl.querySelectorAll("input[type='checkbox']:checked")
  ).map(cb => cb.value);
}

function getSelectedItems() {
  const ids = getSelectedIds();
  return ITEMS.filter(item => ids.includes(item.id));
}

function recomputeStatus() {
  const items = getSelectedItems();

  const count = items.length;

  const total = items.reduce(
    (sum, item) => sum + item.weight,
    0
  );

  selectedCountEl.textContent = count;
  totalWeightEl.textContent = total;

  resultMessageEl.className = "result-message";

  if (count > MAX_ITEMS) {
    resultMessageEl.classList.add("error");

    resultMessageEl.textContent =
      `You may carry only ${MAX_ITEMS} items. Remove ${count - MAX_ITEMS} item(s) before continuing.`;

    return;
  }

  if (count === MAX_ITEMS) {
    const delta = TARGET_WEIGHT - total;

    if (delta === 0) {
      resultMessageEl.classList.add("ok");

      resultMessageEl.textContent =
        "Historical Match: You assembled a realistic Civil War marching load weighing sixty pounds.";

      return;
    }

    if (delta > 0) {
      resultMessageEl.classList.add("error");

      resultMessageEl.textContent =
        `Your load is lighter than many soldiers carried. Consider what additional equipment might have been necessary during a winter campaign. (${delta} lb below target)`;

      return;
    }

    resultMessageEl.classList.add("error");

    resultMessageEl.textContent =
      `Your load exceeds the target marching weight. Soldiers often discarded non-essential items to reduce fatigue. (${Math.abs(delta)} lb over target)`;

    return;
  }

  resultMessageEl.textContent =
    "Pack ten items and aim for a realistic marching load of sixty pounds.";
}

function onSelectionChange(e) {
  const checked =
    gridEl.querySelectorAll("input[type='checkbox']:checked");

  if (checked.length > MAX_ITEMS) {
    e.target.checked = false;

    const card =
      e.target.closest(".item-card");

    if (card) {
      card.classList.remove("selected");
    }
  }

  recomputeStatus();
}

// Evaluate pack
checkButton.addEventListener("click", () => {
  const count = getSelectedIds().length;

  const total = getSelectedItems().reduce(
    (sum, item) => sum + item.weight,
    0
  );

  resultMessageEl.className = "result-message";

  if (count !== MAX_ITEMS) {
    resultMessageEl.classList.add("error");

    resultMessageEl.textContent =
      `A Civil War soldier had to make difficult choices. Select exactly ${MAX_ITEMS} items before evaluating your pack.`;

    return;
  }

  if (total !== TARGET_WEIGHT) {
    resultMessageEl.classList.add("error");

    const diff = Math.abs(total - TARGET_WEIGHT);

    resultMessageEl.textContent =
      total < TARGET_WEIGHT
        ? `Your load is lighter than the target marching weight by ${diff} lb. What additional necessities might a soldier have carried?`
        : `Your load exceeds the target marching weight by ${diff} lb. Soldiers often reduced weight whenever possible to ease the strain of a long march.`;

    return;
  }

  resultMessageEl.classList.add("ok");

  resultMessageEl.textContent =
    "Historical Match: At sixty pounds, your pack reflects the burdens many soldiers carried during the Prairie Grove campaign.";
});

// Reset activity
resetButton.addEventListener("click", () => {

  gridEl
    .querySelectorAll(".item-card")
    .forEach(card => {
      card.classList.remove("selected");
    });

  gridEl
    .querySelectorAll("input[type='checkbox']")
    .forEach(cb => {
      cb.checked = false;
    });

  recomputeStatus();
});

// Initialize activity
renderGrid();
recomputeStatus();

/* ---------- SAMPLE SOLUTION ----------
One valid 10-item combination totaling exactly 60 lb:

Rifle & accouterments .................. 14
Ammunition .............................. 5
Canteen (full) .......................... 4
Knapsack (packed) ...................... 15
Haversack + 3 days cooked rations ....... 6
Wool blanket ............................ 5
Winter overcoat ......................... 5
Shelter half ............................ 2
Mess kit ................................ 2
Coffee & sugar pokes .................... 2

Total .................................. 60 lb
--------------------------------------- */
