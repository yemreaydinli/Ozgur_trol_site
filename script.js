const $ = s => document.querySelector(s);

const pages = {
  question: $("#questionPage"),
  success: $("#successPage"),
  date: $("#datePage"),
  plan: $("#planPage"),
  final: $("#finalPage")
};

function showPage(page){
  Object.values(pages).forEach(p => p.classList.remove("active"));
  page.classList.add("active");
  window.scrollTo({top:0,behavior:"smooth"});
}

/* -------------------------------------------------
   HAYIR BUTONU
   PC: imleç yaklaşınca kaçar.
   MOBİL: parmak dokunduğu anda başka yere geçer.
   Kullanıcıya ekstra mesaj gösterilmez.
-------------------------------------------------- */

const noBtn = $("#noBtn");
const questionArea = $("#questionArea");
let escapeCount = 0;

function moveNoButton(pointerX = null, pointerY = null){
  const area = questionArea.getBoundingClientRect();
  const btn = noBtn.getBoundingClientRect();

  const pad = 3;
  const maxX = Math.max(pad, area.width - btn.width - pad);
  const maxY = Math.max(pad, area.height - btn.height - pad);

  let x = Math.random() * maxX;
  let y = Math.random() * maxY;

  if(pointerX !== null && pointerY !== null){
    const px = pointerX - area.left;
    const py = pointerY - area.top;
    const cx = noBtn.offsetLeft + btn.width/2;
    const cy = noBtn.offsetTop + btn.height/2;

    let dx = cx - px;
    let dy = cy - py;
    const len = Math.hypot(dx,dy) || 1;

    const distance = Math.min(185, 115 + escapeCount * 4);
    x = noBtn.offsetLeft + (dx/len) * distance;
    y = noBtn.offsetTop + (dy/len) * distance;

    if(x < pad || x > maxX || y < pad || y > maxY){
      x = Math.random() * maxX;
      y = Math.random() * maxY;
    }
  }

  noBtn.style.left = `${Math.max(pad,Math.min(x,maxX))}px`;
  noBtn.style.top = `${Math.max(pad,Math.min(y,maxY))}px`;
  noBtn.style.transform = "none";
  escapeCount++;
}

/* Mouse yaklaşınca */
questionArea.addEventListener("pointermove", e => {
  if(e.pointerType !== "mouse") return;

  const r = noBtn.getBoundingClientRect();
  const d = Math.hypot(
    e.clientX - (r.left+r.width/2),
    e.clientY - (r.top+r.height/2)
  );

  if(d < 82) moveNoButton(e.clientX,e.clientY);
});

noBtn.addEventListener("pointerenter", e => {
  if(e.pointerType === "mouse") moveNoButton(e.clientX,e.clientY);
});

/* Mobil dokunma */
noBtn.addEventListener("pointerdown", e => {
  e.preventDefault();
  e.stopPropagation();
  moveNoButton(e.clientX,e.clientY);
});

noBtn.addEventListener("click", e => {
  e.preventDefault();
  e.stopPropagation();
  moveNoButton(e.clientX,e.clientY);
});

/* Evet */
$("#yesBtn").addEventListener("click", () => showPage(pages.success));

/* Kabul ekranı -> tarih */
$("#continueBtn").addEventListener("click", () => {
  const now = new Date();
  const min =
    `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;

  $("#dateInput").min = min;
  showPage(pages.date);
});

/* Tarih -> seçenekler */
const dateInput = $("#dateInput");

$("#dateContinueBtn").addEventListener("click", () => {
  if(!dateInput.value){
    dateInput.focus();
    return;
  }
  showPage(pages.plan);
});

/* Date seçeneği */
let selectedPlan = null;

document.querySelectorAll(".plan-option").forEach(option => {
  option.addEventListener("click", () => {
    document.querySelectorAll(".plan-option").forEach(x => x.classList.remove("selected"));
    option.classList.add("selected");
    selectedPlan = option.dataset.plan;
    $("#planContinueBtn").disabled = false;
    $("#planContinueBtn").textContent = "devam et ♡";
  });
});

/* Final */
/* Final */
$("#planContinueBtn").addEventListener("click", () => {
  if(!selectedPlan || !dateInput.value) return;

  const date = new Date(`${dateInput.value}T12:00:00`);
  const formatted = new Intl.DateTimeFormat("tr-TR",{
    day:"numeric",
    month:"long",
    year:"numeric"
  }).format(date);

  const planTranslations = {
    "Dinner Date": "Akşam yemeği buluşması",
    "Cute Cafe": "Sevimli bir kafeye gitmek",
    "Arcade or Fair": "Oyun salonu veya lunaparka gitmek",
    "Movie Night": "Sinemaya gitmek",
    "Picnic": "Piknik yapmak",
    "Sunset Walk": "Gün batımında yürüyüş yapmak"
  };

  const displayPlan = planTranslations[selectedPlan] || selectedPlan;

  $("#summary").innerHTML =
    `<strong>📅 ${formatted}</strong><br><strong>💗 ${displayPlan}</strong>`;

  showPage(pages.final);
});

/* Ekran boyutu değişince kaçan butonu sınırlar içinde tut */
window.addEventListener("resize", () => {
  const area = questionArea.getBoundingClientRect();
  const btn = noBtn.getBoundingClientRect();
  const maxX = Math.max(3,area.width-btn.width-3);
  const maxY = Math.max(3,area.height-btn.height-3);

  noBtn.style.left = `${Math.max(3,Math.min(noBtn.offsetLeft,maxX))}px`;
  noBtn.style.top = `${Math.max(3,Math.min(noBtn.offsetTop,maxY))}px`;
});
