function ucitavanjeZagonetkePrompt(sudoku_tabela) {
	
	let t1 = prompt("Unesite polja (81 znak - prazna polja se predstavljaju nulom - razmaci su dozvoljeni)");
	
	if(t1 === null) return;

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
