enum VALIDATE_ERROR_TYPE {
  INVALID_DATA_KEY, // data 의 key 가 잘못된 경우
  VALUE_EMPTY, // 값이 입력되지 않음
  INVALID_VALUE_TYPE, // 값의 데이터 유형이 잘못됨
  DATA_RANGE_EXCEED, // 값이 허용된 범위를 초과
  DATA_LENGTH_EXCEED, // 데이터의 길이가 허용된 범위를 초과
  INVALID_ELEMENTS,// 하위 요소 에 잘못된 값이 존재하는 경우
  NONE// 정상
}

export default VALIDATE_ERROR_TYPE
