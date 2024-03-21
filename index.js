let modal = null;
const focusableSelector = "button,a,input,textarea";
let focusables = [];
let previoslyFocusedElement = null;

const openModal = async function (e) {
  e.preventDefault();
  /**pour ouvrir l'ajax créer un condition */
  const target = e.target.getAttribute("href");
  if (target.startsWith("#")) {
    modal = document.querySelector(target);
  } else {
    modal = await loadModal(target);
  }
  //   modal = document.querySelector(e.target.getAttribute("href"));/*existe avant de créer l'ajax,je le met en haut
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  previoslyFocusedElement = document.querySelector(":focus");
  modal.style.display = null;
  focusables[0].focus();
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);
};
const closeModal = function (e) {
  if (modal === null) return;
  if (previoslyFocusedElement != null) previoslyFocusedElement.focus();
  e.preventDefault();
  /**Animation-direction reversed */
  //
  //   modal.style.display="none"
  //   modal.offsetWidth
  //   modal.style.display=null

  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-close")
    .removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);
  const hideModel = function () {
    modal.style.display = "none";
    modal.removeEventListener("animationend", hideModel);
    modal = null;
  };
  modal.addEventListener("animationend", hideModel);
};

const stopPropagation = function (e) {
  e.stopPropagation();
};
const focusInModal = function (e) {
  e.preventDefault();
  let index = focusables.findIndex((f) => f === modal.querySelector(":focus"));
  if (e.shifKey === true) {
    index--;
  } else {
    index++;
  }

  if (index >= focusables.length) {
    index = 0;
  }
  if (index > 0) {
    index === focusables.length - 1;
  }
  focusables[index].focus();
};
/**apartient a la suite du l'ajax  au chargement du modal*/
const loadModal = async function (url) {
  //conseiller:afficher un" loader" pour indiquer au visiteur que c'est entrain se chargé (c'est pas fait dans cette exemple)
  const target = "#" + url.split("#")[1];
  const exitingModal = document.querySelector(target);
  if (exitingModal !== null) return exitingModal;
  const html = await fetch(url).then((response) => response.text());
  const element = document
    .createRange()
    .createContextualFragment(html)
    .querySelector(element);
  if (element === null)
    throw `l'élément ${target} n'a pas été trouvé dans la page ${url}`;
  document.body.append(element);
  return element;
  console.log(element);
};

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
  if (e.key === "Tab" && modal !== null) {
    focusInModal(e);
  }
});
// Pour comprendre se cour de preference de regarder sur youTube:CSS/Javacript:Créer une fenêtre modale en 2019 .cette vidéo apaparient à : " Grafikart.fr "
