# naver-place
네이버 플레이스 파서

## 사용법
1. [이 저장소]를 다운로드하세요.
1. [Headless Chrome] 기능이 지원되는 버전의 [Chrome] 브라우저를 설치하세요. (최소 `59`)
1. [Koa 2] 버전을 지원하는 [Node.js]를 설치하세요. (최소 `7.6.0`)
1. `npm install` 커맨드로 의존 모듈을 설치하세요.
1. `npm start` 커맨드로 크롤러 서버를 시작하세요.
1. 서버를 끌 땐 [`pm2 stop`][pm2] 커맨드를 사용하세요.

[이 저장소]: https://github.com/ChalkPE/naver-place
[npm]: https://npmjs.com
[Node.js]: https://nodejs.org
[Koa 2]: https://github.com/koajs/koa
[Headless Chrome]: https://developers.google.com/web/updates/2017/04/headless-chrome
[pm2]: https://github.com/Unitech/pm2

## 스키마
| 필드 | 타입 | 설명 | 예시 |
| :-: | :-: | :-: | :-: |
| `ok` | `boolean` | 성공 여부 | `true` |
| `date` | `string` | 현재 시각 ([ISO 8601] 포맷) | `"2017-08-03T04:31:23.007Z"`
| `message` | `string` | 에러 메세지 (`ok === false`) | `"not found"` |
| `name` | `string` | 매장 이름 | `"가온"` |
| `category` | `string` | 매장 카테고리 | `"한정식"` |
| `tel` | `string` | 매장 전화번호 | `"02-545-9845"` |
| `addresses` | `string[2]` | 매장 주소 (도로명, 지번) | `["서울 종로구 인사동10길 11-3", "관훈동 30-11"]` |
| `homepages` | `string[]` | 매장 홈페이지 목록 | `["http://www.koong.co.kr/", "http://koongkorea.modoo.at/"],` |
| `nBooking` | `boolean` | 네이버 예약 사용 여부 | `false` |
| `cBooking` | `boolean` | 자체 예약 가능 여부 | `true` |
| `menus` | `object[]` | 메뉴 목록 | [하단 참고](#메뉴-스키마) |
| `averagePrice` | `number` | 메뉴 평균 가격 | `16000` |
| `tvs` | `string[]` | `출연 방송 목록` | `["생생정보통 588회", "생방송투데이 692회"]` |

### 메뉴 스키마
| 필드 | 타입 | 설명 | 예시 |
| :-: | :-: | :-: | :-: |
| `name` | `string` | 메뉴 이름 | `와인` |
| `price` | `number` | 정리된 메뉴 가격 | `640000` |
| `originalText` | `string` | 메뉴 가격의 원래 내용 | `"80,000~1,200,000원"` |

[ISO 8601]: https://en.wikipedia.org/wiki/ISO_8601
