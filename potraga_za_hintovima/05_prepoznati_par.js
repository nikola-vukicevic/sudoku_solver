/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

function generisanjeHintaPrepoznatiPar(lista_hintova, par_kandidata, niz_naziv, niz_indeks, sudoku_tabela) {
	let kandidat_1 = par_kandidata[0][0];
	let kandidat_2 = par_kandidata[1][0];
	let vrednost_1 = par_kandidata[0][1];
	let vrednost_2 = par_kandidata[0][2];
	let gramatika = (niz_naziv == "Red")? "redu" : (niz_naziv == "Kolona")? "koloni" : "bloku";
		
	let hint = {
		indeks: -1 ,
		naslov: `P${kandidat_1.indeks}, P${kandidat_2.indeks} (${niz_naziv} #${niz_indeks}) - Prepoznati par (${vrednost_1}-${vrednost_2})`,
		opis : `U ${gramatika} #${niz_indeks}, kandidati ${vrednost_1} i ${vrednost_2} su jedini mogući par kandidata u poljima P${kandidat_1.indeks} i P${kandidat_2.indeks}, pa se stoga kandidati ${vrednost_1} i ${vrednost_2} mogu isključiti kao kandidati u svim ostalim poljima u ${niz_indeks} ${gramatika}.` ,
		
		listaHint: [
			[ kandidat_1.indeks, -1, vrednost_1 , 6 , true, true ] ,
			[ kandidat_1.indeks, -1, vrednost_2 , 6 , true, true ] ,
			[ kandidat_2.indeks, -1, vrednost_1 , 6 , true, true ] ,
			[ kandidat_2.indeks, -1, vrednost_2 , 6 , true, true ] ,
		] ,

		listaIzvrsavanje: [
			[ kandidat_1.indeks, -1, vrednost_1 , 2 , true, false ] ,
			[ kandidat_1.indeks, -1, vrednost_2 , 2 , true, false ] ,
			[ kandidat_2.indeks, -1, vrednost_1 , 2 , true, false ] ,
			[ kandidat_2.indeks, -1, vrednost_2 , 2 , true, false ] ,
		] ,
	}

	let niz = (niz_naziv == "Red")? sudoku_tabela.redovi : (niz_naziv == "Kolona")? sudoku_tabela.kolone : sudoku_tabela.blokovi;
	iskljucivanjeKandidataPrepoznatiPar(hint, niz, niz_indeks, kandidat_1.indeks, kandidat_2.indeks, vrednost_1, vrednost_2, sudoku_tabela);
	
	if(hint.listaHint.length == 4) return;
	
	lista_hintova.push(hint);
}

function iskljucivanjeKandidataPrepoznatiPar(hint, niz, niz_indeks, polje_1_i, polje_2_i, kandidat_1, kandidat_2, sudoku_tabela) {
	let nizPolja = niz[niz_indeks];
	
	for(let i = 0; i < BROJ_BLOKOVA; i++){
		let polje = sudoku_tabela.tabela[nizPolja[i]];
		if(polje.indeks == polje_1_i || polje.indeks == polje_2_i) continue;
		if(polje.otkrivanje) {
			iskljucivanjeKandidataPrepoznatiParJednoPolje(hint, polje, polje_1_i, polje_2_i, kandidat_1, kandidat_2);
		}
	}
}

function iskljucivanjeKandidataPrepoznatiParJednoPolje(hint, polje, polje_1_i, polje_2_i, kandidat_1, kandidat_2) {
	let kandidati = polje.kandidati;
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		if((i == kandidat_1 || i == kandidat_2) && kandidati[i] > 0) {
			hint.listaHint.push(        [ polje.indeks, -1, i, 3, true, true  ] );
			hint.listaIzvrsavanje.push( [ polje.indeks, -1, i, 0, true, false ] );
		}
	}
}

function generisanjeHintovaPrepoznatiParovi(lista_hintova, lista_kandidata, niz_naziv, niz_indeks, sudoku_tabela) {
	lista_kandidata.forEach(hint => {
		generisanjeHintaPrepoznatiPar(lista_hintova, hint, niz_naziv, niz_indeks, sudoku_tabela)
	});
}


function kreiranjeKombinacijaPrepoznatiPar(niz_prebrojavanje, nova_lista) {
	for(let i = 0; i < niz_prebrojavanje.length - 1; i++) {
		for(let j = i + 1; j < niz_prebrojavanje.length; j++) {
			nova_lista.push( [ niz_prebrojavanje[i] , niz_prebrojavanje[j] ] );
		}
	}
}

function ispitivanjeKombinacijaPrepoznatiPar(stara_lista, nova_lista) {
	stara_lista.forEach(parKandidata => {
		let k1 = parKandidata[0];
		let k2 = parKandidata[1];

		// console.log(k1)
		// console.log(k2)
		// console.log("-------------")

		if(k1[1] == k2[1] && k1[2] == k2[2]) {
			nova_lista.push(parKandidata);
		}
	})
}

function pripremaNizaPrepoznatiPar(niz_prebrojavanje) {
	let novaLista_1 = [ ];
	let novaLista_2 = [ ];

	if(niz_prebrojavanje.length == 0) return novaLista_1;
	//if(niz_prebrojavanje.length == 2) return niz_prebrojavanje;

	kreiranjeKombinacijaPrepoznatiPar(niz_prebrojavanje, novaLista_1);
	ispitivanjeKombinacijaPrepoznatiPar(novaLista_1, novaLista_2);

	return novaLista_2;
}

function prebrojavanjeKandidataPrepoznatiPar(lista_hintova, polje, niz_prebrojavanje) {
	if(!polje.otkrivanje) return;

	let kandidati          = polje.kandidati;
	let ukljuceniKandidati = [ ];

	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		if(kandidati[i] > 0) {
			ukljuceniKandidati.push(i);
		}
	}

	if(ukljuceniKandidati.length == 2) {
		niz_prebrojavanje.push( [ polje , ukljuceniKandidati[0] , ukljuceniKandidati[1] ] );
	}
}

function pretragaPrepoznatiParNiz(lista_hintova, niz_naziv, niz_indeks, niz, sudoku_tabela) {
	let nizPrebrojavanje = [ ];
	
	for(let i = 0; i < niz.length; i++) {
		prebrojavanjeKandidataPrepoznatiPar(lista_hintova, sudoku_tabela.tabela[niz[i]], nizPrebrojavanje);
	}

	nizPrebrojavanje = pripremaNizaPrepoznatiPar(nizPrebrojavanje);
	
	generisanjeHintovaPrepoznatiParovi(lista_hintova, nizPrebrojavanje, niz_naziv, niz_indeks, sudoku_tabela);
}

function potragaZaHintovimaPrepoznatiPar(sudoku_tabela) {
	if(!PRETRAGA_PREPOZNATI_PAR) return [ ];

	let lista_hintova = [ ];

	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let red = sudoku_tabela.redovi[i];
		pretragaPrepoznatiParNiz(lista_hintova, "Red", i, red, sudoku_tabela);
	}

	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let kolona = sudoku_tabela.kolone[i];
		pretragaPrepoznatiParNiz(lista_hintova, "Kolona", i, kolona, sudoku_tabela);
	}
		
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let blok = sudoku_tabela.blokovi[i];
		pretragaPrepoznatiParNiz(lista_hintova, "Blok", i, blok, sudoku_tabela);
	}
			
	return lista_hintova;
}