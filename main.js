// 科睿思官網互動：選單、頁首、彈出視窗、進場動畫
document.documentElement.classList.add("js");

// ===== 手機選單 =====
const navToggle = document.querySelector(".nav-toggle");
const setNav = (open) => {
  document.body.classList.toggle("nav-open", open);
  if (navToggle) navToggle.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
};
if (navToggle) {
  navToggle.addEventListener("click", () =>
    setNav(!document.body.classList.contains("nav-open"))
  );
  document
    .querySelectorAll(".nav a")
    .forEach((a) => a.addEventListener("click", () => setNav(false)));
}

// ===== 頁首捲動後加底線 =====
const header = document.querySelector(".site-header");
if (header) {
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// ===== 彈出視窗（可疊開：從感測應用點進案例，返回後回到原視窗）=====
const stack = [];
const lockBody = () => {
  document.body.style.overflow = stack.length ? "hidden" : "";
};
function openDialog(id, trigger) {
  const el = document.getElementById(id);
  if (!el || el.classList.contains("is-open")) return;
  el.classList.add("is-open");
  el.setAttribute("aria-hidden", "false");
  el.style.zIndex = String(300 + stack.length);
  stack.push({ el, trigger });
  lockBody();
  const focusTarget = el.querySelector(".dialog-close, .dialog-back");
  if (focusTarget) focusTarget.focus();
}
function closeDialog(el) {
  const i = stack.findIndex((s) => s.el === el);
  if (i === -1) return;
  const [{ trigger }] = stack.splice(i, 1);
  el.classList.remove("is-open");
  el.setAttribute("aria-hidden", "true");
  lockBody();
  if (trigger && document.contains(trigger)) trigger.focus();
}
document.querySelectorAll("[data-open]").forEach((btn) =>
  btn.addEventListener("click", () => openDialog(btn.dataset.open, btn))
);
document.querySelectorAll(".dialog").forEach((dlg) => {
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) closeDialog(dlg);
    if (e.target.closest("[data-close]")) closeDialog(dlg);
  });
});
window.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (stack.length) closeDialog(stack[stack.length - 1].el);
  else if (document.body.classList.contains("nav-open")) setNav(false);
});

// ===== 進場動畫 =====
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      }),
    { threshold: 0.12 }
  );
  reveals.forEach((r) => io.observe(r));
} else {
  reveals.forEach((r) => r.classList.add("in"));
}

// ===== 步驟圖點擊放大 =====
const lightbox = document.getElementById("lightbox");
if (lightbox) {
  const lbImg = lightbox.querySelector("img");
  const lbCap = lightbox.querySelector(".lightbox-cap");
  document.querySelectorAll("[data-zoom]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const img = btn.querySelector("img");
      lbImg.src = btn.dataset.zoom;
      lbImg.alt = img ? img.alt : "";
      lbCap.textContent = img ? img.alt : "";
      openDialog("lightbox", btn);
    })
  );
}
