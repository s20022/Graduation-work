"use strict";

const APIKEY = '892d5fb2f49d1c2a55ef52772ad2baa9779f506b54b81050e597bd5039b2d252';
const HIRAGANA_URL = 'https://labs.goo.ne.jp/api/hiragana';
const Decomposition_URL = 'https://labs.goo.ne.jp/api/morph'

//ひらがな変換する関数
async function conversionKANA(kanzihairetu,hiraganahairetu) {
  const OUTPUT_TYPE = `hiragana`;
  //let NconvW = hiraganahairetu;
  //戻ってきたテキスト
  let text = ''
  //変換後の配列
  let convertedArray = [];

  //let KanziJD = /([\u{3005}\u{3007}\u{303b}\u{3400}-\u{9FFF}\u{F900}-\u{FAFF}\u{20000}-\u{2FFFF}][\u{E0100}-\u{E01EF}\u{FE00}-\u{FE02}]?)/mu;
  let Kanzi = /^[\p{scx=Han}]+$/u;

  console.log(hiraganahairetu)

  for(let i = 0; i < hiraganahairetu.length; i++){
    if(hiraganahairetu[i].match(Kanzi)){

      const options = {
        method : 'post',
        url: HIRAGANA_URL,
        Headers: {'Content-Type': `application/json`},
        data:{
         app_id: APIKEY,
         sentence: hiraganahairetu[i],
         output_type: OUTPUT_TYPE
       }
     };
     try {
       const res = await axios(options);
       text = res.data.converted;
     } catch (e) {
       if (e.response) {
         const {response: {data, status, headers}} = e;
         console.log(data, status, headers);
       } else if (e.request) {
         console.log(e.request);
       } else {
         console.log('Error', e.message);
       }
     }
     convertedArray.push(text)
    }else{
      convertedArray.push(hiraganahairetu[i])
    }

  }


  const article = document.querySelector('article')

  
  console.log(kanzihairetu)
  console.log(convertedArray)
  for(let i = 0; i < kanzihairetu.length; i++){
    if(kanzihairetu[i].match(Kanzi)){
      const rubyhtml  = `
      <ruby>
      <rb>${kanzihairetu[i]}</rb>
      <rp>(</rp>
      <rt>${convertedArray[i]}</rt>
      <rp>)</rp>
      </ruby>
      `

      article.insertAdjacentHTML("afterbegin", rubyhtml)
    }
    else{
      const texthtml  = `

      <p>${convertedArray[i]}</p>
      
      `

      article.insertAdjacentHTML("afterbegin",texthtml)
      


    }
  }
} 

//要素分割する関数
async function elementDecomposition(kanziSentence){
  //入力された文字
  let DeText = kanziSentence;
  //APIから帰ってきた多重配列
  let SplitText = []
  //APIから必要なものだけを撮ってきた配列
  let convArray = [];
  //配列のコピー
  

  const options = {
    method : 'post',
    url: Decomposition_URL,
    Headers: {'Content-Type': `application/json`},

    data:{
        app_id: APIKEY,
        sentence: DeText,
        info_filter: 'form',
    }
  };
 
  try {
    const res = await axios(options);
    SplitText = res.data.word_list;
  } catch (e) {
    if (e.response) {
      const {response: {data, status, headers}} = e;
      console.log(data, status, headers);
    } else if (e.request) {
      console.log(e.request);
    } else {
      console.log('Error', e.message);
    }
  }



  for(let i = 0; i < SplitText[0,0].length; i++) {

    convArray.push(SplitText[0,0][0,i][0,0])

  }

  let CopyConvArray = convArray.concat()

  //console.log(SplitText)
  //console.log(convArray)
  //console.log(CopyConvArray)

  conversionKANA(convArray,CopyConvArray);
}



//ボタン押したときの処理
function butotnClick(){
  const textword  = document.getElementById('targetText').value

  //conversionKANA(textword)
  elementDecomposition(textword)
}

function removeElement(){
  document.getElementById('targetText').value = ''
}

//変換ボタン要素取得
let checkButton = document.getElementById('checkButton');

//変換ボタンの判定
checkButton.addEventListener('click', butotnClick);