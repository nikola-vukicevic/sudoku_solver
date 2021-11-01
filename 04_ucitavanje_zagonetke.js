/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

let ZAGONETKA_TEZINA = 5;

// Moj API
/*
let GENERATOR_API_URL = `https://www.sudokublog.rs/generator/`;
let GENERATOR_API_URL = `https://www.sudokublog.rs/generator/sudoku_generator.php?tezina=5`;
let GENERATOR_API_URL = `http://localhost:3000/?tezina=5`;
*/

//let GENERATOR_API_URL = `http://localhost:3000/?tezina=7&rotacija1=da&rotacija2=ne&fliph=ne&flipv=ne&redovi=ne&kolone=ne&blokovi=ne&brojevi=ne`;
let GENERATOR_API_URL = `https://www.sudokublog.rs/api/generator/?tezina=${ZAGONETKA_TEZINA}`;

// Sugoku
// let GENERATOR_API_URL = `https://sugoku.herokuapp.com/board?difficulty=medium`;

function ucitavanjeZagonetkePrompt(sudoku_tabela) {
	if(prikazPorukeHintoviAktivni(sudoku_tabela)) return;
	
	let t1 = prompt("Unesite polja (81 znak - prazna polja se predstavljaju nulom - razmaci su dozvoljeni)");
	
	if(t1 === null) return;

	let t2 = preciscavanjeTekstaZagonekte(t1);
	ucitavanjeZagonetkeIzTeksta(t2, sudoku_tabela);
}

// Kakvo god formatiranje da zagonetka ima, sve se odbacuje osim 81 znaka koji
// odgovaraju strukturi 9x9.

function preciscavanjeTekstaZagonekte(t1) {
	let t2 = "";

	for(let i = 0; i < t1.length; i++) {
		if(t1[i] >= '0' && t1[i] <= '9') {
			t2 += t1[i];
		}
	}

	if(t2.length != BROJ_POLJA) {
		return false;
	}
	else {
		return t2;
	}
}

function ucitavanjeZagonetkeIzTeksta(str, sudoku_tabela) {
	for(let i = 0; i < BROJ_POLJA; i++) {
		sudoku_tabela.zagonetka[i + 1] = parseInt(str[i]);
	}

	resetTabeleTotalni(sudoku_tabela);
	ucitavanjeZagonetkeHardcode(sudoku_tabela.zagonetka, sudoku_tabela);
	azuriranjeDuplikata(sudoku_tabela);
	azuriranjePrikazaTabele(sudoku_tabela, true);
	
	upisNaUndoStek(sudoku_tabela, STEK_GLAVNI);
	localStorageUpis(sudoku_tabela);
}

function ucitavanjeZagonetkeHardcode(polje_zagonetka, sudoku_tabela) {
	for(let i = 0; i <= BROJ_POLJA; i++) {
		if(polje_zagonetka[i] == 0) continue;
		let vrednost = polje_zagonetka[i]
		sudoku_tabela.tabela[i].vrednost   = vrednost;
		sudoku_tabela.tabela[i].fiksno     = true;
		sudoku_tabela.tabela[i].otkrivanje = false;
	}
}

function ucitavanjeZagonetke(polje_zagonetka, sudoku_tabela) {
	let podaci = localStorageCitanjeTabele(sudoku_tabela);

	if(!podaci) {
		ucitavanjeZagonetkeHardcode(polje_zagonetka, sudoku_tabela);
	}
	else {
		kopiranjeStrukture(podaci, sudoku_tabela);
	}
	
	azuriranjeDuplikata(sudoku_tabela);
	localStorageUpis(sudoku_tabela);
}

function citanjeExportTeksta(sudoku_tabela) {
	let s = ``;
	for(let i = 1; i <= BROJ_POLJA; i++) {
		s += sudoku_tabela.tabela[i].vrednost
	}
	return s;
}

function formatiranjeExportTexta_v1(s) {
	let b = 0;
	let s_exp = ``

	for(i = 1; i <= BROJ_BLOKOVA; i++) {
		for(j = 1; j <= BROJ_BLOKOVA; j++) {
			s_exp += s.charAt(b);
			b++;
		}
		
		s_exp += `\n`;
	}

	return s_exp + "\n";
}

function formatiranjeExportTexta_v2(s) {
	let sudoku = {
		tabela: [ ]
	}
	let b     = 0;

	for(i = 1; i <= BROJ_BLOKOVA; i++) {
		let red = [ ];
		for(j = 1; j <= BROJ_BLOKOVA; j++) {
			red.push(parseInt(s.charAt(b)));
			//s_exp += s.charAt(b);
			b++;
		}
		
		sudoku.tabela.push(red);
	}

	return JSON.stringify(sudoku, null, 4)
	            .replace(/,\n            /g, " , ")
	            .replace(/\[\n            /g, "\[ ")
	            .replace(/\n        ],/g, " ] ,")
	            .replace(/\n        ]/g, " ]") + "\n"
}


function formatiranjeExportTexta(sudoku_tabela) {
	let s = citanjeExportTeksta(sudoku_tabela);
	let s_exp = `${s}\n\n`;

	console.log(s)
	s_exp += formatiranjeExportTexta_v1(s);
	s_exp += formatiranjeExportTexta_v2(s);
	// s_exp += formatiranjeExportTexta_v3(s);

	return s_exp;
}

function downloadTabele(/*filename, text*/sudoku_tabela) {
  var element = document.createElement('a');
  //let text = "Pera"
  let text = formatiranjeExportTexta(sudoku_tabela)
  let filename = 'sudoku.txt'
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function obradaDugmeUpisPotvrda(sudoku_tabela) {
	if(!sudoku_tabela.rezimKreiranjaTabele) {
		rucniUpisTabele(sudoku_tabela);
	}
	else {
		potvrdaNoveTabele(sudoku_tabela);
	}
}

function pamcenjePrethodneMatrice(matrica, sudoku_tabela) {
	for(let i = 1; i <= BROJ_POLJA; i++) {
		matrica.push(sudoku_tabela.tabela[i].vrednost);
	}
}

function povratZapamceneMatrice(matrica, sudoku_tabela) {
	for(let i = 1; i <= BROJ_POLJA; i++) {
		let polje = sudoku_tabela.tabela[i]
		sudoku_tabela.tabela[i].vrednost = matrica[i];
		if(polje.vrednost !=0) polje.otkrivanje = false;
	}
}

function rucniUpisTabele(sudoku_tabela) {
	let rez = confirm("Postojeća tabela će biti poništena.\n\nDa li želite da nastavite?");
	if(!rez) return;
	
	sudoku_tabela.rezimKreiranjaTabele = true;
	let dugmeRucniUpis              = document.getElementById("dugme_upis_potvrda");
	
	dugmeRucniUpis.innerText        = "Potvrda nove tabele (w)";
	dugmeRucniUpis.style.background = "#62cb96";
	dugmeRucniUpis.style.color      = "#fff";
	
	let matricaPom = [ 0 ];

	pamcenjePrethodneMatrice(matricaPom, sudoku_tabela); // PAMCENJE
	resetTabeleTotalni(sudoku_tabela);
	povratZapamceneMatrice(matricaPom, sudoku_tabela);   // POVRATAK ZAPAMĆENIH BROJEVA
	azuriranjeDuplikata(sudoku_tabela);
	azuriranjePrikazaTabele(sudoku_tabela, true);
	
	upisNaUndoStek(sudoku_tabela, STEK_GLAVNI);
	localStorageUpis(sudoku_tabela);
}

function cuvanjeTabeleZagonetka(sudoku_tabela) {
	for(let i = 1; i <= BROJ_POLJA; i++) {
		sudoku_tabela.zagonetka[i] = sudoku_tabela.tabela[i].vrednost;
	}
}

function potvrdaNoveTabele(sudoku_tabela) {
	sudoku_tabela.rezimKreiranjaTabele = false;
	let dugmeRucniUpis              = document.getElementById("dugme_upis_potvrda");
	
	dugmeRucniUpis.innerText        = "Ručni upis tabele (w)";
	dugmeRucniUpis.style.background = "#7096c3";
	dugmeRucniUpis.style.color      = "#fff";

	cuvanjeTabeleZagonetka(sudoku_tabela);

	resetTabeleTotalni(sudoku_tabela);
	ucitavanjeZagonetkeHardcode(sudoku_tabela.zagonetka, sudoku_tabela);
	azuriranjeDuplikata(sudoku_tabela);
	azuriranjePrikazaTabele(sudoku_tabela, true);
	
	upisNaUndoStek(sudoku_tabela, STEK_GLAVNI);
	localStorageUpis(sudoku_tabela);	
}

function prebrojavanjePreostalih(sudoku_tabela, prikaz_poruke_reseno) {
	/* ----- Telemetrija ---------------------------------------------------- */
	// let t1 = performance.now();
	/* ---------------------------------------------------------------------- */

	let brojac = BROJ_POLJA;
	let greske = 0;

	for(let i = 1; i <= BROJ_POLJA; i++) {
		let polje = sudoku_tabela.tabela[i];
		if(!polje.otkrivanje) brojac--;
		if(polje.greska)      greske++;
	}

	if(greske > 0) {
		sudoku_tabela.imaLiGresaka = true;
	}
	else {
		sudoku_tabela.imaLiGresaka = false;
	}

	let porukaJezik = (JEZIK_INTERFEJSA == 1)? `Broj preostalih:` : `Remaining cells:`;
	document.getElementById('info_panel_broj_preostalih').innerHTML = `${porukaJezik} ${brojac}`;
	sudoku_tabela.brojPreostalihPolja = brojac;
	if(brojac == 0) proglasavanjeRezultata(sudoku_tabela, prikaz_poruke_reseno);

	/* ----- Telemetrija ---------------------------------------------------- */
	// let t2    = performance.now();
	// let odziv = t2 - t1;
	// console.log(`prebrojavanje preostalih: ${odziv}ms`)
	/* ---------------------------------------------------------------------- */
}

function proglasavanjeRezultata(sudoku_tabela, prikaz_poruke_reseno) {
	if(sudoku_tabela.brojPreostalihPolja > 0) return;
		
	if(sudoku_tabela.imaLiGresaka) {
		alert("Tabela je popunjena, ali, sadrži greške (polja označena crvenom bojom)!");
		return;
	}
	
	if(!sudoku_tabela.cestitkaUpucena && prikaz_poruke_reseno) {
		alert("Čestitamo, tabela je rešena!");
		sudoku_tabela.cestitkaUpucena = true;
	}
}

function zamenaElemenataNiz(i1, i2, niz) {
	let   p = niz[i1];
	niz[i1] = niz[i2];
	niz[i2] = p;
}

function shuffleNiz(niz) {
	for(let i = 0; i < niz.length; i++) {
		let i_rand = Math.floor(Math.random() * (niz.length));
		zamenaElemenataNiz(i, i_rand, niz);
	}
}

function skremblovanjePopunjavanjeMape(niz, mapa) {
	mapa.set(niz[0], niz[1]);
	mapa.set(niz[1], niz[0]);
	
	mapa.set(niz[2], niz[3]);
	mapa.set(niz[3], niz[2]);

	mapa.set(niz[4], niz[5]);
	mapa.set(niz[5], niz[4]);

	mapa.set(niz[6], niz[7]);
	mapa.set(niz[7], niz[6]);
}

function skremblovanjeMatrice(sudoku_tabela) {
	
	/* ----- Telemetrija ---------------------------------------------------- */
	let t1 = performance.now();
	/* ---------------------------------------------------------------------- */

	let nizPom     = [ 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 ];
	let mapa       = new Map();

	shuffleNiz(nizPom);
	skremblovanjePopunjavanjeMape(nizPom, mapa);

	for(let i = 1; i <= BROJ_POLJA; i++) {
		let polje = sudoku_tabela.tabela[i];
		if(mapa.get(polje.vrednost)) {
			polje.vrednost = mapa.get(polje.vrednost);
		}
	}

	//azuriranjeKandidataOsnovno(sudoku_tabela, false);
	iskljucivanjeSvihKandidata(sudoku_tabela)

	// console.log(mapa)

	/* ----- Telemetrija ---------------------------------------------------- */
	// let t2    = performance.now();
	// let odziv = t2 - t1;
	// console.log(`Skremblovanje matrice: ${odziv}ms`)
	// console.log(`-----------------------------------`)
	/* ---------------------------------------------------------------------- */
	azuriranjePrikazaTabele(sudoku_tabela);
}

function generisanjeNoveZagonetke(tezina, sudoku_tabela) {
	/* ----- Telemetrija ---------------------------------------------------- */
	// let t1 = performance.now();
	/* ---------------------------------------------------------------------- */

	console.log(GENERATOR_API_URL)
	console.log(ZAGONETKA_TEZINA)
	
	fetch(GENERATOR_API_URL)
		.then(rez => rez.text())
		.then(tabela => {
			let t2 = preciscavanjeTekstaZagonekte(tabela);
			ucitavanjeZagonetkeIzTeksta(t2, sudoku_tabela);
			//skremblovanjeMatrice(sudoku_tabela);
			//console.log(tabela);
			
			/* ----- Telemetrija ---------------------------------------------------- */
			// let t3 = performance.now();
			// let odziv = t3 - t1;
			// console.log(`Fetch nova zagonetka: ${odziv}ms`);
			/* ---------------------------------------------------------------------- */
		});

}