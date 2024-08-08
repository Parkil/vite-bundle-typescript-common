import {describe, expect, test} from '@jest/globals'
import {convertOptionDtos} from "../../src/validation/convert.option.dtos"
import {validateMultiParam} from "../../src/validation"
import DATA_TYPE from "../../src/enums/data.type"
import {ValidateOptionRecord} from "../../src/types/validation.type"

describe('validation', () => {
  describe('convertDtos', () => {
    test('정상적인 옵션 데이터를 받아서 option dto 리스트 반환', () => {
      const validateOption: { [key: string]: any } = {
        val1: {
          required: true,
          dataType: DATA_TYPE.STRING,
          min: 3,
          max: 2
        }
      }

      let optionArr = convertOptionDtos(validateOption)
      let compareOption = validateOption['val1']
      expect(optionArr[0].paramName).toEqual('val1')
      expect(optionArr[0].dataType).toEqual(compareOption.dataType)
      expect(optionArr[0].required).toEqual(compareOption.required)
      expect(optionArr[0].min).toEqual(compareOption.min)
      expect(optionArr[0].max).toEqual(compareOption.max)
    })

    test('min, max 없을 경우 테스트', () => {
      const validateOptionString: { [key: string]: any } = {
        val1: {
          required: true,
          dataType: DATA_TYPE.STRING,
        }
      }

      let optionArr = convertOptionDtos(validateOptionString)
      expect(optionArr[0].min).toEqual(0)
      expect(optionArr[0].max).toEqual(Number.MAX_SAFE_INTEGER)

      const validateOptionNumber: { [key: string]: any } = {
        val1: {
          required: true,
          dataType: DATA_TYPE.NUMBER,
        }
      }
      optionArr = convertOptionDtos(validateOptionNumber)
      expect(optionArr[0].min).toEqual(Number.MIN_SAFE_INTEGER)
      expect(optionArr[0].max).toEqual(Number.MAX_SAFE_INTEGER)
    })
  })

  describe('validation', () => {
    const validateOption: ValidateOptionRecord = {
      val1: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 3,
        max: 5,
      },
      val2: {
        required: false,
        dataType: DATA_TYPE.NUMBER,
        min: 3,
        max: 5,
      }
    }

    const param: { [key: string]: any } = {
      val1: '111',
      val2: 3
    }

    test('정상케이스', () => {
      const errorMsg = validateMultiParam(validateOption, [param])
      expect(errorMsg).toEqual('')
    })

    test('데이터 유형이 잘못 되었을 경우(문자 -> 숫자)', () => {
      const wrongTypeParam: { [key: string]: any } = {
        val1: 111,
        val2: 3
      }

      const errorMsg = validateMultiParam(validateOption, [wrongTypeParam])
      expect(errorMsg).toEqual('111(val1) 값은 STRING 이어야 합니다')
    })

    test('데이터 유형이 잘못 되었을 경우(숫자 -> 문자)', () => {
      const wrongTypeParam: { [key: string]: any } = {
        val1: '111',
        val2: '3'
      }

      const errorMsg = validateMultiParam(validateOption, [wrongTypeParam])
      expect(errorMsg).toEqual('3(val2) 값은 NUMBER 이어야 합니다')
    })

    test('필수 값이 누락된 경우', () => {
      const missingParam: { [key: string]: any } = {
        val2: 3
      }

      const errorMsg = validateMultiParam(validateOption, [missingParam])
      expect(errorMsg).toEqual('파라메터 val1의 값이 입력되지 않았습니다')
    })

    test('문자열 길이가 잘못된 경우', () => {
      const wrongRangeParam: { [key: string]: any } = {
        val1: '1111111111',
        val2: 3
      }

      const errorMsg = validateMultiParam(validateOption, [wrongRangeParam])
      expect(errorMsg).toEqual('1111111111(val1) 의 길이는 3 ~ 5 내여야 합니다')
    })

    test('숫자 범위가 잘못된 경우', () => {
      const wrongRangeParam: { [key: string]: any } = {
        val1: '1111',
        val2: 20
      }

      const errorMsg = validateMultiParam(validateOption, [wrongRangeParam])
      expect(errorMsg).toEqual('20(val2) 은 3 ~ 5 의 값을 가져야 합니다')
    })

    test('다중 파라메터 검증(정상)', () => {
      const option: ValidateOptionRecord = {
        id: {
          required: true,
          dataType: DATA_TYPE.STRING,
          min: 1,
          max: 20,
        },
        count: {
          required: true,
          dataType: DATA_TYPE.NUMBER,
          min: 1,
          max: 99,
        }
      }

      let param = {
        id: 'E12345',
        count: 1
      }

      let param2 = {
        id: 'E23572',
        count: 3
      }

      const errorMsg = validateMultiParam(option, [param, param2])
      expect(errorMsg).toEqual('')
    })

    test('다중 파라메터 검증(비정상)', () => {
      const option: ValidateOptionRecord = {
        id: {
          required: true,
          dataType: DATA_TYPE.STRING,
          min: 1,
          max: 20,
        },
        count: {
          required: true,
          dataType: DATA_TYPE.NUMBER,
          min: 1,
          max: 99,
        }
      }

      let param = {
        id: 'E12345',
        count: 1
      }

      let param2 = {
        id: 'E23572',
        count: 'ㄴㄴㄴㄴㄴ'
      }

      const errorMsg = validateMultiParam(option, [param, param2])
      expect(errorMsg).toEqual('ㄴㄴㄴㄴㄴ(count) 값은 NUMBER 이어야 합니다')
    })

    test('required 가 false 인 값이 들어올 경우 검증', () => {
      const option: ValidateOptionRecord = {
        id: {
          required: true,
          dataType: DATA_TYPE.STRING,
          min: 1,
          max: 20,
        },
        count: {
          required: false,
          dataType: DATA_TYPE.NUMBER,
          min: 1,
          max: 99,
        }
      }

      let param = {
        id: 'E12345',
        count: 'dasfdasfdas'
      }

      const errorMsg = validateMultiParam(option, [param])
      expect(errorMsg).toEqual('dasfdasfdas(count) 값은 NUMBER 이어야 합니다')
    })

    test('option 에 지정되지 않은 key 를 사용하는 경우 검증', () => {
      const option: ValidateOptionRecord = {
        id: {
          required: true,
          dataType: DATA_TYPE.STRING,
          min: 1,
          max: 20,
        },
        count: {
          required: false,
          dataType: DATA_TYPE.NUMBER,
          min: 1,
          max: 99,
        }
      }

      let param = {
        id: 'E12345',
        count2: 1,
        nonValidKey: '잘못된 key1',
        nonValidKey2: '잘못된 key2',
      }

      const errorMsg = validateMultiParam(option, [param])
      expect(errorMsg).toEqual('[count2,nonValidKey,nonValidKey2]는 잘못된 key 입니다')
    })
  })

  test('boolean 값이 잘못 들어올 경우 검증', () => {
    const option: ValidateOptionRecord = {
      flag: {
        required: true,
        dataType: DATA_TYPE.BOOLEAN,
        min: 1,
        max: 20,
      },
    }

    let param = {
      flag: '1111',
    }

    const errorMsg = validateMultiParam(option, [param])
    expect(errorMsg).toEqual('1111(flag) 값은 BOOLEAN 이어야 합니다')
  })

  test('boolean 값이 정상일 경우 검증', () => {
    const option: ValidateOptionRecord = {
      flag: {
        required: true,
        dataType: DATA_TYPE.BOOLEAN,
        min: 1,
        max: 20,
      },
    }

    let param = {
      flag: true,
    }

    const errorMsg = validateMultiParam(option, [param])
    expect(errorMsg).toEqual('')
  })

  test('option 미지정 테스트', () => {
    const option: ValidateOptionRecord = {}

    let param = {
      dasfasdfdasfdas: true,
      dshafewfewfew: 'asfddasfdasfdasfads'
    }

    const errorMsg = validateMultiParam(option, [param])
    expect(errorMsg).toEqual('')
  })

  test('Record 배열 유형 테스트(정상)', () => {
    const option: ValidateOptionRecord = {
      event: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 90,
      },
      productList: {
        required: true,
        dataType: DATA_TYPE.RECORD_ARRAY,
        elementOption: {
          productCode: {
            required: true,
            dataType: DATA_TYPE.STRING,
            min: 1,
            max: 90,
          },
          productName: {
            required: true,
            dataType: DATA_TYPE.STRING,
            min: 1,
            max: 200,
          },
          price: {
            required: true,
            dataType: DATA_TYPE.NUMBER,
            min: 1,
            max: 99999999,
          },
          category: {
            required: true,
            dataType: DATA_TYPE.STRING,
            min: 1,
            max: 100,
          },
          subCategory: {
            required: true,
            dataType: DATA_TYPE.STRING,
            min: 1,
            max: 100,
          },
        }
      },
    }

    let param = {
      event: "setBasketProduct",
      productList: [{productCode: 'Z1235455', productName: '상품', price: 60000, category: '잡화', subCategory: '의류'},
        {productCode: 'Z1235456', productName: '상품2', price: 60000, category: '잡화', subCategory: '공구'}]
    }

    const errorMsg = validateMultiParam(option, [param])
    expect(errorMsg).toEqual('')
  })

  test('Record 배열 유형 테스트(비 정상)', () => {
    const option: ValidateOptionRecord = {
      event: {
        required: true,
        dataType: DATA_TYPE.STRING,
        min: 1,
        max: 90,
      },
      productList: {
        required: true,
        dataType: DATA_TYPE.RECORD_ARRAY,
        elementOption: {
          productCode: {
            required: true,
            dataType: DATA_TYPE.STRING,
            min: 1,
            max: 90,
          },
          productName: {
            required: true,
            dataType: DATA_TYPE.STRING,
            min: 1,
            max: 200,
          },
          price: {
            required: true,
            dataType: DATA_TYPE.NUMBER,
            min: 1,
            max: 99999999,
          },
          category: {
            required: true,
            dataType: DATA_TYPE.STRING,
            min: 1,
            max: 100,
          },
          subCategory: {
            required: true,
            dataType: DATA_TYPE.STRING,
            min: 1,
            max: 100,
          },
        }
      },
    }

    let param = {
      event: "setBasketProduct",
      productList: [{productCode: 111, productName: 222, price: 60000, category: '잡화', subCategory: '의류'},
        {productCode: 'Z1235456', productName: '상품2', price: 60000, category: '잡화', subCategory: '공구'}]
    }

    const errorMsg = validateMultiParam(option, [param])
    expect(errorMsg).toEqual('111(productCode) 값은 STRING 이어야 합니다,222(productName) 값은 STRING 이어야 합니다')
  })
})
