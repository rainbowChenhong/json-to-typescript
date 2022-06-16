const Module = require('node:module');
const path = require('path');
const fs = require('fs');

const METHOD = require('./constant').METHOD;


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
const handlekey = (key, reqandresp,typingDir) => {
  const keys = key.split(' ');
  const pathAll = {};
  const method = METHOD[keys[0].toUpperCase()] || METHOD.GET;
  const fileName = keys[1].substring(keys[1].lastIndexOf('/'), keys[1].length) + '.ts';
  const keyPath = keys[1].substring(0, keys[1].lastIndexOf('/')) || '';
  reqandresp.forEach((dataPath) => {
    if (method && dataPath) {
      pathAll[dataPath] = path.join(currentPath, typingDir, dataPath, method, keyPath);
    }
  });
  return {
    method: method,
    pathAll: pathAll,
    fileName: fileName,
  };
};
// 子类是否是数组
const isArraySubType = (data, name) => {
    if (data?.[0]) {
      const type = getBasetype(data[0]);
      if (type === 'object') {
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
      type: '[]',
      muiltType: false,
    };
  };
  // 是否是array或对象
  const isArrayOrIsObject = (data) => {
    const type = typeof data;
    if (type === 'object') {
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
      case 'string':
        return 'string';
      case 'boolean':
        return 'boolean';
      case 'number':
        return 'number';
      case 'undefined':
        return 'undefined';
      case 'object': {
        return 'object';
      }
    }
  };
  // 获取准确类型
  const getType = (data) => {
    const type = typeof data;
    switch (type) {
      case 'string':
        return 'string';
      case 'boolean':
        return 'boolean';
      case 'number':
        return 'number';
      case 'undefined':
        return 'undefined';
      case 'object': {
        if (data === null) {
          return null;
        }
        if (Array.isArray(data)) {
          return 'Array';
        }
        return 'object';
      }
    }
  };

// 处理json类型 递归
  const handleType = (data, name) => {
    if (data === undefined || data === null) {
      return `export type ${name}  = any;`;
    }
  
    let otherType = '';
    if (Array.isArray(data)) {
      arrayType = handleArrayType(data, name);
      type = arrayType.type;
      otherType = arrayType.otherType;
      return otherType;
    }
    const strList = Object.keys(data).map((item) => {
      let type = 'null';
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
        type = data[item] === null || data[item] === undefined ? 'any' : getType(data[item]);
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
  
module.exports = {
  generateMoudle: codeToMdule,
  isFile: isFile,
  handlekey: handlekey,
  isArraySubType:isArraySubType,
  isArrayOrIsObject:isArrayOrIsObject,
  getType:getType,
  handleType:handleType
};
