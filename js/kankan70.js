/*
* @File     : kankan70.js
* @Author   : jade
* @Date     : 2023/12/29 15:33
* @Email    : jadehh@1ive.com
* @Software : Samples
* @Desc     :
*/
import {JadeLogging} from "../lib/log.js";
import {Result, SpiderInit} from "../lib/spider_object.js";
import {} from "../lib/crypto-js.js"
import * as Utils from "../lib/utils.js";
import {_, load, Uri} from "../lib/cat.js";
import {VodShort} from "../lib/vod.js";

const JadeLog = new JadeLogging(getAppName(), "DEBUG")
let result = new Result()
let CatOpenStatus = false
let ReconnectTimes = 0
let MaxReconnect = 5
const siteUrl = "http://cqdb6.com/";

function getHeader() {
    return {"User-Agent": Utils.CHROME, "Referer": siteUrl + "/"};
}

async function fetch(reqUrl, headers) {
    let uri = new Uri(reqUrl);
    let response = await req(uri.toString(), {
        method: "get",
        headers: headers,
        data: null,
    });
    if (response.code === 200 || response.code === undefined) {
        if (!_.isEmpty(response.content)) {
            return response.content
        } else {
            await JadeLog.error(`请求失败,请求url为:${uri},回复内容为空`)
            return null
        }
    } else {
        await JadeLog.error(`请求失败,请求url为:${uri},回复内容为${JSON.stringify(response)}`)
        return null
    }
}

function getName() {
    return "🍥┃70看看┃🍥"
}

function getAppName() {
    return "70看看"
}

async function init(cfg) {
    let obj = await SpiderInit(cfg)
    CatOpenStatus = obj.CatOpenStatus
    // 读取缓存
}

function parseVodShortListFromDoc($) {
    let vod_list = []
    let vod_elements = $("a.li-hv")
    for (const vod_element of vod_elements){
        let vodShort = new VodShort()
        let html = $(vod_element).html()
        vodShort.vod_id = vod_element.attribs["href"]
        vodShort.vod_name = vod_element.attribs["title"]
        vodShort.vod_pic = $(vod_element).find("img")[0].attribs["data-original"]
        vodShort.vod_remarks = $(vod_element).find("p.bz")[0].children[0].data
        vod_list.push(vodShort)
    }
    return vod_list
}

async function home(filter) {
    await JadeLog.info("正在解析首页类别", true)
    let html = await fetch(siteUrl, getHeader())
    let $ = load(html)
    let class_elemets = $("[class=index-list-l]")
    let Classes = []
    let vod_list = []
    for (const class_element of class_elemets) {
        let type_elements = $($(class_element).find("[class=\"h1 clearfix\"]")).find("a")
        let type_id = type_elements[0].attribs["href"]
        if (!_.isEmpty(type_id)) {
            let type_name = $(type_elements[1]).find("span")[0].children[0].data
            Classes.push({"type_name": type_name, "type_id": type_id})
        }
    }
    if (!CatOpenStatus){
        vod_list = parseVodShortListFromDoc($)
    }
    await JadeLog.debug(`首页类别内容为:${result.home(Classes,vod_list)}`)
    await JadeLog.info("首页类别解析完成", true)
    return result.home(Classes,vod_list)
}


async function homeVod() {
    let vod_list = []
    if (!CatOpenStatus) {
        await JadeLog.info("正在解析首页内容")
    }
    await JadeLog.debug(`首页内容为:${JSON.stringify({"list": vod_list})}`)
    return JSON.stringify({"list": vod_list})
}


async function category(tid, pg, filter, extend) {
    let url = ""
    await JadeLog.info(`正在解析分类页面,tid = ${tid},pg = ${pg},filter = ${filter},extend = ${JSON.stringify(extend)},url = ${url}`)
}


async function detail(id) {
    return JSON.stringify({})
}

async function play(flag, id, flags) {

    return JSON.stringify({});
}


async function search(wd, quick) {
    let url = ""
    await JadeLog.info(`正在解析搜索页面,关键词为 = ${wd},quick = ${quick},url = ${url}`)
}

export function __jsEvalReturn() {
    return {
        init: init,
        home: home,
        homeVod: homeVod,
        category: category,
        detail: detail,
        play: play,
        search: search,
    };
}