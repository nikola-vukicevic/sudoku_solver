/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

function generisanjeHintaPrisvajajuciPar(lista_hintova, kandidati, niz_naziv, niz_indeks, sudoku_tabela) {
	let hint = {
		indeks: -1 ,
		naslov: ``,
		opis : `` ,
		listaHint: [ ] ,
		listaIzvrsavanje: [ ] ,
	}

	if(kandidati[2].length == 2) {
		popunjavanjeHintaPrisvajajuciParDvaKandidata(hint, kandidati, niz_naziv, niz_indeks, sudoku_tabela);
		if(hint.listaHint.length == 2) return;
	}
	else {
		popunjavanjeHintaPrisvajajuciParTriKandidata(hint, kandidati, niz_naziv, niz_indeks, sudoku_tabela);
		if(hint.listaHint.length == 3) return;
	}

	lista_hintova.push(hint);
}

function iskljucivanjeKandidataPrisvajajuciPar(hint, sudoku_tabela, vrednost, kandidat_1, kandidat_2, kandidat_3 = null) {
	let nizPolja = sudoku_tabela.blokovi[kandidat_1.blok];

	for(let i = 0; i < nizPolja.length; i++){
		let polje = sudoku_tabela.tabela[nizPolja[i]];
		let uslov    = (kandidat_3 != null)? polje.indeks == kandidat_3.indeks : false;
		if(polje.indeks == kandidat_1.indeks || polje.indeks == kandidat_2.indeks || uslov) continue;
		if(polje.otkrivanje) {
			iskljucivanjeKandidataPrepoznatiNizJednoPolje(hint, polje, vrednost/*, kandidat_1, kandidat_2, kandidat_3*/);
		}
	}
}

function iskljucivanjeKandidataPrepoznatiNizJednoPolje(hint, polje, vrednost/*, kandidat_1, kandidat_2, kandidat_3*/) {
	if(polje.kandidati[vrednost] == 0) return;
	
	hint.listaHint.push(        [ polje.indeks , -1, vrednost, 3, true, true  ] );
	hint.listaIzvrsavanje.push( [ polje.indeks , -1, vrednost, 0, true, false ] );
	
	//hint.listaHint.push( [ polje.indeks , -1, vrednost, 6, true, true ] );
}

function popunjavanjeHintaPrisvajajuciParDvaKandidata(hint, kandidati, niz_naziv, niz_indeks, sudoku_tabela) {
	let gramatika = (niz_naziv == "Red")? "redu" : (niz_naziv == "Kolona")? "koloni" : "bloku";
	let vrednost  = kandidati[0];
	let polja     = kandidati[2];
	
	hint.naslov = `Prisvajajući par [Blok #${kandidati[2][0].blok}][P${polja[0].indeks}, P${polja[1].indeks}] - ${vrednost}`;
	
	hint.opis   = `<h3 class='sudoku_h3'>Prisvajajući par (Blok #${kandidati[2][0].blok})</h3>
<p class='sudoku_p'>
	Budući da se vrednost <strong>${vrednost}</strong> u <strong>${niz_indeks}. ${gramatika}</strong> može pojaviti samo u poljima <strong>P${kandidati[2][0].indeks}</strong> i <strong>P${kandidati[2][1].indeks}</strong> i da navedena polja (istovremeno) pripadaju i <strong>${kandidati[2][0].blok}. bloku</strong>, blok praktično "prisvaja" par polja <strong>P${kandidati[2][0].indeks}</strong> i <strong>P${kandidati[2][1].indeks}</strong>, kao jedine pozicije na kojima se vrednost <strong>${vrednost}</strong> može pojaviti u <strong>${kandidati[2][0].blok}. bloku</strong>.
</p>

<p class='sudoku_p'>
	Ostali kandidati sa vrednošću <strong>${vrednost}</strong> u <strong>bloku #${polja[0].blok}</strong> mogu se <strong>isključiti</strong>.
</p>`;

	hint.listaHint.push( [ kandidati[2][0].indeks , -1, vrednost, 6, true, true ] );
	hint.listaHint.push( [ kandidati[2][1].indeks , -1, vrednost, 6, true, true ] );

	iskljucivanjeKandidataPrisvajajuciPar(hint, sudoku_tabela, vrednost, polja[0], polja[1]);
}

function popunjavanjeHintaPrisvajajuciParTriKandidata(hint, kandidati, niz_naziv, niz_indeks, sudoku_tabela) {
	let gramatika = (niz_naziv == "Red")? "redu" : (niz_naziv == "Kolona")? "koloni" : "bloku";
	let vrednost  = kandidati[0];
	let polja     = kandidati[2];
	
	hint.naslov = `Prisvajajući triplet [Blok #${kandidati[2][0].blok}][P${polja[0].indeks}, P${polja[1].indeks}, P${polja[2].indeks}] - ${vrednost}`;
	
	hint.opis   = `<h3 class='sudoku_h3'>Prisvajajući triplet (Blok #${kandidati[2][0].blok})</h3>
<p class='sudoku_p'>
	Budući da se vrednost <strong>${vrednost}</strong> u <strong>${niz_indeks}. ${gramatika}</strong> može pojaviti samo u poljima <strong>P${kandidati[2][0].indeks}</strong>, <strong>P${kandidati[2][1].indeks}</strong> i <strong>P${kandidati[2][2].indeks}</strong> i da navedena polja (istovremeno) pripadaju i <strong>${kandidati[2][0].blok}. bloku</strong>, blok praktično "prisvaja" triplet polja <strong>P${kandidati[2][0].indeks}</strong>, <strong>P${kandidati[2][1].indeks}</strong> i <strong>P${kandidati[2][2].indeks}</strong>, kao jedine pozicije na kojima se vrednost <strong>${vrednost}</strong> može pojaviti u <strong>${kandidati[2][0].blok}. bloku</strong>.
</p>

<p class='sudoku_p'>
	Ostali kandidati sa vrednošću <strong>${vrednost}</strong> u <strong>bloku #${polja[0].blok}</strong> mogu se <strong>isključiti</strong>.
</p>`;

	hint.listaHint.push( [ kandidati[2][0].indeks , -1, vrednost, 6, true, true ] );
	hint.listaHint.push( [ kandidati[2][1].indeks , -1, vrednost, 6, true, true ] );
	hint.listaHint.push( [ kandidati[2][2].indeks , -1, vrednost, 6, true, true ] );

	iskljucivanjeKandidataPrisvajajuciPar(hint, sudoku_tabela, vrednost, polja[0], polja[1], polja[2]);
}

function generisanjeHintovaPrisvajajuciParovi(lista_hintova, lista_kandidata, niz_naziv, niz_indeks, sudoku_tabela) {
	lista_kandidata.forEach(kandidati => {
		generisanjeHintaPrisvajajuciPar(lista_hintova, kandidati, niz_naziv, niz_indeks, sudoku_tabela)
	});
}

function daLiSuKandidatiOkPrisvajajuciPar(kandidati) {
	let blok = kandidati[0].blok;

	for(let i = 1; i < kandidati.length; i++) {
		if(kandidati[i].blok != blok) return false;
	}
	
	return true;
}

function pripremaNizaPrisvajajuciPar(niz_prebrojavanje, niz_tip) {
	let nova_lista = [ ];

	niz_prebrojavanje.forEach((kandidati, i) => {
		if((kandidati[0] == 2 || kandidati[0] == 3) && daLiSuKandidatiOkPrisvajajuciPar(kandidati[1])) {
			nova_lista.push( [ i , kandidati[0] , kandidati[1] ] );
		}
	});

	return nova_lista;
}

function prebrojavanjeKandidataPrisvajajuciPar(lista_hintova, polje, niz_prebrojavanje) {
	if(!polje.otkrivanje) return;

	let kandidati = polje.kandidati;
	
	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		if(kandidati[i] > 0) {
			niz_prebrojavanje[i][0]++;
			niz_prebrojavanje[i][1].push(polje);
		}
	}
}

function pretragaPrisvajajuciParNiz(lista_hintova, niz_tip, niz_naziv, niz_indeks, niz, sudoku_tabela) {
	let nizPrebrojavanje = [ ];
	for(let i = 0; i <= BROJ_BLOKOVA; i++) nizPrebrojavanje.push( [ 0 , [ ] ] );
	
	for(let i = 0; i < niz.length; i++) {
		prebrojavanjeKandidataPrisvajajuciPar(lista_hintova, sudoku_tabela.tabela[niz[i]], nizPrebrojavanje);
	}

	nizPrebrojavanje = pripremaNizaPrisvajajuciPar(nizPrebrojavanje, niz_tip);

	generisanjeHintovaPrisvajajuciParovi(lista_hintova, nizPrebrojavanje, niz_naziv, niz_indeks, sudoku_tabela)
}

function potragaZaHintovimaPrisvajajuciPar(sudoku_tabela) {
	if(!PRETRAGA_PRISVAJAJUCI_PAR) return [ ];

	let lista_hintova = [ ];

	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let red = sudoku_tabela.redovi[i];
		pretragaPrisvajajuciParNiz(lista_hintova, 1, "Red", i, red, sudoku_tabela);
	}

	for(let i = 1; i <= BROJ_BLOKOVA; i++) {
		let kolona = sudoku_tabela.kolone[i];
		pretragaPrisvajajuciParNiz(lista_hintova, 2, "Kolona", i, kolona, sudoku_tabela);
	}
		
	return lista_hintova;
}