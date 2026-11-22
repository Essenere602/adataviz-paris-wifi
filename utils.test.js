
import { describe, test, expect } from "@jest/globals";

import {
  formaterDonnee,
  filtrerParTexte,
  filtrerParEtat,
  trierParNom
} from "./utils.js";

const exemple = {
  idpw: "PW0097",
  nom_site: "Gymnase Marie Paradis",
  arc_adresse: "11 Square Alban Satragne",
  cp: "75010",
  nombre_de_borne_wifi: 1,
  etat2: "Opérationnel",
  geo_point_2d: {
    lon: 2.354,
    lat: 48.875
  }
};

describe("formaterDonnee", () => {
  test("transforme les données de l'API", () => {
    const resultat = formaterDonnee(exemple);

    expect(resultat.nom).toBe("Gymnase Marie Paradis");
    expect(resultat.codePostal).toBe("75010");
    expect(resultat.nombreBornes).toBe(1);
  });
});

describe("filtrerParTexte", () => {
  test("recherche dans le nom", () => {
    const sites = [formaterDonnee(exemple)];

    expect(
      filtrerParTexte(sites, "gymnase")
    ).toHaveLength(1);
  });
});

describe("filtrerParEtat", () => {
  test("filtre les sites opérationnels", () => {
    const sites = [formaterDonnee(exemple)];

    expect(
      filtrerParEtat(sites, "opérationnel")
    ).toHaveLength(1);
  });
});

describe("trierParNom", () => {
  test("trie les noms par ordre alphabétique", () => {
    const sites = [
      { nom: "Piscine" },
      { nom: "Bibliothèque" }
    ];

    expect(
      trierParNom(sites).map(site => site.nom)
    ).toEqual(["Bibliothèque", "Piscine"]);
  });
});
