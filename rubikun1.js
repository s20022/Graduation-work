async(SENTENCE) => {
  require('dotenv').config({path: '.env.development.local'});
  const axios = require(`axios`);
  const APIKEY = process.env.GOO_API_KEY;
  const BASE_URL = `https://labs.goo.ne.jp/api/hiragana`;
  const OUTPU_TYPE = `hiragana`;

  const options = {
    method: 'post',
    url: BASE_URL,
    headers: {'Content-Type': `application/json`},
    data: {
        app_id: APIKEY,
        sentence:  SENTENCE,
        output_type: OUTPU_TYPE
    }
  };

  try {
    const res = await axios(options);
    return res.data;
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

}