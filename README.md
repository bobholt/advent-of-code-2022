# Advent of Code 2022

Functional, strongly-typed (not gradually-typed) immutable typescript 
version.

## Requirements

- [Node](https://nodejs.org/en/) with NPM
- [Typescript](https://www.typescriptlang.org/)
- [ts-node](https://typestrong.org/ts-node/)

## Usage

The Typescript files in the `src` directory will can be executed from the
command line if [ts-node](https://typestrong.org/ts-node/) is 
npm-installed globally.

My plan is to edit the day's file (`src/1.ts` for day 1), which should be 
executable (`chmod 755 *.ts`), and execute it on the command line 
(`./src/1.ts`).

## Methodology

I'm planning on treating this as purely functional as I can get. JS-based 
means that I won't be frustrated by syntax, and that I can implement 
helper modules or functions as I go that will help me maintain functional 
patterns without thinking too hard about it. A familiar syntax means that 
I'll stick with it longer.

## Testing

I'll figure that out. But since I can run files arbitrarily from the 
command line and use my files as ES modules, I should be able to have a 
`test` directory with a files corresponding to each src file that imports 
that source file as a module, executes its functions and returns whether 
or not the values match the expected. If I find myself creating a more 
fully-featured test suite, I'll just import one.
