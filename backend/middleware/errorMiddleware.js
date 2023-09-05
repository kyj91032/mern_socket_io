const notFound = (req, res, next) => { // 경로가 존재하지 않을 때 에러 처리 미들웨어 함수.
    const error = new Error(`Not Found - ${req.originalUrl}`); // req.originalUrl: 요청한 url
    res.status(404);
    next(error); // 에러 처리 미들웨어 함수로 넘겨줌.
};

const errorHandler = (err, req, res, next) => { // 에러 처리 미들웨어 함수.
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // 상태코드 변경.
    res.status(statusCode);
    res.json({ // 에러 메시지를 json 형태로 반환.
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack, // production 모드가 아니면 err.stack을 사용.
    });
};

module.exports = { notFound, errorHandler };