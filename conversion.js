
const APIKEY = '自身のAPIキー';
const HIRAGANA_URL = 'https://labs.goo.ne.jp/api/hiragana';
const Decomposition_URL = 'https://labs.goo.ne.jp/api/morph'
let Kanzi = /^[\p{scx=Han}]+$/u;

//ひらがな変換する関数
function conversionKANA(kanzihairetu,hiraganahairetu) {

  const article = document.querySelector('article')
  
  for(let i = 0; i < kanzihairetu.length; i++){
    if(kanzihairetu[i].match(Kanzi)){
      const rubyhtml  = `
      <ruby class = "RubyElementText">
      <rb class="ElementText">${kanzihairetu[i]}</rb>
      <rp>(</rp>
      <rt>${hiraganahairetu[i]}</rt>
      <rp>)</rp>
      </ruby>
      `

      article.insertAdjacentHTML("beforeend", rubyhtml)
    }
    else{
      const texthtml  = `
      <div class = "ElementText">
      <p class="ElementText">${hiraganahairetu[i]}</p>
      </div>
      
      `

      article.insertAdjacentHTML("beforeend",texthtml)
      


    }
  }
  console.log(article)
} 

//2  要素分解されたやつを受け取って、1次元配列化
function elementDecomposition(kanziSentence){

  //APIから帰ってきた多重配列
  let SplitText = []
  //APIから必要なものだけを撮ってきた配列
  let convArray = [];
  //引数から受け取る
    SplitText = kanziSentence;

  //多次元配列の数
 // console.log(SplitText)
  if (SplitText.length <= 1) {
    for(let i = 0; i < SplitText[0,0].length; i++) {
      convArray.push(SplitText[0,0][0,i][0,0])
    }
  }
  else{
    let SplitedText = [];
    SplitText.forEach((element) => {
      SplitedText = SplitedText.concat(element)
      console.log(SplitedText)
    });

    SplitedText.forEach((element) => {
      convArray = convArray.concat(element)
    })

  }

  let CopyConvArray = convArray.concat()

  console.log(convArray,CopyConvArray)

  //conversionKANA(convArray,CopyConvArray);

  DataHiraganaConvert(convArray,CopyConvArray)
}

//1  要素分解
function DataReception(TextElement){
  
  let data = {
    app_id: APIKEY,
    sentence: TextElement,
    info_filter: 'form',
}

fetch(Decomposition_URL, {
method: 'POST',
headers:{
  'Content-Type': 'application/json'
},
body: JSON.stringify(data),
})
.then((response) => response.json())
.then((data) => {
console.log('Success:',data.word_list);
elementDecomposition(data.word_list)
})
.catch((error) => {
console.error('Error:',error)
})

}


//3  1次元配列化した要素をひらがなにする
async function DataHiraganaConvert(OrHiraganaData,CpHiraganaData) {

  const OUTPUT_TYPE = `hiragana`;
  //APIから帰ってきたやつ
  let text = ''

  //変換後の配列
  let convertedArray = [];

  for(let i = 0; i < OrHiraganaData.length; i++){
    let data = {
      app_id: APIKEY,
      sentence: OrHiraganaData[i],
      output_type: OUTPUT_TYPE
    }
    if(OrHiraganaData[i].match(Kanzi)){
      await fetch(HIRAGANA_URL,{
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
      })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data.converted);
        text = data.converted;
        console.log(text)
      })
      .catch((error)=> {
        console.error('Error:', error);
      })
      convertedArray.push(text)
    }else{
      convertedArray.push(OrHiraganaData[i])
    }
  }

  console.log(text)
  console.log(CpHiraganaData,convertedArray)

  conversionKANA(CpHiraganaData,convertedArray)
}



//ボタン押したときの処理
function butotnClick(){
  const textword  = document.getElementById('targetText').value

  //conversionKANA(textword)
  DataReception(textword)
}

//変換ボタン要素取得
let checkButton = document.querySelector('#checkButton');

//変換ボタンの判定
checkButton.addEventListener('click', butotnClick);
