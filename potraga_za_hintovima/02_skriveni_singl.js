/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

function generisanjeHintaSkriveniSingl(lista_hintova, niz_naziv, niz_indeks, polje, kandidat) {
	polje = polje[0]
	if(polje.jedanKandidat) return;
	let hint = {
		indeks: -1 ,
		naslov: `P${polje.indeks} - ${niz_naziv} ${niz_indeks} - ${kandidat} - Skriveni singl` ,
		opis : `<span>Polje #${polje.indeks}</span>
<span>Red: ${polje.red} Kolona: ${polje.kolona}</span>
<span>Vrednost - ${kandidat}</span>
<span>Skriven u: ${niz_naziv} ${niz_indeks}</span>
<span>Skriveni singl</span>` ,
		
		listaHint: [
			[ polje.indeks, -1, kandidat , 5 , true, true ] ,
		] ,

		listaIzvrsavanje: [
			[ polje.indeks, kandidat , -1 , 5, false, false ] ,
		] ,
	}

	lista_hintova.push(hint);
}

function generisanjeHintovaSkriveniSingl(lista_hintova, lista_singlova, niz_naziv, niz_indeks) {
	lista_singlova.forEach(singl => {
		generisanjeHintaSkriveniSingl(lista_hintova, niz_naziv, niz_indeks, singl[1], singl[0]);
	});
}

function prebrojavanjeKandidataSkriveniSingl(lista_hintova, polje, niz_prebrojavanje) {
	if(!polje.otkrivanje) return;
	let kandidati = polje.kandidati;
	
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		if(kandidati[i] > 0) {
			niz_prebrojavanje[i][0]++;
			niz_prebrojavanje[i][1].push(polje);
		}
	}
}

function proveraKandidataSkriveniSingl(lista_hintova, niz_prebrojavanje) {
	let lista = [ ];

	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		if(niz_prebrojavanje[i][0] == 1 ) {
			lista.push([ i , niz_prebrojavanje[i][1] ]);
		}
	}

	if(lista.length > 0) {
		return lista;
	}
	else {
		return false;
	}
}

function pretragaSkriveniSinglNiz(lista_hintova, niz_naziv, niz_indeks, niz, sudoku_tabela) {
	let nizPrebrojavanje = [ ];
	for(let i = 0; i <= BROJ_BLOKOVA; i++) nizPrebrojavanje.push([ 0 , [ ] ]);
	
	for(let i = 0; i < niz.length; i++) {
		prebrojavanjeKandidataSkriveniSingl(lista_hintova, sudoku_tabela.tabela[niz[i]], nizPrebrojavanje);
	}

	let listaSinglova = proveraKandidataSkriveniSingl(lista_hintova, nizPrebrojavanje);
	
	if(listaSinglova) {
		generisanjeHintovaSkriveniSingl(lista_hintova, listaSinglova, niz_naziv, niz_indeks);
	}
}

function potragaZaHintovimaSkriveniSingl(sudoku_tabela) {
	if(!PRETRAGA_SKRIVENI_SINGL) return [ ];

	let lista_hintova = [ ];

	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let red = sudoku_tabela.redovi[i];
		pretragaSkriveniSinglNiz(lista_hintova, "Red", i, red, sudoku_tabela);
	}
	
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let kolona = sudoku_tabela.kolone[i];
		pretragaSkriveniSinglNiz(lista_hintova, "Kolona", i, kolona, sudoku_tabela);
	}
	
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let blok = sudoku_tabela.blokovi[i];
		pretragaSkriveniSinglNiz(lista_hintova, "Blok", i, blok, sudoku_tabela);
	}
		
	return lista_hintova;
}
