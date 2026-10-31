const translate = value => window.siteI18n?.t(value) ?? value;
const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menuLinks = document.querySelectorAll("#site-navigation a");

function setMenuOpen(isOpen) {
  siteHeader.dataset.menuOpen = String(isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", translate(isOpen ? "Zamknij menu" : "Otwórz menu"));
}

menuToggle.addEventListener("click", () => {
  setMenuOpen(siteHeader.dataset.menuOpen !== "true");
});

menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (siteHeader.dataset.menuOpen === "true") {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && siteHeader.dataset.menuOpen === "true") {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

window.matchMedia("(min-width: 1021px)").addEventListener("change", (event) => {
  if (event.matches) setMenuOpen(false);
});

const scenarios = {
  travel: {
    context: "Chcesz przełożyć rezerwację na piątek.",
    first: "Could I move my booking to Friday?",
    firstTranslation: "Czy mogę przełożyć rezerwację na piątek?",
    reply: "Let me check what's available.",
    replyTranslation: "Sprawdzę, jakie są możliwości.",
    phrase: "Could I move…?",
    phraseTranslation: "Czy mogę przełożyć…?"
  },
  work: {
    context: "Chcesz zaproponować inny termin spotkania.",
    first: "Could we move our meeting to Friday?",
    firstTranslation: "Czy możemy przełożyć nasze spotkanie na piątek?",
    reply: "Would the afternoon work for you?",
    replyTranslation: "Czy popołudnie będzie Ci odpowiadać?",
    phrase: "Could we move…?",
    phraseTranslation: "Czy moglibyśmy przełożyć…?"
  },
  everyday: {
    context: "Chcesz zaprosić kogoś na kawę.",
    first: "Would you like to grab a coffee this weekend?",
    firstTranslation: "Masz ochotę wyskoczyć na kawę w ten weekend?",
    reply: "Saturday works for me.",
    replyTranslation: "Sobota mi pasuje.",
    phrase: "Would you like to…?",
    phraseTranslation: "Czy masz ochotę…?"
  }
};

const tabs = Array.from(document.querySelectorAll("[data-scenario]"));
const lessonPanel = document.querySelector("#lesson-panel");
const lessonTabs = document.querySelector(".lesson-tabs");
const phraseDetail = document.querySelector(".phrase-detail");
const tabCount = document.querySelector("[data-tab-count]");

function setScenario(name, focusTab = false) {
  const scenario = scenarios[name];
  const selectedTab = tabs.find((tab) => tab.dataset.scenario === name);
  if (!scenario || !selectedTab) return;

  tabs.forEach((tab) => {
    const isSelected = tab === selectedTab;
    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
  });

  lessonPanel.setAttribute("aria-labelledby", selectedTab.id);
  const selectedIndex = tabs.indexOf(selectedTab);
  tabCount.textContent = String(selectedIndex + 1).padStart(2, "0") + " / " + String(tabs.length).padStart(2, "0");
  const positionTabIndicator = () => {
    lessonTabs.style.setProperty("--tab-offset", selectedTab.offsetLeft + "px");
    lessonTabs.style.setProperty("--tab-width", selectedTab.offsetWidth + "px");
  };
  positionTabIndicator();
  document.querySelector("[data-scenario-context]").textContent = translate(scenario.context);
  document.querySelector("[data-line-one]").textContent = scenario.first;
  document.querySelector("[data-translation-one]").textContent = translate(scenario.firstTranslation);
  document.querySelector("[data-line-two]").textContent = scenario.reply;
  document.querySelector("[data-translation-two]").textContent = translate(scenario.replyTranslation);
  document.querySelector("[data-phrase]").textContent = scenario.phrase;
  document.querySelector("[data-phrase-translation]").textContent = translate(scenario.phraseTranslation);
  phraseDetail.open = false;
  window.dispatchEvent(new CustomEvent("scenariochange", { detail: { name, index: selectedIndex } }));

  if (focusTab) selectedTab.focus();
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => setScenario(tab.dataset.scenario));
  tab.addEventListener("keydown", (event) => {
    const currentIndex = tabs.indexOf(tab);
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else return;

    event.preventDefault();
    setScenario(tabs[nextIndex].dataset.scenario, true);
  });
});

window.addEventListener("resize", () => {
  const selectedTab = tabs.find((tab) => tab.getAttribute("aria-selected") === "true");
  if (!selectedTab || !lessonTabs) return;
  lessonTabs.style.setProperty("--tab-offset", selectedTab.offsetLeft + "px");
  lessonTabs.style.setProperty("--tab-width", selectedTab.offsetWidth + "px");
}, { passive: true });

const initialTab = tabs.find((tab) => tab.getAttribute("aria-selected") === "true");
if (initialTab) setScenario(initialTab.dataset.scenario);

const contactForm = document.querySelector("#contact-form");
const formPreview = document.querySelector("#form-preview");
const formPreviewContent = document.querySelector("#form-preview-content");

if (contactForm) {
  contactForm.querySelectorAll("input, textarea, button[type='submit']").forEach((control) => {
    control.disabled = false;
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = new FormData(contactForm);
    formPreviewContent.replaceChildren();

    const previewRows = [
      ["Imię", values.get("name")],
      ["E-mail", values.get("email")],
      ["O czym chcesz porozmawiać?", values.get("message")]
    ];

    previewRows.forEach(([label, value]) => {
      const row = document.createElement("p");
      row.className = "form-preview__line";
      const strong = document.createElement("strong");
      strong.textContent = translate(label) + ": ";
      const content = document.createElement("span");
      content.textContent = String(value || "");
      row.append(strong, content);
      formPreviewContent.append(row);
    });

    formPreview.hidden = false;
    formPreview.focus();
  });

  contactForm.addEventListener("input", () => {
    formPreview.hidden = true;
  });
}

const emitContentResize = () => window.dispatchEvent(new CustomEvent("contentresize"));

const roadmapContent = [
  { title: "Poznajemy Twój cel.", body: "Spotkanie w pracy? Wyjazd? Zwykła rozmowa przy kawie? Wybieramy sytuację z Twojego życia i ustalamy, co chcesz w niej powiedzieć.", takeaway: "Konkretny temat zamiast kolejnego rozdziału do odhaczenia." },
  { title: "Ćwiczymy na głos.", body: "Zaczynamy od krótkiej wymiany. Dopytujesz, odpowiadasz i próbujesz innej wersji. Masz czas na namysł — nie musisz mówić idealnie.", takeaway: "Zdania, które wypowiadasz samodzielnie, a nie tylko rozpoznajesz." },
  { title: "Porządkujemy to, co ważne.", body: "Wracamy do wybranych momentów rozmowy. Pokazuję prostszy zwrot albo poprawkę i zapisujemy to, do czego warto wrócić.", takeaway: "Krótka osobista notatka i jasny pomysł na dalszą praktykę." },
  { title: "Zabierasz język do życia.", body: "Wracasz do swojej sytuacji z przećwiczonymi zwrotami. Na kolejnym spotkaniu omawiamy, co się przydało i co chcesz powiedzieć następnym razem.", takeaway: "Kolejny krok wynika z Twoich rozmów, potrzeb i tempa." }
];
const roadmapTabs = Array.from(document.querySelectorAll("[data-roadmap-step]"));
const roadmapPanel = document.querySelector("#roadmap-panel");

function selectRoadmapStep(index, focusTab = false) {
  const step = roadmapContent[index];
  const tab = roadmapTabs[index];
  if (!step || !tab || !roadmapPanel) return;
  roadmapTabs.forEach((item, itemIndex) => {
    const selected = itemIndex === index;
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  roadmapPanel.setAttribute("aria-labelledby", tab.id);
  roadmapPanel.querySelector("[data-roadmap-number]").textContent = String(index + 1).padStart(2, "0");
  roadmapPanel.querySelector("[data-roadmap-title]").textContent = translate(step.title);
  roadmapPanel.querySelector("[data-roadmap-body]").textContent = translate(step.body);
  roadmapPanel.querySelector("[data-roadmap-takeaway]").textContent = translate(step.takeaway);
  window.dispatchEvent(new CustomEvent("contentpanelchange", { detail: { selector: "#roadmap-panel" } }));
  emitContentResize();
  if (focusTab) tab.focus();
}

roadmapTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectRoadmapStep(index));
  tab.addEventListener("keydown", (event) => {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % roadmapTabs.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + roadmapTabs.length) % roadmapTabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = roadmapTabs.length - 1;
    else return;
    event.preventDefault();
    selectRoadmapStep(next, true);
  });
});

const formatStatus = document.querySelector("[data-form-prefill-status]");
document.querySelectorAll("[data-format-choice]").forEach((link) => {
  link.addEventListener("click", () => {
    const message = contactForm?.elements.namedItem("message");
    if (!message) return;
    const format = link.dataset.formatChoice === "focused"
      ? "Chcę porozmawiać o przygotowaniu do konkretnej sytuacji w cyklu 3 × 60 minut."
      : "Chcę porozmawiać o regularnej praktyce 1:1 (60 minut za spotkanie).";
    if (message.value.trim()) {
      formatStatus.textContent = translate("Pole wiadomości zawiera już tekst — pozostawiliśmy go bez zmian.");
      return;
    }
    message.value = translate(format);
    message.dispatchEvent(new Event("input", { bubbles: true }));
    formatStatus.textContent = translate("Dodaliśmy wybrany format do wiadomości. Możesz go edytować.");
  });
});

document.querySelectorAll(".phrase-detail").forEach((details) => {
  details.addEventListener("toggle", emitContentResize);
});
