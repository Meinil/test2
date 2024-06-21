/**
 * @description 同步将数据存储到本地
 * @param {string} key 本地缓存中指定的 key
 * @param {*} value 需要缓存的数据
 */
export const setStorage = (key, value) => {
  try {
    wx.setStorageSync(key, value);
  } catch (error) {
    console.error(`存储指定 ${key} 数据发生了异常`, error);
  }
}

/**
 * @description 同步从本地读取指定 key 的数据
 * @param {string} key 
 * @returns {*} 返回存储的数据，如果不存在则返回 undefined
 */
export const getStorage = (key) => {
  try {
    return wx.getStorageSync(key);
  } catch (error) {
    console.error(`读取指定 ${key} 数据发生了异常`, error);
    return undefined;
  }
}

/**
 * @description 同步从本地移除指定 key 的数据
 * @param {string} key 
 */
export const removeStorage = (key) => {
  try {
    wx.removeStorageSync(key);
  } catch (error) {
    console.error(`移除指定 ${key} 数据发生了异常`, error);
  }
}

/**
 * @description 同步从本地清空全部数据
 */
export const clearStorage = () => {
  try {
    wx.clearStorageSync();
  } catch (error) {
    console.error('清除，清空数据发生了异常', error);
  }
}

/**
 * @description 异步将数据存储到本地
 * @param {string} key 本地缓存中指定的 key
 * @param {*} data 需要缓存的数据
 * @returns {Promise} 返回 Promise 对象，表示存储操作的异步结果
 */
export const asyncSetStorage = (key, data) => {
  return new Promise((resolve, reject) => {
    wx.setStorage({
      key,
      data,
      success: (res) => {
        resolve(res);
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
}

/**
 * @description 异步从本地获取指定 key 的数据
 * @param {string} key 
 * @returns {Promise} 返回 Promise 对象，表示获取操作的异步结果
 */
export const asyncGetStorage = (key) => {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key,
      success: (res) => {
        resolve(res.data); // 返回存储的数据部分
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
}

/**
 * @description 异步从本地移除指定 key 的数据
 * @param {string} key 
 * @returns {Promise} 返回 Promise 对象，表示移除操作的异步结果
 */
export const asyncRemoveStorage = (key) => {
  return new Promise((resolve, reject) => {
    wx.removeStorage({
      key,
      success: (res) => {
        resolve(res);
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
}

/**
 * @description 异步从本地清空全部数据
 * @returns {Promise} 返回 Promise 对象，表示清空操作的异步结果
 */
export const asyncClearStorage = () => {
  return new Promise((resolve, reject) => {
    wx.clearStorage({
      success: (res) => {
        resolve(res);
      },
      fail: (error) => {
        reject(error);
      }
    });
  });
}
