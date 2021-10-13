/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

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
