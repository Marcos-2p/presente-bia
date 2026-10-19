
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const scene = document.getElementById("birthdayScene");
  const envelope = document.getElementById("envelope");
  const envelopeFlap = document.getElementById("envelopeFlap");
  const envelopeSeal = document.getElementById("envelopeSeal");
  const openButton = document.getElementById("openButton");
  const closeButton = document.getElementById("closeButton");
  const mainActions = document.getElementById("mainActions");
  const openedActions = document.getElementById("openedActions");

  const noteModal = document.getElementById("noteModal");
  const modalClose = document.getElementById("modalClose");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const modalDecoration = document.getElementById("modalDecoration");
  const confettiContainer = document.getElementById("confettiContainer");

  // Mensagens curtas dos cinco bilhetes.
  const notes = [
    {
      title: "Um desejo pra ti",
      decoration: "☀",
      message:
        "Que teu novo ciclo venha cheio de coisas boas, dias leves e motivos sinceros pra sorrir. Tu merece. ♡"
    },
    {
      title: "Um registro especial",
      decoration: "📷",
      message:
        "Que não te faltem lugares bonitos pra conhecer, fotos pra guardar e momentos que mereçam ser lembrados. ♡"
    },
    {
      title: "Um pequeno detalhe",
      decoration: "♡",
      message:
        "Gosto das nossas conversas, até daquelas que começam sem assunto nenhum. Espero que ainda venham muitas. ♡"
    },
    {
      title: "Um visitante especial",
      decoration: "ฅ",
      message:
        "Te desejo muito carinho, risadas e um gatinho aparecendo do nada pra deixar teu dia ainda melhor. ฅ^•ﻌ•^ฅ"
    },
    {
      title: "Algumas saudades",
      decoration: "♡",
      message:
        "Às vezes bate saudade de conversar contigo sem nem ver a hora passar. Espero que a gente ainda tenha muitos momentos assim. ♡"
    }
  ];

  let previousFocus = null;
  let modalOpen = false;
  let confettiTimeout = null;

  function openLetter() {
    if (scene.classList.contains("open")) return;

    scene.classList.add("open");

    envelope.setAttribute("aria-label", "Envelope aberto");
    openButton.setAttribute("aria-expanded", "true");
    mainActions.setAttribute("aria-hidden", "true");
    openedActions.hidden = false;

    window.setTimeout(() => {
      const letter = document.getElementById("letter");

      if (letter) {
        letter.scrollTop = 0;
      }
    }, 350);

    launchConfetti(24);
  }

  function closeLetter() {
    if (!scene.classList.contains("open")) return;

    scene.classList.remove("open");

    envelope.setAttribute("aria-label", "Envelope fechado");
    openButton.setAttribute("aria-expanded", "false");
    mainActions.removeAttribute("aria-hidden");
    openedActions.hidden = true;
  }

  function toggleLetter() {
    if (scene.classList.contains("open")) {
      closeLetter();
    } else {
      openLetter();
    }
  }

  function showNote(index, trigger) {
    const note = notes[index];

    if (!note) return;

    previousFocus = trigger || document.activeElement;

    modalTitle.textContent = note.title;
    modalMessage.textContent = note.message;
    modalDecoration.textContent = note.decoration;

    noteModal.hidden = false;
    modalOpen = true;
    document.body.style.overflow = "hidden";

    window.setTimeout(() => {
      modalClose.focus();
    }, 20);
  }

  function hideNote() {
    if (!modalOpen) return;

    noteModal.hidden = true;
    modalOpen = false;
    document.body.style.overflow = "";

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }

    previousFocus = null;
  }

  function launchConfetti(amount = 24) {
    if (!confettiContainer) return;

    const colors = [
      "#e7b0bc",
      "#e9d9ed",
      "#f2d5a8",
      "#d4e3d1",
      "#f5c9d0"
    ];

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < amount; i++) {
      const piece = document.createElement("span");

      const duration = 2.2 + Math.random() * 2.2;
      const delay = Math.random() * 0.7;
      const drift = Math.round(Math.random() * 160 - 80);

      piece.className = "confetti-piece";

      piece.style.left = `${Math.random() * 100}%`;

      piece.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];

      piece.style.setProperty("--fall-duration", `${duration}s`);
      piece.style.setProperty("--drift", `${drift}px`);
      piece.style.animationDelay = `${delay}s`;
      piece.style.opacity = `${0.65 + Math.random() * 0.35}`;

      fragment.appendChild(piece);
    }

    confettiContainer.appendChild(fragment);

    if (confettiTimeout) {
      window.clearTimeout(confettiTimeout);
    }

    confettiTimeout = window.setTimeout(() => {
      confettiContainer.replaceChildren();
      confettiTimeout = null;
    }, 5500);
  }

  // Abrir e fechar a carta.
  openButton.addEventListener("click", openLetter);
  closeButton.addEventListener("click", closeLetter);

  envelopeFlap.addEventListener("click", toggleLetter);
  envelopeSeal.addEventListener("click", toggleLetter);

  // Abrir os bilhetes usando o índice data-note do HTML.
  document.querySelectorAll("[data-note]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.note);
      showNote(index, button);
    });
  });

  // Fechar bilhete pelo botão.
  modalClose.addEventListener("click", hideNote);

  // Fechar bilhete ao clicar fora dele.
  noteModal.addEventListener("click", (event) => {
    if (event.target === noteModal) {
      hideNote();
    }
  });

  // Tecla Escape fecha primeiro o bilhete ou, se não houver,
  // fecha a carta aberta.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (modalOpen) {
        hideNote();
      } else if (scene.classList.contains("open")) {
        closeLetter();
      }
    }

    // Mantém o foco no botão de fechar enquanto o modal está aberto.
    if (modalOpen && event.key === "Tab") {
      event.preventDefault();
      modalClose.focus();
    }
  });

  // Evita alternâncias acidentais ao clicar no envelope.
  envelope.addEventListener("click", (event) => {
    if (
      event.target === envelope ||
      event.target.classList.contains("envelope-back") ||
      event.target.classList.contains("envelope-front")
    ) {
      // Os controles específicos cuidam da abertura.
    }
  });

  // Estado inicial.
  openButton.setAttribute("aria-expanded", "false");
  envelope.setAttribute("aria-label", "Envelope fechado");
});
