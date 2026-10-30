(function () {
  "use strict";

  var initializedKey = Symbol.for("essence.advisor.initialized");
  var definitions = [
    {
      name: "feel",
      errorId: "feelError",
      choices: {
        tight: "Lubię otulające odczucie.",
        balanced: "Wybieram neutralne odczucie.",
        mixed: "Lubię lekkie odczucie."
      }
    },
    {
      name: "steps",
      errorId: "stepsError",
      choices: { two: "2 kroki", three: "3 kroki" }
    },
    {
      name: "scent",
      errorId: "scentError",
      choices: {
        yes: "Wolę warianty bez zapachu.",
        no: "Zapach nie jest dla mnie ważnym kryterium."
      }
    }
  ];
  var copy = {
    validation: "Wybierz jedną odpowiedź.",
    initial: "Wybierz po jednej odpowiedzi w każdej sekcji, aby zobaczyć przykładowy układ.",
    stale: "Wybory się zmieniły. Pokaż układ ponownie, aby go skopiować.",
    success: "Karta skopiowana.",
    failure: "Nie udało się skopiować. Możesz zaznaczyć tekst ręcznie."
  };

  function initialize() {
    var dialog = document.getElementById("ritualDialog");
    if (!dialog || typeof window.HTMLDialogElement !== "function" ||
        !(dialog instanceof window.HTMLDialogElement) ||
        typeof dialog.showModal !== "function" ||
        dialog[initializedKey] || dialog.open) {
      return;
    }

    var form = document.getElementById("ritualForm");
    var result = document.getElementById("ritualResult");
    var resultText = document.getElementById("ritualResultText");
    var copyButton = document.getElementById("ritualCopy");
    var status = document.getElementById("ritualStatus");
    var openers = Array.prototype.slice.call(document.querySelectorAll("[data-advisor-open]"));
    var closeButtons = Array.prototype.slice.call(dialog.querySelectorAll("[data-advisor-close]"));

    if (!document.body || !form || !result || !resultText || !copyButton || !status ||
        !dialog.contains(form) || !dialog.contains(result) || !dialog.contains(resultText) ||
        !dialog.contains(copyButton) || !dialog.contains(status) ||
        openers.length === 0 || closeButtons.length === 0 ||
        copyButton.tagName !== "BUTTON") {
      return;
    }

    var groups = [];
    for (var i = 0; i < definitions.length; i += 1) {
      var definition = definitions[i];
      var fieldset = form.querySelector('fieldset[name="' + definition.name + '"]');
      var error = document.getElementById(definition.errorId);
      var radios = fieldset
        ? Array.prototype.slice.call(fieldset.querySelectorAll(
            'input[type="radio"][name="' + definition.name + '"]'
          ))
        : [];
      var values = radios.map(function (radio) { return radio.value; });
      var expected = Object.keys(definition.choices);

      if (!fieldset || !fieldset.querySelector("legend") || !error ||
          radios.length !== expected.length ||
          expected.some(function (value) { return values.indexOf(value) === -1; })) {
        return;
      }

      radios.forEach(function (radio) {
        var describedBy = (radio.getAttribute("aria-describedby") || "")
          .split(/\s+/)
          .filter(Boolean);
        if (describedBy.indexOf(error.id) === -1) {
          describedBy.push(error.id);
          radio.setAttribute("aria-describedby", describedBy.join(" "));
        }
      });

      groups.push({
        name: definition.name,
        error: error,
        radios: radios,
        choices: definition.choices
      });
    }

    dialog[initializedKey] = true;
    form.noValidate = true;
    resultText.textContent = copy.initial;
    status.textContent = "";
    copyButton.disabled = true;

    groups.forEach(function (group) {
      group.error.textContent = "";
      group.radios.forEach(function (radio) {
        radio.removeAttribute("aria-invalid");
      });
    });

    var isManagedOpen = false;
    var openingControl = null;
    var hasResult = false;
    var resultIsFresh = false;
    var copyPending = false;
    var resultVersion = 0;
    var cardText = "";

    function setCopyState() {
      copyButton.disabled = !hasResult || !resultIsFresh || copyPending;
    }

    function selectedChoice(group) {
      var selected = group.radios.find(function (radio) { return radio.checked; });
      return selected
        ? { value: selected.value, label: group.choices[selected.value] }
        : null;
    }

    function getSelection() {
      var selection = {};
      for (var index = 0; index < groups.length; index += 1) {
        var choice = selectedChoice(groups[index]);
        if (!choice) return null;
        selection[groups[index].name] = choice;
      }
      return selection;
    }

    function hasErrors() {
      return groups.some(function (group) { return group.error.textContent !== ""; });
    }

    function refreshStatus() {
      if (hasErrors()) {
        status.textContent = copy.validation;
      } else if (hasResult && !resultIsFresh) {
        status.textContent = copy.stale;
      } else {
        status.textContent = "";
      }
    }

    function clearError(group) {
      group.error.textContent = "";
      group.radios.forEach(function (radio) {
        radio.removeAttribute("aria-invalid");
      });
    }

    function markError(group) {
      group.error.textContent = copy.validation;
      group.radios.forEach(function (radio) {
        radio.setAttribute("aria-invalid", "true");
      });
    }

    function buildCard(selection) {
      var sequence = selection.steps.value === "two"
        ? "01 MYCIE · krok 1 → 03 KREM · krok 2"
        : "01 MYCIE · krok 1 → 02 SERUM · krok 2 → 03 KREM · krok 3";

      return [
        "Essence · przykładowy układ",
        "",
        "Twoje wybory",
        "Odczucie: " + selection.feel.label,
        "Liczba kroków: " + selection.steps.label,
        "Podejście do zapachu: " + selection.scent.label,
        "",
        sequence
      ].join("\n");
    }

    function emit(name) {
      dialog.dispatchEvent(new CustomEvent(name, {
        bubbles: true,
        detail: { dialog: dialog }
      }));
    }

    openers.forEach(function (trigger) {
      trigger.addEventListener("click", function (event) {
        event.preventDefault();
        if (dialog.open || isManagedOpen) return;

        openingControl = trigger;
        dialog.showModal();
        isManagedOpen = true;
        document.body.dataset.advisorOpen = "true";
        emit("essence:advisor-open");
      });
    });

    closeButtons.forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        if (dialog.open) dialog.close();
      });
    });

    dialog.addEventListener("click", function (event) {
      if (event.target !== dialog || !dialog.open) return;
      var bounds = dialog.getBoundingClientRect();
      var outside = event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom;
      if (outside) dialog.close();
    });

    dialog.addEventListener("close", function () {
      if (!isManagedOpen) return;

      isManagedOpen = false;
      delete document.body.dataset.advisorOpen;
      var returnFocus = openingControl;
      openingControl = null;

      if (returnFocus && returnFocus.isConnected) {
        returnFocus.focus({ preventScroll: true });
      }
      emit("essence:advisor-close");
    });

    form.addEventListener("change", function (event) {
      var radio = event.target;
      if (!radio || radio.type !== "radio" || !radio.checked) return;

      var group = groups.find(function (item) { return item.name === radio.name; });
      if (!group) return;

      clearError(group);
      if (hasResult && resultIsFresh) {
        resultIsFresh = false;
        resultVersion += 1;
        setCopyState();
      }
      refreshStatus();
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var selection = getSelection();

      if (!selection) {
        var firstMissing = null;
        groups.forEach(function (group) {
          if (selectedChoice(group)) {
            clearError(group);
          } else {
            markError(group);
            if (!firstMissing) firstMissing = group.radios[0];
          }
        });
        status.textContent = copy.validation;
        if (firstMissing) firstMissing.focus();
        return;
      }

      groups.forEach(clearError);
      cardText = buildCard(selection);
      resultText.textContent = cardText;
      hasResult = true;
      resultIsFresh = true;
      resultVersion += 1;
      setCopyState();
      status.textContent = "";
    });

    copyButton.addEventListener("click", async function (event) {
      event.preventDefault();
      if (!hasResult || !resultIsFresh || copyPending) return;

      var textToCopy = cardText;
      var versionAtClick = resultVersion;
      var clipboard = navigator.clipboard;
      copyPending = true;
      setCopyState();

      try {
        if (!clipboard || typeof clipboard.writeText !== "function") {
          throw new Error("Clipboard API unavailable");
        }
        await clipboard.writeText(textToCopy);
        status.textContent = versionAtClick === resultVersion && resultIsFresh
          ? copy.success
          : copy.stale;
      } catch (error) {
        status.textContent = copy.failure;
      } finally {
        copyPending = false;
        setCopyState();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
