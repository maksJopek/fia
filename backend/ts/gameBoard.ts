import { Color, GameBoard } from '../../helpers/helpersBack';
export const gameBoard: GameBoard = {
    map: [
        { x: 0, y: 4, chequers: [], start: Color.red },
        { x: 1, y: 4, chequers: [], start: -1 },
        { x: 2, y: 4, chequers: [], start: -1 },
        { x: 3, y: 4, chequers: [], start: -1 },
        { x: 4, y: 4, chequers: [], start: -1 },
        { x: 4, y: 3, chequers: [], start: -1 },
        { x: 4, y: 2, chequers: [], start: -1 },
        { x: 4, y: 1, chequers: [], start: -1 },
        { x: 4, y: 0, chequers: [], start: -1 },
        { x: 5, y: 0, chequers: [], start: -1 },
        { x: 6, y: 0, chequers: [], start: Color.blue },
        { x: 6, y: 1, chequers: [], start: -1 },
        { x: 6, y: 2, chequers: [], start: -1 },
        { x: 6, y: 3, chequers: [], start: -1 },
        { x: 6, y: 4, chequers: [], start: -1 },
        { x: 7, y: 4, chequers: [], start: -1 },
        { x: 8, y: 4, chequers: [], start: -1 },
        { x: 9, y: 4, chequers: [], start: -1 },
        { x: 10, y: 4, chequers: [], start: -1 },
        { x: 10, y: 5, chequers: [], start: -1 },
        { x: 10, y: 6, chequers: [], start: Color.green },
        { x: 9, y: 6, chequers: [], start: -1 },
        { x: 8, y: 6, chequers: [], start: -1 },
        { x: 7, y: 6, chequers: [], start: -1 },
        { x: 6, y: 6, chequers: [], start: -1 },
        { x: 6, y: 7, chequers: [], start: -1 },
        { x: 6, y: 8, chequers: [], start: -1 },
        { x: 6, y: 9, chequers: [], start: -1 },
        { x: 6, y: 10, chequers: [], start: -1 },
        { x: 5, y: 10, chequers: [], start: -1 },
        { x: 4, y: 10, chequers: [], start: Color.yellow },
        { x: 4, y: 9, chequers: [], start: -1 },
        { x: 4, y: 8, chequers: [], start: -1 },
        { x: 4, y: 7, chequers: [], start: -1 },
        { x: 4, y: 6, chequers: [], start: -1 },
        { x: 3, y: 6, chequers: [], start: -1 },
        { x: 2, y: 6, chequers: [], start: -1 },
        { x: 1, y: 6, chequers: [], start: -1 },
        { x: 0, y: 6, chequers: [], start: -1 },
        { x: 0, y: 5, chequers: [], start: -1 },
    ],
    // @ts-ignore
    bases: {
        [Color.red]: [
            { x: 1, y: 1, chequer: -1 },
            { x: 1, y: 2, chequer: -1 },
            { x: 2, y: 2, chequer: -1 },
            { x: 2, y: 1, chequer: -1 },
        ],
        [Color.blue]: [
            { x: 8, y: 1, chequer: -1 },
            { x: 9, y: 1, chequer: -1 },
            { x: 9, y: 2, chequer: -1 },
            { x: 8, y: 2, chequer: -1 },
        ],
        [Color.green]: [
            { x: 8, y: 8, chequer: -1 },
            { x: 9, y: 8, chequer: -1 },
            { x: 9, y: 9, chequer: -1 },
            { x: 8, y: 9, chequer: -1 },
        ],
        [Color.yellow]: [
            { x: 1, y: 8, chequer: -1 },
            { x: 2, y: 8, chequer: -1 },
            { x: 2, y: 9, chequer: -1 },
            { x: 1, y: 9, chequer: -1 },
        ],
    },
    // @ts-ignore
    homes: {
        [Color.red]: [
            { x: 5, y: 1, chequer: -1 },
            { x: 5, y: 2, chequer: -1 },
            { x: 5, y: 3, chequer: -1 },
            { x: 5, y: 4, chequer: -1 },
        ],
        [Color.blue]: [
            { x: 1, y: 5, chequer: -1 },
            { x: 2, y: 5, chequer: -1 },
            { x: 3, y: 5, chequer: -1 },
            { x: 4, y: 5, chequer: -1 },
        ],
        [Color.green]: [
            { x: 5, y: 9, chequer: -1 },
            { x: 5, y: 8, chequer: -1 },
            { x: 5, y: 7, chequer: -1 },
            { x: 5, y: 6, chequer: -1 },
        ],
        [Color.yellow]: [
            { x: 9, y: 5, chequer: -1 },
            { x: 8, y: 5, chequer: -1 },
            { x: 7, y: 5, chequer: -1 },
            { x: 6, y: 5, chequer: -1 },
        ],
    }
}