/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

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
