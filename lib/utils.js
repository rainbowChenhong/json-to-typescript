const Module = require("node:module");
const path = require("path");
const fs = require("fs");

const METHOD = require("./constant").METHOD;

// 当前命令运行的路径
const currentPath = process.cwd();

// 根据code 生成module
const codeToMdule = (moduleName, code) => {
  const myModule = new Module(moduleName);
  myModule._compile(code, moduleName);
  return myModule.exports;
};

// 判断是否是文件
const isFile = (fileName) => {
  return fs.lstatSync(fileName).isFile();
};
// 处理key
const getBaseInfoByKey = (key, reqandresp, typingDir) => {
  const keys = key.split(" ");
  const pathAll = {};
  const method = METHOD[keys[0].toUpperCase()] || METHOD.GET;
  const keyUrl = keys[1] || "";
  const fileName =
    keyUrl.substring(keyUrl.lastIndexOf("/"), keyUrl.length) + ".ts";
  const keyPath = keyUrl.substring(0, keyUrl.lastIndexOf("/")) || "";
  reqandresp.forEach((dataPath) => {
    if (method && dataPath) {
      const ObjectKeyPath = path.join(
        currentPath,
        typingDir,
        dataPath,
        method,
        keyPath
      );
      let relativePath = path.relative(
        path.join(currentPath, typingDir, dataPath),
        path.join(ObjectKeyPath, fileName)
      );
      pathAll[dataPath] = ObjectKeyPath;
      pathAll[`relative${dataPath}`] = `./${relativePath}`;
    }
  });

  return {
    method: method,
    pathAll: pathAll,
    fileName: fileName,
    key: keyUrl,
  };
};
// 子类是否是数组
const isArraySubType = (data, name) => {
  if (data?.[0]) {
    const type = getBasetype(data[0]);
    if (type === "object") {
      return {
        type: `${name}[]`,
        muiltType: true,
      };
    }
    return {
      type: `${type}[]`,
      muiltType: false,
    };
  }
  return {
    type: "[]",
    muiltType: false,
  };
};
// 是否是array或对象
const isArrayOrIsObject = (data) => {
  const type = typeof data;
  if (type === "object") {
    if (data === null) {
      return false;
    }
    return true;
  }
  return false;
};
//获取基本类型
const getBasetype = (data) => {
  const type = typeof data;
  switch (type) {
    case "string":
      return "string";
    case "boolean":
      return "boolean";
    case "number":
      return "number";
    case "undefined":
      return "undefined";
    case "object": {
      return "object";
    }
  }
};
// 获取准确类型
const getType = (data) => {
  const type = typeof data;
  switch (type) {
    case "string":
      return "string";
    case "boolean":
      return "boolean";
    case "number":
      return "number";
    case "undefined":
      return "undefined";
    case "object": {
      if (data === null) {
        return null;
      }
      if (Array.isArray(data)) {
        return "Array";
      }
      return "object";
    }
  }
};

// 处理json类型 递归
const handleType = (data, name) => {
  if (data === undefined || data === null) {
    return `export type ${name}  = any;`;
  }

  let otherType = "";
  if (Array.isArray(data)) {
    arrayType = handleArrayType(data, name);
    type = arrayType.type;
    otherType = arrayType.otherType;
    return otherType;
  }
  const strList = Object.keys(data).map((item) => {
    let type = "null";
    let key = getKey(item, data[item]);
    if (isArrayOrIsObject(data[item]) && item && data[item]) {
      const otherName = item.replace(/^\S/, (s) => s.toUpperCase());
      type = otherName;
      if (Array.isArray(data[item])) {
        arrayType = handleArrayType(data[item], otherName);
        type = arrayType.type;
        otherType = arrayType.otherType;
      }
    } else {
      type =
        data[item] === null || data[item] === undefined
          ? "any"
          : getType(data[item]);
    }
    return `${key}: ${type};\n  `;
  });
  const str1 = `
${otherType}
export  interface ${name} {
  ${strList.join("")}
}`;
  return str1;
};
// 处理数组类型
const handleArrayType = (data, otherName) => {
  const subType = isArraySubType(data, otherName);
  let otherType = "";
  if (subType.muiltType) {
    otherType = handleType(data[0], otherName);
  }
  type = subType.type;
  return {
    type: type,
    otherType: otherType,
  };
};
// 处理ts的key
const getKey = (key, value) => {
  if (value == null || value === undefined) {
    return `${key}?`;
  }
  return key;
};
const generateRoute = (data) => {
  const IGetRoutes = [];
  const IPostRoutes = [];
  const IPutRoutes = [];
  const IDeleteRoutes = [];
  const importStr = Object.keys(data).map((orginalKey) => {
    const key = orginalKey.split(" ").filter((item) => item != "")[1];
    console.log(key, "key");
    const method = data[orginalKey].split("/")[1];
    const name = orginalKey.replace(" ", "").replace(/\/\S/g, (s) => {
      return s.toUpperCase().replace("/", "");
    });
    const interfaceStr = `"${key}":${name}`;
    switch (method) {
      case METHOD.GET:
        IGetRoutes.push(interfaceStr);
        break;
      case METHOD.POST:
        IPostRoutes.push(interfaceStr);
        break;
      case METHOD.DELETE:
        IDeleteRoutes.push(interfaceStr);
        break;
      case METHOD.PUT:
        IPutRoutes.push(interfaceStr);
        break;
    }
    return `import {RootObject as ${name}} from "${data[orginalKey]}";`;
  });
  // getRouteInterfaceContent = getRouteInterfaceByMethod(data);
  const list = [
    {key: "IGetRoutes", value: IGetRoutes},
    {key: "IPostRoutes", value: IPostRoutes},
    {key: "IDeleteRoutes", value: IDeleteRoutes},
    {key: "IPutRoutes", value: IPutRoutes},
  ];
  const fileContent = `
/* eslint-disable */
${importStr.join("\n")}

${list
  .map((item) => {
    return `export interface ${item.key} {
    ${item.value.join(";\n")}
    };`;
  })
  .join("\n")}
 `;
  console.log(fileContent, "fileContent");
  return fileContent;
};
const getRouteInterfaceByMethod = (data) => {
  return {
    IGetRoutes,
    IPostRoutes,
    IPutRoutes,
    IDeleteRoutes,
  };
};
const generateApi = () => {};

module.exports = {
  generateMoudle: codeToMdule,
  isFile: isFile,
  getBaseInfoByKey: getBaseInfoByKey,
  isArraySubType: isArraySubType,
  isArrayOrIsObject: isArrayOrIsObject,
  getType: getType,
  handleType: handleType,
  generateRoute: generateRoute,
};
//
// import {RootObject as GetApiApaasV1AppDesignList} from "./GET/api/apaas/v1/app/design/list";

// /* eslint-disable */
// /**
//  * 该文件由 yarn typings 命令自动生成，请勿手动修改
//  */
// import * as net from "./easy-request";

// export const getApiApaasV1AppDesignList = net.getApi(
//   "/api/apaas/v1/app/design/list"
// );
