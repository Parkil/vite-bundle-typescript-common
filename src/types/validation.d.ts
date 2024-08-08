import DATA_TYPE from "../enums/data.type"

export type ValidateElementOption = {required:boolean, dataType: DATA_TYPE, min?: number, max?: number}

export type ValidateElementOptionRecord = Record<string, ValidateElementOption>

export type ValidateOption = {required:boolean, dataType: DATA_TYPE, min?: number, max?: number, elementOption?: ValidateElementOptionRecord}

export type ValidateOptionRecord = Record<string, ValidateOption>

export type ValidateTargetParam = number | string | number[] | string[] | boolean | Record<string, any>

export type ValidateTargetRecord = Record<string, ValidateTargetParam>

