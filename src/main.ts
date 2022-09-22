import { GoogleSpreadsheet } from "google-spreadsheet"

function main(){
    // 投稿先のdiscodeのHooks
    const urlSendToDiscord: string =  getSheetValue("urls","name","discodeDev","url")
    // ステージ情報を取得
    const stageInfo = getStageInfo()
    
    // 投稿するステージの内容と設定
    const postPayload: object = makePostPayload(stageInfo)
    doPost(urlSendToDiscord, postPayload)
}

function getStageInfo(){
    const stageApiUrl: string = getSheetValue("urls","name","stageApi","url")
    const option: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions  = {
        method: "get",
        headers: { 'Content-type': "application/json" }
    }
    const stageInfo: GoogleAppsScript.URL_Fetch.HTTPResponse = UrlFetchApp.fetch(stageApiUrl, option);
    console.log(stageInfo.getContentText('UTF-8'))
    return stageInfo
}

function makePostPayload(stageInfo){
    const postPayload: object = {
        "content": "stageInfo!", // チャット本文
        "tts": false,  // ロボットによる読み上げ機能を無効化
        "embeds": [
                    {
                        "title": "今日のステージ" ,
                        // "thumbnail": {
                        //     "url": getSheetValue("stages","name","stageApi","url")
                        // },
                        "color": 5620992
                    }
                ]
    }
    return postPayload
}

function doPost(urlSendToDiscord, postPayload) {
    const param: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions  = {
        "method": "post",
        "headers": { 'Content-type': "application/json" },
        "payload": JSON.stringify(postPayload)
    }
    try {
        const result: GoogleAppsScript.URL_Fetch.HTTPResponse = UrlFetchApp.fetch(urlSendToDiscord, param);
        console.log(result)
    } catch(e) {
        // 例外エラー処理
        Logger.log('Error:')
        Logger.log(e)
        throw e;
    }
}

function a(){
    const discodeUrl = getValue("urls","name","discode","url")
    console.log(discodeUrl)
    const stageId = getValue("stages","id","10","name")
    console.log(stageId)
}

function getSheetValue(sheetName,searchColumnIndex, searchColumnValue, fetchValueColumn) {
    // スプレッドシート＆シートオブジェクトを取得
    const ss = SpreadsheetApp.openById("1vCAE8K7_I7IX9aBGlKSFnt3oNoZLoN4oX-T2eGuWQHs");
    var sheet = ss.getSheetByName(sheetName);
    var a = sheet.getLastColumn()
    console.log(a)

    // 検索したい列が何列目にあるか
    var range = sheet.getRange(1,1,1,a);
    var value = range.getValues();
    var index_num = value[0].indexOf(searchColumnIndex)
    console.log(index_num)
    const lastRow = sheet.getLastRow()
    console.log(lastRow)

    // 目的の値の行を検索
    const range2 = sheet.getRange(2,index_num+1,lastRow-1,1)
    var value = range2.getValues();
    value = value.flat()
    console.log("タイプは　"+ typeof(searchColumnValue))

    if (searchColumnIndex === "id" && typeof(searchColumnValue) === "string"){
        searchColumnValue = Number(searchColumnValue)
    }
    var c = value.indexOf(searchColumnValue)
    console.log("c"+c)


    // 取得したい列が何列目にあるか
    var range = sheet.getRange(1,1,1,a);
    var value = range.getValues();
    var urlIndex2 = value[0].indexOf(fetchValueColumn)
    console.log(urlIndex2)

    // 検索した値の行の取得したい列から値を取得
    const range3 = sheet.getRange(c+2,urlIndex2+1)
    var value = range3.getValue();
    console.log(value)

    return value
}
