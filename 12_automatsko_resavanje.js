function automatskoResavanje(sudoku_tabela) {
	
	/* ----- Telemetrija ---------------------------------------------------- */
	let T1 = performance.now();
	/* ---------------------------------------------------------------------- */

	let najkomplikovanijaTehnika = {
		kompleksnost: -1 ,
		opis:         "" ,
	}

	let brojac = 0;

	azuriranjeKandidataOsnovnoAutomatik(sudoku_tabela_glavna, true);

	while(sudoku_tabela.brojPreostalihPolja > 0) {
		brojac++;
		generisanjeHintovaAutomatskoResavanje(sudoku_tabela, false, true);

		// sudoku_tabela.automatskoAzuriranje = false;

		sacuvanaTabela = tabelaSnapshot(sudoku_tabela);
		potragaZaHintovima(sudoku_tabela, listaHintova, false, true); // automatsko ažuriranje - false, samo prvi - true

		// console.log(listaHintova)

		if(listaHintova.length == 0) {
			console.log(`Broj prolazaka: ${brojac}`);
			console.log(`Tabela nije rešiva upotrebom implementiranih tehnika`);
			console.log(`---------------------------------------`);
			// alert(`Tabela nije rešiva upotrebom implementiranih tehnika`);
			return {
				rezultat:  true ,
				opis:      "Tabela nije rešiva upotrebom implementiranih tehnika" ,
				struktura: null
			}

		}

		let rez = trazenjeNajkomplikovanijeTehnike(listaHintova, najkomplikovanijaTehnika)

		usvajanjeHintaAutomatskoResavanje(sudoku_tabela, sacuvanaTabela, listaHintova, 1); // Da li je indeks 1???
	}

	/* ----- Telemetrija ---------------------------------------------------- */
	let T2    = performance.now();
	let ODZIV = T2 - T1;
	console.log(`Automatsko pronalaženje rešenja: ${ODZIV}ms`);
	/* ---------------------------------------------------------------------- */

	azuriranjePrikazaTabele(sudoku_tabela, true);
	console.log(najkomplikovanijaTehnika)
	alert(najkomplikovanijaTehnika.opis)
}

function trazenjeNajkomplikovanijeTehnike(lista_hintova, najkomplikovanija_tehnika) {
	let uslov = false;
	uslov = lista_hintova.length == 0;
	uslov = uslov || lista_hintova[0].kompleksnost > najkomplikovanija_tehnika.kompleksnost;

	if(uslov) {
		najkomplikovanija_tehnika.kompleksnost = lista_hintova[0].kompleksnost;
		najkomplikovanija_tehnika.opis         = lista_hintova[0].naslov;
	}
}

function usvajanjeHintaAutomatskoResavanje(sudoku_tabela, sacuvana_tabela, hintovi_lista, hint_indeks) {
	// sudoku_tabela.hintoviAktivni       = false;
	// sudoku_tabela.automatskoAzuriranje = true;
	// let hintoviLista = document.getElementById(`hintovi_lista`);
	// let hintoviInfo  = document.getElementById(`hintovi_info`);
	
	// hintoviLista.innerHTML = "";
	// hintoviInfo.innerHTML  = "";

	let tabelaHintovi = generisanjeHintTabele(sacuvana_tabela, hintovi_lista[hint_indeks - 1], 2);
	kopiranjeStrukture(tabelaHintovi, sudoku_tabela);
	azuriranjeKandidataOsnovnoAutomatik(sudoku_tabela, false); // ???
	//upisNaUndoStek(sudoku_tabela, STEK_GLAVNI);
}

function generisanjeHintovaAutomatskoResavanje(sudoku_tabela, automatik, samo_prvi) {
	// if(sudoku_tabela.hintoviAktivni) {
	// 	alert("Nije moguće pozivati komande dok su hintovi aktivni.");
	// 	return;
	// }
	
	/* ----- telemetrija ---------------------------------------------------- */
	// let t1 = performance.now();
	/* ---------------------------------------------------------------------- */

	// sudoku_tabela.automatskoAzuriranje = automatik;

	sacuvanaTabela = tabelaSnapshot(sudoku_tabela);
	potragaZaHintovima(sudoku_tabela, listaHintova, automatik, samo_prvi);

	if(listaHintova.length == 0) return;

	// popunjavanjeListeHintova(sudoku_tabela, listaHintova);
	// biranjePrvogHinta(sudoku_tabela);

	// sudoku_tabela.hintoviAktivni = true;
	// sudoku_tabela.brojHintova    = listaHintova.length;

	/* ----- telemetrija ---------------------------------------------------- */
	// let t2 = performance.now();
	// let odziv = t2 - t1;
	// console.log("------------------------------")
	// console.log(`GENERISANJE HINTOVA: ${odziv}ms`)
	// console.log("------------------------------")
}

function azuriranjeKandidataOsnovnoAutomatik(sudoku_tabela, na_dugme) {
	
	if(sudoku_tabela.hintoviAktivni) {
		alert("Nije moguće pozivati komande dok su hintovi aktivni.");
		return;
	}
	
	/* ----- telemetrija ---------------------------------------------------- */
	// let t1 = performance.now();
	/* ---------------------------------------------------------------------- */
	

	rezim = 2; // 1 - oznacavanje kandidata crvenom; 2 - uklanjanje
	
	if(na_dugme) azuriranjeKandidataUkljucivanjeSvihKandidata(sudoku_tabela);
	
	azuriranjeKandidataOsnovnoRedovi(sudoku_tabela, rezim);
	azuriranjeKandidataOsnovnoKolone(sudoku_tabela, rezim);
	azuriranjeKandidataOsnovnoBlokovi(sudoku_tabela, rezim);

	prebrojavanjePreostalih(sudoku_tabela);
	// azuriranjePrikazaTabele(sudoku_tabela, true);

	//upisNaUndoStek(sudoku_tabela, STEK_GLAVNI);
	//localStorageUpis(sudoku_tabela);
	
	/* ----- telemetrija ---------------------------------------------------- */
	// let t2 = performance.now();
	// let odziv = t2 - t1 + "ms";
	// console.log(`Osnovno isključivanje kandidata - ${odziv}`)
	/* ---------------------------------------------------------------------- */
}