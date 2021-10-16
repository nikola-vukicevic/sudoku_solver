/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

function generisanjeHintaSkriveniPar(lista_hintova, niz_naziv, niz_indeks, par_kandidata, sudoku_tabela) {
	let gramatika = (niz_naziv == "Red")? "redu" : (niz_naziv == "Kolona")? "koloni" : "bloku";
	let hint = {
		indeks: -1 ,
		naslov: `Skriveni par [${niz_naziv} #${niz_indeks}][P${par_kandidata[2].indeks}, P${par_kandidata[3].indeks}]  - (${par_kandidata[0]}-${par_kandidata[1]})`,
		opis : `<h3 class='sudoku_h3'>Skriveni par (${niz_naziv} #${niz_indeks})</h3>

<p class='sudoku_p'>
	U <strong>${gramatika} #${niz_indeks}</strong>, vrednosti <strong>${par_kandidata[0]}</strong> i <strong>${par_kandidata[1]}</strong> pojavljuju se (zajedno) samo u poljima <strong>P${par_kandidata[2].indeks}</strong> i <strong>P${par_kandidata[3].indeks}</strong> i time čine <strong>skriveni par</strong>
</p>

<p class='sudoku_p'>
	Ostali kandidati u navedenim poljima mogu se <strong>isključiti</strong>.
</p>` ,
		
		listaHint: [
			// [ polje.indeks, -1, kandidat , 5 , true, true ] ,
			[ par_kandidata[2].indeks, -1, par_kandidata[0] , 6 , true, true ] ,
			[ par_kandidata[3].indeks, -1, par_kandidata[0] , 6 , true, true ] ,
			[ par_kandidata[2].indeks, -1, par_kandidata[1] , 6 , true, true ] ,
			[ par_kandidata[3].indeks, -1, par_kandidata[1] , 6 , true, true ] ,
		] ,

		listaIzvrsavanje: [
			[ par_kandidata[2].indeks, -1, par_kandidata[0] , 2 , true, false ] ,
			[ par_kandidata[3].indeks, -1, par_kandidata[0] , 2 , true, false ] ,
			[ par_kandidata[2].indeks, -1, par_kandidata[1] , 2 , true, false ] ,
			[ par_kandidata[3].indeks, -1, par_kandidata[1] , 2 , true, false ] ,
		] ,
	}

	iskljucivanjeKandidataSkriveniPar(hint, par_kandidata[2], par_kandidata[0], par_kandidata[1]);
	iskljucivanjeKandidataSkriveniPar(hint, par_kandidata[3], par_kandidata[0], par_kandidata[1]);

	if(hint.listaHint.length == 4) return;
	
	lista_hintova.push(hint);
}

function iskljucivanjeKandidataSkriveniPar(hint, polje, kandidat_1, kandidat_2) {
	let kandidati = polje.kandidati;
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		if(i != kandidat_1 && i != kandidat_2 && kandidati[i] > 0) {
			hint.listaHint.push(        [ polje.indeks, -1, i, 3, true, true  ] );
			hint.listaIzvrsavanje.push( [ polje.indeks, -1, i, 0, true, false ] );
		}
	}
}

function generisanjeHintovaSkriveniParovi(lista_hintova, niz_naziv, niz_indeks, niz_prebrojavanje, sudoku_tabela) {
	niz_prebrojavanje.forEach(par_kandidata => {
		generisanjeHintaSkriveniPar(lista_hintova, niz_naziv, niz_indeks, par_kandidata, sudoku_tabela);
	});
}

function prebrojavanjeKandidataSkriveniPar(lista_hintova, polje, niz_prebrojavanje) {
	if(!polje.otkrivanje) return;

	let kandidati = polje.kandidati;
	
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		if(kandidati[i] > 0) {
			niz_prebrojavanje[i][0]++;
			niz_prebrojavanje[i][1].push(polje);
		}
	}
}

function preciscavanjeNizaSkriveniPar(niz_prebrojavanje) {
	let nova_lista = [ ];

	niz_prebrojavanje.forEach((e, i) => {
		if(e[0] == 2) {
			nova_lista.push([ i ,e[1] ]);
		}
	});

	return nova_lista;
}

function kreiranjeKombinacijaSkriveniPar(niz_prebrojavanje) {
	let nova_lista = [ ];

	for(let i = 0; i < niz_prebrojavanje.length - 1; i++) {
		for(let j = i + 1; j < niz_prebrojavanje.length; j++) {
			nova_lista.push( [ niz_prebrojavanje[i] , niz_prebrojavanje[j] ] )
		}
	}

	return nova_lista;
}

function pronalazenjeParovaSkriveniPar(niz_prebrojavanje) {
	let nova_lista = [ ];

	niz_prebrojavanje.forEach((e, i) => {
		let k1 = e[0];
		let k2 = e[1];

		let k1_p1 = k1[1][0].indeks;
		let k1_p2 = k1[1][1].indeks;

		let k2_p1 = k2[1][0].indeks;
		let k2_p2 = k2[1][1].indeks;

		if(k1[1][0] == k2[1][0] && k1[1][1] == k2[1][1]) {
			nova_lista.push( [ k1[0] , k2 [0] , k1[1][0] , k1[1][1] ] )
		}
		
		//console.log(k1[0] , k1_p1 , k1_p2)
		//console.log(k2[0] , k2_p1 , k2_p2)
		//console.log("---------------")
	});

	return nova_lista;
}

function pretragaSkriveniParNiz(lista_hintova, niz_naziv, niz_indeks, niz, sudoku_tabela) {
	let nizPrebrojavanje = [ ];
	for(let i = 0; i <= BROJ_BLOKOVA; i++) nizPrebrojavanje.push([ 0 , [ ] ]);

	for(let i = 0; i < niz.length; i++) {
		prebrojavanjeKandidataSkriveniPar(lista_hintova, sudoku_tabela.tabela[niz[i]], nizPrebrojavanje);
	}

	nizPrebrojavanje = preciscavanjeNizaSkriveniPar(nizPrebrojavanje);
	nizPrebrojavanje = kreiranjeKombinacijaSkriveniPar(nizPrebrojavanje);
	nizPrebrojavanje = pronalazenjeParovaSkriveniPar(nizPrebrojavanje);
	// if(nizPrebrojavanje.length > 0) {
	// 	console.log(niz_naziv, niz_indeks)
	// 	console.log(nizPrebrojavanje);
	// 	console.log("----------------------------");
	// }

	generisanjeHintovaSkriveniParovi(lista_hintova, niz_naziv, niz_indeks, nizPrebrojavanje, sudoku_tabela);
}


function potragaZaHintovimaSkriveniPar(sudoku_tabela) {
	if(!PRETRAGA_SKRIVENI_PAR) return [ ];

	let lista_hintova = [ ];

	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let red = sudoku_tabela.redovi[i];
		pretragaSkriveniParNiz(lista_hintova, "Red", i, red, sudoku_tabela);
	}
	
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let kolona = sudoku_tabela.kolone[i];
		pretragaSkriveniParNiz(lista_hintova, "Kolona", i, kolona, sudoku_tabela);
	}
		
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let blok = sudoku_tabela.blokovi[i];
		pretragaSkriveniParNiz(lista_hintova, "Blok", i, blok, sudoku_tabela);
	}
			
	return lista_hintova;
}
