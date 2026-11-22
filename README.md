
# Adataviz — Paris Wi-Fi

## Lancer le projet

1. Ouvrir le dossier dans Visual Studio Code.
2. Installer l'extension Live Server.
3. Faire clic droit sur index.html.
4. Choisir « Open with Live Server ».

## Lancer les tests

Dans le terminal, à la racine du projet :

npm install
npm test

## API utilisée

https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/sites-disposant-du-service-paris-wi-fi/records?limit=20

## Champs utilisés

- nom_site : nom du lieu
- arc_adresse : adresse
- cp : code postal
- idpw : identifiant
- nombre_de_borne_wifi : nombre de bornes
- etat2 : état du service
- geo_point_2d.lat : latitude
- geo_point_2d.lon : longitude

## Attention aux compteurs

total_count correspond au nombre total d'enregistrements du dataset.

results correspond aux enregistrements renvoyés par la requête.

Avec limit=20, le site affiche au maximum 20 fiches,
même si le dataset contient 316 entrées.

## Architecture

utils.js :
fonctions pures de transformation, filtrage et tri.

main.js :
appel API, async/await, événements et affichage DOM.
