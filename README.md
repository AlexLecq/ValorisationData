# ValorisationData

## Contexte

Cette application s'inscrit dans le cadre d'un TP IoT, cherchant à valoriser des données provenant d'une source de données libre d'accès.

## Que fait l'application ?

Notre application permet la visualisation des données météorologiques actuelles et des variations de températures, d'humidité et de pression en fonction des quelques plus grandes villes Francaise.

## ![webapp-map](https://github.com/AlexLecq/ValorisationData/blob/master/webapp-map.png)Choix des outils et technologies

- Afin de se rapprocher au maximum du comportement d'un objet connecté, nous utilisons un script **Python** permettant le lien entre la source de données et le **serveur MQTT**
- Nous utilisons **NodeJS** afin de développer l'Application Web, cette technologie propose énormément de librairies afin de répondre facilement aux besoins de l'application et, est régulièrement mise à jour.
- Pour le stockage des données, nous utilisons **MongoDB**, cette technologie NoSQL nous permet de stocker simplement et rapidement les données reçues mais aussi permet une manipulation facile grâce au format **JSON** idéale pour le développement en **JavaScript**.

## Fonctionnement

1. Un script Python est lancé à interval régulier afin de récupérer les données méteo de l'API **OpenWeather**, la ligne de commande permettant de mettre en place la planification de cette tâche se trouve dans le fichier Task.txt
2. Ce script vient **s'abonner** et **publier** les données sur un topic d'un serveur MQTT distant
3. L'application Web vient **s'abonner** au topic et récupérer les données du serveur MQTT
4. Elle les stocke dans une base de données MongoDB avec la date et l'heure de stockage afin d'avoir un historique
5. Ensuite nous récupérons ces données afin de mettre en place la carte de France, avec les taux d'humidité par grande ville
6. Lorsque l'on sélectionne une des villes, un popup apparait et affiche les informations météorologique actuelles, ainsi qu'une variation des températures sur une durée déterminée.

## N.B

- Lancer le serveur depuis le dossier **'webappiot'** avec la commande *npm start*
