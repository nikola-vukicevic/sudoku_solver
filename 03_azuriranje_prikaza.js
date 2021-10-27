/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

function resetFiksnogPolja(polje) {
	polje.greska = false;
	polje.okvir  = false;
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
	let poljeHintoviLista  = document.getElementById("hintovi_lista");
	let poljeHintoviInfo   = document.getElementById("hintovi_info");
	poljeHintoviLista.innerHTML = "";
	poljeHintoviInfo.innerHTML  = "";
}

function resetTabele(sudoku_tabela) {
	if(sudoku_tabela.hintoviAktivni) {
		alert("Nije moguće pozivati komande dok su hintovi aktivni.");
		return;
	}

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

function prikazPoljaKandidati(polje) {
	let poljeHTML       = document.getElementById(`sudoku_polje_${polje.indeks}`);
	poljeHTML.outerHTML = generisanjeHTMLPolja(polje.indeks);
	
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let kandidatHTML = document.getElementById(`sudoku_polje_kandidat_${polje.indeks}_${i}`);
		
		kandidatHTML.classList.remove("sudoku_polje_kandidat_toggle");
		kandidatHTML.classList.remove("sudoku_polje_kandidat_par_toggle");
		kandidatHTML.classList.remove("sudoku_polje_kandidat_solver_1");
		kandidatHTML.classList.remove("sudoku_polje_kandidat_solver_2");
		kandidatHTML.classList.remove("sudoku_polje_kandidat_solver_3");
		kandidatHTML.classList.remove("sudoku_polje_kandidat_solver_4");
		kandidatHTML.classList.remove("sudoku_polje_kandidat_solver_5");
		
		switch(polje.kandidati[i]) {
			case 0: polje.kandidati[i] = 0;                                         break;
			case 1: kandidatHTML.classList.add("sudoku_polje_kandidat_toggle");     break;
			case 2: kandidatHTML.classList.add("sudoku_polje_kandidat_par_toggle"); break;
			case 3: kandidatHTML.classList.add("sudoku_polje_kandidat_solver_1");   break;
			case 4: kandidatHTML.classList.add("sudoku_polje_kandidat_solver_2");   break;
			case 5: kandidatHTML.classList.add("sudoku_polje_kandidat_solver_3");   break;
			case 6: kandidatHTML.classList.add("sudoku_polje_kandidat_solver_4");   break;
			case 7: kandidatHTML.classList.add("sudoku_polje_kandidat_solver_5");   break;
			default: break;
		}
	}
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
	if(sudoku_tabela.hintoviAktivni) {
		alert("Nije moguće pozivati komande dok su hintovi aktivni.");
		return;
	}	

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
	
	if(sudoku_tabela.hintoviAktivni) {
		alert("Nije moguće pozivati komande dok su hintovi aktivni.");
		return;
	}
	
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
	//console.log(`Osnovno isključivanje kandidata - ${odziv}`)
	/* ---------------------------------------------------------------------- */
}

function azuriranjePrikazaPolja(sudoku_tabela, id) {
	let polje     = sudoku_tabela.tabela[id];
	let poljeHTML = document.getElementById(`sudoku_polje_${id}`);
	let kandidati = polje.kandidati;
	
	if(polje.otkrivanje) {
		prikazPoljaKandidati(polje);
		poljeHTML = document.getElementById(`sudoku_polje_${id}`);
	}
	else {
		poljeHTML.innerHTML = polje.vrednost;
	}

	poljeHTML.style.background = polje.boja;
	//console.log(polje.boja);
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

function azuriranjePrikazaTabele(sudoku_tabela, provera) {
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

	prebrojavanjePreostalih(sudoku_tabela);
	proglasavanjeRezultata(sudoku_tabela);

	//localStorageUpis(sudoku_tabela);

	/* ----- telemetrija ---------------------------------------------------- */
	// let t2 = performance.now();
	// let odziv = t2 - t1 + "ms";
	// console.log(`Ažuriranje tabele - ${odziv}`)
	/* ---------------------------------------------------------------------- */
}
