/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

generisanjeTabele(sudoku_tabela_glavna);
generisanjeHTMLTabele("sudoku_tabela", sudoku_tabela_glavna.blokovi);
ucitavanjeZagonetke(sudoku_tabela_glavna.zagonetka, sudoku_tabela_glavna);
azuriranjePrikazaTabele(sudoku_tabela_glavna, true);

upisNaUndoStek(sudoku_tabela_glavna, STEK_GLAVNI);
localStorageUpis(sudoku_tabela_glavna);

//if (typeof screen.orientation !== 'undefined') { // ??????
if (window.innerWidth < 800) {
	MOBILNI_UNOS = true;
}
else {
	MOBILNI_UNOS = false;
}

console.log(navigator.userAgent)
//console.log(sudoku_tabela)
