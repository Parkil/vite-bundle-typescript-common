import DATA_TYPE from "../enums/data.type"

export type ValidateElementOptionType = {required:boolean, dataType: DATA_TYPE, min?: number, max?: number}

export type ValidateElementOptionRecord = Record<string, ValidateElementOptionType>

export type ValidateOptionType = {required:boolean, dataType: DATA_TYPE, min?: number, max?: number, elementOption?: ValidateElementOptionRecord}

export type ValidateOptionRecord = Record<string, ValidateOptionType>

export type ValidateTargetParam = number | string | number[] | string[] | boolean | Record<string, any>

export type ValidateTargetRecord = Record<string, ValidateTargetParam>

