declare module 'js-sql-parser'{
    export class Parser{
        static parse(query: string): any;
        static stringify(SQL:any):string;
    };

}



//     export interface SelectIdentifier {
//         type: string;
//         value: string;
//         alias?: any;
//         hasAs?: any;
//     }

//     export interface SelectItems {
//         type: string;
//         value: SelectIdentifier[];
//     }

//     export interface Value5 {
//         type: string;
//         value: string;
//     }

//     export interface Value6 {
//         type: string;
//         value: string;
//     }

//     export interface Left {
//         type: string;
//         value: Value6;
//         partition?: any;
//         alias?: any;
//         hasAs?: any;
//         indexHintOpt?: any;
//     }

//     export interface Value7 {
//         type: string;
//         value: string;
//     }

//     export interface Right {
//         type: string;
//         value: Value7;
//         partition?: any;
//         alias?: any;
//         hasAs?: any;
//         indexHintOpt?: any;
//     }

//     export interface Left2 {
//         type: string;
//         value: string;
//     }

//     export interface Right2 {
//         type: string;
//         value: string;
//     }

//     export interface Value8 {
//         type: string;
//         left: Left2;
//         operator: string;
//         right: Right2;
//     }

//     export interface Condition {
//         type: string;
//         value: Value8;
//     }

//     export interface TableReference {
//         type: string;
//         value: Value5;
//         partition?: any;
//         alias?: any;
//         hasAs?: any;
//         indexHintOpt?: any;
//         innerCrossOpt?: any;
//         left: Left;
//         right: Right;
//         condition: Condition;
//     }

//     export interface TableReferences {
//         type: string;
//         value: TableReference;
//     }

//     export interface From {
//         type: string;
//         value: TableReferences[];
//     }

//     export interface Left4 {
//         type: string;
//         value: string;
//     }

//     export interface Right3 {
//         type: string;
//         value: string;
//     }

//     export interface Left3 {
//         type: string;
//         left: Left4;
//         operator: string;
//         right: Right3;
//     }

//     export interface Left5 {
//         type: string;
//         value: string;
//     }

//     export interface Right5 {
//         type: string;
//         value: string;
//     }

//     export interface Right4 {
//         type: string;
//         left: Left5;
//         operator: string;
//         right: Right5;
//     }

//     export interface Where {
//         type: string;
//         operator: string;
//         left: Left3;
//         right: Right4;
//     }






