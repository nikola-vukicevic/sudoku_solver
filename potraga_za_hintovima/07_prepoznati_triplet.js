/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

function generisanjeHintaPrepoznatiTripl(lista_hintova, par_kandidata, niz_naziv, niz_indeks, sudoku_tabela) {
	let kandidati  = par_kandidata[0].sort();
	let kandidat_1 = kandidati[0];
	let kandidat_2 = kandidati[1];
	let kandidat_3 = kandidati[2];
	let polje_1    = par_kandidata[1][0][0];
	let polje_2    = par_kandidata[1][1][0];
	let polje_3    = par_kandidata[1][2][0];
	let gramatika  = (niz_naziv == "Red")? "redu" : (niz_naziv == "Kolona")? "koloni" : "bloku";
		
	let hint = {
		indeks: -1 ,
		naslov: `Prepoznati triplet [${niz_naziv} #${niz_indeks}][P${polje_1.indeks}, P${polje_2.indeks}, P${polje_3.indeks}] - ${kandidat_1}-${kandidat_2}-${kandidat_3}`,
		opis : `<h3 class='sudoku_h3'>Triplet (${niz_naziv} #${niz_indeks})</h3>
<p class='sudoku_p'>
	U <strong>${gramatika} #${niz_indeks}</strong>, vrednosti <strong>${kandidat_1}</strong>, <strong>${kandidat_2}</strong> i <strong>${kandidat_3}</strong> grupisane u poljima <strong>P${polje_1.indeks}</strong>, <strong>P${polje_2.indeks}</strong> i <strong>P${polje_3.indeks}</strong>, čine <strong>triplet</strong> koji se može rasporediti jedino u tri navedena polja.
</p>

<p class='sudoku_p'>
	Vrednosti <strong>${kandidat_1}</strong>, <strong>${kandidat_2}</strong> i <strong>${kandidat_3}</strong> mogu se isključiti kao kandidati u svim ostalim poljima u <strong>${niz_indeks}. ${gramatika}</strong>.
</p>` ,
		
		listaHint: [ ] ,

		listaIzvrsavanje: [ ] ,
	}

	ukljucivanjeVrednostiPrepoznatiTripl(hint, polje_1, kandidati);
	ukljucivanjeVrednostiPrepoznatiTripl(hint, polje_2, kandidati);
	ukljucivanjeVrednostiPrepoznatiTripl(hint, polje_3, kandidati);

	let duzina_1 = hint.listaHint.length;

	let niz = (niz_naziv == "Red")? sudoku_tabela.redovi[niz_indeks] : (niz_naziv == "Kolona")? sudoku_tabela.kolone[niz_indeks] : sudoku_tabela.blokovi[niz_indeks];
	
	niz.forEach(poljeIndeks => {
		polje = sudoku_tabela.tabela[poljeIndeks];
		iskljucivanjeSporednihPrepoznatiTripl(hint, polje, kandidati, polje_1, polje_2, polje_3);
	})
	
	if(hint.listaHint.length == duzina_1) return;
	
	lista_hintova.push(hint);
}

function ukljucivanjeVrednostiPrepoznatiTripl(hint, polje, kandidati) {
	kandidati.forEach(kandidat => {
		hint.listaHint.push(        [ polje.indeks , -1 , kandidat , 6 , true, true  ] );
		hint.listaIzvrsavanje.push( [ polje.indeks , -1 , kandidat , 2 , true, false ] );
	});
}

function iskljucivanjeSporednihPrepoznatiTripl(hint, polje, kandidati, polje_1, polje_2, polje_3) {
	if(!polje.otkrivanje)              return;
	if(polje.indeks == polje_1.indeks ||
	   polje.indeks == polje_2.indeks ||
	   polje.indeks == polje_3.indeks) return;

	kandidati.forEach(kandidat => {
		if(polje.kandidati[kandidat] > 0) {
			hint.listaHint.push(        [ polje.indeks , -1, kandidat, 3, true , true  ] );
			hint.listaIzvrsavanje.push( [ polje.indeks , -1, kandidat, 0, true , false ] );
		}
	})
}

function generisanjeHintovaPrepoznatiTriplovi(lista_hintova, lista_kandidata, niz_naziv, niz_indeks, sudoku_tabela) {
	lista_kandidata.forEach(hint => {
		generisanjeHintaPrepoznatiTripl(lista_hintova, hint, niz_naziv, niz_indeks, sudoku_tabela)
	});
}

function ispitivanjeKombinacijePrepoznatiTriplet(kombinacija) {
	let vrednosti     = [ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ];
	let nizTriplet    = [ ];
	let brPrepoznatih = 0;

	kombinacija.forEach(kandidat => {
		kandidati = kandidat[1];
		kandidati.forEach(kandidat => {
			if(vrednosti[kandidat] == 0) {
				vrednosti[kandidat] = 1;
				nizTriplet.push(kandidat);
				brPrepoznatih++;
			}
		});
	});

	if(nizTriplet.length == 3) {
		return nizTriplet;
	}
	else {
		return null;
	}
}

function filtriranjeKombinacijaPrepoznatiTriplet(kombinacije) {
	let novaLista = [];

	kombinacije.forEach(kombinacija => {
		let rez = ispitivanjeKombinacijePrepoznatiTriplet(kombinacija);
		if(rez != null) {
			novaLista.push( [ rez , kombinacija ] );
		}
	});

	return novaLista;
}

function kreiranjeKombinacijaPrepoznatiTriplet(niz_kandidata) {
	let novaLista = [ ];

	for(let i = 0; i < niz_kandidata.length - 2; i++) {
		for(let j = i + 1; j < niz_kandidata.length - 1; j++) {
			for(let k = j + 1; k < niz_kandidata.length; k++) {
				novaLista.push( [ niz_kandidata[i] , niz_kandidata[j] , niz_kandidata[k] ] );
			}
		}
	}

	return novaLista;
}

function prebrojavanjeKandidataPrepoznatiTriplet(lista_hintova, polje, niz_prebrojavanje) {
	if(!polje.otkrivanje) return;

	let kandidati          = polje.kandidati;
	let ukljuceniKandidati = [ ];

	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		if(kandidati[i] > 0) {
			ukljuceniKandidati.push(i);
		}
	}

	if(ukljuceniKandidati.length == 2 || ukljuceniKandidati.length == 3) {
		let rez = [ ];
		
		ukljuceniKandidati.forEach(kandidat => {
			rez.push(kandidat);
		})
		
		niz_prebrojavanje.push( [ polje, rez ] );
	}
}

function pretragaPrepoznatiTripletNiz(lista_hintova, niz_naziv, niz_indeks, niz, sudoku_tabela) {
	let nizPrebrojavanje = [ ];
	
	for(let i = 0; i < niz.length; i++) {
		prebrojavanjeKandidataPrepoznatiTriplet(lista_hintova, sudoku_tabela.tabela[niz[i]], nizPrebrojavanje);
	}
	
	nizPrebrojavanje = kreiranjeKombinacijaPrepoznatiTriplet(nizPrebrojavanje);
	nizPrebrojavanje = filtriranjeKombinacijaPrepoznatiTriplet(nizPrebrojavanje);
		
	if(nizPrebrojavanje.length < 1) return;
	
	generisanjeHintovaPrepoznatiTriplovi(lista_hintova, nizPrebrojavanje, niz_naziv, niz_indeks, sudoku_tabela);
}


function potragaZaHintovimaPrepoznatiTriplet(sudoku_tabela) {
	if(!PRETRAGA_PREPOZNATI_TRIPLET) return [ ];

	let lista_hintova = [ ];

	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let red = sudoku_tabela.redovi[i];
		pretragaPrepoznatiTripletNiz(lista_hintova, "Red", i, red, sudoku_tabela);
	}

	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let kolona = sudoku_tabela.kolone[i];
		pretragaPrepoznatiTripletNiz(lista_hintova, "Kolona", i, kolona, sudoku_tabela);
	}

	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let blok = sudoku_tabela.blokovi[i];
		pretragaPrepoznatiTripletNiz(lista_hintova, "Blok", i, blok, sudoku_tabela);
	}
		
	return lista_hintova;
}






