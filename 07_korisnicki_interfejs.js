/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

document.addEventListener('keydown', prepoznavanjeTastera);

function prepoznavanjeTastera(event) {
	switch(event.keyCode) {
		case 40: promenaHintaSledeciHint(sudoku_tabela_glavna);               break; // STRELICA DOLE
		case 38: promenaHintaPrethodniHint(sudoku_tabela_glavna);             break; // STRELICA GORE
		case 72: generisanjeHintovaPrekoPrecice(sudoku_tabela_glavna, true);  break; // H
		case 81: generisanjeHintovaPrekoPrecice(sudoku_tabela_glavna, false); break; // Q
		case 13: prihvatanjeHintaEnter(sudoku_tabela_glavna);                 break; // ENTER
		case 27: otkazivanjeHintovaEsc(sudoku_tabela_glavna);                 break; // ESC
		default: break;
	}
}

function prihvatanjeHintaEnter(sudoku_tabela) {
	usvajanjeHinta(sudoku_tabela, sacuvanaTabela, listaHintova, sudoku_tabela.izabraniHint);
}

function otkazivanjeHintovaEsc(sudoku_tabela) {
	if(!sudoku_tabela.hintoviAktivni) return;
	otkazivanjeHinta(sudoku_tabela, sacuvanaTabela);
}

function promenaHintaSledeciHint(sudoku_tabela) {
	sudoku_tabela.izabraniHint++;
	
	if(sudoku_tabela.izabraniHint > sudoku_tabela.brojHintova) {
		sudoku_tabela.izabraniHint = 1;
	}

	prikazHinta(sudoku_tabela, sacuvanaTabela, listaHintova, sudoku_tabela.izabraniHint);
}

function promenaHintaPrethodniHint(sudoku_tabela) {
	sudoku_tabela.izabraniHint--;
	
	if(sudoku_tabela.izabraniHint < 1) {
		sudoku_tabela.izabraniHint = sudoku_tabela.brojHintova;
	}

	prikazHinta(sudoku_tabela, sacuvanaTabela, listaHintova, sudoku_tabela.izabraniHint);
}

function generisanjeHintovaPrekoPrecice(sudoku_tabela, automatik) {
	sudoku_tabela.hintoviAktivni = true;
	sudoku_tabela.izabraniHint   = 1;
	generisanjeHintova(sudoku_tabela, automatik);
}

function obradaKlika(event, sudoku_tabela, polje_id, kandidat_br) {
	if(sudoku_tabela.hintoviAktivni) {
		alert("Nije moguće ručno menjati vrednosti dok su hintovi prikazani.");
		return;
	}

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
	if(sudoku_tabela.hintoviAktivni) {
		alert("Nije moguće ručno menjati vrednosti dok su hintovi prikazani.");
		return;
	}
	
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