
import {
  formaterDonnee,
  filtrerParTexte,
  filtrerParEtat,
  trierParNom
} from "./utils.js";

const API_URL =
  "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/sites-disposant-du-service-paris-wi-fi/records?limit=30";

const totalEl = document.querySelector("#total-count");
const shownEl = document.querySelector("#shown-count");
const cardsEl = document.querySelector("#cards");
const messageEl = document.querySelector("#message");

const searchEl = document.querySelector("#search");
const statusEl = document.querySelector("#status-filter");
const sortEl = document.querySelector("#sort");

let sites = [];

function creerCarte(site) {
  const article = document.createElement("article");
  article.className = "site-card";

  const top = document.createElement("div");
  top.className = "card-top";

  const titre = document.createElement("h2");
  titre.textContent = site.nom;

  const badge = document.createElement("span");
  const operationnel =
    site.etat.toLowerCase() === "opérationnel";

  badge.className = operationnel
    ? "badge badge--ok"
    : "badge badge--off";

  badge.textContent = site.etat;

  top.append(titre, badge);

  const adresse = document.createElement("p");
  adresse.className = "address";
  adresse.textContent =
    `${site.adresse} · ${site.codePostal}`;

  const bornes = document.createElement("span");
  bornes.className = "detail";
  bornes.textContent =
    `${site.nombreBornes} borne(s) Wi-Fi`;

  const reference = document.createElement("span");
  reference.className = "detail";
  reference.textContent = `Réf. ${site.id}`;

  article.append(top, adresse, bornes, reference);

  return article;
}

function afficherSites(liste) {
  cardsEl.replaceChildren();

  liste.forEach(site => {
    cardsEl.append(creerCarte(site));
  });

  shownEl.textContent = liste.length;

  messageEl.textContent = liste.length
    ? `${liste.length} résultat(s) affiché(s).`
    : "Aucun site ne correspond à votre recherche.";
}

function appliquerFiltres() {
  const recherche = filtrerParTexte(
    sites,
    searchEl.value
  );

  const etat = filtrerParEtat(
    recherche,
    statusEl.value
  );

  const resultat = trierParNom(
    etat,
    sortEl.value
  );

  afficherSites(resultat);
}

// Déclare une fonction asynchrone permettant de charger les données depuis une API.
async function chargerDonnees() {

  // Démarre un bloc de gestion des erreurs pour éviter que le programme
  // ne s'interrompe brutalement en cas de problème.
  try {

    // Affiche un message à l'utilisateur pour lui indiquer que les données
    // sont en cours de chargement.
    messageEl.textContent = "Chargement des données…";

    // Envoie une requête HTTP à l'adresse de l'API.
    // Le mot-clé await attend la réponse avant de poursuivre l'exécution.
    const response = await fetch(API_URL);

    // Vérifie si la réponse HTTP est correcte.
    // response.ok vaut true si le code HTTP est compris entre 200 et 299.
    if (!response.ok) {

      // Si la réponse n'est pas correcte, déclenche une erreur
      // contenant le code HTTP reçu (404, 500, etc.).
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    // Convertit le contenu de la réponse HTTP au format JSON.
    // await attend que la conversion soit terminée.
    const data = await response.json();

    // Récupère le nombre total d'enregistrements fourni par l'API.
    // Number() garantit une conversion en nombre.
    // toLocaleString("fr-FR") formate ce nombre selon les conventions françaises
    // (exemple : 12500 devient 12 500).
    // textContent affiche ensuite le résultat dans l'élément HTML correspondant.
    totalEl.textContent =
      Number(data.total_count).toLocaleString("fr-FR");

    // Récupère le tableau des résultats transmis par l'API.
    // map() parcourt chaque élément du tableau.
    // formaterDonnee transforme chaque donnée selon la structure attendue
    // par l'application.
    // Le nouveau tableau obtenu est stocké dans la variable globale sites.
    sites = data.results.map(formaterDonnee);

    // Appelle la fonction qui applique les filtres et actualise l'affichage.
    // Elle permet notamment de prendre en compte les critères de recherche,
    // de statut et de tri.
    appliquerFiltres();

  } catch (error) {

    // Intercepte toute erreur survenue dans le bloc try.
    // Affiche les détails de l'erreur dans la console du navigateur
    // pour faciliter le diagnostic lors du développement.
    console.error(error);

    // Affiche un message d'erreur compréhensible par l'utilisateur
    // si le chargement des données a échoué.
    messageEl.textContent =
      "Impossible de charger les données. Réessayez.";

    // Remplace le nombre total par un tiret afin d'indiquer
    // que cette information n'est plus disponible.
    totalEl.textContent = "—";

    // Réinitialise le compteur des résultats affichés à zéro.
    shownEl.textContent = "0";
  }
}


// Écoute les modifications effectuées dans le champ de recherche.
// L'événement input se déclenche à chaque saisie ou suppression de caractère.
// À chaque modification, appliquerFiltres() est exécutée.
searchEl.addEventListener("input", appliquerFiltres);


// Écoute les changements effectués dans le menu déroulant des statuts.
// L'événement change se déclenche lorsqu'une nouvelle option est sélectionnée.
// Les résultats sont alors filtrés à nouveau.
statusEl.addEventListener("change", appliquerFiltres);


// Écoute les changements effectués dans le menu de tri.
// Lorsqu'un nouvel ordre de classement est sélectionné,
// appliquerFiltres() est exécutée pour actualiser les résultats.
sortEl.addEventListener("change", appliquerFiltres);


// Lance le chargement initial des données.
// Cette instruction appelle la fonction chargerDonnees()
// dès que le script arrive à cette ligne.
chargerDonnees();