/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

function generisanjeHintaUpereniPar(lista_hintova, hint_struktura) {
	let brojPoprecnihPolja = hint_struktura.niz_poprecnih.length;
	
	if(brojPoprecnihPolja == 0) return;
	
	let polje_1          = hint_struktura.polje_1;
	let polje_2          = hint_struktura.polje_2;
	let poljaPoprecna    = hint_struktura.niz_poprecnih;
	let kandidat         = hint_struktura.kandidat_indeks;
	let kandidatskaPolja = hint_struktura.niz_poprecnih_ispis;

	let hint = {
		indeks: -1 ,
		naslov: `P${hint_struktura.polje_1.indeks}, P${hint_struktura.polje_2.indeks} (Blok ${hint_struktura.blok_indeks}) - Kandidat ${hint_struktura.kandidat_indeks} - Upereni par` ,
		opis: `U bloku #${hint_struktura.blok_indeks}, kandidati sa vrednošću ${hint_struktura.kandidat_indeks} u poljima P${hint_struktura.polje_1.indeks} i P${hint_struktura.polje_2.indeks}, čine upereni par, koji povlači isključivanje kandidatske vrednosti ${hint_struktura.kandidat_indeks} u ostalim poljima u ${hint_struktura.indeks_poprecnog}. ${hint_struktura.tip_strukture} (${(brojPoprecnihPolja < 2)? `polje` : `polja`} ${kandidatskaPolja})` ,
		
		listaHint:        [
			[ polje_1.indeks, -1, kandidat , 6 , true, true ] ,
			[ polje_2.indeks, -1, kandidat , 6 , true, true ] ,
		] ,
		
		listaIzvrsavanje: [
			
		] ,
	};

	iskljucivanjeKandidataUpereniPar(hint, poljaPoprecna, kandidat);
	
	lista_hintova.push(hint);
}

function iskljucivanjeKandidataUpereniPar(hint, lista_polja, kandidat) {
	lista_polja.forEach(polje => {
		hint.listaHint.push(        [ polje.indeks, -1, kandidat, 3, true, true  ] );
		hint.listaIzvrsavanje.push( [ polje.indeks, -1, kandidat, 0, true, false ] );
	})
}

function generisanjeHintaUpereniParPriprema(lista_hintova, upereni_par, sudoku_tabela) {
	let niz             = null;
	let tipStrukture    = "";
	let indeksPoprecnog = -1;
	let polje_1         = upereni_par[2][0];
	let polje_2         = upereni_par[2][1];

	if(polje_1.red == polje_2.red) {
		indeksPoprecnog = polje_1.red;
		niz             = sudoku_tabela.redovi[indeksPoprecnog];
		tipStrukture    = "redu"; // Prenošenje pravilnog gramatičkog oblika
	}
	
	if(polje_1.kolona == polje_2.kolona) {
		indeksPoprecnog = polje_1.kolona; 
		niz             = sudoku_tabela.kolone[indeksPoprecnog];
		tipStrukture    = "koloni"; // Prenošenje pravilnog gramatičkog oblika
	}

	let niz_poprecnih = upereniParoviPronalazenjePoprecnihPolja(sudoku_tabela, niz, upereni_par[0], polje_1, polje_2);

	let hint_struktura = {
		kandidat_indeks:     upereni_par[0] ,
		blok_indeks:         upereni_par[1] ,
		polje_1:             polje_1 ,
		polje_2:             polje_2 ,
		tip_strukture:       tipStrukture , 
		indeks_poprecnog:    indeksPoprecnog ,
		niz_poprecnih:       niz_poprecnih.polja_poprecni ,
		niz_poprecnih_ispis: niz_poprecnih.polja_poprecni_ispis ,
	}
	
	return hint_struktura;
}

function upereniParoviPronalazenjePoprecnihPolja(sudoku_tabela, niz, kandidat, polje_1, polje_2) {
	let polja = [ ];
	let s     = "";

	for(let i = 0; i < niz.length; i++) {
		let polje = sudoku_tabela.tabela[niz[i]];
		if(!polje.otkrivanje) continue;
		if(polje.indeks == polje_1.indeks || polje.indeks == polje_2.indeks) continue;
		if(polje.kandidati[kandidat] > 0) {
			polja.push(polje);
			s += `P${polje.indeks}, `;
		}
	}

	if(s.length > 0) s = s.substring(0, s.length - 2);

	return {
		polja_poprecni:       polja ,
		polja_poprecni_ispis: s ,
	};
}	

function generisanjeHintovaUpareniParovi(lista_hintova, parovi, sudoku_tabela) {
	parovi.forEach(par => {
		let hint_struktura = generisanjeHintaUpereniParPriprema(lista_hintova, par, sudoku_tabela);
		generisanjeHintaUpereniPar(lista_hintova, hint_struktura);
	});
}

function pronalazenjeUperenihParova(niz_prebrojavanje, blok, indeks, sudoku_tabela) {
	let nova_lista = [];

	for(let i = 0; i < niz_prebrojavanje.length; i++) {
		if(niz_prebrojavanje[i][0] == 2) {
			let p1    = niz_prebrojavanje[i][2][0];
			let p2    = niz_prebrojavanje[i][2][1];
			let uslov = p1.red == p2.red || p1.kolona == p2.kolona;
			if(!uslov) continue;
			nova_lista.push([ i , niz_prebrojavanje[i][1] , niz_prebrojavanje[i][2] ]);
		}
	}

	return nova_lista;
}

function prebrojavanjeKandidataUpereniParJednoPolje(kandidati, niz_prebrojavanje, polje, blok_indeks) {
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		if(kandidati[i] > 0) {
			niz_prebrojavanje[i][0]++;
			niz_prebrojavanje[i][1] = blok_indeks;
			niz_prebrojavanje[i][2].push(polje);
		}
	}
}

function prebrojavanjeKandidataUpereniPar(niz_prebrojavanje, blok, blok_indeks, sudoku_tabela) {
	for(let i = 0; i < blok.length; i++) {
		let polje     = sudoku_tabela.tabela[blok[i]];
		if(!polje.otkrivanje) continue;
		let kandidati = polje.kandidati;
		prebrojavanjeKandidataUpereniParJednoPolje(kandidati, niz_prebrojavanje, polje, blok_indeks);
	}
}

function pretragaUpereniPar(lista_hintova, indeks, blok, sudoku_tabela) {
	let nizPrebrojavanje = [ ];
	for(let i = 0; i <= BROJ_BLOKOVA; i++) nizPrebrojavanje.push([ 0 , 0, [ ] ]);

	prebrojavanjeKandidataUpereniPar(nizPrebrojavanje, blok, indeks, sudoku_tabela);
	let parovi = pronalazenjeUperenihParova(nizPrebrojavanje, blok, indeks, sudoku_tabela);
	
	if(parovi.length == 0) return;

	generisanjeHintovaUpareniParovi(lista_hintova, parovi, sudoku_tabela);
}

function potragaZaHintovimaUpereniPar(sudoku_tabela) {
	if(!PRETRAGA_UPERENI_PAR) return [ ];

	let lista_hintova = [ ];

	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let blok = sudoku_tabela.blokovi[i];
		pretragaUpereniPar(lista_hintova, i, blok, sudoku_tabela);
	}
			
	return lista_hintova;
}