/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

function resetPoljeGreskaUNizu(niz, sudoku_tabela) {
	for(let i = 0; i < niz.length; i++) {
		let polje = sudoku_tabela.tabela[niz[i]];
		polje.greska = false;
	}
}

function proveraResenjaUJednomNizu(struktura, struktura_duplikati, indeks, azuriranje_polje_greska, sudoku_tabela) {
	let niz_duplikati   = struktura_duplikati[indeks];
	let lista_duplikata = [ ];
	
	for(let i = 1; i <= niz_duplikati.length; i++) {
		if(niz_duplikati[i] > 1) {
			lista_duplikata.push(i);
		}
	}

	if(azuriranje_polje_greska) resetPoljeGreskaUNizu(struktura[indeks], sudoku_tabela);
	
	while(lista_duplikata.length > 0) {
		let duplikat  = lista_duplikata[lista_duplikata.length - 1];
		let niz_polja = struktura[indeks];

		for(let i = 0; i < niz_polja.length; i++) {
			let polje = sudoku_tabela.tabela[niz_polja[i]];
			if(polje.vrednost == duplikat) {
				polje.greska = true;
			}
		}

		lista_duplikata.pop();
	}
}

function proveraResenjaRedovi(sudoku_tabela) {
	for(let i = 1; i < sudoku_tabela.redovi.length; i++) {
		proveraResenjaUJednomNizu(sudoku_tabela.redovi, sudoku_tabela.duplikati_redovi, i, true, sudoku_tabela);
	}
}

function proveraResenjaKolone(sudoku_tabela) {
	for(let i = 1; i < sudoku_tabela.kolone.length; i++) {
		proveraResenjaUJednomNizu(sudoku_tabela.kolone, sudoku_tabela.duplikati_kolone, i, false, sudoku_tabela);
	}
}

function proveraResenjaBlokovi(sudoku_tabela) {
	for(let i = 1; i < sudoku_tabela.blokovi.length; i++) {
		proveraResenjaUJednomNizu(sudoku_tabela.blokovi, sudoku_tabela.duplikati_blokovi, i, false, sudoku_tabela)
	}
}

function proveraResenja(sudoku_tabela) {
	proveraResenjaRedovi(sudoku_tabela);
	proveraResenjaKolone(sudoku_tabela);
	proveraResenjaBlokovi(sudoku_tabela);
}
