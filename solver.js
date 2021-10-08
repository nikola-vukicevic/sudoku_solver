/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

let BROJ_REDOVA  = 3;
let BROJ_KOLONA  = 3;
let BROJ_BLOKOVA = 9;
let BROJ_POLJA   = 81;

let STEK_GLAVNI = {
	stekUndo:         [ ] ,
	stekRedo:         [ ] ,
};

let sudoku_tabela = {
    aktivnoPolje:             0 ,
    aktivniKandidatKlik:      0 ,
    aktivniKandidatDupliKlik: 0 ,
    iskljuceniKandidat:       0 ,
    iskljuceniKandidatTip:    0 ,
    automatskoAzuriranje:     true ,

	tabela: [ ] , // GLAVNA TABELA - popunjava se preko funkcija
                  // generisanjePolja i generisanjeTabele

    zagonetka:  [
		0 ,
		6 , 3 , 7 , 0 , 0 , 0 , 0 , 8 , 1 ,
		0 , 2 , 0 , 0 , 0 , 3 , 0 , 0 , 0 ,
		0 , 0 , 0 , 0 , 1 , 7 , 4 , 3 , 0 ,
		2 , 9 , 6 , 4 , 0 , 0 , 5 , 7 , 0 ,
		0 , 0 , 0 , 7 , 6 , 2 , 0 , 0 , 0 ,
		0 , 8 , 0 , 0 , 0 , 0 , 6 , 2 , 0 ,
		0 , 6 , 0 , 0 , 2 , 0 , 0 , 0 , 0 ,
		3 , 0 , 9 , 0 , 0 , 0 , 0 , 6 , 0 ,
		0 , 0 , 2 , 0 , 0 , 0 , 0 , 0 , 9 ,
	] ,
	
	redovi: [
		[  ] ,
		[  1,  2,  3,  4,  5,  6,  7,  8,  9 ] ,
		[ 10, 11, 12, 13, 14, 15, 16, 17, 18 ] ,
		[ 19, 20, 21, 22, 23, 24, 25, 26, 27 ] ,
		
		[ 28, 29, 30, 31, 32, 33, 34, 35, 36 ] ,
		[ 37, 38, 39, 40, 41, 42, 43, 44, 45 ] ,
		[ 46, 47, 48, 49, 50, 51, 52, 53, 54 ] ,
		
		[ 55, 56, 57, 58, 59, 60, 61, 62, 63 ] ,
		[ 64, 65, 66, 67, 68, 69, 70, 71, 72 ] ,
		[ 73, 74, 75, 76, 77, 78, 79, 80, 81 ] ,
	] ,

	kolone: [
		[  ] ,
		[  1,  10,  19,  28,  37,  46,  55,  64,  73 ] ,
		[  2,  11,  20,  29,  38,  47,  56,  65,  74 ] ,
		[  3,  12,  21,  30,  39,  48,  57,  66,  75 ] ,

		[  4,  13,  22,  31,  40,  49,  58,  67,  76 ] ,
		[  5,  14,  23,  32,  41,  50,  59,  68,  77 ] ,
		[  6,  15,  24,  33,  42,  51,  60,  69,  78 ] ,

		[  7,  16,  25,  34,  43,  52,  61,  70,  79 ] ,
		[  8,  17,  26,  35,  44,  53,  62,  71,  80 ] ,
		[  9,  18,  27,  36,  45,  54,  63,  72,  81 ] ,
	] ,

	blokovi: [
		[  ] ,
		[  1,  2,  3, 10, 11, 12, 19, 20, 21 ] ,
		[  4,  5,  6, 13, 14, 15, 22, 23, 24 ] ,
		[  7,  8,  9, 16, 17, 18, 25, 26, 27 ] ,
		
		[ 28, 29, 30, 37, 38, 39, 46, 47, 48 ] ,
		[ 31, 32, 33, 40, 41, 42, 49, 50, 51 ] ,
		[ 34, 35, 36, 43, 44, 45, 52, 53, 54 ] ,
		
		[ 55, 56, 57, 64, 65, 66, 73, 74, 75 ] ,
		[ 58, 59, 60, 67, 68, 69, 76, 77, 78 ] ,
		[ 61, 62, 63, 70, 71, 72, 79, 80, 81 ] ,
	] ,

	duplikati_redovi: [
		[ ] ,
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , //  1  2  3  4  5  6  7  8  9
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , // 10 11 12 13 14 15 16 17 18
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , // 19 20 21 22 23 24 25 26 27
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , // 28 29 30 31 32 33 34 35 36
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , // 37 38 39 40 41 42 43 44 45
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , // 46 47 48 49 50 51 52 53 54
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , // 55 56 57 58 59 60 61 62 63
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , // 64 65 66 67 68 69 70 71 72
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , // 73 74 75 76 77 78 79 80 81
	] ,

	duplikati_kolone: [
		[ ] ,
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , //  1 10 19 28 37 46 55 64 73
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , //  2 11 20 29 38 47 56 65 74
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , //  3 12 21 30 39 48 57 66 75
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , //  4 13 22 31 40 49 58 67 76
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , //  5 14 23 32 41 50 59 68 77
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , //  6 15 24 33 42 51 60 69 78
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , //  7 16 25 34 43 52 61 70 79
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , //  8 17 26 35 44 53 62 71 80
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , //  9 18 27 36 45 54 63 72 81
	] ,

	duplikati_blokovi: [
		[ ] ,
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , //  1  2  3 10 11 12 19 20 21
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , //  4  5  6 13 14 15 22 23 24
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , //  7  8  9 16 17 18 25 26 27
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , // 28 29 30 37 38 39 46 47 48
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , // 31 32 33 40 41 42 49 50 51
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , // 34 35 36 43 44 45 52 53 54
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , // 55 56 57 64 65 66 73 74 75
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , // 58 59 60 67 68 69 76 77 78
		[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ] , // 61 62 63 70 71 72 79 80 81
	] ,
}

function generisanjePolja() {
	let polje = {
		indeks:      -1 ,
		vrednost:    0 ,
		kandidati:   [ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ] ,
		//kandidati:   [ 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 ] ,
		kandidati_1: [ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ] ,
		kandidati_2: [ 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 , 1 ] ,
		otkrivanje:  true  ,
		fiksno:      false ,
		greska:      false ,
		okvir:       false ,
	};

	return polje;
}

function generisanjeTabele(tabela) {
	for(let i = 0; i <= BROJ_POLJA; i++) {
		let polje = generisanjePolja();
		polje.indeks = i;
		tabela.push(polje);
	}
}

function azuriranjeDuplikataRedovi(sudoku_tabela, red_struktura, red_indeks) {
	for(let i = 0; i < BROJ_BLOKOVA; i++) {
		let polje    = red_struktura[i];
		let vrednost = sudoku_tabela.tabela[polje].vrednost;
		if(vrednost == 0) continue;
		sudoku_tabela.duplikati_redovi[red_indeks][vrednost]++;
	}
}

function azuriranjeDuplikataKolone(sudoku_tabela, kolona_struktura, kolona_indeks) {
	for(let i = 0; i < BROJ_BLOKOVA; i++) {
		let polje    = kolona_struktura[i];
		let vrednost = sudoku_tabela.tabela[polje].vrednost;
		if(vrednost == 0) continue;
		sudoku_tabela.duplikati_kolone[kolona_indeks][vrednost]++;
	}
}

function azuriranjeDuplikataBlokovi(sudoku_tabela, blok_struktura, blok_indeks) {
	for(let i = 0; i < BROJ_BLOKOVA; i++) {
		let polje    = blok_struktura[i];
		let vrednost = sudoku_tabela.tabela[polje].vrednost;
		if(vrednost == 0) continue;
		sudoku_tabela.duplikati_blokovi[blok_indeks][vrednost]++;
	}
}

function resetDuplikata(sudoku_tabela) {
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		for(let j = 0; j <= BROJ_BLOKOVA; j++) {
			sudoku_tabela.duplikati_redovi[i][j]  = 0;
			sudoku_tabela.duplikati_kolone[i][j]  = 0;
			sudoku_tabela.duplikati_blokovi[i][j] = 0;
		}
	}
}

function azuriranjeDuplikata(sudoku_tabela) {
	resetDuplikata(sudoku_tabela);
	
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let red = sudoku_tabela.redovi[i]
		azuriranjeDuplikataRedovi(sudoku_tabela, red, i);
	}

	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let kolona = sudoku_tabela.kolone[i]
		azuriranjeDuplikataKolone(sudoku_tabela, kolona, i);
	}

	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let blok = sudoku_tabela.blokovi[i]
		azuriranjeDuplikataBlokovi(sudoku_tabela, blok, i);
	}
}

function proveraResenjaJedanRed(sudoku_tabela, red_indeks) {
	let red_duplikati   = sudoku_tabela.duplikati_redovi[red_indeks];
	let lista_duplikata = [ ];
	
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		if(red_duplikati[i] > 1) {
			lista_duplikata.push(i);
		}
	}

	for(let i = 0; i < BROJ_BLOKOVA; i++) {
		let polje = sudoku_tabela.tabela[sudoku_tabela.redovi[red_indeks][i]];
		polje.greska = false;
	}

	while(lista_duplikata.length > 0) {
		let duplikat  = lista_duplikata[lista_duplikata.length - 1];
		let red_polja = sudoku_tabela.redovi[red_indeks];

		for(let i = 0; i < BROJ_BLOKOVA; i++) {
			let polje = sudoku_tabela.tabela[red_polja[i]];
			if(polje.vrednost == duplikat) {
				polje.greska = true;
			}
		}

		lista_duplikata.pop();
	}
}

function proveraResenjaRedovi(sudoku_tabela) {
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		proveraResenjaJedanRed(sudoku_tabela, i);
	}
}

function proveraResenjaJednaKolona(sudoku_tabela, kolona_indeks) {
	let kolona_duplikati = sudoku_tabela.duplikati_kolone[kolona_indeks];
	let lista_duplikata  = [ ];
	
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		if(kolona_duplikati[i] > 1) {
			lista_duplikata.push(i);
		}
	}
	
	/* ---- Nema ažuriranja duplikata! ----- */

	while(lista_duplikata.length > 0) {
		let duplikat     = lista_duplikata[lista_duplikata.length - 1];
		let kolona_polja = sudoku_tabela.kolone[kolona_indeks];

		for(let i = 0; i < BROJ_BLOKOVA; i++) {
			let polje = sudoku_tabela.tabela[kolona_polja[i]];
			if(polje.vrednost == duplikat) {
				polje.greska = true;
			}
		}

		lista_duplikata.pop();
	}
}

function proveraResenjaKolone(sudoku_tabela) {
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		proveraResenjaJednaKolona(sudoku_tabela, i);
	}
}

function proveraResenjaJedanBlok(sudoku_tabela, blok_indeks) {
	let blok_duplikati  = sudoku_tabela.duplikati_blokovi[blok_indeks];
	let lista_duplikata = [ ];
	
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		if(blok_duplikati[i] > 1) {
			lista_duplikata.push(i);
		}
	}
	
	/* ---- Nema ažuriranja duplikata! ----- */

	while(lista_duplikata.length > 0) {
		let duplikat   = lista_duplikata[lista_duplikata.length - 1];
		let blok_polja = sudoku_tabela.blokovi[blok_indeks];

		for(let i = 0; i < BROJ_BLOKOVA; i++) {
			let polje = sudoku_tabela.tabela[blok_polja[i]];
			if(polje.vrednost == duplikat) {
				polje.greska = true;
			}
		}

		lista_duplikata.pop();
	}
}

function proveraResenjaBlokovi(sudoku_tabela) {
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		proveraResenjaJedanBlok(sudoku_tabela, i);
	}
}


function proveraResenja(sudoku_tabela) {
	
	proveraResenjaRedovi(sudoku_tabela);
	proveraResenjaKolone(sudoku_tabela);
	proveraResenjaBlokovi(sudoku_tabela);

}

function resetFiksnogPolja(polje) {
	polje.greska = false;
	polje.okvir  = false;
}

function resetPolja(polje) {
	for(let i = 0; i < polje.kandidati.length; i++) {
		polje.kandidati[i] = 0; // Reset  kandidata
	}

	polje.vrednost   = 0;	
	polje.otkrivanje = true;
	polje.fiksno     = false;
	polje.greska     = false;
	polje.okvir      = false;
}

function resetTabeleTotalni(sudoku_tabela) {
	resetDuplikata(sudoku_tabela);

	for(let i = 1; i <= BROJ_POLJA; i++) {
		resetPolja(sudoku_tabela.tabela[i]);
	}
}

function resetTabele(sudoku_tabela) {
	resetDuplikata(sudoku_tabela);
	
	for(let i = 1; i <= BROJ_POLJA; i++) {
		if(sudoku_tabela.tabela[i].fiksno) {
			resetFiksnogPolja(sudoku_tabela.tabela[i]);
			continue;
		}
		resetPolja(sudoku_tabela.tabela[i]);
	}
	
	azuriranjePrikazaTabele(sudoku_tabela, true);

	upisNaUndoStek(sudoku_tabela, STEK_GLAVNI);
	localStorageUpis(sudoku_tabela);
}

function kopiranjeStrukture(t1, t2) {

	/* ---- obična polja ---------------------------------------------------- */

	t2.aktivnoPolje             = t1.aktivnoPolje;
	t2.aktivniKandidatKlik      = t1.aktivniKandidatKlik;
	t2.aktivniKandidatDupliKlik = t1.aktivniKandidatDupliKlik;
	t2.iskljuceniKandidat       = t1.iskljuceniKandidat;

	/* ----- nizovi --------------------------------------------------------- */

	t2.tabela                   = t1.tabela;
	//t2.zagonetka                = t1.zagonetka.map(x => x);
	//t2.redovi                   = t1.redovi.map(x =>    x);
	//t2.kolone                   = t1.kolone.map(x =>    x);
	//t2.blokovi                  = t1.blokovi.map(x =>   x);
	//t2.duplikati_redovi         = t1.redovi.map(x =>    x);
	//t2.duplikati_kolone         = t1.kolone.map(x =>    x);
	//t2.duplikati_blokovi        = t1.blokovi.map(x =>   x);
}

function localStorageCitanje() {
	if(localStorage.getItem("podaci") === null) return false;

	let json_podaci = localStorage.getItem("podaci");
	let podaci      = JSON.parse(json_podaci)
	tabela          = podaci
	return podaci;
}

function ucitavanjeZagonetkePrompt(sudoku_tabela) {
	let t1 = prompt("Unesite polja (81 znak - prazna polja se predstavljaju nulom - razmaci su dozvoljeni)");
	let t2 = "";

	for(let i = 0; i < t1.length; i++) {
		if(t1[i] >= '0' && t1[i] <= '9') {
			t2 += t1[i];
		}
	}

	if(t2.length != BROJ_POLJA) return;


	for(let i = 0; i < BROJ_POLJA; i++) {
		sudoku_tabela.zagonetka[i + 1] = t2[i];
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
	let podaci = localStorageCitanje(sudoku_tabela);

	if(!podaci) {
		ucitavanjeZagonetkeHardcode(polje_zagonetka, sudoku_tabela);
	}
	else {
		kopiranjeStrukture(podaci, sudoku_tabela);
	}
	
	azuriranjeDuplikata(sudoku_tabela);
	localStorageUpis(sudoku_tabela);
}

function prikazPoljaKandidati(polje) {
	let poljeHTML       = document.getElementById(`sudoku_polje_${polje.indeks}`);
	poljeHTML.outerHTML = generisanjeHTMLPolja(polje.indeks);
	
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let kandidatHTML = document.getElementById(`sudoku_polje_kandidat_${polje.indeks}_${i}`);
		
		kandidatHTML.classList.remove("sudoku_polje_kandidat_toggle");
		kandidatHTML.classList.remove("sudoku_polje_kandidat_par_toggle");
		kandidatHTML.classList.remove("sudoku_polje_kandidat_solver_1");
		kandidatHTML.classList.remove("sudoku_polje_kandidat_solver_2");
		
		switch(polje.kandidati[i]) {
			case 1: kandidatHTML.classList.add("sudoku_polje_kandidat_toggle");     break;
			case 2: kandidatHTML.classList.add("sudoku_polje_kandidat_par_toggle"); break;
			case 3: kandidatHTML.classList.add("sudoku_polje_kandidat_solver_1");   break;
			case 4: kandidatHTML.classList.add("sudoku_polje_kandidat_solver_2");   break;
			default: break;
		}
	}
}

/* -------------------------------------------------------------------------- */
// STEK
/* -------------------------------------------------------------------------- */

function praznjenjeRedoSteka(stek_glavni) {
	while(stek_glavni.stekRedo.length > 0) {
		stek_glavni.stekRedo.pop();
	}
}

function ocitavanjeUndoSteka(sudoku_tabela, stek_glavni) {
	//if(stek_glavni.stekRedo.length == 0) return;
	if(stek_glavni.stekUndo.length == 0) return;

	let json_podaci = stek_glavni.stekUndo[stek_glavni.stekUndo.length - 1];
	let podaci      = JSON.parse(json_podaci);

	kopiranjeStrukture(podaci, sudoku_tabela);
	azuriranjePrikazaTabele(sudoku_tabela, false);

	console.log("STEK_OCITAVANJE")
	console.log(`undoStek - br. elemenata: ${stek_glavni.stekUndo.length}`);
	console.log("------------------------------");
}

function upisNaUndoStek(sudoku_tabela, stek_glavni) {
	praznjenjeRedoSteka(stek_glavni);
	let json_podaci = JSON.stringify(sudoku_tabela);
	stek_glavni.stekUndo.push(json_podaci);
	
	console.log("STEK_UPIS")
	console.log(`undoStek - br. elemenata: ${stek_glavni.stekUndo.length}`);
	console.log("------------------------------");
}

function undo(sudoku_tabela, stek_glavni) {
	if(stek_glavni.stekUndo.length == 0) return;

	let json_podaci = stek_glavni.stekUndo[stek_glavni.stekUndo.length - 1];
	stek_glavni.stekUndo.pop();
	stek_glavni.stekRedo.push(json_podaci);

	ocitavanjeUndoSteka(sudoku_tabela, stek_glavni);
}

function redo(sudoku_tabela, stek_glavni) {
	if(stek_glavni.stekRedo.length == 0) return;

	let json_podaci = stek_glavni.stekRedo[stek_glavni.stekRedo.length - 1];
	stek_glavni.stekRedo.pop();
	stek_glavni.stekUndo.push(json_podaci);

	ocitavanjeUndoSteka(sudoku_tabela, stek_glavni);
}

function localStorageUpis(sudoku_tabela) {
	let json_podaci = JSON.stringify(sudoku_tabela);
	localStorage.setItem("podaci", json_podaci);
}

function ukljucivanjeSvihKandidataPolje(polje) {
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		if(polje.kandidati[i] == 0) {
			polje.kandidati[i] = 1;
		}
	}
}

function iskljucivanjeSvihKandidataPolje(polje) {
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		polje.kandidati[i] = 0;
	}
}

function azuriranjeKandidataUkljucivanjeSvihKandidata(sudoku_tabela) {
	for(let i = 1; i <= BROJ_POLJA; i++) {
		let polje = sudoku_tabela.tabela[i];
		ukljucivanjeSvihKandidataPolje(polje);
	}
}

function iskljucivanjeSvihKandidata(sudoku_tabela) {
	for(let i = 1; i <= BROJ_POLJA; i++) {
		let polje = sudoku_tabela.tabela[i];
		iskljucivanjeSvihKandidataPolje(polje);
	}

	azuriranjePrikazaTabele(sudoku_tabela, true);

	upisNaUndoStek(sudoku_tabela, STEK_GLAVNI);
	localStorageUpis(sudoku_tabela);
}

function iskljucivanjeJednogKandidataOznacavanje(sudoku_tabela, polje, kandidat_br) {
	if(polje.kandidati[kandidat_br] > 0) {
		polje.kandidati[kandidat_br] = 3; // Možda bezuslovno, mada, verovatno ne!
	}
}

function iskljucivanjeJednogKandidataIskljucivanje(sudoku_tabela, polje, kandidat_br) {
	polje.kandidati[kandidat_br] = 0;
}

// Funkcija azuriranjeKandidataOsnovnoPretragaVrednosti, pronalazi uključena
// polja u okviru jednog reda / kolone / bloka, ali ....

function azuriranjeKandidataOsnovnoPretragaVrednosti(sudoku_tabela, niz, rezim) {
	for(let i = 0; i < BROJ_BLOKOVA; i++) {
		let poljeBr = niz[i];
		let polje   = sudoku_tabela.tabela[poljeBr];
		if(polje.vrednost > 0) {
			azuriranjeKandidataOsnovnoIskljucivanjeKandidata(sudoku_tabela, niz, polje.vrednost, rezim);
		}
	}
}

// Funkcija azuriranjeKandidataOsnovnoIskljucivanjeKandidata je ta koja zapravo
// isključuje kandidate!

function azuriranjeKandidataOsnovnoIskljucivanjeKandidata(sudoku_tabela, niz, vrednost, rezim) {
	for(let i = 0; i < BROJ_BLOKOVA; i++) {
		let poljeBr = niz[i];
		let polje   = sudoku_tabela.tabela[poljeBr];
		if(polje.vrednost == 0) {
			switch(rezim) {
				case 1: iskljucivanjeJednogKandidataOznacavanje(sudoku_tabela, polje, vrednost);   break;
				case 2: iskljucivanjeJednogKandidataIskljucivanje(sudoku_tabela, polje, vrednost); break;
				default: break;
			}
		}
	}
}

// Funkcija azuriranjeKandidataOsnovnoRedovi prolazi kroz sve redove, ali, ne
// obavlja posao oko pojedinačnog reda (već poziva odgovarajuću funkciju)

function azuriranjeKandidataOsnovnoRedovi(sudoku_tabela, rezim) {
	let redovi = sudoku_tabela.redovi;
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let red = redovi[i];
		azuriranjeKandidataOsnovnoPretragaVrednosti(sudoku_tabela, red, rezim);
	}
}

// Funkcija azuriranjeKandidataOsnovnoKolone prolazi kroz sve kolone, ali, ne
// obavlja posao oko pojedinačne kolone (već poziva odgovarajuću funkciju)


function azuriranjeKandidataOsnovnoKolone(sudoku_tabela, rezim) {
	let kolone = sudoku_tabela.kolone;
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let kolona = kolone[i];
		azuriranjeKandidataOsnovnoPretragaVrednosti(sudoku_tabela, kolona, rezim);
	}
}

// Funkcija azuriranjeKandidataOsnovnoKolone prolazi kroz sve kolone, ali, ne
// obavlja posao oko pojedinačne kolone (već poziva odgovarajuću funkciju)


function azuriranjeKandidataOsnovnoBlokovi(sudoku_tabela, rezim) {
	let blokovi = sudoku_tabela.blokovi;
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let blok = blokovi[i];
		azuriranjeKandidataOsnovnoPretragaVrednosti(sudoku_tabela, blok, rezim);
	}
}

// Osnovno ažuriranje podrazumeva isključivanje kandidata (u svim poljima sa
// kandidatima) koji su u istom redu, kkoloni, ili bloku, sa već uključenim
// poljima (bilo fiksnim, bilo onima koje je korisnik isključio)

function azuriranjeKandidataOsnovno(sudoku_tabela, na_dugme) {
	
	/* ----- telemetrija ---------------------------------------------------- */
	let t1 = performance.now();
	/* ---------------------------------------------------------------------- */
	

	rezim = 2; // 1 - oznacavanje kandidata crvenom; 2 - uklanjanje
	if(na_dugme) azuriranjeKandidataUkljucivanjeSvihKandidata(sudoku_tabela);
	azuriranjeKandidataOsnovnoRedovi(sudoku_tabela, rezim);
	azuriranjeKandidataOsnovnoKolone(sudoku_tabela, rezim);
	azuriranjeKandidataOsnovnoBlokovi(sudoku_tabela, rezim);

	azuriranjePrikazaTabele(sudoku_tabela, true);

	upisNaUndoStek(sudoku_tabela, STEK_GLAVNI);
	localStorageUpis(sudoku_tabela);
	
	/* ----- telemetrija ---------------------------------------------------- */
	let t2 = performance.now();
	let odziv = t2 - t1 + "ms";
	console.log(`Osnovno isključivanje kandidata - ${odziv}`)
	/* ---------------------------------------------------------------------- */
}

function generisanjeHintova(sudoku_tabela) {
	let json_podaci = JSON.stringify(sudoku_tabela);
}

function azuriranjePrikazaPolja(sudoku_tabela, id) {
	let polje     = sudoku_tabela.tabela[id];
	let poljeHTML = document.getElementById(`sudoku_polje_${id}`);
	let kandidati = polje.kandidati;


	if(polje.otkrivanje) {
		prikazPoljaKandidati(polje);
	}
	else {
		poljeHTML.innerHTML = polje.vrednost;
		
		poljeHTML.classList.remove("sudoku_polje_fiksno");
		poljeHTML.classList.remove("sudoku_polje_greska");
		poljeHTML.classList.remove("sudoku_polje_okvir");
		
		if(polje.fiksno) {
			poljeHTML.classList.add("sudoku_polje_fiksno");
		}
		
		if(polje.greska) {
			poljeHTML.classList.add("sudoku_polje_greska");
		}

		if(polje.okvir) {
			poljeHTML.classList.add("sudoku_polje_okvir");
		}
	}
}

function azuriranjePrikazaTabele(sudoku_tabela, provera) {
	/* ----- telemetrija ---------------------------------------------------- */
	let t1 = performance.now();
	/* ---------------------------------------------------------------------- */

	if(provera) {
		azuriranjeDuplikata(sudoku_tabela);
		proveraResenja(sudoku_tabela);
	}
	
	for(let i = 1; i <= BROJ_POLJA; i++) {
		azuriranjePrikazaPolja(sudoku_tabela, i);
	}

	localStorageUpis(sudoku_tabela);

	/* ----- telemetrija ---------------------------------------------------- */
	let t2 = performance.now();
	let odziv = t2 - t1 + "ms";
	console.log(`Ažuriranje tabele - ${odziv}`)
	/* ---------------------------------------------------------------------- */
}

function generisanjeHTMLPolja(id) {
	let sablon = `<div class='sudoku_polje iskljucena_selekcija' id='sudoku_polje_${id}' ondblclick='poljeDupliKlik(event, sudoku_tabela, ${id}, 0)'>
	<div class='sudoku_polje_kandidat' id='sudoku_polje_kandidat_${id}_1' onclick='obradaKlika(event, sudoku_tabela, ${id}, 1)' oncontextmenu='toggleParKandidata(event, sudoku_tabela, ${id}, 1)'>1</div>
	<div class='sudoku_polje_kandidat' id='sudoku_polje_kandidat_${id}_2' onclick='obradaKlika(event, sudoku_tabela, ${id}, 2)' oncontextmenu='toggleParKandidata(event, sudoku_tabela, ${id}, 2)'>2</div>
	<div class='sudoku_polje_kandidat' id='sudoku_polje_kandidat_${id}_3' onclick='obradaKlika(event, sudoku_tabela, ${id}, 3)' oncontextmenu='toggleParKandidata(event, sudoku_tabela, ${id}, 3)'>3</div>
	
	<div class='sudoku_polje_kandidat' id='sudoku_polje_kandidat_${id}_4' onclick='obradaKlika(event, sudoku_tabela, ${id}, 4)' oncontextmenu='toggleParKandidata(event, sudoku_tabela, ${id}, 4)'>4</div>
	<div class='sudoku_polje_kandidat' id='sudoku_polje_kandidat_${id}_5' onclick='obradaKlika(event, sudoku_tabela, ${id}, 5)' oncontextmenu='toggleParKandidata(event, sudoku_tabela, ${id}, 5)''>5</div>
	<div class='sudoku_polje_kandidat' id='sudoku_polje_kandidat_${id}_6' onclick='obradaKlika(event, sudoku_tabela, ${id}, 6)' oncontextmenu='toggleParKandidata(event, sudoku_tabela, ${id}, 6)'>6</div>
	
	<div class='sudoku_polje_kandidat' id='sudoku_polje_kandidat_${id}_7' onclick='obradaKlika(event, sudoku_tabela, ${id}, 7)' oncontextmenu='toggleParKandidata(event, sudoku_tabela, ${id}, 7)'>7</div>
	<div class='sudoku_polje_kandidat' id='sudoku_polje_kandidat_${id}_8' onclick='obradaKlika(event, sudoku_tabela, ${id}, 8)' oncontextmenu='toggleParKandidata(event, sudoku_tabela, ${id}, 8)'>8</div>
	<div class='sudoku_polje_kandidat' id='sudoku_polje_kandidat_${id}_9' onclick='obradaKlika(event, sudoku_tabela, ${id}, 9)' oncontextmenu='toggleParKandidata(event, sudoku_tabela, ${id}, 9)'>9</div>
</div>`;
	
	return sablon;
}

function generisanjeHTMLBloka(blok, blok_id) {
	let sadrzaj = "";
		
	blok.forEach(polje => {
		sadrzaj += generisanjeHTMLPolja(polje);
	});

	let sablon = `<div class='sudoku_blok' id='sudoku_blok_${blok_id}'>
	${sadrzaj}
</div>`
	
	return sablon;
}

function generisanjeHTMLTabele(id_tabela, blokovi) {
	let polje   = document.getElementById(id_tabela);
	let sadrzaj = "";

	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let blok = blokovi[i];
		sadrzaj += generisanjeHTMLBloka(blok, i);
	}

	polje.innerHTML = sadrzaj;
}

function obradaKlika(event, sudoku_tabela, polje_id, kandidat_br) {
	if(event.detail === 2) {
		poljeDupliKlik(event, sudoku_tabela, polje_id, kandidat_br);
		return;
	}

	toggleKandidata(event, sudoku_tabela, polje_id, kandidat_br);
}

function poljeDupliKlik(event, sudoku_tabela, polje_id, kandidat_br) {
	
	let tipResen = false;

	if(!tipResen && sudoku_tabela.iskljuceniKandidat == kandidat_br && sudoku_tabela.iskljuceniKandidatTip == 2) {
		sudoku_tabela.tabela[polje_id].kandidati[kandidat_br] = 2;
		sudoku_tabela.iskljuceniKandidat                      = 0;
		sudoku_tabela.iskljuceniKandidatTip                   = -1;
		tipResen = true;
	}
	
	if(!tipResen && sudoku_tabela.iskljuceniKandidat == kandidat_br && sudoku_tabela.tabela[polje_id].kandidati[kandidat_br] == 1) {
		sudoku_tabela.tabela[polje_id].kandidati[kandidat_br] = 0;
		sudoku_tabela.iskljuceniKandidat                      = 0;
		tipResen = true;
	}
	
	if(!tipResen && sudoku_tabela.iskljuceniKandidat == kandidat_br && sudoku_tabela.tabela[polje_id].kandidati[kandidat_br] == 0) {
		sudoku_tabela.tabela[polje_id].kandidati[kandidat_br] = 1;
		sudoku_tabela.iskljuceniKandidat                      = 0;
		tipResen = true;
	}
	
	event.stopPropagation();
	
	if(sudoku_tabela.tabela[polje_id].fiksno)                         return;
	if(sudoku_tabela.tabela[polje_id].otkrivanje && kandidat_br == 0) return;
	
	let polje = sudoku_tabela.tabela[polje_id];
	polje.otkrivanje = !polje.otkrivanje;
	
	if(kandidat_br != 0) {
		polje.vrednost = kandidat_br;
	}

	if(polje.otkrivanje) polje.vrednost = 0;

	if(sudoku_tabela.automatskoAzuriranje) {
		azuriranjeKandidataOsnovno(sudoku_tabela, false);
	}

	azuriranjePrikazaTabele(sudoku_tabela, true);

	upisNaUndoStek(sudoku_tabela, STEK_GLAVNI);
	localStorageUpis(sudoku_tabela);
}

function toggleKandidata(event, sudoku_tabela, polje_id, kandidat_br) {
	let polje         = sudoku_tabela.tabela[polje_id];
	let prenetaDvojka = polje.kandidati[kandidat_br] == 2;

	if(polje.kandidati[kandidat_br] == 0) {
		polje.kandidati[kandidat_br] = 1;
	}
	else {
		polje.kandidati[kandidat_br] = 0;
	}
	
	sudoku_tabela.iskljuceniKandidat    = kandidat_br;	
	sudoku_tabela.iskljuceniKandidatTip = (prenetaDvojka)? 2 : 1;	

	azuriranjePrikazaPolja(sudoku_tabela, polje_id);

	upisNaUndoStek(sudoku_tabela, STEK_GLAVNI);
	localStorageUpis(sudoku_tabela);
}

function toggleParKandidata(event, sudoku_tabela, polje_id, kandidat_br) {
	event.preventDefault();
	
	let polje = sudoku_tabela.tabela[polje_id];
	
	if(polje.kandidati[kandidat_br] != 2) {
		polje.kandidati[kandidat_br] = 2;
	}
	else {
		polje.kandidati[kandidat_br] = 0;
	}

	sudoku_tabela.iskljuceniKandidat    = kandidat_br;
	sudoku_tabela.iskljuceniKandidatTip = 2;

	azuriranjePrikazaPolja(sudoku_tabela, polje_id);

	upisNaUndoStek(sudoku_tabela, STEK_GLAVNI);
	localStorageUpis(sudoku_tabela);
}

generisanjeTabele(sudoku_tabela.tabela);
generisanjeHTMLTabele("sudoku_tabela", sudoku_tabela.blokovi);
ucitavanjeZagonetke(sudoku_tabela.zagonetka, sudoku_tabela);
azuriranjePrikazaTabele(sudoku_tabela, true);

upisNaUndoStek(sudoku_tabela, STEK_GLAVNI);
localStorageUpis(sudoku_tabela);

//console.log(sudoku_tabela)
