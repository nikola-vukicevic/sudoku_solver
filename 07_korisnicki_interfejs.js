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