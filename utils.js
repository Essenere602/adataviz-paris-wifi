
export function formaterDonnee(item) {
  return {
    id: item.idpw ?? "Identifiant inconnu",
    nom: item.nom_site ?? "Nom non renseigné",
    adresse: item.arc_adresse ?? "Adresse non renseignée",
    codePostal: item.cp ?? "",
    etat: item.etat2 ?? "État non renseigné",
    nombreBornes: Number(item.nombre_de_borne_wifi ?? 0),
    latitude: item.geo_point_2d?.lat ?? null,
    longitude: item.geo_point_2d?.lon ?? null
  };
}

export function filtrerParTexte(sites, recherche) {
  const terme = recherche.trim().toLowerCase();

  if (!terme) return [...sites];

  return sites.filter(site =>
    `${site.nom} ${site.adresse} ${site.codePostal}`
      .toLowerCase()
      .includes(terme)
  );
}

export function filtrerParEtat(sites, etat) {
  if (etat === "tous") return [...sites];

  return sites.filter(site =>
    site.etat.toLowerCase() === etat
  );
}

export function trierParNom(sites, ordre = "az") {
  return [...sites].sort((a, b) => {
    const comparaison = a.nom.localeCompare(b.nom, "fr");

    return ordre === "za"
      ? -comparaison
      : comparaison;
  });
}
