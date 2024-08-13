## Recoble-Common-Module

#### Recoble-Web, Recoble-React, Recoble-Vue 에서 사용되는 공통로직을 정의한 모듈

##### 명령어 (기본)
```
npm run build:local (.env.mypc 설정을 이용하여 bundling)
npm run build:dev (.env.dev 설정을 이용하여 bundling)
npm run build:prod (.env.prod 설정을 이용하여 bundling)
```

bundling 된 결과물은 dist 폴더에 생성된다 

##### 명령어 (local 개발)
```
npm run build:local:mac
npm run build:local:win
```

위 명령어는 npm package local 개발을 위한 명령어로 설정된 경로는 각자 맞게 수정하면 된다

##### NPM Package Local 설정
NPM Package 개발 시 수정 사항을  항상 NPM Repository 에 올릴 수가 없기 때문에 Local 설정을 설정하여 개발한다

###### 1.특정 폴더에 package.json, dist 폴더를 복사한다
###### 2.복사한 폴더에 가서 다음 명령어를 실행한다
```
npm link
```
###### 3.NPM Global Link 상대 경로를 취득한다
```
npm ls --global [package.json name]

`-- recoble-common-module@0.0.1 -> .\..\..\..\..\..\npm-local-package\recoble-common-module
```
###### 4.해당 NPM Package 를 사용하는 모듈의 package.json 설정
```
"dependencies": {  
  "recoble-common-module": "file://.\\..\\..\\..\\..\\..\\npm-local-package\\recoble-common-module"  
},
```




