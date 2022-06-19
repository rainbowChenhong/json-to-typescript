const path = require("path");
const fs = require("fs");
const constant = require("./constant");
const REQUEST = constant.REQUEST;
const RESPONSE = constant.RESPONSE;

const utils = require("./utils");

// 当前命令运行的路径
const currentPath = process.cwd();

//获取config配置
const getConfig = (path) => {
  try {
    const data = fs.readFileSync(path, "utf8");
    return utils.generateMoudle("config-module", data);
  } catch (err) {
    console.error(err);
  }
};

const config = getConfig(path.join(currentPath, "./typing.config.js"));

const mockPath =
  path.join(currentPath, config.inPutDir) || path.join(currentPath, "mock");

const typingDir = config.outPutDir || path.join(currentPath, "typings");

const filePath = fs
  .readdirSync(mockPath)
  .map((fileName) => {
    return path.join(mockPath, fileName);
  })
  .filter(utils.isFile);

const allJsonData = {};

filePath.forEach((pt) => {
  const data = require(pt);
  Object.assign(allJsonData, data);
});

const start = () => {
  const requestRouteData = {};
  const responseRouteData = {};
  // 遍历数据
  Object.keys(allJsonData).forEach((key) => {
    const keys = [REQUEST, RESPONSE];
    // 每项基本信息
    const baseInfo = utils.getBaseInfoByKey(key, keys, typingDir);
    // 当前项
    const currentItem = allJsonData[key];
    // 请求
    const request = currentItem[REQUEST];
    const requestType = utils.handleType(request, "RootObject");

    if (!fs.existsSync(baseInfo)) {
      fs.mkdirSync(baseInfo.pathAll.request, {recursive: true});
    }
    const fileRequestPath = path.join(
      baseInfo.pathAll.request,
      baseInfo.fileName
    );
    fs.writeFile(fileRequestPath, requestType, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
    // 响应
    const response = currentItem[RESPONSE];
    const responseType = utils.handleType(response, "RootObject");
    if (!fs.existsSync(baseInfo.pathAll.response)) {
      fs.mkdirSync(baseInfo.pathAll.response, {recursive: true});
    }
    const fileResponsePath = path.join(
      baseInfo.pathAll.response,
      baseInfo.fileName
    );

    fs.writeFile(fileResponsePath, responseType, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
    // 请求和返回的route数据
    requestRouteData[key] = baseInfo.pathAll[`relative${REQUEST}`];
    responseRouteData[key] = baseInfo.pathAll[`relative${RESPONSE}`];
  });
  generateRouteFile(requestRouteData, REQUEST);
  generateRouteFile(responseRouteData, RESPONSE);
};
const generateRouteFile = (data, key) => {
  const requestRouteImportContent = utils.generateRoute(data);
  const requestRoutePath = path.join(currentPath, typingDir, key);
  if (!fs.existsSync(requestRoutePath)) {
    fs.mkdirSync(requestRoutePath, {recursive: true});
  }
  fs.writeFile(
    `${requestRoutePath}/route.ts`,
    requestRouteImportContent,
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
    }
  );
};
start();
