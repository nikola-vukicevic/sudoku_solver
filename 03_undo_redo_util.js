/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

function praznjenjeRedoSteka(stek_glavni) {
	while(stek_glavni.stekRedo.length > 0) {
		stek_glavni.stekRedo.pop();
	}
}

function ocitavanjeUndoSteka(sudoku_tabela, stek_glavni) {
	//if(stek_glavni.stekRedo.length == 0) return;
	/*
	if(stek_glavni.stekUndo.length < 2) {
		console.log("Na steku je samo prvo stanje - ocitavanje")
		return;
	}
	*/

	let json_podaci = stek_glavni.stekUndo[stek_glavni.stekUndo.length - 1];
	let podaci      = JSON.parse(json_podaci);

	kopiranjeStrukture(podaci, sudoku_tabela);
	azuriranjePrikazaTabele(sudoku_tabela, false);

	// console.log("STEK_OCITAVANJE")
	// console.log(`undoStek - br. elemenata: ${stek_glavni.stekUndo.length}`);
	// console.log("------------------------------");
}

function upisNaUndoStek(sudoku_tabela, stek_glavni) {
	praznjenjeRedoSteka(stek_glavni);
	let json_podaci = JSON.stringify(sudoku_tabela);
	stek_glavni.stekUndo.push(json_podaci);
	
	// console.log("STEK_UPIS")
	// console.log(`undoStek - br. elemenata: ${stek_glavni.stekUndo.length}`);
	// console.log("------------------------------");
}

function undo(sudoku_tabela, stek_glavni) {
	if(sudoku_tabela.hintoviAktivni) {
		alert("Nije moguće pozivati komande dok su hintovi aktivni.");
		return;
	}

	if(stek_glavni.stekUndo.length < 2) {
		return;
	}

	let json_podaci = stek_glavni.stekUndo[stek_glavni.stekUndo.length - 1];
	stek_glavni.stekUndo.pop();
	stek_glavni.stekRedo.push(json_podaci);
	
	ocitavanjeUndoSteka(sudoku_tabela, stek_glavni);
}

function redo(sudoku_tabela, stek_glavni) {
	if(sudoku_tabela.hintoviAktivni) {
		alert("Nije moguće pozivati komande dok su hintovi aktivni.");
		return;
	}
	
	if(stek_glavni.stekRedo.length == 0) return;

	let json_podaci = stek_glavni.stekRedo[stek_glavni.stekRedo.length - 1];
	stek_glavni.stekRedo.pop();
	stek_glavni.stekUndo.push(json_podaci);

	ocitavanjeUndoSteka(sudoku_tabela, stek_glavni);
}

function localStorageCitanje() {
	if(localStorage.getItem("podaci") === null) return false;

	let json_podaci = localStorage.getItem("podaci");
	let podaci      = JSON.parse(json_podaci)
	tabela          = podaci
	return podaci;
}

function localStorageUpis(sudoku_tabela) {
	let json_podaci = JSON.stringify(sudoku_tabela);
	localStorage.setItem("podaci", json_podaci);
}

function uklanjanjeDuplikataNiz(niz) {
	if(niz.length == 0) return niz;
	
	let novi = [ ];
	novi.push(niz[0]);

	for(let i = 1; i < niz.length; i++) {
		if(niz[i] != niz[i - 1]) {
			novi.push(niz[i]);
		}
	}

	return novi
}

function kopiranjeDuplikataNiz(niz) {
	if(niz.length < 2) return niz;
	
	let novi = [ ];
	
	for(let i = 1; i < niz.length; i++) {
		if(niz[i] === niz[i - 1]) {
			novi.push(niz[i]);
		}
	}

	return novi
}
