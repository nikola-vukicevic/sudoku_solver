/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

function resetDuplikata(sudoku_tabela) {
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		for(let j = 0; j <= BROJ_BLOKOVA; j++) {
			sudoku_tabela.duplikati_redovi[i][j]  = 0;
			sudoku_tabela.duplikati_kolone[i][j]  = 0;
			sudoku_tabela.duplikati_blokovi[i][j] = 0;
		}
	}
}

function azuriranjeDuplikataUStrukturi(sudoku_tabela, niz_polja, niz_duplikata, indeks) {
	for(let i = 0; i < niz_polja.length; i++) {
		let polje    = niz_polja[i];
		let vrednost = sudoku_tabela.tabela[polje].vrednost;
		if(vrednost == 0) continue;
		niz_duplikata[indeks][vrednost]++;
	}
}

function azuriranjeDuplikata(sudoku_tabela) {
	resetDuplikata(sudoku_tabela);
	
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let red           = sudoku_tabela.redovi[i];
		let red_duplikati = sudoku_tabela.duplikati_redovi;
		azuriranjeDuplikataUStrukturi(sudoku_tabela, red, red_duplikati, i);
	}

	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let kolona           = sudoku_tabela.kolone[i];
		let kolona_duplikati = sudoku_tabela.duplikati_kolone;
		azuriranjeDuplikataUStrukturi(sudoku_tabela, kolona, kolona_duplikati, i);
	}

	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let blok           = sudoku_tabela.blokovi[i];
		let blok_duplikati = sudoku_tabela.duplikati_blokovi;
		azuriranjeDuplikataUStrukturi(sudoku_tabela, blok, blok_duplikati, i);
	}
}
