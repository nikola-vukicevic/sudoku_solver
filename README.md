# sudoku_solver

Sudoku solver koji traži rešenje korak po korak (WIP; za sada još uvek mestimično ima sitnih UI bagova).

## Demo

https://www.codeblog.rs/primeri/sudoku_solver/

## Info

Za sada implementirane tehnike:

- ažuriranje kandidata (prosta eliminacija kandidata ukrštanjem reda, kolone i bloka)
- jedini kandidat
- skriveni singl
- prepoznati par / triplet
- upereni par
- skriveni par
- prisvajajući par / triplet
- x-wing
- xy-wing
- coloring
- x-cycles (proširenje coloring koncepta, ne previše komplikovanije)

U planu:

- xyz-wing (proširenje xy-wing koncepta, ne mnogo komplikovanije) - WIP 
- wxyz-wing (proširenje xy-wing koncepta, ne mnogo komplikovanije)
- xy-chain (proširenje xy-wing koncepta, ne mnogo komplikovanije)
- alternating inference chains (proširenje i objedinjavanje coloring i x-cycles koncepata, ponešto komplikovanije)
