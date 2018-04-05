// PARTIE 1: Déclaration des variables

// Fichier qui contiendra les donnees
var data;

// Liste des elements du menus
var menu_navs = document.getElementsByClassName("nav-episode");

// Variables ciblant chaque element du menu
var epone_menu = document.getElementById("ep1");
var eptwo_menu = document.getElementById("ep2");
var epthree_menu = document.getElementById("ep3");
var epfour_menu = document.getElementById("ep4");

// Pied de page
var footer = document.getElementsByTagName("footer")[0];

// Liste des criteres de comparaisons qui seront utilises dans le comparateur/ meme noms que ceux du ficier JSON
var criteres = ["title", "synopsis", "director", "writtor", "ratings"];

// Variable ciblant toutes les cellules de la grille
var compar_cells;
var comparator_container;

// Variable qui informe de la presence d'un element dans la premiere et deuxieme colonne
var first_column_empty = true;
var second_column_empty = true;

// Variable qui informe de la nature de l'element chargee
var first_column_episode;
var second_column_episode;

// Nom du fichier json qui sera charge
var fichier;

// Variables qui nforme du chargement d'un element dans la grille
var ep1_loaded = false;
var ep2_loaded = false;
var ep3_loaded = false;
var ep4_loaded = false;

// Cible leséléments du menu principal
var main_menu_elements = document.getElementById("main-menu-elements");
var main_menu_elements_lenght = main_menu_elements.children.length;

//Bande "comparateur" permettant d'afficher le comparateur
var compare_banner = document.getElementById("compare_check");
compare_banner.addEventListener("mouseenter", menuhovered);
compare_banner.addEventListener("mouseout", menuoutted);

//Bande réinitialiser permettant de supprimer le comparateur
var reinit_banner = document.getElementById("reinitialise");
reinit_banner.addEventListener("mouseenter", menuhovered);
reinit_banner.addEventListener("mouseout", menuoutted);

// Variable qui nous informe de la présence ou non du comparateur dans le DOM / true = comparateur absent
var comparator_not_loaded = true;

// Variable Compteur: correspond à la periode de temps apres laquelle la fonction est lancée
var timer;


// PARTIE 2: Déclaration des fonctions

// Chargement des données dans la variable "data" et rajout des informations dans une colonne
function datacharged_and_added(episode_index, colonne) {
  xmlr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      data = JSON.parse(xmlr.responseText);
      // alert("Fichier JSON chargé")
      // console.log(data.project[0].name);
      add_infos(episode_index, colonne)
    };
  };
};

// Fonction permettant d'inserer la grille de comparaison dans la page
function comparateur() {

  console.log("Affichage du comparateur");
  // Creation d'un container dans lequel se trouvera le comparateur
  var divcomparator_container = document.createElement("div");
  divcomparator_container.setAttribute("class", "container");
  divcomparator_container.setAttribute("id", "comparator_parent");

  // Creation de la grille de comparaison
  var divcomparator = document.createElement("div");
  divcomparator.setAttribute("id", "comparator");

  // Boucle qui rajoute 3 cellules par criteres de comparaison dans la grille
  for (i = 0; i < (criteres.length * 3); i++) {
    var emptydiv = document.createElement("div");
    emptydiv.setAttribute("class", "comparator_cell");
    // Inutile, sert de repère dans la grille
    emptydiv.innerHTML = i+1;
    divcomparator.appendChild(emptydiv);
  };

  // Rajout du container dans la page avant l'élément footer
  document.body.insertBefore(divcomparator_container, footer);

  // Rajout de la grille de comparaison dans le container
  divcomparator_container.appendChild(divcomparator);

  // Variable ciblant la grille
  div_comparator = document.getElementById("comparator");

  // Variable ciblant toutes les cellules de la grille
  compar_cells = document.getElementsByClassName("comparator_cell");

  // Div contenant le comparateur
  comparator_container = document.getElementById("comparator_parent");

  // Rajout des criteres dans les cellules de la 1ere colonne
  for (i = 0; i < 15; i += 3) {
    var criteres_fr = ["Titre", "Synopsis", "Directeur", "Auteur", "Critiques"];
    compar_cells[i].innerHTML = criteres_fr[i / 3];
  };

  // Variables donnant des informations sur l'état des colonnes du compararteur
  second_column_empty = true;
  first_column_empty = true;

  // Variables donnant des informations sur le chargement dans le comparateur de chaque épisode
  ep1_loaded = false;
  ep2_loaded = false;
  ep3_loaded = false;
  ep4_loaded = false;

  // Comparateur désormais affiché
  comparator_not_loaded = false;

};

// Fonction qui rajoute les informations en fonction de l'épisode selectionné et de la colonne d'insertion
function add_infos(episode_index, colonne) {

  for (i = colonne; i < 15; i += 3) {
    compar_cells[i].innerHTML = data[criteres[~~(i / 3)]]; // Division entiere qui renvoit 0,1,2,3,4,5 en fonction de i

  };

};

// Fonction qui se declenche lorsque la souris entre dans certains elements
function menuhovered(event) {

  // Remet le compteur a zero
  window.clearTimeout(timer);

  // Utilisation du compteur afin d'enclencher la fonction apres une periode determinee = 1000ms
  timer = window.setTimeout(function () {
    // console.log(event.target.id + " entered");

    // Parcours les éléments du menu
    for (j = 0; j < main_menu_elements_lenght; j++) {

      // Si l'id de l'element à l'origine de l'evenement fait parti du menu et si l'element n'a pas encore été chargé et que le comp existe
      if (event.target.id == main_menu_elements.children[j].getAttribute("id") && window[event.target.id + "_loaded"] == false && comparator_not_loaded == false) {

        fichier = String(event.target.id) + ".json";
        console.log("Fichier = ", fichier);
        xmlr = new XMLHttpRequest();
        xmlr.open("GET", fichier, true);
        xmlr.send();



        // Si la colonne 1 est vide
        if (first_column_empty == true) {
          // Ajouter les infos dans la 1ere colonne
          datacharged_and_added(j, 1);

          // Modification de la variable qui informe que l'episode a été chargé
          window[event.target.id + "_loaded"] = true;

          // Modification de la variable qui informe que la 1ère colonne est occupée
          first_column_empty = false;

          // Enregistre l'id de l'episode qui vient d'etre charge
          first_column_episode = event.target.id;

        }


        // Si la colonne 1 contient déja un épisode et que la 2ème est vide et si l'élément n'a pas encore été chargé
        else if (first_column_empty == false && second_column_empty == true) {
          // Ajouter les infos dans la 2eme colonne
          datacharged_and_added(j, 2);
          // Modification de la variable qui informe que la colonne 2 a été utilisée
          second_column_empty = false;
          // Modification de la variable qui informe du chargement de l'element
          window[event.target.id + "_loaded"] = true;
          // Enregistre l'id de l'episode qui vient d'etre charge
          second_column_episode = event.target.id;
        }

        // Si la colonne 1 contient déja un épisode et que la 2ème aussi et si l'élément n'a pas encore été chargé
        else if (first_column_empty == false && second_column_empty == false) {

          //Var Episode de la 1ere colonne pas charger
          window[first_column_episode + "_loaded"] = false;
          

          // Decaler sur la gauche
          switch_column();
          

          // Ajouter les infos du nouvel element dans la 2eme colonne
          datacharged_and_added(j, 2);

          // Modification de la variable qui informe que la colonne 2 a été utilisée
          second_column_empty = false;
          second_column_episode = event.target.id;

          // Modification de la variable qui informe du chargement de l'element
          window[event.target.id + "_loaded"] = true;
          

        };

      } else if (event.target.id == "compare_check") {

        // Si le comparateur n'est pas encore affiche
        if (comparator_not_loaded == true) {
          // Afficherle comparateur dans le DOM
          comparateur();
          window.clearTimeout(timer);
        }

        // Si l'evenement enclenché est celui de la bande réinitialiser
      } else if (event.target.id == "reinitialise") {

        // Si le comparateur est affiché
        if (comparator_not_loaded == false) {
          window.clearTimeout(timer);
          console.log("Deleting the grid");
          // Supprimer le comparateur du body
          if (document.body.contains(comparator_container)) {
            document.body.removeChild(comparator_container);
            comparator_not_loaded = true;
          }
          window.clearTimeout(timer);
        }
      }


    }
    // Nmbre de ms à partir duquel les évènements sont pris en compte
  }, 1000);

};

function switch_column() {
  for (i = 1; i < 15; i += 3) {
    compar_cells[i].innerHTML = compar_cells[i + 1].innerHTML;
    // console.log("Colonnes inversees !");
  };
  // 1ere colonne devient egale a la deuxieme/ (Episode)
  first_column_episode = second_column_episode;
};


function menuoutted(event) {
  window.clearTimeout(timer);
  timer = window.setTimeout(function () {

    // Si l'evenement enclenché est reinitialiser et si le comparateur 
    if (event.target.id == "reinitialise" && comparator_not_loaded == false) {
      if (document.body.contains(div_comparator)) {

        window.clearTimeout(timer);
      } else {
        comparator_not_loaded = true;
        ep1_loaded = false;
        ep2_loaded = false;
        ep3_loaded = false;
        ep4_loaded = false;
        first_column_empty = true;
        second_column_empty = true;

        window.clearTimeout(timer);
      }


    }
    // Periode avant lancement de la fonction

  }, 1000);

};


//PARTIE 3: LE RESTE

// Rajoute un évenement à chaque elemnent du menu
for (i = 0; i < menu_navs.length; i++) {
  menu_navs[i].addEventListener("mouseenter", menuhovered);
  menu_navs[i].addEventListener("mouseout", menuoutted);
};