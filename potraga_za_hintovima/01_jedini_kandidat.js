/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

function generisanjeHintaJediniKandidat(polje, kandidat) {
	let hint = {
		indeks: -1 ,
		naslov: `P${polje.indeks} - ${kandidat} - Jedini kandidat` ,
		opis : `<span>Polje #${polje.indeks}</span>
<span>Red: ${polje.red} Kolona: ${polje.kolona}</span>
<span>Vrednost - ${kandidat}</span>
<span>Jedini kandidat</span>

` ,
		listaHint: [
			[ polje.indeks, -1, kandidat , 5 , true, true ] ,
		] ,

		listaIzvrsavanje: [
			[ polje.indeks, kandidat , -1 , 5, false, false ] ,
		] ,
	}

	return hint;
}

function potragaZaHintovimaJediniKandidatJednoPolje(listaHintova, polje) {
	if(!polje.otkrivanje) return;
	let kandidati   = polje.kandidati;
	let brKandidata = 0;
	let indeks      = -1; 
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		if(kandidati[i] > 0) {
			brKandidata++;
			indeks = i;
		}
		if(brKandidata > 1) break;
	}

	if(brKandidata == 1) {
		polje.jedanKandidat = true;
		let hint = generisanjeHintaJediniKandidat(polje, indeks);
		listaHintova.push(hint); 
	}
}

function potragaZaHintovimaJediniKandidat(sudoku_tabela) {
	if(!PRETRAGA_JEDINI_KANDIDAT) return [ ];
	
	let lista_hintova = [ ];

	for(let i = 1; i <= BROJ_POLJA; i++) {
		let polje = sudoku_tabela.tabela[i];
		potragaZaHintovimaJediniKandidatJednoPolje(lista_hintova, polje);
	}
	
	return lista_hintova;
}