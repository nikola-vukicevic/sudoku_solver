/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

function resetFiksnogPolja(polje) {
	polje.greska = false;
	polje.okvir  = false;
	polje.boja   = BOJA_POLJA_DEFAULT;
}

function resetPolja(polje) {
	for(let i = 0; i < polje.kandidati.length; i++) {
		polje.kandidati[i] = 0; // Reset  kandidata
	}

	polje.vrednost   = 0;
	polje.boja       = BOJA_POLJA_DEFAULT;
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

function resetHintova() {
	let poljeHintoviLista = document.getElementById("hintovi_lista");
	let poljeHintoviInfo  = document.getElementById("hintovi_info");
	
	poljeHintoviLista.innerHTML = "";
	poljeHintoviInfo.innerHTML  = "";
}

function resetTabele(sudoku_tabela) {
	if(prikazPorukeHintoviAktivni(sudoku_tabela)) return;

	resetDuplikata(sudoku_tabela);
	resetHintova();

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
		if(polje.fiskno || !polje.otkrivanje) continue; // Ovo je uslov koji aplikacija
		ukljucivanjeSvihKandidataPolje(polje);          // nekada izgleda zanemari
	}
}

function iskljucivanjeSvihKandidata(sudoku_tabela) {
	if(prikazPorukeHintoviAktivni(sudoku_tabela)) return;

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

// Funkcija azuriranjeKandidataOsnovnoIskljucivanjeKandidata je ta koja zapravo
// isključuje kandidate!

function azuriranjeKandidataOsnovnoIskljucivanjeKandidata(sudoku_tabela, niz, vrednost, rezim) {
	for(let i = 0; i < niz.length; i++) {
		let polje = sudoku_tabela.tabela[niz[i]]; // niz[i] - indeks polja, pronađen
		if(polje.vrednost == 0) {                 // u nizu redovi, kolone ili blokovi
			switch(rezim) {
				case 1: iskljucivanjeJednogKandidataOznacavanje(sudoku_tabela, polje, vrednost);   break;
				case 2: iskljucivanjeJednogKandidataIskljucivanje(sudoku_tabela, polje, vrednost); break;
				default: break;
			}
		}
	}
}

/* ------------------------------------------------------------------------- */

// Funkcija azuriranjeKandidataOsnovnoUNizuStrukture, pronalazi uključena
// polja u okviru jednog reda / kolone / bloka, ali ....

function azuriranjeKandidataOsnovnoUNizuStrukture(sudoku_tabela, niz, rezim) {
	for(let i = 0; i < niz.length; i++) {
		let polje = sudoku_tabela.tabela[niz[i]]; // niz[i] - indeks polja u
		if(polje.vrednost > 0) {                  // redu, koloni, bloku
			azuriranjeKandidataOsnovnoIskljucivanjeKandidata(sudoku_tabela, niz, polje.vrednost, rezim);
		}
	}
}

// Funkcija azuriranjeKandidataOsnovnoUTipuStrukture prolazi kroz sve redove,
// kolone, blokove, ali ne obavlja posao oko pojedinačnog reda
// već poziva funkciju azuriranjeKandidataOsnovnoUNizuStrukture

function azuriranjeKandidataOsnovnoUTipuStrukture(sudoku_tabela, struktura, rezim) {
	for(let i = 1; i < struktura.length; i++) {
		let niz = struktura[i];
		azuriranjeKandidataOsnovnoUNizuStrukture(sudoku_tabela, niz, rezim);
	}
}

/* -------------------------------------------------------------------------- */

function azuriranjeKandidataOsnovnoRedovi(sudoku_tabela, rezim) {
	let redovi = sudoku_tabela.redovi;
	azuriranjeKandidataOsnovnoUTipuStrukture(sudoku_tabela, redovi, rezim);
}

function azuriranjeKandidataOsnovnoKolone(sudoku_tabela, rezim) {
	let kolone = sudoku_tabela.kolone;
	azuriranjeKandidataOsnovnoUTipuStrukture(sudoku_tabela, kolone, rezim);
}

function azuriranjeKandidataOsnovnoBlokovi(sudoku_tabela, rezim) {
	let blokovi = sudoku_tabela.blokovi;
	azuriranjeKandidataOsnovnoUTipuStrukture(sudoku_tabela, blokovi, rezim);
}

/* -------------------------------------------------------------------------- */

// Osnovno ažuriranje podrazumeva isključivanje kandidata (u svim poljima sa
// kandidatima) koji su u istom redu, kkoloni, ili bloku, sa već uključenim
// poljima (bilo fiksnim, bilo onima koje je korisnik isključio)

function azuriranjeKandidataOsnovno(sudoku_tabela, na_dugme) {
	
	if(prikazPorukeHintoviAktivni(sudoku_tabela)) return;
	
	/* ----- telemetrija ---------------------------------------------------- */
	// let t1 = performance.now();
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
	// let t2 = performance.now();
	// let odziv = t2 - t1 + "ms";
	// console.log(`Osnovno isključivanje kandidata - ${odziv}`)
	/* ---------------------------------------------------------------------- */
}

function prikazPoljaKandidati(polje) {
	let poljeKandidati = document.getElementById(`sudoku_polje_kandidati_${polje.indeks}`);
	let poljeVrednost  = document.getElementById(`sudoku_polje_vrednost_${polje.indeks}`);
	
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let kandidatHTML = document.getElementById(`sudoku_polje_kandidat_${polje.indeks}_${i}`);
		
		kandidatHTML.classList.remove("sudoku_polje_kandidat_toggle");
		kandidatHTML.classList.remove("sudoku_polje_kandidat_par_toggle");
		kandidatHTML.classList.remove("sudoku_polje_kandidat_solver_1");
		kandidatHTML.classList.remove("sudoku_polje_kandidat_solver_2");
		kandidatHTML.classList.remove("sudoku_polje_kandidat_solver_3");
		kandidatHTML.classList.remove("sudoku_polje_kandidat_solver_4");
		kandidatHTML.classList.remove("sudoku_polje_kandidat_solver_5");
		kandidatHTML.classList.remove("sudoku_polje_kandidat_solver_6"); // coloring - boja_1
		kandidatHTML.classList.remove("sudoku_polje_kandidat_solver_7"); // coloring - boja_2
		
		switch(polje.kandidati[i]) {
			case 0: polje.kandidati[i] = 0;                                         break;
			case 1: kandidatHTML.classList.add("sudoku_polje_kandidat_toggle");     break;
			case 2: kandidatHTML.classList.add("sudoku_polje_kandidat_par_toggle"); break;
			case 3: kandidatHTML.classList.add("sudoku_polje_kandidat_solver_1");   break;
			case 4: kandidatHTML.classList.add("sudoku_polje_kandidat_solver_2");   break;
			case 5: kandidatHTML.classList.add("sudoku_polje_kandidat_solver_3");   break;
			case 6: kandidatHTML.classList.add("sudoku_polje_kandidat_solver_4");   break;
			case 7: kandidatHTML.classList.add("sudoku_polje_kandidat_solver_5");   break;
			case 8: kandidatHTML.classList.add("sudoku_polje_kandidat_solver_6");   break;
			case 9: kandidatHTML.classList.add("sudoku_polje_kandidat_solver_7");   break;
			default: break;
		}
	}

	poljeVrednost.classList.add(`sudoku_polje_skrivanje_vrednosti`);
	poljeKandidati.classList.remove(`sudoku_polje_skrivanje_kandidata`);
}

function prikazPoljaVrednost(polje) {
	let poljeVrednost  = document.getElementById(`sudoku_polje_vrednost_${polje.indeks}`);
	let poljeKandidati = document.getElementById(`sudoku_polje_kandidati_${polje.indeks}`);
		
	poljeVrednost.innerHTML = polje.vrednost;

	poljeKandidati.classList.add(`sudoku_polje_skrivanje_kandidata`);
	poljeVrednost.classList.remove(`sudoku_polje_skrivanje_vrednosti`);

}

function azuriranjePrikazaPolja(sudoku_tabela, id) {
	let polje     = sudoku_tabela.tabela[id];
	let poljeHTML = document.getElementById(`sudoku_polje_${id}`);
		
	if(polje.otkrivanje) {
		prikazPoljaKandidati(polje);
	}
	else {
		prikazPoljaVrednost(polje);
	}

	poljeHTML.style.background = polje.boja;
	
	poljeHTML.classList.remove("sudoku_polje_fiksno");
	poljeHTML.classList.remove("sudoku_polje_greska");
	poljeHTML.classList.remove("sudoku_polje_okvir_1");
	poljeHTML.classList.remove("sudoku_polje_okvir_2");
	poljeHTML.classList.remove("sudoku_polje_okvir_3");
	
	if(polje.fiksno) {
		poljeHTML.classList.add("sudoku_polje_fiksno");
	}
	
	if(polje.greska) {
		poljeHTML.classList.add("sudoku_polje_greska");
		polje.boja = BOJA_POLJA_GRESKA;
	}
	else {
		polje.boja = BOJA_POLJA_DEFAULT;
	}

	if(polje.okvir != false) {
		poljeHTML.classList.add(`sudoku_polje_okvir_${polje.okvir}`);
	}
}

function azuriranjePrikazaTabele(sudoku_tabela, provera, prikaz_poruke_reseno) {
	
	/* ----- telemetrija ---------------------------------------------------- */
	// let t1 = performance.now();
	/* ---------------------------------------------------------------------- */

	if(provera) {
		azuriranjeDuplikata(sudoku_tabela);
		proveraResenja(sudoku_tabela);
	}
	
	for(let i = 1; i <= BROJ_POLJA; i++) {
		azuriranjePrikazaPolja(sudoku_tabela, i);
	}

	prebrojavanjePreostalih(sudoku_tabela, prikaz_poruke_reseno);
	proglasavanjeRezultata(sudoku_tabela);

	//localStorageUpis(sudoku_tabela);

	/* ----- telemetrija ---------------------------------------------------- */
	// let t2 = performance.now();
	// let odziv = t2 - t1 + "ms";
	// console.log(`Ažuriranje tabele - ${odziv}`)
	/* ---------------------------------------------------------------------- */
}
