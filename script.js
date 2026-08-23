const dispatches = [
  { tag: "AI TOOL", date: "21st Aug, 2026", title: "Free Vs Paid AI Tool" },
  { tag: "DAILY AI UPDATE", date: "20th Aug, 2026", title: "Daily AI Updates - 20 August" },
  { tag: "DAILY AI UPDATE", date: "19th Aug, 2026", title: "Daily AI Update - 19 August" },
  { tag: "DAILY AI UPDATE", date: "18th Aug, 2026", title: "Daily AI Update - 18 August" },
  { tag: "DAILY AI UPDATE", date: "13th Aug, 2026", title: "Daily AI Updates - 13 August" },
  { tag: "GUIDE", date: "9th Aug, 2026", title: "The AI Alignment Files" },
  { tag: "GUIDE", date: "13th Jul, 2026", title: "Setup Guide - Claude Code with Free Models" },
  { tag: "ROADMAP", date: "6th Jul, 2026", title: "85 AI Terms Explained in Simple Words" },
  { tag: "GUIDE", date: "30th Jun, 2026", title: "Claude Code Slash Command Cheatsheet" },
  { tag: "DAILY AI UPDATE", date: "24th Jun, 2026", title: "Your Daily AI Edge - 24 June" },
  { tag: "DAILY AI UPDATE", date: "22nd Jun, 2026", title: "Your Daily AI Edge" },
  { tag: "GUIDE", date: "22nd Jun, 2026", title: "10 Ways to Cut Your AI Token Bill in Half" },
  { tag: "DAILY AI UPDATE", date: "18th Jun, 2026", title: "Your Daily AI Edge - 18 June" },
  { tag: "DAILY AI UPDATE", date: "16th Jun, 2026", title: "Your Daily AI Edge" }
];

const grid = document.querySelector("[data-card-grid]");
const searchInput = document.querySelector("[data-search]");
const filterButtons = document.querySelectorAll("[data-filter]");
const emptyState = document.querySelector("[data-empty-state]");
const menuToggle = document.querySelector(".menu-toggle");
const navPanel = document.querySelector("[data-nav-panel]");

let activeFilter = "ALL";

function renderCards() {
  const query = searchInput.value.trim().toLowerCase();
  const visibleCards = dispatches.filter((dispatch) => {
    const matchesFilter = activeFilter === "ALL" || dispatch.tag === activeFilter;
    const matchesSearch = dispatch.title.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  grid.innerHTML = visibleCards
    .map(
      (dispatch) => `
        <article class="dispatch-card" tabindex="0" aria-label="${dispatch.title}">
          <span class="dispatch-tag">${dispatch.tag}</span>
          <div class="dispatch-content">
            <p class="dispatch-date">${dispatch.date}</p>
            <h3 class="dispatch-title">${dispatch.title}</h3>
          </div>
        </article>
      `
    )
    .join("");

  emptyState.hidden = visibleCards.length > 0;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderCards();
  });
});

searchInput.addEventListener("input", renderCards);

document.querySelectorAll("[data-email-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const input = form.querySelector("input[type='email']");
    const status = form.parentElement.querySelector("[data-form-status]");
    const email = input.value.trim();

    if (!input.checkValidity() || !email) {
      status.textContent = "Please enter a valid email address.";
      input.focus();
      return;
    }

    console.log("Staying Ahead signup:", email);
    status.textContent = "You're on the list. Welcome to Staying Ahead.";
    form.reset();
  });
});

menuToggle.addEventListener("click", () => {
  const isOpen = navPanel.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navPanel.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navPanel.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

renderCards();
