(function(){
"use strict";
var TODAY="2026-07-31";

/* ---------- currency (rate = KRW per 1 unit) ---------- */
var CUR={
 KRW:{s:"₩",ko:"원",r:1,dec:0},
 JPY:{s:"¥",ko:"엔",r:9.2,dec:0},
 CNY:{s:"CN¥",ko:"위안",r:191,dec:2},
 USD:{s:"$",ko:"달러",r:1385,dec:2},
 EUR:{s:"€",ko:"유로",r:1502,dec:2},
 GBP:{s:"£",ko:"파운드",r:1760,dec:2},
 CHF:{s:"Fr",ko:"스위스프랑",r:1720,dec:2},
 AUD:{s:"A$",ko:"호주달러",r:905,dec:2},
 NZD:{s:"NZ$",ko:"뉴질랜드달러",r:830,dec:2},
 CAD:{s:"C$",ko:"캐나다달러",r:995,dec:2},
 SGD:{s:"S$",ko:"싱가포르달러",r:1030,dec:2},
 HKD:{s:"HK$",ko:"홍콩달러",r:177,dec:2},
 TWD:{s:"NT$",ko:"대만달러",r:43,dec:0},
 MOP:{s:"MOP$",ko:"마카오파타카",r:172,dec:2},
 THB:{s:"฿",ko:"바트",r:39,dec:2},
 VND:{s:"₫",ko:"동",r:0.054,dec:0},
 PHP:{s:"₱",ko:"페소",r:24,dec:2},
 IDR:{s:"Rp",ko:"루피아",r:0.085,dec:0},
 MYR:{s:"RM",ko:"링깃",r:310,dec:2},
 INR:{s:"₹",ko:"루피",r:16,dec:2},
 NPR:{s:"Rs",ko:"네팔루피",r:10,dec:2},
 LKR:{s:"Rs",ko:"스리랑카루피",r:4.6,dec:2},
 PKR:{s:"₨",ko:"파키스탄루피",r:4.9,dec:2},
 BDT:{s:"৳",ko:"타카",r:11.4,dec:2},
 MMK:{s:"K",ko:"짯",r:0.66,dec:0},
 KHR:{s:"៛",ko:"리엘",r:0.34,dec:0},
 LAK:{s:"₭",ko:"킵",r:0.064,dec:0},
 BND:{s:"B$",ko:"브루나이달러",r:1030,dec:2},
 MNT:{s:"₮",ko:"투그릭",r:0.4,dec:0},
 DKK:{s:"kr",ko:"덴마크크로네",r:196,dec:2},
 SEK:{s:"kr",ko:"스웨덴크로나",r:132,dec:2},
 NOK:{s:"kr",ko:"노르웨이크로네",r:126,dec:2},
 ISK:{s:"kr",ko:"아이슬란드크로나",r:10.2,dec:0},
 CZK:{s:"Kč",ko:"코루나",r:60,dec:2},
 PLN:{s:"zł",ko:"즈워티",r:352,dec:2},
 HUF:{s:"Ft",ko:"포린트",r:3.7,dec:0},
 RON:{s:"lei",ko:"레우",r:300,dec:2},
 BGN:{s:"лв",ko:"레프",r:768,dec:2},
 HRK:{s:"kn",ko:"쿠나",r:199,dec:2},
 RSD:{s:"дин",ko:"디나르",r:12.8,dec:0},
 TRY:{s:"₺",ko:"리라",r:33,dec:2},
 RUB:{s:"₽",ko:"루블",r:14.5,dec:2},
 UAH:{s:"₴",ko:"흐리우냐",r:33,dec:2},
 ILS:{s:"₪",ko:"셰켈",r:390,dec:2},
 AED:{s:"د.إ",ko:"디르함",r:377,dec:2},
 SAR:{s:"﷼",ko:"리얄",r:369,dec:2},
 QAR:{s:"﷼",ko:"카타르리얄",r:380,dec:2},
 KWD:{s:"د.ك",ko:"쿠웨이트디나르",r:4520,dec:3},
 BHD:{s:".د.ب",ko:"바레인디나르",r:3670,dec:3},
 OMR:{s:"﷼",ko:"오만리알",r:3600,dec:3},
 JOD:{s:"د.ا",ko:"요르단디나르",r:1954,dec:3},
 EGP:{s:"E£",ko:"이집트파운드",r:28,dec:2},
 MAD:{s:"د.م.",ko:"디르함",r:139,dec:2},
 TND:{s:"د.ت",ko:"튀니지디나르",r:445,dec:3},
 ZAR:{s:"R",ko:"랜드",r:78,dec:2},
 KES:{s:"KSh",ko:"실링",r:10.7,dec:2},
 TZS:{s:"TSh",ko:"탄자니아실링",r:0.52,dec:0},
 ETB:{s:"Br",ko:"비르",r:10.5,dec:2},
 NGN:{s:"₦",ko:"나이라",r:0.9,dec:0},
 GHS:{s:"₵",ko:"세디",r:92,dec:2},
 MXN:{s:"Mex$",ko:"페소",r:74,dec:2},
 BRL:{s:"R$",ko:"헤알",r:254,dec:2},
 ARS:{s:"AR$",ko:"아르헨티나페소",r:1.05,dec:2},
 CLP:{s:"CLP$",ko:"칠레페소",r:1.45,dec:0},
 COP:{s:"COL$",ko:"콜롬비아페소",r:0.34,dec:0},
 PEN:{s:"S/",ko:"솔",r:370,dec:2},
 UYU:{s:"$U",ko:"우루과이페소",r:34,dec:2},
 BOB:{s:"Bs",ko:"볼리비아노",r:200,dec:2},
 CRC:{s:"₡",ko:"콜론",r:2.6,dec:0},
 GTQ:{s:"Q",ko:"케찰",r:179,dec:2},
 DOP:{s:"RD$",ko:"도미니카페소",r:22,dec:2},
 CUP:{s:"₱",ko:"쿠바페소",r:57,dec:2},
 JMD:{s:"J$",ko:"자메이카달러",r:8.8,dec:2},
 FJD:{s:"FJ$",ko:"피지달러",r:610,dec:2},
 KZT:{s:"₸",ko:"텡게",r:2.7,dec:2},
 UZS:{s:"soʻm",ko:"숨",r:0.11,dec:0},
 GEL:{s:"₾",ko:"라리",r:510,dec:2},
 AZN:{s:"₼",ko:"마나트",r:815,dec:2},
 AMD:{s:"֏",ko:"드람",r:3.6,dec:0},
 MVR:{s:"Rf",ko:"루피아",r:90,dec:2},
 MUR:{s:"Rs",ko:"모리셔스루피",r:30,dec:2}
};
/* 카테고리 아이콘 40종 */
var ICONS=["🎁","🧼","💊","📚","🍺","🚲","💇","🐾","🎨","🏋️",
 "☕","🍰","🍜","🍔","🍣","🍷","🧋","🛒","🧻","🔌",
 "🚕","🚇","⛴","🎡","🎬","🎤","🎧","📷","🧳","🗺",
 "💈","💅","🧴","👕","👟","💐","🪥","🩹","📶","💸"];

var CITIES=[
 ["도쿄","Tokyo","일본","🇯🇵","JPY"],
 ["오사카","Osaka","일본","🇯🇵","JPY"],
 ["교토","Kyoto","일본","🇯🇵","JPY"],
 ["후쿠오카","Fukuoka","일본","🇯🇵","JPY"],
 ["삿포로","Sapporo","일본","🇯🇵","JPY"],
 ["오키나와","Okinawa","일본","🇯🇵","JPY"],
 ["나고야","Nagoya","일본","🇯🇵","JPY"],
 ["고베","Kobe","일본","🇯🇵","JPY"],
 ["히로시마","Hiroshima","일본","🇯🇵","JPY"],
 ["나라","Nara","일본","🇯🇵","JPY"],
 ["요코하마","Yokohama","일본","🇯🇵","JPY"],
 ["벳푸","Beppu","일본","🇯🇵","JPY"],
 ["구마모토","Kumamoto","일본","🇯🇵","JPY"],
 ["가고시마","Kagoshima","일본","🇯🇵","JPY"],
 ["센다이","Sendai","일본","🇯🇵","JPY"],
 ["가나자와","Kanazawa","일본","🇯🇵","JPY"],
 ["나가사키","Nagasaki","일본","🇯🇵","JPY"],
 ["다카마쓰","Takamatsu","일본","🇯🇵","JPY"],
 ["상하이","Shanghai","중국","🇨🇳","CNY"],
 ["베이징","Beijing","중국","🇨🇳","CNY"],
 ["시안","Xian","중국","🇨🇳","CNY"],
 ["청두","Chengdu","중국","🇨🇳","CNY"],
 ["광저우","Guangzhou","중국","🇨🇳","CNY"],
 ["선전","Shenzhen","중국","🇨🇳","CNY"],
 ["항저우","Hangzhou","중국","🇨🇳","CNY"],
 ["칭다오","Qingdao","중국","🇨🇳","CNY"],
 ["하얼빈","Harbin","중국","🇨🇳","CNY"],
 ["충칭","Chongqing","중국","🇨🇳","CNY"],
 ["쿤밍","Kunming","중국","🇨🇳","CNY"],
 ["구이린","Guilin","중국","🇨🇳","CNY"],
 ["난징","Nanjing","중국","🇨🇳","CNY"],
 ["톈진","Tianjin","중국","🇨🇳","CNY"],
 ["다롄","Dalian","중국","🇨🇳","CNY"],
 ["장자제","Zhangjiajie","중국","🇨🇳","CNY"],
 ["리장","Lijiang","중국","🇨🇳","CNY"],
 ["샤먼","Xiamen","중국","🇨🇳","CNY"],
 ["싼야","Sanya","중국","🇨🇳","CNY"],
 ["타이베이","Taipei","대만","🇹🇼","TWD"],
 ["가오슝","Kaohsiung","대만","🇹🇼","TWD"],
 ["타이중","Taichung","대만","🇹🇼","TWD"],
 ["타이난","Tainan","대만","🇹🇼","TWD"],
 ["화롄","Hualien","대만","🇹🇼","TWD"],
 ["홍콩","Hong Kong","홍콩","🇭🇰","HKD"],
 ["마카오","Macau","마카오","🇲🇴","MOP"],
 ["싱가포르","Singapore","싱가포르","🇸🇬","SGD"],
 ["방콕","Bangkok","태국","🇹🇭","THB"],
 ["치앙마이","Chiang Mai","태국","🇹🇭","THB"],
 ["푸껫","Phuket","태국","🇹🇭","THB"],
 ["파타야","Pattaya","태국","🇹🇭","THB"],
 ["끄라비","Krabi","태국","🇹🇭","THB"],
 ["코사무이","Koh Samui","태국","🇹🇭","THB"],
 ["다낭","Da Nang","베트남","🇻🇳","VND"],
 ["하노이","Hanoi","베트남","🇻🇳","VND"],
 ["호치민","Ho Chi Minh","베트남","🇻🇳","VND"],
 ["나트랑","Nha Trang","베트남","🇻🇳","VND"],
 ["푸꾸옥","Phu Quoc","베트남","🇻🇳","VND"],
 ["하롱","Ha Long","베트남","🇻🇳","VND"],
 ["달랏","Da Lat","베트남","🇻🇳","VND"],
 ["호이안","Hoi An","베트남","🇻🇳","VND"],
 ["세부","Cebu","필리핀","🇵🇭","PHP"],
 ["마닐라","Manila","필리핀","🇵🇭","PHP"],
 ["보라카이","Boracay","필리핀","🇵🇭","PHP"],
 ["팔라완","Palawan","필리핀","🇵🇭","PHP"],
 ["클락","Clark","필리핀","🇵🇭","PHP"],
 ["발리","Bali","인도네시아","🇮🇩","IDR"],
 ["자카르타","Jakarta","인도네시아","🇮🇩","IDR"],
 ["롬복","Lombok","인도네시아","🇮🇩","IDR"],
 ["족자카르타","Yogyakarta","인도네시아","🇮🇩","IDR"],
 ["쿠알라룸푸르","Kuala Lumpur","말레이시아","🇲🇾","MYR"],
 ["코타키나발루","Kota Kinabalu","말레이시아","🇲🇾","MYR"],
 ["페낭","Penang","말레이시아","🇲🇾","MYR"],
 ["랑카위","Langkawi","말레이시아","🇲🇾","MYR"],
 ["말라카","Malacca","말레이시아","🇲🇾","MYR"],
 ["프놈펜","Phnom Penh","캄보디아","🇰🇭","KHR"],
 ["씨엠립","Siem Reap","캄보디아","🇰🇭","KHR"],
 ["비엔티안","Vientiane","라오스","🇱🇦","LAK"],
 ["루앙프라방","Luang Prabang","라오스","🇱🇦","LAK"],
 ["양곤","Yangon","미얀마","🇲🇲","MMK"],
 ["바간","Bagan","미얀마","🇲🇲","MMK"],
 ["반다르스리브가완","Bandar Seri Begawan","브루나이","🇧🇳","BND"],
 ["델리","Delhi","인도","🇮🇳","INR"],
 ["뭄바이","Mumbai","인도","🇮🇳","INR"],
 ["벵갈루루","Bengaluru","인도","🇮🇳","INR"],
 ["첸나이","Chennai","인도","🇮🇳","INR"],
 ["콜카타","Kolkata","인도","🇮🇳","INR"],
 ["자이푸르","Jaipur","인도","🇮🇳","INR"],
 ["고아","Goa","인도","🇮🇳","INR"],
 ["바라나시","Varanasi","인도","🇮🇳","INR"],
 ["카트만두","Kathmandu","네팔","🇳🇵","NPR"],
 ["포카라","Pokhara","네팔","🇳🇵","NPR"],
 ["콜롬보","Colombo","스리랑카","🇱🇰","LKR"],
 ["캔디","Kandy","스리랑카","🇱🇰","LKR"],
 ["다카","Dhaka","방글라데시","🇧🇩","BDT"],
 ["이슬라마바드","Islamabad","파키스탄","🇵🇰","PKR"],
 ["라호르","Lahore","파키스탄","🇵🇰","PKR"],
 ["말레","Male","몰디브","🇲🇻","MVR"],
 ["알마티","Almaty","카자흐스탄","🇰🇿","KZT"],
 ["아스타나","Astana","카자흐스탄","🇰🇿","KZT"],
 ["타슈켄트","Tashkent","우즈베키스탄","🇺🇿","UZS"],
 ["사마르칸트","Samarkand","우즈베키스탄","🇺🇿","UZS"],
 ["울란바토르","Ulaanbaatar","몽골","🇲🇳","MNT"],
 ["트빌리시","Tbilisi","조지아","🇬🇪","GEL"],
 ["바쿠","Baku","아제르바이잔","🇦🇿","AZN"],
 ["예레반","Yerevan","아르메니아","🇦🇲","AMD"],
 ["두바이","Dubai","아랍에미리트","🇦🇪","AED"],
 ["아부다비","Abu Dhabi","아랍에미리트","🇦🇪","AED"],
 ["도하","Doha","카타르","🇶🇦","QAR"],
 ["리야드","Riyadh","사우디아라비아","🇸🇦","SAR"],
 ["제다","Jeddah","사우디아라비아","🇸🇦","SAR"],
 ["무스카트","Muscat","오만","🇴🇲","OMR"],
 ["마나마","Manama","바레인","🇧🇭","BHD"],
 ["쿠웨이트시티","Kuwait City","쿠웨이트","🇰🇼","KWD"],
 ["암만","Amman","요르단","🇯🇴","JOD"],
 ["텔아비브","Tel Aviv","이스라엘","🇮🇱","ILS"],
 ["예루살렘","Jerusalem","이스라엘","🇮🇱","ILS"],
 ["이스탄불","Istanbul","튀르키예","🇹🇷","TRY"],
 ["카파도키아","Cappadocia","튀르키예","🇹🇷","TRY"],
 ["안탈리아","Antalya","튀르키예","🇹🇷","TRY"],
 ["이즈미르","Izmir","튀르키예","🇹🇷","TRY"],
 ["런던","London","영국","🇬🇧","GBP"],
 ["맨체스터","Manchester","영국","🇬🇧","GBP"],
 ["에든버러","Edinburgh","영국","🇬🇧","GBP"],
 ["리버풀","Liverpool","영국","🇬🇧","GBP"],
 ["옥스퍼드","Oxford","영국","🇬🇧","GBP"],
 ["케임브리지","Cambridge","영국","🇬🇧","GBP"],
 ["브라이턴","Brighton","영국","🇬🇧","GBP"],
 ["글래스고","Glasgow","영국","🇬🇧","GBP"],
 ["바스","Bath","영국","🇬🇧","GBP"],
 ["더블린","Dublin","아일랜드","🇮🇪","EUR"],
 ["골웨이","Galway","아일랜드","🇮🇪","EUR"],
 ["파리","Paris","프랑스","🇫🇷","EUR"],
 ["니스","Nice","프랑스","🇫🇷","EUR"],
 ["리옹","Lyon","프랑스","🇫🇷","EUR"],
 ["마르세유","Marseille","프랑스","🇫🇷","EUR"],
 ["보르도","Bordeaux","프랑스","🇫🇷","EUR"],
 ["스트라스부르","Strasbourg","프랑스","🇫🇷","EUR"],
 ["툴루즈","Toulouse","프랑스","🇫🇷","EUR"],
 ["몽생미셸","Mont Saint-Michel","프랑스","🇫🇷","EUR"],
 ["칸","Cannes","프랑스","🇫🇷","EUR"],
 ["바르셀로나","Barcelona","스페인","🇪🇸","EUR"],
 ["마드리드","Madrid","스페인","🇪🇸","EUR"],
 ["세비야","Seville","스페인","🇪🇸","EUR"],
 ["그라나다","Granada","스페인","🇪🇸","EUR"],
 ["발렌시아","Valencia","스페인","🇪🇸","EUR"],
 ["말라가","Malaga","스페인","🇪🇸","EUR"],
 ["빌바오","Bilbao","스페인","🇪🇸","EUR"],
 ["산세바스티안","San Sebastian","스페인","🇪🇸","EUR"],
 ["이비자","Ibiza","스페인","🇪🇸","EUR"],
 ["마요르카","Mallorca","스페인","🇪🇸","EUR"],
 ["톨레도","Toledo","스페인","🇪🇸","EUR"],
 ["리스본","Lisbon","포르투갈","🇵🇹","EUR"],
 ["포르투","Porto","포르투갈","🇵🇹","EUR"],
 ["신트라","Sintra","포르투갈","🇵🇹","EUR"],
 ["로마","Rome","이탈리아","🇮🇹","EUR"],
 ["밀라노","Milan","이탈리아","🇮🇹","EUR"],
 ["베네치아","Venice","이탈리아","🇮🇹","EUR"],
 ["피렌체","Florence","이탈리아","🇮🇹","EUR"],
 ["나폴리","Naples","이탈리아","🇮🇹","EUR"],
 ["볼로냐","Bologna","이탈리아","🇮🇹","EUR"],
 ["토리노","Turin","이탈리아","🇮🇹","EUR"],
 ["팔레르모","Palermo","이탈리아","🇮🇹","EUR"],
 ["아말피","Amalfi","이탈리아","🇮🇹","EUR"],
 ["피사","Pisa","이탈리아","🇮🇹","EUR"],
 ["베로나","Verona","이탈리아","🇮🇹","EUR"],
 ["베를린","Berlin","독일","🇩🇪","EUR"],
 ["뮌헨","Munich","독일","🇩🇪","EUR"],
 ["프랑크푸르트","Frankfurt","독일","🇩🇪","EUR"],
 ["함부르크","Hamburg","독일","🇩🇪","EUR"],
 ["쾰른","Cologne","독일","🇩🇪","EUR"],
 ["드레스덴","Dresden","독일","🇩🇪","EUR"],
 ["하이델베르크","Heidelberg","독일","🇩🇪","EUR"],
 ["뒤셀도르프","Dusseldorf","독일","🇩🇪","EUR"],
 ["슈투트가르트","Stuttgart","독일","🇩🇪","EUR"],
 ["빈","Vienna","오스트리아","🇦🇹","EUR"],
 ["잘츠부르크","Salzburg","오스트리아","🇦🇹","EUR"],
 ["인스브루크","Innsbruck","오스트리아","🇦🇹","EUR"],
 ["할슈타트","Hallstatt","오스트리아","🇦🇹","EUR"],
 ["취리히","Zurich","스위스","🇨🇭","CHF"],
 ["인터라켄","Interlaken","스위스","🇨🇭","CHF"],
 ["루체른","Lucerne","스위스","🇨🇭","CHF"],
 ["제네바","Geneva","스위스","🇨🇭","CHF"],
 ["베른","Bern","스위스","🇨🇭","CHF"],
 ["체르마트","Zermatt","스위스","🇨🇭","CHF"],
 ["암스테르담","Amsterdam","네덜란드","🇳🇱","EUR"],
 ["로테르담","Rotterdam","네덜란드","🇳🇱","EUR"],
 ["헤이그","The Hague","네덜란드","🇳🇱","EUR"],
 ["위트레흐트","Utrecht","네덜란드","🇳🇱","EUR"],
 ["브뤼셀","Brussels","벨기에","🇧🇪","EUR"],
 ["브뤼헤","Bruges","벨기에","🇧🇪","EUR"],
 ["앤트워프","Antwerp","벨기에","🇧🇪","EUR"],
 ["겐트","Ghent","벨기에","🇧🇪","EUR"],
 ["룩셈부르크","Luxembourg","룩셈부르크","🇱🇺","EUR"],
 ["프라하","Prague","체코","🇨🇿","CZK"],
 ["체스키크룸로프","Cesky Krumlov","체코","🇨🇿","CZK"],
 ["브르노","Brno","체코","🇨🇿","CZK"],
 ["바르샤바","Warsaw","폴란드","🇵🇱","PLN"],
 ["크라쿠프","Krakow","폴란드","🇵🇱","PLN"],
 ["브로츠와프","Wroclaw","폴란드","🇵🇱","PLN"],
 ["그단스크","Gdansk","폴란드","🇵🇱","PLN"],
 ["부다페스트","Budapest","헝가리","🇭🇺","HUF"],
 ["자그레브","Zagreb","크로아티아","🇭🇷","EUR"],
 ["두브로브니크","Dubrovnik","크로아티아","🇭🇷","EUR"],
 ["스플리트","Split","크로아티아","🇭🇷","EUR"],
 ["류블랴나","Ljubljana","슬로베니아","🇸🇮","EUR"],
 ["브라티슬라바","Bratislava","슬로바키아","🇸🇰","EUR"],
 ["부쿠레슈티","Bucharest","루마니아","🇷🇴","RON"],
 ["소피아","Sofia","불가리아","🇧🇬","BGN"],
 ["베오그라드","Belgrade","세르비아","🇷🇸","RSD"],
 ["사라예보","Sarajevo","보스니아","🇧🇦","EUR"],
 ["아테네","Athens","그리스","🇬🇷","EUR"],
 ["산토리니","Santorini","그리스","🇬🇷","EUR"],
 ["미코노스","Mykonos","그리스","🇬🇷","EUR"],
 ["크레타","Crete","그리스","🇬🇷","EUR"],
 ["발레타","Valletta","몰타","🇲🇹","EUR"],
 ["니코시아","Nicosia","키프로스","🇨🇾","EUR"],
 ["코펜하겐","Copenhagen","덴마크","🇩🇰","DKK"],
 ["오르후스","Aarhus","덴마크","🇩🇰","DKK"],
 ["오덴세","Odense","덴마크","🇩🇰","DKK"],
 ["스톡홀름","Stockholm","스웨덴","🇸🇪","SEK"],
 ["예테보리","Gothenburg","스웨덴","🇸🇪","SEK"],
 ["말뫼","Malmo","스웨덴","🇸🇪","SEK"],
 ["웁살라","Uppsala","스웨덴","🇸🇪","SEK"],
 ["오슬로","Oslo","노르웨이","🇳🇴","NOK"],
 ["베르겐","Bergen","노르웨이","🇳🇴","NOK"],
 ["트롬쇠","Tromso","노르웨이","🇳🇴","NOK"],
 ["헬싱키","Helsinki","핀란드","🇫🇮","EUR"],
 ["로바니에미","Rovaniemi","핀란드","🇫🇮","EUR"],
 ["투르쿠","Turku","핀란드","🇫🇮","EUR"],
 ["레이캬비크","Reykjavik","아이슬란드","🇮🇸","ISK"],
 ["탈린","Tallinn","에스토니아","🇪🇪","EUR"],
 ["리가","Riga","라트비아","🇱🇻","EUR"],
 ["빌뉴스","Vilnius","리투아니아","🇱🇹","EUR"],
 ["모스크바","Moscow","러시아","🇷🇺","RUB"],
 ["상트페테르부르크","Saint Petersburg","러시아","🇷🇺","RUB"],
 ["블라디보스토크","Vladivostok","러시아","🇷🇺","RUB"],
 ["이르쿠츠크","Irkutsk","러시아","🇷🇺","RUB"],
 ["키이우","Kyiv","우크라이나","🇺🇦","UAH"],
 ["뉴욕","New York","미국","🇺🇸","USD"],
 ["로스앤젤레스","Los Angeles","미국","🇺🇸","USD"],
 ["샌프란시스코","San Francisco","미국","🇺🇸","USD"],
 ["샌디에이고","San Diego","미국","🇺🇸","USD"],
 ["시애틀","Seattle","미국","🇺🇸","USD"],
 ["시카고","Chicago","미국","🇺🇸","USD"],
 ["보스턴","Boston","미국","🇺🇸","USD"],
 ["워싱턴","Washington DC","미국","🇺🇸","USD"],
 ["라스베이거스","Las Vegas","미국","🇺🇸","USD"],
 ["마이애미","Miami","미국","🇺🇸","USD"],
 ["올랜도","Orlando","미국","🇺🇸","USD"],
 ["호놀룰루","Honolulu","미국","🇺🇸","USD"],
 ["애틀랜타","Atlanta","미국","🇺🇸","USD"],
 ["댈러스","Dallas","미국","🇺🇸","USD"],
 ["휴스턴","Houston","미국","🇺🇸","USD"],
 ["덴버","Denver","미국","🇺🇸","USD"],
 ["오스틴","Austin","미국","🇺🇸","USD"],
 ["필라델피아","Philadelphia","미국","🇺🇸","USD"],
 ["포틀랜드","Portland","미국","🇺🇸","USD"],
 ["뉴올리언스","New Orleans","미국","🇺🇸","USD"],
 ["피닉스","Phoenix","미국","🇺🇸","USD"],
 ["솔트레이크시티","Salt Lake City","미국","🇺🇸","USD"],
 ["앵커리지","Anchorage","미국","🇺🇸","USD"],
 ["새너제이","San Jose","미국","🇺🇸","USD"],
 ["어바인","Irvine","미국","🇺🇸","USD"],
 ["괌","Guam","괌","🇬🇺","USD"],
 ["사이판","Saipan","사이판","🇲🇵","USD"],
 ["밴쿠버","Vancouver","캐나다","🇨🇦","CAD"],
 ["토론토","Toronto","캐나다","🇨🇦","CAD"],
 ["몬트리올","Montreal","캐나다","🇨🇦","CAD"],
 ["캘거리","Calgary","캐나다","🇨🇦","CAD"],
 ["오타와","Ottawa","캐나다","🇨🇦","CAD"],
 ["퀘벡시티","Quebec City","캐나다","🇨🇦","CAD"],
 ["빅토리아","Victoria","캐나다","🇨🇦","CAD"],
 ["밴프","Banff","캐나다","🇨🇦","CAD"],
 ["멕시코시티","Mexico City","멕시코","🇲🇽","MXN"],
 ["칸쿤","Cancun","멕시코","🇲🇽","MXN"],
 ["과달라하라","Guadalajara","멕시코","🇲🇽","MXN"],
 ["툴룸","Tulum","멕시코","🇲🇽","MXN"],
 ["아바나","Havana","쿠바","🇨🇺","CUP"],
 ["산호세","San Jose","코스타리카","🇨🇷","CRC"],
 ["안티구아","Antigua","과테말라","🇬🇹","GTQ"],
 ["산토도밍고","Santo Domingo","도미니카공화국","🇩🇴","DOP"],
 ["킹스턴","Kingston","자메이카","🇯🇲","JMD"],
 ["상파울루","Sao Paulo","브라질","🇧🇷","BRL"],
 ["리우데자네이루","Rio de Janeiro","브라질","🇧🇷","BRL"],
 ["부에노스아이레스","Buenos Aires","아르헨티나","🇦🇷","ARS"],
 ["산티아고","Santiago","칠레","🇨🇱","CLP"],
 ["리마","Lima","페루","🇵🇪","PEN"],
 ["쿠스코","Cusco","페루","🇵🇪","PEN"],
 ["보고타","Bogota","콜롬비아","🇨🇴","COP"],
 ["메데인","Medellin","콜롬비아","🇨🇴","COP"],
 ["몬테비데오","Montevideo","우루과이","🇺🇾","UYU"],
 ["라파스","La Paz","볼리비아","🇧🇴","BOB"],
 ["우유니","Uyuni","볼리비아","🇧🇴","BOB"],
 ["시드니","Sydney","호주","🇦🇺","AUD"],
 ["멜버른","Melbourne","호주","🇦🇺","AUD"],
 ["브리즈번","Brisbane","호주","🇦🇺","AUD"],
 ["퍼스","Perth","호주","🇦🇺","AUD"],
 ["골드코스트","Gold Coast","호주","🇦🇺","AUD"],
 ["케언스","Cairns","호주","🇦🇺","AUD"],
 ["애들레이드","Adelaide","호주","🇦🇺","AUD"],
 ["캔버라","Canberra","호주","🇦🇺","AUD"],
 ["호바트","Hobart","호주","🇦🇺","AUD"],
 ["다윈","Darwin","호주","🇦🇺","AUD"],
 ["오클랜드","Auckland","뉴질랜드","🇳🇿","NZD"],
 ["퀸스타운","Queenstown","뉴질랜드","🇳🇿","NZD"],
 ["크라이스트처치","Christchurch","뉴질랜드","🇳🇿","NZD"],
 ["웰링턴","Wellington","뉴질랜드","🇳🇿","NZD"],
 ["난디","Nadi","피지","🇫🇯","FJD"],
 ["카이로","Cairo","이집트","🇪🇬","EGP"],
 ["룩소르","Luxor","이집트","🇪🇬","EGP"],
 ["마라케시","Marrakesh","모로코","🇲🇦","MAD"],
 ["카사블랑카","Casablanca","모로코","🇲🇦","MAD"],
 ["페스","Fes","모로코","🇲🇦","MAD"],
 ["튀니스","Tunis","튀니지","🇹🇳","TND"],
 ["케이프타운","Cape Town","남아프리카공화국","🇿🇦","ZAR"],
 ["요하네스버그","Johannesburg","남아프리카공화국","🇿🇦","ZAR"],
 ["나이로비","Nairobi","케냐","🇰🇪","KES"],
 ["잔지바르","Zanzibar","탄자니아","🇹🇿","TZS"],
 ["아디스아바바","Addis Ababa","에티오피아","🇪🇹","ETB"],
 ["라고스","Lagos","나이지리아","🇳🇬","NGN"],
 ["아크라","Accra","가나","🇬🇭","GHS"],
 ["포트루이스","Port Louis","모리셔스","🇲🇺","MUR"]
].map(function(a){return {ko:a[0],en:a[1],country:a[2],flag:a[3],cur:a[4]};});
var CITY_ALIAS={"로스앤젤레스": "LA 엘에이 캘리포니아 California", "샌프란시스코": "SF 캘리포니아 California 실리콘밸리", "샌디에이고": "캘리포니아 California", "새너제이": "실리콘밸리 캘리포니아 California Silicon Valley", "어바인": "캘리포니아 California", "뉴욕": "NY NYC 맨해튼", "라스베이거스": "베가스 Vegas 네바다", "호놀룰루": "하와이 Hawaii 와이키키", "시애틀": "워싱턴주", "마이애미": "플로리다 Florida", "올랜도": "플로리다 Florida 디즈니", "보스턴": "매사추세츠", "워싱턴": "DC 수도", "쿠알라룸푸르": "KL", "홍콩": "HK", "방콕": "BKK", "도쿄": "동경 Tokyo 東京", "오사카": "간사이 大阪", "후쿠오카": "규슈", "삿포로": "홋카이도", "오키나와": "나하 Naha", "교토": "京都", "타이베이": "대북 타이페이", "세부": "막탄 Mactan", "발리": "덴파사르 Denpasar", "델리": "뉴델리 New Delhi", "뭄바이": "봄베이 Bombay", "호치민": "사이공 Saigon", "뮌헨": "바이에른 München", "쾰른": "Koln", "취리히": "쮜리히", "프랑크푸르트": "프랑크", "몬트리올": "퀘벡", "밴프": "로키 Rocky", "퀸스타운": "남섬", "오클랜드": "북섬", "두바이": "UAE 에미리트", "이스탄불": "터키 튀르키예", "괌": "Guam", "사이판": "북마리아나", "싱가포르": "싱가폴", "시드니": "Sydney NSW", "멜버른": "멜버른 빅토리아", "코펜하겐": "코펜하겐 덴마크", "레이캬비크": "아이슬란드 오로라", "로바니에미": "산타마을 오로라", "트롬쇠": "오로라", "프라하": "체코", "부다페스트": "헝가리", "비엔티안": "라오스", "바르셀로나": "바르샤 Barca", "마드리드": "스페인", "리스본": "리스보아 Lisboa", "베네치아": "베니스 Venice", "피렌체": "플로렌스 Florence", "나폴리": "네이플스", "카파도키아": "열기구", "산토리니": "그리스 섬", "우유니": "소금사막", "쿠스코": "마추픽추 Machu Picchu", "잔지바르": "탄자니아 섬"};
CITIES.forEach(function(c){c.al=CITY_ALIAS[c.ko]||"";});

/* ---------- categories ---------- */
var BASECATS=[
 {n:"식비",i:"🍜",pre:false},{n:"교통비",i:"🚌",pre:false},{n:"숙박",i:"🏨",pre:true},
 {n:"항공",i:"✈️",pre:true},{n:"티켓/입장권",i:"🎫",pre:true},{n:"통신비",i:"📶",pre:false},
 {n:"생활용품",i:"🧺",pre:false}
];
/* 장기 체류 목적에서만 노출 */
var LONGCATS=[
 {n:"월세",i:"🏠",pre:false},{n:"학비·프로그램비",i:"🎓",pre:true},
 {n:"비자·행정",i:"📄",pre:true},{n:"보험",i:"🛡",pre:true},
 {n:"교통패스",i:"🎟",pre:false},{n:"보증금",i:"📦",pre:false,dep:true}
];
var LONGPURPOSE=["교환학생·단기파견","어학연수","워킹홀리데이","해외인턴","해외봉사"];
function isLong(p){p=p||proj();return LONGPURPOSE.indexOf(p.purpose)>-1||(days(p.start,p.end)+1)>30;}
var customCats=[];
function cats(){return BASECATS.concat(isLong()?LONGCATS:[]).concat(customCats);}
function isDep(n){var c=catOf(n);return !!c.dep;}
function catOf(n){var a=cats();for(var i=0;i<a.length;i++)if(a[i].n===n)return a[i];return {n:n,i:"⭐",pre:false};}

/* ---------- projects (budget stored in KRW) ---------- */
var PURPOSES=[
 {k:"여행",i:"🧳"},{k:"출장",i:"💼"},{k:"교환학생·단기파견",i:"🎓"},
 {k:"어학연수",i:"📚"},{k:"워킹홀리데이",i:"🌏"},{k:"해외인턴",i:"🧑‍💻"},
 {k:"해외봉사",i:"🤝"},{k:"한달살기",i:"🏠"}
];
/* 지역×목적×기간 표본 (하루 현지 지출 중앙값, 원화) */
var NORM={
 "오사카|여행":        {n:34,pre:640000,cats:{"식비":48000,"교통비":15000,"티켓/입장권":24000,"생활용품":9000,"통신비":3000}},
 "도쿄|여행":          {n:52,pre:690000,cats:{"식비":54000,"교통비":19000,"티켓/입장권":28000,"생활용품":10000,"통신비":3500}},
 "후쿠오카|여행":      {n:41,pre:470000,cats:{"식비":44000,"교통비":12000,"티켓/입장권":18000,"생활용품":8000,"통신비":3000}},
 "상하이|여행":        {n:23,pre:620000,cats:{"식비":38000,"교통비":11000,"티켓/입장권":21000,"생활용품":5000,"통신비":2500}},
 "방콕|여행":          {n:28,pre:610000,cats:{"식비":31000,"교통비":9000,"티켓/입장권":17000,"생활용품":6000,"통신비":2000}},
 "다낭|여행":          {n:22,pre:520000,cats:{"식비":27000,"교통비":8000,"티켓/입장권":14000,"생활용품":5000,"통신비":2000}},
 "파리|여행":          {n:19,pre:1480000,cats:{"식비":72000,"교통비":21000,"티켓/입장권":46000,"생활용품":12000,"통신비":4000}},
 "런던|여행":          {n:14,pre:1520000,cats:{"식비":81000,"교통비":26000,"티켓/입장권":49000,"생활용품":13000,"통신비":4500}},
 "코펜하겐|교환학생·단기파견":{n:9, pre:2260000,cats:{"식비":24000,"교통비":6000,"티켓/입장권":3000,"생활용품":5000,"통신비":2500}},
 "오르후스|교환학생·단기파견":{n:2, pre:2400000,cats:{"식비":21000,"교통비":5000,"티켓/입장권":2500,"생활용품":4500,"통신비":2500}},
 "시드니|워킹홀리데이":{n:17,pre:1750000,cats:{"식비":39000,"교통비":13000,"티켓/입장권":6000,"생활용품":9000,"통신비":4000}},
 "멜버른|워킹홀리데이":{n:11,pre:1690000,cats:{"식비":37000,"교통비":12000,"티켓/입장권":6000,"생활용품":8500,"통신비":4000}},
 "싱가포르|출장":      {n:12,pre:980000,cats:{"식비":58000,"교통비":18000,"티켓/입장권":9000,"생활용품":7000,"통신비":4000}}
};
Object.keys(NORM).forEach(function(k){
  var c=NORM[k].cats,sum=0;
  Object.keys(c).forEach(function(x){sum+=c[x];});
  NORM[k].perDay=sum;
});
/* 사용자 데이터는 비어 있는 상태로 시작 — 첫 실행 시 온보딩(웰컴 → 프로젝트 생성)으로 진입.
   (NORM 표본 데이터는 서버 집계에 해당하므로 유지 → 자동 예산·또래 비교가 작동) */
var P={};
function isMulti(p){p=p||proj();return !!p&&(p.cities||[]).length>1;}
/* 예산 변경 이력 — 프로젝트 생성 시 최초 설정 레코드가 쌓임 */
var BUDGETLOG=[];
/* 정산 이력 */
var SETTLE=[];
/* 반복(고정) 지출 */
var RECUR=[];
/* 내 정산 계좌 */
var ME={bank:"",acc:"",holder:""};

var TX=[];

var S={tab:"home",pid:null,sel:{},selMode:false,disp:"local",
 nextId:100,scan:"idle",scanRows:[],detail:null,draft:null,cal:"2026-07",focusF:null,
 nf:{name:"",dests:[],adding:false,purpose:"여행",start:"",end:"",bPre:"",bLocal:"",bcur:"KRW",q:""},curTarget:"tx",
 unit:null, msgEdit:false, msgText:"", lastSettle:null};

var $=function(s,r){return (r||document).querySelector(s);};
var esc=function(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});};

/* ============================================================
   Supabase 영속 계층 — 사용자별(RLS) 저장. localStorage 대체.
   client는 index.html에서 window.__sb 로 주입됨.
   ============================================================ */
var SB=window.__sb;
var USER=null;                 /* 로그인 사용자 */
var CAT_ID={},CAT_NAME={};     /* 카테고리 이름<->UUID */
var CITY_ID={},CITY_BY_ID={};  /* 도시 이름<->serial id, id->{ko,flag,country} */
function srcToDb(s){return s==="card"?"card_capture":(s==="receipt"?"receipt":"manual");}
function srcFromDb(s){return s==="card_capture"?"card":(s==="receipt"?"receipt":"manual");}
function sbErr(e,msg){if(e){console.error(msg||"supabase",e);toast((msg||"저장 중 문제가 생겼어요")+" · 다시 시도해 주세요");}return !!e;}
function stash(){/* 개별 mutation에서 DB에 직접 쓴다 (write-through). no-op 유지 */}

/* 참조 데이터: 카테고리(시스템+내것), 도시 맵 */
function loadReference(){
  return Promise.all([
    SB.from("categories").select("id,name,user_id,icon,is_pre"),
    SB.from("cities").select("id,name_ko,flag_emoji,country")
  ]).then(function(r){
    var cts=r[0].data||[],cities=r[1].data||[];
    CAT_ID={};CAT_NAME={};customCats=[];
    cts.forEach(function(c){CAT_ID[c.name]=c.id;CAT_NAME[c.id]=c.name;
      if(c.user_id)customCats.push({n:c.name,i:c.icon||"⭐",pre:c.is_pre});});
    CITY_ID={};CITY_BY_ID={};
    cities.forEach(function(c){if(!(c.name_ko in CITY_ID))CITY_ID[c.name_ko]=c.id;
      CITY_BY_ID[c.id]={ko:c.name_ko,flag:c.flag_emoji,country:c.country};});
  });
}
/* 내 데이터 전체 로드 → 인메모리 P/TX/BUDGETLOG 채우기 */
function loadUserData(){
  P={};TX=[];BUDGETLOG=[];SETTLE=[];RECUR=[];ME={bank:"",acc:"",holder:""};
  return Promise.all([
    SB.from("projects").select("*, project_cities(city_id,currency,sort_order), cash_topups(amount,currency,topped_up_on)").order("created_at"),
    SB.from("transactions").select("*").order("occurred_on",{ascending:false}),
    SB.from("budget_log").select("*")
  ]).then(function(r){
    (r[0].data||[]).forEach(function(pr){
      var pcs=(pr.project_cities||[]).slice().sort(function(a,b){return (a.sort_order||0)-(b.sort_order||0);});
      var cities=pcs.map(function(pc){var m=CITY_BY_ID[pc.city_id]||{};return {ko:m.ko||"",flag:m.flag||"",cur:pc.currency};});
      if(!cities.length)cities=[{ko:pr.name,flag:"",cur:pr.primary_currency}];
      var meta=CITY_BY_ID[(pcs[0]||{}).city_id]||{};
      P[pr.id]={id:pr.id,name:pr.name,purpose:pr.purpose,cur:pr.primary_currency,
        start:pr.start_date,end:pr.end_date,bPre:+pr.budget_pre_krw,bLocal:+pr.budget_local_krw,
        cities:cities,city:cities[0].ko,country:meta.country||"",flag:cities[0].flag||meta.flag||"",
        cash:(pr.cash_topups||[]).map(function(x){return {amt:+x.amount,cur:x.currency,d:x.topped_up_on};}),peers:0};
    });
    (r[1].data||[]).forEach(function(t){
      TX.push({id:t.id,p:t.project_id,d:t.occurred_on,t:t.occurred_at?String(t.occurred_at).slice(0,5):"",
        m:t.merchant||"",amt:+t.amount,cur:t.currency,cat:CAT_NAME[t.category_id]||"식비",
        pre:t.is_pre,pm:t.payment_method,split:t.split_count?{n:t.split_count}:null,memo:t.memo||"",
        src:srcFromDb(t.source),keep:t.keep_receipt,rec:t.recurring_rule_id||null,st:t.status});
    });
    (r[2].data||[]).forEach(function(b){BUDGETLOG.push({p:b.project_id,type:b.envelope,amt:+b.delta_krw,d:b.logged_on,memo:b.memo||""});});
    if(!P[S.pid])S.pid=Object.keys(P)[0]||null;
  });
}

/* ---- write-through helpers (KRW 스냅샷 포함) ---- */
function txToRow(t){return {project_id:t.p,occurred_on:t.d,occurred_at:t.t||null,merchant:t.m||null,
  amount:t.amt,currency:t.cur,fx_rate_snapshot:CUR[t.cur].r,krw_amount_snapshot:toKRW(t.amt,t.cur),
  category_id:CAT_ID[t.cat]||null,is_pre:!!t.pre,payment_method:t.pm||"card",source:srcToDb(t.src||"manual"),
  keep_receipt:!!t.keep,memo:t.memo||null,status:t.st||"confirmed",split_count:t.split?t.split.n:null};}
function dbInsertTx(t){return SB.from("transactions").insert(txToRow(t)).select("id").single()
  .then(function(r){if(sbErr(r.error,"기록 저장 실패"))return null;return r.data.id;});}
function dbUpdateTx(t){return SB.from("transactions").update(txToRow(t)).eq("id",t.id)
  .then(function(r){sbErr(r.error,"수정 저장 실패");});}
function dbDeleteTx(id){return SB.from("transactions").delete().eq("id",id)
  .then(function(r){sbErr(r.error,"삭제 실패");});}
function dbInsertProject(p){
  return SB.from("projects").insert({user_id:USER.id,name:p.name,purpose:p.purpose,
    primary_currency:p.cur,start_date:p.start,end_date:p.end,budget_pre_krw:p.bPre,budget_local_krw:p.bLocal,
    is_long_stay:(LONGPURPOSE.indexOf(p.purpose)>-1||(days(p.start,p.end)+1)>30)})
    .select("id").single().then(function(r){
      if(sbErr(r.error,"프로젝트 저장 실패"))return null;
      var pid=r.data.id, rows=(p.cities||[]).map(function(c,i){return {project_id:pid,city_id:CITY_ID[c.ko],currency:c.cur,sort_order:i};}).filter(function(x){return x.city_id;});
      return SB.from("project_cities").insert(rows).then(function(){return pid;});
    });
}
function dbUpdateProject(p){
  return SB.from("projects").update({name:p.name,purpose:p.purpose,primary_currency:p.cur,
    start_date:p.start,end_date:p.end,budget_pre_krw:p.bPre,budget_local_krw:p.bLocal,
    is_long_stay:(LONGPURPOSE.indexOf(p.purpose)>-1||(days(p.start,p.end)+1)>30)}).eq("id",p.id)
    .then(function(r){if(sbErr(r.error,"수정 저장 실패"))return;
      return SB.from("project_cities").delete().eq("project_id",p.id).then(function(){
        var rows=(p.cities||[]).map(function(c,i){return {project_id:p.id,city_id:CITY_ID[c.ko],currency:c.cur,sort_order:i};}).filter(function(x){return x.city_id;});
        return SB.from("project_cities").insert(rows);});});
}
function dbBudgetLog(pid,type,delta,memo){return SB.from("budget_log").insert(
  {project_id:pid,envelope:type,delta_krw:delta,memo:memo||null,logged_on:TODAY})
  .then(function(r){sbErr(r.error,"예산 이력 저장 실패");});}
function dbCashTopup(pid,amt,cur,d){return SB.from("cash_topups").insert(
  {project_id:pid,amount:amt,currency:cur,topped_up_on:d}).then(function(r){sbErr(r.error,"환전 기록 저장 실패");});}
function dbAddCategory(name,icon){return SB.from("categories").insert(
  {user_id:USER.id,name:name,icon:icon,is_pre:false}).select("id").single()
  .then(function(r){if(sbErr(r.error,"카테고리 저장 실패"))return null;CAT_ID[name]=r.data.id;CAT_NAME[r.data.id]=name;return r.data.id;});}

function signOut(){SB.auth.signOut().then(function(){location.reload();});}
function hasProj(){return Object.keys(P).length>0;}

function proj(){return P[S.pid];}
function days(a,b){return Math.round((new Date(b)-new Date(a))/86400000);}
function num(v,d){return Number(v).toLocaleString("ko-KR",{minimumFractionDigits:0,maximumFractionDigits:d});}

/* money: everything computed in KRW, displayed in chosen currency */
function toKRW(amt,cur){return amt*CUR[cur].r;}
function fromKRW(k,cur){return k/CUR[cur].r;}
function fmt(k,cur){
  var c=CUR[cur],v=fromKRW(k,cur);
  var d=(c.dec&&Math.abs(v)<100&&Math.abs(v%1)>0.004)?2:0;
  return c.s+num(v,d);
}
function localCur(){return proj().cur;}
/* main display per S.disp */
function show(k){
  var lc=localCur();
  if(S.disp==="krw") return '<b class="money">'+fmt(k,"KRW")+'</b>';
  return '<b class="money">'+fmt(k,lc)+'</b><span class="approx"> (≈ '+fmt(k,"KRW")+')</span>';
}
function showS(k){ /* single line, small */
  var lc=localCur();
  return S.disp==="krw" ? fmt(k,"KRW") : fmt(k,lc)+" (≈ "+fmt(k,"KRW")+")";
}
function effDisp(){return isMulti()?"krw":S.disp;}
function mainOnly(k){return effDisp()==="krw"?fmt(k,"KRW"):fmt(k,localCur());}
function subOnly(k){return effDisp()==="krw"?"≈ "+fmt(k,localCur()):"≈ "+fmt(k,"KRW");}
/* 정산 맥락 — 항상 원화 기준 */
function krwOnly(k){return fmt(k,"KRW");}

function txs(){return TX.filter(function(t){return t.p===S.pid;}).sort(function(a,b){return a.d<b.d?1:a.d>b.d?-1:(a.t<b.t?1:-1);});}
function mineK(t){var k=toKRW(t.amt,t.cur);return t.split?k/t.split.n:k;}
function byId(id){return TX.filter(function(x){return x.id==id;})[0];}
function spentLocal(){return txs().filter(function(t){return !t.pre&&!isDep(t.cat);}).reduce(function(s,t){return s+mineK(t);},0);}
function spentPre(){return txs().filter(function(t){return t.pre&&!isDep(t.cat);}).reduce(function(s,t){return s+mineK(t);},0);}
function spentDep(){return txs().filter(function(t){return isDep(t.cat);}).reduce(function(s,t){return s+mineK(t);},0);}
function hasCash(){return txs().some(function(t){return t.pm==="cash";})||(proj().cash||[]).length>0;}
function cashInfo(){
  var added=(proj().cash||[]).reduce(function(s,c){return s+toKRW(c.amt,c.cur);},0);
  var used=txs().filter(function(t){return t.pm==="cash";}).reduce(function(s,t){return s+mineK(t);},0);
  return {added:added,used:used,left:added-used};
}
/* 이번 달(달력 월) 현지 지출 */
function spentThisMonth(){
  var ym=TODAY.slice(0,7);
  return txs().filter(function(t){return !t.pre&&!isDep(t.cat)&&t.d.slice(0,7)===ym;})
              .reduce(function(s,t){return s+mineK(t);},0);
}

function unitOf(){ /* "day" | "total" — 모든 프로젝트 공통 */
  if(S.unit==="day"||S.unit==="total")return S.unit;
  return isLong()?"total":"day";   /* 기본값: 장기=전체, 단기=일 */
}
function budgetInfo(){
  var p=proj(),sp=spentLocal(),left=p.bLocal-sp;
  var total=days(p.start,p.end)+1;
  var future=p.start>TODAY;
  var elapsed=Math.min(total,Math.max(1,days(p.start,TODAY)+1));
  var remain=Math.max(0,total-elapsed);
  var perDay=future?p.bLocal/total:(remain>0?left/(remain+1):left);
  var landing=future?0:sp/elapsed*total;

  /* 월 단위 — 남은 예산을 남은 개월수로 재분배 */
  var remMonths=Math.max(0.5,(remain+1)/30.4);
  var monthBudget=future?(p.bLocal/Math.max(1,total/30.4)):(left/remMonths);
  var mSpent=spentThisMonth();
  var mLeft=monthBudget-mSpent;
  /* 이번 달 남은 일수 */
  var y=+TODAY.slice(0,4),mo=+TODAY.slice(5,7),dim=new Date(y,mo,0).getDate();
  var dayLeftInMonth=Math.max(1,Math.min(dim-(+TODAY.slice(8,10))+1,remain+1));

  return {p:p,sp:sp,left:left,total:total,elapsed:elapsed,remain:remain,perDay:perDay,landing:landing,future:future,
    pct:Math.min(100,sp/p.bLocal*100),over:sp>p.bLocal,
    monthBudget:monthBudget,mSpent:mSpent,mLeft:mLeft,remMonths:remMonths,
    dayLeftInMonth:dayLeftInMonth,mPct:Math.min(100,monthBudget?mSpent/monthBudget*100:0),
    monthNo:Math.floor((elapsed-1)/30.4)+1,totalMonths:Math.max(1,Math.round(total/30.4))};
}
/* 예산 변경 이력 */
function budgetLog(type){return BUDGETLOG.filter(function(b){return b.p===S.pid&&b.type===type;});}

function toastUndo(m){
  var e=$("#toast");
  e.innerHTML='<span>'+m+'</span><button id="undosettle">되돌리기</button>';
  e.classList.add("show","withbtn");
  clearTimeout(toast._t);
  toast._t=setTimeout(function(){e.classList.remove("show","withbtn");},8000);
}
/* 정산 요청 — 네이티브 공유 시트, 실패 시 클립보드 복사 폴백 */
function shareSettlement(text){
  var copied=function(){toastUndo("정산 링크를 복사했어요 🔗<br>내 가계부에는 내 몫만 남았습니다");};
  var shared=function(){toastUndo("정산 요청을 공유했어요 🔗<br>내 가계부에는 내 몫만 남았습니다");};
  if(navigator.share){
    navigator.share({title:"어브로디 정산 요청",text:text}).then(shared).catch(function(err){
      if(err&&err.name==="AbortError"){toastUndo("정산을 준비했어요 🔗<br>내 가계부에는 내 몫만 남았습니다");}
      else{copyText(text,copied);}
    });
  }else{copyText(text,copied);}
}
function copyText(text,onDone){
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(onDone).catch(function(){legacyCopy(text,onDone);});
  }else legacyCopy(text,onDone);
}
function legacyCopy(text,onDone){
  try{
    var ta=document.createElement("textarea");ta.value=text;
    ta.style.position="fixed";ta.style.top="-1000px";ta.style.opacity="0";
    document.body.appendChild(ta);ta.focus();ta.select();
    var ok=document.execCommand("copy");document.body.removeChild(ta);
    if(ok)onDone();else toast("복사가 안 됐어요 · 메시지를 길게 눌러 복사해 주세요");
  }catch(_){toast("복사가 안 됐어요 · 메시지를 길게 눌러 복사해 주세요");}
}
function revokeSettle(code,isUndo){
  if(!code)return;
  var r=null;
  for(var i=0;i<SETTLE.length;i++)if(SETTLE[i].code===code)r=SETTLE[i];
  if(!r||r.status!=="active")return;
  r.status="revoked";
  r.ids.forEach(function(id){var t=byId(id);if(t)t.split=null;});
  var e=$("#toast");e.classList.remove("show","withbtn");
  render();toast(isUndo?"정산을 되돌렸어요":"정산을 취소했어요 · 링크가 만료됐습니다");
}
function toast(m){var e=$("#toast");e.innerHTML=m;e.classList.add("show");clearTimeout(toast._t);toast._t=setTimeout(function(){e.classList.remove("show");},2300);}
function period(p){
  var f=function(d){return (+d.slice(5,7))+"."+(+d.slice(8,10));};
  return f(p.start)+" – "+f(p.end)+" · "+(days(p.start,p.end)+1)+"일";
}

/* ---------- topbar ---------- */
function cityLabel(p){
  var c=p.cities||[{ko:p.city,flag:p.flag}];
  if(c.length===1)return esc(c[0].ko);
  return esc(c.map(function(x){return x.ko;}).join(" · "));
}
function topbar(){
  var p=proj();
  return '<div class="topbar"><button class="wsbtn" id="wsopen">'+
    '<span class="bars"><i></i><i></i><i></i></span>'+
    '<span class="nm"><b>'+p.flag+" "+esc(p.name)+'</b><span>'+cityLabel(p)+' · '+period(p)+'</span></span>'+
    '<span class="cv">▾</span></button>'+
    '<button class="helpbtn" id="helpopen" aria-label="사용법 도움말">?</button></div>';
}
/* 도움말 — 옆으로 넘기는 주요 기능 큐레이션 */
function helpSheet(){
  var row=function(ic,m,a){return '<div class="hprow"><span class="hpic">'+ic+'</span><span class="hpm">'+m+'</span><b>'+a+'</b></div>';};
  var slides=[
    {t:"캡처 한 장이면 끝",d:"영수증·카드내역·은행앱 화면을 올리면 여러 건을 한 번에 인식해요. 하단 ＋ → ‘영수증·카드내역 스캔’.",
     shot:'<div class="hpcard"><div class="hptt">✨ 3건을 찾았어요</div>'+row("🍜","Netto Trøjborg","kr214")+row("🚌","Didi 디디추싱","CN¥46")+row("🛒","Lawson 편의점","¥230")+'</div>'},
    {t:"모든 통화, 원화로 한눈에",d:"79개 통화를 결제한 그대로 저장하고, 거래일 환율로 원화까지 환산해 보여줘요. 다국가 여행도 합계가 딱 맞아요.",
     shot:'<div class="hpcard"><div class="hprow"><span class="hpic">🍜</span><span class="hpm">이치란 라멘</span><span style="text-align:right"><b>¥1,180</b><span class="hpsub">≈ ₩10,900</span></span></div>'+
       '<div class="hptog"><span class="on">JPY</span><span>KRW</span></div></div>'},
    {t:"예산 세우고, 남은 돈 실시간",d:"사전예약(항공·숙소)과 현지 지출을 나눠, 오늘·전체 쓸 수 있는 돈을 계속 계산해요.",
     shot:'<div class="hpcard"><div class="hptt2">오늘 쓸 수 있는 돈</div><div class="hpbig">¥10,870</div>'+
       '<div class="hpbarline"><i style="width:38%"></i></div>'+
       '<div class="hpenv"><div><span>✈️ 사전예약</span><b>₩1.18M</b></div><div><span>🧾 현지</span><b>₩1.10M</b></div></div></div>'},
    {t:"1/N 정산은 링크로",d:"여러 건을 골라 나누면 내 가계부엔 내 몫만 남고, 링크·공유로 바로 보낼 수 있어요.",
     shot:'<div class="hpcard hpc-center"><div class="hpsub2">2건을 3명이 나눈 금액</div><div class="hpbig">₩13,625</div>'+
       '<div class="hpbtn">🔗 링크로 정산 요청 보내기</div></div>'},
    {t:"또래와 비교 리포트",d:"같은 도시·목적으로 다녀온 사람이 5명 모이면, 항목별로 나 vs 또래를 비교해 드려요.",
     shot:'<div class="hpcard"><div class="hptt">오사카 다녀온 34명과 비교</div>'+
       '<div class="hppair"><span class="lb">나</span><span class="tr"><i class="me" style="width:60%"></i></span><span class="vv">₩48,000</span></div>'+
       '<div class="hppair"><span class="lb">또래</span><span class="tr"><i class="avg" style="width:86%"></i></span><span class="vv">₩67,000</span></div>'+
       '<div class="hpless">식비 · 또래보다 28% 적게 씀</div></div>'},
    {t:"여행마다 프로젝트로",d:"목적지·목적·기간·예산으로 프로젝트를 만들고, 일정이 바뀌면 MY에서 언제든 수정해요. 기록은 그대로예요.",
     shot:'<div class="hpcard"><div class="hptt2">어디로 가시나요? 🤔✈️</div>'+
       '<div class="hpchips"><span class="hpchip on">🇯🇵 오사카</span><span class="hpchip">🎓 교환학생</span></div>'+
       '<div class="hpchips" style="margin-top:6px"><span class="hpchip">9.10 – 12.20</span><span class="hpchip">✏️ 수정 가능</span></div></div>'},
    {t:"내 기록은 나만",d:"아이디로 로그인하면 내 기록만 안전하게 저장되고, 다른 사람 데이터와 절대 섞이지 않아요.",
     shot:'<div class="hpcard hpc-center"><div class="hplock">🔒</div><div class="hptt" style="margin:0">아이디 로그인 · 내 데이터만</div><div class="hpsub2" style="margin-top:3px">사용자별로 분리되어 안전하게 보관</div></div>'}
  ];
  return '<h3>어브로디 사용법</h3><div class="small" style="margin-bottom:12px">옆으로 넘겨보세요 →</div>'+
    '<div class="helpslides" id="helpslides">'+
      slides.map(function(s){return '<div class="helpslide"><div class="hpshot">'+s.shot+'</div><b>'+s.t+'</b><p>'+s.d+'</p></div>';}).join("")+
    '</div>'+
    '<div class="helpdots" id="helpdots">'+slides.map(function(_,i){return '<i'+(i===0?' class="on"':'')+'></i>';}).join("")+'</div>'+
    '<button class="btn ghost" id="btnclose" style="margin-top:14px">닫기</button>';
}
function wsSheet(){
  return '<h3>프로젝트</h3><div class="small" style="margin-bottom:10px">기록할 프로젝트를 골라주세요</div>'+
    Object.keys(P).map(function(k){
      var p=P[k];
      return '<button class="plist" data-p="'+k+'" aria-current="'+(k===S.pid)+'">'+
        '<span class="fl">'+p.flag+'</span><span class="pn"><b>'+esc(p.name)+'</b>'+
        '<span>'+cityLabel(p)+' · '+period(p)+'</span></span>'+
        (k===S.pid?'<span class="ck">✓</span>':'')+'</button>';
    }).join("")+
    '<button class="btn ghost" data-go="newproj" style="margin-top:12px">＋ 새 프로젝트 만들기</button>';
}

/* ---------- home ---------- */
function vHome(){
  var b=budgetInfo(),p=b.p,good=b.landing<=p.bLocal;
  var pre=spentPre(),prePct=Math.min(100,p.bPre?pre/p.bPre*100:0);
  var dep=spentDep(), u=unitOf(), multi=isMulti();
  var head, big, sub, gauge, legend;

  if(u==="total"){
    head=b.future?"전체 기간 쓸 수 있는 돈":"남은 예산";
    big =mainOnly(Math.max(0,b.left));
    sub = b.future
      ? "출발까지 "+days(TODAY,p.start)+"일 · 현지 예산 전체 "+mainOnly(p.bLocal)
      : "전체 "+b.total+"일 중 "+b.elapsed+"일차 · 하루 평균 "+mainOnly(Math.max(0,b.perDay));
    gauge=b.pct; legend='<span>쓴 돈 '+mainOnly(b.sp)+'</span><span>현지 예산 '+mainOnly(p.bLocal)+'</span>';
  }else{
    head=b.future?"하루에 쓸 수 있는 돈":"오늘 쓸 수 있는 돈";
    big =mainOnly(Math.max(0,b.perDay));
    sub = b.future
      ? "출발까지 "+days(TODAY,p.start)+"일 · 현지 예산을 "+b.total+"일로 나눈 금액"
      : "남은 현지 예산 "+mainOnly(b.left)+" · 남은 "+(b.remain+1)+"일로 나눈 금액";
    gauge=b.pct; legend='<span>쓴 돈 '+mainOnly(b.sp)+'</span><span>현지 예산 '+mainOnly(p.bLocal)+'</span>';
  }

  /* 일/전체 토글 — 장기·단기 모두 노출 (통일) */
  var unitTog = '<span class="unittog"><button data-unit="day" aria-pressed="'+(u==="day")+'">일</button>'+
      '<button data-unit="total" aria-pressed="'+(u==="total")+'">전체</button></span>';
  var toggle = multi
    ? '<span class="curtog"><button aria-pressed="true">KRW</button></span>'
    : '<span class="curtog"><button data-disp="local" aria-pressed="'+(S.disp==="local")+'">'+p.cur+'</button>'+
      '<button data-disp="krw" aria-pressed="'+(S.disp==="krw")+'">KRW</button></span>';

  return topbar()+
  (multi?'<div class="tip" style="margin-bottom:10px"><span class="e">🌍</span><p>통화가 여러 개라 <b>원화</b>로 보여드려요. 각 지출은 결제한 통화 그대로 기록됩니다.</p></div>':'')+
  '<div class="hero">'+
    '<div class="rowbetween"><span class="labelwrap">'+unitTog+'<span class="label">'+head+'</span></span>'+toggle+'</div>'+
    '<div class="big" id="bignum">'+big+'</div>'+
    '<div class="sub2">'+sub+'</div>'+
    '<div class="bar"><i class="'+(b.over?"over":"")+'" style="width:'+gauge.toFixed(1)+'%"></i></div>'+
    '<div class="legend">'+legend+'</div>'+
    (b.future?'<div class="pace">출발일이 되면 <b>'+(u==="total"?"남은 예산":"오늘 쓸 수 있는 돈")+'</b>으로 다시 계산해 드릴게요.</div>'
      :'<div class="pace'+(good?"":" bad")+'">'+(good
        ?"이 페이스면 마지막 날에 <b>"+mainOnly(p.bLocal-b.landing)+"</b>이 남습니다."
        :"이 페이스면 마지막 날에 <b>"+mainOnly(b.landing-p.bLocal)+"</b>이 모자랍니다.")+'</div>')+
  '</div>'+
  '<div class="envel">'+
    '<div class="e"><div class="t">✈️ 사전 예약</div><div class="v">'+fmt(pre,"KRW")+'</div>'+
      '<div class="g"><i style="width:'+prePct.toFixed(1)+'%"></i></div>'+
      '<div class="rowbetween" style="margin-top:5px"><span class="small">예산 '+fmt(p.bPre,"KRW")+'</span>'+
      '<button class="plusb" data-addbudget="pre">수정</button></div></div>'+
    '<div class="e"><div class="t">🧾 현지 지출</div><div class="v">'+fmt(b.sp,"KRW")+'</div>'+
      '<div class="g"><i style="width:'+b.pct.toFixed(1)+'%"></i></div>'+
      '<div class="rowbetween" style="margin-top:5px"><span class="small">예산 '+fmt(p.bLocal,"KRW")+'</span>'+
      '<button class="plusb" data-addbudget="local">수정</button></div></div>'+
  '</div>'+
  (hasCash()?(function(){var c=cashInfo();
    if(c.added<=0)
      return '<div class="cashcard"><div class="rowbetween">'+
        '<span><b>💵 현금으로 쓴 돈</b><span class="small" style="display:block;margin-top:3px">환전·인출을 기록하면 잔액을 알려드려요</span></span>'+
        '<span class="cashv">'+mainOnly(c.used)+'</span></div>'+
        '<button class="cashbtn" id="addcash">＋ 환전·인출 기록</button></div>';
    return '<div class="cashcard"><div class="rowbetween">'+
      '<span><b>💵 현금 잔액</b><span class="small" style="display:block;margin-top:3px">환전·인출 '+mainOnly(c.added)+' · 사용 '+mainOnly(c.used)+'</span></span>'+
      '<span class="cashv">'+mainOnly(Math.max(0,c.left))+'</span></div>'+
      '<button class="cashbtn" id="addcash">＋ 환전·인출 기록</button></div>';})():'')+
  (dep>0?'<div class="depcard"><span>📦 보증금 <i>회수 예정</i></span><b>'+mainOnly(dep)+'</b></div>':'')+
  '<div class="hd" style="padding-top:20px"><h2 style="font-size:16px">최근 지출</h2><span class="sub">'+txs().length+'건 기록됨</span></div>'+
  txs().slice(0,3).map(function(t){return txRow(t,false);}).join("")+
  '<div style="height:8px"></div>';
}

/* ---------- rows ---------- */
function txRow(t,selectable){
  var k=toKRW(t.amt,t.cur),my=mineK(t),c=catOf(t.cat);
  var alt=(t.cur==="KRW"?localCur():"KRW");
  var amtHtml = t.split
    ? '<b><span class="strike">'+fmt(k,t.cur)+'</span>'+fmt(my,t.cur)+'</b><span>≈ '+fmt(my,alt)+'</span>'
    : '<b>'+fmt(my,t.cur)+'</b><span>≈ '+fmt(my,alt)+'</span>';
  var sel=S.sel[t.id]?1:0;
  return '<div class="tx" data-sel="'+sel+'" '+(selectable?'data-pick="'+t.id+'" role="button" tabindex="0"':'')+'>'+
    (selectable?'<span class="ck">✓</span>':'')+
    '<span class="ic">'+c.i+'</span>'+
    '<span class="mid"><span class="mname">'+esc(t.m)+'</span>'+
      '<span class="mmeta"><span class="tag">'+esc(t.cat)+'</span>'+
      (t.pre?'<span class="tag pre">사전예약</span>':'')+
      (t.split?'<span class="tag split">'+t.split.n+'명 나눔</span>':'')+
      (t.memo?'<span class="tag memo">메모</span>':'')+
      (t.pm==="cash"?'<span class="tag cash">현금</span>':'')+
      (isDep(t.cat)?'<span class="tag dep">회수 예정</span>':'')+
      (t.st==="pending"?'<span class="tag pend">확인 필요</span>':'')+
      '<span>'+t.t+'</span></span></span>'+
    '<span class="amt">'+amtHtml+'</span>'+
    (selectable?'':'<button class="edit" data-edit="'+t.id+'" aria-label="수정하기">✎</button>')+'</div>';
}

/* ---------- calendar ---------- */
function vCal(){
  var ym=S.cal,y=+ym.slice(0,4),m=+ym.slice(5,7);
  var off=new Date(y,m-1,1).getDay(),dim=new Date(y,m,0).getDate();
  var sums={},tot=0;
  txs().forEach(function(t){ if(t.d.slice(0,7)===ym){var dd=+t.d.slice(8,10);sums[dd]=(sums[dd]||0)+mineK(t);tot+=mineK(t);} });
  var cells="";
  for(var i=0;i<off;i++)cells+='<div class="day out"></div>';
  for(var d=1;d<=dim;d++){
    var ds=ym+"-"+String(d).padStart(2,"0"),v=sums[d];
    cells+='<div class="day'+(v?" has":"")+(ds===TODAY?" today":"")+'"><span class="n">'+d+'</span>'+
      (v?'<span class="v">'+shortMoney(v)+'</span>':'')+'</div>';
  }
  return '<div class="cal"><div class="calhd"><div><div class="m">'+y+'년 '+m+'월</div>'+
    '<div class="tot">이 달 '+mainOnly(tot)+' <span class="approx">('+subOnly(tot)+')</span></div></div>'+
    '<div class="calnav"><button data-cal="-1">‹</button><button data-cal="1">›</button></div></div>'+
    '<div class="wk"><span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span></div>'+
    '<div class="days">'+cells+'</div></div>';
}
function shortMoney(k){
  var cur=S.disp==="krw"?"KRW":localCur(),v=fromKRW(k,cur);
  if(v>=10000)return num(v/10000,1)+"만";
  return num(v,0);
}

/* ---------- ledger ---------- */
function vLedger(){
  var list=txs(),groups={};
  list.forEach(function(t){(groups[t.d]=groups[t.d]||[]).push(t);});
  var keys=Object.keys(groups).sort().reverse();
  var head='<div class="hd"><h2>가계부</h2>'+
    (S.selMode?'<button class="chip on" id="selcancel">정산 취소</button>'
              :'<button class="chip solid" id="selstart">1/N 정산하기</button>')+'</div>';
  var body=keys.length?keys.map(function(d){
      var sum=groups[d].reduce(function(s,t){return s+mineK(t);},0);
      return '<div class="daygroup"><div class="dayhd"><span>'+(+d.slice(5,7))+'월 '+(+d.slice(8,10))+'일</span>'+
        '<span>'+mainOnly(sum)+'</span></div>'+
        groups[d].map(function(t){return txRow(t,S.selMode);}).join("")+'</div>';
    }).join("")
    :'<div class="empty">아직 기록이 없습니다.<br>아래 ＋ 를 눌러 시작해 보세요.</div>';
  return topbar()+head+
    (S.selMode?'<div class="small" style="margin:-4px 0 10px 2px">나눌 항목을 골라주세요</div>':vCal())+
    body+'<div style="height:74px"></div>';
}

/* ---------- add: 스캔 or 직접 ---------- */
function vAdd(){
  return '<div class="hd"><h2>지출 추가</h2></div>'+
  '<button class="bigopt" data-go="scan"><span class="em">📷</span><span>'+
    '<b>영수증 · 카드내역 스캔</b><span>영수증이나 결제 내역 화면을 올리면 여러 건을 한 번에 정리해요</span></span></button>'+
  '<button class="bigopt" id="godirect"><span class="em">✍️</span><span>'+
    '<b>직접 작성하기</b><span>현금으로 낸 돈이나 인식되지 않은 지출</span></span></button>'+
  '<div class="tip"><span class="e">💡</span><p>현금 결제는 인식이 안 돼요. 직접 작성으로 남겨두면 또래 비교가 더 정확해집니다.</p></div>';
}

/* ---------- editor (공용: 신규 · 수정 · 스캔결과) ---------- */
function vEditor(){
  var d=S.detail,isScan=d.kind==="scan",isNew=d.kind==="new";
  var t=isScan?S.scanRows[d.i]:(isNew?S.draft:byId(d.id));
  if(!t)return '<div class="empty">항목을 찾을 수 없습니다.</div>';
  var c=CUR[t.cur];
  return '<div class="hd"><button class="backbtn" id="dback">‹ 뒤로</button>'+
    '<span class="sub">'+(isScan?"인식 결과 수정":isNew?"직접 작성":"내역 수정")+'</span></div>'+
  (t.st==="pending"?'<div class="pendbox"><b>🔁 자동으로 기록된 내역이에요</b>'+
    '<span>금액이 맞는지 확인해 주세요. 확인 전까지는 또래 비교에 반영되지 않아요.</span>'+
    '<button class="pendbtn" id="confirmtx">이 금액이 맞아요</button></div>':'')+
  '<div class="card">'+
    '<div class="field"><label>금액</label>'+
      '<div class="amtin"><span class="cu">'+c.s+'</span>'+
      '<input id="f_amt" type="number" step="0.01" inputmode="decimal" value="'+t.amt+'" placeholder="0"></div>'+
      '<div class="small" id="f_hint" style="margin-top:6px">'+amtHint(t)+'</div>'+
      '<div class="catrow" style="margin-top:8px">'+
        (function(){var base=[localCur(),"KRW"];if(base.indexOf(t.cur)<0)base.push(t.cur);
          return base.map(function(cc){
            return '<button data-txcur="'+cc+'" aria-pressed="'+(cc===t.cur)+'">'+cc+' '+CUR[cc].s+'</button>';
          }).join("")+'<button class="addc" id="curmore">＋ 다른 통화</button>';})()+
      '</div>'+
    '</div>'+
    '<div class="field"><label>사용처</label><input class="inp" id="f_m" value="'+esc(t.m)+'" placeholder="어디에 쓰셨나요? 🤔"></div>'+
    '<div class="two">'+
      '<div class="field"><label>날짜</label><input class="inp" id="f_d" type="date" value="'+t.d+'"></div>'+
      '<div class="field"><label>시간</label><input class="inp" id="f_t" type="time" value="'+(t.t||nowHM())+'"></div>'+
    '</div>'+
    '<div class="small" style="margin:-6px 0 13px">💬 비워두면 지금 시각으로 기록돼요</div>'+
    '<div class="field" style="margin-bottom:0"><label>분류</label><div class="catrow">'+
      cats().map(function(x){return '<button data-setcat="'+esc(x.n)+'" aria-pressed="'+(x.n===t.cat)+'">'+x.i+' '+esc(x.n)+'</button>';}).join("")+
      '<button class="addc" id="addcat">＋ 직접 추가</button></div></div>'+
  '</div>'+
  '<div class="card"><div class="field" style="margin-bottom:0"><label>결제수단</label><div class="catrow">'+
    [["card","💳 카드"],["cash","💵 현금"],["account","🏦 계좌"]].map(function(x){
      return '<button data-pm="'+x[0]+'" aria-pressed="'+((t.pm||"card")===x[0])+'">'+x[1]+'</button>';
    }).join("")+'</div></div></div>'+
  '<div class="card"><button class="toggle" id="pretog" style="width:100%">'+
    '<span style="text-align:left"><span style="font-size:14px;font-weight:600">사전 예약 지출</span>'+
    '<span class="small" style="display:block;margin-top:2px">항공·숙소처럼 미리 결제한 돈은<br>하루 예산에서 빼고 계산해요</span></span>'+
    '<span class="sw" aria-pressed="'+(!!t.pre)+'"><i></i></span></button></div>'+
  '<div class="card"><button class="toggle" id="rectog" style="width:100%">'+
    '<span style="text-align:left"><span style="font-size:14px;font-weight:600">🔁 매달 반복되는 지출</span>'+
    '<span class="small" style="display:block;margin-top:2px">월세·통신비처럼 매달 나가는 돈은<br>한 번 등록하면 자동으로 기록해요</span></span>'+
    '<span class="sw" aria-pressed="'+(!!t.rec)+'"><i></i></span></button>'+
    (t.rec?'<div class="small" style="margin-top:9px;padding-top:9px;border-top:1px solid var(--line)">매달 '+(+t.d.slice(8,10))+'일에 자동으로 기록돼요</div>':'')+'</div>'+
  (t.src==="receipt"
    ? '<div class="card"><button class="toggle" id="rcptog" style="width:100%">'+
      '<span style="text-align:left"><span style="font-size:14px;font-weight:600">📎 영수증 사진 보관</span>'+
      '<span class="small" style="display:block;margin-top:2px">환불·정산 증빙이 필요할 때 쓸 수 있어요</span></span>'+
      '<span class="sw" aria-pressed="'+(!!t.keep)+'"><i></i></span></button></div>'
    : '')+
  '<div class="card"><div class="field" style="margin-bottom:0"><label>메모</label>'+
    '<textarea class="inp" id="f_memo" placeholder="나중에 기억하고 싶은 걸 적어두세요">'+esc(t.memo||"")+'</textarea></div></div>'+
  '<button class="btn" id="dsave" style="margin-top:12px">'+(isNew?"추가하기":"저장하기")+'</button>'+
  (d.kind==="tx"?'<button class="btn danger" id="ddel" style="margin-top:8px">이 내역 삭제</button>':'')+
  '<div style="height:20px"></div>';
}
function amtHint(t){
  var k=toKRW(t.amt,t.cur);
  if(t.cur==="KRW")return "≈ "+fmt(k,localCur())+" · 1 "+localCur()+" = "+num(CUR[localCur()].r,1)+"원";
  return "≈ "+fmt(k,"KRW")+" · 1 "+t.cur+" = "+num(CUR[t.cur].r,1)+"원 (거래일 기준)";
}

/* ---------- new project ---------- */
function freshNF(){return {name:"",dests:[],adding:false,purpose:"여행",start:"",end:"",bPre:"",bLocal:"",bcur:"KRW",q:""};}
function startNewProject(){S.editPid=null;S.nf=freshNF();S.tab="newproj";}
/* MY에서 기존 프로젝트를 수정 — 생성 폼을 값 채워서 재사용 */
function openEditProject(k){
  var p=P[k],bcur=(CUR[p.cur]?p.cur:"KRW");
  S.editPid=k;
  S.nf={
    name:p.name,
    dests:(p.cities||[{ko:p.city,flag:p.flag,cur:p.cur}]).map(function(c){
      var full=CITIES.filter(function(x){return x.ko===c.ko;})[0];
      return full||{ko:c.ko,en:"",country:p.country||"",flag:c.flag,cur:c.cur,al:""};
    }),
    adding:false,purpose:p.purpose,start:p.start,end:p.end,bcur:bcur,
    bPre:String(Math.round(fromKRW(p.bPre,bcur))),
    bLocal:String(Math.round(fromKRW(p.bLocal,bcur))),
    q:""
  };
  S.tab="newproj";render();
}
function vNewProj(){
  var f=S.nf,editing=!!S.editPid;
  var q=f.q.trim().toLowerCase();
  var hits=q?CITIES.filter(function(c){
    return c.ko.indexOf(f.q.trim())===0||c.en.toLowerCase().indexOf(q)===0||c.country.indexOf(f.q.trim())===0;
  }).slice(0,6):[];
  var d=(f.start&&f.end)?Math.max(1,days(f.start,f.end)+1):0;
  var bc=CUR[f.bcur];
  var per=(d&&f.bLocal)?Number(f.bLocal)/d:0;
  return '<div class="hd"><button class="backbtn" id="nback">‹ 뒤로</button><span class="sub">'+(editing?"프로젝트 수정":"새 프로젝트")+'</span></div>'+
  '<div class="card">'+
    '<div class="field" style="margin-bottom:13px"><label>어디로 가시나요? 🤔✈️</label>'+
      (f.dests.length
        ? f.dests.map(function(dd,ii){
            return '<div class="picked"><span class="fl">'+dd.flag+'</span><span><b>'+dd.ko+'</b>'+
              '<span>'+dd.country+' · '+dd.cur+' '+CUR[dd.cur].s+'</span></span>'+
              '<button class="x" data-destdel="'+ii+'">✕</button></div>';}).join("")
        : '')+
      (f.adding||!f.dests.length
        ? '<input class="inp" id="n_q" value="'+esc(f.q)+'" placeholder="도시 이름을 적어보세요 (예: 오사카)" autocomplete="off" style="margin-top:'+(f.dests.length?"7px":"0")+'">'+
          '<div id="dest_list">'+destListHTML()+'</div>'
        : '<button class="addc" id="destadd" style="margin-top:7px">＋ 도시 추가</button>')+
      (f.dests.length>1
        ? '<div class="small" style="margin-top:8px">💡 '+
          (f.dests.every(function(x){return x.cur===f.dests[0].cur;})
            ? '모두 '+f.dests[0].cur+'를 써요. 그 통화로 보여드릴게요.'
            : '통화가 여러 개라 <b>원화</b>로 보여드려요. 각 지출은 결제한 통화 그대로 기록돼요.')+'</div>'
        : '')+
    '</div>'+
    '<div class="field"><label>어떤 목적인가요</label><div class="catrow">'+
      PURPOSES.map(function(x){return '<button data-purpose="'+esc(x.k)+'" aria-pressed="'+(x.k===f.purpose)+'">'+x.i+' '+esc(x.k)+'</button>';}).join("")+
    '</div></div>'+
    '<div class="field" style="margin-bottom:0"><label>프로젝트 이름</label>'+
      '<input class="inp" id="n_name" value="'+esc(f.name)+'" placeholder="예: 서현이와 덴마크, 후쿠오카 여행"></div>'+
  '</div>'+
  '<div class="card">'+
      '<div class="field"><label>시작일</label><input class="inp" id="n_start" type="date" value="'+f.start+'"></div>'+
      '<div class="field" style="margin-bottom:0"><label>종료일</label><input class="inp" id="n_end" type="date" value="'+f.end+'"></div>'+
  '</div>'+
  '<div class="card">'+
    '<div class="rowbetween" style="margin-bottom:11px"><span style="font-size:14px;font-weight:700">예산</span>'+
      '<span class="seg">'+(function(){var base=["KRW","USD","EUR","JPY"];
        if(base.indexOf(f.bcur)<0)base.push(f.bcur);
        return base.map(function(cc){
          return '<button data-bcur="'+cc+'" aria-pressed="'+(cc===f.bcur)+'">'+CUR[cc].s+'</button>';}).join("")+
          '<button id="bcurmore">＋</button>';})()+'</span></div>'+
    '<div class="field"><label>✈️ 사전 예약 — 항공 · 숙소 · 미리 산 티켓</label>'+
      '<div class="amtin"><span class="cu">'+bc.s+'</span><input id="n_pre" type="text" inputmode="numeric" placeholder="0" value="'+fmtNum(f.bPre)+'"></div></div>'+
    '<div class="field" style="margin-bottom:0"><label>🧾 현지 지출 — 밥값 · 교통 · 쇼핑</label>'+
      '<div class="amtin"><span class="cu">'+bc.s+'</span><input id="n_local" type="text" inputmode="numeric" placeholder="0" value="'+fmtNum(f.bLocal)+'"></div></div>'+
    '<div class="tip" id="n_tip"><span class="e">🧮</span><p>'+budgetHint()+'</p></div>'+
    '<div id="n_auto">'+autoBudgetBox()+'</div>'+
  '</div>'+
  '<button class="btn" id="ncreate" style="margin-top:12px">'+(editing?"저장하기":"프로젝트 만들기")+'</button>'+
  '<div class="small" style="text-align:center;margin-top:10px">'+(editing?"일정·목적지·예산을 바꿀 수 있어요 · 기록은 그대로 남아요":"만들고 나서도 예산과 기간은 바꿀 수 있어요")+'</div>'+
  '<div style="height:20px"></div>';
}

function normOf(f){
  if(!f.dests.length||!f.purpose)return null;
  if(f.dests.length>1)return null;
  return NORM[f.dests[0].ko+"|"+f.purpose]||null;
}
function autoBudgetBox(){
  var f=S.nf,nm=normOf(f);
  if(!f.dests.length)return "";
  if(f.dests.length>1)return '<div class="autobox none"><b>여러 도시를 함께 가시는군요</b><span>도시별 물가가 달라 자동 예산은 아직 어려워요. 직접 입력해 주세요.</span></div>';
  var d0=f.dests[0];
  if(!nm||nm.n<5){
    return '<div class="autobox none"><b>아직 표본이 모이는 중이에요</b>'+
      '<span>'+esc(d0.ko)+' · '+esc(f.purpose)+' 기록이 '+(nm?nm.n:0)+'명 있어요. 5명이 되면 평균으로 예산을 잡아드릴게요.</span></div>';
  }
  var d=(f.start&&f.end)?Math.max(1,days(f.start,f.end)+1):0;
  var local=d?nm.perDay*d:0;
  return '<div class="autobox"><div class="ab-t"><b>✨ 자동 예산 수립</b><span>표본 '+nm.n+'명</span></div>'+
    '<span class="ab-s">'+esc(d0.ko)+' · '+esc(f.purpose)+esc(d?" · "+d+"일":"")+' 기준 중앙값이에요</span>'+
    '<div class="ab-r"><span>✈️ 사전 예약</span><b>'+fmt(nm.pre,"KRW")+'</b></div>'+
    '<div class="ab-r"><span>🧾 현지 지출'+(d?" ("+d+"일)":"")+'</span><b>'+(d?fmt(local,"KRW"):"기간을 먼저 정해주세요")+'</b></div>'+
    '<button class="ab-btn" id="autobudget" '+(d?"":"disabled")+'>이 금액으로 채우기</button></div>';
}
function budgetHint(){
  var f=S.nf,bc=CUR[f.bcur];
  var d=(f.start&&f.end)?Math.max(1,days(f.start,f.end)+1):0;
  if(!f.bLocal)return "현지 지출 예산을 넣으면 하루에 얼마씩 쓸 수 있는지 계산해 드릴게요.";
  var per=Number(f.bLocal)/(d||1);
  var s="현지에서 하루 "+bc.s+num(per,0);
  if(f.dests.length===1) s+=" (≈ "+fmt(toKRW(per,f.bcur),f.dests[0].cur)+")";
  if(d)s+=" · "+d+"일 기준";
  s+="입니다. 사전 예약은 하루 예산에서 빠져요.";
  return s;
}

/* ---------- scan ---------- */
function vScan(){
  var isR=(S.scanSrc==="receipt");
  if(S.scan==="idle"){
    return '<div class="hd"><button class="backbtn" id="sback">‹ 뒤로</button><span class="sub">영수증·카드내역 스캔</span></div>'+
    '<div class="dropzone">'+
      (S.scanImg?'<img class="shotimg" src="'+S.scanImg+'" alt="업로드한 사진">':'<div class="upicon">📷</div>')+
      '<div class="small" style="margin:14px 0 2px;text-align:center">영수증이나 은행·카드·간편결제 앱 화면을 올리면<br>여러 건을 한 번에 읽어 정리해요.</div>'+
      '<input type="file" id="scanfile" accept="image/*" style="display:none">'+
      '<button class="btn" id="btnupload" style="margin-top:16px">📷 사진 업로드</button>'+
      '<div class="small" style="margin-top:9px;text-align:center">카메라로 찍거나 갤러리에서 고를 수 있어요</div></div>';
  }
  if(S.scan==="loading"){
    return '<div class="hd"><h2>읽는 중</h2></div><div class="scanning">'+
      (S.scanImg?'<img class="shotimg" src="'+S.scanImg+'" alt="업로드한 사진">':'<div class="upicon">📷</div>')+
      '<div class="scanline"></div></div>'+
      '<div class="small" style="text-align:center;margin-top:16px">날짜 · 사용처 · 금액을 찾고 있습니다…</div>';
  }
  if(S.scan==="empty"||S.scan==="unreadable"||S.scan==="error"||S.scan==="limited"){
    var F={
      empty:{e:"🔍",t:"찾은 거래가 없어요",d:"영수증이나 결제 내역 화면이 맞는지<br>확인해 주세요.",a:"다른 사진 올리기"},
      unreadable:{e:"🌫",t:"글자가 잘 안 보여요",d:"빛 반사가 없는 곳에서<br>영수증이 화면에 꽉 차게 찍어주세요.",a:"다시 찍기"},
      error:{e:"⚠️",t:"잠시 연결이 불안정해요",d:"네트워크 상태를 확인하고<br>다시 시도해 주세요.",a:"다시 시도"},
      limited:{e:"⏳",t:"지금 이용이 많아요",d:"잠시 후 다시 시도해 주세요.<br>계속 안 되면 몇 시간 뒤에 다시 올려보세요.",a:"다시 시도"}
    }[S.scan];
    return '<div class="hd"><button class="backbtn" id="sback">‹ 뒤로</button><span class="sub">스캔</span></div>'+
      '<div class="failbox"><div class="fe">'+F.e+'</div><b>'+F.t+'</b><span>'+F.d+'</span></div>'+
      '<button class="btn ghost" id="btncancel" style="margin-top:12px">'+F.a+'</button>'+
      '<button class="btn" id="btnmanual" style="margin-top:8px">직접 작성하기</button>'+
      '<div class="small" style="text-align:center;margin-top:10px">올린 사진을 보면서 적을 수 있어요</div>';
  }
  return '<div class="hd"><h2>'+S.scanRows.length+'건을 찾았어요</h2><span class="sub">저장 전 수정 가능</span></div>'+
    (SCAN_ENDPOINT?'':'<div class="tip" style="margin-bottom:11px"><span class="e">✨</span><p>지금은 예시 인식 결과예요 · 실제 서비스에서는 올린 사진을 AI가 읽어 채워줍니다.</p></div>')+
    S.scanRows.map(function(r,i){
      var c=catOf(r.cat);
      return '<div class="result"><span class="ic">'+c.i+'</span><span class="mid">'+
        '<span class="amt">'+fmt(toKRW(r.amt,r.cur),r.cur)+'</span>'+
        '<span class="mn"><span class="tag">'+esc(r.cat)+'</span>'+(r.pre?'<span class="tag pre">사전예약</span>':'')+
        (r.memo?'<span class="tag memo">메모</span>':'')+'<span>'+esc(r.m)+' · '+r.t+'</span></span></span>'+
        '<button class="edit" data-sedit="'+i+'">수정 ✎</button></div>';
    }).join("")+
    '<div class="small" style="margin:2px 2px 10px">더 있다면 직접 추가해 주세요. <b id="addmore" style="color:var(--accent);cursor:pointer">＋ 직접 추가</b></div>'+
    '<button class="btn" id="btnsave">이대로 저장하기</button>'+
    '<button class="btn ghost" id="btncancel" style="margin-top:8px">다시 올리기</button>';
}
function clearScanImg(){try{if(S.scanImg)URL.revokeObjectURL(S.scanImg);}catch(_){}S.scanImg=null;S.scanFile=null;}

/* 업로드한 사진을 인식한다.
   - Vercel 배포(프록시 있음): /api/scan 이 서버에서 Gemini를 호출해 거래를 인식
   - github.io / localhost (프록시 없음): 데모 결과로 대체
   SCAN_ENDPOINT 가 빈 문자열이면 항상 데모로 동작한다. */
/* Gemini 스캔 프록시 위치.
   - Vercel(동일 출처): /api/scan
   - GitHub Pages: Vercel 프록시를 교차출처로 호출 (api/scan.js에 CORS 허용됨)
   - localhost: 데모 (프록시 없음) */
var VERCEL_SCAN="https://abroaddy-me-seohyun.vercel.app/api/scan";
var SCAN_ENDPOINT=(function(){
  var h=location.hostname;
  if(/github\.io$/.test(h)) return VERCEL_SCAN;
  if(h==="localhost"||h==="127.0.0.1"||h==="") return "";
  return "/api/scan";
})();
function catExists(n){return cats().some(function(c){return c.n===n;});}
/* 업로드 이미지를 축소해 base64로 (전송 크기·인식 속도 최적화) */
function fileToScaledBase64(file,max){
  max=max||1600;
  return new Promise(function(resolve,reject){
    var url=URL.createObjectURL(file),img=new Image();
    img.onload=function(){
      var s=Math.min(1,max/Math.max(img.width,img.height));
      var w=Math.round(img.width*s),h=Math.round(img.height*s);
      var c=document.createElement("canvas");c.width=w;c.height=h;
      c.getContext("2d").drawImage(img,0,0,w,h);
      URL.revokeObjectURL(url);
      var d=c.toDataURL("image/jpeg",0.85);
      resolve({base64:d.slice(d.indexOf(",")+1),mimeType:"image/jpeg"});
    };
    img.onerror=function(){URL.revokeObjectURL(url);reject(new Error("image"));};
    img.src=url;
  });
}
function startScan(){
  S.scan="loading";render();
  if(!SCAN_ENDPOINT){ setTimeout(function(){S.scanRows=demoScanRows();S.scan="done";render();},1200); return; }
  if(!S.scanFile){ S.scan="empty";render();return; }
  fileToScaledBase64(S.scanFile).then(function(img){
    return fetch(SCAN_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({imageBase64:img.base64,mimeType:img.mimeType,today:TODAY,localCur:localCur()})});
  }).then(function(r){ if(r.status===429){var le=new Error("429");le.rate=true;throw le;} if(!r.ok) throw new Error(r.status); return r.json(); })
    .then(function(data){
      var rows=(data&&data.rows)||[];
      if(!rows.length){ S.scan="empty";render();return; }
      S.scanRows=rows.map(function(r){
        var cur=CUR[r.cur]?r.cur:localCur();
        var cat=catExists(r.cat)?r.cat:cats()[0].n;
        return {m:String(r.m||"이름 없는 지출").slice(0,80),amt:Math.max(0,Number(r.amt)||0),
          cur:cur,cat:cat,d:/^\d{4}-\d{2}-\d{2}$/.test(r.d)?r.d:TODAY,
          t:/^\d{1,2}:\d{2}$/.test(r.t)?r.t:nowHM(),memo:"",
          pre:(typeof r.pre==="boolean")?r.pre:catOf(cat).pre,src:"card",pm:"card"};
      });
      S.scan="done";render();
    })
    .catch(function(e){ S.scan=(e&&e.rate)?"limited":"error";render(); });
}
function demoScanRows(){
  var lc=localCur();
  var a=function(krw){var v=fromKRW(krw,lc);return CUR[lc].dec?Math.round(v*100)/100:Math.round(v);};
  var rows=[
    {m:"Supermarket",amt:a(9200),cur:lc,cat:"식비",d:TODAY,t:"18:12",memo:"",pre:false},
    {m:"Cafe",amt:a(6400),cur:lc,cat:"식비",d:TODAY,t:"15:40",memo:"",pre:false},
    {m:"Metro / Bus",amt:a(1600),cur:lc,cat:"교통비",d:TODAY,t:"10:05",memo:"",pre:false}
  ];
  rows.forEach(function(r){r.src="card";r.pm="card";});
  return rows;
}

/* ---------- report ---------- */
/* 민트 → 그린 → 블루 그라데이션 팔레트 (인접 색 구분되도록 배열) */
var CATCOLOR=["#12b3a8","#2a78d6","#2a9d5c","#4a63c8","#1aa87e","#2b8fb0",
              "#5aa832","#6b5bd6","#0f9c93","#3f86c9","#3f9e4a","#7a6ee0",
              "#159e88","#2f6fbf","#4faa3e","#8a63d6"];
function catColor(name){
  var a=cats(); for(var i=0;i<a.length;i++) if(a[i].n===name) return CATCOLOR[i%CATCOLOR.length];
  var h=0; for(var j=0;j<name.length;j++)h=(h*31+name.charCodeAt(j))%997;
  return CATCOLOR[h%CATCOLOR.length];
}
function vReport(){
  var p=proj(),by={};
  txs().filter(function(t){return !isDep(t.cat);}).forEach(function(t){by[t.cat]=(by[t.cat]||0)+mineK(t);});
  var arr=Object.keys(by).map(function(k){return [k,by[k]];}).sort(function(a,b){return b[1]-a[1];});
  var max=arr.length?arr[0][1]:1;
  var barTot=arr.reduce(function(x,y){return x+y[1];},0)||1;
  var nm=NORM[p.city+"|"+(p.purpose||"여행")], pn=nm?nm.n:0;
  var tripDays=Math.max(1,days(p.start,p.end)+1);
  var cmp;
  if(isMulti()){
    cmp='<div class="card"><div class="soonbox"><div style="font-size:14px;font-weight:700">여러 도시를 함께 다녀오셨네요</div>'+
      '<div class="small" style="margin-top:6px">도시마다 물가가 달라서<br>지금은 또래 비교가 어려워요.</div>'+
      '<div class="small" style="margin-top:9px">도시별로 나눠 기록하면 비교해 드릴게요.</div></div></div>';
  }else if(nm&&pn>=5){
    var keys=Object.keys(nm.cats),mx=0,myTot=0,pTot=0;
    keys.forEach(function(k){
      var av=nm.cats[k]*tripDays;mx=Math.max(mx,av,by[k]||0);myTot+=(by[k]||0);pTot+=av;});
    var diff=Math.round((myTot-pTot)/pTot*100);
    cmp='<div class="card">'+
      '<div class="rowbetween" style="margin-bottom:4px"><span style="font-size:14px;font-weight:700">'+esc(p.city)+' 다녀온 사람들</span>'+
        '<span class="sub">표본 '+pn+'명</span></div>'+
      '<div class="small" style="margin-bottom:14px">'+esc(p.purpose||"여행")+' · '+tripDays+'일 기준으로 환산한 중앙값입니다.</div>'+
      '<div class="rowbetween" style="padding:11px 12px;border-radius:10px;background:'+(diff<=0?"#f4f9ff":"var(--warn-soft)")+';margin-bottom:15px">'+
        '<span style="font-size:12.5px;color:'+(diff<=0?"var(--accent-dark)":"#a13d12")+'">현지 지출 합계</span>'+
        '<span style="font-size:13px;font-weight:700;color:'+(diff<=0?"var(--accent-dark)":"#a13d12")+'">'+
        mainOnly(myTot)+' · 또래보다 '+Math.abs(diff)+'% '+(diff<=0?"적게":"많이")+' 씀</span></div>'+
      keys.map(function(k){
        var me=by[k]||0,av=nm.cats[k]*tripDays,d2=Math.round((me-av)/av*100);
        var lbl=me===0?'<span class="d" style="color:var(--muted)">안 씀</span>'
                      :'<span class="d '+(d2<=0?"less":"more")+'">'+(d2>0?"+":"")+d2+'%</span>';
        return '<div class="cmp"><div class="cmphd"><span>'+esc(k)+'</span>'+lbl+'</div><div class="pairs">'+
          '<div class="prow"><span class="lb">나</span><span class="tr"><i class="me" style="width:'+(me/mx*100).toFixed(1)+'%"></i></span><span class="vv">'+mainOnly(me)+'</span></div>'+
          '<div class="prow"><span class="lb">또래</span><span class="tr"><i class="avg" style="width:'+(av/mx*100).toFixed(1)+'%"></i></span><span class="vv">'+mainOnly(av)+'</span></div>'+
          '</div></div>';
      }).join("")+
      '<div class="hr" style="height:1px;background:var(--line);margin:12px 0"></div>'+
      '<div class="rowbetween"><span style="font-size:12.5px">✈️ 사전 예약</span>'+
        '<span style="font-size:12.5px;font-weight:600">'+fmt(spentPre(),"KRW")+
        ' <span class="d '+((spentPre()-nm.pre)<=0?"less":"more")+'">'+((spentPre()-nm.pre)>0?"+":"")+
        Math.round((spentPre()-nm.pre)/nm.pre*100)+'%</span></span></div>'+
      '<div class="small" style="margin-top:5px">또래 중앙값 '+fmt(nm.pre,"KRW")+' · 출발지에 따라 달라질 수 있어요</div></div>';
  }else{
    var dots="";
    for(var i=1;i<=5;i++)dots+=(i<=pn?'<i>'+i+'</i>':'<i class="empty">'+i+'</i>');
    cmp='<div class="card"><div class="soonbox"><div style="font-size:14px;font-weight:700">'+esc(p.city)+' 다녀온 사람들</div>'+
      '<div class="small" style="margin-top:5px">'+esc(p.purpose||"여행")+'으로 다녀온 사람이<br>5명 모이면 항목별로 비교해 드릴게요.</div>'+
      '<div class="dots">'+dots+'</div><div class="small">지금 '+pn+'명 · '+(5-pn)+'명 더 필요합니다</div></div></div>';
  }
  /* 결제수단별 */
  var pmAgg={};
  txs().filter(function(t){return !isDep(t.cat);}).forEach(function(t){
    var k=t.pm||"card"; pmAgg[k]=(pmAgg[k]||0)+mineK(t);});
  var pmTot=Object.keys(pmAgg).reduce(function(x,k){return x+pmAgg[k];},0)||1;
  var PMN={card:"💳 카드",cash:"💵 현금",account:"🏦 계좌"};
  var pmBlock=Object.keys(pmAgg).length>1
    ? '<div class="card"><div class="sub" style="margin-bottom:11px">결제수단별</div>'+
      Object.keys(pmAgg).sort(function(a,b){return pmAgg[b]-pmAgg[a];}).map(function(k){
        return '<div class="rowbetween" style="padding:5px 0;font-size:13px"><span>'+PMN[k]+'</span>'+
          '<span><b>'+mainOnly(pmAgg[k])+'</b> <i style="color:var(--muted);font-style:normal;font-size:11.5px">'+
          Math.round(pmAgg[k]/pmTot*100)+'%</i></span></div>';}).join("")+'</div>'
    : '';
  var depv=spentDep();
  var depBlock=depv>0?'<div class="card"><div class="rowbetween"><span style="font-size:13.5px">📦 보증금 <span class="tag dep">회수 예정</span></span>'+
    '<b>'+mainOnly(depv)+'</b></div><div class="small" style="margin-top:6px">돌려받을 돈이라 예산·비교에서 빠져요</div></div>':'';
  var lg=BUDGETLOG.filter(function(b){return b.p===S.pid;});
  var lgBlock=lg.length>2?'<div class="card"><div class="sub" style="margin-bottom:10px">예산 변경 이력</div>'+
    lg.map(function(b){return '<div class="rowbetween" style="padding:5px 0;font-size:12.5px">'+
      '<span>'+(+b.d.slice(5,7))+'/'+(+b.d.slice(8,10))+' · '+(b.type==="pre"?"사전 예약":"현지 지출")+
      (b.memo?' <i style="color:var(--muted);font-style:normal">'+esc(b.memo)+'</i>':'')+'</span>'+
      '<b style="color:'+(b.memo==="최초 설정"?"inherit":(b.amt>0?"var(--warn)":"var(--good)"))+'">'+(b.memo==="최초 설정"?"":(b.amt>0?"+":"−"))+fmt(Math.abs(b.amt),"KRW")+'</b></div>';}).join("")+
    '<div class="rowbetween" style="border-top:1px solid var(--line);margin-top:7px;padding-top:9px;font-size:13px">'+
    '<span>현재 예산</span><b>'+fmt(p.bPre+p.bLocal,"KRW")+'</b></div></div>':'';

  return topbar()+
  '<div class="hd"><h2>리포트</h2><span class="sub">'+period(p)+'</span></div>'+
  '<div class="card"><div class="rowbetween" style="margin-bottom:14px"><span class="sub">항목별 지출 · 사전 예약 포함</span>'+
    '<span style="font-weight:700">'+mainOnly(spentLocal()+spentPre())+'</span></div>'+
    arr.map(function(x){
      return '<div class="catbar"><span class="nm"><i class="dot" style="background:'+catColor(x[0])+'"></i>'+esc(x[0])+'</span>'+
        '<span class="track"><i style="width:'+(x[1]/max*100).toFixed(1)+'%;background:'+catColor(x[0])+'"></i></span>'+
        '<span class="vl">'+mainOnly(x[1])+'<i>'+Math.round(x[1]/barTot*100)+'%</i></span></div>';}).join("")+
    '<div class="small" style="margin-top:8px">나눠 낸 금액은 내 몫만 반영됩니다.</div></div>'+
  pmBlock+depBlock+cmp+lgBlock+'<div style="height:14px"></div>';
}

/* ---------- my ---------- */
function vMy(){
  var p=proj();
  return '<div class="hd"><h2>MY</h2></div>'+
  '<div class="card">'+
    '<div class="setrow" style="border-bottom:none"><span>적용 환율</span>'+
      '<span class="sub">1 '+p.cur+' = '+num(CUR[p.cur].r,1)+'원</span></div>'+
    '<div class="small" style="margin-top:2px">거래일 환율로 기록되고, 나중에 바뀌어도 과거 기록은 그대로예요.</div>'+
  '</div>'+
  '<div class="card"><div style="font-size:14px;font-weight:600;margin-bottom:4px">내 프로젝트</div>'+
    Object.keys(P).map(function(k){
      var q=P[k],n=TX.filter(function(t){return t.p===k;}).length;
      return '<div class="setrow" style="gap:10px">'+
        '<button data-p="'+k+'" data-goto="home" style="flex:1;min-width:0;text-align:left;background:none">'+q.flag+' '+esc(q.name)+
        '<span class="small" style="display:block;margin-top:2px">'+cityLabel(q)+' · '+period(q)+' · '+n+'건</span></button>'+
        '<button class="minib" data-editproj="'+k+'">수정</button></div>';}).join("")+
    '<button class="btn ghost" data-go="newproj" style="margin-top:12px">＋ 새 프로젝트 만들기</button></div>'+
  '<div class="card"><div style="font-size:14px;font-weight:600;margin-bottom:8px">정산 계좌</div>'+
    (ME.acc
      ? '<button class="setrow" id="editacc" style="padding-top:2px"><span>'+esc(ME.bank)+' '+esc(ME.acc)+
        '<span class="small" style="display:block;margin-top:2px">예금주 '+esc(ME.holder)+'</span></span><span class="sub">수정 ›</span></button>'
      : '<button class="setrow" id="editacc" style="padding-top:2px"><span class="sub">아직 등록하지 않았어요</span><span class="sub">등록 ›</span></button>')+
    '<div class="small" style="margin-top:8px">정산 링크에만 표시되고, 서버에는 암호화해서 보관해요.</div></div>'+
  (SETTLE.length?'<div class="card"><div style="font-size:14px;font-weight:600;margin-bottom:8px">보낸 정산</div>'+
    SETTLE.slice().reverse().map(function(x){
      return '<div class="setrow" style="align-items:flex-start"><span>'+esc(x.pname)+
        '<span class="small" style="display:block;margin-top:2px">'+x.cnt+'건 · '+x.n+'명 · '+fmt(x.each,"KRW")+' · '+
        (x.status==="active"?'<b style="color:var(--good)">링크 유효</b>':'<b style="color:var(--muted)">취소됨</b>')+'</span></span>'+
        (x.status==="active"?'<button class="minib" data-revoke="'+x.code+'">취소</button>':'')+'</div>';
    }).join("")+'</div>':'')+
  (RECUR.filter(function(r){return r.p===S.pid;}).length
    ?'<div class="card"><div style="font-size:14px;font-weight:600;margin-bottom:8px">반복 지출</div>'+
      RECUR.filter(function(r){return r.p===S.pid;}).map(function(r){
        return '<div class="setrow" style="align-items:flex-start"><span>'+catOf(r.cat).i+' '+esc(r.m)+
          '<span class="small" style="display:block;margin-top:2px">매달 '+r.day+'일 · '+fmt(toKRW(r.amt,r.cur),r.cur)+'</span></span>'+
          '<button class="minib" data-recoff="'+r.id+'">'+(r.on?"일시정지":"다시 켜기")+'</button></div>';
      }).join("")+'</div>':'')+
  '<div class="card"><div style="font-size:14px;font-weight:600;margin-bottom:8px">내 카테고리</div>'+
    '<div class="catrow">'+cats().map(function(c){return '<button style="cursor:default">'+c.i+' '+esc(c.n)+'</button>';}).join("")+
    '<button class="addc" id="addcat2">＋ 직접 추가</button></div></div>'+
  '<div class="card"><div class="rowbetween"><span><b style="font-size:14px;font-weight:600">계정</b>'+
    '<span class="small" style="display:block;margin-top:3px">'+esc((USER&&USER.email)||"")+'</span></span>'+
    '<button class="minib" id="signout">로그아웃</button></div></div>'+
  '<div class="small" style="text-align:center;margin:14px 2px 4px;line-height:1.6">어브로디 · 해외 지출 가계부 프로토타입<br>내 기록은 Supabase에 사용자별로 안전하게 저장돼요</div>'+
  '<div style="height:8px"></div>';
}

/* ---------- onboarding: welcome · done ---------- */
function vWelcome(){
  return '<div class="wel"><div class="wel-badge">✈️</div>'+
    '<h1 class="wel-h">해외에서 쓴 돈,<br>한 번에 정리돼요</h1>'+
    '<p class="wel-p">여행이든 교환학생이든, 떠나기 전부터 돌아올 때까지<br>얼마 남았는지 알려드릴게요.</p>'+
    '<div class="wel-list">'+
      '<div class="wel-item"><span class="e">📸</span><span><b>캡처 한 장이면 끝</b>'+
        '<span>은행·카드·간편결제 앱 화면을 올리면 여러 건을 한 번에 정리해요</span></span></div>'+
      '<div class="wel-item"><span class="e">🧮</span><span><b>오늘 · 이번 달 쓸 수 있는 돈</b>'+
        '<span>항공·숙소 같은 사전 예약은 빼고, 현지에서 쓸 돈만 계산해요</span></span></div>'+
      '<div class="wel-item"><span class="e">💸</span><span><b>1/N은 링크로</b>'+
        '<span>여러 건을 골라 한 번에 나누고, 내 가계부엔 내 몫만 남아요</span></span></div>'+
    '</div>'+
    '<button class="btn" id="welstart">첫 여행 만들기</button>'+
    '<div class="wel-foot">가입 없이 바로 시작할 수 있어요</div></div>';
}
function vDone(){
  var p=proj(),d=Math.max(1,days(p.start,p.end)+1);
  return '<div class="wel"><div class="wel-badge ok">'+p.flag+'</div>'+
    '<h1 class="wel-h">'+esc(p.name)+'<br>준비 완료!</h1>'+
    '<p class="wel-p">'+cityLabel(p)+' · '+esc(p.purpose)+' · '+d+'일<br>이제 지출만 담으면 돼요.</p>'+
    '<div class="wel-list">'+
      '<div class="wel-item"><span class="e">1</span><span><b>＋ 를 눌러 첫 지출 기록하기</b>'+
        '<span>결제 화면을 올리거나 직접 적어도 돼요</span></span></div>'+
      '<div class="wel-item"><span class="e">2</span><span><b>쓸 수 있는 돈 확인하기</b>'+
        '<span>기록할 때마다 홈 화면 숫자가 바로 바뀌어요</span></span></div>'+
    '</div><button class="btn" id="donego">홈으로 가기</button></div>';
}

/* ---------- render ---------- */
function render(){
  var v=$("#view"),h;
  if(!hasProj()&&S.tab!=="newproj")h=vWelcome();
  else if(S.tab==="done")h=vDone();
  else if(S.detail)h=vEditor();
  else if(S.tab==="newproj")h=vNewProj();
  else if(S.tab==="scan")h=vScan();
  else if(S.tab==="add")h=vAdd();
  else h=S.tab==="home"?vHome():S.tab==="ledger"?vLedger():S.tab==="report"?vReport():vMy();
  v.innerHTML=h;
  var tb=document.querySelector(".tabbar");
  if(tb)tb.style.display=(!hasProj()||S.tab==="newproj"||S.tab==="done")?"none":"";
  Array.prototype.forEach.call(document.querySelectorAll(".tab"),function(b){
    b.setAttribute("aria-current",!S.detail&&(b.dataset.tab===S.tab||(S.tab==="scan"&&b.dataset.tab==="add")));});
  syncSel();v.scrollTop=0;
  stash();
}
function syncSel(){
  var ids=Object.keys(S.sel).filter(function(k){return S.sel[k];}),bar=$("#selbar");
  if(!S.selMode||S.tab!=="ledger"||S.detail){bar.classList.remove("show");return;}
  var sum=ids.reduce(function(s,id){var t=byId(id);return s+(t?toKRW(t.amt,t.cur):0);},0);
  $("#selcount").textContent=ids.length;
  $("#seltotal").textContent=ids.length?mainOnly(sum):"항목을 골라주세요";
  $("#btnsplit").disabled=!ids.length;bar.classList.add("show");
}
function addBudgetSheet(type){
  S._bgType=type; if(!S._bgCur)S._bgCur=localCur();
  var p=proj(),cur=S._bgCur,curK=(type==="pre"?p.bPre:p.bLocal);
  var curVal=Math.round(fromKRW(curK,cur));
  return '<h3>'+(type==="pre"?"✈️ 사전 예약":"🧾 현지 지출")+' 예산 수정</h3>'+
    '<div class="small" style="margin-bottom:12px">지금 예산은 '+fmt(curK,"KRW")+'예요. 늘리거나 줄일 수 있어요.</div>'+
    '<div class="rowbetween" style="margin-bottom:8px"><span class="sub">통화</span><span class="seg">'+
      [localCur(),"KRW"].filter(function(v,i,a){return a.indexOf(v)===i;}).map(function(cc){
        return '<button data-bgcur="'+cc+'" aria-pressed="'+(cc===cur)+'">'+cc+'</button>';}).join("")+'</span></div>'+
    '<div class="amtin"><span class="cu">'+CUR[cur].s+'</span>'+
      '<input id="bg_amt" type="text" inputmode="numeric" value="'+fmtNum(curVal)+'"></div>'+
    '<div class="quickrow">'+
      [["-20","−20%"],["-10","−10%"],["+10","+10%"],["+20","+20%"]].map(function(x){
        return '<button data-bgpct="'+x[0]+'">'+x[1]+'</button>';}).join("")+'</div>'+
    '<div class="small" id="bg_diff" style="margin-top:9px">금액을 바꾸면 변화량을 보여드릴게요</div>'+
    '<div class="field" style="margin-top:11px"><label>메모 (선택)</label>'+
      '<input class="inp" id="bg_memo" placeholder="예: 부모님 추가 송금 / 항공권 특가로 절감"></div>'+
    '<button class="btn" id="dobudget">이 금액으로 수정</button>'+
    '<button class="btn ghost" id="btnclose" style="margin-top:8px">닫기</button>';
}
function bgDiffText(){
  var p=proj(),curK=(S._bgType==="pre"?p.bPre:p.bLocal);
  var v=Number(rawNum(($("#bg_amt")||{value:"0"}).value))||0;
  var newK=toKRW(v,S._bgCur), d=newK-curK;
  if(Math.abs(d)<1) return "지금과 같은 금액이에요";
  return (d>0?"▲ ":"▼ ")+fmt(Math.abs(d),"KRW")+(d>0?" 늘어나요":" 줄어들어요");
}
function cashSheet(){
  return '<h3>환전·인출 기록</h3>'+
    '<div class="small" style="margin-bottom:12px">현금으로 바꾼 금액을 적어두면 잔액을 계산해 드려요</div>'+
    '<div class="amtin"><span class="cu">'+CUR[localCur()].s+'</span><input id="cs_amt" type="text" inputmode="numeric" placeholder="0"></div>'+
    '<div class="field" style="margin-top:11px"><label>언제</label>'+
      '<input class="inp" id="cs_d" type="date" value="'+TODAY+'"></div>'+
    '<button class="btn" id="docash">기록하기</button>'+
    '<button class="btn ghost" id="btnclose" style="margin-top:8px">닫기</button>';
}
function accSheet(){
  return '<h3>정산 계좌</h3>'+
    '<div class="small" style="margin-bottom:12px">정산 링크에만 표시돼요</div>'+
    '<div class="field"><label>은행</label><input class="inp" id="ac_b" value="'+esc(ME.bank)+'" placeholder="예: 신한은행"></div>'+
    '<div class="field"><label>계좌번호</label><input class="inp" id="ac_n" value="'+esc(ME.acc)+'" placeholder="- 없이 입력"></div>'+
    '<div class="field"><label>예금주</label><input class="inp" id="ac_h" value="'+esc(ME.holder)+'" placeholder="이름"></div>'+
    '<button class="btn" id="doacc">저장하기</button>'+
    '<button class="btn ghost" id="btnclose" style="margin-top:8px">닫기</button>';
}
function openSheet(h){$("#sheetbody").innerHTML='<div class="grab"></div>'+h;$("#sheet").classList.add("show");}
function closeSheet(){$("#sheet").classList.remove("show");}

function splitCode(){
  if(!S._code)S._code=(Math.random().toString(36).slice(2,7)).toUpperCase();
  return S._code;
}
/* 실제로 열리는 정산 링크 — 배포된 s.html + 나눈 내용을 URL 파라미터로 (백엔드 조회 없이) */
function settleUrl(items,n,each){
  var base=location.href.replace(/[^\/?#]*([?#].*)?$/,"");   /* 현재 앱의 디렉터리 URL */
  var p=new URLSearchParams();
  p.set("t",proj().name); p.set("f",proj().flag||"");
  p.set("e",String(Math.round(each))); p.set("n",String(n)); p.set("c",String(items.length));
  p.set("i",items.slice(0,6).map(function(t){var k=toKRW(t.amt,t.cur);
    return [t.m||"지출",fmt(k,t.cur),krwOnly(k)].join("~");}).join("|"));
  if(ME.acc)p.set("a",(ME.bank?ME.bank+" ":"")+ME.acc+(ME.holder?" ("+ME.holder+")":""));
  return base+"s.html?"+p.toString();
}
function splitSheet(n){
  S._lastN=n;
  var ids=Object.keys(S.sel).filter(function(k){return S.sel[k];});
  var items=ids.map(byId),sum=items.reduce(function(s,t){return s+toKRW(t.amt,t.cur);},0),each=sum/n;
  var link=settleUrl(items,n,each);
  /* 통화별 소계 */
  var byCur={}; items.forEach(function(t){byCur[t.cur]=(byCur[t.cur]||0)+t.amt;});
  var curLine=Object.keys(byCur).map(function(c){return fmt(toKRW(byCur[c],c),c);}).join(" · ");
  var acc = ME.acc ? ME.bank+" "+ME.acc+" ("+ME.holder+")" : "";
  /* 사용자가 직접 고치지 않았으면 인원 변경에 맞춰 문구·링크를 다시 만든다 */
  if(!S.msgCustom) S.msgText = proj().flag+" "+proj().name+" 정산이에요 💸\n한 사람당 "+krwOnly(each)+
    (acc?"\n"+acc:"")+"\n\n무엇을 나눴는지 링크에서 바로 볼 수 있어요\n"+link;

  openSheet('<h3>'+items.length+'건을 나눠 보내기</h3>'+
    '<div class="small">합계 '+krwOnly(sum)+(Object.keys(byCur).length>1||items[0].cur!=="KRW"?' &nbsp;('+curLine+')':'')+'</div>'+
    '<div class="stepper"><button data-n="'+(n-1)+'" '+(n<=2?"disabled":"")+'>−</button>'+
      '<span class="n">'+n+'<small>명</small></span><button data-n="'+(n+1)+'" '+(n>=50?"disabled":"")+'>＋</button></div>'+
    '<div class="card" style="border-color:var(--accent-soft);background:#f4f9ff;padding:13px 15px">'+
      '<div class="rowbetween"><span class="sub">한 사람당 보낼 금액</span><span style="font-size:21px;font-weight:700" class="money">'+krwOnly(each)+'</span></div>'+
      '<div class="rowbetween" style="margin-top:5px"><span class="sub">내 가계부에 남는 금액</span>'+
        '<span><span class="strike">'+krwOnly(sum)+'</span><b class="money">'+krwOnly(each)+'</b></span></div>'+
      '<div class="small" style="margin-top:7px">거래일 환율 기준으로 원화 환산했어요</div></div>'+
    (acc?'':'<div class="accwarn"><span>계좌를 등록하면 받는 분이 바로 송금할 수 있어요</span>'+
      '<button id="goacc">계좌 등록하기</button></div>')+
    '<div class="rowbetween" style="margin-top:14px"><span class="small">보낼 메시지</span>'+
      '<button class="minib" id="msgedit">'+(S.msgEdit?"완료":"수정")+'</button></div>'+
    (S.msgEdit
      ? '<textarea class="inp" id="msgbox" style="min-height:120px;font-size:13px;line-height:1.6">'+esc(S.msgText)+'</textarea>'+
        '<button class="minib" id="msgreset" style="margin-top:7px">기본 문구로 되돌리기</button>'
      : '<div class="msg">'+esc(S.msgText)+'</div>')+
    '<div class="small" style="margin-top:12px">상대방이 링크를 열면 이렇게 보여요</div>'+
    '<div class="preview"><div class="pv-top"><span class="pv-app">어브로디</span><span class="pv-url">'+link+'</span></div>'+
      '<div class="pv-body"><div class="pv-who">'+esc(proj().flag+" "+proj().name)+'</div>'+
        '<div class="pv-amt">'+krwOnly(each)+'</div>'+
        '<div class="pv-sub">'+items.length+'건을 '+n+'명이 나눈 금액</div>'+
        '<div class="pv-list">'+items.slice(0,3).map(function(t){
          return '<div><span>'+esc(t.m)+'</span><b>'+fmt(toKRW(t.amt,t.cur),t.cur)+
                 (t.cur!=="KRW"?' <i style="color:var(--muted);font-style:normal">'+krwOnly(toKRW(t.amt,t.cur))+'</i>':'')+'</b></div>';}).join("")+
          (items.length>3?'<div><span>외 '+(items.length-3)+'건</span><b></b></div>':'')+'</div>'+
        (acc?'<div class="pv-acc">'+esc(acc)+'</div>':'')+
        '<div class="pv-cta">'+(acc?"계좌 복사하기":"보낼 계좌 확인하기")+'</div>'+
        '<div class="pv-foot">나도 이 여행 가계부 써보기 →</div></div></div>'+
    '<button class="btn" data-share="'+n+'" style="margin-top:14px">링크로 정산 요청 보내기</button>'+
    '<button class="btn ghost" id="btnclose" style="margin-top:8px">닫기</button>');
}

/* 입력창은 건드리지 않고 결과 목록만 갱신 — 한글 조합이 깨지지 않도록 */
function curListHTML(){
  var cur=S.curTarget==="budget"?S.nf.bcur:(curTx()||{cur:"KRW"}).cur;
  var q=(S.curq||"").trim().toLowerCase();
  var keys=Object.keys(CUR).filter(function(k){
    if(!q)return true;
    return k.toLowerCase().indexOf(q)>-1||CUR[k].ko.toLowerCase().indexOf(q)>-1;
  });
  if(!keys.length)return '<div class="empty">검색 결과가 없어요</div>';
  return keys.map(function(k){
    return '<button class="curitem" data-txcur="'+k+'" aria-current="'+(k===cur)+'">'+
      '<span class="sy">'+CUR[k].s+'</span><span class="nm"><b>'+k+'</b><span>'+CUR[k].ko+'</span></span>'+
      (k===cur?'<span class="ck">✓</span>':'')+'</button>';
  }).join("");
}
function paintCurList(){var el=$("#cur_list");if(el)el.innerHTML=curListHTML();}
function destListHTML(){
  var q=(S.nf.q||"").trim();
  if(!q)return "";
  var lq=q.toLowerCase();
  var hits=CITIES.filter(function(c){
    return c.ko.indexOf(q)>-1||c.country.indexOf(q)>-1||
      (c.en&&c.en.toLowerCase().indexOf(lq)>-1)||
      (c.al&&c.al.toLowerCase().indexOf(lq)>-1);
  }).sort(function(a,b){
    function rk(c){
      var aw=(c.al||"").toLowerCase().split(" ").filter(Boolean);
      if(aw.indexOf(lq)>-1)return 0;                       /* 별칭 정확히 일치 (LA, NY, KL) */
      if(c.ko.indexOf(q)===0)return 1;                     /* 한글 앞글자 */
      if(c.en.toLowerCase().indexOf(lq)===0)return 2;       /* 영문 앞글자 */
      if(aw.some(function(w){return w.indexOf(lq)===0;}))return 3;
      if(c.country.indexOf(q)===0)return 4;
      return 5;
    }
    var sa=rk(a),sb=rk(b);
    return sa-sb;
  }).slice(0,7);
  if(!hits.length)return '<div class="small" style="margin-top:7px">검색 결과가 없어요. 다른 이름으로 찾아보세요.</div>';
  return '<div class="sugg">'+hits.map(function(c){
    return '<button data-dest="'+CITIES.indexOf(c)+'"><span class="fl">'+c.flag+'</span>'+
      '<span class="t"><b>'+c.ko+'</b><span>'+c.country+'</span></span>'+
      '<span class="cu">'+c.cur+'</span></button>';
  }).join("")+'</div>';
}
function paintDestList(){var el=$("#dest_list");if(el)el.innerHTML=destListHTML();}
function fmtNum(v){
  var t=String(v==null?"":v).replace(/[^0-9.]/g,"");
  if(!t)return "";
  var q=t.split("."),head=q[0]?Number(q[0]).toLocaleString("ko-KR"):"0";
  return q.length>1?head+"."+q[1].slice(0,2):head;
}
function rawNum(v){return String(v==null?"":v).replace(/,/g,"");}
function nowHM(){var d=new Date();return String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0");}
function curSheet(){
  openSheet('<h3>통화 선택</h3><div class="small" style="margin-bottom:10px">전 세계에서 실제로 쓰이는 통화는 약 180가지예요. 자주 가는 곳 위주로 담았어요.</div>'+
    '<input class="inp" id="cur_q" placeholder="통화 이름이나 코드로 검색" value="'+esc(S.curq||"")+'" autocomplete="off">'+
    '<div class="curlist" id="cur_list">'+curListHTML()+'</div>'+
    '<button class="btn ghost" id="btnclose" style="margin-top:10px">닫기</button>');
}
function addCatSheet(){
  openSheet('<h3>카테고리 추가</h3><div class="small" style="margin-bottom:12px">필요한 분류를 직접 만들 수 있어요</div>'+
    '<div class="field"><label>이름</label><input class="inp" id="c_name" placeholder="예: 기념품, 세탁"></div>'+
    '<div class="field"><label>아이콘</label><div class="catrow iconpick" id="c_icons">'+
      ICONS.map(function(e,i){
        return '<button data-cicon="'+e+'" aria-pressed="'+(i===0)+'" style="font-size:16px">'+e+'</button>';}).join("")+
    '</div></div>'+
    '<button class="btn" id="c_add">추가하기</button>'+
    '<button class="btn ghost" id="btnclose" style="margin-top:8px">닫기</button>');
}

/* ---------- events ---------- */
document.addEventListener("click",function(e){
  var el;
  /* onboarding */
  if(e.target.id==="welstart"){startNewProject();render();return;}
  if((el=e.target.closest("[data-editproj]"))){openEditProject(el.dataset.editproj);return;}
  if(e.target.id==="donego"){S.tab="home";render();return;}
  if((el=e.target.closest(".tab"))){
    S.detail=null;S.selMode=false;S.sel={};
    S.tab=el.dataset.tab; if(S.tab!=="scan")S.scan="idle";
    render();return;}
  if((el=e.target.closest(".feat"))){
    S.focusF=el.dataset.f;S.detail=null;S.selMode=false;S.sel={};S.tab=el.dataset.go;S.scan="idle";render();return;}
  if((el=e.target.closest("[data-go]"))&&!el.classList.contains("feat")){
    if(el.dataset.go==="newproj"){closeSheet();startNewProject();render();return;}
    if(el.dataset.src)S.scanSrc=el.dataset.src; else if(el.dataset.go==="scan")S.scanSrc="card";
    closeSheet();S.detail=null;S.tab=el.dataset.go;if(S.tab==="scan")S.scan="idle";render();return;}

  if(e.target.closest("#wsopen")){openSheet(wsSheet());return;}
  if(e.target.closest("#helpopen")){openSheet(helpSheet());return;}
  if((el=e.target.closest("[data-p]"))){
    S.pid=el.dataset.p;S.sel={};S.selMode=false;S.scan="idle";S.disp="local";S.unit=null;
    S.cal=(P[S.pid].end<TODAY?P[S.pid].end:TODAY).slice(0,7);
    if(el.dataset.goto)S.tab=el.dataset.goto;
    closeSheet();render();return;}

  if((el=e.target.closest("[data-cal]"))){
    var y=+S.cal.slice(0,4),m=+S.cal.slice(5,7)+(+el.dataset.cal);
    if(m<1){m=12;y--;}if(m>12){m=1;y++;}
    S.cal=y+"-"+String(m).padStart(2,"0");render();return;}

  if(e.target.id==="selstart"){S.selMode=true;S.sel={};render();return;}
  if(e.target.id==="selcancel"){S.selMode=false;S.sel={};render();return;}
  if((el=e.target.closest("[data-pick]"))){
    var id=el.dataset.pick;S.sel[id]=!S.sel[id];el.dataset.sel=S.sel[id]?1:0;syncSel();return;}
  if(e.target.id==="btnsplit"){splitSheet(3);return;}
  if((el=e.target.closest("[data-n]"))&&el.tagName==="BUTTON"){var n=+el.dataset.n;if(n>=2&&n<=50)splitSheet(n);return;}
  if(e.target.id==="btnclose"){closeSheet();return;}
  if((el=e.target.closest("[data-share]"))){
    var sn=+el.dataset.share;
    var picked=Object.keys(S.sel).filter(function(k){return S.sel[k];});
    var sumK=0;
    picked.forEach(function(id){var t=byId(id);if(t){t.split={n:sn};sumK+=toKRW(t.amt,t.cur);dbUpdateTx(t);}});
    var rec={code:splitCode(),pname:proj().name,pid:S.pid,ids:picked.slice(),n:sn,
             cnt:picked.length,each:sumK/sn,status:"active",d:TODAY};
    SETTLE.push(rec); S._code=null; S.lastSettle=rec;
    var shareText=S.msgText||(proj().name+" 정산 요청이에요 💸");
    shareSettlement(shareText);   /* 네이티브 공유 시트 · 실패 시 복사 */
    S.sel={};S.selMode=false;S.msgEdit=false;S.msgText="";S.msgCustom=false;closeSheet();render();
    return;}
  if(e.target.id==="undosettle"){revokeSettle(S.lastSettle&&S.lastSettle.code,true);return;}
  if((el=e.target.closest("[data-revoke]"))){
    var code=el.dataset.revoke;
    openSheet('<h3>정산을 취소할까요?</h3>'+
      '<div class="small" style="line-height:1.8;margin:8px 0 14px">'+
      '· 원래 금액으로 되돌아가요<br>'+
      '· 보낸 링크는 열리지 않게 됩니다<br>'+
      '· <b>이미 받은 분이 있다면 직접 알려주세요</b></div>'+
      '<button class="btn danger" data-dorevoke="'+code+'">취소하기</button>'+
      '<button class="btn ghost" id="btnclose" style="margin-top:8px">그대로 두기</button>');
    return;}
  if((el=e.target.closest("[data-dorevoke]"))){closeSheet();revokeSettle(el.dataset.dorevoke,false);return;}
  if(e.target.classList.contains("sheet")){closeSheet();return;}

  /* --- v9 추가 --- */
  if((el=e.target.closest("[data-unit]"))){S.unit=el.dataset.unit;render();return;}
  if((el=e.target.closest("[data-pm]"))){var tp=curTx();if(tp){tp.pm=el.dataset.pm;stash();render();}return;}
  if(e.target.id==="rcptog"||e.target.closest("#rcptog")){
    var tr=curTx();if(tr&&tr.src!=="card"){tr.keep=!tr.keep;stash();render();}
    else toast("카드 내역 캡처는 보관할 수 없어요");return;}
  if(e.target.id==="rectog"||e.target.closest("#rectog")){
    var tt=curTx();if(!tt)return;
    if(tt.rec){tt.rec=null;toast("반복 지출에서 뺐어요");}
    else{var rid="r"+Date.now();RECUR.push({id:rid,p:S.pid,m:tt.m||"이름 없는 지출",amt:Number(tt.amt)||0,
      cur:tt.cur,cat:tt.cat,day:+tt.d.slice(8,10),pm:tt.pm||"card",on:true});tt.rec=rid;
      toast("매달 "+(+tt.d.slice(8,10))+"일에 자동으로 기록할게요");}
    stash();render();return;}
  if(e.target.id==="confirmtx"){var tc=curTx();if(tc){tc.st="confirmed";dbUpdateTx(tc);render();toast("확인했어요 · 또래 비교에 반영됩니다");}return;}
  if((el=e.target.closest("[data-recoff]"))){
    RECUR.forEach(function(r){if(r.id===el.dataset.recoff)r.on=!r.on;});render();return;}

  /* 예산 증액 */
  if((el=e.target.closest("[data-addbudget]"))){openSheet(addBudgetSheet(el.dataset.addbudget));return;}
  if(e.target.id==="dobudget"){
    var v=Number(rawNum($("#bg_amt").value));
    if(isNaN(v)||v<0){toast("금액을 확인해 주세요");return;}
    var pj=proj(),oldK=(S._bgType==="pre"?pj.bPre:pj.bLocal),newK=toKRW(v,S._bgCur),d=newK-oldK;
    if(Math.abs(d)<1){closeSheet();toast("바뀐 게 없어요");return;}
    var memo=$("#bg_memo").value.trim()||(d>0?"예산 늘림":"예산 줄임");
    BUDGETLOG.push({p:S.pid,type:S._bgType,amt:d,d:TODAY,memo:memo});
    if(S._bgType==="pre")pj.bPre=newK; else pj.bLocal=newK;
    dbBudgetLog(S.pid,S._bgType,d,memo);dbUpdateProject(pj);
    closeSheet();render();toast(d>0?"예산을 "+fmt(d,"KRW")+" 늘렸어요":"예산을 "+fmt(-d,"KRW")+" 줄였어요");return;}
  if((el=e.target.closest("[data-bgpct]"))){
    var box=$("#bg_amt"); if(!box)return;
    var cv=Number(rawNum(box.value))||0;
    box.value=fmtNum(Math.round(cv*(1+Number(el.dataset.bgpct)/100)));
    var dt=$("#bg_diff"); if(dt)dt.textContent=bgDiffText();
    return;}
  if((el=e.target.closest("[data-bgcur]"))){S._bgCur=el.dataset.bgcur;openSheet(addBudgetSheet(S._bgType));return;}

  /* 현금 환전 기록 */
  if(e.target.id==="addcash"){openSheet(cashSheet());return;}
  if(e.target.id==="docash"){
    var cv=Number(rawNum($("#cs_amt").value))||0;
    if(!cv){toast("금액을 입력해 주세요");return;}
    proj().cash=proj().cash||[];
    var cd=$("#cs_d").value||TODAY;
    proj().cash.push({amt:cv,cur:localCur(),d:cd});
    dbCashTopup(S.pid,cv,localCur(),cd);
    closeSheet();render();toast("환전 기록을 더했어요");return;}

  /* 계좌 등록 */
  if(e.target.id==="editacc"||e.target.closest("#editacc")||e.target.id==="goacc"){openSheet(accSheet());return;}
  if(e.target.id==="doacc"){
    ME.bank=$("#ac_b").value.trim();ME.acc=$("#ac_n").value.trim();ME.holder=$("#ac_h").value.trim();
    if(!ME.acc){toast("계좌번호를 입력해 주세요");return;}
    S.msgText="";closeSheet();render();toast("계좌를 저장했어요");return;}

  /* 공유 문구 수정 */
  if(e.target.id==="msgedit"){
    if(S.msgEdit){var mb=$("#msgbox");if(mb){S.msgText=mb.value;S.msgCustom=true;}}
    S.msgEdit=!S.msgEdit;
    splitSheet(S._lastN||3);return;}
  if(e.target.id==="msgreset"){S.msgText="";S.msgCustom=false;S.msgEdit=false;splitSheet(S._lastN||3);return;}

  /* 사진 업로드 → 카메라/갤러리 선택 시트 (accept=image/* + capture 미지정 = OS 기본 선택) */
  if(e.target.id==="btnupload"){var fi=$("#scanfile");if(fi)fi.click();return;}
  if(e.target.id==="btnmanual"||e.target.id==="addmore"){
    clearScanImg();S.scan="idle";S.draft={m:"",amt:"",cur:localCur(),cat:cats()[0].n,d:TODAY,t:nowHM(),memo:"",pre:false,pm:"cash",src:"manual"};
    S.detail={kind:"new"};render();return;}

  /* editor */
  if((el=e.target.closest("[data-edit]"))){S.detail={kind:"tx",id:el.dataset.edit};render();return;}
  if((el=e.target.closest("[data-sedit]"))){S.detail={kind:"scan",i:+el.dataset.sedit};render();return;}
  if(e.target.closest("#godirect")){
    S.draft={m:"",amt:"",cur:proj().cur,cat:"식비",d:TODAY,t:nowHM(),memo:"",pre:false,split:null,pm:"cash",src:"manual"};
    S.detail={kind:"new"};render();return;}
  if(e.target.id==="dback"){S.detail=null;if(S.tab==="add"&&S.draft)S.draft=null;render();return;}
  if(e.target.id==="sback"){clearScanImg();S.tab="add";render();return;}
  if((el=e.target.closest("[data-setcat]"))){
    var t=curTx();t.cat=el.dataset.setcat;t.pre=catOf(t.cat).pre;render();return;}
  if((el=e.target.closest("[data-txcur]"))){
    if(S.curTarget==="budget"){S.nf.bcur=el.dataset.txcur;S.curTarget="tx";closeSheet();render();return;}
    closeSheet();
    var t2=curTx();t2.amt=Number($("#f_amt").value)||0;t2.cur=el.dataset.txcur;
    t2.m=$("#f_m").value;t2.memo=$("#f_memo").value;render();return;}
  if(e.target.closest("#pretog")){
    var t3=curTx();t3.pre=!t3.pre;
    var sw=$("#pretog .sw");sw.setAttribute("aria-pressed",!!t3.pre);return;}
  if(e.target.id==="dsave"){
    var d=S.detail,t4=curTx();
    t4.amt=Math.max(0,Number($("#f_amt").value)||0);
    t4.m=$("#f_m").value.trim()||"이름 없는 지출";
    t4.d=$("#f_d").value||TODAY;t4.t=$("#f_t").value||nowHM();t4.memo=$("#f_memo").value.trim();
    if(d.kind==="new"){
      if(!t4.amt){toast("금액을 입력해 주세요");return;}
      var nt={id:null,p:S.pid,d:t4.d,t:t4.t,m:t4.m,amt:t4.amt,cur:t4.cur,cat:t4.cat,split:null,
        memo:t4.memo,pre:t4.pre,pm:t4.pm||"cash",src:t4.src||"manual",keep:!!t4.keep,st:"confirmed"};
      TX.push(nt);
      dbInsertTx(nt).then(function(id){if(id){nt.id=id;render();}else{var ix=TX.indexOf(nt);if(ix>-1)TX.splice(ix,1);render();}});
      S.draft=null;S.detail=null;S.tab="ledger";S.cal=t4.d.slice(0,7);render();toast("기록했어요");return;}
    if(d.kind==="tx")dbUpdateTx(t4);
    S.detail=null;if(d.kind!=="scan")S.cal=t4.d.slice(0,7);
    render();toast("저장했어요");return;}
  if(e.target.id==="ddel"){
    var did=S.detail.id;dbDeleteTx(did);
    var ix=TX.indexOf(byId(did));if(ix>-1)TX.splice(ix,1);
    S.detail=null;render();toast("내역을 삭제했어요");return;}

  /* custom category */
  if(e.target.id==="curmore"){S.curq="";S.curTarget="tx";curSheet();return;}
  if(e.target.id==="addcat"||e.target.id==="addcat2"){addCatSheet();return;}
  if((el=e.target.closest("[data-cicon]"))){
    Array.prototype.forEach.call(document.querySelectorAll("[data-cicon]"),function(b){b.setAttribute("aria-pressed",b===el);});return;}
  if(e.target.id==="c_add"){
    var nm=$("#c_name").value.trim();
    if(!nm){toast("이름을 적어주세요");return;}
    var ic=($("[data-cicon][aria-pressed='true']")||{dataset:{cicon:"⭐"}}).dataset.cicon;
    customCats.push({n:nm,i:ic,pre:false});
    dbAddCategory(nm,ic);
    if(S.detail)curTx().cat=nm;
    closeSheet();render();toast("‘"+nm+"’ 카테고리를 만들었어요");return;}

  /* new project */
  if(e.target.id==="nback"){var toMy=!!S.editPid;S.editPid=null;S.tab=toMy?"my":"home";render();return;}
  if((el=e.target.closest("[data-dest]"))){
    saveNF();var c=CITIES[+el.dataset.dest];
    if(!S.nf.dests.some(function(x){return x.ko===c.ko;}))S.nf.dests.push(c);
    S.nf.adding=false;
    S.nf.q="";render();return;}
  if(e.target.id==="destclear"){saveNF();S.nf.dests=[];S.nf.adding=false;render();return;}
  if(e.target.id==="destadd"){saveNF();S.nf.adding=true;S.nf.q="";render();setTimeout(function(){var q=$("#n_q");if(q)q.focus();},50);return;}
  if((el=e.target.closest("[data-destdel]"))){saveNF();S.nf.dests.splice(+el.dataset.destdel,1);render();return;}
  if((el=e.target.closest("[data-bcur]"))){saveNF();S.nf.bcur=el.dataset.bcur;render();return;}
  if(e.target.id==="bcurmore"){saveNF();S.curq="";S.curTarget="budget";curSheet();return;}
  if((el=e.target.closest("[data-purpose]"))){saveNF();S.nf.purpose=el.dataset.purpose;render();return;}
  if(e.target.id==="autobudget"){
    saveNF();var f=S.nf,nm=normOf(f),d=Math.max(1,days(f.start,f.end)+1);
    if(!nm)return;
    f.bcur="KRW";f.bPre=String(Math.round(nm.pre));f.bLocal=String(Math.round(nm.perDay*d));
    render();toast("또래 평균으로 예산을 채웠어요<br>필요하면 바로 고쳐도 됩니다");return;}
  if(e.target.id==="ncreate"){
    saveNF();var f=S.nf;
    if(!f.dests.length){toast("어디로 가는지 골라주세요");return;}
    if(!f.name){toast("프로젝트 이름을 적어주세요");return;}
    if(!f.start||!f.end){toast("기간을 선택해 주세요");return;}
    if(days(f.start,f.end)<0){toast("종료일이 시작일보다 빠릅니다");return;}
    if(!Number(f.bLocal)){toast("현지 지출 예산을 입력해 주세요");return;}
    var d0=f.dests[0];
    var sameCur=f.dests.every(function(x){return x.cur===d0.cur;});
    var newPre=toKRW(Number(f.bPre)||0,f.bcur),newLocal=toKRW(Number(f.bLocal),f.bcur);

    if(S.editPid){ /* ── 기존 프로젝트 수정 (write-through) ── */
      var ek=S.editPid,pe=P[ek];
      var dPre=newPre-pe.bPre,dLocal=newLocal-pe.bLocal;
      if(Math.round(dPre)!==0){BUDGETLOG.push({p:ek,type:"pre",amt:dPre,d:TODAY,memo:"프로젝트 수정"});dbBudgetLog(ek,"pre",dPre,"프로젝트 수정");}
      if(Math.round(dLocal)!==0){BUDGETLOG.push({p:ek,type:"local",amt:dLocal,d:TODAY,memo:"프로젝트 수정"});dbBudgetLog(ek,"local",dLocal,"프로젝트 수정");}
      pe.name=f.name;pe.purpose=f.purpose;pe.start=f.start;pe.end=f.end;
      pe.city=d0.ko;pe.country=d0.country;pe.flag=d0.flag;pe.cur=sameCur?d0.cur:"KRW";
      pe.cities=f.dests.map(function(x){return {ko:x.ko,flag:x.flag,cur:x.cur};});
      pe.bPre=newPre;pe.bLocal=newLocal;
      dbUpdateProject(pe);
      S.editPid=null;S.unit=null;S.tab="my";S.nf=freshNF();
      if(S.pid===ek)S.cal=(f.end<TODAY?f.end:(f.start>TODAY?f.start:TODAY)).slice(0,7);
      render();toast("프로젝트를 수정했어요");return;
    }

    /* ── 신규 생성: DB insert로 UUID 받아 인메모리 반영 ── */
    var np={name:f.name,purpose:f.purpose,cur:sameCur?d0.cur:"KRW",start:f.start,end:f.end,
      bPre:newPre,bLocal:newLocal,cities:f.dests.map(function(x){return {ko:x.ko,flag:x.flag,cur:x.cur};})};
    dbInsertProject(np).then(function(pid){
      if(!pid)return;
      P[pid]={id:pid,name:np.name,city:d0.ko,country:d0.country,flag:d0.flag,cur:np.cur,
        cities:np.cities,cash:[],bPre:newPre,bLocal:newLocal,purpose:np.purpose,start:np.start,end:np.end,peers:0};
      BUDGETLOG.push({p:pid,type:"pre",amt:newPre,d:TODAY,memo:"최초 설정"});
      BUDGETLOG.push({p:pid,type:"local",amt:newLocal,d:TODAY,memo:"최초 설정"});
      dbBudgetLog(pid,"pre",newPre,"최초 설정");dbBudgetLog(pid,"local",newLocal,"최초 설정");
      S.pid=pid;S.tab="done";S.disp="local";S.unit=null;
      S.cal=(f.end<TODAY?f.end:(f.start>TODAY?f.start:TODAY)).slice(0,7);
      S.nf=freshNF();render();toast("프로젝트를 만들었어요<br>＋ 를 눌러 지출을 기록해 보세요");
    });
    return;}

  /* scan: 사진을 다시 올리기 (되돌아가 새 사진 선택) */
  if(e.target.id==="btnscan"){startScan();return;}
  if(e.target.id==="btncancel"){clearScanImg();S.scan="idle";render();return;}
  if(e.target.id==="btnsave"){
    var cnt=S.scanRows.length;
    S.scanRows.forEach(function(r){
      var t={id:null,p:S.pid,d:r.d,t:r.t,m:r.m,amt:r.amt,cur:r.cur,cat:r.cat,split:null,
        memo:r.memo||"",pre:!!r.pre,src:r.src||"card",keep:!!r.keep,pm:r.pm||"card",st:"confirmed"};
      TX.push(t);
      dbInsertTx(t).then(function(id){if(id){t.id=id;render();}else{var ix=TX.indexOf(t);if(ix>-1)TX.splice(ix,1);render();}});
    });
    clearScanImg();S.scan="idle";S.scanRows=[];S.tab="home";render();
    var big=$("#bignum");if(big){big.classList.add("flash");setTimeout(function(){big.classList.remove("flash");},700);}
    toast(cnt+"건을 기록했어요 · 오늘 쓸 수 있는 돈이 바뀌었습니다");return;}

  if((el=e.target.closest("[data-disp]"))){S.disp=el.dataset.disp;render();return;}
});

function curTx(){var d=S.detail;return d.kind==="scan"?S.scanRows[d.i]:(d.kind==="new"?S.draft:byId(d.id));}
function saveNF(){
  var q=$("#n_q"),n=$("#n_name"),s=$("#n_start"),e2=$("#n_end"),pre=$("#n_pre"),lo=$("#n_local");
  if(q)S.nf.q=q.value; if(n)S.nf.name=n.value.trim();
  if(s)S.nf.start=s.value; if(e2)S.nf.end=e2.value;
  if(pre)S.nf.bPre=rawNum(pre.value); if(lo)S.nf.bLocal=rawNum(lo.value);
}

document.addEventListener("input",function(e){
  if(e.target.id==="cur_q"){S.curq=e.target.value;paintCurList();return;}
  if(e.target.id==="n_q"){S.nf.q=e.target.value;paintDestList();return;}
  if(e.target.id==="bg_amt"){
    var f2=fmtNum(e.target.value);
    if(e.target.value!==f2){e.target.value=f2;try{e.target.setSelectionRange(f2.length,f2.length);}catch(_){}}
    var dt2=$("#bg_diff"); if(dt2)dt2.textContent=bgDiffText(); return;}
  if(["n_pre","n_local","n_start","n_end"].indexOf(e.target.id)>-1){
    if(e.target.id==="n_pre"||e.target.id==="n_local"){
      var f2=fmtNum(e.target.value);
      if(e.target.value!==f2){e.target.value=f2;
        try{e.target.setSelectionRange(f2.length,f2.length);}catch(_){}}
    }
    saveNF();var t=$("#n_tip p");if(t)t.innerHTML=budgetHint();
    var ab=$("#n_auto");if(ab)ab.innerHTML=autoBudgetBox();return;}
  if(e.target.id==="f_amt"&&S.detail){
    var t2=curTx(),v=Number(e.target.value)||0;
    var h=$("#f_hint");if(h)h.textContent=amtHint({amt:v,cur:t2.cur});}
});
/* 도움말 슬라이드 → 점(dot) 표시 갱신 (scroll은 캡처로 잡음) */
document.addEventListener("scroll",function(e){
  if(!e.target||e.target.id!=="helpslides")return;
  var el=e.target,dots=$("#helpdots");if(!dots)return;
  var idx=Math.round(el.scrollLeft/Math.max(1,el.clientWidth));
  Array.prototype.forEach.call(dots.children,function(d,i){d.className=(i===idx?"on":"");});
},true);
/* 사진 선택 완료 → 인식 시작 */
document.addEventListener("change",function(e){
  if(e.target.id==="scanfile"){
    var f=e.target.files&&e.target.files[0];
    if(!f)return;
    clearScanImg();
    try{S.scanImg=URL.createObjectURL(f);S.scanFile=f;}catch(_){S.scanImg=null;}
    startScan();
  }
});
document.addEventListener("keydown",function(e){
  if(e.key===" "||e.key==="Enter"){var el=e.target.closest("[data-pick]");if(el){e.preventDefault();el.click();}}
});

/* ---------- 로그인 화면 (아이디 / 비밀번호) ----------
   Supabase는 이메일 기반이라, 아이디를 <아이디>@abroaddy.app 내부 이메일로 매핑.
   이메일 발송이 없어 전송 제한·링크 문제 없이 즉시 가입/로그인. */
function uEmail(id){return String(id||"").toLowerCase().replace(/[^a-z0-9._-]/g,"")+"@abroaddy.app";}
function renderLogin(){
  var a=S.auth||(S.auth={mode:"login",busy:false});
  var tb=document.querySelector(".tabbar");if(tb)tb.style.display="none";
  var signup=a.mode==="signup",fields;
  if(signup){
    fields='<div class="field"><label>이름</label><input class="inp" id="au_name" value="'+esc(a.name||"")+'" placeholder="예: 김서현"></div>'+
      '<div class="field"><label>전화번호</label><input class="inp" id="au_phone" inputmode="tel" value="'+esc(a.phone||"")+'" placeholder="010-1234-5678"></div>'+
      '<div class="field"><label>아이디</label><input class="inp" id="au_id" autocapitalize="off" autocorrect="off" spellcheck="false" value="'+esc(a.id||"")+'" placeholder="영문/숫자 3자 이상"></div>'+
      '<div class="field"><label>비밀번호</label><input class="inp" id="au_pw" type="password" autocomplete="new-password" placeholder="6자 이상"></div>'+
      '<button class="btn" id="dosignup"'+(a.busy?" disabled":"")+'>'+(a.busy?"가입 중…":"가입하고 시작하기")+'</button>'+
      '<button class="btn ghost" id="tologin" style="margin-top:8px">이미 계정이 있어요 · 로그인</button>';
  }else{
    fields='<div class="field"><label>아이디</label><input class="inp" id="au_id" autocapitalize="off" autocorrect="off" spellcheck="false" value="'+esc(a.id||"")+'" placeholder="아이디"></div>'+
      '<div class="field"><label>비밀번호</label><input class="inp" id="au_pw" type="password" autocomplete="current-password" placeholder="비밀번호"></div>'+
      '<button class="btn" id="dologin"'+(a.busy?" disabled":"")+'>'+(a.busy?"로그인 중…":"로그인")+'</button>'+
      '<button class="btn ghost" id="tosignup" style="margin-top:8px">처음이신가요? · 회원가입</button>';
  }
  $("#view").innerHTML='<div class="wel"><div class="wel-badge">✈️</div>'+
    '<h1 class="wel-h">어브로디 '+(signup?"회원가입":"로그인")+'</h1>'+
    '<p class="wel-p">'+(signup?"아이디·비밀번호로 바로 시작해요.":"아이디와 비밀번호로 로그인하세요.")+'<br>내 기록은 나만 볼 수 있어요.</p>'+
    '<div style="text-align:left;max-width:320px;margin:0 auto">'+fields+'</div></div>';
  var f=$(signup?"#au_name":"#au_id");if(f)setTimeout(function(){f.focus();},40);
}
function readAuthFields(){var a=S.auth,g=function(s){return (($(s)||{}).value)||"";};
  a.name=g("#au_name").trim();a.phone=g("#au_phone").trim();a.id=g("#au_id").trim();a._pw=g("#au_pw");}
function doSignup(){
  readAuthFields();var a=S.auth;
  if(!a.name){toast("이름을 입력해 주세요");return;}
  if(!/^[A-Za-z0-9._-]{3,20}$/.test(a.id)){toast("아이디는 영문/숫자 3~20자로 해주세요");return;}
  if((a._pw||"").length<6){toast("비밀번호는 6자 이상이에요");return;}
  a.busy=true;renderLogin();
  SB.auth.signUp({email:uEmail(a.id),password:a._pw,options:{data:{name:a.name,phone:a.phone,username:a.id}}}).then(function(r){
    if(r.error){a.busy=false;toast(/registered|exists/i.test(r.error.message)?"이미 있는 아이디예요":(r.error.message||"가입에 실패했어요"));renderLogin();return;}
    if(r.data.session){USER=r.data.user;SB.from("profiles").upsert({id:USER.id,nickname:a.name}).then(function(){});afterLogin();return;}
    /* 세션 미발급(관리자 설정에서 이메일 확인 켜짐) → 바로 로그인 시도 */
    SB.auth.signInWithPassword({email:uEmail(a.id),password:a._pw}).then(function(r2){
      a.busy=false;
      if(r2.error||!r2.data.session){toast("가입은 됐어요 · 로그인해 주세요");a.mode="login";renderLogin();return;}
      USER=r2.data.user;SB.from("profiles").upsert({id:USER.id,nickname:a.name}).then(function(){});afterLogin();
    });
  });
}
function doLogin(){
  readAuthFields();var a=S.auth;
  if(!a.id||!a._pw){toast("아이디와 비밀번호를 입력해 주세요");return;}
  a.busy=true;renderLogin();
  SB.auth.signInWithPassword({email:uEmail(a.id),password:a._pw}).then(function(r){
    a.busy=false;
    if(r.error||!r.data.session){toast("아이디 또는 비밀번호가 맞지 않아요");renderLogin();return;}
    USER=r.data.user;afterLogin();
  });
}
function afterLogin(){
  loadReference().then(loadUserData).then(function(){
    if(!P[S.pid])S.pid=Object.keys(P)[0]||null;
    S.editPid=null;S.detail=null;S.unit=null;
    S.tab=hasProj()?"home":"welcome";
    render();
  }).catch(function(e){console.error(e);toast("데이터를 불러오지 못했어요");S.auth={mode:"login",busy:false};renderLogin();});
}
/* 로그인 화면 전용 이벤트 */
document.addEventListener("click",function(e){
  if(e.target.id==="dologin"){doLogin();return;}
  if(e.target.id==="dosignup"){doSignup();return;}
  if(e.target.id==="tosignup"){readAuthFields();S.auth.mode="signup";S.auth.busy=false;renderLogin();return;}
  if(e.target.id==="tologin"){readAuthFields();S.auth.mode="login";S.auth.busy=false;renderLogin();return;}
  if(e.target.id==="signout"){signOut();return;}
});
document.addEventListener("keydown",function(e){
  if(e.key!=="Enter")return;
  if(["au_id","au_pw","au_name","au_phone"].indexOf(e.target.id)>-1){e.preventDefault();
    (S.auth&&S.auth.mode==="signup")?doSignup():doLogin();}
});

/* ---------- init ---------- */
function initApp(){
  if(!SB||!SB.auth){$("#view").innerHTML='<div class="wel"><div class="wel-badge">📡</div><h1 class="wel-h">연결에 실패했어요</h1><p class="wel-p">네트워크를 확인하고 새로고침해 주세요.</p></div>';var tb=document.querySelector(".tabbar");if(tb)tb.style.display="none";return;}
  SB.auth.getSession().then(function(r){
    var session=r.data&&r.data.session;
    if(session&&session.user){USER=session.user;afterLogin();}
    else{S.auth={mode:"login",busy:false};renderLogin();}
  });
  SB.auth.onAuthStateChange(function(ev){if(ev==="SIGNED_OUT"){USER=null;}});
}
initApp();
})();
