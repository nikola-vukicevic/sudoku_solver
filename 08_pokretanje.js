/* -------------------------------------------------------------------------- */
// Copyright (c) 2021. Nikola Vukićević
/* -------------------------------------------------------------------------- */

generisanjeTabele(sudoku_tabela_glavna.tabela);
generisanjeHTMLTabele("sudoku_tabela", sudoku_tabela_glavna.blokovi);
ucitavanjeZagonetke(sudoku_tabela_glavna.zagonetka, sudoku_tabela_glavna);
azuriranjePrikazaTabele(sudoku_tabela_glavna, true);

upisNaUndoStek(sudoku_tabela_glavna, STEK_GLAVNI);
localStorageUpis(sudoku_tabela_glavna);

//console.log(sudoku_tabela)
