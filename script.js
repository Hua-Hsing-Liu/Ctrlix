// ========== 第一層：Service 兩個 modal ==========
document.querySelectorAll(".service-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-modal");
    const modal = document.getElementById(id);
    if (!modal) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const panel = modal.querySelector(".panel");
    const mobileFirst = modal.querySelector(".modal-card.mobile-first");
    if (panel) panel.style.display = isMobile ? "none" : "block";
    if (mobileFirst) mobileFirst.style.display = isMobile ? "block" : "none";

    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
});

function closeModal(modal) {
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll(".modal").forEach((modal) => {
  const closeBtn = modal.querySelector(".close");
  if (closeBtn) closeBtn.addEventListener("click", () => closeModal(modal));
  modal.addEventListener("click", (e) => {
    if (!e.target.closest(".modal-card")) closeModal(modal);
  });
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document
      .querySelectorAll(".modal[aria-hidden='false']")
      .forEach((m) => closeModal(m));
    document
      .querySelectorAll(".submodal.is-open")
      .forEach((sm) => sm.classList.remove("is-open"));
    document.body.style.overflow = "";
  }
});

// ========== 第二層：submodal（用 data-* 屬性驅動，手機必開） ==========
function openSubmodalById(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add("is-open"); // 顯示
  el.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // 鎖背景
}
function closeSubmodalEl(el) {
  el.classList.remove("is-open");
  el.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// 點「膠囊」開第二層
document.querySelectorAll("[data-open-sub]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.getAttribute("data-open-sub");
    openSubmodalById(id);
  });
});

// 點返回關第二層
document.querySelectorAll("[data-close-sub]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const sm = btn.closest(".submodal");
    if (sm) closeSubmodalEl(sm);
  });
});

// 點黑底也關
document.querySelectorAll(".submodal").forEach((sm) => {
  sm.addEventListener("click", (e) => {
    if (!e.target.closest(".submodal-card")) closeSubmodalEl(sm);
  });
});

// 其他保險：首頁電路不攔點擊
const homeCircuit = document.querySelector(".home-circuit-container");
if (homeCircuit) homeCircuit.style.pointerEvents = "none";
