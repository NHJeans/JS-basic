/**
 * fetch를
 * */
function FetchUtils() {
  const GET = 'get';
  const POST = 'post';
  const PUT = 'put';
  const DELETE = 'delete';

  /**
   * application/json
   * @return application/json
   * */
  FetchUtils.prototype.APPLICATION_JSON = 'application/json';

  /**
   * Options 셋팅
   * @param method method
   * @param accept accept
   * @param authorization authorization
   * */
  FetchUtils.prototype.setupOptions = (method, accept, authorization) => {
    return {
      method,
      headers: {
        accept,
        Authorization: `Bearer ${authorization}`,
      },
    };
  };

  /**
   * fetch GET 요청
   * @param url fetch get Method로 요청보낼 url
   * @param unUseOptions 직접만든 Options or FetchUtils.setupOptions() 로 만들어진 콜백함수
   * */
  FetchUtils.prototype.get = (url, unUseOptions) => {
    let useOptions = typeof unUseOptions === 'function' ? unUseOptions(GET) : unUseOptions;
    return fetch(url, useOptions).then();
  };

  /**
   * fetch POST 요청
   * @param url fetch post Method로 요청보낼 url
   * @param unUseOptions 직접만든 Options or FetchUtils.setupOptions() 로 만들어진 콜백함수
   * */
  FetchUtils.prototype.post = (url, unUseOptions) => {
    let useOption = typeof unUseOptions === 'function' ? unUseOptions(POST) : unUseOptions;
    return fetch(url, useOption);
  };

  /**
   * fetch PUT 요청
   * @param url fetch put Method로 요청보낼 url
   * @param unUseOptions 직접만든 Options or FetchUtils.setupOptions() 로 만들어진 콜백함수
   * */
  FetchUtils.prototype.put = (url, unUseOptions) => {
    let useOption = typeof unUseOptions === 'function' ? unUseOptions(PUT) : unUseOptions;
    return fetch(url, useOption);
  };

  /**
   * fetch DELETE 요청
   * @param url fetch delete Method로 요청보낼 url
   * @param unUseOptions 직접만든 Options or FetchUtils.setupOptions() 로 만들어진 콜백함수
   * */
  FetchUtils.prototype.delete = (url, unUseOptions) => {
    let useOption = typeof unUseOptions === 'function' ? unUseOptions(DELETE) : unUseOptions;
    return fetch(url, useOption);
  };
}
