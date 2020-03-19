// import urlConfig from './config.js'
const urlConfig = {
	baseUrl: 'http://127.0.0.1:3002'
}
const request = {}
const headers = {}

// method 请求类型 *大写
// url 请求地址
// data 参数
// power 请求头 传入格式：示例 {headers:{'Content-Type':'application/json;charset=UTF-8'}}
// domain 请求域名
export default request.globalRequest = (method, url, data, domain, power) => {
	headers["Content-Type"] = 'application/json;charset=UTF-8';
	headers['request-origin'] = 'WAP'
	if (power && power.headers) {
		Object.keys(power.headers).forEach((key) => {
			headers[key] = power.headers[key]
		})
	}
	if (domain) {
		url = urlConfig[domain] + url
	} else {
		url = urlConfig.baseUrl + url
	}
	
	return uni.request({
		url,
		method,
		data,
		dataType: 'json',
		header: headers,
	}).then(res => {
		if (res[1] && res[1].data) {
			const result = res[1].data;
			const code = res[1].code;
			if (code === 5223) {
				console.log('未登录')
				redirect("/");
			}
			return res[1]
		} else {
			throw res[1].data
		}
	}).catch(parmas => {
		switch (parmas.code) {
			case 401:
				uni.clearStorageSync()
				break
			default:
				uni.showToast({
					title: parmas.message,
					icon: 'none'
				})
				return Promise.reject(parmas);
				break
		}
	})
}