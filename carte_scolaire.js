//création du fond de carte:
L.mapquest.key = 'rHx2eSqqhdA4EDSoaqlu1ZjyGMl3Jd6Z';
var carte=L.mapquest.map('carte', {
  center: [48.865631, 2.399635],
  layers: L.mapquest.tileLayer('map'),
  zoom: 12,
  zoomControl: false
});
//carte.createPane('labels');
//carte.getPane('labels').style.zIndex = 650;
//carte.getPane('labels').style.pointerEvents = 'none';
L.control.zoom({position:'bottomleft'}).addTo(carte);

//On affiche la page (éléments html + CSS) uniquement si on peut charger la carte
window.addEventListener("load", function(event) {
  document.body.style.visibility='visible';
});

//chargement des données geojson:
var requete_secteurs_scolaires_colleges;
function chargeJSON() {
  var requeteURL_secteurs_scolaires_colleges="geojson/cartecompacite.geojson";
  requete_secteurs_scolaires_colleges = new XMLHttpRequest();
  requete_secteurs_scolaires_colleges.open('POST', requeteURL_secteurs_scolaires_colleges);
  requete_secteurs_scolaires_colleges.responseType='json';
  requete_secteurs_scolaires_colleges.send();

}
chargeJSON();
requete_secteurs_scolaires_colleges.onload=function() {

//On récupère les éléments html (sauf boutons)
var info=document.getElementById('info');
var college=document.getElementById("college");
var zone_compacite=document.getElementById("zone_compacite");
var compacite=document.getElementById("compacite");
var legende = document.getElementById("legende");

//fonction générale de la page, la page se lance après la fin du chargement des fichiers geojson:

  //création de la carte scolaire:
  var secteurs_scolaires_colleges=requete_secteurs_scolaires_colleges.response;
  console.log(secteurs_scolaires_colleges);

  //Permet de retourner une couleur parmis celles de colorArray suivant l'id de la zone : stylisé la carte scolaire simple
  function getRandomColor(gid) {
    var gid;
    var colorArray=['#F33D15',"#F3A515","#F3F315","#88F315","#15F3DA","#156EF3","#BB15F3","#F315AC","#424041","#E0D9DE"];
    return gid<11? colorArray[0] :
           gid<22? colorArray[1] :
           gid<33? colorArray[2] :
           gid<44? colorArray[3] :
           gid<55? colorArray[4] :
           gid<66? colorArray[5] :
           gid<77? colorArray[6] :
           gid<88? colorArray[7] :
           gid<99? colorArray[8] :
                   colorArray[9];
  }

  //Définie le style de la carte scolaire simple + affectation à la couche
  function style_carte_de_base(feature) {
    return {
      color:"white",
      dashArray:'3',
      opacity:1,
      weight:2,
      fillColor:getRandomColor(feature.properties.gid),
      fillOpacity:0.5
    };
  }
  var carte_secteurs_scolaires_colleges=L.geoJSON(secteurs_scolaires_colleges, {style:style_carte_de_base,onEachFeature: onEachFeature});

  //On créer les différents seuils pour differencier les compacités
  var seuils;
  var seuils_compacite10=[0, 2.0, 2.3, 2.7, 3.0,3.6];
  var seuils_compacite20=[2.3, 2.7, 3.4, 3.9, 4.5,5.8];
  var seuils_compacite50=[3.8,5,7,8.5,10,13.5];
  var seuils_compacite100=[9,10,14,17,21,30.8];

  //Permet d'affilier les couleurs en fonction de la compacité, on choisi les différentes couleurs selon la compacité
  function getColor_compacite(i,num) {
    num==10 ? seuils=seuils_compacite10 :
    num==20 ? seuils=seuils_compacite20 :
    num==50 ? seuils=seuils_compacite50 :
    num==100 ?  seuils=seuils_compacite100 :
    0;
    return i >= seuils[4]   ? '#800026' :
           i >= seuils[3]   ? '#E31A1C' :
           i >= seuils[2]   ? '#FD8D3C' :
           i >= seuils[1]   ? '#FED976' :
                              '#FFFB7C';
  }

  //Créer les différentes légendes pour les diférentes cartes de compacité
  function createLegende(num) {
    legende.innerHTML='';
    if (num==10) {
      seuils=seuils_compacite10;
      legende.style.visibility='visible';
    }
    else if (num==20) {
      seuils=seuils_compacite20;
      legende.style.visibility='visible';
    }
    else if (num==50) {
      seuils=seuils_compacite50;
      legende.style.visibility='visible';
    }
    else if (num==100) {
      seuils=seuils_compacite100;
      legende.style.visibility='visible';
    }
    else {
      legende.style.visibility='hidden';
    }
    for (var i = 0; i < seuils.length-1; i++) {
        legende.innerHTML +='<i style="background:' + getColor_compacite(seuils[i],num) + '"></i> '+ seuils[i] + ' - ' +seuils[i + 1]+'<br>';
    }
  }

  //Définie le style de la carte de compacité à 10m + affectation à la couche
  function style_carte_compacite_10(feature) {
      return {
          fillColor: getColor_compacite(feature.properties.compacite10,10),
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.5
      };
  }
  var carte_compacite_10=L.geoJSON(secteurs_scolaires_colleges, {style:style_carte_compacite_10,onEachFeature: onEachFeature});

  //Définie le style de la carte de compacité à 20m + affectation à la couche
  function style_carte_compacite_20(feature) {
      return {
          fillColor: getColor_compacite(feature.properties.compacite20,20),
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.5
      };
  }
  var carte_compacite_20=L.geoJSON(secteurs_scolaires_colleges, {style: style_carte_compacite_20,onEachFeature: onEachFeature});


  //Définie le style de la carte de compacité à 50m + affectation à la couche
  function style_carte_compacite_50(feature) {
      return {
          fillColor: getColor_compacite(feature.properties.compacite50,50),
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.5
      };
  }
  var carte_compacite_50=L.geoJSON(secteurs_scolaires_colleges, {style:style_carte_compacite_50,onEachFeature: onEachFeature});

  //Définie le style de la carte de compacité à 100m + affectation à la couche
  function style_carte_compacite_100(feature) {
      return {
          fillColor: getColor_compacite(feature.properties.compacite100,100),
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.5
      };
  }
  var carte_compacite_100=L.geoJSON(secteurs_scolaires_colleges, {style:style_carte_compacite_100,onEachFeature: onEachFeature});

  //Les fonctions suivantes servent à mettre en évidence la zone de sorvol de la souris et à modifier les infos

  //Pour entourer la zone au survol
  function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.5
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    modifie_info(layer);
  }

  //Pour retablir le style par defaut après le survol
  function resetHighlight(e) {
    college.innerHTML='Survolez une zone';
    zone_compacite.innerHTML='';
    compacite.innerHTML='';
    quelleCarte=='carte simple' ? carte_secteurs_scolaires_colleges.resetStyle(e.target):
    quelleCarte=='compacite10'  ? carte_compacite_10.resetStyle(e.target):
    quelleCarte=='compacite20'  ? carte_compacite_20.resetStyle(e.target):
    quelleCarte=='compacite50'  ? carte_compacite_50.resetStyle(e.target):
                                  carte_compacite_100.resetStyle(e.target);
  }

  //Pour zoomer sur la zone au click et faire apparaitre le marker du college
  function zoom_plus_apparition_college(e) {
    carte.fitBounds(e.target.getBounds());
    var layer=e.target;
    //addMarker(layer.feature.properties.latCol,layer.feature.properties.longCol,layer.feature.properties.libelle);
  }

  //Pour ajouter le marker du college
  function addMarker(lat,long,coll) {
    var customPopup = L.popup({ closeButton: true })
               .setLatLng([lat,long])
               .setContent("Collège<br>"+coll)
               .openOn(carte);
  }

  //Pour appliquer les fonctions précédentes a chaque zone de chaque couche
  function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click:zoom_plus_apparition_college,
    });
  }

  //Cette fonction sert à modifier la div d'information de la zone de survol de la souris
  function modifie_info(layer){
    if (quelleCarte=='carte simple') {
      college.innerHTML="<h5>"+layer.feature.properties.libelle+"</h5>";
    }
    else if (quelleCarte=='compacite10') {
      college.innerHTML="<h5>"+layer.feature.properties.libelle+"</h5>";
      zone_compacite.innerHTML="<h4>Compacité à 10 mètres :</h4>";
      compacite.innerHTML="<h5>"+arrondi(layer.feature.properties.compacite10)+"</h5>";
      info.style.height="fit-content";
    }
    else if (quelleCarte=='compacite20') {
      college.innerHTML="<h5>"+layer.feature.properties.libelle+"</h5>";
      zone_compacite.innerHTML="<h4>Compacité à 20 mètres :</h4>";
      compacite.innerHTML="<h5>"+arrondi(layer.feature.properties.compacite20)+"</h5>";
      info.style.height="fit-content";
    }
    else if (quelleCarte=='compacite50') {
      college.innerHTML="<h5>"+layer.feature.properties.libelle+"</h5>";
      zone_compacite.innerHTML="<h4>Compacité à 50 mètres :</h4>";
      compacite.innerHTML="<h5>"+arrondi(layer.feature.properties.compacite50)+"</h5>";
      info.style.height="fit-content";
    }
    else if (quelleCarte=='compacite100') {
      college.innerHTML="<h5>"+layer.feature.properties.libelle+"</h5>";
      zone_compacite.innerHTML="<h4>Compacité à 100 mètres :</h4>";
      compacite.innerHTML="<h5>"+arrondi(layer.feature.properties.compacite100)+"</h5>";
      info.style.height="fit-content";
    }
  }

  //Apres le chargement de la carte scolaire est affichée:
  afficher_carte_simple();
  //On informe aussi qu'il faut survolez une zone pour obtenir ses informations
  college.innerHTML='Survolez une zone';
  info.style.height="35px";

  //Ecoute des diferents boutons radio pour detecter changement de carte:
  //Ecoute le bouton qui demande la carte simple et demande d'afficher la carte simple
  var carte_simple=document.getElementById('carte_simple');
  carte_simple.addEventListener('click',afficher_carte_simple);

  //Ecoute le bouton qui demande la carte de compacité à 10m et demande d'afficher la carte de compacité à 10m
  var compacite10=document.getElementById('compacite10');
  compacite10.addEventListener('click',afficher_compacite10);

  //Ecoute le bouton qui demande la carte de compacité à 20m et demande d'afficher la carte de compacité à 20m
  var compacite20=document.getElementById('compacite20');
  compacite20.addEventListener('click',afficher_compacite20);

  //Ecoute le bouton qui demande la carte de compacité à 50m et demande d'afficher la carte de compacité à 50m
  var compacite50=document.getElementById('compacite50');
  compacite50.addEventListener('click',afficher_compacite50);

  //Ecoute le bouton qui demande la carte de compacité à 100m et demande d'afficher la carte de compacité à 100m
  var compacite100=document.getElementById('compacite100');
  compacite100.addEventListener('click',afficher_compacite100);
  var quelleCarte="carte simple";

  //Les fonctions suivantes affichent la nouvelle carte demandée avec les radios bouttons, après avoir supprimé l'ancienne carte et l'ancienne légende
  //Affiche la carte scolaire simple
  function afficher_carte_simple() {
    quelleCarte="carte simple";
    supprime_couche_prec();
    carte_secteurs_scolaires_colleges.addTo(carte);
    createLegende(0);
    info.style.height="35px";
  }
  //Affiche la carte de compacité à 10m
  function afficher_compacite10() {
    quelleCarte="compacite10";
    supprime_couche_prec();
    createLegende(10);
    carte_compacite_10.addTo(carte);
  }
  //Affiche la carte de compacité à 20m
  function afficher_compacite20() {
    quelleCarte="compacite20";
    supprime_couche_prec();
    createLegende(20);
    carte_compacite_20.addTo(carte);
  }
  //Affiche la carte de compacité à 50m
  function afficher_compacite50() {
    quelleCarte="compacite50";
    supprime_couche_prec();
    createLegende(50);
    carte_compacite_50.addTo(carte);
  }
  //Affiche la carte de compacité à 100m
  function afficher_compacite100() {
    quelleCarte="compacite100";
    supprime_couche_prec();
    createLegende(100);
    carte_compacite_100.addTo(carte);
  }

  //Permet de supprimer la carte précédente et sa légende
  function supprime_couche_prec() {
    carte.eachLayer(function(layer){
      if (layer.mapType!='map') {
        carte.removeLayer(layer);
      }
    });
  }

  //Permet d'arrondir à deux chifres apres la virgules les compacités
  function arrondi(nbr) {
    var nbr;
    var arrondi = nbr*100;
    arrondi = Math.round(arrondi);
    arrondi = arrondi/100;
    return arrondi;
  }
}
